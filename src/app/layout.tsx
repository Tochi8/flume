import type { Metadata } from "next";
import { inter, manrope } from "@/lib/fonts";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flume — Turn WhatsApp conversations into customers",
  description:
    "Flume captures leads from your Meta and TikTok campaigns, scores them, and helps you close the deal, right inside WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} antialiased`}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
