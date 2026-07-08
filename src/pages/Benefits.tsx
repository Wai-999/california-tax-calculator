import { useLanguage } from '../i18n/LanguageContext';
import { Card, SectionHeading, InfoCallout } from '../components/ui';
import { formatCurrency } from '../utils/format';
import {
  LIMIT_401K_EMPLOYEE_DEFERRAL_2026,
  LIMIT_401K_CATCHUP_50PLUS_2026,
  LIMIT_401K_CATCHUP_60_TO_63_2026,
  LIMIT_HSA_SELF_2026,
  LIMIT_HSA_FAMILY_2026,
  LIMIT_HSA_CATCHUP_55PLUS_2026,
  LIMIT_HEALTH_FSA_2026,
  LIMIT_HEALTH_FSA_CARRYOVER_2026,
  LIMIT_DEPENDENT_CARE_FSA_2026,
  LIMIT_COMMUTER_TRANSIT_MONTHLY_2026,
  EITC_2026,
  CTC_PER_CHILD_2026,
  CTC_REFUNDABLE_PORTION_2026,
  CALEITC_MAX_CREDIT,
  CALEITC_INCOME_LIMIT,
  SAVERS_CREDIT_AGI_LIMIT,
} from '../data/taxData2026';

function BenefitCard({ titleEn, titleMy, amount, descEn, descMy }: { titleEn: string; titleMy: string; amount: string; descEn: string; descMy: string }) {
  const { t } = useLanguage();
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="font-semibold text-slate-900">{t(titleEn, titleMy)}</p>
      <p className="mt-1 text-xl font-bold text-brand-700">{amount}</p>
      <p className="mt-1.5 text-sm text-slate-600">{t(descEn, descMy)}</p>
    </div>
  );
}

