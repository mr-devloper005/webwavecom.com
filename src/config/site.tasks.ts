export const siteTaskDefinitions = [
  {
    key: 'article',
    label: 'Articles',
    route: '/articles',
    description: 'Long-form guides, essays, and editorial features.',
    contentType: 'article',
    enabled: true,
  },
] as const

export const siteTaskViews = {
  article: '/articles',
} as const
