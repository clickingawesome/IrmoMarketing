import { useState, useEffect, useRef } from "react";

const Q = [
  { id:"skills", category:"Core Skills", question:"Which skills define your professional strengths?", type:"multi", max:4, options:[
    {id:"analytics",label:"Data Analytics & Reporting",icon:"📊"},{id:"creative",label:"Creative Direction & Design",icon:"🎨"},{id:"writing",label:"Copywriting & Content Creation",icon:"✍️"},{id:"technical",label:"Technical Implementation & Code",icon:"⚙️"},{id:"strategy",label:"Strategic Planning & Research",icon:"🧭"},{id:"social",label:"Social Media & Community",icon:"📱"},{id:"video",label:"Video Production & Editing",icon:"🎥"},{id:"ux",label:"UX/UI & User Research",icon:"🧩"},{id:"pm",label:"Project Management & Ops",icon:"📋"},{id:"sales_enable",label:"Sales Enablement & Pitching",icon:"🎤"}]},
  { id:"channels", category:"Channel Focus", question:"Which marketing channels energize you most?", type:"multi", max:4, options:[
    {id:"seo",label:"SEO & Organic Search",icon:"🔍"},{id:"paid",label:"Paid Ads (PPC, Display, Programmatic)",icon:"💰"},{id:"email",label:"Email & Marketing Automation",icon:"📧"},{id:"content",label:"Blog, Video & Podcasts",icon:"🎬"},{id:"social_ch",label:"Social Media Platforms",icon:"📣"},{id:"events",label:"Events, Webinars & Conferences",icon:"🤝"},{id:"pr",label:"PR & Communications",icon:"📰"},{id:"affiliate",label:"Affiliate & Partner Marketing",icon:"🔗"},{id:"web",label:"Website & Landing Pages",icon:"🌐"},{id:"cx",label:"Customer Experience & Retention",icon:"💎"}]},
  { id:"management", category:"Leadership Level", question:"How much management responsibility do you want?", type:"single", options:[
    {id:"ic",label:"Individual Contributor — I do the work myself",icon:"🎯"},{id:"lead",label:"Team Lead — guide a small team, still execute",icon:"👥"},{id:"manager",label:"Manager — oversee strategy and manage people",icon:"📋"},{id:"director",label:"Director — lead departments and set direction",icon:"🏛️"},{id:"vp",label:"VP / C-Suite — own the vision at executive level",icon:"👔"}]},
  { id:"interests", category:"Passion Zone", question:"What excites you most about marketing?", type:"multi", max:2, options:[
    {id:"growth",label:"Growing revenue and hitting targets",icon:"📈"},{id:"brand",label:"Building a memorable brand identity",icon:"✨"},{id:"product",label:"Shaping how a product goes to market",icon:"🚀"},{id:"audience",label:"Deeply understanding the audience",icon:"🧠"},{id:"innovation",label:"Testing new tech and platforms",icon:"🔬"},{id:"storytelling",label:"Crafting narratives that move people",icon:"📖"},{id:"systems",label:"Building scalable systems & processes",icon:"⚡"},{id:"relationships",label:"Building partnerships & networks",icon:"🤝"}]},
  { id:"industry", category:"Work Style", question:"What describes your ideal work environment?", type:"single", options:[
    {id:"startup",label:"Fast-paced startup — wear many hats",icon:"⚡"},{id:"agency",label:"Agency — variety of clients & projects",icon:"🔄"},{id:"enterprise",label:"Enterprise — deep specialization at scale",icon:"🏢"},{id:"freelance",label:"Freelance / Consultant — independence",icon:"🌊"},{id:"saas",label:"SaaS / Tech — product-led growth",icon:"💻"},{id:"ecomm",label:"E-commerce / DTC — fast iteration",icon:"🛒"}]},
  { id:"tools", category:"Tool Proficiency", question:"Which tools are in your daily toolkit?", type:"multi", max:5, options:[
    {id:"ga",label:"Google Analytics / GA4 / Looker",icon:"📉"},{id:"crm",label:"CRM (Salesforce, HubSpot)",icon:"🗄️"},{id:"design_tool",label:"Design (Figma, Canva, Adobe CC)",icon:"🖌️"},{id:"automation",label:"Automation (Pardot, Marketo, Klaviyo)",icon:"🤖"},{id:"cms",label:"CMS (WordPress, Webflow, Next.js)",icon:"🌐"},{id:"ads",label:"Ad Platforms (Google Ads, Meta, LinkedIn)",icon:"📺"},{id:"video_tool",label:"Video (Premiere, Final Cut, DaVinci)",icon:"🎞️"},{id:"bi",label:"BI Tools (Tableau, Power BI, Domo)",icon:"📊"},{id:"cdp",label:"CDP / Data (Segment, Amplitude)",icon:"🔮"},{id:"pm_tool",label:"PM Tools (Asana, Monday, Jira)",icon:"✅"}]},
  { id:"personality", category:"Work Personality", question:"Which statement resonates with you the most?", type:"single", options:[
    {id:"p_builder",label:"I love building things from scratch and seeing them grow",icon:"🏗️"},{id:"p_optimizer",label:"I get a rush from optimizing what already exists",icon:"🔧"},{id:"p_visionary",label:"I think big picture and inspire others to follow",icon:"🔭"},{id:"p_connector",label:"I thrive connecting people, ideas, and opportunities",icon:"🕸️"},{id:"p_artist",label:"I express ideas through visual and creative craft",icon:"🎭"},{id:"p_scientist",label:"I test hypotheses and let data guide every decision",icon:"🧪"}]},
  { id:"superpower", category:"Your Superpower", question:"Colleagues come to you when they need help with...", type:"multi", max:2, options:[
    {id:"sp_numbers",label:"Making sense of messy data",icon:"🔢"},{id:"sp_words",label:"Writing that actually converts",icon:"💬"},{id:"sp_visuals",label:"Making things look incredible",icon:"👁️"},{id:"sp_tech",label:"Fixing or building technical systems",icon:"🛠️"},{id:"sp_people",label:"Managing stakeholders & teams",icon:"🤝"},{id:"sp_ideas",label:"Coming up with creative campaign ideas",icon:"💡"},{id:"sp_process",label:"Organizing chaos into clear plans",icon:"🗺️"},{id:"sp_trends",label:"Spotting trends before anyone else",icon:"📡"}]},
  { id:"growth_goal", category:"Career Trajectory", question:"Where do you want to be in 3–5 years?", type:"single", options:[
    {id:"g_specialist",label:"The go-to expert in my specific craft",icon:"🏆"},{id:"g_leader",label:"Leading a high-performing marketing team",icon:"👑"},{id:"g_executive",label:"In the C-suite driving company strategy",icon:"🎯"},{id:"g_founder",label:"Running my own agency or business",icon:"🚀"},{id:"g_hybrid",label:"A versatile T-shaped marketer doing it all",icon:"🌟"}]},
];

