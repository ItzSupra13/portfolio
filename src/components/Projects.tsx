"use client";

import Image from "next/image";
import { FaGithub, FaAngleDown } from "react-icons/fa";
import { PROJECTS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { LuMousePointerClick } from "react-icons/lu";
import GradientASCII from "@/components/web/GradientASCII";

const TABS = ["All", "Full-Stack", "ML & DL", "AI Agent", "LLM"];

export default function Work() {
  const [activeTab, setActiveTab] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const filteredProjects =
    activeTab === "All" ? PROJECTS : PROJECTS.filter((project) => project.category === activeTab);

  const visibleProjects =
    activeTab === "All" && !showAll ? filteredProjects.slice(0, 3) : filteredProjects;

  return (
    <section id="work" className="">
      <div className="grid gap-x-10 gap-y-6 md:grid-cols-[125px_1fr]">
        {/* Section Label */}
        <p className="text-lg font-medium text-white/60 md:pr-4 md:text-right">
          Projects <br />
          <span className="text-[11px] text-white/40">Good ones atleast lol</span>
        </p>

        <div className="mt-1 space-y-6">
          {/* Tabs */}
          <div className="flex max-w-[700px] flex-wrap gap-3">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;

              return (
                <Badge
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setShowAll(false);
                  }}
                  className={`cursor-pointer border border-dashed transition-all duration-200 ${
                    isActive
                      ? "border-white bg-white text-black"
                      : "border-white/20 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70"
                  }`}
                >
                  {tab}
                </Badge>
              );
            })}
          </div>

          {/* Projects */}
          <motion.div layout className="space-y-6">
            {visibleProjects.map((project, i) => {
              const side = project.landingSide ?? "right";
              const accent = project.colors[3] ?? "#60a5fa";

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: showAll ? i * 0.05 : 0 }}
                >
                  <div
                    onClick={() => !project.wip && window.open(project.liveUrl, "_blank")}
                    style={{ "--accent": accent } as React.CSSProperties}
                    className={`group relative max-w-[800px] overflow-hidden rounded-2xl border border-dashed transition-all duration-300 md:min-h-[125px] md:border-dashed md:bg-[linear-gradient(135deg,#0e0e11_0%,#0e0e11_60%,#141418_100%)] ${
                      project.wip
                        ? "cursor-default border-white/10 md:border-white/15"
                        : "cursor-pointer border-white/15 hover:border-[color-mix(in_srgb,var(--accent)_55%,transparent)] active:border-[color-mix(in_srgb,var(--accent)_55%,transparent)] md:border-white/20 md:hover:border-[color-mix(in_srgb,var(--accent)_45%,transparent)]"
                    }`}
                  >
                    {/* WIP — cold vignette tint (Desktop) */}
                    {project.wip && (
                      <>
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              "<!-- Clever of you to check elements for the secret project :) -->",
                          }}
                        />
                        <div className="pointer-events-none absolute inset-0 z-20 hidden bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.03)_0%,rgba(0,0,0,0.35)_100%)] md:block" />
                      </>
                    )}

                    {/* WIP info badge */}
                    {project.wip && (
                      <div className="group/info absolute top-3 right-3 z-30">
                        <div className="flex h-6 w-23 items-center justify-center rounded-full border border-dashed border-white/15 bg-[#0e0e11]/80 text-[11px] font-medium text-white/80 backdrop-blur-md transition-all duration-200 group-hover/info:border-white/30 group-hover/info:text-white/60 md:bg-white/[0.06]">
                          In Progress{" "}
                          <span className="ml-1">
                            <LuMousePointerClick />
                          </span>
                        </div>
                        <div className="pointer-events-none absolute top-7 right-0 w-max max-w-[200px] rounded-lg border border-white/10 bg-[#0e0e11]/95 px-3 py-2 text-xs text-white/80 opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover/info:opacity-100">
                          {project.wipHint ?? "Coming soon"}
                        </div>
                      </div>
                    )}

                    {/* Accent Hover Holo — non-WIP only, mirrors left/right (Desktop) */}
                    {!project.wip && (
                      <div className="pointer-events-none absolute inset-0 z-10 hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
                        <div
                          className={`absolute bottom-0 h-36 w-112 translate-y-[30%] rounded-full blur-2xl ${
                            side === "right"
                              ? "left-12 translate-x-[-30%]"
                              : "right-12 translate-x-[30%]"
                          }`}
                          style={{
                            background: `radial-gradient(circle at center, color-mix(in srgb, ${accent} 25%, transparent) 0%, color-mix(in srgb, ${accent} 12%, transparent) 15%, color-mix(in srgb, ${accent} 5%, transparent) 35%, transparent 55%)`,
                          }}
                        />
                      </div>
                    )}

                    {/* Mobile Preview Showcase (ASCII + Screenshot + Bottom Gradient) */}
                    <div className="relative h-[220px] w-full overflow-hidden md:hidden">
                      <div style={{ width: "100%", height: "260px", position: "relative" }}>
                        <GradientASCII
                          colors={project.colors}
                          shape="horizon"
                          characters=" =+xX0S8#@"
                          cellSize={18}
                          density={0.8}
                          glyphOpacity={0.85}
                          glow={0.2}
                          depthOfField={0}
                          flicker={0.2}
                          softness={0.5}
                          scale={1}
                          flow={0.5}
                          speed={1}
                          gradientOpacity={0.9}
                          grain={0.08}
                          variation={0}
                          mouseInteraction={false}
                          scrambleRadius={0.1}
                          clickEffect="wave"
                          intro
                          lightMode={false}
                          className="rounded-t-2xl"
                          dpr={1.5}
                          style={{}}
                        />
                      </div>

                      {project.wip && <div className="absolute inset-0 bg-[#0e0e11]/75" />}

                      {/* Centered Screenshot */}
                      <div className="absolute top-5 left-1/2 w-[78%] -translate-x-1/2 overflow-hidden rounded-t-lg shadow-[0_12px_40px_-8px_rgba(0,0,0,0.85)]">
                        <div className="relative aspect-[16/10] w-full">
                          <Image
                            src={project.landing}
                            alt={project.title}
                            fill
                            className="object-cover object-top"
                            style={
                              project.wip
                                ? { filter: "blur(14px) grayscale(1) brightness(0.25)" }
                                : {}
                            }
                          />
                        </div>
                      </div>

                      {/* Bottom Gradient Fade */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0e0e11] via-[#0e0e11]/20 to-transparent" />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0e0e11] to-transparent" />
                    </div>

                    {/* Desktop preview panel */}
                    <div
                      className={`absolute inset-y-0 hidden w-[45%] overflow-hidden md:block ${
                        side === "right" ? "right-0" : "left-0"
                      }`}
                    >
                      <div style={{ width: "100%", height: "500px", position: "relative" }}>
                        <GradientASCII
                          colors={project.colors}
                          shape="horizon"
                          characters=" =+xX0S8#@"
                          cellSize={18}
                          density={0.8}
                          glyphOpacity={0.85}
                          glow={0.2}
                          depthOfField={0}
                          flicker={0.2}
                          softness={0.5}
                          scale={1}
                          flow={0.5}
                          speed={1}
                          gradientOpacity={0.9}
                          grain={0.08}
                          variation={0}
                          mouseInteraction
                          scrambleRadius={0.1}
                          clickEffect="wave"
                          intro
                          lightMode={false}
                          dpr={1.5}
                          style={{}}
                          className={side === "right" ? "rounded-r-xl" : "rounded-l-xl"}
                        />
                      </div>

                      {/* Directional horizontal seam blend */}
                      <div
                        className={`absolute inset-0 from-[#0e0e11] via-[#0e0e11]/30 to-transparent ${
                          side === "right" ? "bg-gradient-to-r" : "bg-gradient-to-l"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e11] via-[#0e0e11]/20 to-transparent" />

                      {project.wip && <div className="absolute inset-0 bg-[#0e0e11]/75" />}

                      {/* Screenshot */}
                      <div
                        className={`absolute top-5 left-1/2 w-[75%] -translate-x-1/2 overflow-hidden rounded-t-lg shadow-[0_12px_40px_-8px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:-translate-y-1 ${
                          side === "right" ? "ml-2" : "-ml-2"
                        }`}
                      >
                        <div className="relative aspect-[16/10] w-full">
                          <Image
                            src={project.landing}
                            alt={project.title}
                            fill
                            className="object-cover object-top"
                            style={
                              project.wip
                                ? { filter: "blur(14px) grayscale(1) brightness(0.25)" }
                                : {}
                            }
                          />
                        </div>
                      </div>
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#0e0e11] to-transparent" />
                    </div>

                    {/* Content */}
                    <div
                      className={`relative z-20 flex flex-col justify-center px-5 pt-4 pb-5 md:w-[55%] md:px-6 md:py-6 ${
                        side === "left" ? "md:ml-auto" : ""
                      } ${project.wip ? "select-none" : ""}`}
                    >
                      {/* Title row */}
                      <div
                        className="mb-2.5 flex items-center gap-3 md:mb-3"
                        style={project.wip ? { filter: "blur(5px)", opacity: 0.2 } : {}}
                      >
                        <span className="text-2xl tracking-tighter text-white">{project.title}</span>

                        {/* Desktop Source Code badge */}
                        {project.sourceUrl && !project.wip && (
                          <Link
                            href={project.sourceUrl}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="hidden md:inline-flex"
                          >
                            <Badge asChild>
                              <span className="flex items-center gap-1">
                                Source Code <FaGithub />
                                <ArrowUpRightIcon className="size-3" />
                              </span>
                            </Badge>
                          </Link>
                        )}
                      </div>

                      {/* Description */}
                      <div
                        className="max-w-[400px] space-y-1"
                        style={project.wip ? { filter: "blur(5px)", opacity: 0.2 } : {}}
                      >
                        <h3 className="text-sm text-white">{project.subtitle}</h3>
                        <p className="text-sm tracking-tight text-white/60">{project.description}</p>
                      </div>

                      {/* Mobile Tech Pills */}
                      {project.tech?.length > 0 && (
                        <div
                          className="mt-4 flex flex-wrap gap-2 md:hidden"
                          style={project.wip ? { filter: "blur(5px)", opacity: 0.2 } : {}}
                        >
                          {project.tech.map((item) => (
                            <span
                              key={item}
                              className="rounded-lg border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs text-white/75"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Mobile Action Buttons (Live + optional Source Code) */}
                      {!project.wip && (
                        <div className="mt-4 flex items-center gap-2.5 md:hidden">
                          {project.liveUrl && (
                            <Link
                              href={project.liveUrl}
                              target="_blank"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-1.5 text-xs font-semibold text-black transition-opacity active:opacity-80"
                            >
                              Live
                              <ArrowUpRightIcon className="size-3.5" />
                            </Link>
                          )}
                          {project.sourceUrl && (
                            <Link
                              href={project.sourceUrl}
                              target="_blank"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-white/80 transition-colors active:bg-white/10"
                            >
                              <FaGithub className="size-3.5" />
                              Source
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Toggle Button */}
          {activeTab === "All" && filteredProjects.length > 3 && (
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="group flex w-full max-w-[700px] items-center justify-center gap-2 rounded-xl border border-dashed border-white/5 bg-white/[0.02] py-3 text-sm font-medium text-white/40 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:text-white/80 active:scale-95"
            >
              <span>{showAll ? "Collapse" : "View all"}</span>

              <FaAngleDown
                className={`transition-all duration-300 ${
                  showAll ? "scale-110 rotate-180" : ""
                } group-hover:translate-y-0.5`}
              />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export function HiddenComment() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: "<!-- Hey clever of you to check inspect to find this project details :) -->",
      }}
      style={{ display: "none" }}
    />
  );
}