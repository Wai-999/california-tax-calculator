import { useLanguage } from '../i18n/LanguageContext';
import { Card, SectionHeading, InfoCallout } from '../components/ui';
import { DATA_LAST_UPDATED, TAX_YEAR } from '../data/taxData2026';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow={t('About this project', 'ဤပရောဂျက်အကြောင်း')}
        title={t('California Paycheck & Tax Calculator', 'ကယ်လီဖိုးနီးယား လစာနှင့် အခွန်တွက်စက်')}
        description={t(
          'A free, open-source, real-world paycheck and income tax calculator built for California workers of any job type — hourly or salaried.',
          'ကယ်လီဖိုးနီးယားရှိ အလုပ်အမျိုးအစားမရွေး (နာရီစားဖြစ်စေ၊ လစာစားဖြစ်စေ) ဝန်ထမ်းများအတွက် အခမဲ့၊ open-source၊ လက်တွေ့သုံးနိုင်သော လစာနှင့်ဝင်ငွေခွန်တွက်စက်။',
        )}
      />

      <Card title={t('What this tool does', 'ဤကိရိယာလုပ်ဆောင်ပေးသည့်အရာ')}>
        <p className="text-sm text-slate-600 leading-relaxed">
          {t(
            `Enter an hourly rate and schedule (or a salary), your filing status, and any pre-tax benefits, and it calculates a full, itemized breakdown: federal income tax, California state income tax, Social Security, Medicare, and California SDI — shown as monthly or annual figures, plus per-paycheck. It applies real ${TAX_YEAR} brackets and rates, California's daily-overtime law, and the state's HSA quirk that most calculators miss.`,
            `နာရီစားလုပ်ခနှင့် အချိန်ဇယား (သို့မဟုတ် လစာ)၊ ဖိုင်လင်အခြေအနေ၊ pre-tax အကျိုးခံစားခွင့်များ ထည့်သွင်းလိုက်ပါက ဖက်ဒရယ်ဝင်ငွေခွန်၊ ကယ်လီဖိုးနီးယားပြည်နယ်ခွန်၊ Social Security၊ Medicare နှင့် CA SDI အပါအဝင် အသေးစိတ်ခွဲခြမ်းချက်ကို လစဉ်/နှစ်စဉ်/တစ်ကြိမ်ချင်း ပြသပေးသည်။ တကယ့် ${TAX_YEAR} နှုန်းထားများ၊ ကယ်လီဖိုးနီးယား၏ နေ့စဉ်အချိန်ပိုဥပဒေ၊ နှင့် တွက်စက်အများစု လွတ်တတ်သည့် HSA ပြည်နယ်ခွန်အထူးအချက်ကိုပါ ထည့်သွင်းတွက်ချက်သည်။`,
          )}
        </p>
      </Card>

      <Card title={t('Methodology & assumptions', 'နည်းစနစ်နှင့် ယူဆချက်များ')}>
        <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
          <p>{t('• Uses the standard deduction only (no itemized deductions).', '• စံနှုတ်ငွေကိုသာ အသုံးပြုသည် (itemized deduction မပါ)။')}</p>
          <p>{t('• Calculates actual annual tax liability, not simplified paycheck-withholding tables — closer to what you truly owe than a generic withholding estimate.', '• ရိုးရှင်းသော withholding ဇယားများထက် အမှန်တကယ်ကျသင့်သည့် နှစ်စဉ်အခွန်ကို တွက်ချက်သည်။')}</p>
          <p>{t('• Assumes 52 weeks/year for hourly annualization.', '• နာရီစားအတွက် တစ်နှစ်လျှင် ၅၂ပတ်ဖြင့် တွက်ချက်သည်။')}</p>
          <p>{t('• EITC is a straight-line approximation of the IRS table — close, but the official EIC worksheet rounds slightly differently.', '• EITC သည် IRS ဇယား၏ ခန့်မှန်းချက်သာဖြစ်သည် — တရားဝင် worksheet နှင့် အနည်းငယ်ကွဲနိုင်သည်။')}</p>
          <p>{t('• Does not model itemizing, self-employment tax, AMT, or capital gains — these matter mainly at very high incomes, uncommon for this tool\'s target users.', '• Itemizing၊ self-employment tax၊ AMT၊ capital gains များကို မတွက်ချက်ပါ — ၀င်ငွေများစွာမြင့်မားမှသာ သက်ရောက်သည်။')}</p>
        </div>
      </Card>

      <InfoCallout variant="warn">
        {t(
          'This is an independent educational tool, not affiliated with the IRS, California FTB/EDD, or any employer. It is not tax, legal, or financial advice. Always verify against official sources (linked on the Tax Laws page) or a licensed tax professional before making financial decisions.',
          'ဤကိရိယာသည် IRS၊ California FTB/EDD သို့မဟုတ် မည်သည့်အလုပ်ရှင်နှင့်မျှ မဆက်စပ်သော လွတ်လပ်သည့် ပညာရေးကိရိယာဖြစ်သည်။ အခွန်၊ ဥပဒေ သို့မဟုတ် ငွေကြေးအကြံဉာဏ် မဟုတ်ပါ။ ငွေကြေးဆုံးဖြတ်ချက်မချမီ တရားဝင်ရင်းမြစ်များ (အခွန်ဥပဒေစာမျက်နှာတွင် လင့်ခ်ပါ) သို့မဟုတ် လိုင်စင်ရအခွန်အထူးကုနှင့် အမြဲစစ်ဆေးပါ။',
        )}
      </InfoCallout>

      <Card title={t('Open source', 'Open Source')}>
        <p className="text-sm text-slate-600 leading-relaxed">
          {t(
            'The full source code — including every tax bracket, rate, and formula — is public on GitHub. Tax data lives in one clearly-commented file (src/data/taxData2026.ts) so it can be updated each year as the IRS and California FTB/EDD publish new figures. Contributions and corrections are welcome.',
            'Source code အားလုံး — အခွန်နှုန်းထား၊ ဖော်မြူလာအားလုံးအပါအဝင် — GitHub တွင် အများသုံးရရှိနိုင်သည်။ အခွန်ဒေတာများကို comment ရှင်းလင်းစွာပါသော ဖိုင်တစ်ခုတည်း (src/data/taxData2026.ts) တွင်ထားသည့်အတွက် IRS နှင့် California FTB/EDD မှ ကိန်းဂဏန်းအသစ်များ ထုတ်ပြန်တိုင်း နှစ်စဉ်ပြင်ဆင်နိုင်သည်။ ပံ့ပိုးမှုနှင့်ပြင်ဆင်ချက်များကို ကြိုဆိုပါသည်။',
          )}
        </p>
        <p className="mt-3 text-xs text-slate-400">{t('Tax data last verified', 'အခွန်ဒေတာ နောက်ဆုံးစစ်ဆေးသည့်ရက်')}: {DATA_LAST_UPDATED} ({t('tax year', 'အခွန်နှစ်')} {TAX_YEAR})</p>
      </Card>
    </div>
  );
}
