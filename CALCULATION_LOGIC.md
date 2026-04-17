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
| AI Software Engineering | 168 days | 12 weeks |
| AI & Machine Learning | 252 days | 18 weeks |
| Quality Assurance | 140 days | 10 weeks |
| Business Intelligence Analytics | 112 days | 8 weeks |
| Cybersecurity Analyst | **Variable** *(see CSA Duration Tiers below)* | 14 weeks |
| UX/UI Design | 151 days | 10 weeks |
| AI Automation | 98 days | 7 weeks |
| Data Science | 228 days | 17 weeks |
| Web Development | 266 days | 19 weeks |

- **Standard Duration**: The expected number of days to complete the program with zero extensions.
- **Max Extension Weeks**: The maximum number of weeks a student can extend and still remain MBG eligible.

---

## CSA Duration Tiers

The Cybersecurity Analyst program has a **variable standard duration** depending on the student's cohort start date. The system automatically resolves the correct duration — no manual selection is needed.

| Cohort Start Date Range | Standard Duration |
|---|---|
| Nov 14, 2024 – Dec 29, 2025 | **196 days** |
| Dec 30, 2025 – Feb 12, 2026 | **203 days** |
| Feb 13, 2026 – present | **210 days** |

> [!NOTE]
> All CSA cohorts begin on a Thursday, so start dates naturally fall cleanly within one of the three ranges. The maximum allowed extension weeks remain **14 weeks** for all CSA tiers.

A **"Cohort-based duration"** badge is shown in the UI next to the Program Duration when a CSA student is selected.

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
MBG Deadline = Standard End Date + (Max Extension Weeks × 7) + 7
```

**Why the extra +7 days?**
Extension weeks run Thursday → Wednesday (7 days). Without the +7 buffer, the deadline would fall on the *Thursday that the final week begins* — meaning the student wouldn't actually have any of that week to work in. The +7 shifts the deadline to the *Wednesday that ends the final week*, giving the student **all 7 days of their last allowed extension week**.

**Example:**
```
MBG Deadline = July 29, 2026 + (10 × 7) + 7
             = July 29, 2026 + 77 days
             = October 14, 2026 (Wednesday)
```

**Week-by-week breakdown of the final extension week:**

| Day | Date | Notes |
|---|---|---|
| Day 1 | Thu, Oct 8 | Week 10 begins |
| Day 2 | Fri, Oct 9 | |
| Day 3 | Sat, Oct 10 | |
| Day 4 | Sun, Oct 11 | |
| Day 5 | Mon, Oct 12 | |
| Day 6 | Tue, Oct 13 | |
| **Day 7** | **Wed, Oct 14** | **Last eligible day (MBG Deadline)** |
| — | Thu, Oct 15 | Week 11 begins → Student is now ineligible |

A student who successfully completes the final sprint on **Wednesday, October 14** is still fully eligible. Starting **Thursday, October 15**, they are no longer eligible.

---

### Step 3 — Christmas Break Credit (Automatic)

The calculator automatically checks whether the student's study period (Start Date → Standard End Date) overlaps with any pre-defined Christmas holiday break. If it does, the student receives a **1-week automatic credit**.

**Defined break periods (always exactly 7 calendar days):**

| Break Period |
|---|
| Dec 25, 2024 – Jan 1, 2025 |
| Dec 25, 2025 – Jan 1, 2026 |
| Dec 25, 2026 – Jan 1, 2027 |
| Dec 25, 2027 – Jan 1, 2028 |
| Dec 25, 2028 – Jan 1, 2029 |

**Overlap rule:** A student qualifies if their Start Date is before the break ends AND their Standard End Date is on or after the break starts.

```
Effective Extra Weeks = Extra Weeks Used − 1   (if Christmas Break applies and Extra Weeks > 0)
Effective Extra Weeks = Extra Weeks Used        (if no Christmas Break applies)
```

> [!NOTE]
> Effective Extra Weeks cannot go below 0. The credit only applies if the student has used at least 1 extension week.

**Example (Christmas credit scenario):**
A student starting **November 14, 2024** on the QA program has a Standard End Date of **April 3, 2025**. Their study period overlaps with the Dec 23, 2024 – Jan 5, 2025 break — so they automatically receive a 1-week credit. If they entered 3 extra weeks used, their Effective Extra Weeks = **2**.

---

### Step 4 — Actual End Date

The **Actual End Date** is the projected completion date based on how many extension weeks the student has effectively used.

```
If Effective Extra Weeks = 0:
    Actual End Date = Standard End Date

