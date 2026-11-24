# Pump.fun Replay Sprint — Paper Bot, Real Ranking

[![make.fun](https://make.fun/badge/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122.svg)](https://make.fun/bounty/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122)
[![rank](https://make.fun/badge/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122/samidyt/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122-makefun/rank.svg)](https://make.fun/bounty/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122/leaderboard)
[![reward](https://make.fun/badge/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122/samidyt/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122-makefun/reward.svg)](https://make.fun/bounty/u-jackxyz72-pump-fun-replay-sprint-paper-bot-0b809122)

A momentum breakout bot that trades 10 SOL of paper money on a 24h pump.fun replay
(`agent-fun/replay/v2`, Node 22, standard library only). The entrypoint is `main.ts`; the
strategy lives in `strategy.ts` — see [STRATEGY.md](STRATEGY.md) for the design.

## How it trades

- **Entries:** mature curves (≥300 slots old, 1–80 real SOL) whose last 60 slots show
  accelerating net buy inflow (≥0.3 SOL) from ≥5 distinct buyers, price up ≥10% and within
  4% of its window high, with no single wallet over 60% of the buys.
- **Sizing:** first buy 0.1 SOL, pyramid adds of 0.2 SOL into strength up to 1.0 SOL per coin,
  at most 5 positions, at most 6 SOL at cost across the book.
- **Exits:** 15% stop loss, 25% trailing stop armed at +10%, take-profit at +150%, fade exit
  on net outflow, exit on any single ≥5 SOL sell, 2000-slot max hold.
- **Guardrails:** tiny 0.01 SOL probe round trips, paced by block time, keep the run above
  20 coins and 200 fills even when the momentum entries run dry.

## Run it locally

```sh
node <kit>/cli/makefun.mjs grade-local --kit <kit> --bot . --driver process
```

Paper money only — nothing here trades for real, touches a wallet, or needs a network.
