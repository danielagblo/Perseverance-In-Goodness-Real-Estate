"use client";

import { useState } from "react";
import { login } from "@/lib/auth-actions";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(password);
      if (result === false) {
        setError("Invalid developer password.");
      }
    } catch (err: any) {
      // Next.js redirect() throws an error, so we only handle actual errors here
      if (err.message !== "NEXT_REDIRECT") {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-[var(--border)]">
        <div className="text-center">
          <img src="/logo.png" alt="Logo" className="h-16 w-auto mx-auto mb-6" />
          <h2 className="text-3xl font-black tracking-tight text-[var(--foreground)]">
            DEV PORTAL
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)] font-medium">
            Enter your secret key to manage properties.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="password"
              required
              className="appearance-none rounded-2xl relative block w-full px-5 py-4 border border-[var(--border)] placeholder-gray-400 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all sm:text-sm font-semibold"
              placeholder="Developer Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-[#C0392B] text-xs font-bold text-center bg-red-50 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black tracking-[0.2em] rounded-2xl text-[var(--foreground)] bg-[var(--accent)] hover:opacity-90 transition-all duration-200 disabled:opacity-50 shadow-xl shadow-[var(--accent)]/20"
          >
            {loading ? "AUTHENTICATING..." : "ENTER PORTAL"}
          </button>
        </form>
      </div>
    </div>
  );
}
