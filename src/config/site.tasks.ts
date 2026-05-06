export const siteTaskDefinitions = [
  {
  key: 'article',
  label: 'Article',
  route: '/article',
  description: 'Curated article content.',
  contentType: 'article',
  enabled: true,
},
] as const

export const siteTaskViews = {
  article: '/articles',
} as const
