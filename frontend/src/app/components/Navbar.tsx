"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "What We're Building", href: "#building" },
  { label: "How It Works", href: "#process" },
  { label: "Why Us", href: "#why-us" },
  { label: "FAQs", href: "#faqs" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleTheme() {
    const html = document.documentElement;
    html.classList.add("theme-transitioning");
    html.classList.toggle("dark");
    const dark = html.classList.contains("dark");
    setIsDark(dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
    setTimeout(() => html.classList.remove("theme-transitioning"), 450);
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-[#080810]/90 backdrop-blur-xl border-b border-zinc-200/60 dark:border-white/[0.06] shadow-sm dark:shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
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
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors"
            aria-label="Toggle theme"
          >
            {mounted ? (
              isDark ? <Sun className="w-[17px] h-[17px]" /> : <Moon className="w-[17px] h-[17px]" />
            ) : (
              <div className="w-[17px] h-[17px]" />
            )}
          </button>

          {/* CTA */}
          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full shimmer-btn text-white text-[13px] font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-shadow"
          >
            Get in Touch
          </a>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06] rounded-full transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-200/60 dark:border-white/[0.06] bg-white/95 dark:bg-[#080810]/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 text-center py-2.5 rounded-full shimmer-btn text-white text-sm font-medium"
            >
              Get in Touch
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}