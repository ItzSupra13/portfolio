/**
 * Pure mathematical economics engine for:
 * "Understanding AI Layoffs Using Game Theory: From First Principles to the Demand Trap"
 *
 * Covers:
 * - Module 1 & 2: Discrete Toy Coin Economy & 2x2 Payoff Matrix
 * - Module 3: Falk & Tsoukalas (2026) continuous equilibrium & Over-Automation Wedge
 * - Module 4: Red Queen market-share stealing equilibrium
 * - Module 5: Pal & Park (2026) Bayesian signaling collapse & Qiu, Yu & Xu (2026) contest phase transition
 * - Module 6: Policy Stress-Test comparative statics
 */

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/* ============================================================================
 * MODULE 1 & 2: THE TOY COIN ECONOMY (N=2, L=10, w=10, c=4, λ=0.8, A0=120)
 * ========================================================================== */

export interface ToyEconomyParams {
  N: number;         // Number of companies (default 2)
  L: number;         // Workers per company (default 10)
  w: number;         // Wage per worker in coins (default 10)
  c: number;         // AI cost per automated task in coins (default 4)
  lambda: number;    // Marginal propensity to spend in sector (default 0.8)
  outsideDemand: number; // Autonomous outside spending A0 (default 120)
}

export const DEFAULT_TOY_PARAMS: ToyEconomyParams = {
  N: 2,
  L: 10,
  w: 10,
  c: 4,
  lambda: 0.8,
  outsideDemand: 120,
};

export interface ToyFirmResult {
  workersEmployed: number;
  tasksAutomated: number;
  wageBill: number;
  aiSpend: number;
  totalCost: number;
  revenue: number;
  profit: number;
}

export interface ToyEconomyOutcome {
  firmA: ToyFirmResult;
  firmB: ToyFirmResult;
  totalWages: number;
  workerSpending: number;
  totalPoolZ: number;
  collectiveProfit: number;
  totalWorkersEmployed: number;
  totalLaidOff: number;
  savingsPerTask: number; // s = w - c
  lostDemandPerTask: number; // ℓ = λ * w
  privateNetGainPerTask: number; // s - ℓ/N
}

export function evaluateToyEconomy(
  automateA: boolean,
  automateB: boolean,
  params: ToyEconomyParams = DEFAULT_TOY_PARAMS,
  automationShare = 0.5
): ToyEconomyOutcome {
  const { N, L, w, c, lambda, outsideDemand } = params;
  const alphaA = automateA ? automationShare : 0;
  const alphaB = automateB ? automationShare : 0;

  const tasksA = Math.round(L * alphaA);
  const tasksB = Math.round(L * alphaB);
  const workersA = L - tasksA;
  const workersB = L - tasksB;

  const wageBillA = workersA * w;
  const wageBillB = workersB * w;
  const aiSpendA = tasksA * c;
  const aiSpendB = tasksB * c;
  const costA = wageBillA + aiSpendA;
  const costB = wageBillB + aiSpendB;

  const totalWages = wageBillA + wageBillB;
  const workerSpending = lambda * totalWages;
  const totalPoolZ = outsideDemand + workerSpending;

  const revenueEach = totalPoolZ / N;
  const profitA = revenueEach - costA;
  const profitB = revenueEach - costB;

  const savingsPerTask = w - c;
  const lostDemandPerTask = lambda * w;
  const privateNetGainPerTask = savingsPerTask - lostDemandPerTask / N;

  return {
    firmA: {
      workersEmployed: workersA,
      tasksAutomated: tasksA,
      wageBill: wageBillA,
      aiSpend: aiSpendA,
      totalCost: costA,
      revenue: revenueEach,
      profit: profitA,
    },
    firmB: {
      workersEmployed: workersB,
      tasksAutomated: tasksB,
      wageBill: wageBillB,
      aiSpend: aiSpendB,
      totalCost: costB,
      revenue: revenueEach,
      profit: profitB,
    },
    totalWages,
    workerSpending,
    totalPoolZ,
    collectiveProfit: profitA + profitB,
    totalWorkersEmployed: workersA + workersB,
    totalLaidOff: tasksA + tasksB,
    savingsPerTask,
    lostDemandPerTask,
    privateNetGainPerTask,
  };
}

