import type { ComponentType, CSSProperties } from 'react'
import styles from './project-header-art.module.css'

const gridHighlights = [
  { x: 24, row: 3, phase: 5 },
  { x: 38, row: 8, phase: 1 },
  { x: 42, row: 8, phase: 8 },
  { x: 51, row: 4, phase: 3 },
  { x: 65, row: 3, phase: 7 },
  { x: 74, row: 2, phase: 2 },
  { x: 74, row: 7, phase: 4 },
  { x: 79, row: 6, phase: 9 },
  { x: 93, row: 5, phase: 6 },
]

function StoryBranches() {
  return (
    <>
      <g strokeDasharray="2 6" opacity=".45">
        <path d="M-12 165h74M520 67h114M537 165h76M497 253h99" />
        <path d="M322 113h30c39 0 38-72 84-72h117" />
      </g>
      <path d="M62 165h474" />
      <path d="M204 165c51 0 40-52 90-52h60c55 0 47-46 103-46h63" />
      <path d="M348 165c51 0 43 88 98 88h51" />
      {[62, 132, 204, 276, 348, 429, 536].map((x) => (
        <circle key={x} cx={x} cy="165" r="3.4" fill="var(--background)" />
      ))}
      <g fill="var(--background)">
        <circle cx="322" cy="113" r="3.4" />
        <circle cx="477" cy="67" r="3.4" />
        <circle cx="520" cy="67" r="4.5" />
        <circle cx="497" cy="253" r="4.5" />
      </g>
      <circle className={styles.signal} cx="520" cy="67" r="10" />
    </>
  )
}

function EditorLines() {
  return (
    <>
      <g opacity=".42" strokeDasharray="2 4">
        <path d="M217 38v246M260 82v143M288 121v67" />
      </g>
      <g strokeLinecap="round" strokeWidth="2.2">
        <path d="M237 57h31m13 0h67m13 0h14M260 89h21m11 0h60m14 0h29" />
        <path d="M288 121h39m12 0h76m12 0h21M316 152h40m12 0h28m11 0h76" />
        <path d="M288 185h23m13 0h65M260 217h36m12 0h66m12 0h20M237 249h33" />
      </g>
      <g opacity=".63" strokeLinecap="round" strokeLinejoin="round">
        <path d="m194 49-9 8 9 8m-20-16-9 8 9 8M187 240l9 9-9 9" />
        <path d="M444 83c-5 0-5 3-5 7v4c0 3-1 5-5 5 4 0 5 2 5 5v4c0 4 0 7 5 7" />
      </g>
      <rect x="217" y="199" width="275" height="35" rx="3" fill="currentColor" stroke="none" opacity=".09" />
      <path className={styles.signal} d="M416 208v18" strokeWidth="2.4" />
    </>
  )
}

function ChatThread() {
  return (
    <>
      <path d="M180 48h190a13 13 0 0 1 13 13v33a13 13 0 0 1-13 13H205l-24 12v-12h-1a13 13 0 0 1-13-13V61a13 13 0 0 1 13-13Z" />
      <path d="M347 128h166a13 13 0 0 1 13 13v56l-24-12H347a13 13 0 0 1-13-13v-31a13 13 0 0 1 13-13Z" />
      <path d="M203 218h78a13 13 0 0 1 13 13v21a13 13 0 0 1-13 13h-54l-24 12v-12a13 13 0 0 1-13-13v-21a13 13 0 0 1 13-13Z" />
      <g strokeLinecap="round" opacity=".68" strokeWidth="2">
        <path d="M190 71h93m12 0h45M190 85h67M358 151h90m12 0h31M358 165h68" />
      </g>
      <g className={styles.replyDots} fill="currentColor" stroke="none">
        <circle cx="226" cy="242" r="3.5" />
        <circle cx="242" cy="242" r="3.5" />
        <circle cx="258" cy="242" r="3.5" />
      </g>
    </>
  )
}

const drawings: Readonly<Partial<Record<string, { Drawing: ComponentType; viewBox: string }>>> = {
  'story-forecaster': { Drawing: StoryBranches, viewBox: '0 22 590 250' },
  'code-ai': { Drawing: EditorLines, viewBox: '128 24 415 280' },
  'ai-miky': { Drawing: ChatThread, viewBox: '131 26 435 273' },
}

export function ProjectHeaderArt({ projectId }: { projectId: string }) {
  if (projectId === 'contextos') {
    return (
      <div className={`${styles.art} ${styles.grid}`} aria-hidden="true">
        {gridHighlights.map(({ x, row, phase }) => (
          <span key={`${x}-${row}`} style={{ '--x': `${x}%`, '--row': row, '--delay': `-${phase}s` } as CSSProperties} />
        ))}
      </div>
    )
  }

  const artwork = drawings[projectId]
  if (!artwork) return null
  const { Drawing, viewBox } = artwork

  return (
    <div className={styles.art} aria-hidden="true">
      <svg className={styles.drawing} viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="1.4" focusable="false">
        <Drawing />
      </svg>
    </div>
  )
}
