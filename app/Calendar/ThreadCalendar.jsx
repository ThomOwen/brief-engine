
'use client';

import { useState, useMemo, useEffect } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG       = "#0E0E0F";
const SURFACE  = "#181819";
const SURFACE2 = "#202022";
const BORDER   = "rgba(255,255,255,0.07)";
const BORDER2  = "rgba(255,255,255,0.13)";
const T1       = "rgba(255,255,255,0.88)";
const T2       = "rgba(255,255,255,0.45)";
const T3       = "rgba(255,255,255,0.2)";
const T4       = "rgba(255,255,255,0.1)";

const COLORS = {
  teal:   "#1D9E75",
  purple: "#7F77DD",
  coral:  "#D85A30",
  blue:   "#378ADD",
  amber:  "#BA7517",
  green:  "#639922",
  pink:   "#D4537E",
};
const COLOR_KEYS = Object.keys(COLORS);

const CH_CLR = { youtube:"#E24B4A", instagram:"#D85A30", linkedin:"#378ADD", email:"#639922" };
const CH_LBL = { youtube:"YT", instagram:"IG", linkedin:"LI", email:"✉" };
const STATUSES = ["Pre-production","In shoot","In post","Live","Ongoing","Complete"];

// ─── Date utils ───────────────────────────────────────────────────────────────
const d0      = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a,b) => d0(a).getTime() === d0(b).getTime();
const addDays = (d,n) => { const r=new Date(d); r.setDate(r.getDate()+n); return r; };
const inRange = (d,s,e) => d0(d) >= d0(s) && d0(d) <= d0(e);
const fmtDate = d => d.toLocaleDateString("en-CA",{month:"short",day:"numeric"});
const toISO   = d => d.toISOString().slice(0,10);
const fromISO = s => { const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); };

