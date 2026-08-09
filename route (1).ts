import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createPostSchema } from "@/lib/validations";

// GET /api/posts — timeline (paginated, cursor-based)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") || undefined;
  const take = Math.min(Number(searchParams.get("take") ?? 20), 50);

  const posts = await prisma.post.findMany({
    where: { parentId: null }, // hanya post utama, bukan reply
    take,
    ...(cursor && { skip: 1, cursor: { id: cursor } }),
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, username: true, name: true, avatarUrl: true, verified: true } },
      _count: { select: { likes: true, comments: true, reposts: true } },
    },
  });

  const nextCursor = posts.length === take ? posts[posts.length - 1].id : null;

  return NextResponse.json({ posts, nextCursor });
}

// POST /api/posts — buat post teks baru
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Kamu harus login dulu" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createPostSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 }
    );
  }

  const post = await prisma.post.create({
    data: {
      content: parsed.data.content,
      parentId: parsed.data.parentId,
      authorId: user.id,
    },
    include: {
      author: { select: { id: true, username: true, name: true, avatarUrl: true, verified: true } },
      _count: { select: { likes: true, comments: true, reposts: true } },
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
