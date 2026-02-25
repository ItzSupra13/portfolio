'use client';

import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import { PROJECTS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRightIcon } from 'lucide-react';
import Link from 'next/link';
import { FaAngleDown } from 'react-icons/fa';
import { useState } from 'react';

const TABS = ['All', 'Full-Stack', 'ML & DL', 'Backend'];

export default function Work() {
	const [activeTab, setActiveTab] = useState('All');

	const filteredProjects =
		activeTab === 'All'
			? PROJECTS
			: PROJECTS.filter((project) => project.category === activeTab);

	return (
		<section className="pb-8">
			<div className="grid md:grid-cols-[125px_1fr] gap-x-10 gap-y-6">
				<p className="text-lg text-white/60 font-medium md:text-right">
					Work <br />
					<span className="text-xs text-white/40">
						(Good ones atleast lol.)
					</span>
				</p>

				<div className="space-y-6">
					<div className="flex flex-wrap gap-3 max-w-[700px]">
						{TABS.map((tab) => {
							const isActive = activeTab === tab;

							return (
								<Badge
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`
          cursor-pointer border border-dashed transition-all duration-200
          
          ${
						isActive
							? 'bg-white text-black border-white'
							: 'bg-white/5 text-white/40 border-white/20 hover:bg-white/10 hover:text-white/70'
					}
        `}
								>
									{tab}
								</Badge>
							);
						})}
					</div>

					{filteredProjects.map((project) => (
						<div key={project.id}>
							<div
								className="group relative overflow-hidden rounded-2xl border border-white/20 min-h-[125px] 
                bg-[linear-gradient(135deg,#0e0e11_0%,#0e0e11_60%,#141418_100%)] 
                transition-all duration-300 hover:cursor-pointer border-dashed max-w-[700px]"
							>
								{/* Glow */}
								<div className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<div
										className="absolute bottom-0 left-0 translate-x-[-30%] translate-y-[30%] h-56 w-56
                    rounded-full
                    bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.10)_35%,rgba(255,255,255,0.05)_55%,transparent_75%)]
                    blur-2xl"
									/>
								</div>

								{/* MOBILE BG IMAGE */}
								<div className="absolute inset-0 md:hidden">
									<Image
										src={project.landing}
										alt={project.title}
										fill
										className="object-cover opacity-10"
									/>
								</div>

								{/* DESKTOP IMAGE */}
								<div className="absolute inset-y-0 right-0 hidden md:block w-[40%] overflow-hidden">
									<div className="absolute inset-0 bg-gradient-to-r from-[#0e0e11] via-[#0e0e11]/80 to-transparent z-10" />
									<Image
										src={project.landing}
										alt={project.title}
										fill
										className="object-cover translate-y-5 rotate-10 scale-150"
									/>
								</div>

                                {/* CONTENT */}
                                <Link href={project.liveUrl}>
								<div className="relative z-20 flex flex-col justify-center px-6 py-7 md:w-[60%] bg-gradient-to-r from-[#0e0e11] via-transparent to-transparent">
									<div className="flex items-center gap-3 mb-4">
										<Image
											src={project.image}
											alt={project.title}
											width={25}
											height={25}
											className="object-cover"
										/>

										<span className="text-2xl tracking-tighter text-white">
											{project.title}
										</span>

										{/* 🔹 CONDITIONAL SOURCE BADGE */}
										{project.sourceUrl && (
											<Link href={project.sourceUrl} target="_blank">
												<Badge asChild>
													<span className="flex items-center gap-1">
														Source Code <FaGithub />
														<ArrowUpRightIcon className="size-3" />
													</span>
												</Badge>
											</Link>
										)}
									</div>

									<div className="max-w-[300px] space-y-1">
										<h3 className="text-sm text-white">{project.title}</h3>
										<p className="text-sm tracking-tight text-white/60">
											{project.description}
										</p>
									</div>
								</div>
                                </Link>
							</div>
						</div>
					))}

					{/* VIEW ALL BUTTON */}
					<button className="group flex w-full items-center justify-center gap-2 rounded-xl border-1 border-dashed border-white/5 bg-white/[0.02] py-3 text-sm font-medium text-white/40 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:text-white/80 hover:cursor-pointer max-w-[700px]">
						<span>View all</span>
						<FaAngleDown className="transition-transform duration-300 group-hover:translate-y-0.5" />
					</button>
				</div>
			</div>
		</section>
	);
}
