export function GET() {
  return new Response(
    "tiktok-developers-site-verification=qkaEARHXQTei0ZPxvSqJA2WLW1nHOhgn",
    {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    }
  );
}
