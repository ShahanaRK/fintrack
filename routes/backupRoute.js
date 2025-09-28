const express = require('express');
const router = express.Router();
const { saveBackup, getBackup } = require('../controllers/backupController');
const  protect  = require('../middleware/authMiddleware');

// POST save encrypted backup
router.post('/backup', protect, saveBackup);

// GET get encrypted backup
router.get('/backup', protect, getBackup);

module.exports = router;
