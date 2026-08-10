import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ background: "radial-gradient(circle at top, #0f172a 0%, #020617 60%)" }}
    >
      <h1 className="mb-6 text-2xl font-bold text-white">Masuk ke Metik</h1>
      <LoginForm />
    </div>
  );
}
