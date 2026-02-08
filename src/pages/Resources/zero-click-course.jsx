import { useState, useEffect, useRef } from "react";

const COURSE_DATA = {
  title: "Zero-Click Marketing",
  subtitle: "The B2B Playbook for Winning Visibility Without the Click",
  modules: [
    {
      id: 1,
      title: "The Zero-Click Revolution",
      duration: "3 min",
      icon: "⚡",
      content: {
        intro: "The rules of digital marketing have fundamentally changed. In 2026, the majority of online journeys never result in a click to an external website. Google's AI Overviews, social media algorithms, and AI-powered search tools are answering questions directly — keeping users on-platform.",
        sections: [
          {
            heading: "What Is Zero-Click Marketing?",
            text: "Zero-click marketing is the practice of building brand visibility, trust, and demand in spaces where your audience consumes content — without requiring them to visit your website. Instead of optimizing for clicks, you optimize for impressions, brand recall, and engagement within the platforms themselves."
          },
          {
            heading: "Why B2B Companies Can't Ignore This",
            text: "B2B buyers now conduct 70%+ of their research before ever contacting a vendor. If your brand isn't visible in the AI summaries, social feeds, and community discussions where that research happens, you're invisible during the most critical phase of the buyer journey. The companies that adapt to zero-click will capture demand at the top of the funnel. Those that don't will compete on price at the bottom."
          },
          {
            heading: "The Shift in Numbers",
            text: "Organic click-through rates from Google have declined over 30% in two years. Meanwhile, platforms like LinkedIn, Reddit, and YouTube are keeping users engaged longer than ever. AI tools like ChatGPT, Perplexity, and Gemini are now answering complex B2B queries with synthesized responses — often without linking to the source. This isn't a temporary blip. It's the new infrastructure of how information is consumed."
          }
        ],
        keyTakeaway: "Stop measuring success by clicks alone. Start measuring whether your brand shows up where your buyers are already looking."
      },
      quiz: {
        question: "What is the primary goal of zero-click marketing?",
        options: [
          "Driving more website traffic through SEO",
          "Building visibility and trust where audiences consume content on-platform",
          "Eliminating the need for a company website",
          "Replacing paid advertising with organic content"
        ],
        correct: 1,
        explanation: "Zero-click marketing focuses on creating brand visibility and authority within the platforms where your audience already spends time — not on driving them away to your site."
      }
    },
    {
      id: 2,
      title: "Platform-Native Content Strategy",
      duration: "4 min",
      icon: "🎯",
      content: {
        intro: "The era of 'create a blog post and share the link everywhere' is over. Each platform has its own content economy, and the brands winning in zero-click are creating content designed to live and thrive natively on each platform.",
        sections: [
          {
            heading: "LinkedIn: Your B2B Command Center",
            text: "LinkedIn's algorithm now heavily favors content that keeps users on-platform. Instead of posting a link to your latest whitepaper, extract the 3 most compelling insights and share them as a carousel or text post. Save the link for comments. Document-style posts, founder narratives, and contrarian takes on industry topics consistently outperform promotional content by 5-10x in reach. The goal: become a recognized voice, not a link dispenser."
          },
          {
            heading: "YouTube & Short-Form Video",
            text: "B2B video is no longer optional. YouTube is the second-largest search engine and increasingly surfaces in AI-generated answers. Create short (60-90 second) explainers on specific pain points your buyers face. These get indexed, summarized by AI tools, and shared across platforms. Long-form thought leadership videos (8-15 minutes) build deep trust and authority. The key: answer one specific question per video with clarity and confidence."
          },
          {
            heading: "Reddit & Community Platforms",
            text: "Reddit threads now appear in 25%+ of Google search results for B2B queries. Genuine, helpful participation in relevant subreddits builds organic visibility that compounds over time. Don't sell — solve. Answer questions thoroughly, share frameworks, and reference your experience without linking to your site. Your brand becomes the trusted answer that AI tools cite."
          },
          {
            heading: "The Content Repurposing Engine",
            text: "One core insight can become: a LinkedIn carousel, a YouTube Short, a Reddit answer, a podcast clip, and an email newsletter edition. Build a system where each piece of original thinking gets adapted (not copy-pasted) to the native format of each platform. This multiplies your zero-click surface area without multiplying your workload."
          }
        ],
        keyTakeaway: "Create content for the platform, not content about your website that you post on platforms. Each platform rewards different formats — adapt accordingly."
      },
      quiz: {
        question: "What's the most effective LinkedIn strategy for zero-click visibility?",
        options: [
          "Post links to your blog with a brief description",
          "Share promotional content about your services",
          "Extract key insights from your content and share them natively as posts or carousels",
          "Only post company news and press releases"
        ],
        correct: 2,
        explanation: "LinkedIn's algorithm rewards native content that keeps users on-platform. Extracting insights and presenting them as standalone posts or carousels dramatically outperforms link-based sharing."
      }
    },
    {
      id: 3,
      title: "Optimizing for AI Visibility",
      duration: "4 min",
      icon: "🤖",
      content: {
        intro: "AI tools are rapidly becoming the first stop for B2B research. When a procurement manager asks ChatGPT 'What are the best PEO providers for mid-size companies?' or a CMO asks Perplexity 'How do I improve my lead scoring?' — your brand needs to be in that answer. This is the new SEO.",
        sections: [
          {
            heading: "How AI Tools Select Sources",
            text: "Large language models build their responses from patterns across their training data and, increasingly, from real-time web search. To appear in AI-generated answers, your content needs to be: clearly structured with headers and definitions, published on authoritative domains, frequently referenced by other sources, and written in a way that directly answers specific questions. Think of it as 'Answer Engine Optimization' — structuring your content so AI can easily extract and cite it."
          },
          {
            heading: "Structured Content That AI Loves",
            text: "Format your content with clear question-and-answer structures. Use definition-style openings ('A PEO is a professional employer organization that...'). Create comparison tables, numbered lists of steps, and clear category breakdowns. These formats are exactly what AI tools pull from when constructing responses. Your FAQ pages, glossary entries, and how-to guides are now your most strategically important content."
          },
          {
            heading: "Building Entity Authority",
            text: "AI tools associate brands with topics based on how consistently and authoritatively they appear in relevant contexts. Publish consistently around your core topics. Get mentioned in industry publications, podcasts, and directories. Ensure your brand appears in the knowledge sources that AI tools reference — including Wikipedia, industry databases, and authoritative review sites."
          },
          {
            heading: "Tracking Your AI Presence",
            text: "Start regularly querying AI tools with the questions your buyers ask. Document where your brand appears (and where it doesn't). Tools are emerging to track AI mentions, but the simplest approach is manual: ask ChatGPT, Perplexity, and Gemini the 20 questions your prospects ask most, and see if you show up. This becomes your new competitive intelligence baseline."
          }
        ],
        keyTakeaway: "AI visibility is the new SEO. Structure your content to be the answer that AI tools cite when your buyers ask questions."
      },
      quiz: {
        question: "What content format is MOST effective for appearing in AI-generated answers?",
        options: [
          "Long narrative blog posts with personal anecdotes",
          "Clearly structured Q&A formats with definitions, comparisons, and step-by-step guides",
          "Infographics and visual-only content",
          "Gated whitepapers behind lead forms"
        ],
        correct: 1,
        explanation: "AI tools extract and cite content that's clearly structured — Q&A formats, definitions, comparison tables, and numbered steps are exactly what models pull from when generating responses."
      }
    },
    {
      id: 4,
      title: "Measuring What Matters",
      duration: "3 min",
      icon: "📊",
      content: {
        intro: "If you can't measure zero-click, how do you prove it works? The old metrics (traffic, clicks, conversions) don't capture the full picture anymore. You need a new measurement framework that values visibility, brand lift, and downstream demand.",
        sections: [
          {
            heading: "The New Metrics Stack",
            text: "Replace your traffic-centric dashboard with these zero-click metrics: Share of Voice (how often your brand appears in relevant conversations and searches), Impression Volume (total eyeballs on your native content across platforms), Engagement Rate (likes, comments, saves, shares — signals of resonance), Brand Search Volume (are more people Googling your company name?), and Pipeline Influence (did prospects mention seeing your content before they booked a demo?)."
          },
          {
            heading: "Self-Reported Attribution",
            text: "Add 'How did you hear about us?' as an open-text field on every lead form and demo booking page. You'll be surprised how often prospects say 'I saw your LinkedIn post' or 'You came up when I searched on ChatGPT.' This qualitative data is often more accurate than any tracking pixel. B2B companies using self-reported attribution consistently find that 40-60% of their pipeline was influenced by channels that traditional analytics can't track."
          },
          {
            heading: "Brand Search as a North Star",
            text: "When your zero-click strategy is working, branded search volume increases. More people Google your company name because they encountered your content on LinkedIn, heard you on a podcast, or saw your brand referenced in an AI answer. Track branded search volume in Google Search Console monthly. This is the single best indicator that your visibility efforts are creating real demand."
          },
          {
            heading: "Building Your Dashboard",
            text: "Create a monthly report that includes: LinkedIn impressions and engagement, YouTube views and watch time, branded search volume trend, self-reported attribution data from lead forms, and AI visibility audit results. This dashboard tells the story that traditional analytics miss — and gives leadership confidence in the strategy."
          }
        ],
        keyTakeaway: "Branded search volume + self-reported attribution = the truth about what's driving your pipeline. Build your dashboard around these, not just clicks."
      },
      quiz: {
        question: "What's the single best indicator that your zero-click strategy is working?",
        options: [
          "Increased website page views",
          "Higher email open rates",
          "Growing branded search volume",
          "More social media followers"
        ],
        correct: 2,
        explanation: "When people encounter your brand across platforms and AI tools, they search for you by name. Branded search volume is the clearest signal that zero-click visibility is converting into real demand."
      }
    },
    {
      id: 5,
      title: "Your 30-Day Action Plan",
      duration: "3 min",
      icon: "🚀",
      content: {
        intro: "Theory without action is just entertainment. Here's your concrete 30-day plan to launch a zero-click marketing strategy for your B2B company — starting today.",
        sections: [
          {
            heading: "Week 1: Audit & Foundation",
            text: "Day 1-2: List the 20 questions your buyers ask most before purchasing. Day 3-4: Search those questions on Google, ChatGPT, Perplexity, and LinkedIn. Document where your brand appears and where competitors show up instead. Day 5: Audit your existing content — which pieces could be restructured into AI-friendly formats? Day 6-7: Set up tracking for branded search volume, LinkedIn analytics, and add a 'How did you hear about us?' field to all lead forms."
          },
          {
            heading: "Week 2: Content Engine Setup",
            text: "Day 8-9: Choose your 3 core topics (the themes you want to own in your industry). Day 10-11: Create a content repurposing template — how one insight becomes a LinkedIn post, YouTube Short, and structured FAQ page. Day 12-14: Produce your first batch: 3 LinkedIn posts, 1 YouTube Short, and 2 restructured FAQ/glossary pages optimized for AI extraction."
          },
          {
            heading: "Week 3: Distribution & Engagement",
            text: "Day 15-17: Publish your first wave of native content across platforms. Engage with every comment — this signals to algorithms that your content sparks conversation. Day 18-19: Identify 5 relevant Reddit threads or community discussions where you can add genuine value. Contribute thoughtfully. Day 20-21: Reach out to 3 industry podcasts or newsletters for guest appearances — these create the cross-references that build AI entity authority."
          },
          {
            heading: "Week 4: Measure & Iterate",
            text: "Day 22-24: Run your first AI visibility audit — re-search your 20 buyer questions and compare to Week 1 baseline. Day 25-26: Review LinkedIn analytics, YouTube performance, and any self-reported attribution data from new leads. Day 27-28: Identify your top-performing content formats and topics — double down on what resonated. Day 29-30: Document your findings, refine your content calendar for Month 2, and share results with your team. Celebrate the progress."
          }
        ],
        keyTakeaway: "Start with the audit. You can't win a game you're not measuring. Your first 30 days build the foundation for compounding visibility that grows every month."
      },
      quiz: {
        question: "What should be the FIRST step in launching a zero-click strategy?",
        options: [
          "Create 10 LinkedIn posts immediately",
          "Hire a video production team",
          "Audit where your brand currently appears (and doesn't) when buyers search their top questions",
          "Redesign your website for better conversion"
        ],
        correct: 2,
        explanation: "Before creating content, you need to understand the landscape. Auditing your current visibility across search, AI tools, and social platforms reveals exactly where to focus your efforts for maximum impact."
      }
    }
  ]
};

