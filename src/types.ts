export type IndustryType = 'dental' | 'real_estate' | 'restaurant' | 'ecommerce_support' | 'service_business' | 'custom';

export interface UseCase {
  id: IndustryType;
  title: string;
  subtitle: string;
  icon: string;
  problem: string;
  solution: string;
  results: string;
  bgGradient: string;
  accentColor: string;
  suggestedPrompt: string;
  suggestedOpen: string;
  faqs: { question: string; answer: string }[];
}

export interface AgentConfig {
  businessName: string;
  industry: IndustryType;
  objective: string;
  voiceTone: string;
  systemPrompt: string;
  initialScript: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  isAudioDemo?: boolean;
}

export interface CallLog {
  id: string;
  customerName: string;
  phoneNumber: string;
  status: 'Completed & Booked' | 'Qualified Lead' | 'Escalated to Staff' | 'Information Provided';
  duration: string;
  summary: string;
  timestamp: string;
}

export interface DemoCallRecording {
  id: string;
  industry: IndustryType;
  companyName: string;
  customerName: string;
  duration: string;
  category: string;
  audioDurationSeconds: number;
  dialogue: { speaker: 'Agent' | 'Customer'; text: string; time: string }[];
}
