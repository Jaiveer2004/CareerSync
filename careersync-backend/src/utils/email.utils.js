const transporter = require('../config/email.config');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

/**
 * Send email using the configured transporter
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 * @returns {Promise<Object>} - Email send result
 */
const sendEmail = async (options) => {
  try {
    // Check if transporter is configured
    if (!transporter) {
      console.warn('⚠️  Email not sent: Email service is not configured');
      return { 
        success: false, 
        error: 'Email service not configured',
        messageId: null 
      };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"CareerSync" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || '',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    
    return { 
      success: true, 
      messageId: info.messageId 
    };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { 
      success: false, 
      error: error.message,
      messageId: null 
    };
  }
};

/**
 * Load email template from file
 * @param {string} templateName - Name of the template file (without .html)
 * @param {Object} data - Data to compile with template
 * @returns {string} - Compiled HTML
 */
const loadTemplate = (templateName, data) => {
  try {
    const templatePath = path.join(__dirname, '../emails', `${templateName}.html`);
    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateContent);
    return template(data);
  } catch (error) {
    console.error('Error loading email template:', error.message);
    return '';
  }
};

/**
 * Send verification email
 */
const sendVerificationEmail = async (to, token, userName) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const html = loadTemplate('verification-email', {
    userName,
    verificationLink,
    year: new Date().getFullYear(),
  });

  return sendEmail({
    to,
    subject: 'Verify Your Email - CareerSync',
    html,
  });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (to, token, userName) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const html = loadTemplate('password-reset', {
    userName,
    resetLink,
    year: new Date().getFullYear(),
  });

  return sendEmail({
    to,
    subject: 'Reset Your Password - CareerSync',
    html,
  });
};

/**
 * Send OTP login email
 */
const sendOTPEmail = async (to, otp, userName) => {
  const html = loadTemplate('otp-login', {
    userName,
    otp,
    year: new Date().getFullYear(),
  });

  return sendEmail({
    to,
    subject: 'Your OTP Code - CareerSync',
    html,
  });
};

module.exports = {
  sendEmail,
  loadTemplate,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOTPEmail,
};
