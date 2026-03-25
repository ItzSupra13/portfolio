import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Work from '@/components/Work';
import Education from '@/components/Education';
import TechStack from '@/components/TechStack';
import Personal from '@/components/Personal';
import Writing from '@/components/Writing';

export default function Page() {
	return (
		<main className="min-h-screen bg-[#0d0d0d] text-white selection:bg-white/10 overflow-x-hidden">
			{/* OUTER CONTAINER — critical spacing layer */}
			<div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
				<Hero/>
				<About />
				<Experience />
				<Work />
				<Writing />
				<Education />
				<TechStack />
				<Personal/>
				<footer className="pb-16 text-center text-xs text-[#8b8b8b]">
					© 2026 | Made with ❤️ by AsterDev
				</footer>
			</div>
		</main>
	);
}
