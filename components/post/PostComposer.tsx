"use client";

import { useState } from "react";
import type { PostWithMeta } from "@/types";

const MAX_LENGTH = 500;

export default function PostComposer({
  onPosted,
}: {
  onPosted?: (post: PostWithMeta) => void;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = MAX_LENGTH - content.length;
  const isOver = remaining < 0;
  const isEmpty = content.trim().length === 0;

  async function handleSubmit() {
    if (isEmpty || isOver || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Gagal memposting");
        return;
      }

      setContent("");
      onPosted?.(data.post);
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Apa yang sedang terjadi di dunia teknologi?"
        rows={3}
        className="w-full resize-none bg-transparent text-[15px] text-slate-100 placeholder-slate-500 focus:outline-none"
      />

      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`text-xs ${
            isOver ? "text-red-400" : remaining <= 20 ? "text-amber-400" : "text-slate-500"
          }`}
        >
          {remaining}
        </span>

        <button
          onClick={handleSubmit}
          disabled={isEmpty || isOver || loading}
          className="rounded-full px-5 py-1.5 text-sm font-semibold text-white transition-opacity disabled:opacity-40 bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90"
        >
          {loading ? "Mengirim..." : "Posting"}
        </button>
      </div>
    </div>
  );
}
