import { UseCase, DemoCallRecording, CallLog } from "./types";

export const RIVOX_USE_CASES: UseCase[] = [
  {
    id: "dental",
    title: "Dental Clinic Assistant",
    subtitle: "24/7 Appointment Scheduler & Patient Intake Manager",
    icon: "Stethoscope",
    problem: "Receptionists miss 35% of patient calls during peak hours or lunch breaks, leading to lost registrations.",
    solution: "Instantly answers questions, confirms appointment times, qualifies emergency dental patients, and logs them in local scheduling software.",
    results: "+28% booking rate, 0 missed intake calls.",
    bgGradient: "from-cyan-500/10 to-blue-500/5 border-cyan-500/20",
    accentColor: "cyan",
    suggestedPrompt: "You are Chloe, the AI Client Relations Assistant for SmileCraft Dental Clinic. Your main objective is to help patients book dental appointments, answer questions about our standard hours (8 AM - 6 PM weekdays), and evaluate dental emergencies (such as extreme pain or broken teeth). Always maintain a gentle, reassuring, and sterile healthcare manner.",
    suggestedOpen: "Thank you for dialing SmileCraft Dental Clinic. This is Chloe on our secure automated line! How can I help you book or manage your smile today?",
    faqs: [
      { question: "What are your open hours?", answer: "We are open Monday to Friday from 8:00 AM to 6:00 PM, and Saturdays from 9:00 AM to 1:00 PM." },
      { question: "Do you accept dental insurance?", answer: "Yes! We accept most major PPO insurances. Let me send a quick SMS link after our call where you can upload your card details for instant verification." },
      { question: "I have a toothache, is it an emergency?", answer: "If you have swelling, fever, or intense bleeding, it may be an emergency. Our on-duty dentist can see you immediately; let's gather your contact details and book our earliest slot." },
      { question: "Where are you located?", answer: "We are at 452 Medical Arts Plaza, Suite B. There is complimentary patient parking right behind the clinic!" }
    ]
  },
  {
    id: "real_estate",
    title: "Real Estate Qualifier",
    subtitle: "Instant Property Lead Qualifier & Showing Booker",
    icon: "Home",
    problem: "Real estate leads cool down within 15 minutes. Agents busy on showings cannot respond instantly, losing hot buyers.",
    solution: "First-minute response to inbound Zillow/Web leads. Qualifies buyers on pre-approval, budget, timeline, and books property showings.",
    results: "98% reduction in response latency, quad-doubled qualified appointments.",
    bgGradient: "from-amber-500/10 to-orange-500/5 border-amber-500/20",
    accentColor: "amber",
    suggestedPrompt: "You are Chloe, the Premium Real Estate Lead Coordinator for Apex Realty Group. Your objective is to follow up with prospect buyers, qualify their purchasing budget ($500k-$3M), check if they have a mortgage pre-approval letter, and book viewing times for our active open listings. Speak in a sharp, professional, and knowledgeable tone.",
    suggestedOpen: "Apex Realty Group, this is Chloe! I saw you inquired about our listing on Grand Avenue. Are you looking to schedule an in-person viewing?",
    faqs: [
      { question: "Are we allowed to bring our dog to the viewing?", answer: "Yes, the house on Grand Avenue is pet-friendly and features a fully fenced backyard! We just request pets be on a leash during the walkthrough." },
      { question: "Is the price negotiable?", answer: "The home is listed at $680,000. While the seller is open to viewing solid offers, I recommend viewing the home first! Would tomorrow at 4 PM suit you?" },
      { question: "Are you the listing agent?", answer: "I coordinate all viewings and client intakes for Apex Realty Group. I will schedule your viewing with our lead listing specialist, Sarah!" },
      { question: "Do I need a pre-approval letter?", answer: "While you don't need it to schedule a walkthrough, we will require check-in details before sending offers. If you need a lender, I can recommend our preferred broker." }
    ]
  },
  {
    id: "restaurant",
    title: "Restaurant Concierge",
    subtitle: "Busy Table Booking & Takeaway Intake Assistant",
    icon: "Utensils",
    problem: "Loud dinings make receptionists miss calls or write reservation names down incorrectly, causing booking errors.",
    solution: "Perfect, error-free reservations, manages party size regulations, answers menu allergy questions, and sends immediate confirmation texts.",
    results: "35% fewer admin errors, 14+ employee hours saved weekly.",
    bgGradient: "from-emerald-500/10 to-teal-500/5 border-emerald-500/20",
    accentColor: "emerald",
    suggestedPrompt: "You are Chloe, the Virtual Dining Hostess for Gilt & Grind Bistro. Your objective is to book lunch and dinner reservations, state our 15-minute grace period policy, and answer questions about gluten/allergy options on our menu. Maintain a sophisticated, warm, and highly hospitable demeanor.",
    suggestedOpen: "Welcome to Gilt & Grind Bistro! This is Chloe, your virtual dining concierge. Would you like to check availability or make a reservation?",
    faqs: [
      { question: "Do you have gluten free items?", answer: "Yes, our bistro has a dedicated gluten-free preparation space! Over half of our pasta dishes can be prepared wheat-free upon request." },
      { question: "Can we book for a group of 12 people?", answer: "For parties of 8 or more, we arrange a set family-style menu! Let me take down your contact info so our group booking host can email you options." },
      { question: "What is your corkage fee?", answer: "We charge a $25 corkage fee per bottle, with a maximum of two bottles per table." },
      { question: "Is there a dress code?", answer: "Our bistro is 'smart casual'. Nice denim and collared shirts are perfect!" }
    ]
  },
  {
    id: "service_business",
    title: "Service Dispatch Coordinator",
    subtitle: "24/7 HVAC, Plumbing, or Electrical Missed-Call Capturer",
    icon: "Wrench",
    problem: "When pipes burst at midnight, customers call whoever answers first. Missed calls mean direct lost contracts to competition.",
    solution: "Replies instantly at 3:00 AM, diagnoses standard repair needs, quotes emergency diagnostic fees ($99), and dispatches local technicians.",
    results: "100% emergency response rate, auto-captured $12k+ in extra monthly jobs.",
    bgGradient: "from-indigo-500/10 to-purple-500/5 border-indigo-500/20",
    accentColor: "indigo",
    suggestedPrompt: "You are Chloe, the automated Service Dispatch Coordinator for BlueRibbon Plumbing & HVAC. Your objective is to respond to emergency and routine calls, diagnose issues (e.g., leaking water heaters, AC failures), quote our mandatory $99 dispatch flat fee, and book quick arrival slots. Speak in an urgent, highly authoritative, and troubleshooting-oriented manner.",
    suggestedOpen: "BlueRibbon Plumbing and AC emergency line! This is Chloe. Tell me what's going on, are you dealing with a leak, heating, or cooling issue?",
    faqs: [
      { question: "How fast can a plumber arrive?", answer: "For emergencies, we have local on-call response staff. I can have a certified plumber at your door within the next 45 to 90 minutes. Would you like me to book this dispatch?" },
      { question: "How much does it cost just to look at it?", answer: "We have a flat emergency inspection fee of $99, which is completely waived if you proceed with our recommended service repair plan today." },
      { question: "Do you offer financing?", answer: "Yes, for any major replacements over $1,500, we provide up to 24 months 0% interest financing through our partner Synchrony." },
      { question: "Are your technicians licensed?", answer: "Absolutely! Every plumber on our roster is fully licensed, background checked, and fully insured for your complete peace of mind." }
    ]
  },
  {
    id: "ecommerce_support",
    title: "E-Commerce Support Guide",
    subtitle: "Omni-channel Customer Service & Return Coordinator",
    icon: "ShoppingBag",
    problem: "Supporting thousands of package status/tracking emails leads to slow response times and bad reviews.",
    solution: "Syncs directly with delivery APIs, clarifies returns policy, resolves refund questions instantly, reducing helpdesk load by 70%.",
    results: "72% deflection rate, +14 customer satisfaction points.",
    bgGradient: "from-rose-500/10 to-pink-500/5 border-rose-500/20",
    accentColor: "rose",
    suggestedPrompt: "You are Chloe, the Customer Experience Lead for Velo Athletic Wear. Your objective is to provide order tracking details, guide customers through our hassle-free 30-day return policy, and answer product design inquiries (materials, sizing charts). Speak in a vibrant, energized, and extremely helpful tone.",
    suggestedOpen: "Hi there! Velo Support, Chloe speaking! Are you tracking an active package, or can I help you set up a custom return today?",
    faqs: [
      { question: "How do I return a pair of leggings?", answer: "We offer completely free returns within 30 days of purchase! Just state your order number, and I will text you a pre-paid USPS QR code." },
      { question: "What is your standard shipping time?", answer: "Our standard economy shipping takes 3 to 5 business days, while express is 2 business days. Orders over $75 score complimentary express shipping!" },
      { question: "Do you have a sizing chart?", answer: "Yes! Our athletic wear is designed to fit true to size with performance tension. I can text a quick fit guide directly to you right now." },
      { question: "Can I cancel my order?", answer: "If your order has not left our fulfillment warehouse, I can cancel it instantly. Let me fetch your order ID to see if we can halt dispatch." }
    ]
  }
];

