/**
 * ============================================================================
 * U.S. FEDERAL + CALIFORNIA TAX LAW DATA — TAX YEAR 2026
 * ============================================================================
 * This is the ONLY file that should need to change when tax law updates
 * (new year, new brackets, new limits). Every number below is sourced from
 * a primary government publication. Update this file annually each time the
 * IRS / FTB / EDD / SSA release new figures (typically Oct–Jan for the
 * following tax year).
 *
 * Last verified: July 8, 2026
 *
 * PRIMARY SOURCES:
 * - IRS Revenue Procedure 2025-32 (federal brackets, standard deduction,
 *   EITC, CTC, AMT, fringe benefit & retirement limits for TY2026)
 *   https://www.irs.gov/pub/irs-drop/rp-25-32.pdf
 * - IRS Newsroom IR-2025-103 (Oct 9, 2025)
 *   https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026
 * - California EDD, "California Withholding Schedules for 2026" (Method B
 *   exact-calculation tables — the source for CA bracket thresholds below)
 *   https://edd.ca.gov/siteassets/files/pdf_pub_ctr/26methb.pdf
 * - California FTB, standard deduction confirmation for TY2025
 *   https://www.ftb.ca.gov/file/personal/tax-calculator-tables-rates.asp
 * - SSA / IRS, 2026 Social Security wage base ($184,500) — SSA.gov fact sheet
 * - California EDD, 2026 SDI rate (1.3%, no wage cap since 2024)
 *   https://edd.ca.gov/en/disability/Contribution_Rates_and_Benefit_Amounts/
 * - California DIR, minimum wage & AB 1228 fast-food minimum wage FAQ
 *   https://www.dir.ca.gov/dlse/Fast-Food-Minimum-Wage-FAQ.htm
 *
 * IMPORTANT CAVEAT ON CALIFORNIA BRACKETS:
 * The EDD publishes "withholding" rates that are the true marginal tax
 * rates multiplied by 1.1 (a built-in over-withholding buffer used only for
 * paycheck withholding). This file backs out the REAL statutory rates
 * (divide EDD's withholding % by 1.1) so this app calculates actual annual
 * tax LIABILITY, not just paycheck withholding. That is why you will not
 * see "1.1%, 2.2%, 4.4%..." here — you'll see the true "1%, 2%, 4%..."
 * bracket rates that also match the FTB Form 540 rate schedule.
 */

export type FilingStatus = 'single' | 'marriedJointly' | 'marriedSeparately' | 'headOfHousehold';

export interface TaxBracket {
  rate: number; // decimal, e.g. 0.10 = 10%
  min: number; // lower bound of bracket (inclusive), in taxable income $
  max: number | null; // upper bound (exclusive); null = no upper bound
}

export const TAX_YEAR = 2026;
export const DATA_LAST_UPDATED = '2026-07-08';

// ----------------------------------------------------------------------------
// FEDERAL — 2026 Ordinary Income Tax Brackets (Rev. Proc. 2025-32)
// ----------------------------------------------------------------------------
export const FEDERAL_BRACKETS: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { rate: 0.10, min: 0, max: 12400 },
    { rate: 0.12, min: 12400, max: 50400 },
    { rate: 0.22, min: 50400, max: 105700 },
    { rate: 0.24, min: 105700, max: 201775 },
    { rate: 0.32, min: 201775, max: 256225 },
    { rate: 0.35, min: 256225, max: 640600 },
    { rate: 0.37, min: 640600, max: null },
  ],
  marriedJointly: [
    { rate: 0.10, min: 0, max: 24800 },
    { rate: 0.12, min: 24800, max: 100800 },
    { rate: 0.22, min: 100800, max: 211400 },
    { rate: 0.24, min: 211400, max: 403550 },
    { rate: 0.32, min: 403550, max: 512450 },
    { rate: 0.35, min: 512450, max: 768700 },
    { rate: 0.37, min: 768700, max: null },
  ],
  marriedSeparately: [
    { rate: 0.10, min: 0, max: 12400 },
    { rate: 0.12, min: 12400, max: 50400 },
    { rate: 0.22, min: 50400, max: 105700 },
    { rate: 0.24, min: 105700, max: 201775 },
    { rate: 0.32, min: 201775, max: 256225 },
    { rate: 0.35, min: 256225, max: 384350 },
    { rate: 0.37, min: 384350, max: null },
  ],
  headOfHousehold: [
    { rate: 0.10, min: 0, max: 17700 },
    { rate: 0.12, min: 17700, max: 67450 },
    { rate: 0.22, min: 67450, max: 105700 },
    { rate: 0.24, min: 105700, max: 201775 },
    { rate: 0.32, min: 201775, max: 256200 },
    { rate: 0.35, min: 256200, max: 640600 },
    { rate: 0.37, min: 640600, max: null },
  ],
};

