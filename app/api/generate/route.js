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

    console.log(`[generate] Starting — stream: ${stream}, prompt: ${prompt.length} chars`);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 16000,
        stream: true, // Always stream from Anthropic
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[generate] Anthropic error ${response.status}: ${errText}`);
      return Response.json({ error: errText }, { status: response.status });
    }

    // Transform Anthropic SSE into plain text stream — client just accumulates chunks
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    (async () => {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() || "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (!data || data === "[DONE]") continue;
            try {
              const json = JSON.parse(data);
              if (json.type === "content_block_delta" && json.delta?.type === "text_delta") {
                await writer.write(encoder.encode(json.delta.text));
              }
            } catch {}
          }
        }
      } catch (e) {
        console.error("[generate] Stream error:", e.message);
      } finally {
        await writer.close();
      }
    })();

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });

  } catch (err) {
    console.error("[generate] Caught error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
