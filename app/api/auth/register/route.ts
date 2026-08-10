import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const parsed = registerSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 }
    );
  }

  const { username, email, password, name } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (existing) {
    const field = existing.email === email ? "Email" : "Username";
    return NextResponse.json({ error: `${field} sudah dipakai` }, { status: 409 });
  }

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: { username, email, password: hashed, name },
    select: { id: true, username: true, email: true, name: true },
  });

  return NextResponse.json({ user }, { status: 201 });
      }
