import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Layers, Sparkles, Target } from 'lucide-react'
import { PageShell } from '@/components/shared/page-shell'
import { Button } from '@/components/ui/button'
import { mockTeamMembers } from '@/data/mock-data'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/about',
    title: `About ${SITE_CONFIG.name}`,
    description: `How ${SITE_CONFIG.name} publishes long-form articles, field guides, and a calmer reading experience for curious readers.`,
    keywords: ['about', 'editorial', 'mission', 'article platform', SITE_CONFIG.name],
  })
}

const pillars = [
  {
    title: 'Clarity over noise',
    body: 'We strip away dashboard clutter so typography, imagery, and hierarchy do the heavy lifting—like a modern magazine, not a generic portal.',
    icon: BookOpen,
  },
  {
    title: 'Depth you can trust',
    body: 'Every story is structured for scanning first, then reading: clear sections, honest excerpts, and metadata that respects your time.',
    icon: Layers,
  },
  {
    title: 'Built for return visits',
    body: 'Search, categories, and saved sessions help you pick up where you left off—whether you are researching a topic or browsing on a break.',
    icon: Target,
  },
]

const milestones = [
  { year: '2024', label: 'Foundation', detail: 'Launched the editorial stack with article-first navigation and responsive layouts.' },
  { year: '2025', label: 'Scale', detail: 'Expanded topic coverage, improved search relevance, and refined reading surfaces.' },
  { year: '2026', label: 'Today', detail: 'Focused on faster loads, softer motion, and a cohesive resource-center experience.' },
]

export default function AboutPage() {
  return (
    <PageShell
      heroVariant="center"
      eyebrow="About us"
      title={`Inside ${SITE_CONFIG.name}`}
      description={`We are an independent editorial desk publishing practical articles, explainers, and long-form notes for readers who prefer substance over scroll.`}
      actions={
        <>
          <Button variant="outline" className="rounded-full border-slate-200 bg-white px-6 shadow-sm" asChild>
            <Link href="/team">Meet the team</Link>
          </Button>
          <Button className="rounded-full bg-slate-900 px-6 shadow-md hover:bg-slate-800" asChild>
            <Link href="/articles" className="inline-flex items-center gap-2">
              Browse articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="journal-card space-y-6 p-8 sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" aria-hidden />
            Why we exist
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Publishing that feels intentional again</h2>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            {SITE_CONFIG.name} exists because readers deserve a calmer place to learn: fewer interruptions, stronger type, and layouts that
            reward focus. We treat every article as a small product—complete with context, visuals, and a respectful pace.
          </p>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            Our writers and editors work across technology, culture, work, and design—always with the same bar: would we happily read this on
            a Sunday morning? If not, it goes back to the desk.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { value: '120+', label: 'Original guides' },
              { value: '48', label: 'Topic lanes' },
              { value: '24/7', label: 'Searchable archive' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-4 text-center">
                <p className="text-2xl font-semibold text-slate-950">{stat.value}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="journal-card flex gap-4 p-6 sm:p-7">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-indigo-600 shadow-sm">
                <pillar.icon className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-950">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{pillar.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Timeline</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">How the library took shape</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {milestones.map((m) => (
            <div key={m.year} className="journal-card p-6 text-left">
              <p className="text-sm font-semibold text-indigo-600">{m.year}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">{m.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{m.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14">
        <div className="mb-8 flex flex-col gap-2 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">People behind the bylines</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Editorial collective</h2>
          </div>
          <Button variant="ghost" className="self-center text-indigo-600 hover:text-indigo-700 sm:self-auto" asChild>
            <Link href="/team" className="inline-flex items-center gap-2">
              Full roster
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {mockTeamMembers.map((member) => (
            <div key={member.id} className="journal-card overflow-hidden">
              <div className="relative aspect-[4/3] bg-slate-100">
                <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-2 p-6">
                <p className="text-lg font-semibold text-slate-950">{member.name}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{member.role}</p>
                <p className="text-sm leading-relaxed text-slate-600">{member.bio}</p>
                <p className="text-xs text-slate-500">{member.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 rounded-[1.25rem] border border-indigo-200/60 bg-gradient-to-br from-indigo-50/80 via-white to-sky-50/50 p-8 text-center shadow-[var(--shadow-soft)] sm:p-12">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Want to collaborate or syndicate?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          We partner with writers, educators, and product teams who care about reader experience. Tell us what you are building—we will
          point you to the right editor.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button className="rounded-full bg-slate-900 px-6 hover:bg-slate-800" asChild>
            <Link href="/contact">Start a conversation</Link>
          </Button>
          <Button variant="outline" className="rounded-full border-slate-200 bg-white/90 px-6" asChild>
            <Link href="/press">Press kit</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  )
}
