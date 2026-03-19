import { useState, useCallback, useRef, useEffect } from "react";

// ============================================================
// KDP BOOK FORMATTER — "iFormatter" 
// A complete manuscript-to-KDP formatting tool
// ============================================================

// --- Constants ---

// KDP margin requirements vary by page count and trim size.
// Inside (gutter) margin must account for binding; outside is smaller.
// These are KDP minimums — we add a small buffer for readability.
// Gutter varies by page count: <=150pp=0.375", 151-400=0.5", 401-600=0.625", 601+=0.75"
// We'll calculate gutter dynamically based on estimated page count.
function getKDPMargins(trimId, estimatedPages) {
  let gutterBase;
  if (estimatedPages <= 150) gutterBase = 0.375;
  else if (estimatedPages <= 400) gutterBase = 0.5;
  else if (estimatedPages <= 600) gutterBase = 0.625;
  else gutterBase = 0.75;

  // KDP minimum outside margin is 0.25", top/bottom 0.25"
  // But those are too tight for a good-looking book. We add buffer.
  const margins = {
    "5x8":    { top: 0.7, bottom: 0.7, outside: 0.5, inside: gutterBase + 0.25 },
    "5.25x8": { top: 0.7, bottom: 0.7, outside: 0.5, inside: gutterBase + 0.25 },
    "5.5x8.5":{ top: 0.75, bottom: 0.75, outside: 0.55, inside: gutterBase + 0.25 },
    "6x9":    { top: 0.75, bottom: 0.75, outside: 0.6, inside: gutterBase + 0.28 },
    "7x10":   { top: 0.8, bottom: 0.8, outside: 0.65, inside: gutterBase + 0.3 },
    "8.5x11": { top: 1.0, bottom: 1.0, outside: 0.75, inside: gutterBase + 0.35 },
  };
  return margins[trimId] || margins["6x9"];
}

const TRIM_SIZES = [
  { id: "5x8", label: '5" × 8"', w: 5, h: 8, desc: "Compact / Mass Market" },
  { id: "5.25x8", label: '5.25" × 8"', w: 5.25, h: 8, desc: "Small Trade" },
  { id: "5.5x8.5", label: '5.5" × 8.5"', w: 5.5, h: 8.5, desc: "Digest" },
  { id: "6x9", label: '6" × 9"', w: 6, h: 9, desc: "Standard Trade (Most Popular)" },
  { id: "7x10", label: '7" × 10"', w: 7, h: 10, desc: "Large / Textbook" },
  { id: "8.5x11", label: '8.5" × 11"', w: 8.5, h: 11, desc: "Full Size" },
];

const FONTS = [
  { id: "palatino", label: "Palatino Linotype", sample: "Elegant serif, classic book feel" },
  { id: "garamond", label: "Garamond", sample: "Timeless, literary" },
  { id: "georgia", label: "Georgia", sample: "Warm, readable serif" },
  { id: "times", label: "Times New Roman", sample: "Traditional, familiar" },
  { id: "baskerville", label: "Baskerville", sample: "Refined, editorial" },
  { id: "caslon", label: "Book Antiqua", sample: "Classic old-style" },
  { id: "custom", label: "Upload Your Own", sample: "Use your own .ttf or .otf font" },
];

const BODY_SIZES = [
  { id: "10", label: "10pt", desc: "Compact" },
  { id: "10.5", label: "10.5pt", desc: "Standard" },
  { id: "11", label: "11pt", desc: "Comfortable" },
  { id: "11.5", label: "11.5pt", desc: "Generous" },
  { id: "12", label: "12pt", desc: "Large" },
];

const GENRES = [
  {
    id: "horror", label: "Horror / Dark",
    icon: "🌑",
    desc: "Gothic ornaments, daggers, dark atmosphere",
    ornament: "†", divider: "— † —", pageNum: "† {n} †",
    headingStyle: "italic-bold", chNumStyle: "spaced-caps",
  },
  {
    id: "literary", label: "Literary Fiction",
    icon: "📖",
    desc: "Classic elegance, refined ornaments",
    ornament: "◆", divider: "——— ◆ ———", pageNum: "— {n} —",
    headingStyle: "italic-bold", chNumStyle: "spaced-caps",
  },
  {
    id: "romance", label: "Romance",
    icon: "💕",
    desc: "Flourishes, soft ornaments, warmth",
    ornament: "❧", divider: "~ ❧ ~", pageNum: "❧ {n} ❧",
    headingStyle: "italic", chNumStyle: "script",
  },
  {
    id: "thriller", label: "Thriller / Suspense",
    icon: "🔪",
    desc: "Bold, stark, high contrast",
    ornament: "■", divider: "———", pageNum: "{n}",
    headingStyle: "bold-caps", chNumStyle: "large-number",
  },
  {
    id: "fantasy", label: "Fantasy / Sci-Fi",
    icon: "✦",
    desc: "Stars, cosmic ornaments, grandeur",
    ornament: "✦", divider: "✦ · ✦ · ✦", pageNum: "✦ {n} ✦",
    headingStyle: "italic-bold", chNumStyle: "spaced-caps",
  },
  {
    id: "minimal", label: "Contemporary / Clean",
    icon: "○",
    desc: "Minimal, modern, lots of white space",
    ornament: "·", divider: "·", pageNum: "{n}",
    headingStyle: "light", chNumStyle: "small-number",
  },
];

const HEADING_STYLES = [
  { id: "gothic-whisper", label: "Gothic Whisper", desc: "Framed, ornamental, thin letters" },
  { id: "creeping-darkness", label: "Creeping Darkness", desc: "Heavy bold, textured underline" },
  { id: "blood-stripe", label: "Blood Stripe", desc: "Left-aligned, stark accent" },
  { id: "classic-elegant", label: "Classic Elegant", desc: "Centered, italic serif, ornamental" },
  { id: "modern-minimal", label: "Modern Minimal", desc: "Big faded number, clean sans" },
  { id: "bold-literary", label: "Bold Literary", desc: "Left-aligned, thick rule, stacked" },
  { id: "dramatic-drop", label: "Dramatic Drop Cap", desc: "Large first letter, centered title" },
  { id: "the-void", label: "The Void", desc: "Extreme white space, stark" },
];

