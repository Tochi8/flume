"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardTitle } from "@/components/ui/card";

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const workspace = String(form.get("workspace") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    if (!name || !workspace || !email || password.length < 8) {
      setError("Fill in all fields. Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { data, error: signError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, workspace },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signError) {
      setError(signError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/overview");
      router.refresh();
      return;
    }

    setInfo("Check your email to confirm your account, then log in.");
    setLoading(false);
  }

  return (
    <Card className="w-full max-w-md p-6 md:p-8">
      <CardTitle className="text-xl mb-1">Create your workspace</CardTitle>
      <p className="text-sm text-sub mb-6">50 free leads every month. No card required.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" autoComplete="name" required placeholder="Tolu" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="workspace">Workspace name</Label>
          <Input id="workspace" name="workspace" required placeholder="Lekki Events" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@business.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} placeholder="At least 8 characters" />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        {info && <p className="text-sm text-green-dark">{info}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating…" : "Start for free"}
        </Button>
      </form>
      <p className="text-sm text-sub mt-6 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-green-dark font-medium hover:underline">
          Log in
        </Link>
      </p>
    </Card>
  );
}