export const FEDERAL_STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 16100,
  marriedJointly: 32200,
  marriedSeparately: 16100,
  headOfHousehold: 24150,
};

// Additional standard deduction for age 65+ or blind (per qualifying condition)
export const FEDERAL_ADDITIONAL_DEDUCTION_65_OR_BLIND: Record<FilingStatus, number> = {
  single: 2050,
  marriedJointly: 1650, // per qualifying spouse
  marriedSeparately: 1650,
  headOfHousehold: 2050,
};

// OBBBA "senior deduction" 2025-2028: extra $6,000 per taxpayer 65+, on top of
// the above, phased out 6% of MAGI over $75,000 (single/HoH/MFS) / $150,000 (MFJ)
export const OBBBA_SENIOR_DEDUCTION = 6000;
export const OBBBA_SENIOR_DEDUCTION_PHASEOUT_START: Record<FilingStatus, number> = {
  single: 75000,
  marriedJointly: 150000,
  marriedSeparately: 75000,
  headOfHousehold: 75000,
};

// ----------------------------------------------------------------------------
// FICA (Federal Insurance Contributions Act) — Social Security + Medicare
// ----------------------------------------------------------------------------
export const SOCIAL_SECURITY_RATE = 0.062; // employee share
export const SOCIAL_SECURITY_WAGE_BASE_2026 = 184500; // SSA 2026 taxable maximum
export const MEDICARE_RATE = 0.0145; // employee share, no wage cap

// Additional Medicare Tax (ACA, IRC §3101(b)(2)) — NOT inflation indexed
export const ADDITIONAL_MEDICARE_RATE = 0.009;
export const ADDITIONAL_MEDICARE_THRESHOLD: Record<FilingStatus, number> = {
  single: 200000,
  marriedJointly: 250000,
  marriedSeparately: 125000,
  headOfHousehold: 200000,
};