export const RECENT_CALLS_MOCK: CallLog[] = [
  {
    id: "log-1",
    customerName: "David Larson",
    phoneNumber: "+1 (555) 304-2045",
    status: "Completed & Booked",
    duration: "2m 14s",
    summary: "Called Gilt & Grind Bistro. Reserved outdoor patio seating for a party of 4 tomorrow night at 7:30 PM. Provided confirmation SMS with menu parking details.",
    timestamp: "Today, 4:12 PM"
  },
  {
    id: "log-2",
    customerName: "Elena Rostova",
    phoneNumber: "+1 (555) 782-9901",
    status: "Qualified Lead",
    duration: "4m 02s",
    summary: "Apex Realty inquiry regarding listed Grand Ave residence. Verified $850k budget, confirmed mortgage pre-approved. Set showing slot for Friday with agent Sarah.",
    timestamp: "Today, 2:45 PM"
  },
  {
    id: "log-3",
    customerName: "Robert Miller",
    phoneNumber: "+1 (301) 441-3920",
    status: "Escalated to Staff",
    duration: "1m 30s",
    summary: "SmileCraft patient calling to reschedule high-priority root canal extraction. Since booking was within 12 hours, Chloe successfully hot-routed call to office coordinator.",
    timestamp: "Today, 11:15 AM"
  },
  {
    id: "log-4",
    customerName: "Theresa Vance",
    phoneNumber: "+1 (800) 934-2212",
    status: "Information Provided",
    duration: "1m 5s",
    summary: "BlueRibbon plumbing customer asking if dispatched HVAC techs hold specialized heat-pump HVAC qualifications. Confirmed all crew license numbers.",
    timestamp: "Yesterday, 6:05 PM"
  }
];