// --- Smart auto-detection chapter parser ---

const cleanLine = (s) => s.replace(/^#+\s*/g, "").replace(/\*+/g, "").replace(/[\u200B\uFEFF]/g, "").trim();

const WORD_NUMS = "ONE|TWO|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|TEN|ELEVEN|TWELVE|THIRTEEN|FOURTEEN|FIFTEEN|SIXTEEN|SEVENTEEN|EIGHTEEN|NINETEEN|TWENTY|TWENTY[\\s-]?ONE|TWENTY[\\s-]?TWO|TWENTY[\\s-]?THREE|TWENTY[\\s-]?FOUR|TWENTY[\\s-]?FIVE|TWENTY[\\s-]?SIX|TWENTY[\\s-]?SEVEN|TWENTY[\\s-]?EIGHT|TWENTY[\\s-]?NINE|THIRTY";

const CHAPTER_PATTERNS = [
  { id: "ch-word", re: new RegExp("^CHAPTER\\s+(" + WORD_NUMS + ")\\b\\s*[:\\.\\u2014\\u2013\\-]?\\s*(.*)?$", "i"), label: 'Chapter + word (e.g. "Chapter One: Title")' },
  { id: "ch-num", re: /^CHAPTER\s+(\d{1,3})\s*[:\.\u2014\u2013\-]?\s*(.*)?$/i, label: 'Chapter + number (e.g. "Chapter 1: Title")' },
  { id: "bare-num", re: /^(\d{1,3})\s*[:\.\)\u2014\u2013\-]\s+(.+)$/, label: 'Numbered (e.g. "1: Title")' },
  { id: "ch-only", re: new RegExp("^CHAPTER\\s+(\\d{1,3}|" + WORD_NUMS + ")\\s*$", "i"), label: 'Chapter only (title on next line)' },
  { id: "roman", re: /^(I{1,3}|IV|VI{0,3}|IX|XI{0,3}|XIV|XVI{0,3}|XIX|XXI{0,3})\s*[:\.\)\u2014\u2013\-]\s*(.*)?$/i, label: 'Roman numeral (e.g. "III: Title")' },
  { id: "part", re: /^PART\s+(\w+)\s*[:\.\u2014\u2013\-]?\s*(.*)?$/i, label: 'Part (e.g. "Part Two")' },
  { id: "special", re: /^(PROLOGUE|EPILOGUE|INTERLUDE|AFTERWORD|FOREWORD|INTRODUCTION|PREFACE)\s*[:\.\u2014\u2013\-]?\s*(.*)?$/i, label: 'Special section' },
];

function detectChapterFormat(text) {
  const lines = text.split("\n");
  const results = CHAPTER_PATTERNS.map(pat => {
    let count = 0;
    const samples = [];
    for (const line of lines) {
      const s = cleanLine(line);
      if (s && pat.re.test(s)) { count++; if (samples.length < 3) samples.push(s); }
    }
    return { ...pat, count, samples };
  });
  const primary = results.filter(r => !["special","part"].includes(r.id) && r.count >= 2).sort((a, b) => b.count - a.count)[0];
  const special = results.find(r => r.id === "special" && r.count >= 1);
  return { primary, special, all: results.filter(r => r.count > 0) };
}

