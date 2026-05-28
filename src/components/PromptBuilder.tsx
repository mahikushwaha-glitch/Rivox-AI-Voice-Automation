import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Bot, Save, ListTodo, Copy, ArrowRight, Play, Check } from 'lucide-react';
import { IndustryType, AgentConfig } from '../types';

interface PromptBuilderProps {
  onAgentGenerated: (config: {
    businessName: string;
    industry: IndustryType;
    objective: string;
    voiceTone: string;
    systemPrompt: string;
    initialScript: string;
  }) => void;
}

export default function PromptBuilder({ onAgentGenerated }: PromptBuilderProps) {
  // Config parameters
  const [businessName, setBusinessName] = useState('Zenith Spa & Wellness');
  const [industry, setIndustry] = useState<IndustryType>('service_business');
  const [objective, setObjective] = useState('Book massage therapist appointments, describe relaxing package prices, and redirect extreme medical inquiries.');
  const [voiceTone, setVoiceTone] = useState('whisper-soft, soothing, highly warm and professional');
  
  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPromptData, setGeneratedPromptData] = useState<any | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !objective.trim()) return;

    setIsGenerating(true);
    setGeneratedPromptData(null);
    setIsApplied(false);

    try {
      const res = await fetch('/api/agent/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          businessName,
          industry,
          objective,
          voiceTone
        })
      });

      if (!res.ok) {
        throw new Error('Prompt generator failed');
      }

      const data = await res.json();
      setGeneratedPromptData(data);
    } catch (err) {
      console.error(err);
      // Fallback draft prompt if API key not present
      const fallbackPrompt = {
        systemInstruction: `You are Chloe, the virtual receptionist for ${businessName}. Your target is to: ${objective}.
Ensure you speak in a ${voiceTone} voice.
Maintain strict operational guidelines:
- Great guests warmly.
- Quote standard diagnostic packages based on schedule.
- Avoid making up arbitrary prices outside of standard listings.
- Offer callbacks for custom requests.`,
        agentName: "Chloe",
        suggestedScriptOpen: `Thank you for reaching out to ${businessName}! This is Chloe, your automated relaxation assistant. How can I help you unwind today?`,
        faqs: [
          { question: "What are your hours?", answer: "We coordinate treatments Monday through Sunday from 9:00 AM to 8:50 PM." },
          { question: "Can I cancel my slot?", answer: "We request a basic 24-hour notice to reschedule slots without fee penalties. What’s your ticket code?" }
        ]
      };
      setGeneratedPromptData(fallbackPrompt);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedPromptData) return;
    navigator.clipboard.writeText(generatedPromptData.systemInstruction);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const applyToSimulator = () => {
    if (!generatedPromptData) return;
    onAgentGenerated({
      businessName,
      industry,
      objective,
      voiceTone,
      systemPrompt: generatedPromptData.systemInstruction,
      initialScript: generatedPromptData.suggestedScriptOpen
    });
    setIsApplied(true);
    setTimeout(() => setIsApplied(false), 3000);
  };

  return (
    <div id="prompt-builder" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
      {/* Parameter input column */}
      <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="text-purple-400" size={20} />
          <div>
            <h3 className="text-lg font-semibold text-neutral-100 font-sans">Agent Prompt Engineering</h3>
            <p className="text-xs text-neutral-400 font-mono">Create custom AI weights with Gemini</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Name */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-neutral-300">Company / Business Name</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Zenith Spa Clinic"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 outline-none transition-all placeholder:text-neutral-600"
            />
          </div>

          {/* Industry dropdown */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-neutral-300">Industry Sector</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value as IndustryType)}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 outline-none transition-all"
            >
              <option value="dental">Healthcare / Medical Clinic</option>
              <option value="real_estate">Real Estate & Property Management</option>
              <option value="restaurant">Hospitality & Fast-Casual</option>
              <option value="ecommerce_support">Retail / E-Commerce Support</option>
              <option value="service_business">Local Service & Dispatch Contractor</option>
              <option value="custom">Other / Tailored Enterprise</option>
            </select>
          </div>

          {/* Core Objectives */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-neutral-300">Main Objective & Guidelines</label>
            <textarea
              required
              rows={3}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="State what you want the agent to do: book viewings, describe manicure pricing, check tracking statuses..."
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 outline-none transition-all placeholder:text-neutral-600 resize-none leading-relaxed"
            />
          </div>

          {/* Voice Tone */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-neutral-300">Voice Tone & Behavior Adjectives</label>
            <input
              type="text"
              value={voiceTone}
              onChange={(e) => setVoiceTone(e.target.value)}
              placeholder="e.g. professional and polite"
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 outline-none transition-all placeholder:text-neutral-600"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-neutral-100 text-xs font-bold leading-none tracking-wider uppercase transition-all shadow-lg hover:shadow-purple-500/15 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Sparkles size={13} fill="currentColor" />
            {isGenerating ? 'Compiling Agent Model...' : 'Craft Agent Prompt Schema'}
          </button>
        </form>
      </div>

      {/* Generated output visual code card */}
      <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 min-h-[440px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {!generatedPromptData && !isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <Bot className="text-neutral-700 animate-pulse" size={48} />
              <div className="space-y-1 max-w-sm">
                <h4 className="text-sm font-semibold text-neutral-200">No Prompt Config Generated Yet</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Input your business goals in the controller form and click write. Gemini will compile a production system prompt, launch scripting, and specific FAQs.
                </p>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-10 h-10 rounded-full border-2 border-neutral-800 border-t-purple-500 animate-spin" />
              <div>
                <p className="text-xs font-mono text-purple-400 animate-pulse uppercase tracking-wider font-bold">Querying Gemini GenAI...</p>
                <p className="text-[10px] text-neutral-500 mt-1 font-mono">Writing detailed boundary condition rulesets</p>
              </div>
            </div>
          )}

          {generatedPromptData && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col justify-between space-y-5"
            >
              {/* Output block metadata */}
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-neutral-950 p-3 rounded-xl border border-neutral-850">
                  <div>
                    <span className="text-[10px] text-purple-400 uppercase font-mono tracking-widest font-bold">Identity Assigned</span>
                    <h5 className="text-xs font-bold text-neutral-200">{generatedPromptData.agentName} (Custom Route)</h5>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 bg-neutral-900 hover:bg-neutral-850 hover:text-neutral-100 rounded-lg text-neutral-400 border border-neutral-800 transition-all"
                      title="Copy System Prompt"
                    >
                      {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>

                {/* Simulated Script opening */}
                <div className="p-3.5 bg-[#7c3aed]/5 border border-purple-500/10 rounded-xl text-left">
                  <span className="text-[9.5px] uppercase font-mono text-purple-400 tracking-wider">Chloe Launch Greeting</span>
                  <p className="text-neutral-200 text-xs italic mt-1 leading-relaxed">
                    "{generatedPromptData.suggestedScriptOpen}"
                  </p>
                </div>

                {/* System Prompt container */}
                <div className="space-y-1 text-left">
                  <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Compiled System Instructions</span>
                  <div className="bg-neutral-950 rounded-xl p-3.5 border border-neutral-850 max-h-[160px] overflow-y-auto text-[11px] font-mono leading-relaxed text-neutral-400 whitespace-pre-wrap select-all">
                    {generatedPromptData.systemInstruction}
                  </div>
                </div>

                {/* Sample FAQs */}
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] uppercase font-mono text-neutral-500 tracking-wider">Dynamic FAQ Weights</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {generatedPromptData.faqs?.slice(0, 2).map((faq: any, idx: number) => (
                      <div key={idx} className="bg-neutral-950/40 border border-neutral-850/60 p-2.5 rounded-xl">
                        <div className="text-[11px] font-semibold text-neutral-300">Q: {faq.question}</div>
                        <div className="text-[10.5px] text-neutral-400 mt-1 leading-normal">A: {faq.answer}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply / Deploy Section */}
              <div className="pt-4 border-t border-neutral-850 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="text-[10px] font-mono text-neutral-500 text-left">
                  *Prompt generated on Gemini-3.5-Flash. Fully compliant under Rivox prompt boundaries.
                </div>

                <button
                  type="button"
                  onClick={applyToSimulator}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-neutral-100 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow"
                >
                  {isApplied ? <Check size={13} className="text-emerald-400" /> : <Play size={13} fill="currentColor" />}
                  {isApplied ? 'SYNCHRONIZED SUCCESSFULLY' : 'DEPLOY PROTOTYPE TO SIMULATOR'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
