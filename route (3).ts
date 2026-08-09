import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const likeSchema = z.object({ postId: z.string().cuid() });

// POST /api/likes — toggle like/unlike sebuah post
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Kamu harus login dulu" }, { status: 401 });
  }

  const parsed = likeSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "postId tidak valid" }, { status: 400 });
  }
  const { postId } = parsed.data;

  const existing = await prisma.like.findUnique({
    where: { postId_userId: { postId, userId: user.id } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    const count = await prisma.like.count({ where: { postId } });
    return NextResponse.json({ liked: false, count });
  }

  await prisma.like.create({ data: { postId, userId: user.id } });
  const count = await prisma.like.count({ where: { postId } });
  return NextResponse.json({ liked: true, count });
}
