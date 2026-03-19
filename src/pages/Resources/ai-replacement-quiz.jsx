import { useState, useEffect, useRef } from "react";

const Q = [
  { id:"role", category:"Current Role", question:"What best describes your current job function?", type:"single", options:[
    {id:"r_marketing",label:"Marketing / Advertising",icon:"📣"},{id:"r_sales",label:"Sales / Business Development",icon:"💼"},{id:"r_design",label:"Design / Creative",icon:"🎨"},{id:"r_engineering",label:"Software Engineering / Dev",icon:"💻"},{id:"r_data",label:"Data / Analytics",icon:"📊"},{id:"r_writing",label:"Writing / Content / Journalism",icon:"✍️"},{id:"r_finance",label:"Finance / Accounting",icon:"💰"},{id:"r_hr",label:"HR / People Operations",icon:"👥"},{id:"r_ops",label:"Operations / Project Management",icon:"⚙️"},{id:"r_legal",label:"Legal / Compliance",icon:"⚖️"},{id:"r_support",label:"Customer Support / Service",icon:"🎧"},{id:"r_education",label:"Education / Training",icon:"📚"},{id:"r_healthcare",label:"Healthcare / Medical",icon:"🏥"},{id:"r_trades",label:"Trades / Physical Labor",icon:"🔧"},{id:"r_exec",label:"Executive / Leadership",icon:"👔"}]},
  { id:"tasks", category:"Daily Tasks", question:"Which tasks fill most of your workday?", type:"multi", max:4, options:[
    {id:"t_write",label:"Writing emails, reports, or content",icon:"📝"},{id:"t_data",label:"Analyzing data & making spreadsheets",icon:"📈"},{id:"t_code",label:"Writing or reviewing code",icon:"🖥️"},{id:"t_design",label:"Creating visual designs or layouts",icon:"🎨"},{id:"t_meet",label:"Meetings, calls & presentations",icon:"🗣️"},{id:"t_research",label:"Research & information gathering",icon:"🔍"},{id:"t_plan",label:"Planning, scheduling & coordination",icon:"📋"},{id:"t_customer",label:"Talking to customers or clients",icon:"🤝"},{id:"t_physical",label:"Physical tasks or hands-on work",icon:"🔨"},{id:"t_review",label:"Reviewing, editing & QA",icon:"✅"},{id:"t_teach",label:"Training, mentoring & coaching",icon:"🎓"},{id:"t_decide",label:"Making high-stakes strategic decisions",icon:"🧭"}]},
  { id:"complexity", category:"Work Complexity", question:"How would you describe the complexity of your decisions?", type:"single", options:[
    {id:"c_routine",label:"Mostly routine — clear rules and procedures",icon:"🔄"},{id:"c_guided",label:"Guided — some judgment within established frameworks",icon:"📐"},{id:"c_moderate",label:"Moderate — requires context and experience",icon:"🧩"},{id:"c_complex",label:"Complex — ambiguous situations, competing priorities",icon:"🌊"},{id:"c_novel",label:"Novel — uncharted territory, creating new approaches",icon:"🚀"}]},
  { id:"human", category:"Human Element", question:"How important is human connection in your role?", type:"single", options:[
    {id:"h_minimal",label:"Minimal — I mostly work independently with systems",icon:"🖥️"},{id:"h_some",label:"Some — I collaborate but could work async",icon:"📧"},{id:"h_moderate",label:"Moderate — regular teamwork and coordination",icon:"👥"},{id:"h_high",label:"High — I persuade, negotiate, or manage people",icon:"🤝"},{id:"h_critical",label:"Critical — trust, empathy, and physical presence are essential",icon:"❤️"}]},
  { id:"creative", category:"Creative Demand", question:"How much original creative thinking does your job require?", type:"single", options:[
    {id:"cr_none",label:"Very little — I follow established templates and processes",icon:"📋"},{id:"cr_some",label:"Some — I adapt existing approaches to new situations",icon:"🔧"},{id:"cr_moderate",label:"Moderate — I regularly develop new ideas within constraints",icon:"💡"},{id:"cr_high",label:"High — original creative output is central to my work",icon:"🎭"},{id:"cr_extreme",label:"Extreme — I create entirely new concepts and visions",icon:"✨"}]},
  { id:"tech_use", category:"Current AI Usage", question:"How are you currently using AI tools at work?", type:"single", options:[
    {id:"ai_none",label:"Not at all — I haven't used AI tools",icon:"🚫"},{id:"ai_curious",label:"Experimenting — trying tools casually",icon:"🧪"},{id:"ai_regular",label:"Regularly — AI assists parts of my workflow",icon:"🤖"},{id:"ai_heavy",label:"Heavily — AI is integrated into my daily process",icon:"⚡"},{id:"ai_building",label:"Building — I create AI-powered tools and systems",icon:"🏗️"}]},
  { id:"adapt", category:"Adaptability", question:"How do you typically respond to new technology?", type:"single", options:[
    {id:"a_resist",label:"I prefer proven methods and adopt slowly",icon:"🐢"},{id:"a_cautious",label:"I'm cautious but eventually come around",icon:"🤔"},{id:"a_open",label:"I'm open and learn when it's relevant to me",icon:"📖"},{id:"a_eager",label:"I actively seek out new tools and techniques",icon:"🏃"},{id:"a_pioneer",label:"I'm usually the first to adopt and teach others",icon:"🚀"}]},
  { id:"skills_now", category:"Core Competencies", question:"Which skills are strongest in your current toolkit?", type:"multi", max:3, options:[
    {id:"s_technical",label:"Technical / programming skills",icon:"⚙️"},{id:"s_analytical",label:"Analytical / quantitative reasoning",icon:"📊"},{id:"s_communication",label:"Communication / storytelling",icon:"💬"},{id:"s_leadership",label:"Leadership / people management",icon:"👑"},{id:"s_creative_sk",label:"Creative / artistic ability",icon:"🎨"},{id:"s_empathy",label:"Empathy / emotional intelligence",icon:"❤️"},{id:"s_strategy",label:"Strategic thinking / vision",icon:"🧭"},{id:"s_specialized",label:"Deep domain expertise",icon:"🎯"},{id:"s_physical",label:"Physical / manual dexterity",icon:"🤲"},{id:"s_negotiate",label:"Negotiation / persuasion",icon:"🤝"}]},
  { id:"education", category:"Learning Appetite", question:"How much time do you invest in learning new skills?", type:"single", options:[
    {id:"e_none",label:"Almost none — too busy with current work",icon:"⏰"},{id:"e_minimal",label:"A few hours per month when I can",icon:"📅"},{id:"e_moderate",label:"Regularly — a few hours per week",icon:"📚"},{id:"e_heavy",label:"Heavily — I'm always taking courses or building",icon:"🎓"},{id:"e_obsessed",label:"Obsessed — continuous learning is my lifestyle",icon:"🔥"}]},
];

