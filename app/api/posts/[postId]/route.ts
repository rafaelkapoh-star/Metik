import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/posts/:postId — detail post + replies
export async function GET(
  _req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const post = await prisma.post.findUnique({
    where: { id: params.postId },
    include: {
      author: { select: { id: true, username: true, name: true, avatarUrl: true, verified: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, username: true, name: true, avatarUrl: true, verified: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
      _count: { select: { likes: true, comments: true, reposts: true } },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Post tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

// DELETE /api/posts/:postId — hapus post milik sendiri
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Kamu harus login dulu" }, { status: 401 });
  }

  const post = await prisma.post.findUnique({ where: { id: params.postId } });
  if (!post) {
    return NextResponse.json({ error: "Post tidak ditemukan" }, { status: 404 });
  }
  if (post.authorId !== user.id) {
    return NextResponse.json({ error: "Kamu tidak punya izin menghapus post ini" }, { status: 403 });
  }

  await prisma.post.delete({ where: { id: params.postId } });
  return NextResponse.json({ success: true });
}
