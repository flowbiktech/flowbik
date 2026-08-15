"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, ArrowUp } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

interface Message {
  role: "bot" | "user";
  content: string;
}

const quickQuestions = [
  "What services do you offer?",
  "How does the process work?",
  "How is pricing structured?",
  "How can I contact you?",
];

// Markdown renderers scoped to the chat bubble — small type scale,
// following the same light/dark tokens as the rest of the site.
const markdownComponents = {
  p: ({ ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
  strong: ({ ...props }) => <strong className="font-semibold text-zinc-900 dark:text-zinc-100" {...props} />,
  em: ({ ...props }) => <em className="italic" {...props} />,
  a: ({ ...props }) => (
    <a
      className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-300 dark:decoration-indigo-500/50 underline-offset-2 hover:decoration-indigo-600 dark:hover:decoration-indigo-400"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  ul: ({ ...props }) => <ul className="mb-2 last:mb-0 pl-4 space-y-1 list-disc marker:text-indigo-400" {...props} />,
  ol: ({ ...props }) => <ol className="mb-2 last:mb-0 pl-4 space-y-1 list-decimal marker:text-indigo-400" {...props} />,
  li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
  code: ({ node, ...props }: React.ComponentProps<"code"> & { node?: { position?: { start: { line: number }; end: { line: number } } } }) => {
    // react-markdown v10 no longer passes an `inline` flag, so infer it
    // from whether the source node spans one line (inline) or several
    // (fenced block).
    const isInline = !node?.position || node.position.start.line === node.position.end.line;
    return isInline ? (
      <code
        className="px-1 py-0.5 rounded bg-zinc-900/[0.06] dark:bg-white/[0.1] text-[0.85em] font-mono text-zinc-800 dark:text-zinc-200"
        {...props}
      />
    ) : (
      <code className="block font-mono text-[0.8em] leading-relaxed" {...props} />
    );
  },
  pre: ({ ...props }) => (
    <pre className="mb-2 last:mb-0 p-2.5 rounded-lg bg-zinc-900 text-zinc-100 overflow-x-auto" {...props} />
  ),
  h1: ({ ...props }) => <p className="mb-1 font-semibold text-[0.95em]" {...props} />,
  h2: ({ ...props }) => <p className="mb-1 font-semibold text-[0.95em]" {...props} />,
  h3: ({ ...props }) => <p className="mb-1 font-semibold text-[0.95em]" {...props} />,
  blockquote: ({ ...props }) => (
    <blockquote
      className="border-l-2 border-indigo-300 dark:border-indigo-500/40 pl-2.5 italic text-zinc-600 dark:text-zinc-400 mb-2 last:mb-0"
      {...props}
    />
  ),
  hr: () => <hr className="my-2 border-zinc-200 dark:border-white/10" />,
  table: ({ ...props }) => (
    <div className="mb-2 last:mb-0 overflow-x-auto">
      <table className="text-[0.85em] border-collapse w-full" {...props} />
    </div>
  ),
  th: ({ ...props }) => (
    <th
      className="border border-zinc-200 dark:border-white/10 px-2 py-1 text-left font-semibold bg-zinc-50 dark:bg-white/[0.04]"
      {...props}
    />
  ),
  td: ({ ...props }) => <td className="border border-zinc-200 dark:border-white/10 px-2 py-1" {...props} />,
};

// Small three-bar "flow" indicator — a nod to the FlowBik name, standing
// in for a generic "typing..." caption.
function FlowPulse() {
  return (
    <span className="inline-flex items-center gap-0.5 h-3" aria-label="Flowbik is replying">
      <span className="w-0.5 rounded-full bg-indigo-400 flow-bar" style={{ animationDelay: "0ms" }} />
      <span className="w-0.5 rounded-full bg-indigo-400 flow-bar" style={{ animationDelay: "150ms" }} />
      <span className="w-0.5 rounded-full bg-indigo-400 flow-bar" style={{ animationDelay: "300ms" }} />
    </span>
  );
}

function BotMark() {
  return (
    <div className="w-7 h-7 rounded-lg shrink-0 bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center p-1.5">
      <Image src="/logo.svg" alt="" width={16} height={16} className="object-contain brightness-0 invert" />
    </div>
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "Hi, I'm the Flowbik assistant. Ask me about our services, process, or how to get in touch.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 350);
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape" && open) setOpen(false);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open]);

  async function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chatbot/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();
      const content = res.ok
        ? data.bot_reply || "I couldn't generate a response. Please try again."
        : data.detail || "Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "bot", content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "I'm having trouble connecting right now. Please try again shortly." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSend(input);
  }

  return (
    <div className="flowbik-chat">
      {/* FAB — hidden while the mobile full-screen sheet is open */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-5 sm:right-6 z-40 w-14 h-14 rounded-full text-white shadow-lg shadow-indigo-900/20 flex items-center justify-center transition-all active:scale-95 hover:-translate-y-0.5 bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 ${
          open ? "opacity-0 pointer-events-none scale-90 sm:opacity-100 sm:pointer-events-auto sm:scale-100" : ""
        }`}
        style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      {/* Backdrop — click anywhere outside the panel to close it.
          Transparent on mobile (the sheet already fills the screen),
          a soft dim on larger screens where the panel floats over content. */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-transparent sm:bg-zinc-900/10 dark:sm:bg-black/30 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel — full-screen sheet on mobile, floating card from sm: up.
          Surface colors follow the site's own dark-mode tokens (#0e0e1a
          cards, white/[0.07] borders) instead of being locked to light. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Flowbik assistant"
        onClick={(e) => e.stopPropagation()}
        className={`chat-panel ${open ? "open" : ""} fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-50 w-full sm:w-[380px] h-[100dvh] sm:h-[75vh] sm:max-h-[600px] bg-white dark:bg-[#0e0e1a] sm:rounded-2xl overflow-hidden flex flex-col sm:border sm:border-zinc-200 sm:dark:border-white/[0.07] sm:shadow-2xl sm:shadow-zinc-900/10 dark:sm:shadow-black/40`}
      >
        {/* Header */}
        <div className="px-4 sm:px-5 pt-[max(0.875rem,env(safe-area-inset-top))] sm:pt-4 pb-3.5 shrink-0 bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_20%_20%,white,transparent_45%)]" />
          <div className="relative flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 p-2">
              <Image src="/logo.svg" alt="" width={20} height={20} className="object-contain brightness-0 invert" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">Flowbik Assistant</p>
              <p className="text-[11px] text-white/75 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                Online — grounded in our docs
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 min-h-0 px-4 sm:px-5 py-4 overflow-y-auto overscroll-contain space-y-3 bg-zinc-50 dark:bg-white/[0.02]">
          {messages.map((msg, i) =>
            msg.role === "bot" ? (
              <div key={i} className="flex gap-2 items-start">
                <BotMark />
                <div className="max-w-[80%] sm:max-w-[240px] bg-white dark:bg-[#12121f] border border-zinc-200 dark:border-white/[0.08] rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm dark:shadow-none">
                  <div className="text-[13.5px] text-zinc-700 dark:text-zinc-300">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-end">
                <div className="max-w-[80%] sm:max-w-[240px] bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-3.5 py-2.5">
                  <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            )
          )}

          {loading && (
            <div className="flex gap-2 items-start">
              <BotMark />
              <div className="bg-white dark:bg-[#12121f] border border-zinc-200 dark:border-white/[0.08] rounded-2xl rounded-tl-sm px-3.5 py-3 shadow-sm dark:shadow-none">
                <FlowPulse />
              </div>
            </div>
          )}

          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-1.5 pl-9">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-[11.5px] px-2.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300 bg-white dark:bg-white/[0.04] hover:bg-indigo-50 dark:hover:bg-white/[0.08] hover:border-indigo-300 dark:hover:border-indigo-400/40 transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className="px-3 sm:px-4 pt-3 shrink-0 bg-white dark:bg-[#0e0e1a] border-t border-zinc-100 dark:border-white/[0.06]"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              disabled={loading}
              className="flex-1 min-w-0 px-4 py-2.5 rounded-full bg-zinc-100 dark:bg-white/[0.06] border border-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 dark:focus:border-indigo-500/40 focus:bg-white dark:focus:bg-white/[0.08] transition-all disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white flex items-center justify-center transition-transform active:scale-90 shrink-0 disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Send message"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