If Effective Extra Weeks > 0:
    Actual End Date = Standard End Date + (Effective Extra Weeks × 7) + 7
```

The same +7 day cycle buffer is applied so that the Actual End Date always reflects the **last day of the student's final used extension week** (Wednesday), not the first day of it.

**Example (5 extra weeks used, no Christmas credit):**
```
Actual End Date = July 29, 2026 + (5 × 7) + 7
               = July 29, 2026 + 42 days
               = September 9, 2026 (Wednesday)
```

---

### Step 5 — MBG Status

The student's eligibility status is determined by comparing **Effective Extra Weeks** against the program's **Max Extension Weeks**:

| Condition | Status | Meaning |
|---|---|---|
| Effective Extra Weeks = 0 | ✅ Within Regular Time | Student is on track. No extensions used. |
| Effective Extra Weeks ≤ Max Extension Weeks | ⏳ Within MBG Period (Eligible) | Student used extensions but is within the allowed limit. |
| Effective Extra Weeks > Max Extension Weeks | ❌ Exceeded MBG Deadline | Student used too many extensions. MBG eligibility is lost. |

---

### Step 6 — Legal Notice Date

When a student's status is **Exceeded**, a [Legal Notice](https://www.notion.so/coding-bootcamps/MBG-Legal-Notice-LCs-ex-waivers-1c76ed1efc9380e4b7d0e1f32eb98eed#2ee6ed1efc938090bf00c09fad2f3485) must be sent to them as soon as possible. The Legal Notice is a formal document requested by the legal team to inform the student of their MBG ineligibility and its consequences — and to help prevent potential complaints after graduation.

```
Legal Notice Deadline = MBG Deadline + 2 days
```

**Example:**
```
MBG Deadline          = October 14, 2026 (Wed) ← Last eligible day
Student ineligible as of = October 15, 2026 (Thu) ← Week 11 begins
Legal Notice Deadline = October 14 + 2 = October 16, 2026 (Fri)
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
| Christmas Break Credit | No overlap | **0 credit** |
| Effective Extra Weeks | 11 − 0 | **11 weeks** |
| MBG Deadline | Jul 29 + (10×7) + 7 | **Oct 14, 2026 (Wed)** |
| Actual End Date | Jul 29 + (11×7) + 7 | **Oct 21, 2026 (Wed)** |
| Status | 11 > 10 | **❌ Exceeded MBG Deadline** |
| Legal Notice Deadline | Oct 14 + 2 days | **Oct 16, 2026 (Fri)** |

---

## Key Rules Summary

1. The **Standard End Date** is calculated forward from the Start Date using the program's fixed Standard Duration.
2. Extension weeks run **Thursday → Wednesday** (7 days). The Standard End Date always lands on a Wednesday.
3. A **+7 day cycle buffer** is applied to both the MBG Deadline and Actual End Date whenever extensions are present — ensuring students have the full 7 days of their final extension week, including the last day (Wednesday).
4. The **Christmas Break credit** automatically reduces Effective Extra Weeks by 1 if the student's study window overlaps a holiday break.
5. When a student **Exceeds** the MBG limit, a **Legal Notice must be sent within 2 days** of the MBG Deadline.
6. This calculator only applies to students starting from **November 14, 2024** onward (OTG day-based schedule).