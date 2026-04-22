# TripleTen OTC Calculator — Overview

## The Goal
The **TripleTen OTC (On Time Completion) Calculator** is an internal tool designed to ensure Learning Coaches (LCs) have a fast, accurate, and unambiguous way to evaluate a student's eligibility for the On-Time Completion Guarantee.

Instead of manually calculating complex overlapping timelines—such as the standard completion time versus the OTC completion window—this calculator automatically tracks deadlines based on the exact start date and the program's strict predetermined conditions. The fundamental goal is to standardize evaluations and prevent legal liability or operational confusion by alerting the organization prior to (or at) the moment a student breaches OTC eligibility.

---

## How It Works
The calculator relies entirely on **Cohort-based logic**, enforcing that real-world calculations are directly tied to the student's program and when they started.

1. **Intelligent Program Setup:** The system maps out every TripleTen program configuration internally, matching each course with its expected standard duration and absolute OTC deadline.
2. **Date Extraction:** By taking the student's *Starting Cohort Date* (which defaults to Thursdays on the OTC day-based schedule), the system instantly compares that fixed origin against the program's requirements.
3. **Real-time Assessment:** The application determines "Today's" exact position on the timeline in relation to the original start date and absolute deadlines.
4. **Automated State Tracking:** The timeline position is inherently extrapolated based on where "Today" sits relative to the standard completion date. Since we removed the manual input for weeks, human error is completely eliminated. The calculator organically understands if a student is on track, in an OTC grace period, or if they have actively breached the guarantee.

---

## What It Calculates

The UI focuses purely on synthesizing critical dates and urgency factors. Based on the selected program and cohort start date, it outputs the following metrics automatically:

### Core Dates
*   **Standard End Date:** The target completion date mathematically expected if a student completes the course linearly within the standard timeframe.
*   **OTC Deadline:** The absolute, non-negotiable maximum limit. A student can complete their final sprint precisely on this day and still qualify for the On-Time Completion Guarantee. Passing this date voids eligibility.

### Live Metrics (Derived from `Today`)
*   **Program Duration:** The structural length of the program in days (either fixed or variable depending on the start cohort).
*   **Timeline Progress:** A visual percentage bar stretching from the Start Date to the OTC Deadline, demonstrating geographically exactly where "Today" exists within the student's journey.
*   **Proximity Alert:** If `Today` brings the student within a 14-day window of their absolute OTC Deadline, the application triggers a warning that the student is critically close to losing eligibility.

### Legal Determinations
*   **OTC Status:** Dynamically categorizes the student based on the **1.5x completion rule**:
    *   ✅ **Within Regular Time** (Prior to standard completion)
    *   ⏳ **Within OTC Period** (Within the 1.5x OTC completion window)
    *   ❌ **Exceeded OTC Deadline** (Past the 1.5x limit; actively ineligible)
*   **Legal Notice Urgency:** If the student loses OTC eligibility, the calculator provides clear legal instructions: **"Send after [OTC Deadline Date]"**. This ensures students are notified exactly when they lose eligibility as per internal procedures.
