# TripleTen OTG Calculator

A React application that calculates student progress, end dates, and Money-Back Guarantee (MBG) eligibility based on cohort start date, program, and extension weeks used.

## Features

- Supports all current TripleTen programs (AISE, AIML, QA, BI, CSA, UXUI, AI Automation, DS, WEB)
- Calculates **Standard End Date** and **MBG Deadline (OTG)** based on day-based program durations
- Automatically detects and applies Christmas break credit (1 week) when the study period overlaps a holiday break
- Displays student status: within regular time, within MBG period, or exceeded MBG deadline
- Valid for students starting from **November 14th, 2024** onwards

## Tech Stack

- **React 19** with TypeScript
- **Vite** — build tool and dev server
- **Tailwind CSS v4** — styling
- **date-fns** — date calculations
- **lucide-react** — icons

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

## Build

```bash
npm run build
```

The production-ready files will be output to the `dist/` folder.

## Deploy

This project is configured for GitHub Pages deployment:

```bash
npm run deploy
```