export default function Benefits() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow={t('My Benefits', 'ကျွန်ုပ်၏ အကျိုးခံစားခွင့်များ')}
        title={t('Benefits & Tax Credits', 'အကျိုးခံစားခွင့်များနှင့် အခွန်ခရက်ဒစ်များ')}
        description={t(
          'Two kinds of "benefits" that put real money back in your pocket: pre-tax payroll benefits that shrink your taxable wages today, and tax credits you claim when you file that can boost your refund.',
          'သင့်လက်ထဲသို့ ငွေအမှန်တကယ်ပြန်ပေးသည့် "အကျိုးခံစားခွင့်" နှစ်မျိုး- ယနေ့ပင် သင့်အခွန်ဝင်ငွေကို လျှော့ချပေးသည့် pre-tax payroll အကျိုးခံစားခွင့်များ၊ နှင့် အခွန်ဖြည့်ချိန်တွင် တောင်းဆိုနိုင်ပြီး ပြန်အမ်းငွေတိုးစေသည့် အခွန်ခရက်ဒစ်များ။',
        )}
      />

      <Card title={t('Pre-Tax Payroll Benefits (2026 limits)', 'Pre-Tax Payroll အကျိုးခံစားခွင့်များ (၂၀၂၆ အကန့်အသတ်)')}>
        <div className="grid sm:grid-cols-2 gap-4">
          <BenefitCard
            titleEn="401(k) Retirement Plan"
            titleMy="401(k) ပင်စင်အစီအစဉ်"
            amount={`${formatCurrency(LIMIT_401K_EMPLOYEE_DEFERRAL_2026)}/yr`}
            descEn={`Traditional 401(k) contributions reduce your federal AND California taxable wages today. Catch-up: +${formatCurrency(LIMIT_401K_CATCHUP_50PLUS_2026)} at 50+, or +${formatCurrency(LIMIT_401K_CATCHUP_60_TO_63_2026)} at age 60-63.`}
            descMy={`Traditional 401(k) ပါဝင်ငွေများသည် ဖက်ဒရယ်နှင့် ကယ်လီဖိုးနီးယား နှစ်ခုစလုံး၏ အခွန်ဝင်ငွေကို ယနေ့ပင် လျှော့ချပေးသည်။ Catch-up: အသက် ၅၀+ တွင် +${formatCurrency(LIMIT_401K_CATCHUP_50PLUS_2026)}၊ သို့မဟုတ် အသက် ၆၀-၆၃ တွင် +${formatCurrency(LIMIT_401K_CATCHUP_60_TO_63_2026)}။`}
          />
          <BenefitCard
            titleEn="Health Savings Account (HSA)"
            titleMy="ကျန်းမာရေးစုငွေအကောင့် (HSA)"
            amount={`${formatCurrency(LIMIT_HSA_SELF_2026)} / ${formatCurrency(LIMIT_HSA_FAMILY_2026)}`}
            descEn={`Self-only / family limits, +${formatCurrency(LIMIT_HSA_CATCHUP_55PLUS_2026)} catch-up at 55+. Requires a qualifying high-deductible health plan. Pre-tax federally — but California taxes HSA contributions at the state level (one of only two states that does).`}
            descMy={`တစ်ကိုယ်တည်း / မိသားစု အကန့်အသတ်၊ အသက် ၅၅+ တွင် +${formatCurrency(LIMIT_HSA_CATCHUP_55PLUS_2026)}။ High-deductible health plan လိုအပ်သည်။ ဖက်ဒရယ်အတွက် အခွန်မဖြတ်သော်လည်း ကယ်လီဖိုးနီးယားက ပြည်နယ်အဆင့်တွင် HSA ကို အခွန်ကောက်သည် (ဤသို့ကောက်ခံသော ပြည်နယ် နှစ်ခုအနက် တစ်ခု)။`}
          />
          <BenefitCard
            titleEn="Health Care FSA"
            titleMy="ကျန်းမာရေး FSA"
            amount={`${formatCurrency(LIMIT_HEALTH_FSA_2026)}/yr`}
            descEn={`Use-it-or-lose-it, but up to ${formatCurrency(LIMIT_HEALTH_FSA_CARRYOVER_2026)} can carry over if your employer's plan allows it. Great for predictable medical/dental/vision costs.`}
            descMy={`မသုံးလျှင်ပျောက်တတ်သော်လည်း အလုပ်ရှင်၏အစီအစဉ်က ခွင့်ပြုပါက ${formatCurrency(LIMIT_HEALTH_FSA_CARRYOVER_2026)} အထိ နောက်နှစ်သို့ ဆောင်နိုင်သည်။ ခန့်မှန်းနိုင်သော ဆေးဘက်ဆိုင်ရာ ကုန်ကျစရိတ်များအတွက် သင့်တော်သည်။`}
          />
          <BenefitCard
            titleEn="Commuter / Transit Benefit"
            titleMy="သွားလာစီးနင်း အကျိုးခံစားခွင့်"
            amount={`${formatCurrency(LIMIT_COMMUTER_TRANSIT_MONTHLY_2026)}/mo`}
            descEn="Pre-tax transit passes or qualified parking, if your employer offers it. Also worth checking Dependent Care FSA if you have childcare expenses."
            descMy="အလုပ်ရှင်ကပေးပါက pre-tax စီးနင်းလက်မှတ် သို့မဟုတ် ကားပါကင်ခ။ ကလေးထိန်းစရိတ်ရှိပါက Dependent Care FSA ကိုလည်း စစ်ဆေးထားသင့်သည်။"
          />
        </div>
        <div className="mt-4">
          <InfoCallout>
            {t(
              `Dependent Care FSA: up to ${formatCurrency(LIMIT_DEPENDENT_CARE_FSA_2026)}/year pre-tax for childcare so you can work — this limit is fixed by statute and not inflation-adjusted.`,
              `Dependent Care FSA: အလုပ်လုပ်နိုင်ရန် ကလေးထိန်းစရိတ်အတွက် တစ်နှစ်လျှင် ${formatCurrency(LIMIT_DEPENDENT_CARE_FSA_2026)} အထိ pre-tax — ဤအကန့်အသတ်ကို ဥပဒေအရ သတ်မှတ်ထားပြီး ငွေကြေးဖောင်းပွမှုနှင့် မညှိပါ။`,
            )}
          </InfoCallout>
        </div>
      </Card>

      <Card title={t('Tax Credits Worth Claiming', 'တောင်းဆိုထိုက်သော အခွန်ခရက်ဒစ်များ')} subtitle={t('Claimed when you file your return — they can turn into a refund even if you owed little or no tax.', 'အခွန်ဖြည့်ချိန်တွင် တောင်းဆိုရသည် — အခွန်နည်းနည်း (သို့) လုံးဝမကျသော်လည်း ပြန်အမ်းငွေဖြစ်လာနိုင်သည်။')}>
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{t('Earned Income Tax Credit (EITC) — federal', 'Earned Income Tax Credit (EITC) — ဖက်ဒရယ်')}</p>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="py-1 pr-4 font-medium">{t('Children', 'ကလေးအရေအတွက်')}</th>
                    <th className="py-1 font-medium">{t('Max Credit (2026)', 'အများဆုံးခရက်ဒစ် (၂၀၂၆)')}</th>
                  </tr>
                </thead>
                <tbody>
                  {EITC_2026.map((row) => (
                    <tr key={row.children} className="border-t border-slate-200">
                      <td className="py-1.5 pr-4 text-slate-700">{row.children === 3 ? t('3 or more', '၃ ကလေးနှင့်အထက်') : row.children}</td>
                      <td className="py-1.5 font-semibold text-slate-900">{formatCurrency(row.maxCredit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {t('Even workers with no children can qualify for a smaller credit. Your Calculator page shows a live estimate.', 'ကလေးမရှိသူများပင် ခရက်ဒစ်အနည်းငယ် ရနိုင်သည်။ တွက်စက်စာမျက်နှာတွင် တိုက်ရိုက်ခန့်မှန်းချက် ပြထားသည်။')}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{t('California Earned Income Tax Credit (CalEITC) — state', 'ကယ်လီဖိုးနီးယား EITC (CalEITC) — ပြည်နယ်')}</p>
            <p className="mt-1 text-sm text-slate-600">
              {t(
                `Stacks on top of the federal EITC. Most recently confirmed: up to ${formatCurrency(CALEITC_MAX_CREDIT)} for workers earning up to about ${formatCurrency(CALEITC_INCOME_LIMIT)}/year. Filing a CA return (even if you don't owe state tax) is required to get it — check ftb.ca.gov/caleitc for the current year's exact figures.`,
                `ဖက်ဒရယ် EITC အပေါ် ထပ်ဆောင်း ရရှိသည်။ နောက်ဆုံးအတည်ပြုချက်- တစ်နှစ်လျှင် ${formatCurrency(CALEITC_INCOME_LIMIT)} ခန့်အထိ ရှာဖွေသူများအတွက် ${formatCurrency(CALEITC_MAX_CREDIT)} အထိ။ ရရှိရန် CA return ဖြည့်ရန်လိုအပ်သည် (ပြည်နယ်ခွန် မကျသော်လည်း) — လက်ရှိနှစ်၏ အတိအကျကိန်းဂဏန်းများအတွက် ftb.ca.gov/caleitc တွင် စစ်ဆေးပါ။`,
              )}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{t('Child Tax Credit (CTC)', 'Child Tax Credit (CTC)')}</p>
            <p className="mt-1 text-sm text-slate-600">
              {t(
                `${formatCurrency(CTC_PER_CHILD_2026)} per qualifying child in 2026, up to ${formatCurrency(CTC_REFUNDABLE_PORTION_2026)} of which is refundable even if you owe no tax.`,
                `၂၀၂၆ တွင် အရည်အချင်းပြည့်ကလေးတစ်ဦးလျှင် ${formatCurrency(CTC_PER_CHILD_2026)}၊ အခွန်လုံးဝမကျသော်လည်း ${formatCurrency(CTC_REFUNDABLE_PORTION_2026)} အထိ ပြန်အမ်းနိုင်သည်။`,
              )}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{t("Saver's Credit (Retirement Savings Contributions Credit)", 'Saver\'s Credit (ပင်စင်စုငွေ ခရက်ဒစ်)')}</p>
            <p className="mt-1 text-sm text-slate-600">
              {t(
                `Up to 50% of your 401(k)/IRA contributions back as a credit if your AGI is under about ${formatCurrency(SAVERS_CREDIT_AGI_LIMIT.single)} (single) / ${formatCurrency(SAVERS_CREDIT_AGI_LIMIT.marriedJointly)} (joint). Often overlooked by exactly the kind of hourly worker it was designed for.`,
                `AGI သည် ${formatCurrency(SAVERS_CREDIT_AGI_LIMIT.single)} (တစ်ကိုယ်တည်း) / ${formatCurrency(SAVERS_CREDIT_AGI_LIMIT.marriedJointly)} (ပူးတွဲ) အောက်ရှိပါက 401(k)/IRA ပါဝင်ငွေ၏ 50% အထိ ခရက်ဒစ်အဖြစ် ပြန်ရနိုင်သည်။ ဤခရက်ဒစ်ကို ရည်ရွယ်ချက်ထားသော နာရီစားဝန်ထမ်းများကိုယ်တိုင် မကြာခဏ လျစ်လျူရှုမိတတ်သည်။`,
              )}
            </p>
          </div>
        </div>
      </Card>

      <Card title={t('California Job Protections & Benefits', 'ကယ်လီဖိုးနီးယား အလုပ်အကာအကွယ်နှင့် အကျိုးခံစားခွင့်များ')} subtitle={t('Not tax-related, but just as important — every CA worker is entitled to these regardless of employer.', 'အခွန်နှင့်မသက်ဆိုင်သော်လည်း အလားတူအရေးကြီးသည် — CA ဝန်ထမ်းတိုင်း အလုပ်ရှင်မရွေး ဤအခွင့်အရေးများကို ရထိုက်သည်။')}>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="font-semibold text-slate-900">{t('Paid Sick Leave', 'လစာပါခွင့်နာမကျန်း')}</p>
            <p className="mt-1 text-slate-600">{t('CA law guarantees at least 40 hours (5 days) of paid sick leave per year for most employees.', 'CA ဥပဒေသည် ဝန်ထမ်းအများစုအတွက် တစ်နှစ်လျှင် အနည်းဆုံး ၄၀နာရီ (၅ရက်) လစာပါခွင့်နာမကျန်းကို အာမခံသည်။')}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="font-semibold text-slate-900">{t('Meal & Rest Breaks', 'အစာစားချိန်နှင့် နားချိန်များ')}</p>
            <p className="mt-1 text-slate-600">{t('A 30-min unpaid meal break for shifts over 5 hours, plus a paid 10-min rest break for every 4 hours worked.', '၅နာရီကျော်အလုပ်ဝင်ချိန်တိုင်းအတွက် အခမဲ့ ၃၀မိနစ် အစာစားချိန်၊ ၄နာရီတိုင်းအတွက် လစာပါ ၁၀မိနစ် နားချိန်။')}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="font-semibold text-slate-900">{t("Workers' Compensation", 'ဝန်ထမ်းလျော်ကြေး')}</p>
            <p className="mt-1 text-slate-600">{t('Employer-funded coverage for work-related injuries or illness — required for virtually every CA employer, from day one of employment.', 'အလုပ်ကြောင့်ဒဏ်ရာရ/ဖျားနာမှုအတွက် အလုပ်ရှင်ကထုတ်ပေးသောအာမခံ — CA အလုပ်ရှင်အားလုံးနီးပါးအတွက် အလုပ်စတင်သည့်နေ့မှစ၍ လိုအပ်သည်။')}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="font-semibold text-slate-900">{t('Unemployment & Disability Insurance', 'အလုပ်လက်မဲ့နှင့် မသန်စွမ်းအာမခံ')}</p>
            <p className="mt-1 text-slate-600">{t("Funded by the SDI payroll tax you already pay — provides partial wage replacement if you lose your job, or can't work due to a non-work injury, illness, or bonding with a new child.", 'သင်ပေးဆောင်နေသည့် SDI ခွန်ဖြင့် ရံပုံငွေထားသည် — အလုပ်ပျက်လျှင် (သို့) အလုပ်နှင့်မဆိုင်သော ဒဏ်ရာ/ဖျားနာမှု/ကလေးမွေးဖွားစောင့်ရှောက်မှုကြောင့် အလုပ်မလုပ်နိုင်လျှင် လစာတစ်စိတ်တစ်ပိုင်း အစားထိုးပေးသည်။')}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
