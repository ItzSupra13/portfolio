"use client";

import Link from "next/link";
import { BsClock } from "react-icons/bs";

type Status = "completed" | "in progress";

const writings: {
  date: string;
  title: string;
  readTime: string;
  slug: string;
  color: string;
  status: Status;
}[] = [
  // {
  //     date: "01/12/26",
  //     title: "How a GPU chip is fabricated or some shi",
  //     readTime: "18 m",
  //     slug: "fab",
  //     color: "#7fee64",
  //     status: "in progress",
  //   },
  // {
  //     date: "01/12/26",
  //     title: "LLMs explained like LEGOs",
  //     readTime: "18 m",
  //     slug: "lego-transformer",
  //     color: "#7fee64",
  //     status: "in progress",
  //   },
    {
      date: "23/11/26",
      title: "Optimizing GEMM on GPU to near-SOTA with CUDA",
      readTime: "42 m",
      slug: "gemm-optimization",
      color: "#7fee64",
      status: "completed",
    },
      {
      date: "03/11/26",
      title: "Understaing AI Layoffs using Game Theory",
      readTime: "13 m",
      slug: "layoff-gt",
      color: "#f0f0f0",
      status: "completed",
    },
    {
      date: "22/03/26",
      title: "Hello World",
      readTime: "05 m",
      slug: "hello-world",
      color: "#a78bfa",
      status: "completed",
    },
  ];

export default function Writing() {
  return (
    <section className="">
      <div className="grid md:grid-cols-[125px_1fr] gap-x-10 gap-y-3">
        {/* Section Label */}
        <p className="text-lg text-white/60 font-medium md:pr-4 md:text-right mt-1.5">Writing</p>

        {/* Content */}
        <div className="w-full">
          <div className="divide-y divide-white/5 overflow-hidden">
            {writings.map((item) => (
              <Link
                href={`/blog/${item.slug}`}
                key={item.slug}
                style={
                  {
                    "--c": item.color,
                    "--cbg": `${item.color}1a`,
                  } as React.CSSProperties
                }
                className="group flex w-full items-start justify-between gap-3 rounded-sm px-2 py-2 transition-all duration-300 hover:bg-[var(--cbg)]"
              >
                {/* Left */}
                <div className="flex min-w-0 items-start gap-6">
                  {/* Date */}
                  <span className="w-[80px] shrink-0 text-sm leading-6 text-white/40 transition-colors group-hover:text-[var(--c)]">
                    {item.date}
                  </span>

                  {/* Title */}
                  <span className="font-sans leading-6 tracking-tighter text-white transition-colors group-hover:text-[var(--c)]">
                    {item.title}
                    <span className="ml-2 text-sm tracking-normal text-white/30">
                      {item.status === "in progress" && (<span className="ml-2 text-sm tracking-normal text-white/30">— in progress</span>)}
                    </span>
                  </span>
                </div>

                {/* Right */}
                <div className="flex h-6 shrink-0 items-center gap-1 whitespace-nowrap text-sm text-[#8f8f8f] transition-colors group-hover:text-[var(--c)]">
                  <BsClock className="size-3.5 shrink-0" />
                  <span className="ml-1 font-mono tracking-tighter">{item.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}