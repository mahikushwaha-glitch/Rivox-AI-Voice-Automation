import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Sparkles, 
  Bot, 
  TrendingUp, 
  GitBranch, 
  ArrowRight, 
  Clock, 
  PhoneCall, 
  CheckCircle2, 
  BadgeHelp, 
  HelpCircle,
  Volume2, 
  Calendar, 
  BadgePercent, 
  UserPlus, 
  MessageSquare,
  Stethoscope,
  Home,
  Utensils,
  Wrench,
  ShoppingBag,
  Cpu
} from 'lucide-react';
import { IndustryType } from './types';
import { RIVOX_USE_CASES } from './data';

// Component imports
import AgentSimulator from './components/AgentSimulator';
import PromptBuilder from './components/PromptBuilder';
import FlowBuilder from './components/FlowBuilder';
import RoiCalculator from './components/RoiCalculator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'builder' | 'flow' | 'roi'>('simulator');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>('dental');
  
  // Custom configured agent state (passed to simulator)
  const [customAgentConfig, setCustomAgentConfig] = useState<{
    businessName: string;
    industry: IndustryType;
    objective: string;
    voiceTone: string;
    systemPrompt: string;
    initialScript: string;
  } | null>(null);

  // Lead Booking State
  const [isSubmitLead, setIsSubmitLead] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: '',
    business: '',
    email: '',
    channels: 'missed_calls'
  });

  const handleAgentConfigured = (config: typeof customAgentConfig) => {
    setCustomAgentConfig(config);
    // Switch to simulator tab automatically so they can immediately test it!
    setSelectedIndustry('custom');
    setActiveTab('simulator');
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLead(true);
    setTimeout(() => {
      setIsSubmitLead(false);
      setLeadForm({ name: '', business: '', email: '', channels: 'missed_calls' });
      alert("Demands registered successfully! A Rivox Automation specialist will email you draft logic files within 1 business day.");
    }, 1500);
  };

  // Helper mapping string icon names to Lucide elements
  const renderUseCaseIcon = (iconName: string, colorClass: string) => {
    switch (iconName) {
      case 'Stethoscope': return <Stethoscope className={colorClass} size={20} />;
      case 'Home': return <Home className={colorClass} size={20} />;
      case 'Utensils': return <Utensils className={colorClass} size={20} />;
      case 'Wrench': return <Wrench className={colorClass} size={20} />;
      case 'ShoppingBag': return <ShoppingBag className={colorClass} size={20} />;
      default: return <Cpu className={colorClass} size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] text-neutral-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* GLOWING AMBIENT DECORATIONS */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[800px] right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER BAR */}
      <header className="border-b border-neutral-900/80 bg-neutral-950/40 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-neutral-950 font-black shadow-lg shadow-indigo-500/10 shrink-0">
              <Phone size={18} fill="currentColor" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider text-neutral-100 uppercase font-sans">
                Rivox <span className="text-indigo-400">AI</span>
              </span>
              <p className="text-[9px] font-mono tracking-widest uppercase text-neutral-500 mt-[-2px]">Automation Services</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-neutral-900/60 border border-neutral-850 rounded-full text-xs font-mono">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-neutral-400">Speech Core Live</span>
            </div>
            
            <a 
              href="#appointment-draft" 
              className="text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-neutral-950 px-4 py-2 rounded-xl tracking-wide uppercase transition-all duration-300"
            >
              Order Agent
            </a>
          </div>
        </div>
      </header>

      {/* Hero / Pitch Block */}
      <section className="relative pt-12 pb-8 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Tagline Indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-mono text-xs border border-indigo-500/15">
            <Sparkles size={12} fill="currentColor" /> Autonomous Calling Infrastructure
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-neutral-100 tracking-tight leading-[1.1] font-sans">
            Scale Your Business Faster <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
              With AI-Powered Voice Agents
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed font-sans">
            Never miss another lead, appointment booking, or support inquiry. Rivox AI automates customer communication 24/7 with zero human latency.
          </p>

          {/* Quick Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 font-mono">
            {[
              { label: 'Latency Delay', val: '< 2.5 Sec' },
              { label: 'Answering Rate', val: '100.0%' },
              { label: 'Booking Sync', val: 'Realtime' },
              { label: 'Lead Capture', val: '24 / 7' }
            ].map((st, i) => (
              <div key={i} className="bg-neutral-950 border border-neutral-900 p-3 rounded-2xl">
                <div className="text-neutral-500 text-[10px] uppercase tracking-wider">{st.label}</div>
                <div className="text-indigo-400 font-bold text-base mt-0.5">{st.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* "IMAGINE THIS..." HOOK CARDS SECTION */}
      <section className="py-8 px-6 max-w-7xl mx-auto w-full">
        <h3 className="text-xs uppercase font-mono tracking-widest text-neutral-500 text-center mb-6">
          Imagine the impact on your conversion operations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Instants Answers', desc: 'Every prospect ring answered in under 2.5 seconds. No queues.', highlight: 'border-cyan-500/20 shadow-cyan-500/5' },
            { title: 'Auto Calendaring', desc: 'Directly syncs to Google Calendar & CRMs to schedule viewing slots.', highlight: 'border-indigo-500/20 shadow-indigo-500/5' },
            { title: '24/7 Lead Qualify', desc: 'Engages, registers names, queries budget targets day or night.', highlight: 'border-purple-500/20 shadow-purple-500/5' },
            { title: '3 AM Coverage', desc: 'Captures midnight emergency plumbing or booking requests without staffing cost.', highlight: 'border-emerald-500/20 shadow-emerald-500/5' }
          ].map((card, idx) => (
            <div key={idx} className={`bg-neutral-900 border ${card.highlight} p-5 rounded-2xl shadow-xl flex flex-col justify-between`}>
              <div>
                <span className="font-mono text-xs text-neutral-500">0{idx + 1} / Impact</span>
                <h4 className="text-neutral-200 text-sm font-bold mt-2">{card.title}</h4>
                <p className="text-xs text-neutral-400 mt-1 pb-4 leading-normal font-sans">{card.desc}</p>
              </div>
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest font-mono">Rivox Standard</span>
            </div>
          ))}
        </div>
      </section>

      {/* CORE INTERACTIVE DASHBOARD TAB CONTROLLER */}
      <section className="py-8 px-6 max-w-7xl mx-auto w-full">
        {/* Navigation Tabs Header */}
        <div className="bg-neutral-950 border border-neutral-900 p-2 rounded-2xl flex flex-wrap gap-2 max-w-3xl mx-auto mb-10">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 min-w-[130px] font-sans text-xs py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'simulator' 
                ? 'bg-indigo-500 text-neutral-950 shadow-lg' 
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40'
            }`}
          >
            <PhoneCall size={14} /> Voice Simulator
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex-1 min-w-[130px] font-sans text-xs py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'builder' 
                ? 'bg-indigo-500 text-neutral-950 shadow-lg' 
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40'
            }`}
          >
            <Bot size={14} /> Agent Constructor
          </button>
          <button
            onClick={() => setActiveTab('flow')}
            className={`flex-1 min-w-[130px] font-sans text-xs py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'flow' 
                ? 'bg-indigo-500 text-neutral-950 shadow-lg' 
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40'
            }`}
          >
            <GitBranch size={14} /> Route Diagram
          </button>
          <button
            onClick={() => setActiveTab('roi')}
            className={`flex-1 min-w-[130px] font-sans text-xs py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'roi' 
                ? 'bg-indigo-500 text-neutral-950 shadow-lg' 
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40'
            }`}
          >
            <TrendingUp size={14} /> ROI Calculator
          </button>
        </div>

        {/* Tab Renderer area */}
        <div className="bg-neutral-950/20 border border-neutral-900/60 p-6 rounded-3xl min-h-[480px]">
          <AnimatePresence mode="wait">
            {activeTab === 'simulator' && (
              <motion.div
                key="simulator"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 text-center max-w-xl mx-auto space-y-1">
                  <h3 className="text-xl font-bold text-neutral-100">Live Voice Agent Playground</h3>
                  <p className="text-xs text-neutral-400">Speak or text with Chloe to experience our interactive phone dialogue system.</p>
                </div>
                <AgentSimulator selectedIndustry={selectedIndustry} setSelectedIndustry={setSelectedIndustry} customAgentConfig={customAgentConfig} />
              </motion.div>
            )}

            {activeTab === 'builder' && (
              <motion.div
                key="builder"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 text-center max-w-xl mx-auto space-y-1">
                  <h3 className="text-xl font-bold text-neutral-100">Custom Agent Setup</h3>
                  <p className="text-xs text-neutral-400">Describe your precise business details. Gemini will construct a fully custom role prompt.</p>
                </div>
                <PromptBuilder onAgentGenerated={handleAgentConfigured} />
              </motion.div>
            )}

            {activeTab === 'flow' && (
              <motion.div
                key="flow"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 text-center max-w-xl mx-auto space-y-1">
                  <h3 className="text-xl font-bold text-neutral-100">AI Logic Flowchart Mapper</h3>
                  <p className="text-xs text-neutral-400">Form step-modules to trace how telephone customers qualify and sync to your database.</p>
                </div>
                <FlowBuilder />
              </motion.div>
            )}

            {activeTab === 'roi' && (
              <motion.div
                key="roi"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 text-center max-w-xl mx-auto space-y-1">
                  <h3 className="text-xl font-bold text-neutral-100">Revenue Impact & Voicemail Drain Calculator</h3>
                  <p className="text-xs text-neutral-400">Understand exactly how much gross revenue slips through missed phone calls.</p>
                </div>
                <RoiCalculator />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CORE SERVICES AND USE CASES INDUSTRY GRID */}
      <section className="py-12 bg-neutral-950/60 border-t border-b border-neutral-900 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-indigo-400 font-bold">Standard Solutions Deployments</span>
            <h2 className="text-2xl sm:text-3.5xl font-extrabold text-neutral-100 font-sans">
              Configured For Your Specific Industry
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {RIVOX_USE_CASES.filter(u => u.id !== 'custom').map((useCase) => (
              <div 
                key={useCase.id}
                className="bg-neutral-950 border border-neutral-850 hover:border-neutral-700/80 p-5 rounded-2xl flex flex-col justify-between transition-all group"
              >
                <div className="space-y-4">
                  {/* Title & Icon Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      {renderUseCaseIcon(useCase.icon, "text-indigo-400")}
                    </div>
                    <div>
                      <h4 className="text-neutral-200 text-sm font-extrabold leading-none">{useCase.title}</h4>
                      <span className="text-[10px] font-mono text-neutral-500 mt-1 block">{useCase.subtitle}</span>
                    </div>
                  </div>

                  {/* Problem & Solution block */}
                  <div className="space-y-2.5 text-xs">
                    <div className="bg-neutral-900/60 p-2.5 rounded-xl border border-neutral-850 text-left">
                      <strong className="text-rose-400 text-[10px] font-mono uppercase tracking-wider block mb-0.5">Voicemail Drain:</strong>
                      <p className="text-neutral-400 leading-normal">{useCase.problem}</p>
                    </div>

                    <div className="bg-neutral-900/20 p-2.5 rounded-xl border border-neutral-900 text-left">
                      <strong className="text-cyan-400 text-[10px] font-mono uppercase tracking-wider block mb-0.5">AI Intervention Strategy:</strong>
                      <p className="text-neutral-400 leading-normal">{useCase.solution}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-900 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase">Impact Metric</span>
                    <div className="text-xs font-semibold text-emerald-400">{useCase.results}</div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedIndustry(useCase.id);
                      setActiveTab('simulator');
                      // Scroll to tab controller
                      const elem = document.getElementById('flow-builder-hub');
                      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3.5 py-1.5 bg-neutral-900 hover:bg-indigo-500 text-neutral-400 hover:text-neutral-950 text-[11px] font-semibold rounded-xl border border-neutral-800 hover:border-indigo-500 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    Launch Simulation <ArrowRight size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER LEAD GEN FORM & CONVERSION BOOKING */}
      <section id="appointment-draft" className="py-16 px-6 max-w-5xl mx-auto w-full text-center space-y-8 relative z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="space-y-2 max-w-2xl mx-auto relative z-10">
          <h2 className="text-2xl sm:text-3.5xl font-extrabold text-neutral-100 font-sans">
            Ready to Implement AI in Your Business?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
            We build fully customized autonomous AI voice agents tailored directly to your specific booking operations, CRM integrations, and brand voice guidelines. Request a draft prototype below.
          </p>
        </div>

        <div className="max-w-xl mx-auto bg-neutral-900 border border-neutral-800 p-6 rounded-3xl shadow-xl relative z-10">
          <form onSubmit={handleLeadSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-left space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full bg-neutral-950 border border-neutral-850 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 outline-none transition-all placeholder:text-neutral-700 font-sans"
                />
              </div>

              <div className="text-left space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Business / Clinic Name</label>
                <input
                  type="text"
                  required
                  value={leadForm.business}
                  onChange={(e) => setLeadForm({ ...leadForm, business: e.target.value })}
                  placeholder="e.g. Apex Hospital Group"
                  className="w-full bg-neutral-950 border border-neutral-850 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 outline-none transition-all placeholder:text-neutral-700 font-sans"
                />
              </div>
            </div>

            <div className="text-left space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Work Email Address</label>
              <input
                type="email"
                required
                value={leadForm.email}
                onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                placeholder="e.g. contact@apexrealty.com"
                className="w-full bg-neutral-950 border border-neutral-850 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 outline-none transition-all placeholder:text-neutral-700 font-sans"
              />
            </div>

            <div className="text-left space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">Primary Channel Priority</label>
              <select
                value={leadForm.channels}
                onChange={(e) => setLeadForm({ ...leadForm, channels: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-850 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 outline-none transition-all"
              >
                <option value="missed_calls">Answering Missed Inbound Calls 24/7</option>
                <option value="lead_qualify">Qualifying Warm Inbound Web Leads</option>
                <option value="support_desk">Custom API Support Desk Integration</option>
                <option value="multiple_channels">Multi-Channel Omnibus (Ring + Web + SMS)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitLead}
              className="w-full py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-neutral-950 text-xs font-bold font-sans tracking-wide uppercase shadow-lg shadow-indigo-500/5 hover:shadow-indigo-500/10 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitLead ? 'Routing Request...' : 'Draft My Custom Agent Logic File'}
            </button>
          </form>
        </div>
      </section>

      {/* REVERSED COMPREHENSIVE FOOTER */}
      <footer className="bg-neutral-950 border-t border-neutral-900/60 py-8 px-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs tracking-wider text-neutral-300 uppercase font-sans">
              Rivox <span className="text-indigo-400">AI</span>
            </span>
            <span className="h-4 w-[1px] bg-neutral-850" />
            <span>Smart Automation services for high-speed organizations.</span>
          </div>

          <div className="flex gap-4 font-mono text-[10px] text-neutral-500">
            <span>© {new Date().getFullYear()} Rivox Automation. All rights reserved.</span>
            <span>PCM Codec: 24kHz v4.1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
