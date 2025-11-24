# Life Plan Simulator

## Overview
This project provides an interactive web application for simulating long-term financial scenarios. Users can adjust life events such as retirement age, annual spending, expected investment returns, and inflation in order to understand how their savings may evolve over time.

## Features
- Interactive form for configuring savings, contributions, and retirement assumptions
- Year-by-year projection of savings balance including contributions, investment growth, and withdrawals
- Automatic highlighting of the retirement year and the first year where planned withdrawals are not fully covered
- Summary view showing total contributions, withdrawals, final balance, and the number of years retirement spending is covered
- TypeScript-based domain logic with unit tests to guarantee key calculations

## Getting Started
```bash
npm install
npm run dev
```
The development server runs on Vite. Open the provided URL in your browser to use the simulator.

## Available Scripts
- `npm run dev`: Start the development server
- `npm run build`: Create an optimized production build
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint checks
- `npm run test`: Execute unit tests with Vitest

## Testing
Unit tests focus on the calculation engine under `src/lib/simulation.ts`. The tests validate:
- Full timeline generation between the current age and the selected life expectancy
- Detection of retirement milestones and shortfall scenarios
- Growth of contributions during working years and validation of input rules

Run the test suite at any time with:
```bash
npm run test
```
