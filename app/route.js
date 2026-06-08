export async function POST(request) {
  const body = await request.json();
  const { prompt, stream } = body;

  const payload = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    stream: stream ?? false,
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

  if (stream) {
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  }

  const data = await response.json();
  const text = data.content?.[0]?.text ?? "";
  return Response.json({ text });
}
