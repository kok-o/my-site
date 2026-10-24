export interface SkillUsage {
  id: string
  titleId: string
  descriptionId: string
  href: string
  kind: 'project' | 'contribution' | 'source'
}

/** Concrete examples for each technology displayed in the stack. */
export const SKILL_USAGE: Record<string, readonly SkillUsage[]> = {
  Python: [
    { id: 'story-forecaster', titleId: 'project.story-forecaster.title', descriptionId: 'skills.usage.python.story', href: '/projects/story-forecaster', kind: 'project' },
    { id: 'soup', titleId: 'skills.work.soup', descriptionId: 'skills.usage.python.soup', href: '#contribution-soup', kind: 'contribution' },
  ],
  PyTorch: [
    { id: 'soup', titleId: 'skills.work.soup', descriptionId: 'skills.usage.pytorch.soup', href: '#contribution-soup', kind: 'contribution' },
  ],
  'Transformers / TRL': [
    { id: 'soup', titleId: 'skills.work.soup', descriptionId: 'skills.usage.transformers.soup', href: '#contribution-soup', kind: 'contribution' },
  ],
  FastAPI: [
    { id: 'story-forecaster', titleId: 'project.story-forecaster.title', descriptionId: 'skills.usage.fastapi.story', href: '/projects/story-forecaster', kind: 'project' },
  ],
  pytest: [
    { id: 'soup', titleId: 'skills.work.soup', descriptionId: 'skills.usage.pytest.soup', href: '#contribution-soup', kind: 'contribution' },
    { id: 'story-forecaster', titleId: 'project.story-forecaster.title', descriptionId: 'skills.usage.pytest.story', href: '/projects/story-forecaster', kind: 'project' },
  ],
  TypeScript: [
    { id: 'stroq', titleId: 'skills.work.stroq', descriptionId: 'skills.usage.typescript.stroq', href: '#contribution-stroq', kind: 'contribution' },
    { id: 'portfolio', titleId: 'skills.work.portfolio', descriptionId: 'skills.usage.typescript.portfolio', href: 'https://github.com/kok-o/my-site', kind: 'source' },
  ],
  'Node.js': [
    { id: 'contextos', titleId: 'project.contextos.title', descriptionId: 'skills.usage.node.contextos', href: '/projects/contextos', kind: 'project' },
    { id: 'code-ai', titleId: 'project.code-ai.title', descriptionId: 'skills.usage.node.codeai', href: '/projects/code-ai', kind: 'project' },
  ],
  React: [
    { id: 'code-ai', titleId: 'project.code-ai.title', descriptionId: 'skills.usage.react.codeai', href: '/projects/code-ai', kind: 'project' },
    { id: 'portfolio', titleId: 'skills.work.portfolio', descriptionId: 'skills.usage.react.portfolio', href: 'https://github.com/kok-o/my-site', kind: 'source' },
  ],
  'Next.js': [
    { id: 'portfolio', titleId: 'skills.work.portfolio', descriptionId: 'skills.usage.next.portfolio', href: 'https://github.com/kok-o/my-site', kind: 'source' },
  ],
  Git: [
    { id: 'soup', titleId: 'skills.work.soup', descriptionId: 'skills.usage.git.soup', href: '#contribution-soup', kind: 'contribution' },
    { id: 'stroq', titleId: 'skills.work.stroq', descriptionId: 'skills.usage.git.stroq', href: '#contribution-stroq', kind: 'contribution' },
  ],
}
