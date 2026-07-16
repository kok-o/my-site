// =============================================================================
// SITE CONSTANTS — Single source of truth for all portfolio data
// All components must import from here. No hardcoded strings in components.
// =============================================================================

// ---------------------------------------------------------------------------
// Personal Info
// ---------------------------------------------------------------------------
export const SITE_CONFIG = {
  name: 'Nurkhan Esenbek',
  role: 'Frontend Developer',
  tagline: 'Building modern web applications with a focus on code quality, performance, and user experience.',
  description:
    'I am a Frontend Developer specializing in React, Next.js, and TypeScript. I love creating intuitive, fast, and responsive interfaces that not only look good but also solve real user problems.',
  email: 'esenbeknrhan2@gmail.com',
  availableForWork: true,
} as const

// ---------------------------------------------------------------------------
// SEO / Metadata
// ---------------------------------------------------------------------------
export const SITE_METADATA = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.role}`,
  description: SITE_CONFIG.description,
  url: 'https://kok-o.github.io/my-site', // TODO: Update with your actual domain
  ogImage: '/og-image.png',
  twitterHandle: '@yourhandle', // TODO: Update if you have Twitter/X
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
    href: 'https://linkedin.com/in/nurkhan-esenbek-9b9979419',
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
export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  tags: string[]
  images: string[]
  href?: string
  githubHref?: string
  featured: boolean
  year: number
}

export const PROJECTS: Project[] = [
  {
    id: 'code-ai',
    title: 'CodeAi',
    description:
      'A comprehensive graduation project combining programming courses, interactive problem-solving, an in-browser IDE, and an AI chat assistant.',
    tags: ['React.js', 'Vite', 'Node.js', 'Express.js', 'Monaco Editor', 'Ollama'],
    images: [
      '/projects/codeai.png',
      '/projects/codeai - 2.png',
      '/projects/codeai - 3.png',
      '/projects/codeai - 4.png',
      '/projects/codeai - 5.png',
      '/projects/codeai - 6.png',
      '/projects/codeai - 7.png',
      '/projects/codeai - 8.png',
      '/projects/codeai - 9.png',
      '/projects/codeai - 10.png'
    ],
    href: 'https://codeai-app-npbs.onrender.com/',
    githubHref: 'https://github.com/kok-o/CodeAi',
    featured: true,
    year: 2026,
  },
  {
    id: 'ai-miky',
    title: 'AI Miky',
    description:
      'An AI assistant application built with Flutter, Firebase, and Gemini API for facilitating simple, intelligent conversations.',
    tags: ['Flutter', 'Dart', 'Firebase', 'Gemini API', 'OpenAI', 'Ollama'],
    images: [
      '/projects/aimiky.png',
      '/projects/aimiky - 2.png',
      '/projects/aimiky - 3.png',
      '/projects/aimiky - 4.png'
    ],
    href: 'https://futter-kurs.web.app/',
    githubHref: 'https://github.com/kok-o/ai-miky',
    featured: true,
    year: 2025,
  },
]

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------
export interface SkillCategory {
  category: string
  skills: Skill[]
}

export interface Skill {
  name: string
  icon?: string
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: 'Frontend',
    skills: [
      { name: 'React' },
      { name: 'Next.js' },
      { name: 'TypeScript' },
      { name: 'JavaScript' },
      { name: 'Flutter' },
      { name: 'Dart' },
      { name: 'Tailwind CSS' },
      { name: 'HTML5' },
      { name: 'CSS3' },
      { name: 'Framer Motion' },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Node.js' },
      { name: 'Python' },
      { name: 'C#' },
      { name: 'FastAPI' },
      { name: 'REST API' },
      { name: 'PostgreSQL' },
      { name: 'Firebase' },
      { name: 'Docker' },
    ],
  },
  {
    category: 'AI',
    skills: [
      { name: 'OpenAI API' },
      { name: 'Gemini API' },
      { name: 'Ollama' },
      { name: 'Prompt Engineering' },
    ],
  },
  {
    category: 'Tools',
    skills: [
      { name: 'Git' },
      { name: 'GitHub' },
      { name: 'Figma' },
      { name: 'Postman' },
      { name: 'Vercel' },
      { name: 'VS Code' },
    ],
  },
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
    period: 'Oct 2025 — Nov 2025',
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
    company: 'SpaceLab',
    role: 'Assistant Programmer / Web Designer',
    period: 'May 2025 — Jun 2025',
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
