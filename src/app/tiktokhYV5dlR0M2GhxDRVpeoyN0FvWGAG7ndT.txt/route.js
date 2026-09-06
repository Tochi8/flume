export function GET() {
  return new Response(
    "tiktok-developers-site-verification=hYV5dlR0M2GhxDRVpeoyN0FvWGAG7ndT",
    {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    }
  );
}
