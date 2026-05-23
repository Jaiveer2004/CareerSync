require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/user.model');
const Company = require('../models/company.model');
const Job = require('../models/job.model');
const Application = require('../models/application.model');
const Review = require('../models/review.model');
const ChatRoom = require('../models/chatRoom.model');
const Message = require('../models/message.model');
const OTP = require('../models/otp.model');
const LoginHistory = require('../models/loginHistory.model');

const userSeed = [
  {
    fullName: 'Jaiveer Singh',
    email: 'jaiveer.customer@careersync.in',
    password: 'Password@123',
    role: 'customer',
    phoneNumber: '+919876543210',
    isEmailVerified: true,
    accountStatus: 'active',
    skills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Node.js', 'Git'],
    experience: [
      {
        company: 'WebSolutions Tech',
        role: 'Frontend Developer',
        duration: 'June 2024 - Present',
        description: 'Designed and built accessible Next.js UI dashboards.'
      }
    ],
    education: [
      {
        school: 'IIT Madras',
        degree: 'B.Tech in Computer Science',
        year: '2024'
      }
    ]
  },
  {
    fullName: 'Aarav Nair',
    email: 'aarav.customer@careersync.in',
    password: 'Password@123',
    role: 'customer',
    phoneNumber: '+919812345678',
    isEmailVerified: true,
    accountStatus: 'active',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'Data Science', 'SQL'],
    experience: [
      {
        company: 'DataCore Analytics',
        role: 'Junior ML Engineer',
        duration: 'Aug 2023 - Present',
        description: 'Trained CNNs and optimized recommendation engine pipelines.'
      }
    ],
    education: [
      {
        school: 'BITS Pilani',
        degree: 'M.Sc in Mathematics',
        year: '2023'
      }
    ]
  },
  {
    fullName: 'Meera Kapoor',
    email: 'meera.partner@careersync.in',
    password: 'Password@123',
    role: 'partner',
    phoneNumber: '+919812300001',
    isEmailVerified: true,
    accountStatus: 'active',
  },
  {
    fullName: 'Rohan Iyer',
    email: 'rohan.partner@careersync.in',
    password: 'Password@123',
    role: 'partner',
    phoneNumber: '+919812300002',
    isEmailVerified: true,
    accountStatus: 'active',
  },
  {
    fullName: 'CareerSync Admin',
    email: 'admin@careersync.in',
    password: 'Password@123',
    role: 'admin',
    phoneNumber: '+919800000001',
    isEmailVerified: true,
    accountStatus: 'active',
  },
];

const companyProfiles = [
  {
    companyName: 'TechCorp Product Solutions',
    industry: 'Software Engineering',
    website: 'https://techcorp.io',
    bio: 'TechCorp is a leading scale-up designing SaaS tools for microservices and dashboard analytics.',
    companySize: '100-500 employees',
    isVerified: true,
    isOnline: true,
  },
  {
    companyName: 'DataNexus AI Labs',
    industry: 'Data Science & AI',
    website: 'https://datanexus.ai',
    bio: 'DataNexus builds enterprise LLM solutions and structured data analytics platforms.',
    companySize: '50-100 employees',
    isVerified: true,
    isOnline: true,
  }
];

