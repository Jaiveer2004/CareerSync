const User = require("../models/user.model");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const Booking = require('../models/booking.model');
const ServicePartner = require('../models/servicePartner.model');
const Service = require('../models/service.model');
const Review = require('../models/review.model');
const ChatRoom = require('../models/chatRoom.model');
const Message = require('../models/message.model');
const OTP = require('../models/otp.model');
const LoginHistory = require('../models/loginHistory.model');
const { generateVerificationToken, sendVerificationEmail } = require('../utils/otp.utils');
const { hashWithSHA256 } = require('../utils/crypto.utils');

// Helper function to generate a JWT
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role = 'customer' } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      if (userExists.isEmailVerified) {
        return res.status(409).json({ message: 'User with this email already exists' });
      } else {
        await User.findByIdAndDelete(userExists._id);
      }
    }

    const verificationToken = generateVerificationToken();
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const tokenHash = hashWithSHA256(verificationToken);
    const codeHash = hashWithSHA256(verificationCode);

    // 6-digit code
    const expiryHours = parseInt(process.env.EMAIL_VERIFICATION_EXPIRY_HOURS) || 24;
    const verificationExpiry = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

    // 2. Create new User: (password will be hashed by the pre-save hook in the model)
    const user = await User.create({
      fullName,
      email,
      password,
      role,
      isEmailVerified: false,
      accountStatus: 'pending',
      emailVerificationTokenHash: tokenHash,
      emailVerificationCodeHash: codeHash,
      emailVerificationExpiry: verificationExpiry,
    });

    const emailResult = await sendVerificationEmail(email, verificationCode, verificationToken, fullName);
    if (!emailResult?.success) {
      return res.status(500).json({
        message: 'Failed to send verification email. Please try again later.',
      });
    }

    res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.',
      email: user.email,
      userId: user._id,
      requiresVerification: true,
    });


  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const token = (req.body?.token || req.query?.token || '').toString().trim();
    const code = (req.body?.code || req.query?.code || '').toString().trim();

    if (!code || !token) {
      return res.status(400).json({ message: 'Verification token and code are required' });
    }

    const tokenHash = hashWithSHA256(token);
    const codeHash = hashWithSHA256(code);

    const user = await User.findOne({
      emailVerificationCodeHash: codeHash,
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpiry: { $gt: new Date() },
      isEmailVerified: false,
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired verification link. Please request a new verification email.'
      });
    }

    // Update user as verified
    user.isEmailVerified = true;
    user.accountStatus = 'active';
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationCodeHash = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save();

    // Generate JWT token
    const jwtToken = generateToken(user._id, user.role);

    res.status(200).json({
      message: 'Email verified successfully! You can now login.',
      token: jwtToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled || false
      },
    });


  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// NEW: Resend verification email
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, isEmailVerified: false });

    if (!user) {
      return res.status(404).json({
        message: 'User not found or already verified'
      });
    }

    // Generate new verification codes
    const verificationToken = generateVerificationToken();
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const tokenHash = hashWithSHA256(verificationToken);
    const codeHash = hashWithSHA256(verificationCode);

    const expiryHours = parseInt(process.env.EMAIL_VERIFICATION_EXPIRY_HOURS) || 24;
    const verificationExpiry = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

    // Update user
    user.emailVerificationTokenHash = tokenHash;
    user.emailVerificationCodeHash = codeHash;
    user.emailVerificationExpiry = verificationExpiry;
    await user.save();

    // Send email
    const emailResult = await sendVerificationEmail(email, verificationCode, verificationToken, user.fullName);
    if (!emailResult?.success) {
      return res.status(500).json({
        message: 'Failed to send verification email. Please try again later.',
      });
    }

    res.status(200).json({
      message: 'Verification email sent successfully!',
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email:
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'You need to Sign Up before login.' });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in.',
        requiresVerification: true,
        email: user.email,
      });
    }

    if (user.isLocked) {
      return res.status(423).json({
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
      });
    }

    // 2. Compare the entered password with the hashed password:
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await user.incLoginAttempts();
      return res.status(401).json({ message: 'Password is incorrect.' })
    }

    await user.resetLoginAttempts();

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Return response indicating 2FA is required
      return res.status(200).json({
        message: '2FA verification required',
        requires2FA: true,
        email: user.email,
      });
    }

    // 6. Update last login info
    user.lastLogin = new Date();
    user.lastLoginIP = req.ip;
    user.lastLoginDevice = req.headers['user-agent'];
    await user.save();

    // 3. Generate token and send responses:
    const token = generateToken(user._id, user.role);
    res.status(200).json({
      message: 'Login Successful',
      token,
      user: { 
        id: user._id, 
        fullName: user.fullName, 
        email: user.email, 
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled || false
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user;

    // Check if email is verified (for Google users, mark as verified)
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      user.accountStatus = 'active';
      await user.save();
    }

    const token = generateToken(user._id, user.role);
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectURL = `${frontendURL}/auth/callback?token=${token}&user=${encodeURIComponent(
      JSON.stringify({
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled || false,
      })
    )}`;

    res.redirect(redirectURL);
  } catch (error) {
    console.error('Google auth callback error:', error);
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendURL}/login?error=authentication_failed`);
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user._id;

    if (!password || !password.trim()) {
      return res.status(400).json({ message: 'Password is required to delete account.' });
    }

    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.password) {
      return res.status(400).json({
        message: 'This account does not have a local password. Please set a password first before deleting your account.'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // Remove partner-related data first to avoid dangling references.
    const partnerProfile = await ServicePartner.findOne({ user: userId }).select('_id');
    const partnerId = partnerProfile?._id;

    const customerBookings = await Booking.find({ customer: userId }).select('_id');
    const partnerBookings = partnerId
      ? await Booking.find({ partner: partnerId }).select('_id')
      : [];

    const bookingIds = [...customerBookings, ...partnerBookings].map((b) => b._id);

    const chatRooms = await ChatRoom.find({
      $or: [
        { bookingId: { $in: bookingIds } },
        { 'participants.userId': userId }
      ]
    }).select('_id');
    const chatRoomIds = chatRooms.map((room) => room._id);

    if (chatRoomIds.length > 0) {
      await Message.deleteMany({ chatRoomId: { $in: chatRoomIds } });
      await ChatRoom.deleteMany({ _id: { $in: chatRoomIds } });
    }

    await Booking.deleteMany({ customer: userId });
    await Review.deleteMany({ customer: userId });

    if (partnerId) {
      await Booking.deleteMany({ partner: partnerId });
      await Review.deleteMany({ partner: partnerId });
      await Service.deleteMany({ partner: partnerId });
      await ServicePartner.deleteOne({ _id: partnerId });
    }

    await OTP.deleteMany({ userId });
    await LoginHistory.deleteMany({ userId });
    await User.deleteOne({ _id: userId });

    res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleAuthCallback,
  verifyEmail,
  resendVerificationEmail,
  deleteAccount,
};
