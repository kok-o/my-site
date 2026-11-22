// Home page — Server Component
// Composes all portfolio sections. No business logic here.
// Sections are added one at a time as they are built (Stages 2–7).

import { Suspense } from 'react'
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

      {/* Each server-rendered section can hydrate independently of the first screen. */}
      <Suspense fallback={null}><Projects /></Suspense>
      <Suspense fallback={null}><About /></Suspense>
      <Suspense fallback={null}><Skills /></Suspense>
      <Suspense fallback={null}><Contact /></Suspense>
    </>
  )
}
