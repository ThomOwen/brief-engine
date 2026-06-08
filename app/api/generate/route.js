export const maxDuration = 60; // Extend Vercel function timeout (requires Pro plan)

export async function POST(request) {
  const body = await request.json();
  const { prompt } = body;

  const payload = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    stream: true,
    messages: [{ role: "user", content: prompt }],
  };

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(payload),
  });

  // Always stream back to the client
  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