function getMonthWeeks(yr,mo) {
  const first=new Date(yr,mo,1), last=new Date(yr,mo+1,0);
  const off=(first.getDay()+6)%7;
  let cur=addDays(first,-off);
  const weeks=[];
  while(cur<=last||weeks.length<4){
    weeks.push(Array.from({length:7},(_,i)=>addDays(cur,i)));
    cur=addDays(cur,7);
    if(cur>last&&weeks.length>=6) break;
  }
  return weeks;
}

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_THREADS = [
  {
    id:"syn1", client:"Synergy", color:"teal",
    title:"Episode 1 — The Present",
    moral:"Proven organizations expand on purpose.",
    pillar:"Brand positioning / U.S. expansion",
    status:"In post",
    shootStart:"2026-04-07", shootEnd:"2026-04-08",
    dueDate:"2026-04-28",
    posts:[
      {date:"2026-04-28",ch:["youtube","linkedin"],caption:"Synergy is expanding into the U.S. Here's why this moment matters."},
      {date:"2026-05-01",ch:["instagram"],caption:"20 years of building trust. One decision to take it south."},
      {date:"2026-05-05",ch:["linkedin","email"],caption:"What does intentional expansion actually look like?"},
      {date:"2026-05-08",ch:["instagram"],caption:"The team that built this is the team taking it forward."},
      {date:"2026-05-12",ch:["youtube"],caption:"Behind the expansion — Episode 1 now on YouTube."},
      {date:"2026-05-15",ch:["instagram","linkedin"],caption:"Growth on your terms. That's the Synergy way."},
    ],
  },
  {
    id:"mddl1", client:"MDDL", color:"purple",
    title:"Walking Tour Film",
    moral:"Middle housing is the smartest solution hiding in plain sight.",
    pillar:"Stakeholder education / mission amplification",
    status:"Pre-production",
    shootStart:"2026-04-21", shootEnd:"2026-04-22",
    dueDate:"2026-05-26",
    posts:[
      {date:"2026-05-26",ch:["youtube","linkedin"],caption:"Walk with us. Middle housing, explained on the ground."},
      {date:"2026-05-29",ch:["instagram"],caption:"This neighborhood tells the whole story."},
      {date:"2026-06-02",ch:["linkedin"],caption:"Why middle housing is the missing middle of housing policy."},
      {date:"2026-06-05",ch:["instagram","email"],caption:"The tour that changes how you see your street."},
    ],
  },
  {
    id:"jg1", client:"Jon Gordon", color:"coral",
    title:"The Motivators — Pilot",
    moral:"Positive leadership runs in families.",
    pillar:"Audience expansion / sponsor acquisition",
    status:"In post",
    shootStart:"2026-03-16", shootEnd:"2026-03-18",
    dueDate:"2026-05-01",
    posts:[
      {date:"2026-05-01",ch:["youtube"],caption:"Meet the family behind the philosophy. The Motivators — Pilot."},
      {date:"2026-05-04",ch:["instagram","linkedin"],caption:"What happens when leadership is a family value?"},
      {date:"2026-05-07",ch:["instagram"],caption:"Jon and his kids. On mission, together."},
      {date:"2026-05-11",ch:["youtube","email"],caption:"The pilot is live. Watch the full episode now."},
    ],
  },
  {
    id:"lg1", client:"Ladder Genie", color:"blue",
    title:"Performance Storytelling",
    moral:"The right tool changes what's possible in a season.",
    pillar:"Direct response / launch conversion",
    status:"Live",
    shootStart:"2026-03-13", shootEnd:"2026-03-17",
    dueDate:"2026-04-07",
    posts:[
      {date:"2026-04-07",ch:["youtube","instagram"],caption:"Stop carrying bundles. Start using Ladder Genie."},
      {date:"2026-04-10",ch:["linkedin"],caption:"How one product changes your crew's entire season."},
      {date:"2026-04-14",ch:["instagram","email"],caption:"$10,000 saved per season. Here's the math."},
      {date:"2026-04-17",ch:["youtube"],caption:"The roofer who got tired of the old way."},
      {date:"2026-04-21",ch:["instagram","linkedin"],caption:"45 minutes to load a roof. That's the Ladder Genie standard."},
      {date:"2026-04-24",ch:["instagram"],caption:"Your crew deserves better. Get yours at laddergenie.ca"},
      {date:"2026-04-28",ch:["youtube","email"],caption:"Season is here. Are you ready?"},
    ],
  },
  {
    id:"mc1", client:"Andreas", color:"amber",
    title:"Mind of a CEO — Season 2",
    moral:"CEO mindset is a craft — learnable and teachable.",
    pillar:"Thought leadership / audience building",
    status:"Ongoing",
    shootStart:"2026-03-02", shootEnd:"2026-07-31",
    dueDate:"2026-07-31",
    posts:[
      {date:"2026-04-03",ch:["youtube","linkedin"],caption:"Episode 1: The discipline of the CEO mind."},
      {date:"2026-04-10",ch:["youtube","linkedin"],caption:"Episode 2: Decision fatigue — and how to beat it."},
      {date:"2026-04-17",ch:["youtube","linkedin"],caption:"Episode 3: Why your calendar is your strategy."},
      {date:"2026-04-24",ch:["youtube","linkedin"],caption:"Episode 4: The CEO who reads. Spot the difference."},
      {date:"2026-05-01",ch:["youtube","linkedin"],caption:"Episode 5: Building a team that doesn't need you."},
      {date:"2026-05-08",ch:["youtube","linkedin"],caption:"Episode 6: When to pivot. When to hold."},
    ],
  },
];

const INTERNAL = [
  {label:"Edit focus",    type:"edit"},
  {label:"Thread review", type:"review"},
];

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Btn({ children, onClick, primary, small, danger }) {
  return (
    <button onClick={onClick} style={{
      padding: small ? "4px 10px" : "7px 14px",
      fontSize: small ? 11 : 12,
      border: danger ? "0.5px solid rgba(226,75,74,0.4)" : `0.5px solid ${BORDER2}`,
      borderRadius:6, cursor:"pointer",
      background: primary ? "rgba(255,255,255,0.1)" : danger ? "rgba(226,75,74,0.1)" : "transparent",
      color: danger ? "#E24B4A" : T1, fontWeight:500,
    }}>{children}</button>
  );
}

