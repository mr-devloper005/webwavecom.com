import Link from 'next/link'
import { ArrowRight, Building2, FileText, Image as ImageIcon, LayoutGrid, Plus, Search, Tag, User } from 'lucide-react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { TaskListClient } from '@/components/tasks/task-list-client'
import { SchemaJsonLd } from '@/components/seo/schema-jsonld'
import { fetchTaskPosts } from '@/lib/task-data'
import { SITE_CONFIG, getTaskConfig, type TaskKey } from '@/lib/site-config'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { taskIntroCopy } from '@/config/site.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { TASK_LIST_PAGE_OVERRIDE_ENABLED, TaskListPageOverride } from '@/overrides/task-list-page'

const taskIcons: Record<TaskKey, any> = {
  listing: Building2,
  article: FileText,
  image: ImageIcon,
  profile: User,
  classified: Tag,
  sbm: LayoutGrid,
  social: LayoutGrid,
  pdf: FileText,
  org: Building2,
  comment: FileText,
}

const variantShells = {
  'listing-directory': 'bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.08),transparent_24%),linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)]',
  'listing-showcase': 'bg-[linear-gradient(180deg,#ffffff_0%,#f4f9ff_100%)]',
  'article-editorial': 'bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.08),transparent_20%),linear-gradient(180deg,#fff8ef_0%,#ffffff_100%)]',
  'article-journal': 'bg-[linear-gradient(180deg,#fbfcff_0%,#f4f6fb_100%)]',
  'image-masonry': 'bg-[linear-gradient(180deg,#09101d_0%,#111c2f_100%)] text-white',
  'image-portfolio': 'bg-[linear-gradient(180deg,#07111f_0%,#13203a_100%)] text-white',
  'profile-creator': 'bg-[linear-gradient(180deg,#0a1120_0%,#101c34_100%)] text-white',
  'profile-business': 'bg-[linear-gradient(180deg,#f6fbff_0%,#ffffff_100%)]',
  'classified-bulletin': 'bg-[linear-gradient(180deg,#edf3e4_0%,#ffffff_100%)]',
  'classified-market': 'bg-[linear-gradient(180deg,#f4f6ef_0%,#ffffff_100%)]',
  'sbm-curation': 'bg-[linear-gradient(180deg,#fff7ee_0%,#ffffff_100%)]',
  'sbm-library': 'bg-[linear-gradient(180deg,#f7f8fc_0%,#ffffff_100%)]',
} as const

