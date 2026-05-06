"use client";

import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { TaskPostCard } from "@/components/shared/task-post-card";
import { buildPostUrl } from "@/lib/task-data";
import { normalizeCategory, isValidCategory } from "@/lib/categories";
import type { TaskKey } from "@/lib/site-config";
import type { SitePost } from "@/lib/site-connector";
import { getLocalPostsForTask } from "@/lib/local-posts";

type Props = {
  task: TaskKey;
  initialPosts: SitePost[];
  category?: string;
};

export function TaskListClient({ task, initialPosts, category }: Props) {
  const localPosts = getLocalPostsForTask(task);

  const merged = useMemo(() => {
    const bySlug = new Set<string>();
    const combined: Array<SitePost & { localOnly?: boolean; task?: TaskKey }> = [];

    localPosts.forEach((post) => {
      if (post.slug) {
        bySlug.add(post.slug);
      }
      combined.push(post);
    });

    initialPosts.forEach((post) => {
      if (post.slug && bySlug.has(post.slug)) return;
      combined.push(post);
    });

    const normalizedCategory = category ? normalizeCategory(category) : "all";
    if (normalizedCategory === "all") {
      return combined.filter((post) => {
        const content = post.content && typeof post.content === "object" ? post.content : {};
        const value = typeof (content as any).category === "string" ? (content as any).category : "";
        return !value || isValidCategory(value);
      });
    }

    return combined.filter((post) => {
      const content = post.content && typeof post.content === "object" ? post.content : {};
      const value =
        typeof (content as any).category === "string"
          ? normalizeCategory((content as any).category)
          : "";
      return value === normalizedCategory;
    });
  }, [category, initialPosts, localPosts]);

  if (!merged.length) {
    return (
      <div className="journal-card border-dashed border-slate-300/80 bg-slate-50/50 p-12 text-center text-slate-600">
        <p className="text-base font-semibold text-slate-900">No articles match this view yet</p>
        <p className="mt-2 text-sm text-slate-600">Try clearing filters or check back after new stories publish.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {merged.map((post, index) => {
          const localOnly = (post as any).localOnly;
          const href = localOnly
            ? `/local/${task}/${post.slug}`
            : buildPostUrl(task, post.slug);
          
          return (
            <div 
              key={post.id} 
              className="group relative"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards',
                opacity: 0
              }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-40 transition-all duration-500 group-hover:scale-105"></div>
              <TaskPostCard key={post.id} post={post} href={href} taskKey={task} />
            </div>
          );
        })}
      </div>
      
      {merged.length > 6 && (
        <div className="relative group mt-12">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-emerald-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative rounded-2xl border border-slate-200/60 bg-white/80 p-8 backdrop-blur-sm text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center">
                <ArrowRight className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Explore more articles</h3>
              <p className="text-sm text-slate-600 max-w-md">Dive deeper into our collection and discover more insights from our expert contributors.</p>
              <button className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
                Load More Articles
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
