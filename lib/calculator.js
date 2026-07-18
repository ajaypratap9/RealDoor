import hudData from './hud-mtsp-2026.json';

/**
 * Deterministic math engine.
 * Never use an LLM for these calculations. 
 */
export function computeIncomeEligibility(householdSize, monthlyGrossIncome, payPeriod = 'monthly') {
  // Normalize to annualized income
  let multiplier = 12; // default monthly
  if (payPeriod.toLowerCase() === 'bi-weekly' || payPeriod.toLowerCase() === 'biweekly') multiplier = 26;
  if (payPeriod.toLowerCase() === 'weekly') multiplier = 52;
  
  const annualIncome = monthlyGrossIncome * multiplier;
  
  // Cap lookup at 8 people
  const sizeKey = householdSize > 8 ? "8" : householdSize.toString();
  const threshold = hudData.income_limits["60_percent_ami"][sizeKey]; 
  
  const result = annualIncome <= threshold ? "at_or_below_threshold" : "above_threshold";

  return {
    annual_income: annualIncome,
    threshold: threshold,
    result: result,
    formula: `monthly_gross_income * ${multiplier} compared to HUD MTSP limit for household size ${householdSize}`,
    effective_date: hudData.effective_date,
    metro: hudData.metro
  };
}
