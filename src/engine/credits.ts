import { EITC_2026, CTC_PER_CHILD_2026, CTC_PHASEOUT_START, type FilingStatus } from '../data/taxData2026';

/**
 * Estimates the federal Earned Income Tax Credit using straight-line
 * interpolation between the phase-in, plateau, and phase-out points
 * published in Rev. Proc. 2025-32. This is an approximation of the IRS's
 * exact EIC table (which rounds in $50 income bands) — close enough for
 * planning purposes, not a substitute for the official EIC worksheet.
 */
export function estimateEitc(earnedIncome: number, filingStatus: FilingStatus, dependents: number): number {
  if (earnedIncome <= 0) return 0;
  const childBucket = Math.min(dependents, 3) as 0 | 1 | 2 | 3;
  const row = EITC_2026.find((r) => r.children === childBucket);
  if (!row) return 0;

  const isJoint = filingStatus === 'marriedJointly';
  const phaseoutBegins = isJoint ? row.phaseoutBeginsJoint : row.phaseoutBeginsSingle;
  const phaseoutEnds = isJoint ? row.phaseoutEndsJoint : row.phaseoutEndsSingle;

  if (earnedIncome <= row.incomeAtMaxCredit) {
    // Phase-in: credit rises proportionally from $0 to the max credit.
    return (earnedIncome / row.incomeAtMaxCredit) * row.maxCredit;
  }
  if (earnedIncome <= phaseoutBegins) {
    return row.maxCredit;
  }
  if (earnedIncome >= phaseoutEnds) {
    return 0;
  }
  const fractionRemaining = (phaseoutEnds - earnedIncome) / (phaseoutEnds - phaseoutBegins);
  return Math.max(0, row.maxCredit * fractionRemaining);
}

/**
 * Estimates the federal Child Tax Credit: $2,200/qualifying child in 2026,
 * phased out $50 per $1,000 of AGI above the threshold (unchanged phase-out
 * mechanics from the TCJA/OBBBA design).
 */
export function estimateChildTaxCredit(agi: number, filingStatus: FilingStatus, dependents: number): number {
  if (dependents <= 0) return 0;
  const maxCredit = dependents * CTC_PER_CHILD_2026;
  const phaseoutStart = CTC_PHASEOUT_START[filingStatus];
  if (agi <= phaseoutStart) return maxCredit;
  const excessThousands = Math.ceil((agi - phaseoutStart) / 1000);
  const reduction = excessThousands * 50;
  return Math.max(0, maxCredit - reduction);
}
