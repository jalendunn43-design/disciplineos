import Link from "next/link";

const pillars = [
  "Track the few actions that actually move your life forward.",
  "Turn each completed habit into score, XP, and visible progress.",
  "Review your week before drift has time to become identity."
];

export default function LandingPage() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-89px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
      <div>
        <p className="mb-5 inline-flex rounded-full border border-teal-300/20 bg-teal-300/10 px-4 py-2 text-sm font-semibold text-teal-100">
          Modern discipline tracking for ambitious builders
        </p>
        <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
          DisciplineOS
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
          A dark-mode self-improvement dashboard for turning daily choices into
          a clear score, streak, level, and weekly momentum.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="rounded-lg bg-teal-300 px-6 py-3 text-center font-bold text-slate-950 shadow-[0_0_36px_rgba(45,212,191,0.28)] transition hover:bg-teal-200"
          >
            Open Dashboard
          </Link>
          <Link
            href="/check-in"
            className="rounded-lg border border-white/15 px-6 py-3 text-center font-bold text-white transition hover:border-white/30 hover:bg-white/10"
          >
            Start Daily Check-In
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="rounded-xl border border-white/10 bg-slate-950/80 p-5">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-400">
              Today&apos;s command center
            </span>
            <span className="rounded-full bg-teal-300/10 px-3 py-1 text-sm font-bold text-teal-200">
              83/100
            </span>
          </div>
          <div className="grid gap-3">
            {pillars.map((pillar, index) => (
              <div
                key={pillar}
                className="flex gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-sm font-black text-teal-200">
                  0{index + 1}
                </span>
                <p className="text-sm leading-6 text-slate-300">{pillar}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg bg-gradient-to-br from-teal-300/20 to-sky-400/10 p-5">
            <p className="text-sm uppercase tracking-[0.28em] text-teal-100/70">
              Current streak
            </p>
            <p className="mt-2 text-4xl font-black text-white">12 days</p>
          </div>
        </div>
      </div>
    </section>
  );
}
