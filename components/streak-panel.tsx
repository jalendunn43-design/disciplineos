"use client";

import Link from "next/link";
import {
  streakMilestones,
  type StreakStatus
} from "@/components/discipline-state";

export function StreakPanel({
  streak,
  celebration = false
}: {
  streak: StreakStatus;
  celebration?: boolean;
}) {
  if (streak.hasMissedDay) {
    return <RecoveryPanel streak={streak} />;
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
        <div className="flex items-center gap-5">
          <StreakFire active={streak.current > 0} celebration={celebration} />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200">
              Streak System
            </p>
            <p className="mt-2 text-5xl font-black tracking-tight text-white">
              {streak.current}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              day streak - longest {streak.longest}
            </p>
          </div>
        </div>

        <div>
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-black text-white">
              Milestone badges
            </h2>
            {streak.nextMilestone ? (
              <span className="text-sm text-slate-400">
                {Math.max(0, streak.nextMilestone.days - streak.current)} days
                to {streak.nextMilestone.label}
              </span>
            ) : (
              <span className="text-sm font-bold text-teal-100">
                All milestones unlocked
              </span>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {streakMilestones.map((milestone) => {
              const unlocked = streak.current >= milestone.days;

              return (
                <div
                  key={milestone.days}
                  className={`rounded-xl border p-4 transition ${
                    unlocked
                      ? "border-teal-300/40 bg-teal-300/10"
                      : "border-white/10 bg-slate-950/70"
                  }`}
                >
                  <p
                    className={`text-2xl font-black ${
                      unlocked ? "text-teal-100" : "text-slate-500"
                    }`}
                  >
                    {milestone.days}
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    {milestone.label}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {unlocked ? "Unlocked" : "Locked"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function RecoveryPanel({ streak }: { streak: StreakStatus }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-amber-300/20 bg-gradient-to-br from-amber-300/15 via-rose-400/10 to-slate-950 p-6 shadow-2xl shadow-black/20">
      <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
        <div className="flex items-center gap-5">
          <StreakFire active={false} />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-100/80">
              Recovery Mode
            </p>
            <p className="mt-2 text-4xl font-black text-white">
              Missed days do not define you.
            </p>
          </div>
        </div>
        <div>
          <p className="text-lg leading-8 text-slate-200">
            The streak broke, but the system is still here. Complete today&apos;s
            habits to restart cleanly and prove the rebound.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/check-in"
              className="rounded-lg bg-teal-300 px-5 py-3 text-center font-bold text-slate-950 transition hover:bg-teal-200"
            >
              Restart Today
            </Link>
            <span className="rounded-lg border border-white/10 px-5 py-3 text-center text-sm font-bold text-slate-300">
              Last completed: {streak.lastCompletedDate || "No record yet"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function StreakFire({
  active,
  celebration = false
}: {
  active: boolean;
  celebration?: boolean;
}) {
  return (
    <div
      className={`streak-fire ${active ? "streak-fire-active" : "streak-fire-resting"} ${celebration ? "streak-fire-boost" : ""}`}
      aria-hidden="true"
    >
      <span className="streak-flame streak-flame-back" />
      <span className="streak-flame streak-flame-mid" />
      <span className="streak-flame streak-flame-front" />
    </div>
  );
}
