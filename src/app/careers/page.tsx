import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Laptop, Users } from 'lucide-react'
import { PageShell } from '@/components/shared/page-shell'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/careers',
    title: `Careers | ${SITE_CONFIG.name}`,
    description: `Join ${SITE_CONFIG.name} and help build a reader-first article platform—remote-friendly, editorially rigorous, and design-obsessed.`,
    keywords: ['careers', 'jobs', 'editorial', 'remote', SITE_CONFIG.name],
  })
}

const roles = [
  {
    title: 'Senior Staff Writer',
    location: 'Remote (US time zones)',
    type: 'Full-time',
    level: 'Senior',
    summary: 'Own a vertical of guides and features—from pitch to publish—with mentorship from our lead editors.',
  },
  {
    title: 'Frontend Engineer, Reader Experience',
    location: 'Hybrid · New York',
    type: 'Full-time',
    level: 'Mid–Senior',
    summary: 'Ship performant article layouts, search, and accessibility improvements alongside design and editorial.',
  },
  {
    title: 'Audience & newsletter editor',
    location: 'Remote',
    type: 'Contract-to-hire',
    level: 'Mid',
    summary: 'Craft weekly dispatches, experiment with subject lines, and translate analytics into editorial decisions.',
  },
]

const benefits = [
  { title: 'Remote-first', body: 'Async-friendly rituals with two core collaboration days each week.' },
  { title: 'Learning budget', body: '$2,000 annually for courses, books, and conferences that sharpen your craft.' },
  { title: 'Editorial autonomy', body: 'Writers partner directly with art and engineering—no endless stakeholder chains.' },
  { title: 'Health & balance', body: 'Medical, dental, vision, and a mandatory minimum away from Slack each quarter.' },
]

const process = [
  { step: '01', label: 'Intro call', detail: '30 minutes with hiring manager + a teammate you would work with daily.' },
  { step: '02', label: 'Showcase', detail: 'Take-home or portfolio review tailored to the role—no whiteboard trivia.' },
  { step: '03', label: 'Culture conversation', detail: 'Meet cross-functional partners and ask anything about how we ship.' },
  { step: '04', label: 'Offer', detail: 'Transparent leveling, equity where applicable, and a written 90-day plan.' },
]

export default function CareersPage() {
  return (
    <PageShell
      heroVariant="center"
      eyebrow="Careers"
      title="Build the next chapter of our article library"
      description={`${SITE_CONFIG.name} is hiring editors, engineers, and audience specialists who believe calm software can carry serious ideas.`}
      actions={
        <Button className="rounded-full bg-slate-900 px-6 shadow-md hover:bg-slate-800" asChild>
          <Link href="/contact" className="inline-flex items-center gap-2">
            Introduce yourself
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            <Laptop className="h-4 w-4 text-indigo-500" aria-hidden />
            Open positions
          </div>
          {roles.map((role) => (
            <div key={role.title} className="journal-card p-6 sm:p-8">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                  {role.level}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                  {role.type}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">{role.title}</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <Clock className="h-4 w-4" aria-hidden />
                {role.location}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{role.summary}</p>
              <Button variant="outline" className="mt-6 rounded-full border-slate-200" asChild>
                <Link href="/contact">Apply for this role</Link>
              </Button>
            </div>
          ))}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28">
          <div className="journal-card p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <Users className="h-4 w-4 text-indigo-500" aria-hidden />
              Why join
            </div>
            <h3 className="mt-3 text-lg font-semibold text-slate-950">We optimize for craft</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Small teams, high trust, and a backlog that is mostly reader-facing improvements—not meetings about meetings.
            </p>
            <ul className="mt-6 space-y-4">
              {benefits.map((b) => (
                <li key={b.title} className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900">{b.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{b.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div className="mt-16">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Interview journey</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">What to expect</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p) => (
            <div key={p.step} className="journal-card p-6">
              <p className="text-2xl font-semibold text-indigo-500/90">{p.step}</p>
              <h3 className="mt-2 text-base font-semibold text-slate-950">{p.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
