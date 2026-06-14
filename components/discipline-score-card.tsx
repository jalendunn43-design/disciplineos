"use client";

import type { DisciplineScore } from "@/components/discipline-state";

type DisciplineScoreCardProps = {
  score: DisciplineScore;
  compact?: boolean;
};

export function DisciplineScoreCard({
  score,
  compact = false
}: DisciplineScoreCardProps) {
  const breakdown = [
    {
      label: "completed habits",
      value: `+${score.completedPoints}`,
      tone: "text-teal-100"
    },
    {
      label: "missed habits",
      value: `-${score.missedPenalty}`,
      tone: score.missedPenalty > 0 ? "text-rose-200" : "text-slate-400"
    },
    {
      label: "streak bonus",
      value: `+${score.streakBonus}`,
      tone: "text-amber-100"
    },
    {
      label: "morning readiness",
      value: `+${score.readinessBonus}`,
      tone: "text-cyan-100"
    }
  ];

  return (
    <article
      className={`premium-card relative overflow-hidden rounded-2xl border p-5 shadow-2xl shadow-black/20 sm:p-6 ${
        score.isDanger
          ? "border-rose-300/25 bg-gradient-to-br from-rose-500/12 via-slate-950/85 to-slate-950"
          : "border-teal-300/18 bg-gradient-to-br from-teal-300/14 via-slate-950/80 to-cyan-500/8"
      }`}
    >
      <div className="pointer-events-none absolute inset-x-8 -top-24 h-40 rounded-full bg-cyan-300/12 blur-3xl" />
      <div className="relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-100/70">
              Signature Metric
            </p>
            <h2 className="mt-2 text-xl font-black text-white">
              Discipline Score
            </h2>
            <p className="mt-1 text-sm text-slate-400">{score.label}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-6xl font-black tracking-tight text-white sm:text-7xl">
              {score.score}
            </p>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              /100
            </p>
          </div>
        </div>

        <div
          className={`mt-6 grid gap-3 ${
            compact ? "sm:grid-cols-2" : "sm:grid-cols-4"
          }`}
        >
          {breakdown.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-teal-300/20 hover:bg-white/[0.055]"
            >
              <p className={`text-2xl font-black ${item.tone}`}>
                {item.value}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {score.dangerMessage ? (
          <div className="danger-pulse mt-5 rounded-xl border border-rose-300/25 bg-rose-500/10 px-4 py-3 text-sm font-bold leading-6 text-rose-100">
            {score.dangerMessage}
          </div>
        ) : null}
      </div>
    </article>
  );
}
