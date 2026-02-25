import { Highlighter } from './ui/highlighter';

export default function About() {
	return (
		<section className="pb-16">
			<div className="grid md:grid-cols-[125px_1fr] gap-x-10 gap-y-6">
				<p className="text-lg text-white/60 font-medium md:text-right">About</p>

				<div className="max-w-xl space-y-6 text-lg tracking-tight text-white/60">
					<p>
						I'm Supratim Chakraborty aka{' '}
						<span className="text-white font-medium">Aster Dev</span>. I love to
						build things from{' '}
						<Highlighter action="box" color="#1db7f9" padding={3}>
							<span className="text-white font-medium">scratch</span>
						</Highlighter>
						<br />
						<span className="mt-2 block">
							Currently learning and building{' '}
							<span className="text-white">AI Native</span> applications.
						</span>
					</p>
				</div>
			</div>
		</section>
	);
}
