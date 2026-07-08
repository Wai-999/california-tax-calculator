import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { runTaxEngine } from '../engine/taxEngine';
import { DEFAULT_INPUTS, PAY_PERIODS_PER_YEAR, type CalculatorInputs, type PayBasis, type PayFrequency } from '../engine/types';
import type { FilingStatus } from '../data/taxData2026';
import { CA_MINIMUM_WAGE_GENERAL_2026, CA_FAST_FOOD_MINIMUM_WAGE_2026 } from '../data/taxData2026';
import { NumberField, SelectField, SegmentedControl, Toggle } from '../components/fields';
import { Card, ResultCard, InfoCallout, SectionHeading } from '../components/ui';
import BreakdownTable from '../components/BreakdownTable';
import { formatCurrency, formatPercent } from '../utils/format';

const STORAGE_KEY = 'ca-tax-calculator:inputs:v1';

function loadInputs(): CalculatorInputs {
  if (typeof window === 'undefined') return DEFAULT_INPUTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_INPUTS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_INPUTS, ...parsed, dailyHours: { ...DEFAULT_INPUTS.dailyHours, ...(parsed.dailyHours ?? {}) } };
  } catch {
    return DEFAULT_INPUTS;
  }
}

const DAY_ROWS: { key: keyof CalculatorInputs['dailyHours']; en: string; my: string }[] = [
  { key: 'mon', en: 'Mon', my: 'တနင်္လာ' },
  { key: 'tue', en: 'Tue', my: 'အင်္ဂါ' },
  { key: 'wed', en: 'Wed', my: 'ဗုဒ္ဓဟူး' },
  { key: 'thu', en: 'Thu', my: 'ကြာသပတေး' },
  { key: 'fri', en: 'Fri', my: 'သောကြာ' },
  { key: 'sat', en: 'Sat', my: 'စနေ' },
  { key: 'sun', en: 'Sun', my: 'တနင်္ဂနွေ' },
];

