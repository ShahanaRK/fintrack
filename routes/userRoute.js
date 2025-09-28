const express = require('express')
const { loginController, registerController,deleteController,getProfile } = require('../controllers/userController')
const protect = require('../middleware/authMiddleware');


const router = express.Router()
//login
router.post('/login',loginController)
//register
router.post('/register',registerController)
router.get('/profile', protect, getProfile);
//delete user
router.delete('/:id',deleteController)

module.exports = router;

//totp
const { generateSecret, verifyToken } = require('../controllers/totpController');
router.post('/totp/setup', generateSecret); // Generate secret and QR code URL
router.post('/totp/verify', verifyToken);   // Verify TOTP with user input

module.exports = router;
