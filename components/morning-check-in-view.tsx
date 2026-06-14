"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useDiscipline } from "@/components/discipline-state";

export function MorningCheckInView() {
  const {
    todaysMorningEntry,
    todaysMission,
    saveMorningEntry,
    morningEntries,
    yesterdayMissedHabits
  } = useDiscipline();
  const [sleepQuality, setSleepQuality] = useState(
    todaysMorningEntry?.sleepQuality || 7
  );
  const [mood, setMood] = useState(todaysMorningEntry?.mood || 7);
  const [energyLevel, setEnergyLevel] = useState(
    todaysMorningEntry?.energyLevel || 7
  );
  const [mainFocus, setMainFocus] = useState(
    todaysMorningEntry?.mainFocus || ""
  );

  useEffect(() => {
    if (todaysMorningEntry) {
      setSleepQuality(todaysMorningEntry.sleepQuality);
      setMood(todaysMorningEntry.mood);
      setEnergyLevel(todaysMorningEntry.energyLevel);
      setMainFocus(todaysMorningEntry.mainFocus);
    }
  }, [todaysMorningEntry]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    saveMorningEntry({
      sleepQuality,
      mood,
      energyLevel,
      mainFocus
    });
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <aside className="lg:sticky lg:top-32 lg:self-start">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-200">
          Morning Check-In
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
          Set the day before it sets you.
        </h1>
        <p className="mt-4 text-slate-400">
          Rate your internal state, name the main focus, and DisciplineOS will
          generate a local mission card for today.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Saved entries
          </p>
          <p className="mt-3 text-4xl font-black text-white">
            {morningEntries.length}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Entries are stored locally in this browser.
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Yesterday&apos;s signal
          </p>
          <p className="mt-3 text-2xl font-black text-white">
            {yesterdayMissedHabits.length} missed
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {yesterdayMissedHabits.length > 0
              ? yesterdayMissedHabits
                  .slice(0, 3)
                  .map((habit) => habit.label)
                  .join(", ")
              : "No missed habits recorded yesterday."}
          </p>
        </div>
      </aside>

      <div className="space-y-6">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 sm:p-6"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white">
              Today&apos;s morning state
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Scores use a 1-10 scale. Your mission updates when you save and
              changes with today&apos;s date and yesterday&apos;s misses.
            </p>
          </div>

          <div className="space-y-5">
            <RatingControl
              label="Sleep quality"
              value={sleepQuality}
              onChange={setSleepQuality}
            />
            <RatingControl label="Mood" value={mood} onChange={setMood} />
            <RatingControl
              label="Energy level"
              value={energyLevel}
              onChange={setEnergyLevel}
            />
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                Main focus for today
              </span>
              <textarea
                value={mainFocus}
                onChange={(event) => setMainFocus(event.target.value)}
                placeholder="Example: finish the dashboard flow, protect gym time, review trading plan..."
                rows={4}
                className="w-full resize-none rounded-lg border border-white/10 bg-slate-950 px-3 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-teal-300/60"
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 rounded-lg bg-teal-300 px-5 py-3 font-bold text-slate-950 transition hover:bg-teal-200"
          >
            Complete Morning Check-In
          </button>
        </form>

        {todaysMission ? (
          <MissionCard
            priority={todaysMission.priority}
            risk={todaysMission.risk}
            winCondition={todaysMission.winCondition}
            motivation={todaysMission.motivation}
          />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black text-white">
              Today&apos;s Mission is waiting.
            </h2>
            <p className="mt-2 text-slate-400">
              Complete the morning check-in to generate the mission card.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function RatingControl({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-sm font-bold text-white">{label}</span>
        <span className="rounded-full bg-teal-300/10 px-3 py-1 text-sm font-black text-teal-100">
          {value}/10
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-teal-300"
      />
    </label>
  );
}

export function MissionCard({
  priority,
  risk,
  winCondition,
  motivation
}: {
  priority: string;
  risk: string;
  winCondition: string;
  motivation: string;
}) {
  return (
    <article className="rounded-2xl border border-teal-300/20 bg-gradient-to-br from-teal-300/15 to-sky-400/10 p-6 shadow-2xl shadow-black/20">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-100/70">
            Today&apos;s Mission
          </p>
          <h2 className="mt-2 text-3xl font-black text-white">
            Execute with intent.
          </h2>
        </div>
        <Link
          href="/check-in"
          className="rounded-lg border border-white/10 px-4 py-2 text-center text-sm font-bold text-white transition hover:border-white/25 hover:bg-white/10"
        >
          Go to Daily Check-In
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MissionBlock label="Today's Priority" value={priority} />
        <MissionBlock label="Biggest Risk" value={risk} />
        <MissionBlock label="Win Condition" value={winCondition} />
        <MissionBlock label="Motivational Message" value={motivation} />
      </div>
    </article>
  );
}

function MissionBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/65 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-200">{value}</p>
    </div>
  );
}
