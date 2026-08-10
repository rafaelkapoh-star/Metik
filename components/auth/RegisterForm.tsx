"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "", name: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Gagal mendaftar");
        return;
      }

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Akun dibuat, tapi gagal login otomatis. Coba login manual.");
        return;
      }

      router.push("/home");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <label className="text-sm text-slate-400">Nama lengkap (opsional)</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-400/50"
        />
      </div>

      <div>
        <label className="text-sm text-slate-400">Username</label>
        <input
          type="text"
          required
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-400/50"
        />
      </div>

      <div>
        <label className="text-sm text-slate-400">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-400/50"
        />
      </div>

      <div>
        <label className="text-sm text-slate-400">Password</label>
        <input
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-400/50"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 py-2.5 font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Mendaftar..." : "Daftar"}
      </button>

      <p className="text-center text-sm text-slate-400">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-cyan-400 hover:underline">
          Masuk
        </Link>
      </p>
    </form>
  );
      }
