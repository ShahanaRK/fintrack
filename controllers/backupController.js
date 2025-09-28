const BackupBlob = require('../models/backupBlobModel');

// Save encrypted backup
const saveBackup = async (req, res) => {
  const userId = req.user._id;
  const { encryptedBlob } = req.body;

  if (!encryptedBlob) {
    return res.status(400).json({ message: 'No backup data provided' });
  }

  try {
    let backup = await BackupBlob.findOne({ userId });

    if (backup) {
      backup.encryptedBlob = encryptedBlob;
      backup.updatedAt = Date.now();
      await backup.save();
    } else {
      await BackupBlob.create({ userId, encryptedBlob });
    }

    return res.json({ message: 'Backup saved successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to save backup' });
  }
};

// Get encrypted backup
const getBackup = async (req, res) => {
  const userId = req.user._id;

  try {
    const backup = await BackupBlob.findOne({ userId });

    if (!backup) {
      return res.status(404).json({ message: 'No backup found' });
    }

    return res.json({ encryptedBlob: backup.encryptedBlob, updatedAt: backup.updatedAt });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch backup' });
  }
};

module.exports = { saveBackup, getBackup };
