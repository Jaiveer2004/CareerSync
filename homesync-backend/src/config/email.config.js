let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (error) {
  console.error('❌ Failed to load nodemailer:', error.message);
  console.warn('⚠️  Email functionality will be disabled.');
}

// Create reusable transporter with improved configuration
const createTransporter = () => {
  // Check if nodemailer is available
  if (!nodemailer || typeof nodemailer.createTransport !== 'function') {
    console.warn('⚠️  Nodemailer not available. Email functionality will be disabled.');
    return null;
  }

  // Skip email configuration if credentials are not provided
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('⚠️  Email credentials not configured. Email functionality will be disabled.');
    return null;
  }

  try {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error.message);
    return null;
  }
};

const transporter = createTransporter();

// Skip email verification entirely - it will be tested when actually sending emails
// This prevents blocking or slowing down app startup
if (transporter) {
  console.log('✅ Email transporter configured (not verified yet)');
} else {
  console.log('ℹ️  Email service disabled - app will continue without email functionality');
}

module.exports = transporter;