const T = [
  // GROWTH & PERFORMANCE (8)
  {t:"Growth Marketing Manager",d:"You optimize funnels, run experiments, and scale what works. Data-driven and revenue-obsessed.",tags:["analytics","paid","growth","ga","ads","lead","manager","p_optimizer","sp_numbers","g_specialist","saas","startup"],s:"$85K–$140K",c:"#10B981",cat:"Growth & Performance"},
  {t:"Head of Growth",d:"You own the entire growth engine — acquisition to activation to revenue. You build teams and systems that compound.",tags:["analytics","growth","strategy","director","vp","ga","cdp","p_builder","sp_numbers","g_leader","g_executive","saas","startup"],s:"$150K–$250K",c:"#059669",cat:"Growth & Performance"},
  {t:"Performance Marketing Manager",d:"You manage ad budgets with surgical precision. A/B testing, ROAS optimization, and bid strategy are your domain.",tags:["analytics","paid","ads","ga","growth","ic","lead","p_optimizer","p_scientist","sp_numbers","ecomm"],s:"$75K–$130K",c:"#EF4444",cat:"Growth & Performance"},
  {t:"PPC Specialist",d:"You live in Google Ads, Meta, and LinkedIn Campaign Manager. Every click, every conversion — you track it all.",tags:["paid","ads","ga","ic","analytics","p_optimizer","p_scientist","sp_numbers","agency"],s:"$55K–$90K",c:"#F97316",cat:"Growth & Performance"},
  {t:"Demand Generation Manager",d:"You orchestrate multi-channel campaigns that fill the pipeline. MQLs, SQLs, and closed-won are your scoreboard.",tags:["paid","email","automation","crm","growth","manager","ga","lead","p_builder","sp_numbers","systems","saas","enterprise"],s:"$90K–$150K",c:"#0D9488",cat:"Growth & Performance"},
  {t:"CRO Specialist",d:"You squeeze more value from existing traffic through relentless testing on landing pages, forms, and CTAs.",tags:["analytics","ga","web","ux","p_optimizer","p_scientist","sp_numbers","sp_tech","ic","growth"],s:"$70K–$115K",c:"#14B8A6",cat:"Growth & Performance"},
  {t:"Acquisition Marketing Manager",d:"You focus on top-of-funnel, finding new customers through paid, organic, and partnerships at efficient CAC.",tags:["paid","seo","ads","ga","growth","manager","lead","analytics","p_optimizer","sp_numbers","ecomm","saas"],s:"$80K–$130K",c:"#22D3EE",cat:"Growth & Performance"},
  {t:"Revenue Marketing Manager",d:"You align marketing directly to revenue goals, working with sales to optimize the full funnel from lead to close.",tags:["analytics","crm","automation","growth","manager","ga","bi","sp_numbers","sp_people","systems","enterprise","saas"],s:"$95K–$150K",c:"#06B6D4",cat:"Growth & Performance"},

  // CONTENT & EDITORIAL (8)
  {t:"Content Marketing Manager",d:"You build audience trust through compelling narratives. Editorial calendars, writers, and content ROI are your domain.",tags:["writing","content","seo","brand","cms","lead","manager","storytelling","sp_words","p_builder"],s:"$75K–$125K",c:"#6366F1",cat:"Content & Editorial"},
  {t:"Content Strategist",d:"You define the what, why, and where of content, mapping it to the buyer journey so every piece serves a purpose.",tags:["writing","strategy","content","seo","audience","cms","ic","lead","p_visionary","sp_words","sp_ideas"],s:"$70K–$120K",c:"#818CF8",cat:"Content & Editorial"},
  {t:"Copywriter",d:"You craft words that persuade, convert, and delight. From headlines to email sequences, your copy drives action.",tags:["writing","ic","email","web","storytelling","sp_words","p_artist","agency","freelance"],s:"$55K–$95K",c:"#A78BFA",cat:"Content & Editorial"},
  {t:"Senior Copywriter",d:"You lead copy direction for campaigns, mentor junior writers, and shape brand voice across every touchpoint.",tags:["writing","lead","email","web","brand","storytelling","sp_words","p_artist","sp_ideas","agency","enterprise"],s:"$75K–$120K",c:"#8B5CF6",cat:"Content & Editorial"},
  {t:"SEO Manager",d:"You turn search engines into revenue engines. Technical audits, keyword strategy, and content optimization are your craft.",tags:["analytics","seo","writing","ga","cms","ic","lead","p_optimizer","p_scientist","sp_numbers","sp_tech"],s:"$70K–$120K",c:"#14B8A6",cat:"Content & Editorial"},
  {t:"SEO Specialist",d:"You dive deep into keyword research, on-page optimization, link building, and technical SEO to drive organic growth.",tags:["seo","analytics","ga","cms","ic","p_optimizer","p_scientist","sp_numbers","sp_tech","g_specialist"],s:"$50K–$85K",c:"#2DD4BF",cat:"Content & Editorial"},
  {t:"Editorial Director",d:"You set the editorial vision and voice for the brand. You lead writers and ensure quality at scale.",tags:["writing","content","brand","director","storytelling","sp_words","sp_people","p_visionary","g_leader","enterprise"],s:"$110K–$170K",c:"#7C3AED",cat:"Content & Editorial"},
  {t:"Podcast / Video Content Producer",d:"You produce engaging audio and video content. Scripting, shooting, editing — you build audience and authority.",tags:["video","content","ic","lead","video_tool","storytelling","sp_visuals","sp_ideas","p_artist","p_builder"],s:"$55K–$100K",c:"#C084FC",cat:"Content & Editorial"},

  // BRAND & CREATIVE (6)
  {t:"Brand Marketing Director",d:"You shape how the world perceives a company. You lead creative teams and build emotional connections at scale.",tags:["creative","brand","strategy","director","design_tool","enterprise","p_visionary","sp_visuals","sp_ideas","g_leader","storytelling"],s:"$130K–$200K",c:"#EC4899",cat:"Brand & Creative"},
  {t:"Brand Manager",d:"You own the brand experience across all channels — messaging, visual identity, and guidelines are your responsibility.",tags:["creative","brand","strategy","manager","lead","design_tool","sp_visuals","sp_ideas","p_visionary","storytelling"],s:"$80K–$130K",c:"#F472B6",cat:"Brand & Creative"},
  {t:"Creative Director",d:"You lead the visual and conceptual direction of all marketing output. You set the creative vision for everything.",tags:["creative","brand","design_tool","director","agency","p_artist","p_visionary","sp_visuals","sp_ideas","g_leader","video"],s:"$120K–$190K",c:"#E11D48",cat:"Brand & Creative"},
  {t:"Art Director",d:"You translate brand strategy into visual direction. You guide designers, approve creative work, and maintain excellence.",tags:["creative","design_tool","brand","lead","manager","p_artist","sp_visuals","agency","enterprise"],s:"$85K–$140K",c:"#FB7185",cat:"Brand & Creative"},
  {t:"Graphic Designer",d:"You create the visual assets that bring campaigns to life — social graphics, brand collateral, and web design.",tags:["creative","design_tool","ic","brand","web","p_artist","sp_visuals","g_specialist"],s:"$50K–$85K",c:"#FDA4AF",cat:"Brand & Creative"},
  {t:"Motion Graphics / Video Designer",d:"You create dynamic visual content through animation, motion graphics, and video editing that captures attention.",tags:["video","video_tool","creative","design_tool","ic","p_artist","sp_visuals","content","storytelling","g_specialist"],s:"$60K–$100K",c:"#FF6B6B",cat:"Brand & Creative"},

  // DIGITAL & GENERALIST (5)
  {t:"Digital Marketing Manager",d:"You orchestrate campaigns across all digital channels — strategic yet hands-on with planning and execution.",tags:["paid","email","social_ch","seo","ga","ads","manager","lead","growth","sp_numbers","sp_ideas","startup"],s:"$70K–$115K",c:"#F59E0B",cat:"Digital & Generalist"},
  {t:"Digital Marketing Specialist",d:"You're a versatile executor who thrives managing campaigns across multiple digital channels simultaneously.",tags:["paid","email","social_ch","ic","ga","ads","startup","p_optimizer","sp_numbers","g_hybrid"],s:"$50K–$80K",c:"#FBBF24",cat:"Digital & Generalist"},
  {t:"Marketing Coordinator",d:"You keep marketing operations running smoothly — coordinating campaigns, managing timelines, and supporting the team.",tags:["pm","ic","email","social_ch","pm_tool","sp_process","p_connector","startup","agency"],s:"$40K–$60K",c:"#FCD34D",cat:"Digital & Generalist"},
  {t:"Marketing Manager",d:"You lead marketing strategy and execution across channels. You manage budgets, vendors, and cross-functional initiatives.",tags:["strategy","manager","paid","email","content","crm","sp_people","sp_process","p_builder","g_leader"],s:"$75K–$120K",c:"#D97706",cat:"Digital & Generalist"},
  {t:"Integrated Marketing Manager",d:"You unify messaging and campaigns across all channels into cohesive programs that amplify impact.",tags:["strategy","manager","paid","content","events","pr","sp_process","sp_ideas","p_connector","enterprise"],s:"$85K–$135K",c:"#B45309",cat:"Digital & Generalist"},

  // SOCIAL MEDIA (4)
  {t:"Social Media Manager",d:"You build communities and drive engagement. Content calendars, brand voice, and social metrics are your world.",tags:["social","social_ch","creative","writing","audience","lead","sp_ideas","sp_words","p_connector","storytelling"],s:"$55K–$90K",c:"#F43F5E",cat:"Social Media"},
  {t:"Social Media Strategist",d:"You develop overarching social strategy, identify platform opportunities, and align social efforts with business goals.",tags:["social","social_ch","strategy","lead","manager","audience","sp_ideas","sp_trends","p_visionary","brand"],s:"$65K–$110K",c:"#E11D48",cat:"Social Media"},
  {t:"Community Manager",d:"You nurture and grow brand communities — moderating discussions, sparking engagement, and turning fans into advocates.",tags:["social","social_ch","audience","relationships","ic","lead","sp_people","p_connector","cx"],s:"$50K–$80K",c:"#FB923C",cat:"Social Media"},
  {t:"Influencer Marketing Manager",d:"You identify, recruit, and manage creators and influencers to amplify brand reach and credibility.",tags:["social","social_ch","affiliate","relationships","lead","manager","sp_people","sp_trends","p_connector","ecomm"],s:"$65K–$110K",c:"#F97316",cat:"Social Media"},

  // MARTECH & AUTOMATION (7)
  {t:"Email Marketing Manager",d:"You nurture leads and retain customers through strategic email programs — segmentation, automation, and optimization.",tags:["email","automation","writing","crm","growth","lead","manager","sp_words","sp_numbers","p_optimizer","systems"],s:"$65K–$110K",c:"#7C3AED",cat:"MarTech & Automation"},
  {t:"Marketing Automation Specialist",d:"You build the engine behind personalized marketing — workflows, lead scoring, and lifecycle automation.",tags:["technical","email","automation","crm","ic","growth","systems","sp_tech","sp_process","p_builder","p_scientist"],s:"$65K–$110K",c:"#8B5CF6",cat:"MarTech & Automation"},
  {t:"Marketing Automation Manager",d:"You lead automation strategy — architecting complex multi-touch campaigns and optimizing the martech stack.",tags:["technical","email","automation","crm","manager","lead","systems","sp_tech","sp_process","p_builder","cdp","enterprise","saas"],s:"$85K–$140K",c:"#A855F7",cat:"MarTech & Automation"},
  {t:"MarTech Manager",d:"You own the marketing technology stack — evaluating, implementing, and integrating tools to maximize efficiency.",tags:["technical","automation","crm","cdp","manager","systems","innovation","sp_tech","sp_process","p_builder","bi","enterprise"],s:"$90K–$145K",c:"#9333EA",cat:"MarTech & Automation"},
  {t:"CRM Manager",d:"You manage the CRM platform — clean data, effective segmentation, and alignment between marketing and sales.",tags:["crm","automation","analytics","manager","lead","systems","sp_tech","sp_numbers","sp_process","enterprise","saas"],s:"$75K–$120K",c:"#7E22CE",cat:"MarTech & Automation"},
  {t:"Marketing Operations Manager",d:"You're the backbone of marketing — managing budgets, reporting, processes, and the tech stack powering everything.",tags:["pm","analytics","automation","crm","bi","manager","systems","sp_process","sp_numbers","sp_tech","p_optimizer","enterprise"],s:"$85K–$140K",c:"#6D28D9",cat:"MarTech & Automation"},
  {t:"Marketing Data Analyst",d:"You turn raw marketing data into actionable insights — dashboards, attribution models, and performance reports.",tags:["analytics","ga","bi","cdp","ic","lead","sp_numbers","p_scientist","systems","g_specialist"],s:"$65K–$110K",c:"#4F46E5",cat:"MarTech & Automation"},

  // UX & DESIGN (5)
  {t:"UX Designer",d:"You design intuitive user experiences. User research, wireframes, and prototypes guide your design decisions.",tags:["ux","design_tool","ic","lead","audience","web","sp_visuals","sp_tech","p_artist","p_scientist","g_specialist"],s:"$75K–$130K",c:"#0EA5E9",cat:"UX & Design"},
  {t:"UX/UI Designer",d:"You combine user research with visual design — creating interfaces that are both beautiful and functional.",tags:["ux","creative","design_tool","ic","lead","web","sp_visuals","sp_tech","p_artist","audience"],s:"$80K–$135K",c:"#38BDF8",cat:"UX & Design"},
  {t:"UX Researcher",d:"You uncover user needs through qualitative and quantitative research that shapes product and marketing decisions.",tags:["ux","analytics","audience","ic","lead","sp_numbers","sp_people","p_scientist","cdp","g_specialist"],s:"$80K–$130K",c:"#7DD3FC",cat:"UX & Design"},
  {t:"Head of Design",d:"You lead the entire design function — UX, UI, brand, creative. You build design systems and mentor designers.",tags:["ux","creative","design_tool","director","brand","sp_visuals","sp_people","p_visionary","g_leader","enterprise","saas"],s:"$140K–$220K",c:"#0284C7",cat:"UX & Design"},
  {t:"Web Designer / Developer",d:"You design and build marketing websites and landing pages — blending visual design with frontend development.",tags:["ux","technical","design_tool","cms","web","ic","sp_visuals","sp_tech","p_builder","g_specialist"],s:"$60K–$110K",c:"#0369A1",cat:"UX & Design"},

  // VIDEO & MULTIMEDIA (4)
  {t:"Video Marketing Manager",d:"You lead video strategy across platforms — YouTube, social, webinars, ads. You manage production and measure ROI.",tags:["video","video_tool","content","manager","lead","social_ch","storytelling","sp_visuals","sp_ideas","p_builder","growth"],s:"$75K–$125K",c:"#DC2626",cat:"Video & Multimedia"},
  {t:"Video Producer",d:"You manage end-to-end video production — concept, scripting, shooting, editing, and distribution.",tags:["video","video_tool","creative","ic","lead","content","storytelling","sp_visuals","p_artist","p_builder","g_specialist"],s:"$60K–$100K",c:"#B91C1C",cat:"Video & Multimedia"},
  {t:"Video Editor",d:"You bring raw footage to life through editing, color grading, sound design, and motion graphics.",tags:["video","video_tool","ic","creative","sp_visuals","p_artist","g_specialist","content"],s:"$50K–$85K",c:"#991B1B",cat:"Video & Multimedia"},
  {t:"YouTube Channel Manager",d:"You grow and optimize YouTube channels — content strategy, SEO, community engagement, and monetization.",tags:["video","content","seo","social_ch","analytics","ga","lead","sp_ideas","sp_numbers","p_optimizer","growth"],s:"$55K–$95K",c:"#EF4444",cat:"Video & Multimedia"},

  // PRODUCT MARKETING (4)
  {t:"Product Marketing Manager",d:"You bridge product and market — positioning, launch strategy, and sales enablement are your domain.",tags:["strategy","product","writing","crm","manager","enterprise","saas","sp_words","sp_ideas","p_visionary","sales_enable"],s:"$95K–$155K",c:"#0EA5E9",cat:"Product Marketing"},
  {t:"Senior Product Marketing Manager",d:"You lead PMM for a portfolio of products, mentoring PMMs and driving go-to-market strategy at scale.",tags:["strategy","product","writing","crm","manager","director","enterprise","saas","sp_words","sp_people","p_visionary","g_leader","sales_enable"],s:"$120K–$180K",c:"#0284C7",cat:"Product Marketing"},
  {t:"Product Launch Manager",d:"You orchestrate cross-functional launches — ensuring marketing, sales, product, and CS are aligned.",tags:["pm","product","strategy","manager","lead","pm_tool","sp_process","sp_people","p_connector","systems","saas"],s:"$85K–$135K",c:"#0369A1",cat:"Product Marketing"},
  {t:"Competitive Intelligence Analyst",d:"You track competitors, analyze market trends, and arm the organization with insights to win deals.",tags:["analytics","strategy","product","ic","lead","sp_numbers","sp_trends","p_scientist","audience","enterprise","saas"],s:"$70K–$115K",c:"#075985",cat:"Product Marketing"},

  // CX & LIFECYCLE (4)
  {t:"Customer Marketing Manager",d:"You drive retention, upsell, and advocacy — case studies, loyalty programs, and customer communications.",tags:["cx","email","writing","crm","relationships","manager","lead","sp_words","sp_people","p_connector","audience"],s:"$75K–$120K",c:"#D946EF",cat:"CX & Lifecycle"},
  {t:"Lifecycle Marketing Manager",d:"You map and optimize the entire customer journey from onboarding to renewal with data-driven automation.",tags:["email","automation","cx","crm","cdp","manager","growth","systems","sp_numbers","sp_process","p_optimizer","saas"],s:"$85K–$135K",c:"#C026D3",cat:"CX & Lifecycle"},
  {t:"Customer Experience (CX) Director",d:"You own end-to-end customer experience — aligning marketing, product, and support to maximize satisfaction.",tags:["cx","strategy","audience","director","vp","crm","relationships","sp_people","sp_process","p_visionary","g_executive","enterprise"],s:"$130K–$200K",c:"#A21CAF",cat:"CX & Lifecycle"},
  {t:"Retention Marketing Specialist",d:"You keep customers engaged and reduce churn through targeted campaigns and personalized experiences.",tags:["email","cx","automation","crm","ic","lead","growth","sp_numbers","sp_words","p_optimizer","ecomm","saas"],s:"$60K–$95K",c:"#86198F",cat:"CX & Lifecycle"},

  // PR & COMMS (3)
  {t:"Communications Manager",d:"You craft company narrative for external and internal audiences — press releases, exec comms, crisis management.",tags:["pr","writing","brand","manager","lead","storytelling","sp_words","sp_people","p_connector","enterprise"],s:"$70K–$115K",c:"#65A30D",cat:"PR & Communications"},
  {t:"PR Manager",d:"You manage media relationships, secure earned coverage, and protect brand reputation as the bridge between brand and press.",tags:["pr","writing","brand","relationships","manager","lead","sp_words","sp_people","p_connector","events","agency"],s:"$70K–$120K",c:"#4D7C0F",cat:"PR & Communications"},
  {t:"Director of Communications",d:"You set the strategic comms agenda — managing PR, internal comms, and executive thought leadership.",tags:["pr","writing","brand","strategy","director","storytelling","sp_words","sp_people","p_visionary","g_leader","enterprise"],s:"$120K–$180K",c:"#365314",cat:"PR & Communications"},

  // PROJECT MANAGEMENT (3)
  {t:"Marketing Project Manager",d:"You keep complex marketing initiatives on track — timelines, budgets, cross-functional coordination.",tags:["pm","pm_tool","manager","lead","sp_process","sp_people","p_connector","systems","agency","enterprise"],s:"$70K–$115K",c:"#EA580C",cat:"Project Management"},
  {t:"Creative Project Manager",d:"You manage the creative production pipeline from brief to delivery, bridging strategy and creative execution.",tags:["pm","creative","pm_tool","lead","manager","sp_process","sp_people","p_connector","agency","design_tool"],s:"$65K–$110K",c:"#C2410C",cat:"Project Management"},
  {t:"Marketing Program Manager",d:"You oversee large-scale marketing programs spanning multiple teams, channels, and quarters.",tags:["pm","strategy","pm_tool","manager","director","sp_process","sp_people","p_connector","systems","enterprise","g_leader"],s:"$95K–$150K",c:"#9A3412",cat:"Project Management"},

  // EXECUTIVE (5)
  {t:"VP of Marketing",d:"You set marketing vision and build high-performing teams. You own the P&L and align marketing with business goals.",tags:["strategy","vp","director","growth","enterprise","crm","ga","sp_people","sp_numbers","p_visionary","g_executive","g_leader"],s:"$160K–$280K",c:"#D946EF",cat:"Executive"},
  {t:"Chief Marketing Officer (CMO)",d:"You own the entire marketing function — brand, growth, team, budget, and board-level strategy.",tags:["strategy","vp","brand","growth","enterprise","sp_people","sp_ideas","p_visionary","g_executive","relationships","innovation"],s:"$200K–$400K+",c:"#9333EA",cat:"Executive"},
  {t:"Chief Experience Officer (CXO)",d:"You lead the convergence of marketing, product, and customer success to deliver seamless experiences.",tags:["cx","ux","strategy","vp","audience","relationships","sp_people","sp_process","p_visionary","g_executive","enterprise","innovation"],s:"$180K–$350K+",c:"#7E22CE",cat:"Executive"},
  {t:"Chief Revenue Officer (CRO)",d:"You unify marketing, sales, and CS under one revenue strategy — pipeline, forecasting, go-to-market alignment.",tags:["growth","strategy","vp","crm","sales_enable","sp_numbers","sp_people","p_visionary","g_executive","enterprise","saas"],s:"$200K–$400K+",c:"#6D28D9",cat:"Executive"},
  {t:"Director of Marketing",d:"You lead the marketing department — managing strategy, team, and execution. You translate company goals into action.",tags:["strategy","director","manager","growth","brand","sp_people","sp_process","p_visionary","g_leader","enterprise","saas"],s:"$110K–$175K",c:"#4C1D95",cat:"Executive"},

  // CONSULTING & FREELANCE (3)
  {t:"Marketing Consultant",d:"You advise businesses on strategy and execution — audit, strategize, and implement across channels independently.",tags:["strategy","freelance","analytics","growth","crm","ga","sp_numbers","sp_ideas","p_visionary","g_founder"],s:"$90K–$200K+",c:"#0D9488",cat:"Consulting"},
  {t:"Freelance Content Creator",d:"You create content independently for multiple clients — writing, video, social, or design. Your portfolio is your brand.",tags:["writing","freelance","content","creative","ic","sp_words","sp_visuals","p_artist","g_founder","storytelling"],s:"$50K–$150K+",c:"#0F766E",cat:"Consulting"},
  {t:"Fractional CMO",d:"You provide executive-level marketing leadership on a part-time basis to companies needing strategic direction.",tags:["strategy","freelance","vp","brand","growth","sp_people","sp_ideas","p_visionary","g_founder","g_executive","relationships"],s:"$120K–$300K+",c:"#134E4A",cat:"Consulting"},

  // ECOMMERCE (3)
  {t:"E-commerce Marketing Manager",d:"You drive online revenue through paid, email, SEO, and marketplace optimization. Conversion and AOV are your metrics.",tags:["paid","email","seo","ecomm","ads","ga","manager","growth","sp_numbers","p_optimizer","automation"],s:"$75K–$130K",c:"#F472B6",cat:"E-commerce"},
  {t:"DTC Brand Manager",d:"You build direct-to-consumer brands from the ground up — brand identity, acquisition, and retention.",tags:["brand","ecomm","creative","growth","social_ch","email","lead","manager","sp_ideas","sp_visuals","p_builder","startup"],s:"$80K–$130K",c:"#EC4899",cat:"E-commerce"},
  {t:"Marketplace Marketing Specialist",d:"You optimize product listings, advertising, and visibility on Amazon, Walmart, and Shopify.",tags:["paid","seo","analytics","ecomm","ic","ads","ga","sp_numbers","p_optimizer","g_specialist"],s:"$55K–$95K",c:"#DB2777",cat:"E-commerce"},

  // EVENTS & PARTNERSHIPS (3)
  {t:"Events Marketing Manager",d:"You plan and execute trade shows, webinars, and experiential activations that generate pipeline.",tags:["events","pm","relationships","manager","lead","pm_tool","sp_process","sp_people","p_connector","enterprise"],s:"$70K–$115K",c:"#F97316",cat:"Events & Partnerships"},
  {t:"Partner Marketing Manager",d:"You develop co-marketing programs with strategic partners — joint campaigns, integrations, and channel partnerships.",tags:["affiliate","events","relationships","manager","lead","strategy","sp_people","p_connector","enterprise","saas"],s:"$80K–$130K",c:"#EA580C",cat:"Events & Partnerships"},
  {t:"Field Marketing Manager",d:"You execute regional marketing — events, ABM campaigns, and local activations that support sales teams.",tags:["events","paid","relationships","manager","lead","crm","sp_people","sp_process","p_connector","enterprise","sales_enable"],s:"$80K–$125K",c:"#C2410C",cat:"Events & Partnerships"},

  // ANALYTICS (2)
  {t:"Marketing Analytics Manager",d:"You lead analytics — building dashboards, attribution models, and insight frameworks that guide decisions.",tags:["analytics","ga","bi","cdp","manager","lead","sp_numbers","sp_tech","p_scientist","systems","g_leader","enterprise"],s:"$95K–$150K",c:"#3B82F6",cat:"Analytics"},
  {t:"Market Research Analyst",d:"You uncover market opportunities through research, surveys, and competitive analysis that shape strategy.",tags:["analytics","strategy","audience","ic","lead","sp_numbers","sp_trends","p_scientist","bi","enterprise"],s:"$60K–$100K",c:"#2563EB",cat:"Analytics"},
];

