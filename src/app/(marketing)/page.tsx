import Link from "next/link";
import { Sparkles } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";

export default function MarketingPage() {
  return (
    <>
      <MarketingNav />
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-16 md:pt-24 md:pb-20 text-center">
        <h1 className="font-display font-extrabold text-[40px] leading-[1.08] md:text-[58px] md:leading-[1.06] tracking-tight text-ink max-w-3xl mx-auto">Turn WhatsApp conversations into customers.</h1>
        <p className="mt-6 text-lg text-sub leading-relaxed max-w-xl mx-auto">Flume captures leads from your Meta and TikTok campaigns, scores them, helps you qualify them, and gives you everything you need to close the deal — right inside WhatsApp.</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button size="lg" asChild><Link href="/overview">Start for free</Link></Button>
          <Button variant="link" size="lg" asChild><Link href="#how-it-works">See how it works</Link></Button>
        </div>
        <p className="mt-6 text-sm text-faint">No card required · 50 leads free every month</p>
      </section>
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="rounded-feature bg-green-surface border border-border p-10 md:p-16 text-left">
          <div className="font-display font-semibold text-ink mb-2">Inbox preview</div>
          <p className="text-sub text-sm max-w-md">Leads, scores, and suggested WhatsApp replies live in one place. Open the app to walk the full desk.</p>
        </div>
      </section>
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="font-display font-bold text-3xl md:text-[38px] text-ink tracking-tight">How Flume works</h2>
        <p className="mt-4 text-sub text-lg mb-14">From ad click to closed sale, without a single spreadsheet.</p>
        <div className="grid md:grid-cols-4 gap-8">
          {[["01","Connect","Link your WhatsApp Business number, Facebook and TikTok ad accounts in a few taps."],["02","Capture","Every reply to your campaigns lands in one inbox, tagged with its source automatically."],["03","Qualify","Flume asks the questions you'd ask, scores the answers, and tells you who's ready to buy."],["04","Convert","Suggested replies and a clear next step get you from hello to a won deal faster."]].map(([num,title,body]) => (
            <div key={title}><div className="text-sm text-faint mb-3">{num}</div><h3 className="font-display font-semibold text-lg text-ink mb-2">{title}</h3><p className="text-sm text-sub leading-relaxed">{body}</p></div>
          ))}
        </div>
      </section>
      <section id="intelligence" className="bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display font-bold text-3xl md:text-[38px] text-ink tracking-tight">Know who's worth calling back first.</h2>
            <p className="mt-5 text-sub text-lg leading-relaxed">Flume reads every conversation and scores it for buying intent, budget signals, and urgency.</p>
          </div>
          <div className="bg-bg border border-border rounded-feature p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-ink">Adebayo Ogundimu</span>
              <span className="text-xs font-medium text-green-dark bg-green-light px-2.5 py-1 rounded-pill">Score 92 · High</span>
            </div>
            <div className="space-y-3 text-sm">
              {[["Intent","Strong"],["Reason","Event purchase, fixed date"],["Budget signal","Mentioned"],["Source","Facebook"]].map(([k,v]) => (
                <div key={k} className="flex justify-between border-b border-border pb-3 last:border-0"><span className="text-sub">{k}</span><span className="text-ink font-medium">{v}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-lg mx-auto text-center mb-14">
          <h2 className="font-display font-bold text-3xl text-ink">Piper drafts the reply. You send it.</h2>
        </div>
        <div className="max-w-md mx-auto bg-surface border border-border rounded-feature shadow-card p-6">
          <div className="bg-muted rounded-card p-4 mb-4"><div className="text-xs text-faint mb-1">Customer</div><div className="text-sm text-ink">How much for 20 chairs, delivered Saturday?</div></div>
          <div className="flex items-center gap-2 mb-3"><div className="w-6 h-6 rounded-full bg-green flex items-center justify-center"><Sparkles className="h-3 w-3 text-white" /></div><span className="text-sm font-medium text-ink">Piper suggestion</span></div>
          <div className="border border-border rounded-card p-4 text-sm text-ink leading-relaxed">Hi Adebayo, thanks for reaching out. We can help with the 20 chairs for your event next Saturday.</div>
        </div>
      </section>
      <section id="pricing" className="bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="font-display font-bold text-3xl text-ink mb-14">Pricing that fits your business today.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-border rounded-feature p-8 bg-bg"><div className="text-sm font-medium text-sub mb-4">Free</div><div className="font-display font-bold text-4xl text-ink mb-1">₦0</div><div className="text-sm text-sub mb-6">50 leads / month</div><Button variant="outline" className="w-full" asChild><Link href="/overview">Start free</Link></Button></div>
            <div className="border-2 border-green rounded-feature p-8 bg-bg"><div className="text-sm font-medium text-sub mb-4">Pro Monthly</div><div className="font-display font-bold text-4xl text-ink mb-1">₦15,000<span className="text-base font-normal text-sub">/month</span></div><div className="text-sm text-sub mb-6">1,000 leads / month</div><Button className="w-full" asChild><Link href="/overview">Start Pro</Link></Button></div>
            <div className="border border-border rounded-feature p-8 bg-bg"><div className="text-sm font-medium text-sub mb-4">Pro Yearly</div><div className="font-display font-bold text-4xl text-ink mb-1">₦150,000<span className="text-base font-normal text-sub">/year</span></div><div className="text-sm text-sub mb-6">2,000 leads / month</div><Button variant="outline" className="w-full" asChild><Link href="/overview">Save with yearly</Link></Button></div>
          </div>
        </div>
      </section>
      <section id="faq" className="max-w-3xl mx-auto px-6 py-24">
        <h2 className="font-display font-bold text-3xl text-ink mb-10">Questions, answered</h2>
        <div className="divide-y divide-border border-t border-b border-border">
          {[["Do I need the WhatsApp Business API?","No. Flume connects to your existing WhatsApp Business number and handles the API setup for you during onboarding."],["Can I cancel anytime?","Yes. Pro plans are month-to-month or annual with no lock-in."],["Is my customer data secure?","Conversations are encrypted in transit and at rest."]].map(([q,a]) => (
            <details key={q} className="group py-5"><summary className="flex items-center justify-between cursor-pointer text-ink font-medium">{q}<span className="text-faint text-xl">+</span></summary><p className="mt-3 text-sm text-sub leading-relaxed">{a}</p></details>
          ))}
        </div>
      </section>
      <section className="bg-green-surface">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="font-display font-bold text-3xl text-ink">Your next customer already messaged you.</h2>
          <Button size="lg" className="mt-8" asChild><Link href="/overview">Start for free</Link></Button>
        </div>
      </section>
      <footer className="max-w-6xl mx-auto px-6 py-14">
        <Logo size={24} className="mb-3" />
        <p className="text-sm text-faint max-w-xs">A calm sales operating system built around WhatsApp, for SMEs across Nigeria and Africa.</p>
        <div className="mt-12 pt-6 border-t border-border text-xs text-faint">© 2026 Flume. Built for Nigerian & African SMEs.</div>
      </footer>
    </>
  );
}
