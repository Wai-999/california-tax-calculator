import type { ReactNode } from 'react';

interface FieldWrapperProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function FieldWrapper({ label, hint, children }: FieldWrapperProps) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}

export function NumberField({ label, value, onChange, prefix, suffix, min = 0, max, step = 1, hint }: NumberFieldProps) {
  return (
    <FieldWrapper label={label} hint={hint}>
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{prefix}</span>}
        <input
          type="number"
          inputMode="decimal"
          className={[
            'w-full rounded-lg border border-slate-300 bg-white py-2 text-sm text-slate-900',
            'focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition-shadow',
            prefix ? 'pl-7' : 'pl-3',
            suffix ? 'pr-12' : 'pr-3',
          ].join(' ')}
          value={Number.isFinite(value) ? value : 0}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const v = e.target.valueAsNumber;
            onChange(Number.isNaN(v) ? 0 : v);
          }}
        />
        {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">{suffix}</span>}
      </div>
    </FieldWrapper>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}

export function SelectField({ label, value, onChange, options, hint }: SelectFieldProps) {
  return (
    <FieldWrapper label={label} hint={hint}>
      <select
        className="w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none transition-shadow"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}

export function SegmentedControl<T extends string>({ value, onChange, options, className }: SegmentedControlProps<T>) {
  return (
    <div className={['inline-flex rounded-lg bg-slate-100 p-1', className].filter(Boolean).join(' ')}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={[
            'px-3.5 py-1.5 text-sm font-semibold rounded-md transition-colors',
            value === opt.value ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700',
          ].join(' ')}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors',
          checked ? 'bg-brand-600' : 'bg-slate-300',
        ].join(' ')}
      >
        <span className={['inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform', checked ? 'translate-x-4.5' : 'translate-x-1'].join(' ')} />
      </button>
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}
