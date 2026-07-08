import {
  CA_OVERTIME_DAILY_THRESHOLD,
  CA_OVERTIME_DAILY_DOUBLE_THRESHOLD,
  CA_OVERTIME_WEEKLY_THRESHOLD,
} from '../data/taxData2026';
import type { CalculatorInputs, DailyHours, GrossPayResult } from './types';

const WEEKS_PER_YEAR = 52;
const DAY_KEYS: (keyof DailyHours)[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

/**
 * Simple mode: a single "hours per week" figure. Applies the baseline
 * federal/CA weekly overtime rule (over 40 hrs/week = 1.5x). This is
 * accurate for the vast majority of part-time and full-time schedules
 * that don't run long single-day shifts.
 */
function calculateSimpleGrossPay(hourlyRate: number, hoursPerWeek: number): GrossPayResult {
  const regularHours = Math.min(hoursPerWeek, CA_OVERTIME_WEEKLY_THRESHOLD);
  const overtimeHours15x = Math.max(0, hoursPerWeek - CA_OVERTIME_WEEKLY_THRESHOLD);
  const overtimeHours2x = 0;

  const regularPay = regularHours * hourlyRate;
  const overtimePay15x = overtimeHours15x * hourlyRate * 1.5;
  const overtimePay2x = 0;

  const grossWeekly = regularPay + overtimePay15x;
  return {
    regularHours,
    overtimeHours15x,
    overtimeHours2x,
    regularPay,
    overtimePay15x,
    overtimePay2x,
    grossWeekly,
    grossAnnual: grossWeekly * WEEKS_PER_YEAR,
  };
}

/**
 * Advanced mode: California's full daily-overtime rules (Labor Code §510).
 *  - Over 8 hrs in a single day  -> 1.5x for hours 8-12
 *  - Over 12 hrs in a single day -> 2x beyond hour 12
 *  - Over 40 hrs in the workweek -> 1.5x (weekly backstop, for schedules
 *    made of several short-but-many days that don't individually hit 8h)
 *  - 7th consecutive day worked in one workweek -> 1.5x for the first 8
 *    hours, 2x beyond 8 hours, even if daily/weekly thresholds aren't hit
 */
function calculateAdvancedCaGrossPay(hourlyRate: number, dailyHours: DailyHours): GrossPayResult {
  const hours = DAY_KEYS.map((k) => Math.max(0, dailyHours[k] || 0));
  const workedAllSevenDays = hours.every((h) => h > 0);

  let regularHours = 0;
  let ot15Hours = 0;
  let ot2Hours = 0;

  hours.forEach((h, idx) => {
    const isSeventhConsecutiveDay = workedAllSevenDays && idx === 6; // Sunday, last entry
    if (isSeventhConsecutiveDay) {
      // First 8 hours at 1.5x, remainder at 2x — none count as "regular"
      ot15Hours += Math.min(h, CA_OVERTIME_DAILY_THRESHOLD);
      ot2Hours += Math.max(0, h - CA_OVERTIME_DAILY_THRESHOLD);
      return;
    }
    const reg = Math.min(h, CA_OVERTIME_DAILY_THRESHOLD);
    const mid = Math.max(0, Math.min(h, CA_OVERTIME_DAILY_DOUBLE_THRESHOLD) - CA_OVERTIME_DAILY_THRESHOLD);
    const dbl = Math.max(0, h - CA_OVERTIME_DAILY_DOUBLE_THRESHOLD);
    regularHours += reg;
    ot15Hours += mid;
    ot2Hours += dbl;
  });

  // Weekly 40-hour backstop: if "regular" hours still exceed 40 (e.g. many
  // 7-hour days with no single day over 8), bump the excess to 1.5x.
  if (regularHours > CA_OVERTIME_WEEKLY_THRESHOLD) {
    const excess = regularHours - CA_OVERTIME_WEEKLY_THRESHOLD;
    regularHours -= excess;
    ot15Hours += excess;
  }

  const regularPay = regularHours * hourlyRate;
  const overtimePay15x = ot15Hours * hourlyRate * 1.5;
  const overtimePay2x = ot2Hours * hourlyRate * 2;
  const grossWeekly = regularPay + overtimePay15x + overtimePay2x;

  return {
    regularHours,
    overtimeHours15x: ot15Hours,
    overtimeHours2x: ot2Hours,
    regularPay,
    overtimePay15x,
    overtimePay2x,
    grossWeekly,
    grossAnnual: grossWeekly * WEEKS_PER_YEAR,
  };
}

export function calculateGrossPay(inputs: CalculatorInputs): GrossPayResult {
  if (inputs.payBasis === 'salary') {
    const grossAnnual = Math.max(0, inputs.annualSalary);
    return {
      regularHours: 0,
      overtimeHours15x: 0,
      overtimeHours2x: 0,
      regularPay: grossAnnual,
      overtimePay15x: 0,
      overtimePay2x: 0,
      grossWeekly: grossAnnual / WEEKS_PER_YEAR,
      grossAnnual,
    };
  }

  if (inputs.useAdvancedCaOvertime) {
    return calculateAdvancedCaGrossPay(inputs.hourlyRate, inputs.dailyHours);
  }
  return calculateSimpleGrossPay(inputs.hourlyRate, inputs.hoursPerWeek);
}