const buildJobSeed = (companies) => [
  {
    company: companies[0]._id,
    partner: companies[0]._id, // Legacy compatibility
    title: 'Senior Frontend React Engineer',
    name: 'Senior Frontend React Engineer', // Legacy compatibility
    description: 'We are looking for a Senior Frontend React developer with expertise in Next.js, tailwind, and modern state managers.',
    category: 'Software Engineering',
    salaryRange: '₹18L - ₹24L',
    price: 1800000, // Legacy
    employmentType: 'Full-time',
    requiredSkills: ['React', 'Next.js', 'TypeScript', 'System Design'],
    experienceLevel: '3-5 years',
    location: 'Bengaluru / Remote',
    duration: 60,
    isActive: true,
  },
  {
    company: companies[0]._id,
    partner: companies[0]._id,
    title: 'Backend Node.js Developer',
    name: 'Backend Node.js Developer',
    description: 'Join our infrastructure team to design microservices and API gateways using Express and MongoDB.',
    category: 'Software Engineering',
    salaryRange: '₹14L - ₹20L',
    price: 1400000,
    employmentType: 'Full-time',
    requiredSkills: ['Node.js', 'Express', 'MongoDB', 'Microservices'],
    experienceLevel: '2-4 years',
    location: 'Remote',
    duration: 60,
    isActive: true,
  },
  {
    company: companies[1]._id,
    partner: companies[1]._id,
    title: 'Machine Learning Scientist',
    name: 'Machine Learning Scientist',
    description: 'We seek an ML Scientist experienced in training PyTorch models and building analytics data pipelines.',
    category: 'AI/Machine Learning',
    salaryRange: '₹22L - ₹30L',
    price: 2200000,
    employmentType: 'Full-time',
    requiredSkills: ['Python', 'PyTorch', 'Data Science', 'MLOps'],
    experienceLevel: '4+ years',
    location: 'Hybrid (Hyderabad)',
    duration: 90,
    isActive: true,
  },
  {
    company: companies[0]._id,
    partner: companies[0]._id,
    title: 'DevOps Platform Engineer',
    name: 'DevOps Platform Engineer',
    description: 'Build CI/CD pipelines, manage Kubernetes clusters, and automate cloud infrastructure using Terraform on AWS.',
    category: 'Infrastructure & Security',
    salaryRange: '₹16L - ₹22L',
    price: 1600000,
    employmentType: 'Full-time',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    experienceLevel: '3-5 years',
    location: 'Remote',
    duration: 60,
    isActive: true,
  },
  {
    company: companies[1]._id,
    partner: companies[1]._id,
    title: 'Data Engineer',
    name: 'Data Engineer',
    description: 'Optimize data warehouse pipelines, manage Spark clusters, and build scalable streaming ETLs.',
    category: 'Data Science & AI',
    salaryRange: '₹14L - ₹20L',
    price: 1400000,
    employmentType: 'Full-time',
    requiredSkills: ['Python', 'SQL', 'Spark', 'ETL', 'Hadoop'],
    experienceLevel: '2-4 years',
    location: 'Hyderabad / Hybrid',
    duration: 60,
    isActive: true,
  },
  {
    company: companies[0]._id,
    partner: companies[0]._id,
    title: 'Technical Product Manager',
    name: 'Technical Product Manager',
    description: 'Lead agile roadmaps, interface with core engineering teams, and define API/system specifications.',
    category: 'Product & Design',
    salaryRange: '₹20L - ₹28L',
    price: 2000000,
    employmentType: 'Full-time',
    requiredSkills: ['Product Strategy', 'Agile', 'Jira', 'SQL', 'APIs'],
    experienceLevel: '4-6 years',
    location: 'Bengaluru',
    duration: 90,
    isActive: true,
  },
  {
    company: companies[0]._id,
    partner: companies[0]._id,
    title: 'UI/UX Designer',
    name: 'UI/UX Designer',
    description: 'Create user journeys, design wireframes and high-fidelity interfaces using Figma, and perform user testing.',
    category: 'Product & Design',
    salaryRange: '₹10L - ₹15L',
    price: 1000000,
    employmentType: 'Full-time',
    requiredSkills: ['Figma', 'Prototyping', 'Wireframing', 'User Research'],
    experienceLevel: '2-4 years',
    location: 'Remote',
    duration: 60,
    isActive: true,
  },
  {
    company: companies[0]._id,
    partner: companies[0]._id,
    title: 'iOS Mobile Developer',
    name: 'iOS Mobile Developer',
    description: 'Build premium native mobile experiences using Swift, SwiftUI, and local storage synchronization patterns.',
    category: 'Software Engineering',
    salaryRange: '₹15L - ₹21L',
    price: 1500000,
    employmentType: 'Full-time',
    requiredSkills: ['Swift', 'SwiftUI', 'iOS', 'Git', 'CoreData'],
    experienceLevel: '3-5 years',
    location: 'Bengaluru',
    duration: 60,
    isActive: true,
  },
  {
    company: companies[0]._id,
    partner: companies[0]._id,
    title: 'Android Mobile Developer',
    name: 'Android Mobile Developer',
    description: 'Develop responsive android applications in Kotlin, working with REST APIs and Jetpack Compose.',
    category: 'Software Engineering',
    salaryRange: '₹14L - ₹20L',
    price: 1400000,
    employmentType: 'Full-time',
    requiredSkills: ['Kotlin', 'Android SDK', 'Java', 'Git', 'Jetpack Compose'],
    experienceLevel: '2-5 years',
    location: 'Remote',
    duration: 60,
    isActive: true,
  },
  {
    company: companies[1]._id,
    partner: companies[1]._id,
    title: 'Fullstack Go Developer',
    name: 'Fullstack Go Developer',
    description: 'Write ultra-performance backend systems in Go combined with light dashboard interfaces in React.',
    category: 'Software Engineering',
    salaryRange: '₹18L - ₹25L',
    price: 1800000,
    employmentType: 'Full-time',
    requiredSkills: ['Go', 'Docker', 'PostgreSQL', 'React', 'gRPC'],
    experienceLevel: '3-6 years',
    location: 'Remote',
    duration: 60,
    isActive: true,
  },
  {
    company: companies[0]._id,
    partner: companies[0]._id,
    title: 'Cloud Security Architect',
    name: 'Cloud Security Architect',
    description: 'Oversee cloud security posture, establish AWS IAM policies, run vulnerability scanning, and audit Terraform script configurations.',
    category: 'Infrastructure & Security',
    salaryRange: '₹24L - ₹32L',
    price: 2400000,
    employmentType: 'Full-time',
    requiredSkills: ['AWS', 'Terraform', 'Security Audit', 'IAM', 'CloudTrail'],
    experienceLevel: '5+ years',
    location: 'Hybrid (Bengaluru)',
    duration: 90,
    isActive: true,
  },
  {
    company: companies[1]._id,
    partner: companies[1]._id,
    title: 'Data Analyst',
    name: 'Data Analyst',
    description: 'Translate raw transactional data into clean business dashboards using SQL, Python, and Tableau visualizations.',
    category: 'Data Science & AI',
    salaryRange: '₹8L - ₹12L',
    price: 800000,
    employmentType: 'Full-time',
    requiredSkills: ['SQL', 'Tableau', 'Excel', 'Python', 'Statistics'],
    experienceLevel: '1-3 years',
    location: 'Hyderabad',
    duration: 60,
    isActive: true,
  },
  {
    company: companies[0]._id,
    partner: companies[0]._id,
    title: 'Frontend Angular Developer',
    name: 'Frontend Angular Developer',
    description: 'Maintain and optimize legacy client portals utilizing Angular, RxJS, and clean TypeScript code patterns.',
    category: 'Software Engineering',
    salaryRange: '₹10L - ₹14L',
    price: 1000000,
    employmentType: 'Full-time',
    requiredSkills: ['Angular', 'TypeScript', 'HTML5', 'RxJS', 'Sass'],
    experienceLevel: '2-4 years',
    location: 'Remote',
    duration: 60,
    isActive: true,
  },
  {
    company: companies[1]._id,
    partner: companies[1]._id,
    title: 'NLP Engineer',
    name: 'NLP Engineer',
    description: 'Train large language models, build sentiment analyzers, and integrate HuggingFace libraries into real-time services.',
    category: 'AI/Machine Learning',
    salaryRange: '₹20L - ₹28L',
    price: 2000000,
    employmentType: 'Full-time',
    requiredSkills: ['Python', 'HuggingFace', 'BERT', 'LLMs', 'PyTorch'],
    experienceLevel: '3+ years',
    location: 'Remote',
    duration: 90,
    isActive: true,
  },
  {
    company: companies[0]._id,
    partner: companies[0]._id,
    title: 'Cybersecurity Specialist',
    name: 'Cybersecurity Specialist',
    description: 'Conduct blackbox penetration tests, monitor SIEM security dashboards, and protect cloud assets against DDoS attempts.',
    category: 'Infrastructure & Security',
    salaryRange: '₹15L - ₹20L',
    price: 1500000,
    employmentType: 'Full-time',
    requiredSkills: ['Penetration Testing', 'SIEM', 'Linux', 'Python', 'Wireshark'],
    experienceLevel: '2-4 years',
    location: 'Remote',
    duration: 60,
    isActive: true,
  },
  {
    company: companies[0]._id,
    partner: companies[0]._id,
    title: 'SRE Specialist',
    name: 'SRE Specialist',
    description: 'Write alert systems using Prometheus/Grafana, manage high availability failovers, and write custom Python monitoring tools.',
    category: 'Infrastructure & Security',
    salaryRange: '₹18L - ₹24L',
    price: 1800000,
    employmentType: 'Full-time',
    requiredSkills: ['Linux', 'Python', 'Prometheus', 'Grafana', 'Docker'],
    experienceLevel: '3-5 years',
    location: 'Bengaluru',
    duration: 60,
    isActive: true,
  },
  {
    company: companies[0]._id,
    partner: companies[0]._id,
    title: 'Embedded Systems Engineer',
    name: 'Embedded Systems Engineer',
    description: 'Design and write ultra-reliable real-time firmware for hardware sensor grids using C and C++.',
    category: 'Software Engineering',
    salaryRange: '₹12L - ₹18L',
    price: 1200000,
    employmentType: 'Full-time',
    requiredSkills: ['C', 'C++', 'Microcontrollers', 'RTOS', 'I2C'],
    experienceLevel: '2-4 years',
    location: 'Bengaluru',
    duration: 60,
    isActive: true,
  },
  {
    company: companies[1]._id,
    partner: companies[1]._id,
    title: 'Quantitative Analyst',
    name: 'Quantitative Analyst',
    description: 'Write statistical algorithms, fit timeseries prediction parameters, and backtest strategies in Python/R.',
    category: 'Data Science & AI',
    salaryRange: '₹25L - ₹35L',
    price: 2500000,
    employmentType: 'Full-time',
    requiredSkills: ['Python', 'R', 'Statistics', 'Time Series', 'SQL'],
    experienceLevel: '3-6 years',
    location: 'Hybrid (Hyderabad)',
    duration: 90,
    isActive: true,
  },
  {
    company: companies[1]._id,
    partner: companies[1]._id,
    title: 'AI Research Engineer',
    name: 'AI Research Engineer',
    description: 'Evaluate novel transformer architectures, design customized diffusion model pipelines, and publish performance papers.',
    category: 'AI/Machine Learning',
    salaryRange: '₹28L - ₹38L',
    price: 2800000,
    employmentType: 'Full-time',
    requiredSkills: ['PyTorch', 'Deep Learning', 'Transformers', 'Python', 'CUDA'],
    experienceLevel: '4+ years',
    location: 'Remote',
    duration: 90,
    isActive: true,
  },
  {
    company: companies[0]._id,
    partner: companies[0]._id,
    title: 'Database Administrator',
    name: 'Database Administrator',
    description: 'Establish read-replicas, tune query execution speeds, monitor indexing memory footprints, and run backups on PG instances.',
    category: 'Infrastructure & Security',
    salaryRange: '₹12L - ₹16L',
    price: 1200000,
    employmentType: 'Full-time',
    requiredSkills: ['PostgreSQL', 'MySQL', 'Database Tuning', 'Linux', 'Bash'],
    experienceLevel: '3+ years',
    location: 'Remote',
    duration: 60,
    isActive: true,
  },
  {
    company: companies[1]._id,
    partner: companies[1]._id,
    title: 'Rust Backend Engineer',
    name: 'Rust Backend Engineer',
    description: 'Write ultra-performance backend microservices using Rust, Tokio async loop systems, and Docker compilation containers.',
    category: 'Software Engineering',
    salaryRange: '₹22L - ₹30L',
    price: 2200000,
    employmentType: 'Full-time',
    requiredSkills: ['Rust', 'WebAssembly', 'Tokio', 'Docker', 'PostgreSQL'],
    experienceLevel: '4+ years',
    location: 'Hyderabad',
    duration: 60,
    isActive: true,
  },
  {
    company: companies[0]._id,
    partner: companies[0]._id,
    title: 'Scrum Master',
    name: 'Scrum Master',
    description: 'Facilitate standups, run sprint retrospective reports, resolve blockers, and set up Jira workflows for 3 core product teams.',
    category: 'Product & Design',
    salaryRange: '₹12L - ₹16L',
    price: 1200000,
    employmentType: 'Full-time',
    requiredSkills: ['Agile', 'Scrum', 'Jira', 'Facilitation', 'Kanban'],
    experienceLevel: '3-5 years',
    location: 'Remote',
    duration: 60,
    isActive: true,
  },
  {
    company: companies[0]._id,
    partner: companies[0]._id,
    title: 'Product Marketing Manager',
    name: 'Product Marketing Manager',
    description: 'Establish copywriting tones, lead GTM launch plans, monitor conversion rates, and build SEO search footprints.',
    category: 'Product & Design',
    salaryRange: '₹11L - ₹16L',
    price: 1100000,
    employmentType: 'Full-time',
    requiredSkills: ['Copywriting', 'SEO', 'Analytics', 'Growth Marketing', 'GTM'],
    experienceLevel: '3-5 years',
    location: 'Bengaluru',
    duration: 60,
    isActive: true,
  },
  {
    company: companies[0]._id,
    partner: companies[0]._id,
    title: 'QA Automation Engineer',
    name: 'QA Automation Engineer',
    description: 'Write test specifications, build automated Cypress screen test flows, and run GitHub Actions automation runners.',
    category: 'Software Engineering',
    salaryRange: '₹9L - ₹13L',
    price: 900000,
    employmentType: 'Full-time',
    requiredSkills: ['Selenium', 'Cypress', 'Python', 'CI/CD', 'API Testing'],
    experienceLevel: '2-4 years',
    location: 'Remote',
    duration: 60,
    isActive: true,
  },
  {
    company: companies[0]._id,
    partner: companies[0]._id,
    title: 'Solutions Architect',
    name: 'Solutions Architect',
    description: 'Design macro enterprise systems, review system design patterns, design caching topologies, and outline server layouts.',
    category: 'Software Engineering',
    salaryRange: '₹26L - ₹34L',
    price: 2600000,
    employmentType: 'Full-time',
    requiredSkills: ['System Design', 'Microservices', 'AWS', 'Kubernetes', 'Redis'],
    experienceLevel: '6+ years',
    location: 'Hybrid (Bengaluru)',
    duration: 90,
    isActive: true,
  },
  {
    company: companies[1]._id,
    partner: companies[1]._id,
    title: 'AI Product Manager',
    name: 'AI Product Manager',
    description: 'Shape the roadmap of internal LLM products, trace user analytics, and set up model evaluation guidelines.',
    category: 'Product & Design',
    salaryRange: '₹22L - ₹30L',
    price: 2200000,
    employmentType: 'Full-time',
    requiredSkills: ['AI/ML Concepts', 'Product Vision', 'SQL', 'Agile', 'Jira'],
    experienceLevel: '4+ years',
    location: 'Hyderabad',
    duration: 90,
    isActive: true,
  },
  {
    company: companies[1]._id,
    partner: companies[1]._id,
    title: 'Computer Vision Engineer',
    name: 'Computer Vision Engineer',
    description: 'Develop real-time object tracking code, train neural networks on image sets, and deploy edge-inference targets.',
    category: 'AI/Machine Learning',
    salaryRange: '₹18L - ₹26L',
    price: 1800000,
    employmentType: 'Full-time',
    requiredSkills: ['OpenCV', 'PyTorch', 'Python', 'TensorFlow', 'C++'],
    experienceLevel: '3+ years',
    location: 'Remote',
    duration: 90,
    isActive: true,
  },
  {
    company: companies[0]._id,
    partner: companies[0]._id,
    title: 'Golang Microservices Developer',
    name: 'Golang Microservices Developer',
    description: 'Build ultra-fast backend microservices in Go, communicating via gRPC messages and managing locks in Redis.',
    category: 'Software Engineering',
    salaryRange: '₹16L - ₹22L',
    price: 1600000,
    employmentType: 'Full-time',
    requiredSkills: ['Go', 'gRPC', 'Docker', 'Redis', 'PostgreSQL'],
    experienceLevel: '3-5 years',
    location: 'Remote',
    duration: 60,
    isActive: true,
  },
  {
    company: companies[1]._id,
    partner: companies[1]._id,
    title: 'Site Reliability Engineer (SRE)',
    name: 'Site Reliability Engineer (SRE)',
    description: 'Set up high-availability microservices platforms, write custom shell tools, and run Kubernetes deployments.',
    category: 'Infrastructure & Security',
    salaryRange: '₹16L - ₹22L',
    price: 1600000,
    employmentType: 'Full-time',
    requiredSkills: ['AWS', 'Kubernetes', 'Ansible', 'Bash', 'Terraform'],
    experienceLevel: '3+ years',
    location: 'Hyderabad',
    duration: 60,
    isActive: true,
  }
];

