import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createCommentSchema } from "@/lib/validations";

// GET /api/comments?postId=... — daftar komentar sebuah post
export async function GET(req: NextRequest) {
  const postId = new URL(req.url).searchParams.get("postId");
  if (!postId) {
    return NextResponse.json({ error: "postId wajib diisi" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, username: true, name: true, avatarUrl: true, verified: true } },
    },
  });

  return NextResponse.json({ comments });
}

// POST /api/comments — buat komentar baru
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Kamu harus login dulu" }, { status: 401 });
  }

  const parsed = createCommentSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 }
    );
  }

  const comment = await prisma.comment.create({
    data: {
      postId: parsed.data.postId,
      content: parsed.data.content,
      authorId: user.id,
    },
    include: {
      author: { select: { id: true, username: true, name: true, avatarUrl: true, verified: true } },
    },
  });

  return NextResponse.json({ comment }, { status: 201 });
}
