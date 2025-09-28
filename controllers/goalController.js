const Goal = require('../models/GoalModel');
  // Create a goal (userId comes from JWT/middleware)
exports.createGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const goal = await Goal.create({ ...req.body, userId }); // force the userId here
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all goals for logged-in user
exports.getGoals = async (req, res) => {
  try {
    const userId = req.user._id;
    const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific goal by ID for that user
exports.getGoalById = async (req, res) => {
  try {
    const userId = req.user._id;
    const goal = await Goal.findOne({ _id: req.params.id, userId });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.status(200).json(goal);
  } catch (error) {
    res.status(400).json({ error: 'Invalid goal ID' });
  }
};

// Update and Delete similarly: always match on userId: req.user._id
exports.updateGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedGoal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true }
    );
    if (!updatedGoal) {
      return res.status(404).json({ error: "Goal not found or unauthorized" });
    }
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.deleteGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const deletedGoal = await Goal.findOneAndDelete({ _id: req.params.id, userId });

    if (!deletedGoal) {
      return res.status(404).json({ error: "Goal not found or unauthorized" });
    }

    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.contributeToGoal = async (req, res) => {
  try {
    const userId = req.user._id;
    const goal = await Goal.findOne({ _id: req.params.id, userId });

    if (!goal) return res.status(404).json({ error: 'Goal not found or unauthorized' });

    goal.savedAmount += req.body.amount || 0;
    await goal.save();

    res.status(200).json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.markGoalAsComplete = async (req, res) => {
  try {
    const userId = req.user._id;
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId },
      { status: 'completed' },
      { new: true }
    );
    if (!goal) return res.status(404).json({ error: 'Goal not found or unauthorized' });

    res.status(200).json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
