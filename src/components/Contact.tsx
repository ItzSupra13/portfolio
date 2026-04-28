"use client";

import { useState, useEffect } from "react";
import { MdMarkEmailRead } from "react-icons/md";
import Link from "next/link";
import { toast } from "sonner";

const topics = ["Collaboration", "Freelance", "Feedback", "Other"] as const;

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState<string>("Collaboration");
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleSubmit = async () => {
    const newErrors: Record<string, boolean> = {};
    if (!name.trim()) newErrors.name = true;
    if (!email.trim()) newErrors.email = true;
    if (!message.trim()) newErrors.message = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors({}), 1500);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, message, topic }),
      });

      if (!res.ok) throw new Error();

      setSent(true);
      toast.success("Message sent!");
    } catch {
      toast.error("Failed to send message");
    }
  };

  const inputBase =
    "w-full rounded-xl border border-dashed bg-white/[0.02] px-4 py-2.5 text-sm text-white/85 placeholder:text-white/20 outline-none transition-all focus:bg-white/[0.04] focus:border-white/20";

  return (
    <section className="pb-16">
      <div className="grid gap-x-10 gap-y-6 md:grid-cols-[125px_1fr]">
        {/* Section Label */}
        <p className="text-lg font-medium text-white/60 md:text-right">Get in Touch</p>

        {/* Content */}
        <div className="-mt-1 space-y-6">
          {!sent ? (
            <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-5">
              {/* Header */}
              <div className="mb-5">
                <h2 className="text-xl font-semibold tracking-tight text-white">
                  Let's build something <span className="text-white/30">worth shipping.</span>
                </h2>
                <p className="mt-1 text-sm tracking-tight text-white/40">
                  Drop a message — I usually reply within 24h.
                </p>
              </div>

              {/* Topic Chips */}
              <div className="mb-4">
                <p className="mb-2 text-[11px] tracking-widest text-white/25 uppercase">
                  What's this about?
                </p>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className={`rounded-full border px-3.5 py-1 text-xs transition-all duration-150 ${
                        topic === t
                          ? "border-white/25 bg-white/[0.07] text-white"
                          : "border-white/10 bg-transparent text-white/35 hover:border-white/20 hover:text-white/60"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name + Email Row */}
              <div className="mb-3 grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] tracking-widest text-white/25 uppercase">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className={`${inputBase} ${
                      errors.name ? "border-red-500/50" : "border-white/10"
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] tracking-widest text-white/25 uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`${inputBase} ${
                      errors.email ? "border-red-500/50" : "border-white/10"
                    }`}
                  />
                </div>
              </div>

              {/* Message */}
              <div className="mb-5 flex flex-col gap-1.5">
                <label className="text-[11px] tracking-widest text-white/25 uppercase">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hey Aster, I wanted to reach out about..."
                  rows={4}
                  className={`${inputBase} resize-none leading-relaxed ${
                    errors.message ? "border-red-500/50" : "border-white/10"
                  }`}
                />
              </div>

              {/* Footer Row */}
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs leading-relaxed text-white/20">
                  or email at <span className="text-white/40">itzasterdev@gmail.com</span>
                </p>
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 rounded-xl border border-dashed border-white/20 bg-gradient-to-b from-[#f0652f] to-[#d44d1d] px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:border-white/40 hover:shadow-[0_0_18px_rgba(240,101,47,0.35)] active:scale-[0.97]"
                >
                  Send message
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M2 8h12M9 3l5 5-5 5" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            /* Success State */
            <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-white/20 bg-white/[0.03] px-6 py-6 backdrop-blur-sm">
              {/* Icon */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full border border-dashed border-[#16bf5e]/30 bg-[#16bf5e]/10">
                  <MdMarkEmailRead className="text-[18px] text-[#16bf5e]" />
                </div>
                <p className="mt-1 text-sm leading-relaxed text-white/45">
                  Your message has been queued. I’ll get back to you within 24 hours.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
