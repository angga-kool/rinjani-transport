"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { SITE_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Ship, AlertCircle } from "lucide-react";

export default function CompanyLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      if (result?.ok) {
        toast.success("Login successful");
        router.push("/company");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Ship className="h-7 w-7 text-primary" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">{SITE_NAME}</h1>
          <p className="mt-1 text-sm text-gray-500">Operator Panel Login</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          <Input
            label="Email"
            type="email"
            placeholder="operator@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" fullWidth size="lg" isLoading={loading} disabled={loading}>
            Sign In
          </Button>
          <p className="text-center text-xs text-gray-500">
            Contact admin if you don&apos;t have access
          </p>
        </form>
      </div>
    </div>
  );
}
