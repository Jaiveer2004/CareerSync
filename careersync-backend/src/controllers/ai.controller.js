const OpenAI = require('openai');
const Job = require('../models/job.model');
const User = require('../models/user.model');
const Company = require('../models/company.model');
const { PDFParse } = require('pdf-parse');

// Initialize OpenRouter OpenAI Client
const getOpenRouterClient = () => {
  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "CareerSync",
    },
  });
};

// 1. General AI Chat Assistant (Job Board Focus)
const generateChatResponse = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Query active jobs and populate company
    const activeJobs = await Job.find({ isActive: true }).populate('company');
    const jobsContext = activeJobs.map(job => ({
      id: job._id.toString(),
      title: job.title,
      company: job.company?.companyName || 'Unknown Company',
      category: job.category,
      location: job.location,
      salaryRange: job.salaryRange,
      employmentType: job.employmentType,
      experienceLevel: job.experienceLevel,
      requiredSkills: job.requiredSkills.join(', '),
      description: job.description.substring(0, 150) + (job.description.length > 150 ? '...' : '')
    }));

    const openrouter = getOpenRouterClient();
    const completion = await openrouter.chat.completions.create({
      model: "google/gemini-2.5-flash",
      max_tokens: 450,
      messages: [
        {
          role: "system",
          content: `You are a friendly and helpful AI Recruiter chatbot for CareerSync, a Next-Gen Job Board and ATS matching platform. Your goal is to help candidates match with tech jobs, optimize profiles, prepare for interviews, and write cover letters.

You have direct, real-time access to the current database of active job listings on CareerSync.

Here are the active job listings currently in the database:
${JSON.stringify(jobsContext, null, 2)}

When users ask about jobs, recommend specific ones from the list above. Provide relevant details like Title, Company, Location, Salary Range, Experience Level, and required skills.
Always guide candidates to apply by using the job's ID to construct links like "/jobs/{id}". Format links as markdown links, e.g. [View Job Details](/jobs/{id}).
If a user is looking for a role that doesn't match any active job listings, politely let them know and suggest closest matches or general advice. Keep answers concise. Do not use asterisks or markdown bold if not necessary. Use emojis to make it lively.`
        },
        { role: "user", content: message }
      ],
    });

    const reply = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Chatbot API error:", error);
    res.status(500).json({ message: "Failed to get AI response", error: error.message });
  }
};

// 2. AI Resume Parser
const parseResume = async (req, res) => {
  try {
    let resumeText = '';

    // If PDF file is uploaded
    if (req.file) {
      const parser = new PDFParse({ data: req.file.buffer });
      const parsedPdf = await parser.getText();
      resumeText = parsedPdf.text;
      await parser.destroy();
    } else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    } else {
      return res.status(400).json({ message: "No resume file uploaded or text supplied." });
    }

    if (!resumeText.trim()) {
      return res.status(400).json({ message: "Resume content is empty." });
    }

    const openrouter = getOpenRouterClient();
    const completion = await openrouter.chat.completions.create({
      model: "google/gemini-2.5-flash",
      max_tokens: 700,
      messages: [
        {
          role: "system",
          content: "You are a specialized ATS resume parser. Extract skills, experience history, education history, and personal details from the resume raw text. Return the output as raw JSON matching the required schema. Do not enclose the output in markdown code blocks like ```json."
        },
        {
          role: "user",
          content: `Extract the details into a structured JSON with keys:
            {
              "fullName": "Name",
              "email": "Email",
              "phoneNumber": "Phone Number",
              "skills": ["Skill 1", "Skill 2"],
              "experience": [
                {
                  "company": "Company Name",
                  "role": "Job Title",
                  "duration": "Duration (e.g. 2021 - Present)",
                  "description": "Responsibilities summary"
                }
              ],
              "education": [
                {
                  "school": "University/College",
                  "degree": "Degree (e.g. B.Tech in Computer Science)",
                  "year": "Graduation Year (e.g. 2022)"
                }
              ]
            }
            
            RESUME TEXT:
            ${resumeText}`
        }
      ],
    });

    const parsedJsonText = completion.choices[0]?.message?.content?.trim() || '{}';
    let parsedData = {};

    try {
      // Strip any accidental markdown formatting if the model didn't follow the instruction
      const cleanedJsonText = parsedJsonText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      parsedData = JSON.parse(cleanedJsonText);
    } catch (parseError) {
      console.warn("Failed to parse JSON string directly. Returning raw text.", parsedJsonText);
      return res.status(500).json({ message: "Failed to parse resume into structured format", raw: parsedJsonText });
    }

    res.status(200).json({
      message: "Resume parsed successfully",
      data: parsedData,
      rawText: resumeText
    });

  } catch (error) {
    console.error("Resume parsing error:", error);
    res.status(500).json({ message: "Failed to parse resume", error: error.message });
  }
};