function parseManuscript(text) {
  const lines = text.split("\n");
  const detection = detectChapterFormat(text);
  const patterns = [];
  if (detection.primary) patterns.push(detection.primary);
  if (detection.special) patterns.push(detection.special);
  if (patterns.length === 0) patterns.push(...CHAPTER_PATTERNS);

  const chapters = [];
  let cur = null;
  let buf = [];

  for (let i = 0; i < lines.length; i++) {
    const stripped = cleanLine(lines[i]);
    if (!stripped) { if (cur) buf.push(lines[i]); continue; }

    let matched = false;
    for (const pat of patterns) {
      const m = stripped.match(pat.re);
      if (m) {
        if (cur) { cur.body = buf.join("\n").trim(); chapters.push(cur); }
        const chNum = pat.id === "special" ? m[1].toUpperCase() : "CHAPTER " + m[1].toUpperCase();
        let chTitle = (m[2] || "").trim();
        if (!chTitle) {
          let ni = i + 1;
          while (ni < lines.length && cleanLine(lines[ni]) === "") ni++;
          if (ni < lines.length) {
            const nc = cleanLine(lines[ni]);
            const isBody = /^["\u201C\u201D\u2018\u2019]/.test(nc) || nc.length > 80 || (nc.split(" ").length > 12 && !/^[A-Z\s:\-]+$/.test(nc));
            if (nc.length > 0 && !isBody) { chTitle = nc; i = ni; }
          }
        }
        cur = { number: chNum, title: chTitle, body: "" };
        buf = [];
        matched = true;
        break;
      }
    }
    if (!matched && cur) buf.push(lines[i]);
  }
  if (cur) { cur.body = buf.join("\n").trim(); chapters.push(cur); }
  return { chapters, detection };
}

function quickDetect(text) {
  if (!text || text.length < 50) return null;
  const det = detectChapterFormat(text);
  const hits = det.all.filter(r => r.count > 0);
  if (hits.length === 0) return null;
  const total = hits.reduce((s, h) => s + h.count, 0);
  return { total, primary: det.primary, special: det.special, hits };
}

// --- Chapter preview component ---
function ChapterPreview({ chapter, genre, headingStyle, font, bodySize, trimSize }) {
  const g = GENRES.find((x) => x.id === genre) || GENRES[0];
  const trim = TRIM_SIZES.find((x) => x.id === trimSize) || TRIM_SIZES[3];
  const f = FONTS.find((x) => x.id === font) || FONTS[0];
  const ratio = trim.h / trim.w;
  const previewW = 280;
  const previewH = previewW * ratio;

  const titleStyle = {
    "italic-bold": { fontStyle: "italic", fontWeight: "bold" },
    italic: { fontStyle: "italic", fontWeight: "normal" },
    "bold-caps": { fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" },
    light: { fontWeight: 300 },
  }[g.headingStyle] || { fontStyle: "italic", fontWeight: "bold" };

  const bodyPreview = chapter?.body
    ? chapter.body
        .split("\n")
        .filter((l) => l.trim())
        .slice(0, 6)
        .map((l) => l.trim().replace(/^\*+|\*+$/g, "").slice(0, 70))
        .join(" ")
        .slice(0, 250) + "..."
    : "The morning light filtered through the curtains, casting long shadows across the wooden floor. She stood by the window, watching the city slowly come to life below...";

  return (
    <div
      style={{
        width: previewW,
        height: previewH,
        background: "#FEFDFB",
        border: "1px solid #D4C5B0",
        boxShadow: "2px 3px 12px rgba(0,0,0,0.12), inset 0 0 30px rgba(0,0,0,0.02)",
        padding: "30px 22px 20px",
        fontFamily: f.label + ", serif",
        display: "flex",
        flexDirection: "column",
        alignItems: headingStyle === "blood-stripe" || headingStyle === "bold-literary" ? "flex-start" : "center",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Blood stripe accent */}
      {headingStyle === "blood-stripe" && (
        <div style={{ position: "absolute", left: 8, top: 0, bottom: 0, width: 2, background: "#8B0000" }} />
      )}

      {/* Chapter number */}
      <div style={{ marginTop: headingStyle === "the-void" ? 80 : 40, fontSize: g.chNumStyle === "large-number" ? 32 : 9, color: g.chNumStyle === "large-number" ? "#DDD" : "#999", letterSpacing: g.chNumStyle === "spaced-caps" ? "0.25em" : "0.05em", textTransform: "uppercase", fontWeight: g.chNumStyle === "large-number" ? "bold" : "normal", fontFamily: g.chNumStyle === "large-number" ? "Helvetica, sans-serif" : "inherit" }}>
        {chapter?.number || "CHAPTER ONE"}
      </div>

      {/* Ornament */}
      {headingStyle !== "the-void" && headingStyle !== "blood-stripe" && headingStyle !== "bold-literary" && (
        <div style={{ fontSize: 10, color: "#AAA", margin: "6px 0" }}>{g.divider}</div>
      )}

      {/* Bold literary thick rule */}
      {headingStyle === "bold-literary" && (
        <div style={{ width: "100%", height: 3, background: "#222", margin: "6px 0 10px" }} />
      )}

      {/* Title */}
      <div
        style={{
          fontSize: headingStyle === "modern-minimal" ? 15 : headingStyle === "bold-literary" ? 18 : 16,
          ...titleStyle,
          color: "#222",
          marginTop: headingStyle === "modern-minimal" ? -20 : 2,
          textAlign: headingStyle === "blood-stripe" || headingStyle === "bold-literary" ? "left" : "center",
          width: "100%",
          lineHeight: 1.3,
        }}
      >
        {chapter?.title || "The Beginning"}
      </div>

      {/* Bottom ornament */}
      {headingStyle !== "bold-literary" && headingStyle !== "blood-stripe" && headingStyle !== "the-void" && (
        <div style={{ fontSize: 11, color: "#AAA", margin: "8px 0" }}>{g.ornament}</div>
      )}

      {/* Body preview */}
      <div
        style={{
          fontSize: 7.5,
          color: "#555",
          lineHeight: 1.7,
          marginTop: 12,
          textAlign: "justify",
          textIndent: 12,
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        {bodyPreview}
      </div>

      {/* Page number */}
      <div style={{ fontSize: 7, color: "#AAA", marginTop: 8, textAlign: "center", width: "100%" }}>
        {g.pageNum.replace("{n}", "1")}
      </div>
    </div>
  );
}

// --- Step indicator ---
function StepIndicator({ current, steps }) {
  return (
    <div style={{ display: "flex", gap: 0, marginBottom: 32 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "default" }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: i <= current ? "#1a1a1a" : "#E5E0D8",
                color: i <= current ? "#FEFDFB" : "#999",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 600,
                transition: "all 0.3s ease",
              }}
            >
              {i < current ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 13, color: i <= current ? "#1a1a1a" : "#AAA", fontWeight: i === current ? 600 : 400, whiteSpace: "nowrap" }}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 1, background: i < current ? "#1a1a1a" : "#E5E0D8", margin: "0 12px", transition: "background 0.3s ease" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// --- Selection card ---
function SelectCard({ selected, onClick, children, style: extraStyle }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: selected ? "2px solid #1a1a1a" : "1px solid #DDD",
        borderRadius: 8,
        padding: 14,
        cursor: "pointer",
        background: selected ? "#F9F6F1" : "#FFF",
        transition: "all 0.15s ease",
        ...extraStyle,
      }}
    >
      {children}
    </div>
  );
}

// --- Generate a self-contained HTML file that builds the .docx when opened ---
function generateBookHtml(chapters, config, customFont) {
  const g = GENRES.find((x) => x.id === config.genre) || GENRES[0];
  const trim = TRIM_SIZES.find((x) => x.id === config.trimSize) || TRIM_SIZES[3];
  const bSize = parseFloat(config.bodySize) || 11;

  let FONT_NAME;
  if (config.font === "custom" && customFont) {
    FONT_NAME = customFont.name;
  } else {
    const f = FONTS.find((x) => x.id === config.font) || FONTS[0];
    FONT_NAME = f.label;
  }

  const totalWords = chapters.reduce((s, c) => s + c.body.split(/\s+/).length, 0);
  const estimatedPages = Math.max(24, Math.round(totalWords / 250));
  const kdpMargins = getKDPMargins(config.trimSize, estimatedPages);

  const chaptersData = chapters.map((ch) => ({
    number: ch.number, title: ch.title,
    paragraphs: ch.body.split("\n").map((l) => l.trim()).filter((l) => l.length > 0),
  }));

  const cfg = {
    FONT: FONT_NAME,
    BODY_SIZE: bSize * 2,
    LEADING: Math.round(bSize * 2 * 13.5),
    PAGE_W: Math.round(trim.w * 1440),
    PAGE_H: Math.round(trim.h * 1440),
    M_TOP: Math.round(kdpMargins.top * 1440),
    M_BOT: Math.round(kdpMargins.bottom * 1440),
    M_IN: Math.round(kdpMargins.inside * 1440),
    M_OUT: Math.round(kdpMargins.outside * 1440),
    ORNAMENT: g.ornament,
    DIVIDER: g.divider,
    PAGE_NUM_FMT: g.pageNum,
    BOOK_TITLE: config.title || "Untitled",
    AUTHOR: config.author || "",
  };

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>iFormatter - Generating Book</title>
<style>
body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#F5F0E8}
#s{text-align:center;max-width:420px}
.icon{font-size:40px;margin-bottom:16px}
h2{font-size:20px;font-weight:600;margin:0 0 8px}
p{color:#888;margin:0;line-height:1.6}
.bar{width:260px;height:4px;background:#E5E0D8;border-radius:4px;margin:20px auto 0;overflow:hidden}
.fill{height:100%;background:#1a1a1a;width:0%;border-radius:4px;transition:width 0.5s ease}
.ok{color:#2A7D2A} .err{color:#C44}
</style>
</head><body>
<div id="s">
<div class="icon">\u{1F4D6}</div>
<h2 id="title">Loading formatter...</h2>
<p id="msg">Fetching docx library from CDN</p>
<div class="bar"><div class="fill" id="bar"></div></div>
</div>
<script>
const T=document.getElementById("title"),M=document.getElementById("msg"),B=document.getElementById("bar");
function progress(p,t,m){B.style.width=p+"%";T.textContent=t;M.textContent=m;}
const scr=document.createElement("script");
scr.src="https://cdn.jsdelivr.net/npm/docx@9.5.0/dist/index.iife.js";
scr.onload=run;
scr.onerror=()=>{progress(100,"\\u274C Failed to load library","Check your internet connection and try again.");T.classList.add("err");};
document.head.appendChild(scr);

async function run(){
try{
progress(20,"Building manuscript...","Setting up document structure");
const{Document,Packer,Paragraph,TextRun,Header,Footer,AlignmentType,BorderStyle,SectionType,PageNumber,PositionalTab,PositionalTabAlignment,PositionalTabRelativeTo,PositionalTabLeader}=docx;
const C=${JSON.stringify(cfg)};
const chapters=${JSON.stringify(chaptersData)};

function emptyH(){return new Header({children:[new Paragraph({children:[]})]})}
function emptyF(){return new Footer({children:[new Paragraph({children:[]})]})}
function makeHeader(l,r){return new Header({children:[new Paragraph({alignment:AlignmentType.CENTER,border:{bottom:{style:BorderStyle.SINGLE,size:1,color:"CCCCCC",space:4}},children:[new TextRun({text:l,font:C.FONT,size:16,color:"999999",italics:true}),new TextRun({children:[new PositionalTab({alignment:PositionalTabAlignment.RIGHT,relativeTo:PositionalTabRelativeTo.MARGIN,leader:PositionalTabLeader.NONE})],font:C.FONT,size:16}),new TextRun({text:r,font:C.FONT,size:16,color:"999999",italics:true})]})]})}
function makeFooter(){const p=C.PAGE_NUM_FMT.split("{n}"),ch=[];if(p[0])ch.push(new TextRun({text:p[0],font:C.FONT,size:18,color:"999999"}));ch.push(new TextRun({children:[PageNumber.CURRENT],font:C.FONT,size:18,color:"666666"}));if(p[1])ch.push(new TextRun({text:p[1],font:C.FONT,size:18,color:"999999"}));return new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:ch})]})}
function spacer(n){n=n||1;return new Paragraph({spacing:{line:C.LEADING*n},children:[new TextRun({text:"",font:C.FONT,size:C.BODY_SIZE})]})}
function bodyPara(text,isFirst){const runs=[];const re=/(\\*\\*(.+?)\\*\\*|\\*(.+?)\\*)/g;let last=0,m;while((m=re.exec(text))!==null){if(m.index>last)runs.push(new TextRun({text:text.slice(last,m.index),font:C.FONT,size:C.BODY_SIZE}));if(m[2])runs.push(new TextRun({text:m[2],font:C.FONT,size:C.BODY_SIZE,bold:true}));else if(m[3])runs.push(new TextRun({text:m[3],font:C.FONT,size:C.BODY_SIZE,italics:true}));last=re.lastIndex;}if(last<text.length)runs.push(new TextRun({text:text.slice(last),font:C.FONT,size:C.BODY_SIZE}));if(runs.length===0)runs.push(new TextRun({text:text,font:C.FONT,size:C.BODY_SIZE}));return new Paragraph({spacing:{line:C.LEADING,before:0,after:0},indent:isFirst?{}:{firstLine:360},children:runs})}
function chapterHeading(num,title){const e=[];for(let i=0;i<6;i++)e.push(spacer());e.push(new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:120},children:[new TextRun({text:num.split("").join(" "),font:C.FONT,size:20,color:"555555",characterSpacing:80})]}));e.push(new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:60,after:60},children:[new TextRun({text:C.DIVIDER,font:C.FONT,size:20,color:"888888"})]}));e.push(new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:120,after:0},children:[new TextRun({text:title,font:C.FONT,size:40,italics:true,bold:true})]}));e.push(new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:100,after:360},children:[new TextRun({text:C.ORNAMENT,font:C.FONT,size:22,color:"777777"})]}));return e}

