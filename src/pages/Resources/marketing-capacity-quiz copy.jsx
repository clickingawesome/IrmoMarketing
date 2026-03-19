import { useState, useRef, useCallback } from "react";

// ═══ DATA (inlined) ═══
const FUNCTIONS = [
  { id:"content", name:"Content Creation & Strategy", desc:"Blog posts, articles, whitepapers, case studies, content calendar management, editorial planning", hours:10, cat:"Content & Creative" },
  { id:"social", name:"Social Media Management", desc:"Creating posts, scheduling, community engagement, monitoring mentions, platform-specific strategy", hours:8, cat:"Digital Channels" },
  { id:"email", name:"Email Marketing & Automation", desc:"Campaign builds, list segmentation, automated nurture flows, A/B testing, deliverability management", hours:7, cat:"Digital Channels" },
  { id:"seo", name:"SEO & Organic Search", desc:"Keyword research, on-page optimization, technical SEO audits, link building, rank tracking", hours:8, cat:"Digital Channels" },
  { id:"ppc", name:"Paid Advertising (PPC / SEM)", desc:"Google Ads, Meta Ads, LinkedIn Ads, retargeting, budget management, bid optimization", hours:9, cat:"Digital Channels" },
  { id:"analytics", name:"Analytics & Reporting", desc:"Dashboard creation, KPI tracking, campaign performance reports, ROI analysis, data visualization", hours:6, cat:"Strategy & Ops" },
  { id:"design", name:"Graphic Design & Visual Assets", desc:"Brand collateral, social graphics, ad creative, presentations, infographics, print materials", hours:9, cat:"Content & Creative" },
  { id:"video", name:"Video & Multimedia Production", desc:"Shooting, editing, motion graphics, webinar production, podcast management, YouTube strategy", hours:10, cat:"Content & Creative" },
  { id:"web", name:"Website Management & Development", desc:"CMS updates, landing pages, UX improvements, site speed, A/B testing, conversion optimization", hours:8, cat:"Digital Channels" },
  { id:"brand", name:"Brand Strategy & Positioning", desc:"Brand guidelines, messaging frameworks, competitive positioning, brand voice documentation", hours:5, cat:"Strategy & Ops" },
  { id:"pr", name:"PR & Communications", desc:"Press releases, media outreach, spokesperson prep, crisis comms, earned media tracking", hours:7, cat:"Strategy & Ops" },
  { id:"events", name:"Events & Trade Shows", desc:"Planning, logistics, booth design, pre/post-event campaigns, sponsorship management, webinars", hours:8, cat:"Strategy & Ops" },
  { id:"crm", name:"CRM & Marketing Technology", desc:"Salesforce, HubSpot, Pardot — admin, integrations, data hygiene, workflow automation, vendor management", hours:7, cat:"Strategy & Ops" },
  { id:"leadgen", name:"Lead Generation & Demand Gen", desc:"Campaign strategy, funnel optimization, lead scoring, ABM programs, partnership development", hours:8, cat:"Strategy & Ops" },
  { id:"copywriting", name:"Copywriting & Messaging", desc:"Ad copy, landing page copy, email copy, product descriptions, taglines, sales enablement content", hours:7, cat:"Content & Creative" },
  { id:"research", name:"Market Research & Competitive Intel", desc:"Surveys, competitor analysis, customer interviews, persona development, trend analysis", hours:5, cat:"Strategy & Ops" },
  { id:"product", name:"Product Marketing", desc:"Positioning, go-to-market plans, sales collateral, feature launches, competitive battlecards", hours:8, cat:"Strategy & Ops" },
  { id:"influencer", name:"Influencer & Partnership Marketing", desc:"Identifying partners, outreach, contract negotiation, campaign coordination, affiliate programs", hours:6, cat:"Digital Channels" },
  { id:"reputation", name:"Reputation & Review Management", desc:"Google reviews, G2/Capterra profiles, response management, testimonial collection, case study sourcing", hours:4, cat:"Digital Channels" },
  { id:"strategy", name:"Strategic Planning & Budgeting", desc:"Annual/quarterly planning, budget allocation, team roadmaps, executive reporting, agency management", hours:5, cat:"Strategy & Ops" },
];

const ROLES = ["Marketing Coordinator","Marketing Specialist","Marketing Manager","Senior Marketing Manager","Marketing Director","VP of Marketing","CMO / Head of Marketing","Content Marketing Manager","Social Media Manager","Digital Marketing Manager","SEO / SEM Specialist","Email Marketing Specialist","Graphic Designer / Creative Lead","Marketing Analyst","Demand Gen / Growth Manager","Brand Manager","PR / Communications Manager","Product Marketing Manager","Marketing Operations Manager","Other"];

const BANDS = [
  { max:20, label:"Healthy Capacity", emoji:"✅", color:"#16a34a", bg:"#f0fdf4", border:"#bbf7d0",
    headline:"This person has room to breathe.",
    body:"Their workload is within a sustainable range. They have time for strategic thinking, professional development, and proactive work — not just reactive firefighting. This is the sweet spot for quality output and long-term retention." },
  { max:32, label:"At Capacity", emoji:"⚠️", color:"#ca8a04", bg:"#fefce8", border:"#fef08a",
    headline:"This person is fully loaded.",
    body:"They're at or near the limit of what one person can sustainably manage. Any new initiative or unexpected project will push them into overload. Quality may already be slipping on lower-priority items. Evaluate what can be delegated, automated, or deprioritized." },
  { max:45, label:"Overloaded", emoji:"🔥", color:"#ea580c", bg:"#fff7ed", border:"#fed7aa",
    headline:"This person is doing too much.",
    body:"They're carrying more than one person should. Burnout risk is high. Work quality is likely suffering — not because of ability, but because of volume. Something needs to come off their plate. Consider which functions deserve their own dedicated person." },
  { max:999, label:"Critical Overload", emoji:"🚨", color:"#dc2626", bg:"#fef2f2", border:"#fecaca",
    headline:"This is a team's worth of work on one person.",
    body:"This individual is responsible for what most organizations split across 2–4 people. This isn't a productivity problem — it's a structural one. Burnout is virtually guaranteed. The question isn't whether to restructure — it's how many roles this workload actually represents." },
];

