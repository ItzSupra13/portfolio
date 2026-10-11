import { Ascii } from "ascii.rest/react";
import { Highlighter } from "./ui/highlighter";
import Image from "next/image";

export default function About() {
  return (
    <section className="">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-20 [container-type:size]"
              style={{
                maskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
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
                <Ascii piece="storm-plains" />
              </div>
            </div>
      <div className="grid md:grid-cols-[125px_1fr] gap-x-10 gap-y-4">
        <p className="text-lg text-[#8b8b8b] font-medium md:pr-4 md:pr-4 md:text-right">About</p>

        <div className="max-w-2xl space-y-6 text-lg tracking-tight text-[#8b8b8b] leading-relaxed">
          <p>
            I'm <span className="text-white">Supratim Chakraborty</span> aka{" "}
            <span
              className="inline-flex items-center gap-1.5 align-middle rounded-md bg-[#0d0d0d] px-2
                 border border-[#1f1f1f]
                 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),inset_0_-1px_2px_rgba(0,0,0,0.6)]"
            >
              <Image src="/AsterDev.png" alt="AsterDev Logo" height={20} width={20} className="" />
              <span className="text-white pb-0.5">Aster Dev</span>
            </span>
            . I love building things{" "}
            <span className="items-center">
              from &nbsp;
              <Highlighter action="box" color="#1db7f9" padding={3}>
                <span className="text-white font-medium">scratch</span>
              </Highlighter>
            </span>
            <br />
            <span className="mt-2 block">
              Currently learning and building <span className="text-white">GPU kernels</span>{" "}. My interests lie in Kernel Engineering, and Reinforcement Learning.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
