# TripleTen MBG Calculator — Calculation Logic

This document explains, step by step, how the MBG Calculator computes all dates and determines a student's Money-Back Guarantee (MBG) eligibility.

---

## Inputs

The calculator takes three inputs from the user:

| Input | Description |
|---|---|
| **Program** | The student's enrolled program (e.g. QA, WEB, DS). Each program has a fixed total duration in days and a maximum number of allowed extension weeks. |
| **Starting Cohort Date** | The official date the student's cohort began. Must be **November 14, 2024 or later**. |
| **Extra Weeks Used** | The number of extension weeks the student has consumed so far (0 if on track). |

---

## Program Reference Table

Each program has two fixed values defined in the code:

| Program | Total Days | Max Extension Weeks |
|---|---|---|
| AISE | 252 | 12 |
| AIML | 378 | 18 |
| QA | 210 | 10 |
| BI | 168 | 8 |
| CSA | **Variable** *(see CSA Duration Tiers below)* | 14 |
| UXUI | 221 | 10 |
| AI Automation (AIA) | 147 | 7 |
| DS | 347 | 17 |
| WEB | 399 | 19 |

- **Total Days**: The full program span including the extension period.
- **Max Extension Weeks**: The number of weeks a student can extend and still remain MBG eligible.

---

## CSA Duration Tiers

The Cybersecurity (CSA) program has a **variable standard duration** depending on the student's cohort start date. The system automatically resolves the correct duration based on the date entered — no manual selection needed.

| Cohort Start Date Range | Standard Duration | Total Days (incl. 14 ext. weeks) |
|---|---|---|
| Nov 14, 2024 – Dec 29, 2025 | **196 days** | 294 days |
| Dec 30, 2025 – Feb 12, 2026 | **203 days** | 301 days |
| Feb 13, 2026 – present | **210 days** | 308 days |

> [!NOTE]
> All CSA cohorts begin on a Thursday, so start dates naturally fall cleanly within one of the three ranges above. The maximum allowed extension weeks remain **14 weeks** for all CSA tiers.

- **Standard Duration** = the expected completion time with zero extensions (what the calculator uses as the Standard End Date offset).
- **Total Days** = Standard Duration + (14 × 7 days) = the full span used internally to derive the MBG Deadline.

When a CSA student's start date is entered, the calculator uses this table to determine the correct Standard Duration for all subsequent calculations. A **"Cohort-based duration"** badge is displayed in the UI alongside the Program Duration to signal this special behavior.

---

## Step-by-Step Calculation

### Step 1 — Standard End Date

The **Standard End Date** is the date by which a student should complete their program if they use **zero extension weeks**.

```
Standard Duration (days) = Total Days − (Max Extension Weeks × 7)
Standard End Date        = Start Date + Standard Duration (days)
```

**QA Example** (Starting March 11, 2026):
```
Standard Duration = 210 − (10 × 7) = 210 − 70 = 140 days
Standard End Date = March 11, 2026 + 140 days = July 29, 2026
```

---

### Step 2 — MBG Deadline

The **MBG Deadline** is the absolute latest date a student can complete the program and **still be eligible** for the Money-Back Guarantee.

```
MBG Deadline = Standard End Date + (Max Extension Weeks × 7) + 7
```

> The extra **+7 days** is a built-in cycle buffer. It ensures that the student is eligible for the **entire final extension week**, not just up to the moment it starts.

**Why the +7 days?**
Without this buffer, a student who uses all 10 extension weeks would land exactly on the Monday that the 11th week *begins* — meaning their last eligible day would technically be 1 day before. The +7 days shifts the deadline to the **end** of the 10th week (Sunday night), giving the student the full 7 days of that final week.

**QA Example** (Starting March 11, 2026):
```
MBG Deadline = July 29, 2026 + (10 × 7) + 7
             = July 29, 2026 + 77 days
             = October 14, 2026
```

So if the 10th extension week starts on Thursday, October 8, 2026, the student has until **October 14, 2026 (Wednesday)** to complete their project and still be fully eligible.

---

### Step 3 — Christmas Break Credit (Automatic)

The calculator checks whether the student's study period (from Start Date to Standard End Date) overlaps with any of the pre-defined Christmas holiday breaks:

| Break Period |
|---|
| Dec 23, 2024 – Jan 5, 2025 |
| Dec 22, 2025 – Jan 4, 2026 |
| Dec 21, 2026 – Jan 3, 2027 |
| Dec 20, 2027 – Jan 2, 2028 |
| Dec 25, 2028 – Jan 7, 2029 |

**Overlap rule:** The student qualifies if their Start Date is before the end of the break AND their Standard End Date is on or after the start of the break.

If the student qualifies **and** has used at least 1 extension week, they receive an automatic **1-week credit**:

```
Effective Extra Weeks = Extra Weeks Used − 1   (if Christmas Break applies)
Effective Extra Weeks = Extra Weeks Used        (if no Christmas Break)
```

Effective Extra Weeks cannot go below 0.

---

### Step 4 — Actual End Date

The **Actual End Date** is where the student will realistically finish, based on how many effective extension weeks they have used.

```
If Effective Extra Weeks = 0:
    Actual End Date = Standard End Date

If Effective Extra Weeks > 0:
    Actual End Date = Standard End Date + (Effective Extra Weeks × 7) + 7
```

The same +7 day cycle buffer is applied here so that the Actual End Date always reflects the full end of the student's last extension week.

---

### Step 5 — MBG Status

The student's eligibility status is determined by comparing **Effective Extra Weeks** against the program's **Max Extension Weeks**:

| Condition | Status | Meaning |
|---|---|---|
| Effective Extra Weeks = 0 | ✅ Within Regular Time | Student is fully on track, no extensions used. |
| Effective Extra Weeks ≤ Max Extension Weeks | ⏳ Within MBG Period (Eligible) | Student used extensions but is still within the allowed limit. |
| Effective Extra Weeks > Max Extension Weeks | ❌ Exceeded MBG Deadline | Student used too many extensions and has lost MBG eligibility. |

---

## Full QA Example Walk-Through

> **Inputs**: Program = QA, Start Date = March 11, 2026, Extra Weeks Used = 10

| Calculated Value | Result |
|---|---|
| Standard Duration | 210 − 70 = **140 days** |
| Standard End Date | March 11 + 140 = **July 29, 2026** |
| Christmas Break Credit | No overlap → **0 credit** |
| Effective Extra Weeks | 10 − 0 = **10 weeks** |
| Actual End Date | July 29 + (10×7) + 7 = **October 14, 2026** |
| MBG Deadline | July 29 + (10×7) + 7 = **October 14, 2026** |
| Status | 10 ≤ 10 → **⏳ Within MBG Period (Eligible)** |

---

## Key Rules Summary

1. The Standard End Date is calculated **forward** from the Start Date using only the regular (non-extension) duration.
2. All extensions are calculated **forward** from the Standard End Date.
3. A **+7 day cycle buffer** is always applied to the MBG Deadline and Actual End Date whenever extensions are present, ensuring the student has the full benefit of each extension week including its 7th and final day.
4. The Christmas Break credit automatically reduces the effective extra weeks count by 1 if the student's study window overlaps with a holiday break.
5. This calculator only applies to students starting from **November 14, 2024** onward (OTG day-based schedule).
