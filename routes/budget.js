// routes/budget.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const { mapAgeToRange, mapSalaryToRange } = require('../utils/mapToRange');

const router = express.Router();

// Load budget data from JSON file
const budgetFilePath = path.join(__dirname, '..', 'data', 'age_salary_budget_data_from_18.json');
const budgetData = JSON.parse(fs.readFileSync(budgetFilePath, 'utf-8'));

// Route: /api/budget?age=24&salary=25000
router.get('/', (req, res) => {
  const age = parseInt(req.query.age);
  const salary = parseInt(req.query.salary);

  if (isNaN(age) || isNaN(salary)) {
    return res.status(400).json({ error: 'Age and salary must be numbers.' });
  }

  const ageRange = mapAgeToRange(age);
  const salaryRange = mapSalaryToRange(salary);

  if (!ageRange) {
    return res.status(400).json({ error: 'Age must be 18 or older.' });
  }

  const result = budgetData.find(
    item => item.ageRange === ageRange && item.salaryRange === salaryRange
  );

if (!result) {
  return res.status(404).json({ error: 'No budget found for this age and salary.' });
}

// Calculate actual budget using salary
const percentageBudget = result.budget;

const calculatedBudget = {
  expenses: {},
  savings: Math.round((percentageBudget.savings / 100) * salary),
  savingsSplit: {}
};

// Calculate expense amounts
for (const [category, percent] of Object.entries(percentageBudget.expenses)) {
  calculatedBudget.expenses[category] = Math.round((percent / 100) * salary);
}

// Split the savings amount
for (const [goalType, percent] of Object.entries(percentageBudget.savingsSplit)) {
  calculatedBudget.savingsSplit[goalType] = Math.round(
    (percent / 100) * calculatedBudget.savings
  );
}

res.json(calculatedBudget);

});

module.exports = router;
