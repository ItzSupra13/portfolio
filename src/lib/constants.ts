interface Project {
	id: number;
	title: string;
	description: string;
	image: string;
	landing: string;
	tech: string[];
	category: 'Full-Stack' | 'ML & DL' | 'Backend';
	sourceUrl?: string;
	liveUrl: string;
}
export const PROJECTS: Project[] = [
	{
		id: 1,
		title: 'Axiom-ML',
		description: "Don't just import models. Code them from scratch.",
		image: '/logos/axiom-ml.png',
		landing: '/landings/AxiomML.png',
		tech: ['Next.js', 'Docker', 'Stripe'],
		category: 'Full-Stack',
		liveUrl: 'https://axiom-ml.vercel.app/',
	},
	{
		id: 2,
		title: 'Origyn',
		description:
			'Vibecode & deploy in a matter of minutes. Orchestrated over 8+ agents.',
		image: '/logos/origyn.jpg',
		landing: '/landings/Aesthetify.png',
		tech: ['Next.js', 'TypeScript', 'Framer'],
		category: 'Full-Stack',
		sourceUrl: 'https://github.com/yourrepo',
		liveUrl: 'https://aesthetify.com',
	}, // 4 month
	{
		id: 3,
		title: 'GitGud',
		description: 'Production Grade Github RAG SaaS',
		image: '/logos/gitgud.svg',
		landing: '/landings/GitGud.png',
		tech: ['Node.js', 'Docker'],
		category: 'Full-Stack',
		sourceUrl: 'https://github.com/yourrepo',
		liveUrl: 'https://gitgud.com',
 	}, // 1 month
// 	{
// 		id: 4,
// 		title: 'Cheatly',
// 		description: 'Cluely Clone that helps in cheating in OAs hehe.',
// 		image: '/logos/cheatly.jpg',
// 		landing: '/landings/GitGud.png',
// 		tech: ['Node.js', 'Docker'],
// 		category: 'Full-Stack',
// 		sourceUrl: 'https://github.com/yourrepo',
// 		liveUrl: 'https://gitgud.com',
// 	},
// 	{
// 		id: 5,
// 		title: 'Aster Code',
// 		description: 'Claude Code Clone .',
// 		image: '/logos/aster-code.jpg',
// 		landing: '/landings/GitGud.png',
// 		tech: ['Node.js', 'Docker'],
// 		category: 'Full-Stack',
// 		sourceUrl: 'https://github.com/yourrepo',
// 		liveUrl: 'https://gitgud.com', // 2  months
// 	},
// 	{
// 		id: 6,
// 		title: 'OverResearch',
// 		description: 'A Prooduction Grade Research Agent available in your Telegram :)',
// 		image: '/logos/over-research.jpg',
// 		landing: '/landings/GitGud.png',
// 		tech: ['Node.js', 'Docker'],
// 		category: 'ML & DL',
// 		sourceUrl: 'https://github.com/yourrepo',
// 		liveUrl: 'https://gitgud.com', // 2 months
//   },
// 	{
// 		id: 7,
// 		title: 'AsterModal',
// 		description: 'Finetuned Video Gen, Voice Gen, Image Gen, Music Gen, and LLM Models all available in 1 Platform',
// 		image: '/logos/astermodal.jpg',
// 		landing: '/landings/GitGud.png',
// 		tech: ['Node.js', 'Docker'],
// 		category: 'ML & DL',
// 		sourceUrl: 'https://github.com/yourrepo',
// 		liveUrl: 'https://gitgud.com',
//   }, // 4 month
// 	{
// 		id: 8,
// 		title: 'Citizenri AI',
// 		description: 'Simulate Population in Fine Tuned Environments with LLMs for Anything you want :)',
// 		image: '/logos/citizenri-ai.jpg',
// 		landing: '/landings/GitGud.png',
// 		tech: ['Node.js', 'Docker'],
// 		category: 'ML & DL',
// 		liveUrl: 'https://gitgud.com',
// 	}, // 1 year
];

export const CompanyLogoData = [
	{
		src: '/stack/Ubuntu.png',
		alt: 'Ubuntu Logo',
		name: 'Ubuntu',
		usage: 'Linux Distro',
	},
	{
		src: '/stack/Nextjs.webp',
		alt: 'NextJS Logo',
		name: 'NextJS',
		usage: 'React Framework',
	},
	{
		src: '/stack/BetterAuth.png',
		alt: 'BetterAuth Logo',
		name: 'Better Auth',
		usage: 'Auth Framework',
	},
	{
		src: '/stack/PostgresSQL.png',
		alt: 'PostGres',
		name: 'PostgresSQL',
		usage: 'SQL Database',
	},
	{
		src: '/stack/Neon.png',
		alt: 'Neon',
		name: 'Neon DB',
		usage: 'Serverless SQL',
	},
	{
		src: '/stack/Drizzle.png',
		alt: 'Drizzle',
		name: 'Drizzle',
		usage: 'ORM',
	},
	{
		src: '/stack/ElysiaJS.png',
		alt: 'Elysia',
		name: 'ElysiaJS',
		usage: 'API Framework',
	},
	{
		src: '/stack/FastAPI.png',
		alt: 'FastAPI',
		name: 'FastAPI',
		usage: 'API Framework',
	},
	{
		src: '/stack/PyTorch.png',
		alt: 'PyTorch',
		name: 'PyTorch',
		usage: 'DL Framework',
	},
];
