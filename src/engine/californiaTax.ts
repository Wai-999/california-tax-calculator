import {
  CA_BRACKETS,
  CA_STANDARD_DEDUCTION,
  CA_EXEMPTION_CREDIT_PER_ALLOWANCE,
  CA_MENTAL_HEALTH_TAX_RATE,
  CA_MENTAL_HEALTH_TAX_THRESHOLD,
  type FilingStatus,
} from '../data/taxData2026';
import { calculateBracketTax, marginalRate } from './bracketTax';

export interface CaliforniaTaxComputation {
  taxableIncome: number;
  regularTax: number;
  mentalHealthTax: number;
  totalTax: number;
  marginalRate: number;
}

/**
 * Computes California personal income tax: 9-bracket progressive schedule
 * (1%–12.3%) minus the personal exemption credit, PLUS the flat 1% Mental
 * Health Services Tax on taxable income over $1,000,000 (a threshold that
 * does not double for joint filers).
 */
export function computeCaliforniaTax(
  agi: number,
  filingStatus: FilingStatus,
  dependents: number,
): CaliforniaTaxComputation {
  const standardDeduction = CA_STANDARD_DEDUCTION[filingStatus];
  const taxableIncome = Math.max(0, agi - standardDeduction);
  const brackets = CA_BRACKETS[filingStatus];

  const grossTax = calculateBracketTax(taxableIncome, brackets);

  // Exemption credits: 1 for self, 1 more if married-joint (spouse), 1 per dependent.
  const selfAndSpouseAllowances = filingStatus === 'marriedJointly' ? 2 : 1;
  const exemptionCredit = (selfAndSpouseAllowances + dependents) * CA_EXEMPTION_CREDIT_PER_ALLOWANCE;
  const regularTax = Math.max(0, grossTax - exemptionCredit);

  const mentalHealthTax = Math.max(0, taxableIncome - CA_MENTAL_HEALTH_TAX_THRESHOLD) * CA_MENTAL_HEALTH_TAX_RATE;

  return {
    taxableIncome,
    regularTax,
    mentalHealthTax,
    totalTax: regularTax + mentalHealthTax,
    marginalRate: marginalRate(taxableIncome, brackets) + (taxableIncome > CA_MENTAL_HEALTH_TAX_THRESHOLD ? CA_MENTAL_HEALTH_TAX_RATE : 0),
  };
}
