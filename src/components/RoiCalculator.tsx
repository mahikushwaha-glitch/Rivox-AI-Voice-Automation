import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Percent, DollarSign, Clock, ShieldAlert, BadgeCheck } from 'lucide-react';

export default function RoiCalculator() {
  const [dailyCalls, setDailyCalls] = useState<number>(35);
  const [ticketValue, setTicketValue] = useState<number>(250);
  const [missedRate, setMissedRate] = useState<number>(30); // 30% standard
  const [bookingRate, setBookingRate] = useState<number>(40); // 40% standard

  const stats = useMemo(() => {
    const monthlyCalls = dailyCalls * 30.5;
    const monthlyMissed = Math.round(monthlyCalls * (missedRate / 100));
    const potentialAppointmentsLost = Math.round(monthlyMissed * (bookingRate / 100));
    const monthlyRevenueLost = potentialAppointmentsLost * ticketValue;

    // Rivox solves 95% of missed call gaps
    const recoveredAppointments = Math.round(potentialAppointmentsLost * 0.90);
    const recoveredRevenue = recoveredAppointments * ticketValue;
    const hoursSaved = Math.round((monthlyCalls * 2.5) / 60); // 2.5 mins per call triage

    return {
      monthlyMissed,
      potentialAppointmentsLost,
      monthlyRevenueLost,
      recoveredAppointments,
      recoveredRevenue,
      hoursSaved
    };
  }, [dailyCalls, ticketValue, missedRate, bookingRate]);

  return (
    <div id="roi-calculator" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
      {/* Input controls */}
      <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-100">Revenue Impact Parameters</h3>
              <p className="text-xs text-neutral-400 font-mono">Simulate your business workflow</p>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            {/* Daily Inbound Calls */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-300 font-medium">Daily Inbound Calls</span>
                <span className="text-indigo-400 font-mono font-bold bg-indigo-500/10 px-2 py-0.5 rounded">{dailyCalls} calls</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={dailyCalls}
                onChange={(e) => setDailyCalls(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>5 / day</span>
                <span>125 / day</span>
                <span>250 / day</span>
              </div>
            </div>

            {/* Average Deal/Ticket Value */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-300 font-medium">Average Customer Value</span>
                <span className="text-indigo-400 font-mono font-bold bg-indigo-500/10 px-2 py-0.5 rounded">${ticketValue}</span>
              </div>
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={ticketValue}
                onChange={(e) => setTicketValue(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>$50</span>
                <span>$1,500</span>
                <span>$3,000</span>
              </div>
            </div>

            {/* Missed Call Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-300 font-medium">Missed Call Percentage</span>
                <span className="text-rose-400 font-mono font-bold bg-rose-500/10 px-2 py-0.5 rounded">{missedRate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={missedRate}
                onChange={(e) => setMissedRate(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>5% (Best in Class)</span>
                <span>30% (Industry Avg)</span>
                <span>80% (Understaffed)</span>
              </div>
            </div>

            {/* Appointment Booking Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-300 font-medium">Conv. / Booking Rate</span>
                <span className="text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded">{bookingRate}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={bookingRate}
                onChange={(e) => setBookingRate(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>10%</span>
                <span>50%</span>
                <span>90%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-850 text-xs text-neutral-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <span>Calculated using standard small enterprise industry data metrics.</span>
        </div>
      </div>

      {/* Outputs / Calculations */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {/* Two main metrics side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Uncaptured leakage card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-[40px] pointer-events-none" />
            <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldAlert size={14} /> Leakage Status
            </div>
            <h4 className="text-neutral-400 text-sm font-medium">Lost Sales Opportunities</h4>
            <div className="text-3xl font-bold text-rose-500 font-mono mt-1">
              -{stats.potentialAppointmentsLost} <span className="text-sm text-neutral-500 font-sans font-normal">leads/mo</span>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Out of <strong className="text-neutral-300">{stats.monthlyMissed}</strong> calls slipped to voicemail this month, these clients went directly to competitors.
            </p>
            <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-between items-center">
              <span className="text-xs text-neutral-500">Estimated Revenue Drain</span>
              <span className="font-mono text-base font-bold text-rose-400">-${stats.monthlyRevenueLost.toLocaleString()}</span>
            </div>
          </div>

          {/* Recovered revenue card */}
          <div className="bg-neutral-900 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none" />
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <BadgeCheck size={14} /> Rivox AI Solution
            </div>
            <h4 className="text-neutral-400 text-sm font-medium">Recovered Monthly Sales</h4>
            <div className="text-3xl font-bold text-emerald-400 font-mono mt-1">
              +{stats.recoveredAppointments} <span className="text-sm text-neutral-500 font-sans font-normal">bookings/mo</span>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              By answering every call instantly in under 3 seconds, qualifying routing, and booking directly into calendars.
            </p>
            <div className="mt-4 pt-4 border-t border-neutral-850 flex justify-between items-center">
              <span className="text-xs text-neutral-300 font-medium">Captured Gross Output</span>
              <span className="font-mono text-lg font-extrabold text-emerald-400">+${stats.recoveredRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Big ROI visual panel */}
        <div className="bg-gradient-to-r from-indigo-950/40 via-neutral-900 to-neutral-900 border border-indigo-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
          
          <div className="space-y-2 relative z-10">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">Net Efficiency Gain</div>
            <h4 className="text-xl font-bold text-neutral-500-100 text-neutral-100">Why speed-to-lead matters</h4>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              Apart from making <strong className="text-indigo-300">${stats.recoveredRevenue.toLocaleString()}</strong>, you reclaim <strong className="text-indigo-300">{stats.hoursSaved} product hours</strong> per month of team members taking routine FAQs and intake.
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col items-center justify-center p-4 bg-neutral-950/80 border border-neutral-800 rounded-xl min-w-[200px] text-center relative z-10">
            <span className="text-neutral-400 text-xs uppercase font-mono tracking-wider">Annual Value Added</span>
            <div className="text-3xl font-extrabold text-neutral-100 font-mono mt-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              ${(stats.recoveredRevenue * 12).toLocaleString()}
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <DollarSign size={13} /> AI Response Strategy
            </div>
          </div>
        </div>

        {/* Visual ROI graph showing "Current Drain vs Secured" */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <h4 className="text-sm font-semibold text-neutral-300 mb-4">Financial Flow Comparison</h4>
          <div className="flex flex-col gap-4">
            {/* Drain bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-neutral-400">
                <span>Revenue Unclaimed (Voicemail Slips)</span>
                <span className="font-mono text-rose-400 font-semibold">-${stats.monthlyRevenueLost.toLocaleString()}/mo</span>
              </div>
              <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-rose-500 rounded-full"
                />
              </div>
            </div>

            {/* Secure bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-neutral-300">
                <span>Secured Stream via Rivox AI Voice Agent</span>
                <span className="font-mono text-emerald-400 font-semibold">+${stats.recoveredRevenue.toLocaleString()}/mo</span>
              </div>
              <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round((stats.recoveredRevenue / (stats.monthlyRevenueLost || 1)) * 100)}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-full bg-emerald-400 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
