import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Work from "@/components/Work";
import Education from "@/components/Education";
import TechStack from "@/components/TechStack";
import Personal from "@/components/Personal";
import Writing from "@/components/Writing";
import Contact from "@/components/Contact";
import Tools from "@/components/Tools";
import { GridSection } from "@/components/GridSection";
import { FaHeart } from "react-icons/fa";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0d0d0d] text-white selection:bg-white/10">
      <GridSection Hero showHashes showPattern showCrosshairs>
        <Hero />
      </GridSection>

      <GridSection hideOnMobile topBorder={false}>
        <About />
      </GridSection>

      <GridSection hideOnMobile showHashes topBorder={false} showCrosshairs>
        <Experience />
      </GridSection>

      <GridSection hideOnMobile topBorder={false}>
        <Work />
      </GridSection>

      <GridSection showHashes hideOnMobile topBorder={false} showCrosshairs>
        <Writing />
      </GridSection>

      <GridSection hideOnMobile topBorder={false}>
        <Tools />
      </GridSection>

      <GridSection showHashes hideOnMobile topBorder={false} showCrosshairs>
        <Education />
      </GridSection>

      <GridSection hideOnMobile topBorder={false}>
        <TechStack />
      </GridSection>

      <GridSection showHashes hideOnMobile topBorder={false} showCrosshairs>
        <Personal />
      </GridSection>

      {/* CONTACT: Maybe you don't want a bottom border right before the footer */}
      <GridSection hideOnMobile topBorder={false}>
        <Contact />
      </GridSection>

      {/* FOOTER */}
      <GridSection showHashes hideOnMobile topBorder={false} showCrosshairs>
        <footer className="flex items-center justify-center py-8 text-xs text-[#8b8b8b]">
          © 2026 | Made with <FaHeart className="mx-1 text-orange-700" /> by&nbsp;
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
        </footer>
      </GridSection>
    </main>
  );
}
