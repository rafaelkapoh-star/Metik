import Link from "next/link";
import { MessageCircle, Repeat2, BadgeCheck } from "lucide-react";
import LikeButton from "./LikeButton";
import type { PostWithMeta } from "@/types";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}j`;
  return `${Math.floor(hours / 24)}h`;
}

export default function PostCard({ post }: { post: PostWithMeta }) {
  return (
    <article className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 transition-colors hover:bg-white/[0.07]">
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity"
        style={{
          background:
            "linear-gradient(135deg, rgba(34,211,238,0.08), rgba(168,85,247,0.08))",
        }}
      />
      <div className="relative flex gap-3">
        <Link href={`/profile/${post.author.username}`} className="shrink-0">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-sm font-semibold text-white overflow-hidden">
            {post.author.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.author.avatarUrl} alt={post.author.username} className="h-full w-full object-cover" />
            ) : (
              post.author.username[0]?.toUpperCase()
            )}
          </div>
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-sm">
            <span className="font-semibold text-white truncate">
              {post.author.name ?? post.author.username}
            </span>
            {post.author.verified && (
              <BadgeCheck size={15} className="text-cyan-400 shrink-0" />
            )}
            <span className="text-slate-400 truncate">@{post.author.username}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-500">{timeAgo(post.createdAt)}</span>
          </div>

          <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-normal text-slate-100">
            {post.content}
          </p>

          <div className="mt-3 flex items-center gap-6">
            <Link
              href={`/post/${post.id}`}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <MessageCircle size={18} />
              <span>{post._count.comments}</span>
            </Link>

            <button className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-purple-400 transition-colors">
              <Repeat2 size={18} />
              <span>{post._count.reposts}</span>
            </button>

            <LikeButton postId={post.id} initialCount={post._count.likes} />
          </div>
        </div>
      </div>
    </article>
  );
}
