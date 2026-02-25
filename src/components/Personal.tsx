import { FaSpotify } from 'react-icons/fa';
import Link from 'next/link';

export default function Personal() {
	return (
		<section className="pb-16">
			<div className="grid md:grid-cols-[125px_1fr] gap-x-10 gap-y-6">
				{/* Section Label */}
				<p className="text-lg text-white/60 font-medium md:text-right">
					Personal
				</p>

				{/* Content */}
				<div className="space-y-12">
					<div className="border border-dashed border-white/20 rounded-xl p-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
						{/* Top Row */}
						<div className="flex items-center gap-2 bg-white/5 p-2 border-1 border-dashed border-white/10 rounded-xl">
							{/* Album Art */}
							<img
								src="/anohianotoki.jpg" // replace with your image path
								alt="Anohi Anotoki Cover"
								className="w-16 h-16 rounded-md object-cover"
							/>

							{/* Song Info */}
							<div className="flex-1">
								<h3 className="text-white font-medium tracking-tight">
									ラブ・ストーリーは突然に
								</h3>
								<p className="text-white/60 text-sm">Kazumasa Oda</p>
							</div>
						</div>

						{/* Bottom Row */}
						<div className="flex items-center justify-between mt-2 text-sm">
							<p className="text-white/50">Current Favourite Song</p>
							<Link
								href={
									'https://open.spotify.com/track/2A97bms3lEk8DlnGJGs88r?si=550a55a8172d486e'
								}
							>
								<div className="flex items-center gap-1 mr-1 text-white/60 hover:text-white transition-colors cursor-pointer">
									<span>Listen on Spotify</span>
									<FaSpotify />
								</div>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
