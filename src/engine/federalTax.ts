import { FEDERAL_BRACKETS, FEDERAL_STANDARD_DEDUCTION, type FilingStatus } from '../data/taxData2026';
import { calculateBracketTax, marginalRate } from './bracketTax';

export interface FederalTaxComputation {
  taxableIncome: number;
  tax: number;
  marginalRate: number;
}

/**
 * Computes federal ordinary income tax using the standard deduction only
 * (no itemizing). This matches how the large majority of hourly/salary
 * wage earners actually file, and keeps the tool's assumptions transparent.
 */
export function computeFederalTax(agi: number, filingStatus: FilingStatus): FederalTaxComputation {
  const standardDeduction = FEDERAL_STANDARD_DEDUCTION[filingStatus];
  const taxableIncome = Math.max(0, agi - standardDeduction);
  const brackets = FEDERAL_BRACKETS[filingStatus];
  const tax = calculateBracketTax(taxableIncome, brackets);
  return {
    taxableIncome,
    tax,
    marginalRate: marginalRate(taxableIncome, brackets),
  };
}
