"use client";

import { SITE_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function CompanyLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">{SITE_NAME}</h1>
          <p className="mt-1 text-sm text-gray-500">Operator Panel Login</p>
        </div>

        <form className="mt-8 space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
          <Input
            label="Email"
            type="email"
            placeholder="operator@company.com"
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
          />
          <Button type="submit" fullWidth size="lg">
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
