import React, { useState, useMemo } from 'react';
import { addWeeks, addDays, differenceInDays, format, isBefore, parseISO, isValid } from 'date-fns';
import { Calendar, Clock, AlertCircle, CheckCircle2, XCircle, Info, Calculator, GraduationCap, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PROGRAMS = {
  // New Programs (Day-based from Spreadsheet)
  'AISE_NEW': { name: 'AISE', days: 252, mbgWeeks: 12 },
  'AIML_NEW': { name: 'AIML', days: 378, mbgWeeks: 18 },
  'QA_NEW': { name: 'QA', days: 210, mbgWeeks: 10 },
  'BI_NEW': { name: 'BI', days: 168, mbgWeeks: 8 },
  'CSA_NEW': { name: 'CSA', days: 315, mbgWeeks: 14 },
  'UXUI_NEW': { name: 'UXUI', days: 221, mbgWeeks: 10 },
  'AIAUTO_NEW': { name: 'AI Automation (AIA)', days: 147, mbgWeeks: 7 },
  'DS_NEW': { name: 'DS', days: 347, mbgWeeks: 17 },
  'WEB_NEW': { name: 'WEB', days: 399, mbgWeeks: 19 },
};

type ProgramKey = keyof typeof PROGRAMS;

const CHRISTMAS_BREAKS = [
  { start: parseISO('2024-12-23'), end: parseISO('2025-01-05') },
  { start: parseISO('2025-12-22'), end: parseISO('2026-01-04') },
  { start: parseISO('2026-12-21'), end: parseISO('2027-01-03') },
  { start: parseISO('2027-12-20'), end: parseISO('2028-01-02') },
  { start: parseISO('2028-12-25'), end: parseISO('2029-01-07') },
];

export default function App() {
  const [program, setProgram] = useState<ProgramKey>('QA_NEW');
  const [startDate, setStartDate] = useState<string>('2024-11-14');
  const [extraWeeks, setExtraWeeks] = useState<number | string>(0);

  // Validation
  const minDate = parseISO('2024-11-14');
  const parsedStartDate = parseISO(startDate);
  const isValidDate = isValid(parsedStartDate);
  const isBeforeMinDate = isValidDate && isBefore(parsedStartDate, minDate);

  // Calculations
  const results = useMemo(() => {
    if (!isValidDate) return null;

    const progData = PROGRAMS[program] as any;
    const numericExtraWeeks = typeof extraWeeks === 'string' ? parseInt(extraWeeks) || 0 : extraWeeks;

    // 1. Calculate MBG Deadline
    // The 'days' in spreadsheet IS the MBG Deadline
    const mbgEndDate = addDays(parsedStartDate, progData.days);
    // Regular End Date is MBG Deadline minus the allowed extension weeks
    const regularEndDate = addWeeks(mbgEndDate, -progData.mbgWeeks);

    // 2. Christmas Break Logic (Automatic)
    // Student gets credit if their study period (start to regular end) overlaps with any break
    const qualifyingBreak = CHRISTMAS_BREAKS.find(breakPeriod => {
      // Overlap check: Start is before break ends AND regular end is after break starts
      return isBefore(parsedStartDate, breakPeriod.end) && 
             !isBefore(regularEndDate, breakPeriod.start);
    });
    
    const qualifiesForChristmasBreak = !!qualifyingBreak;
    
    const effectiveExtraWeeks = (qualifiesForChristmasBreak && numericExtraWeeks > 0) 
      ? Math.max(0, numericExtraWeeks - 1) 
      : numericExtraWeeks;

    // 3. Actual End Date
    const actualEndDate = addWeeks(regularEndDate, effectiveExtraWeeks);

    // 4. Status
    let status: 'regular' | 'mbg' | 'exceeded' = 'regular';
    if (effectiveExtraWeeks === 0) {
      status = 'regular';
    } else if (effectiveExtraWeeks <= progData.mbgWeeks) {
      status = 'mbg';
    } else {
      status = 'exceeded';
    }

    return {
      regularEndDate,
      mbgEndDate,
      actualEndDate,
      effectiveExtraWeeks,
      qualifiesForChristmasBreak,
      status,
      progData
    };
  }, [program, startDate, extraWeeks, isValidDate, parsedStartDate]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex items-center gap-3 pb-6 border-b border-slate-200">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-sm">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              TripleTen MBG Calculator
            </h1>
            <p className="text-slate-500 mt-1">
              Calculate student progress based on the latest OTG (On-Time Graduation) day-based durations.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Inputs Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Student Details
              </h2>
              
              <div className="space-y-5">
                {/* Program Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Program
                  </label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value as ProgramKey)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  >
                    {Object.entries(PROGRAMS).map(([key, data]) => (
                      <option key={key} value={key}>{data.name}</option>
                    ))}
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Starting Cohort Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={cn(
                      "w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow",
                      isBeforeMinDate ? "border-red-300 focus:ring-red-500" : "border-slate-300 focus:ring-blue-500"
                    )}
                  />
                  {isBeforeMinDate && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-start gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>This calculator is only applicable to students starting from Nov 14th, 2024.</span>
                    </p>
                  )}
                </div>

                {/* Extra Weeks Used */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Extra Weeks Used
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={extraWeeks === 0 ? "" : extraWeeks}
                      onChange={(e) => setExtraWeeks(e.target.value === "" ? 0 : parseInt(e.target.value) || 0)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <span className="text-slate-400 text-sm">weeks</span>
                    </div>
                  </div>
                </div>

                {/* Christmas Break Info */}
                {results?.qualifiesForChristmasBreak && (
                  <div className="p-3 rounded-lg border border-blue-100 bg-blue-50 flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-blue-900">Christmas Break Applied</span>
                      <span className="text-xs text-blue-700 mt-0.5">
                        This student's program overlaps with a holiday break. 1 week has been automatically credited.
                      </span>
                    </div>
                  </div>
                )}

              </div>
            </div>
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

                {/* Dates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium uppercase tracking-wider">Standard End Date</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {format(results.regularEndDate, 'MMM do, yyyy')}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      Target graduation without extensions.
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium uppercase tracking-wider">MBG Deadline (OTG)</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {format(results.mbgEndDate, 'MMM do, yyyy')}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      Absolute limit for refund eligibility.
                    </div>
                  </div>
                </div>

                {/* Duration Details */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Calculation Details
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Actual End Date</div>
                      <div className="font-semibold text-slate-900">
                        {format(results.actualEndDate, 'MMM do, yyyy')}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Allowed Extensions</div>
                      <div className="font-semibold text-slate-900">
                        {results.progData.mbgWeeks} weeks
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-500 mb-1">Effective Extra Weeks</div>
                      <div className="font-semibold text-slate-900">
                        {results.effectiveExtraWeeks} weeks
                      </div>
                      {results.qualifiesForChristmasBreak && (
                        <div className="text-xs text-blue-600 mt-0.5 font-medium">
                          (-1 wk Christmas credit)
                        </div>
                      )}
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
