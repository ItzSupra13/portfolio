import { JournalDay } from '../types/journal';

export const INITIAL_DAYS: JournalDay[] = [
  {
    id: 'day-01',
    dayNumber: 1,
    date: '2026-03-01',
    title: 'Foundations of MDPs: States, Actions & Discount Factors',
    phase: 'Foundations & MDPs',
    status: 'completed',
    isStarred: true,
    summary: 'Formalized Markov Decision Processes (MDPs), the Markov property, state transitions, reward functions, and why the discount factor γ is mathematically essential for infinite horizons.',
    explanation: `Started the 100 days of Reinforcement Learning journey by dissecting the fundamental formalism: the Markov Decision Process (MDP), tuple (S, A, P, R, γ).

The central assumption is the Markov Property: the conditional probability distribution of future states of the process depends only upon the present state, not on the sequence of events that preceded it:
P(S_{t+1} = s' | S_t = s_t, A_t = a_t, S_{t-1} = s_{t-1}, ...) = P(S_{t+1} = s' | S_t = s_t, A_t = a_t).

Why discount factor γ ∈ [0, 1)?
1. Mathematical convergence: For continuing tasks with infinite horizon, the expected return G_t = ∑_{k=0}^∞ γ^k R_{t+k+1} remains bounded if rewards are bounded.
2. Modeling uncertainty: Future rewards have higher risk and lower immediacy than present returns.
3. Analogy with finance and biological organisms: immediate gains often outweigh delayed gratification.`,
    formula: {
      name: 'Discounted Return Definition',
      latex: 'G_t = \\sum_{k=0}^{\\infty} \\gamma^k R_{t+k+1} = R_{t+1} + \\gamma G_{t+1}',
      description: 'The recursive definition of return proves that the expected future reward can be decomposed into an immediate reward plus the discounted value of the next state.'
    },
    codeSnippet: {
      language: 'python',
      title: 'Simple MDP Environment Interface',
      code: `import numpy as np

class DiscreteMDP:
    def __init__(self, num_states=4, num_actions=2, gamma=0.95):
        self.num_states = num_states
        self.num_actions = num_actions
        self.gamma = gamma
        # Transitions P[s, a, s']
        self.P = np.zeros((num_states, num_actions, num_states))
        # Rewards R[s, a, s']
        self.R = np.zeros((num_states, num_actions, num_states))

    def step(self, state, action):
        next_state = np.random.choice(
            self.num_states, 
            p=self.P[state, action]
        )
        reward = self.R[state, action, next_state]
        return next_state, reward`,
      explanation: 'Base class for a discrete state-action transition system.'
    },
    keyInsights: [
      'The Markov Property allows dynamic programming because state memory is self-contained.',
      'γ = 1 is only valid when the task is guaranteed to terminate in finite steps (episodic).',
      'Policy π(a|s) is a probability distribution mapping each state to available actions.'
    ],
    gotchas: [
      'Do not conflate state with observation. In Partially Observable MDPs (POMDPs), the observation does not satisfy the Markov property without belief states or recurrent memory.'
    ],
    resources: [
      { title: 'Sutton & Barto: Reinforcement Learning: An Introduction (Chapter 3)', type: 'book', url: 'http://incompleteideas.net/book/the-book-2nd.html' },
      { title: 'David Silver UCL RL Lecture 2: Markov Decision Processes', type: 'video', url: 'https://www.youtube.com/watch?v=lfHX2hHRMVQ' }
    ]
  }
//   {
//     id: 'day-02',
//     dayNumber: 2,
//     date: '2026-03-02',
//     title: 'The Bellman Expectation Equations for V(s) and Q(s, a)',
//     phase: 'Foundations & MDPs',
//     status: 'completed',
//     isStarred: true,
//     summary: 'Derived the Bellman Expectation equations for both state-value V^π(s) and action-value Q^π(s, a) functions, understanding backup diagrams and one-step lookaheads.',
//     explanation: `Today was all about mastering the recursive heartbeat of RL: the Bellman Expectation Equation. 

// The value function V^π(s) measures how good it is for an agent to be in a given state under policy π. The action-value function Q^π(s, a) measures the expected return of taking action a in state s, and thereafter following policy π.

// By unraveling the expectation E_π[G_t | S_t = s], we split the infinite sum into an immediate one-step transition plus the discounted continuation value. In vector notation:
// v_π = r_π + γ P_π v_π
// This is a system of linear equations with an exact closed-form solution:
// v_π = (I - γ P_π)^{-1} r_π

// However, solving an |S| × |S| matrix inverse scales in O(|S|^3), which becomes computationally intractable for anything beyond toy state spaces. Hence, dynamic programming and iterative updates are required.`,
//     formula: {
//       name: 'Bellman Expectation Equation for V(s)',
//       latex: 'V^\\pi(s) = \\sum_{a \\in A} \\pi(a|s) \\sum_{s\', r} p(s\', r | s, a) \\left[ r + \\gamma V^\\pi(s\') \\right]',
//       description: 'A state value equals the policy-weighted expectation of immediate reward plus the discounted value of following states.'
//     },
//     codeSnippet: {
//       language: 'python',
//       title: 'Matrix Closed-Form vs Iterative Evaluation',
//       code: `import numpy as np

// def analytical_policy_evaluation(P_pi, r_pi, gamma=0.99):
//     """Solves v = (I - gamma * P_pi)^(-1) @ r_pi directly."""
//     n = P_pi.shape[0]
//     I = np.eye(n)
//     v = np.linalg.inv(I - gamma * P_pi) @ r_pi
//     return v

// def iterative_policy_evaluation(P_pi, r_pi, gamma=0.99, tol=1e-6):
//     """Iteratively computes v_{k+1} = r_pi + gamma * P_pi @ v_k."""
//     n = P_pi.shape[0]
//     v = np.zeros(n)
//     while True:
//         v_next = r_pi + gamma * (P_pi @ v)
//         if np.max(np.abs(v_next - v)) < tol:
//             break
//         v = v_next
//     return v`,
//       explanation: 'Comparing analytical matrix inversion with iterative fixed-point value iteration.'
//     },
//     keyInsights: [
//       'Iterative policy evaluation is a contraction mapping with fixed point guaranteed by Banach fixed-point theorem.',
//       'Q^π(s, a) is simply the value of taking action a first, then evaluating V^π on the resulting next state.',
//       'The contraction factor is γ < 1, which guarantees exponential convergence rate.'
//     ],
//     gotchas: [
//       'Matrix inversion requires knowing the true transition probabilities P(s\'|s, a), which is rarely available in real-world model-free RL.'
//     ],
//     resources: [
//       { title: 'Sutton & Barto: Chapter 3.5 & 4.1', type: 'book' },
//       { title: 'RL Theory: Contraction Mapping Proofs (Stanford CS234)', type: 'blog' }
//     ]
//   },
//   {
//     id: 'day-03',
//     dayNumber: 3,
//     date: '2026-03-03',
//     title: 'Bellman Optimality Equations & Dynamic Programming: Policy Iteration',
//     phase: 'Foundations & MDPs',
//     status: 'completed',
//     isStarred: true,
//     summary: 'Implemented Policy Iteration (Policy Evaluation + Policy Improvement) and proved monotonic convergence towards the optimal policy π*.',
//     explanation: `Today I implemented classical Policy Iteration in a stochastic Gridworld. 
// The algorithm alternates between two complementary phases:
// 1. Policy Evaluation: Given current policy π_k, compute V^{π_k} until convergence.
// 2. Policy Improvement: Construct an updated greedy policy π_{k+1}(s) = argmax_a Q^{π_k}(s, a).

// Policy Improvement Theorem guarantees that for all states s:
// V^{π_{k+1}}(s) ≥ V^{π_k}(s).
// Because a finite MDP has only a finite number of deterministic policies (|A|^{|S|}), Policy Iteration is guaranteed to converge to the global optimal policy π* in a finite number of iterations!`,
//     formula: {
//       name: 'Bellman Optimality Equation for V*(s)',
//       latex: 'V^*(s) = \\max_{a \\in A} \\sum_{s\', r} p(s\', r | s, a) \\left[ r + \\gamma V^*(s\') \\right]',
//       description: 'The optimal value of a state is the maximum expected return achievable under the best possible action.'
//     },
//     codeSnippet: {
//       language: 'python',
//       title: 'Policy Iteration Algorithm in Python',
//       code: `def policy_iteration(env, gamma=0.9, theta=1e-4):
//     num_states = env.num_states
//     num_actions = env.num_actions
//     policy = np.zeros((num_states, num_actions))
//     policy[:, 0] = 1.0  # start with arbitrary deterministic policy
//     V = np.zeros(num_states)
    
//     while True:
//         # 1. Policy Evaluation
//         while True:
//             delta = 0
//             for s in range(num_states):
//                 v_old = V[s]
//                 V[s] = sum(policy[s, a] * sum(
//                     prob * (r + gamma * V[s_next])
//                     for prob, s_next, r in env.get_transitions(s, a)
//                 ) for a in range(num_actions))
//                 delta = max(delta, abs(v_old - V[s]))
//             if delta < theta:
//                 break
                
//         # 2. Policy Improvement
//         policy_stable = True
//         for s in range(num_states):
//             old_action = np.argmax(policy[s])
//             action_values = [
//                 sum(prob * (r + gamma * V[s_next])
//                     for prob, s_next, r in env.get_transitions(s, a))
//                 for a in range(num_actions)
//             ]
//             best_action = np.argmax(action_values)
//             if best_action != old_action:
//                 policy_stable = False
//             policy[s] = np.eye(num_actions)[best_action]
            
//         if policy_stable:
//             break
//     return policy, V`,
//       explanation: 'Alternating evaluation and greedy improvement until the policy achieves stability.'
//     },
//     keyInsights: [
//       'Policy Iteration often converges in very few outer iterations (e.g. 3-8 iterations on gridworlds) even if policy evaluation takes many sweeps.',
//       'Greedy improvement acts as an implicit gradient step in policy space.'
//     ],
//     gotchas: [
//       'Waiting for full policy evaluation convergence is wasteful. Truncating evaluation after a few sweeps leads to Generalized Policy Iteration (GPI) and Value Iteration.'
//     ],
//     resources: [
//       { title: 'Sutton & Barto: Chapter 4.2 - 4.3 (Dynamic Programming)', type: 'book' }
//     ],
//     interactiveLabId: 'gridworld'
//   },
//   {
//     id: 'day-04',
//     dayNumber: 4,
//     date: '2026-03-04',
//     title: 'Value Iteration & The Contraction Mapping Theorem',
//     phase: 'Foundations & MDPs',
//     status: 'completed',
//     isStarred: true,
//     summary: 'Implemented Value Iteration by combining evaluation and improvement into a single Bellman optimality backup sweep. Proved why the Bellman operator T is a γ-contraction in infinity norm.',
//     explanation: `Value Iteration combines one sweep of policy evaluation with greedy improvement into a single update rule:
// V_{k+1}(s) = max_a ∑_{s', r} p(s', r | s, a) [r + γ V_k(s')].

// Mathematical Rigor:
// Let the Bellman Optimality Operator T: R^|S| -> R^|S| be defined as:
// (T V)(s) = max_a ∑_{s'} P(s'|s, a) [R(s, a, s') + γ V(s')].

// Proof that T is a contraction in L_∞ norm:
// ||T U - T V||_∞ ≤ γ ||U - V||_∞.
// Since γ < 1, by Banach's Fixed Point Theorem:
// 1. There exists a unique fixed point V* such that T V* = V*.
// 2. For any initial V_0, iterating V_{k+1} = T V_k converges exponentially fast to V*.
// 3. Convergence rate satisfies ||V_k - V*||_∞ ≤ (γ^k / (1 - γ)) ||V_1 - V_0||_∞.`,
//     formula: {
//       name: 'Bellman Optimality Operator Update',
//       latex: 'V_{k+1}(s) \\leftarrow \\max_{a} \\sum_{s\', r} p(s\', r | s, a) \\left[ r + \\gamma V_k(s\') \\right]',
//       description: 'Single-sweep dynamic programming update applying the max operator directly across all actions.'
//     },
//     codeSnippet: {
//       language: 'python',
//       title: 'Value Iteration Algorithm',
//       code: `def value_iteration(env, gamma=0.99, theta=1e-5):
//     V = np.zeros(env.num_states)
//     iterations = 0
    
//     while True:
//         delta = 0
//         iterations += 1
//         for s in range(env.num_states):
//             v_old = V[s]
//             # Bellman backup: max over all actions
//             q_values = [
//                 sum(p * (r + gamma * V[s_next]) 
//                     for p, s_next, r in env.get_transitions(s, a))
//                 for a in range(env.num_actions)
//             ]
//             V[s] = max(q_values)
//             delta = max(delta, abs(v_old - V[s]))
            
//         if delta < theta:
//             break
            
//     # Extract optimal policy
//     policy = np.zeros((env.num_states, env.num_actions))
//     for s in range(env.num_states):
//         q_values = [
//             sum(p * (r + gamma * V[s_next]) 
//                 for p, s_next, r in env.get_transitions(s, a))
//             for a in range(env.num_actions)
//         ]
//         best_a = np.argmax(q_values)
//         policy[s, best_a] = 1.0
        
//     return V, policy, iterations`,
//       explanation: 'Performs iterative updates until maximum state discrepancy drops below threshold theta.'
//     },
//     keyInsights: [
//       'Value Iteration does not maintain an explicit policy during iteration; the policy is greedily extracted at the very end.',
//       'Asynchronous updates (in-place Value Iteration) converge faster and require only half the memory.'
//     ],
//     gotchas: [
//       'Setting stopping threshold theta too high leads to suboptimal policies; bound stopping criterion with theta * (1 - gamma) / (2 * gamma).'
//     ],
//     resources: [
//       { title: 'Dynamic Programming and Optimal Control (Bertsekas)', type: 'book' }
//     ],
//     interactiveLabId: 'gridworld'
//   },
//   {
//     id: 'day-05',
//     dayNumber: 5,
//     date: '2026-03-05',
//     title: 'Multi-Armed Bandits: The Exploration vs Exploitation Dilemma',
//     phase: 'Foundations & MDPs',
//     status: 'completed',
//     isStarred: false,
//     summary: 'Analyzed non-associative RL with Multi-Armed Bandits. Implemented ε-Greedy, Upper Confidence Bound (UCB1), and Thompson Sampling with regret bounds.',
//     explanation: `Today stepped into active decision-making under uncertainty without state transitions: the Multi-Armed Bandit problem.
// Each arm a ∈ {1, ..., K} yields reward from an unknown distribution with mean μ_a. The optimal arm has value μ* = max_a μ_a.

// Total Regret after T steps:
// R_T = T μ* - ∑_{t=1}^T E[r_t] = ∑_{a} E[N_a(T)] (μ* - μ_a) = ∑_a Δ_a E[N_a(T)].

// Lai and Robbins (1985) proved the fundamental lower bound on regret:
// lim inf_{T->∞} R_T / log(T) ≥ ∑_{a: Δ_a > 0} (2 Δ_a / KL(p_a || p*)).

// We implemented and compared 3 algorithms:
// 1. ε-Greedy: Constant exploration yields linear regret O(T). Decaying ε_t = c/t achieves logarithmic regret O(log T) but is sensitive to hyperparameter tuning.
// 2. UCB1: Implements "optimism in the face of uncertainty" using Hoeffding's inequality, achieving provable O(log T) regret without manual tuning.
// 3. Thompson Sampling: Bayesian posterior sampling, often matching or beating empirical UCB performance.`,
//     formula: {
//       name: 'UCB1 Action Selection Formula',
//       latex: 'A_t = \\arg\\max_{a} \\left( Q_t(a) + c \\sqrt{\\frac{\\ln t}{N_t(a)}} \\right)',
//       description: 'Selects the action maximizing estimated payoff plus an uncertainty bonus proportional to square root of log(t)/N(a).'
//     },
//     codeSnippet: {
//       language: 'python',
//       title: 'UCB1 and Epsilon-Greedy Bandit Implementation',
//       code: `import numpy as np

// class MultiArmedBandit:
//     def __init__(self, k_arms=10):
//         self.k = k_arms
//         self.q_true = np.random.randn(k_arms)
//         self.best_action = np.argmax(self.q_true)

//     def pull(self, action):
//         return self.q_true[action] + np.random.randn()

// def run_ucb(bandit, steps=1000, c=2.0):
//     k = bandit.k
//     q_est = np.zeros(k)
//     action_counts = np.zeros(k)
//     rewards = np.zeros(steps)
    
//     # Initialize by pulling every arm once
//     for a in range(k):
//         r = bandit.pull(a)
//         action_counts[a] = 1
//         q_est[a] = r
//         rewards[a] = r
        
//     for t in range(k, steps):
//         # UCB bonus: sqrt(ln(t) / N(a))
//         ucb_values = q_est + c * np.sqrt(np.log(t) / action_counts)
//         action = np.argmax(ucb_values)
//         r = bandit.pull(action)
//         action_counts[action] += 1
//         q_est[action] += (r - q_est[action]) / action_counts[action]
//         rewards[t] = r
        
//     return rewards, action_counts`,
//       explanation: 'Simulating UCB1 with incremental sample-average updates.'
//     },
//     keyInsights: [
//       'The exploration bonus shrinks as an arm is pulled more frequently, ensuring eventual convergence to the optimal arm.',
//       'Logarithmic regret is asymptotically optimal for stationary bandits.'
//     ],
//     gotchas: [
//       'If the environment is non-stationary (true means drift over time), standard sample averages fail. A constant step-size parameter α is required instead of 1/N(a).'
//     ],
//     resources: [
//       { title: 'Sutton & Barto: Chapter 2 (Multi-armed Bandits)', type: 'book' },
//       { title: 'Bandit Algorithms (Tor Lattimore & Csaba Szepesvári)', type: 'book' }
//     ],
//     interactiveLabId: 'bandit'
//   },
//   {
//     id: 'day-06',
//     dayNumber: 6,
//     date: '2026-03-06',
//     title: 'Monte Carlo Methods: Prediction & On-Policy Control with Exploring Starts',
//     phase: 'Foundations & MDPs',
//     status: 'completed',
//     isStarred: false,
//     summary: 'Shifted from model-based dynamic programming to model-free learning using Monte Carlo rollouts. Compared first-visit vs every-visit estimation and implemented Blackjack control.',
//     explanation: `Today we freed ourselves from needing a model P(s'|s, a) of the world!
// Monte Carlo (MC) methods learn value functions directly from raw experience: sequences of states, actions, and rewards from complete episodes.

// Key distinctions:
// - First-Visit MC: Estimates V(s) as the average of returns following the first time state s is visited in each episode. Unbiased estimator with variance O(1/N).
// - Every-Visit MC: Averages returns after all visits to state s. Slightly biased in finite samples but asymptotically unbiased and often achieves lower Mean Squared Error (MSE).

// Monte Carlo Control requires maintaining exploration:
// 1. Exploring Starts (ES): Assume every state-action pair has non-zero probability of starting an episode.
// 2. On-Policy ε-Soft Policies: Select non-greedy actions with probability ε/|A|, ensuring continuous exploration.`,
//     formula: {
//       name: 'Incremental Monte Carlo Value Update',
//       latex: 'V(S_t) \\leftarrow V(S_t) + \\frac{1}{N(S_t)} \\left[ G_t - V(S_t) \\right]',
//       description: 'Updates state value toward the sampled empirical episode return G_t.'
//     },
//     codeSnippet: {
//       language: 'python',
//       title: 'First-Visit On-Policy Monte Carlo Control',
//       code: `from collections import defaultdict
// import numpy as np

// def monte_carlo_control_epsilon_greedy(env, num_episodes=50000, epsilon=0.1, gamma=1.0):
//     Q = defaultdict(lambda: np.zeros(env.action_space.n))
//     returns_sum = defaultdict(float)
//     returns_count = defaultdict(float)
    
//     for ep in range(num_episodes):
//         # Generate complete trajectory: [(s_0, a_0, r_1), ...]
//         state = env.reset()[0]
//         trajectory = []
//         done = False
        
//         while not done:
//             # Epsilon-greedy action selection
//             if np.random.rand() < epsilon:
//                 action = env.action_space.sample()
//             else:
//                 action = np.argmax(Q[state])
//             next_state, reward, terminated, truncated, _ = env.step(action)
//             trajectory.append((state, action, reward))
//             state = next_state
//             done = terminated or truncated
            
//         # Backward sweep to accumulate returns
//         G = 0
//         visited_sa = set()
//         for t in reversed(range(len(trajectory))):
//             s_t, a_t, r_t1 = trajectory[t]
//             G = gamma * G + r_t1
//             if (s_t, a_t) not in visited_sa:
//                 visited_sa.add((s_t, a_t))
//                 returns_sum[(s_t, a_t)] += G
//                 returns_count[(s_t, a_t)] += 1
//                 Q[s_t][a_t] = returns_sum[(s_t, a_t)] / returns_count[(s_t, a_t)]
                
//     return Q`,
//       explanation: 'Backward accumulation of episode returns ensures efficient O(T) processing per episode.'
//     },
//     keyInsights: [
//       'Monte Carlo methods have zero model bias because they sample real physical trajectories.',
//       'High variance is the primary drawback of MC: return G_t depends on many consecutive random actions and environment transitions.'
//     ],
//     gotchas: [
//       'MC only applies to episodic environments. It cannot be used in continuous, non-terminating tasks without artificial truncation.'
//     ],
//     resources: [
//       { title: 'Sutton & Barto: Chapter 5 (Monte Carlo Methods)', type: 'book' }
//     ]
//   },
//   {
//     id: 'day-07',
//     dayNumber: 7,
//     date: '2026-03-07',
//     title: 'Temporal Difference Learning: TD(0) & Bootstrapping Intuition',
//     phase: 'Tabular Methods & TD',
//     status: 'completed',
//     isStarred: true,
//     summary: 'The holy grail of RL: combining the sample-based nature of Monte Carlo with the bootstrapping power of Dynamic Programming. Analyzed the TD Error δ_t.',
//     explanation: `Today was a milestone: understanding Temporal Difference (TD) learning.
// If Monte Carlo waits until the end of the episode to know G_t, and Dynamic Programming computes expectations over complete models, TD updates immediately after a single step by bootstrapping from its own current value estimate!

// Update rule:
// V(S_t) ← V(S_t) + α [ R_{t+1} + γ V(S_{t+1}) - V(S_t) ].

// The quantity δ_t = R_{t+1} + γ V(S_{t+1}) - V(S_t) is the legendary TD Error!
// It represents the difference between our new one-step target (R_{t+1} + γ V(S_{t+1})) and our old prediction V(S_t).

// Why TD is revolutionary:
// 1. Online & Incremental: Updates happen immediately at every step, not at episode end.
// 2. Works on non-terminating continuing tasks.
// 3. Significantly lower variance than Monte Carlo, though introduced with small bootstrapping bias.
// 4. Sutton proved in 1988 that tabular TD(0) converges to the optimal value function for any stationary policy.`,
//     formula: {
//       name: 'TD(0) Update and TD Error',
//       latex: '\\delta_t = R_{t+1} + \\gamma V(S_{t+1}) - V(S_t), \\quad V(S_t) \\leftarrow V(S_t) + \\alpha \\delta_t',
//       description: 'TD error measures surprise: the immediate reward plus next state value minus the prior expectation.'
//     },
//     codeSnippet: {
//       language: 'python',
//       title: 'TD(0) Value Estimation Loop',
//       code: `def td_zero_prediction(env, policy, alpha=0.1, gamma=0.99, episodes=1000):
//     V = np.zeros(env.num_states)
    
//     for ep in range(episodes):
//         state = env.reset()
//         done = False
        
//         while not done:
//             action = np.random.choice(env.num_actions, p=policy[state])
//             next_state, reward, done = env.step(action)
            
//             # TD Error computation
//             td_target = reward + (0 if done else gamma * V[next_state])
//             td_error = td_target - V[state]
            
//             # Incremental update
//             V[state] += alpha * td_error
//             state = next_state
            
//     return V`,
//       explanation: 'Single-step online bootstrap updates without waiting for episode termination.'
//     },
//     keyInsights: [
//       'Bootstrapping means updating a guess based on another guess.',
//       'TD learns faster than MC in practice because it exploits the Markov property: state values are shared across intersecting trajectories.'
//     ],
//     gotchas: [
//       'TD is sensitive to step size α. If α does not satisfy the Robbins-Monro convergence conditions (∑α_t = ∞ and ∑α_t^2 < ∞), it will oscillate or fail to converge.'
//     ],
//     resources: [
//       { title: 'Learning to Predict by the Methods of Temporal Differences (Richard Sutton, 1988)', type: 'paper' },
//       { title: 'Sutton & Barto: Chapter 6.1 - 6.3', type: 'book' }
//     ]
//   },
//   {
//     id: 'day-08',
//     dayNumber: 8,
//     date: '2026-03-08',
//     title: 'On-Policy SARSA vs Off-Policy Q-Learning: Cliff Walking Face-Off',
//     phase: 'Tabular Methods & TD',
//     status: 'completed',
//     isStarred: true,
//     summary: 'Implemented SARSA (State-Action-Reward-State-Action) and Q-Learning (Watkins 1989). Benchmark on Cliff Walking revealed the stark difference between safe and optimal paths under exploration noise.',
//     explanation: `Today was a classic showdown: SARSA vs Q-Learning.

// 1. SARSA (On-Policy):
// Update: Q(S_t, A_t) ← Q(S_t, A_t) + α [ R_{t+1} + γ Q(S_{t+1}, A_{t+1}) - Q(S_t, A_t) ]
// It evaluates and optimizes the action A_{t+1} actually selected by the ε-greedy policy. Because it considers that future actions might accidentally explore (and fall off the cliff), SARSA learns the conservative "safe path" away from the edge!

// 2. Q-Learning (Off-Policy):
// Update: Q(S_t, A_t) ← Q(S_t, A_t) + α [ R_{t+1} + γ max_a Q(S_{t+1}, a) - Q(S_t, A_t) ]
// It updates toward the greedy optimal action regardless of what exploratory action the behavior policy actually takes next. It learns the true optimal shortest path right along the cliff edge! However, during training with ε > 0, it frequently tumbles off the cliff due to exploration noise.`,
//     formula: {
//       name: 'Q-Learning Bellman Optimality Update',
//       latex: 'Q(S_t, A_t) \\leftarrow Q(S_t, A_t) + \\alpha \\left[ R_{t+1} + \\gamma \\max_{a} Q(S_{t+1}, a) - Q(S_t, A_t) \\right]',
//       description: 'Off-policy TD control updates toward the optimal greedy action regardless of behavior policy.'
//     },
//     codeSnippet: {
//       language: 'python',
//       title: 'Q-Learning vs SARSA in Python',
//       code: `import numpy as np

// def q_learning(env, alpha=0.1, gamma=0.99, epsilon=0.1, episodes=500):
//     Q = np.zeros((env.num_states, env.num_actions))
//     for ep in range(episodes):
//         s = env.reset()
//         done = False
//         while not done:
//             # Epsilon-greedy action from behavior policy
//             a = np.random.choice(env.num_actions) if np.random.rand() < epsilon else np.argmax(Q[s])
//             s_next, r, done = env.step(a)
//             # Off-policy update: max over all next actions
//             target = r + (0 if done else gamma * np.max(Q[s_next]))
//             Q[s, a] += alpha * (target - Q[s, a])
//             s = s_next
//     return Q

// def sarsa(env, alpha=0.1, gamma=0.99, epsilon=0.1, episodes=500):
//     Q = np.zeros((env.num_states, env.num_actions))
//     for ep in range(episodes):
//         s = env.reset()
//         a = np.random.choice(env.num_actions) if np.random.rand() < epsilon else np.argmax(Q[s])
//         done = False
//         while not done:
//             s_next, r, done = env.step(a)
//             # Choose next action using SAME behavior policy
//             a_next = np.random.choice(env.num_actions) if np.random.rand() < epsilon else np.argmax(Q[s_next])
//             # On-policy update
//             target = r + (0 if done else gamma * Q[s_next, a_next])
//             Q[s, a] += alpha * (target - Q[s, a])
//             s, a = s_next, a_next
//     return Q`,
//       explanation: 'Notice line 14 vs line 31: max_a Q(s\', a) vs Q(s\', a_next).'
//     },
//     keyInsights: [
//       'Off-policy means the target policy (greedy) is different from the behavior policy (epsilon-greedy).',
//       'Q-Learning learns the optimal policy directly, while SARSA learns the policy that accounts for the agent\'s own mistakes.'
//     ],
//     gotchas: [
//       'The max operator in Q-Learning causes systematic Maximization Bias in noisy environments!'
//     ],
//     resources: [
//       { title: 'Learning from Delayed Rewards (Chris Watkins PhD Thesis, 1989)', type: 'paper' },
//       { title: 'Sutton & Barto: Chapter 6.4 - 6.6', type: 'book' }
//     ]
//   },
//   {
//     id: 'day-09',
//     dayNumber: 9,
//     date: '2026-03-09',
//     title: 'Maximization Bias & Double Q-Learning (Hasselt 2010)',
//     phase: 'Tabular Methods & TD',
//     status: 'completed',
//     isStarred: false,
//     summary: 'Dissected why E[max(X1, X2)] >= max(E[X1], E[X2]). Implemented Double Q-Learning by decoupling action selection from action evaluation using two separate Q-tables.',
//     explanation: `Today solved a subtle but critical flaw in standard Q-Learning: Maximization Bias.

// Jensen\'s inequality and probability theory dictate that for zero-mean random variables X_i:
// E[max_i X_i] ≥ max_i E[X_i] = 0.
// When estimating action values with noisy estimates Q(s, a), the max operator systematically overestimates value functions:
// E[max_a Q(s, a)] ≥ max_a E[Q(s, a)].

// Hado van Hasselt\'s brilliant solution (2010): Decouple action selection from action evaluation using two distinct estimators Q_A and Q_B.
// To update Q_A:
// 1. Find best action using Q_A: a* = argmax_a Q_A(s', a).
// 2. Evaluate that action using Q_B: target = r + γ Q_B(s', a*).
// Since Q_B is independent of the choice of a*, E[Q_B(s', a*)] = Q(s', a*), completely eliminating the positive maximization bias!`,
//     formula: {
//       name: 'Double Q-Learning Target',
//       latex: 'Y_t^{DQ} = R_{t+1} + \\gamma Q_B\\left(S_{t+1}, \\arg\\max_a Q_A(S_{t+1}, a)\\right)',
//       description: 'Decoupling selection (Q_A) from evaluation (Q_B) eliminates overestimation bias.'
//     },
//     codeSnippet: {
//       language: 'python',
//       title: 'Double Q-Learning Implementation',
//       code: `def double_q_learning(env, alpha=0.1, gamma=0.99, epsilon=0.1, episodes=1000):
//     Q_A = np.zeros((env.num_states, env.num_actions))
//     Q_B = np.zeros((env.num_states, env.num_actions))
    
//     for ep in range(episodes):
//         s = env.reset()
//         done = False
//         while not done:
//             # Action selection based on average of both tables
//             Q_combined = Q_A[s] + Q_B[s]
//             a = np.random.choice(env.num_actions) if np.random.rand() < epsilon else np.argmax(Q_combined)
//             s_next, r, done = env.step(a)
            
//             # Coin flip to update either A or B
//             if np.random.rand() < 0.5:
//                 a_star = np.argmax(Q_A[s_next])
//                 target = r + (0 if done else gamma * Q_B[s_next, a_star])
//                 Q_A[s, a] += alpha * (target - Q_A[s, a])
//             else:
//                 b_star = np.argmax(Q_B[s_next])
//                 target = r + (0 if done else gamma * Q_A[s_next, b_star])
//                 Q_B[s, a] += alpha * (target - Q_B[s, a])
                
//             s = s_next
//     return (Q_A + Q_B) / 2.0`,
//       explanation: 'Symmetric update randomly alternating between Q_A and Q_B.'
//     },
//     keyInsights: [
//       'Maximization bias is the exact reason Deep Q-Networks (DQN) suffer from runaway overoptimism, motivating Double DQN (van Hasselt 2015).',
//       'The fix requires zero extra sample complexity, only storing a second set of weights.'
//     ],
//     gotchas: [
//       'Double Q-learning can occasionally underestimate values in early training, but this is far safer than runaway positive divergence.'
//     ],
//     resources: [
//       { title: 'Double Q-learning (Hado van Hasselt, NeurIPS 2010)', type: 'paper' }
//     ]
//   },
//   {
//     id: 'day-10',
//     dayNumber: 10,
//     date: '2026-03-10',
//     title: 'n-Step Bootstrapping & TD(λ) Eligibility Traces',
//     phase: 'Tabular Methods & TD',
//     status: 'completed',
//     isStarred: false,
//     summary: 'Bridged the spectrum between 1-step TD and infinite-horizon Monte Carlo via n-step returns and TD(λ) eligibility traces with forward and backward views.',
//     explanation: `Today unified everything learned so far into a continuous continuum:
// - n = 1: TD(0) (pure 1-step bootstrap, low variance, high initial bias)
// - n = ∞: Monte Carlo (zero bias, high variance, delayed updates)
// - n ∈ [2, 10]: The sweet spot!

// n-step Return:
// G_{t:t+n} = R_{t+1} + γ R_{t+2} + ... + γ^{n-1} R_{t+n} + γ^n V_{t+n-1}(S_{t+n}).

// By taking a geometrically weighted average of all n-step returns with weight (1 - λ) λ^{n-1}, we obtain the λ-return:
// G_t^λ = (1 - λ) ∑_{n=1}^∞ λ^{n-1} G_{t:t+n}.

// The Backward View of TD(λ):
// Instead of waiting for future steps, each state maintains an eligibility trace:
// z_t(s) = γ λ z_{t-1}(s) + 1 (accumulating) or max(γ λ z_{t-1}(s), 1) (replacing).
// When TD error δ_t occurs, it broadcasts credit backwards to all recently visited states in proportion to z_t(s)!`,
//     formula: {
//       name: 'Eligibility Trace Update',
//       latex: 'z_t(s) = \\gamma \\lambda z_{t-1}(s) + \\mathbb{I}(S_t = s), \\quad V_{t+1}(s) = V_t(s) + \\alpha \\delta_t z_t(s)',
//       description: 'Backwards-view eligibility trace distributing current TD error to historically visited states.'
//     },
//     codeSnippet: {
//       language: 'python',
//       title: 'TD(λ) with Accumulating Traces',
//       code: `def td_lambda(env, policy, alpha=0.1, gamma=0.99, lam=0.8, episodes=500):
//     V = np.zeros(env.num_states)
    
//     for ep in range(episodes):
//         z = np.zeros(env.num_states)  # eligibility trace
//         s = env.reset()
//         done = False
        
//         while not done:
//             a = np.random.choice(env.num_actions, p=policy[s])
//             s_next, r, done = env.step(a)
            
//             # TD error
//             delta = r + (0 if done else gamma * V[s_next]) - V[s]
//             # Increment trace for current state
//             z[s] += 1.0
            
//             # Global update for all states proportional to eligibility
//             V += alpha * delta * z
//             z *= gamma * lam  # decay traces
            
//             s = s_next
//     return V`,
//       explanation: 'Eligibility traces allow one-step TD error to update long chains of precursor states.'
//     },
//     keyInsights: [
//       'The forward view provides the mathematical definition; the backward view provides the computationally feasible O(1) online implementation.',
//       'λ = 0 is TD(0); λ = 1 is offline Monte Carlo.'
//     ],
//     gotchas: [
//       'In high-dimensional state spaces, tracking eligibility traces across all features becomes computationally expensive unless features are sparse.'
//     ],
//     resources: [
//       { title: 'Sutton & Barto: Chapter 7 (n-step Bootstrapping) & Chapter 12 (Eligibility Traces)', type: 'book' }
//     ]
//   },
//   {
//     id: 'day-11',
//     dayNumber: 11,
//     date: '2026-03-11',
//     title: 'The Deadly Triad & Linear Function Approximation',
//     phase: 'Value Function Approx & DQN',
//     status: 'completed',
//     isStarred: true,
//     summary: 'Stepped into infinite state spaces with linear function approximation V̂(s, w) = wᵀ x(s). Analyzed Sutton\'s "Deadly Triad" which causes value functions to diverge to infinity.',
//     explanation: `Real-world problems have continuous states. Storing a table of values is impossible.
// We approximate the value function: V̂(s, w) ≈ V^π(s), where w ∈ R^d is a parameter vector.

// Gradient Monte Carlo update minimizes Mean Squared Value Error (MSVE):
// w ← w + α [ G_t - V̂(S_t, w) ] ∇_w V̂(S_t, w).
// Because G_t is an unbiased sample, standard stochastic gradient descent guarantees convergence to a local optimum.

// However, when using Semi-Gradient TD:
// w ← w + α [ R_{t+1} + γ V̂(S_{t+1}, w) - V̂(S_t, w) ] ∇_w V̂(S_t, w).
// We ignore the gradient with respect to w in the target V̂(S_{t+1}, w)!

// The Deadly Triad:
// Any algorithm combining these three elements risks numerical instability and catastrophic divergence:
// 1. Function Approximation (e.g. neural networks or linear models).
// 2. Bootstrapping (updating estimates from other estimates, e.g. TD, DP).
// 3. Off-Policy Training (training on transitions from a different distribution than current policy).`,
//     formula: {
//       name: 'Semi-Gradient TD(0) Linear Weight Update',
//       latex: 'w_{t+1} = w_t + \\alpha \\left[ R_{t+1} + \\gamma w_t^T x(S_{t+1}) - w_t^T x(S_t) \\right] x(S_t)',
//       description: 'Weight update ignores the gradient through the target, making it a semi-gradient method.'
//     },
//     codeSnippet: {
//       language: 'python',
//       title: 'Linear Feature Approximation on MountainCar',
//       code: `import numpy as np

// class TileCoder:
//     def __init__(self, num_tilings=8, bins_per_dim=8):
//         self.num_tilings = num_tilings
//         self.bins = bins_per_dim
//         self.dim = num_tilings * (bins_per_dim ** 2)

//     def get_features(self, position, velocity):
//         # Normalized tile coding feature extraction
//         feats = np.zeros(self.dim)
//         for i in range(self.num_tilings):
//             p_bin = int(np.clip((position + 1.2) / 1.8 * self.bins + i * 0.1, 0, self.bins - 1))
//             v_bin = int(np.clip((velocity + 0.07) / 0.14 * self.bins + i * 0.1, 0, self.bins - 1))
//             idx = i * (self.bins ** 2) + p_bin * self.bins + v_bin
//             feats[idx] = 1.0
//         return feats`,
//       explanation: 'Sparse binary tile coding features for continuous 2D state spaces.'
//     },
//     keyInsights: [
//       'Linear semi-gradient TD converges to a unique fixed point w*, where MSVE(w*) ≤ (1 / (1 - γ)) min_w MSVE(w).',
//       'The Deadly Triad explains why naive combinations of Q-learning and neural networks failed for two decades until DeepMind introduced target networks and replay buffers in 2013.'
//     ],
//     gotchas: [
//       'Never backpropagate through the TD target! In PyTorch, always call .detach() on the bootstrap target.'
//     ],
//     resources: [
//       { title: 'Sutton & Barto: Chapter 9 & 11 (Off-policy Methods with Approximation)', type: 'book' },
//       { title: 'Baird\'s Counterexample for TD Divergence', type: 'blog' }
//     ]
//   },
//   {
//     id: 'day-12',
//     dayNumber: 12,
//     date: '2026-03-12',
//     title: 'Deep Q-Networks (DQN): Taming Non-Stationarity with PyTorch',
//     phase: 'Value Function Approx & DQN',
//     status: 'completed',
//     isStarred: true,
//     summary: 'Built complete Deep Q-Network (Mnih et al. 2015) in PyTorch. Implemented Uniform Experience Replay and Periodic Target Network updates to stabilize training on CartPole-v1.',
//     explanation: `Today built the famous Deep Q-Network (DQN) from scratch in PyTorch to solve CartPole-v1!

// DeepMind\'s breakthrough in Nature 2015 broke the curse of the Deadly Triad using two crucial engineering mechanisms:
// 1. Experience Replay Buffer (D):
// Transitions (s, a, r, s', done) are stored in a circular ring buffer. Training batches are sampled uniformly at random.
// - Breaks temporal correlation between consecutive steps.
// - Re-uses rare transition experiences across multiple parameter updates.
// - Transforms online RL into something closer to supervised I.I.D. training.

// 2. Separate Target Network (Q_θ⁻):
// The TD target Y_t = r + γ max_a Q(s', a; θ⁻) uses fixed parameter weights θ⁻ that are only synchronized every C steps (or softly updated via Polyak averaging: θ⁻ ← τ θ + (1 - τ) θ⁻).
// - Prevents the moving target problem where updating Q(s, a) shifts the value of Q(s', a'), causing feedback oscillations.`,
//     formula: {
//       name: 'DQN Loss Function',
//       latex: 'L(\\theta) = \\mathbb{E}_{(s,a,r,s\',d) \\sim \\mathcal{D}} \\left[ \\left( r + \\gamma (1-d) \\max_{a\'} Q(s\', a\'; \\theta^-) - Q(s, a; \\theta) \\right)^2 \\right]',
//       description: 'Mean Squared Bellman Error over uniform mini-batch sampled from replay buffer.'
//     },
//     codeSnippet: {
//       language: 'python',
//       title: 'Core PyTorch DQN Training Step',
//       code: `import torch
// import torch.nn as nn
// import torch.optim as optim
// import random
// from collections import deque

// class QNetwork(nn.Module):
//     def __init__(self, state_dim, action_dim):
//         super().__init__()
//         self.net = nn.Sequential(
//             nn.Linear(state_dim, 128),
//             nn.ReLU(),
//             nn.Linear(128, 128),
//             nn.ReLU(),
//             nn.Linear(128, action_dim)
//         )
//     def forward(self, x):
//         return self.net(x)

// def train_dqn_step(q_net, target_net, optimizer, replay_buffer, batch_size=64, gamma=0.99):
//     batch = random.sample(replay_buffer, batch_size)
//     states, actions, rewards, next_states, dones = zip(*batch)
    
//     s_tensor = torch.tensor(states, dtype=torch.float32)
//     a_tensor = torch.tensor(actions, dtype=torch.int64).unsqueeze(1)
//     r_tensor = torch.tensor(rewards, dtype=torch.float32).unsqueeze(1)
//     s_next_tensor = torch.tensor(next_states, dtype=torch.float32)
//     d_tensor = torch.tensor(dones, dtype=torch.float32).unsqueeze(1)
    
//     # Compute current Q(s, a)
//     q_vals = q_net(s_tensor).gather(1, a_tensor)
    
//     # Compute Target Q with target network (NO GRADIENT)
//     with torch.no_grad():
//         next_q_max = target_net(s_next_tensor).max(1, keepdim=True)[0]
//         targets = r_tensor + gamma * (1.0 - d_tensor) * next_q_max
        
//     # Smooth L1 (Huber) loss is more robust to outlier TD errors
//     loss = nn.functional.smooth_l1_loss(q_vals, targets)
    
//     optimizer.zero_grad()
//     loss.backward()
//     nn.utils.clip_grad_norm_(q_net.parameters(), max_norm=10.0)
//     optimizer.step()
//     return loss.item()`,
//       explanation: 'Note the use of .gather(1, a_tensor) and torch.no_grad() for target calculation.'
//     },
//     keyInsights: [
//       'Huber Loss (Smooth L1) protects against gradient explosion when TD targets are noisy.',
//       'CartPole solved in ~120 episodes with stable return reaching 500.0.'
//     ],
//     gotchas: [
//       'Gradient clipping is non-negotiable in Deep RL. Without it, sudden spikes in TD error can corrupt the neural network weights.'
//     ],
//     resources: [
//       { title: 'Human-level control through deep reinforcement learning (Mnih et al., Nature 2015)', type: 'paper', url: 'https://www.nature.com/articles/nature14236' }
//     ]
//   },
//   {
//     id: 'day-13',
//     dayNumber: 13,
//     date: '2026-03-13',
//     title: 'Double DQN & Dueling Architecture: Decomposing State Value and Action Advantage',
//     phase: 'Value Function Approx & DQN',
//     status: 'completed',
//     isStarred: true,
//     summary: 'Upgraded DQN to Double DQN (van Hasselt 2015) and implemented Wang et al.\'s Dueling Network Architecture Q(s, a) = V(s) + (A(s, a) - mean(A)).',
//     explanation: `Today implemented two critical upgrades to DQN:

// 1. Double DQN (DDQN):
// In vanilla DQN, the target is r + γ max_a Q(s', a; θ⁻). Since the target network both selects and evaluates the maximizing action, it inherits the same maximization bias seen on Day 9.
// DDQN selects the best action with online network θ, then evaluates it with target network θ⁻:
// Y_t^{DDQN} = r + γ Q(s', argmax_a Q(s', a; θ); θ⁻).

// 2. Dueling Network Architecture (Wang et al., ICML 2016):
// Often in many states, action selection has little impact on survival (e.g. driving on an empty highway: steering left or right matters little as long as you stay in lane).
// We split the network into two streams:
// - State Value stream: V(s; θ, β) ∈ R
// - Advantage stream: A(s, a; θ, α) ∈ R^|A|

// To ensure identifiable decomposition, we subtract the mean advantage:
// Q(s, a) = V(s) + ( A(s, a) - (1/|A|) ∑_{a'} A(s, a') ).
// This allows the state value stream V(s) to learn what states are valuable without having to learn the effect of each individual action!`,
//     formula: {
//       name: 'Identifiable Dueling Decomposition',
//       latex: 'Q(s, a; \\theta, \\alpha, \\beta) = V(s; \\theta, \\beta) + \\left( A(s, a; \\theta, \\alpha) - \\frac{1}{|\\mathcal{A}|} \\sum_{a\'} A(s, a\'; \\theta, \\alpha) \\right)',
//       description: 'Subtracting the mean advantage ensures uniqueness and stabilizes backpropagation into V(s).'
//     },
//     codeSnippet: {
//       language: 'python',
//       title: 'Dueling DQN Architecture in PyTorch',
//       code: `import torch
// import torch.nn as nn

// class DuelingQNetwork(nn.Module):
//     def __init__(self, state_dim, action_dim):
//         super().__init__()
//         # Shared feature extractor
//         self.feature = nn.Sequential(
//             nn.Linear(state_dim, 128),
//             nn.ReLU()
//         )
//         # Value stream V(s)
//         self.value_stream = nn.Sequential(
//             nn.Linear(128, 64),
//             nn.ReLU(),
//             nn.Linear(64, 1)
//         )
//         # Advantage stream A(s, a)
//         self.advantage_stream = nn.Sequential(
//             nn.Linear(128, 64),
//             nn.ReLU(),
//             nn.Linear(64, action_dim)
//         )

//     def forward(self, state):
//         feat = self.feature(state)
//         val = self.value_stream(feat)
//         adv = self.advantage_stream(feat)
//         # Identifiable combination: V(s) + (A(s, a) - mean(A(s, a)))
//         q_vals = val + (adv - adv.mean(dim=-1, keepdim=True))
//         return q_vals`,
//       explanation: 'The advantage mean subtraction forces the advantage stream to have zero mean.'
//     },
//     keyInsights: [
//       'Double DQN eliminates systematic overestimation of Q values, visible on tensorboard as much flatter, realistic value predictions.',
//       'Dueling DQN improves policy evaluation efficiency because V(s) updates after every single action taken.'
//     ],
//     gotchas: [
//       'Do not subtract max(A(s, a)); subtracting mean(A) provides much smoother optimization gradients in practice.'
//     ],
//     resources: [
//       { title: 'Deep Reinforcement Learning with Double Q-learning (van Hasselt et al., AAAI 2016)', type: 'paper' },
//       { title: 'Dueling Network Architectures for Deep Reinforcement Learning (Wang et al., ICML 2016)', type: 'paper' }
//     ]
//   },
//   {
//     id: 'day-14',
//     dayNumber: 14,
//     date: '2026-03-14',
//     title: 'Prioritized Experience Replay (PER): Sampling by TD Error Magnitude',
//     phase: 'Value Function Approx & DQN',
//     status: 'completed',
//     isStarred: false,
//     summary: 'Replaced uniform random replay sampling with Prioritized Experience Replay (Schaul et al. 2016) using a SumTree data structure and Importance Sampling (IS) weights to correct sampling bias.',
//     explanation: `Uniform replay buffer sampling treats all transitions equally. But transitions where the agent experienced high surprise (large |TD error| |δ_i|) carry far more educational value than mundane, predictable transitions.

// PER samples transitions with probability:
// P(i) = p_i^α / (∑_k p_k^α), where p_i = |δ_i| + ε.
// - α ∈ [0, 1] controls prioritization degree (α=0 is uniform).

// Correcting Distribution Shift with Importance Sampling:
// Sampling non-uniformly introduces expectation bias. We correct for this using Importance Sampling weights:
// w_i = ( 1 / (N · P(i)) )^β.
// - β starts at β_0 ≈ 0.4 and anneals to 1.0 by the end of training.

// Data Structure:
// A naive array search for proportional sampling is O(N). By implementing a binary SumTree where parent nodes store the sum of their children, we achieve O(log N) updates and O(log N) sampling!`,
//     formula: {
//       name: 'Importance Sampling Weight Correction',
//       latex: 'w_i = \\left( \\frac{1}{N \\cdot P(i)} \\right)^\\beta, \\quad \\Delta w \\propto w_i \\delta_i \\nabla_\\theta Q(s_i, a_i)',
//       description: 'IS weights neutralize the sampling bias introduced by prioritizing transitions with higher TD errors.'
//     },
//     codeSnippet: {
//       language: 'python',
//       title: 'SumTree Structure for O(log N) Proportional Sampling',
//       code: `import numpy as np

// class SumTree:
//     def __init__(self, capacity):
//         self.capacity = capacity
//         self.tree = np.zeros(2 * capacity - 1)
//         self.data = np.zeros(capacity, dtype=object)
//         self.write_ptr = 0
//         self.n_entries = 0

//     def total(self):
//         return self.tree[0]

//     def add(self, p, data):
//         idx = self.write_ptr + self.capacity - 1
//         self.data[self.write_ptr] = data
//         self.update(idx, p)
//         self.write_ptr = (self.write_ptr + 1) % self.capacity
//         self.n_entries = min(self.n_entries + 1, self.capacity)

//     def update(self, idx, p):
//         change = p - self.tree[idx]
//         self.tree[idx] = p
//         while idx != 0:
//             idx = (idx - 1) // 2
//             self.tree[idx] += change

//     def get(self, s):
//         idx = 0
//         while True:
//             left = 2 * idx + 1
//             right = left + 1
//             if left >= len(self.tree):
//                 break
//             if s <= self.tree[left]:
//                 idx = left
//             else:
//                 s -= self.tree[left]
//                 idx = right
//         data_idx = idx - self.capacity + 1
//         return idx, self.tree[idx], self.data[data_idx]`,
//       explanation: 'Binary SumTree allows sample-and-retrieve in logarithmic O(log N) complexity.'
//     },
//     keyInsights: [
//       'PER significantly speeds up convergence in sparse-reward environments where rare successful trajectories must be replayed frequently.',
//       'Annealing β to 1.0 ensures asymptotic convergence to the true expected gradient.'
//     ],
//     gotchas: [
//       'When new experiences are added, set their initial priority to max_p so that new transitions are guaranteed to be sampled at least once.'
//     ],
//     resources: [
//       { title: 'Prioritized Experience Replay (Schaul et al., ICLR 2016)', type: 'paper' }
//     ]
//   },
//   {
//     id: 'day-15',
//     dayNumber: 15,
//     date: '2026-03-15',
//     title: 'The Policy Gradient Theorem & REINFORCE with Baseline',
//     phase: 'Policy Gradients & REINFORCE',
//     status: 'in-progress',
//     isStarred: true,
//     summary: 'Transitioned from value-based methods to direct policy optimization. Derived the Policy Gradient Theorem and implemented REINFORCE with a state-value baseline to reduce variance.',
//     explanation: `Today marks the shift toward Policy Gradient methods! Instead of picking actions via argmax_a Q(s, a), we parameterize a stochastic policy π_θ(a|s) directly and perform gradient ascent on expected return J(θ) = E_{τ ~ π_θ}[R(τ)].

// The miracle of the Policy Gradient Theorem:
// Even though the distribution of visited states depends on policy parameters θ in complex non-linear ways, ∇_θ J(θ) does NOT require taking gradients through the environment transition dynamics!
// ∇_θ J(θ) = E_{τ ~ π_θ} [ ∑_{t=0}^T ∇_θ log π_θ(A_t|S_t) G_t ].

// Variance Reduction with Baselines:
// Raw Monte Carlo returns G_t have extreme variance. We can subtract any baseline function b(s) that does not depend on action a without introducing ANY bias:
// E_{A_t ~ π} [ ∇_θ log π_θ(A_t|S_t) b(S_t) ] = 0.
// The optimal state-dependent baseline is V^π(S_t), yielding advantage A(S_t, A_t) = G_t - V(S_t)!`,
//     formula: {
//       name: 'Policy Gradient Theorem with Baseline',
//       latex: '\\nabla_\\theta J(\\theta) = \\mathbb{E}_{\\pi_\\theta} \\left[ \\sum_{t=0}^T \\nabla_\\theta \\ln \\pi_\\theta(A_t|S_t) \\left( G_t - b(S_t) \\right) \\right]',
//       description: 'Increases log probability of actions proportional to how much return exceeded the baseline expectation.'
//     },
//     codeSnippet: {
//       language: 'python',
//       title: 'REINFORCE with Value Network Baseline',
//       code: `import torch
// import torch.nn as nn
// from torch.distributions import Categorical

// class PolicyNetwork(nn.Module):
//     def __init__(self, s_dim, a_dim):
//         super().__init__()
//         self.net = nn.Sequential(
//             nn.Linear(s_dim, 128),
//             nn.ReLU(),
//             nn.Linear(128, a_dim)
//         )
//     def forward(self, state):
//         logits = self.net(state)
//         return Categorical(logits=logits)

// def update_reinforce_with_baseline(policy_net, value_net, p_opt, v_opt, states, actions, rewards, gamma=0.99):
//     # Compute discounted returns G_t
//     G = 0
//     returns = []
//     for r in reversed(rewards):
//         G = r + gamma * G
//         returns.insert(0, G)
//     returns = torch.tensor(returns, dtype=torch.float32)
    
//     s_tensor = torch.stack(states)
//     a_tensor = torch.tensor(actions)
    
//     # Value network baseline prediction
//     values = value_net(s_tensor).squeeze()
//     advantages = returns - values.detach()
    
//     # Policy loss: - E [ log_prob * Advantage ]
//     dist = policy_net(s_tensor)
//     log_probs = dist.log_prob(a_tensor)
//     policy_loss = -(log_probs * advantages).mean()
    
//     # Value loss: MSE(V(s), G)
//     value_loss = nn.functional.mse_loss(values, returns)
    
//     p_opt.zero_grad()
//     policy_loss.backward()
//     p_opt.step()
    
//     v_opt.zero_grad()
//     value_loss.backward()
//     v_opt.step()`,
//       explanation: 'Simultaneously trains policy net via advantage-weighted log probs and value net via MSE.'
//     },
//     keyInsights: [
//       'Log-derivative trick ∇f(θ) = f(θ) ∇log f(θ) enables sampling trajectories without knowing the likelihood density.',
//       'Policy gradient naturally handles stochastic optimal policies and continuous action spaces.'
//     ],
//     gotchas: [
//       'High sample complexity is the Achilles heel of pure REINFORCE because updates require full episode rollouts.'
//     ],
//     resources: [
//       { title: 'Policy Gradient Methods for Reinforcement Learning with Function Approximation (Sutton et al., 1999)', type: 'paper' }
//     ]
//   },
//   {
//     id: 'day-16',
//     dayNumber: 16,
//     date: '2026-03-16',
//     title: 'Actor-Critic Architecture (A2C): Advantage Estimation & Entropy Regularization',
//     phase: 'Actor-Critic & Continuous Control',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Replace Monte Carlo return G_t with a 1-step bootstrap critic A(s, a) = r + γ V(s\') - V(s). Add entropy bonus H(π) to prevent premature policy collapse.',
//     explanation: `Roadmap outline for Day 16:
// - Transitioning from REINFORCE to synchronous Advantage Actor-Critic (A2C).
// - Critic provides low-variance bootstrapping target.
// - Adding entropy regularization -β ∑ π(a|s) log π(a|s) to maintain exploration throughout training.
// - Multi-worker synchronous rollout collection.`,
//     keyInsights: [
//       'Entropy regularization prevents policy from converging prematurely to a single deterministic action.'
//     ],
//     resources: [
//       { title: 'Asynchronous Methods for Deep Reinforcement Learning (Mnih et al. 2016)', type: 'paper' }
//     ]
//   },
//   {
//     id: 'day-17',
//     dayNumber: 17,
//     date: '2026-03-17',
//     title: 'Generalized Advantage Estimation (GAE) & The Bias-Variance Tradeoff',
//     phase: 'Actor-Critic & Continuous Control',
//     status: 'planned',
//     isStarred: true,
//     summary: 'John Schulman\'s GAE(γ, λ): exponentially decaying trace of TD errors providing the optimal advantage estimator for modern policy gradients.',
//     explanation: `Roadmap outline for Day 17:
// - Mathematical derivation of GAE parameter λ.
// - Why λ=0 gives 1-step TD (low variance, high bias) and λ=1 gives Monte Carlo baseline (high variance, zero bias).
// - Vectorized backwards calculation of A^{GAE}_t in PyTorch.`,
//     resources: [
//       { title: 'High-Dimensional Continuous Control Using Generalized Advantage Estimation (Schulman et al. 2015)', type: 'paper' }
//     ]
//   },
//   {
//     id: 'day-18',
//     dayNumber: 18,
//     date: '2026-03-18',
//     title: 'Proximal Policy Optimization (PPO): The Clipped Surrogate Objective',
//     phase: 'Actor-Critic & Continuous Control',
//     status: 'planned',
//     isStarred: true,
//     summary: 'The industry workhorse algorithm: PPO-Clip (Schulman 2017). Understanding probability ratios r_t(θ) and the clip(r, 1-ε, 1+ε) safety mechanism.',
//     explanation: `Roadmap outline for Day 18:
// - Why standard policy gradient step sizes destroy policies in non-linear regimes.
// - Trust region intuition without the expensive second-order Hessian constraints of TRPO.
// - Implementing the clipped surrogate objective in PyTorch for continuous MuJoCo / Gymnasium environments.`,
//     resources: [
//       { title: 'Proximal Policy Optimization Algorithms (Schulman et al., 2017)', type: 'paper' }
//     ]
//   },
//   {
//     id: 'day-19',
//     dayNumber: 19,
//     date: '2026-03-19',
//     title: 'Continuous Control: Gaussian Policies & Reparameterization Trick',
//     phase: 'Actor-Critic & Continuous Control',
//     status: 'planned',
//     isStarred: false,
//     summary: 'Extending policy gradient to continuous robotics action spaces: modeling μ(s) and σ(s) with Gaussian distributions and backpropagating via reparameterization.',
//     explanation: `Roadmap outline for Day 19:
// - Diagonal Gaussian policies in PyTorch.
// - Log standard deviation parameterization: state-independent vs state-dependent.
// - Squashed Gaussians via tanh and Jacobian log-determinant correction.`,
//     resources: [
//       { title: 'Spinning Up in Deep RL: Diagonal Gaussian Policies', type: 'blog' }
//     ]
//   },
//   {
//     id: 'day-20',
//     dayNumber: 20,
//     date: '2026-03-20',
//     title: 'Soft Actor-Critic (SAC): Maximum Entropy RL & Twin Q-Networks',
//     phase: 'Actor-Critic & Continuous Control',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Haarnoja et al. 2018: Maximizing both expected return and policy entropy. Clipped double-Q trick and automatic temperature α tuning.',
//     explanation: `Roadmap outline for Day 20:
// - Maximum Entropy objective J(π) = E[ ∑ r + α H(π) ].
// - Soft Bellman backup equation.
// - Eliminating exploration hyperparameters through automatic entropy constraint optimization.`,
//     resources: [
//       { title: 'Soft Actor-Critic: Off-Policy Maximum Entropy Deep Reinforcement Learning with a Stochastic Actor (Haarnoja et al. 2018)', type: 'paper' }
//     ]
//   },
//   {
//     id: 'day-30',
//     dayNumber: 30,
//     date: '2026-03-30',
//     title: 'Milestone 1 Retrospective & Rainbow DQN Integration',
//     phase: 'Value Function Approx & DQN',
//     status: 'planned',
//     isStarred: false,
//     summary: 'Combining all 6 DQN extensions into Rainbow: Double Q, Dueling, Prioritized Replay, Multi-step, Distributional (C51), and Noisy Networks.',
//     explanation: `Consolidating 30 days of foundational and value-based reinforcement learning into a single benchmark implementation.`,
//     keyInsights: ['Ablation studies reveal PER and Distributional RL yield the largest individual gains.'],
//     resources: [{ title: 'Rainbow: Combining Improvements in Deep Reinforcement Learning (Hessel et al. 2017)', type: 'paper' }]
//   },
//   {
//     id: 'day-50',
//     dayNumber: 50,
//     date: '2026-04-19',
//     title: 'Model-Based RL: Dyna-Q and Learned Environment Dynamics',
//     phase: 'Model-Based RL & Planning',
//     status: 'planned',
//     isStarred: false,
//     summary: 'Sutton\'s Dyna architecture: interleaving real-world experience, model learning, and simulated planning updates for 10x sample efficiency.',
//     explanation: `Examining the boundary where model-free RL and classical optimal control merge.`,
//     keyInsights: ['Model bias can cause catastrophic exploitation unless uncertainty is estimated.'],
//     resources: [{ title: 'Model-Based Reinforcement Learning: A Survey (Polydoros & Nalpantidis)', type: 'paper' }]
//   },
//   {
//     id: 'day-75',
//     dayNumber: 75,
//     date: '2026-05-14',
//     title: 'World Models, Dreamer & Latent Space Planning',
//     phase: 'Model-Based RL & Planning',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Ha & Schmidhuber (2018) and Danijar Hafner\'s Dreamer: learning Recurrent State Space Models (RSSM) and training actors entirely inside imagined rollouts.',
//     explanation: `Deep dive into modern visual model-based RL where agents imagine millions of trajectories in latent space without environment interactions.`,
//     keyInsights: ['Latent space imagination circumvents pixel reconstruction bottlenecks.'],
//     resources: [{ title: 'Mastering Diverse Domains through World Models (Hafner et al., DreamerV3 2023)', type: 'paper' }]
//   },
//   {
//     id: 'day-90',
//     dayNumber: 90,
//     date: '2026-05-29',
//     title: 'RLHF & Alignment: Bradley-Terry Preference Models & PPO for LLMs',
//     phase: 'RLHF, Alignment & Frontiers',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Reinforcement Learning from Human Feedback (RLHF): training reward models on human pairwise comparisons and aligning autoregressive language models with KL penalty.',
//     explanation: `Investigating the RL methodology powering modern AI alignment:
// 1. Supervised Fine-Tuning (SFT)
// 2. Reward Modeling with Bradley-Terry loss
// 3. PPO policy optimization with KL divergence penalty to avoid reward hacking.`,
//     keyInsights: ['The KL penalty D_{KL}(π_θ || π_{ref}) acts as an essential trust region anchor.'],
//     resources: [{ title: 'Training language models to follow instructions with human feedback (InstructGPT, Ouyang et al. 2022)', type: 'paper' }]
//   },
//   {
//     id: 'day-100',
//     dayNumber: 100,
//     date: '2026-06-08',
//     title: 'Direct Preference Optimization (DPO) & The Future of Reinforcement Learning',
//     phase: 'RLHF, Alignment & Frontiers',
//     status: 'planned',
//     isStarred: true,
//     summary: 'Rafailov et al. 2023: Bypassing the reward model and PPO loop entirely. Grand retrospective on 100 Days of Reinforcement Learning.',
//     explanation: `Culmination of 100 Days of RL! 
// Deriving how the optimal policy π* in RLHF can be solved analytically to express the reward function purely in terms of policy probabilities, transforming the RL alignment loop into a closed-form binary cross-entropy loss!
// Full synthesis of what was learned over 100 days across theory, practice, and code.`,
//     keyInsights: [
//       'DPO proves that under a Bradley-Terry model, the RL policy optimization problem has an exact dual representation.',
//       'The journey from Bellman 1957 to modern LLM alignment.'
//     ],
//     resources: [{ title: 'Direct Preference Optimization: Your Language Model is Secretly a Reward Model (Rafailov et al. 2023)', type: 'paper' }]
//   }
];