// 3. AI Cover Letter Generator (One-Click Apply Assistant)
const generateCoverLetter = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user._id;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    const openrouter = getOpenRouterClient();

    const candidateDetails = `
      Name: ${user.fullName}
      Skills: ${user.skills?.join(', ') || 'Not specified'}
      Bio: ${user.bio || 'Not specified'}
      Experience: ${JSON.stringify(user.experience || [])}
      Education: ${JSON.stringify(user.education || [])}
    `;

    const jobDetails = `
      Title: ${job.title}
      Company: ${job.company?.companyName || 'TechCorp'}
      Description: ${job.description}
      Required Skills: ${job.requiredSkills?.join(', ') || 'Not specified'}
    `;

    const completion = await openrouter.chat.completions.create({
      model: "google/gemini-2.5-flash",
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content: "You are an expert AI Career Coach. Write a tailored, concise cover letter (maximum 220 words) for the job. Address it to the hiring team. Do not use placeholders like [Your Name] since the candidate is already known. Make it directly ready to read/send."
        },
        {
          role: "user",
          content: `Write a customized cover letter for:
            CANDIDATE:
            ${candidateDetails}
            
            JOB POSTING:
            ${jobDetails}`
        }
      ],
    });

    const coverLetter = completion.choices[0]?.message?.content || "Dear Hiring Team,\n\nI am thrilled to apply...";
    res.status(200).json({ coverLetter });

  } catch (error) {
    console.error("Cover letter error:", error);
    res.status(500).json({ message: "Failed to generate cover letter", error: error.message });
  }
};

// 4. AI Job Description Generator
const generateJD = async (req, res) => {
  try {
    const { title, industry, experienceLevel } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Job title is required." });
    }

    const openrouter = getOpenRouterClient();
    const completion = await openrouter.chat.completions.create({
      model: "google/gemini-2.5-flash",
      max_tokens: 600,
      messages: [
        {
          role: "system",
          content: "You are a professional corporate recruiter. Generate a structured job description in JSON format based on the specified job title, industry, and experience level. Do not enclose the output in markdown code blocks like ```json."
        },
        {
          role: "user",
          content: `Create a job description JSON with keys:
            {
              "description": "Short summary of the role",
              "salaryRange": "A realistic salary range in INR Lakhs (e.g. ₹15L - ₹22L)",
              "requiredSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
              "experienceLevel": "Suggested experience years (e.g. 3-5 years)",
              "location": "Suggested location (e.g. Bengaluru or Remote)"
            }
            
            ROLE: ${title}
            INDUSTRY: ${industry || 'Software Engineering'}
            EXPERIENCE: ${experienceLevel || '3-5 years'}`
        }
      ],
    });

    const parsedJsonText = completion.choices[0]?.message?.content?.trim() || '{}';
    let parsedData = {};

    try {
      const cleanedJsonText = parsedJsonText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
      parsedData = JSON.parse(cleanedJsonText);
    } catch (parseError) {
      console.warn("Failed to parse JD JSON string directly.", parsedJsonText);
      return res.status(500).json({ message: "Failed to parse job description", raw: parsedJsonText });
    }

    res.status(200).json({
      message: "Job description generated successfully",
      data: parsedData
    });

  } catch (error) {
    console.error("AI JD generation error:", error);
    res.status(500).json({ message: "Failed to generate job description", error: error.message });
  }
};

module.exports = {
  generateChatResponse,
  parseResume,
  generateCoverLetter,
  generateJD
};