const buildApplicationSeed = (customers, companies, jobs) => [
  {
    customer: customers[0]._id,
    partner: companies[0]._id,
    service: jobs[0]._id,
    bookingDate: new Date('2026-05-01T10:30:00.000Z'),
    status: 'Shortlisted',
    coverLetter: 'Dear Hiring Team, I am a senior React developer with B.Tech from IIT Madras. I have hands-on experience building Next.js dashboards.',
    notes: 'Shortlisted for initial technical systems interview.',
    totalPrice: 120000, // Legacy
    paymentStatus: 'paid'
  },
  {
    customer: customers[0]._id,
    partner: companies[0]._id,
    service: jobs[1]._id,
    bookingDate: new Date('2026-05-04T12:00:00.000Z'),
    status: 'Applied',
    coverLetter: 'Dear TechCorp, I have built Node.js Express servers. Please review my profile.',
    notes: 'Awaiting recruiter screening.',
    totalPrice: 120000,
    paymentStatus: 'paid'
  },
  {
    customer: customers[1]._id,
    partner: companies[1]._id,
    service: jobs[2]._id,
    bookingDate: new Date('2026-05-03T14:00:00.000Z'),
    status: 'Interview',
    coverLetter: 'Dear DataNexus team, I fit this role because I have M.Sc from BITS Pilani and have optimized PyTorch models.',
    notes: 'Interview slot scheduled for mock dataset coding.',
    totalPrice: 120000,
    paymentStatus: 'paid'
  }
];

