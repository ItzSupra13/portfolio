"use client";

import Image from "next/image";
import { FaGithub, FaAngleDown } from "react-icons/fa";
import { PROJECTS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { LuMousePointerClick } from "react-icons/lu"

const TABS = ["All", "Full-Stack", "ML & DL", "Backend"];

export default function Work() {
  const [activeTab, setActiveTab] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const filteredProjects =
    activeTab === "All" ? PROJECTS : PROJECTS.filter((project) => project.category === activeTab);

  const visibleProjects =
    activeTab === "All" && !showAll ? filteredProjects.slice(0, 3) : filteredProjects;

  return (
    <section id="work" className="pb-8">
      <div className="grid gap-x-10 gap-y-6 md:grid-cols-[125px_1fr]">
        {/* Section Label */}
        <p className="text-lg font-medium text-white/60 md:text-right">
          Work <br />
          <span className="text-xs text-white/40">Good ones atleast lol</span>
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
            {visibleProjects.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: showAll ? i * 0.05 : 0,
                }}
              >
                <div
                  className={`group relative min-h-[125px] max-w-[800px] overflow-hidden rounded-2xl border border-dashed bg-[linear-gradient(135deg,#0e0e11_0%,#0e0e11_60%,#141418_100%)] transition-all duration-300 ${
                    project.wip
                      ? "cursor-default border-white/15"
                      : "border-white/20 hover:cursor-pointer"
                  }`}
                >
                  {/* WIP — cold vignette tint */}
                  {project.wip && (<>
                    <div
                      dangerouslySetInnerHTML={{ __html: '<!-- Clever of you to check elements for the secret project :) -->' }} 
                    />
                    <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.03)_0%,rgba(0,0,0,0.35)_100%)]" />
                  </>)}
                  {/* WIP info badge */}
                  {project.wip && (
                    <div className="group/info absolute top-3 right-3 z-30 ">
                      <div className="flex h-6 w-23 items-center justify-center rounded-full border border-dashed border-white/15 bg-white/[0.06] text-[11px] font-medium text-white/80 transition-all duration-200 group-hover/info:border-white/30 group-hover/info:text-white/60">
                        In Progress <span className="ml-1"><LuMousePointerClick /></span>
                      </div>
                      <div className="pointer-events-none absolute top-7 right-0 w-max max-w-[200px] rounded-lg border border-white/10 bg-[#0e0e11]/95 px-3 py-2 text-xs text-white/80 opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover/info:opacity-100">
                        {project.wipHint ?? "Coming soon"}
                      </div>
                    </div>
                  )}

                  {/* Glow — non-WIP only */}
                  {!project.wip && (
                    <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute bottom-0 left-12 h-36 w-112 translate-x-[-30%] translate-y-[30%] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.10)_15%,rgba(255,255,255,0.05)_35%,transparent_55%)] blur-2xl" />
                    </div>
                  )}

                  {/* Mobile Image */}
                  <div className="absolute inset-0 md:hidden">
                    <Image
                      src={project.landing}
                      alt={project.title}
                      fill
                      className="object-cover"
                      style={
                        project.wip
                          ? { opacity: 0.04, filter: "grayscale(1) blur(6px)" }
                          : { opacity: 0.1 }
                      }
                    />
                  </div>

                  {/* Desktop Image */}
                  <div className="absolute inset-y-0 right-0 hidden w-[45%] overflow-hidden md:block">
                    <Image
                      src={project.landing}
                      alt={project.title}
                      fill
                      className="translate-y-5 scale-150 rotate-10 object-cover"
                      style={
                        project.wip ? { filter: "blur(14px) grayscale(1) brightness(0.25)" } : {}
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e11] via-[#0e0e11]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e11] via-[#0e0e11]/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0e0e11]/60 via-transparent to-transparent" />
                    {project.wip && <div className="absolute inset-0 bg-[#0e0e11]/75" />}
                  </div>

                  {/* Content */}
                  <div
                    onClick={() => !project.wip && window.open(project.liveUrl, "_blank")}
                    className={`relative z-20 flex flex-col justify-center px-6 py-6 md:w-[55%] ${
                      project.wip ? "select-none" : ""
                    }`}
                  >
                    {/* Title row */}
                    <div
                      className="mb-3 flex items-center gap-3"
                      style={project.wip ? { filter: "blur(5px)", opacity: 0.2 } : {}}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={25}
                        height={25}
                        className="object-cover"
                      />
                      <span className="text-2xl tracking-tighter text-white">{project.title}</span>
                      {project.sourceUrl && !project.wip && (
                        <Link href={project.sourceUrl} target="_blank">
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
                      <h3 className={`text-sm ${project.wip ? "text-white" : "text-white"}`}>
                        {project.title}
                      </h3>
                      <p className="text-sm tracking-tight text-white/60">{project.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
