"use client";

import { useState } from "react";
import type { CommentWithAuthor } from "@/types";

export default function CommentList({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: CommentWithAuthor[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitComment() {
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: text }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, data.comment]);
        setText("");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitComment()}
          placeholder="Tulis komentar..."
          className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
        />
        <button
          onClick={submitComment}
          disabled={loading || !text.trim()}
          className="rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          Kirim
        </button>
      </div>

      <div className="space-y-2">
        {comments.map((c) => (
          <div key={c.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">
                {c.author.name ?? c.author.username}
              </span>
              <span>@{c.author.username}</span>
            </div>
            <p className="mt-1 text-sm text-slate-100">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