const buildReviewSeed = (bookings, customers, partners) => [
  {
    booking: bookings[0]._id,
    customer: customers[0]._id,
    partner: partners[0]._id,
    rating: 5,
    comment: 'Excellent interview process and quick onboarding loop.',
  }
];

const buildChatAndMessages = async (bookings, customerUsers, partnerUsers) => {
  const chatRooms = await ChatRoom.insertMany([
    {
      bookingId: bookings[0]._id,
      participants: [
        { userId: customerUsers[0]._id, role: 'customer' },
        { userId: partnerUsers[0]._id, role: 'partner' },
      ],
      lastMessage: 'Awesome. I will prepare React performance questions for the discussion.',
      lastMessageAt: new Date('2026-05-02T12:00:00.000Z'),
      unreadCount: { customer: 0, partner: 0 },
    }
  ]);

  await Message.insertMany([
    {
      chatRoomId: chatRooms[0]._id,
      sender: { userId: partnerUsers[0]._id, role: 'partner' },
      content: 'We reviewed your resume and are excited to move forward. Let\'s schedule the first system design discussion.',
      type: 'text',
      isRead: true,
      readAt: new Date('2026-05-02T11:30:00.000Z'),
    },
    {
      chatRoomId: chatRooms[0]._id,
      sender: { userId: customerUsers[0]._id, role: 'customer' },
      content: 'Awesome. I will prepare React performance questions for the discussion.',
      type: 'text',
      isRead: true,
      readAt: new Date('2026-05-02T11:45:00.000Z'),
    }
  ]);
};

