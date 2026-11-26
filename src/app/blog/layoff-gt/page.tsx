"use client"

import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import { BookOpen } from 'lucide-react';
import { DEFAULT_FALK_PARAMS, FalkModelParams } from '@/lib/gt/economics';
import { MODULES_META } from '@/lib/gt/variables';
import { Module1ToyEconomy } from '@/components/gt/Module1';
import { Module2PayoffMatrix } from '@/components/gt/Module2';
import { Module3FormalModel } from '@/components/gt/Module3';
import { Module4RedQueen } from '@/components/gt/Module4';
import { Module5HiringGames } from '@/components/gt/Module5';
import { Module6PolicyLab } from '@/components/gt/Module6';
import { Module7Synthesis } from '@/components/gt/Module7';
import { ReferencesDrawer } from '@/components/gt/ReferencesDrawer';
import { FaXTwitter } from 'react-icons/fa6';

export default function App() {
    // Module 1 shared coin-economy toggle state
    const [automateA, setAutomateA] = useState<boolean>(false);
    const [automateB, setAutomateB] = useState<boolean>(false);

    // Shared Falk & Tsoukalas continuous parameters across Modules 3, 4, 5, and 6
    const [falkParams, setFalkParams] = useState<FalkModelParams>({ ...DEFAULT_FALK_PARAMS });

    // Collapsible References drawer state
    const [referencesOpen, setReferencesOpen] = useState<boolean>(false);

    // Reading progress & active module for left margin rail
    const [activeModuleId, setActiveModuleId] = useState<string>('module-1');
    const [scrollProgress, setScrollProgress] = useState<number>(0);

    useEffect(() => {
        const handleScroll = () => {
            const docHeight =
                document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const ratio = docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;
            setScrollProgress(ratio);

            // Update active section indicator
            const offset = 180;
            let current: string = MODULES_META[0].id;
            for (const mod of MODULES_META) {
                const el = document.getElementById(mod.id);
                if (el && el.getBoundingClientRect().top <= offset) {
                    current = mod.id;
                }
            }
            setActiveModuleId(current);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleApplyEtaFromContest = (eta: number) => {
        setFalkParams((prev) => ({ ...prev, eta }));
        const target = document.getElementById('module-6');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleResetAll = () => {
        setAutomateA(false);
        setAutomateB(false);
        setFalkParams({ ...DEFAULT_FALK_PARAMS });
    };

    return (
        <div className="min-h-screen bg-white text-[#1A1D24]">
            {/* Minimalist Top Bar (Exact 3-zone editorial contract matching reference aesthetic) */}
            <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-[#F1F3F6]">
                <div className="max-w-[1180px] mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
                    {/* Zone 2: 5 clean single-line navigation links */}
                    <nav
                        aria-label="Essay sections"
                        className="hidden md:flex items-center gap-7 text-[13px] font-medium text-[#555B66]"
                    >
                        <a
                            href="/"
                            className="text-[#4F46E5] hover:text-[#4338CA] cursor-pointer transition-colors whitespace-nowrap shrink-0"
                        >
                            Back
                        </a>
                        <a
                            href="#module-1"
                            className="hover:text-[#1A1D24] transition-colors whitespace-nowrap shrink-0"
                        >
                            Toy Economy
                        </a>
                        <a
                            href="#module-3"
                            className="hover:text-[#1A1D24] transition-colors whitespace-nowrap shrink-0"
                        >
                            Formal Model
                        </a>
                        <a
                            href="#module-4"
                            className="hover:text-[#1A1D24] transition-colors whitespace-nowrap shrink-0"
                        >
                            Red Queen
                        </a>
                        <a
                            href="#module-5"
                            className="hover:text-[#1A1D24] transition-colors whitespace-nowrap shrink-0"
                        >
                            Hiring Games
                        </a>
                        <a
                            href="#module-6"
                            className="hover:text-[#1A1D24] transition-colors whitespace-nowrap shrink-0"
                        >
                            Policy Lab
                        </a>
                    </nav>

                    {/* Zone 3: 1 primary editorial action in signature blue */}
                    <div className="flex items-center shrink-0">
                        <button
                            type="button"
                            onClick={() => setReferencesOpen(true)}
                            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1.5 px-2"
                        >
                            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>References</span>
                        </button>
                    </div>
                </div>

                {/* Hairline reading progress bar */}
                <div className="h-[2px] w-full bg-transparent overflow-hidden" aria-hidden="true">
                    <div
                        className="h-full bg-[#4F46E5] origin-left transition-transform duration-150"
                        style={{ transform: `scaleX(${scrollProgress})` }}
                    />
                </div>
            </header>

            {/* Main Editorial Canvas */}
            <div id="top" className="relative max-w-[1180px] mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-24">
                {/* Desktop Floating Left Margin Rail (mirrors reference left-margin minimal circles, 100% functional TOC) */}
                <aside
                    aria-label="Module quick navigation"
                    className="hidden xl:flex fixed left-[max(1.5rem,calc(50%-560px))] top-44 flex-col items-center gap-2.5 z-20"
                >
                    <span className="text-[10px] font-medium tracking-wider text-[#9CA3AF] mb-1">
                        MODULES
                    </span>
                    {MODULES_META.map((mod) => {
                        const isActive = activeModuleId === mod.id;
                        return (
                            <a
                                key={mod.id}
                                href={`#${mod.id}`}
                                title={`${mod.num}. ${mod.title}`}
                                aria-label={`Jump to Module ${mod.num}: ${mod.title}`}
                                aria-current={isActive ? 'location' : undefined}
                                className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono text-[11px] transition-colors ${isActive
                                    ? 'border-[#4F46E5] bg-[#4F46E5] text-white font-semibold'
                                    : 'border-[#E5E7EB] bg-white text-[#7C8492] hover:border-[#4F46E5] hover:text-[#4F46E5]'
                                    }`}
                            >
                                {mod.num}
                            </a>
                        );
                    })}
                </aside>

                {/* Centered Editorial Article Header (exact visual rhythm of reference) */}
                <header className="max-w-[740px] mx-auto text-center mb-14 sm:mb-16">
                    <div className="text-[12px] tracking-[0.06em] text-[#9CA3AF] mb-5">
                        3 November 2026 · Supratim Chakraborty (AsterDev) · 7 Modules
                    </div>

                    <h1 className="font-serif text-[34px] sm:text-[44px] md:text-[48px] font-normal leading-[1.18] tracking-[-0.02em] text-[#1A1D24] mb-6">
                        Understanding AI Layoffs Using <br /> Game Theory
                    </h1>

                    <p className="max-w-[600px] mx-auto text-[15.5px] sm:text-[16.5px] leading-[1.7] text-[#8C929C] font-light mb-8">
                        Deriving why individually rational automation decisions lock competing firms into
                        collective demand collapse using closed coin flows.
                    </p>

                    {/* Subtle Color-Coded Variable Key Strip */}
                    <div className="mt-9 pt-4 border-t border-[#F1F3F6] flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11.5px] text-[#7C8492]">
                        <span className="whitespace-nowrap">
                            <strong className="font-serif italic text-[#4F46E5] mr-1">α</strong>Automation rate
                        </span>
                        <span className="whitespace-nowrap">
                            <strong className="font-serif italic text-[#DC2626] mr-1">ℓ</strong>Demand loss
                        </span>
                        <span className="whitespace-nowrap">
                            <strong className="font-serif italic text-[#0F766E] mr-1">N</strong>Competing firms
                        </span>
                        <span className="whitespace-nowrap">
                            <strong className="font-serif italic text-[#059669] mr-1">η</strong>Reabsorption
                        </span>
                        <span className="whitespace-nowrap">
                            <strong className="font-serif italic text-[#B45309] mr-1">k</strong>Friction
                        </span>
                        <span className="whitespace-nowrap">
                            <strong className="font-serif italic text-[#7C3AED] mr-1">γ</strong>AI capability
                        </span>
                    </div>
                </header>

                {/* Main Single Reading Column */}
                <main className="max-w-[680px] mx-auto">
                    <Module1ToyEconomy
                        automateA={automateA}
                        automateB={automateB}
                        onToggleA={() => setAutomateA((prev) => !prev)}
                        onToggleB={() => setAutomateB((prev) => !prev)}
                        onReset={() => {
                            setAutomateA(false);
                            setAutomateB(false);
                        }}
                    />

                    <Module2PayoffMatrix />

                    <Module3FormalModel params={falkParams} onChangeParams={setFalkParams} />

                    <Module4RedQueen falkParams={falkParams} />

                    <Module5HiringGames
                        currentEta={falkParams.eta}
                        onApplyEtaToModel={handleApplyEtaFromContest}
                    />

                    <Module6PolicyLab falkParams={falkParams} />

                    <Module7Synthesis />
                </main>

                {/* Minimalist Editorial Footer */}
                <footer className="max-w-[680px] mx-auto mt-20 pt-8 border-t border-[#ECEEF2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#7C8492]">
                    <div>
                        <a href={"https://x.com/aster_dev_"} target="_blank" className="hover:text-foreground transition-colors inline-flex items-center gap-1 underline underline-offset-2">
                            <FaXTwitter className="w-3 h-3" />
                            <span>AsterDev</span>
                        </a>
                        <span className="mx-2" aria-hidden="true">
                            ·
                        </span>
                        <span>03-11-2026</span>
                    </div>
                    <div className="flex items-center gap-5">
                        <button
                            type="button"
                            onClick={handleResetAll}
                            className="hover:text-[#1A1D24] transition-colors cursor-pointer"
                        >
                            Reset all parameters
                        </button>
                    </div>
                </footer>
            </div>

            {/* Collapsible References Drawer */}
            <ReferencesDrawer open={referencesOpen} onClose={() => setReferencesOpen(false)} />
        </div>
    );
}
