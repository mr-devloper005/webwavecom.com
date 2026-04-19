import type { SiteFactoryRecipe } from '@/design/factory/types'

export const SITE_FACTORY_RECIPE: SiteFactoryRecipe = {
  brandPack: 'directory-clean',
  navbar: 'compact-bar',
  footer: 'columns-footer',
  homeLayout: 'listing-home',
  motionPack: 'minimal',
  primaryTask: 'article',
  enabledTasks: ['article'],
  taskLayouts: {
    article: 'article-journal',
  },
}
