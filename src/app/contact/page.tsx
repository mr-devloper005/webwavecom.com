import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, FileText, Mail, MapPin, MessageSquare, Sparkles } from 'lucide-react'
import { PageShell } from '@/components/shared/page-shell'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/contact',
    title: `Contact | ${SITE_CONFIG.name}`,
    description: `Reach the ${SITE_CONFIG.name} editorial desk for pitches, syndication, partnerships, and reader support.`,
    keywords: ['contact', 'editorial', 'partnerships', SITE_CONFIG.name],
  })
}

const lanes = [
  {
    icon: FileText,
    title: 'Editorial & pitches',
    body: 'Send three clips, a headline idea, and the reader promise in two sentences. We reply within five business days when there is a fit.',
  },
  {
    icon: Sparkles,
    title: 'Press & speaking',
    body: 'Request logos, boilerplate, or book a briefing with our editors for podcasts, newsletters, and broadcast segments.',
  },
  {
    icon: MessageSquare,
    title: 'Product & accessibility',
    body: 'Flag broken layouts, contrast issues, or search bugs. Include your browser, URL, and a short screen recording if you can.',
  },
]

const quickFacts = [
  { label: 'Typical reply', value: '2–5 days' },
  { label: 'Desk hours', value: 'Mon–Fri · 9–6 ET' },
  { label: 'Studio', value: 'Remote-first' },
]

export default function ContactPage() {
  return (
    <PageShell
      heroVariant="center"
      eyebrow="Contact"
      title="Let’s build the next story together"
      description={`Tell us what you need—publishing help, a partnership, or a fix on the site. We route every note to the right person on the ${SITE_CONFIG.name} team.`}
      actions={
        <Button variant="outline" className="rounded-full border-slate-200 bg-white px-6 shadow-sm" asChild>
          <Link href="/articles">Browse articles</Link>
        </Button>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="space-y-6">
          <div className="journal-card p-6 sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">Choose the lane that fits</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
              We read every message. Clear subject lines and context up front help us respond with substance—not a template.
            </p>
            <ul className="mt-8 space-y-5">
              {lanes.map((lane) => (
                <li key={lane.title} className="flex gap-4 border-b border-slate-100 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-indigo-600 shadow-sm">
                    <lane.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-950">{lane.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{lane.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {quickFacts.map((item) => (
              <div key={item.label} className="journal-card px-4 py-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[1.25rem] border border-indigo-200/60 bg-gradient-to-br from-indigo-50/80 via-white to-sky-50/40 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" aria-hidden />
              <div>
                <p className="font-semibold text-slate-950">Prefer mail?</p>
                <p className="mt-1 text-sm text-slate-600">
                  Editorial:{' '}
                  <a href={`mailto:hello@${SITE_CONFIG.domain}`} className="font-medium text-indigo-700 underline-offset-2 hover:underline">
                    {`hello@${SITE_CONFIG.domain}`}
                  </a>
                </p>
              </div>
            </div>
            <Button variant="outline" className="mt-4 w-full shrink-0 rounded-full border-white/80 bg-white/90 sm:mt-0 sm:w-auto" asChild>
              <a href={`mailto:hello@${SITE_CONFIG.domain}`} className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Open email
              </a>
            </Button>
          </div>
        </div>

        <div className="lg:sticky lg:top-28">
          <div className="journal-card p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <Mail className="h-4 w-4 text-indigo-500" aria-hidden />
              Send a message
            </div>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">Write to the desk</h2>
            <p className="mt-2 text-sm text-slate-600">
              This form is for demos—submit still feels great while we wire automations on the backend.
            </p>
            <form className="mt-6 grid gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="contact-name">
                  Name
                </label>
                <input
                  id="contact-name"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 text-sm text-slate-900 outline-none ring-indigo-500/25 placeholder:text-slate-400 focus:ring-2"
                  placeholder="Alex Reader"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="contact-email">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 text-sm text-slate-900 outline-none ring-indigo-500/25 placeholder:text-slate-400 focus:ring-2"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="contact-subject">
                  Topic
                </label>
                <input
                  id="contact-subject"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 text-sm text-slate-900 outline-none ring-indigo-500/25 placeholder:text-slate-400 focus:ring-2"
                  placeholder="Partnership, pitch, bug…"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="contact-body">
                  Message
                </label>
                <textarea
                  id="contact-body"
                  className="min-h-[168px] w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 outline-none ring-indigo-500/25 placeholder:text-slate-400 focus:ring-2"
                  placeholder="Share context, links, and what a great outcome looks like for you."
                />
              </div>
              <Button type="submit" className="h-12 rounded-full bg-slate-900 text-sm font-semibold hover:bg-slate-800">
                Send message
              </Button>
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                We read everything—automated receipts are not wired yet on this build.
              </p>
            </form>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
