import Image from "next/image";
import { Mail, Linkedin, Instagram, X } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-100 dark:border-white/[0.05] bg-white dark:bg-[#080810]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Image
                src="/logo.svg"
                alt="Flowbik Logo"
                width={28}
                height={28}
                className="object-contain"
              />
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight text-[15px]">
                Flowbik
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-500 leading-relaxed max-w-xs mb-5">
              Building modern SaaS products, APIs, and workflow systems.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Mail, href: "mailto:hello@flowbik.com", label: "Email" },
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
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-indigo-500 hover:border-indigo-500/40 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">Services</p>
            <ul className="space-y-2.5">
              {["AI Integration", "Web Development", "Custom Chatbots", "Automation & APIs", "Data & Analytics", "Product Strategy"].map((s) => (
                <li key={s}>
                  <a href="#services" className="text-sm text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">Company</p>
            <ul className="space-y-2.5">
              {[
                { label: "What We're Building", href: "#building" },
                { label: "How It Works", href: "#process" },
                { label: "Why Us", href: "#why-us" },
                { label: "FAQs", href: "#faqs" },
                { label: "Contact", href: "#contact" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-100 dark:border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 dark:text-zinc-600">
          <p>© {year} Flowbik. All rights reserved.</p>
          <p>Built with Next.js &amp; FastAPI</p>
        </div>
      </div>
    </footer>
  );
}