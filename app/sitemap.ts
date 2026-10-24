import type { MetadataRoute } from 'next'
import { PROJECTS, SITE_METADATA } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_METADATA.url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...PROJECTS.map((project) => `/projects/${project.id}`).map((path) => ({
      url: `${SITE_METADATA.url}${path}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
