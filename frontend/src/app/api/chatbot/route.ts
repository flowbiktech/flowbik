import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Knowledge base inlined — no file I/O needed in serverless
const KNOWLEDGE_BASE = {
  company: {
    name: "FlowBik",
    tagline: "Building thoughtful software, one step at a time.",
    stage: "Early-stage startup",
    founded: "2024",
  },
  services: [
    { name: "IT Services", description: "Web apps, APIs, automation scripts, and small tools." },
    { name: "Product Building", description: "We tinker with product ideas and build things we genuinely care about." },
  ],
  projects: [
    { name: "Internal tool for small teams", status: "In progress" },
    { name: "Open-source CLI utility", status: "Early exploration" },
    { name: "Client project", status: "Under NDA" },
  ],
  contact: { email: "hello@flowbik.com", note: "No spammy newsletter, just occasional updates." },
  faq: [
    { question: "Are you hiring?", answer: "Not right now, but we're always open to meeting good people." },
    { question: "Do you take freelance projects?", answer: "Yes, depending on the fit. Reach out and let's talk." },
    { question: "When will your products launch?", answer: "No fixed dates yet. When something's ready, we'll share it." },
  ],
};

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { bot_reply: "Service temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ bot_reply: "Invalid request." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = `You are FlowBik's chatbot assistant. Always answer as a representative of FlowBik.

FlowBik Knowledge Base:
${JSON.stringify(KNOWLEDGE_BASE, null, 2)}

Rules:
- For questions about services, products, or company info, ONLY use the knowledge base above.
- If asked "who built you" or "what are you", say you are built by FlowBik.
- Keep answers short, clear, and friendly.
- If you don't know something, say so honestly — don't make things up.`;

    const result = await model.generateContent(`${systemPrompt}\n\nUser: ${message}\nAssistant:`);
    const botReply = result.response.text().trim() || "I couldn't generate a response. Please try again.";

    return NextResponse.json({ bot_reply: botReply });
  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json({ bot_reply: "Oops! Something went wrong." }, { status: 500 });
  }
}