const INDUSTRIES = {
  "B2B Services":{typical:4.2,note:"B2B services firms typically assign 4–5 functions per marketer."},
  "B2B SaaS / Tech":{typical:3.8,note:"Tech companies trend toward more specialization."},
  "B2C / Retail / E-commerce":{typical:4.5,note:"B2C marketers often juggle social, email, and paid simultaneously."},
  "Healthcare / Regulated":{typical:3.5,note:"Compliance review adds overhead, effectively reducing capacity."},
  "Professional Services":{typical:4.0,note:"Often underinvest in marketing headcount relative to ambitions."},
  "Manufacturing / Industrial":{typical:5.1,note:"Manufacturing marketers are often the most overloaded in any industry."},
  "Nonprofit / Education":{typical:5.5,note:"Limited budgets force extreme generalization."},
  "Financial Services":{typical:3.8,note:"Compliance-heavy, creating hidden workload."},
  "Real Estate / Construction":{typical:4.8,note:"Often rely on 1–2 marketers managing everything."},
  "Other":{typical:4.2,note:"Across industries, the sustainable average is about 4 functions per marketer."},
};

// ═══ FONTS & STYLE TOKENS ═══
const H = "'Instrument Serif', serif";
const B = "'DM Sans', sans-serif";
const M = "'IBM Plex Mono', monospace";

