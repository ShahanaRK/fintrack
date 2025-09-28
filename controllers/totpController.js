const otplib = require('otplib');
const qrcode = require('qrcode');

// Generate a secret for a user during registration or 2FA setup
exports.generateSecret = async (req, res) => {
  const secret = otplib.authenticator.generateSecret();
  const otpauth = otplib.authenticator.keyuri(req.body.phone, 'Finora', secret);

  // Send the QR code data URL so user can scan with Google Authenticator
  const qrCodeImageUrl = await qrcode.toDataURL(otpauth);

  // Save secret securely in user profile in DB, here simplified as response
  // Store `secret` for later OTP verification tied to this user

  res.json({ secret, qrCodeImageUrl });
};

// Verify OTP provided by user
exports.verifyToken = (req, res) => {
  const { token, secret } = req.body; // secret retrieved from user record in real app

  try {
    const isValid = otplib.authenticator.check(token, secret);
    if (isValid) {
      res.json({ success: true, message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Verification error' });
  }
};