// ----------------------------------------------------------------------------
// CALIFORNIA STATE INCOME TAX — 2026 (real statutory rates; see caveat above)
// ----------------------------------------------------------------------------
export const CA_BRACKETS: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { rate: 0.01, min: 0, max: 11079 },
    { rate: 0.02, min: 11079, max: 26264 },
    { rate: 0.04, min: 26264, max: 41452 },
    { rate: 0.06, min: 41452, max: 57542 },
    { rate: 0.08, min: 57542, max: 72724 },
    { rate: 0.093, min: 72724, max: 371479 },
    { rate: 0.103, min: 371479, max: 445771 },
    { rate: 0.113, min: 445771, max: 742953 },
    { rate: 0.123, min: 742953, max: null },
  ],
  marriedSeparately: [
    { rate: 0.01, min: 0, max: 11079 },
    { rate: 0.02, min: 11079, max: 26264 },
    { rate: 0.04, min: 26264, max: 41452 },
    { rate: 0.06, min: 41452, max: 57542 },
    { rate: 0.08, min: 57542, max: 72724 },
    { rate: 0.093, min: 72724, max: 371479 },
    { rate: 0.103, min: 371479, max: 445771 },
    { rate: 0.113, min: 445771, max: 742953 },
    { rate: 0.123, min: 742953, max: null },
  ],
  marriedJointly: [
    { rate: 0.01, min: 0, max: 22158 },
    { rate: 0.02, min: 22158, max: 52528 },
    { rate: 0.04, min: 52528, max: 82904 },
    { rate: 0.06, min: 82904, max: 115084 },
    { rate: 0.08, min: 115084, max: 145448 },
    { rate: 0.093, min: 145448, max: 742958 },
    { rate: 0.103, min: 742958, max: 891542 },
    { rate: 0.113, min: 891542, max: 1485906 },
    { rate: 0.123, min: 1485906, max: null },
  ],
  headOfHousehold: [
    { rate: 0.01, min: 0, max: 22173 },
    { rate: 0.02, min: 22173, max: 52530 },
    { rate: 0.04, min: 52530, max: 67716 },
    { rate: 0.06, min: 67716, max: 83805 },
    { rate: 0.08, min: 83805, max: 98990 },
    { rate: 0.093, min: 98990, max: 505208 },
    { rate: 0.103, min: 505208, max: 606251 },
    { rate: 0.113, min: 606251, max: 1010417 },
    { rate: 0.123, min: 1010417, max: null },
  ],
};

// Mental Health Services Tax (Prop. 63): flat +1% on taxable income over
// $1,000,000. This threshold is FIXED at $1M and does NOT double for
// joint filers — a well-known CA marriage-penalty quirk.
export const CA_MENTAL_HEALTH_TAX_RATE = 0.01;
export const CA_MENTAL_HEALTH_TAX_THRESHOLD = 1000000;

export const CA_STANDARD_DEDUCTION: Record<FilingStatus, number> = {
  single: 5706,
  marriedSeparately: 5706,
  marriedJointly: 11412,
  headOfHousehold: 11412,
};

// CA personal/senior exemption credit and dependent exemption credit
// (EDD 2026 Withholding Schedules, Table 4 — per allowance)
export const CA_EXEMPTION_CREDIT_PER_ALLOWANCE = 168.3;

// California State Disability Insurance (funds SDI + Paid Family Leave)
// No wage cap since Jan 1, 2024 — applies to ALL wages.
export const CA_SDI_RATE_2026 = 0.013;

// ----------------------------------------------------------------------------
// CALIFORNIA MINIMUM WAGE — 2026
// ----------------------------------------------------------------------------
export const CA_MINIMUM_WAGE_GENERAL_2026 = 16.9;
// AB 1228 "FAST Act": applies to fast-food chains with 60+ locations
// nationwide sharing a common brand (this covers Starbucks company-operated
// stores). Set April 1, 2024; unchanged through 2026 as of this writing —
// the Fast Food Council can adjust it, so always confirm at dir.ca.gov.
export const CA_FAST_FOOD_MINIMUM_WAGE_2026 = 20.0;
// Many healthcare facility workers have their own schedule phasing toward
// $25/hr through 2033 under SB 525 — varies by employer type/size.

// ----------------------------------------------------------------------------
// CALIFORNIA OVERTIME RULES (Labor Code §510, IWC Wage Orders)
// Applies to most non-exempt hourly employees, incl. retail/food-service.
// ----------------------------------------------------------------------------
export const CA_OVERTIME_DAILY_THRESHOLD = 8; // hrs/day → 1.5x
export const CA_OVERTIME_DAILY_DOUBLE_THRESHOLD = 12; // hrs/day → 2x
export const CA_OVERTIME_WEEKLY_THRESHOLD = 40; // hrs/week → 1.5x
export const CA_SEVENTH_DAY_THRESHOLD_HOURS = 8; // 7th consecutive day: 1.5x first 8h, 2x beyond

