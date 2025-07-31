// utils/mapToRange.js

function mapAgeToRange(age) {
  if (age >= 68) return "68+";
  if (age < 18) return null; // too young for budget planning
  const lower = Math.floor((age - 18) / 5) * 5 + 18;
  const upper = lower + 4;
  return `${lower}-${upper}`;
}

function mapSalaryToRange(monthlyIncome) {
  if (monthlyIncome <= 15000) return "0-15000";
  if (monthlyIncome <= 30000) return "15001-30000";
  if (monthlyIncome <= 50000) return "30001-50000";
  if (monthlyIncome <= 75000) return "50001-75000";
  if (monthlyIncome<= 100000) return "75001-100000";
  if (monthlyIncome <= 150000) return "100001-150000";
  return "150001+";
}

module.exports = { mapAgeToRange, mapSalaryToRange };