progress(40,"Building manuscript...","Creating front matter");
const pg={size:{width:C.PAGE_W,height:C.PAGE_H},margin:{top:C.M_TOP,bottom:C.M_BOT,right:C.M_OUT,left:C.M_IN}};
const halfTitle={properties:{page:pg,titlePage:true},headers:{default:emptyH(),first:emptyH()},footers:{default:emptyF(),first:emptyF()},children:[...Array(10).fill(null).map(()=>spacer()),new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:C.BOOK_TITLE,font:C.FONT,size:44,bold:true})]}),spacer(),new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:C.AUTHOR,font:C.FONT,size:24,color:"666666"})]})]};
const titlePage={properties:{type:SectionType.NEXT_PAGE,page:pg},headers:{default:emptyH()},footers:{default:emptyF()},children:[...Array(6).fill(null).map(()=>spacer()),new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:C.DIVIDER,font:C.FONT,size:24,color:"888888"})]}),spacer(),new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:C.BOOK_TITLE,font:C.FONT,size:56,bold:true})]}),spacer(),new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:C.AUTHOR,font:C.FONT,size:28,color:"444444"})]}),spacer(),new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:C.DIVIDER,font:C.FONT,size:24,color:"888888"})]})]};
const copyrightPage={properties:{type:SectionType.NEXT_PAGE,page:pg},headers:{default:emptyH()},footers:{default:emptyF()},children:[...Array(20).fill(null).map(()=>spacer()),new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:120},children:[new TextRun({text:C.BOOK_TITLE,font:C.FONT,size:18,italics:true})]}),spacer(),new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"Copyright \\u00A9 "+new Date().getFullYear()+". All rights reserved.",font:C.FONT,size:16,color:"666666"})]}),new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:80},children:[new TextRun({text:"This is a work of fiction.",font:C.FONT,size:16,color:"666666"})]})]};