function Input({ value, onChange, placeholder, type="text", style={} }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ background:SURFACE2, border:`0.5px solid ${BORDER2}`, borderRadius:6,
        color:T1, fontSize:11, padding:"6px 10px", width:"100%", boxSizing:"border-box",
        outline:"none", ...style }} />
  );
}

function Label({ children }) {
  return <div style={{ fontSize:9, color:T3, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:4 }}>{children}</div>;
}

// ─── Thread form ──────────────────────────────────────────────────────────────
function ThreadForm({ initial, onSave, onCancel }) {
  const blank = { id:"", client:"", color:"teal", title:"", moral:"", pillar:"", status:"Pre-production", shootStart:"", shootEnd:"", dueDate:"", posts:[] };
  const [form, setForm] = useState(initial || blank);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const valid = form.client && form.title && form.shootStart && form.dueDate;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <div><Label>Client</Label><Input value={form.client} onChange={e=>set("client",e.target.value)} placeholder="Client name"/></div>
        <div>
          <Label>Color</Label>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginTop:2 }}>
            {COLOR_KEYS.map(c=>(
              <div key={c} onClick={()=>set("color",c)} style={{
                width:18, height:18, borderRadius:4, background:COLORS[c], cursor:"pointer",
                outline: form.color===c ? `2px solid ${T1}` : "2px solid transparent",
                outlineOffset:1,
              }}/>
            ))}
          </div>
        </div>
      </div>
      <div><Label>Thread title</Label><Input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="Episode title or project name"/></div>
      <div><Label>Moral / narrative spine</Label><Input value={form.moral} onChange={e=>set("moral",e.target.value)} placeholder="What is the moral of this story?"/></div>
      <div><Label>Strategic pillar</Label><Input value={form.pillar} onChange={e=>set("pillar",e.target.value)} placeholder="Content objective or campaign goal"/></div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
        <div><Label>Shoot start</Label><Input type="date" value={form.shootStart} onChange={e=>set("shootStart",e.target.value)}/></div>
        <div><Label>Shoot end</Label><Input type="date" value={form.shootEnd} onChange={e=>set("shootEnd",e.target.value)}/></div>
        <div><Label>Thread due</Label><Input type="date" value={form.dueDate} onChange={e=>set("dueDate",e.target.value)}/></div>
      </div>
      <div>
        <Label>Status</Label>
        <select value={form.status} onChange={e=>set("status",e.target.value)} style={{
          background:SURFACE2, border:`0.5px solid ${BORDER2}`, color:T1,
          fontSize:11, padding:"6px 10px", borderRadius:6, width:"100%", outline:"none",
        }}>
          {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div style={{ display:"flex", gap:8, justifyContent:"flex-end", paddingTop:4 }}>
        <Btn onClick={onCancel}>Cancel</Btn>
        <Btn primary onClick={()=>valid&&onSave({...form,id:form.id||`t_${Date.now()}`})}>
          {initial ? "Save changes" : "Create thread"}
        </Btn>
      </div>
    </div>
  );
}

