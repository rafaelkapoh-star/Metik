"use client";

import { useEffect, useState, useCallback } from "react";
import PostComposer from "@/components/post/PostComposer";
import PostCard from "@/components/post/PostCard";
import type { PostWithMeta } from "@/types";

export default function HomePage() {
  const [posts, setPosts] = useState<PostWithMeta[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/posts?take=20");
    const data = await res.json();
    setPosts(data.posts);
    setCursor(data.nextCursor);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  async function loadMore() {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    const res = await fetch(`/api/posts?take=20&cursor=${cursor}`);
    const data = await res.json();
    setPosts((prev) => [...prev, ...data.posts]);
    setCursor(data.nextCursor);
    setLoadingMore(false);
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at top, #0f172a 0%, #020617 60%)",
      }}
    >
      <div className="mx-auto max-w-xl px-4 py-6 space-y-4">
        <h1 className="text-lg font-bold text-white">Beranda</h1>

        <PostComposer onPosted={(post) => setPosts((prev) => [post, ...prev])} />

        {loading ? (
          <p className="text-center text-sm text-slate-500 py-8">Memuat...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-sm text-slate-500 py-8">
            Belum ada postingan. Jadilah yang pertama!
          </p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {cursor && (
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm text-slate-300 hover:bg-white/10 transition-colors"
          >
            {loadingMore ? "Memuat..." : "Muat lebih banyak"}
          </button>
        )}
      </div>
    </div>
  );
}
