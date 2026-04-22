# TripleTen OTG Calculator — Calculation Logic

This document explains, step by step, how the OTG Calculator computes all dates and determines a student's Money-Back Guarantee (MBG) eligibility. It is intended for internal use by Learning Coaches (LCs) and academic advisors.

---

## Inputs

The calculator takes three inputs from the user:

| Input | Description |
|---|---|
| **Program** | The student's enrolled program. Each program has a fixed standard duration and a maximum number of allowed extension weeks. |
| **Starting Cohort Date** | The official date the student's cohort began. Must be **November 14, 2024 or later** (OTG day-based schedule). |
| **Extra Weeks Used** | The number of extension weeks the student has consumed so far (enter 0 if the student is on track). |

---

## Program Reference Table

| Program | Standard Duration | OTC Deadline (1.5x) |
|---|---|---|
| Software Engineering (PT) | 266 days | 399 days |
| AI Software Engineering (PT) | 168 days | 252 days |
| AI Software Engineering (FT) | 98 days | 147 days |
| AI & Machine Learning | 252 days | 378 days |
| Quality Assurance | 140 days | 210 days |
| Business Intelligence Analytics | 112 days | 168 days |
| AI Automation | 98 days | 147 days |
| Data Analytics | 98 days | 147 days |
| Software Engineering (FT) | **Variable** | **1.5x Duration** |
| Cyber Security (PT) | **Variable** | **1.5x Duration** |
| Cyber Security (FT) | **Variable** | **1.5x Duration** |
| Data Science | **Variable** | **1.5x Duration** |
| UX/UI Design | **Variable** | **1.5x Duration** |

- **Standard Duration**: The expected number of days to complete the program without extensions.
- **OTC Deadline**: The absolute latest date a student can complete and still be eligible for the Guarantee (calculated as Standard Duration * 1.5).

---

## Cohort-based Duration Tiers

Several programs have a **variable standard duration** depending on the student's cohort start date. The system automatically resolves the correct duration — no manual selection is needed.

### Software Engineering (Full-time)
| Cohort Start Date Range | Standard Duration |
|---|---|
| Nov 14, 2024 – May 14, 2025 | **120 days** |
| May 15, 2025 – Dec 29, 2025 | **126 days** |
| Dec 30, 2025 – onwards | **154 days** |

### Cyber Security (Part-time)
| Cohort Start Date Range | Standard Duration |
|---|---|
| Nov 14, 2024 – Dec 29, 2025 | **196 days** |
| Dec 30, 2025 – Feb 12, 2026 | **203 days** |
| Feb 13, 2026 – onwards | **210 days** |

### Cyber Security (Full-time)
| Cohort Start Date Range | Standard Duration |
|---|---|
| Nov 14, 2024 – Dec 29, 2025 | **91 days** |
| Dec 30, 2025 – Feb 12, 2026 | **112 days** |
| Feb 13, 2026 – onwards | **119 days** |

### Data Science
| Cohort Start Date Range | Standard Duration |
|---|---|
| Nov 14, 2024 – Mar 09, 2025 | **224 days** |
| Mar 10, 2025 – onwards | **231 days** |

### UX/UI Design
| Cohort Start Date Range | Standard Duration |
|---|---|
| Nov 14, 2024 – May 14, 2025 | **140 days** |
| May 15, 2025 – onwards | **147 days** |

> [!NOTE]
> All cohorts begin on a Thursday. The maximum allowed extension weeks remain fixed for a given program across all its tiers.

A **"Cohort-based duration"** badge is shown in the UI next to the Program Duration when a student in a variable-duration program is selected.

---

## Step-by-Step Calculation

All examples below use: **Program = Quality Assurance, Start Date = March 12, 2026.**

---

### Step 1 — Standard End Date

The **Standard End Date** is the target completion date without extensions.

```
Standard End Date = Start Date + Standard Duration (days)
```

**Example:**
```
Standard Duration = 140 days
Standard End Date = March 12, 2026 + 140 days = July 30, 2026 (Thursday)
```

---

### Step 2 — OTC Deadline

The **OTC Deadline** is the absolute limit for eligibility.

```
OTC Deadline = Start Date + (Standard Duration × 1.5)
```

**Example:**
```
OTC Deadline = March 12, 2026 + (140 × 1.5)
             = March 12, 2026 + 210 days
             = October 8, 2026 (Thursday)
```

A student who successfully completes the final sprint on **Wednesday, October 7** is still fully eligible. Starting **Thursday, October 8**, they are no longer eligible.

---

### Step 3 — Actual End Date

The **Actual End Date** is the projected completion date based on extensions used.

```
Actual End Date = Standard End Date + (Weeks Used × 7)
```

---

### Step 4 — MBG Status

The student's eligibility status is determined by comparing **Today's** position on the timeline against the **OTC Deadline**:

| Condition | Status | Meaning |
|---|---|---|
| Today ≤ Standard End Date | ✅ Within Regular Time | Student is on track. |
| Today ≤ OTC Deadline | ⏳ Within OTC Period (Eligible) | Student is within the 1.5x extension limit. |
| Today > OTC Deadline | ❌ Exceeded OTC Deadline | Student has passed the absolute limit. |

---

### Step 5 — Legal Notice Date

When a student's status is **Exceeded**, a [Legal Notice](https://www.notion.so/coding-bootcamps/MBG-Legal-Notice-LCs-ex-waivers-1c76ed1efc9380e4b7d0e1f32eb98eed#2ee6ed1efc938090bf00c09fad2f3485) must be sent to them as soon as possible. The Legal Notice is a formal document requested by the legal team to inform the student of their MBG ineligibility and its consequences — and to help prevent potential complaints after completion.

```
```

The calculator displays a **Legal Notice Required** alert banner whenever the student has exceeded the limit, showing the phrasing **"Send after [OTC Deadline Date]"**.

---

## Complete Walk-Through Example

> **Inputs**: Program = Quality Assurance, Start Date = March 12, 2026.

| Step | Calculation | Result |
|---|---|---|
| Standard Duration | Fixed for QA | **140 days** |
| Standard End Date | Mar 12, 2026 + 140 days | **Jul 30, 2026** |
| OTC Deadline | Mar 12, 2026 + 210 days | **Oct 8, 2026** |
| Status (if Today > Oct 8) | Exceeded | **❌ Exceeded OTC Deadline** |
| Legal Notice | "Send after..." | **Send after Oct 8, 2026** |

---

## Key Rules Summary

1. The **OTC Deadline** is always **1.5x the Standard Duration** from the Start Date.
2. If the current date is past the OTC Deadline, the student is ineligible for the Guarantee.
3. A **Legal Notice** must be sent to students who breach this deadline.
4. This calculator applies to students starting from **November 14, 2024** onward (OTG day-based schedule).