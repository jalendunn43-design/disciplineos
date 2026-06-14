"use client";

import { useMemo } from "react";
import { useDiscipline, type Habit } from "@/components/discipline-state";

function getDateKeyFromOffset(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);

  return localDate.toISOString().slice(0, 10);
}

export function WeeklyReviewView() {
  const {
    dailyHabits,
    checkInHistory,
    morningEntries,
    categories,
    streakStatus,
    completedCount,
    dailyScore
  } = useDiscipline();
  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, index) => getDateKeyFromOffset(-index)),
    []
  );
  const weeklyScores = weekDates.map((dateKey) => {
    const completedIds = checkInHistory[dateKey];

    if (!completedIds || dailyHabits.length === 0) {
      return null;
    }

    return Math.round((completedIds.length / dailyHabits.length) * 100);
  });
  const scoredDays = weeklyScores.filter((score): score is number => {
    return typeof score === "number";
  });
  const averageScore =
    scoredDays.length > 0
      ? Math.round(
          scoredDays.reduce((sum, score) => sum + score, 0) / scoredDays.length
        )
      : dailyScore;
  const bestScore =
    scoredDays.length > 0 ? Math.max(...scoredDays) : dailyScore;
  const completedThisWeek = weekDates.reduce((sum, dateKey) => {
    return sum + (checkInHistory[dateKey]?.length || 0);
  }, 0);
  const weekMorningEntries = morningEntries.filter((entry) =>
    weekDates.includes(entry.date)
  );
  const averageReadiness =
    weekMorningEntries.length > 0
      ? Math.round(
          weekMorningEntries.reduce((sum, entry) => {
            return (
              sum +
              (entry.sleepQuality + entry.mood + entry.energyLevel) / 3
            );
          }, 0) / weekMorningEntries.length
        )
      : null;
  const weakestCategory =
    [...categories]
      .filter((category) => category.total > 0)
      .sort((a, b) => a.score - b.score)[0] || null;
  const strongestCategory =
    [...categories]
      .filter((category) => category.total > 0)
      .sort((a, b) => b.score - a.score)[0] || null;
  const currentMissed = dailyHabits.filter((habit) => {
    return !(checkInHistory[getDateKeyFromOffset(0)] || []).includes(habit.id);
  });
  const wins = getWins({
    completedThisWeek,
    strongestHabit: getFirstCompletedHabit(
      dailyHabits,
      checkInHistory,
      weekDates
    ),
    strongestCategoryName: strongestCategory?.name,
    streak: streakStatus.current
  });
  const focusAreas = getFocusAreas({
    missedHabits: currentMissed,
    weakestCategoryName: weakestCategory?.name,
    averageReadiness
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200">
          Weekly Review
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
          Audit the week. Adjust the system.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-400">
          Review based on your local check-ins, habits, morning entries, and
          current streak.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReviewStat label="Average Score" value={`${averageScore}`} />
        <ReviewStat label="Best Day" value={`${bestScore}`} />
        <ReviewStat label="Habits Done" value={`${completedThisWeek}`} />
        <ReviewStat
          label="Readiness"
          value={averageReadiness ? `${averageReadiness}/10` : "Not set"}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ReviewPanel title="Wins This Week" items={wins} />
        <ReviewPanel title="Next Week Focus" items={focusAreas} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-2xl border border-white/10 bg-slate-950/70 p-6">
          <h2 className="text-2xl font-black text-white">Last 7 Days</h2>
          <div className="mt-5 space-y-3">
            {weekDates.map((dateKey, index) => {
              const score = weeklyScores[index];

              return (
                <div key={dateKey}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-bold text-white">{dateKey}</span>
                    <span className="text-slate-400">
                      {score === null ? "No check-in" : `${score}/100`}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-300 to-sky-400"
                      style={{ width: `${score || 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-teal-300/15 to-sky-400/10 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-100/70">
            Reflection prompt
          </p>
          <h2 className="mt-3 text-2xl font-black text-white">
            What single constraint would make next week easier to win?
          </h2>
          <p className="mt-3 max-w-3xl text-slate-300">
            Start with {weakestCategory?.name || "the lowest-friction miss"}.
            Make the rule small enough to follow on a low-energy day.
          </p>
        </div>
      </div>
    </section>
  );
}

function getFirstCompletedHabit(
  habits: Habit[],
  history: Record<string, string[]>,
  weekDates: string[]
) {
  const completedIds = new Set(weekDates.flatMap((dateKey) => history[dateKey] || []));
  return habits.find((habit) => completedIds.has(habit.id));
}

function getWins({
  completedThisWeek,
  strongestHabit,
  strongestCategoryName,
  streak
}: {
  completedThisWeek: number;
  strongestHabit?: Habit;
  strongestCategoryName?: string;
  streak: number;
}) {
  const wins = [
    completedThisWeek > 0
      ? `Completed ${completedThisWeek} habit check${completedThisWeek === 1 ? "" : "s"} this week`
      : "Started tracking the system honestly",
    strongestHabit
      ? `Most reliable habit: ${strongestHabit.label}`
      : "No reliable habit has emerged yet",
    streak > 0
      ? `Protected a ${streak}-day streak`
      : "Identified the reset point and can restart cleanly"
  ];

  if (strongestCategoryName) {
    wins[1] = `${strongestCategoryName} is currently your strongest category`;
  }

  return wins;
}

function getFocusAreas({
  missedHabits,
  weakestCategoryName,
  averageReadiness
}: {
  missedHabits: Habit[];
  weakestCategoryName?: string;
  averageReadiness: number | null;
}) {
  return [
    missedHabits[0]
      ? `Protect ${missedHabits[0].label} before reactive work`
      : `Maintain the daily floor in ${weakestCategoryName || "your weakest category"}`,
    weakestCategoryName
      ? `Raise ${weakestCategoryName} by one small repeatable action`
      : "Keep categories balanced by checking habits earlier",
    averageReadiness && averageReadiness < 6
      ? "Reduce the plan on low-readiness mornings instead of skipping it"
      : "Define tomorrow's first block before the day starts"
  ];
}

function ReviewStat({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-4 text-4xl font-black text-white">{value}</p>
    </article>
  );
}

function ReviewPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-slate-950/70 p-6">
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <div className="mt-5 space-y-3">
        {items.map((item, index) => (
          <div
            key={item}
            className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-teal-300/10 text-sm font-black text-teal-200">
              {index + 1}
            </span>
            <p className="text-slate-300">{item}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