const ROLES = [
  // HIGH RISK (70-95%) — Routine, data-heavy, template-based
  {t:"Data Entry Clerk",risk:95,years:1,d:"Highly repetitive data processing is already being automated by AI at scale.",cat:"Administrative",tags:["r_ops","r_support","t_data","c_routine","h_minimal","cr_none"],upskills:["Data analysis & visualization","SQL & database management","Process automation (Zapier, Make)","Business intelligence tools"]},
  {t:"Basic Bookkeeper",risk:92,years:2,d:"Transaction categorization, reconciliation, and basic reporting are rapidly being automated.",cat:"Finance",tags:["r_finance","t_data","c_routine","c_guided","h_minimal","cr_none"],upskills:["Advanced financial analysis","Strategic financial planning","AI-powered accounting tools (QuickBooks AI)","Advisory & consulting skills"]},
  {t:"Telemarketer",risk:93,years:1,d:"AI voice agents and chatbots are already handling outbound calls and lead qualification.",cat:"Sales",tags:["r_sales","r_support","t_customer","c_routine","h_some","cr_none"],upskills:["Consultative selling","Relationship-based sales","Account management","Customer success strategy"]},
  {t:"Basic Copywriter (Template)",risk:88,years:2,d:"AI can generate product descriptions, ad copy variants, and basic blog posts at scale.",cat:"Content",tags:["r_writing","t_write","c_routine","c_guided","h_minimal","cr_some","ai_none","ai_curious"],upskills:["Brand voice development","Strategic content planning","AI prompt engineering","Conversion copywriting & psychology"]},
  {t:"Email Template Builder",risk:90,years:1,d:"Drag-and-drop tools and AI can now design, write, and optimize email templates automatically.",cat:"Marketing",tags:["r_marketing","t_write","t_design","c_routine","h_minimal","cr_none","cr_some"],upskills:["Email strategy & lifecycle design","Marketing automation architecture","Customer journey mapping","A/B testing & optimization"]},
  {t:"Social Media Scheduler",risk:85,years:2,d:"AI tools can now generate, schedule, and optimize social posts with minimal human input.",cat:"Marketing",tags:["r_marketing","t_write","t_plan","c_routine","c_guided","h_minimal","cr_some"],upskills:["Community strategy & management","Social listening & insights","Influencer relationship building","Brand voice & creative direction"]},
  {t:"Junior Data Analyst",risk:82,years:2,d:"Basic reporting, dashboard creation, and data querying are increasingly handled by AI assistants.",cat:"Analytics",tags:["r_data","t_data","t_research","c_routine","c_guided","h_minimal","cr_none","s_analytical"],upskills:["Advanced statistics & modeling","Machine learning fundamentals","Data storytelling & stakeholder communication","Causal inference & experiment design"]},
  {t:"Basic Graphic Production",risk:84,years:2,d:"AI image generators and template tools can now produce social graphics, banners, and basic layouts.",cat:"Design",tags:["r_design","t_design","c_routine","c_guided","h_minimal","cr_some"],upskills:["Brand system design","UX/UI design thinking","Motion design & video","Art direction & creative strategy"]},
  {t:"Transcriptionist",risk:96,years:1,d:"AI speech-to-text is now more accurate than most human transcriptionists.",cat:"Administrative",tags:["r_writing","r_ops","t_write","c_routine","h_minimal","cr_none"],upskills:["Content editing & fact-checking","Audio/video production","Accessibility consulting","Translation & localization"]},
  {t:"Customer Support (Tier 1)",risk:87,years:2,d:"AI chatbots handle the majority of routine support queries with increasing accuracy.",cat:"Support",tags:["r_support","t_customer","c_routine","c_guided","h_some","cr_none"],upskills:["Complex problem resolution","Customer experience design","Technical support specialization","Escalation management & empathy training"]},
  {t:"Paralegal (Research)",risk:80,years:3,d:"AI legal research tools can review documents and find precedents dramatically faster than humans.",cat:"Legal",tags:["r_legal","t_research","t_data","t_review","c_guided","c_moderate","h_some","cr_none"],upskills:["Legal strategy & advisory","Client relationship management","Regulatory compliance specialization","Legal technology management"]},
  {t:"Tax Preparer (Basic)",risk:88,years:2,d:"AI tax software increasingly handles standard returns with greater accuracy and speed.",cat:"Finance",tags:["r_finance","t_data","t_review","c_routine","c_guided","h_some","cr_none"],upskills:["Tax strategy & planning","Business advisory services","Complex tax situations","Client relationship management"]},
  {t:"Proofreader / Copy Editor (Basic)",risk:83,years:2,d:"AI grammar and style tools catch errors and suggest improvements at near-human quality.",cat:"Content",tags:["r_writing","t_review","t_write","c_routine","c_guided","h_minimal","cr_none","cr_some"],upskills:["Developmental editing","Brand voice governance","Content strategy","AI-assisted editorial workflows"]},
  {t:"Report Generator / Analyst",risk:86,years:2,d:"AI can pull data, create visualizations, write summaries, and generate reports automatically.",cat:"Analytics",tags:["r_data","r_ops","t_data","t_write","c_routine","c_guided","h_minimal","cr_none","s_analytical"],upskills:["Insight storytelling & executive communication","Predictive analytics","Decision science","Stakeholder advisory"]},

  // MODERATE-HIGH RISK (50-69%)
  {t:"Digital Marketing Specialist",risk:65,years:3,d:"AI handles more campaign execution, but channel strategy and creative judgment still need humans.",cat:"Marketing",tags:["r_marketing","t_data","t_write","t_plan","c_guided","c_moderate","h_some","cr_some","ai_regular"],upskills:["Full-funnel strategy","AI-augmented campaign management","Marketing mix modeling","Cross-channel attribution"]},
  {t:"PPC Campaign Manager",risk:62,years:3,d:"Automated bidding and AI-generated ads reduce manual work, but strategy and budget decisions remain.",cat:"Marketing",tags:["r_marketing","t_data","t_plan","c_moderate","h_some","cr_some","s_analytical","ai_regular"],upskills:["Marketing strategy & budget allocation","Creative strategy for ads","Customer acquisition modeling","AI tool orchestration"]},
  {t:"SEO Specialist",risk:58,years:4,d:"AI can generate optimized content and audits, but search strategy and technical SEO need human insight.",cat:"Marketing",tags:["r_marketing","r_data","t_data","t_research","t_write","c_moderate","h_some","cr_some","s_technical"],upskills:["Content strategy & topical authority","Technical SEO architecture","AI search optimization (SGE/AIO)","Digital PR & link strategy"]},
  {t:"Junior Software Developer",risk:60,years:3,d:"AI code generation handles boilerplate and simple features, but architecture and debugging need humans.",cat:"Engineering",tags:["r_engineering","t_code","c_guided","c_moderate","h_some","cr_some","s_technical","ai_regular"],upskills:["System design & architecture","AI/ML engineering","Security & performance optimization","Technical leadership"]},
  {t:"Financial Analyst",risk:55,years:4,d:"AI excels at modeling and pattern detection but struggles with qualitative judgment and novel situations.",cat:"Finance",tags:["r_finance","t_data","t_research","t_write","c_moderate","h_some","cr_some","s_analytical"],upskills:["Strategic financial advisory","M&A and due diligence","AI-augmented modeling","Stakeholder communication"]},
  {t:"Content Writer (Mid-level)",risk:58,years:3,d:"AI generates decent drafts, but nuanced brand voice, original reporting, and strategy need humans.",cat:"Content",tags:["r_writing","t_write","t_research","c_moderate","h_some","cr_moderate","s_communication"],upskills:["Original journalism & reporting","Thought leadership development","Content strategy & distribution","Video & multimedia storytelling"]},
  {t:"HR Coordinator",risk:60,years:3,d:"Routine HR admin, scheduling, and policy Q&A are being automated, but people issues need humans.",cat:"HR",tags:["r_hr","t_plan","t_customer","t_write","c_guided","c_moderate","h_moderate","cr_none"],upskills:["Employee experience design","DEI strategy","People analytics","Organizational development"]},
  {t:"Real Estate Agent (Transactional)",risk:55,years:5,d:"AI handles listing optimization and market analysis, but complex negotiations and trust require humans.",cat:"Sales",tags:["r_sales","t_customer","t_research","t_meet","c_moderate","h_high","cr_some","s_negotiate"],upskills:["Luxury/commercial specialization","Investment advisory","Community expertise & relationships","Negotiation mastery"]},
  {t:"Graphic Designer (Mid-level)",risk:52,years:4,d:"AI design tools accelerate production, but brand-aware creative decisions and UX thinking need humans.",cat:"Design",tags:["r_design","t_design","c_moderate","h_some","h_moderate","cr_moderate","cr_high","s_creative_sk"],upskills:["Design systems & brand architecture","UX research & strategy","Motion & 3D design","Creative direction"]},
  {t:"Recruiter (Volume)",risk:62,years:3,d:"AI screens resumes, writes outreach, and schedules interviews — but candidate assessment needs humans.",cat:"HR",tags:["r_hr","t_customer","t_research","t_write","c_guided","c_moderate","h_moderate","cr_some","s_communication"],upskills:["Executive search & headhunting","Employer branding strategy","People analytics","Talent strategy consulting"]},
  {t:"QA Tester (Manual)",risk:68,years:3,d:"Automated testing and AI-generated test cases are replacing manual QA for most standard scenarios.",cat:"Engineering",tags:["r_engineering","t_review","t_code","c_guided","c_moderate","h_some","cr_none","s_technical"],upskills:["Test automation engineering","Performance & security testing","DevOps & CI/CD","AI testing & validation"]},
  {t:"Translator (Standard)",risk:72,years:2,d:"Neural machine translation handles most standard content with near-human quality.",cat:"Content",tags:["r_writing","t_write","t_review","c_guided","c_moderate","h_minimal","cr_some","s_specialized"],upskills:["Literary & creative translation","Localization strategy","Cultural consulting","Transcreation & brand adaptation"]},
  {t:"Insurance Underwriter",risk:65,years:3,d:"AI risk models process standard applications faster, but complex cases still need human judgment.",cat:"Finance",tags:["r_finance","t_data","t_review","t_decide","c_moderate","h_some","cr_some","s_analytical"],upskills:["Specialty risk assessment","Client relationship advisory","Insurtech & AI tools","Regulatory strategy"]},

  // MODERATE RISK (30-49%)
  {t:"Product Marketing Manager",risk:35,years:6,d:"Strategy, positioning, and cross-functional influence are hard to automate — but research and content creation are shifting.",cat:"Marketing",tags:["r_marketing","r_sales","t_write","t_research","t_meet","t_decide","c_complex","h_high","cr_moderate","s_strategy","s_communication"],upskills:["AI-augmented competitive intelligence","Advanced positioning frameworks","Sales enablement strategy","Market sensing & trend forecasting"]},
  {t:"UX Designer",risk:38,years:6,d:"AI helps with wireframes and variants, but deep user empathy, research synthesis, and design vision are human.",cat:"Design",tags:["r_design","t_design","t_research","t_customer","c_complex","h_moderate","h_high","cr_high","s_creative_sk","s_empathy"],upskills:["Service design & systems thinking","AI-augmented design tools","Research operations & strategy","Design leadership"]},
  {t:"Senior Software Engineer",risk:32,years:7,d:"AI assists coding but architecture, system design, and complex debugging need deep human expertise.",cat:"Engineering",tags:["r_engineering","t_code","t_review","t_decide","c_complex","c_novel","h_moderate","cr_moderate","s_technical"],upskills:["AI/ML systems design","Platform & infrastructure architecture","Technical leadership & mentoring","AI safety & responsible development"]},
  {t:"Project Manager",risk:42,years:5,d:"AI automates scheduling and status tracking, but stakeholder management and adaptive planning need humans.",cat:"Operations",tags:["r_ops","t_plan","t_meet","t_customer","c_moderate","c_complex","h_high","cr_some","s_leadership","s_communication"],upskills:["Program strategy & portfolio management","Change management","AI-augmented project tools","Stakeholder influence & negotiation"]},
  {t:"Marketing Manager",risk:38,years:6,d:"Strategy, team leadership, and cross-functional coordination are hard to automate even as execution shifts to AI.",cat:"Marketing",tags:["r_marketing","t_plan","t_meet","t_decide","t_write","c_complex","h_high","cr_moderate","s_strategy","s_leadership"],upskills:["AI-first marketing operations","Revenue attribution modeling","Executive communication","Team development & coaching"]},
  {t:"Nurse (RN)",risk:15,years:10,d:"Physical care, patient assessment, and compassionate presence are extremely difficult to automate.",cat:"Healthcare",tags:["r_healthcare","t_customer","t_physical","t_decide","c_complex","h_critical","cr_some","s_empathy","s_physical","s_specialized"],upskills:["Advanced practice specialization","Telehealth & AI diagnostics literacy","Patient experience design","Healthcare technology integration"]},
  {t:"Teacher (K-12)",risk:22,years:10,d:"AI personalizes learning, but classroom management, mentorship, and emotional development need humans.",cat:"Education",tags:["r_education","t_teach","t_customer","t_plan","c_complex","h_critical","cr_moderate","s_empathy","s_communication"],upskills:["AI-augmented instruction design","Social-emotional learning","EdTech integration","Personalized learning architecture"]},
  {t:"Sales Account Executive",risk:35,years:6,d:"AI handles prospecting and research, but complex B2B negotiations and relationships are deeply human.",cat:"Sales",tags:["r_sales","t_customer","t_meet","t_research","t_decide","c_complex","h_high","cr_some","s_negotiate","s_communication"],upskills:["Strategic account management","Solution selling methodology","AI-powered sales intelligence","Executive relationship building"]},
  {t:"Creative Director",risk:30,years:7,d:"AI generates options faster, but creative vision, brand judgment, and team leadership remain human strengths.",cat:"Creative",tags:["r_design","r_marketing","t_design","t_meet","t_decide","c_complex","c_novel","h_high","cr_extreme","s_creative_sk","s_leadership"],upskills:["AI-augmented creative workflows","Cross-platform brand architecture","Innovation leadership","Cultural strategy & trend forecasting"]},
  {t:"Data Scientist",risk:40,years:5,d:"AI automates standard ML pipelines, but problem framing, feature engineering, and business context need humans.",cat:"Analytics",tags:["r_data","r_engineering","t_code","t_data","t_research","c_complex","h_moderate","cr_moderate","s_technical","s_analytical"],upskills:["Causal inference & experimentation","AI/ML product strategy","Domain expertise deepening","Research communication & influence"]},
  {t:"Accountant (CPA)",risk:42,years:5,d:"AI handles routine compliance, but advisory, complex tax strategy, and audit judgment remain human.",cat:"Finance",tags:["r_finance","t_data","t_review","t_customer","c_moderate","c_complex","h_moderate","cr_some","s_analytical","s_specialized"],upskills:["Strategic advisory & CFO services","AI-augmented audit","ESG & sustainability reporting","Forensic accounting"]},
  {t:"Electrician",risk:8,years:15,d:"Physical, site-specific work with safety judgment is extremely difficult for current AI/robotics to replace.",cat:"Trades",tags:["r_trades","t_physical","t_decide","c_moderate","c_complex","h_moderate","cr_some","s_physical","s_specialized"],upskills:["Smart home & IoT systems","Solar & EV charging installation","Energy management systems","Contractor business management"]},
  {t:"Plumber",risk:7,years:15,d:"Complex physical work in unpredictable environments remains firmly in human territory.",cat:"Trades",tags:["r_trades","t_physical","t_decide","t_customer","c_moderate","c_complex","h_moderate","cr_some","s_physical","s_specialized"],upskills:["Green plumbing & water systems","Smart building technology","Business scaling & franchising","Estimating & project management software"]},

  // LOW RISK (10-29%)
  {t:"CMO / VP Marketing",risk:18,years:10,d:"Executive judgment, organizational leadership, and board-level strategy are deeply human functions.",cat:"Executive",tags:["r_exec","r_marketing","t_decide","t_meet","t_plan","c_novel","h_critical","cr_high","s_strategy","s_leadership"],upskills:["AI-first marketing transformation","Board communication & governance","Innovation portfolio management","Organizational design for AI era"]},
  {t:"Psychologist / Therapist",risk:12,years:12,d:"Deep empathy, therapeutic relationship, and nuanced human understanding are irreplaceable by AI.",cat:"Healthcare",tags:["r_healthcare","r_education","t_customer","t_teach","c_novel","h_critical","cr_high","s_empathy","s_specialized"],upskills:["AI-assisted diagnostics","Telehealth platform mastery","Digital mental health tools","Trauma-informed AI ethics"]},
  {t:"Surgeon",risk:10,years:15,d:"Complex physical procedures requiring real-time judgment and dexterity remain firmly human.",cat:"Healthcare",tags:["r_healthcare","t_physical","t_decide","c_novel","h_critical","cr_moderate","s_physical","s_specialized"],upskills:["Robotic-assisted surgery","AI diagnostic integration","Minimally invasive techniques","Surgical leadership & innovation"]},
  {t:"CEO / Founder",risk:8,years:15,d:"Vision-setting, culture building, stakeholder management, and existential decision-making are uniquely human.",cat:"Executive",tags:["r_exec","t_decide","t_meet","c_novel","h_critical","cr_extreme","s_strategy","s_leadership","s_negotiate"],upskills:["AI governance & ethics","Digital transformation leadership","Scenario planning & resilience","Human-AI collaboration frameworks"]},
  {t:"Emergency First Responder",risk:5,years:20,d:"Split-second physical decisions in chaotic, unpredictable environments are beyond current AI capabilities.",cat:"Public Safety",tags:["r_trades","r_healthcare","t_physical","t_decide","t_customer","c_novel","h_critical","cr_some","s_physical","s_empathy"],upskills:["Advanced emergency technology","Drone & robotics operation","Crisis leadership","Community resilience planning"]},
  {t:"Social Worker",risk:14,years:12,d:"Complex human situations requiring empathy, advocacy, and crisis intervention resist automation.",cat:"Healthcare",tags:["r_healthcare","r_hr","t_customer","t_decide","c_complex","c_novel","h_critical","cr_some","s_empathy","s_communication"],upskills:["Trauma-informed care","Digital service delivery","Policy advocacy","Community development strategy"]},
  {t:"Trial Lawyer",risk:20,years:8,d:"Courtroom persuasion, jury reading, and complex legal strategy require deep human judgment.",cat:"Legal",tags:["r_legal","t_meet","t_research","t_write","t_decide","c_complex","c_novel","h_high","cr_moderate","s_negotiate","s_communication"],upskills:["Legal AI tools & e-discovery","Cross-border litigation","AI ethics & regulation","Negotiation & mediation mastery"]},
  {t:"Executive Coach",risk:15,years:10,d:"Deep interpersonal insight, trust building, and leadership development require human connection.",cat:"Consulting",tags:["r_education","r_hr","t_customer","t_teach","t_meet","c_complex","c_novel","h_critical","cr_moderate","s_empathy","s_leadership"],upskills:["AI-augmented assessment tools","Organizational psychology","Digital coaching platforms","Leadership in AI transformation"]},
  {t:"Architect",risk:25,years:8,d:"AI generates design options, but spatial judgment, client vision, and regulatory navigation need humans.",cat:"Design",tags:["r_design","t_design","t_meet","t_decide","c_complex","h_high","cr_extreme","s_creative_sk","s_specialized"],upskills:["Parametric & AI-assisted design","Sustainable design systems","BIM & digital twin technology","Urban planning & smart cities"]},
];

