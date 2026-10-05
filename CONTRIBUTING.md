# Contributing to Dubai Budget Planner

Thanks for helping improve Dubai Budget Planner. Contributions should preserve its central promise: an honest move-in and monthly budget, calculated entirely in the browser.

## Prerequisites

- [Bun](https://bun.sh/) 1.4.2
- Google Chrome, only when regenerating showcase images

## Local setup

```bash
bun install
bun run dev
```

Append `?template=family-2children` (or another template ID from `src/lib/budget-calculator.ts`) to the local address to open the planner with a filled-in budget.

## Project layout

| Path | Purpose |
| --- | --- |
| `src/lib/budget-calculator.ts` | Types, 2026 assumptions, starting-point templates, and the calculation itself |
| `src/lib/initial-budget-data.ts` | The budget a blank planner starts from |
| `src/lib/print-report.ts` | The printable report, rendered to a standalone HTML string |
| `src/components` | Form sections and result widgets |
| `src/components/ui` | Vendored shadcn/ui primitives, trimmed to what the planner uses |
| `src/analytics.ts` | Optional Umami loader and the fixed event list |

## Project scripts

| Command | Purpose |
| --- | --- |
| `bun run build` | Type-check and create a production build |
| `bun run check` | Check formatting, lint rules, unused code, and dependencies |
| `bun run check:fix` | Apply safe Biome formatting and lint fixes |
| `bun run dev` | Start the Vite development server |
| `bun run format` | Format supported files with Biome |
| `bun run lint` | Run the Biome linter |
| `bun run preview` | Preview the production build locally |
| `bun run test` | Run the test suite once |
| `bun run capture:showcase` | Recreate the README screenshots and the GitHub and Open Graph previews |

## Before submitting a change

Run the same essential checks used by continuous deployment:

```bash
bun run check
bun run test
bun run build
```

Add or update tests when a calculation changes. Keep dependencies pinned to exact versions and commit `bun.lock` when dependency resolution changes. Biome configuration preserves the project’s single-quote, semicolon-as-needed style; Knip should pass without blanket suppressions.

Pull requests targeting `master` run these quality checks automatically. Merges to `master` update the Release Please pull request. Merging that release pull request creates a version tag and GitHub release, then builds and deploys that exact release to GitHub Pages.

Release Please uses Conventional Commit prefixes to determine the next version: `fix:` creates a patch release, `feat:` creates a minor release, and a `!` or `BREAKING CHANGE:` footer creates a major release. Configure a `RELEASE_PLEASE_TOKEN` repository secret so automated release pull requests trigger the required CI workflow; the workflow falls back to `GITHUB_TOKEN` for repositories that do not require that check.

## Product and privacy conventions

- Keep every calculation in the browser. A change should not require secrets or a server.
- Never send entered figures anywhere, including as analytics event properties.
- When a fee or price changes, update the constant in `src/lib/budget-calculator.ts` and its entry under **Key Assumptions & Sources** together, with the source.
- Keep defaults overridable, and present them as estimates rather than quotes.
- Do not claim affiliation with DEWA, the Dubai Land Department, or any other provider or authority.

## Analytics

Umami is disabled while `UMAMI_WEBSITE_ID` in `src/analytics.ts` is empty. Once an ID is set, it loads only on the production site at `gruz0.github.io`; development and local preview builds do not send events. The only custom events are `budget_calculated` and `pdf_download_clicked`, sent without properties.

## Regenerating showcase images

With Google Chrome installed, run:

```bash
bun run capture:showcase
```

The script starts the planner on port 4173, drives the built-in starting points with Playwright, replaces the images in `public/showcase`, and composes the GitHub (`1280×640`) and Open Graph (`1200×630`) previews from the budget overview. Move-out reminders are dated relative to the day the script runs, so that part of the yearly-calendar image changes between runs.

## Deployment

The workflow in `.github/workflows/ci.yml` validates pull requests against `master`. The workflow in `.github/workflows/release.yml` maintains the Release Please pull request and deploys GitHub Pages only after that pull request is merged and a release is created. A manual release run can rebuild and redeploy an existing `vMAJOR.MINOR.PATCH` tag.
