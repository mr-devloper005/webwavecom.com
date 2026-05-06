"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import type { SitePost } from "@/lib/site-connector";
import { RichContent, formatRichHtml } from "@/components/shared/rich-content";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { loadFromStorage, saveToStorage, storageKeys } from "@/lib/local-storage";
import type { User } from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_MASTER_PANEL_URL ||
  process.env.NEXT_PUBLIC_MASTER_API_URL;
const SITE_CODE = process.env.NEXT_PUBLIC_SITE_CODE;
const LOCAL_COMMENT_VERSION = "v2";
const DAILY_COMMENT_LIMIT = 10;

type LocalComment = {
  id: string;
  slug: string;
  articleSlug: string;
  authorName: string;
  body: string;
  createdAt: string;
  source: "local";
};

type DisplayComment = {
  id: string;
  slug: string;
  authorName: string;
  body: string;
  createdAt: string;
  source: "local" | "remote";
};

const buildPublicUrl = (path: string) => {
  if (!API_BASE || !SITE_CODE) return null;
  return `${API_BASE.replace(/\/$/, "")}/api/v1/public/${SITE_CODE}${path}`;
};

const getContent = (post: SitePost) =>
  post.content && typeof post.content === "object" ? (post.content as Record<string, any>) : {};

const commentStorageKey = (slug: string) => `nexus-article-comments:${LOCAL_COMMENT_VERSION}:${slug}`;

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

const nextResetTime = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getLocalAuthorName = () => {
  const savedUser = loadFromStorage<User | null>(storageKeys.user, null);
  return savedUser?.name?.trim() || "User";
};

const toDisplayComment = (comment: SitePost): DisplayComment => {
  const content = getContent(comment);
  return {
    id: comment.id,
    slug: comment.slug,
    authorName: comment.authorName || "Anonymous",
    body:
      (typeof content.description === "string" && content.description) ||
      comment.summary ||
      "Comment added.",
    createdAt: comment.publishedAt || comment.createdAt || new Date().toISOString(),
    source: "remote",
  };
};