export async function TaskListPage({ task, category }: { task: TaskKey; category?: string }) {
  if (TASK_LIST_PAGE_OVERRIDE_ENABLED) {
    return await TaskListPageOverride({ task, category })
  }

  const taskConfig = getTaskConfig(task)
  const posts = await fetchTaskPosts(task, 30)
  const normalizedCategory = category ? normalizeCategory(category) : 'all'
  const intro = taskIntroCopy[task]
  const baseUrl = SITE_CONFIG.baseUrl.replace(/\/$/, '')
  const schemaItems = posts.slice(0, 10).map((post, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${baseUrl}${taskConfig?.route || '/posts'}/${post.slug}`,
    name: post.title,
  }))
  const { recipe } = getFactoryState()
  const layoutKey = recipe.taskLayouts[task as keyof typeof recipe.taskLayouts] || `${task}-${task === 'listing' ? 'directory' : 'editorial'}`
  const shellClass = variantShells[layoutKey as keyof typeof variantShells] || 'bg-background'
  const Icon = taskIcons[task] || LayoutGrid
  const isArticleReadingLayout = layoutKey === 'article-editorial' || layoutKey === 'article-journal'

  const isDark = ['image-masonry', 'image-portfolio', 'profile-creator'].includes(layoutKey)
  const ui = isDark
    ? {
        muted: 'text-slate-300',
        panel: 'border border-white/10 bg-white/6',
        soft: 'border border-white/10 bg-white/5',
        input: 'border-white/10 bg-white/6 text-white',
        button: 'bg-white text-slate-950 hover:bg-slate-200',
      }
    : layoutKey.startsWith('article') || layoutKey.startsWith('sbm')
      ? {
          muted: 'text-slate-600',
          panel: 'border border-slate-200/90 bg-white shadow-[var(--shadow-soft)]',
          soft: 'border border-slate-200/80 bg-white/90',
          input: 'border border-slate-200 bg-slate-50/80 text-slate-900',
          button: 'bg-slate-900 text-white hover:bg-slate-800',
        }
      : {
          muted: 'text-slate-600',
          panel: 'border border-slate-200 bg-white',
          soft: 'border border-slate-200 bg-slate-50',
          input: 'border border-slate-200 bg-white text-slate-950',
          button: 'bg-slate-950 text-white hover:bg-slate-800',
        }

  return (
    <div className={`min-h-screen ${shellClass}`}>
      <NavbarShell />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {task === 'listing' ? (
          <SchemaJsonLd
            data={[
              {
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'Business Directory Listings',
                itemListElement: schemaItems,
              },
              {
                '@context': 'https://schema.org',
                '@type': 'LocalBusiness',
                name: SITE_CONFIG.name,
                url: `${baseUrl}/listings`,
                areaServed: 'Worldwide',
              },
            ]}
          />
        ) : null}
        {task === 'article' || task === 'classified' ? (
          <SchemaJsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: `${taskConfig?.label || task} | ${SITE_CONFIG.name}`,
              url: `${baseUrl}${taskConfig?.route || ''}`,
              hasPart: schemaItems,
            }}
          />
        ) : null}

        {layoutKey === 'listing-directory' || layoutKey === 'listing-showcase' ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className={`rounded-[2rem] p-7 shadow-[0_24px_70px_rgba(15,23,42,0.07)] ${ui.panel}`}>
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] opacity-70"><Icon className="h-4 w-4" /> {taskConfig?.label || task}</div>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-foreground">{taskConfig?.description || 'Latest posts'}</h1>
              <p className={`mt-4 max-w-2xl text-sm leading-7 ${ui.muted}`}>Built with a cleaner scan rhythm, stronger metadata grouping, and a structure designed for business discovery rather than editorial reading.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={taskConfig?.route || '#'} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${ui.button}`}>Explore results <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/search" className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${ui.soft}`}>Open search</Link>
              </div>
            </div>
            <form className={`grid gap-3 rounded-[2rem] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${ui.soft}`} action={taskConfig?.route || '#'}>
              <div>
                <label className={`text-xs uppercase tracking-[0.2em] ${ui.muted}`}>Category</label>
                <select name="category" defaultValue={normalizedCategory} className={`mt-2 h-11 w-full rounded-xl px-3 text-sm ${ui.input}`}>
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className={`h-11 rounded-xl text-sm font-medium ${ui.button}`}>Apply filters</button>
            </form>
          </section>
        ) : null}

        {layoutKey === 'article-editorial' || layoutKey === 'article-journal' ? (
          <section className="mb-14 space-y-12">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-emerald-500/5"></div>
              <div className="relative z-10">
                <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-4xl text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-violet-50/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-violet-700 backdrop-blur-sm">
                      <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse"></div>
                      {taskConfig?.label || task}
                    </div>
                    <h1 className="mt-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-4xl font-bold text-transparent sm:text-6xl font-bungee">
                      {taskConfig?.description || 'Latest articles'}
                    </h1>
                    <p className={`mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0 mx-auto`}>
                      Discover stories that inspire, inform, and transform. Our curated collection brings you the best insights from industry leaders and creative minds.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3 lg:justify-start justify-center">
                      <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-emerald-500 px-4 py-2 text-white text-sm font-medium">
                        <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></div>
                        Live Updates
                      </div>
                      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-600 text-sm font-medium">
                        <span className="text-slate-400">•</span>
                        {posts.length} Articles
                      </div>
                    </div>
                  </div>
                  {task === 'article' ? (
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-emerald-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                      <Link
                        href="/create/article"
                        className="relative inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                      >
                        <Plus className="h-4 w-4" aria-hidden />
                        Create Article
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-start">
              <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-emerald-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <Link
                    href="/search"
                    className="relative flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/80 p-4 text-sm font-medium text-slate-600 backdrop-blur-sm transition-all duration-300 hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-700 hover:shadow-lg"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-emerald-500 text-white">
                      <Search className="h-4 w-4" aria-hidden />
                    </div>
                    <span className="truncate">Search articles...</span>
                  </Link>
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-emerald-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative rounded-2xl border border-slate-200/60 bg-white/80 p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-emerald-500"></div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Filter by topic</p>
                    </div>
                    <form className="grid gap-4" action={taskConfig?.route || '#'} method="get">
                      <select
                        name="category"
                        defaultValue={normalizedCategory}
                        className="h-12 w-full rounded-xl border border-slate-200/60 bg-white/80 px-4 text-sm backdrop-blur-sm transition-all duration-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                      >
                        <option value="all">All categories</option>
                        {CATEGORY_OPTIONS.map((item) => (
                          <option key={item.slug} value={item.slug}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <button 
                        type="submit" 
                        className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-emerald-600 px-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Apply Filter
                      </button>
                    </form>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-emerald-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative rounded-2xl border border-slate-200/60 bg-white/80 p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-emerald-500"></div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Quick Stats</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Total Articles</span>
                        <span className="text-sm font-semibold text-slate-900">{posts.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Categories</span>
                        <span className="text-sm font-semibold text-slate-900">{CATEGORY_OPTIONS.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Updated</span>
                        <span className="text-sm font-semibold text-slate-900">Today</span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
              
              <div className="min-w-0 space-y-12">
                {intro ? (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-emerald-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <div className="relative rounded-3xl border border-slate-200/60 bg-white/80 p-8 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-emerald-500"></div>
                        <h2 className="text-2xl font-bold text-slate-900">{intro.title}</h2>
                      </div>
                      {intro.paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 40)} className="mt-4 text-base leading-7 text-slate-600">
                          {paragraph}
                        </p>
                      ))}
                      <div className="mt-6 flex flex-wrap gap-4">
                        {intro.links.map((link) => (
                          <a 
                            key={link.href} 
                            href={link.href} 
                            className="relative inline-flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors duration-200"
                          >
                            {link.label}
                            <ArrowRight className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
                <TaskListClient task={task} initialPosts={posts} category={normalizedCategory} />
              </div>
            </div>
          </section>
        ) : null}

        {layoutKey === 'image-masonry' || layoutKey === 'image-portfolio' ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${ui.soft}`}>
                <Icon className="h-3.5 w-3.5" /> Visual feed
              </div>
              <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em]">{taskConfig?.description || 'Latest posts'}</h1>
              <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>This surface leans into stronger imagery, larger modules, and more expressive spacing so visual content feels materially different from reading and directory pages.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className={`min-h-[220px] rounded-[2rem] ${ui.panel}`} />
              <div className={`min-h-[220px] rounded-[2rem] ${ui.soft}`} />
              <div className={`col-span-2 min-h-[120px] rounded-[2rem] ${ui.panel}`} />
            </div>
          </section>
        ) : null}

        {layoutKey === 'profile-creator' || layoutKey === 'profile-business' ? (
          <section className={`mb-12 rounded-[2.2rem] p-8 shadow-[0_24px_70px_rgba(15,23,42,0.1)] ${ui.panel}`}>
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className={`min-h-[240px] rounded-[2rem] ${ui.soft}`} />
              <div>
                <p className={`text-xs uppercase tracking-[0.3em] ${ui.muted}`}>{taskConfig?.label || task}</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">Profiles with stronger identity, trust, and reputation cues.</h1>
                <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>This layout prioritizes the person or business surface first, then lets the feed continue below without borrowing the same visual logic used by articles or listings.</p>
              </div>
            </div>
          </section>
        ) : null}

        {layoutKey === 'classified-bulletin' || layoutKey === 'classified-market' ? (
          <section className="mb-12 grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className={`rounded-[1.8rem] p-6 ${ui.panel}`}>
              <p className={`text-xs uppercase tracking-[0.3em] ${ui.muted}`}>{taskConfig?.label || task}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">Fast-moving notices, offers, and responses in a compact board format.</h1>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {['Quick to scan', 'Shorter response path', 'Clearer urgency cues'].map((item) => (
                <div key={item} className={`rounded-[1.5rem] p-5 ${ui.soft}`}>
                  <p className="text-sm font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {layoutKey === 'sbm-curation' || layoutKey === 'sbm-library' ? (
          <section className="mb-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <p className={`text-xs uppercase tracking-[0.3em] ${ui.muted}`}>{taskConfig?.label || task}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">Curated resources arranged more like collections than a generic post feed.</h1>
              <p className={`mt-5 max-w-2xl text-sm leading-8 ${ui.muted}`}>Bookmarks, saved resources, and reference-style items need calmer grouping and lighter metadata. This variant gives them that separation.</p>
            </div>
            <div className={`rounded-[2rem] p-6 ${ui.panel}`}>
              <p className={`text-xs uppercase tracking-[0.24em] ${ui.muted}`}>Collection filter</p>
              <form className="mt-4 flex items-center gap-3" action={taskConfig?.route || '#'}>
                <select name="category" defaultValue={normalizedCategory} className={`h-11 flex-1 rounded-xl px-3 text-sm ${ui.input}`}>
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>
                <button type="submit" className={`h-11 rounded-xl px-4 text-sm font-medium ${ui.button}`}>Apply</button>
              </form>
            </div>
          </section>
        ) : null}

        {!isArticleReadingLayout ? (
          <>
            {intro ? (
              <section className={`mb-12 rounded-[2rem] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8 ${ui.panel}`}>
                <h2 className="text-2xl font-semibold text-foreground">{intro.title}</h2>
                {intro.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className={`mt-4 text-sm leading-7 ${ui.muted}`}>{paragraph}</p>
                ))}
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  {intro.links.map((link) => (
                    <a key={link.href} href={link.href} className="font-semibold text-foreground hover:underline">{link.label}</a>
                  ))}
                </div>
              </section>
            ) : null}
            <TaskListClient task={task} initialPosts={posts} category={normalizedCategory} />
          </>
        ) : null}
      </main>
      <Footer />
    </div>
  )
}