// ─── Threads page ─────────────────────────────────────────────────────────────
function ThreadsPage({ threads, onAdd, onEdit, onDelete }) {
  const [adding,  setAdding]  = useState(false);
  const [editing, setEditing] = useState(null);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <span style={{ fontSize:12, fontWeight:500, color:T2 }}>{threads.length} thread{threads.length!==1?"s":""} in library</span>
        {!adding && !editing && <Btn primary small onClick={()=>setAdding(true)}>+ New thread</Btn>}
      </div>

      {(adding || editing) && (
        <div style={{ background:SURFACE, border:`0.5px solid ${BORDER2}`, borderRadius:8, padding:"14px 16px", marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:500, marginBottom:12, color:T1 }}>
            {editing ? "Edit thread" : "New thread"}
          </div>
          <ThreadForm
            initial={editing}
            onSave={t=>{ editing ? onEdit(t) : onAdd(t); setAdding(false); setEditing(null); }}
            onCancel={()=>{ setAdding(false); setEditing(null); }}
          />
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {threads.map(t=>{
          const clr = COLORS[t.color];
          return (
            <div key={t.id} style={{ background:SURFACE, border:`0.5px solid ${BORDER}`, borderRadius:8, padding:"12px 14px", display:"flex", alignItems:"flex-start", gap:12 }}>
              <div style={{ width:3, alignSelf:"stretch", borderRadius:2, background:clr, flexShrink:0, minHeight:40 }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                  <span style={{ fontSize:12, fontWeight:500, color:T1 }}>{t.client}</span>
                  <span style={{ fontSize:10, color:T2 }}>·</span>
                  <span style={{ fontSize:11, color:T2 }}>{t.title}</span>
                  <span style={{ marginLeft:"auto", fontSize:9, padding:"2px 7px", borderRadius:10, background:T4, color:T2, fontWeight:500 }}>{t.status}</span>
                </div>
                {t.moral && <div style={{ fontSize:10, color:T3, fontStyle:"italic", marginBottom:4 }}>"{t.moral}"</div>}
                <div style={{ display:"flex", gap:12, fontSize:9, color:T3 }}>
                  {t.shootStart && <span>Shoot {fmtDate(fromISO(t.shootStart))}{t.shootEnd && t.shootEnd!==t.shootStart ? ` → ${fmtDate(fromISO(t.shootEnd))}`:""}</span>}
                  {t.dueDate && <span style={{ color:clr, opacity:0.8 }}>Due {fmtDate(fromISO(t.dueDate))}</span>}
                  {t.posts?.length>0 && <span>{t.posts.length} posts</span>}
                </div>
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                <Btn small onClick={()=>setEditing(t)}>Edit</Btn>
                <Btn small danger onClick={()=>onDelete(t.id)}>Delete</Btn>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sidebar detail ───────────────────────────────────────────────────────────
function SidebarDetail({ selDay, mode, threads, onClear }) {
  if (!selDay) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", minHeight:260, gap:6 }}>
      <div style={{ width:28, height:28, borderRadius:7, border:`0.5px solid ${BORDER}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="1" width="5" height="5" rx="1.5" fill={T4}/>
          <rect x="8" y="1" width="5" height="5" rx="1.5" fill={T3}/>
          <rect x="1" y="8" width="5" height="5" rx="1.5" fill={T3}/>
          <rect x="8" y="8" width="5" height="5" rx="1.5" fill={T4}/>
        </svg>
      </div>
      <span style={{ fontSize:11, color:T3, textAlign:"center", lineHeight:1.6 }}>Select a day<br/>to see details</span>
    </div>
  );

  const dues  = threads.filter(t=>t.dueDate&&sameDay(fromISO(t.dueDate),selDay));
  const shoots= threads.filter(t=>t.shootStart&&t.shootEnd&&inRange(selDay,fromISO(t.shootStart),fromISO(t.shootEnd)));
  const posts = threads.flatMap(t=>(t.posts||[]).filter(p=>sameDay(fromISO(p.date),selDay)).map(p=>({...p,thread:t})));
  const isMon = (selDay.getDay()+6)%7===0;

  return (
    <div style={{ overflowY:"auto", maxHeight:"70vh" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <span style={{ fontSize:12, fontWeight:500, color:T1 }}>{fmtDate(selDay)}</span>
        <button onClick={onClear} style={{ background:"transparent", border:"none", color:T3, cursor:"pointer", fontSize:16, lineHeight:1, padding:"0 2px" }}>×</button>
      </div>

      {mode==="production" && (
        <>
          {isMon && (
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:9, color:T3, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:5 }}>Internal</div>
              {INTERNAL.map(b=>(
                <div key={b.type} style={{ padding:"6px 8px", background:T4, borderRadius:6, marginBottom:4, borderLeft:`2px solid ${BORDER2}` }}>
                  <span style={{ fontSize:10, color:T2 }}>{b.label}</span>
                </div>
              ))}
            </div>
          )}
          {shoots.length>0 && (
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:9, color:T3, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:5 }}>Shoot day</div>
              {shoots.map(t=>{
                const clr=COLORS[t.color];
                return (
                  <div key={t.id} style={{ padding:"8px", background:`${clr}14`, borderRadius:6, marginBottom:4, borderLeft:`2px solid ${clr}` }}>
                    <div style={{ fontSize:11, fontWeight:500, color:T1 }}>{t.client}</div>
                    <div style={{ fontSize:10, color:T2, marginTop:1 }}>{t.title}</div>
                    <div style={{ fontSize:9, color:T3, marginTop:3 }}>
                      {fmtDate(fromISO(t.shootStart))} → {fmtDate(fromISO(t.shootEnd))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {dues.length>0 && (
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:9, color:T3, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:5 }}>Thread delivery due</div>
              {dues.map(t=>{
                const clr=COLORS[t.color];
                return (
                  <div key={t.id} style={{ padding:"8px", background:SURFACE2, borderRadius:6, marginBottom:4, border:`0.5px solid ${clr}` }}>
                    <div style={{ fontSize:11, fontWeight:500, color:T1 }}>{t.client}</div>
                    <div style={{ fontSize:10, color:T2, marginTop:1 }}>{t.title}</div>
                    {t.moral && <div style={{ fontSize:9, color:T3, marginTop:3, fontStyle:"italic" }}>"{t.moral}"</div>}
                  </div>
                );
              })}
            </div>
          )}
          {!isMon && shoots.length===0 && dues.length===0 && (
            <div style={{ fontSize:11, color:T3, textAlign:"center", marginTop:28 }}>Nothing scheduled</div>
          )}
        </>
      )}

      {mode==="distribution" && (
        <>
          {posts.length===0
            ? <div style={{ fontSize:11, color:T3, textAlign:"center", marginTop:28 }}>No posts scheduled</div>
            : posts.map((p,i)=>{
                const clr=COLORS[p.thread.color];
                return (
                  <div key={i} style={{ padding:"9px 8px", background:SURFACE2, borderRadius:6, marginBottom:6, borderLeft:`2px solid ${clr}` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
                      <div style={{ width:6, height:6, borderRadius:3, background:clr, flexShrink:0 }}/>
                      <span style={{ fontSize:10, fontWeight:500, color:T1 }}>{p.thread.client}</span>
                      <div style={{ display:"flex", gap:3, marginLeft:"auto" }}>
                        {p.ch.map(c=>(
                          <span key={c} style={{ fontSize:8, fontWeight:700, color:CH_CLR[c], background:`${CH_CLR[c]}18`, borderRadius:3, padding:"1px 4px" }}>{CH_LBL[c]}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ fontSize:10, color:T2, lineHeight:1.5, fontStyle:"italic" }}>"{p.caption}"</div>
                    <div style={{ fontSize:9, color:T3, marginTop:4 }}>{p.thread.title}</div>
                  </div>
                );
              })
          }
        </>
      )}
    </div>
  );
}

// ─── Calendar ─────────────────────────────────────────────────────────────────
function Calendar({ threads, mode, selDay, setSelDay, filterClient }) {
  const today = d0(new Date());
  const [date, setDate] = useState(d0(today));
  const yr=date.getFullYear(), mo=date.getMonth();
  const weeks=useMemo(()=>getMonthWeeks(yr,mo),[yr,mo]);
  const label=date.toLocaleString("default",{month:"long",year:"numeric"});
  const vis = filterClient==="all" ? threads : threads.filter(t=>t.client===filterClient);
  const isMon = d => (d.getDay()+6)%7===0;

  function dayIndicators(day) {
    const shoots = vis.filter(t=>t.shootStart&&t.shootEnd&&inRange(day,fromISO(t.shootStart),fromISO(t.shootEnd)));
    const dues   = vis.filter(t=>t.dueDate&&sameDay(fromISO(t.dueDate),day));
    const posts  = vis.flatMap(t=>(t.posts||[]).filter(p=>sameDay(fromISO(p.date),day)));
    return { shoots, dues, posts };
  }

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <button onClick={()=>setDate(new Date(yr,mo-1,1))} style={{ background:"transparent", border:`0.5px solid ${BORDER}`, color:T2, borderRadius:5, padding:"3px 10px", cursor:"pointer", fontSize:13 }}>‹</button>
        <span style={{ fontSize:12, fontWeight:500, minWidth:110, textAlign:"center", color:T1 }}>{label}</span>
        <button onClick={()=>setDate(new Date(yr,mo+1,1))} style={{ background:"transparent", border:`0.5px solid ${BORDER}`, color:T2, borderRadius:5, padding:"3px 10px", cursor:"pointer", fontSize:13 }}>›</button>
        <button onClick={()=>setDate(d0(new Date()))} style={{ background:"transparent", border:`0.5px solid ${BORDER}`, color:T3, borderRadius:5, padding:"3px 8px", cursor:"pointer", fontSize:10, marginLeft:4 }}>Today</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:3 }}>
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i)=>(
          <div key={d} style={{ textAlign:"center", fontSize:9, letterSpacing:"0.08em", textTransform:"uppercase", color:i===0?T4:T3, padding:"2px 0" }}>{d}</div>
        ))}
      </div>

      <div style={{ border:`0.5px solid ${BORDER}`, borderRadius:8, overflow:"hidden" }}>
        {weeks.map((wd,wi)=>(
          <div key={wi} style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", borderBottom:wi<weeks.length-1?`0.5px solid ${BORDER}`:"none" }}>
            {wd.map((day,di)=>{
              const inMo  = day.getMonth()===mo;
              const isTo  = sameDay(day,today);
              const isSel = selDay&&sameDay(day,selDay);
              const mon   = isMon(day);
              const { shoots, dues, posts } = dayIndicators(day);
              const hasAct = shoots.length>0||dues.length>0||posts.length>0||(mon&&mode==="production");

              return (
                <div key={di}
                  onClick={()=>hasAct&&setSelDay(p=>p&&sameDay(p,day)?null:day)}
                  style={{
                    height:76, position:"relative", boxSizing:"border-box",
                    borderRight:di<6?`0.5px solid ${BORDER}`:"none",
                    background: isSel?"rgba(255,255,255,0.055)":mon?"rgba(255,255,255,0.018)":"transparent",
                    cursor:hasAct?"pointer":"default",
                  }}>

                  {isTo && <div style={{ position:"absolute", top:5, left:5, width:17, height:17, borderRadius:"50%", border:"1.5px solid #378ADD", pointerEvents:"none" }}/>}

                  <span style={{ position:"absolute", top:7, left:8, fontSize:10, fontWeight:isTo?600:400, color:isTo?"#378ADD":inMo?T2:T4, lineHeight:1 }}>
                    {day.getDate()}
                  </span>

                  <div style={{ position:"absolute", bottom:4, left:4, right:4, display:"flex", flexDirection:"column", gap:2 }}>
                    {mode==="production" && shoots.map((t,ii)=>{
                      const clr=COLORS[t.color];
                      const isFirst=sameDay(day,fromISO(t.shootStart));
                      const isLast=sameDay(day,fromISO(t.shootEnd));
                      return (
                        <div key={ii} style={{
                          height:5, background:clr, opacity:inMo?0.85:0.3,
                          borderRadius:`${isFirst?2:0}px ${isLast?2:0}px ${isLast?2:0}px ${isFirst?2:0}px`,
                        }}/>
                      );
                    })}
                    {mode==="production" && dues.map((t,ii)=>{
                      const clr=COLORS[t.color];
                      return (
                        <div key={`due${ii}`} style={{
                          height:5, borderRadius:2, border:`1.5px solid ${clr}`,
                          background:`${clr}22`, opacity:inMo?1:0.3,
                        }}/>
                      );
                    })}
                    {mode==="production" && mon && shoots.length===0 && dues.length===0 && (
                      <div style={{ height:4, borderRadius:2, background:"rgba(255,255,255,0.08)" }}/>
                    )}
                    {mode==="distribution" && posts.length>0 && (
                      <div style={{ display:"flex", gap:2, flexWrap:"wrap" }}>
                        {vis.filter(t=>(t.posts||[]).some(p=>sameDay(fromISO(p.date),day))).map((t,ii)=>(
                          <div key={ii} style={{ width:5, height:5, borderRadius:"50%", background:COLORS[t.color], opacity:inMo?0.8:0.25 }}/>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:14, marginTop:8, paddingLeft:2 }}>
        {mode==="production" ? (
          <>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:16, height:4, borderRadius:2, background:COLORS.teal }}/>
              <span style={{ fontSize:9, color:T4 }}>Shoot (client color)</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:16, height:4, borderRadius:2, border:`1.5px solid ${COLORS.teal}`, background:`${COLORS.teal}22` }}/>
              <span style={{ fontSize:9, color:T4 }}>Thread due</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:16, height:4, borderRadius:2, background:"rgba(255,255,255,0.08)" }}/>
              <span style={{ fontSize:9, color:T4 }}>Monday ops</span>
            </div>
          </>
        ) : (
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:6, height:6, borderRadius:3, background:T2 }}/>
            <span style={{ fontSize:9, color:T4 }}>Post scheduled (thread color)</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────
export default function ThreadCalendar() {
  const [view,    setView]    = useState("production");
  const [selDay,  setSelDay]  = useState(null);
  const [filter,  setFilter]  = useState("all");
  const [threads, setThreads] = useState(SEED_THREADS);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage only after mount (avoids SSR mismatch)
  useEffect(()=>{
    setMounted(true);
    try {
      const s = localStorage.getItem("indelible_threads");
      if (s) setThreads(JSON.parse(s));
    } catch {}
  },[]);

  // Persist on every change, but only client-side
  useEffect(()=>{
    if (!mounted) return;
    try { localStorage.setItem("indelible_threads", JSON.stringify(threads)); } catch {}
  },[threads, mounted]);

  const addThread    = t => setThreads(p=>[...p,t]);
  const editThread   = t => setThreads(p=>p.map(x=>x.id===t.id?t:x));
  const deleteThread = id=> setThreads(p=>p.filter(x=>x.id!==id));

  const clients  = ["all", ...Array.from(new Set(threads.map(t=>t.client)))];
  const isCalView = view==="production" || view==="distribution";

  return (
    <div style={{ background:BG, minHeight:"100vh", fontFamily:"system-ui, sans-serif", color:T1, padding:"1.25rem", boxSizing:"border-box" }}>

      {/* Top nav */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <span style={{ fontSize:13, fontWeight:500, letterSpacing:"0.01em", color:T1 }}>
          Indelible
          <span style={{ color:T3, fontWeight:400 }}> Studio</span>
        </span>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {isCalView && (
            <select value={filter} onChange={e=>setFilter(e.target.value)} style={{
              background:SURFACE, border:`0.5px solid ${BORDER2}`, color:T2,
              fontSize:11, padding:"4px 10px", borderRadius:6, cursor:"pointer", outline:"none", marginRight:6,
            }}>
              {clients.map(c=><option key={c} value={c}>{c==="all"?"All clients":c}</option>)}
            </select>
          )}
          <div style={{ display:"flex", background:SURFACE, borderRadius:6, border:`0.5px solid ${BORDER}`, overflow:"hidden" }}>
            {["production","distribution","threads"].map(v=>(
              <button key={v} onClick={()=>{ setView(v); setSelDay(null); }} style={{
                padding:"5px 14px", border:"none", cursor:"pointer", fontSize:11,
                borderRight:`0.5px solid ${BORDER}`,
                background:view===v?"rgba(255,255,255,0.09)":"transparent",
                color:view===v?T1:T3, fontWeight:view===v?500:400,
              }}>
                {v==="production"?"Production":v==="distribution"?"Distribution":"Threads"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {view==="threads" ? (
        <ThreadsPage threads={threads} onAdd={addThread} onEdit={editThread} onDelete={deleteThread}/>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 210px", gap:14 }}>
          <Calendar threads={threads} mode={view} selDay={selDay} setSelDay={setSelDay} filterClient={filter}/>
          <div style={{ background:SURFACE, border:`0.5px solid ${BORDER}`, borderRadius:8, padding:"12px" }}>
            <SidebarDetail
              selDay={selDay}
              mode={view}
              threads={filter==="all" ? threads : threads.filter(t=>t.client===filter)}
              onClear={()=>setSelDay(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
