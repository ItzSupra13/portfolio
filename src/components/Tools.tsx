"use client";

import Link from "next/link";

type Tool = {
  id: string;
  name: string;
  description: string;
  tag: string;
  paid?: boolean;
  price?: string;
  href: string;
  wip?: boolean;
};

const tools: Tool[] = [
  {
    id: "01",
    name: "stack.md skill maker",
    description:
      "Select your tech stack, get a clean markdown snippet ready to be used by any Agent.",
    tag: "Developer",
    href: "/tools/stack-md",
  },
  {
    id: "02",
    name: "Holiday optimizer",
    description:
      "Maximize your leaves. Enter your country & remaining PTO — get the optimal long-weekend plan.",
    tag: "Productivity",
    paid: true,
    price: "$1",
    href: "/tools/holiday-optimizer",
  },
];

export default function Tools() {
  return (
    <section className="pb-12">
      <div className="grid md:grid-cols-[125px_1fr] gap-x-10 gap-y-6">
        {/* Section Label */}
        <div className="md:text-right">
          <p className="text-lg text-white/60 font-medium">Tools</p>
          <p className="text-xs text-white/30 mt-0.5">Might be useful :)</p>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <div className="group relative flex items-center gap-5 border border-dashed border-white/15 rounded-xl px-5 py-4 bg-white/[0.02] hover:bg-white/[0.035] transition-colors duration-200">
      {/* Index */}
      <span className="hidden sm:block font-mono text-[11px] text-white/15 select-none w-5 shrink-0">
        {tool.id}
      </span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h2 className="text-[15px] font-medium tracking-tight text-white">{tool.name}</h2>

          {/* Tag */}
          <span className="text-[10px] uppercase tracking-widest text-white/25 border border-dashed border-white/10 rounded-full px-2 py-0.5">
            {tool.tag}
          </span>

          {/* Paid badge */}
          {tool.paid && (
            <span className="text-[10px] font-medium tracking-tight text-amber-400/70 border border-dashed border-amber-400/20 rounded-full px-2 py-0.5">
              {tool.price}
            </span>
          )}

          {/* WIP badge */}
          {tool.wip && (
            <span className="text-[10px] uppercase tracking-widest text-white/20 border border-dashed border-white/10 rounded-full px-2 py-0.5">
              soon
            </span>
          )}
        </div>
        <p className="text-[13px] text-white/40 tracking-tight leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Clip-path arrow button */}
      <Link
        href={tool.href}
        className="relative shrink-0 group/btn"
        aria-label={`Open ${tool.name}`}
      >
        <span
          className="
            flex items-center justify-center
            w-9 h-9
            bg-white/[0.06] text-white/40
            hover:bg-white/[0.11] hover:text-white
            transition-all duration-200
            group-hover/btn:text-white
          "
          style={{
            clipPath: "polygon(0% 0%, 80% 0%, 100% 20%, 100% 100%, 0% 100%)",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M2 12L12 2M12 2H5M12 2v7" />
          </svg>
        </span>

        {/* Clipped corner accent */}
        <span
          className="absolute top-0 right-0 w-2 h-2 bg-white/15 group-hover/btn:bg-white/30 transition-colors duration-200"
          style={{
            clipPath: "polygon(100% 0%, 0% 0%, 100% 100%)",
          }}
        />
      </Link>
    </div>
  );
}
