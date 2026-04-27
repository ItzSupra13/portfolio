import InfiniteScrollingLogosAnimation from "@/components/web/Infinite-Scrolling-Logos-Animation";

export default function TechStack() {
  return (
    <section className="pb-16">
      <div className="grid md:grid-cols-[125px_1fr] gap-x-10 gap-y-6">
        <p className="text-lg text-white/60 font-medium md:text-right">
          Tech Stack <br />
          <span className="text-xs text-white/40">(I can adapt tho :P)</span>
        </p>

        <div className="space-y-12 -ml-10">
          <InfiniteScrollingLogosAnimation />
        </div>
      </div>
    </section>
  );
}
