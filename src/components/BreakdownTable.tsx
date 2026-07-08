import type { TaxLineItem } from '../engine/types';
import { useLanguage } from '../i18n/LanguageContext';
import { formatCurrency } from '../utils/format';

const DEDUCTION_KEYS = new Set(['401k', 'health', 'hsa', 'other', 'federal', 'ca', 'ss', 'medicare', 'addlMedicare', 'sdi']);

export default function BreakdownTable({ lineItems, divisor, columnLabel }: { lineItems: TaxLineItem[]; divisor: number; columnLabel: string }) {
  const { t } = useLanguage();
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b border-slate-200">
            <th className="py-2 px-1 font-medium">{t('Item', 'အမျိုးအစား')}</th>
            <th className="py-2 px-1 font-medium text-right">{columnLabel}</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item) => {
            const isNet = item.key === 'net';
            const isGross = item.key === 'gross';
            const isDeduction = DEDUCTION_KEYS.has(item.key);
            const amount = item.annual / divisor;
            if (amount === 0 && !isNet && !isGross) return null;
            return (
              <tr
                key={item.key}
                className={[
                  'border-b border-slate-100 last:border-0',
                  isNet ? 'font-bold text-brand-700 bg-brand-50/60' : '',
                ].join(' ')}
              >
                <td className="py-2 px-1 text-slate-700">{t(item.labelEn, item.labelMy)}</td>
                <td
                  className={[
                    'py-2 px-1 text-right tabular-nums',
                    isDeduction ? 'text-rose-600' : isNet ? 'text-brand-700' : 'text-slate-900',
                  ].join(' ')}
                >
                  {isDeduction && amount !== 0 ? '−' : ''}
                  {formatCurrency(Math.abs(amount), { cents: divisor > 12 })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
