import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gracefully handle Gemini initialization
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log("Gemini API Client initialized successfully.");
    } catch (err) {
      console.error("Failed to initialize Gemini client:", err);
    }
  } else {
    console.warn("GEMINI_API_KEY environment variable is missing or placeholder. Running in demo fallback mode.");
  }

  // Base64 helper for image fallback if needed
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: ai ? "live" : "demo" });
  });

  // API Route for agent generation
  app.post("/api/agent/generate-prompt", async (req, res) => {
    try {
      const { businessName, industry, objective, voiceTone } = req.body;
      if (!businessName || !industry || !objective) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (!ai) {
        // Fallback mock prompt generator when API key is missing
        return res.json({
          systemInstruction: `You are Chloe, a highly sophisticated AI voice assistant for ${businessName}, operating in the ${industry} industry. Your primary purpose is to: ${objective}.
Speak in a ${voiceTone || 'professional and friendly'} tone.
Be polite, articulate, and direct, simulating a real high-fidelity business phone call. Always guide the user to their desired goal efficiently. Do not hallucinate external details. If a customer asks a question outside of: ${objective}, offer to take their details and have a human representative contact them.`,
          agentName: "Chloe",
          suggestedScriptOpen: `Hello, thank you for calling ${businessName}! This is Chloe, your automated AI assistant. How can I help you today?`,
          faqs: [
            { question: `What can you help me with?`, answer: `I can help you with: ${objective}, as well as standard operational inquires!` },
            { question: `Can I speak to a human?`, answer: `Absolutely! I can take your name, number, and message, or attempt to route you to our staff if they're currently available.` }
          ]
        });
      }

      const prompt = `Create a professional system instruction prompt for an AI Voice Agent based on these business details:
Business Name: ${businessName}
Industry: ${industry}
Primary Objective: ${objective}
Voice Tone: ${voiceTone || 'professional and friendly'}

The system instruction should define:
1. Role & Identity (Chloe, a highly professional automated assistant)
2. Precise rules for booking, answering, qualifying, or transferring (keep bullet points clear)
3. Step-by-step logic (e.g. greeting -> information capture -> confirmation -> call-off)
4. Key boundaries (never make up pricing, remain polite, direct customers to email or leave message if outside scope)
5. A list of 4 realistic customer FAQs with sample answers.

Return the response in a JSON object with this exact structure:
{
  "systemInstruction": "The detailed string containing the system instruction prompt.",
  "agentName": "Chloe",
  "suggestedScriptOpen": "Example first sentence the agent says when answering the phone",
  "faqs": [
    { "question": "Question text", "answer": "Answer text" }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const data = JSON.parse(response.text || '{}');
      res.json(data);
    } catch (error: any) {
      console.error("Error generating agent:", error);
      res.status(500).json({ error: error?.message || "Failed to generate prompt" });
    }
  });

  // API Route for chat simulation
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, systemInstruction, history } = req.body;
      if (!message || !systemInstruction) {
        return res.status(400).json({ error: "Missing message or systemInstruction" });
      }

      if (!ai) {
        // Fallback mockup chat responding with dynamic mock text
        const lower = message.toLowerCase();
        let reply = "I understand. I am Chloe, your automated assistant. Could you tell me more so I can process your request?";
        if (lower.includes("hello") || lower.includes("hi")) {
          reply = `Hello! Thank you for calling. I'm here to assist you. What can I do for you today?`;
        } else if (lower.includes("price") || lower.includes("cost") || lower.includes("cheap")) {
          reply = "For specific pricing, I can gather your contact details and have one of our specialized accounts representatives reach out directly. Would you like to leave your name and number?";
        } else if (lower.includes("book") || lower.includes("appointment") || lower.includes("schedule") || lower.includes("reserve")) {
          reply = "Based on our calendar, I have openings tomorrow at 10:00 AM or 2:30 PM. Would either of those slots work for you?";
        } else if (lower.includes("human") || lower.includes("person") || lower.includes("staff")) {
          reply = "I can transfer you right away, or if our team is currently busy, take a message. What's your preferred phone number?";
        } else {
          reply = `That makes sense. To carry out your goal of "${message.substring(0, 40)}...", let me register these details on your profile. Is there anything else I need to know?`;
        }
        return res.json({ reply });
      }

      // Format previous history for Gemini chats
      const contents = [];
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          contents.push({
            role: turn.role === "agent" || turn.role === "assistant" || turn.role === "model" ? "model" : "user",
            parts: [{ text: turn.text }]
          });
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Error in chat api:", error);
      res.status(500).json({ error: error?.message || "Failed to communicate with AI agent" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
