// =============================================================================
// SITE CONSTANTS — Single source of truth for all portfolio data
// All components must import from here. No hardcoded strings in components.
// =============================================================================

// ---------------------------------------------------------------------------
// Personal Info
// ---------------------------------------------------------------------------
export const SITE_CONFIG = {
  name: 'Nurkhan Esenbek',
  role: 'Software Engineer',
  tagline: 'Python services, AI developer tools, and web interfaces.',
  description:
    'Software Engineer building Python services and AI developer tools, contributing to Soup and Stroq, and creating interfaces with React and Next.js.',
  email: 'esenbeknrhan2@gmail.com',
  availableForWork: true,
} as const

// ---------------------------------------------------------------------------
// SEO / Metadata
// ---------------------------------------------------------------------------
export const SITE_METADATA = {
  title: `${SITE_CONFIG.name} | ${SITE_CONFIG.role}`,
  description: SITE_CONFIG.description,
  url: 'https://nurkhan.space',
  ogImage: '/opengraph-image',
  twitterHandle: undefined as string | undefined,
} as const

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------
export interface NavLink {
  label: string
  href: string
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contacts', href: '#contact' },
]

// ---------------------------------------------------------------------------
// Social Links
// ---------------------------------------------------------------------------
export interface SocialLink {
  platform: string
  href: string
  ariaLabel: string
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: 'GitHub',
    href: 'https://github.com/kok-o',
    ariaLabel: 'View GitHub profile',
  },
  {
    platform: 'LinkedIn',
    href: 'https://www.linkedin.com/in/nurkhan-esenbek/',
    ariaLabel: 'View LinkedIn profile',
  },
  {
    platform: 'Telegram',
    href: 'https://t.me/k0ko_tg',
    ariaLabel: 'Contact on Telegram',
  },
]

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export interface ProjectThemeImages {
  dark: string[]
  light: string[]
}

export interface ProjectLocalizedThemeImages {
  en?: ProjectThemeImages
  ru?: ProjectThemeImages
  kz?: ProjectThemeImages
  [key: string]: ProjectThemeImages | undefined
}

export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  tags: string[]
  images: string[]
  themeImages?: ProjectLocalizedThemeImages
  /** Light-only treatment for monochrome captures without a separate light image. */
  lightImageFilter?: string
  href?: string
  githubHref?: string
  featured: boolean
  year: number
}

