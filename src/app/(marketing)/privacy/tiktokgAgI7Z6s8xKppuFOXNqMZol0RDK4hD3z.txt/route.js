export function GET() {
  return new Response(
    "tiktok-developers-site-verification=gAgI7Z6s8xKppuFOXNqMZol0RDK4hD3z",
    {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    }
  );
}