export default function Calculator() {
  const { t } = useLanguage();
  const [inputs, setInputs] = useState<CalculatorInputs>(loadInputs);
  const [view, setView] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  }, [inputs]);

  const result = useMemo(() => runTaxEngine(inputs), [inputs]);
  const divisor = view === 'monthly' ? 12 : 1;
  const paycheckDivisor = PAY_PERIODS_PER_YEAR[inputs.payFrequency];

  const patch = (partial: Partial<CalculatorInputs>) => setInputs((prev) => ({ ...prev, ...partial }));

  const wageWarning =
    inputs.payBasis === 'hourly' && inputs.hourlyRate > 0 && inputs.hourlyRate < CA_MINIMUM_WAGE_GENERAL_2026;

  return (
    <div>
      <SectionHeading
        eyebrow={t('California · 2026 Tax Year', 'ကယ်လီဖိုးနီးယား · ၂၀၂၆ အခွန်နှစ်')}
        title={t('Paycheck & Tax Calculator', 'လစာနှင့် အခွန်တွက်စက်')}
        description={t(
          'Enter your hourly rate or salary to see a real, itemized breakdown of federal tax, California state tax, Social Security, Medicare, and SDI — with monthly and annual views. Works for any California job, not just food service.',
          'သင့်နာရီစားလစာ သို့မဟုတ် လစာကို ထည့်သွင်းပြီး ဖက်ဒရယ်အခွန်၊ ကယ်လီဖိုးနီးယားပြည်နယ်ခွန်၊ Social Security၊ Medicare နှင့် SDI တို့ကို လစဉ်နှင့် နှစ်စဉ် အသေးစိတ်ပြပါမည်။ အလုပ်အမျိုးအစား မရွေး အသုံးပြုနိုင်ပါသည်။',
        )}
      />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
        {/* ---------------- INPUT COLUMN ---------------- */}
        <div className="space-y-6">
          <Card title={t('Your Job', 'သင့်အလုပ်')} subtitle={t('Hourly or salaried — pick what matches your paycheck.', 'နာရီစား သို့မဟုတ် လစာစား — သင့်လစာနှင့် ကိုက်ညီသည့်အတိုင်း ရွေးပါ။')}>
            <div className="space-y-4">
              <SegmentedControl<PayBasis>
                value={inputs.payBasis}
                onChange={(v) => patch({ payBasis: v })}
                options={[
                  { value: 'hourly', label: t('Hourly', 'နာရီစား') },
                  { value: 'salary', label: t('Salary', 'လစာစား') },
                ]}
              />

              {inputs.payBasis === 'hourly' ? (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <NumberField
                      label={t('Hourly Rate', 'နာရီစား လုပ်ခ')}
                      prefix="$"
                      step={0.25}
                      value={inputs.hourlyRate}
                      onChange={(v) => patch({ hourlyRate: v })}
                    />
                    {!inputs.useAdvancedCaOvertime && (
                      <NumberField
                        label={t('Hours per Week', 'တစ်ပတ်လျှင် အလုပ်ချိန်')}
                        suffix="hrs"
                        value={inputs.hoursPerWeek}
                        onChange={(v) => patch({ hoursPerWeek: v })}
                      />
                    )}
                  </div>

                  {wageWarning && (
                    <InfoCallout variant="warn">
                      {t(
                        `Heads up: $${inputs.hourlyRate}/hr is below California's 2026 general minimum wage of ${formatCurrency(CA_MINIMUM_WAGE_GENERAL_2026, { cents: true })}/hr. Covered fast-food chain employees (60+ locations nationally, e.g. Starbucks company-operated stores) must be paid at least ${formatCurrency(CA_FAST_FOOD_MINIMUM_WAGE_2026, { cents: true })}/hr.`,
                        `သတိပြုရန်- $${inputs.hourlyRate}/နာရီသည် ကယ်လီဖိုးနီးယား၏ ၂၀၂၆ ယေဘုယျအနိမ့်ဆုံးလုပ်ခ ${formatCurrency(CA_MINIMUM_WAGE_GENERAL_2026, { cents: true })}/နာရီ ထက် နည်းနေပါသည်။ Fast-food ကွင်းဆက်ဆိုင် (Starbucks အပါအဝင်) ဝန်ထမ်းများသည် အနည်းဆုံး ${formatCurrency(CA_FAST_FOOD_MINIMUM_WAGE_2026, { cents: true })}/နာရီ ရသင့်ပါသည်။`,
                      )}
                    </InfoCallout>
                  )}

                  <Toggle
                    checked={inputs.useAdvancedCaOvertime}
                    onChange={(v) => patch({ useAdvancedCaOvertime: v })}
                    label={t('Advanced: enter exact daily hours for precise California daily-overtime rules', 'အဆင့်မြင့်- ကယ်လီဖိုးနီးယား နေ့စဉ်အချိန်ပိုနည်းဥပဒေ တိကျစွာတွက်ရန် နေ့စဉ်အလုပ်ချိန် ထည့်ပါ')}
                  />

                  {inputs.useAdvancedCaOvertime && (
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                      <div className="grid grid-cols-7 gap-2">
                        {DAY_ROWS.map((d) => (
                          <div key={d.key}>
                            <span className="block text-center text-xs font-medium text-slate-500 mb-1">{t(d.en, d.my)}</span>
                            <input
                              type="number"
                              min={0}
                              max={24}
                              step={0.5}
                              value={inputs.dailyHours[d.key]}
                              onChange={(e) =>
                                patch({ dailyHours: { ...inputs.dailyHours, [d.key]: Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber } })
                              }
                              className="w-full rounded-md border border-slate-300 py-1.5 text-center text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-slate-500">
                        {t(
                          'Applies CA Labor Code §510: >8 hrs/day = 1.5×, >12 hrs/day = 2×, >40 hrs/week = 1.5×, and the 7th consecutive workday rule.',
                          'CA Labor Code §510 အတိုင်း- တစ်ရက်လျှင် ၈နာရီကျော် = 1.5×၊ ၁၂နာရီကျော် = 2×၊ တစ်ပတ် ၄၀နာရီကျော် = 1.5×၊ ဆက်တိုက်၇ရက်မြောက် စည်းမျဉ်းများ အသုံးပြုသည်။',
                        )}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <NumberField label={t('Annual Salary', 'နှစ်စဉ်လစာ')} prefix="$" step={500} value={inputs.annualSalary} onChange={(v) => patch({ annualSalary: v })} />
              )}

              <SelectField
                label={t('Pay Frequency', 'လစာထုတ်သည့်အကြိမ်')}
                value={inputs.payFrequency}
                onChange={(v) => patch({ payFrequency: v as PayFrequency })}
                options={[
                  { value: 'weekly', label: t('Weekly (52/yr)', 'အပတ်စဉ် (၅၂ကြိမ်/နှစ်)') },
                  { value: 'biweekly', label: t('Every 2 weeks (26/yr)', '၂ပတ်တစ်ကြိမ် (၂၆ကြိမ်/နှစ်)') },
                  { value: 'semimonthly', label: t('Twice a month (24/yr)', 'လတစ်ဝက် ၂ကြိမ် (၂၄ကြိမ်/နှစ်)') },
                  { value: 'monthly', label: t('Monthly (12/yr)', 'လစဉ် (၁၂ကြိမ်/နှစ်)') },
                  { value: 'annually', label: t('Annually (1/yr)', 'နှစ်စဉ် (၁ကြိမ်/နှစ်)') },
                ]}
              />
            </div>
          </Card>

          <Card title={t('Filing Details', 'ဖိုင်လင်ခွဲခြားမှု')}>
            <div className="grid sm:grid-cols-2 gap-4">
              <SelectField
                label={t('Filing Status', 'ဖိုင်လင် အခြေအနေ')}
                value={inputs.filingStatus}
                onChange={(v) => patch({ filingStatus: v as FilingStatus })}
                options={[
                  { value: 'single', label: t('Single', 'တစ်ကိုယ်တည်း') },
                  { value: 'marriedJointly', label: t('Married Filing Jointly', 'အိမ်ထောင်သည် (ပူးတွဲဖိုင်လင်)') },
                  { value: 'marriedSeparately', label: t('Married Filing Separately', 'အိမ်ထောင်သည် (သီးခြားဖိုင်လင်)') },
                  { value: 'headOfHousehold', label: t('Head of Household', 'အိမ်ထောင်ဦးစီး') },
                ]}
              />
              <NumberField
                label={t('Dependents (qualifying children)', 'မှီခိုသူများ (အရည်အချင်းပြည့်ကလေးများ)')}
                value={inputs.dependents}
                onChange={(v) => patch({ dependents: Math.max(0, Math.round(v)) })}
                hint={t('Used to estimate Child Tax Credit & EITC', 'CTC နှင့် EITC ခန့်မှန်းရန် အသုံးပြုသည်')}
              />
            </div>
          </Card>

          <Card
            title={t('Pre-Tax Benefits (optional)', 'အခွန်မဖြတ်မီ အကျိုးခံစားခွင့်များ (ရွေးချယ်ခွင့်)')}
            subtitle={t('These lower your taxable wages before tax is calculated.', 'ဤအရာများသည် အခွန်တွက်ချက်မီ သင့်အခွန်ဝင်ငွေကို လျှော့ချပေးသည်။')}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <NumberField label={t('401(k) Contribution', '401(k) ပါဝင်ငွေ')} suffix="%" step={0.5} value={inputs.retirement401kPercent} onChange={(v) => patch({ retirement401kPercent: v })} />
              <NumberField label={t('Health Insurance Premium', 'ကျန်းမာရေးအာမခံကြေး')} prefix="$" suffix="/mo" value={inputs.healthInsuranceMonthly} onChange={(v) => patch({ healthInsuranceMonthly: v })} />
              <NumberField label={t('HSA Contribution', 'HSA ပါဝင်ငွေ')} prefix="$" suffix="/mo" value={inputs.hsaMonthlyContribution} onChange={(v) => patch({ hsaMonthlyContribution: v })} />
              <NumberField label={t('Other (FSA / Commuter)', 'အခြား (FSA/စီးနင်းခ)')} prefix="$" suffix="/mo" value={inputs.otherPreTaxMonthly} onChange={(v) => patch({ otherPreTaxMonthly: v })} />
            </div>
            {inputs.hsaMonthlyContribution > 0 && (
              <div className="mt-4">
                <InfoCallout>
                  {t(
                    "California quirk: HSA contributions are pre-tax for federal purposes, but California is one of only two states that still taxes HSA contributions at the state level. This calculator applies that correctly.",
                    'ကယ်လီဖိုးနီးယား အထူးအချက်- HSA ပါဝင်ငွေများသည် ဖက်ဒရယ်အတွက် အခွန်မဖြတ်သော်လည်း၊ ကယ်လီဖိုးနီးယားသည် ပြည်နယ်အဆင့်တွင် HSA ကို အခွန်ကောက်ဆဲ ပြည်နယ်နှစ်ခုအနက်တစ်ခု ဖြစ်သည်။ ဤတွက်စက်သည် ယင်းကို မှန်ကန်စွာ ထည့်သွင်းတွက်ချက်ထားသည်။',
                  )}
                </InfoCallout>
              </div>
            )}
          </Card>

          <button
            type="button"
            onClick={() => setInputs(DEFAULT_INPUTS)}
            className="text-sm text-slate-400 hover:text-slate-600 underline underline-offset-2"
          >
            {t('Reset to example (Starbucks barista, CA)', 'နမူနာသို့ ပြန်ညှိရန် (Starbucks barista, CA)')}
          </button>
        </div>

        {/* ---------------- RESULTS COLUMN ---------------- */}
        <div className="space-y-4 lg:sticky lg:top-20">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">{t('Your Results', 'သင့်ရလဒ်များ')}</h2>
              <SegmentedControl
                value={view}
                onChange={setView}
                options={[
                  { value: 'monthly', label: t('Monthly', 'လစဉ်') },
                  { value: 'annual', label: t('Annually', 'နှစ်စဉ်') },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <ResultCard label={t('Gross Pay', 'စုစုပေါင်းဝင်ငွေ')} value={formatCurrency(result.grossAnnual / divisor)} sub={t('before any deductions', 'ဖြတ်မီ')} />
              <ResultCard
                label={t('Total Tax', 'စုစုပေါင်းအခွန်')}
                value={formatCurrency(result.totalTax / divisor)}
                sub={`${formatPercent(result.effectiveTaxRate)} ${t('effective rate', 'ထိရောက်နှုန်း')}`}
              />
              <ResultCard label={t('Net Take-Home Pay', 'အသားတင်ဝင်ငွေ')} value={formatCurrency(result.netAnnual / divisor)} tone="brand" sub={t('after tax & pre-tax benefits', 'အခွန်နှင့် အကျိုးခံစားခွင့် နှုတ်ပြီး')} />
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-600 flex items-center justify-between">
              <span>{t('Per paycheck', 'တစ်ကြိမ်လျှင်')} ({t(inputs.payFrequency, inputs.payFrequency)})</span>
              <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(result.netAnnual / paycheckDivisor, { cents: true })}</span>
            </div>

            {(result.estimatedEitc > 0 || result.estimatedCtc > 0) && (
              <div className="mt-4">
                <InfoCallout>
                  {t(
                    `Estimated at tax filing time (not withheld from paychecks): up to ${formatCurrency(result.estimatedEitc)} Earned Income Tax Credit and ${formatCurrency(result.estimatedCtc)} Child Tax Credit. See the Benefits page for details.`,
                    `အခွန်ဖြည့်ချိန်တွင် ခန့်မှန်း (လစာမှမနှုတ်ပါ)- Earned Income Tax Credit အများဆုံး ${formatCurrency(result.estimatedEitc)} နှင့် Child Tax Credit ${formatCurrency(result.estimatedCtc)}။ အသေးစိတ်ကို အကျိုးခံစားခွင့် စာမျက်နှာတွင် ကြည့်ပါ။`,
                  )}
                </InfoCallout>
              </div>
            )}

            <div className="mt-5 pt-5 border-t border-slate-200">
              <BreakdownTable lineItems={result.lineItems} divisor={divisor} columnLabel={view === 'monthly' ? t('Monthly', 'လစဉ်') : t('Annual', 'နှစ်စဉ်')} />
            </div>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
              <span>{t('Marginal federal rate', 'ဖက်ဒရယ် အနားသတ်နှုန်း')}: {formatPercent(result.marginalFederalRate)}</span>
              <span>{t('Marginal CA rate', 'CA အနားသတ်နှုန်း')}: {formatPercent(result.marginalCaRate)}</span>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="no-print mt-4 w-full rounded-lg border border-slate-300 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {t('Print / Save as PDF', 'ပုံနှိပ်ရန် / PDF အဖြစ်သိမ်းရန်')}
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
