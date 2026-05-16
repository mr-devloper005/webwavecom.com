import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Mail, MessageSquare, Sparkles } from 'lucide-react'
import { PageShell } from '@/components/shared/page-shell'
import { Button } from '@/components/ui/button'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { ContactLeadForm } from "@/components/shared/contact-lead-form";

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
            <ContactLeadForm />
          </div>
        </div>
      </div>
    </PageShell>
  )
}
