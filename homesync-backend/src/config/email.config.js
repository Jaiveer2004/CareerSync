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
    const config = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_PORT === '465' || parseInt(process.env.EMAIL_PORT) === 465, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Set to false to avoid certificate issues in some environments
      },
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
      pool: true,
      maxConnections: 1, // Useful for free tier
    };

    // If using default gmail, using the service option is often more reliable
    if (!process.env.EMAIL_HOST || process.env.EMAIL_HOST.includes('gmail')) {
      config.service = 'gmail';
      delete config.host;
      delete config.port;
      delete config.secure;
    }

    return nodemailer.createTransport(config);
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