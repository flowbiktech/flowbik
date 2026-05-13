"use client";

import { useEffect, useRef } from "react";
import { MessageSquare, Cpu, Rocket, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Discovery Call",
    description:
      "We learn about your business, goals, and challenges. No jargon — just a clear conversation about what you actually need.",
    color: "indigo",
  },
  {
    icon: Cpu,
    step: "02",
    title: "Solution Design",
    description:
      "We map out the architecture, choose the right technologies, and present you with a detailed plan and transparent pricing.",
    color: "violet",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Build & Iterate",
    description:
      "We build in sprints with regular demos. You see real progress, give feedback, and we adapt quickly — no surprises.",
    color: "pink",
  },
  {
    icon: CheckCircle2,
    step: "04",
    title: "Launch & Support",
    description:
      "We deploy your solution, monitor performance, and stay available for questions, tweaks, and future improvements.",
    color: "emerald",
  },
];

const colorMap: Record<string, string> = {
  indigo: "from-indigo-500 to-indigo-600 shadow-indigo-500/25",
  violet: "from-violet-500 to-violet-600 shadow-violet-500/25",
  pink: "from-pink-500 to-pink-600 shadow-pink-500/25",
  emerald: "from-emerald-500 to-emerald-600 shadow-emerald-500/25",
};

const textColorMap: Record<string, string> = {
  indigo: "text-indigo-400",
  violet: "text-violet-400",
  pink: "text-pink-400",
  emerald: "text-emerald-400",
};

export default function Process() {
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
      id="process"
      ref={sectionRef}
      className="py-28 px-6 border-t border-zinc-100 dark:border-white/[0.05] relative overflow-hidden"
    >
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/8 dark:bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="fade-in text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-4">
            How It Works
          </p>
          <h2 className="fade-in text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-5">
            From Idea to{" "}
            <span className="gradient-text-warm">Launch</span>
          </h2>
          <p className="fade-in text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            A simple, transparent process that keeps you in control at every step.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="fade-in group relative p-7 rounded-2xl bg-white dark:bg-[#0e0e1a] border border-zinc-200 dark:border-white/[0.07] hover:border-zinc-300 dark:hover:border-white/[0.12] transition-colors"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Step number */}
                <div className={`text-5xl font-black ${textColorMap[step.color]} opacity-15 dark:opacity-10 absolute top-5 right-6 select-none`}>
                  {step.step}
                </div>

                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorMap[step.color]} shadow-lg flex items-center justify-center mb-5`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2.5">{step.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
