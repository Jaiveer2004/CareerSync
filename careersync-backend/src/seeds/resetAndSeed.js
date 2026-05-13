require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/user.model');
const ServicePartner = require('../models/servicePartner.model');
const Service = require('../models/service.model');
const Booking = require('../models/booking.model');
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
  },
  {
    fullName: 'Aarav Nair',
    email: 'aarav.customer@careersync.in',
    password: 'Password@123',
    role: 'customer',
    phoneNumber: '+919812345678',
    isEmailVerified: true,
    accountStatus: 'active',
  },
  {
    fullName: 'Priya Menon',
    email: 'priya.customer@careersync.in',
    password: 'Password@123',
    role: 'customer',
    phoneNumber: '+919812345679',
    isEmailVerified: true,
    accountStatus: 'active',
  },
  {
    fullName: 'Kunal Verma',
    email: 'kunal.customer@careersync.in',
    password: 'Password@123',
    role: 'customer',
    phoneNumber: '+919812345680',
    isEmailVerified: true,
    accountStatus: 'active',
  },
  {
    fullName: 'Nisha Reddy',
    email: 'nisha.customer@careersync.in',
    password: 'Password@123',
    role: 'customer',
    phoneNumber: '+919812345681',
    isEmailVerified: true,
    accountStatus: 'active',
  },
  {
    fullName: 'Aditya Kulkarni',
    email: 'aditya.customer@careersync.in',
    password: 'Password@123',
    role: 'customer',
    phoneNumber: '+919812345682',
    isEmailVerified: true,
    accountStatus: 'active',
  },
  {
    fullName: 'Sana Khan',
    email: 'sana.customer@careersync.in',
    password: 'Password@123',
    role: 'customer',
    phoneNumber: '+919812345683',
    isEmailVerified: true,
    accountStatus: 'active',
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
    fullName: 'Ananya Sharma',
    email: 'ananya.partner@careersync.in',
    password: 'Password@123',
    role: 'partner',
    phoneNumber: '+919812300003',
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

const partnerProfiles = [
  {
    bio: 'Senior frontend mentor helping engineers prepare for product company roles in India.',
    skillsAndExpertise: ['React', 'Next.js', 'System Design', 'Interview Prep'],
    experienceYears: 8,
    phoneNumber: '+919812300001',
    serviceAreas: ['Bengaluru', 'Hyderabad', 'Remote'],
    priceRange: 'standard',
    availability: 'weekdays',
    portfolio: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
        description: 'Led hiring mentorship for 120+ frontend engineers.',
      },
    ],
    isVerified: true,
    isOnline: true,
  },
  {
    bio: 'Backend and platform hiring specialist for fintech and SaaS teams.',
    skillsAndExpertise: ['Node.js', 'Microservices', 'Databases', 'Architecture'],
    experienceYears: 10,
    phoneNumber: '+919812300002',
    serviceAreas: ['Pune', 'Mumbai', 'Remote'],
    priceRange: 'premium',
    availability: 'flexible',
    portfolio: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
        description: 'Built hiring loops for scaling engineering teams.',
      },
    ],
    isVerified: true,
    isOnline: false,
  },
  {
    bio: 'Data and AI interview coach supporting career transitions into ML roles.',
    skillsAndExpertise: ['Python', 'Machine Learning', 'MLOps', 'Analytics'],
    experienceYears: 7,
    phoneNumber: '+919812300003',
    serviceAreas: ['Delhi NCR', 'Chennai', 'Remote'],
    priceRange: 'budget',
    availability: 'evenings',
    portfolio: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1551281044-8b18f2188d9a',
        description: 'Coached candidates into top analytics and AI teams.',
      },
    ],
    isVerified: true,
    isOnline: true,
  },
];

const buildServiceSeed = (partners) => [
  {
    partner: partners[0]._id,
    name: 'Frontend Engineer Role Match',
    description: 'Targeted matching and profile optimization for frontend product roles across India.',
    category: 'Software Engineering',
    price: 1800000,
    priceType: 'fixed',
    duration: 60,
    isActive: true,
  },
  {
    partner: partners[1]._id,
    name: 'Backend Engineer Hiring Track',
    description: 'End-to-end role advisory and interview prep for backend engineering opportunities.',
    category: 'Software Engineering',
    price: 2200000,
    priceType: 'fixed',
    duration: 90,
    isActive: true,
  },
  {
    partner: partners[2]._id,
    name: 'Data Scientist Career Sprint',
    description: 'Portfolio feedback, project roadmap, and mock interviews for data science roles.',
    category: 'Data Science',
    price: 2400000,
    priceType: 'fixed',
    duration: 90,
    isActive: true,
  },
  {
    partner: partners[1]._id,
    name: 'DevOps Interview Accelerator',
    description: 'Mentorship for cloud and DevOps hiring rounds in high-growth engineering teams.',
    category: 'DevOps',
    price: 2000000,
    priceType: 'fixed',
    duration: 75,
    isActive: true,
  },
  {
    partner: partners[0]._id,
    name: 'Product Management Transition Plan',
    description: 'Guided strategy to move into product roles with India market-focused case prep.',
    category: 'Product Management',
    price: 2600000,
    priceType: 'fixed',
    duration: 120,
    isActive: false,
  },
];