export interface PayoffMatrixCell {
  key: 'HH' | 'HA' | 'AH' | 'AA';
  aAction: 'Hold' | 'Automate';
  bAction: 'Hold' | 'Automate';
  profitA: number;
  profitB: number;
  collectiveProfit: number;
  totalPoolZ: number;
  totalLaidOff: number;
  isNash: boolean;
  isParetoOptimal: boolean;
}

export function buildToyPayoffMatrix(params: ToyEconomyParams = DEFAULT_TOY_PARAMS): Record<PayoffMatrixCell['key'], PayoffMatrixCell> {
  const hh = evaluateToyEconomy(false, false, params);
  const ha = evaluateToyEconomy(false, true, params);
  const ah = evaluateToyEconomy(true, false, params);
  const aa = evaluateToyEconomy(true, true, params);

  return {
    HH: {
      key: 'HH',
      aAction: 'Hold',
      bAction: 'Hold',
      profitA: hh.firmA.profit,
      profitB: hh.firmB.profit,
      collectiveProfit: hh.collectiveProfit,
      totalPoolZ: hh.totalPoolZ,
      totalLaidOff: hh.totalLaidOff,
      isNash: false,
      isParetoOptimal: true,
    },
    HA: {
      key: 'HA',
      aAction: 'Hold',
      bAction: 'Automate',
      profitA: ha.firmA.profit,
      profitB: ha.firmB.profit,
      collectiveProfit: ha.collectiveProfit,
      totalPoolZ: ha.totalPoolZ,
      totalLaidOff: ha.totalLaidOff,
      isNash: false,
      isParetoOptimal: false,
    },
    AH: {
      key: 'AH',
      aAction: 'Automate',
      bAction: 'Hold',
      profitA: ah.firmA.profit,
      profitB: ah.firmB.profit,
      collectiveProfit: ah.collectiveProfit,
      totalPoolZ: ah.totalPoolZ,
      totalLaidOff: ah.totalLaidOff,
      isNash: false,
      isParetoOptimal: false,
    },
    AA: {
      key: 'AA',
      aAction: 'Automate',
      bAction: 'Automate',
      profitA: aa.firmA.profit,
      profitB: aa.firmB.profit,
      collectiveProfit: aa.collectiveProfit,
      totalPoolZ: aa.totalPoolZ,
      totalLaidOff: aa.totalLaidOff,
      isNash: true,
      isParetoOptimal: false,
    },
  };
}

/* ============================================================================
 * MODULE 3: FALK & TSOUKALAS (2026) CONTINUOUS AI LAYOFF TRAP MODEL
 * Baseline from alphaXiv breakdown: c=0.30, λ=0.50, η=0.30, N=7, k=1.0, A=10, w=1, L=1
 * ========================================================================== */

export interface FalkModelParams {
  N: number;       // Number of symmetric competing firms (1..25)
  k: number;       // Convex integration friction cost (> 0)
  eta: number;     // Displaced worker income reabsorption fraction [0, 1]
  lambda: number;  // Marginal propensity to spend inside sector [0, 1]
  w: number;       // Normalized wage (default 1.0)
  c: number;       // AI cost per task (default 0.30)
  A: number;       // Autonomous outside demand (default 10)
  L: number;       // Normalized workforce per firm (default 1)
}

export const DEFAULT_FALK_PARAMS: FalkModelParams = {
  N: 7,
  k: 1.0,
  eta: 0.30,
  lambda: 0.50,
  w: 1.0,
  c: 0.30,
  A: 10.0,
  L: 1.0,
};

export const FALK_PRESETS: Record<string, { label: string; description: string; params: FalkModelParams }> = {
  baseline: {
    label: 'Paper Baseline (N = 7)',
    description: 'Falk & Tsoukalas baseline parameters: interior Nash & Cooperative equilibria with a clear 0.30 wedge.',
    params: { ...DEFAULT_FALK_PARAMS },
  },
  severeTrap: {
    label: 'Severe Demand Trap',
    description: 'High spending sensitivity (λ = 0.85, c = 0.45): socially optimal automation is 0%, yet rivals still automate aggressively.',
    params: { N: 7, k: 0.8, eta: 0.20, lambda: 0.85, w: 1.0, c: 0.45, A: 10.0, L: 1.0 },
  },
  monopoly: {
    label: 'Monopoly (N = 1)',
    description: 'Single firm internalizes 100% of demand loss; the Over-Automation Wedge vanishes completely.',
    params: { ...DEFAULT_FALK_PARAMS, N: 1 },
  },
  frictionless: {
    label: 'Near-Frictionless (k = 0.25)',
    description: 'Low integration friction pushes Nash automation to the corner (100%), maximizing demand collapse.',
    params: { N: 7, k: 0.25, eta: 0.25, lambda: 0.75, w: 1.0, c: 0.40, A: 10.0, L: 1.0 },
  },
};

