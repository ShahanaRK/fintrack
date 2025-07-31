const express = require('express');
const router = express.Router();
const{createGoal,getGoals,getGoalById,updateGoal,deleteGoal,contributeToGoal,markGoalAsComplete}=
require('../controllers/goalController');
router.post('/',createGoal);
router.get('/',getGoals);
router.get('/:id',getGoalById);
router.put('/:id',updateGoal);
router.delete('/:id',deleteGoal);
router.post('/:id/contribute',contributeToGoal);
router.post('/:id/complete',markGoalAsComplete);
module.exports = router;
