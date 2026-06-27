// Home page — Server Component
// Composes all portfolio sections. No business logic here.
// Sections are added one at a time as they are built (Stages 2–7).

import { Hero } from '@/components/hero'
import { Projects } from '@/components/projects'
import { About } from '@/components/about'
import { Skills } from '@/components/skills'
import { Contact } from '@/components/contact'

export default function HomePage() {
  return (
    <>
      {/* Stage 2: Hero */}
      <Hero />

      {/* Stage 3+4: Projects */}
      <Projects />

      {/* Stage 5: About */}
      <About />

      {/* Stage 6: Skills */}
      <Skills />

      {/* Stage 7: Contact */}
      <Contact />
    </>
  )
}
