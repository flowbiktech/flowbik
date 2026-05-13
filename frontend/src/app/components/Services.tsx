"use client";

import { useEffect, useRef } from "react";
import { Brain, Globe, Zap, Bot, BarChart3, Shield } from "lucide-react";

const services = [
  {
    icon: Brain,
    color: "from-indigo-500 to-violet-600",
    title: "AI Integration",
    description:
      "Embed capable AI models into your existing workflows. From document processing to intelligent automation — engineered for your specific stack.",
    features: ["Custom LLM Integration", "RAG Pipelines", "AI Chatbots", "Workflow Automation"],
  },
  {
    icon: Globe,
    color: "from-violet-500 to-pink-500",
    title: "Web Development",
    description:
      "Production-grade web applications built with modern frameworks. Fast, scalable, and carefully crafted for real-world usage.",
    features: ["Next.js / React Apps", "REST & GraphQL APIs", "Performance Optimization", "Responsive Design"],
  },
  {
    icon: Bot,
    color: "from-pink-500 to-orange-500",
    title: "Custom Chatbots",
    description:
      "Context-aware chatbots trained on your business knowledge. Handle support and FAQs programmatically without extra headcount.",
    features: ["Knowledge Base Training", "Multi-channel Deploy", "API Integrations", "Custom Workflows"],
  },
  {
    icon: Zap,
    color: "from-amber-500 to-orange-600",
    title: "Automation & APIs",
    description:
      "Eliminate repetitive tasks with reliable automation. We integrate your tools and build custom APIs to keep your systems in sync.",
    features: ["Process Automation", "Third-party Integrations", "Webhook Pipelines", "Data Sync"],
  },
  {
    icon: BarChart3,
    color: "from-emerald-500 to-teal-600",
    title: "Data & Analytics",
    description:
      "Transform raw data into actionable insights. Dashboards, reporting pipelines, and predictive models built for clarity.",
    features: ["Custom Dashboards", "ETL Pipelines", "Predictive Models", "Real-time Reporting"],
  },
  {
    icon: Shield,
    color: "from-sky-500 to-indigo-600",
    title: "Product Strategy",
    description:
      "Not sure where to start? We map your processes, identify high-impact opportunities, and create a clear engineering roadmap.",
    features: ["Technical Audit", "Stack Review", "MVP Scoping", "Roadmap Planning"],
  },
];

export default function Services() {
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
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    const section = sectionRef.current;
    if (section) section.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="py-28 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-600/5 dark:bg-indigo-600/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="fade-in text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-4">
            What We Offer
          </p>
          <h2 className="fade-in text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-5">
            Engineering for{" "}
            <span className="gradient-text">Real-World Systems</span>
          </h2>
          <p className="fade-in text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            We build focused, reliable software — from AI integrations to scalable web platforms — designed to work exactly as intended.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="fade-in service-card gradient-border group relative rounded-2xl p-7 bg-white dark:bg-[#0e0e1a] border border-zinc-200 dark:border-white/[0.07] cursor-default"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-5">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {service.features.map((f) => (
                    <span
                      key={f}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.05] text-zinc-500 dark:text-zinc-500 font-medium"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}