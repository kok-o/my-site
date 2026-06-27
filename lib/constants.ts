// =============================================================================
// SITE CONSTANTS — Single source of truth for all portfolio data
// All components must import from here. No hardcoded strings in components.
// =============================================================================

// ---------------------------------------------------------------------------
// Personal Info
// ---------------------------------------------------------------------------
export const SITE_CONFIG = {
  name: 'Your Name',
  role: 'AI Full Stack Developer',
  tagline: 'Building intelligent products at the intersection of AI and great UX.',
  description:
    'AI Full Stack Developer specialising in LLM-powered applications, scalable APIs, and premium web interfaces.',
  email: 'hello@yourname.dev',
  location: 'Remote · Open to Worldwide',
  availableForWork: true,
} as const

// ---------------------------------------------------------------------------
// SEO / Metadata
// ---------------------------------------------------------------------------
export const SITE_METADATA = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.role}`,
  description: SITE_CONFIG.description,
  url: 'https://yourname.dev',
  ogImage: '/og-image.png',
  twitterHandle: '@yourhandle',
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
    href: 'https://github.com/yourhandle',
    ariaLabel: 'View GitHub profile',
  },
  {
    platform: 'LinkedIn',
    href: 'https://linkedin.com/in/yourhandle',
    ariaLabel: 'View LinkedIn profile',
  },
  {
    platform: 'Twitter',
    href: 'https://twitter.com/yourhandle',
    ariaLabel: 'View Twitter profile',
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
    id: 'ai-chat-platform',
    title: 'AI Chat Platform',
    description:
      'Production-grade LLM chat interface with streaming, RAG pipeline, and multi-model support.',
    tags: ['Next.js', 'OpenAI', 'Pinecone', 'Prisma', 'TypeScript'],
    image: '/projects/ai-chat.png',
    href: 'https://demo.yourname.dev/chat',
    githubHref: 'https://github.com/yourhandle/ai-chat',
    featured: true,
    year: 2024,
  },
  {
    id: 'devops-dashboard',
    title: 'DevOps Dashboard',
    description:
      'Real-time infrastructure monitoring dashboard with AI-powered anomaly detection and auto-remediation.',
    tags: ['React', 'Python', 'FastAPI', 'Prometheus', 'Docker'],
    image: '/projects/devops.png',
    href: 'https://demo.yourname.dev/devops',
    githubHref: 'https://github.com/yourhandle/devops-dashboard',
    featured: true,
    year: 2024,
  },
  {
    id: 'code-review-ai',
    title: 'Code Review AI',
    description:
      'GitHub-integrated AI code reviewer that catches bugs, suggests improvements, and enforces team style guides.',
    tags: ['Node.js', 'GitHub API', 'GPT-4', 'TypeScript', 'PostgreSQL'],
    image: '/projects/code-review.png',
    githubHref: 'https://github.com/yourhandle/code-review-ai',
    featured: true,
    year: 2025,
  },
  {
    id: 'ml-pipeline',
    title: 'ML Training Pipeline',
    description:
      'End-to-end machine learning pipeline with experiment tracking, model versioning, and automated deployment.',
    tags: ['Python', 'MLflow', 'Kubernetes', 'AWS', 'FastAPI'],
    image: '/projects/ml-pipeline.png',
    githubHref: 'https://github.com/yourhandle/ml-pipeline',
    featured: false,
    year: 2023,
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