// ═══ COMPONENT ═══
export default function MarketingQuiz() {
  const [step, setStep] = useState(0);
  // Step 0: Welcome
  // Step 1: Business context
  // Step 2: Individual info
  // Step 3: Function selection
  // Step 4: Results

  const [biz, setBiz] = useState({ company:"", industry:"", teamSize:"", revenue:"" });
  const [person, setPerson] = useState({ name:"", title:"", customTitle:"", yearsInRole:"" });
  const [selected, setSelected] = useState(new Set());
  const [showPrint, setShowPrint] = useState(false);
  const resultsRef = useRef(null);

  // Derived
  const totalHours = [...selected].reduce((sum, id) => {
    const f = FUNCTIONS.find(fn => fn.id === id);
    return sum + (f ? f.hours : 0);
  }, 0);
  const band = BANDS.find(b => totalHours <= b.max) || BANDS[BANDS.length - 1];
  const indData = INDUSTRIES[biz.industry] || INDUSTRIES["Other"];
  const fteEquiv = (totalHours / 32).toFixed(1);
  const selectedFns = FUNCTIONS.filter(f => selected.has(f.id));
  const cats = {};
  selectedFns.forEach(f => { cats[f.cat] = (cats[f.cat] || 0) + f.hours; });

  const toggleFn = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handlePrint = useCallback(() => {
    const W = 1200, PAD = 60, CW = W - PAD * 2;
    const cv = document.createElement('canvas');
    const c = cv.getContext('2d');
    
    // Pre-calculate height
    const selFns = FUNCTIONS.filter(f => selected.has(f.id)).sort((a,b) => b.hours - a.hours);
    const catData = {};
    selFns.forEach(f => { catData[f.cat] = (catData[f.cat] || 0) + f.hours; });
    const tHours = selFns.reduce((s, f) => s + f.hours, 0);
    const bnd = BANDS.find(b => tHours <= b.max) || BANDS[BANDS.length - 1];
    const indD = INDUSTRIES[biz.industry] || INDUSTRIES["Other"];
    const fte = (tHours / 32).toFixed(1);
    const title = person.title === "Other" ? person.customTitle : person.title;
    const fnRows = Math.ceil(selFns.length / 2);
    
    // Recommendations
    const recs = [];
    if (tHours > 45) recs.push(`Split this role into ${Math.ceil(tHours/32)} separate positions. This is unsustainable at any skill level.`);
    if (tHours > 32 && tHours <= 45) recs.push("Audit which functions get the most and least attention. The lowest-priority items are likely being done poorly or not at all.");
    if (tHours > 32) recs.push("Identify functions that can be partially automated (email, social, analytics) or outsourced (design, PPC, content).");
    if (selected.size > 6) recs.push(`${person.name} owns ${selected.size} functions. Context-switching across that many disciplines reduces effectiveness by 20-40%.`);
    if (selected.size > indD.typical) recs.push(`The industry benchmark for ${biz.industry} is ~${indD.typical} functions per marketer. Consider which functions should be owned by a second hire or an agency.`);
    if (tHours <= 20) recs.push("This workload is sustainable. Use available capacity for strategic projects, skill development, or expanding into adjacent functions intentionally.");
    if (tHours > 20 && tHours <= 32) recs.push("Capacity is tight. Before adding any new function, determine what gets traded away.");
    recs.push("Share these results with leadership. Data-driven conversations about capacity are more productive than complaints about being 'busy.'");

    const totalH = 140 + 220 + 200 + (fnRows * 36 + 80) + (recs.length * 50 + 100) + 180 + 120;
    cv.width = W;
    cv.height = Math.max(totalH, 1400);
    
    // Background
    c.fillStyle = '#FAFAF8';
    c.fillRect(0, 0, W, cv.height);
    
    // Helper functions
    const drawText = (text, x, y, font, color, maxW) => {
      c.font = font;
      c.fillStyle = color;
      if (maxW) {
        const words = text.split(' ');
        let line = '', ly = y;
        words.forEach(w => {
          const test = line + w + ' ';
          if (c.measureText(test).width > maxW && line) {
            c.fillText(line.trim(), x, ly);
            ly += parseInt(font) * 1.5;
            line = w + ' ';
          } else line = test;
        });
        c.fillText(line.trim(), x, ly);
        return ly + parseInt(font) * 1.2;
      }
      c.fillText(text, x, y);
      return y + parseInt(font) * 1.5;
    };
    
    const drawRoundRect = (x, y, w, h, r, fill, stroke) => {
      c.beginPath();
      c.roundRect(x, y, w, h, r);
      if (fill) { c.fillStyle = fill; c.fill(); }
      if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1.5; c.stroke(); }
    };
    
    let Y = PAD;
    
    // ── HEADER ──
    c.font = 'italic 28px Georgia, serif';
    c.fillStyle = '#1a1a1a';
    c.fillText('Marketing Capacity Assessment', PAD, Y + 28);
    c.font = '13px sans-serif';
    c.fillStyle = '#999';
    c.fillText('Prepared by IrmoMarketing.com  ·  ' + new Date().toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'}), PAD, Y + 50);
    // Right side
    c.textAlign = 'right';
    c.font = '14px sans-serif';
    c.fillStyle = '#1a1a1a';
    if (biz.company) c.fillText(biz.company, W - PAD, Y + 28);
    c.font = '12px sans-serif';
    c.fillStyle = '#888';
    c.fillText(`${person.name}  ·  ${title}`, W - PAD, Y + 48);
    c.textAlign = 'left';
    
    // Divider
    Y += 70;
    c.fillStyle = '#1a1a1a';
    c.fillRect(PAD, Y, CW, 2);
    Y += 30;
    
    // ── VERDICT ──
    const verdictH = 200;
    drawRoundRect(PAD, Y, CW, verdictH, 12, bnd.bg, bnd.border);
    c.font = 'bold 32px sans-serif';
    c.fillStyle = bnd.color;
    c.fillText(bnd.emoji + '  ' + bnd.label, PAD + 24, Y + 42);
    c.font = 'italic 22px Georgia, serif';
    c.fillStyle = '#1a1a1a';
    c.fillText(bnd.headline, PAD + 24, Y + 72);
    c.font = '14px sans-serif';
    c.fillStyle = '#555';
    drawText(bnd.body, PAD + 24, Y + 100, '14px sans-serif', '#555', CW - 48);

    // Stats row inside verdict
    const statY = Y + verdictH - 52;
    const statW = (CW - 48) / 4;
    [
      [selected.size + '', 'Functions Owned', `Avg: ${indD.typical}`],
      [tHours + '', 'Est. Hours/Week', 'Of 32 productive hrs'],
      [fte + 'x', 'FTE Equivalent', 'People this represents'],
      [Math.min(Math.round((tHours/32)*100), 999) + '%', 'Capacity Used', tHours > 32 ? 'Over 100% = unsustainable' : 'Of available capacity'],
    ].forEach(([val, lbl, sub], i) => {
      const sx = PAD + 24 + i * statW;
      c.font = 'bold 11px monospace';
      c.fillStyle = '#999';
      c.fillText(lbl.toUpperCase(), sx, statY);
      c.font = 'italic 28px Georgia, serif';
      c.fillStyle = '#1a1a1a';
      c.fillText(val, sx, statY + 28);
      c.font = '10px sans-serif';
      c.fillStyle = '#bbb';
      c.fillText(sub, sx, statY + 42);
    });
    Y += verdictH + 24;
    
    // ── HOUR BREAKDOWN BAR ──
    drawRoundRect(PAD, Y, CW, 80, 10, '#fff', '#E8E6E1');
    c.font = 'bold 10px monospace';
    c.fillStyle = '#999';
    c.fillText('WEEKLY HOUR BREAKDOWN', PAD + 20, Y + 22);
    // Bar
    const barX = PAD + 20, barY = Y + 32, barW = CW - 40, barH = 28;
    drawRoundRect(barX, barY, barW, barH, 6, '#f0f0ec', null);
    let bx = barX;
    const grays = ['#1a1a1a','#3d3d3d','#5a5a5a','#777','#999','#bbb','#888','#666','#444','#aaa','#555','#7a7a7a','#9a9a9a','#4a4a4a','#6a6a6a','#8a8a8a','#c0c0c0','#b0b0b0','#707070','#606060'];
    selFns.forEach((f, i) => {
      const fw = (f.hours / Math.max(tHours, 1)) * barW;
      c.fillStyle = grays[i % grays.length];
      c.fillRect(bx, barY, Math.max(fw, 1), barH);
      bx += fw;
    });
    Y += 100;
    
    // ── FUNCTIONS LIST ──
    drawRoundRect(PAD, Y, CW, fnRows * 36 + 56, 10, '#fff', '#E8E6E1');
    c.font = 'bold 10px monospace';
    c.fillStyle = '#999';
    c.fillText(`ALL SELECTED FUNCTIONS (${selected.size})`, PAD + 20, Y + 22);
    selFns.forEach((f, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const fx = PAD + 20 + col * (CW / 2 - 10);
      const fy = Y + 42 + row * 36;
      c.font = '13px sans-serif';
      c.fillStyle = '#1a1a1a';
      c.fillText(f.name, fx, fy);
      c.font = 'bold 12px monospace';
      c.fillStyle = '#999';
      c.fillText(f.hours + 'h', fx + (CW / 2 - 50), fy);
    });
    Y += fnRows * 36 + 72;
    
    // ── INDUSTRY BENCHMARK ──
    drawRoundRect(PAD, Y, CW, 100, 10, '#fff', '#E8E6E1');
    c.font = 'bold 10px monospace';
    c.fillStyle = '#999';
    c.fillText('INDUSTRY BENCHMARK — ' + (biz.industry || '').toUpperCase(), PAD + 20, Y + 22);
    c.font = 'italic 28px Georgia, serif';
    c.fillStyle = '#1a1a1a';
    c.fillText(selected.size + '', PAD + 20, Y + 58);
    c.font = '14px sans-serif';
    c.fillStyle = '#888';
    c.fillText('functions  vs. industry average of  ', PAD + 55, Y + 56);
    const avgTxtW = c.measureText('functions  vs. industry average of  ').width;
    c.font = 'italic 28px Georgia, serif';
    c.fillStyle = '#999';
    c.fillText(indD.typical + '', PAD + 55 + avgTxtW, Y + 58);
    c.font = '13px sans-serif';
    c.fillStyle = '#888';
    drawText(indD.note, PAD + 20, Y + 82, '13px sans-serif', '#888', CW - 40);
    Y += 120;
    
    // ── RECOMMENDATIONS ──
    drawRoundRect(PAD, Y, CW, recs.length * 50 + 50, 10, '#fff', '#E8E6E1');
    c.font = 'bold 10px monospace';
    c.fillStyle = '#999';
    c.fillText('RECOMMENDATIONS', PAD + 20, Y + 22);
    recs.forEach((rec, i) => {
      const ry = Y + 44 + i * 50;
      drawRoundRect(PAD + 16, ry, CW - 32, 42, 6, '#FAFAF8', '#f0f0ec');
      drawText(rec, PAD + 28, ry + 16, '13px sans-serif', '#555', CW - 60);
    });
    Y += recs.length * 50 + 70;
    
    // ── FOOTER ──
    c.fillStyle = '#E8E6E1';
    c.fillRect(PAD, Y, CW, 1);
    Y += 20;
    c.font = 'italic 18px Georgia, serif';
    c.fillStyle = '#1a1a1a';
    c.fillText('IrmoMarketing.com', PAD, Y + 18);
    c.font = '13px sans-serif';
    c.fillStyle = '#999';
    c.fillText('Marketing operations built for results, not burnout.', PAD, Y + 38);
    c.font = '11px monospace';
    c.fillStyle = '#ccc';
    c.textAlign = 'right';
    c.fillText('Assessment generated ' + new Date().toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'}), W - PAD, Y + 38);
    c.textAlign = 'left';
    
    // Trim canvas to actual content
    const finalH = Y + 70;
    const trimmed = document.createElement('canvas');
    trimmed.width = W;
    trimmed.height = finalH;
    trimmed.getContext('2d').drawImage(cv, 0, 0);
    
    // Download
    const a = document.createElement('a');
    a.href = trimmed.toDataURL('image/png');
    a.download = `${person.name.replace(/\s+/g, '-')}-Marketing-Capacity-Report.png`;
    a.click();
  }, [selected, biz, person, totalHours, band, indData, fteEquiv, selectedFns, cats]);

  const goNext = () => setStep(s => Math.min(s + 1, 4));
  const goBack = () => setStep(s => Math.max(s - 1, 0));
  const restart = () => { setStep(0); setBiz({company:"",industry:"",teamSize:"",revenue:""}); setPerson({name:"",title:"",customTitle:"",yearsInRole:""}); setSelected(new Set()); };

  const canAdvance1 = biz.industry && biz.teamSize;
  const canAdvance2 = person.name && (person.title && (person.title !== "Other" || person.customTitle));
  const canAdvance3 = selected.size > 0;

  // Progress
  const progress = step === 0 ? 0 : step === 4 ? 100 : Math.round((step / 4) * 100);

  return (
    <div style={{minHeight:"100vh",background:"#FAFAF8",position:"relative",fontFamily:B}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes scaleIn { from{transform:scale(0.95);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
        button { font-family: ${B}; }
        @media print {
          .no-print { display:none!important; }
          .print-only { display:block!important; }
          body { background:white!important; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
          .print-break { page-break-before:always; }
        }
        .print-only { display:none; }
        .fn-card { transition: all .2s ease; }
        .fn-card:hover { transform:translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.08); }
        .fn-card.on { border-color: #1a1a1a!important; background: #F5F5F0!important; }
        .fn-card.on .fn-check { background:#1a1a1a; border-color:#1a1a1a; }
        .fn-card.on .fn-check::after { content:'✓'; color:white; font-size:13px; }
        input:focus, select:focus { outline:none; border-color:#1a1a1a; }
        select { cursor:pointer; }
      `}</style>

      {/* ─── HEADER ─── */}
      <div className="no-print" style={{borderBottom:"1px solid #E8E6E1",background:"white",padding:"16px 0",position:"sticky",top:0,zIndex:50}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"0 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontFamily:H,fontSize:20,color:"#1a1a1a",letterSpacing:"-.3px"}}>Irmo Marketing</div>
          </div>
          {step > 0 && step < 4 && (
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontFamily:M,fontSize:11,color:"#999",letterSpacing:".5px"}}>STEP {step} OF 3</div>
              <div style={{width:120,height:4,background:"#E8E6E1",borderRadius:2,overflow:"hidden"}}>
                <div style={{width:`${progress}%`,height:"100%",background:"#1a1a1a",borderRadius:2,transition:"width .4s ease"}}/>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── PRINT HEADER ─── */}
      <div className="print-only" style={{padding:"24px 0",borderBottom:"2px solid #1a1a1a",marginBottom:24}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"0 24px",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div>
            <div style={{fontFamily:H,fontSize:28,color:"#1a1a1a"}}>Marketing Capacity Assessment</div>
            <div style={{fontFamily:B,fontSize:13,color:"#666",marginTop:4}}>Prepared by IrmoMarketing.com · {new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div>
          </div>
          <div style={{textAlign:"right"}}>
            {biz.company && <div style={{fontFamily:B,fontSize:14,fontWeight:600}}>{biz.company}</div>}
            <div style={{fontFamily:B,fontSize:12,color:"#666"}}>{person.name} · {person.title === "Other" ? person.customTitle : person.title}</div>
          </div>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"0 24px 80px"}}>

        {/* ═══ STEP 0: WELCOME ═══ */}
        {step === 0 && (
          <div style={{animation:"fadeUp .6s ease-out",maxWidth:640,margin:"0 auto",paddingTop:80,textAlign:"center"}}>
            <div style={{fontFamily:M,fontSize:11,letterSpacing:2,color:"#999",textTransform:"uppercase",marginBottom:16}}>Free Assessment Tool</div>
            <h1 style={{fontFamily:H,fontSize:"clamp(36px, 5vw, 56px)",fontWeight:400,color:"#1a1a1a",lineHeight:1.1,marginBottom:20,letterSpacing:"-1px"}}>
              Is your marketing team<br/><em style={{fontStyle:"italic"}}>stretched too thin?</em>
            </h1>
            <p style={{fontSize:17,lineHeight:1.7,color:"#555",maxWidth:520,margin:"0 auto 12px"}}>
              Research consistently shows that marketing teams are overburdened — doing too many things, with too few people, and wondering why results aren't better.
            </p>
            <p style={{fontSize:15,lineHeight:1.7,color:"#888",maxWidth:480,margin:"0 auto 40px"}}>
              This 2-minute assessment maps an individual's actual responsibilities against industry capacity benchmarks to show whether they're set up for success — or burning out.
            </p>
            <button onClick={goNext} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 48px",background:"#1a1a1a",color:"white",border:"none",borderRadius:8,fontSize:16,fontWeight:600,cursor:"pointer",transition:"all .2s",letterSpacing:".2px"}}>
              Start Assessment →
            </button>
            <div style={{marginTop:48,display:"flex",justifyContent:"center",gap:32}}>
              {[["📊","Evidence-based","Hour weights from industry research"],["⏱","2 minutes","Three quick sections"],["📥","Downloadable","Share results with leadership"]].map(([icon,title,sub],i) => (
                <div key={i} style={{textAlign:"center",animation:`fadeUp .5s ease-out ${.2+i*.15}s both`}}>
                  <div style={{fontSize:24,marginBottom:6}}>{icon}</div>
                  <div style={{fontSize:13,fontWeight:600,color:"#1a1a1a"}}>{title}</div>
                  <div style={{fontSize:12,color:"#999"}}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ STEP 1: BUSINESS CONTEXT ═══ */}
        {step === 1 && (
          <div style={{animation:"fadeUp .5s ease-out",maxWidth:560,margin:"0 auto",paddingTop:48}}>
            <div style={{fontFamily:M,fontSize:11,letterSpacing:2,color:"#999",textTransform:"uppercase",marginBottom:8}}>Section 1</div>
            <h2 style={{fontFamily:H,fontSize:32,fontWeight:400,color:"#1a1a1a",marginBottom:6}}>About the business</h2>
            <p style={{fontSize:15,color:"#888",marginBottom:36}}>This helps us benchmark against similar organizations.</p>

            <div style={{display:"flex",flexDirection:"column",gap:24}}>
              <Field label="Company name" sub="Optional — used to personalize your report">
                <input value={biz.company} onChange={e => setBiz({...biz, company:e.target.value})} placeholder="Acme Corp" style={inputStyle} />
              </Field>

              <Field label="Industry" sub="Select the closest match" required>
                <select value={biz.industry} onChange={e => setBiz({...biz, industry:e.target.value})} style={inputStyle}>
                  <option value="">Select industry...</option>
                  {Object.keys(INDUSTRIES).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </Field>

              <Field label="Marketing team size" sub="Total headcount dedicated to marketing" required>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {["1 (Solo)","2–3","4–7","8–15","15+"].map(v => (
                    <button key={v} onClick={() => setBiz({...biz, teamSize:v})}
                      style={{...pillStyle, background: biz.teamSize===v ? "#1a1a1a" : "white", color: biz.teamSize===v ? "white" : "#555", borderColor: biz.teamSize===v ? "#1a1a1a" : "#ddd"}}>
                      {v}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Annual revenue range" sub="Optional — helps contextualize team size">
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {["< $1M","$1M–$5M","$5M–$25M","$25M–$100M","$100M+"].map(v => (
                    <button key={v} onClick={() => setBiz({...biz, revenue:v})}
                      style={{...pillStyle, background: biz.revenue===v ? "#1a1a1a" : "white", color: biz.revenue===v ? "white" : "#555", borderColor: biz.revenue===v ? "#1a1a1a" : "#ddd"}}>
                      {v}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div style={{display:"flex",gap:12,marginTop:40}}>
              <button onClick={goBack} style={backBtnStyle}>← Back</button>
              <button onClick={goNext} disabled={!canAdvance1} style={{...nextBtnStyle, opacity:canAdvance1?1:.4, cursor:canAdvance1?"pointer":"not-allowed"}}>Continue →</button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: INDIVIDUAL INFO ═══ */}
        {step === 2 && (
          <div style={{animation:"fadeUp .5s ease-out",maxWidth:560,margin:"0 auto",paddingTop:48}}>
            <div style={{fontFamily:M,fontSize:11,letterSpacing:2,color:"#999",textTransform:"uppercase",marginBottom:8}}>Section 2</div>
            <h2 style={{fontFamily:H,fontSize:32,fontWeight:400,color:"#1a1a1a",marginBottom:6}}>Who are we assessing?</h2>
            <p style={{fontSize:15,color:"#888",marginBottom:36}}>This is about one person's workload — not the team's total.</p>

            <div style={{display:"flex",flexDirection:"column",gap:24}}>
              <Field label="Their name" sub="First name or full name" required>
                <input value={person.name} onChange={e => setPerson({...person, name:e.target.value})} placeholder="Sarah" style={inputStyle} />
              </Field>

              <Field label="Their title" sub="Select the closest match" required>
                <select value={person.title} onChange={e => setPerson({...person, title:e.target.value})} style={inputStyle}>
                  <option value="">Select title...</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>

              {person.title === "Other" && (
                <Field label="Custom title" required>
                  <input value={person.customTitle} onChange={e => setPerson({...person, customTitle:e.target.value})} placeholder="e.g. Growth & Ops Lead" style={inputStyle} />
                </Field>
              )}

              <Field label="Years in this role" sub="Optional">
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {["< 1 year","1–2 years","3–5 years","5–10 years","10+ years"].map(v => (
                    <button key={v} onClick={() => setPerson({...person, yearsInRole:v})}
                      style={{...pillStyle, background: person.yearsInRole===v ? "#1a1a1a" : "white", color: person.yearsInRole===v ? "white" : "#555", borderColor: person.yearsInRole===v ? "#1a1a1a" : "#ddd"}}>
                      {v}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div style={{display:"flex",gap:12,marginTop:40}}>
              <button onClick={goBack} style={backBtnStyle}>← Back</button>
              <button onClick={goNext} disabled={!canAdvance2} style={{...nextBtnStyle, opacity:canAdvance2?1:.4, cursor:canAdvance2?"pointer":"not-allowed"}}>Continue →</button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: FUNCTION SELECTION ═══ */}
        {step === 3 && (
          <div style={{animation:"fadeUp .5s ease-out",paddingTop:48}}>
            <div style={{maxWidth:560,marginBottom:32}}>
              <div style={{fontFamily:M,fontSize:11,letterSpacing:2,color:"#999",textTransform:"uppercase",marginBottom:8}}>Section 3</div>
              <h2 style={{fontFamily:H,fontSize:32,fontWeight:400,color:"#1a1a1a",marginBottom:6}}>
                What does {person.name} own?
              </h2>
              <p style={{fontSize:15,color:"#888",marginBottom:4}}>
                Select every function they're <strong style={{color:"#555"}}>regularly responsible for</strong> — not occasional help, but ongoing ownership.
              </p>
              <p style={{fontSize:13,color:"#aaa"}}>
                Each function carries a research-based hour weight reflecting the real time commitment when it's done properly.
              </p>
            </div>

            {/* Live counter */}
            <div className="no-print" style={{position:"sticky",top:62,zIndex:40,background:"#FAFAF8",padding:"12px 0 16px",borderBottom:"1px solid #E8E6E1",marginBottom:24}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                  <span style={{fontFamily:H,fontSize:28,color:"#1a1a1a"}}>{selected.size}</span>
                  <span style={{fontSize:14,color:"#888"}}>functions selected</span>
                </div>
                <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                  <span style={{fontFamily:H,fontSize:28,color:band.color}}>{totalHours}</span>
                  <span style={{fontSize:14,color:"#888"}}>est. hours/week</span>
                </div>
                <div style={{padding:"6px 14px",borderRadius:6,background:band.bg,border:`1px solid ${band.border}`,fontFamily:M,fontSize:12,color:band.color,fontWeight:500}}>
                  {band.emoji} {band.label}
                </div>
              </div>
            </div>

            {/* Function cards by category */}
            {["Content & Creative","Digital Channels","Strategy & Ops"].map(cat => (
              <div key={cat} style={{marginBottom:32}}>
                <div style={{fontFamily:M,fontSize:11,letterSpacing:1.5,color:"#999",textTransform:"uppercase",marginBottom:12}}>{cat}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",gap:10}}>
                  {FUNCTIONS.filter(f => f.cat === cat).map((f, i) => (
                    <div key={f.id} className={`fn-card ${selected.has(f.id) ? 'on' : ''}`}
                      onClick={() => toggleFn(f.id)}
                      style={{padding:"16px 18px",border:"1.5px solid #E8E6E1",borderRadius:10,cursor:"pointer",background:"white",animation:`slideIn .3s ease-out ${i*.04}s both`,display:"flex",gap:14,alignItems:"flex-start"}}>
                      <div className="fn-check" style={{width:22,height:22,borderRadius:6,border:"2px solid #ccc",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1,transition:"all .15s"}}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:14,fontWeight:600,color:"#1a1a1a",marginBottom:3}}>{f.name}</div>
                        <div style={{fontSize:12,color:"#999",lineHeight:1.5}}>{f.desc}</div>
                        <div style={{fontFamily:M,fontSize:11,color:"#bbb",marginTop:6}}>~{f.hours} hrs/week</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{display:"flex",gap:12,marginTop:16}}>
              <button onClick={goBack} style={backBtnStyle}>← Back</button>
              <button onClick={goNext} disabled={!canAdvance3} style={{...nextBtnStyle, opacity:canAdvance3?1:.4, cursor:canAdvance3?"pointer":"not-allowed"}}>See Results →</button>
            </div>
          </div>
        )}

        {/* ═══ STEP 4: RESULTS ═══ */}
        {step === 4 && (
          <div ref={resultsRef} style={{paddingTop:48,animation:"fadeUp .5s ease-out"}}>
            {/* Action bar */}
            <div className="no-print" style={{display:"flex",gap:12,marginBottom:32,flexWrap:"wrap"}}>
              <button onClick={handlePrint} style={{...nextBtnStyle,gap:6,display:"inline-flex",alignItems:"center"}}>📥 Download Report</button>
              <button onClick={restart} style={backBtnStyle}>Start Over</button>
            </div>

            {/* Title */}
            <div style={{marginBottom:40}}>
              <div style={{fontFamily:M,fontSize:11,letterSpacing:2,color:"#999",textTransform:"uppercase",marginBottom:8}}>Assessment Results</div>
              <h2 style={{fontFamily:H,fontSize:"clamp(28px, 4vw, 42px)",fontWeight:400,color:"#1a1a1a",lineHeight:1.15,marginBottom:8}}>
                {person.name}'s Marketing Capacity Report
              </h2>
              <p style={{fontSize:15,color:"#888"}}>
                {person.title === "Other" ? person.customTitle : person.title}
                {biz.company ? ` at ${biz.company}` : ''} · {biz.industry} · Team of {biz.teamSize}
              </p>
            </div>

            {/* ── VERDICT CARD ── */}
            <div style={{background:band.bg,border:`2px solid ${band.border}`,borderRadius:16,padding:"32px 36px",marginBottom:32,animation:"scaleIn .4s ease-out"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <span style={{fontSize:36}}>{band.emoji}</span>
                <div>
                  <div style={{fontFamily:M,fontSize:12,letterSpacing:1,color:band.color,textTransform:"uppercase",fontWeight:600}}>{band.label}</div>
                  <div style={{fontFamily:H,fontSize:26,color:"#1a1a1a",lineHeight:1.2}}>{band.headline}</div>
                </div>
              </div>
              <p style={{fontSize:15,lineHeight:1.7,color:"#555",marginBottom:20}}>{band.body}</p>
              <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
                <Stat label="Functions owned" value={selected.size} sub={`Industry avg: ${indData.typical}`} />
                <Stat label="Est. hours/week" value={totalHours} sub="Based on 32 productive hrs" />
                <Stat label="FTE equivalent" value={`${fteEquiv}x`} sub="How many people this represents" />
                <Stat label="Capacity used" value={`${Math.min(Math.round((totalHours/32)*100), 999)}%`} sub={totalHours > 32 ? "Over 100% = unsustainable" : "Of available capacity"} />
              </div>
            </div>

            {/* ── HOUR BREAKDOWN BAR ── */}
            <div style={{background:"white",border:"1px solid #E8E6E1",borderRadius:14,padding:"28px 32px",marginBottom:32}}>
              <div style={{fontFamily:M,fontSize:11,letterSpacing:1.5,color:"#999",textTransform:"uppercase",marginBottom:16}}>Weekly Hour Breakdown</div>
              <div style={{display:"flex",height:40,borderRadius:8,overflow:"hidden",marginBottom:16,background:"#f0f0ec"}}>
                {selectedFns.map((f, i) => {
                  const pct = (f.hours / Math.max(totalHours, 1)) * 100;
                  const colors = ["#1a1a1a","#3d3d3d","#5a5a5a","#777","#999","#bbb","#d4d4d0","#888","#666","#444","#aaa","#555","#7a7a7a","#9a9a9a","#b8b8b4","#4a4a4a","#6a6a6a","#8a8a8a","#a8a8a4","#c4c4c0"];
                  return (
                    <div key={f.id} title={`${f.name}: ${f.hours}hrs`} style={{width:`${pct}%`,background:colors[i % colors.length],minWidth:pct > 2 ? 2 : 0,transition:"width .4s"}}/>
                  );
                })}
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:"8px 20px"}}>
                {selectedFns.sort((a,b) => b.hours - a.hours).map(f => (
                  <div key={f.id} style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontFamily:M,fontSize:12,fontWeight:500,color:"#1a1a1a"}}>{f.hours}h</span>
                    <span style={{fontSize:13,color:"#888"}}>{f.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── CATEGORY SPLIT ── */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",gap:16,marginBottom:32}}>
              {Object.entries(cats).sort((a,b) => b[1] - a[1]).map(([cat, hrs]) => (
                <div key={cat} style={{background:"white",border:"1px solid #E8E6E1",borderRadius:12,padding:"20px 22px"}}>
                  <div style={{fontFamily:M,fontSize:11,color:"#999",letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>{cat}</div>
                  <div style={{fontFamily:H,fontSize:28,color:"#1a1a1a"}}>{hrs} hrs</div>
                  <div style={{fontSize:13,color:"#999"}}>{Math.round((hrs/totalHours)*100)}% of total workload</div>
                  <div style={{marginTop:10,height:6,background:"#f0f0ec",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${Math.min((hrs/32)*100,100)}%`,background:"#1a1a1a",borderRadius:3,transition:"width .6s"}}/>
                  </div>
                </div>
              ))}
            </div>

            {/* ── INDUSTRY BENCHMARK ── */}
            <div style={{background:"white",border:"1px solid #E8E6E1",borderRadius:14,padding:"28px 32px",marginBottom:32}}>
              <div style={{fontFamily:M,fontSize:11,letterSpacing:1.5,color:"#999",textTransform:"uppercase",marginBottom:12}}>Industry Benchmark — {biz.industry}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:8}}>
                <span style={{fontFamily:H,fontSize:36,color:"#1a1a1a"}}>{selected.size}</span>
                <span style={{fontSize:15,color:"#888"}}>functions vs. industry average of</span>
                <span style={{fontFamily:H,fontSize:36,color:"#999"}}>{indData.typical}</span>
              </div>
              <p style={{fontSize:14,color:"#888",lineHeight:1.6,marginBottom:16}}>{indData.note}</p>
              {selected.size > indData.typical && (
                <div style={{padding:"12px 16px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,fontSize:14,color:"#dc2626",lineHeight:1.6}}>
                  {person.name} is managing <strong>{(selected.size - indData.typical).toFixed(1)} more functions</strong> than the industry average. That's roughly <strong>{Math.round((selected.size - indData.typical) * 6.5)} extra hours/week</strong> above what peers typically carry.
                </div>
              )}
              {selected.size <= indData.typical && (
                <div style={{padding:"12px 16px",background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,fontSize:14,color:"#16a34a",lineHeight:1.6}}>
                  {person.name}'s function count is at or below the industry average — a good sign for sustainable performance.
                </div>
              )}
            </div>

            {/* ── WHAT THIS MEANS ── */}
            <div className="print-break" style={{background:"white",border:"1px solid #E8E6E1",borderRadius:14,padding:"28px 32px",marginBottom:32}}>
              <div style={{fontFamily:M,fontSize:11,letterSpacing:1.5,color:"#999",textTransform:"uppercase",marginBottom:12}}>What This Means</div>
              {totalHours > 32 && (<>
                <p style={{fontSize:15,lineHeight:1.7,color:"#555",marginBottom:16}}>
                  At <strong>{totalHours} estimated hours per week</strong> of function-level work, {person.name} has approximately <strong>{Math.round(totalHours - 32)} hours of work beyond capacity</strong> every single week. That doesn't include meetings, email, one-off requests, or management responsibilities.
                </p>
                <p style={{fontSize:15,lineHeight:1.7,color:"#555",marginBottom:16}}>
                  This workload effectively represents <strong>{fteEquiv} full-time equivalents</strong>. The math is simple: this amount of work requires more than one person to execute well.
                </p>
              </>)}
              {totalHours <= 32 && totalHours > 20 && (
                <p style={{fontSize:15,lineHeight:1.7,color:"#555",marginBottom:16}}>
                  At <strong>{totalHours} estimated hours per week</strong>, {person.name} is at or near capacity. There's limited room for new initiatives, strategic projects, or the inevitable fire drills. Any additions should come with a clear trade-off: what gets deprioritized?
                </p>
              )}
              {totalHours <= 20 && (
                <p style={{fontSize:15,lineHeight:1.7,color:"#555",marginBottom:16}}>
                  At <strong>{totalHours} estimated hours per week</strong>, {person.name} has a sustainable workload with room for strategic thinking, experimentation, and proactive work. This is a sign of good team structuring.
                </p>
              )}

              <div style={{fontFamily:H,fontSize:20,color:"#1a1a1a",marginBottom:12,marginTop:24}}>Recommendations</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {totalHours > 45 && <RecItem icon="🚨" text={`Split this role into ${Math.ceil(totalHours/32)} separate positions. This is unsustainable at any skill level.`}/>}
                {totalHours > 32 && totalHours <= 45 && <RecItem icon="📋" text="Audit which functions are getting the most and least attention. The lowest-priority items are likely being done poorly or not at all."/>}
                {totalHours > 32 && <RecItem icon="🤖" text="Identify which functions can be partially automated (email, social, analytics) or outsourced (design, PPC, content) to reduce the load."/>}
                {selected.size > 6 && <RecItem icon="🎯" text={`${person.name} owns ${selected.size} functions. Even with adequate hours, context-switching across that many disciplines reduces effectiveness by 20–40%.`}/>}
                {selected.size > indData.typical && <RecItem icon="📊" text={`The industry benchmark for ${biz.industry} is ~${indData.typical} functions per marketer. Consider which functions should be owned by a second hire or an agency.`}/>}
                {totalHours <= 20 && <RecItem icon="✅" text="This workload is sustainable. Use the available capacity for strategic projects, skill development, or expanding into adjacent functions intentionally."/>}
                {totalHours > 20 && totalHours <= 32 && <RecItem icon="⚡" text="Capacity is tight. Before adding any new function, determine what's being traded away. Consider seasonal spikes too."/>}
                <RecItem icon="💡" text="Share these results with leadership. Data-driven conversations about capacity are more productive than anecdotal complaints about being 'busy.'"/>
              </div>
            </div>

            {/* ── FUNCTION LIST (for print) ── */}
            <div style={{background:"white",border:"1px solid #E8E6E1",borderRadius:14,padding:"28px 32px",marginBottom:32}}>
              <div style={{fontFamily:M,fontSize:11,letterSpacing:1.5,color:"#999",textTransform:"uppercase",marginBottom:16}}>All Selected Functions ({selected.size})</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))",gap:8}}>
                {selectedFns.sort((a,b) => b.hours - a.hours).map(f => (
                  <div key={f.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:"#FAFAF8",borderRadius:8,border:"1px solid #f0f0ec"}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:500,color:"#1a1a1a"}}>{f.name}</div>
                      <div style={{fontFamily:M,fontSize:11,color:"#999"}}>{f.cat}</div>
                    </div>
                    <div style={{fontFamily:M,fontSize:13,fontWeight:600,color:"#1a1a1a"}}>{f.hours}h</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── CTA ── */}
            <div className="no-print" style={{background:"#1a1a1a",borderRadius:16,padding:"36px 40px",textAlign:"center",marginBottom:32}}>
              <div style={{fontFamily:H,fontSize:28,color:"white",marginBottom:8}}>Need help right-sizing your team?</div>
              <p style={{fontSize:15,color:"#999",marginBottom:24,maxWidth:480,margin:"0 auto 24px",lineHeight:1.6}}>
                Irmo Marketing helps businesses build marketing operations that are structured for results — not burnout. Let's talk about what your team actually needs.
              </p>
              <a href="https://irmomarketing.com/contact" target="_blank" rel="noopener noreferrer"
                style={{display:"inline-flex",alignItems:"center",gap:8,padding:"14px 40px",background:"white",color:"#1a1a1a",border:"none",borderRadius:8,fontSize:15,fontWeight:600,cursor:"pointer",textDecoration:"none",letterSpacing:".2px"}}>
                Get a Free Consultation →
              </a>
            </div>

            {/* ── FOOTER ── */}
            <div style={{textAlign:"center",padding:"24px 0",borderTop:"1px solid #E8E6E1",fontSize:13,color:"#999"}}>
              <div style={{fontFamily:H,fontSize:16,color:"#1a1a1a",marginBottom:4}}>IrmoMarketing.com</div>
              <div>Marketing operations built for results, not burnout.</div>
              <div style={{marginTop:4,fontFamily:M,fontSize:11,color:"#ccc"}}>Assessment generated {new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ═══ SUBCOMPONENTS ═══
function Field({ label, sub, required, children }) {
  return (
    <div>
      <label style={{display:"block",fontSize:14,fontWeight:600,color:"#1a1a1a",marginBottom:4}}>
        {label} {required && <span style={{color:"#dc2626"}}>*</span>}
      </label>
      {sub && <div style={{fontSize:12,color:"#999",marginBottom:8}}>{sub}</div>}
      {children}
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div style={{minWidth:120}}>
      <div style={{fontFamily:"'IBM Plex Mono', monospace",fontSize:11,color:"#999",letterSpacing:".5px",textTransform:"uppercase",marginBottom:2}}>{label}</div>
      <div style={{fontFamily:"'Instrument Serif', serif",fontSize:32,color:"#1a1a1a",lineHeight:1}}>{value}</div>
      {sub && <div style={{fontSize:12,color:"#aaa",marginTop:2}}>{sub}</div>}
    </div>
  );
}

function RecItem({ icon, text }) {
  return (
    <div style={{display:"flex",gap:10,padding:"12px 14px",background:"#FAFAF8",borderRadius:8,border:"1px solid #f0f0ec",alignItems:"flex-start"}}>
      <span style={{fontSize:18,flexShrink:0}}>{icon}</span>
      <span style={{fontSize:14,color:"#555",lineHeight:1.6}}>{text}</span>
    </div>
  );
}

// ═══ SHARED STYLES ═══
const inputStyle = {
  width:"100%",padding:"12px 16px",background:"white",border:"1.5px solid #E8E6E1",borderRadius:8,
  fontSize:15,fontFamily:"'DM Sans', sans-serif",color:"#1a1a1a",transition:"border-color .2s",
};

const pillStyle = {
  padding:"8px 18px",border:"1.5px solid #ddd",borderRadius:8,fontSize:14,fontWeight:500,
  cursor:"pointer",transition:"all .15s",background:"white",fontFamily:"'DM Sans', sans-serif",
};

const nextBtnStyle = {
  padding:"14px 36px",background:"#1a1a1a",color:"white",border:"none",borderRadius:8,
  fontSize:15,fontWeight:600,cursor:"pointer",transition:"all .2s",letterSpacing:".2px",
};

const backBtnStyle = {
  padding:"14px 24px",background:"transparent",color:"#999",border:"1.5px solid #E8E6E1",borderRadius:8,
  fontSize:14,fontWeight:500,cursor:"pointer",transition:"all .2s",
};