function score(answers) {
  const sel = [];
  Object.values(answers).forEach(v => { if (Array.isArray(v)) sel.push(...v); else if (v) sel.push(v); });
  const scored = T.map(r => {
    let s = 0;
    r.tags.forEach(tag => { if (sel.includes(tag)) s++; });
    return { ...r, score: s, pct: Math.round((s / r.tags.length) * 100) };
  });
  scored.sort((a, b) => b.score - a.score || b.pct - a.pct);
  return scored;
}

function Progress({ cur, total }) {
  const p = (cur / total) * 100;
  return (
    <div style={{ width: "100%", marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#94A3B8", letterSpacing: 1 }}>
        <span>QUESTION {cur + 1} / {total}</span><span>{Math.round(p)}%</span>
      </div>
      <div style={{ width: "100%", height: 3, background: "#1E293B", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${p}%`, height: "100%", background: "linear-gradient(90deg, #6366F1, #EC4899)", borderRadius: 2, transition: "width 0.4s cubic-bezier(.4,0,.2,1)" }} />
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
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#6366F1", marginBottom: 5, textTransform: "uppercase" }}>{q.category}</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#F1F5F9", margin: "0 0 5px", lineHeight: 1.3 }}>{q.question}</h2>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#64748B", margin: "0 0 16px" }}>
        {multi ? `Select up to ${q.max}` : "Choose one"}{multi && full && <span style={{ color: "#F59E0B", marginLeft: 6 }}>— max reached</span>}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: q.options.length > 5 ? "1fr 1fr" : "1fr", gap: 6 }}>
        {q.options.map(o => {
          const on = multi ? sel.includes(o.id) : sel === o.id;
          const dis = multi && full && !on;
          return (
            <button key={o.id} onClick={() => !dis && tog(o.id)} style={{
              display: "flex", alignItems: "center", gap: 9, padding: "10px 12px",
              background: on ? "rgba(99,102,241,0.12)" : dis ? "rgba(15,23,42,0.3)" : "rgba(30,41,59,0.5)",
              border: on ? "1.5px solid #6366F1" : "1.5px solid rgba(100,116,139,0.1)",
              borderRadius: 9, cursor: dis ? "default" : "pointer", transition: "all .15s", textAlign: "left",
              fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: on ? "#E0E7FF" : dis ? "#475569" : "#CBD5E1", opacity: dis ? 0.45 : 1,
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{o.icon}</span>
              <span style={{ fontWeight: on ? 600 : 400, lineHeight: 1.3 }}>{o.label}</span>
              {on && <span style={{ marginLeft: "auto", color: "#6366F1", fontSize: 14, flexShrink: 0 }}>✓</span>}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        {idx > 0 && <button onClick={onBack} style={{ padding: "10px 18px", background: "transparent", border: "1.5px solid rgba(100,116,139,0.2)", borderRadius: 9, color: "#94A3B8", fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: "pointer" }}>←</button>}
        <button onClick={onNext} disabled={!ok} style={{
          flex: 1, padding: "10px 18px", background: ok ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : "rgba(30,41,59,0.5)",
          border: "none", borderRadius: 9, color: ok ? "#FFF" : "#475569",
          fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: ok ? "pointer" : "not-allowed",
        }}>{idx === total - 1 ? "See My Results →" : "Continue →"}</button>
      </div>
    </div>
  );
}

function RCard({ r, rank, top, exp, onTog }) {
  const bw = Math.max(r.pct, 10);
  return (
    <div onClick={rank > 1 ? onTog : undefined} style={{
      background: top ? "rgba(99,102,241,0.06)" : "rgba(15,23,42,0.4)",
      border: top ? `1.5px solid ${r.c}30` : "1.5px solid rgba(100,116,139,0.06)",
      borderRadius: 12, padding: top ? "20px 16px" : "12px 14px", marginBottom: 6,
      animation: `fadeIn .4s ease-out ${rank * .06}s both`, position: "relative", overflow: "hidden",
      cursor: rank > 1 ? "pointer" : "default", transition: "all .15s",
    }}>
      {top && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${r.c},${r.c}00)` }} />}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: (top || exp) ? 6 : 0 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: r.c, background: `${r.c}15`, padding: "2px 6px", borderRadius: 4, letterSpacing: 1, flexShrink: 0 }}>#{rank}</span>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: top ? 20 : 14, fontWeight: 700, color: "#F1F5F9", margin: 0, flex: 1, lineHeight: 1.2 }}>{r.t}</h3>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748B", flexShrink: 0 }}>{r.pct}%</span>
        {!top && <span style={{ fontSize: 10, color: "#475569", flexShrink: 0 }}>{exp ? "▲" : "▼"}</span>}
      </div>
      {(top || exp) && <>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#94A3B8", margin: "0 0 10px", lineHeight: 1.5 }}>{r.d}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{ width: 100, height: 4, background: "#1E293B", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${bw}%`, height: "100%", background: r.c, borderRadius: 2, transition: "width .7s cubic-bezier(.4,0,.2,1)" }} />
          </div>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: r.c, background: `${r.c}12`, padding: "2px 6px", borderRadius: 4 }}>{r.s}</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#475569", background: "rgba(100,116,139,0.08)", padding: "2px 6px", borderRadius: 4 }}>{r.cat}</span>
        </div>
      </>}
    </div>
  );
}

