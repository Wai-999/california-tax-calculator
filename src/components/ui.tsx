import type { ReactNode } from 'react';

export function Card({ title, subtitle, children, className }: { title?: string; subtitle?: string; children: ReactNode; className?: string }) {
  return (
    <section className={['rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm', className].filter(Boolean).join(' ')}>
      {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
      {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      <div className={title || subtitle ? 'mt-4' : ''}>{children}</div>
    </section>
  );
}

export function ResultCard({
  label,
  value,
  sub,
  tone = 'default',
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'default' | 'brand' | 'danger';
}) {
  const toneClasses = {
    default: 'bg-white border-slate-200',
    brand: 'bg-brand-600 border-brand-600 text-white',
    danger: 'bg-rose-50 border-rose-100',
  }[tone];
  return (
    <div className={['rounded-2xl border p-5 shadow-sm', toneClasses].join(' ')}>
      <p className={['text-xs font-medium uppercase tracking-wide', tone === 'brand' ? 'text-brand-100' : 'text-slate-500'].join(' ')}>{label}</p>
      <p className={['mt-1.5 text-2xl sm:text-3xl font-bold tabular-nums', tone === 'brand' ? 'text-white' : 'text-slate-900'].join(' ')}>{value}</p>
      {sub && <p className={['mt-1 text-xs', tone === 'brand' ? 'text-brand-100' : 'text-slate-400'].join(' ')}>{sub}</p>}
    </div>
  );
}

export function InfoCallout({ children, variant = 'info' }: { children: ReactNode; variant?: 'info' | 'warn' }) {
  const styles =
    variant === 'warn'
      ? 'bg-amber-50 border-amber-200 text-amber-900'
      : 'bg-sky-50 border-sky-200 text-sky-900';
  return <div className={['rounded-xl border px-4 py-3 text-sm leading-relaxed', styles].join(' ')}>{children}</div>;
}

export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-6">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-1.5">{eyebrow}</p>}
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1>
      {description && <p className="mt-2 text-slate-600 max-w-3xl">{description}</p>}
    </div>
  );
}
