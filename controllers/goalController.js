const Goal = require('../models/GoalModel');

// ✅ Create a new goal
exports.createGoal = async (req, res) => {
  try {
    if(!req.body.userId){
      return res.status(400).json({ error: " user ID is required"});
    }
    const goal = await Goal.create({ ...req.body, userId: req.body.userId });
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get all goals for the logged-in user
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.body.userId }).sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get a specific goal by ID
exports.getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.body.userId });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.status(200).json(goal);
  } catch (error) {
    res.status(400).json({ error: 'Invalid goal ID' });
  }
};

// ✅ Update a goal
exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.body.userId },
      req.body,
      { new: true }
    );
    if (!goal) return res.status(404).json({ error: 'Goal not found or unauthorized' });
    res.status(200).json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete a goal
exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.body.userId });
    if (!goal) return res.status(404).json({ error: 'Goal not found or unauthorized' });
    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Contribute to a goal
exports.contributeToGoal = async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Contribution amount must be greater than 0' });
  }

  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.body.userId });

    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    goal.savedAmount += amount;

    // Optionally check if goal is now complete
    if (goal.savedAmount >= goal.targetAmount) {
      goal.status = 'completed';
    }

    await goal.save();
    res.status(200).json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Mark goal as completed manually
exports.markGoalAsComplete = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.body.userId });

    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    goal.status = 'completed';
    await goal.save();
    res.status(200).json(goal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};