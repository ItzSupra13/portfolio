import Image from 'next/image';

export default function Education() {
	return (
		<section className="pb-16">
			<div className="grid md:grid-cols-[125px_1fr] gap-x-10 gap-y-6">
				<p className="text-lg text-white/60 font-medium md:text-right">
					Education
				</p>

				<div className="space-y-12">
					{/* Item */}
					<div className="grid gap-4 md:grid-cols-[100px_1fr]">
						{/* Date */}
						<p className="text-sm text-white/40 font-medium md:pt-1">
							2024 — 2028
						</p>

						{/* Content */}
						<div className="space-y-3">
							{/* Header */}
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
								{/* Degree */}
								<h3 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
									B.S. in Data Science
								</h3>

								{/* Divider (desktop only) */}
								<span className="hidden sm:inline text-white/20">—</span>

								{/* University */}
								<div className="flex items-center gap-2">
									<div className="relative size-5 overflow-hidden rounded-sm bg-white/5 p-0.5">
										<Image
											src="/iitm.png"
											alt="IITM Logo"
											fill
											className="object-contain"
										/>
									</div>

									<span className="text-base sm:text-lg font-medium text-white/90">
										IIT Madras
									</span>
								</div>
							</div>

							{/* Description */}
							<p className="max-w-xl text-sm sm:text-base leading-relaxed tracking-tight text-zinc-400">
								Focused on{' '}
								<span className="text-zinc-200">software engineering</span>,
								distributed systems, and{' '}
								<span className="text-zinc-200">UI architecture</span>. Built
								multiple full-stack production projects.
							</p>
						</div>
					</div>

					{/* Item */}
					<div className="grid gap-4 md:grid-cols-[100px_1fr]">
						{/* Date */}
						<p className="text-sm text-white/40 font-medium md:pt-1">
							2024 — 2028
						</p>

						{/* Content */}
						<div className="space-y-3">
							{/* Header */}
							<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
								{/* Degree */}
								<h3 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
									B.E. in Mechanical Engineering
								</h3>

								{/* Divider (desktop only) */}
								<span className="hidden sm:inline text-white/20">—</span>

								{/* University */}
								<div className="flex items-center gap-2">
									<div className="relative size-5 overflow-hidden rounded-sm bg-white/5 p-0.5">
										<Image
											src="/ju.png"
											alt="JU Logo"
											fill
											className="object-contain"
										/>
									</div>

									<span className="text-base sm:text-lg font-medium text-white/90">
										Jadavpur University
									</span>
								</div>
							</div>

							{/* Description */}
							<p className="max-w-xl text-sm sm:text-base leading-relaxed tracking-tight text-zinc-400">
								Focused on{' '}
								<span className="text-zinc-200">software engineering</span>,
								distributed systems, and{' '}
								<span className="text-zinc-200">UI architecture</span>. Built
								multiple full-stack production projects.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
