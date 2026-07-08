# California Paycheck & Tax Calculator

A free, open-source, real-world paycheck and income tax calculator for California workers — hourly or salaried, any job. Built for tax year 2026.

**Live app:** `https://<your-github-username>.github.io/california-tax-calculator/` (after you enable GitHub Pages — see below)

## Why this exists

Most online paycheck calculators are black boxes, US-generic, or paywalled. This one is transparent (every formula is readable source code), California-specific (state income tax, SDI, daily overtime law, the CA HSA quirk), and built around real hourly-wage scenarios — enter an hourly rate and a schedule, not just an annual salary.

## Features

- **Works for any job** — hourly (with an optional advanced California daily-overtime calculator) or salaried.
- **Full tax stack** — federal income tax, California state income tax, Social Security, Medicare (+ Additional Medicare Tax), and California SDI, using real 2026 brackets.
- **Monthly & annual views**, plus a per-paycheck figure for your actual pay frequency (weekly / biweekly / semimonthly / monthly).
- **Pre-tax benefits modeling** — 401(k), health insurance, HSA, FSA/commuter — including the little-known rule that California taxes HSA contributions at the state level even though they're pre-tax federally.
- **California daily-overtime engine** — Labor Code §510: >8 hrs/day = 1.5×, >12 hrs/day = 2×, >40 hrs/week = 1.5×, plus the 7th-consecutive-day rule.
- **Credit estimates** — Earned Income Tax Credit (federal + CalEITC) and Child Tax Credit.
- **Tax Laws page** — current federal & CA brackets, FICA/SDI rates, minimum wage (incl. the AB 1228 fast-food minimum wage), overtime rules, and retirement/benefit contribution limits, all cited to primary sources.
- **Benefits page** — pre-tax benefit limits, tax credits, and CA-mandated job protections (paid sick leave, meal/rest breaks, workers' comp, unemployment/disability insurance).
- **Bilingual** — full English / Burmese (မြန်မာ) toggle across the app.
- **Saves your inputs locally** (browser `localStorage`) so they're still there next time you open it.
- **Print / Save as PDF** button for keeping a record.

## Tech stack

React 19 + TypeScript + Vite + React Router (hash routing, so it works flawlessly on GitHub Pages) + Tailwind CSS v4. No backend, no accounts, no analytics — everything runs client-side in your browser.

## Running it locally

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

## Deploying to GitHub Pages

This repo ships with a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and deploys automatically on every push to `main`.

1. Push this repo to GitHub (see below if you haven't yet).
2. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab). Your site will be live at `https://<username>.github.io/california-tax-calculator/` a minute or two later.

If you rename the repository, update the `base` path in `vite.config.ts` to match.

## Keeping the tax data current

Every number the calculator uses lives in **one file**: [`src/data/taxData2026.ts`](./src/data/taxData2026.ts). Each constant has a comment citing its primary source (IRS Revenue Procedure, California EDD/FTB publication, etc.). Each tax season:

1. Duplicate the data file (e.g. `taxData2027.ts`) with the new year's figures once the IRS and California FTB/EDD publish them (typically October–January for the following tax year).
2. Update the imports in `src/engine/*` and `src/pages/*` to point at the new file.
3. Update `TAX_YEAR` and `DATA_LAST_UPDATED`.

## Methodology notes & limitations

- Uses the standard deduction only — no itemized deductions, AMT, capital gains, or self-employment tax modeling.
- Calculates actual estimated annual tax liability (not simplified paycheck-withholding tables), so it's closer to what you truly owe than a generic withholding estimate.
- EITC is a straight-line approximation of the IRS table, not the official EIC worksheet.
- This is an independent educational project, not affiliated with the IRS, California FTB/EDD, or any employer, and is **not tax, legal, or financial advice**. Verify against official sources before making financial decisions.

## License

MIT — see [LICENSE](./LICENSE).
