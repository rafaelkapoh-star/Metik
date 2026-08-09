import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const followSchema = z.object({ followingId: z.string().cuid() });

// POST /api/follows — toggle follow/unfollow user lain
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Kamu harus login dulu" }, { status: 401 });
  }

  const parsed = followSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "followingId tidak valid" }, { status: 400 });
  }
  const { followingId } = parsed.data;

  if (followingId === user.id) {
    return NextResponse.json({ error: "Tidak bisa follow diri sendiri" }, { status: 400 });
  }

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: user.id, followingId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    return NextResponse.json({ following: false });
  }

  await prisma.follow.create({ data: { followerId: user.id, followingId } });
  return NextResponse.json({ following: true });
}
