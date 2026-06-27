// Home page — Server Component
// Composes all portfolio sections. No business logic here.
// Sections are added one at a time as they are built (Stages 2–7).

import { Hero } from '@/components/hero'

export default function HomePage() {
  return (
    <>
      {/* Stage 2: Hero */}
      <Hero />

      {/*
        Sections are assembled here as they are built:
        Stage 3+4: <Projects />
        Stage 5: <About />
        Stage 6: <Skills />
        Stage 7: <Contact />
      */}
    </>
  )
}