function calcRisk(answers) {
  const sel = [];
  Object.values(answers).forEach(v => { if (Array.isArray(v)) sel.push(...v); else if (v) sel.push(v); });

  let scored = ROLES.map(r => {
    let match = 0;
    r.tags.forEach(tag => { if (sel.includes(tag)) match++; });
    return { ...r, match, matchPct: Math.round((match / r.tags.length) * 100) };
  });
  scored.sort((a, b) => b.match - a.match || b.matchPct - a.matchPct);

  // Adjust risk based on adaptability and AI usage
  const adaptBonus = { a_pioneer: -12, a_eager: -8, a_open: -4, a_cautious: 0, a_resist: 5 };
  const aiBonus = { ai_building: -10, ai_heavy: -6, ai_regular: -3, ai_curious: 0, ai_none: 4 };
  const learnBonus = { e_obsessed: -8, e_heavy: -5, e_moderate: -2, e_minimal: 0, e_none: 3 };
  const complexBonus = { c_novel: -10, c_complex: -6, c_moderate: -2, c_guided: 3, c_routine: 8 };
  const humanBonus = { h_critical: -10, h_high: -6, h_moderate: -2, h_some: 2, h_minimal: 6 };
  const creativeBonus = { cr_extreme: -8, cr_high: -5, cr_moderate: -2, cr_some: 2, cr_none: 5 };

  let mod = 0;
  sel.forEach(s => {
    if (adaptBonus[s] !== undefined) mod += adaptBonus[s];
    if (aiBonus[s] !== undefined) mod += aiBonus[s];
    if (learnBonus[s] !== undefined) mod += learnBonus[s];
    if (complexBonus[s] !== undefined) mod += complexBonus[s];
    if (humanBonus[s] !== undefined) mod += humanBonus[s];
    if (creativeBonus[s] !== undefined) mod += creativeBonus[s];
  });

  scored = scored.map(r => {
    const adjRisk = Math.max(2, Math.min(98, r.risk + mod));
    const adjYears = Math.max(1, r.years + Math.round(mod * -0.1));
    return { ...r, adjRisk, adjYears };
  });

  return scored;
}

