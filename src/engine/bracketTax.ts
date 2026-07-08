import type { TaxBracket } from '../data/taxData2026';

/**
 * Computes progressive (marginal-bracket) tax owed on a given amount of
 * taxable income, using standard "fill each bracket before spilling into
 * the next" logic. This single function powers both the federal and the
 * California calculations — only the bracket table passed in differs.
 */
export function calculateBracketTax(taxableIncome: number, brackets: TaxBracket[]): number {
  if (taxableIncome <= 0) return 0;

  let tax = 0;
  for (const bracket of brackets) {
    const upper = bracket.max ?? Infinity;
    if (taxableIncome > bracket.min) {
      const incomeInBracket = Math.min(taxableIncome, upper) - bracket.min;
      tax += incomeInBracket * bracket.rate;
    } else {
      break;
    }
  }
  return tax;
}

/** Returns the marginal (top applicable) rate for a given taxable income. */
export function marginalRate(taxableIncome: number, brackets: TaxBracket[]): number {
  let rate = brackets[0]?.rate ?? 0;
  for (const bracket of brackets) {
    if (taxableIncome > bracket.min) {
      rate = bracket.rate;
    } else {
      break;
    }
  }
  return rate;
}
