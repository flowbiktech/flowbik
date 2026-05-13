"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface Message {
  role: "bot" | "user";
  content: string;
  options?: string[];
}

const staticResponses: Record<string, string> = {
  services:
    "We offer AI Integration, Web Development, Custom Chatbots, Automation & APIs, Data & Analytics, and Product Strategy.",
  product:
    "We're currently building something exciting behind the scenes! 🚀 Stay tuned for updates on our first SaaS product — coming soon.",
  process:
    "Our process is simple: 1) Discovery Call, 2) Solution Design, 3) Build & Iterate, and 4) Launch & Support.",
  pricing:
    "We offer project-based pricing for defined scopes and retainers for ongoing work. Reach out via the Contact form for a quote!",
  contact:
    "You can reach us at hello@flowbik.com. We typically respond within 24 hours on business days.",
  stack:
    "Our primary stack is Next.js, React, FastAPI, Python, and various AI providers.",
  ai: 
    "We integrate custom LLMs, build RAG pipelines, develop AI chatbots, and automate workflows using providers like OpenAI and Gemini.",
  web: 
    "We build production-grade web applications using Next.js, React, and TypeScript, focusing on speed, scalability, and clean architecture.",
  timeline: 
    "A focused MVP or feature integration typically takes 3–6 weeks. Larger platforms can take 2–4 months. We provide a detailed timeline after a discovery call.",
  team: 
    "Flowbik is an independent, small SaaS startup. You work directly with the engineers — no account managers, no layers, just clear communication.",
};

const quickQuestions = [
  "What services do you offer?",
  "Are you building a product?",
  "How does the process work?",
  "How is pricing structured?",
  "Tell me about AI integration",
  "What is your tech stack?",
  "How long do projects take?",
  "How can I contact you?",
];

function getStaticReply(input: string): Message {
  const lower = input.toLowerCase();
  
  if (lower.includes("service") || lower.includes("offer") || lower.includes("do you do")) {
    return { role: "bot", content: staticResponses.services, options: ["Tell me about AI integration", "What about web development?"] };
  }
  if (lower.includes("product") || lower.includes("building") || lower.includes("coming soon") || lower.includes("hris") || lower.includes("atom")) {
    return { role: "bot", content: staticResponses.product };
  }
  if (lower.includes("process") || lower.includes("how") && lower.includes("work") || lower.includes("step")) {
    return { role: "bot", content: staticResponses.process };
  }
  if (lower.includes("price") || lower.includes("cost") || lower.includes("pricing") || lower.includes("budget") || lower.includes("how much")) {
    return { role: "bot", content: staticResponses.pricing };
  }
  if (lower.includes("contact") || lower.includes("email") || lower.includes("reach") || lower.includes("talk") || lower.includes("hire")) {
    return { role: "bot", content: staticResponses.contact };
  }
  if (lower.includes("stack") || lower.includes("tech") || lower.includes("technolog") || lower.includes("next") || lower.includes("python")) {
    return { role: "bot", content: staticResponses.stack };
  }
  if (lower.includes("ai") || lower.includes("llm") || lower.includes("chatbot") || lower.includes("openai") || lower.includes("gemini")) {
    return { role: "bot", content: staticResponses.ai };
  }
  if (lower.includes("web") || lower.includes("frontend") || lower.includes("react") || lower.includes("next.js") || lower.includes("app")) {
    return { role: "bot", content: staticResponses.web };
  }
  if (lower.includes("long") || lower.includes("time") || lower.includes("timeline") || lower.includes("duration") || lower.includes("weeks")) {
    return { role: "bot", content: staticResponses.timeline };
  }
  if (lower.includes("team") || lower.includes("who") || lower.includes("size") || lower.includes("startup")) {
    return { role: "bot", content: staticResponses.team };
  }
  if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
    return { role: "bot", content: "Hello! 👋 How can I help you today?", options: ["What services do you offer?", "Are you building a product?"] };
  }
  
  return { role: "bot", content: "I can help with questions about our Services, Process, Pricing, Tech Stack, or upcoming Product. Try asking about one of those!", options: ["What services do you offer?", "How can I contact you?"] };
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "Questions? Choose an option below or type your own.",
      options: quickQuestions,
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [open]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape" && open) setOpen(false);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open]);

  function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const botReply = getStaticReply(trimmed);
    
    setMessages((prev) => [...prev, userMessage, botReply]);
    setInput("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSend(input);
  }

  function handleQuickQuestion(question: string) {
    handleSend(question);
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/10 dark:shadow-zinc-100/5 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label="Open chat"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Panel */}
      <div
        className={`chat-panel ${
          open ? "open" : ""
        } fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-48px)] h-[460px] max-h-[calc(100vh-120px)] rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 overflow-hidden flex flex-col overscroll-y-contain`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Flowbik</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">Static help · No live agents</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 min-h-0 px-5 py-4 overflow-y-auto overscroll-y-auto space-y-3">
          {messages.map((msg, i) =>
            msg.role === "bot" ? (
              <div key={i} className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-500/10 shrink-0 flex items-center justify-center mt-0.5">
                  <Bot className="w-3 h-3 text-indigo-500" />
                </div>
                <div className="max-w-[240px] space-y-2">
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-tl-md px-4 py-2.5">
                    <p
                      className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: escapeHtml(msg.content) }}
                    />
                  </div>
                  {/* Render options inside the chat flow if they exist */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleQuickQuestion(opt)}
                          className="text-[11px] px-2.5 py-1.5 rounded-full border border-indigo-500/30 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/10 transition-colors text-left"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-end">
                <div className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl rounded-tr-md px-4 py-2.5 max-w-[240px]">
                  <p
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: escapeHtml(msg.content) }}
                  />
                </div>
              </div>
            )
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input - Clean, minimal footer */}
        <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 shrink-0 bg-white dark:bg-zinc-900">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question..."
              className="flex-1 px-4 py-2.5 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shrink-0"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}