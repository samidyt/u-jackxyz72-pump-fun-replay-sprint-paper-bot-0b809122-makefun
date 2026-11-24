// Pump.fun Replay Sprint — Paper Bot, Real Ranking (make.fun entry).
//
// Entrypoint: the grader runs `node /bot/main.ts` (Node 22.18+, standard library only, no
// network). The bot reads the replay batches from stdin and answers with orders on stdout;
// the SDK shim in vendor/ handles the wire protocol. The strategy lives in strategy.ts — a
// momentum breakout bot on bonding curves, with mechanical exits and guardrail probes.
// Tuned on the full dev window: -0.21 SOL mean net PnL (worst draw -0.22), 398 fills /
// 120 coins — guardrails met, net negative, so no paid place on dev data.
// See STRATEGY.md for the sweep and the sim-subset caveat.

import { runBot } from './vendor/makefun-bot.ts';
import { createStrategy, DEFAULT_PARAMS } from './strategy.ts';

// Deterministic by construction: no clock, no randomness — two executions produce
// byte-identical action logs, as the protocol requires.
await runBot(createStrategy(DEFAULT_PARAMS));