export const PROJECTS: Project[] = [
  {
    id: 'contextos',
    title: 'ContextOS',
    description: 'A Node.js CLI for maintaining coding-agent rules, exporting tool configurations, and checking for outdated exports in CI.',
    tags: ['Node.js', 'JavaScript', 'CLI', 'GitHub Actions', 'MCP'],
    images: ['/projects/contextos/cli-demo.png'],
    lightImageFilter: 'grayscale(1) invert(1)',
    githubHref: 'https://github.com/kok-o/contextos-agents',
    featured: true,
    year: 2026,
  },
  {
    id: 'story-forecaster',
    title: 'Story Forecaster',
    description: 'A Python API for story forecasting with BM25 retrieval, chapter cutoffs, isolated continuation branches, and validated story-state changes.',
    tags: ['Python', 'FastAPI', 'SQLite', 'BM25', 'Gemini API'],
    images: ['/projects/story-forecaster/workflow-en-dark.png'],
    themeImages: {
      en: {
        dark: ['/projects/story-forecaster/workflow-en-dark.png'],
        light: ['/projects/story-forecaster/workflow-en-light.png'],
      },
      ru: {
        dark: ['/projects/story-forecaster/workflow-ru-dark.png'],
        light: ['/projects/story-forecaster/workflow-ru-light.png'],
      },
      kz: {
        dark: ['/projects/story-forecaster/workflow-kz-dark.png'],
        light: ['/projects/story-forecaster/workflow-kz-light.png'],
      },
    },
    githubHref: 'https://github.com/kok-o/story-forecaster',
    featured: true,
    year: 2026,
  },
  {
    id: 'code-ai',
    title: 'CodeAi',
    description:
      'A graduation project with programming courses, exercises, a browser code editor, and an AI chat.',
    tags: ['React.js', 'Vite', 'Node.js', 'Express.js', 'Monaco Editor', 'Ollama'],
    images: [
      '/projects/codeai/ai_code1_ru_dark.png',
      '/projects/codeai/ai_code2_ru_dark.png',
      '/projects/codeai/ai_code3_ru_dark.png',
      '/projects/codeai/ai_code4_ru_dark.png',
      '/projects/codeai/ai_code5_ru_dark.png',
    ],
    themeImages: {
      en: {
        dark: [
          '/projects/codeai/ai_code1_en_dark.png',
          '/projects/codeai/ai_code2_en_dark.png',
          '/projects/codeai/ai_code3_en_dark.png',
          '/projects/codeai/ai_code4_en_dark.png',
          '/projects/codeai/ai_code5_en_dark.png',
        ],
        light: [
          '/projects/codeai/ai_code1_en_light.png',
          '/projects/codeai/ai_code2_en_light.png',
          '/projects/codeai/ai_code3_en_light.png',
          '/projects/codeai/ai_code4_en_light.png',
          '/projects/codeai/ai_code5_ru_light.png',
        ],
      },
      ru: {
        dark: [
          '/projects/codeai/ai_code1_ru_dark.png',
          '/projects/codeai/ai_code2_ru_dark.png',
          '/projects/codeai/ai_code3_ru_dark.png',
          '/projects/codeai/ai_code4_ru_dark.png',
          '/projects/codeai/ai_code5_ru_dark.png',
        ],
        light: [
          '/projects/codeai/ai_code1_ru_light.png',
          '/projects/codeai/ai_code2_en_light.png',
          '/projects/codeai/ai_code3_ru_light.png',
          '/projects/codeai/ai_code4_ru_light.png',
          '/projects/codeai/ai_code5_ru_light.png',
        ],
      },
      kz: {
        dark: [
          '/projects/codeai/ai_code1_ru_dark.png',
          '/projects/codeai/ai_code2_ru_dark.png',
          '/projects/codeai/ai_code3_ru_dark.png',
          '/projects/codeai/ai_code4_ru_dark.png',
          '/projects/codeai/ai_code5_ru_dark.png',
        ],
        light: [
          '/projects/codeai/ai_code1_ru_light.png',
          '/projects/codeai/ai_code2_en_light.png',
          '/projects/codeai/ai_code3_ru_light.png',
          '/projects/codeai/ai_code4_ru_light.png',
          '/projects/codeai/ai_code5_ru_light.png',
        ],
      },
    },
    href: 'https://codeai-app-npbs.onrender.com/',
    githubHref: 'https://github.com/kok-o/CodeAi',
    featured: true,
    year: 2026,
  },
  {
    id: 'ai-miky',
    title: 'AI Miky',
    description:
      'An AI chat app built with Flutter, Firebase, and Gemini API, with a profile and settings.',
    tags: ['Flutter', 'Dart', 'Firebase', 'Gemini API', 'OpenAI', 'Ollama'],
    images: [
      '/projects/aimiku/ai_miku1_ru_dark.png',
      '/projects/aimiku/ai_miku2_ru_dark.png',
      '/projects/aimiku/ai_miku3_ru_dark.png',
      '/projects/aimiku/ai_miku4_ru_dark.png',
    ],
    themeImages: {
      en: {
        dark: [
          '/projects/aimiku/ai_miku1_en_dark.png',
          '/projects/aimiku/ai_miku2_en_dark.png',
          '/projects/aimiku/ai_miku3_en_dark.png',
          '/projects/aimiku/ai_miku4_en_dark.png',
        ],
        light: [
          '/projects/aimiku/ai_miku1_en_light.png',
          '/projects/aimiku/ai_miku2_en_light.png',
          '/projects/aimiku/ai_miku3_en_light.png',
          '/projects/aimiku/ai_miku4_en_light.png',
        ],
      },
      ru: {
        dark: [
          '/projects/aimiku/ai_miku1_ru_dark.png',
          '/projects/aimiku/ai_miku2_ru_dark.png',
          '/projects/aimiku/ai_miku3_ru_dark.png',
          '/projects/aimiku/ai_miku4_ru_dark.png',
        ],
        light: [
          '/projects/aimiku/ai_miku1_ru_light.png',
          '/projects/aimiku/ai_miku2_ru_light.png',
          '/projects/aimiku/ai_miku3_ru_light.png',
          '/projects/aimiku/ai_miku4_ru_light.png',
        ],
      },
      kz: {
        dark: [
          '/projects/aimiku/ai_miku1_ru_dark.png',
          '/projects/aimiku/ai_miku2_ru_dark.png',
          '/projects/aimiku/ai_miku3_ru_dark.png',
          '/projects/aimiku/ai_miku4_ru_dark.png',
        ],
        light: [
          '/projects/aimiku/ai_miku1_ru_light.png',
          '/projects/aimiku/ai_miku2_ru_light.png',
          '/projects/aimiku/ai_miku3_ru_light.png',
          '/projects/aimiku/ai_miku4_ru_light.png',
        ],
      },
    },
    href: 'https://futter-kurs.web.app/',
    githubHref: 'https://github.com/kok-o/ai-miky',
    featured: true,
    year: 2025,
  },
]

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------
export interface Skill {
  name: string
  icon?: string
}

export const SKILLS: Skill[] = [
  { name: 'Python', icon: '/skills/python.svg' },
  { name: 'PyTorch', icon: '/skills/pytorch.svg' },
  { name: 'Transformers / TRL', icon: '/skills/huggingface.svg' },
  { name: 'FastAPI', icon: '/skills/fastapi.svg' },
  { name: 'pytest', icon: '/skills/pytest.svg' },
  { name: 'TypeScript', icon: '/skills/typescript.svg' },
  { name: 'Node.js', icon: '/skills/nodedotjs.svg' },
  { name: 'React', icon: '/skills/react.svg' },
  { name: 'Next.js', icon: '/skills/nextdotjs.svg' },
  { name: 'Git', icon: '/skills/git.svg' },
]

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------
export interface Experience {
  id: string
  company: string
  role: string
  period: string
  description: string
  highlights: string[]
  current: boolean
}

export const EXPERIENCE: Experience[] = [
  {
    id: 'exp-iqadam',
    company: 'iQadam Systems',
    role: 'Frontend Developer Intern',
    period: 'Oct - Nov 2025',
    description:
      'Participated in the development of web applications as part of a team, implementing user interfaces and integrating with the backend.',
    highlights: [
      'Coded responsive pages from Figma designs',
      'Implemented functionality using JavaScript and React',
      'Integrated the interface with REST APIs',
      'Optimized performance, fixed bugs, and improved user experience',
      'Worked with Git and participated in team development',
    ],
    current: false,
  },
  {
    id: 'exp-spacelab',
    company: 'SpaceLab LTD',
    role: 'Assistant Programmer / Web Designer',
    period: 'May - Jun 2025',
    description:
      'Participated in designing user interfaces and preparing designs for development.',
    highlights: [
      'Developed website designs in Figma',
      'Created layouts and interactive interface prototypes',
      'Prepared design mockups for handover to developers',
      'Gained practical experience in collaborative work on digital products',
    ],
    current: false,
  },
]
