'use client'

import InkSpillThemeSwitch, { InkThemeToggle, type InkTheme } from "@/components/ui/ink-spill-theme-switch"

const PALETTE = {
  light: { bg: "#efebe3", fg: "#161412", muted: "#6f685e", line: "#d8d0c3", accent: "#e2552b" },
  dark: { bg: "#121110", fg: "#f1ece4", muted: "#8e867b", line: "#2b2825", accent: "#f0663a" },
}

const SERIF = "'Iowan Old Style', 'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif"

function Studio({ theme, toggle }: { theme: InkTheme; toggle: (from?: Element | null) => void }) {
  const c = PALETTE[theme]
  return (
    <div className="min-h-full" style={{ background: c.bg, color: c.fg }}>
      <div className="mx-auto flex max-w-6xl flex-col px-6 pb-20 sm:px-10">
        <header className="flex items-center justify-between py-6">
          <a href="#" className="flex items-center gap-2 text-sm font-medium tracking-tight" onClick={(e) => e.preventDefault()}>
            <span className="inline-block size-4 rounded-full" style={{ background: "linear-gradient(90deg, " + c.fg + " 50%, transparent 50%)", boxShadow: "inset 0 0 0 1.5px " + c.fg }} />
            Halden
          </a>
          <nav className="flex items-center gap-6 text-sm" style={{ color: c.muted }}>
            <span className="hidden sm:inline" style={{ color: c.fg }}>Work</span>
            <span className="hidden sm:inline">Studio</span>
            <span className="hidden sm:inline">Notes</span>
            <span className="hidden sm:inline">Contact</span>
            <InkThemeToggle theme={theme} toggle={toggle} style={{ color: c.fg }} />
          </nav>
        </header>

        <p className="mt-14 text-[11px] uppercase tracking-[0.22em] sm:mt-20" style={{ color: c.muted }}>
          Independent design practice since 2019
        </p>
        <h1 className="mt-5 max-w-3xl text-5xl leading-[1.02] tracking-tight sm:text-7xl" style={{ fontFamily: SERIF }}>
          Calm software
          <br />
          for <em style={{ color: c.accent }}>restless</em> minds.
        </h1>
        <p className="mt-7 max-w-md text-[15px] leading-relaxed" style={{ color: c.muted }}>
          We shape tools for people who think for a living: research desks, writing rooms, small studios. Fewer buttons,
          longer attention spans, interfaces that get out of the way.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full px-5 py-2.5" style={{ background: c.fg, color: c.bg }}>
            View the work →
          </span>
          <span className="rounded-full px-5 py-2.5" style={{ boxShadow: "inset 0 0 0 1px " + c.line }}>
            say@halden.studio
          </span>
        </div>
      </div>
    </div>
  )
}

export default function InkSpillThemeSwitchDemo() {
  return (
    <InkSpillThemeSwitch defaultTheme="light">
      {({ theme, toggle }) => <Studio theme={theme} toggle={toggle} />}
    </InkSpillThemeSwitch>
  )
}
