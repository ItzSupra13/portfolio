export const VAR_COLORS = {
  alpha: '#4F46E5', // Royal Indigo — automation rate α
  loss: '#DC2626',  // Crimson — demand loss ℓ
  n: '#0F766E',     // Deep Teal — number of firms N
  eta: '#059669',   // Forest Emerald — reabsorption rate η
  k: '#B45309',     // Warm Amber — integration friction k
  gamma: '#7C3AED', // Violet — AI capability γ
  neutral: '#1A1D24',
} as const;

export const MODULES_META = [
  { id: 'module-1', num: '1', shortTitle: 'Toy Economy', title: 'The Toy Economy' },
  { id: 'module-2', num: '2', shortTitle: 'Payoff Matrix', title: "Discovering the Prisoner's Dilemma" },
  { id: 'module-3', num: '3', shortTitle: 'Formal Model', title: 'Formalizing The AI Layoff Trap' },
  { id: 'module-4', num: '4', shortTitle: 'Red Queen', title: 'The Red Queen Effect & AI-Washing' },
  { id: 'module-5', num: '5', shortTitle: 'Hiring Games', title: 'Why Workers Don’t Bounce Back' },
  { id: 'module-6', num: '6', shortTitle: 'Policy Lab', title: 'Policy Stress-Test' },
  { id: 'module-7', num: '7', shortTitle: 'Synthesis', title: 'Practical Synthesis & Takeaways' },
] as const;
