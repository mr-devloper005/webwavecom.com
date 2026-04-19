import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Mail, MapPin } from 'lucide-react'
import { PageShell } from '@/components/shared/page-shell'
import { Button } from '@/components/ui/button'
import { mockTeamMembers } from '@/data/mock-data'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/team',
    title: `Editorial team | ${SITE_CONFIG.name}`,
    description: `Editors, producers, and engineers who ship ${SITE_CONFIG.name}'s article library and reading experience.`,
    keywords: ['team', 'editors', 'contact', SITE_CONFIG.name],
  })
}

const departments = [
  {
    name: 'Editorial',
    lead: 'Avery Brooks',
    focus: 'Voice, fact-checking, and long-form structure for every story we ship.',
    members: ['Avery Brooks', 'Jordan Lee'],
  },
  {
    name: 'Product & reader experience',
    lead: 'Jordan Lee',
    focus: 'Navigation, typography rhythm, and performance so reading stays effortless.',
    members: ['Jordan Lee', 'Priya Desai'],
  },
  {
    name: 'Platform',
    lead: 'Priya Desai',
    focus: 'Search quality, publishing tools, and the systems that keep the archive fast.',
    members: ['Priya Desai'],
  },
]

export default function TeamPage() {
  return (
    <PageShell
      heroVariant="center"
      eyebrow="Company"
      title="The people behind the publication"
      description={`We are a small, senior group obsessed with reader trust. ${SITE_CONFIG.name} is shaped by editors who still love ink—and engineers who sweat milliseconds.`}
      actions={
        <Button className="rounded-full bg-slate-900 px-6 shadow-md hover:bg-slate-800" asChild>
          <Link href="/careers" className="inline-flex items-center gap-2">
            View open roles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {mockTeamMembers.map((member) => (
          <div key={member.id} className="journal-card flex flex-col overflow-hidden">
            <div className="relative aspect-[4/5] bg-slate-100">
              <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-xl font-semibold text-slate-950">{member.name}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">{member.role}</p>
              <p className="mt-4 flex items-start gap-2 text-sm text-slate-600">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                {member.location}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{member.bio}</p>
              <Button variant="outline" size="sm" className="mt-6 w-full rounded-full border-slate-200" asChild>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  Message
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 space-y-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">How we work</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Three desks, one reader</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Editorial, product, and platform collaborate weekly in critique—not to chase trends, but to sharpen clarity. If a layout fights
            the story, we redesign the layout.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {departments.map((dept) => (
            <div key={dept.name} className="journal-card p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">{dept.lead}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">{dept.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{dept.focus}</p>
              <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-700">
                {dept.members.map((m) => (
                  <li key={m} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" aria-hidden />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 journal-card p-8 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
        <div>
          <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Planning a visit or a podcast segment?</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
            We route press, partnerships, and speaking requests to the right teammate—usually within two business days.
          </p>
        </div>
        <div className="mt-6 flex shrink-0 flex-wrap gap-3 sm:mt-0">
          <Button variant="outline" className="rounded-full border-slate-200 bg-white" asChild>
            <Link href="/press">Press room</Link>
          </Button>
          <Button className="rounded-full bg-slate-900 hover:bg-slate-800" asChild>
            <Link href="/contact">Contact editorial</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  )
}