function riskColor(r) {
  if (r >= 75) return "#EF4444";
  if (r >= 50) return "#F97316";
  if (r >= 30) return "#F59E0B";
  if (r >= 15) return "#10B981";
  return "#06B6D4";
}
function riskLabel(r) {
  if (r >= 75) return "HIGH RISK";
  if (r >= 50) return "MODERATE-HIGH";
  if (r >= 30) return "MODERATE";
  if (r >= 15) return "LOW";
  return "VERY LOW";
}

function Progress({ cur, total }) {
  const p = (cur / total) * 100;
  return (
    <div style={{ width: "100%", marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#94A3B8", letterSpacing: 1 }}>
        <span>QUESTION {cur + 1} / {total}</span><span>{Math.round(p)}%</span>
      </div>
      <div style={{ width: "100%", height: 3, background: "#1E293B", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${p}%`, height: "100%", background: "linear-gradient(90deg, #F97316, #EF4444)", borderRadius: 2, transition: "width 0.4s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
}

function QCard({ q, sel, onSel, onNext, onBack, idx, total }) {
  const multi = q.type === "multi";
  const ok = multi ? sel.length > 0 : sel !== null;
  const full = multi && q.max && sel.length >= q.max;
  const tog = id => {
    if (multi) { sel.includes(id) ? onSel(sel.filter(s => s !== id)) : !full && onSel([...sel, id]); }
    else onSel(id);
  };
  return (
    <div key={q.id} style={{ animation: "fadeIn .35s ease-out" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#F97316", marginBottom: 5, textTransform: "uppercase" }}>{q.category}</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#F1F5F9", margin: "0 0 5px", lineHeight: 1.3 }}>{q.question}</h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#64748B", margin: "0 0 16px" }}>
        {multi ? `Select up to ${q.max}` : "Choose one"}{multi && full && <span style={{ color: "#F59E0B", marginLeft: 6 }}>— max reached</span>}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: q.options.length > 6 ? "1fr 1fr" : "1fr", gap: 6 }}>
        {q.options.map(o => {
          const on = multi ? sel.includes(o.id) : sel === o.id;
          const dis = multi && full && !on;
          return (
            <button key={o.id} onClick={() => !dis && tog(o.id)} style={{
              display: "flex", alignItems: "center", gap: 9, padding: "10px 12px",
              background: on ? "rgba(249,115,22,0.12)" : dis ? "rgba(15,23,42,0.3)" : "rgba(30,41,59,0.5)",
              border: on ? "1.5px solid #F97316" : "1.5px solid rgba(100,116,139,0.1)",
              borderRadius: 9, cursor: dis ? "default" : "pointer", transition: "all .15s", textAlign: "left",
              fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: on ? "#FED7AA" : dis ? "#475569" : "#CBD5E1", opacity: dis ? 0.45 : 1,
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{o.icon}</span>
              <span style={{ fontWeight: on ? 600 : 400, lineHeight: 1.3 }}>{o.label}</span>
              {on && <span style={{ marginLeft: "auto", color: "#F97316", fontSize: 14, flexShrink: 0 }}>✓</span>}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        {idx > 0 && <button onClick={onBack} style={{ padding: "10px 18px", background: "transparent", border: "1.5px solid rgba(100,116,139,0.2)", borderRadius: 9, color: "#94A3B8", fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: "pointer" }}>←</button>}
        <button onClick={onNext} disabled={!ok} style={{
          flex: 1, padding: "10px 18px", background: ok ? "linear-gradient(135deg,#F97316,#EF4444)" : "rgba(30,41,59,0.5)",
          border: "none", borderRadius: 9, color: ok ? "#FFF" : "#475569",
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: ok ? "pointer" : "not-allowed",
        }}>{idx === total - 1 ? "See My Risk Assessment →" : "Continue →"}</button>
      </div>
    </div>
  );
}

function RCard({ r, rank, top, exp, onTog }) {
  const rc = riskColor(r.adjRisk);
  return (
    <div onClick={rank > 1 ? onTog : undefined} style={{
      background: top ? `${rc}08` : "rgba(15,23,42,0.4)",
      border: top ? `1.5px solid ${rc}30` : "1.5px solid rgba(100,116,139,0.06)",
      borderRadius: 12, padding: top ? "20px 16px" : "12px 14px", marginBottom: 6,
      animation: `fadeIn .4s ease-out ${rank * .06}s both`, position: "relative", overflow: "hidden",
      cursor: rank > 1 ? "pointer" : "default", transition: "all .15s",
    }}>
      {top && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${rc},${rc}00)` }} />}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: (top || exp) ? 6 : 0 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: rc, background: `${rc}15`, padding: "2px 6px", borderRadius: 4, letterSpacing: 1, flexShrink: 0 }}>{r.adjRisk}%</span>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: top ? 20 : 14, fontWeight: 700, color: "#F1F5F9", margin: 0, flex: 1, lineHeight: 1.2 }}>{r.t}</h3>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748B", flexShrink: 0 }}>{r.adjYears}yr</span>
        {!top && <span style={{ fontSize: 10, color: "#475569", flexShrink: 0 }}>{exp ? "▲" : "▼"}</span>}
      </div>
      {(top || exp) && <>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#94A3B8", margin: "0 0 12px", lineHeight: 1.5 }}>{r.d}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <div style={{ width: 100, height: 4, background: "#1E293B", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${r.adjRisk}%`, height: "100%", background: rc, borderRadius: 2, transition: "width .7s cubic-bezier(.4,0,.2,1)" }} />
          </div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: rc, background: `${rc}12`, padding: "2px 6px", borderRadius: 4 }}>{riskLabel(r.adjRisk)}</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#475569", background: "rgba(100,116,139,0.08)", padding: "2px 6px", borderRadius: 4 }}>{r.cat}</span>
        </div>
        <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)", borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#10B981", letterSpacing: 1, marginBottom: 6 }}>🛡️ RECOMMENDED UPSKILLS</div>
          {r.upskills.map((u, i) => (
            <div key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#CBD5E1", padding: "3px 0", display: "flex", gap: 6, alignItems: "flex-start" }}>
              <span style={{ color: "#10B981", flexShrink: 0, fontSize: 10, marginTop: 2 }}>→</span>{u}
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}

function Results({ results, onRestart }) {
  const [exp, setExp] = useState(new Set());
  const [showAll, setShowAll] = useState(false);
  const top3 = results.slice(0, 3);
  const best = results[0];
  const n = showAll ? 12 : 6;
  const display = results.slice(0, n);

  const avgRisk = Math.round(top3.reduce((a, r) => a + r.adjRisk, 0) / top3.length);
  const avgYears = Math.round(top3.reduce((a, r) => a + r.adjYears, 0) / top3.length);
  const rc = riskColor(avgRisk);

  return (
    <div style={{ animation: "fadeIn .4s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, color: rc, marginBottom: 5 }}>ASSESSMENT COMPLETE</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#F1F5F9", margin: "0 0 10px" }}>Your AI Replacement Risk</h2>

        {/* Risk Gauge */}
        <div style={{ position: "relative", width: 180, height: 100, margin: "0 auto 8px" }}>
          <svg viewBox="0 0 180 100" style={{ width: "100%", height: "100%" }}>
            <path d="M 15 90 A 75 75 0 0 1 165 90" fill="none" stroke="#1E293B" strokeWidth="10" strokeLinecap="round" />
            <path d="M 15 90 A 75 75 0 0 1 165 90" fill="none" stroke={rc} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${avgRisk * 2.36} 236`} style={{ transition: "stroke-dasharray 1.5s cubic-bezier(.4,0,.2,1)" }} />
          </svg>
          <div style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 800, color: rc, lineHeight: 1 }}>{avgRisk}%</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#94A3B8", letterSpacing: 1, marginTop: 2 }}>{riskLabel(avgRisk)}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", margin: "12px 0 16px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#F1F5F9" }}>~{avgYears}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748B" }}>YEARS</div>
          </div>
          <div style={{ width: 1, background: "rgba(100,116,139,0.15)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#F1F5F9" }}>{ROLES.length}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748B" }}>ROLES ANALYZED</div>
          </div>
        </div>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#64748B", margin: "0 0 4px" }}>
          Closest role matches ranked by similarity to your profile
        </p>
      </div>

      {display.map((r, i) => <RCard key={r.t} r={r} rank={i + 1} top={i === 0} exp={exp.has(i)} onTog={() => setExp(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; })} />)}
      {!showAll && results.length > 6 && <button onClick={() => setShowAll(true)} style={{ width: "100%", padding: "8px", marginBottom: 6, background: "transparent", border: "1px dashed rgba(100,116,139,0.15)", borderRadius: 8, color: "#64748B", fontFamily: "'DM Sans', sans-serif", fontSize: 12, cursor: "pointer" }}>Show more matches ↓</button>}

      {/* Universal upskill advice */}
      <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: 10, padding: "14px 14px", marginTop: 10, marginBottom: 10 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#6366F1", letterSpacing: 1, marginBottom: 8 }}>🔮 UNIVERSAL AI-ERA SKILLS</div>
        {["AI prompt engineering & tool fluency","Critical thinking & information verification","Cross-functional collaboration & influence","Emotional intelligence & human connection","Continuous learning & adaptability mindset"].map((u, i) => (
          <div key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#CBD5E1", padding: "3px 0", display: "flex", gap: 6 }}>
            <span style={{ color: "#6366F1", flexShrink: 0, fontSize: 10, marginTop: 2 }}>→</span>{u}
          </div>
        ))}
      </div>

      <button onClick={onRestart} style={{ width: "100%", marginTop: 6, padding: "12px", background: "linear-gradient(135deg,#F97316,#EF4444)", border: "none", borderRadius: 10, color: "#FFF", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Retake Assessment</button>
    </div>
  );
}

export default function App() {
  const [scr, setScr] = useState("welcome");
  const [cur, setCur] = useState(0);
  const [ans, setAns] = useState({});
  const [res, setRes] = useState([]);
  const ref = useRef(null);

  useEffect(() => { const i = {}; Q.forEach(q => { i[q.id] = q.type === "multi" ? [] : null; }); setAns(i); }, []);
  useEffect(() => { ref.current?.scrollTo({ top: 0, behavior: "smooth" }); }, [cur, scr]);

  const next = () => { if (cur < Q.length - 1) setCur(cur + 1); else { setRes(calcRisk(ans)); setScr("results"); } };
  const back = () => { if (cur > 0) setCur(cur - 1); };
  const restart = () => { const i = {}; Q.forEach(q => { i[q.id] = q.type === "multi" ? [] : null; }); setAns(i); setCur(0); setScr("welcome"); };

  return (
    <div style={{ minHeight: "100vh", background: "#0B1120", display: "flex", alignItems: "center", justifyContent: "center", padding: 14, position: "relative" }}>
      <div style={{ position: "fixed", top: -200, right: -200, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -150, left: -150, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        button:hover { filter: brightness(1.06); }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(100,116,139,0.2); border-radius: 2px; }
      `}</style>
      <div ref={ref} style={{ width: "100%", maxWidth: 540, maxHeight: "94vh", overflowY: "auto", background: "rgba(15,23,42,0.6)", backdropFilter: "blur(40px)", border: "1px solid rgba(100,116,139,0.08)", borderRadius: 20, padding: "28px 24px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
        {scr === "welcome" && (
          <div style={{ textAlign: "center", animation: "fadeIn .5s ease-out" }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: "linear-gradient(135deg,#F97316,#EF4444)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 26 }}>🤖</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 800, color: "#F1F5F9", margin: "0 0 8px", lineHeight: 1.2 }}>Will AI Replace<br/>Your Job?</h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#94A3B8", margin: "0 auto 6px", lineHeight: 1.5, maxWidth: 380 }}>Answer 9 questions to get your personalized AI replacement risk score, timeline projection, and <strong style={{ color: "#10B981" }}>upskill recommendations</strong> to safeguard your career.</p>
            <div style={{ display: "flex", gap: 5, justifyContent: "center", margin: "14px 0 24px", flexWrap: "wrap" }}>
              {["Risk %","Timeline","Upskills","Role Match",`${ROLES.length} Jobs Analyzed`].map(t => <span key={t} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748B", background: "rgba(100,116,139,0.08)", padding: "3px 8px", borderRadius: 16 }}>{t}</span>)}
            </div>
            <button onClick={() => setScr("quiz")} style={{ padding: "13px 40px", background: "linear-gradient(135deg,#F97316,#EF4444)", border: "none", borderRadius: 12, color: "#FFF", fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 18px rgba(249,115,22,0.3)" }}>Start the Assessment →</button>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#475569", margin: "14px 0 0", letterSpacing: .5 }}>⏱ ~3 minutes · Personalized results</p>
          </div>
        )}
        {scr === "quiz" && ans[Q[cur]?.id] !== undefined && <>
          <Progress cur={cur} total={Q.length} />
          <QCard q={Q[cur]} sel={ans[Q[cur].id]} onSel={v => setAns({ ...ans, [Q[cur].id]: v })} onNext={next} onBack={back} idx={cur} total={Q.length} />
        </>}
        {scr === "results" && <Results results={res} onRestart={restart} />}
      </div>
    </div>
  );
}