const LeadCapture = ({ onSubmit, position }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && name) {
      setSubmitted(true);
      onSubmit({ name, email, company });
    }
  };

  if (submitted) {
    return (
      <div style={{
        background: "linear-gradient(135deg, #0a1628 0%, #1a2a4a 100%)",
        border: "1px solid rgba(0, 224, 150, 0.3)",
        borderRadius: 16,
        padding: "32px 28px",
        textAlign: "center",
        animation: "fadeIn 0.5s ease"
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
        <h3 style={{ color: "#00e096", fontSize: 20, margin: "0 0 8px", fontFamily: "'Instrument Serif', Georgia, serif" }}>You're in, {name.split(" ")[0]}!</h3>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
          {position === "gate" ? "Enjoy the full course below." : "We'll send you the complete playbook + bonus templates."}
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, #0a1628 0%, #1a2a4a 100%)",
      border: "1px solid rgba(0, 224, 150, 0.2)",
      borderRadius: 16,
      padding: "32px 28px",
      animation: "fadeIn 0.5s ease"
    }}>
      <h3 style={{
        color: "#fff",
        fontSize: 22,
        margin: "0 0 6px",
        fontFamily: "'Instrument Serif', Georgia, serif",
        letterSpacing: "-0.01em"
      }}>
        {position === "gate" ? "Enter your details to start the course" : "Get the Full Zero-Click Toolkit"}
      </h3>
      <p style={{
        color: "rgba(255,255,255,0.6)",
        fontSize: 14,
        margin: "0 0 24px",
        fontFamily: "'DM Sans', sans-serif",
        lineHeight: 1.5
      }}>
        {position === "gate"
          ? "Free access — no credit card required."
          : "30-day action plan templates, content repurposing worksheets, and AI visibility audit checklist — delivered to your inbox."}
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10,
            padding: "14px 16px",
            color: "#fff",
            fontSize: 15,
            fontFamily: "'DM Sans', sans-serif",
            outline: "none",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => e.target.style.borderColor = "rgba(0,224,150,0.5)"}
          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
        />
        <input
          type="email"
          placeholder="Work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10,
            padding: "14px 16px",
            color: "#fff",
            fontSize: 15,
            fontFamily: "'DM Sans', sans-serif",
            outline: "none",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => e.target.style.borderColor = "rgba(0,224,150,0.5)"}
          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
        />
        <input
          type="text"
          placeholder="Company (optional)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10,
            padding: "14px 16px",
            color: "#fff",
            fontSize: 15,
            fontFamily: "'DM Sans', sans-serif",
            outline: "none",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => e.target.style.borderColor = "rgba(0,224,150,0.5)"}
          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
        />
        <button
          type="submit"
          style={{
            background: "linear-gradient(135deg, #00e096 0%, #00b4d8 100%)",
            border: "none",
            borderRadius: 10,
            padding: "15px 24px",
            color: "#0a1628",
            fontSize: 16,
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer",
            marginTop: 4,
            transition: "transform 0.15s, box-shadow 0.15s",
            boxShadow: "0 4px 20px rgba(0, 224, 150, 0.25)"
          }}
          onMouseEnter={(e) => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 6px 28px rgba(0, 224, 150, 0.35)"; }}
          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 20px rgba(0, 224, 150, 0.25)"; }}
        >
          {position === "gate" ? "Start Learning →" : "Send Me the Toolkit →"}
        </button>
      </form>
    </div>
  );
};

