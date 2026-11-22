import type { Locale } from '@/components/language-provider'
import type { Project } from '@/lib/constants'

export type ProjectFeatureIcon = 'book' | 'terminal' | 'braces' | 'chat' | 'profile' | 'settings'

export interface ScreenshotPreview {
  type: 'screenshots'
  imageSize: { width: number; height: number }
  screens: { name: string; imageIndex: number }[]
}

export type ProjectGalleryContent =
  | ScreenshotPreview
  | { type: 'diagram'; steps: string[] }

export interface ProjectDetailContent {
  kind: 'graduation' | 'application' | 'cli' | 'api'
  platform: 'web' | 'flutter' | 'node' | 'python'
  preview: { type: 'cli' } | ProjectGalleryContent
  features: { key: string; icon: ProjectFeatureIcon }[]
}

// Selected fields from the same export check before and after regenerating the files.
export const CONTEXTOS_EXAMPLE = {
  file: 'team-order/SKILL.md',
  command: 'npx --no-install contextos export all --check --json',
  log: 'https://github.com/kok-o/contextos-agents/blob/4cb27b2210e02a9dedabba75183f887543eb6ba1/examples/readme-demo/evidence/drift/commands.json',
  results: {
    edited: { status: 'drift', hasDrift: true, totalFindings: 20 },
    exported: { status: 'pass', hasDrift: false, totalFindings: 0 },
  },
} as const

export const PROJECT_DETAILS: Record<string, ProjectDetailContent> = {
  contextos: {
    kind: 'cli',
    platform: 'node',
    preview: { type: 'cli' },
    features: [
      { key: 'rules', icon: 'book' },
      { key: 'exports', icon: 'terminal' },
      { key: 'drift', icon: 'braces' },
    ],
  },
  'story-forecaster': {
    kind: 'api',
    platform: 'python',
    preview: { type: 'diagram', steps: ['chapters', 'search', 'model', 'branch'] },
    features: [
      { key: 'retrieval', icon: 'book' },
      { key: 'cutoff', icon: 'braces' },
      { key: 'branches', icon: 'terminal' },
    ],
  },
  'code-ai': {
    kind: 'graduation',
    platform: 'web',
    preview: {
      type: 'screenshots',
      imageSize: { width: 2557, height: 1390 },
      screens: [
        { name: 'editor', imageIndex: 3 },
        { name: 'courses', imageIndex: 4 },
        { name: 'assistant', imageIndex: 2 },
        { name: 'home', imageIndex: 0 },
        { name: 'signIn', imageIndex: 1 },
      ],
    },
    features: [
      { key: 'courses', icon: 'book' },
      { key: 'editor', icon: 'terminal' },
      { key: 'tasks', icon: 'braces' },
      { key: 'assistant', icon: 'chat' },
    ],
  },
  'ai-miky': {
    kind: 'application',
    platform: 'flutter',
    preview: {
      type: 'screenshots',
      imageSize: { width: 579, height: 1263 },
      screens: [
        { name: 'assistant', imageIndex: 1 },
        { name: 'home', imageIndex: 0 },
        { name: 'profile', imageIndex: 2 },
        { name: 'settings', imageIndex: 3 },
      ],
    },
    features: [
      { key: 'chat', icon: 'chat' },
      { key: 'profile', icon: 'profile' },
      { key: 'settings', icon: 'settings' },
    ],
  },
}

/** The same dark image set is used during SSR and the initial hydration render. */
export function getProjectImages(project: Project, locale: Locale, theme: 'dark' | 'light') {
  const localized = project.themeImages?.[locale] || project.themeImages?.en || project.themeImages?.ru
  return localized?.[theme]?.length ? localized[theme] : project.images
}
