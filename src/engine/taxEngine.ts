import { calculateGrossPay } from './payCalculator';
import { computeFederalTax } from './federalTax';
import { computeCaliforniaTax } from './californiaTax';
import {
  calculateSocialSecurityTax,
  calculateMedicareTax,
  calculateAdditionalMedicareTax,
  calculateCaSdiTax,
} from './ficaTax';
import { estimateEitc, estimateChildTaxCredit } from './credits';
import type { CalculatorInputs, TaxResult, TaxLineItem } from './types';

/**
 * Runs the full pay -> tax -> net-pay pipeline for a given set of inputs.
 * This is the single entry point the UI calls; every sub-module above is a
 * small, independently testable pure function.
 */
export function runTaxEngine(inputs: CalculatorInputs): TaxResult {
  const gross = calculateGrossPay(inputs);
  const grossAnnual = gross.grossAnnual;

  const retirement401kAnnual = grossAnnual * (Math.max(0, inputs.retirement401kPercent) / 100);
  const healthInsuranceAnnual = Math.max(0, inputs.healthInsuranceMonthly) * 12;
  const hsaAnnual = Math.max(0, inputs.hsaMonthlyContribution) * 12;
  const otherPreTaxAnnual = Math.max(0, inputs.otherPreTaxMonthly) * 12;

  const section125Annual = healthInsuranceAnnual + hsaAnnual + otherPreTaxAnnual;
  const preTaxDeductionsAnnual = retirement401kAnnual + section125Annual;

  // Federal & FICA wage bases
  const federalTaxableWagesBeforeStdDeduction = Math.max(
    0,
    grossAnnual - retirement401kAnnual - healthInsuranceAnnual - hsaAnnual - otherPreTaxAnnual,
  );
  // FICA/SDI wages: reduced by Section 125 cafeteria items, but NOT by 401(k) —
  // traditional 401(k) deferrals are still subject to Social Security/Medicare/SDI.
  const ficaWages = Math.max(0, grossAnnual - healthInsuranceAnnual - hsaAnnual - otherPreTaxAnnual);

  // California quirk: CA does NOT allow pre-tax HSA contributions to escape
  // STATE income tax (one of only two states with this rule) — so HSA is
  // added back in for the CA taxable-wage base even though it's excluded federally.
  const caTaxableWagesBeforeStdDeduction = Math.max(
    0,
    grossAnnual - retirement401kAnnual - healthInsuranceAnnual - otherPreTaxAnnual,
  );

  const federal = computeFederalTax(federalTaxableWagesBeforeStdDeduction, inputs.filingStatus);
  const california = computeCaliforniaTax(caTaxableWagesBeforeStdDeduction, inputs.filingStatus, inputs.dependents);

  const socialSecurityTax = calculateSocialSecurityTax(ficaWages);
  const medicareTax = calculateMedicareTax(ficaWages);
  const additionalMedicareTax = calculateAdditionalMedicareTax(ficaWages, inputs.filingStatus);
  const caSdiTax = calculateCaSdiTax(ficaWages);

  const estimatedEitc = estimateEitc(grossAnnual, inputs.filingStatus, inputs.dependents);
  const estimatedCtc = estimateChildTaxCredit(federalTaxableWagesBeforeStdDeduction, inputs.filingStatus, inputs.dependents);

  const totalTax =
    federal.tax + california.totalTax + socialSecurityTax + medicareTax + additionalMedicareTax + caSdiTax;

  const netAnnual = grossAnnual - preTaxDeductionsAnnual - totalTax;

  const effectiveTaxRate = grossAnnual > 0 ? totalTax / grossAnnual : 0;

  const lineItems: TaxLineItem[] = [
    { key: 'gross', labelEn: 'Gross Pay', labelMy: 'စုစုပေါင်း ဝင်ငွေ (အခွန်မဖြတ်မီ)', annual: grossAnnual },
    { key: '401k', labelEn: '401(k) Contribution (pre-tax)', labelMy: 'ပင်စင်ကြေး ပါဝင်ငွေ (401k)', annual: -retirement401kAnnual },
    { key: 'health', labelEn: 'Health Insurance Premium (pre-tax)', labelMy: 'ကျန်းမာရေး အာမခံကြေး', annual: -healthInsuranceAnnual },
    { key: 'hsa', labelEn: 'HSA Contribution (pre-tax federal only)', labelMy: 'ကျန်းမာရေး စုငွေအကောင့် (HSA)', annual: -hsaAnnual },
    { key: 'other', labelEn: 'Other Pre-Tax Benefits (FSA/Commuter)', labelMy: 'အခြား အခွန်မဖြတ်မီ အကျိုးခံစားခွင့်', annual: -otherPreTaxAnnual },
    { key: 'federal', labelEn: 'Federal Income Tax', labelMy: 'ဖက်ဒရယ် ဝင်ငွေခွန်', annual: -federal.tax },
    { key: 'ca', labelEn: 'California State Income Tax', labelMy: 'ကယ်လီဖိုးနီးယား ပြည်နယ် ဝင်ငွေခွန်', annual: -california.totalTax },
    { key: 'ss', labelEn: 'Social Security Tax (6.2%)', labelMy: 'လူမှုဖူလုံရေးခွန် (Social Security)', annual: -socialSecurityTax },
    { key: 'medicare', labelEn: 'Medicare Tax (1.45%)', labelMy: 'မက်ဒီကဲခွန် (Medicare)', annual: -medicareTax },
    { key: 'addlMedicare', labelEn: 'Additional Medicare Tax (0.9%)', labelMy: 'ထပ်တိုး မက်ဒီကဲခွန်', annual: -additionalMedicareTax },
    { key: 'sdi', labelEn: 'CA State Disability Insurance (SDI, 1.3%)', labelMy: 'ကယ်လီဖိုးနီးယား မသန်စွမ်းအာမခံခွန် (SDI)', annual: -caSdiTax },
    { key: 'net', labelEn: 'Net Take-Home Pay', labelMy: 'လက်ခံရရှိမည့် အသားတင်ဝင်ငွေ', annual: netAnnual },
  ];

  return {
    gross,
    grossAnnual,
    preTaxDeductionsAnnual,
    federalTaxableIncome: federal.taxableIncome,
    stateTaxableIncome: california.taxableIncome,
    federalIncomeTax: federal.tax,
    californiaIncomeTax: california.totalTax,
    caMentalHealthTax: california.mentalHealthTax,
    socialSecurityTax,
    medicareTax,
    additionalMedicareTax,
    caSdiTax,
    totalTax,
    netAnnual,
    marginalFederalRate: federal.marginalRate,
    marginalCaRate: california.marginalRate,
    effectiveTaxRate,
    estimatedEitc,
    estimatedCtc,
    lineItems,
  };
}
