export const maxDuration = 60;

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, stream } = body;

    if (!prompt) {
      console.error("[generate] No prompt in request body");
      return Response.json({ error: "No prompt provided" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("[generate] ANTHROPIC_API_KEY is not set");
      return Response.json({ error: "API key not configured" }, { status: 500 });
    }

    console.log(`[generate] Starting request — stream: ${stream}, prompt length: ${prompt.length}`);

    const payload = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 16000,
      stream: stream ?? false,
      messages: [{ role: "user", content: prompt }],
    };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    console.log(`[generate] Anthropic responded with status: ${response.status}`);

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[generate] Anthropic error: ${errText}`);
      return Response.json({ error: errText }, { status: response.status });
    }

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
    console.log(`[generate] Success — response length: ${text.length}`);
    return Response.json({ text });

  } catch (err) {
    console.error("[generate] Caught error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