export interface FalkEquilibriumResult {
  s: number;                  // Direct cost saving per task: w - c
  ell: number;                // Demand lost per displaced worker: λ(1 - η)w
  alphaNashUnclipped: number; // (s - ℓ/N) / k
  alphaCoopUnclipped: number; // (s - ℓ) / k
  alphaNash: number;          // Clipped to [0, 1]
  alphaCoop: number;          // Clipped to [0, 1]
  wedgeTheoretical: number;   // ℓ(1 - 1/N) / k
  wedgeActual: number;        // alphaNash - alphaCoop
  triggerThresholdN: number;  // ℓ / s
  automationTriggered: boolean; // N > ℓ / s (when s > 0)
  demandAtNash: number;       // D(α_Nash)
  demandAtCoop: number;       // D(α_Coop)
  jointProfitNash: number;    // K(α_Nash)
  jointProfitCoop: number;    // K(α_Coop)
  profitLossFromTrap: number; // K(α_Coop) - K(α_Nash) >= 0
  externalityShareIgnored: number; // 1 - 1/N
}

export function computeAggregateDemand(alphaSymmetric: number, p: FalkModelParams): number {
  const sumAlpha = p.N * alphaSymmetric;
  return p.A + p.lambda * p.w * p.L * (p.N - (1 - p.eta) * sumAlpha);
}

export function computeJointProfit(alphaSymmetric: number, p: FalkModelParams): number {
  const s = p.w - p.c;
  const D = computeAggregateDemand(alphaSymmetric, p);
  const totalCost = p.N * p.L * (p.w - s * alphaSymmetric + 0.5 * p.k * alphaSymmetric * alphaSymmetric);
  return D - totalCost;
}

export function solveFalkModel(p: FalkModelParams, automationTax = 0): FalkEquilibriumResult {
  const s = p.w - p.c;
  const ell = p.lambda * (1 - p.eta) * p.w;
  const safeK = Math.max(p.k, 0.01);

  const alphaNashUnclipped = (s - automationTax - ell / p.N) / safeK;
  const alphaCoopUnclipped = (s - ell) / safeK;

  const alphaNash = clamp(alphaNashUnclipped, 0, 1);
  const alphaCoop = clamp(alphaCoopUnclipped, 0, 1);

  const wedgeTheoretical = (ell * (1 - 1 / p.N)) / safeK;
  const wedgeActual = alphaNash - alphaCoop;
  const triggerThresholdN = s > 0 ? ell / s : Infinity;
  const automationTriggered = s > 0 && p.N > triggerThresholdN;

  const demandAtNash = computeAggregateDemand(alphaNash, p);
  const demandAtCoop = computeAggregateDemand(alphaCoop, p);
  // Note: joint profit measures real economic surplus before tax transfer (tax is redistributed/neutral)
  const jointProfitNash = computeJointProfit(alphaNash, p);
  const jointProfitCoop = computeJointProfit(alphaCoop, p);

  return {
    s,
    ell,
    alphaNashUnclipped,
    alphaCoopUnclipped,
    alphaNash,
    alphaCoop,
    wedgeTheoretical,
    wedgeActual,
    triggerThresholdN,
    automationTriggered,
    demandAtNash,
    demandAtCoop,
    jointProfitNash,
    jointProfitCoop,
    profitLossFromTrap: Math.max(0, jointProfitCoop - jointProfitNash),
    externalityShareIgnored: 1 - 1 / p.N,
  };
}

/* ============================================================================
 * MODULE 4: THE RED QUEEN EFFECT (Market-Share Stealing as AI Capability Rises)
 * ========================================================================== */

export interface RedQueenPoint {
  capability: number;       // q ∈ [0, 1]
  alphaNash: number;        // Symmetric equilibrium automation with market-share stealing
  alphaCoop: number;        // Cooperative optimum at capability q
  jointProfitNash: number;  // Total industry profit K(α_Nash)
  jointProfitCoop: number;  // Total industry profit K(α_Coop)
  demandNash: number;       // Remaining aggregate demand D(α_Nash)
}

