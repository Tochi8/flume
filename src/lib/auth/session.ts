import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTenant, getUserByAuthId } from "../../../lib/store.js";

export type SessionContext = {
  authUserId: string;
  email: string;
  tenantId: string;
  user: {
    id: string;
    tenantId: string;
    email: string;
    name: string | null;
    role: string;
  };
  tenant: Awaited<ReturnType<typeof getTenant>>;
};

export async function getSessionContext(): Promise<SessionContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const profile = await getUserByAuthId(user.id);
  if (!profile?.tenantId) return null;

  const tenant = await getTenant(profile.tenantId);
  return {
    authUserId: user.id,
    email: user.email || profile.email,
    tenantId: profile.tenantId,
    user: profile,
    tenant,
  };
}

export async function requireSession(): Promise<SessionContext> {
  const ctx = await getSessionContext();
  if (!ctx) redirect("/login");
  return ctx;
}
