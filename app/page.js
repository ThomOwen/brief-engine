"use client";
import { useState, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const DEFAULT_NETWORKS = {
  buffaloed: {
    id: "buffaloed", name: "Buffaloed", tagline: "Western Culture · Spirit · Identity",
    color: "#C4642A", bg: "#1A1108",
    mission: "Celebrate the western identity — its culture, its entrepreneurial spirit, and its politics.",
    tone: "Honest, grounded, and proudly western. Speaks plainly with conviction and warmth. Reveres hard work, innovation rooted in place, and the grit of people building something real. Never ironic, never coastal.",
    audience: "Western Canadians and westerners broadly — entrepreneurs, landowners, tradespeople, ranchers, and anyone who identifies with a culture of building, independence, and plain-spoken integrity.",
    pillars: "Western entrepreneurship · Trades & industry · Land & resource stewardship · Western politics & identity · Innovation rooted in place",
    moral: "The west builds. Always has. Always will. And the people doing it deserve to be celebrated, not explained.",
    notThis: "Never condescending. Never ironic. Never coastal in sensibility. Not partisan in a cheap way — principled.",
  },
  thesource: {
    id: "thesource", name: "The Source", tagline: "Canadian Energy · Innovation · Pride",
    color: "#2A6FC4", bg: "#080F1A",
    mission: "Celebrate the Canadian energy industry as the most advanced, cleanest, and most innovative energy sector in the world.",
    tone: "Proud, informed, and unapologetically pro-industry — but grounded in truth and data, not bluster. Credibility is everything. Authoritative without being academic.",
    audience: "Energy industry professionals, landowners, policy watchers, engineers, and Canadians who believe in responsible resource development.",
    pillars: "Canadian energy innovation · Environmental leadership in extraction · Economic contribution · People of the industry · Policy & sovereignty",
    moral: "Canadian energy isn't the problem. It's part of the solution. And the people building it deserve a platform that tells that story with evidence and pride.",
    notThis: "Never defensive or reactive. Not a lobbying voice. Not dismissive of environmental concerns — reframes them with facts. Never preachy.",
  },
  obey: {
    id: "obey", name: "Obey", tagline: "Christian Leadership · Business Discipleship",
    color: "#8B7355", bg: "#0F0E0C",
    mission: "Equip Christian entrepreneurs and leaders to integrate their faith with their work through business discipleship.",
    tone: "Sincere, purposeful, and grounded in scripture without being preachy. Warm, direct, and honest — like a trusted mentor. Walks alongside rather than lectures.",
    audience: "Christian business owners, executives, and entrepreneurs who take their faith seriously and see their work as a calling — not a compromise.",
    pillars: "Faith & work integration · Business as mission · Character in leadership · Community & accountability · Entrepreneurship as stewardship",
    moral: "Your business is not separate from your faith. It is an expression of it. Build accordingly.",
    notThis: "Never preachy or moralistic. Not a church bulletin. Not prosperity gospel. Not exclusive or tribal — generous in spirit.",
  },
  indelible: {
    id: "indelible", name: "Indelible", tagline: "The Studio Behind the Networks",
    color: "#C4A82A", bg: "#111110",
    mission: "Position Indelible as the production studio and network operator at the intersection of the attention economy — enabling brands to own their audience.",
    tone: "Thoughtful, forward-looking, and grounded in craft. Confident without being arrogant. Visionary without being abstract.",
    audience: "Brand leaders, marketing decision-makers, entrepreneurs, and business owners who are ready to stop renting attention and start owning it.",
    pillars: "Media ownership for brands · The attention economy · Storytelling as business strategy · Network-era thinking · Production craft",
    moral: "The brands that will win the next decade won't be the ones with the biggest ad budgets. They'll be the ones that built an audience.",
    notThis: "Never agency-speak. Not feature-listing. Not hype without substance. Never sounds like a vendor — sounds like a collaborator with a point of view.",
  },
};

const DEFAULT_SPONSORS = {
  truenorth: { id: "truenorth", name: "True North Accounting", network: "buffaloed", archetype: "The Hero", moral: "Entrepreneurship is a call to adventure — a courageous step into the unknown in pursuit of something worth building, for yourself and for generations after you.", promise: "Expert guidance for the entrepreneurial journey.", audience: "Western Canadian small and medium business owners who take their business seriously." },
  razphalt: { id: "razphalt", name: "Razphalt", network: "buffaloed", archetype: "The Innovator", moral: "No shingles buried. High-value material shouldn't go to waste — there's a smarter, better way.", promise: "Better material, better margins, better conscience.", audience: "Contractors, acreage owners, municipalities, and roofing industry buyers." },
  laddergenie: { id: "laddergenie", name: "Ladder Genie", network: "buffaloed", archetype: "The Inventor / Rebel", moral: "There's a better way. Every roofer who's carried bundles up a ladder knows it.", promise: "Control over your own material flow — no waiting, no double handling, better margins.", audience: "Residential roofing contractors and crews who work seasonally." },
  synergy: { id: "synergy", name: "Synergy Land Services", network: "thesource", archetype: "The Expert / Sage", moral: "Twenty years of earned credibility doesn't happen by accident. It's built job by job, relationship by relationship.", promise: "Proven leadership in land management, built on experience you can trust.", audience: "Energy sector operators, landowners, developers, and industry professionals." },
};

const ARRAY_ASSET_TYPES = [
  { id: "promo_trailer", label: "Promo Trailer", desc: "2–4 min", icon: "▶" },
  { id: "teaser", label: "Teaser Clip", desc: "30–60s", icon: "⚡" },
  { id: "segment", label: "Segment Breakdown", desc: "5–12 min each", icon: "◼" },
  { id: "social_short", label: "Social Shorts", desc: "15–60s each", icon: "✦" },
  { id: "quote_card", label: "Quote / Soundbite", desc: "10–20s pull quote", icon: "❝" },
  { id: "ep_full", label: "Full Episode Cut", desc: "YouTube long-form", icon: "◎" },
];

const QUICK_TYPES = ["Episode Drop","Cutdown / Clip","Season Promo","Sponsor Feature","Behind the Scenes","Network Promo","Commercial","Short Documentary","Brand Story"];
const PLATFORMS = [{id:"youtube",label:"YouTube"},{id:"instagram",label:"Instagram"},{id:"linkedin",label:"LinkedIn"},{id:"facebook",label:"Facebook"},{id:"x",label:"X / Twitter"}];
const NETWORK_FIELDS = [
  { key: "mission", label: "Editorial Mission", desc: "What is this channel for — one sharp sentence.", rows: 2 },
  { key: "tone", label: "Tone & Voice", desc: "How it speaks. What it never does.", rows: 3 },
  { key: "audience", label: "Audience", desc: "Who specifically. What they care about. What they distrust.", rows: 3 },
  { key: "pillars", label: "Content Pillars", desc: "3–5 themes that are always on-brand. Separate with ·", rows: 2 },
  { key: "moral", label: "The Moral", desc: "The through-line behind every piece of content on this channel.", rows: 2 },
  { key: "notThis", label: "What It's Not", desc: "Guardrails. What this channel never sounds like.", rows: 2 },
];

// ─── PROMPT BUILDERS ──────────────────────────────────────────────────────────

function buildNetworkTone(net) {
  return `NETWORK: ${net.name}\nMISSION: ${net.mission}\nTONE & VOICE: ${net.tone}\nAUDIENCE: ${net.audience}\nCONTENT PILLARS: ${net.pillars}\nTHE MORAL: ${net.moral}\nWHAT IT IS NOT: ${net.notThis}`;
}

function buildArrayPrompt({ networks, network, sponsor, assetTypes, platforms, transcript, context }) {
  const net = networks[network];
  let p = `You are a senior content strategist and creative director at Indelible. Read the full transcript carefully. Identify powerful moments. Produce a complete Media Array Breakdown as a JSON object.\n\n${buildNetworkTone(net)}\n`;
  if (sponsor) p += `\nSPONSOR: ${sponsor.name} | Archetype: ${sponsor.archetype}\nMoral: ${sponsor.moral}\nPromise: ${sponsor.promise}\nAudience: ${sponsor.audience}\nUse network moral and pillars as the filter for clip selection. Layer sponsor archetype into framing.\n`;
  if (context) p += `\nCONTEXT: ${context}\n`;
  p += `\nASSET TYPES: ${assetTypes.join(", ")}\nPLATFORMS: ${platforms.join(", ")}\n\nTRANSCRIPT:\n${transcript}\n\n---\n\nReturn ONLY a valid JSON object. No markdown, no explanation, no code fences. The JSON must follow this exact schema:\n\n{\n  "assets": [\n    {\n      "id": "asset_1",\n      "title": "Working title for this asset",\n      "type": "Asset type (e.g. Social Short, Teaser Clip)",\n      "source_moment": {\n        "opening": "Verbatim opening line from transcript",\n        "closing": "Verbatim closing line from transcript"\n      },\n      "why_this_works": "One sentence — why this moment earns this asset type AND serves the network moral",\n      "hook": "The first words or image — what stops the scroll",\n      "story_arc": ["Beat 1", "Beat 2", "Beat 3"],\n      "thumbnail_direction": "What the thumbnail should communicate — not describe, communicate",\n      "platform_copy": {\n        "youtube": "Full YouTube caption with hashtags and CTA",\n        "instagram": "Instagram caption with hashtags",\n        "linkedin": "LinkedIn caption"\n      }\n    }\n  ],\n  "production_notes": {\n    "recurring_themes": ["Theme or line that should appear across multiple assets"],\n    "flagged_for_future": ["Strong moments not used — with brief note on potential"],\n    "publish_sequence": [\n      { "order": 1, "asset_id": "asset_1", "rationale": "Why this goes first" }\n    ]\n  }\n}\n\nOnly include platform keys for the requested platforms. Generate the right quantity of assets for each requested type. Write all copy in the voice of ${net.name}${sponsor ? ` and ${sponsor.name}` : ""}.`;
  return p;
}

function buildQuickPrompt({ networks, network, sponsor, contentType, platforms, description, transcript }) {
  const net = networks[network];
  let p = `You are a senior content strategist and copywriter at Indelible.\n\n${buildNetworkTone(net)}\n`;
  if (sponsor) p += `\nSPONSOR: ${sponsor.name} | Archetype: ${sponsor.archetype}\nMoral: ${sponsor.moral}\nPromise: ${sponsor.promise}\nAudience: ${sponsor.audience}\nBlend network voice and sponsor archetype.\n`;
  p += `\nCONTENT TYPE: ${contentType}\nPLATFORMS: ${platforms.join(", ")}\nDESCRIPTION: ${description}\n`;
  if (transcript) p += `\nTRANSCRIPT (pull real quotes — do not invent lines):\n${transcript}\n`;
  p += `\nFor each platform: caption, hashtags, CTA. YouTube: title + 150-200 word description. Thumbnail direction: one sentence.\nWrite in the network voice. Every word earns its place.`;
  return p;
}

// ─── SETTINGS PANEL ──────────────────────────────────────────────────────────

function SettingsPanel({ networks, onSave, onReset }) {
  const [activeNet, setActiveNet] = useState("buffaloed");
  const [drafts, setDrafts] = useState(() => JSON.parse(JSON.stringify(networks)));
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const hasChanges = (id) => NETWORK_FIELDS.some(f => drafts[id][f.key] !== networks[id][f.key]);
  const updateField = (id, key, val) => setDrafts(p => ({ ...p, [id]: { ...p[id], [key]: val } }));
  const handleSave = () => { onSave(drafts); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handleReset = (id) => { setDrafts(p => ({ ...p, [id]: JSON.parse(JSON.stringify(DEFAULT_NETWORKS[id])) })); onReset(id); };
  const net = drafts[activeNet];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20, alignItems: "start" }}>
      <div>
        <div className="sl">Networks</div>
        {Object.values(drafts).map(n => (
          <button key={n.id} className={`settings-net-tab ${activeNet === n.id ? "active" : ""}`}
            style={{ "--nc": n.color, "--nb": n.bg + "44" }} onClick={() => setActiveNet(n.id)}>
            <span style={{ fontFamily: "Bebas Neue", fontSize: 15, letterSpacing: ".07em" }}>{n.name}</span>
            {hasChanges(n.id) && <span className="changed-dot" />}
          </button>
        ))}
        <div style={{ marginTop: 8, fontSize: 10, color: "#343432", lineHeight: 1.5 }}>Changes affect what the model selects and how it writes.</div>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 22, letterSpacing: ".08em", color: networks[activeNet]?.color }}>{net.name}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="reset-btn" onClick={() => handleReset(activeNet)}>Reset to default</button>
            <button className="save-btn" onClick={handleSave}>{saved ? "Saved ✓" : "Save Changes"}</button>
          </div>
        </div>
        {NETWORK_FIELDS.map(f => (
          <div key={f.key} className="field-group">
            <div className="field-label">{f.label}</div>
            <div className="field-desc">{f.desc}</div>
            <textarea className="fi" rows={f.rows} value={drafts[activeNet][f.key]} onChange={e => updateField(activeNet, f.key, e.target.value)} />
          </div>
        ))}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div className="sl" style={{ marginBottom: 0 }}>Prompt Preview</div>
            <label className="tw" onClick={() => setShowPreview(v => !v)}>
              <div className={`tt ${showPreview ? "on" : ""}`}><div className="th" /></div>
              <span style={{ fontSize: 10, color: showPreview ? "#C4A82A" : "#343432" }}>Show what gets sent to the model</span>
            </label>
          </div>
          {showPreview && <div className="fu"><div className="preview-label">Exact context for {net.name}</div><div className="preview-block">{buildNetworkTone(drafts[activeNet])}</div></div>}
        </div>
      </div>
    </div>
  );
}

