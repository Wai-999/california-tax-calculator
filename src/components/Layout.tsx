import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { DATA_LAST_UPDATED } from '../data/taxData2026';

const navItems = [
  { to: '/', en: 'Calculator', my: 'တွက်စက်' },
  { to: '/tax-laws', en: 'Tax Laws', my: 'အခွန်ဥပဒေများ' },
  { to: '/benefits', en: 'Benefits & Credits', my: 'အကျိုးခံစားခွင့်များ' },
  { to: '/about', en: 'About', my: 'အကြောင်း' },
];

function linkClasses(isActive: boolean) {
  return [
    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
    isActive ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ');
}

export default function Layout() {
  const { t, lang, toggle } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="no-print sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2 font-bold text-slate-900 text-lg">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white text-sm">CA</span>
              <span className="hidden sm:inline">{t('Paycheck & Tax Calculator', 'လစာနှင့် အခွန်တွက်စက်')}</span>
              <span className="sm:hidden">{t('Tax Calculator', 'အခွန်တွက်စက်')}</span>
            </NavLink>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => linkClasses(isActive)}>
                  {t(item.en, item.my)}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={toggle}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Toggle language"
                title="English / မြန်မာ"
              >
                {lang === 'en' ? 'MY 🇲🇲' : 'EN 🇺🇸'}
              </button>
              <button
                className="md:hidden rounded-md p-2 text-slate-600 hover:bg-slate-100"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {menuOpen && (
            <nav className="md:hidden pb-3 flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => linkClasses(isActive)}
                  onClick={() => setMenuOpen(false)}
                >
                  {t(item.en, item.my)}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="no-print border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 text-xs text-slate-500 space-y-2">
          <p>
            {t(
              'Educational estimate only — not tax, legal, or financial advice. Verify figures with the IRS, California FTB/EDD, or a licensed tax professional before making financial decisions.',
              'ဤကိရိယာသည် ပညာရေးရည်ရွယ်ချက်ဖြင့် ခန့်မှန်းတွက်ချက်မှုသာ ဖြစ်ပြီး အခွန်၊ ဥပဒေ သို့မဟုတ် ငွေကြေးအကြံဉာဏ် မဟုတ်ပါ။ ငွေကြေးဆိုင်ရာ ဆုံးဖြတ်ချက်မချမီ IRS၊ California FTB/EDD သို့မဟုတ် လိုင်စင်ရ အခွန်အထူးကုနှင့် စစ်ဆေးပါ။',
            )}
          </p>
          <p>
            {t('Tax data last verified', 'အခွန်ဒေတာ နောက်ဆုံးစစ်ဆေးသည့်ရက်')}: {DATA_LAST_UPDATED} ·{' '}
            <NavLink to="/tax-laws" className="underline hover:text-slate-700">
              {t('See sources', 'ရင်းမြစ်များကြည့်ရန်')}
            </NavLink>
          </p>
        </div>
      </footer>
    </div>
  );
}
