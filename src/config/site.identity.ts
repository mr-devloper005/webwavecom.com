export const siteIdentity = {
  code: process.env.NEXT_PUBLIC_SITE_CODE || 'ww6m2q8x4v',
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Web Wave Com',
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || 'Articles, commentary, and readable insights',
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'A clean article platform built for readable publishing, commentary, and ongoing editorial updates.',
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || 'webwavecom.com',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://webwavecom.com',
  ogImage: process.env.NEXT_PUBLIC_SITE_OG_IMAGE || '/og-default.png',
  googleMapsEmbedApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY || 'AIzaSyBco7dIECu3rJWjP3J0MImnR_uxlbeqAe0',

} as const

export const defaultAuthorProfile = {
  name: siteIdentity.name,
  avatar: '/placeholder.svg?height=80&width=80',
} as const

