"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectTo, setRedirectTo] = useState("/dashboard");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const redirect = new URLSearchParams(window.location.search).get("redirect");
    if (redirect) {
      setRedirectTo(redirect);
    }
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? "Invalid admin token");
      }

      router.push(redirectTo);
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="glass-card w-full max-w-md p-8 space-y-6">
        <div>
          <p className="text-xs font-mono text-[#7a43e6] tracking-wide">MISSION CONTROL ACCESS</p>
          <h1 className="text-3xl font-black italic mt-2">Admin Login</h1>
          <p className="text-sm text-zinc-400 mt-2">
            Enter the approval token to access the HITL queue.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-xs font-mono text-zinc-400">ADMIN_APPROVAL_TOKEN</span>
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-4 py-3 text-sm outline-none focus:border-[#7a43e6]"
              placeholder="Enter token"
              autoComplete="off"
              required
            />
          </label>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#7a43e6] text-black py-3 rounded-lg font-bold hover:brightness-110 transition-all disabled:opacity-60"
          >
            {isLoading ? "Authenticating..." : "Enter Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