const sortComments = (comments: DisplayComment[]) =>
  [...comments].sort((a, b) => {
    if (a.source !== b.source) {
      return a.source === "local" ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

export function ArticleComments({ slug }: { slug: string }) {
  const [remoteComments, setRemoteComments] = useState<DisplayComment[]>([]);
  const [localComments, setLocalComments] = useState<LocalComment[]>([]);
  const [page, setPage] = useState(1);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [commentBody, setCommentBody] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const pageSize = 10;

  useEffect(() => {
    const saved = loadFromStorage<LocalComment[]>(commentStorageKey(slug), []);
    setLocalComments(Array.isArray(saved) ? saved : []);
  }, [slug]);

  useEffect(() => {
    const load = async () => {
      const target = buildPublicUrl("/feed?limit=200");
      if (!target) {
        setRemoteComments([]);
        return;
      }

      try {
        const response = await fetch(target, { cache: "no-store" });
        if (!response.ok) {
          setRemoteComments([]);
          return;
        }
        const json = (await response.json()) as { data?: { posts?: SitePost[] } };
        const posts = json.data?.posts || [];
        const filtered = posts.filter((post) => {
          const content = getContent(post);
          return (
            content.type === "comment" &&
            (content.articleSlug === slug ||
              (typeof content.parentUrl === "string" && content.parentUrl.includes(`/${slug}`)))
          );
        });

        setRemoteComments(filtered.map(toDisplayComment));
      } catch {
        setRemoteComments([]);
      }
    };

    load();
  }, [slug]);

  const mergedComments = useMemo(
    () =>
      sortComments([
        ...localComments.map((comment) => ({
          id: comment.id,
          slug: comment.slug,
          authorName: comment.authorName,
          body: comment.body,
          createdAt: comment.createdAt,
          source: "local" as const,
        })),
        ...remoteComments,
      ]),
    [localComments, remoteComments]
  );

  const commentsToday = useMemo(() => {
    const todayStart = startOfToday();
    return localComments.filter((comment) => new Date(comment.createdAt).getTime() >= todayStart).length;
  }, [localComments]);

  const remainingToday = Math.max(DAILY_COMMENT_LIMIT - commentsToday, 0);
  const limitReached = remainingToday <= 0;
  const resetLabel = nextResetTime().toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#comment-")) {
      const targetKey = hash.replace("#comment-", "");
      const match = mergedComments.find(
        (item) => item.id === targetKey || item.slug === targetKey
      );
      setHighlightId(match?.id || null);
      return;
    }

    if (hash === "#comment" && mergedComments.length) {
      setHighlightId(mergedComments[0].id);
      return;
    }

    setHighlightId(null);
  }, [mergedComments]);

  useEffect(() => {
    if (!highlightId) return;
    const target = document.getElementById(`comment-${highlightId}`);
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    }
  }, [highlightId]);

  const totalPages = Math.max(Math.ceil(mergedComments.length / pageSize), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const visibleComments = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return mergedComments.slice(start, start + pageSize);
  }, [mergedComments, safePage]);

  const persistLocalComments = (nextComments: LocalComment[]) => {
    setLocalComments(nextComments);
    saveToStorage(commentStorageKey(slug), nextComments);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanBody = commentBody.trim();

    if (!cleanBody) {
      setFormError("Please write a comment before publishing.");
      return;
    }

    if (limitReached) {
      setFormError("You have reached the 10 comments per day limit on this device.");
      return;
    }

    const nextComment: LocalComment = {
      id: `local-${slug}-${Date.now()}`,
      slug: `local-comment-${Date.now()}`,
      articleSlug: slug,
      authorName: getLocalAuthorName(),
      body: cleanBody,
      createdAt: new Date().toISOString(),
      source: "local",
    };

    persistLocalComments([nextComment, ...localComments]);
    setCommentBody("");
    setFormError(null);
    setHighlightId(nextComment.id);
    setPage(1);
  };

  const handleDeleteLocalComment = (commentId: string) => {
    const nextComments = localComments.filter((comment) => comment.id !== commentId);
    persistLocalComments(nextComments);
    if (highlightId === commentId) {
      setHighlightId(null);
    }
    setFormError(null);
  };

  return (
    <section className="mt-16" id="comments">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br from-slate-50/80 to-white/80 backdrop-blur-sm p-8 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-emerald-500/5"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-emerald-500 text-white">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Discussion</h2>
              <p className="text-sm text-slate-600">{mergedComments.length} {mergedComments.length === 1 ? 'comment' : 'comments'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-all duration-300"></div>
              <div className="relative rounded-2xl border border-slate-200/60 bg-white/90 backdrop-blur-sm p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500/20 to-emerald-500/20 flex items-center justify-center">
                      <span className="text-sm font-semibold text-violet-700">{getLocalAuthorName().charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <label htmlFor="comment-body" className="text-sm font-semibold text-slate-900">
                        Share your thoughts
                      </label>
                      <p className="text-xs text-slate-500">Join the conversation</p>
                    </div>
                  </div>
                  <Textarea
                    id="comment-body"
                    value={commentBody}
                    onChange={(event) => setCommentBody(event.target.value)}
                    placeholder="What do you think about this article? Share your perspective..."
                    className="min-h-32 border-slate-200/60 bg-slate-50/50 resize-none transition-all duration-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                    maxLength={2000}
                    disabled={limitReached}
                  />
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                      limitReached
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : remainingToday <= 3
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : "bg-gradient-to-r from-violet-100 to-emerald-100 text-violet-700 border border-violet-200"
                    }`}>
                      <div className={`h-2 w-2 rounded-full ${
                        limitReached ? "bg-red-500" : remainingToday <= 3 ? "bg-amber-500" : "bg-violet-500"
                      }`}></div>
                      {limitReached
                        ? `Daily limit reached: ${DAILY_COMMENT_LIMIT}/${DAILY_COMMENT_LIMIT}`
                        : `${remainingToday} of ${DAILY_COMMENT_LIMIT} comments left today`}
                    </div>
                    <p className="text-xs text-slate-500">
                      {limitReached
                        ? `You can publish again after ${resetLabel}.`
                        : `Limit resets after ${resetLabel}.`}
                    </p>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-emerald-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                    <Button 
                      type="submit" 
                      disabled={limitReached}
                      className="relative bg-gradient-to-r from-violet-600 to-emerald-600 text-white border-0 px-6 py-3 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Publish Comment
                    </Button>
                  </div>
                </div>
                {formError ? (
                  <div className="mt-4 rounded-xl border border-red-200/60 bg-red-50/80 p-4">
                    <p className="text-sm text-red-700">{formError}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </form>

          {mergedComments.length ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-px bg-gradient-to-r from-slate-200 to-slate-300 flex-1"></div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recent Comments</span>
                <div className="h-px bg-gradient-to-r from-slate-300 to-slate-200 flex-1"></div>
              </div>
              
              {visibleComments.map((comment, index) => {
                const isHighlighted = highlightId === comment.id;
                return (
                  <div
                    key={comment.id}
                    id={`comment-${comment.id}`}
                    className={`group relative transition-all duration-500 ${
                      isHighlighted ? "scale-[1.02]" : ""
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards',
                      opacity: 0
                    }}
                  >
                    <div className={`relative rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${
                      isHighlighted 
                        ? "border-violet-300/60 bg-gradient-to-r from-violet-50/80 to-emerald-50/80 shadow-violet-200/50" 
                        : "border-slate-200/60 bg-white/80 hover:border-violet-200/60"
                    }`}>
                      {isHighlighted && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-emerald-500/20 rounded-2xl blur-xl"></div>
                      )}
                      <div className="relative p-6">
                        <div className="flex items-start gap-4">
                          <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-emerald-500/20 rounded-full blur-md"></div>
                            <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold">
                              {comment.authorName.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-3 mb-3">
                              <div>
                                <p className="font-semibold text-slate-900 text-sm">{comment.authorName}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-slate-500">
                                    {new Date(comment.createdAt).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric', 
                                      year: 'numeric' 
                                    })}
                                  </span>
                                  {comment.source === "local" && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                                      <div className="h-1.5 w-1.5 rounded-full bg-violet-500"></div>
                                      Local
                                    </span>
                                  )}
                                </div>
                              </div>
                              {comment.source === "local" ? (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLocalComment(comment.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-all duration-300 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/60 bg-white/80 text-slate-400 hover:border-red-300/60 hover:bg-red-50/80 hover:text-red-600"
                                  aria-label="Delete local comment"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              ) : null}
                            </div>
                            <div className="relative">
                              <RichContent
                                html={formatRichHtml(comment.body, "Comment added.")}
                                className="text-slate-700 prose-sm prose-p:leading-relaxed prose-h2:text-lg prose-h3:text-base prose-strong:text-slate-900 prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-100/50 to-slate-200/50 rounded-2xl blur-xl"></div>
              <div className="relative rounded-2xl border border-dashed border-slate-300/60 bg-white/60 p-12 text-center backdrop-blur-sm">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No comments yet</h3>
                <p className="text-sm text-slate-600">Be the first to share your thoughts on this article!</p>
              </div>
            </div>
          )}

          {totalPages > 1 ? (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-slate-600">
                Showing page {safePage} of {totalPages} • {mergedComments.length} total {mergedComments.length === 1 ? 'comment' : 'comments'}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={safePage === 1}
                  className="relative group disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-slate-400 to-slate-600 rounded-full blur opacity-0 group-hover:opacity-25 transition duration-300 disabled:opacity-0"></div>
                  <span className="relative inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-700 backdrop-blur-sm transition-all duration-300 hover:border-slate-300 disabled:opacity-50">
                    ← Previous
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={safePage === totalPages}
                  className="relative group disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-slate-400 to-slate-600 rounded-full blur opacity-0 group-hover:opacity-25 transition duration-300 disabled:opacity-0"></div>
                  <span className="relative inline-flex items-center gap-2 rounded-full border border-slate-200/60 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-700 backdrop-blur-sm transition-all duration-300 hover:border-slate-300 disabled:opacity-50">
                    Next →
                  </span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
