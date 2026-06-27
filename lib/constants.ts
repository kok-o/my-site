// =============================================================================
// SITE CONSTANTS — Single source of truth for all portfolio data
// All components must import from here. No hardcoded strings in components.
// =============================================================================

// ---------------------------------------------------------------------------
// Personal Info
// ---------------------------------------------------------------------------
export const SITE_CONFIG = {
  name: 'Nurkhan Esenbek',
  role: 'AI & Full Stack Developer',
  tagline: 'Building fast, scalable and intelligent web experiences with modern technologies.',
  description:
    'Full Stack Developer specialising in modern web applications, clean architecture, and AI-powered solutions.',
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
  { label: 'Contact', href: '#contact' },
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
  image: string
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
    tags: ['Next.js', 'React', 'TypeScript', 'Gemini API', 'Web IDE'],
    image: '/projects/codeai.png',
    githubHref: 'https://github.com/kok-o/CodeAi',
    featured: true,
    year: 2026,
  },
  {
    id: 'ai-miky',
    title: 'AI Miky',
    description:
      'An AI assistant application built with Flutter, Firebase, and Gemini API for facilitating simple, intelligent conversations.',
    tags: ['Flutter', 'Firebase', 'Gemini API', 'Dart'],
    image: '/projects/aimiky.png',
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
      { name: 'Tailwind CSS' },
      { name: 'Framer Motion' },
      { name: 'GraphQL' },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Node.js' },
      { name: 'Python' },
      { name: 'FastAPI' },
      { name: 'PostgreSQL' },
      { name: 'Redis' },
      { name: 'Docker' },
    ],
  },
  {
    category: 'AI / ML',
    skills: [
      { name: 'OpenAI API' },
      { name: 'LangChain' },
      { name: 'Pinecone' },
      { name: 'Hugging Face' },
      { name: 'PyTorch' },
      { name: 'MLflow' },
    ],
  },
  {
    category: 'Infrastructure',
    skills: [
      { name: 'AWS' },
      { name: 'Kubernetes' },
      { name: 'Terraform' },
      { name: 'GitHub Actions' },
      { name: 'Vercel' },
      { name: 'Prometheus' },
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
    id: 'exp-1',
    company: 'AI Startup (Stealth)',
    role: 'Senior Full Stack + AI Engineer',
    period: '2024 — Present',
    description:
      'Leading frontend architecture and AI integration for a B2B SaaS product serving enterprise clients.',
    highlights: [
      'Built LLM-powered document processing pipeline reducing manual review time by 70%',
      'Architected React + Next.js frontend with real-time streaming via Server-Sent Events',
      'Designed RAG system with Pinecone achieving 94% retrieval accuracy',
    ],
    current: true,
  },
  {
    id: 'exp-2',
    company: 'TechCorp',
    role: 'Full Stack Developer',
    period: '2022 — 2024',
    description:
      'Developed and maintained multiple customer-facing products and internal tools.',
    highlights: [
      'Migrated legacy monolith to microservices, improving deployment frequency 5×',
      'Led cross-functional team of 6 engineers to deliver product on schedule',
      'Reduced API response times by 40% through caching and query optimisation',
    ],
    current: false,
  },
]
