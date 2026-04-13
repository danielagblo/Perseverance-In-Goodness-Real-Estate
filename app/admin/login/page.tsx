"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth-actions"; // I'll create this server action

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login(password);
      if (success) {
        router.push("/admin");
      } else {
        setError("Invalid developer password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-[#E9E1D1]">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-[#2C3E50]">
            Dev Portal
          </h2>
          <p className="mt-2 text-sm text-[#7F8C8D]">
            Enter your secret key to access property management.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-[#D5C9B1] placeholder-[#BDC3C7] text-[#2C3E50] focus:outline-none focus:ring-[#C0392B] focus:border-[#C0392B] sm:text-sm"
                placeholder="Developer Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs italic text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-[#2C3E50] hover:bg-[#34495E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C3E50] transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Login to Portal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
