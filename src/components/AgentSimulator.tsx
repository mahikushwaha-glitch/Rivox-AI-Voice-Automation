import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, PhoneOff, Send, Volume2, VolumeX, RefreshCcw, Landmark, ListRestart, BadgeCheck, MessageSquare, Mic, Sparkles } from 'lucide-react';
import { IndustryType, Message, UseCase, DemoCallRecording } from '../types';
import { RIVOX_USE_CASES, DEMO_RECORDINGS, RECENT_CALLS_MOCK } from '../data';

interface AgentSimulatorProps {
  selectedIndustry: IndustryType;
  setSelectedIndustry: (industry: IndustryType) => void;
  customAgentConfig?: {
    businessName: string;
    industry: IndustryType;
    objective: string;
    voiceTone: string;
    systemPrompt: string;
    initialScript: string;
  } | null;
}

export default function AgentSimulator({ selectedIndustry, setSelectedIndustry, customAgentConfig }: AgentSimulatorProps) {
  // Navigation tabs inside simulator
  const [mode, setMode] = useState<'live_call' | 'demo_recordings' | 'call_history'>('live_call');

  // Live Call Session State
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [activeStepCode, setActiveStepCode] = useState<string>('greeting'); // greeting, triage, capture, finalize

  // Demo Recordings state
  const [selectedDemo, setSelectedDemo] = useState<DemoCallRecording>(DEMO_RECORDINGS[0]);
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const [demoDialogueIndex, setDemoDialogueIndex] = useState<number>(0);
  const [demoTimer, setDemoTimer] = useState<number>(0);
  const [demoPlaybackSpeed] = useState<number>(3000); // ms per dialog exchange

  const messageEndRef = useRef<HTMLDivElement>(null);
  const demoIntervalRef = useRef<any>(null);

  // Active configure state
  const currentUseCase = useMemo(() => {
    if (selectedIndustry === 'custom' && customAgentConfig) {
      return {
        id: 'custom' as IndustryType,
        title: customAgentConfig.businessName,
        subtitle: `Custom Agent in ${customAgentConfig.industry}`,
        icon: 'Sparkles',
        problem: 'Custom configured automation route',
        solution: customAgentConfig.objective,
        results: 'Ready to deploy',
        bgGradient: 'from-purple-500/10 to-indigo-500/5 border-purple-500/20',
        accentColor: 'purple',
        suggestedPrompt: customAgentConfig.systemPrompt,
        suggestedOpen: customAgentConfig.initialScript,
        faqs: []
      } as UseCase;
    }
    return RIVOX_USE_CASES.find(u => u.id === selectedIndustry) || RIVOX_USE_CASES[0];
  }, [selectedIndustry, customAgentConfig]);

  // Audio speech synthesis helper
  const speakText = (text: string) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a friendly female voice if possible
    const voices = synth.getVoices();
    const femaleVoice = voices.find(v => 
      v.name.toLowerCase().includes('google') || 
      v.name.toLowerCase().includes('female') || 
      v.name.toLowerCase().includes('natural') ||
      v.name.toLowerCase().includes('zira') ||
      v.name.toLowerCase().includes('samantha')
    );
    if (femaleVoice) utterance.voice = femaleVoice;
    
    utterance.rate = 1.05; // slightly faster/natural rate
    utterance.pitch = 1.0;
    synth.speak(utterance);
  };

  // Auto scroll messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Handle call commencement
  const startCall = () => {
    setIsConnecting(true);
    setMessages([]);
    setActiveStepCode('greeting');
    
    // Simulate telecommunication hook Connection
    setTimeout(() => {
      setIsConnecting(false);
      setIsCalling(true);
      
      const welcomeMsg: Message = {
        id: 'msg-welcome',
        role: 'assistant',
        text: currentUseCase.suggestedOpen,
        timestamp: new Date()
      };
      
      setMessages([welcomeMsg]);
      speakText(welcomeMsg.text);
    }, 1800);
  };

  // Handle call end
  const endCall = () => {
    setIsCalling(false);
    setIsConnecting(false);
    setMessages([]);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Submit chat logic
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isThinking) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    // Append User Dialog
    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      text: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    // Dynamic routing node progression simulator
    const textLower = userText.toLowerCase();
    if (textLower.includes('book') || textLower.includes('appointment') || textLower.includes('schedule') || textLower.includes('reserve') || textLower.includes('slot')) {
      setActiveStepCode('slots');
    } else if (textLower.includes('yes') || textLower.includes('correct') || textLower.includes('confirm') || textLower.includes('sounds good')) {
      setActiveStepCode('finalize');
    } else if (textLower.includes('name') || textLower.includes('phone') || textLower.includes('email') || textLower.includes('my address')) {
      setActiveStepCode('capture');
    }

    try {
      // Package payload for our full-stack API
      const historyPayload = messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        text: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userText,
          systemInstruction: currentUseCase.suggestedPrompt,
          history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error('Server returned warning');
      }

      const data = await res.json();
      const reply = data.reply || "I apologize, our secure routing line briefly timed out. How can I guide you further?";

      const assistantMsg: Message = {
        id: `msg-${Date.now()}-agent`,
        role: 'assistant',
        text: reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
      speakText(reply);
    } catch (err) {
      console.error(err);
      // Failover mock respond
      const fallbackMsgs = [
        "I’ve captured those details securely on your slate. Shall we finalize the scheduled calendar time now?",
        "Perfect. I am registering this under your contact profile. I can arrange an open spot tomorrow morning or afternoon—what's your preference?",
        "That works perfectly for Apex. Let me send a quick SMS validation to finalize our booking slots."
      ];
      const randomFallback = fallbackMsgs[Math.floor(Math.random() * fallbackMsgs.length)];
      
      const assistantMsg: Message = {
        id: `msg-${Date.now()}-error-agent`,
        role: 'assistant',
        text: randomFallback,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
      speakText(randomFallback);
    } finally {
      setIsThinking(false);
    }
  };

  // Toggle voice
  const toggleVoiceSetting = () => {
    setVoiceEnabled(!voiceEnabled);
    if (voiceEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
      }
    };
  }, []);

  // Demo playback loop
  const triggerDemoPlay = () => {
    if (isPlayingDemo) {
      clearInterval(demoIntervalRef.current);
      setIsPlayingDemo(false);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      return;
    }

    setIsPlayingDemo(true);
    setDemoDialogueIndex(0);
    setDemoTimer(0);

    const fullDialogue = selectedDemo.dialogue;
    // Initial opening play
    speakText(fullDialogue[0].text);

    let progressIndex = 0;
    demoIntervalRef.current = setInterval(() => {
      progressIndex++;
      if (progressIndex >= fullDialogue.length) {
        clearInterval(demoIntervalRef.current);
        setIsPlayingDemo(false);
        return;
      }

      setDemoDialogueIndex(progressIndex);
      setDemoTimer(prev => prev + 5);
      const currentLine = fullDialogue[progressIndex];
      
      // Chloe speaks agent lines out loud so the user literally hears the demo call!
      if (currentLine.speaker === 'Agent') {
        speakText(currentLine.text);
      }
    }, demoPlaybackSpeed);
  };

  // Change selected demo tape resets state
  const selectDemoTape = (tape: DemoCallRecording) => {
    if (isPlayingDemo) {
      clearInterval(demoIntervalRef.current);
      setIsPlayingDemo(false);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
    setSelectedDemo(tape);
    setDemoDialogueIndex(0);
    setDemoTimer(0);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start pt-2">
      {/* Selection Left Column */}
      <div className="xl:col-span-4 flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="bg-neutral-900 border border-neutral-800 p-1.5 rounded-xl flex gap-1 font-mono text-xs">
          <button
            onClick={() => { setMode('live_call'); if(isPlayingDemo) triggerDemoPlay(); }}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${
              mode === 'live_call' 
                ? 'bg-indigo-500 text-neutral-100 shadow' 
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Live Simulator
          </button>
          <button
            onClick={() => setMode('demo_recordings')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${
              mode === 'demo_recordings' 
                ? 'bg-indigo-500 text-neutral-100 shadow' 
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Demo Recordings
          </button>
          <button
            onClick={() => { setMode('call_history'); if(isPlayingDemo) triggerDemoPlay(); }}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all ${
              mode === 'call_history' 
                ? 'bg-indigo-500 text-neutral-100 shadow' 
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Call Logs
          </button>
        </div>

        {/* Dynamic Context Panel depending on mode */}
        {mode === 'live_call' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-semibold text-neutral-100 font-sans flex items-center gap-1.5">
              <Sparkles className="text-indigo-400" size={14} /> Choose Agent Industry
            </h4>
            <p className="text-xs text-neutral-400 leading-normal">
              Select one of our specialized agent templates below, or test a custom config built on your Prompt Maker.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {RIVOX_USE_CASES.map((useCase) => (
                <button
                  key={useCase.id}
                  disabled={isCalling}
                  onClick={() => setSelectedIndustry(useCase.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left flex-1 min-w-[130px] ${
                    selectedIndustry === useCase.id
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300 font-semibold'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700 disabled:opacity-50'
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono">Template</div>
                  <div>{useCase.title.split(' ')[0]} {useCase.title.split(' ')[1] || ''}</div>
                </button>
              ))}

              {customAgentConfig && (
                <button
                  disabled={isCalling}
                  onClick={() => setSelectedIndustry('custom')}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left flex-1 min-w-[200px] ${
                    selectedIndustry === 'custom'
                      ? 'border-purple-500 bg-purple-500/10 text-purple-300 font-bold'
                      : 'border-[#7c3aed]/40 bg-[#7c3aed]/5 text-neutral-300 hover:border-purple-500/40 disabled:opacity-50'
                  }`}
                >
                  <div className="text-[9px] uppercase tracking-wider text-purple-400 font-mono font-bold flex items-center gap-1">
                    <Sparkles size={9} /> Custom Prototype Active
                  </div>
                  <div className="truncate">{customAgentConfig.businessName}</div>
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-neutral-800">
              <div className="text-xs font-semibold text-neutral-300 font-mono uppercase tracking-wider mb-2">Behavior Parameters</div>
              <div className="bg-neutral-950 rounded-xl p-3 text-xs border border-neutral-850">
                <div className="flex justify-between mb-1.5">
                  <span className="text-neutral-500 font-mono">Current Identity:</span>
                  <span className="text-indigo-400 font-medium">Chloe AI v3.5</span>
                </div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-neutral-500 font-mono">Objective:</span>
                  <span className="text-neutral-300 truncate max-w-[160px]" title={currentUseCase.solution}>
                    {currentUseCase.solution}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 font-mono">Voice Synthesizer:</span>
                  <button 
                    onClick={toggleVoiceSetting}
                    className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    {voiceEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
                    {voiceEnabled ? 'On' : 'Muted'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === 'demo_recordings' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-semibold text-neutral-100 font-sans">
              Recorded Case Studies
            </h4>
            <p className="text-xs text-neutral-400 leading-normal">
              Listen to high-fidelity audio call recordings between Rivox AI and real customers.
            </p>

            <div className="space-y-3 pt-1">
              {DEMO_RECORDINGS.map((recording) => (
                <div
                  key={recording.id}
                  onClick={() => selectDemoTape(recording)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedDemo.id === recording.id
                      ? 'border-indigo-500/40 bg-indigo-500/10'
                      : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-neutral-200">{recording.companyName}</span>
                    <span className="text-[10px] font-mono text-neutral-500 font-semibold">{recording.duration}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1">{recording.category}</div>
                  <div className="text-[10px] uppercase font-mono mt-2 tracking-wider inline-block text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                    {recording.industry.replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === 'call_history' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-semibold text-neutral-1050 text-neutral-100 flex items-center gap-1.5">
              Live Calls Log Dashboard
            </h4>
            <p className="text-xs text-neutral-400 leading-normal">
              A mockup stream showing inbound telephone calls routed through Rivox in the last 2 hours.
            </p>

            <div className="space-y-3 pt-1 text-xs">
              <div className="flex justify-between text-[10.5px] text-neutral-500 font-mono border-b border-neutral-800 pb-2">
                <span>KPI Parameter</span>
                <span>Value</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Total Automation Answer Rate</span>
                <span className="font-mono text-emerald-400 font-bold">100.0%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Avg Pickup Delay</span>
                <span className="font-mono text-neutral-300">1.8 Seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">First-Call Triage Resolve Rate</span>
                <span className="font-mono text-neutral-300">92.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Active Live Channels</span>
                <span className="font-mono text-indigo-400 font-bold">4 Available</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Simulator Interface Right Column */}
      <div className="xl:col-span-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl relative min-h-[580px] flex flex-col justify-between">
          
          {/* Header Banner */}
          <div className="bg-neutral-950 border-b border-neutral-850 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-3.5 h-3.5 rounded-full ${
                  isCalling ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-700'
                }`} />
                {isCalling && (
                  <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75 pointer-events-none"></span>
                )}
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider text-neutral-500 font-mono">
                  {mode === 'live_call' ? 'Interstate Telephone Simulator' : mode === 'demo_recordings' ? 'Tape Registry Playback' : 'Historic Logs'}
                </h4>
                <div className="text-sm font-bold text-neutral-100 flex items-center gap-1.5">
                  {mode === 'live_call' ? (
                    <>Chloe Voice Assistant <span className="text-xs text-neutral-400 font-mono bg-neutral-900 px-2 py-0.5 rounded">+{currentUseCase.title}</span></>
                  ) : mode === 'demo_recordings' ? (
                    <>Voice Call File: <span className="font-mono text-indigo-400 text-xs font-semibold">{selectedDemo.companyName}</span></>
                  ) : (
                    <>Local Activity Database Records</>
                  )}
                </div>
              </div>
            </div>

            {/* Config action */}
            {mode === 'live_call' && isCalling && (
              <div className="flex gap-2">
                <button
                  onClick={toggleVoiceSetting}
                  className={`p-2 rounded-xl text-xs transition-all ${
                    voiceEnabled ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'
                  }`}
                  title={voiceEnabled ? 'Mute speech synthesis' : 'Unmute speech synthesis'}
                >
                  {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </button>
              </div>
            )}
          </div>

          {/* Core Body Container */}
          <div className="flex-1 p-5 overflow-y-auto max-h-[420px] bg-neutral-950 scrollbar-thin scrollbar-thumb-neutral-800">
            {/* Live Call Conversation mode */}
            {mode === 'live_call' && (
              <>
                {!isCalling && !isConnecting && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-5 px-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/30 to-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/5 animate-bounce">
                      <Phone size={24} />
                    </div>
                    <div className="space-y-1 max-w-sm">
                      <h3 className="text-base font-semibold text-neutral-200">Test the Voice Agent</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Start a voice call simulation right in your browser! Chloe will introduce herself based on the {selectedIndustry === 'custom' ? 'custom builder' : selectedIndustry} prompt, list standard hours, schedule slots, and answer questions.
                      </p>
                    </div>

                    <button
                      onClick={startCall}
                      className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold leading-none tracking-wider uppercase transition-all shadow-lg hover:shadow-emerald-500/10 flex items-center gap-2 cursor-pointer"
                    >
                      <Phone size={14} fill="currentColor" /> Initiate Telephone Simulation
                    </button>
                  </div>
                )}

                {isConnecting && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-4">
                    <div className="w-12 h-12 rounded-full border-2 border-neutral-850 border-t-indigo-500 animate-spin" />
                    <div>
                      <p className="text-xs font-mono text-indigo-400 animate-pulse uppercase tracking-widest font-bold">Connecting SIP Trunks...</p>
                      <p className="text-[11px] text-neutral-500 mt-1 font-mono">Initializing Chloe prompt schema</p>
                    </div>
                  </div>
                )}

                {isCalling && (
                  <div className="space-y-4 pt-2">
                    {/* Log details context banner at call top */}
                    <div className="bg-neutral-900/40 p-3 rounded-xl text-[10.5px] border border-neutral-850/60 flex items-center justify-between text-neutral-400">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        Channel SECURE
                      </div>
                      <div className="font-mono text-right">
                        Active Node: <strong className="text-indigo-400 uppercase">{activeStepCode}</strong>
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs text-left ${
                            msg.role === 'user'
                              ? 'bg-indigo-600 text-neutral-100 rounded-br-none font-medium'
                              : 'bg-neutral-900 text-neutral-200 border border-neutral-800 rounded-bl-none leading-relaxed'
                          }`}>
                            <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono mb-1.5">
                              <span>{msg.role === 'user' ? 'You' : 'Chloe AI'}</span>
                              <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                            </div>
                            <p className="whitespace-pre-line">{msg.text}</p>
                          </div>
                        </motion.div>
                      ))}

                      {/* Speaking / Thinking waveform */}
                      {isThinking && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start"
                        >
                          <div className="bg-neutral-900 border border-neutral-800 rounded-xl rounded-bl-none p-3 max-w-[80%] flex items-center gap-2">
                            <span className="text-[10px] text-indigo-400 font-mono animate-pulse uppercase font-medium">Chloe listening...</span>
                            <div className="flex gap-0.5 items-end h-3 px-1.5">
                              <span className="w-1 bg-indigo-500 rounded animate-[pulse_1.0s_infinite]" style={{ height: '40%' }}></span>
                              <span className="w-1 bg-indigo-500 rounded animate-[pulse_0.7s_infinite_delay_100ms]" style={{ height: '80%' }}></span>
                              <span className="w-1 bg-indigo-500 rounded animate-[pulse_1.2s_infinite]" style={{ height: '50%' }}></span>
                              <span className="w-1 bg-indigo-500 rounded animate-[pulse_0.9s_infinite_delay_200ms]" style={{ height: '90%' }}></span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Chloe speaking wave */}
                    {!isThinking && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (
                      <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 justify-start pl-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                        Voice Audio Out Syncing
                      </div>
                    )}

                    <div ref={messageEndRef} />
                  </div>
                )}
              </>
            )}

            {/* Demo recordings playback */}
            {mode === 'demo_recordings' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-neutral-950 to-neutral-900 border border-neutral-850 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h5 className="text-xs uppercase tracking-wider font-mono text-neutral-500">Selected Playback Reel</h5>
                    <div className="text-sm font-bold text-neutral-200 mt-0.5">{selectedDemo.companyName}</div>
                    <div className="text-[11px] text-neutral-400 font-semibold italic">{selectedDemo.category} | {selectedDemo.duration}</div>
                  </div>

                  <button
                    onClick={triggerDemoPlay}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold font-mono tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                      isPlayingDemo 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                        : 'bg-indigo-500 hover:bg-indigo-400 text-neutral-100'
                    }`}
                  >
                    {isPlayingDemo ? <PhoneOff size={13} /> : <Volume2 size={13} />}
                    {isPlayingDemo ? 'HALT PLAYBACK' : 'TAP REEL PLAY'}
                  </button>
                </div>

                {/* Simulated Waveform */}
                {isPlayingDemo && (
                  <div className="flex flex-col items-center justify-center p-3.5 bg-neutral-900/30 border border-neutral-850 rounded-xl space-y-1.5">
                    <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest font-bold">Audio Sync Oscillator</span>
                    <div className="flex items-end justify-center gap-1.5 h-10 w-full max-w-sm">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <motion.span
                          key={i}
                          animate={{ 
                            height: isPlayingDemo 
                              ? [`${15 + Math.random() * 85}%`, `${20 + Math.random() * 60}%`, `${15 + Math.random() * 85}%`] 
                              : "20%" 
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 0.6 + (i % 5) * 0.1, 
                            ease: "easeInOut" 
                          }}
                          className={`w-1 rounded ${
                            selectedDemo.dialogue[demoDialogueIndex]?.speaker === 'Agent' 
                              ? 'bg-indigo-400' 
                              : 'bg-cyan-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Dialogue transcripts list */}
                <div className="space-y-3 pt-2">
                  {selectedDemo.dialogue.slice(0, isPlayingDemo ? demoDialogueIndex + 1 : selectedDemo.dialogue.length).map((line, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: line.speaker === 'Agent' ? -15 : 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${line.speaker === 'Agent' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`p-3 max-w-[80%] rounded-2xl text-xs text-left border ${
                        line.speaker === 'Agent'
                          ? 'bg-indigo-950/20 border-indigo-900/20 text-neutral-300 rounded-bl-none'
                          : 'bg-neutral-900 border-neutral-850 text-neutral-300 rounded-br-none'
                      }`}>
                        <div className="flex justify-between text-[9.5px] text-neutral-500 font-mono mb-1">
                          <span className={line.speaker === 'Agent' ? 'text-indigo-400 font-bold' : 'text-neutral-400 font-semibold'}>
                            {line.speaker === 'Agent' ? 'Chloe' : 'Customer'}
                          </span>
                          <span>{line.time}</span>
                        </div>
                        <p className="leading-relaxed">{line.text}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isPlayingDemo && demoDialogueIndex < selectedDemo.dialogue.length - 1 && (
                    <div className="text-center py-2">
                      <span className="text-[10px] font-mono text-neutral-600 animate-pulse italic">
                        Writing standard audio packet transcript stream...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Inbound Call Logs */}
            {mode === 'call_history' && (
              <div className="space-y-4">
                <span className="text-xs uppercase font-mono tracking-wider text-neutral-500">Telephone SIP Activity Ledger</span>
                <div className="space-y-3.5 pt-1">
                  {RECENT_CALLS_MOCK.map((log) => (
                    <div key={log.id} className="p-4 bg-neutral-900 border border-neutral-850 rounded-xl text-left space-y-2 hover:border-neutral-850 transition-all">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-neutral-100">{log.customerName}</span>
                          <span className="text-xs font-mono text-neutral-500">{log.phoneNumber}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          log.status === 'Completed & Booked'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : log.status === 'Qualified Lead'
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                              : log.status === 'Escalated to Staff'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                        }`}>
                          {log.status}
                        </span>
                      </div>

                      <p className="text-[11.5px] text-neutral-400 leading-relaxed font-sans">{log.summary}</p>

                      <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 pt-2 border-t border-neutral-850/60">
                        <span>Duration: {log.duration}</span>
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Input Bar */}
          <div className="bg-neutral-950 border-t border-neutral-850 p-4">
            {mode === 'live_call' && isCalling ? (
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  disabled={isThinking}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type what you want to say to Chloe..."
                  className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-neutral-200 outline-none transition-all placeholder:text-neutral-500"
                />
                
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isThinking}
                  className="p-3 bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-500 hover:bg-indigo-400 text-neutral-950 rounded-xl transition-all cursor-pointer flex items-center justify-center text-neutral-100"
                >
                  <Send size={14} />
                </button>

                <button
                  type="button"
                  onClick={endCall}
                  className="p-3 bg-rose-500 hover:bg-rose-400 text-neutral-950 rounded-xl transition-all cursor-pointer flex items-center justify-center text-neutral-100"
                  title="Hang Up"
                >
                  <PhoneOff size={14} />
                </button>
              </form>
            ) : mode === 'live_call' ? (
              <div className="text-center py-2">
                <span className="text-xs text-neutral-500 font-mono">
                  State: <strong className="text-neutral-400 font-semibold text-[11px] font-sans">Telephone Line Offline</strong>
                </span>
              </div>
            ) : mode === 'demo_recordings' ? (
              <div className="flex items-center justify-between text-xs font-mono text-neutral-500 px-2 py-1">
                <span>Tape Deck Status: {isPlayingDemo ? 'STREAMING ACTIVE' : 'REEL READY'}</span>
                <span>Speed: Standard PCM 16kHz</span>
              </div>
            ) : (
              <div className="text-center text-xs font-mono text-neutral-500 py-1">
                Records verified. Backups synchronized to CRM 5 minutes ago.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
