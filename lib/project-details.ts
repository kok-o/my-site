import type { Locale } from '@/components/language-provider'
import type { Project } from '@/lib/constants'

export type ProjectFeatureIcon = 'book' | 'terminal' | 'braces' | 'chat' | 'profile' | 'settings'

export interface ProjectDetailContent {
  kind: 'graduation' | 'application' | 'cli' | 'api'
  platform: 'web' | 'flutter' | 'node' | 'python'
  mediaType?: 'demo' | 'diagram'
  screens: string[]
  features: { key: string; icon: ProjectFeatureIcon }[]
}

export const PROJECT_DETAILS: Record<string, ProjectDetailContent> = {
  contextos: {
    kind: 'cli',
    platform: 'node',
    mediaType: 'demo',
    screens: ['workflow'],
    features: [
      { key: 'rules', icon: 'book' },
      { key: 'exports', icon: 'terminal' },
      { key: 'drift', icon: 'braces' },
    ],
  },
  'story-forecaster': {
    kind: 'api',
    platform: 'python',
    mediaType: 'diagram',
    screens: ['workflow'],
    features: [
      { key: 'retrieval', icon: 'book' },
      { key: 'cutoff', icon: 'braces' },
      { key: 'branches', icon: 'terminal' },
    ],
  },
  'code-ai': {
    kind: 'graduation',
    platform: 'web',
    screens: ['home', 'signIn', 'assistant', 'editor', 'courses'],
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
    screens: ['home', 'assistant', 'profile', 'settings'],
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
