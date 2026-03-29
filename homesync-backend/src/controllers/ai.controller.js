// src/controllers/ai.controller.js
const OpenAI = require('openai');

const generateChatResponse = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Configure the client to point to OpenRouter's API endpoint
    const openrouter = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "HomeSync",
      },
    });

    const completion = await openrouter.chat.completions.create({
      // Choose a reliable model from OpenRouter
      model: "google/gemini-2.5-flash",
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: "You are a friendly and helpful chatbot for HomeSync, a home and personal care services marketplace. Your goal is to help users find services. Available categories include home services like Plumbing, Cleaning, and Electrical, as well as personal care services like Facials and Spa treatments. Keep your answers concise. Avoid bold text and also avoid using (*) and other symbols. You can use emojis if you want to at particular places. If someone asks you irrelevant question which are not related to the reference (Household chores and other works related to humans), just provide a valid answer that I am trained to answer you questions based on the marketplace, try asking questions again in a humourous way."
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    const reply = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
    
    // Validate that we have a proper response
    if (!reply || reply.trim() === '') {
      return res.status(500).json({ message: "Empty response received from AI" });
    }
    
    res.status(200).json({ reply });

  } catch (error) {
    console.error("OpenRouter API error:", error);
    console.error("Error details:", error.response?.data || error.message);
    
    // Check if it's a rate limit error from OpenRouter's free tier
    const isRateLimit = error.status === 429 || error.message.includes('429');
    
    res.status(isRateLimit ? 429 : 500).json({ 
      message: isRateLimit 
        ? "AI is currently busy due to free tier rate limits. Please try again in a few moments." 
        : "Failed to get response from AI", 
      error: error.message 
    });
  }
};

module.exports = { generateChatResponse };

module.exports = { generateChatResponse };