export interface RedQueenResult {
  points: RedQueenPoint[];
  peakProfitCapability: number;
  peakProfit: number;
  endProfit: number;
  profitDropFromPeak: number;
}

/**
 * Models AI capability q ∈ [0, 1]:
 * - AI task cost declines: c(q) = cBase * (1 - 0.65 * q)
 * - Market-share stealing sensitivity rises: β(q) = marketShareSensitivity * q
 * Firm i's market share: S_i(α_i, α_{-i}) = 1/N + (β(q)/N) * (α_i - ᾱ_{-i})
 * FOC at symmetric equilibrium α_i = ᾱ = α:
 *   (β(q)/N) * D(α) - (ℓ*L)/N + s(q)*L - k*L*α = 0
 * where D(α) = A + λ*w*L*N - N*ℓ*L*α.
 * Substituting D(α) gives closed-form linear equation in α:
 *   α * [k*L + β(q)*ℓ*L] = s(q)*L - (ℓ*L)/N + (β(q)/N)*(A + λ*w*L*N)
 */
export function computeRedQueenCurve(
  marketShareSensitivity: number,
  baseParams: FalkModelParams = DEFAULT_FALK_PARAMS,
  steps = 40
): RedQueenResult {
  const N = Math.max(2, baseParams.N);
  const { eta, lambda, w, A, L } = baseParams;
  const k = Math.max(baseParams.k, 1.25);
  const ell = lambda * (1 - eta) * w;
  const d0 = A + lambda * w * L * N;

  const points: RedQueenPoint[] = [];
  let peakProfit = -Infinity;
  let peakProfitCapability = 0;

  for (let i = 0; i <= steps; i++) {
    const q = i / steps;
    // q=0 starts at socially break-even AI (s = ℓ); early gains lift profit smoothly before saturating near 0.86w
    const sStart = Math.min(ell, 0.5 * w);
    const sq = sStart + (0.86 * w - sStart) * (1 - Math.exp(-5.2 * q));
    const cq = w - sq;
    // Red Queen market-share stealing intensifies nonlinearly once AI reaches full-workflow capability
    const betaQ = marketShareSensitivity * Math.pow(q, 2.3);

    const numerator = sq * L - (ell * L) / N + (betaQ / N) * d0;
    const denominator = k * L + betaQ * ell * L;
    const alphaNash = clamp(numerator / Math.max(denominator, 0.01), 0, 1);
    const alphaCoop = clamp((sq - ell) / Math.max(k, 0.01), 0, 1);

    const pQ: FalkModelParams = {
      N,
      k,
      eta,
      lambda,
      w,
      c: cq,
      A,
      L,
    };

    const jointProfitNash = computeJointProfit(alphaNash, pQ);
    const jointProfitCoop = computeJointProfit(alphaCoop, pQ);
    const demandNash = computeAggregateDemand(alphaNash, pQ);

    if (jointProfitNash > peakProfit) {
      peakProfit = jointProfitNash;
      peakProfitCapability = q;
    }

    points.push({
      capability: q,
      alphaNash,
      alphaCoop,
      jointProfitNash,
      jointProfitCoop,
      demandNash,
    });
  }

  const endProfit = points[points.length - 1].jointProfitNash;

  return {
    points,
    peakProfitCapability,
    peakProfit,
    endProfit,
    profitDropFromPeak: Math.max(0, peakProfit - endProfit),
  };
}

/* ============================================================================
 * MODULE 5: HIRING SIGNALING COLLAPSE (Pal & Park) & EFFORT CONTEST (Qiu, Yu & Xu)
 * ========================================================================== */

export interface SignalingParams {
  A: number;             // Recruiter value per unit visible resume output y
  B: number;             // Recruiter value of true deep mastery u = 1
  r: number;             // Recruiter reservation payoff (outside option / don't hire)
  resumeOutputY: 1 | 2;  // Standard AI resume (y=1) vs Super-Output AI resume (y=2)
}

export interface SignalingResult {
  collapseThresholdA: number;  // r / y (r for y=1, r/2 for y=2)
  shallowPayoff: number;       // A * y
  deepPayoff: number;          // A * y + B
  isE1Collapse: boolean;       // A * y < r (nobody gets hired in pooling E1)
  regimeLabel: string;
}

