'use client';

import React from 'react';
import { motion } from 'motion/react';

const CompanyLogoData = [
	{
		src: '/ju.png',
		alt: 'JU Logo',
		name: 'Jadavpur University',
		usage: 'Bachelor of Engineering',
	},
	{
		src: '/iitm.png',
		alt: 'IITM Logo',
		name: 'IIT Madras',
		usage: 'Online Data Science Program',
	},
];

const InfiniteScrollingLogosAnimation = () => {
	return (
		<div className="py-2 overflow-hidden">
			<div className="container mx-auto px-4">
				<div
					className="flex relative overflow-hidden"
					/* Modern Fade Mask - much cleaner than pseudo-elements */
					style={{
						maskImage:
							'linear-gradient(to right, transparent 0px, black 40px, black calc(100% - 40px), transparent 100%)',
						WebkitMaskImage:
							'linear-gradient(to right, transparent 0px, black 40px, black calc(100% - 40px), transparent 100%)',
					}}
				>
					<motion.div
						transition={{
							duration: 8, // Increased to 40 for a slow, elegant crawl
							ease: 'linear',
							repeat: Infinity,
						}}
						initial={{ x: 0 }}
						animate={{ x: '-50%' }}
						className="flex flex-none gap-2 pr-20" // Increased gap for breathability
					>
						{[...new Array(2)].fill(0).map((_, index) => (
							<React.Fragment key={index}>
								{CompanyLogoData.map((company, index) => (
									<div
										key={index}
										className="flex tracking-tight items-center gap-2 rounded-lg border border-white/20 border-dashed border-1 bg-white/5 px-4 py-2"
									>
										{/* Logo */}
										<img
											src={company.src}
											alt={company.alt}
											className="h-8 w-8 object-contain"
										/>

										{/* Text */}
										<div>
											<p className="text-white font-medium">{company.name}</p>
											<p className="text-xs text-white/50">{company.usage}</p>
										</div>
									</div>
								))}
							</React.Fragment>
						))}
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default InfiniteScrollingLogosAnimation;
