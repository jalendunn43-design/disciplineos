"use client";

import type {
  DisciplineScore,
  StreakStatus
} from "@/components/discipline-state";

type StreakPressureCardProps = {
  currentStreak: number;
  completedCount: number;
  dailyHabitsCount: number;
  streak: StreakStatus;
  disciplineScore: DisciplineScore;
};

export function StreakPressureCard({
  currentStreak,
  completedCount,
  dailyHabitsCount,
  streak,
  disciplineScore
}: StreakPressureCardProps) {
  const missedCount = Math.max(0, dailyHabitsCount - completedCount);
  const nextMilestone = streak.nextMilestone;
  const daysToMilestone = nextMilestone
    ? Math.max(0, nextMilestone.days - streak.current)
    : 0;
  const primary = disciplineScore.isDanger
    ? "WARNING: Your streak is at risk."
    : currentStreak > 0
      ? `You are 1 missed day away from losing a ${currentStreak}-day streak.`
      : "Today is the first proof point.";
  const secondary = disciplineScore.isDanger
    ? "Recovery move: complete one small habit now."
    : nextMilestone
      ? `${daysToMilestone} more day${daysToMilestone === 1 ? "" : "s"} until ${nextMilestone.label} badge.`
      : "Every milestone is unlocked. Now protect the standard.";

  return (
    <article
      className={`pressure-card relative overflow-hidden rounded-2xl border p-5 shadow-2xl shadow-black/20 sm:p-6 ${
        disciplineScore.isDanger
          ? "border-rose-300/25 bg-gradient-to-br from-rose-500/14 via-slate-950/90 to-slate-950"
          : "border-cyan-300/20 bg-gradient-to-br from-cyan-300/14 via-teal-300/8 to-slate-950"
      }`}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-cyan-300/15 blur-3xl" />
      <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p
            className={`text-xs font-black uppercase tracking-[0.24em] ${
              disciplineScore.isDanger ? "text-rose-100/80" : "text-teal-100/80"
            }`}
          >
            Streak Pressure
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
            {primary}
          </h2>
          <p className="mt-2 text-base font-semibold text-slate-300">
            {secondary}
          </p>
          <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
            Protect the streak today.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:min-w-80">
          <PressureMetric label="streak" value={`${currentStreak}`} />
          <PressureMetric label="done" value={`${completedCount}`} />
          <PressureMetric label="open" value={`${missedCount}`} danger={missedCount > 0} />
        </div>
      </div>
    </article>
  );
}

function PressureMetric({
  label,
  value,
  danger = false
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center">
      <p
        className={`text-3xl font-black ${
          danger ? "text-rose-100" : "text-white"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
    </div>
  );
}