export function evaluateSignalingGame(p: SignalingParams): SignalingResult {
  const collapseThresholdA = p.r / p.resumeOutputY;
  const shallowPayoff = p.A * p.resumeOutputY;
  const deepPayoff = p.A * p.resumeOutputY + p.B;
  const isE1Collapse = shallowPayoff < p.r;

  let regimeLabel = 'Hiring Viable (Pooling Still Profitable)';
  if (isE1Collapse) {
    regimeLabel = 'Equilibrium E1: Hiring Freeze Collapse';
  }

  return {
    collapseThresholdA,
    shallowPayoff,
    deepPayoff,
    isE1Collapse,
    regimeLabel,
  };
}

export interface ContestResult {
  gamma: number;
  gammaLow: number;     // Lower threshold γ̲ (below this: strict separation)
  gammaHigh: number;    // Upper threshold γ̄ (above this: complete pooling)
  regime: 'separation' | 'partial' | 'pooling';
  regimeLabel: string;
  creativeEffortHigh: number;    // a_H
  mechanisticEffortHigh: number; // b_H
  creativeEffortMid: number;     // a_M
  mechanisticEffortMid: number;  // b_M
  outputHigh: number;            // μ_H
  outputMid: number;             // μ_M
  separationGap: number;         // μ_H - μ_M
  inducedEta: number;            // Feedback into Module 3 reabsorption η
}

export const CONTEST_THRESHOLDS = {
  gammaLow: 0.35,
  gammaHigh: 0.72,
} as const;

export function evaluateEffortContest(gammaRaw: number): ContestResult {
  const gamma = clamp(gammaRaw, 0, 1);
  const { gammaLow, gammaHigh } = CONTEST_THRESHOLDS;

  // Normalized effort budget = 1. Below gammaLow, high-ability worker invests heavily in creative effort a_H.
  // Between gammaLow and gammaHigh, both substitute smoothly toward AI-assisted mechanistic effort b.
  // Above gammaHigh, complete pooling: both rely fully on mechanistic AI output, erasing observable ability gaps.
  let t = 0;
  let regime: ContestResult['regime'] = 'separation';
  let regimeLabel = 'Strict Separation (Talent Visible)';

  if (gamma <= gammaLow) {
    t = 0;
    regime = 'separation';
    regimeLabel = 'Strict Separation (Talent Visible)';
  } else if (gamma < gammaHigh) {
    t = (gamma - gammaLow) / (gammaHigh - gammaLow);
    regime = 'partial';
    regimeLabel = 'Partial Compression (Substitution Zone)';
  } else {
    t = 1;
    regime = 'pooling';
    regimeLabel = 'Complete Pooling (Output Indistinguishable)';
  }

  const creativeEffortHigh = 0.85 * (1 - t);
  const mechanisticEffortHigh = 1 - creativeEffortHigh;
  const creativeEffortMid = 0.45 * (1 - t);
  const mechanisticEffortMid = 1 - creativeEffortMid;

  // μ_i = ν(a_i, θ_i) + ξ(b_i, γ)
  const thetaHigh = 1.35;
  const thetaMid = 0.75;
  const aiBoost = 0.35 + 0.95 * gamma;

  const outputHigh = thetaHigh * creativeEffortHigh + aiBoost * mechanisticEffortHigh;
  const outputMid = thetaMid * creativeEffortMid + aiBoost * mechanisticEffortMid;
  const separationGap = Math.max(0, outputHigh - outputMid);

  // Feedback into Module 3 reabsorption η: as signaling & contest differentiation collapse,
  // hiring freezes intensify and displaced workers' reabsorption rate η falls from ~0.58 down to ~0.12.
  const inducedEta = Number((0.58 - 0.46 * Math.pow(gamma, 1.35)).toFixed(2));

  return {
    gamma,
    gammaLow,
    gammaHigh,
    regime,
    regimeLabel,
    creativeEffortHigh,
    mechanisticEffortHigh,
    creativeEffortMid,
    mechanisticEffortMid,
    outputHigh,
    outputMid,
    separationGap,
    inducedEta,
  };
}

/* ============================================================================
 * MODULE 6: POLICY STRESS-TEST ENGINE
 * ========================================================================== */

export type PolicyId = 'none' | 'ubi' | 'profitTax' | 'upskilling' | 'equityPact' | 'pigouvian';