// ----------------------------------------------------------------------------
// RETIREMENT / PRE-TAX BENEFIT CONTRIBUTION LIMITS — 2026 (IRS)
// ----------------------------------------------------------------------------
export const LIMIT_401K_EMPLOYEE_DEFERRAL_2026 = 24500;
export const LIMIT_401K_CATCHUP_50PLUS_2026 = 8000;
export const LIMIT_401K_CATCHUP_60_TO_63_2026 = 11250; // SECURE 2.0 special catch-up
export const LIMIT_IRA_2026 = 7500;
export const LIMIT_HSA_SELF_2026 = 4400;
export const LIMIT_HSA_FAMILY_2026 = 8750;
export const LIMIT_HSA_CATCHUP_55PLUS_2026 = 1000;
export const LIMIT_HEALTH_FSA_2026 = 3400;
export const LIMIT_HEALTH_FSA_CARRYOVER_2026 = 680;
export const LIMIT_DEPENDENT_CARE_FSA_2026 = 5000; // not inflation-indexed by statute
export const LIMIT_COMMUTER_TRANSIT_MONTHLY_2026 = 340;

// ----------------------------------------------------------------------------
// EARNED INCOME TAX CREDIT — 2026 (federal)
// ----------------------------------------------------------------------------
export interface EitcRow {
  children: 0 | 1 | 2 | 3;
  maxCredit: number;
  incomeAtMaxCredit: number;
  phaseoutBeginsSingle: number;
  phaseoutEndsSingle: number;
  phaseoutBeginsJoint: number;
  phaseoutEndsJoint: number;
}

export const EITC_2026: EitcRow[] = [
  { children: 0, maxCredit: 664, incomeAtMaxCredit: 8680, phaseoutBeginsSingle: 10860, phaseoutEndsSingle: 19540, phaseoutBeginsJoint: 18140, phaseoutEndsJoint: 26820 },
  { children: 1, maxCredit: 4427, incomeAtMaxCredit: 13020, phaseoutBeginsSingle: 23890, phaseoutEndsSingle: 51593, phaseoutBeginsJoint: 31160, phaseoutEndsJoint: 58863 },
  { children: 2, maxCredit: 7316, incomeAtMaxCredit: 18290, phaseoutBeginsSingle: 23890, phaseoutEndsSingle: 58629, phaseoutBeginsJoint: 31160, phaseoutEndsJoint: 65899 },
  { children: 3, maxCredit: 8231, incomeAtMaxCredit: 18290, phaseoutBeginsSingle: 23890, phaseoutEndsSingle: 62974, phaseoutBeginsJoint: 31160, phaseoutEndsJoint: 70224 },
];

// ----------------------------------------------------------------------------
// CHILD TAX CREDIT — 2026 (federal, per OBBBA)
// ----------------------------------------------------------------------------
export const CTC_PER_CHILD_2026 = 2200;
export const CTC_REFUNDABLE_PORTION_2026 = 1700;
export const CTC_PHASEOUT_START: Record<FilingStatus, number> = {
  single: 200000,
  marriedJointly: 400000,
  marriedSeparately: 200000,
  headOfHousehold: 200000,
};

// ----------------------------------------------------------------------------
// CALIFORNIA EARNED INCOME TAX CREDIT (CalEITC) — most recently confirmed
// figures (TY2025, filed 2026). Verify current-year amount at ftb.ca.gov/caleitc
// each filing season — CA typically posts the new-year figure in early winter.
// ----------------------------------------------------------------------------
export const CALEITC_MAX_CREDIT = 3756;
export const CALEITC_INCOME_LIMIT = 32900;

// Retirement Savings Contributions Credit ("Saver's Credit") AGI limits 2026
// (approximate — indexed annually; confirm at irs.gov before relying on it)
export const SAVERS_CREDIT_AGI_LIMIT: Record<FilingStatus, number> = {
  single: 39500,
  marriedJointly: 79000,
  marriedSeparately: 39500,
  headOfHousehold: 59250,
};
