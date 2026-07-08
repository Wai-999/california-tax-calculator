import type { FilingStatus } from '../data/taxData2026';

export type PayBasis = 'hourly' | 'salary';
export type PayFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly' | 'annually';

export const PAY_PERIODS_PER_YEAR: Record<PayFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
  annually: 1,
};

/** One day's scheduled hours, used only in "advanced" California daily-overtime mode. */
export interface DailyHours {
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
  sun: number;
}

export interface CalculatorInputs {
  payBasis: PayBasis;

  // Hourly-basis inputs
  hourlyRate: number;
  hoursPerWeek: number;
  useAdvancedCaOvertime: boolean;
  dailyHours: DailyHours;

  // Salary-basis inputs
  annualSalary: number;

  // Shared
  payFrequency: PayFrequency;
  filingStatus: FilingStatus;
  dependents: number;

  // Pre-tax deductions (reduce taxable wages)
  retirement401kPercent: number; // % of gross pay contributed to traditional 401(k)
  healthInsuranceMonthly: number; // employee-paid premium, pre-tax (cafeteria plan)
  hsaMonthlyContribution: number;
  otherPreTaxMonthly: number; // FSA / commuter / other Section 125 items
}

export const DEFAULT_DAILY_HOURS: DailyHours = {
  mon: 6, tue: 6, wed: 0, thu: 6, fri: 6, sat: 6, sun: 0,
};

// A realistic default scenario: the user's own job (Starbucks barista, CA)
export const DEFAULT_INPUTS: CalculatorInputs = {
  payBasis: 'hourly',
  hourlyRate: 20.0,
  hoursPerWeek: 30,
  useAdvancedCaOvertime: false,
  dailyHours: DEFAULT_DAILY_HOURS,
  annualSalary: 65000,
  payFrequency: 'biweekly',
  filingStatus: 'single',
  dependents: 0,
  retirement401kPercent: 0,
  healthInsuranceMonthly: 0,
  hsaMonthlyContribution: 0,
  otherPreTaxMonthly: 0,
};

export interface GrossPayResult {
  regularHours: number;
  overtimeHours15x: number;
  overtimeHours2x: number;
  regularPay: number;
  overtimePay15x: number;
  overtimePay2x: number;
  grossWeekly: number;
  grossAnnual: number;
}

export interface TaxLineItem {
  key: string;
  labelEn: string;
  labelMy: string;
  annual: number;
}

export interface TaxResult {
  gross: GrossPayResult;
  grossAnnual: number;
  preTaxDeductionsAnnual: number;
  federalTaxableIncome: number;
  stateTaxableIncome: number;

  federalIncomeTax: number;
  californiaIncomeTax: number;
  caMentalHealthTax: number;
  socialSecurityTax: number;
  medicareTax: number;
  additionalMedicareTax: number;
  caSdiTax: number;

  totalTax: number;
  netAnnual: number;

  marginalFederalRate: number;
  marginalCaRate: number;
  effectiveTaxRate: number;

  estimatedEitc: number;
  estimatedCtc: number;

  lineItems: TaxLineItem[];
}