progress(60,"Building manuscript...","Formatting "+chapters.length+" chapters");
const chSections=chapters.map(ch=>{const children=[...chapterHeading(ch.number,ch.title)];ch.paragraphs.forEach((p,j)=>{if(p.trim())children.push(bodyPara(p.trim(),j===0));});return{properties:{type:SectionType.NEXT_PAGE,page:pg,titlePage:true},headers:{default:makeHeader(C.BOOK_TITLE,ch.title),first:emptyH()},footers:{default:makeFooter(),first:makeFooter()},children};});
const endPage={properties:{type:SectionType.NEXT_PAGE,page:pg},headers:{default:emptyH()},footers:{default:emptyF()},children:[...Array(10).fill(null).map(()=>spacer()),new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:C.DIVIDER,font:C.FONT,size:24,color:"888888"})]}),spacer(),new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"THE END",font:C.FONT,size:36,bold:true,characterSpacing:120})]}),spacer(),new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:C.DIVIDER,font:C.FONT,size:24,color:"888888"})]})]};

progress(80,"Generating file...","Packing into .docx format");
const doc=new Document({styles:{default:{document:{run:{font:C.FONT,size:C.BODY_SIZE}}}},sections:[halfTitle,titlePage,copyrightPage,...chSections,endPage]});
const blob=await Packer.toBlob(doc);
const url=URL.createObjectURL(blob);
const a=document.createElement("a");
a.href=url;
a.download=C.BOOK_TITLE.replace(/[^a-zA-Z0-9]/g,"_")+"_KDP.docx";
document.body.appendChild(a);
a.click();
document.body.removeChild(a);

