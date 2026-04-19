# TripleTen MBG Calculator — Calculation Logic

This document explains, step by step, how the MBG Calculator computes all dates and determines a student's Money-Back Guarantee (MBG) eligibility. It is intended for internal use by Learning Coaches (LCs) and academic advisors.

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

| Program | Standard Duration | Max Extension Weeks |
|---|---|---|
| Software Engineering (Part-time) | 266 days | 19 weeks |
| AI Software Engineering (Part-time) | 168 days | 12 weeks |
| AI Software Engineering (Full-time) | 98 days | 12 weeks |
| AI & Machine Learning | 252 days | 18 weeks |
| Quality Assurance | 140 days | 10 weeks |
| Business Intelligence Analytics | 112 days | 8 weeks |
| AI Automation | 98 days | 7 weeks |
| Data Analitics New program | 98 days | 8 weeks |
| Software Engineering (Full-time) | **Variable** *(see Duration Tiers below)* | 19 weeks |
| Cyber Security (Part-time) | **Variable** *(see Duration Tiers below)* | 14 weeks |
| Cyber Security (Full-time) | **Variable** *(see Duration Tiers below)* | 14 weeks |
| Data Science | **Variable** *(see Duration Tiers below)* | 17 weeks |
| UX/UI Design | **Variable** *(see Duration Tiers below)* | 10 weeks |

- **Standard Duration**: The expected number of days to complete the program with zero extensions.
- **Max Extension Weeks**: The maximum number of weeks a student can extend and still remain MBG eligible.

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

All examples below use: **Program = Quality Assurance, Start Date = March 11, 2026.**

---

### Step 1 — Standard End Date

The **Standard End Date** is the expected graduation date if the student uses **zero extension weeks**.

```
Standard End Date = Start Date + Standard Duration (days)
```

**Example:**
```
Standard Duration = 140 days  (fixed for QA)
Standard End Date = March 11, 2026 + 140 days = July 29, 2026 (Wednesday)
```

> [!NOTE]
> All TripleTen extension weeks run **Thursday → Wednesday**. Because cohorts start on Thursdays, the Standard End Date always lands on a Wednesday — which is the last day before the next extension week begins.

---

### Step 2 — MBG Deadline

The **MBG Deadline** is the absolute latest date a student can complete the program and **still be eligible** for the Money-Back Guarantee. No extensions can push this date forward — it is a hard limit.

```
MBG Deadline = Standard End Date + (Max Extension Weeks × 7)
```

**Example:**
```
MBG Deadline = July 29, 2026 + (10 × 7)
             = July 29, 2026 + 70 days
             = October 7, 2026 (Wednesday)
```

A student who successfully completes the final sprint on **Wednesday, October 7** is still fully eligible. Starting **Thursday, October 8**, they are no longer eligible.

---

### Step 3 — Actual End Date

The **Actual End Date** is the projected completion date based on how many extension weeks the student has used.

```
Actual End Date = Standard End Date + (Extra Weeks Used × 7)
```

**Example (5 extra weeks used):**
```
Actual End Date = July 29, 2026 + (5 × 7)
               = July 29, 2026 + 35 days
               = September 2, 2026 (Wednesday)
```

---

### Step 4 — MBG Status

The student's eligibility status is determined by comparing **Extra Weeks Used** against the program's **Max Extension Weeks**:

| Condition | Status | Meaning |
|---|---|---|
| Extra Weeks Used = 0 | ✅ Within Regular Time | Student is on track. No extensions used. |
| Extra Weeks Used ≤ Max Extension Weeks | ⏳ Within MBG Period (Eligible) | Student used extensions but is within the allowed limit. |
| Extra Weeks Used > Max Extension Weeks | ❌ Exceeded MBG Deadline | Student used too many extensions. MBG eligibility is lost. |

---

### Step 5 — Legal Notice Date

When a student's status is **Exceeded**, a [Legal Notice](https://www.notion.so/coding-bootcamps/MBG-Legal-Notice-LCs-ex-waivers-1c76ed1efc9380e4b7d0e1f32eb98eed#2ee6ed1efc938090bf00c09fad2f3485) must be sent to them as soon as possible. The Legal Notice is a formal document requested by the legal team to inform the student of their MBG ineligibility and its consequences — and to help prevent potential complaints after graduation.

```
Legal Notice Deadline = MBG Deadline + 2 days
```

**Example:**
```
MBG Deadline          = October 7, 2026 (Wed) ← Last eligible day
Student ineligible as of = October 8, 2026 (Thu) ← Week 11 begins
Legal Notice Deadline = October 7 + 2 = October 9, 2026 (Fri)
```

The calculator displays a **Legal Notice Required** alert banner whenever the student has exceeded the MBG limit, showing the exact send-by date.

---

## Complete Walk-Through Example

> **Inputs**: Program = Quality Assurance, Start Date = March 11, 2026, Extra Weeks Used = 11

| Step | Calculation | Result |
|---|---|---|
| Standard Duration | Fixed for QA | **140 days** |
| Standard End Date | Mar 11, 2026 + 140 days | **Jul 29, 2026 (Wed)** |
| Program Duration Banner | Shown in results column | **140 days** |
| MBG Deadline | Jul 29 + (10×7) | **Oct 7, 2026 (Wed)** |
| Actual End Date | Jul 29 + (11×7) | **Oct 14, 2026 (Wed)** |
| Status | 11 > 10 | **❌ Exceeded MBG Deadline** |
| Legal Notice Deadline | Oct 7 + 2 days | **Oct 9, 2026 (Fri)** |

---

## Key Rules Summary

1. The **Standard End Date** is calculated forward from the Start Date using the program's fixed Standard Duration.
2. Extension weeks run **Thursday → Wednesday** (7 days). The Standard End Date always lands on a Wednesday.
3. When a student **Exceeds** the MBG limit, a **Legal Notice must be sent within 2 days** of the MBG Deadline.
4. This calculator only applies to students starting from **November 14, 2024** onward (OTG day-based schedule).