"use client";

import { useEffect, useRef } from "react";
import { Clock, Code2, Lightbulb, Users } from "lucide-react";

const reasons = [
  {
    icon: Lightbulb,
    title: "Engineering-First Thinking",
    description:
      "We don't just bolt AI onto existing solutions. We design from the ground up, choosing the right models and architectures for real-world viability.",
  },
  {
    icon: Code2,
    title: "Full-Stack Depth",
    description:
      "From database schema to pixel-perfect UI, we handle it all. No hand-offs, no miscommunication — just clean, end-to-end engineering.",
  },
  {
    icon: Clock,
    title: "Fast Without Cutting Corners",
    description:
      "We ship quickly because we have the experience to move fast and the discipline to stay clean. We don't leave technical debt as our legacy.",
  },
  {
    icon: Users,
    title: "Direct Collaboration",
    description:
      "You work directly with the engineers building your product. No account managers, no layers, just clear communication and shared context.",
  },
];

export default function WhyUs() {
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
      id="why-us"
      ref={sectionRef}
      className="py-28 px-6 border-t border-zinc-100 dark:border-white/[0.05] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-[500px] h-[400px] bg-pink-600/6 dark:bg-pink-600/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="fade-in text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-4">
            Why Flowbik
          </p>
          <h2 className="fade-in text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-5">
            Small Team,{" "}
            <span className="gradient-text">Focused Engineering</span>
          </h2>
          <p className="fade-in text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            As an independent startup, we rely on clarity, capability, and craftsmanship — not overhead.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className="fade-in flex gap-5 p-6 rounded-2xl bg-white dark:bg-[#0e0e1a] border border-zinc-200 dark:border-white/[0.07] hover:border-zinc-300 dark:hover:border-white/[0.12] transition-colors"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">{reason.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{reason.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}