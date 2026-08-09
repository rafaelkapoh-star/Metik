import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // aktifkan setelah config NextAuth kamu siap

/**
 * Ambil user yang sedang login dari session.
 * Ganti authOptions di atas begitu setup NextAuth kamu jadi.
 */
export async function getCurrentUser() {
  const session = await getServerSession(/* authOptions */);
  if (!session?.user) return null;
  return session.user as { id: string; username: string; name?: string | null };
}
