const userModel = require('../models/userModel');

const awardPointsAndBadge = async (userId, pointsToAdd, badge) => {
  const user = await userModel.findById(userId);
  if (!user) throw new Error('User not found');

  user.points += pointsToAdd;

  if (badge) {
    user.badges.push({
      name: badge.name,
      description: badge.description,
      achievedOn: new Date()
    });
  }

  await user.save();
};

const getUserRewards = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    res.json({
      points: user.points,
      badges: user.badges
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rewards' });
  }
};

module.exports = { awardPointsAndBadge, getUserRewards };