progress(100,"\\u2705 Download started!","Your KDP-ready manuscript has been generated. You can close this tab.");
T.classList.add("ok");
}catch(e){
progress(100,"\\u274C Generation failed",e.message||"An unexpected error occurred.");
T.classList.add("err");
console.error(e);
}
}
</${"script"}></body></html>`;
}

// ============================================================
// MAIN APP
// ============================================================
export default function KDPFormatter() {
  const [step, setStep] = useState(0);
  const [inputMethod, setInputMethod] = useState("paste");
  const [rawText, setRawText] = useState("");
  const [chapters, setChapters] = useState([]);
  const [config, setConfig] = useState({
    title: "",
    author: "",
    genre: "horror",
    headingStyle: "gothic-whisper",
    font: "palatino",
    bodySize: "11",
    trimSize: "6x9",
  });
  const [parsing, setParsing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [customFont, setCustomFont] = useState(null); // { name, data (ArrayBuffer), fileName }
  const fileInputRef = useRef(null);
  const fontInputRef = useRef(null);

  const handleTextInput = useCallback((text) => {
    setRawText(text);
  }, []);

  const handleFontUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validExt = [".ttf", ".otf", ".woff"];
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExt.includes(ext)) {
      alert("Please upload a .ttf, .otf, or .woff font file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      // Extract font name from filename
      const fontName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      setCustomFont({ name: fontName, data: ev.target.result, fileName: file.name });
      setConfig((c) => ({ ...c, font: "custom" }));
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setRawText(ev.target.result);
      };
      reader.readAsText(file);
    } else if (file.name.endsWith(".docx")) {
      // For docx we'd need mammoth - show message
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const mammoth = await import("mammoth");
          const result = await mammoth.extractRawText({ arrayBuffer: ev.target.result });
          setRawText(result.value);
        } catch {
          alert("For .docx files, please copy the text from your document and paste it instead. The .docx parser isn't available in this environment.");
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);

  const parseText = useCallback(() => {
    setParsing(true);
    setTimeout(() => {
      const result = parseManuscript(rawText);
      setChapters(result.chapters);

      // Try to extract title from text
      const titleMatch = rawText.match(/^#\s*\*{0,2}(.+?)\*{0,2}\s*$/m);
      if (titleMatch && !config.title) {
        setConfig((c) => ({ ...c, title: titleMatch[1].trim() }));
      }

      setParsing(false);
      if (result.chapters.length > 0) {
        setStep(1);
      }
    }, 300);
  }, [rawText, config.title]);

  const [exportStatus, setExportStatus] = useState("");

  const handleGenerate = useCallback(() => {
    setGenerating(true);
    setExportStatus("building");
    try {
      const html = generateBookHtml(chapters, config, customFont);
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeName = (config.title || "Book").replace(/[^a-zA-Z0-9]/g, "_");
      a.download = safeName + "_KDP_Generator.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setExportStatus("done");
    } catch (err) {
      console.error("Generation failed:", err);
      setExportStatus("error");
    } finally {
      setGenerating(false);
    }
  }, [chapters, config, customFont]);

  const steps = ["Import", "Style", "Details", "Export"];

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", fontFamily: "'Instrument Serif', 'Georgia', serif" }}>
      {/* Google Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>

      {/* Header */}
      <div style={{ background: "#1a1a1a", color: "#FEFDFB", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 28 }}>📖</span>
          <div>
            <div style={{ fontSize: 22, fontFamily: "'Instrument Serif', serif", fontWeight: 400, letterSpacing: "0.02em" }}>iFormatter</div>
            <div style={{ fontSize: 11, color: "#999", fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>KDP Book Formatter</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#666", fontFamily: "'DM Sans', sans-serif" }}>Manuscript → KDP-Ready .docx</div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        <StepIndicator current={step} steps={steps} />

        {/* ============ STEP 0: IMPORT ============ */}
        {step === 0 && (
          <div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, margin: "0 0 8px" }}>Import Your Manuscript</h2>
            <p style={{ color: "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginBottom: 24 }}>
              Paste your text, upload a file, or paste from Google Docs. The formatter will auto-detect your chapters.
            </p>

            {/* Input method tabs */}
            <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid #DDD" }}>
              {[
                { id: "paste", label: "Paste Text" },
                { id: "upload", label: "Upload File" },
                { id: "gdocs", label: "Google Docs" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setInputMethod(m.id)}
                  style={{
                    padding: "10px 20px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    fontWeight: inputMethod === m.id ? 600 : 400,
                    color: inputMethod === m.id ? "#1a1a1a" : "#999",
                    borderBottom: inputMethod === m.id ? "2px solid #1a1a1a" : "2px solid transparent",
                    marginBottom: -1,
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {inputMethod === "paste" && (
              <textarea
                value={rawText}
                onChange={(e) => handleTextInput(e.target.value)}
                placeholder={"Paste your entire manuscript here...\n\nThe formatter will detect chapters using headings like:\n  CHAPTER 1: Title\n  Chapter One\n  ## Chapter 1\n  ### CHAPTER 1: The Beginning"}
                style={{
                  width: "100%",
                  minHeight: 320,
                  padding: 16,
                  border: "1px solid #D4C5B0",
                  borderRadius: 8,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  lineHeight: 1.7,
                  resize: "vertical",
                  background: "#FEFDFB",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            )}

            {inputMethod === "upload" && (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: "2px dashed #D4C5B0",
                  borderRadius: 12,
                  padding: 60,
                  textAlign: "center",
                  cursor: "pointer",
                  background: "#FEFDFB",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500, color: "#555" }}>
                  Click to upload a .txt or .docx file
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#AAA", marginTop: 6 }}>
                  or drag and drop
                </div>
                <input ref={fileInputRef} type="file" accept=".txt,.docx,.md" onChange={handleFileUpload} style={{ display: "none" }} />
              </div>
            )}

            {inputMethod === "gdocs" && (
              <div style={{ background: "#FEFDFB", border: "1px solid #D4C5B0", borderRadius: 8, padding: 24 }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#555", lineHeight: 1.8 }}>
                  <strong>To import from Google Docs:</strong>
                  <br /><br />
                  1. Open your Google Doc
                  <br />
                  2. Select all text (Ctrl+A / Cmd+A)
                  <br />
                  3. Copy (Ctrl+C / Cmd+C)
                  <br />
                  4. Switch to the <button onClick={() => setInputMethod("paste")} style={{ background: "none", border: "none", color: "#1a1a1a", fontWeight: 600, cursor: "pointer", textDecoration: "underline", fontFamily: "inherit", fontSize: "inherit", padding: 0 }}>Paste Text</button> tab and paste
                  <br /><br />
                  <span style={{ color: "#AAA", fontSize: 13 }}>This preserves your chapter headings and formatting markers.</span>
                </div>
              </div>
            )}

            {rawText && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888", marginBottom: 8 }}>
                  {rawText.length.toLocaleString()} characters · ~{Math.round(rawText.split(/\s+/).length / 250)} pages (est.)
                </div>
                {(() => {
                  const det = quickDetect(rawText);
                  if (!det) return (
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#C44", background: "#FFF5F5", border: "1px solid #FDD", borderRadius: 6, padding: "10px 14px" }}>
                      ⚠ No chapter headings detected yet. Make sure your text includes headings like "Chapter 1: Title" or "CHAPTER ONE".
                    </div>
                  );
                  return (
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#2A7D2A", background: "#F2FBF2", border: "1px solid #C4E8C4", borderRadius: 6, padding: "10px 14px" }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>
                        ✓ Auto-detected {det.total} chapter heading{det.total !== 1 ? "s" : ""}
                      </div>
                      <div style={{ color: "#555", fontSize: 12 }}>
                        Format: {det.primary ? det.primary.label : det.hits[0]?.label || "Unknown"}
                        {det.primary?.samples?.[0] && (
                          <span style={{ color: "#999" }}> — e.g. "{det.primary.samples[0].slice(0, 50)}{det.primary.samples[0].length > 50 ? "..." : ""}"</span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
              <button
                onClick={parseText}
                disabled={!rawText.trim() || parsing}
                style={{
                  padding: "12px 32px",
                  background: rawText.trim() ? "#1a1a1a" : "#CCC",
                  color: "#FEFDFB",
                  border: "none",
                  borderRadius: 8,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: rawText.trim() ? "pointer" : "default",
                }}
              >
                {parsing ? "Parsing..." : "Parse Chapters →"}
              </button>
            </div>
          </div>
        )}

        {/* ============ STEP 1: STYLE ============ */}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, margin: "0 0 4px" }}>Choose Your Style</h2>
            <p style={{ color: "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginBottom: 24 }}>
              Found <strong>{chapters.length} chapters</strong>. Now pick the look and feel for your book.
            </p>

            {/* Genre templates */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Genre Template</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {GENRES.map((g) => (
                  <SelectCard key={g.id} selected={config.genre === g.id} onClick={() => setConfig((c) => ({ ...c, genre: g.id }))}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 18 }}>{g.icon}</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600 }}>{g.label}</span>
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#999" }}>{g.desc}</div>
                  </SelectCard>
                ))}
              </div>
            </div>

            {/* Heading style */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Chapter Heading Style</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {HEADING_STYLES.map((h) => (
                  <SelectCard key={h.id} selected={config.headingStyle === h.id} onClick={() => setConfig((c) => ({ ...c, headingStyle: h.id }))}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{h.label}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#999" }}>{h.desc}</div>
                  </SelectCard>
                ))}
              </div>
            </div>

            {/* Font + Size row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Body Font</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {FONTS.map((f) => (
                    <SelectCard
                      key={f.id}
                      selected={config.font === f.id}
                      onClick={() => {
                        if (f.id === "custom") {
                          fontInputRef.current?.click();
                        } else {
                          setConfig((c) => ({ ...c, font: f.id }));
                        }
                      }}
                      style={{ padding: 10 }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: f.id === "custom" ? "'DM Sans', sans-serif" : f.label + ", serif", fontSize: f.id === "custom" ? 14 : 15 }}>
                          {f.id === "custom" && customFont ? `✓ ${customFont.name}` : f.id === "custom" ? "⬆ Upload Your Own" : f.label}
                        </span>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#AAA" }}>
                          {f.id === "custom" && customFont ? customFont.fileName : f.sample}
                        </span>
                      </div>
                    </SelectCard>
                  ))}
                  <input ref={fontInputRef} type="file" accept=".ttf,.otf,.woff" onChange={handleFontUpload} style={{ display: "none" }} />
                  {config.font === "custom" && customFont && (
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#2A7D2A", background: "#F2FBF2", border: "1px solid #C4E8C4", borderRadius: 6, padding: "8px 12px", marginTop: 4 }}>
                      ✓ Font "{customFont.name}" loaded — will be embedded in your .docx
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Body Size</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
                  {BODY_SIZES.map((s) => (
                    <SelectCard key={s.id} selected={config.bodySize === s.id} onClick={() => setConfig((c) => ({ ...c, bodySize: s.id }))} style={{ padding: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500 }}>{s.label}</span>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#AAA" }}>{s.desc}</span>
                      </div>
                    </SelectCard>
                  ))}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Trim Size</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {TRIM_SIZES.map((t) => (
                    <SelectCard key={t.id} selected={config.trimSize === t.id} onClick={() => setConfig((c) => ({ ...c, trimSize: t.id }))} style={{ padding: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500 }}>{t.label}</span>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#AAA" }}>{t.desc}</span>
                      </div>
                    </SelectCard>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Live Preview</div>
              <div style={{ display: "flex", gap: 20, overflowX: "auto", padding: "8px 0 16px" }}>
                <ChapterPreview chapter={chapters[0]} genre={config.genre} headingStyle={config.headingStyle} font={config.font} bodySize={config.bodySize} trimSize={config.trimSize} />
                {chapters[1] && <ChapterPreview chapter={chapters[1]} genre={config.genre} headingStyle={config.headingStyle} font={config.font} bodySize={config.bodySize} trimSize={config.trimSize} />}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
              <button onClick={() => setStep(0)} style={{ padding: "12px 24px", background: "transparent", border: "1px solid #DDD", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, cursor: "pointer", color: "#888" }}>
                ← Back
              </button>
              <button onClick={() => setStep(2)} style={{ padding: "12px 32px", background: "#1a1a1a", color: "#FEFDFB", border: "none", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                Book Details →
              </button>
            </div>
          </div>
        )}

        {/* ============ STEP 2: DETAILS ============ */}
        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, margin: "0 0 8px" }}>Book Details</h2>
            <p style={{ color: "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginBottom: 24 }}>
              These appear on your title page and running headers.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
              <div>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Book Title</label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig((c) => ({ ...c, title: e.target.value }))}
                  placeholder="e.g. Fur-Midable"
                  style={{ width: "100%", padding: 12, border: "1px solid #D4C5B0", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 15, background: "#FEFDFB", boxSizing: "border-box", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Author Name</label>
                <input
                  type="text"
                  value={config.author}
                  onChange={(e) => setConfig((c) => ({ ...c, author: e.target.value }))}
                  placeholder="e.g. Your Name"
                  style={{ width: "100%", padding: 12, border: "1px solid #D4C5B0", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 15, background: "#FEFDFB", boxSizing: "border-box", outline: "none" }}
                />
              </div>
            </div>

            {/* Chapters summary */}
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Chapters Detected ({chapters.length})</div>
            <div style={{ background: "#FEFDFB", border: "1px solid #D4C5B0", borderRadius: 8, padding: 16, marginBottom: 32, maxHeight: 240, overflowY: "auto" }}>
              {chapters.map((ch, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < chapters.length - 1 ? "1px solid #EEE" : "none", fontFamily: "'DM Sans', sans-serif" }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>{ch.number}</span>
                    {ch.title && <span style={{ fontSize: 13, color: "#999" }}> — {ch.title}</span>}
                  </div>
                  <span style={{ fontSize: 12, color: "#BBB" }}>{ch.body.split(/\s+/).length.toLocaleString()} words</span>
                </div>
              ))}
            </div>

            {/* Preview */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Final Preview</div>
              <div style={{ display: "flex", gap: 20, overflowX: "auto", padding: "8px 0 16px" }}>
                <ChapterPreview chapter={chapters[0]} genre={config.genre} headingStyle={config.headingStyle} font={config.font} bodySize={config.bodySize} trimSize={config.trimSize} />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
              <button onClick={() => setStep(1)} style={{ padding: "12px 24px", background: "transparent", border: "1px solid #DDD", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 14, cursor: "pointer", color: "#888" }}>
                ← Back
              </button>
              <button onClick={() => setStep(3)} style={{ padding: "12px 32px", background: "#1a1a1a", color: "#FEFDFB", border: "none", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                Export →
              </button>
            </div>
          </div>
        )}

        {/* ============ STEP 3: EXPORT ============ */}
        {step === 3 && (
          <div style={{ textAlign: "center", paddingTop: 32 }}>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, fontWeight: 400, margin: "0 0 8px" }}>Export Your Book</h2>
            <p style={{ color: "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
              Your manuscript will be generated as a KDP-ready .docx file with all your selected formatting applied.
            </p>

            {/* Summary card */}
            <div style={{ background: "#FEFDFB", border: "1px solid #D4C5B0", borderRadius: 12, padding: 28, maxWidth: 480, margin: "0 auto 32px", textAlign: "left" }}>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, marginBottom: 16 }}>
                {config.title || "Untitled"} {config.author && <span style={{ color: "#999", fontSize: 16 }}>by {config.author}</span>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
                <div><span style={{ color: "#999" }}>Chapters:</span> <strong>{chapters.length}</strong></div>
                <div><span style={{ color: "#999" }}>Words:</span> <strong>{chapters.reduce((s, c) => s + c.body.split(/\s+/).length, 0).toLocaleString()}</strong></div>
                <div><span style={{ color: "#999" }}>Genre:</span> <strong>{GENRES.find((g) => g.id === config.genre)?.label}</strong></div>
                <div><span style={{ color: "#999" }}>Font:</span> <strong>{config.font === "custom" && customFont ? customFont.name : FONTS.find((f) => f.id === config.font)?.label}</strong></div>
                <div><span style={{ color: "#999" }}>Size:</span> <strong>{config.bodySize}pt</strong></div>
                <div><span style={{ color: "#999" }}>Trim:</span> <strong>{TRIM_SIZES.find((t) => t.id === config.trimSize)?.label}</strong></div>
                {(() => {
                  const tw = chapters.reduce((s, c) => s + c.body.split(/\s+/).length, 0);
                  const ep = Math.max(24, Math.round(tw / 250));
                  const m = getKDPMargins(config.trimSize, ep);
                  return <>
                    <div><span style={{ color: "#999" }}>Est. pages:</span> <strong>~{ep}</strong></div>
                    <div><span style={{ color: "#999" }}>Gutter:</span> <strong>{m.inside.toFixed(2)}"</strong></div>
                    <div style={{ gridColumn: "1 / -1", color: "#999", fontSize: 11, borderTop: "1px solid #EEE", paddingTop: 8, marginTop: 4 }}>
                      Margins: Top {m.top}" · Bottom {m.bottom}" · Inside {m.inside.toFixed(2)}" · Outside {m.outside}" (KDP-compliant for ~{ep} pages)
                    </div>
                  </>;
                })()}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                padding: "16px 48px",
                background: generating ? "#666" : "#1a1a1a",
                color: "#FEFDFB",
                border: "none",
                borderRadius: 10,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 17,
                fontWeight: 600,
                cursor: generating ? "wait" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                transition: "background 0.2s ease",
              }}
            >
              {generating ? exportStatus || "Generating..." : "📥 Generate & Download .docx"}
            </button>

            {exportStatus === "done" && (
              <div style={{ marginTop: 16, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#2A7D2A", background: "#F2FBF2", border: "1px solid #C4E8C4", borderRadius: 8, padding: "14px 18px", display: "inline-block", textAlign: "left", maxWidth: 440 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>✓ Generator file downloaded!</div>
                <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>
                  Open the downloaded <strong>.html</strong> file in your browser — it will automatically generate and download your KDP-ready <strong>.docx</strong> manuscript with a progress bar.
                </div>
              </div>
            )}

            {exportStatus === "error" && (
              <div style={{ marginTop: 16, fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#C44", background: "#FFF5F5", border: "1px solid #FDD", borderRadius: 8, padding: "12px 16px", display: "inline-block" }}>
                Something went wrong building the generator. Try again.
              </div>
            )}

            {!exportStatus && (
              <p style={{ color: "#BBB", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginTop: 16, maxWidth: 440, margin: "16px auto 0", lineHeight: 1.6 }}>
                Downloads a small .html file. Open it in your browser to generate your .docx.
                <br />
                Then upload the .docx to KDP → Paperback Content → Manuscript.
              </p>
            )}

            <div style={{ marginTop: 28, padding: "14px 18px", background: "#FFFBF0", border: "1px solid #EED89E", borderRadius: 8, maxWidth: 480, margin: "28px auto 0", textAlign: "left", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8B7530", lineHeight: 1.7 }}>
              <span style={{ fontWeight: 600 }}>⚠ Always review your output.</span> Open the generated .docx in Word, Google Docs, or LibreOffice and check formatting, page breaks, margins, and chapter headings before uploading to KDP. Use KDP's Print Previewer to verify the final result. Automated formatting is a starting point — your eyes are the final quality check.
            </div>

            <button onClick={() => setStep(1)} style={{ marginTop: 24, padding: "10px 24px", background: "transparent", border: "1px solid #DDD", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: "pointer", color: "#888" }}>
              ← Change Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
