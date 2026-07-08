import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Card, SectionHeading, InfoCallout } from '../components/ui';
import { SegmentedControl } from '../components/fields';
import { formatCurrency, formatPercent } from '../utils/format';
import {
  FEDERAL_BRACKETS,
  FEDERAL_STANDARD_DEDUCTION,
  CA_BRACKETS,
  CA_STANDARD_DEDUCTION,
  CA_MENTAL_HEALTH_TAX_THRESHOLD,
  SOCIAL_SECURITY_RATE,
  SOCIAL_SECURITY_WAGE_BASE_2026,
  MEDICARE_RATE,
  ADDITIONAL_MEDICARE_RATE,
  ADDITIONAL_MEDICARE_THRESHOLD,
  CA_SDI_RATE_2026,
  CA_MINIMUM_WAGE_GENERAL_2026,
  CA_FAST_FOOD_MINIMUM_WAGE_2026,
  CA_OVERTIME_DAILY_THRESHOLD,
  CA_OVERTIME_DAILY_DOUBLE_THRESHOLD,
  LIMIT_401K_EMPLOYEE_DEFERRAL_2026,
  LIMIT_401K_CATCHUP_50PLUS_2026,
  LIMIT_HSA_SELF_2026,
  LIMIT_HSA_FAMILY_2026,
  LIMIT_HEALTH_FSA_2026,
  DATA_LAST_UPDATED,
  type FilingStatus,
} from '../data/taxData2026';
import type { TaxBracket } from '../data/taxData2026';

const FILING_LABELS: Record<FilingStatus, { en: string; my: string }> = {
  single: { en: 'Single', my: 'တစ်ကိုယ်တည်း' },
  marriedJointly: { en: 'Married Filing Jointly', my: 'အိမ်ထောင်သည် (ပူးတွဲ)' },
  marriedSeparately: { en: 'Married Filing Separately', my: 'အိမ်ထောင်သည် (သီးခြား)' },
  headOfHousehold: { en: 'Head of Household', my: 'အိမ်ထောင်ဦးစီး' },
};

