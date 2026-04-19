import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/shared/page-shell'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG } from '@/lib/site-config'
import { TaskPostCard } from '@/components/shared/task-post-card'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 3

const matchText = (value: string, query: string) => value.toLowerCase().includes(query)

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')

const compactText = (value: unknown) => {
  if (typeof value !== 'string') return ''
  return stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase()
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}): Promise<Metadata> {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const title = query ? `Search: ${query}` : `Search | ${SITE_CONFIG.name}`
  const description = query
    ? `Results for “${query}” across ${SITE_CONFIG.name}.`
    : `Search the ${SITE_CONFIG.name} article archive and connected posts.`
  return buildPageMetadata({
    path: '/search',
    title,
    description,
    openGraphTitle: title,
    openGraphDescription: description,
  })
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined,
  )
  const posts =
    feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.flatMap((t) => getMockPostsForTask(t.key))

  const filtered = posts.filter((post) => {
    const content = post.content && typeof post.content === 'object' ? post.content : {}
    const typeText = compactText((content as any).type)
    if (typeText === 'comment') return false
    const description = compactText((content as any).description)
    const body = compactText((content as any).body)
    const excerpt = compactText((content as any).excerpt)
    const categoryText = compactText((content as any).category)
    const tags = Array.isArray(post.tags) ? post.tags.join(' ') : ''
    const tagsText = compactText(tags)
    const derivedCategory = categoryText || tagsText
    if (category && !derivedCategory.includes(category)) return false
    if (task && typeText && typeText !== task) return false
    if (!normalized.length) return true
    return (
      matchText(compactText(post.title || ''), normalized) ||
      matchText(compactText(post.summary || ''), normalized) ||
      matchText(description, normalized) ||
      matchText(body, normalized) ||
      matchText(excerpt, normalized) ||
      matchText(tagsText, normalized)
    )
  })

  const results = normalized.length > 0 ? filtered : filtered.slice(0, 24)
  const quickCategories = CATEGORY_OPTIONS.slice(0, 12)

  return (
    <PageShell
      heroVariant="split"
      eyebrow="Browse"
      title={query ? `Results for “${query}”` : 'Search the library'}
      description={
        query
          ? `Showing matches across titles, summaries, tags, and article bodies. Refine with topics on the left or jump back to the full archive.`
          : 'Try a topic, author name, or phrase from an article you remember. When the feed is empty we surface curated mock stories for local demos.'
      }
      actions={
        <form action="/search" className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <input type="hidden" name="master" value="1" />
          {category ? <input type="hidden" name="category" value={category} /> : null}
          {task ? <input type="hidden" name="task" value={task} /> : null}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <Input
              name="q"
              defaultValue={query}
              placeholder="Search articles, tags, topics…"
              className="h-12 rounded-xl border-slate-200 bg-white pl-10 shadow-sm"
            />
          </div>
          <Button type="submit" className="h-12 rounded-full bg-slate-900 px-6 hover:bg-slate-800">
            Search
          </Button>
        </form>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,260px)_1fr] lg:items-start">
        <aside className="space-y-5 lg:sticky lg:top-28">
          <div className="journal-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Jump to a topic</p>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/search"
                  className="block rounded-lg px-2 py-2 text-sm font-semibold text-slate-900 underline decoration-indigo-200 decoration-2 underline-offset-4"
                >
                  All results
                </Link>
              </li>
              {quickCategories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/search?category=${encodeURIComponent(c.slug)}&master=1`}
                    className="block rounded-lg px-2 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.25rem] border border-indigo-200/60 bg-indigo-50/40 p-5">
            <p className="text-sm font-semibold text-slate-900">Looking for something specific?</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Combine a keyword with a topic filter. Advanced boolean search is on the roadmap—tell us what you need via{' '}
              <Link href="/contact" className="font-semibold text-indigo-700 underline-offset-2 hover:underline">
                contact
              </Link>
              .
            </p>
          </div>
        </aside>

        <div>
          {results.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((post) => {
                const taskKey = getPostTaskKey(post)
                const href = taskKey ? buildPostUrl(taskKey, post.slug) : `/posts/${post.slug}`
                return <TaskPostCard key={post.id} post={post} href={href} taskKey={taskKey || undefined} />
              })}
            </div>
          ) : (
            <div className="journal-card border-dashed border-slate-300/90 bg-slate-50/60 p-12 text-center">
              <p className="text-lg font-semibold text-slate-900">No matches yet</p>
              <p className="mt-2 text-sm text-slate-600">Try a shorter keyword, clear the topic filter, or browse the full article index.</p>
              <Button className="mt-6 rounded-full bg-slate-900 hover:bg-slate-800" asChild>
                <Link href="/articles">Go to articles</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  )
}
