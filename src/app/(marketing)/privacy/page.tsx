import type { Metadata } from "next";
import Link from "next/link";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Flume",
  description:
    "How Flume (Collectiv Labs) collects and uses account, lead, and billing data for the WhatsApp lead desk.",
};

const updated = "6 September 2026";

export default function PrivacyPage() {
  return (
    <>
      <MarketingNav />
      <main className="max-w-3xl mx-auto px-6 py-16 md:py-20">
        <p className="text-sm text-faint mb-3">Legal</p>
        <h1 className="font-display font-extrabold text-3xl md:text-4xl text-ink tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-sub">Last updated {updated} · Africa/Lagos</p>
        <p className="mt-6 text-sub leading-relaxed">
          Flume is a WhatsApp lead desk operated by Collectiv Labs (Tochukwu Chinatu). This page
          explains what we collect when you use{" "}
          <Link href="/" className="text-ink underline underline-offset-2">
            Flume
          </Link>
          , in plain English. It is written with Nigeria&apos;s NDPR in mind; it is not legal advice.
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-sub">
          <section>
            <h2 className="font-display font-semibold text-lg text-ink mb-3">Who we are</h2>
            <p>
              Flume helps SMEs capture leads from ads and WhatsApp, qualify them, and follow up.
              Operator: Collectiv Labs / Tochukwu Chinatu. Time zone for notices and records:
              Africa/Lagos.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-ink mb-3">Account data</h2>
            <p>
              When you sign up we store your name, email, workspace (tenant) details, and
              authentication data via our auth provider. You can update profile fields in Settings.
              Passwords are handled by the auth provider; we do not store plaintext passwords.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-ink mb-3">
              Leads from ads, WhatsApp, and TikTok
            </h2>
            <p>
              If you connect Meta, WhatsApp Business, or TikTok Instant Forms, Flume receives lead
              and message data you choose to sync — for example names, phone numbers, form answers,
              campaign tags, and conversation content. That data belongs to your business; we process
              it to run the desk (inbox, scoring, qualification, suggested replies) on your behalf.
              You are responsible for lawful collection and any notices you owe your customers.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-ink mb-3">Cookies and similar</h2>
            <p>
              We use essential cookies or local storage for sign-in sessions and basic app function.
              We do not run third-party advertising trackers on the marketing site. Analytics, if
              added later, will be described here.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-ink mb-3">Paystack billing</h2>
            <p>
              Paid plans are billed through Paystack. Card details are entered on Paystack&apos;s
              pages; Flume stores subscription status, plan, and payment references needed for
              billing — not full card numbers. Paystack&apos;s own privacy terms apply to payment
              processing.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-ink mb-3">
              How we use and share data
            </h2>
            <p>
              We use data to provide Flume, secure accounts, process webhooks, send product emails,
              and improve reliability. We use infrastructure processors (hosting, database, auth,
              payments, Meta/WhatsApp/TikTok APIs) under their terms. We do not sell lead lists.
              We may disclose data if required by law or to protect the service and users.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-ink mb-3">Retention and rights</h2>
            <p>
              We keep account and lead data while your workspace is active and for a reasonable
              period afterward for backups, disputes, or legal duties. Under NDPR-style principles
              you may ask to access, correct, or delete personal data we hold about you as a Flume
              user. Lead data in your workspace is primarily controlled by you; use Settings / contact
              support to request workspace deletion.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-ink mb-3">Security</h2>
            <p>
              Data is encrypted in transit and at rest with our providers. No method is perfect;
              please use a strong password and limit who can access your Flume workspace.
            </p>
          </section>

          <section>
            <h2 className="font-display font-semibold text-lg text-ink mb-3">Contact</h2>
            <p>
              Privacy questions: use <strong className="text-ink font-medium">Contact support</strong>{" "}
              in Flume Settings, or reach Collectiv Labs / Tochukwu Chinatu regarding Flume. For
              service terms, see our{" "}
              <Link href="/terms" className="text-ink underline underline-offset-2">
                Terms of Service
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
