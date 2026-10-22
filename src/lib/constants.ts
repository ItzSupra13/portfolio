interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  landing: string;
  tech: string[];
  category: "Full-Stack" | "ML & DL" | "AI Agent" | "LLM";
  sourceUrl?: string;
  liveUrl: string;
  wip?:boolean;
  wipHint?:string;
}
export const PROJECTS: Project[] = [
  {
  		id: 0,
  		title: 'MatMul++',
  		subtitle: "Optimizing MatMul to near-SOTA from scratch",
      description: 'A step-by-step optimization of matrix multiplication on a CPU, GPU, and TPU to match SOTA performance',
  		image: '/logos/origyn.jpg',
  		landing: '/landings/matmulpp.png',
  		tech: ['CUDA', 'A100'],
  		category: 'LLM',
  		sourceUrl: 'https://github.com/ItzSupra13/gemm-optimization',
  		liveUrl: 'https://asterdev.vercel.app/gemm-optimization', // 2  months
  },
  // {
  //   id: 1,
  //   title: "Axiom-ML",
  //   subtitle: "Leetcode for AI Algorithms & Benchmarks",
  //   description:
  //     "Don't just import models. Code them from scratch. Even the ones meant for AI! A one stop platform to understand and code your everyday Algorithms from scratch.",
  //   image: "/logos/axiom-ml.png",
  //   landing: "/landings/AxiomML.png",
  //   tech: ["Next.js", "Docker", "Stripe"],
  //   category: "Full-Stack",
  //   liveUrl: "https://axiom-ml.vercel.app/",
  // },
  // {
  //   id: 2,
  //   title: "Origyn",
  //   subtitle: "Custom AI Harness built from scratch",
  //   description: "Do Anything with local models. Generate Images, Music, Videos. Clone Voice. Vibecode & Design Apps. Use Tools with RAG Pipelines and Deep Agents with browser.",
  //   image: "/logos/origyn.jpg",
  //   landing: "/landings/Aesthetify.png",
  //   tech: ["Next.js", "TypeScript", "Framer"],
  //   category: "Full-Stack",
  //   sourceUrl: "https://github.com/yourrepo",
  //   liveUrl: "https://aesthetify.com",
  // }, // 4 month
  // {
  // 	id: 3,
  // 	title: 'Policily',
  //   subtitle: 'Multi-agent swarm with information diffusion models for Businesses. Simulate your next policy, AD, product or GTM before its even launched.',
	// 	description: 'Cluely Clone that helps in cheating in OAs hehe.',  		image: '/logos/cheatly.jpg',
  // 	landing: '/landings/GitGud.png',
  // 	tech: ['Node.js', 'Docker'],
  // 	category: 'AI Agent',
  // 	sourceUrl: 'https://github.com/yourrepo',
  // 	liveUrl: 'https://gitgud.com',
  //   wip: true,
  //   wipHint: "Experimenting with Information Diffusion Models",
  // },
  // {
  //   id: 4,
  //   title: "ArchClik",
  //   subtitle: "Open-Source Clicky inspired Computer use agent for Arch Environments, can use Hyprland.",
  //   description: "Computer-use local models to assist Aged Individuals in using their Computers in a much more tech-savvy manner",
  //   image: "/logos/gitgud.svg",
  //   landing: "/landings/GitGud.png",
  //   tech: ["Node.js", "Docker"],
  //   category: "Full-Stack",
  //   sourceUrl: "https://github.com/yourrepo",
  //   liveUrl: "https://gitgud.com",
  //   wip: true,
  //   wipHint: "Experimenting with computer use agents",
  // }, // 1 month
  // 	{
  // 		id: 5,
  // 		title: '16-bit Computer from Scratch',
  // 		description: 'A working 16-bit computer implemented form the ground up. Play Snake and Pong to test it's limits!',
  // 		image: '/logos/comp.jpg',
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
  // 		title: 'LLM Inference Engine',
  // 		description: 'Simulate Population in Fine Tuned Environments with LLMs for Anything you want :)',
  // 		image: '/logos/citizenri-ai.jpg',
  // 		landing: '/landings/GitGud.png',
  // 		tech: ['Node.js', 'Docker'],
  // 		category: 'ML & DL',
  // 		liveUrl: 'https://gitgud.com',
  // 	},
  //  {
  // 		id: 9,
  // 		title: 'Interactive Pose Recommender',
  // 		description: 'Recommends the best Pose for the given outfit, surroundings and body type',
  // 		image: '/logos/citizenri-ai.jpg',
  // 		landing: '/landings/GitGud.png',
  // 		tech: ['Node.js', 'Docker'],
  // 		category: 'ML & DL',
  // 		liveUrl: 'https://gitgud.com',
  // 	},
];

export const CompanyLogoData = [
  {
    src: "/stack/Ubuntu.png",
    alt: "Ubuntu Logo",
    name: "Ubuntu",
    usage: "Linux Distro",
  },
  {
    src: "/stack/arch.png",
    alt: "Mint Logo",
    name: "Endeavour OS",
    usage: "Dualbooted Distro",
  },
  {
    src: "/stack/Nextjs.webp",
    alt: "NextJS Logo",
    name: "NextJS",
    usage: "React Framework",
  },
  {
    src: "/stack/PostgresSQL.png",
    alt: "PostGres",
    name: "PostgresSQL",
    usage: "SQL Database",
  },
  {
    src: "/stack/Supabase.png",
    alt: "Supabase",
    name: "Supabase",
    usage: "Serverless SQL",
  },
  {
    src: "/stack/FastAPI.png",
    alt: "FastAPI",
    name: "FastAPI",
    usage: "API Framework",
  },
  {
    src: "/stack/PyTorch.png",
    alt: "PyTorch",
    name: "PyTorch",
    usage: "DL Framework",
  },
  {
    src: "/stack/AWS.png",
    alt: "AWS",
    name: "AWS",
    usage: "Deployment platform",
  },
  {
    src: "/stack/Cloudflare.png",
    alt: "Cloudflare",
    name: "Cloudflare",
    usage: "Deployment Platform",
  },
  {
    src: "/stack/Docker.png",
    alt: "Docker",
    name: "Docker",
    usage: "Container Platform",
  },
  {
    src: "/stack/HF.png",
    alt: "Huggingface",
    name: "Huggingface",
    usage: "Model Space",
  },
  {
    src: "/stack/nvidiaa.png",
    alt: "cuda",
    name: "CUDA",
    usage: "Parallel Programming",
  },
];
