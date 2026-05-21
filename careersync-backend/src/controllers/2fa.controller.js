const bcrypt = require('bcryptjs');

const speakeasy = require('speakeasy');

const qrcode = require('qrcode');

const User = require('../models/user.model');

const {
  encrypt,
  decrypt,
  hashWithBcrypt,
  compareBcrypt
} = require('../utils/crypto.utils');


const enable2FA = async (req, res) => {
  try {
    const userId = req.user._id

    // Generate a 2FA secret for the user with app name and issuer information
    const secret = speakeasy.generateSecret({
      name: `CareerSync (${req.user.email})`,
      issuer: 'CareerSync',
    });

    const encryptedSecret = encrypt(secret.base32);

    const backupCodes = [];
    const plainBackupCodes = [];

    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      plainBackupCodes.push(code);

      const codeHash = await hashWithBcrypt(code);
      backupCodes.push({ codeHash, used: false });
    }

    const user = await User.findByIdAndUpdate(userId, {
      twoFactorSecretEncrypted: encryptedSecret,
      twoFactorInitiated: true,
      backupCodes,
    }, { new: true }
    );

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);

    res.status(200).json({
      message: '2FA setup initiated',
      qrCode: qrCodeUrl,
      secret: secret.base32,
      backupCodes: plainBackupCodes,
    });


  } catch (error) {
    console.error('Enable 2FA error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}


const verify2FA = async (req, res) => {
  try {
    const { token } = req.body;

    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user.twoFactorInitiated) {
      return res.status(400).json({ message: '2FA not Enabled.' });
    }

    if (!user.twoFactorSecretEncrypted) {
      return res.status(400).json({ 
        message: '2FA secret not found. Please enable 2FA again.' 
      });
    }

    const decryptedSecret = decrypt(user.twoFactorSecretEncrypted);


    const verified = speakeasy.totp.verify({
      secret: decryptedSecret,
      encoding: 'base32',
      token,
      window: 2,
    });

    if (!verified) {
      return res.status(401).json({ message: 'Invalid 2FA token' });
    }

    user.twoFactorEnabled = true;

    await user.save();

    res.status(200).json({
      message: '2FA enabled successfully',
      twoFactorEnabled: true,
    });

  } catch (error) {
    console.error('Verify 2FA error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

const verify2FALogin = async (req, res) => {
  try {
    const { email, token: twoFactorToken } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.twoFactorEnabled) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    if (!user.twoFactorSecretEncrypted) {
      return res.status(400).json({ 
        message: '2FA secret not found. Please enable 2FA again.' 
      });
    }

    const decryptedSecret = decrypt(user.twoFactorSecretEncrypted);

    const verified = speakeasy.totp.verify({
      secret: decryptedSecret,
      encoding: 'base32',
      token: twoFactorToken,
      window: 2,
    });

    if (!verified) {
      return res.status(401).json({ message: 'Invalid 2FA token' });
    }

    user.lastLogin = new Date();
    await user.save();

    const jwt = require('jsonwebtoken');
    const authToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(200).json({
      message: '2FA verification successful',
      verified: true,
      token: authToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        twoFactorEnabled: true,
      },
    });

  } catch (error) {
    console.error('Verify 2FA login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const verifyBackupCode = async (req, res) => {
  try {
    const { email, backupCode } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.twoFactorEnabled) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    for (let i = 0; i < user.backupCodes.length; i++) {
      const bc = user.backupCodes[i];

      if (bc.used) continue;

      const isMatch = await compareBcrypt(backupCode, bc.codeHash);

      if (isMatch) {
        user.backupCodes[i].used = true;
        user.lastLogin = new Date();
        await user.save();

        const jwt = require('jsonwebtoken');
        const authToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
          expiresIn: '24h',
        });

        return res.status(200).json({
          message: 'Backup code verified successfully',
          verified: true,
          token: authToken,
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            twoFactorEnabled: true,
          },
        });
      }
    }

    res.status(401).json({ message: 'Invalid or used backup code' });

  } catch (error) {
    console.error('Verify backup code error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const disable2FA = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecretEncrypted = undefined;
    user.backupCodes = [];
    await user.save();

    res.status(200).json({
      message: '2FA disabled successfully',
    });

  } catch (error) {
    console.error('Disable 2FA error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  enable2FA,
  verify2FA,
  verify2FALogin,
  verifyBackupCode,
  disable2FA,
};