// ─── ASSET CARD ───────────────────────────────────────────────────────────────

function AssetCard({ asset, status, onApprove, onReject, platforms }) {
  const [activePlatform, setActivePlatform] = useState(Object.keys(asset.platform_copy || {})[0] || "youtube");
  const [copied, setCopied] = useState(false);

  const availablePlatforms = Object.keys(asset.platform_copy || {}).filter(p => asset.platform_copy[p]);
  const currentCopy = asset.platform_copy?.[activePlatform] || "";

  const copyText = () => {
    navigator.clipboard.writeText(currentCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`asset-card ${status}`}>
      {/* Header */}
      <div className="card-header">
        <div>
          <div className="card-type-badge" style={{ marginBottom: 8 }}>{asset.type}</div>
          <div className="card-title">"{asset.title}"</div>
        </div>
      </div>

      <div className="card-body">
        {/* Source Moment */}
        <div>
          <div className="card-field-label">Source Moment</div>
          <div className="source-moment">
            <span>"{asset.source_moment?.opening}"</span>
            {asset.source_moment?.closing && asset.source_moment.closing !== asset.source_moment.opening && (
              <> &nbsp;→&nbsp; <span>"{asset.source_moment?.closing}"</span></>
            )}
          </div>
        </div>

        {/* Why / Hook row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <div className="card-field-label">Why This Works</div>
            <div className="card-field-value">{asset.why_this_works}</div>
          </div>
          <div>
            <div className="card-field-label">Hook</div>
            <div className="card-field-value highlight">{asset.hook}</div>
          </div>
        </div>

        {/* Story Arc */}
        {asset.story_arc?.length > 0 && (
          <div>
            <div className="card-field-label">Story Arc</div>
            <div>
              {asset.story_arc.map((beat, i) => (
                <div key={i} className="story-beat">
                  <span className="beat-num">{i + 1}</span>
                  <span>{beat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Thumbnail */}
        <div>
          <div className="card-field-label">Thumbnail Direction</div>
          <div className="card-field-value" style={{ fontStyle: "italic" }}>{asset.thumbnail_direction}</div>
        </div>

        {/* Platform Copy */}
        {availablePlatforms.length > 0 && (
          <div>
            <div className="card-field-label">Platform Copy</div>
            <div className="platform-tab-row">
              {availablePlatforms.map(p => (
                <button key={p} className={`platform-tab ${activePlatform === p ? "active" : ""}`} onClick={() => setActivePlatform(p)}>
                  {p}
                </button>
              ))}
            </div>
            <div className="platform-copy-box">
              {currentCopy}
              <button className="copy-copy-btn" onClick={copyText}>{copied ? "Copied ✓" : "Copy"}</button>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="card-actions">
        <button className={`approve-btn ${status === "approved" ? "active" : ""}`} onClick={onApprove}>
          {status === "approved" ? "✓ Approved" : "Approve"}
        </button>
        <button className={`reject-btn ${status === "rejected" ? "active" : ""}`} onClick={onReject}>
          {status === "rejected" ? "✕ Rejected" : "Reject"}
        </button>
        <span className={`status-badge ${status}`}>
          {status === "pending" ? "Awaiting review" : status === "approved" ? "Approved" : "Rejected"}
        </span>
      </div>
    </div>
  );
}

// ─── PRODUCTION NOTES ─────────────────────────────────────────────────────────

function ProductionNotes({ notes, assets }) {
  if (!notes) return null;
  return (
    <div className="prod-notes">
      <div style={{ fontFamily: "Bebas Neue", fontSize: 18, letterSpacing: ".08em", color: "#E8E0D4", marginBottom: 16 }}>Production Notes</div>

      {notes.recurring_themes?.length > 0 && (
        <div className="prod-notes-section">
          <div className="prod-notes-title">Recurring Themes & Lines</div>
          {notes.recurring_themes.map((t, i) => (
            <div key={i} className="prod-notes-item"><span className="prod-notes-dot">—</span><span>{t}</span></div>
          ))}
        </div>
      )}

      {notes.flagged_for_future?.length > 0 && (
        <div className="prod-notes-section">
          <div className="prod-notes-title">Flagged for Future Use</div>
          {notes.flagged_for_future.map((t, i) => (
            <div key={i} className="prod-notes-item"><span className="prod-notes-dot">—</span><span>{t}</span></div>
          ))}
        </div>
      )}

      {notes.publish_sequence?.length > 0 && (
        <div className="prod-notes-section">
          <div className="prod-notes-title">Suggested Publish Sequence</div>
          {notes.publish_sequence.map((s, i) => {
            const asset = assets.find(a => a.id === s.asset_id);
            return (
              <div key={i} className="prod-notes-item">
                <span className="prod-notes-dot">{s.order}</span>
                <span><strong style={{ color: "#C8C0B4" }}>{asset?.title || s.asset_id}</strong> — {s.rationale}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function BriefEngine() {
  const [appTab, setAppTab] = useState("brief");
  const [networks, setNetworks] = useState(() => JSON.parse(JSON.stringify(DEFAULT_NETWORKS)));
  const [mode, setMode] = useState("array");
  const [network, setNetwork] = useState("");
  const [useSponsor, setUseSponsor] = useState(false);
  const [sponsorMode, setSponsorMode] = useState("existing");
  const [selSponsor, setSelSponsor] = useState("");
  const [customBrand, setCustomBrand] = useState({ name: "", archetype: "", moral: "", promise: "", audience: "" });
  const [assetTypes, setAssetTypes] = useState(["promo_trailer", "teaser", "social_short"]);
  const [arrayPlats, setArrayPlats] = useState(["youtube", "instagram", "linkedin"]);
  const [transcript, setTranscript] = useState("");
  const [context, setContext] = useState("");
  const [contentType, setContentType] = useState("");
  const [quickPlats, setQuickPlats] = useState(["youtube", "instagram"]);
  const [description, setDescription] = useState("");
  const [useQT, setUseQT] = useState(false);
  const [qTranscript, setQTranscript] = useState("");

  // Output state
  const [rawOutput, setRawOutput] = useState("");
  const [parsedArray, setParsedArray] = useState(null); // { assets, production_notes }
  const [parseError, setParseError] = useState(false);
  const [approvals, setApprovals] = useState({}); // { asset_id: "approved" | "rejected" | "pending" }
  const [streaming, setStreaming] = useState(false);
  const [done, setDone] = useState(false);
  const [notionStatus, setNotionStatus] = useState(null);
  const [copied, setCopied] = useState(false);

  const outRef = useRef(null);

  const abortRef = useRef(null);

  const netSponsors = Object.values(DEFAULT_SPONSORS).filter(b => !network || b.network === network);
  const activeSponsor = useSponsor ? (sponsorMode === "existing" ? DEFAULT_SPONSORS[selSponsor] : (customBrand.name ? customBrand : null)) : null;
  const toggleArr = (id, setter) => setter(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const canGen = network && (
    mode === "array"
      ? assetTypes.length > 0 && arrayPlats.length > 0 && transcript.trim().length > 80
      : contentType && quickPlats.length > 0 && description.trim()
  ) && (!useSponsor || activeSponsor);

  const approvedCount = Object.values(approvals).filter(v => v === "approved").length;
  const rejectedCount = Object.values(approvals).filter(v => v === "rejected").length;
  const totalAssets = parsedArray?.assets?.length || 0;

  const generate = async () => {
    if (!canGen) return;
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStreaming(true); setDone(false); setRawOutput("");
    setParsedArray(null); setParseError(false); setApprovals({});
    setTimeout(() => outRef.current?.scrollIntoView({ behavior: "smooth" }), 80);

    const prompt = mode === "array"
      ? buildArrayPrompt({ networks, network, sponsor: activeSponsor, assetTypes: assetTypes.map(id => ARRAY_ASSET_TYPES.find(a => a.id === id)?.label), platforms: arrayPlats, transcript, context })
      : buildQuickPrompt({ networks, network, sponsor: activeSponsor, contentType, platforms: quickPlats, description, transcript: useQT ? qTranscript : "" });

    let fullText = "";

   try {
  if (mode === "array") {
    // Non-streaming for array mode — get clean JSON back
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({ prompt, stream: false }),
    });
    const data = await res.json();
    fullText = data.text;
    setRawOutput(fullText);
  } else {
    // Streaming for quick mode
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({ prompt, stream: true }),
    });
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    while (true) {
      const { done: rd, value } = await reader.read();
      if (rd) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop();
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        try {
          const json = JSON.parse(data);
          if (json.type === "content_block_delta" && json.delta?.type === "text_delta") {
            fullText += json.delta.text;
            setRawOutput(fullText);
          }
        } catch {}
      }
    }
  }
} catch (e) {
  if (e.name !== "AbortError") setRawOutput("[Error — please try again]");
}

    setStreaming(false);
    setDone(true);

    // Parse JSON if array mode
    if (mode === "array" && fullText) {
      try {
        let clean = fullText.replace(/```json|```/g, "").trim();
        const start = clean.indexOf("{");
        const end = clean.lastIndexOf("}");
        if (start !== -1 && end !== -1) {
          clean = clean.slice(start, end + 1);
        }
        // Fix unescaped quotes and problematic characters
        clean = clean.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
        const parsed = JSON.parse(clean);
        setParsedArray(parsed);
        // Init all assets as pending
        const initApprovals = {};
        (parsed.assets || []).forEach(a => { initApprovals[a.id] = "pending"; });
        setApprovals(initApprovals);
      } catch (e) {
        console.error("Parse failed:", e, "Raw text:", fullText.slice(0, 200));
        setParseError(true);
      }
    }
  };

  const setApproval = (id, status) => {
    setApprovals(p => ({ ...p, [id]: p[id] === status ? "pending" : status }));
  };

  const pushToNotion = async () => {
    const approvedAssets = parsedArray?.assets?.filter(a => approvals[a.id] === "approved") || [];
    if (!approvedAssets.length) return;
    setNotionStatus("pushing");
    // Notion integration placeholder — will wire up in Next.js
    await new Promise(r => setTimeout(r, 1800));
    setNotionStatus("done");
    setTimeout(() => setNotionStatus(null), 3000);
  };

  const aNet = networks[network];
  const wc = t => t.split(/\s+/).filter(Boolean).length;

  return (
    <div style={{ minHeight: "100vh", background: "#0C0C0B", fontFamily: "'DM Sans',sans-serif", color: "#E8E0D4" }}>
      

      {/* Header */}
      <div style={{ borderBottom: "1px solid #141412", padding: "0 40px", display: "flex", alignItems: "stretch", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 18, paddingBottom: 18 }}>
          <span style={{ fontFamily: "Bebas Neue", fontSize: 24, letterSpacing: ".12em", color: "#C4A82A" }}>BRIEF ENGINE</span>
          <span style={{ fontSize: 9, color: "#2a2a28", letterSpacing: ".16em", textTransform: "uppercase" }}>Indelible · Content OS</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
          {[{ id: "brief", label: "Brief" }, { id: "settings", label: "Network Settings" }].map(t => (
            <button key={t.id} className={`nav-tab ${appTab === t.id ? "active" : ""}`} onClick={() => setAppTab(t.id)}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "36px 24px 100px" }}>

        {/* SETTINGS */}
        {appTab === "settings" && (
          <div className="fu">
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "Bebas Neue", fontSize: 20, letterSpacing: ".08em", marginBottom: 6 }}>Network Settings</div>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6, maxWidth: 600 }}>These profiles are injected directly into every prompt. Edit them here — they are the tuning rods for clip selection and copy voice.</div>
            </div>
            <SettingsPanel networks={networks} onSave={setNetworks} onReset={(id) => setNetworks(p => ({ ...p, [id]: JSON.parse(JSON.stringify(DEFAULT_NETWORKS[id])) }))} />
          </div>
        )}

        {/* BRIEF */}
        {appTab === "brief" && (
          <>
            {/* Mode */}
            <div style={{ marginBottom: 36 }}>
              <div className="sl">Mode</div>
              <div style={{ display: "flex" }}>
                {[
                  { id: "array", lbl: "Media Array Breakdown", sub: "Full transcript → structured asset cards + approval flow" },
                  { id: "quick", lbl: "Quick Brief", sub: "Single asset → platform copy + creative direction" },
                ].map(m => (
                  <button key={m.id} className={`mode-btn ${mode === m.id ? "active" : ""}`}
                    onClick={() => { setMode(m.id); setRawOutput(""); setParsedArray(null); setDone(false); }}>
                    <span className="mode-lbl">{m.lbl}</span>
                    <span className="mode-sub">{m.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <hr className="div" style={{ marginTop: 0 }} />

            {/* Network */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 11 }}>
                <div className="sl" style={{ marginBottom: 0 }}>01 — Network</div>
                <button style={{ background: "none", border: "none", color: "#C4A82A", fontSize: 10, cursor: "pointer", letterSpacing: ".06em", fontFamily: "'DM Sans',sans-serif" }} onClick={() => setAppTab("settings")}>Edit network profiles →</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {Object.values(networks).map(net => (
                  <div key={net.id} className={`net-card ${network === net.id ? "active" : ""}`}
                    style={{ "--nc": net.color, "--nb": net.bg + "55" }}
                    onClick={() => { setNetwork(net.id); setSelSponsor(""); }}>
                    <div style={{ fontFamily: "Bebas Neue", fontSize: 17, letterSpacing: ".08em", color: network === net.id ? net.color : "#444", marginBottom: 2, transition: "color .18s" }}>{net.name}</div>
                    <div style={{ fontSize: 9, color: "#333", letterSpacing: ".04em" }}>{net.tagline}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsor */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 13 }}>
                <div className="sl" style={{ marginBottom: 0 }}>02 — Sponsor Brand</div>
                <label className="tw" onClick={() => setUseSponsor(v => !v)}>
                  <div className={`tt ${useSponsor ? "on" : ""}`}><div className="th" /></div>
                  <span style={{ fontSize: 10, color: useSponsor ? "#C4A82A" : "#343432", letterSpacing: ".04em" }}>{useSponsor ? "Included" : "No sponsor"}</span>
                </label>
              </div>
              {useSponsor && (
                <div className="fu">
                  <div style={{ display: "flex", marginBottom: 12 }}>
                    <button className={`tab ${sponsorMode === "existing" ? "active" : ""}`} onClick={() => setSponsorMode("existing")}>Existing Brand</button>
                    <button className={`tab ${sponsorMode === "custom" ? "active" : ""}`} onClick={() => setSponsorMode("custom")}>Add Brand</button>
                  </div>
                  {sponsorMode === "existing" ? (
                    <>
                      <div style={{ position: "relative" }}>
                        <select className="fs" value={selSponsor} onChange={e => setSelSponsor(e.target.value)}>
                          <option value="">Select sponsor brand...</option>
                          {(netSponsors.length > 0 ? netSponsors : Object.values(DEFAULT_SPONSORS)).map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                        <div style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#333", fontSize: 10 }}>▾</div>
                      </div>
                      {selSponsor && DEFAULT_SPONSORS[selSponsor] && (
                        <div className="sp-preview">
                          {[["Archetype", DEFAULT_SPONSORS[selSponsor].archetype], ["Moral", DEFAULT_SPONSORS[selSponsor].moral], ["Promise", DEFAULT_SPONSORS[selSponsor].promise], ["Audience", DEFAULT_SPONSORS[selSponsor].audience]].map(([l, v]) => (
                            <div key={l} className="sp-row"><span className="sp-lbl">{l}</span><span className="sp-val">{v}</span></div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ display: "grid", gap: 9 }}>
                      {[["Brand Name","name",false],["Archetype","archetype",false],["Moral / Storyline","moral",true],["Brand Promise","promise",false],["Target Audience","audience",true]].map(([l,k,ta]) => (
                        <div key={k}>
                          <div style={{ fontSize: 9, color: "#343432", marginBottom: 5, letterSpacing: ".07em", textTransform: "uppercase" }}>{l}</div>
                          {ta ? <textarea className="fi" rows={2} placeholder={l} value={customBrand[k]} onChange={e => setCustomBrand(p => ({...p,[k]:e.target.value}))} />
                               : <input className="fi" type="text" placeholder={l} value={customBrand[k]} onChange={e => setCustomBrand(p => ({...p,[k]:e.target.value}))} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Array mode fields */}
            {mode === "array" && (
              <>
                <div style={{ marginBottom: 32 }}>
                  <div className="sl">03 — Asset Types to Produce</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                    {ARRAY_ASSET_TYPES.map(a => (
                      <div key={a.id} className={`asset-chip ${assetTypes.includes(a.id) ? "active" : ""}`} onClick={() => toggleArr(a.id, setAssetTypes)}>
                        <span className="a-icon">{a.icon}</span><span className="a-lbl">{a.label}</span><span className="a-desc">{a.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 32 }}>
                  <div className="sl">04 — Distribution Platforms</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {PLATFORMS.map(p => (<button key={p.id} className={`chip ${arrayPlats.includes(p.id) ? "active" : ""}`} onClick={() => toggleArr(p.id, setArrayPlats)}>{p.label}</button>))}
                  </div>
                </div>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
                    <div className="sl" style={{ marginBottom: 0 }}>05 — Full Transcript</div>
                    {transcript.length > 0 && <span className="wc">{wc(transcript).toLocaleString()} words</span>}
                  </div>
                  <textarea className="fi" rows={13}
                    placeholder={"Paste the full transcript here.\n\nInclude speaker labels and timestamps if available."}
                    value={transcript} onChange={e => setTranscript(e.target.value)} />
                </div>
                <div style={{ marginBottom: 32 }}>
                  <div className="sl">06 — Additional Context (optional)</div>
                  <textarea className="fi" rows={3}
                    placeholder={"e.g. 'Brand doc for Synergy's 20-year anniversary. Publish: Episode 1 at trade show June 26.'"}
                    value={context} onChange={e => setContext(e.target.value)} />
                </div>
              </>
            )}

            {/* Quick mode fields */}
            {mode === "quick" && (
              <>
                <div style={{ marginBottom: 32 }}>
                  <div className="sl">03 — Content Type</div>
                  <div style={{ position: "relative" }}>
                    <select className="fs" value={contentType} onChange={e => setContentType(e.target.value)}>
                      <option value="">Select content type...</option>
                      {QUICK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <div style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#333", fontSize: 10 }}>▾</div>
                  </div>
                </div>
                <div style={{ marginBottom: 32 }}>
                  <div className="sl">04 — Platforms</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {PLATFORMS.map(p => (<button key={p.id} className={`chip ${quickPlats.includes(p.id) ? "active" : ""}`} onClick={() => toggleArr(p.id, setQuickPlats)}>{p.label}</button>))}
                  </div>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <div className="sl">05 — Content Description</div>
                  <textarea className="fi" rows={4} placeholder="Who's featured, what the key moment is, the emotional hook, any specific lines to highlight." value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div style={{ marginBottom: 32 }}>
                  <label className="tw" onClick={() => setUseQT(v => !v)}>
                    <div className={`tt ${useQT ? "on" : ""}`}><div className="th" /></div>
                    <span style={{ fontSize: 10, color: useQT ? "#C4A82A" : "#343432", letterSpacing: ".04em" }}>Include transcript / source material</span>
                  </label>
                  {useQT && <div className="fu" style={{ marginTop: 11 }}><textarea className="fi" rows={8} placeholder="Paste the transcript or relevant section." value={qTranscript} onChange={e => setQTranscript(e.target.value)} /></div>}
                </div>
              </>
            )}

            {/* Generate */}
            <button className="gen" disabled={!canGen || streaming} onClick={generate}>
              {streaming ? (mode === "array" ? "READING TRANSCRIPT..." : "GENERATING...") : (mode === "array" ? "GENERATE MEDIA ARRAY" : "GENERATE BRIEF")}
            </button>

            {/* Status bar */}
            {network && (
              <div style={{ marginTop: 8, padding: "7px 12px", background: "#111110", border: "1px solid #161614", borderRadius: 3, display: "flex", gap: 16, flexWrap: "wrap", fontSize: 9, color: "#2e2e2c", letterSpacing: ".06em" }}>
                <span>Network: <span style={{ color: aNet?.color }}>{aNet?.name}</span></span>
                {activeSponsor?.name && <span>Sponsor: <span style={{ color: "#666" }}>{activeSponsor.name}</span></span>}
                {mode === "array" && assetTypes.length > 0 && <span>Assets: <span style={{ color: "#555" }}>{assetTypes.length} types</span></span>}
                {mode === "array" && transcript.length > 0 && <span>Transcript: <span style={{ color: "#555" }}>{wc(transcript).toLocaleString()}w</span></span>}
              </div>
            )}

            {/* ── OUTPUT AREA ── */}
            <div ref={outRef}>

              {/* Streaming raw output (while generating) */}
              {streaming && rawOutput && (
                <div style={{ marginTop: 44 }} className="fu">
                  <div className="sl" style={{ marginBottom: 12 }}>
                    Reading Transcript
                    <span style={{ color: "#C4A82A", marginLeft: 8, fontSize: 9 }}>● STREAMING</span>
                  </div>
                  <div className="out" style={{ maxHeight: 300, overflow: "hidden" }}>
                    {rawOutput.slice(-600)}
                    <span className="cursor" />
                  </div>
                </div>
              )}

              {/* Parsed card view */}
              {done && mode === "array" && !streaming && (
                <div style={{ marginTop: 44 }} className="fu">

                  {parsedArray ? (
                    <>
                      {/* Approval bar */}
                      <div className="approval-bar">
                        <div style={{ fontFamily: "Bebas Neue", fontSize: 17, letterSpacing: ".08em", color: "#E8E0D4" }}>
                          {totalAssets} Asset{totalAssets !== 1 ? "s" : ""} Generated
                        </div>
                        <div className="approval-stat approved"><span>{approvedCount}</span> approved</div>
                        <div className="approval-stat rejected"><span>{rejectedCount}</span> rejected</div>
                        <div className="approval-stat"><span>{totalAssets - approvedCount - rejectedCount}</span> pending</div>
                        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                          <button className="cpb" onClick={() => { navigator.clipboard.writeText(rawOutput); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                            {copied ? "Copied ✓" : "Copy JSON"}
                          </button>
                          <button
                            className="notion-btn"
                            disabled={approvedCount === 0 || notionStatus === "pushing"}
                            onClick={pushToNotion}
                          >
                            {notionStatus === "pushing" ? "Pushing..." : notionStatus === "done" ? "✓ Sent to Notion" : `Push ${approvedCount > 0 ? approvedCount : ""} to Notion`}
                          </button>
                        </div>
                      </div>

                      {/* Asset cards */}
                      <div style={{ display: "grid", gap: 16 }}>
                        {parsedArray.assets?.map(asset => (
                          <AssetCard
                            key={asset.id}
                            asset={asset}
                            status={approvals[asset.id] || "pending"}
                            platforms={arrayPlats}
                            onApprove={() => setApproval(asset.id, "approved")}
                            onReject={() => setApproval(asset.id, "rejected")}
                          />
                        ))}
                      </div>

                      {/* Production notes */}
                      {parsedArray.production_notes && (
                        <div style={{ marginTop: 24 }}>
                          <ProductionNotes notes={parsedArray.production_notes} assets={parsedArray.assets || []} />
                        </div>
                      )}
                    </>
                  ) : parseError ? (
                    <>
                      <div style={{ marginBottom: 12, fontSize: 11, color: "#CF6679" }}>
                        The model returned a response that couldn't be parsed as structured cards. Showing raw output — try generating again for card view.
                      </div>
                      <div className="out">{rawOutput}</div>
                    </>
                  ) : (
                    <div className="parsing-indicator">Parsing response into cards...</div>
                  )}
                </div>
              )}

              {/* Quick mode output */}
              {done && mode === "quick" && !streaming && rawOutput && (
                <div style={{ marginTop: 44 }} className="fu">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div className="sl" style={{ marginBottom: 0 }}>Generated Brief</div>
                    <button className="cpb" onClick={() => { navigator.clipboard.writeText(rawOutput); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                      {copied ? "Copied ✓" : "Copy All"}
                    </button>
                  </div>
                  <div className="out">{rawOutput}</div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
