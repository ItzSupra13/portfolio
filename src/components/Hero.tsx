"use client";

import { WordRotate } from "@/components/ui/word-rotate";
import Image from "next/image";
import { BsFillCircleFill } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Highlighter } from "@/components/ui/highlighter";
import { useEffect, useState, useMemo } from "react";
import { BsClock } from "react-icons/bs";
import Link from "next/link";
import { LinkPreview } from "@/components/ui/link-preview";
import { MdMarkEmailRead } from "react-icons/md";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Kbd } from "./ui/kbd";
import { Ascii } from "ascii.rest/react";
import { earthrise } from "ascii.rest/pieces";

export default function Hero() {
  const words = useMemo(() => [
    { text: "Hello", tracking: "tracking-tight" },
    { text: "नमस्ते", tracking: "tracking-wider" },
    { text: "নমস্কার", tracking: "tracking-wider" },
    { text: "Hola", tracking: "tracking-tight" },
    { text: "Bonjour", tracking: "tracking-tight" },
    { text: "Ciao", tracking: "tracking-tight" },
    { text: "こんにちは", tracking: "tracking-wide" },
    { text: "안녕하세요", tracking: "tracking-normal" },
    { text: "你好", tracking: "tracking-wide" },
    { text: "Olá", tracking: "tracking-tight" },
    { text: "Guten Tag", tracking: "tracking-tight" },
  ], []);

  const [time, setTime] = useState("");
  const [copied, setCopied] = useState(false);
  const email = "itzasterdev@gmail.com";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === "c") {
        navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
      }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden pt-9 pb-8 text-center">
      {/* ── ASCII BACKGROUND ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-30 [container-type:size]"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 [&>*]:!h-full [&>*]:!w-full"
          style={{
            aspectRatio: "2 / 1",
            width: "max(100cqw, 200cqh)", // 200cqh = 2 × container height, so it always covers
          }}
        >
          <Ascii piece={earthrise} />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Greeting */}
        <div className="m-6 text-4xl font-bold text-white/30">
          <WordRotate words={words} />
        </div>

        {/* Avatar */}
        <div className="group relative mb-4 inline-block">
          <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-md transition-all duration-500 group-hover:bg-blue-500/20" />
          <div className="group relative h-20 w-20">
            <div className="relative h-full w-full overflow-hidden rounded-full border border-white/10 bg-zinc-900">
              <Image src="/supra.jpeg" alt="Profile" fill priority className="zoom-in-20 object-cover" />
            </div>
            <div className="absolute right-0 bottom-0 flex size-5 items-center justify-center rounded-full bg-zinc-950 ring-[3px] ring-zinc-950">
              <BsFillCircleFill className="fill-[#16bf5e]" />
            </div>
          </div>
        </div>

        {/* Name + Role */}
        <div className="flex flex-col items-center">
          <h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tighter text-white">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="https://asterdev.vercel.app/" className="hover:underline">
                  AsterDev
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Yes this is recursive :)</p>
              </TooltipContent>
            </Tooltip>
            <RiVerifiedBadgeFill className="size-6 fill-[#1db7f9]" />
          </h1>
          <div className="mt-1 flex items-center gap-1.5">
            <div className="text-2xl tracking-tight">
              <span className="text-white/60">Building</span>&nbsp;&nbsp;
              <Highlighter action="underline" color="#5315c0">
                <LinkPreview
                  url="https://axiom-ml.vercel.app/"
                  imageSrc="/landings/AxiomML.png"
                  className="font-bold text-transparent"
                >
                  <span className="font-serif tracking-wide text-white italic brightness-110">
                    Axiom-ML
                  </span>
                </LinkPreview>
              </Highlighter>
            </div>
          </div>
        </div>

        {/* Socials */}
        <div className="mt-6 flex items-center gap-8 text-white/40">
          <Link href="https://x.com/aster_dev_">
            <span className="text-3xl transition hover:text-white"><FaXTwitter /></span>
          </Link>
          <Link href="https://www.linkedin.com/in/supratim13">
            <span className="text-3xl transition hover:text-white"><FaLinkedin /></span>
          </Link>
          <Link href="https://github.com/ItzSupra13">
            <span className="text-3xl transition hover:text-white"><FaGithub /></span>
          </Link>
          <span
            onClick={() => window.open("mailto:itzasterdev@gmail.com", "_blank")}
            className="pt-1.5 text-3xl transition hover:text-white cursor-pointer"
          >
            <Tooltip>
              <TooltipTrigger>
                {copied ? <MdMarkEmailRead size={36} /> : <IoMail size={36} />}
              </TooltipTrigger>
              <TooltipContent>
                <p className="flex items-center justify-center gap-1.5 transition-all">
                  {copied ? "Email Copied!" : <>Press <Kbd>C</Kbd> to Copy Email</>}
                </p>
              </TooltipContent>
            </Tooltip>
          </span>
        </div>

        {/* CTAs */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <button
            className="group relative w-full rounded-xl border border-dashed border-white/30 bg-gradient-to-b from-[#f0652f] to-[#d44d1d] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:border-white/60 hover:shadow-[0_0_20px_rgba(240,101,47,0.4)] active:scale-[0.95] sm:w-auto"
            onClick={() => window.open("/cv.pdf", "_blank")}
          >
            <span className="flex items-center justify-center gap-2">
              <FaEye className="text-lg transition-transform" />
              View CV
            </span>
          </button>
          <span className="hidden text-sm text-white/40 sm:inline">or</span>
          <button
            className="w-full rounded-lg border border-dashed border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/[0.06] sm:w-auto"
            onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            <span className="flex items-center justify-center gap-2">See Projects</span>
          </button>
        </div>

        {/* Location + Clock */}
        <div className="mt-10 flex items-center gap-3">
          <p className="text-xs tracking-[0.25em] text-white/30 uppercase">CCU, INDIA</p>
          <div className="flex items-center gap-1.5 font-mono text-xs tracking-wider text-white/40">
            <BsClock className="size-3.5" />
            <span>{time || "00:00:00"} GMT+5:30</span>
          </div>
        </div>

      </div>
    </section>
  );
}