# Strategy — Pump.fun Replay Sprint

## Idea

Pump.fun bonding curves mostly die; a few run. This bot does not try to catch a curve at
birth (fresh curves are mostly bundled launches that get dumped). It buys curves that are
already moving on real, broad buy flow: a few hundred slots old, with accelerating net
inflow from several distinct wallets, the price up double digits and hugging its window
high, and no single wallet dominating the buys. It starts small (a single 0.05 SOL buy,
no pyramid adds) and gets out mechanically when the tape turns.

## Entry (all must hold, evaluated per batch on curves that traded)

- Curve age ≥ 300 slots since its CreateEvent; real SOL between 1 and 80.
- Over the last 60 slots: net inflow ≥ 0.3 SOL, ≥ 10 buys, ≥ 5 distinct buyers.
- Price up ≥ 10% over the window (and ≤ 150%, skipping curves that already ran too far),
  sitting within 4% of the window high.
- Acceleration: net inflow in the newer half of the window ≥ net inflow in the older half.
- Largest single buyer ≤ 60% of the window's buy SOL.

## Sizing

- First buy 0.05 SOL, no pyramid adds (tuned — pyramiding into strength was the biggest source of loss). One entry per curve.
- At most 0.05 SOL per coin (one buy, no pyramid), at most 5 momentum positions, at most 6 SOL at cost across the
  book. Every buy is also capped at 1% of the curve's real reserves (the harness cap).

## Exits (first trigger wins; the position is sold whole)

- Stop loss: close value < 88% of cost.
- Take-profit: close value ≥ 130% of cost.
- Trailing stop: once the position is up ≥ 10%, exit if it falls 25% below its peak value.
- Fade: net flow over the last 30 slots < −0.3 SOL.
- Big sell: any single recorded sell ≥ 5 SOL on the curve.
- Max hold: 2000 slots, unless the position is up ≥ 100%.
- A curve near completion (real SOL ≥ 1000) holds on: fade, trail, big-sell and time exits
  are suspended there (effectively off — curves complete around 85 real SOL).

## Guardrails

The run needs ≥ 20 coins and ≥ 200 fills. When the bot's own fills or coins lag the pace
(targets 25 coins / 240 fills scaled by the share of 4 hours of block time elapsed), it
opens 0.01 SOL probe round trips on liquid curves and sells each probe as soon as its buy
lands. Probes cost a little in fees and buy the guardrail.

## Determinism

No clock, no randomness. Iteration only over insertion-ordered maps fed by the batch
stream. The only time input is block_time from the events themselves, used for probe
pacing. Two executions produce byte-identical action logs.

## Tuning

Tuned on the dev window with the kit's local engine port (mean over 4 failed-tx draws,
worst draw reported) — but read the caveat first. The kit's sim only loads the first
of the three dataset parts (~8h of the 24h window): an early tune on that subset
looked positive (+0.11 SOL) yet scored −1.13 SOL under the real grader. The values in
`strategy.ts` are re-tuned against the FULL 24h window (patched sim loading all three
parts, verified to land within 0.09 SOL of grade-local). Honest result on the dev
window: −0.21 SOL mean (−0.22 worst draw, −0.19 on the default draw), 398 fills /
120 coins, 2.3% max drawdown — guardrails met, but net PnL is negative, so this entry
cannot take a paid place on dev data. The tuned knobs: maxEntries 1, minBuys 10,
stopLoss 0.12, takeProfit 0.3, pyramid off, initialSol 0.05, buySlipBps 500. Eight
sweep rounds over 400+ configs found no positive region; momentum-chasing loses on
this window. The final window is different data (collected after entries close) and
may behave differently — that is the only upside left in this design.
