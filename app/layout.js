import "./globals.css";

export const metadata = {
  title: "Flume — WhatsApp leads that convert",
  description:
    "Flume turns TikTok and Meta ads into WhatsApp conversations for African SMEs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
