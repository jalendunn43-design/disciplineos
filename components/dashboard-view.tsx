"use client";

import Link from "next/link";
import { ProgressBar } from "@/components/progress-bar";
import { useDiscipline } from "@/components/discipline-state";
import { MissionCard } from "@/components/morning-check-in-view";
import { StreakPanel } from "@/components/streak-panel";
import { DisciplineScoreCard } from "@/components/discipline-score-card";
import { StreakPressureCard } from "@/components/streak-pressure-card";

const statCopy = {
  score: "Daily Score",
  streak: "Current Streak",
  level: "Level"
};

export function DashboardView() {
  const {
    profile,
    dailyScore,
    currentStreak,
    level,
    xp,
    xpForLevel,
    xpProgress,
    completedCount,
    dailyHabits,
    habits,
    categories,
    todaysMission,
    streakStatus,
    disciplineScore
  } = useDiscipline();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200">
            Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Win the day in public to yourself.
          </h1>
          <p className="mt-4 max-w-2xl text-slate-400">
            Your personalized command center for the daily goals you choose:
            gym, trading, coding, business, saving money, reading, and anything
            else that matters.
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
            href="/settings"
            className="rounded-lg border border-white/10 px-5 py-3 text-center font-bold text-white transition hover:border-white/25 hover:bg-white/10"
          >
            Edit Habits
          </Link>
          <Link
            href="/check-in"
            className="rounded-lg bg-teal-300 px-5 py-3 text-center font-bold text-slate-950 transition hover:bg-teal-200"
          >
            Update Today
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <article className="premium-card relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] via-slate-950/75 to-cyan-400/8 p-5 shadow-2xl shadow-black/20 sm:p-6">
          <div className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-teal-300/15 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-teal-100/70">
              Identity
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-white">
              {profile.name.trim() || "Jalen"}
            </h2>
            <p className="mt-2 text-lg font-bold text-cyan-100">
              Level {level} {profile.identity.trim() || "Discipline Builder"}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-3xl font-black text-white">
                  {currentStreak}
                </p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  day streak
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-3xl font-black text-white">{xp}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  total XP
                </p>
              </div>
            </div>
            <Link
              href="/settings"
              className="mt-5 inline-flex rounded-lg border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-teal-300/30 hover:bg-teal-300/10 hover:text-white"
            >
              Edit Profile
            </Link>
          </div>
        </article>

        <StreakPressureCard
          currentStreak={currentStreak}
          completedCount={completedCount}
          dailyHabitsCount={dailyHabits.length}
          streak={streakStatus}
          disciplineScore={disciplineScore}
        />
      </div>

      <div className="mb-8">
        <DisciplineScoreCard score={disciplineScore} />
      </div>

      <div className="mb-8">
        {todaysMission ? (
          <MissionCard
            priority={todaysMission.priority}
            risk={todaysMission.risk}
            winCondition={todaysMission.winCondition}
            motivation={todaysMission.motivation}
          />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200">
                  Today&apos;s Mission
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  Start with a morning check-in.
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Log sleep, mood, energy, and your main focus to generate the
                  mission card for today.
                </p>
              </div>
              <Link
                href="/morning-check-in"
                className="rounded-lg bg-teal-300 px-5 py-3 text-center font-bold text-slate-950 transition hover:bg-teal-200"
              >
                Create Mission
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label={statCopy.score}
          value={`${dailyScore}/100`}
          note={`${completedCount} of ${dailyHabits.length} daily habits complete`}
        />
        <StatCard
          label={statCopy.streak}
          value={`${currentStreak}`}
          note={
            streakStatus.nextMilestone
              ? `${streakStatus.nextMilestone.days - streakStatus.current} days to ${streakStatus.nextMilestone.label}`
              : "all milestones unlocked"
          }
        />
        <StatCard
          label={statCopy.level}
          value={`${level}`}
          note={`${xp} total XP earned`}
        />
      </div>

      <div className="mt-4">
        <StreakPanel streak={streakStatus} />
      </div>

      <div className="premium-card mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 sm:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">XP Progress</h2>
            <p className="text-sm text-slate-400">
              {xp % xpForLevel} / {xpForLevel} XP toward the next level
            </p>
          </div>
          <span className="rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-sm font-bold text-teal-100">
            {xpProgress}%
          </span>
        </div>
        <ProgressBar value={xpProgress} />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-black text-white">Categories</h2>
          <span className="text-sm text-slate-500">
            {habits.length} total habits configured
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.name}
              className="premium-card rounded-2xl border border-white/10 bg-slate-950/65 p-5 transition hover:-translate-y-0.5 hover:border-teal-300/20 hover:bg-slate-950/85"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{category.name}</h3>
                <span className="text-right">
                  <span className="block text-2xl font-black text-white">
                    {category.score}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {category.completed}/{category.total}
                  </span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${category.tone} transition-all duration-700`}
                  style={{ width: `${category.score}%` }}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  note
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <article className="premium-card rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:border-teal-300/20">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-4 text-5xl font-black tracking-tight text-white">
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-400">{note}</p>
    </article>
  );
}
