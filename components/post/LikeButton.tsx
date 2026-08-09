"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  postId: string;
  initialCount: number;
  initialLiked?: boolean;
}

export default function LikeButton({ postId, initialCount, initialLiked = false }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function toggleLike() {
    if (loading) return;
    setLoading(true);

    // optimistic update
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((c) => (nextLiked ? c + 1 : c - 1));

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (!res.ok) throw new Error("Gagal like");
      const data = await res.json();
      setLiked(data.liked);
      setCount(data.count);
    } catch {
      // rollback kalau gagal
      setLiked(liked);
      setCount(initialCount);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`flex items-center gap-1.5 text-sm transition-colors ${
        liked ? "text-pink-400" : "text-slate-400 hover:text-pink-400"
      }`}
    >
      <Heart size={18} fill={liked ? "currentColor" : "none"} strokeWidth={2} />
      <span>{count}</span>
    </button>
  );
}