const buildBookingSeed = (customers, partners, services) => [
  {
    customer: customers[0]._id,
    partner: partners[0]._id,
    service: services[0]._id,
    bookingDate: new Date('2026-04-05T10:30:00.000Z'),
    address: {
      street: 'HSR Layout Sector 2',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560102',
    },
    status: 'completed',
    totalPrice: 1800000,
    paymentStatus: 'paid',
    notes: 'Focused on frontend architecture and system design rounds.',
  },
  {
    customer: customers[0]._id,
    partner: partners[1]._id,
    service: services[1]._id,
    bookingDate: new Date('2026-04-10T12:00:00.000Z'),
    address: {
      street: 'Baner Road',
      city: 'Pune',
      state: 'Maharashtra',
      postalCode: '411045',
    },
    status: 'pending',
    totalPrice: 2200000,
    paymentStatus: 'pending',
    notes: 'Awaiting interview assignment and backend challenge review.',
  },
  {
    customer: customers[1]._id,
    partner: partners[2]._id,
    service: services[2]._id,
    bookingDate: new Date('2026-04-08T14:00:00.000Z'),
    address: {
      street: 'DLF Phase 3',
      city: 'Gurugram',
      state: 'Haryana',
      postalCode: '122002',
    },
    status: 'completed',
    totalPrice: 2400000,
    paymentStatus: 'paid',
    notes: 'Resume calibration and ML case study deep dive.',
  },
  {
    customer: customers[1]._id,
    partner: partners[1]._id,
    service: services[3]._id,
    bookingDate: new Date('2026-04-15T09:00:00.000Z'),
    address: {
      street: 'Powai Lake Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400076',
    },
    status: 'confirmed',
    totalPrice: 2000000,
    paymentStatus: 'paid',
    notes: 'DevOps readiness session scheduled with mock troubleshooting.',
  },
];

const buildReviewSeed = (bookings, customers, partners) => [
  {
    booking: bookings[0]._id,
    customer: customers[0]._id,
    partner: partners[0]._id,
    rating: 5,
    comment: 'Excellent guidance for frontend interview rounds.',
  },
  {
    booking: bookings[2]._id,
    customer: customers[1]._id,
    partner: partners[2]._id,
    rating: 4,
    comment: 'Very useful suggestions for ML portfolio and role targeting.',
  },
];

const buildChatAndMessages = async (bookings, customerUsers, partnerUsers) => {
  const chatRooms = await ChatRoom.insertMany([
    {
      bookingId: bookings[0]._id,
      participants: [
        { userId: customerUsers[0]._id, role: 'customer' },
        { userId: partnerUsers[0]._id, role: 'partner' },
      ],
      lastMessage: 'Thanks, I will update my frontend portfolio tonight.',
      lastMessageAt: new Date('2026-04-05T12:00:00.000Z'),
      unreadCount: { customer: 0, partner: 1 },
    },
    {
      bookingId: bookings[2]._id,
      participants: [
        { userId: customerUsers[1]._id, role: 'customer' },
        { userId: partnerUsers[2]._id, role: 'partner' },
      ],
      lastMessage: 'Please share your updated case study by tomorrow.',
      lastMessageAt: new Date('2026-04-08T15:00:00.000Z'),
      unreadCount: { customer: 1, partner: 0 },
    },
  ]);

  await Message.insertMany([
    {
      chatRoomId: chatRooms[0]._id,
      sender: { userId: partnerUsers[0]._id, role: 'partner' },
      content: 'Great mock interview today. Focus on React performance scenarios.',
      type: 'text',
      isRead: true,
      readAt: new Date('2026-04-05T11:30:00.000Z'),
    },
    {
      chatRoomId: chatRooms[0]._id,
      sender: { userId: customerUsers[0]._id, role: 'customer' },
      content: 'Thanks, I will update my frontend portfolio tonight.',
      type: 'text',
      isRead: false,
    },
    {
      chatRoomId: chatRooms[1]._id,
      sender: { userId: partnerUsers[2]._id, role: 'partner' },
      content: 'Please share your updated case study by tomorrow.',
      type: 'text',
      isRead: false,
    },
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

    console.log('Seeding partner profiles...');
    const servicePartners = await ServicePartner.insertMany(
      partnerProfiles.map((profile, index) => ({
        ...profile,
        user: partnerUsers[index]._id,
      }))
    );

    console.log('Seeding INR-based services and bookings...');
    const services = await Service.insertMany(buildServiceSeed(servicePartners));
    const bookings = await Booking.insertMany(buildBookingSeed(customerUsers, servicePartners, services));

    console.log('Seeding reviews, chat, and activity data...');
    const reviews = buildReviewSeed(bookings, customerUsers, servicePartners);
    for (const review of reviews) {
      await Review.create(review);
    }

    await buildChatAndMessages(bookings, customerUsers, partnerUsers);
    await buildOtpSeed(customerUsers[0]);
    await buildLoginHistorySeed(users);

    console.log('Seed complete. Summary:');
    console.log(`Users: ${users.length}`);
    console.log(`Partners: ${servicePartners.length}`);
    console.log(`Services (INR): ${services.length}`);
    console.log(`Bookings (INR totalPrice): ${bookings.length}`);
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
