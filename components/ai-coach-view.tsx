"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { ReactNode } from "react";
import {
  useDiscipline,
  type Category,
  type Habit,
  type MorningEntry
} from "@/components/discipline-state";

type CoachResponse = {
  encouragement: string;
  toughFeedback: string;
  improvement: string;
};

type CoachInput = {
  dailyScore: number;
  completedHabits: Habit[];
  missedHabits: Habit[];
  currentStreak: number;
  weakestCategory: Category | null;
  strongestCategory: Category | null;
  morningEntry: MorningEntry | null;
};

export function AiCoachView() {
  const {
    dailyScore,
    dailyHabits,
    checkedHabitIds,
    currentStreak,
    streakStatus,
    categories,
    todaysMorningEntry
  } = useDiscipline();

  const completedHabits = useMemo(
    () => dailyHabits.filter((habit) => checkedHabitIds.includes(habit.id)),
    [checkedHabitIds, dailyHabits]
  );
  const missedHabits = useMemo(
    () => dailyHabits.filter((habit) => !checkedHabitIds.includes(habit.id)),
    [checkedHabitIds, dailyHabits]
  );
  const activeCategories = categories.filter((category) => category.total > 0);
  const weakestCategory =
    [...activeCategories].sort((a, b) => a.score - b.score)[0] || null;
  const strongestCategory =
    [...activeCategories].sort((a, b) => b.score - a.score)[0] || null;
  const coachResponse = getDynamicCoachResponse({
    dailyScore,
    completedHabits,
    missedHabits,
    currentStreak,
    weakestCategory,
    strongestCategory,
    morningEntry: todaysMorningEntry
  });
  const morningReadiness = todaysMorningEntry
    ? Math.round(
        (todaysMorningEntry.sleepQuality +
          todaysMorningEntry.mood +
          todaysMorningEntry.energyLevel) /
          3
      )
    : null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200">
            AI Coach
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Direct feedback. No drama.
          </h1>
          <p className="mt-4 max-w-2xl text-slate-400">
            Local coaching logic using completed habits, missed habits, streak,
            morning check-in, and weakest category. No external AI calls yet.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/morning-check-in"
            className="rounded-lg border border-white/10 px-5 py-3 text-center font-bold text-white transition hover:border-white/25 hover:bg-white/10"
          >
            Morning Check-In
          </Link>
          <Link
            href="/check-in"
            className="rounded-lg bg-teal-300 px-5 py-3 text-center font-bold text-slate-950 transition hover:bg-teal-200"
          >
            Update Check-In
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <CoachMetric label="Today&apos;s Score" value={`${dailyScore}/100`} />
        <CoachMetric label="Completed" value={`${completedHabits.length}`} />
        <CoachMetric label="Missed" value={`${missedHabits.length}`} />
        <CoachMetric label="Streak" value={`${currentStreak} days`} />
        <CoachMetric
          label="Readiness"
          value={morningReadiness ? `${morningReadiness}/10` : "Not set"}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-4">
          <CoachCard
            label="1. Encouragement"
            title="What is working"
            body={coachResponse.encouragement}
            tone="from-teal-300/18 to-sky-400/8"
          />
          <CoachCard
            label="2. Tough Feedback"
            title="What needs honesty"
            body={coachResponse.toughFeedback}
            tone="from-amber-300/18 to-rose-400/8"
          />
          <CoachCard
            label="3. Tomorrow&apos;s Improvement"
            title="The next constraint"
            body={coachResponse.improvement}
            tone="from-fuchsia-300/14 to-teal-300/8"
          />
        </div>

        <aside className="space-y-4">
          <Panel title="Coach Readout">
            <div className="grid gap-3">
              <ReadoutLine
                label="Morning state"
                value={
                  todaysMorningEntry
                    ? `Sleep ${todaysMorningEntry.sleepQuality}/10, mood ${todaysMorningEntry.mood}/10, energy ${todaysMorningEntry.energyLevel}/10`
                    : "No morning check-in yet"
                }
              />
              <ReadoutLine
                label="Main focus"
                value={todaysMorningEntry?.mainFocus || "Not set yet"}
              />
              <ReadoutLine
                label="Weakest category"
                value={
                  weakestCategory
                    ? `${weakestCategory.name} at ${weakestCategory.score}%`
                    : "No category data yet"
                }
              />
              <ReadoutLine
                label="Streak status"
                value={
                  streakStatus.hasMissedDay
                    ? "Recovery mode is active"
                    : `${currentStreak} days active`
                }
              />
            </div>
          </Panel>

          <Panel title="Completed Habits">
            {completedHabits.length === 0 ? (
              <p className="text-sm leading-6 text-slate-300">
                Nothing completed yet. Start with the smallest real win.
              </p>
            ) : (
              <HabitList habits={completedHabits} />
            )}
          </Panel>

          <Panel title="Missed Habits">
            {missedHabits.length === 0 ? (
              <p className="text-sm leading-6 text-slate-300">
                Clean board. Now the standard is consistency, not celebration.
              </p>
            ) : (
              <HabitList habits={missedHabits} />
            )}
          </Panel>

          <Panel title="Category Performance">
            <div className="space-y-3">
              {activeCategories.map((category) => (
                <div key={category.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-bold text-white">{category.name}</span>
                    <span className="text-slate-400">
                      {category.completed}/{category.total}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${category.tone}`}
                      style={{ width: `${category.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
    </section>
  );
}

function getDynamicCoachResponse({
  dailyScore,
  completedHabits,
  missedHabits,
  currentStreak,
  weakestCategory,
  strongestCategory,
  morningEntry
}: CoachInput): CoachResponse {
  const keyMiss =
    missedHabits.find((habit) => habit.category === weakestCategory?.name) ||
    missedHabits[0] ||
    null;
  const keyWin = completedHabits[0] || null;
  const weakSpot = weakestCategory?.name || "your lowest category";
  const strongSpot = strongestCategory?.name || "your strongest lane";
  const focus = morningEntry?.mainFocus.trim() || "your main priority";
  const readiness = morningEntry
    ? Math.round(
        (morningEntry.sleepQuality +
          morningEntry.mood +
          morningEntry.energyLevel) /
          3
      )
    : null;
  const lowEnergy = morningEntry ? morningEntry.energyLevel <= 4 : false;
  const lowSleep = morningEntry ? morningEntry.sleepQuality <= 4 : false;
  const lowMood = morningEntry ? morningEntry.mood <= 4 : false;

  const encouragement =
    dailyScore >= 85
      ? `You are building trust with yourself. A ${dailyScore}/100 with a ${currentStreak}-day streak says the system is working. Keep stacking quiet wins, especially in ${strongSpot}.`
      : dailyScore >= 60
        ? `You showed up today. The score is not perfect, but completed reps like ${keyWin?.label || "your checked habits"} keep the identity alive. That matters.`
        : `You are not behind. Today gave you information. The fact that you are reviewing it instead of ignoring it is the first disciplined move.`;

  const statePressure =
    lowSleep
      ? "Low sleep probably made resistance louder than usual."
      : lowMood
        ? "Low mood may have made simple tasks feel heavier than they were."
        : lowEnergy
          ? "Low energy means you needed a tighter plan, not more pressure."
          : readiness
            ? `Your morning readiness was ${readiness}/10, so the day had enough fuel for a focused plan.`
            : "Without a morning check-in, you were operating without a clear read on your state.";

  const toughFeedback =
    missedHabits.length === 0
      ? `Clean board. Good. Now be honest: the next level is not more boxes, it is better attention while doing them. Do not let completion become autopilot.`
      : `Today showed a pattern: ${keyMiss?.label || weakSpot} got delayed. ${statePressure} That is not a character flaw, but it is a planning problem. If ${weakSpot} keeps slipping, it becomes the ceiling on the whole system.`;

  const improvement =
    missedHabits.length > 0
      ? `Tomorrow, protect 20 focused minutes for ${keyMiss?.label || weakSpot} before anything else can crowd it out. Put it before messages, errands, and negotiation.`
      : `Tomorrow, keep the streak boring and repeatable. Start with ${focus}, then add one quality rep in ${weakSpot} before you chase extra work.`;

  return {
    encouragement,
    toughFeedback,
    improvement
  };
}

function HabitList({ habits }: { habits: Habit[] }) {
  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <div
          key={habit.id}
          className="rounded-xl border border-white/10 bg-slate-950/70 p-4"
        >
          <p className="font-bold text-white">{habit.label}</p>
          <p className="mt-1 text-sm text-slate-400">
            {habit.category} - {habit.difficulty} - +{habit.xp} XP
          </p>
        </div>
      ))}
    </div>
  );
}

function ReadoutLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-200">{value}</p>
    </div>
  );
}

function CoachMetric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
    </article>
  );
}

function CoachCard({
  label,
  title,
  body,
  tone
}: {
  label: string;
  title: string;
  body: string;
  tone: string;
}) {
  return (
    <article
      className={`rounded-2xl border border-white/10 bg-gradient-to-br ${tone} p-6`}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-100/70">
        {label}
      </p>
      <h2 className="mt-3 text-2xl font-black text-white">{title}</h2>
      <p className="mt-3 leading-7 text-slate-200">{body}</p>
    </article>
  );
}

function Panel({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-slate-950/70 p-5">
      <h2 className="mb-4 text-xl font-black text-white">{title}</h2>
      {children}
    </article>
  );
}
