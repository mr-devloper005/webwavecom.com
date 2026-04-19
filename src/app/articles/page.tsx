import type { Metadata } from 'next'
import { TaskListPage } from '@/components/tasks/task-list-page'
import { buildPageMetadata } from '@/lib/seo'
import { SITE_CONFIG } from '@/lib/site-config'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/articles',
    title: `Article library | ${SITE_CONFIG.name}`,
    description: `Browse essays, guides, and field notes from ${SITE_CONFIG.name}—filter by topic, search inside stories, and read in a calm editorial layout.`,
    keywords: ['articles', 'library', 'guides', 'essays', SITE_CONFIG.name],
  })
}

export default function ArticlesPage({ searchParams }: { searchParams?: { category?: string } }) {
  return <TaskListPage task="article" category={searchParams?.category} />;
}
