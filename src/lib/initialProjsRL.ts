import { TargetProject, LearningResource } from '../types/rl-journal';

export const INITIAL_TARGET_PROJECTS: TargetProject[] = [
  {
    id: 'proj-cartpole',
    order: 1,
    title: 'RL on Simple CartPole',
    description: 'Classic inverted pendulum balance using Gymnasium CartPole-v1. Compare policy gradients (REINFORCE) with tabular discretization and DQN.',
    status: 'in-progress',
    targetTimeline: 'Days 01–20',
    techStack: ['Gymnasium', 'PyTorch', 'DQN', 'REINFORCE'],
    notes: 'Goal: Benchmark sample efficiency with and without baseline subtraction on angle error.',
    repoUrl: ''
  },
  {
    id: 'proj-snake',
    order: 2,
    title: 'RL on Snake with Pygame',
    description: 'Custom 2D grid Snake environment wrapped with Gymnasium API. Train vision and state-vector agents to navigate and consume food without collisions.',
    status: 'wishlist',
    targetTimeline: 'Days 21–35',
    techStack: ['Pygame', 'Gymnasium API', 'DQN', 'Experience Replay'],
    notes: 'Design dense reward shaping vs sparse rewards (+10 food, -10 death, +0.1 toward food).',
    repoUrl: ''
  },
  {
    id: 'proj-library',
    order: 3,
    title: 'Portable Micro-RL Python Library',
    description: 'Build a lightweight, clean, python-portable RL micro-library (zero bloat, minimal dependencies). Use it directly to train the Pygame Snake agent.',
    status: 'wishlist',
    targetTimeline: 'Days 35–50',
    techStack: ['Python', 'NumPy / PyTorch', 'Wheel Packaging', 'Modular Replay Buffer'],
    notes: 'Architect clean abstractions: Env, Agent, Policy, ReplayBuffer, Loss. Test portability across environments.',
    repoUrl: ''
  },
  {
    id: 'proj-rlhf',
    order: 4,
    title: 'RLHF & DPO on Language Models',
    description: 'Experiment with preference tuning: pairwise reward model training, PPO generation loops with KL penalties, and Direct Preference Optimization (DPO).',
    status: 'wishlist',
    targetTimeline: 'Days 81–95',
    techStack: ['HuggingFace TRL', 'PyTorch', 'DPO', 'Reward Modeling'],
    notes: 'Fine-tune a small open model (e.g. Qwen / Llama 1B) on instruction pairs and measure reward hacking.',
    repoUrl: ''
  },
  {
    id: 'proj-fruitfly',
    order: 5,
    title: 'Fruit Fly Connectome Plays Flappy Bird',
    description: 'Bio-inspired neural connectome / spiking network modeling Drosophila melanogaster sensory-motor circuits to flap through obstacles.',
    status: 'wishlist',
    targetTimeline: 'Days 90–100',
    techStack: ['Connectome / SNN', 'Flappy Bird Gym', 'Neuromorphic RL', 'Hebbian Plasticity'],
    notes: 'Investigate optic flow sensing and motion detectors (T4/T5 neurons) mapped to flap actuation.',
    repoUrl: ''
  }
];

export const INITIAL_LEARNING_RESOURCES: LearningResource[] = [
  {
    id: 'res-sutton-barto',
    title: 'Reinforcement Learning: An Introduction (2nd Edition)',
    url: 'http://incompleteideas.net/book/the-book-2nd.html',
    category: 'book',
    authorOrSource: 'Richard S. Sutton & Andrew G. Barto',
    notes: 'The definitive textbook for tabular methods, Bellman optimality equations, and eligibility traces.',
    tags: ['Foundations', 'MDPs', 'Theory', 'Textbook'],
    dateAdded: '2026-03-01',
    isFavorite: true
  },
  {
    id: 'res-david-silver',
    title: 'UCL Course on Reinforcement Learning',
    url: 'https://www.youtube.com/playlist?list=PLqYmG7hTraZDM-OYHWgPebj2MfCFzFObQ',
    category: 'video',
    authorOrSource: 'David Silver (DeepMind / UCL)',
    notes: '10 timeless video lectures explaining dynamic programming, model-free prediction, and policy gradients.',
    tags: ['Video', 'UCL', 'Lecture Series', 'Foundations'],
    dateAdded: '2026-03-01',
    isFavorite: true
  },
  {
    id: 'res-spinning-up',
    title: 'Spinning Up in Deep RL',
    url: 'https://spinningup.openai.com/',
    category: 'course',
    authorOrSource: 'OpenAI (Joshua Achiam)',
    notes: 'Clean educational derivations and reference PyTorch implementations of VPG, TRPO, PPO, DDPG, TD3, SAC.',
    tags: ['OpenAI', 'Policy Gradients', 'PyTorch', 'Reference Code'],
    dateAdded: '2026-03-02',
    isFavorite: true
  },
  {
    id: 'res-karpathy-pong',
    title: 'Deep Reinforcement Learning: Pong from Pixels',
    url: 'http://karpathy.github.io/2016/05/31/rl/',
    category: 'blog',
    authorOrSource: 'Andrej Karpathy',
    notes: 'Classic, clear explanation of policy gradients with raw NumPy implementation on Atari Pong.',
    tags: ['Policy Gradients', 'Karpathy', 'NumPy', 'Atari'],
    dateAdded: '2026-03-03',
    isFavorite: true
  },
  {
    id: 'res-lilian-rl',
    title: 'A (Long) Peek into Reinforcement Learning',
    url: 'https://lilianweng.github.io/posts/2018-02-19-rl-overview/',
    category: 'blog',
    authorOrSource: 'Lilian Weng (Lil\'Log)',
    notes: 'Thorough mathematical summary covering value iteration, policy iteration, TD learning, and modern algorithms.',
    tags: ['LilLog', 'Survey', 'Math Derivations'],
    dateAdded: '2026-03-04',
    isFavorite: false
  },
  {
    id: 'res-cleanrl',
    title: 'CleanRL: High-Quality Single-File Implementations',
    url: 'https://github.com/vwxyzjn/cleanrl',
    category: 'repo',
    authorOrSource: 'Shengyi Huang et al.',
    notes: 'Single-file, dependency-minimal PyTorch implementations with benchmarked training curves.',
    tags: ['CleanRL', 'GitHub', 'PPO', 'DQN', 'SAC'],
    dateAdded: '2026-03-05',
    isFavorite: true
  },
  {
    id: 'res-deepseek-r1',
    title: 'DeepSeek-R1: Incentivizing Reasoning Capability via RL',
    url: 'https://github.com/deepseek-ai/DeepSeek-R1',
    category: 'paper',
    authorOrSource: 'DeepSeek-AI',
    notes: 'Pure RL (RLVR / GRPO) driving reasoning and test-time compute scaling without supervised warmup.',
    tags: ['RLVR', 'Reasoning', 'GRPO', 'Frontiers'],
    dateAdded: '2026-03-06',
    isFavorite: true
  }
];