function Results({ results, onRestart }) {
  const [exp, setExp] = useState(new Set());
  const [showAll, setShowAll] = useState(false);
  const n = showAll ? 15 : 8;
  const top = results.slice(0, n);
  const cats = {};
  results.slice(0, 10).forEach(r => { cats[r.cat] = (cats[r.cat] || 0) + 1; });
  const topCats = Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <div style={{ animation: "fadeIn .4s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#10B981", marginBottom: 5 }}>QUIZ COMPLETE</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "#F1F5F9", margin: "0 0 4px" }}>Your Marketing Identity</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#64748B", margin: "0 0 12px" }}>Matched against {T.length} marketing roles</p>
        <div style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap" }}>
          {topCats.map(([cat]) => <span key={cat} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#94A3B8", background: "rgba(100,116,139,0.1)", padding: "2px 8px", borderRadius: 20 }}>{cat}</span>)}
        </div>
      </div>
      {top.map((r, i) => <RCard key={r.t} r={r} rank={i + 1} top={i === 0} exp={exp.has(i)} onTog={() => setExp(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; })} />)}
      {!showAll && results.length > 8 && <button onClick={() => setShowAll(true)} style={{ width: "100%", padding: "8px", marginBottom: 6, background: "transparent", border: "1px dashed rgba(100,116,139,0.15)", borderRadius: 8, color: "#64748B", fontFamily: "'DM Sans', sans-serif", fontSize: 12, cursor: "pointer" }}>Show more results ↓</button>}
      <button onClick={onRestart} style={{ width: "100%", marginTop: 10, padding: "12px", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", border: "none", borderRadius: 10, color: "#FFF", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Retake Quiz</button>
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

  const next = () => { if (cur < Q.length - 1) setCur(cur + 1); else { setRes(score(ans)); setScr("results"); } };
  const back = () => { if (cur > 0) setCur(cur - 1); };
  const restart = () => { const i = {}; Q.forEach(q => { i[q.id] = q.type === "multi" ? [] : null; }); setAns(i); setCur(0); setScr("welcome"); };

  return (
    <div style={{ minHeight: "100vh", background: "#0B1120", display: "flex", alignItems: "center", justifyContent: "center", padding: 14, position: "relative" }}>
      <div style={{ position: "fixed", top: -200, right: -200, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -150, left: -150, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
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
            <div style={{ width: 60, height: 60, borderRadius: 16, background: "linear-gradient(135deg,#6366F1,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 26 }}>🎯</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 800, color: "#F1F5F9", margin: "0 0 8px", lineHeight: 1.2 }}>Find Your Perfect<br/>Marketing Title</h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#94A3B8", margin: "0 auto 6px", lineHeight: 1.5, maxWidth: 380 }}>Answer 9 questions about your skills, personality, and career goals to discover your ideal role from <strong style={{ color: "#E0E7FF" }}>{T.length} marketing titles</strong>.</p>
            <div style={{ display: "flex", gap: 5, justifyContent: "center", margin: "14px 0 24px", flexWrap: "wrap" }}>
              {["Skills","Channels","Leadership","Passion","Tools","Personality","Superpowers","Career"].map(t => <span key={t} style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#64748B", background: "rgba(100,116,139,0.08)", padding: "3px 8px", borderRadius: 16 }}>{t}</span>)}
            </div>
            <button onClick={() => setScr("quiz")} style={{ padding: "13px 40px", background: "linear-gradient(135deg,#6366F1,#8B5CF6)", border: "none", borderRadius: 12, color: "#FFF", fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 18px rgba(99,102,241,0.3)" }}>Start the Quiz →</button>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#475569", margin: "14px 0 0", letterSpacing: .5 }}>⏱ ~3 minutes · {T.length} roles</p>
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
