import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { DisciplineProvider } from "@/components/discipline-state";

export const metadata: Metadata = {
  title: "DisciplineOS",
  description: "A clean self-improvement dashboard for daily discipline."
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/morning-check-in", label: "Morning" },
  { href: "/check-in", label: "Check-In" },
  { href: "/ai-coach", label: "AI Coach" },
  { href: "/weekly-review", label: "Weekly Review" },
  { href: "/settings", label: "Settings" }
];

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <DisciplineProvider>
          <div className="min-h-screen">
            <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
              <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                <Link href="/" className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg border border-teal-300/30 bg-teal-300/10 font-black text-teal-200">
                    D
                  </span>
                  <span>
                    <span className="block text-lg font-bold tracking-tight text-white">
                      DisciplineOS
                    </span>
                    <span className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      Daily operating system
                    </span>
                  </span>
                </Link>
                <div className="flex flex-wrap gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-teal-300/50 hover:bg-teal-300/10 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </nav>
            </header>
            <main>{children}</main>
          </div>
        </DisciplineProvider>
      </body>
    </html>
  );
}
