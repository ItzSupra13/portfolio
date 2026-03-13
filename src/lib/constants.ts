interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  landing: string;
  tech: string[];
  category: "Full-Stack" | "ML & DL" | "Backend";
  sourceUrl?: string;
  liveUrl: string;
}
export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Axiom-ML",
    description: "Don't just import models. Code them from scratch.",
    image: "/AxiomMLLogo.png",
    landing: "/landings/AxiomML.png",
    tech: ["Next.js", "Docker", "Stripe"],
    category: "Full-Stack",
    liveUrl: "https://axiom-ml.vercel.app/"
  },
  {
    id: 2,
    title: "Aesthetify",
    description: "Premium handcrafted templates.",
    image: "/aesthetify.svg",
    landing: "/landings/Aesthetify.png",
    tech: ["Next.js", "TypeScript", "Framer"],
    category: "Full-Stack",
    sourceUrl: "https://github.com/yourrepo",
    liveUrl: "https://aesthetify.com"
  },
  {
    id: 3,
    title: "GitGud",
    description: "Production Grade Github RAG SaaS",
    image: "/gitgud-logo.svg",
    landing: "/landings/GitGud.png",
    tech: ["Node.js", "Docker"],
    category: "Full-Stack",
    sourceUrl: "https://github.com/yourrepo",
    liveUrl: "https://gitgud.com"
  },
];