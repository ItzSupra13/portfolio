import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_TOY_PARAMS,
  DEFAULT_FALK_PARAMS,
  evaluateToyEconomy,
  buildToyPayoffMatrix,
  solveFalkModel,
  computeRedQueenCurve,
  evaluateSignalingGame,
  evaluateEffortContest,
  evaluatePolicy,
} from './economics';

test('Module 1: Toy economy coin accounting matches exact Prisoner Dilemma payoffs', () => {
  const hh = evaluateToyEconomy(false, false, DEFAULT_TOY_PARAMS);
  const ah = evaluateToyEconomy(true, false, DEFAULT_TOY_PARAMS);
  const ha = evaluateToyEconomy(false, true, DEFAULT_TOY_PARAMS);
  const aa = evaluateToyEconomy(true, true, DEFAULT_TOY_PARAMS);

  // Mutual Hold: Z = 280, profits = (40, 40)
  assert.equal(hh.totalPoolZ, 280);
  assert.equal(hh.firmA.profit, 40);
  assert.equal(hh.firmB.profit, 40);
  assert.equal(hh.collectiveProfit, 80);

  // Unilateral Defection by A: A rises 40 -> 50, B drops 40 -> 20, Z drops 280 -> 240
  assert.equal(ah.totalPoolZ, 240);
  assert.equal(ah.firmA.profit, 50);
  assert.equal(ah.firmB.profit, 20);
  assert.ok(ah.firmA.profit > hh.firmA.profit);
  assert.ok(ah.firmB.profit < hh.firmB.profit);

  // Symmetry
  assert.equal(ha.firmA.profit, 20);
  assert.equal(ha.firmB.profit, 50);

  // Mutual Automation: both drop to 30 < 40, Z collapses to 200
  assert.equal(aa.totalPoolZ, 200);
  assert.equal(aa.firmA.profit, 30);
  assert.equal(aa.firmB.profit, 30);
  assert.ok(aa.firmA.profit > ha.firmA.profit); // Strictly dominant to automate when rival automates
  assert.ok(aa.firmA.profit < hh.firmA.profit); // Pareto dominated by mutual restraint
});

test('Module 2: Payoff matrix identifies (Automate, Automate) as Nash and (Hold, Hold) as Pareto-optimal', () => {
  const matrix = buildToyPayoffMatrix(DEFAULT_TOY_PARAMS);
  assert.equal(matrix.AA.isNash, true);
  assert.equal(matrix.AA.isParetoOptimal, false);
  assert.equal(matrix.HH.isNash, false);
  assert.equal(matrix.HH.isParetoOptimal, true);
  assert.equal(matrix.AH.profitA, 50);
  assert.equal(matrix.AH.profitB, 20);
});

test('Module 3: Falk & Tsoukalas FOCs and Over-Automation Wedge exact identities', () => {
  const res = solveFalkModel(DEFAULT_FALK_PARAMS);
  // s = 0.70, ell = 0.5 * 0.7 * 1 = 0.35, N = 7, k = 1
  assert.ok(Math.abs(res.s - 0.70) < 1e-9);
  assert.ok(Math.abs(res.ell - 0.35) < 1e-9);
  assert.ok(Math.abs(res.alphaCoop - 0.35) < 1e-9);
  assert.ok(Math.abs(res.alphaNash - 0.65) < 1e-9);
  assert.ok(Math.abs(res.wedgeActual - 0.30) < 1e-9);
  assert.ok(Math.abs(res.wedgeTheoretical - 0.30) < 1e-9);
  assert.ok(res.jointProfitCoop > res.jointProfitNash);

  // Monopoly (N=1) eliminates the wedge identically
  const mono = solveFalkModel({ ...DEFAULT_FALK_PARAMS, N: 1 });
  assert.ok(Math.abs(mono.wedgeTheoretical) < 1e-9);
  assert.ok(Math.abs(mono.alphaNash - mono.alphaCoop) < 1e-9);
  assert.ok(Math.abs(mono.profitLossFromTrap) < 1e-9);

  // Trigger threshold N > ell / s
  const highEll = solveFalkModel({ ...DEFAULT_FALK_PARAMS, c: 0.70, lambda: 0.80, eta: 0.0, N: 2 });
  // s = 0.30, ell = 0.80 => trigger N = 2.667, so N=2 does not trigger automation!
  assert.equal(highEll.automationTriggered, false);
  assert.equal(highEll.alphaNash, 0);
});

test('Module 4: Red Queen curve peaks and declines as AI capability triggers market-share arms race', () => {
  const rq = computeRedQueenCurve(0.28, DEFAULT_FALK_PARAMS, 40);
  assert.equal(rq.points.length, 41);
  assert.ok(rq.peakProfitCapability > 0 && rq.peakProfitCapability < 1);
  assert.ok(rq.profitDropFromPeak > 0);
  const last = rq.points[rq.points.length - 1];
  assert.ok(last.alphaNash > last.alphaCoop);
});

test('Module 5: Pal & Park super-output halves threshold; Qiu-Yu-Xu transitions to complete pooling', () => {
  const std = evaluateSignalingGame({ A: 0.6, B: 1.0, r: 1.0, resumeOutputY: 1 });
  const sup = evaluateSignalingGame({ A: 0.6, B: 1.0, r: 1.0, resumeOutputY: 2 });
  assert.equal(std.collapseThresholdA, 1.0);
  assert.equal(sup.collapseThresholdA, 0.5);
  assert.equal(std.isE1Collapse, true);
  assert.equal(sup.isE1Collapse, false);

  const lowG = evaluateEffortContest(0.2);
  const midG = evaluateEffortContest(0.5);
  const highG = evaluateEffortContest(0.85);
  assert.equal(lowG.regime, 'separation');
  assert.equal(midG.regime, 'partial');
  assert.equal(highG.regime, 'pooling');
  assert.ok(lowG.separationGap > 0.2);
  assert.ok(Math.abs(highG.separationGap) < 1e-9);
  assert.ok(highG.inducedEta < lowG.inducedEta);
});

test('Module 6: Policy Stress-Test confirms UBI & Profit Tax leave α_Nash unchanged while Pigouvian tax closes wedge', () => {
  const base = evaluatePolicy('none', DEFAULT_FALK_PARAMS);
  const ubi = evaluatePolicy('ubi', DEFAULT_FALK_PARAMS);
  const tax = evaluatePolicy('profitTax', DEFAULT_FALK_PARAMS);
  const upskill = evaluatePolicy('upskilling', DEFAULT_FALK_PARAMS);
  const pigouvian = evaluatePolicy('pigouvian', DEFAULT_FALK_PARAMS);

  assert.equal(ubi.equilibrium.alphaNash, base.equilibrium.alphaNash);
  assert.equal(tax.equilibrium.alphaNash, base.equilibrium.alphaNash);
  assert.ok(upskill.equilibrium.wedgeActual < base.equilibrium.wedgeActual);
  assert.ok(upskill.equilibrium.wedgeActual > 0);
  assert.ok(Math.abs(pigouvian.equilibrium.alphaNash - pigouvian.equilibrium.alphaCoop) < 1e-9);
  assert.ok(Math.abs(pigouvian.equilibrium.wedgeActual) < 1e-9);
  assert.equal(pigouvian.wedgeReductionPct, 100);
});
