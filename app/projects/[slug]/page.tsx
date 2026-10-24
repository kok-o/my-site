import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectDetail } from '@/components/project-detail'
import { PROJECTS, SITE_CONFIG, SITE_METADATA } from '@/lib/constants'
import { PROJECT_DETAILS } from '@/lib/project-details'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return PROJECTS.filter((project) => PROJECT_DETAILS[project.id]).map((project) => ({ slug: project.id }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = PROJECTS.find((item) => item.id === slug)
  if (!project || !PROJECT_DETAILS[project.id]) notFound()

  const url = `${SITE_METADATA.url}/projects/${project.id}`
  const image = project.themeImages?.en?.dark[0] || project.images[0]
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} | ${SITE_CONFIG.name}`,
      description: project.description,
      url,
      type: 'website',
      images: [{ url: image, alt: `${project.title}: project overview` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | ${SITE_CONFIG.name}`,
      description: project.description,
      images: [image],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const index = PROJECTS.findIndex((project) => project.id === slug)
  const project = PROJECTS[index]
  if (!project || !PROJECT_DETAILS[project.id]) notFound()

  return <ProjectDetail project={project} nextProject={PROJECTS[(index + 1) % PROJECTS.length]} />
}