export interface PolicyEvaluation {
  id: PolicyId;
  name: string;
  shortName: string;
  focLatex: string;
  derivativeVerdict: string;
  plainExplanation: string;
  effectiveParams: FalkModelParams;
  automationTax: number;
  equilibrium: FalkEquilibriumResult;
  closesWedge: 'none' | 'partial' | 'full';
  wedgeReductionPct: number;
}

export function evaluatePolicy(
  policyId: PolicyId,
  baseParams: FalkModelParams
): PolicyEvaluation {
  const baseEq = solveFalkModel(baseParams, 0);
  const baseWedge = Math.max(baseEq.wedgeActual, 0);

  switch (policyId) {
    case 'none': {
      return {
        id: 'none',
        name: 'No Policy Intervention (Baseline)',
        shortName: 'Baseline',
        focLatex: `\\frac{\\partial \\pi_i}{\\partial \\textcolor{#4F46E5}{\\alpha_i}} = s - \\frac{\\textcolor{#DC2626}{\\ell}}{\\textcolor{#0F766E}{N}} - \\textcolor{#B45309}{k}\\textcolor{#4F46E5}{\\alpha_i} = 0`,
        derivativeVerdict: 'Baseline externality unpriced',
        plainExplanation:
          'Each firm internalizes only 1/N of the demand destruction it causes, leaving the full Over-Automation Wedge open.',
        effectiveParams: baseParams,
        automationTax: 0,
        equilibrium: baseEq,
        closesWedge: 'none',
        wedgeReductionPct: 0,
      };
    }

    case 'ubi': {
      // UBI adds constant +U to autonomous demand A. ∂(A + U)/∂α_i = 0!
      const effectiveParams: FalkModelParams = { ...baseParams, A: baseParams.A + 4.0 };
      const eq = solveFalkModel(effectiveParams, 0);
      return {
        id: 'ubi',
        name: 'Universal Basic Income (UBI)',
        shortName: 'UBI (+ΔA)',
        focLatex: `\\frac{\\partial}{\\partial \\textcolor{#4F46E5}{\\alpha_i}}\\left(\\frac{A + U}{\\textcolor{#0F766E}{N}}\\right) = \\mathbf{0} \\implies s - \\frac{\\textcolor{#DC2626}{\\ell}}{\\textcolor{#0F766E}{N}} - \\textcolor{#B45309}{k}\\textcolor{#4F46E5}{\\alpha_i} = 0`,
        derivativeVerdict: '∂U / ∂α_i = 0 — Drops out of the FOC completely',
        plainExplanation:
          'UBI lifts total demand A + U and cushions household welfare, which is valuable socially—but because a lump-sum transfer does not depend on firm i’s layoff choice α_i, its derivative with respect to α_i is identically zero. Equilibrium layoffs do not budge.',
        effectiveParams,
        automationTax: 0,
        equilibrium: eq,
        closesWedge: 'none',
        wedgeReductionPct: 0,
      };
    }

    case 'profitTax': {
      // Corporate profit tax multiplies profit by (1 - τ). Cancels out of FOC = 0!
      const eq = solveFalkModel(baseParams, 0);
      return {
        id: 'profitTax',
        name: 'Corporate Profit / Capital Tax (τ = 35%)',
        shortName: 'Profit Tax (τ)',
        focLatex: `(1 - \\tau)\\frac{\\partial \\pi_i}{\\partial \\textcolor{#4F46E5}{\\alpha_i}} = 0 \\iff s - \\frac{\\textcolor{#DC2626}{\\ell}}{\\textcolor{#0F766E}{N}} - \\textcolor{#B45309}{k}\\textcolor{#4F46E5}{\\alpha_i} = 0`,
        derivativeVerdict: '(1 − τ) cancels out — Zero shift on the margin',
        plainExplanation:
          'A proportional tax on net profits scales the entire profit function by (1 − τ). Setting the derivative to zero divides both sides by (1 − τ) > 0, leaving the firm’s optimal automation fraction α_Nash completely unchanged.',
        effectiveParams: baseParams,
        automationTax: 0,
        equilibrium: eq,
        closesWedge: 'none',
        wedgeReductionPct: 0,
      };
    }

    case 'upskilling': {
      // Upskilling lifts reabsorption η by +0.30 (capped at 0.90), shrinking ℓ = λ(1-η)w
      const boostedEta = clamp(baseParams.eta + 0.30, 0, 0.90);
      const effectiveParams: FalkModelParams = { ...baseParams, eta: boostedEta };
      const eq = solveFalkModel(effectiveParams, 0);
      const reduction =
        baseWedge > 1e-6 ? clamp(((baseWedge - eq.wedgeActual) / baseWedge) * 100, 0, 100) : 0;
      return {
        id: 'upskilling',
        name: `Upskilling & Retraining (η → ${boostedEta.toFixed(2)})`,
        shortName: 'Upskilling (+Δη)',
        focLatex: `\\textcolor{#DC2626}{\\ell}(\\textcolor{#059669}{\\eta'}) = \\lambda(1 - \\textcolor{#059669}{\\eta'})w < \\textcolor{#DC2626}{\\ell} \\implies \\Delta\\textcolor{#4F46E5}{\\alpha} \\text{ shrinks, } > 0`,
        derivativeVerdict: 'Shrinks ℓ directly, but cannot zero the wedge unless η = 1',
        plainExplanation:
          'Faster job transitions raise η, directly lowering the lost sectoral demand per layoff ℓ = λ(1 − η)w. This genuinely narrows the Over-Automation Wedge—yet as long as any transition income gap remains (η < 1), firms still over-automate.',
        effectiveParams,
        automationTax: 0,
        equilibrium: eq,
        closesWedge: 'partial',
        wedgeReductionPct: reduction,
      };
    }

    case 'equityPact': {
      // Voluntary CEO pact / worker equity does not eliminate unilateral defection gain
      const eq = solveFalkModel(baseParams, 0);
      return {
        id: 'equityPact',
        name: 'Worker Equity & Voluntary CEO Pacts',
        shortName: 'Equity / Pacts',
        focLatex: `\\left.\\frac{\\partial \\pi_i}{\\partial \\textcolor{#4F46E5}{\\alpha_i}}\\right|_{\\alpha_{-i} = \\alpha^{\\text{Coop}}} = \\textcolor{#DC2626}{\\ell}\\!\\left(1 - \\frac{1}{\\textcolor{#0F766E}{N}}\\right) > 0`,
        derivativeVerdict: 'Positive unilateral deviation gradient — Pact breaks immediately',
        plainExplanation:
          'Granting workers equity in their own employer does not stop rival firms from eroding shared consumer demand. And a voluntary slowdown pact fails because at α = α_Coop, every firm still faces a strictly positive private incentive ℓ(1 − 1/N) > 0 to defect.',
        effectiveParams: baseParams,
        automationTax: 0,
        equilibrium: eq,
        closesWedge: 'none',
        wedgeReductionPct: 0,
      };
    }

    case 'pigouvian': {
      // Exact Pigouvian automation tax t* = ℓ(1 - 1/N)
      const ell = baseParams.lambda * (1 - baseParams.eta) * baseParams.w;
      const tStar = ell * (1 - 1 / baseParams.N);
      const eq = solveFalkModel(baseParams, tStar);
      return {
        id: 'pigouvian',
        name: `Pigouvian Automation Tax (t* = ${tStar.toFixed(3)})`,
        shortName: 'Pigouvian Tax (t*)',
        focLatex: `s - \\underbrace{\\textcolor{#DC2626}{\\ell}\\!\\left(1 - \\frac{1}{\\textcolor{#0F766E}{N}}\\right)}_{t^*} - \\frac{\\textcolor{#DC2626}{\\ell}}{\\textcolor{#0F766E}{N}} - \\textcolor{#B45309}{k}\\textcolor{#4F46E5}{\\alpha_i} = s - \\textcolor{#DC2626}{\\ell} - \\textcolor{#B45309}{k}\\textcolor{#4F46E5}{\\alpha_i} = 0`,
        derivativeVerdict: 'Enters FOC linearly — Collapses α_Nash identically to α_Coop',
        plainExplanation:
          'A per-displaced-task Pigouvian fee t* = ℓ(1 − 1/N) prices the exact demand externality firm i exports to its N − 1 rivals. Inside the first-order condition, −t* − ℓ/N collapses to −ℓ, aligning private incentives with joint optimality and closing the wedge to zero.',
        effectiveParams: baseParams,
        automationTax: tStar,
        equilibrium: eq,
        closesWedge: 'full',
        wedgeReductionPct: 100,
      };
    }
  }
}