const buildOtpSeed = async (customerUser) => {
  await OTP.create({
    userId: customerUser._id,
    email: customerUser.email,
    otpHash: 'seeded_otp_hash_placeholder',
    type: 'login',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    isUsed: false,
    attempts: 0,
    maxAttempts: 3,
    ipAddress: '127.0.0.1',
    userAgent: 'CareerSync Seeder Script',
  });
};

const buildLoginHistorySeed = async (allUsers) => {
  const docs = allUsers.map((user, index) => ({
    userId: user._id,
    email: user.email,
    loginMethod: 'password',
    ipAddress: `203.122.5.${10 + index}`,
    userAgent: 'Mozilla/5.0 CareerSync Seeder',
    deviceType: index % 2 === 0 ? 'desktop' : 'mobile',
    browser: 'Chrome',
    os: 'Windows',
    location: {
      country: 'India',
      city: ['Bengaluru', 'Pune', 'Delhi', 'Mumbai', 'Hyderabad', 'Chennai'][index] || 'Remote',
      coordinates: {
        lat: 20.5937,
        lng: 78.9629,
      },
    },
    status: 'success',
    isSuspicious: false,
  }));

  await LoginHistory.insertMany(docs);
};

const resetAndSeed = async () => {
  try {
    await connectDB();

    console.log('Connected. Dropping database...');
    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped successfully.');

    console.log('Seeding users...');
    const users = await User.create(userSeed);
    const customerUsers = users.filter((user) => user.role === 'customer');
    const partnerUsers = users.filter((user) => user.role === 'partner');

    console.log('Seeding company profiles...');
    const companies = await Company.insertMany(
      companyProfiles.map((profile, index) => ({
        ...profile,
        user: partnerUsers[index]._id,
      }))
    );

    console.log('Seeding job postings...');
    const jobs = await Job.insertMany(buildJobSeed(companies));
    
    console.log('Seeding job applications...');
    const applications = await Application.insertMany(buildApplicationSeed(customerUsers, companies, jobs));

    console.log('Seeding reviews, chat, and activity data...');
    const reviews = buildReviewSeed(applications, customerUsers, companies);
    for (const review of reviews) {
      await Review.create(review);
    }

    await buildChatAndMessages(applications, customerUsers, partnerUsers);
    await buildOtpSeed(customerUsers[0]);
    await buildLoginHistorySeed(users);

    console.log('Seed complete. Summary:');
    console.log(`Users (Candidates/Recruiters/Admins): ${users.length}`);
    console.log(`Companies: ${companies.length}`);
    console.log(`Job Postings: ${jobs.length}`);
    console.log(`Applications: ${applications.length}`);
    console.log(`Reviews: ${reviews.length}`);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

resetAndSeed();
