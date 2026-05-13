"use client";

import { useEffect, useRef } from "react";
import { Lock, Sparkles, Cpu } from "lucide-react";

export default function Building() {
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
      { threshold: 0.08 }
    );
    const section = sectionRef.current;
    if (section) section.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="building"
      ref={sectionRef}
      className="py-28 px-6 border-t border-zinc-100 dark:border-white/[0.05] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-indigo-600/6 dark:bg-indigo-600/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="fade-in text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-4">
            What's Next
          </p>
          <h2 className="fade-in text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-5">
            Something Good is{" "}
            <span className="gradient-text-warm">Coming Soon</span>
          </h2>
          <p className="fade-in text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            We're quietly building our own SaaS product behind the scenes. While we perfect it, here's a peek at the philosophy driving it.
          </p>
        </div>

        <div className="fade-in grid md:grid-cols-3 gap-5">
          <div className="p-7 rounded-2xl bg-white dark:bg-[#0e0e1a] border border-zinc-200 dark:border-white/[0.07] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg flex items-center justify-center mb-5">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Stealth Mode</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">We're keeping things under wraps for now, but it's designed to solve real operational headaches.</p>
          </div>
          
          <div className="p-7 rounded-2xl bg-white dark:bg-[#0e0e1a] border border-zinc-200 dark:border-white/[0.07] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 shadow-lg flex items-center justify-center mb-5">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Built Different</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">Not another generic tool. We're approaching old problems with modern architecture and intelligent workflows.</p>
          </div>

          <div className="p-7 rounded-2xl bg-white dark:bg-[#0e0e1a] border border-zinc-200 dark:border-white/[0.07] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg flex items-center justify-center mb-5">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Dogfooding First</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">We use our own APIs and systems daily. This product is born from the gaps we experienced firsthand.</p>
          </div>
        </div>
      </div>
    </section>
  );
}