import Image from "next/image";

export default function Education() {
  return (
    <section className="pb-16">
      <div className="grid gap-x-10 gap-y-6 md:grid-cols-[125px_1fr]">
        <p className="text-lg font-medium text-white/60 md:text-right">Education</p>

        <div className="space-y-7">
          {/* Item */}
          <div className="grid gap-3 md:grid-cols-[100px_1fr]">
            {/* Date */}
            <p className="text-[13px] font-medium text-[#8b8b8b] md:pt-1">2024 — 2028</p>

            {/* Content */}
            <div className="space-y-2">
              {/* Header */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                {/* Degree */}
                <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                  B.S. in Data Science
                </h3>

                {/* Divider (desktop only) */}
                <span className="hidden text-white/20 sm:inline">—</span>

                {/* University */}
                <div className="flex items-center gap-2">
                  <div className="relative size-5 overflow-hidden rounded-sm bg-white/5 p-0.5">
                    <Image src="/iitm.png" alt="IITM Logo" fill className="object-contain" />
                  </div>

                  <span className="text-base font-medium text-white/90 sm:text-lg">IIT Madras</span>
                </div>
              </div>

              {/* Description */}
              <p className="max-w-xl text-[16px] leading-relaxed tracking-tight text-[#8b8b8b] sm:text-base">
                Focused on <span className="text-zinc-200">software engineering</span>, distributed
                systems, and <span className="text-zinc-200">UI architecture</span>. Built multiple
                full-stack production projects.
              </p>
            </div>
          </div>

          {/* Item */}
          <div className="grid gap-4 md:grid-cols-[100px_1fr]">
            {/* Date */}
            <p className="text-[13px] font-medium text-[#8b8b8b] md:pt-1">2024 — 2028</p>

            {/* Content */}
            <div className="space-y-2">
              {/* Header */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                {/* Degree */}
                <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                  B.E. in Mechanical Engineering
                </h3>

                {/* Divider (desktop only) */}
                <span className="hidden text-white/20 sm:inline">—</span>

                {/* University */}
                <div className="flex items-center gap-2">
                  <div className="relative size-5 overflow-hidden rounded-sm bg-white/5 p-0.5">
                    <Image src="/ju.png" alt="JU Logo" fill className="object-contain" />
                  </div>

                  <span className="text-base font-medium text-white/90 sm:text-lg">
                    Jadavpur University
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="max-w-xl text-[16px] leading-relaxed tracking-tight text-[#8b8b8b] sm:text-base">
                Focused on <span className="text-zinc-200">software engineering</span>, distributed
                systems, and <span className="text-zinc-200">UI architecture</span>. Built multiple
                full-stack production projects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
