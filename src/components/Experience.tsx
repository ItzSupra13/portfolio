export default function Experience() {
  return (
    <section className="pb-8">
      <div className="grid md:grid-cols-[125px_1fr] gap-x-10 gap-y-6">
        {/* Section Label */}
        <p className="text-lg text-white/60 font-medium md:text-right">Experience</p>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-3 -translate-x-[0.7px] top-8 h-full border-l border-dashed border-white/20" />

          <div className="space-y-6">
            {/* Item */}
            <div className="relative pl-10">
              {/* Dot */}
              <div className="absolute left-3 -translate-x-1/2 top-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-[#0e0e11] border border-white/20 ">
                <div className="w-2.5 h-2.5 rounded-full bg-white/70" />
              </div>

              {/* Date */}
              <p className="text-xs text-[#8b8b8b] mb-2">November 2025 — November 2025</p>

              {/* Role */}
              <h3 className="text-lg font-semibold text-white tracking-tight">Freelance Work</h3>

              {/* Company */}
              <p className="text-sm text-white/60 mb-3">AI Movie Co-Director</p>

              {/* Description */}
              <p className="max-w-xl text-sm leading-relaxed text-zinc-400">
                Co-Directed a <span className="text-zinc-200">5+ minute AI screenplay</span> for the
                Global AI Film Awards. Orchestrated the full production pipeline from
                <span className="text-zinc-200"> character consistency</span> and landscape
                architecture to sound design. Leveraged{" "}
                <span className="text-zinc-200">Google Veo</span> with advanced anti-vision
                prompting to ensure professional-grade cinematic fidelity and temporal stability for
                my Client.
              </p>
            </div>

            {/* Item */}
            {/* <div className="relative pl-10">
									<div className="absolute left-3 -translate-x-1/2 top-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-[#0e0e11] border border-white/20">
										<div className="w-2.5 h-2.5 rounded-full bg-white/40" />
									</div>

									<p className="text-xs text-white/40 mb-2">
										January 2024 — February 2025
									</p>

									<h3 className="text-lg font-semibold text-white tracking-tight">
										Full Stack Developer
									</h3>

									<p className="text-sm text-white/60 mb-3">
										Freelance Projects
									</p>

									<p className="max-w-xl text-sm leading-relaxed text-zinc-400">
										Built multiple client applications including dashboards,
										AI-powered tools, and performance-focused landing pages.
										Integrated APIs and optimized backend workflows.
									</p>
								</div> */}

            {/* Item */}
            <div className="relative pl-10">
              <div className="absolute left-3 -translate-x-1/2 top-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-[#0e0e11] border border-white/20">
                <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
              </div>

              <p className="text-xs text-white/40 mb-2">August 2025 — October 2025</p>

              <h3 className="text-lg font-semibold text-white tracking-tight">MyndZeal</h3>

              <p className="text-sm text-white/60 mb-3">Full Stack Developer Intern</p>

              <p className="max-w-xl text-sm leading-relaxed text-zinc-400">
                Engineered <span className="text-white font-medium">8+ production routes</span>{" "}
                including analytics dashboards and
                <span className="text-white font-medium"> AI-powered tools</span>, optimizing some
                SQL queries to reduce data retrieval time by
                <span className="text-white font-medium"> 35%</span>. Integrated{" "}
                <span className="text-white font-medium">3+ external APIs</span> and streamlined
                backend workflows, improving overall system performance by
                <span className="text-white font-medium"> 40%</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
