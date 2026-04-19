'use client'

import type { ReactNode } from 'react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { cn } from '@/lib/utils'

type HeroVariant = 'center' | 'split'

export function PageShell({
  title,
  description,
  actions,
  children,
  heroVariant = 'split',
  eyebrow,
}: {
  title: string
  description?: string
  actions?: ReactNode
  children?: ReactNode
  heroVariant?: HeroVariant
  eyebrow?: string
}) {
  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <NavbarShell />
      <main>
        <section className="border-b border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,#f4f6fb_100%)]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            {heroVariant === 'center' ? (
              <div className="text-center">
                {eyebrow ? (
                  <span className="editorial-label mx-auto inline-flex">
                    {eyebrow}
                  </span>
                ) : null}
                <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
                  {title}
                </h1>
                {description ? (
                  <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                    {description}
                  </p>
                ) : null}
                {actions ? (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{actions}</div>
                ) : null}
              </div>
            ) : (
              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  {eyebrow ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{eyebrow}</p>
                  ) : null}
                  <h1
                    className={cn(
                      'font-semibold tracking-[-0.04em] text-slate-950',
                      eyebrow ? 'mt-3' : '',
                      'text-4xl sm:text-5xl',
                    )}
                  >
                    {title}
                  </h1>
                  {description ? (
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">{description}</p>
                  ) : null}
                </div>
                {actions ? <div className="flex w-full flex-wrap gap-3 lg:w-auto lg:justify-end">{actions}</div> : null}
              </div>
            )}
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">{children}</section>
      </main>
      <Footer />
    </div>
  )
}
