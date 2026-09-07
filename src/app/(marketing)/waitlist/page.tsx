import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { WaitlistForm } from "@/components/marketing/waitlist-form";

export const metadata = {
  title: "Join the Flume waitlist",
  description: "Get early access to Flume and tell us what is hard about running your business digitally.",
};

export default function WaitlistPage() {
  return (
    <>
      <MarketingNav />
      <main className="max-w-xl mx-auto px-6 pt-16 pb-20 md:pt-24">
        <p className="text-xs font-medium tracking-[0.12em] uppercase text-green-dark">Waitlist</p>
        <h1 className="mt-3 font-display font-extrabold text-[36px] leading-[1.1] md:text-[44px] text-ink tracking-tight">
          Get Flume when it is ready for your shop.
        </h1>
        <p className="mt-4 text-sub leading-relaxed">
          Flume is a desk for WhatsApp leads from your ads. Join the list with your email.
          Tell us what is messy today so we build for that first.
        </p>
        <div className="mt-8">
          <WaitlistForm />
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
