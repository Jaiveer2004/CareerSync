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
    const emailHost = process.env.EMAIL_HOST;
    const emailPort = Number(process.env.EMAIL_PORT || 587);
    const forceSecure = (process.env.EMAIL_SECURE || '').toLowerCase() === 'true';

    // Prefer explicit SMTP host/port when provided, otherwise fallback to Gmail service.
    const config = emailHost
      ? {
          host: emailHost,
          port: emailPort,
          secure: forceSecure || emailPort === 465,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
          connectionTimeout: 5000, // 5 seconds
          greetingTimeout: 5000,   // 5 seconds
          socketTimeout: 10000,    // 10 seconds
        }
      : {
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
          connectionTimeout: 5000, // 5 seconds
          greetingTimeout: 5000,   // 5 seconds
          socketTimeout: 10000,    // 10 seconds
        };

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

  if ((process.env.EMAIL_VERIFY_ON_STARTUP || '').toLowerCase() === 'true') {
    transporter
      .verify()
      .then(() => {
        console.log('✅ Email transporter connection verified successfully');
      })
      .catch((error) => {
        console.error('❌ Email transporter verification failed:', error.message);
      });
  }
} else {
  console.log('ℹ️  Email service disabled - app will continue without email functionality');
}

module.exports = transporter;