export default function ZeroClickCourse() {
  const [gated, setGated] = useState(true);
  const [activeModule, setActiveModule] = useState(0);
  const [completedModules, setCompletedModules] = useState(new Set());
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef(null);

  const currentModule = COURSE_DATA.modules[activeModule];
  const progress = (completedModules.size / COURSE_DATA.modules.length) * 100;

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeModule, showQuiz]);

  const handleQuizSubmit = () => {
    if (selectedAnswer === null) return;
    setQuizSubmitted(true);
    if (selectedAnswer === currentModule.quiz.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    const newCompleted = new Set(completedModules);
    newCompleted.add(activeModule);
    setCompletedModules(newCompleted);

    if (activeModule < COURSE_DATA.modules.length - 1) {
      setActiveModule(activeModule + 1);
      setShowQuiz(false);
      setSelectedAnswer(null);
      setQuizSubmitted(false);
    } else {
      newCompleted.add(activeModule);
      setCompletedModules(newCompleted);
      setShowCompletion(true);
    }
  };

  const handleGateSubmit = (data) => {
    setTimeout(() => setGated(false), 800);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060d1a",
      fontFamily: "'DM Sans', sans-serif",
      color: "#fff",
      position: "relative",
      overflow: "hidden"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
        
        @media (max-width: 768px) {
          .course-grid { grid-template-columns: 1fr !important; }
          .course-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            width: 280px !important;
            z-index: 100 !important;
            background: #0a1225 !important;
            border-right: 1px solid rgba(255,255,255,0.08) !important;
            padding: 72px 20px 28px !important;
            overflow-y: auto !important;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          .course-sidebar.open {
            transform: translateX(0) !important;
          }
          .sidebar-overlay {
            display: block !important;
          }
          .sidebar-overlay.open {
            opacity: 1 !important;
            pointer-events: auto !important;
          }
          .mobile-menu-btn { display: flex !important; }
          .course-main {
            padding-left: 20px !important;
            padding-right: 16px !important;
            max-height: none !important;
          }
        }
      `}</style>

      {/* Ambient background */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0
      }}>
        <div style={{
          position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600,
          background: "radial-gradient(circle, rgba(0,224,150,0.06) 0%, transparent 70%)",
          borderRadius: "50%"
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", left: "-10%", width: 500, height: 500,
          background: "radial-gradient(circle, rgba(0,180,216,0.05) 0%, transparent 70%)",
          borderRadius: "50%"
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        {/* Header */}
        <header style={{
          padding: "28px 0 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 6,
              background: "rgba(0,224,150,0.08)", border: "1px solid rgba(0,224,150,0.15)",
              borderRadius: 100, padding: "5px 14px", fontSize: 12, color: "#00e096",
              fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase"
            }}>
              <span style={{ animation: "pulse 2s infinite" }}>●</span> Free Mini-Course
            </div>
            <h1 style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 400, letterSpacing: "-0.02em",
              lineHeight: 1.15, marginTop: 4
            }}>
              {COURSE_DATA.title}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginTop: 4, fontWeight: 300 }}>
              {COURSE_DATA.subtitle}
            </p>
          </div>
          {!gated && (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 4, fontWeight: 500 }}>PROGRESS</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#00e096" }}>{Math.round(progress)}%</div>
              </div>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: `conic-gradient(#00e096 ${progress * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", background: "#0a1225",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700
                }}>
                  {completedModules.size}/{COURSE_DATA.modules.length}
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Gate */}
        {gated ? (
          <div style={{
            maxWidth: 520, margin: "80px auto", animation: "fadeIn 0.6s ease"
          }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>⚡</div>
              <h2 style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: 32, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 12
              }}>
                Master Zero-Click Marketing in 17 Minutes
              </h2>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, lineHeight: 1.6, maxWidth: 440, margin: "0 auto" }}>
                5 interactive lessons. Quizzes to test your knowledge. A 30-day action plan you can implement immediately.
              </p>
              <div style={{
                display: "flex", justifyContent: "center", gap: 24, marginTop: 20,
                color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 500
              }}>
                <span>📚 5 Modules</span>
                <span>⏱️ ~17 min</span>
                <span>✅ Quizzes</span>
              </div>
            </div>
            <LeadCapture onSubmit={handleGateSubmit} position="gate" />
          </div>
        ) : showCompletion ? (
          /* Completion Screen */
          <div style={{
            maxWidth: 580, margin: "60px auto", textAlign: "center",
            animation: "fadeIn 0.6s ease"
          }}>
            <div style={{
              width: 100, height: 100, borderRadius: "50%", margin: "0 auto 24px",
              background: "linear-gradient(135deg, rgba(0,224,150,0.15), rgba(0,180,216,0.15))",
              border: "2px solid rgba(0,224,150,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48
            }}>
              🏆
            </div>
            <h2 style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: 36, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 8
            }}>
              Course Complete!
            </h2>
            <p style={{
              color: "rgba(255,255,255,0.55)", fontSize: 17, marginBottom: 28, lineHeight: 1.6
            }}>
              You scored <strong style={{ color: "#00e096" }}>{score}/{COURSE_DATA.modules.length}</strong> on the quizzes.
              <br />You're ready to build your zero-click strategy.
            </p>
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14, padding: "24px 28px", marginBottom: 32, textAlign: "left"
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, color: "#00e096" }}>Your Next Steps:</h3>
              {["List your buyers' top 20 questions", "Audit your AI visibility today", "Create your first platform-native LinkedIn post", "Set up self-reported attribution on lead forms"].map((step, i) => (
                <div key={i} style={{
                  display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < 3 ? 12 : 0
                }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                    background: "rgba(0,224,150,0.12)", color: "#00e096",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700
                  }}>{i + 1}</span>
                  <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 1.5 }}>{step}</span>
                </div>
              ))}
            </div>
            <LeadCapture onSubmit={() => {}} position="end" />
          </div>
        ) : (
          /* Course Content */
          <div style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            gap: 0,
            marginTop: 0,
            minHeight: "calc(100vh - 140px)"
          }} className="course-grid">

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: "none",
                position: "fixed",
                bottom: 20,
                left: 20,
                zIndex: 101,
                width: 52,
                height: 52,
                borderRadius: 14,
                background: sidebarOpen ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #00e096 0%, #00b4d8 100%)",
                border: "none",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: sidebarOpen ? "none" : "0 4px 24px rgba(0,224,150,0.3)",
                transition: "all 0.2s",
                flexDirection: "column",
                gap: 5
              }}
            >
              <span style={{
                display: "block", width: 22, height: 2, borderRadius: 2,
                background: sidebarOpen ? "#fff" : "#0a1628",
                transition: "all 0.3s",
                transform: sidebarOpen ? "rotate(45deg) translateY(3.5px)" : "none"
              }} />
              <span style={{
                display: "block", width: 22, height: 2, borderRadius: 2,
                background: sidebarOpen ? "#fff" : "#0a1628",
                transition: "all 0.3s",
                opacity: sidebarOpen ? 0 : 1
              }} />
              <span style={{
                display: "block", width: 22, height: 2, borderRadius: 2,
                background: sidebarOpen ? "#fff" : "#0a1628",
                transition: "all 0.3s",
                transform: sidebarOpen ? "rotate(-45deg) translateY(-3.5px)" : "none"
              }} />
            </button>

            {/* Mobile Overlay */}
            <div
              className={`sidebar-overlay${sidebarOpen ? " open" : ""}`}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: "none",
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
                zIndex: 99,
                opacity: 0,
                pointerEvents: "none",
                transition: "opacity 0.3s"
              }}
            />

            {/* Sidebar */}
            <nav className={`course-sidebar${sidebarOpen ? " open" : ""}`} style={{
              borderRight: "1px solid rgba(255,255,255,0.06)",
              paddingTop: 28, paddingRight: 24, paddingBottom: 28
            }}>
              <div style={{
                fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", marginBottom: 16
              }}>Modules</div>
              {COURSE_DATA.modules.map((mod, i) => {
                const isActive = i === activeModule;
                const isComplete = completedModules.has(i);
                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setActiveModule(i);
                      setShowQuiz(false);
                      setSelectedAnswer(null);
                      setQuizSubmitted(false);
                      setSidebarOpen(false);
                    }}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 12,
                      width: "100%", padding: "14px 14px", marginBottom: 4,
                      background: isActive ? "rgba(0,224,150,0.06)" : "transparent",
                      border: isActive ? "1px solid rgba(0,224,150,0.12)" : "1px solid transparent",
                      borderRadius: 10, cursor: "pointer",
                      transition: "all 0.2s", textAlign: "left"
                    }}
                  >
                    <span style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: isComplete ? "rgba(0,224,150,0.15)" : isActive ? "rgba(0,224,150,0.1)" : "rgba(255,255,255,0.04)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: isComplete ? 14 : 16,
                      border: isActive ? "1px solid rgba(0,224,150,0.2)" : "1px solid rgba(255,255,255,0.06)"
                    }}>
                      {isComplete ? "✓" : mod.icon}
                    </span>
                    <div>
                      <div style={{
                        fontSize: 14, fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#fff" : isComplete ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.65)",
                        lineHeight: 1.35
                      }}>
                        {mod.title}
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                        {mod.duration}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Main Content */}
            <main ref={contentRef} className="course-main" style={{
              paddingLeft: 40, paddingTop: 28, paddingBottom: 60, paddingRight: 20,
              maxHeight: "calc(100vh - 140px)", overflowY: "auto"
            }}>
              <div style={{ maxWidth: 680, animation: "fadeIn 0.4s ease" }}>
                {/* Module Header */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10
                  }}>
                    Module {currentModule.id} of {COURSE_DATA.modules.length} · {currentModule.duration}
                  </div>
                  <h2 style={{
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 400,
                    letterSpacing: "-0.02em", lineHeight: 1.2
                  }}>
                    <span style={{ marginRight: 12 }}>{currentModule.icon}</span>
                    {currentModule.title}
                  </h2>
                </div>

                {!showQuiz ? (
                  /* Lesson Content */
                  <div style={{ animation: "fadeIn 0.4s ease" }}>
                    <p style={{
                      fontSize: 17, lineHeight: 1.75, color: "rgba(255,255,255,0.75)",
                      marginBottom: 32, fontWeight: 300
                    }}>
                      {currentModule.content.intro}
                    </p>

                    {currentModule.content.sections.map((section, i) => (
                      <div key={i} style={{
                        marginBottom: 28,
                        animation: `slideIn 0.4s ease ${i * 0.1}s both`
                      }}>
                        <h3 style={{
                          fontSize: 18, fontWeight: 600, marginBottom: 10,
                          color: "#fff", letterSpacing: "-0.01em",
                          display: "flex", alignItems: "center", gap: 10
                        }}>
                          <span style={{
                            width: 3, height: 20, borderRadius: 2,
                            background: "linear-gradient(180deg, #00e096, #00b4d8)",
                            flexShrink: 0
                          }} />
                          {section.heading}
                        </h3>
                        <p style={{
                          fontSize: 15, lineHeight: 1.75, color: "rgba(255,255,255,0.6)",
                          paddingLeft: 13, fontWeight: 300
                        }}>
                          {section.text}
                        </p>
                      </div>
                    ))}

                    {/* Key Takeaway */}
                    <div style={{
                      background: "linear-gradient(135deg, rgba(0,224,150,0.06), rgba(0,180,216,0.04))",
                      border: "1px solid rgba(0,224,150,0.15)",
                      borderRadius: 14, padding: "22px 24px", marginTop: 36, marginBottom: 32
                    }}>
                      <div style={{
                        fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                        letterSpacing: "0.1em", color: "#00e096", marginBottom: 8
                      }}>💡 Key Takeaway</div>
                      <p style={{
                        fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,0.8)",
                        fontFamily: "'Instrument Serif', Georgia, serif",
                        fontStyle: "italic"
                      }}>
                        {currentModule.content.keyTakeaway}
                      </p>
                    </div>

                    <button
                      onClick={() => setShowQuiz(true)}
                      style={{
                        background: "linear-gradient(135deg, #00e096 0%, #00b4d8 100%)",
                        border: "none", borderRadius: 12, padding: "16px 32px",
                        color: "#0a1628", fontSize: 16, fontWeight: 700, cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                        transition: "transform 0.15s, box-shadow 0.15s",
                        boxShadow: "0 4px 20px rgba(0, 224, 150, 0.25)"
                      }}
                      onMouseEnter={(e) => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 6px 28px rgba(0, 224, 150, 0.35)"; }}
                      onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 20px rgba(0, 224, 150, 0.25)"; }}
                    >
                      Take the Quiz →
                    </button>
                  </div>
                ) : (
                  /* Quiz */
                  <div style={{ animation: "fadeIn 0.4s ease" }}>
                    <div style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 16, padding: "32px 28px"
                    }}>
                      <div style={{
                        fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                        letterSpacing: "0.1em", color: "rgba(255,255,255,0.35)", marginBottom: 16
                      }}>Knowledge Check</div>
                      <h3 style={{
                        fontSize: 20, fontWeight: 500, lineHeight: 1.45, marginBottom: 24,
                        letterSpacing: "-0.01em"
                      }}>
                        {currentModule.quiz.question}
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {currentModule.quiz.options.map((option, i) => {
                          const isSelected = selectedAnswer === i;
                          const isCorrect = i === currentModule.quiz.correct;
                          let bg = "rgba(255,255,255,0.03)";
                          let border = isSelected ? "rgba(0,224,150,0.4)" : "rgba(255,255,255,0.08)";
                          let textColor = "rgba(255,255,255,0.75)";

                          if (quizSubmitted) {
                            if (isCorrect) {
                              bg = "rgba(0,224,150,0.1)";
                              border = "rgba(0,224,150,0.4)";
                              textColor = "#00e096";
                            } else if (isSelected && !isCorrect) {
                              bg = "rgba(255,80,80,0.08)";
                              border = "rgba(255,80,80,0.3)";
                              textColor = "rgba(255,120,120,0.9)";
                            }
                          }

                          return (
                            <button
                              key={i}
                              onClick={() => !quizSubmitted && setSelectedAnswer(i)}
                              disabled={quizSubmitted}
                              style={{
                                background: bg,
                                border: `1px solid ${border}`,
                                borderRadius: 12, padding: "16px 18px",
                                color: textColor, fontSize: 15, textAlign: "left",
                                cursor: quizSubmitted ? "default" : "pointer",
                                transition: "all 0.2s",
                                fontFamily: "'DM Sans', sans-serif",
                                display: "flex", alignItems: "center", gap: 12, lineHeight: 1.45
                              }}
                            >
                              <span style={{
                                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                                border: `2px solid ${isSelected ? "#00e096" : "rgba(255,255,255,0.15)"}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 12, fontWeight: 600,
                                background: isSelected ? "rgba(0,224,150,0.15)" : "transparent",
                                color: isSelected ? "#00e096" : "rgba(255,255,255,0.3)"
                              }}>
                                {String.fromCharCode(65 + i)}
                              </span>
                              {option}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div style={{
                          marginTop: 20, padding: "16px 18px",
                          background: "rgba(0,224,150,0.06)",
                          border: "1px solid rgba(0,224,150,0.12)",
                          borderRadius: 10, animation: "fadeIn 0.3s ease"
                        }}>
                          <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,255,255,0.7)" }}>
                            {currentModule.quiz.explanation}
                          </p>
                        </div>
                      )}

                      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                        {!quizSubmitted ? (
                          <button
                            onClick={handleQuizSubmit}
                            disabled={selectedAnswer === null}
                            style={{
                              background: selectedAnswer !== null ? "linear-gradient(135deg, #00e096 0%, #00b4d8 100%)" : "rgba(255,255,255,0.08)",
                              border: "none", borderRadius: 10, padding: "14px 28px",
                              color: selectedAnswer !== null ? "#0a1628" : "rgba(255,255,255,0.3)",
                              fontSize: 15, fontWeight: 700, cursor: selectedAnswer !== null ? "pointer" : "not-allowed",
                              fontFamily: "'DM Sans', sans-serif",
                              transition: "all 0.2s"
                            }}
                          >
                            Check Answer
                          </button>
                        ) : (
                          <button
                            onClick={handleNext}
                            style={{
                              background: "linear-gradient(135deg, #00e096 0%, #00b4d8 100%)",
                              border: "none", borderRadius: 10, padding: "14px 28px",
                              color: "#0a1628", fontSize: 15, fontWeight: 700, cursor: "pointer",
                              fontFamily: "'DM Sans', sans-serif",
                              boxShadow: "0 4px 20px rgba(0, 224, 150, 0.25)",
                              transition: "transform 0.15s"
                            }}
                            onMouseEnter={(e) => e.target.style.transform = "translateY(-1px)"}
                            onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                          >
                            {activeModule < COURSE_DATA.modules.length - 1 ? "Next Module →" : "Complete Course 🎉"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
