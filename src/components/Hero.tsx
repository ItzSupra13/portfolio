'use client';

import { WordRotate } from '@/components/ui/word-rotate';
import Image from 'next/image';
import { BsFillCircleFill } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaLinkedin } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa';
import { IoMail } from 'react-icons/io5';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import { Highlighter } from '@/components/ui/highlighter';
import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { BsClock } from 'react-icons/bs';
import Link from 'next/link';
import { LinkPreview } from '@/components/ui/link-preview';
import { MdMarkEmailRead } from 'react-icons/md';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Kbd } from './ui/kbd';
import { toast } from "sonner";

export default function Hero() {
	const words = useMemo(
		() => [
			{ text: 'Hello', tracking: 'tracking-tight' },
			{ text: 'नमस्ते', tracking: 'tracking-wider' },
			{ text: 'নমস্কার', tracking: 'tracking-wider' },
			{ text: 'Hola', tracking: 'tracking-tight' },
			{ text: 'Bonjour', tracking: 'tracking-tight' },
			{ text: 'Ciao', tracking: 'tracking-tight' },
			{ text: 'こんにちは', tracking: 'tracking-wide' },
			{ text: '안녕하세요', tracking: 'tracking-normal' },
			{ text: '你好', tracking: 'tracking-wide' },
			{ text: 'Olá', tracking: 'tracking-tight' },
			{ text: 'Guten Tag', tracking: 'tracking-tight' },
		],
		[],
	);
	const [time, setTime] = useState<string>('');
	const [copied, setCopied] = useState(false);

	const email = 'itzasterdev@gmail.com';

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Ignore if user is typing in an input/textarea
			const active = document.activeElement;
			if (
				active instanceof HTMLInputElement ||
				active instanceof HTMLTextAreaElement
			) {
				return;
			}

			if (event.key.toLowerCase() === 'c') {
				navigator.clipboard.writeText(email);
				setCopied(true);

				setTimeout(() => {
					setCopied(false);
				}, 1500);
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	useEffect(() => {
		const updateTime = () => {
			const now = new Date();
			// Formatting to HH:mm:ss in 24h format
			const timeString = now.toLocaleTimeString('en-GB', {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: false,
			});
			setTime(timeString);
		};

		updateTime();
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	}, []);
	return (
		<section className="pt-9 pb-16 text-center">
			<div className="flex flex-col items-center">
				{/* Time */}
				<div className="m-6 text-4xl font-bold text-white/30">
					<WordRotate words={words} />
				</div>

				<div className="relative inline-block group mb-4">
					{/* Outer Ring / Glow */}
					<div className="absolute inset-0 rounded-full bg-blue-500/10 blur-md group-hover:bg-blue-500/20 transition-all duration-500" />

					{/* Image Container */}
					<div className="group relative h-20 w-20">
						{/* Simplified Circular Image Container */}
						<div className="relative h-full w-full overflow-hidden rounded-full border border-white/10 bg-zinc-900">
							<Image
								src="/supra.jpeg"
								alt="Profile"
								fill
								priority
								className="object-cover zoom-in-20"
							/>
						</div>

						{/* Verified Badge */}
						<div className="absolute bottom-0 right-0 flex size-5 items-center justify-center rounded-full bg-zinc-950 ring-[3px] ring-zinc-950">
							<BsFillCircleFill className=" fill-[#16bf5e]" />
						</div>
					</div>
				</div>

				<div className="flex flex-col items-center">
					{' '}
					<h1 className="flex items-center gap-2 text-3xl font-semibold tracking-tighter text-white">
						Aster Dev
						<RiVerifiedBadgeFill className="size-6 fill-[#1db7f9]" />
					</h1>
					{/* Role: Elegant and Subdued */}
					<div className="mt-1 flex items-center gap-1.5">
						<div className="text-2xl tracking-tight">
							<span className=" text-white/60">Building</span>&nbsp;&nbsp;
							<Highlighter action="underline" color="#5315c0">
								<LinkPreview
									url="https://axiom-ml.vercel.app/"
									className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500 z-20"
								>
									<span className="font-serif italic text-white tracking-wide brightness-110">
										Axiom-ML
									</span>
								</LinkPreview>
							</Highlighter>
						</div>
					</div>
				</div>

				{/* Social Icons */}
				<div className="mt-6 flex items-center gap-8 text-white/40">
					<Link href={'https://x.com/aster_dev_'}>
						<span className="transition hover:text-white text-3xl">
							<FaXTwitter />
						</span>
					</Link>
					<Link href={'www.linkedin.com/in/supratim13'}>
						<span className="transition hover:text-white text-3xl">
							<FaLinkedin />
						</span>
					</Link>
					<Link href={'https://github.com/ItzSupra13'}>
						<span className="transition hover:text-white text-3xl">
							<FaGithub />
						</span>
					</Link>
					<span className="transition hover:text-white text-3xl">
						<Tooltip>
							<TooltipTrigger>
								{copied ? <MdMarkEmailRead /> : <IoMail />}
							</TooltipTrigger>
							<TooltipContent>
								<p className="flex items-center justify-center gap-1.5 transition-all">
									{copied ? (
										'Email Copied!'
									) : (
										<>
											Press <Kbd>C</Kbd> to Copy Email
										</>
									)}
								</p>
							</TooltipContent>
						</Tooltip>
					</span>
				</div>

				{/* CTA Buttons */}
				<div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
					{/* Primary Button */}
					<button className="group relative w-full sm:w-auto rounded-xl border border-dashed border-white/30 bg-gradient-to-b from-[#f0652f] to-[#d44d1d] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white/60 hover:scale-[1.02] active:scale-[0.95] hover:shadow-[0_0_20px_rgba(240,101,47,0.4)]"
					onClick={() => toast.warning("Resume is under development ^_^")}>
						<span className="flex items-center justify-center gap-2">
							<FaEye className="text-lg transition-transform" />
							View Resume
						</span>
					</button>

					{/* OR text */}
					<span className="hidden sm:inline text-sm text-white/40">or</span>

					{/* Secondary Button */}
					<button className="w-full sm:w-auto rounded-lg border border-dashed border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/[0.06]">
						<span className="flex items-center justify-center gap-2">
							See Projects
						</span>
					</button>
				</div>

				<div className="mt-10 flex items-center gap-3">
					{/* Location & Corrected Coordinates for CCU */}
					<p className="text-xs tracking-[0.25em] text-white/30 uppercase">
						CCU, INDIA
					</p>
					{/* Real-time Clock */}
					<div className="flex items-center gap-1.5 font-mono text-xs tracking-wider text-white/40">
						<BsClock className="size-3.5" />
						<span>{time || '00:00:00'} GMT+5:30</span>
					</div>
				</div>
			</div>
		</section>
	);
}
