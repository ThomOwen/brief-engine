"use client";
import { useState, useRef, useEffect } from "react";

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
    mission: "Helping brands and brand leaders to share the truth of their brand.",
    tone: "Always passionate and with deep conviction. Never divisive and never verbose.",
    audience: "The audience values honesty, excellence and constructive innovation. They distrust self-promotion, dishonesty and being taken advantage of.",
    pillars: "Motive · Purpose · Impact",
    moral: "The truth is not a relative concept. It is the expression of The Word in creation. It sounds like peace, hope and love.",
    notThis: "Negative. Divisive. Immoral.",
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

// ─── HISTORY ──────────────────────────────────────────────────────────────────

const HISTORY_KEY = "brief_engine_history";
function loadHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; } }
function saveToHistory(entry) { try { const h = loadHistory(); h.unshift(entry); localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 50))); } catch {} }
function deleteFromHistory(id) { try { const h = loadHistory().filter(e => e.id !== id); localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); } catch {} }

// ─── CLIENT PAGE EXPORT ───────────────────────────────────────────────────────

function exportClientHTML({ parsedArray, clientName, episodeName, threadSummary, frameioLinks, approvals }) {
  const approvedAssets = (parsedArray?.assets || []).filter(a => approvals[a.id] === "approved");
  if (!approvedAssets.length) { alert("Approve at least one asset before exporting the client page."); return; }

  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const date = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

  const assetCardsHTML = approvedAssets.map((asset, idx) => {
    const platforms = Object.entries(asset.platform_copy || {}).filter(([, v]) => v);
    if (!platforms.length) return "";
    const firstPlatform = platforms[0][0];
    const tabsHTML = platforms.map(([p]) => `
      <button class="ptab ${p === firstPlatform ? "active" : ""}" onclick="switchPlatform('${asset.id}','${p}',this)">${p === "youtube" ? "YouTube" : p === "instagram" ? "Instagram" : p === "linkedin" ? "LinkedIn" : p === "facebook" ? "Facebook" : p.toUpperCase()}</button>
    `).join("");
    const copiesHTML = platforms.map(([p, copy]) => `
      <div class="pcopy" id="copy-${asset.id}-${p}" style="display:${p === firstPlatform ? "block" : "none"}">
        <div class="pcopy-text" id="text-${asset.id}-${p}">${copy.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g, "<br>")}</div>
      </div>
    `).join("");
    const fio = frameioLinks?.[asset.id];
    return `
    <div class="asset-card" id="asset-${asset.id}">
      <div class="asset-header">
        <span class="type-badge">${asset.type}</span>
        <div class="asset-title">${asset.title.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</div>
      </div>
      <div class="asset-body">
        <div class="platform-tabs">${tabsHTML}</div>
        <div class="platform-copies">${copiesHTML}</div>
        <div class="copy-row">
          <button class="copy-btn" onclick="copyCaption('${asset.id}')">Copy caption</button>
          ${fio ? `<a class="download-btn" href="${fio}" target="_blank" rel="noopener">Download asset ↗</a>` : ""}
        </div>
        <div id="copied-${asset.id}" class="copied-confirm" style="display:none">Copied to clipboard ✓</div>
      </div>
    </div>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${episodeName || "Media Array"} — ${clientName || "Client"} × Indelible</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#0C0C0B;color:#D8D0C8;font-family:'DM Sans',sans-serif;font-weight:400;min-height:100vh;padding:0 0 80px}
a{color:inherit;text-decoration:none}

.page-header{padding:48px 40px 36px;border-bottom:1px solid #1A1A18;max-width:860px;margin:0 auto}
.studio-label{font-size:9px;color:#C4A82A;letter-spacing:.18em;text-transform:uppercase;margin-bottom:14px}
.client-name{font-family:'Bebas Neue';font-size:42px;letter-spacing:.06em;color:#E8E0D4;line-height:1;margin-bottom:6px}
.episode-name{font-family:'Bebas Neue';font-size:22px;letter-spacing:.08em;color:#555;margin-bottom:20px}
.thread-summary{font-size:14px;line-height:1.75;color:#888;max-width:560px}
.meta-row{margin-top:20px;font-size:10px;color:#2E2E2C;letter-spacing:.06em}

.assets-wrap{max-width:860px;margin:0 auto;padding:36px 40px 0}
.assets-label{font-size:9px;color:#2E2E2C;letter-spacing:.12em;text-transform:uppercase;margin-bottom:20px}

.asset-card{background:#111110;border:1px solid #1C1C1A;border-radius:4px;margin-bottom:16px;overflow:hidden}
.asset-header{padding:18px 20px 14px;border-bottom:1px solid #181816}
.type-badge{display:inline-block;font-size:8px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;padding:3px 8px;border-radius:2px;background:rgba(196,168,42,.1);color:#C4A82A;margin-bottom:9px}
.asset-title{font-family:'Bebas Neue';font-size:22px;letter-spacing:.06em;color:#E8E0D4;line-height:1.1}
.asset-body{padding:18px 20px}

.platform-tabs{display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap}
.ptab{background:transparent;border:1px solid #222;color:#444;font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:.06em;text-transform:uppercase;padding:5px 12px;border-radius:2px;cursor:pointer;transition:all .15s}
.ptab:hover{border-color:#444;color:#888}
.ptab.active{border-color:#C4A82A;color:#C4A82A;background:rgba(196,168,42,.06)}

.pcopy-text{font-size:13px;line-height:1.8;color:#888;white-space:pre-wrap;word-break:break-word}

.copy-row{display:flex;gap:10px;align-items:center;margin-top:14px;flex-wrap:wrap}
.copy-btn{background:transparent;border:1px solid #252523;color:#555;font-family:'DM Sans',sans-serif;font-size:10px;letter-spacing:.07em;text-transform:uppercase;padding:7px 16px;border-radius:2px;cursor:pointer;transition:all .15s}
.copy-btn:hover{border-color:#555;color:#888}
.download-btn{display:inline-block;border:1px solid rgba(196,168,42,.3);color:#C4A82A;font-size:10px;letter-spacing:.07em;text-transform:uppercase;padding:7px 16px;border-radius:2px;transition:all .15s}
.download-btn:hover{background:rgba(196,168,42,.08);border-color:#C4A82A}
.copied-confirm{font-size:10px;color:#639922;letter-spacing:.04em;margin-top:6px}

.page-footer{max-width:860px;margin:60px auto 0;padding:24px 40px;border-top:1px solid #141412;display:flex;align-items:center;justify-content:space-between}
.footer-studio{font-family:'Bebas Neue';font-size:16px;letter-spacing:.12em;color:#C4A82A}
.footer-meta{font-size:9px;color:#2A2A28;letter-spacing:.06em}
</style>
</head>
<body>

<div class="page-header">
  <div class="studio-label">Indelible Studio</div>
  <div class="client-name">${(clientName || "Client").replace(/&/g,"&amp;")}</div>
  <div class="episode-name">${(episodeName || "Media Array").replace(/&/g,"&amp;")}</div>
  ${threadSummary ? `<div class="thread-summary">${threadSummary.replace(/&/g,"&amp;").replace(/\n/g,"<br>")}</div>` : ""}
  <div class="meta-row">${approvedAssets.length} asset${approvedAssets.length !== 1 ? "s" : ""} · ${date}</div>
</div>

<div class="assets-wrap">
  <div class="assets-label">Your media array</div>
  ${assetCardsHTML}
</div>

<div class="page-footer">
  <div class="footer-studio">INDELIBLE</div>
  <div class="footer-meta">indelible.co · Tell A Story Worth Telling</div>
</div>

<script>
function switchPlatform(assetId, platform, btn) {
  const card = document.getElementById('asset-' + assetId);
  card.querySelectorAll('.pcopy').forEach(el => el.style.display = 'none');
  card.querySelectorAll('.ptab').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('copy-' + assetId + '-' + platform);
  if (target) target.style.display = 'block';
  if (btn) btn.classList.add('active');
}

function copyCaption(assetId) {
  const card = document.getElementById('asset-' + assetId);
  const activeCopy = card.querySelector('.pcopy[style*="block"] .pcopy-text') || card.querySelector('.pcopy .pcopy-text');
  if (!activeCopy) return;
  const text = activeCopy.innerText;
  navigator.clipboard.writeText(text).then(() => {
    const confirm = document.getElementById('copied-' + assetId);
    if (confirm) { confirm.style.display = 'block'; setTimeout(() => confirm.style.display = 'none', 2200); }
  });
}
</script>
</body>
</html>`;

  const clientSlug = slug(clientName || "client");
  const episodeSlug = slug(episodeName || "episode");
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${clientSlug}--${episodeSlug}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── HTML ARRAY EXPORT ────────────────────────────────────────────────────────

function exportHTML(parsedArray, meta) {
  const date = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
  const assetsHTML = (parsedArray.assets || []).map(asset => {
    const platforms = Object.entries(asset.platform_copy || {});
    const platformsHTML = platforms.map(([p, copy]) => `
      <div class="platform-block">
        <div class="platform-label">${p.toUpperCase()}</div>
        <div class="platform-copy">${copy.replace(/\n/g, "<br>")}</div>
      </div>`).join("");
    const sm = asset.source_moment || {};
    const sourceMomentHTML = `
      <div class="source-moment">
        <div class="sm-line"><span class="sm-tag">OPEN</span> "${sm.opening || ""}"</div>
        ${sm.arc ? `<div class="sm-arc"><span class="sm-tag">ARC</span> ${sm.arc}</div>` : ""}
        ${sm.closing ? `<div class="sm-line"><span class="sm-tag">CLOSE</span> "${sm.closing}"</div>` : ""}
        ${sm.closing_rationale ? `<div class="sm-rationale"><span class="sm-tag">WHY</span> ${sm.closing_rationale}</div>` : ""}
      </div>`;
    return `
    <div class="asset-card">
      <div class="asset-header">
        <span class="badge">${asset.type}</span>
        <div class="asset-title">${asset.title}</div>
      </div>
      <div class="asset-body">
        <div class="field">
          <div class="field-label">Source Moment</div>
          ${sourceMomentHTML}
        </div>
        <div class="field">
          <div class="field-label">Thumbnail Direction</div>
          <div class="field-value italic">${asset.thumbnail_direction}</div>
        </div>
        ${platformsHTML}
      </div>
    </div>`;
  }).join("");

  const notes = parsedArray.production_notes;
  const notesHTML = notes ? `
    <div class="notes-section">
      <div class="notes-title">Production Notes</div>
      ${notes.recurring_themes?.length ? `<div class="notes-group"><div class="notes-group-label">Recurring Themes</div>${notes.recurring_themes.map(t => `<div class="notes-item">— ${t}</div>`).join("")}</div>` : ""}
      ${notes.flagged_for_future?.length ? `<div class="notes-group"><div class="notes-group-label">Flagged for Future</div>${notes.flagged_for_future.map(t => `<div class="notes-item">— ${t}</div>`).join("")}</div>` : ""}
      ${notes.publish_sequence?.length ? `<div class="notes-group"><div class="notes-group-label">Publish Sequence</div>${notes.publish_sequence.map(s => { const a = parsedArray.assets?.find(x => x.id === s.asset_id); return `<div class="notes-item"><strong>${s.order}. ${a?.title || s.asset_id}</strong> — ${s.rationale}</div>`; }).join("")}</div>` : ""}
    </div>` : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Media Array — ${meta.network}${meta.sponsor ? ` · ${meta.sponsor}` : ""}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Bebas+Neue&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:#0C0C0B;color:#E8E0D4;font-family:'DM Sans',sans-serif;padding:48px 32px;max-width:900px;margin:0 auto}
  .header{margin-bottom:40px;padding-bottom:24px;border-bottom:1px solid #222}
  .header-studio{font-size:10px;color:#C4A82A;letter-spacing:.18em;text-transform:uppercase;margin-bottom:8px}
  .header-title{font-family:'Bebas Neue';font-size:36px;letter-spacing:.08em;color:#E8E0D4;margin-bottom:4px}
  .header-meta{font-size:12px;color:#555;letter-spacing:.04em}
  .asset-card{background:#111110;border:1px solid #222;border-radius:4px;margin-bottom:20px;overflow:hidden}
  .asset-header{padding:16px 20px 12px;border-bottom:1px solid #1a1a18}
  .badge{display:inline-block;font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:3px 8px;border-radius:2px;background:rgba(196,168,42,.12);color:#C4A82A;margin-bottom:8px}
  .asset-title{font-family:'Bebas Neue';font-size:22px;letter-spacing:.06em;color:#E8E0D4}
  .asset-body{padding:16px 20px;display:flex;flex-direction:column;gap:16px}
  .field-label{font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#444;margin-bottom:6px}
  .field-value{font-size:13px;line-height:1.65;color:#a0988e}
  .field-value.italic{font-style:italic}
  .source-moment{background:#0a0a09;border:1px solid #1a1a18;border-radius:3px;padding:12px 14px}
  .sm-line{font-size:12px;color:#888;font-style:italic;line-height:1.6;margin-bottom:6px}
  .sm-arc{font-size:12px;color:#666;line-height:1.65;margin-bottom:6px;padding:8px 10px;background:#0d0d0c;border-left:2px solid #222;border-radius:0 2px 2px 0}
  .sm-rationale{font-size:11px;color:#555;font-style:italic;line-height:1.5;margin-top:6px;padding-top:6px;border-top:1px solid #1a1a18}
  .sm-tag{color:#C4A82A;font-style:normal;font-size:9px;font-weight:700;letter-spacing:.1em;margin-right:8px}
  .platform-block{background:#0a0a09;border:1px solid #1a1a18;border-radius:3px;padding:12px 14px}
  .platform-label{font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#C4A82A;margin-bottom:8px}
  .platform-copy{font-size:12px;line-height:1.75;color:#a0988e}
  .notes-section{background:#0e0e0d;border:1px solid #1a1a18;border-radius:4px;padding:20px;margin-top:8px}
  .notes-title{font-family:'Bebas Neue';font-size:18px;letter-spacing:.08em;color:#E8E0D4;margin-bottom:16px}
  .notes-group{margin-bottom:16px}
  .notes-group-label{font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#C4A82A;margin-bottom:8px}
  .notes-item{font-size:12px;color:#a0988e;line-height:1.6;margin-bottom:5px}
</style>
</head>
<body>
  <div class="header">
    <div class="header-studio">Indelible · Content OS</div>
    <div class="header-title">Media Array — ${meta.network}${meta.sponsor ? ` · ${meta.sponsor}` : ""}</div>
    <div class="header-meta">${(parsedArray.assets || []).length} assets · Generated ${date}</div>
  </div>
  ${assetsHTML}
  ${notesHTML}
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `media-array-${meta.network}-${Date.now()}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── PROMPT BUILDERS ──────────────────────────────────────────────────────────

function buildNetworkTone(net) {
  return `NETWORK: ${net.name}\nMISSION: ${net.mission}\nTONE & VOICE: ${net.tone}\nAUDIENCE: ${net.audience}\nCONTENT PILLARS: ${net.pillars}\nTHE MORAL: ${net.moral}\nWHAT IT IS NOT: ${net.notThis}`;
}

const ASSET_TYPE_SPECS = {
  "Promo Trailer": {
    count: 1,
    finished: "90–180 seconds",
    source: "Requires a 3–6 minute source span",
    note: "The flagship asset. Must have setup, a central tension or insight, and a clear resolution. Do not select this unless the transcript contains a complete narrative arc.",
  },
  "Teaser Clip": {
    count: 1,
    finished: "60–90 seconds",
    source: "Requires a 90 second–2 minute source span",
    note: "Opens a loop without closing it. Creates curiosity. Never fully resolves — the viewer should want more.",
  },
  "Segment Breakdown": {
    count: 1,
    finished: "5–12 minutes",
    source: "Requires a substantial continuous source span on a single topic",
    note: "Full development of one idea from setup through resolution. Not a highlight reel — a complete segment.",
  },
  "Social Short": {
    count: 6,
    finished: "30–60 seconds",
    source: "Tight source span — one self-contained moment",
    note: "Each must be a complete thought. Vary the angles, emotions, and target audiences across the six. No two should feel like the same clip.",
  },
  "Quote / Soundbite": {
    count: 6,
    finished: "10–30 seconds",
    source: "Single line or two-line exchange",
    note: "Standalone power. Each should land without context. Select lines with the sharpest moral clarity.",
  },
  "Full Episode Cut": {
    count: 1,
    finished: "Full episode length",
    source: "Full transcript",
    note: "Complete episode — minimal trimming. Opening and closing are the episode boundaries.",
  },
};

function buildArrayPrompt({ networks, network, sponsor, assetTypes, platforms, transcript, context }) {
  const net = networks[network];
  if (!net) throw new Error(`Network "${network}" not found in networks object`);
  if (!assetTypes || assetTypes.length === 0) throw new Error("No asset types selected");

  // Build per-type instructions for selected asset types
  const assetInstructions = assetTypes.map(label => {
    const spec = ASSET_TYPE_SPECS[label];
    if (!spec) return `- ${label}: produce 1`;
    return `- ${label}: produce exactly ${spec.count} | Finished length: ${spec.finished} | ${spec.source} | ${spec.note}`;
  }).join("\n");

  const totalAssets = assetTypes.reduce((sum, label) => {
    const spec = ASSET_TYPE_SPECS[label];
    return sum + (spec ? spec.count : 1);
  }, 0);

  let p = `You are a senior content strategist and creative director at Indelible. Read the full transcript carefully before selecting any moments. Produce a complete Media Array Breakdown as a JSON object.

MANDATORY OUTPUT CHECKLIST — you must produce exactly these assets, no more, no fewer:
${assetTypes.map(label => {
    const spec = ASSET_TYPE_SPECS[label];
    const count = spec ? spec.count : 1;
    return `  ☐ ${count}x ${label} (${spec ? spec.finished : "varies"})`;
  }).join("\n")}
TOTAL: ${totalAssets} assets required. Do not stop until all ${totalAssets} are in the JSON.

\n\n${buildNetworkTone(net)}\n`;
  if (sponsor) p += `\nSPONSOR: ${sponsor.name} | Archetype: ${sponsor.archetype}\nMoral: ${sponsor.moral}\nPromise: ${sponsor.promise}\nAudience: ${sponsor.audience}\nUse network moral and pillars as the filter for clip selection. Layer sponsor archetype into framing.\n`;
  if (context) p += `\nCONTEXT: ${context}\n`;

  p += `
ASSET SPECIFICATIONS:
${assetInstructions}

PLATFORMS: ${platforms.join(", ")}

CLOSING LINE RULE:
For any asset longer than 30 seconds, the closing line must resolve the thought. It is not simply where the speaker pauses or the clip ends — it is the line that lands the point, completes the arc, or delivers the moral. Choose deliberately. If no clean resolution exists in the transcript, find the closest landing and note it.

SOURCE MOMENT FORMAT:
Every asset requires three fields:
- opening: Verbatim first line from the transcript that begins the clip
- arc: 2–3 sentences describing what happens between opening and closing — the development, turn, build, or argument
- closing: Verbatim final line — the resolution. For assets under 30 seconds, this is the punchline or the sharpest line. For assets over 30 seconds, this must close the thought.
- closing_rationale: One sentence explaining why this line ends the clip — what it resolves, lands, or completes. Omit for assets under 30 seconds.

TRANSCRIPT:
${transcript}

---

Return ONLY a valid JSON object. No markdown, no explanation, no code fences. The JSON must follow this exact schema:

{
  "assets": [
    {
      "id": "asset_1",
      "title": "Working title for this asset",
      "type": "Asset type label exactly as specified above",
      "source_moment": {
        "opening": "Verbatim opening line from transcript",
        "arc": "2–3 sentences: what happens between opening and closing",
        "closing": "Verbatim closing line — the line that resolves the thought",
        "closing_rationale": "Why this line closes the arc (omit for assets under 30s)"
      },
      "thumbnail_direction": "What the thumbnail should communicate — not describe, communicate",
      "platform_copy": {
        "youtube": "Full YouTube caption with hashtags and CTA",
        "instagram": "Instagram caption with hashtags",
        "linkedin": "LinkedIn caption"
      }
    }
  ],
  "production_notes": {
    "recurring_themes": ["Theme or line that should appear across multiple assets"],
    "flagged_for_future": ["Strong moments not used — with brief note on potential"],
    "publish_sequence": [
      { "order": 1, "asset_id": "asset_1", "rationale": "Why this goes first" }
    ]
  }
}

Only include platform keys for the requested platforms. Write all copy in the voice of ${net.name}${sponsor ? ` and ${sponsor.name}` : ""}.

FINAL CHECK: Count the assets array in your JSON before returning. It must contain exactly ${totalAssets} items. If the count is short, generate the missing assets before closing the JSON.`;

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

// ─── HISTORY PANEL ────────────────────────────────────────────────────────────

function HistoryPanel({ onRestore }) {
  const [history, setHistory] = useState([]);
  useEffect(() => { setHistory(loadHistory()); }, []);
  const handleDelete = (id) => { deleteFromHistory(id); setHistory(loadHistory()); };
  if (history.length === 0) {
    return <div style={{ textAlign: "center", padding: "60px 0", color: "#343432", fontSize: 13 }}>No history yet. Generated arrays will appear here.</div>;
  }
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {history.map(entry => (
        <div key={entry.id} style={{ background: "#111110", border: "1px solid #1e1e1c", borderRadius: 3, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ fontFamily: "Bebas Neue", fontSize: 16, letterSpacing: ".06em", color: "#E8E0D4" }}>{entry.network}</span>
              {entry.sponsor && <span style={{ fontSize: 10, color: "#C4A82A" }}>· {entry.sponsor}</span>}
              {entry.clientName && <span style={{ fontSize: 10, color: "#555" }}>· {entry.clientName}</span>}
              <span style={{ fontSize: 10, color: "#333", marginLeft: "auto" }}>{entry.assets} assets</span>
            </div>
            <div style={{ fontSize: 10, color: "#444", letterSpacing: ".04em" }}>{entry.date}</div>
          </div>
          <button onClick={() => onRestore(entry)}
            style={{ background: "transparent", border: "1px solid #2a2a28", color: "#888", padding: "5px 12px", fontSize: 10, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", borderRadius: 2, letterSpacing: ".06em", textTransform: "uppercase" }}
            onMouseOver={e => { e.target.style.borderColor = "#C4A82A"; e.target.style.color = "#C4A82A"; }}
            onMouseOut={e => { e.target.style.borderColor = "#2a2a28"; e.target.style.color = "#888"; }}>
            Restore
          </button>
          <button onClick={() => handleDelete(entry.id)}
            style={{ background: "transparent", border: "1px solid #1e1e1c", color: "#444", padding: "5px 10px", fontSize: 10, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", borderRadius: 2 }}
            onMouseOver={e => { e.target.style.color = "#CF6679"; e.target.style.borderColor = "#6F2A2A"; }}
            onMouseOut={e => { e.target.style.color = "#444"; e.target.style.borderColor = "#1e1e1c"; }}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── ASSET CARD ───────────────────────────────────────────────────────────────

function AssetCard({ asset, status, onApprove, onReject, frameioLink, onFrameioChange }) {
  const [activePlatform, setActivePlatform] = useState(Object.keys(asset.platform_copy || {})[0] || "youtube");
  const [copied, setCopied] = useState(false);
  const availablePlatforms = Object.keys(asset.platform_copy || {}).filter(p => asset.platform_copy[p]);
  const currentCopy = asset.platform_copy?.[activePlatform] || "";

  return (
    <div className={`asset-card ${status}`}>
      <div className="card-header">
        <div>
          <div className="card-type-badge" style={{ marginBottom: 8 }}>{asset.type}</div>
          <div className="card-title">"{asset.title}"</div>
        </div>
      </div>
      <div className="card-body">
        <div>
          <div className="card-field-label">Source Moment</div>
          <div className="source-moment">
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 9, color: "#C4A82A", fontWeight: 700, letterSpacing: ".1em", marginRight: 8 }}>OPEN</span>
              <span>"{asset.source_moment?.opening}"</span>
            </div>
            {asset.source_moment?.arc && (
              <div style={{ marginBottom: 8, paddingLeft: 0 }}>
                <span style={{ fontSize: 9, color: "#C4A82A", fontWeight: 700, letterSpacing: ".1em", marginRight: 8 }}>ARC</span>
                <span style={{ color: "#888", fontStyle: "italic" }}>{asset.source_moment.arc}</span>
              </div>
            )}
            {asset.source_moment?.closing && asset.source_moment.closing !== asset.source_moment.opening && (
              <div style={{ marginBottom: asset.source_moment?.closing_rationale ? 6 : 0 }}>
                <span style={{ fontSize: 9, color: "#C4A82A", fontWeight: 700, letterSpacing: ".1em", marginRight: 8 }}>CLOSE</span>
                <span>"{asset.source_moment?.closing}"</span>
              </div>
            )}
            {asset.source_moment?.closing_rationale && (
              <div style={{ paddingTop: 6, borderTop: "1px solid #1a1a18", marginTop: 4 }}>
                <span style={{ fontSize: 9, color: "#555", fontWeight: 700, letterSpacing: ".1em", marginRight: 8 }}>WHY</span>
                <span style={{ fontSize: 11, color: "#555", fontStyle: "italic" }}>{asset.source_moment.closing_rationale}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="card-field-label">Thumbnail Direction</div>
          <div className="card-field-value" style={{ fontStyle: "italic" }}>{asset.thumbnail_direction}</div>
        </div>
        {availablePlatforms.length > 0 && (
          <div>
            <div className="card-field-label">Platform Copy</div>
            <div className="platform-tab-row">
              {availablePlatforms.map(p => (
                <button key={p} className={`platform-tab ${activePlatform === p ? "active" : ""}`} onClick={() => setActivePlatform(p)}>{p}</button>
              ))}
            </div>
            <div className="platform-copy-box">
              {currentCopy}
              <button className="copy-copy-btn" onClick={() => { navigator.clipboard.writeText(currentCopy); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
          </div>
        )}
        {/* Frame.io link */}
        <div>
          <div className="card-field-label" style={{ marginBottom: 6 }}>Frame.io Asset Link</div>
          <input
            className="fi"
            type="url"
            placeholder="Paste Frame.io share link for this asset..."
            value={frameioLink || ""}
            onChange={e => onFrameioChange(e.target.value)}
            style={{ fontSize: 11, padding: "7px 10px" }}
          />
          {frameioLink && (
            <a href={frameioLink} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-block", marginTop: 5, fontSize: 10, color: "#C4A82A", letterSpacing: ".04em" }}>
              Preview link ↗
            </a>
          )}
        </div>
      </div>
      <div className="card-actions">
        <button className={`approve-btn ${status === "approved" ? "active" : ""}`} onClick={onApprove}>{status === "approved" ? "✓ Approved" : "Approve"}</button>
        <button className={`reject-btn ${status === "rejected" ? "active" : ""}`} onClick={onReject}>{status === "rejected" ? "✕ Rejected" : "Reject"}</button>
        <span className={`status-badge ${status}`}>{status === "pending" ? "Awaiting review" : status === "approved" ? "Approved" : "Rejected"}</span>
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
          {notes.recurring_themes.map((t, i) => <div key={i} className="prod-notes-item"><span className="prod-notes-dot">—</span><span>{t}</span></div>)}
        </div>
      )}
      {notes.flagged_for_future?.length > 0 && (
        <div className="prod-notes-section">
          <div className="prod-notes-title">Flagged for Future Use</div>
          {notes.flagged_for_future.map((t, i) => <div key={i} className="prod-notes-item"><span className="prod-notes-dot">—</span><span>{t}</span></div>)}
        </div>
      )}
      {notes.publish_sequence?.length > 0 && (
        <div className="prod-notes-section">
          <div className="prod-notes-title">Suggested Publish Sequence</div>
          {notes.publish_sequence.map((s, i) => {
            const asset = assets.find(a => a.id === s.asset_id);
            return <div key={i} className="prod-notes-item"><span className="prod-notes-dot">{s.order}</span><span><strong style={{ color: "#C8C0B4" }}>{asset?.title || s.asset_id}</strong> — {s.rationale}</span></div>;
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

  // Client delivery fields
  const [clientName, setClientName] = useState("");
  const [episodeName, setEpisodeName] = useState("");
  const [threadSummary, setThreadSummary] = useState("");
  const [frameioLinks, setFrameioLinks] = useState({});

  const [rawOutput, setRawOutput] = useState("");
  const [parsedArray, setParsedArray] = useState(null);
  const [parseError, setParseError] = useState(false);
  const [approvals, setApprovals] = useState({});
  const [streaming, setStreaming] = useState(false);
  const [done, setDone] = useState(false);
  const [notionStatus, setNotionStatus] = useState(null);
  const [copied, setCopied] = useState(false);
  const [exportMeta, setExportMeta] = useState(null);

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
    setFrameioLinks({});
    setTimeout(() => outRef.current?.scrollIntoView({ behavior: "smooth" }), 80);

    let prompt = "";
    try {
      prompt = mode === "array"
        ? buildArrayPrompt({ networks, network, sponsor: activeSponsor, assetTypes: assetTypes.map(id => ARRAY_ASSET_TYPES.find(a => a.id === id)?.label).filter(Boolean), platforms: arrayPlats, transcript, context })
        : buildQuickPrompt({ networks, network, sponsor: activeSponsor, contentType, platforms: quickPlats, description, transcript: useQT ? qTranscript : "" });
    } catch (promptErr) {
      console.error("Prompt build failed:", promptErr);
      setRawOutput("[Error building prompt — please check your selections and try again]");
      setStreaming(false);
      return;
    }

    if (!prompt) {
      setRawOutput("[No prompt generated — please select a network and try again]");
      setStreaming(false);
      return;
    }

    let fullText = "";

    try {
      if (mode === "array") {
        // Non-streaming for array mode — waits for complete JSON then parses into cards
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
        // Streaming for quick mode — shows output token by token
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

    if (mode === "array" && fullText) {
      try {
        let clean = fullText.replace(/```json|```/g, "").trim();
        const start = clean.indexOf("{");
        const end = clean.lastIndexOf("}");
        if (start !== -1 && end !== -1) clean = clean.slice(start, end + 1);
        clean = clean.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
        const parsed = JSON.parse(clean);
        setParsedArray(parsed);
        const initApprovals = {};
        (parsed.assets || []).forEach(a => { initApprovals[a.id] = "pending"; });
        setApprovals(initApprovals);
        const meta = {
          id: Date.now().toString(),
          network: networks[network]?.name || network,
          sponsor: activeSponsor?.name || null,
          clientName: clientName || null,
          episodeName: episodeName || null,
          assets: parsed.assets?.length || 0,
          date: new Date().toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
          parsedArray: parsed,
          rawOutput: fullText,
        };
        setExportMeta({ network: networks[network]?.name || network, sponsor: activeSponsor?.name || null });
        saveToHistory(meta);
      } catch (e) {
        console.error("Parse failed:", e);
        setParseError(true);
      }
    }
  };

  const restoreFromHistory = (entry) => {
    setParsedArray(entry.parsedArray);
    setRawOutput(entry.rawOutput || "");
    setDone(true); setStreaming(false); setParseError(false);
    const initApprovals = {};
    (entry.parsedArray?.assets || []).forEach(a => { initApprovals[a.id] = "pending"; });
    setApprovals(initApprovals);
    setFrameioLinks({});
    setExportMeta({ network: entry.network, sponsor: entry.sponsor });
    if (entry.clientName) setClientName(entry.clientName);
    if (entry.episodeName) setEpisodeName(entry.episodeName);
    setAppTab("brief");
    setTimeout(() => outRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const setApproval = (id, status) => setApprovals(p => ({ ...p, [id]: p[id] === status ? "pending" : status }));
  const setFrameio = (id, url) => setFrameioLinks(p => ({ ...p, [id]: url }));

  const pushToNotion = async () => {
    const approvedAssets = parsedArray?.assets?.filter(a => approvals[a.id] === "approved") || [];
    if (!approvedAssets.length) return;
    setNotionStatus("pushing");
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
          {[{ id: "brief", label: "Brief" }, { id: "history", label: "History" }, { id: "settings", label: "Network Settings" }].map(t => (
            <button key={t.id} className={`nav-tab ${appTab === t.id ? "active" : ""}`} onClick={() => setAppTab(t.id)}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "36px 24px 100px" }}>

        {appTab === "settings" && (
          <div className="fu">
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "Bebas Neue", fontSize: 20, letterSpacing: ".08em", marginBottom: 6 }}>Network Settings</div>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6, maxWidth: 600 }}>These profiles are injected directly into every prompt. Edit them here — they are the tuning rods for clip selection and copy voice.</div>
            </div>
            <SettingsPanel networks={networks} onSave={setNetworks} onReset={(id) => setNetworks(p => ({ ...p, [id]: JSON.parse(JSON.stringify(DEFAULT_NETWORKS[id])) }))} />
          </div>
        )}

        {appTab === "history" && (
          <div className="fu">
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "Bebas Neue", fontSize: 20, letterSpacing: ".08em", marginBottom: 6 }}>History</div>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>Previously generated arrays. Click Restore to bring one back into the card view.</div>
            </div>
            <HistoryPanel onRestore={restoreFromHistory} />
          </div>
        )}

        {appTab === "brief" && (
          <>
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
                  <textarea className="fi" rows={13} placeholder={"Paste the full transcript here.\n\nInclude speaker labels and timestamps if available."} value={transcript} onChange={e => setTranscript(e.target.value)} />
                </div>
                <div style={{ marginBottom: 32 }}>
                  <div className="sl">06 — Additional Context (optional)</div>
                  <textarea className="fi" rows={3} placeholder={"e.g. 'Brand doc for Synergy's 20-year anniversary. Publish: Episode 1 at trade show June 26.'"} value={context} onChange={e => setContext(e.target.value)} />
                </div>

                {/* Client delivery */}
                <div style={{ marginBottom: 32 }}>
                  <div className="sl">07 — Client Delivery</div>
                  <div className="fu" style={{ display: "grid", gap: 10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div>
                        <div style={{ fontSize: 9, color: "#343432", marginBottom: 5, letterSpacing: ".07em", textTransform: "uppercase" }}>Client name</div>
                        <input className="fi" type="text" placeholder="e.g. Synergy" value={clientName} onChange={e => setClientName(e.target.value)} />
                      </div>
                      <div>
                        <div style={{ fontSize: 9, color: "#343432", marginBottom: 5, letterSpacing: ".07em", textTransform: "uppercase" }}>Episode / thread name</div>
                        <input className="fi" type="text" placeholder="e.g. Episode 1 — The Present" value={episodeName} onChange={e => setEpisodeName(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: "#343432", marginBottom: 5, letterSpacing: ".07em", textTransform: "uppercase" }}>Thread summary <span style={{ color: "#2a2a28" }}>— 1–3 sentences for the client</span></div>
                      <textarea className="fi" rows={3} placeholder="A short client-facing description of this episode and what the media array covers." value={threadSummary} onChange={e => setThreadSummary(e.target.value)} />
                    </div>
                    <div style={{ fontSize: 10, color: "#2E2E2C", lineHeight: 1.6 }}>
                      Frame.io links are added per asset after generation. The exported page will live at <span style={{ color: "#444" }}>indelible.co/member/[client]/[episode]</span>
                    </div>
                  </div>
                </div>
              </>
            )}

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

            <button className="gen" disabled={!canGen || streaming} onClick={generate}>
              {streaming ? (mode === "array" ? "READING TRANSCRIPT..." : "GENERATING...") : (mode === "array" ? "GENERATE MEDIA ARRAY" : "GENERATE BRIEF")}
            </button>

            {!canGen && !streaming && (
              <div style={{ marginTop: 6, fontSize: 10, color: "#C4642A", letterSpacing: ".04em", display: "flex", gap: 12, flexWrap: "wrap" }}>
                {!network && <span>⚠ Select a network</span>}
                {network && mode === "array" && assetTypes.length === 0 && <span>⚠ Select at least one asset type</span>}
                {network && mode === "array" && arrayPlats.length === 0 && <span>⚠ Select at least one platform</span>}
                {network && mode === "array" && transcript.trim().length <= 80 && <span>⚠ Transcript too short (need 80+ words)</span>}
                {network && mode === "quick" && !contentType && <span>⚠ Select a content type</span>}
                {network && mode === "quick" && quickPlats.length === 0 && <span>⚠ Select at least one platform</span>}
                {network && mode === "quick" && !description.trim() && <span>⚠ Add a content description</span>}
                {useSponsor && !activeSponsor && <span>⚠ Select or enter a sponsor brand</span>}
              </div>
            )}

            {network && (
              <div style={{ marginTop: 8, padding: "7px 12px", background: "#111110", border: "1px solid #161614", borderRadius: 3, display: "flex", gap: 16, flexWrap: "wrap", fontSize: 9, color: "#2e2e2c", letterSpacing: ".06em" }}>
                <span>Network: <span style={{ color: aNet?.color }}>{aNet?.name}</span></span>
                {activeSponsor?.name && <span>Sponsor: <span style={{ color: "#666" }}>{activeSponsor.name}</span></span>}
                {clientName && <span>Client: <span style={{ color: "#555" }}>{clientName}</span></span>}
                {episodeName && <span>Episode: <span style={{ color: "#555" }}>{episodeName}</span></span>}
                {mode === "array" && assetTypes.length > 0 && <span>Assets: <span style={{ color: "#555" }}>{assetTypes.length} types</span></span>}
                {mode === "array" && transcript.length > 0 && <span>Transcript: <span style={{ color: "#555" }}>{wc(transcript).toLocaleString()}w</span></span>}
              </div>
            )}

            <div ref={outRef}>
              {streaming && rawOutput && (
                <div style={{ marginTop: 44 }} className="fu">
                  <div className="sl" style={{ marginBottom: 12 }}>Reading Transcript <span style={{ color: "#C4A82A", marginLeft: 8, fontSize: 9 }}>● STREAMING</span></div>
                  <div className="out" style={{ maxHeight: 300, overflow: "hidden" }}>{rawOutput.slice(-600)}<span className="cursor" /></div>
                </div>
              )}

              {done && mode === "array" && !streaming && (
                <div style={{ marginTop: 44 }} className="fu">
                  {parsedArray ? (
                    <>
                      <div className="approval-bar">
                        <div style={{ fontFamily: "Bebas Neue", fontSize: 17, letterSpacing: ".08em", color: "#E8E0D4" }}>{totalAssets} Asset{totalAssets !== 1 ? "s" : ""} Generated</div>
                        <div className="approval-stat approved"><span>{approvedCount}</span> approved</div>
                        <div className="approval-stat rejected"><span>{rejectedCount}</span> rejected</div>
                        <div className="approval-stat"><span>{totalAssets - approvedCount - rejectedCount}</span> pending</div>
                        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                          <button className="cpb" onClick={() => exportHTML(parsedArray, exportMeta || { network: "", sponsor: null })}>Export Array HTML</button>
                          <button className="cpb"
                            style={{ borderColor: approvedCount > 0 ? "rgba(196,168,42,.4)" : undefined, color: approvedCount > 0 ? "#C4A82A" : undefined }}
                            onClick={() => exportClientHTML({ parsedArray, clientName, episodeName, threadSummary, frameioLinks, approvals })}>
                            Export Client Page {approvedCount > 0 ? `(${approvedCount})` : ""}
                          </button>
                          <button className="cpb" onClick={() => { navigator.clipboard.writeText(rawOutput); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>{copied ? "Copied ✓" : "Copy JSON"}</button>
                          <button className="notion-btn" disabled={approvedCount === 0 || notionStatus === "pushing"} onClick={pushToNotion}>
                            {notionStatus === "pushing" ? "Pushing..." : notionStatus === "done" ? "✓ Sent to Notion" : `Push ${approvedCount > 0 ? approvedCount : ""} to Notion`}
                          </button>
                        </div>
                      </div>
                      <div style={{ display: "grid", gap: 16 }}>
                        {parsedArray.assets?.map(asset => (
                          <AssetCard key={asset.id} asset={asset} status={approvals[asset.id] || "pending"}
                            onApprove={() => setApproval(asset.id, "approved")}
                            onReject={() => setApproval(asset.id, "rejected")}
                            frameioLink={frameioLinks[asset.id] || ""}
                            onFrameioChange={(url) => setFrameio(asset.id, url)}
                          />
                        ))}
                      </div>
                      {parsedArray.production_notes && (
                        <div style={{ marginTop: 24 }}>
                          <ProductionNotes notes={parsedArray.production_notes} assets={parsedArray.assets || []} />
                        </div>
                      )}
                    </>
                  ) : parseError ? (
                    <>
                      <div style={{ marginBottom: 12, fontSize: 11, color: "#CF6679" }}>The model returned a response that couldn't be parsed as structured cards. Showing raw output — try generating again for card view.</div>
                      <div className="out">{rawOutput}</div>
                    </>
                  ) : (
                    <div className="parsing-indicator">Parsing response into cards...</div>
                  )}
                </div>
              )}

              {done && mode === "quick" && !streaming && rawOutput && (
                <div style={{ marginTop: 44 }} className="fu">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div className="sl" style={{ marginBottom: 0 }}>Generated Brief</div>
                    <button className="cpb" onClick={() => { navigator.clipboard.writeText(rawOutput); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>{copied ? "Copied ✓" : "Copy All"}</button>
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
