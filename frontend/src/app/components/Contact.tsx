"use client";

import { useState, useRef, useEffect } from "react";
import { Mail, Linkedin, Instagram, X, Send, ArrowRight } from "lucide-react";

const services = [
  "AI Integration",
  "Web Development",
  "Custom Chatbot",
  "Automation & APIs",
  "Data & Analytics",
  "Consulting",
  "Other",
];

// FastAPI backend URL — set NEXT_PUBLIC_API_URL in Vercel environment variables
const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );
    const section = sectionRef.current;
    if (section) section.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");

    try {
      const res = await fetch(`${API_URL}/api/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", service: "", message: "" });
        setTimeout(() => setStatus("idle"), 7000);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.detail || data.error || "Failed to send. Please try again.");
        setStatus("error");
        setTimeout(() => { setStatus("idle"); setErrorMsg(""); }, 5000);
      }
    } catch {
      setErrorMsg("Network error. Please check your connection.");
      setStatus("error");
      setTimeout(() => { setStatus("idle"); setErrorMsg(""); }, 5000);
    }
  }


  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#12121f] text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all";

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-28 px-6 border-t border-zinc-100 dark:border-white/[0.05] relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/8 dark:bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-violet-600/6 dark:bg-violet-600/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="fade-in text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-4">
            Get In Touch
          </p>
          <h2 className="fade-in text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-5">
            Ready to Build{" "}
            <span className="gradient-text">Something Great?</span>
          </h2>
          <p className="fade-in text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Tell us about your project. We&apos;ll reply within 24 hours with thoughts and next steps — no sales pressure.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left info panel */}
          <div className="lg:col-span-2 fade-in">
            <div className="p-7 rounded-2xl bg-white dark:bg-[#0e0e1a] border border-zinc-200 dark:border-white/[0.07] h-full flex flex-col gap-8">
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">Let&apos;s Talk</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Whether you have a clear spec or just an idea, we&apos;re happy to jump on a call and figure out the best path forward together.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-0.5">Email</p>
                    <a href="mailto:hello@flowbik.com" className="text-sm font-medium text-zinc-900 dark:text-zinc-200 hover:text-indigo-500 transition-colors">
                      hello@flowbik.com
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    {
                      Icon: Linkedin,
                      href: "https://www.linkedin.com/company/flowbiktech/posts/?viewAsMember=true",
                      label: "LinkedIn",
                    },
                    { Icon: Instagram, href: "https://www.instagram.com/flowbik.ai/", label: "Instagram" },
                    { Icon: X, href: "https://x.com/FlowbikTech", label: "X (Twitter)" },
                  ].map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg border border-zinc-200 dark:border-white/[0.08] flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:border-indigo-500/50 hover:text-indigo-500 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* CTA alternative */}
              <div className="mt-auto p-5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 dark:border-indigo-500/15">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  Not sure what you need?
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">
                  Book a free 30-minute discovery call. No commitment, no pitching — just a conversation.
                </p>
                <a
                  href="mailto:hello@flowbik.com?subject=Discovery Call Request"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-400 transition-colors"
                >
                  Request a Call <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3 fade-in">
            <form
              onSubmit={handleSubmit}
              className="p-7 rounded-2xl bg-white dark:bg-[#0e0e1a] border border-zinc-200 dark:border-white/[0.07] space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="John Smith"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className={inputClass}
                    placeholder="john@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Service You&apos;re Interested In
                </label>
                <select
                  className={`${inputClass} cursor-pointer`}
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                >
                  <option value="">Select a service…</option>
                  {services.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Tell Us About Your Project *
                </label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={5}
                  placeholder="Describe what you're trying to build, automate, or improve. The more detail, the better."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed ${
                  status === "error"
                    ? "bg-red-500/90 shadow-red-500/20"
                    : "shimmer-btn shadow-indigo-500/20 hover:shadow-indigo-500/35"
                }`}
              >
                {status === "sending" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending…
                  </>
                ) : status === "sent" ? (
                  <>✓ Message Sent — We&apos;ll be in touch!</>
                ) : status === "error" ? (
                  <>✗ {errorMsg || "Something went wrong — try again"}</>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>

              <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
                We typically respond within 24 hours on business days.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}