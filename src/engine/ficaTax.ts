import {
  SOCIAL_SECURITY_RATE,
  SOCIAL_SECURITY_WAGE_BASE_2026,
  MEDICARE_RATE,
  ADDITIONAL_MEDICARE_RATE,
  ADDITIONAL_MEDICARE_THRESHOLD,
  CA_SDI_RATE_2026,
  type FilingStatus,
} from '../data/taxData2026';

/**
 * FICA wages are gross wages, generally BEFORE traditional 401(k) deferrals
 * are excluded (401k reduces income tax wages but NOT Social Security/
 * Medicare wages) but AFTER pre-tax health/HSA/FSA (Section 125 cafeteria
 * plan) deductions, which do reduce FICA wages. This module accepts the
 * relevant wage base pre-computed by the engine so it stays a pure function.
 */
export function calculateSocialSecurityTax(ficaWages: number): number {
  const taxableWages = Math.min(Math.max(0, ficaWages), SOCIAL_SECURITY_WAGE_BASE_2026);
  return taxableWages * SOCIAL_SECURITY_RATE;
}

export function calculateMedicareTax(ficaWages: number): number {
  return Math.max(0, ficaWages) * MEDICARE_RATE;
}

export function calculateAdditionalMedicareTax(ficaWages: number, filingStatus: FilingStatus): number {
  const threshold = ADDITIONAL_MEDICARE_THRESHOLD[filingStatus];
  const excess = Math.max(0, ficaWages - threshold);
  return excess * ADDITIONAL_MEDICARE_RATE;
}

export function calculateCaSdiTax(sdiWages: number): number {
  // No wage cap since Jan 1, 2024 — applies to all wages.
  return Math.max(0, sdiWages) * CA_SDI_RATE_2026;
}
