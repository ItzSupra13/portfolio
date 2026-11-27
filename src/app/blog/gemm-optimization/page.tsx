"use client"

import React, { useState, useEffect } from 'react';
import { ProcessingUnit } from '@/types/unit';
import { Header } from '@/components/gemm/Header';
import { Hero } from '@/components/gemm/Hero';
import { GemmIntro } from '@/components/gemm/common/GemmIntro';
import { ArchDiagram } from '@/components/gemm/architecture/ArchDiagram';
import { KernelDeepDive } from '@/components/gemm/KernelDeepDive';
import { BenchmarkDashboard } from '@/components/gemm/BenchmarkDashboard';
import { FutureBlogMonograph } from '@/components/gemm/future/FutureBlogMonograph';
import { Footer } from '@/components/gemm/Footer';
import './gemm.css';

export default function App() {
  const [activeUnit, setActiveUnit] = useState<ProcessingUnit>('gpu');
  const [selectedKernelId, setSelectedKernelId] = useState<number>(4);

  // Sync data-unit on root document element for CSS color palette switching
  useEffect(() => {
    document.documentElement.setAttribute('data-unit', activeUnit);
    document.documentElement.classList.add('dark');
  }, [activeUnit]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectUnit = (unit: ProcessingUnit) => {
    setActiveUnit(unit);
    setSelectedKernelId(unit === 'gpu' ? 1 : 0);
  };

  const handleSelectKernel = (id: number) => {
    setSelectedKernelId(id);
    scrollToSection('kernels');
  };

  return (
    <div
      data-unit={activeUnit}
      className="min-h-screen bg-background text-foreground flex flex-col font-serif transition-colors duration-300"
    >
      {/* Badged Glassy Navbar with CPU, GPU, TPU, and Future? options */}
      <Header
        activeUnit={activeUnit}
        onSelectUnit={handleSelectUnit}
        onNavigate={scrollToSection}
      />

      <main className="flex-1">
        {/* Minimalistic Hero Section (Dynamic for selected unit) */}
        <Hero
          unit={activeUnit}
          onSelectKernel={handleSelectKernel}
          onExploreArchitecture={() => scrollToSection('architecture')}
        />
        {/* Constant Text Introduction: What is GEMM & SGEMM in LaTeX */}
        <GemmIntro unit={activeUnit} />

        {/* Animatic Architecture Diagram (Variable dependent on activeUnit) */}
        <ArchDiagram unit={activeUnit} />

        {/* Conditional Content: When Future? is selected, display Visuals & Blog Text with NO Kernels */}
        {activeUnit === 'future' ? (
          <>
            {/* Future In-Memory Computing Technical Blog Monograph */}
            <FutureBlogMonograph />

            {/* In-Memory Physical Energy & Efficiency Table */}
            <BenchmarkDashboard unit={activeUnit} />
          </>
        ) : (
          <>
            {/* Step-by-Step Technical Kernel Dissection (Unit-dependent) */}
            <KernelDeepDive
              unit={activeUnit}
              selectedKernelId={selectedKernelId}
              onSelectKernel={setSelectedKernelId}
            />

            {/* Empirical Benchmarks Table (Dependent on activeUnit) */}
            <BenchmarkDashboard unit={activeUnit} />

            {/* The 7 Core Commandments of Kernel Engineering (Hidden for now, planned for later) */}
            {/* <KernelRules /> */}
          </>
        )}
      </main>

      {/* Institutional Technical Footer */}
      <Footer />
    </div>
  );
}
