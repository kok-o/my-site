// Home page — Server Component
// Composes all portfolio sections. No business logic here.
// Sections are added one at a time as they are built (Stages 2–7).

export default function HomePage() {
  return (
    <>
      {/*
        Sections are assembled here as they are built:
        Stage 2: <Hero />
        Stage 3+4: <Projects />
        Stage 5: <About />
        Stage 6: <Skills />
        Stage 7: <Contact />
      */}

      {/* Placeholder — removed after Stage 2 */}
      <section className="flex min-h-screen items-center justify-center section-container">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            Stage 1 Complete
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-foreground mb-4">
            Infrastructure Ready
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Navbar · Footer · ThemeProvider · Design tokens · Constants · Animations
          </p>
        </div>
      </section>
    </>
  )
}
