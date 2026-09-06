import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export const metadata: Metadata = {
  title: "Terms of Service — Flume",
  description: "Terms for using Flume, the WhatsApp lead desk SaaS by Collectiv Labs.",
};

const updated = "6 September 2026";

export default function TermsPage() {
  return (
    <>
      <MarketingNav />
      <main className="max-w-3xl mx-auto px-6 py-16 md:py-20">
        <p className="text-sm text-faint mb-3">Legal</p>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-ink tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-sub">Last updated {updated} · Africa/Lagos</p>
        <p className="mt-6 text-sub leading-relaxed">
          These terms cover your use of Flume, a SaaS WhatsApp lead desk operated by Collectiv Labs
          (Tochukwu Chinatu). By creating an account or using the product, you agree to them.
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-sub">
          <section>
            <h2 className="font-display font-semibold text-lg text-ink mb-3">The service</h2>
            <p>
              Flume lets you connect messaging and ad channels, ingest leads, manage conversations,
              run qualification flows, and view workspace analytics. Features may change as we ship
              improvements. Free and paid plans have different limits (shown on the pricing section
              of the{" "}
              <Link href="/#pricing" className="text-ink underline underline-offset-2">
                home page
              </Link>
              ).
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-ink mb-3">Accounts</h2>
            <p>
              You must provide accurate signup details and keep credentials secure. You are
              responsible for activity under your workspace. One person or business should not create
              accounts to evade bans or plan limits. We may suspend accounts that abuse the service
              or harm other users.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-ink mb-3">Your content and leads</h2>
            <p>
              You retain rights to your business data, leads, and messages. You grant us a limited
              license to host and process that data only to provide Flume. You confirm you have the
              right to connect Meta, WhatsApp, TikTok, and other integrations and to process customer
              data through Flume in line with applicable law (including NDPR where it applies).
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-ink mb-3">Acceptable use</h2>
            <p>
              Do not use Flume for spam, fraud, harassment, illegal products, or scraping that
              violates platform rules. Do not attempt to break security, overload the API, or reverse
              engineer the product beyond what the law allows. Channel providers (WhatsApp, Meta,
              TikTok) have their own policies; breaches there may also affect your Flume access.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-ink mb-3">Billing</h2>
            <p>
              Paid plans are charged in NGN via Paystack. Fees are due as stated at checkout. You may
              cancel anytime; access continues until the end of the paid period unless otherwise
              noted. Taxes, if any, are your responsibility unless we state otherwise. Failed payments
              may pause Pro features.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-ink mb-3">
              Availability and disclaimer
            </h2>
            <p>
              We aim for reliable uptime but do not guarantee uninterrupted service. Flume is
              provided &quot;as is.&quot; Suggested replies and scoring are assistive tools — you
              remain responsible for messages you send and business decisions you make. To the
              fullest extent allowed by Nigerian law, Collectiv Labs is not liable for indirect or
              consequential losses, or for amounts beyond fees you paid us in the three months before
              a claim.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-ink mb-3">Termination</h2>
            <p>
              You may stop using Flume and request workspace deletion via support. We may suspend or
              end access for breach of these terms or for risk to the platform. After termination,
              provisions that should survive (including liability limits and IP) continue to apply.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-ink mb-3">Changes and law</h2>
            <p>
              We may update these terms; material changes will be reflected by the &quot;Last
              updated&quot; date on this page. Continued use after changes means you accept the new
              terms. These terms are governed by the laws of Nigeria. Disputes should first be raised
              with us in good faith. Privacy details are in our{" "}
              <Link href="/privacy" className="text-ink underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-ink mb-3">Contact</h2>
            <p>
              Questions about these terms: Collectiv Labs / Tochukwu Chinatu via{" "}
              <strong className="text-ink font-medium">Contact support</strong> in Flume Settings.
            </p>
          </section>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
