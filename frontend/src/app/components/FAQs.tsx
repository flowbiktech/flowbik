"use client";

import { useEffect, useRef } from "react";

const faqs = [
  {
    q: "What kind of businesses do you work with?",
    a: "We work with startups, SMEs, and enterprise teams — anyone who wants to leverage AI or modern web technology to solve a real business problem. If you have a clear goal, we can help you reach it.",
  },
  {
    q: "Do you offer AI integration for existing products?",
    a: "Absolutely. Most of our clients already have a product and want to add AI capabilities — chatbots, document processing, recommendation engines, etc. We integrate cleanly with your existing stack.",
  },
  {
    q: "How long does a typical project take?",
    a: "A focused MVP or feature integration typically takes 3–6 weeks. Larger platforms can take 2–4 months. We'll give you a detailed timeline after the discovery call.",
  },
  {
    q: "Do I need a technical background to work with you?",
    a: "Not at all. We communicate in plain language, give you regular demos, and make sure you always understand what's being built and why. Technical depth is our job, not yours.",
  },
  {
    q: "How is pricing structured?",
    a: "We offer project-based pricing for defined scopes and retainers for ongoing work. We're transparent about costs upfront — no surprise invoices.",
  },
  {
    q: "What technologies do you work with?",
    a: "Our primary stack is Next.js, React, FastAPI, Python, and various AI providers (OpenAI, Google Gemini, Anthropic). We're also comfortable with Node.js, PostgreSQL, MongoDB, and cloud platforms like Vercel and AWS.",
  },
];

export default function FAQs() {
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <section
      id="faqs"
      ref={sectionRef}
      className="py-28 px-6 border-t border-zinc-100 dark:border-white/[0.05] relative overflow-hidden"
    >
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-indigo-600/6 dark:bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="fade-in text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-4">
            FAQs
          </p>
          <h2 className="fade-in text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Common Questions,{" "}
            <span className="gradient-text">Straight Answers</span>
          </h2>
          <p className="fade-in text-zinc-500 dark:text-zinc-400 leading-relaxed">
            If your question isn&apos;t here, just ask us directly.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="fade-in group rounded-2xl bg-white dark:bg-[#0e0e1a] border border-zinc-200 dark:border-white/[0.07] open:border-indigo-500/30 dark:open:border-indigo-500/25 transition-colors overflow-hidden"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none gap-4">
                <span className="font-medium text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">
                  {faq.q}
                </span>
                <span className="faq-icon flex-shrink-0 w-7 h-7 rounded-full bg-zinc-100 dark:bg-white/[0.06] flex items-center justify-center text-indigo-500 font-bold text-lg leading-none">
                  +
                </span>
              </summary>
              <div className="px-6 pb-5">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-white/[0.05] pt-4">
                  {faq.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}