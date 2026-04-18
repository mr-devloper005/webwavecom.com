'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Download, Newspaper, Sparkles } from 'lucide-react'
import { PageShell } from '@/components/shared/page-shell'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { mockPressAssets, mockPressCoverage } from '@/data/mock-data'
import { SITE_CONFIG } from '@/lib/site-config'

export default function PressPage() {
  const { toast } = useToast()
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null)
  const activeAsset = mockPressAssets.find((asset) => asset.id === activeAssetId)

  return (
    <PageShell
      heroVariant="center"
      eyebrow="Press"
      title="Media room & brand resources"
      description="Download approved logos, UI captures, and guidelines—or scan recent coverage. Everything here is cleared for editorial and broadcast use."
      actions={
        <Button variant="outline" className="rounded-full border-slate-200 bg-white px-6 shadow-sm" asChild>
          <Link href="/contact">Talk to communications</Link>
        </Button>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="journal-card overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <Download className="h-4 w-4 text-indigo-500" aria-hidden />
              Press kit downloads
            </div>
            <h2 className="mt-2 text-xl font-semibold text-slate-950 sm:text-2xl">Brand-ready assets</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Each bundle includes raster + vector formats where applicable.               Need something custom? Email {`press@${SITE_CONFIG.domain}`} from a verified outlet domain.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {mockPressAssets.map((asset) => (
              <div key={asset.id} className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <div>
                  <p className="font-semibold text-slate-950">{asset.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{asset.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                    {asset.fileType}
                  </span>
                  <Button size="sm" variant="outline" className="rounded-full border-slate-200" onClick={() => setActiveAssetId(asset.id)}>
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="rounded-full bg-slate-900 hover:bg-slate-800"
                    onClick={() =>
                      toast({
                        title: 'Download started',
                        description: `${asset.title} is downloading.`,
                      })
                    }
                  >
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            <Newspaper className="h-4 w-4 text-indigo-500" aria-hidden />
            Coverage highlights
          </div>
          {mockPressCoverage.map((item) => (
            <div key={item.id} className="journal-card p-6 transition hover:border-indigo-200/80">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{item.outlet}</p>
              <p className="mt-3 text-base font-medium leading-snug text-slate-950">{item.headline}</p>
              <p className="mt-3 text-xs text-slate-500">{item.date}</p>
            </div>
          ))}

          <div className="rounded-[1.25rem] border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-2 text-indigo-600">
              <Sparkles className="h-4 w-4" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-wide">Boilerplate</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {SITE_CONFIG.name} is an editorial platform for long-form articles and resource libraries. Writers, editors, and product
              designers collaborate in-house to ship calm reading experiences for professionals and curious readers worldwide.
            </p>
          </div>
        </div>
      </div>

      <Dialog open={Boolean(activeAsset)} onOpenChange={() => setActiveAssetId(null)}>
        <DialogContent className="max-w-3xl border-slate-200">
          <DialogHeader>
            <DialogTitle>{activeAsset?.title}</DialogTitle>
          </DialogHeader>
          {activeAsset?.previewUrl && (
            <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <Image src={activeAsset.previewUrl} alt={activeAsset.title} fill className="object-cover" />
            </div>
          )}
          <p className="text-sm text-slate-600">{activeAsset?.description}</p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="rounded-full" onClick={() => setActiveAssetId(null)}>
              Close
            </Button>
            <Button
              className="rounded-full bg-slate-900 hover:bg-slate-800"
              onClick={() =>
                toast({
                  title: 'Download started',
                  description: `${activeAsset?.title} is downloading.`,
                })
              }
            >
              Download {activeAsset?.fileType}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}
