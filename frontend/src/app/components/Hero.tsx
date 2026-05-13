"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Zap } from "lucide-react";

export default function Hero() {
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
      { threshold: 0.1 }
    );
    const section = sectionRef.current;
    if (section) section.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="orb-float absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 dark:bg-indigo-600/15 rounded-full blur-[120px]" />
        <div className="orb-float-slow absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/10 dark:bg-violet-600/15 rounded-full blur-[100px]" />
        <div className="orb-float absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-500/5 dark:bg-pink-500/8 rounded-full blur-[140px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="fade-in inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-indigo-500/20 dark:border-indigo-500/30 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-8">
          <Zap className="w-3.5 h-3.5" />
          Independent SaaS Startup · APIs & Automation
        </div>

        {/* Headline */}
        <h1 className="fade-in text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
          <span className="text-zinc-900 dark:text-white">Building modern software</span>
          <br />
          <span className="gradient-text">products & workflow systems</span>
        </h1>

        {/* Subheadline */}
        <p className="fade-in text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-10">
          Flowbik is an independent SaaS startup focused on APIs, automation systems, modern web platforms, and internal workflow tools — with our first SaaS product coming soon.
        </p>

        {/* CTAs */}
        <div className="fade-in flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#services"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full shimmer-btn text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow"
          >
            Explore Services
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#building"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-zinc-200 dark:border-white/10 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.04] transition-colors"
          >
            Follow Our Progress
          </a>
        </div>

        {/* Startup Tags */}
        <div className="fade-in flex flex-wrap items-center justify-center gap-3 max-w-xl mx-auto">
          {["Small Team · Big Vision", "Early Development", "Building Modern Workflow Systems", "Something Good Coming Soon"].map((tag) => (
            <span
              key={tag}
              className="px-3.5 py-1.5 text-xs font-medium rounded-full border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 bg-zinc-50/50 dark:bg-white/[0.02]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Tech stack badges */}
        <div className="fade-in flex flex-wrap items-center justify-center gap-2 mt-10 opacity-50">
          {["Next.js", "FastAPI", "Python", "TypeScript", "React", "MongoDB"].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-[11px] rounded-full border border-zinc-200/60 dark:border-white/[0.06] text-zinc-500 dark:text-zinc-500"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="fade-in mt-16 flex justify-center">
          <div className="flex flex-col items-center gap-1.5 text-zinc-400 dark:text-zinc-600">
            <div className="w-px h-8 bg-gradient-to-b from-transparent to-zinc-300 dark:to-zinc-700" />
            <Zap className="w-3.5 h-3.5 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}