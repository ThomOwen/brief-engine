import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request) {
  const { prompt, stream } = await request.json();

  if (stream === false) {
    // Non-streaming — return complete JSON response
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8096,
      system: "You are a content strategist at Indelible. When producing a Media Array Breakdown, respond with ONLY a valid JSON object. No markdown, no code fences, no explanation. Just raw JSON starting with { and ending with }.",
      messages: [{ role: "user", content: prompt }],
    });
    const text = message.content.map(b => b.text || "").join("");
    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Streaming for quick mode
  const streamResp = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of streamResp) {
        controller.enqueue(new TextEncoder().encode("data: " + JSON.stringify(chunk) + "\n"));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/event-stream" },
  });
}