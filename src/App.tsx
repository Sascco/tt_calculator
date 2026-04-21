import React, { useState, useMemo } from 'react';
import { addWeeks, addDays, differenceInDays, format, isBefore, parseISO, isValid } from 'date-fns';
import { Calendar, Clock, AlertCircle, CheckCircle2, XCircle, Info, Calculator, GraduationCap, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function Tooltip({ text }: { text: string }) {
  return (
    <span className="relative group inline-flex items-center ml-1 align-middle">
      <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 text-xs text-white bg-slate-800 rounded-lg p-2.5 shadow-lg invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none leading-relaxed">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
      </span>
    </span>
  );
}

type ProgramTier = {
  from: Date;
  to: Date | null;
  days: number;
};

type ProgramFormat = {
  name: string;
  mbgWeeks: number;
  defaultDays: number;
  tiers?: ProgramTier[];
  availableFrom?: string;
  availableTo?: string;
  unavailablePeriods?: { from: string; to: string }[];
};

const PROGRAMS: Record<string, ProgramFormat> = {
  // Software Engineering
  'SE_PT': {
    name: 'Software Engineering (Part-time)',
    mbgWeeks: 19,
    defaultDays: 266,
  },
  'SE_FT': {
    name: 'Software Engineering (Full-time)',
    mbgWeeks: 19,
    defaultDays: 120, // using the earliest known figure
    tiers: [
      { from: parseISO('2024-11-14'), to: parseISO('2025-03-09'), days: 120 },
      { from: parseISO('2025-03-10'), to: parseISO('2025-05-14'), days: 120 },
      { from: parseISO('2025-05-15'), to: parseISO('2025-12-29'), days: 126 },
      { from: parseISO('2025-12-30'), to: null, days: 154 },
    ]
  },
  // Data Science
  'DS_NEW': {
    name: 'Data Science',
    mbgWeeks: 17,
    defaultDays: 224,
    tiers: [
      { from: parseISO('2024-11-14'), to: parseISO('2025-03-09'), days: 224 },
      { from: parseISO('2025-03-10'), to: null, days: 231 },
    ]
  },
  // Quality Assurance
  'QA_NEW': {
    name: 'Quality Assurance',
    mbgWeeks: 10,
    defaultDays: 140,
  },
  // BI Analyst
  'BI_NEW': {
    name: 'Business Intelligence Analytics',
    mbgWeeks: 8,
    defaultDays: 112,
    availableTo: '2026-02-19',
  },
  // Cybersecurity Analyst
  'CSA_PT': {
    name: 'Cyber Security (Part-time)',
    mbgWeeks: 14,
    defaultDays: 196,
    tiers: [
      { from: parseISO('2024-11-14'), to: parseISO('2025-12-29'), days: 196 },
      { from: parseISO('2025-12-30'), to: parseISO('2026-02-12'), days: 203 },
      { from: parseISO('2026-02-13'), to: null, days: 210 },
    ]
  },
  'CSA_FT': {
    name: 'Cyber Security (Full-time)',
    mbgWeeks: 14, 
    defaultDays: 91,
    tiers: [
      { from: parseISO('2024-11-14'), to: parseISO('2025-12-29'), days: 91 },
      { from: parseISO('2025-12-30'), to: parseISO('2026-02-12'), days: 112 },
      { from: parseISO('2026-02-13'), to: null, days: 119 },
    ]
  },
  // UX/UI Design
  'UXUI_NEW': {
    name: 'UX/UI Design',
    mbgWeeks: 10,
    defaultDays: 140,
    tiers: [
      { from: parseISO('2024-11-14'), to: parseISO('2025-05-14'), days: 140 },
      { from: parseISO('2025-05-15'), to: null, days: 147 },
    ]
  },
  // AI Automation
  'AIAUTO_NEW': {
    name: 'AI Automation',
    mbgWeeks: 7,
    defaultDays: 98,
  },
  // AI and Machine Learning
  'AIML_NEW': {
    name: 'AI & Machine Learning',
    mbgWeeks: 18,
    defaultDays: 252,
    availableFrom: '2025-10-09',
  },
  // AI Software Engineering
  'AISE_PT': {
    name: 'AI Software Engineering (Part-time)',
    mbgWeeks: 12,
    defaultDays: 168,
    unavailablePeriods: [{ from: '2026-01-23', to: '2026-03-11' }],
  },
  'AISE_FT': {
    name: 'AI Software Engineering (Full-time)',
    mbgWeeks: 12,
    defaultDays: 98,
    unavailablePeriods: [{ from: '2026-01-23', to: '2026-03-11' }],
  },
  // Data Analitics
  'DA_NEW': {
    name: 'Data Analitics New program',
    mbgWeeks: 8,
    defaultDays: 98,
    availableFrom: '2026-03-26',
    tiers: [
      { from: parseISO('2026-03-26'), to: null, days: 98 },
    ]
  }
};

type ProgramKey = keyof typeof PROGRAMS;

function getStandardDays(programKey: ProgramKey, startDate: Date): number {
  const prog = PROGRAMS[programKey];
  if (prog.tiers) {
    const tier = prog.tiers.find(t =>
      !isBefore(startDate, t.from) && (t.to === null || isBefore(startDate, addDays(t.to, 1)))
    );
    if (tier) return tier.days;
  }
  return prog.defaultDays;
}

export default function App() {
  const [program, setProgram] = useState<ProgramKey>('QA_NEW');
  const [startDate, setStartDate] = useState<string>('2024-11-14');
  const [extraWeeks, setExtraWeeks] = useState<number | string>(0);

  // Validation
  const minDate = parseISO('2024-11-14');
  const parsedStartDate = parseISO(startDate);
  const isValidDate = isValid(parsedStartDate);
  const isBeforeMinDate = isValidDate && isBefore(parsedStartDate, minDate);
  // All TripleTen cohorts start on Thursdays (getDay() === 4)
  const isNotThursday = isValidDate && parsedStartDate.getDay() !== 4;

  const today = useMemo(() => new Date(), []);

  // Calculations
  const results = useMemo(() => {
    if (!isValidDate) return null;

    const progData = PROGRAMS[program] as any;
    const numericExtraWeeks = typeof extraWeeks === 'string' ? parseInt(extraWeeks) || 0 : extraWeeks;

    // 1. Calculate Regular End Date
    const regularDurationDays = getStandardDays(program, parsedStartDate);
    const programDays = regularDurationDays + (progData.mbgWeeks * 7);
    const regularEndDate = addDays(parsedStartDate, regularDurationDays);

    // 2. Calculate MBG Deadline
    // The MBG Deadline = Standard End Date + (Max Extension Weeks × 7)
    const mbgEndDate = addDays(regularEndDate, progData.mbgWeeks * 7);

    let calculatedExtraWeeks = 0;
    if (isBefore(regularEndDate, today)) {
      const msPassed = differenceInDays(today, regularEndDate);
      calculatedExtraWeeks = Math.ceil(msPassed / 7);
    }
    const effectiveExtraWeeks = calculatedExtraWeeks;

    // 4. Actual End Date
    let actualEndDate;
    if (effectiveExtraWeeks === 0) {
      actualEndDate = regularEndDate;
    } else {
      actualEndDate = addDays(regularEndDate, effectiveExtraWeeks * 7);
    }

    // 5. Status
    // The 7-day cycle buffer is already baked into mbgEndDate and actualEndDate,
    // so eligibility simply checks whether extra weeks are within the program's allowed limit.
    let status: 'regular' | 'mbg' | 'exceeded' = 'regular';
    if (effectiveExtraWeeks === 0) {
      status = 'regular';
    } else if (effectiveExtraWeeks <= progData.mbgWeeks) {
      status = 'mbg';
    } else {
      status = 'exceeded';
    }

    // 6. Legal Notice Date — must be sent within 2 days of the student becoming ineligible
    const legalNoticeDate = addDays(mbgEndDate, 2);

    // 7. Availability Check
    let isAvailable = true;
    if (progData.availableFrom && isBefore(parsedStartDate, parseISO(progData.availableFrom))) {
      isAvailable = false;
    }
    if (progData.availableTo && isBefore(parseISO(progData.availableTo), parsedStartDate)) {
      isAvailable = false;
    }
    if (progData.unavailablePeriods) {
      const isInGap = progData.unavailablePeriods.some((p: any) => 
        !isBefore(parsedStartDate, parseISO(p.from)) && !isBefore(parseISO(p.to), parsedStartDate)
      );
      if (isInGap) isAvailable = false;
    }

    // 8. Today-derived fields
    const daysLeft = differenceInDays(mbgEndDate, today);
    const isProximityAlert = status !== 'exceeded' && daysLeft >= 0 && daysLeft <= 14;

    let legalNoticeUrgency = '';
    if (status === 'exceeded') {
      const urgencyDays = differenceInDays(legalNoticeDate, today);
      if (urgencyDays < 0) {
        legalNoticeUrgency = `Overdue by ${Math.abs(urgencyDays)} day(s)`;
      } else if (urgencyDays === 0) {
        legalNoticeUrgency = 'Send today';
      } else if (urgencyDays === 1) {
        legalNoticeUrgency = 'Due tomorrow';
      } else {
        legalNoticeUrgency = `Due in ${urgencyDays} day(s)`;
      }
    }

    const totalDays = differenceInDays(mbgEndDate, parsedStartDate);
    const daysPassed = differenceInDays(today, parsedStartDate);
    const progressPercent = Math.max(0, Math.min(100, (daysPassed / totalDays) * 100));
    const standardEndPercent = Math.max(0, Math.min(100, (regularDurationDays / totalDays) * 100));

    const todayDerivedFields = {
      daysLeft,
      isProximityAlert,
      legalNoticeUrgency,
      progressPercent,
      standardEndPercent,
      isAvailable,
      today
    };

    return {
      regularEndDate,
      mbgEndDate,
      actualEndDate,
      effectiveExtraWeeks,
      status,
      progData,
      programDays,
      standardDays: regularDurationDays,
      legalNoticeDate,
      todayDerivedFields
    };
  }, [program, startDate, extraWeeks, isValidDate, parsedStartDate, today]);

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <header className="flex items-center gap-3 pb-6 border-b border-slate-200">
          <div className="p-3 bg-[#1A1A1A] text-white rounded-xl shadow-sm">
            <Calculator className="w-6 h-6 text-[#FF8A65]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Tripleten OTC Calculator
            </h1>
            <p className="text-slate-500 mt-1">
              This calculator effectively provides each student's progress based on their starting date while accounting for extension weeks. It also determines ending dates and actual eligibility for the <a href="https://docs.tripleten.com/legal/mbg_terms.html" target="_blank" rel="noopener noreferrer" className="text-[#FF8A65] hover:underline font-medium">Money-Back Guarantee</a>.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Inputs Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#FF8A65]" />
                Student Details
              </h2>

              <div className="space-y-5">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Starting Cohort Date
                    <Tooltip text="The official date the student's cohort began. Must be November 14, 2024 or later. All TripleTen cohorts start on a Thursday — this calculator only applies to students on the new OTG day-based schedule." />
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={cn(
                      "w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow",
                      isBeforeMinDate ? "border-red-300 focus:ring-red-500" :
                      isNotThursday ? "border-amber-300 focus:ring-amber-500" :
                      "border-slate-300 focus:ring-[#FF8A65]"
                    )}
                  />
                  {isBeforeMinDate && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-start gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>This calculator is only applicable to students starting from Nov 14th, 2024.</span>
                    </p>
                  )}
                  {!isBeforeMinDate && isNotThursday && (
                    <p className="mt-1.5 text-xs text-amber-600 flex items-start gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>All TripleTen cohorts start on a Thursday. Please verify this date.</span>
                    </p>
                  )}
                </div>

                {/* Program Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Program
                    <Tooltip text="Select the student's enrolled program. Each program has a fixed duration and a maximum number of allowed extension weeks before MBG eligibility is lost." />
                  </label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value as ProgramKey)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A65] focus:border-transparent transition-shadow"
                  >
                    {Object.entries(PROGRAMS)
                      .sort((a, b) => a[1].name.localeCompare(b[1].name))
                      .map(([key, data]) => (
                        <option key={key} value={key}>{data.name}</option>
                      ))}
                  </select>
                </div>



                {/* Availability Warning */}
                {results && !results.todayDerivedFields.isAvailable && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800 leading-normal font-medium">
                      The selected program was not available at the selected starting date. Please double-check the enrollment data.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Program Duration Banner */}
            {results && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-[#FF8A65]" />
                  <span>Program Duration</span>
                </div>
                <div className="flex items-baseline gap-3 flex-wrap mt-1">
                  <span className="text-3xl font-bold text-slate-900">
                    {results.standardDays} <span className="text-lg font-medium text-slate-500">days</span>
                  </span>
                  {results.progData.tiers && (
                    <span className="text-xs text-[#FF8A65] font-medium bg-[#FFF0EB] px-2.5 py-1.5 rounded-md whitespace-nowrap">
                      Cohort-based
                    </span>
                  )}
                </div>
              </div>
            )}
            
          </div>

          {/* Results Column */}
          <div className="lg:col-span-8 space-y-6">
            {results ? (
              <>
                {/* Status Banner */}
                <div className={cn(
                  "rounded-2xl p-6 border shadow-sm flex items-start gap-4",
                  results.status === 'regular' && "bg-emerald-50 border-emerald-200 text-emerald-900",
                  results.status === 'mbg' && "bg-amber-50 border-amber-200 text-amber-900",
                  results.status === 'exceeded' && "bg-red-50 border-red-200 text-red-900"
                )}>
                  <div className="shrink-0 mt-1">
                    {results.status === 'regular' && <ShieldCheck className="w-8 h-8 text-emerald-600" />}
                    {results.status === 'mbg' && <ShieldAlert className="w-8 h-8 text-amber-600" />}
                    {results.status === 'exceeded' && <ShieldX className="w-8 h-8 text-red-600" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">
                      {results.status === 'regular' && "✅ Within Regular Time"}
                      {results.status === 'mbg' && "⏳ Within MBG Period (Eligible)"}
                      {results.status === 'exceeded' && "❌ Exceeded MBG Deadline"}
                    </h3>
                    <p className="text-sm opacity-90">
                      {results.status === 'regular' && `Student used 0 extra weeks and is fully eligible.`}
                      {results.status === 'mbg' && `Student used ${results.effectiveExtraWeeks} extra weeks (Limit: ${results.progData.mbgWeeks}). Still eligible.`}
                      {results.status === 'exceeded' && `Student used ${results.effectiveExtraWeeks} extra weeks, exceeding the ${results.progData.mbgWeeks} week limit.`}
                    </p>
                  </div>
                </div>

                {/* Legal Notice Banner — shown only when student has exceeded the MBG limit */}
                {results.status === 'exceeded' && (
                  <div className="rounded-2xl p-6 border border-red-300 bg-red-900 text-white shadow-sm flex items-start gap-4">
                    <div className="shrink-0 mt-0.5">
                      <AlertCircle className="w-7 h-7 text-red-300" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold mb-1 text-white">⚠️ Legal Notice Required</h3>
                      <p className="text-sm text-red-100 leading-relaxed">
                        This student is no longer eligible for the Money-Back Guarantee. Per internal policy, a{' '}
                        <a
                          href="https://www.notion.so/coding-bootcamps/MBG-Legal-Notice-LCs-ex-waivers-1c76ed1efc9380e4b7d0e1f32eb98eed#2ee6ed1efc938090bf00c09fad2f3485"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-semibold text-white hover:text-red-200 transition-colors"
                        >
                          Legal Notice
                        </a>{' '}
                        must be sent to the student to formally inform them of their ineligibility and its consequences — and to help prevent potential complaints after completion.
                      </p>
                      <div className="mt-3 inline-flex items-center gap-2 bg-red-800 border border-red-600 rounded-lg px-3 py-2">
                        <Clock className="w-4 h-4 text-red-300 shrink-0" />
                        <span className="text-sm font-semibold text-white">
                          {results.todayDerivedFields.legalNoticeUrgency} 
                          <span className="opacity-75 font-normal ml-2">({format(results.legalNoticeDate, 'MMM do, yyyy')})</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}



                {/* Dates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium uppercase tracking-wider">Standard End Date</span>
                      <Tooltip text="The targeted completion date if the student uses no extensions. Calculated as the MBG Deadline minus the program's maximum allowed extension weeks." />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {format(results.regularEndDate, 'MMM do, yyyy')}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      Target completion date without extensions.
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium uppercase tracking-wider">MBG Deadline (OTG)</span>
                      <Tooltip text="The absolute latest date the student can complete their program and remain eligible for the Money-Back Guarantee. Calculated as Start Date + Program Duration. No extensions can push this date forward." />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {format(results.mbgEndDate, 'MMM do, yyyy')}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      Absolute limit for refund eligibility.
                    </div>
                  </div>
                </div>

                {/* Proximity Alert Banner */}
                {results.todayDerivedFields.isProximityAlert && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                    <div>
                      <h4 className="text-amber-900 font-bold text-sm">Approaching MBG Deadline</h4>
                      <p className="text-amber-800 text-sm">
                        Only {results.todayDerivedFields.daysLeft} day(s) left until the OTG Deadline.
                      </p>
                    </div>
                  </div>
                )}

                {/* Progress Bar Timeline */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mt-4">
                  <h3 className="text-sm font-medium text-slate-500 mb-6 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> <span className="uppercase tracking-wider">Timeline</span>
                    <Tooltip text="A visual representation of the student's progress towards their On-Time Completion and final Money-Back Guarantee deadline." />
                  </h3>
                  
                  {/* Visual Bar */}
                  <div className="relative w-full h-3 bg-slate-100 rounded-full mb-10 overflow-visible border border-slate-200">
                    <div 
                      className="absolute top-0 left-0 h-full bg-[#FF8A65] rounded-full transition-all duration-500 shadow-sm" 
                      style={{ width: `${results.todayDerivedFields.progressPercent}%` }}
                    />
                    
                    {/* Markers */}
                    
                    {/* Start Date */}
                    <div className="absolute top-1/2 -mt-1.5 w-3 h-3 rounded-full bg-slate-300 border-2 border-white z-0" style={{ left: '0%', transform: 'translateX(-50%)' }}>
                      <div className="absolute top-6 left-0 text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:block">Start</div>
                    </div>

                    {/* Standard End Date */}
                    <div 
                      className="absolute top-1/2 -mt-1.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white z-0" 
                      style={{ left: `${results.todayDerivedFields.standardEndPercent}%`, transform: 'translateX(-50%)' }}
                    >
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-xs text-emerald-600 font-medium whitespace-nowrap">Standard End</div>
                    </div>

                    {/* OTG/MBG Deadline */}
                    <div className="absolute top-1/2 -mt-1.5 w-3 h-3 rounded-full bg-red-400 border-2 border-white z-0" style={{ left: '100%', transform: 'translateX(-50%)' }}>
                      <div className="absolute top-6 right-0 text-xs text-red-600 font-medium whitespace-nowrap hidden sm:block">Deadline</div>
                    </div>
                    
                    {/* Today Marker */}
                    <div 
                      className="absolute -top-2 bottom-0 w-1 bg-slate-900 z-10 rounded-full shadow-lg" 
                      style={{ left: `${results.todayDerivedFields.progressPercent}%`, transform: 'translateX(-50%)', height: 'calc(100% + 16px)' }}
                    >
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-900 bg-white px-2 py-1 rounded shadow-sm border border-slate-200 whitespace-nowrap">
                        Today
                      </div>
                    </div>
                  </div>
                </div>

              </>
            ) : (
              <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <Calendar className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Select a Date</h3>
                <p className="text-slate-500 max-w-sm">
                  Enter a valid starting cohort date to see the calculations.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
