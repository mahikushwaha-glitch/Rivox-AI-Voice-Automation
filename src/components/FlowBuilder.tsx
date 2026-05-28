import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PhoneCall, Search, Calendar, Landmark, MessageSquare, ArrowRight, Check, Plus, Trash2, GitBranch, ArrowDown } from 'lucide-react';

interface FlowStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  enabled: boolean;
  status: 'active' | 'inactive';
  required?: boolean;
}

export default function FlowBuilder() {
  const [steps, setSteps] = useState<FlowStep[]>([
    {
      id: "trigger",
      title: "1. Call Ingestion & Answer",
      description: "Triggered instantly on missed ring in 1 to 3 seconds. Greets customer with a warm custom-branded script.",
      icon: PhoneCall,
      enabled: true,
      status: 'active',
      required: true
    },
    {
      id: "crm-lookup",
      title: "2. CRM Contacts Sync",
      description: "Instantly queries your active database to identify if caller is a returning or new patient/customer.",
      icon: Search,
      enabled: true,
      status: 'active'
    },
    {
      id: "triage",
      title: "3. Triage & Objective Screening",
      description: "Asks descriptive questions to determine call goal (e.g., booking vs. general inquiry vs. emergency).",
      icon: GitBranch,
      enabled: true,
      status: 'active'
    },
    {
      id: "calendar-check",
      title: "4. Live Calendar Slot Booking",
      description: "Directly accesses Google Sheets, Calendly, or specific CRM API to locate open slots and save bookings.",
      icon: Calendar,
      enabled: true,
      status: 'active'
    },
    {
      id: "notifications",
      title: "5. Double SMS / Email Sync",
      description: "Sends immediate booking notifications and forms link directly to their mobile phone.",
      icon: MessageSquare,
      enabled: true,
      status: 'active'
    },
    {
      id: "hot_route",
      title: "6. Backup Staff Route Branch",
      description: "Escalates and forwards active calls to areally available human team if it is a major high-tier emergency.",
      icon: Landmark,
      enabled: false,
      status: 'inactive'
    }
  ]);

  const toggleStep = (id: string) => {
    setSteps(prev => 
      prev.map(step => {
        if (step.id === id && !step.required) {
          const nextEnabled = !step.enabled;
          return {
            ...step,
            enabled: nextEnabled,
            status: nextEnabled ? 'active' : 'inactive'
          };
        }
        return step;
      })
    );
  };

  const enabledSteps = steps.filter(s => s.enabled);

  return (
    <div id="flow-builder" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
      {/* Sidebar logic selector */}
      <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch className="text-cyan-400" size={20} />
          <div>
            <h3 className="text-lg font-semibold text-neutral-100 font-sans">Logic Map Customization</h3>
            <p className="text-xs text-neutral-400 font-mono">Toggle branches to form your voice model route</p>
          </div>
        </div>

        <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
          AI Voice Agents act on rigorous state charts. Toggle components below to customize how Chloe executes calls for your organization.
        </p>

        <div className="space-y-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.id}
                onClick={() => !step.required && toggleStep(step.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  step.required 
                    ? 'border-neutral-800 bg-neutral-950/40 opacity-75 cursor-not-allowed'
                    : step.enabled
                      ? 'border-cyan-500/30 bg-cyan-950/10 cursor-pointer'
                      : 'border-neutral-850 bg-neutral-950/30 hover:border-neutral-800 cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg mt-0.5 ${
                    step.enabled ? 'bg-cyan-500/15 text-cyan-400' : 'bg-neutral-800 text-neutral-500'
                  }`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-200">{step.title}</h4>
                    <p className="text-[10.5px] text-neutral-400 leading-normal max-w-xs mt-0.5">{step.description}</p>
                  </div>
                </div>

                {!step.required && (
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                    step.enabled 
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                      : 'bg-neutral-950 border-neutral-850 text-transparent'
                  }`}>
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
                {step.required && (
                  <span className="text-[9px] font-mono text-neutral-600 font-bold uppercase tracking-wider bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded">
                    Core
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Canvas Panel */}
      <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 min-h-[500px] flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs uppercase font-mono tracking-wider text-neutral-400">Live Agent Call Graph Layout</span>
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
              {enabledSteps.length} Modules Active
            </div>
          </div>

          {/* Render the flowchart step nodes */}
          <div className="flex flex-col items-center py-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {enabledSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.id} className="w-full max-w-md flex flex-col items-center">
                    {index > 0 && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="my-1 text-cyan-500 flex flex-col items-center"
                      >
                        <ArrowDown size={14} className="mt-1 mb-1 text-cyan-500/60" />
                      </motion.div>
                    )}

                    <motion.div 
                      layout
                      initial={{ scale: 0.9, opacity: 0, y: 15 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.9, opacity: 0, y: -15 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className="w-full bg-neutral-950 border border-neutral-800 hover:border-cyan-500/30 p-4 rounded-xl flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/5 border border-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                          <Icon size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-neutral-100">{step.title.slice(3)}</span>
                            <span className="text-[10px] bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono px-1.5 py-0.2 rounded">
                              Step {index + 1}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-neutral-400 mt-1 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom indicator explaining dynamic build */}
        <div className="mt-8 pt-4 border-t border-neutral-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            Dynamic Routing Script Generated.
          </span>
          <span className="text-neutral-500 text-[10px]">
            *This flow is mapped directly to our live simulator prompt.
          </span>
        </div>
      </div>
    </div>
  );
}