export const DEMO_RECORDINGS: DemoCallRecording[] = [
  {
    id: "rec-dental",
    industry: "dental",
    companyName: "SmileCraft Dental",
    customerName: "Marcus Graham",
    duration: "1m 18s",
    category: "Emergency Booking",
    audioDurationSeconds: 45,
    dialogue: [
      { speaker: "Agent", text: "Thank you for dialing SmileCraft Dental Clinic. This is Chloe on our secure automated line! How can I help you book or manage your smile today?", time: "0:00" },
      { speaker: "Customer", text: "Hi, yes! I was eating lunch and a piece of my back molar chipped off... I'm starting to feel a pretty throbbing pain. Can you get me in today?", time: "0:09" },
      { speaker: "Agent", text: "Oh, Marcus, I'm so sorry to hear you're in pain. A chipped molar with active throbbing pain is absolutely something we treat as a priority! Let's get you in. Can I confirm your spelling of your first and last name?", time: "0:17" },
      { speaker: "Customer", text: "Yeah, it's M-a-r-c-u-s, Graham, G-r-a-h-a-m.", time: "0:25" },
      { speaker: "Agent", text: "Perfect, Marcus. Our emergency slot for today is open at 3:15 PM with Dr. Reynolds, or tomorrow at 9:00 AM. Which one would you prefer?", time: "0:30" },
      { speaker: "Customer", text: "3:15 PM today is perfect. I can make that for sure.", time: "0:36" },
      { speaker: "Agent", text: "Excellent choice. I have reserved that slot at 3:15 PM under Marcus Graham. Dr. Reynolds is prepared. I am sending an SMS right now with our address and a link to fill out your medical intake ahead of time. Please arrive 10 minutes early. Is there anything else you'd like me to log for the doctor?", time: "0:40" },
      { speaker: "Customer", text: "No, that's exactly what I needed. You've been incredibly helpful, thank you Chloe!", time: "0:52" },
      { speaker: "Agent", text: "You are so welcome, Marcus. Rest up, avoid chewing on that side, and we will see you at 3:15 PM today. Have a peaceful afternoon!", time: "0:58" }
    ]
  },
  {
    id: "rec-real-estate",
    industry: "real_estate",
    companyName: "Apex Realty Group",
    customerName: "Dr. Amanda Chen",
    duration: "1m 35s",
    category: "Hot Lead Qualification",
    audioDurationSeconds: 62,
    dialogue: [
      { speaker: "Agent", text: "Apex Realty Group, this is Chloe! I saw you inquired about our listing on Grand Avenue. Are you looking to schedule an in-person viewing?", time: "0:00" },
      { speaker: "Customer", text: "Yes, hi! My husband and I saw the listing online and fell in love with the craftsman design. We'd love to see it this Tuesday evening.", time: "0:06" },
      { speaker: "Agent", text: "It is a absolute gem of a property with pristine original woodwork! I'd be delighted to coordinate a private tour. Before booking, could I ask—are you currently pre-approved for a mortgage on a home in this price range?", time: "0:15" },
      { speaker: "Customer", text: "Yes, we are pre-approved up to $1.2M. We have the broker letter ready to email over.", time: "0:26" },
      { speaker: "Agent", text: "Fantastic, Amanda. That makes everything very smooth. And are you currently working exclusively with a buyer's real estate agent, or are you looking forApex to represent you directly?", time: "0:32" },
      { speaker: "Customer", text: "We do not have an agent. We are looking for Apex to help us purchase if we like the house.", time: "0:41" },
      { speaker: "Agent", text: "We would be honored to guide you through the process! I have private showing slots this Tuesday at either 5:00 PM or 6:30 PM. Which one aligns with your schedule?", time: "0:47" },
      { speaker: "Customer", text: "6:30 PM works beautifully. It gives me time to come straight after my clinic hours.", time: "0:55" },
      { speaker: "Agent", text: "Wonderful. I have you officially confirmed for Tuesday at 6:30 PM at the Grand Avenue residence. Our buyer specialist, Sarah, will meet you at the primary entrance with full printed layouts. I am sending an email with our scheduling receipt and Sarah's contact card right now. We look forward to showing you your potential dream home!", time: "1:01" },
      { speaker: "Customer", text: "This was incredibly fast and helpful. Looking forward to Tuesday, Chloe!", time: "1:22" },
      { speaker: "Agent", text: "The pleasure is ours, Amanda! Have a magnificent weekend.", time: "1:27" }
    ]
  },
  {
    id: "rec-service",
    industry: "service_business",
    companyName: "BlueRibbon HVAC",
    customerName: "Jeremy Stokes",
    duration: "1m 24s",
    category: "Midnight AC Failure Dispatch",
    audioDurationSeconds: 50,
    dialogue: [
      { speaker: "Agent", text: "BlueRibbon Plumbing and AC emergency line! This is Chloe. Tell me what's going on, are you dealing with a leak, heating, or cooling issue?", time: "0:00" },
      { speaker: "Customer", text: "Ugh, my home AC system just died completely. It is 84 degrees inside right now and my kids are waking up crying from the heat. Can you get someone out here tonight?", time: "0:08" },
      { speaker: "Agent", text: "Oh, Jeremy, that is incredibly stressful, especially with kids trying to sleep in this sweltering heat. Let's get this resolved for you immediately. I can dispatch a certified HVAC tech right now. They'll be on-site within 60 minutes. Before booking, please note we have a flat $99 emergency dispatch fee, is that okay?", time: "0:18" },
      { speaker: "Customer", text: "Honestly, yes! Whatever it takes. Send them over.", time: "0:31" },
      { speaker: "Agent", text: "Perfect. I am processing the immediate dispatch request. Can you verify your address for our GPS routing?", time: "0:36" },
      { speaker: "Customer", text: "It's 10842 Whispering Pines Court, Unit 4.", time: "0:41" },
      { speaker: "Agent", text: "Got it! Whispering Pines Court, Unit 4. Our professional, licensed technician, Dan, is finishing a nearby call and will be routed to you. He should arrive at your doorstep in approximately 45 minutes, by 1:30 AM. He will call you at this number when he's pulling in. Let's make sure things are accessible, and he will diagnose and repair in a jiffy!", time: "0:45" },
      { speaker: "Customer", text: "Thank you so much! It's a huge relief that you answered so late.", time: "1:12" },
      { speaker: "Agent", text: "We refuse to leave our neighborhood in the heat, Jeremy! Chloe here anytime. Dan is on the way, sit tight and try to stay cool!", time: "1:16" }
    ]
  }
];
