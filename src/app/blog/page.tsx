import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, PenLine } from 'lucide-react'
import { PageShell } from '@/components/shared/page-shell'
import { Button } from '@/components/ui/button'
import { mockBlogPosts } from '@/data/mock-data'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/blog',
    title: `Editorial blog | ${SITE_CONFIG.name}`,
    description: `Notes from the desk—how we research, edit, and ship articles at ${SITE_CONFIG.name}.`,
    keywords: ['blog', 'editorial', 'notes', 'publishing', SITE_CONFIG.name],
  })
}

const editorNotes = [
  {
    title: 'How we outline a 3,000-word guide',
    body: 'Start with the reader job-to-be-done, draft a headline stack, then write the “so what” before touching intros.',
  },
  {
    title: 'Art direction without a full photoshoot',
    body: 'We pair licensed photography with tight crops and color grading that matches our slate + ink palette.',
  },
  {
    title: 'What “done” means in our CMS',
    body: 'Accessibility pass, internal link audit, excerpt stress-test on mobile, and a final read aloud.',
  },
]

export default function BlogPage() {
  return (
    <PageShell
      heroVariant="center"
      eyebrow="Blog"
      title="Dispatches from the editorial floor"
      description="Process essays, release notes for readers, and the occasional manifesto about typography. If it helps you publish better, it belongs here."
      actions={
        <>
          <Button variant="outline" className="rounded-full border-slate-200 bg-white px-6 shadow-sm" asChild>
            <Link href="/articles">Open article library</Link>
          </Button>
          <Button className="rounded-full bg-slate-900 px-6 shadow-md hover:bg-slate-800" asChild>
            <Link href="/search" className="inline-flex items-center gap-2">
              Search stories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            <PenLine className="h-4 w-4 text-indigo-500" aria-hidden />
            Latest dispatches
          </div>
          {mockBlogPosts.map((post) => (
            <article key={post.id} className="journal-card p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                <span>{post.tag}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500">{post.date}</span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{post.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{post.excerpt}</p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
                <p className="text-sm text-slate-500">
                  <span className="font-medium text-slate-800">{post.author}</span> · {post.readTime} read
                </p>
                <Link
                  href={`/search?q=${encodeURIComponent(post.title)}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Find related articles
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28">
          <div className="journal-card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Editor notes</h3>
            <ul className="mt-4 space-y-4">
              {editorNotes.map((note) => (
                <li key={note.title} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                  <p className="text-sm font-semibold text-slate-900">{note.title}</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{note.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.25rem] border border-indigo-200/60 bg-indigo-50/50 p-6">
            <h3 className="text-base font-semibold text-slate-950">Pitch us</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Guest essays welcome. Send three clips, a headline idea, and the reader promise in two sentences.
            </p>
            <Button className="mt-4 w-full rounded-full bg-slate-900 hover:bg-slate-800" asChild>
              <Link href="/contact">Email the desk</Link>
            </Button>
          </div>
        </aside>
      </div>
    </PageShell>
  )
}
