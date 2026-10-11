export type Phase = 
  | 'Foundations & MDPs'
  | 'Tabular Methods & TD'
  | 'Value Function Approx & DQN'
  | 'Policy Gradients & REINFORCE'
  | 'Actor-Critic & Continuous Control'
  | 'Model-Based RL & Planning'
  | 'RLHF, Alignment & Frontiers'
  | 'C++ & CUDA Foundations'
  | 'Performance Engineering'
  | 'Frontier Kernel Engineering'
  | 'Distributed Training'
  | 'Inference & Serving'
  | 'Portfolio & Job Search';

export type DayStatus = 'completed' | 'in-progress' | 'planned';

export interface DayFormula {
  latex: string;
  name: string;
  description: string;
}

export interface DayCodeSnippet {
  language: string;
  title: string;
  code: string;
  explanation?: string;
}

export interface DayResource {
  title: string;
  type: 'paper' | 'book' | 'code' | 'video' | 'blog' | 'docs' | 'repo' | 'practice';
  url?: string;
}

export interface JournalDay {
  id: string;
  dayNumber: number;
  date: string;
  title: string;
  phase: Phase;
  status: DayStatus;
  isStarred?: boolean;
  summary: string;
  explanation: string;
  formula?: DayFormula;
  codeSnippet?: DayCodeSnippet;
  keyInsights?: string[];
  gotchas?: string[];
  resources?: DayResource[];
  interactiveLabId?: string;
  gitCommitUrl?: string;
}

export interface JournalStats {
  totalDays: number;
  completedDays: number;
  inProgressDays: number;
  plannedDays: number;
  currentStreak: number;
  algorithmsCount: number;
  papersCount: number;
}

export type ProjectStatus = 'wishlist' | 'in-progress' | 'completed';

export interface TargetProject {
  id: string;
  order: number;
  title: string;
  description: string;
  status: ProjectStatus;
  targetTimeline?: string;
  techStack?: string[];
  notes?: string;
  repoUrl?: string;
}

export type ResourceCategory = 'course' | 'blog' | 'paper' | 'video' | 'book' | 'repo' | 'docs' | 'practice' | 'other';

export interface LearningResource {
  id: string;
  title: string;
  url: string;
  category: ResourceCategory;
  authorOrSource?: string;
  notes?: string;
  tags?: string[];
  dateAdded: string;
  isFavorite?: boolean;
}
