import { IntegrationCard } from "@/features/integrations/integration-card";
import { WhatsAppIcon, FacebookIcon, InstagramIcon, TikTokIcon } from "@/features/integrations/channel-icons";
import { requireSession } from "@/lib/auth/session";
import { listConnections } from "../../../../lib/store.js";

export const dynamic = "force-dynamic";

const icons: Record<string, React.ReactNode> = {
  int_whatsapp: <WhatsAppIcon />,
  int_facebook: <FacebookIcon />,
  int_instagram: <InstagramIcon />,
  int_tiktok: <TikTokIcon />,
};

export default async function IntegrationsPage() {
  const { tenantId } = await requireSession();
  const connections = await listConnections(tenantId);
  return (
    <div className="max-w-2xl mx-auto px-5 md:px-10 py-6 md:py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-[28px] text-ink">Connect your channels</h1>
        <p className="text-sub mt-1">Flume reads leads from the channels you connect here.</p>
        <p className="text-xs text-faint mt-2">
          TikTok Instant Form webhook:{" "}
          <code className="text-ink">https://flume-ten.vercel.app/api/webhooks/tiktok</code>
          {" "}· needs a Marketing API access token (MVP via env; Connect TikTok can store it later).
        </p>
      </div>
      <div className="space-y-3">
        {connections.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} icon={icons[integration.id]} />
        ))}
      </div>
    </div>
  );
}
