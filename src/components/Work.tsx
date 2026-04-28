"use client";

import Image from "next/image";
import { FaGithub, FaAngleDown } from "react-icons/fa";
import { PROJECTS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";

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
      <div className="grid md:grid-cols-[125px_1fr] gap-x-10 gap-y-6">
        {/* Section Label */}
        <p className="text-lg text-white/60 font-medium md:text-right">
          Work <br />
          <span className="text-xs text-white/40">Good ones atleast lol</span>
        </p>

        <div className="space-y-6 mt-1">
          {/* Tabs */}
          <div className="flex flex-wrap gap-3 max-w-[700px]">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;

              return (
                <Badge
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setShowAll(false);
                  }}
                  className={`cursor-pointer border border-dashed transition-all duration-200
                    ${
                      isActive
                        ? "bg-white text-black border-white"
                        : "bg-white/5 text-white/40 border-white/20 hover:bg-white/10 hover:text-white/70"
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
                  className="group relative overflow-hidden rounded-2xl border border-white/20 min-h-[125px] 
                  bg-[linear-gradient(135deg,#0e0e11_0%,#0e0e11_60%,#141418_100%)] 
                  transition-all duration-300 hover:cursor-pointer border-dashed max-w-[800px]"
                >
                  {/* Glow */}
                  <div className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div
                      className="absolute bottom-0 left-12 translate-x-[-30%] translate-y-[30%] h-36 w-112
                      rounded-full
                      bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.10)_15%,rgba(255,255,255,0.05)_35%,transparent_55%)]
                      blur-2xl"
                    />
                  </div>

                  {/* Mobile Image */}
                  <div className="absolute inset-0 md:hidden">
                    <Image
                      src={project.landing}
                      alt={project.title}
                      fill
                      className="object-cover opacity-10"
                    />
                  </div>

                  {/* Desktop Image */}
                  <div className="absolute inset-y-0 right-0 hidden md:block w-[45%] overflow-hidden">
                    <Image
                      src={project.landing}
                      alt={project.title}
                      fill
                      className="object-cover translate-y-5 rotate-10 scale-150"
                    />
                    {/* Layered gradients for depth and edge blending */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e11] via-[#0e0e11]/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e11] via-[#0e0e11]/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0e0e11]/60 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div
                    onClick={() => window.open(project.liveUrl, "_blank")}
                    className="relative z-20 flex flex-col justify-center px-6 py-7 md:w-[55%]"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={25}
                        height={25}
                        className="object-cover"
                      />
                      <span className="text-2xl tracking-tighter text-white">{project.title}</span>
                      {project.sourceUrl && (
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
                    <div className="max-w-[400px] space-y-1">
                      <h3 className="text-sm text-white">{project.title}</h3>
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
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/5 bg-white/[0.02] py-3 text-sm font-medium text-white/40 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:text-white/80 active:scale-95 max-w-[700px]"
            >
              <span>{showAll ? "Collapse" : "View all"}</span>

              <FaAngleDown
                className={`transition-all duration-300 ${
                  showAll ? "rotate-180 scale-110" : ""
                } group-hover:translate-y-0.5`}
              />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