function BracketTable({ brackets }: { brackets: TaxBracket[] }) {
  const { t } = useLanguage();
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-slate-500 border-b border-slate-200">
          <th className="py-2 font-medium">{t('Rate', 'နှုန်း')}</th>
          <th className="py-2 font-medium text-right">{t('Taxable Income Range', 'အခွန်ဆောင်ရမည့်ဝင်ငွေ အပိုင်းအခြား')}</th>
        </tr>
      </thead>
      <tbody>
        {brackets.map((b, i) => (
          <tr key={i} className="border-b border-slate-100 last:border-0">
            <td className="py-2 font-semibold text-slate-900">{formatPercent(b.rate, b.rate < 0.01 ? 2 : 1)}</td>
            <td className="py-2 text-right text-slate-600 tabular-nums">
              {formatCurrency(b.min)} {b.max ? `– ${formatCurrency(b.max)}` : `${t('and up', 'နှင့်အထက်')}`}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function TaxLaws() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<FilingStatus>('single');

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow={t('Reference · Updated ' + DATA_LAST_UPDATED, 'ကိုးကား · ' + DATA_LAST_UPDATED + ' တွင် နောက်ဆုံးစစ်ဆေး')}
        title={t('Tax Laws & Brackets', 'အခွန်ဥပဒေများနှင့် နှုန်းထားများ')}
        description={t(
          'The must-know federal and California tax rules behind this calculator, current for tax year 2026 — with primary-source citations at the bottom of this page.',
          'ဤတွက်စက်၏ အခြေခံဖြစ်သည့် ဖက်ဒရယ်နှင့် ကယ်လီဖိုးနီးယား အခွန်ဥပဒေ အဓိကအချက်များ — ၂၀၂၆ အခွန်နှစ်အတွက် လက်ရှိ ဖြစ်ပြီး၊ ဤစာမျက်နှာအောက်ခြေတွင် ရင်းမြစ်ကိုးကားချက်များ ပါဝင်သည်။',
        )}
      />

      <InfoCallout>
        {t(
          'Tax law changes every year. This page is data-driven from a single file in the source code (src/data/taxData2026.ts) so it can — and should — be updated each tax season. Always cross-check against irs.gov and ftb.ca.gov before filing.',
          'အခွန်ဥပဒေသည် နှစ်စဉ်ပြောင်းလဲသည်။ ဤစာမျက်နှာသည် source code ရှိ ဖိုင်တစ်ခုတည်း (src/data/taxData2026.ts) မှ ဒေတာယူသုံးထားပြီး၊ နှစ်စဉ်အခွန်ရာသီတိုင်း update လုပ်နိုင်သည်။ အခွန်မဆောင်မီ irs.gov နှင့် ftb.ca.gov တို့တွင် ထပ်မံစစ်ဆေးပါ။',
        )}
      </InfoCallout>

      <Card title={t('1. Federal & California Income Tax Brackets', '၁။ ဖက်ဒရယ်နှင့် ကယ်လီဖိုးနီးယား ဝင်ငွေခွန်နှုန်းထားများ')}>
        <div className="mb-4">
          <SegmentedControl
            value={status}
            onChange={setStatus}
            options={(Object.keys(FILING_LABELS) as FilingStatus[]).map((k) => ({ value: k, label: t(FILING_LABELS[k].en, FILING_LABELS[k].my) }))}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">
              {t('Federal (IRS)', 'ဖက်ဒရယ် (IRS)')} — {t('Standard deduction', 'စံနှုတ်ငွေ')}: {formatCurrency(FEDERAL_STANDARD_DEDUCTION[status])}
            </h3>
            <BracketTable brackets={FEDERAL_BRACKETS[status]} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">
              {t('California (FTB)', 'ကယ်လီဖိုးနီးယား (FTB)')} — {t('Standard deduction', 'စံနှုတ်ငွေ')}: {formatCurrency(CA_STANDARD_DEDUCTION[status])}
            </h3>
            <BracketTable brackets={CA_BRACKETS[status]} />
            <p className="mt-2 text-xs text-slate-500">
              {t(
                `Plus a flat +1% Mental Health Services Tax on taxable income over ${formatCurrency(CA_MENTAL_HEALTH_TAX_THRESHOLD)} — this $1M threshold does NOT double for joint filers.`,
                `အခွန်ဆောင်ရမည့်ဝင်ငွေ ${formatCurrency(CA_MENTAL_HEALTH_TAX_THRESHOLD)} ကျော်ပါက +1% Mental Health Services Tax ထပ်ဆောင်းပါမည် — ဤ $1M အဆင့်သည် ပူးတွဲဖိုင်လင်အတွက် နှစ်ဆမတိုးပါ။`,
              )}
            </p>
          </div>
        </div>
      </Card>

      <Card title={t('2. FICA: Social Security & Medicare', '၂။ FICA — Social Security နှင့် Medicare')}>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{t('Social Security', 'Social Security')}</p>
            <p className="mt-1 text-slate-600">
              {formatPercent(SOCIAL_SECURITY_RATE)} {t('of wages up to', 'အထိ လစာ၏')} {formatCurrency(SOCIAL_SECURITY_WAGE_BASE_2026)}{' '}
              {t('per year (the 2026 wage base). Earnings above this are not taxed for Social Security.', 'တစ်နှစ်လျှင် (၂၀၂၆ wage base)။ ယင်းထက်ကျော်သော ဝင်ငွေအပေါ် Social Security ခွန်မကောက်ပါ။')}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{t('Medicare', 'Medicare')}</p>
            <p className="mt-1 text-slate-600">
              {formatPercent(MEDICARE_RATE, 2)} {t('of all wages — no wage cap.', 'လစာအားလုံးအပေါ် — အထက်ကန့်သတ်ချက်မရှိ။')}{' '}
              {t(
                `Plus an Additional Medicare Tax of ${formatPercent(ADDITIONAL_MEDICARE_RATE, 1)} on wages over ${formatCurrency(ADDITIONAL_MEDICARE_THRESHOLD.single)} (single) / ${formatCurrency(ADDITIONAL_MEDICARE_THRESHOLD.marriedJointly)} (joint). These thresholds are fixed by law, not inflation-adjusted.`,
                `ထို့အပြင် ${formatCurrency(ADDITIONAL_MEDICARE_THRESHOLD.single)} (တစ်ကိုယ်တည်း) / ${formatCurrency(ADDITIONAL_MEDICARE_THRESHOLD.marriedJointly)} (ပူးတွဲ) ထက်ကျော်သော လစာအပေါ် ${formatPercent(ADDITIONAL_MEDICARE_RATE, 1)} ထပ်ဆောင်း Medicare ခွန်ရှိသည်။ ဤအဆင့်များသည် ဥပဒေအရ သတ်မှတ်ထားပြီး ငွေကြေးဖောင်းပွမှုနှင့် မညှိပါ။`,
              )}
            </p>
          </div>
        </div>
      </Card>

      <Card title={t('3. California State Disability Insurance (SDI)', '၃။ ကယ်လီဖိုးနီးယား မသန်စွမ်းအာမခံ (SDI)')}>
        <p className="text-sm text-slate-600">
          {t(
            `${formatPercent(CA_SDI_RATE_2026, 1)} of ALL wages — funds both Disability Insurance and Paid Family Leave. Since January 1, 2024, California removed the SDI taxable wage cap, so unlike Social Security, every dollar you earn is subject to SDI, no matter how high your income.`,
            `လစာအားလုံး၏ ${formatPercent(CA_SDI_RATE_2026, 1)} — Disability Insurance နှင့် Paid Family Leave နှစ်ခုစလုံးအတွက် ရံပုံငွေဖြစ်သည်။ ၂၀၂၄ ဇန်နဝါရီ ၁ ရက်မှစပြီး ကယ်လီဖိုးနီးယားသည် SDI ခွန်ကောက်နိုင်သော လုပ်ခ ကန့်သတ်ချက်ကို ဖယ်ရှားခဲ့ပါသည်။ ထို့ကြောင့် Social Security နှင့်မတူဘဲ ဝင်ငွေမည်မျှမြင့်သည်ဖြစ်စေ SDI ကောက်ခံခံရသည်။`,
          )}
        </p>
      </Card>

      <Card title={t('4. California Minimum Wage', '၄။ ကယ်လီဖိုးနီးယား အနိမ့်ဆုံးလုပ်ခ')}>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{t('General minimum wage', 'ယေဘုယျ အနိမ့်ဆုံးလုပ်ခ')}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(CA_MINIMUM_WAGE_GENERAL_2026, { cents: true })}/hr</p>
            <p className="mt-1 text-slate-500">{t('All CA employers, effective Jan 1, 2026.', 'CA အလုပ်ရှင်အားလုံးအတွက်၊ ၂၀၂၆ ဇန်နဝါရီ ၁ မှစတင်သက်ရောက်။')}</p>
          </div>
          <div className="rounded-xl bg-brand-50 p-4 border border-brand-100">
            <p className="font-semibold text-brand-900">{t('Fast-food minimum wage (AB 1228)', 'Fast-food အနိမ့်ဆုံးလုပ်ခ (AB 1228)')}</p>
            <p className="mt-1 text-2xl font-bold text-brand-900">{formatCurrency(CA_FAST_FOOD_MINIMUM_WAGE_2026, { cents: true })}/hr</p>
            <p className="mt-1 text-brand-700">
              {t(
                'Applies to restaurant chains with 60+ locations nationally sharing a common brand — this covers Starbucks company-operated stores. Set by the Fast Food Council; can be adjusted annually.',
                'တစ်နိုင်ငံလုံးတွင် ဆိုင်ခွဲ ၆၀ ကျော်ရှိသည့် ကွင်းဆက်စားသောက်ဆိုင်များအတွက် သက်ရောက်သည် — Starbucks ကုမ္ပဏီပိုင်ဆိုင်များ ပါဝင်သည်။ Fast Food Council မှ သတ်မှတ်ပြီး နှစ်စဉ်ညှိနိုင်သည်။',
              )}
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {t(
            'Many healthcare facility workers also have a separate schedule phasing toward $25/hr through 2033 under SB 525 — the exact rate depends on employer type and size.',
            'ကျန်းမာရေးဌာနများရှိ ဝန်ထမ်းအများစုသည် SB 525 အရ ၂၀၃၃ အထိ $25/hr သို့ တဖြည်းဖြည်းတိုးမြှင့်မည့် သီးခြားစီစဉ်ချက်ရှိသည် — အတိအကျနှုန်းမှာ အလုပ်ရှင်အမျိုးအစားနှင့် အရွယ်အစားပေါ်မူတည်သည်။',
          )}
        </p>
      </Card>

      <Card title={t('5. California Daily & Weekly Overtime', '၅။ ကယ်လီဖိုးနီးယား နေ့စဉ်/အပတ်စဉ် အချိန်ပို')}>
        <p className="text-sm text-slate-600">
          {t(
            `Unlike federal law (which only requires overtime after 40 hrs/week), California Labor Code §510 also requires DAILY overtime for most non-exempt hourly workers: 1.5× pay for hours worked beyond ${CA_OVERTIME_DAILY_THRESHOLD} in a single day, and 2× pay beyond ${CA_OVERTIME_DAILY_DOUBLE_THRESHOLD} hours in a single day. Working a 7th consecutive day in one workweek also triggers 1.5× for the first 8 hours and 2× beyond that — even if you're under 40 hours for the week.`,
            `ဖက်ဒရယ်ဥပဒေ (တစ်ပတ် ၄၀နာရီကျော်မှသာ အချိန်ပိုပေးရသည်) နှင့်မတူဘဲ၊ California Labor Code §510 သည် exempt မဟုတ်သော နာရီစားဝန်ထမ်းအများစုအတွက် နေ့စဉ်အချိန်ပိုကိုပါ တောင်းဆိုသည်- တစ်ရက်လျှင် ${CA_OVERTIME_DAILY_THRESHOLD}နာရီကျော်ပါက 1.5×၊ ${CA_OVERTIME_DAILY_DOUBLE_THRESHOLD}နာရီကျော်ပါက 2×။ တစ်ပတ်တွင် ဆက်တိုက် ၇ရက်မြောက်နေ့ အလုပ်လုပ်ပါက တစ်ပတ်လျှင် ၄၀နာရီအောက်ဖြစ်သော်လည်း ပထမ ၈နာရီအတွက် 1.5×၊ ကျန်အတွက် 2× ရသင့်သည်။`,
          )}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {t('Use "Advanced" mode on the Calculator page to apply these rules precisely to your actual weekly schedule.', 'တွက်စက်စာမျက်နှာရှိ "Advanced" mode ကို သင့်အမှန်တကယ် အပတ်စဉ်အချိန်ဇယားအတွက် တိကျစွာအသုံးပြုပါ။')}
        </p>
      </Card>

      <Card title={t('6. Retirement & Pre-Tax Benefit Limits', '၆။ ပင်စင်နှင့် အခွန်မဖြတ်မီ အကျိုးခံစားခွင့် အကန့်အသတ်များ')}>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">401(k)</p>
            <p className="mt-1 text-slate-600">
              {formatCurrency(LIMIT_401K_EMPLOYEE_DEFERRAL_2026)}/{t('yr', 'နှစ်')}, +{formatCurrency(LIMIT_401K_CATCHUP_50PLUS_2026)} {t('catch-up (age 50+)', 'အသက် ၅၀+ အပိုဆောင်း')}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">HSA</p>
            <p className="mt-1 text-slate-600">
              {formatCurrency(LIMIT_HSA_SELF_2026)} ({t('self', 'တစ်ကိုယ်တည်း')}) / {formatCurrency(LIMIT_HSA_FAMILY_2026)} ({t('family', 'မိသားစု')})
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{t('Health FSA', 'Health FSA')}</p>
            <p className="mt-1 text-slate-600">{formatCurrency(LIMIT_HEALTH_FSA_2026)}/{t('yr', 'နှစ်')}</p>
          </div>
        </div>
      </Card>

      <Card title={t('Sources', 'ရင်းမြစ်များ')}>
        <ul className="text-sm text-slate-600 space-y-1.5 list-disc list-inside marker:text-slate-400">
          <li><a className="text-brand-700 hover:underline" href="https://www.irs.gov/pub/irs-drop/rp-25-32.pdf" target="_blank" rel="noreferrer">IRS Revenue Procedure 2025-32</a> — {t('federal brackets, standard deduction, EITC, CTC, retirement & fringe benefit limits for TY2026', 'ဖက်ဒရယ်နှုန်းထားများ၊ EITC၊ CTC၊ ပင်စင်အကန့်အသတ်များ')}</li>
          <li><a className="text-brand-700 hover:underline" href="https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill" target="_blank" rel="noreferrer">IRS Newsroom IR-2025-103</a></li>
          <li><a className="text-brand-700 hover:underline" href="https://edd.ca.gov/siteassets/files/pdf_pub_ctr/26methb.pdf" target="_blank" rel="noreferrer">California EDD — Withholding Schedules for 2026</a> — {t('source for CA bracket thresholds', 'CA နှုန်းထား ရင်းမြစ်')}</li>
          <li><a className="text-brand-700 hover:underline" href="https://www.ftb.ca.gov/file/personal/tax-calculator-tables-rates.asp" target="_blank" rel="noreferrer">California FTB — Tax calculator, tables, rates</a></li>
          <li><a className="text-brand-700 hover:underline" href="https://edd.ca.gov/en/disability/Contribution_Rates_and_Benefit_Amounts/" target="_blank" rel="noreferrer">California EDD — SDI Contribution Rates</a></li>
          <li><a className="text-brand-700 hover:underline" href="https://www.dir.ca.gov/dlse/Fast-Food-Minimum-Wage-FAQ.htm" target="_blank" rel="noreferrer">California DIR — Fast Food Minimum Wage FAQ</a></li>
          <li><a className="text-brand-700 hover:underline" href="https://www.dir.ca.gov/dlse/minimum_wage.htm" target="_blank" rel="noreferrer">California DIR — Minimum Wage</a></li>
        </ul>
        <p className="mt-4 text-xs text-slate-400">
          {t(
            'This page is informational and general in nature. It is not tax, legal, or accounting advice. Tax situations vary — consult the IRS, California FTB/EDD, or a licensed tax professional for guidance on your specific circumstances.',
            'ဤစာမျက်နှာသည် အထွေထွေ သတင်းအချက်အလက်သာဖြစ်ပြီး အခွန်၊ ဥပဒေ သို့မဟုတ် စာရင်းကိုင်အကြံဉာဏ် မဟုတ်ပါ။ အခွန်အခြေအနေများ ကွဲပြားနိုင်သဖြင့် သင့်ကိစ္စအတွက် IRS၊ California FTB/EDD သို့မဟုတ် လိုင်စင်ရ အခွန်အထူးကုနှင့် တိုင်ပင်ပါ။',
          )}
        </p>
      </Card>
    </div>
  );
}
