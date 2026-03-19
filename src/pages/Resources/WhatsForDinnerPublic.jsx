import { useState, useEffect, useRef } from "react";

// ── DATA ────────────────────────────────────────────────────────────────────

const PROTEINS = [
  "🥩 Steak", "🍗 Chicken", "🐟 Salmon", "🥓 Bacon", "🌮 Carnitas",
  "🍖 Ribs", "🦐 Shrimp", "🥚 Eggs", "🐷 Pork Chops", "🦆 Duck",
  "🥩 Ground Beef", "🐟 Tuna", "🌱 Tofu", "🫘 Lentils", "🍥 Scallops",
  "🦞 Lobster", "🐔 Turkey", "🥩 Lamb",
];

const CUISINES = [
  "🇮🇹 Italian", "🇲🇽 Mexican", "🇯🇵 Japanese", "🇨🇳 Chinese",
  "🇮🇳 Indian", "🇺🇸 American", "🇹🇭 Thai", "🇬🇷 Greek",
  "🇫🇷 French", "🇰🇷 Korean", "🇻🇳 Vietnamese", "🫕 Comfort Food",
  "🌍 Mediterranean", "🇧🇧 Caribbean", "🇲🇦 Moroccan", "🇧🇷 Brazilian",
];

const SIDES = [
  "🍟 Fries", "🥗 Caesar Salad", "🥦 Roasted Broccoli", "🍚 White Rice",
  "🥔 Mashed Potatoes", "🍞 Garlic Bread", "🧀 Mac & Cheese", "🌽 Corn on Cob",
  "🍠 Sweet Potato", "🥗 Garden Salad", "🍝 Pasta", "🧇 Onion Rings",
  "🫘 Black Beans", "🥙 Coleslaw", "🥒 Pickles & Slaw", "🍄 Sautéed Mushrooms",
];

const RESTAURANT_TYPES = [
  { name: "Sushi Bar", desc: "Fresh rolls & sashimi", emoji: "🍣", vibe: "Light & Fresh" },
  { name: "Steakhouse", desc: "Cuts, sides & cocktails", emoji: "🥩", vibe: "Date Night" },
  { name: "Pizza Place", desc: "Slices, pies & calzones", emoji: "🍕", vibe: "Casual Fave" },
  { name: "Mexican Spot", desc: "Tacos, burritos & margs", emoji: "🌮", vibe: "Family-Friendly" },
  { name: "Burger Joint", desc: "Smash patties & shakes", emoji: "🍔", vibe: "Quick & Satisfying" },
  { name: "Thai Restaurant", desc: "Curries, noodles & spring rolls", emoji: "🍜", vibe: "Flavorful & Cozy" },
  { name: "Indian Buffet", desc: "Curry, naan & biryani", emoji: "🍛", vibe: "Feast Mode" },
  { name: "Italian Bistro", desc: "Pasta, wine & tiramisu", emoji: "🍝", vibe: "Classic & Romantic" },
  { name: "BBQ Smokehouse", desc: "Brisket, ribs & cornbread", emoji: "🍖", vibe: "Messy & Delicious" },
  { name: "Chinese Takeout", desc: "Dumplings, lo mein & fried rice", emoji: "🥡", vibe: "Couch Night" },
  { name: "Mediterranean", desc: "Hummus, kebabs & pita", emoji: "🧆", vibe: "Light & Healthy" },
  { name: "Ramen Shop", desc: "Broth, noodles & soft egg", emoji: "🍜", vibe: "Warm Your Soul" },
];

// ── SLOT COLUMN ──────────────────────────────────────────────────────────────

function SlotColumn({ items, spinning, finalIndex, delay = 0, accentColor }) {
  const [displayIndex, setDisplayIndex] = useState(0);
  const intervalRef = useRef(null);
  const stoppedRef = useRef(false);

  useEffect(() => {
    stoppedRef.current = false;
    if (spinning) {
      intervalRef.current = setInterval(() => {
        if (!stoppedRef.current) {
          setDisplayIndex(i => (i + 1) % items.length);
        }
      }, 75);
    } else {
      const t = setTimeout(() => {
        clearInterval(intervalRef.current);
        stoppedRef.current = true;
        setDisplayIndex(finalIndex);
      }, delay);
      return () => clearTimeout(t);
    }
    return () => clearInterval(intervalRef.current);
  }, [spinning]);

  const prev = (displayIndex - 1 + items.length) % items.length;
  const next = (displayIndex + 1) % items.length;

  return (
    <div style={{
      flex: 1,
      height: "150px",
      overflow: "hidden",
      position: "relative",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${accentColor}30`,
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(to bottom, #111827 18%, transparent 40%, transparent 60%, #111827 82%)`,
        zIndex: 2, pointerEvents: "none",
      }} />
      <div style={{
        height: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "6px",
      }}>
        <div style={{ opacity: 0.25, fontSize: "10px", color: "#ccc", textAlign: "center", padding: "0 6px", lineHeight: 1.3 }}>
          {items[prev]}
        </div>
        <div style={{
          fontSize: "12px", color: "#fff", fontWeight: "700",
          textAlign: "center", padding: "8px 6px",
          background: `${accentColor}18`,
          borderRadius: "8px",
          border: `1px solid ${accentColor}50`,
          width: "calc(100% - 12px)",
          boxSizing: "border-box",
          minHeight: "52px",
          display: "flex", alignItems: "center", justifyContent: "center",
          lineHeight: 1.3,
        }}>
          {items[displayIndex]}
        </div>
        <div style={{ opacity: 0.25, fontSize: "10px", color: "#ccc", textAlign: "center", padding: "0 6px", lineHeight: 1.3 }}>
          {items[next]}
        </div>
      </div>
    </div>
  );
}

// ── RESTAURANT CARD ──────────────────────────────────────────────────────────

function RestaurantCard({ r, selected, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: selected ? "rgba(99,205,140,0.15)" : "rgba(255,255,255,0.03)",
      border: selected ? "2px solid #63cd8c" : "2px solid rgba(255,255,255,0.08)",
      borderRadius: "16px", padding: "14px 12px",
      cursor: "pointer", transition: "all 0.2s ease",
      transform: selected ? "scale(1.03)" : "scale(1)",
    }}>
      <div style={{ fontSize: "26px", marginBottom: "6px" }}>{r.emoji}</div>
      <div style={{ color: "#fff", fontWeight: "700", fontSize: "13px", fontFamily: "'Syne', sans-serif", lineHeight: 1.2 }}>{r.name}</div>
      <div style={{ color: selected ? "#63cd8c" : "rgba(255,255,255,0.4)", fontSize: "11px", marginTop: "4px", lineHeight: 1.3 }}>{r.desc}</div>
      <div style={{
        display: "inline-block", marginTop: "6px",
        background: selected ? "rgba(99,205,140,0.2)" : "rgba(255,255,255,0.06)",
        borderRadius: "20px", padding: "2px 8px",
        fontSize: "10px", color: selected ? "#63cd8c" : "rgba(255,255,255,0.35)",
        fontWeight: "600", letterSpacing: "0.5px",
      }}>{r.vibe}</div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────

export default function WhatsForDinnerPublic() {
  const [phase, setPhase] = useState("start");
  const [mode, setMode] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [results, setResults] = useState({ protein: 0, cuisine: 0, side: 0 });
  const [spinKey, setSpinKey] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restSpinning, setRestSpinning] = useState(false);
  const [restResult, setRestResult] = useState(null);
  const [restSpinEmoji, setRestSpinEmoji] = useState("🍕");

  const spinMeals = () => {
    setSpinning(true);
    setShowResult(false);
    setPhase("spinning");
    setSpinKey(k => k + 1);
    setTimeout(() => {
      const r = {
        protein: Math.floor(Math.random() * PROTEINS.length),
        cuisine: Math.floor(Math.random() * CUISINES.length),
        side: Math.floor(Math.random() * SIDES.length),
      };
      setResults(r);
      setSpinning(false);
      setTimeout(() => { setShowResult(true); setPhase("result"); }, 700);
    }, 2400);
  };

  const spinRestaurant = () => {
    setRestSpinning(true);
    setRestResult(null);
    let i = 0;
    const interval = setInterval(() => {
      setRestSpinEmoji(RESTAURANT_TYPES[i % RESTAURANT_TYPES.length].emoji);
      i++;
    }, 120);
    setTimeout(() => {
      clearInterval(interval);
      const r = RESTAURANT_TYPES[Math.floor(Math.random() * RESTAURANT_TYPES.length)];
      setRestResult(r);
      setRestSpinEmoji(r.emoji);
      setRestSpinning(false);
    }, 2200);
  };

  const reset = () => {
    setPhase("start"); setMode(null); setSpinning(false);
    setShowResult(false); setSelectedRestaurant(null);
    setRestResult(null); setRestSpinning(false);
  };

  const ACCENT = "#f97316"; // warm orange
  const ACCENT2 = "#63cd8c"; // mint green

  return (
    <div style={{
      minHeight: "100vh",
      background: "#111827",
      fontFamily: "'DM Sans', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingBottom: "60px",
      position: "relative",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes bounce-in {
          0% { transform: scale(0.7) translateY(30px); opacity: 0; }
          60% { transform: scale(1.08) translateY(-6px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes shimmer-bg {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pop {
          0% { transform: scale(0.85); opacity: 0; }
          70% { transform: scale(1.04); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .bounce-in { animation: bounce-in 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .pop { animation: pop 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .float { animation: float 3.5s ease-in-out infinite; }
        .wiggle { animation: wiggle 0.6s ease-in-out infinite; }
        .mode-btn { transition: all 0.2s ease; }
        .mode-btn:hover { transform: translateY(-3px); }
        .mode-btn:active { transform: scale(0.97); }
        .spin-btn:active { transform: scale(0.96) !important; }
      `}</style>

      {/* Subtle grid bg */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Glowing orbs */}
      <div style={{ position: "fixed", top: "-80px", right: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-60px", left: "-60px", width: "250px", height: "250px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,205,140,0.1) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Header */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "44px 24px 20px" }}>
        <div className="float" style={{ fontSize: "52px", marginBottom: "10px", display: "inline-block" }}>🎰</div>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(30px, 9vw, 44px)",
          fontWeight: "800",
          margin: 0,
          background: `linear-gradient(135deg, #f97316, #fbbf24, #f97316)`,
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "gradient-shift 4s ease infinite",
        }}>
          What's for Dinner?
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.4)",
          marginTop: "8px", fontSize: "13px",
          letterSpacing: "0.5px",
        }}>
          Stop stressing. Let fate decide. 🍴
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: "430px", padding: "0 20px", position: "relative", zIndex: 1 }}>

        {/* ── START: Choose mode ── */}
        {phase === "start" && (
          <div className="bounce-in" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "6px", fontWeight: "500" }}>
              Where are you eating tonight?
            </div>

            {[
              {
                key: "home",
                emoji: "🏠",
                title: "Cooking at Home",
                sub: "Spin protein, cuisine & side dish",
                gradient: "linear-gradient(135deg, #f97316, #fb923c)",
                glow: "rgba(249,115,22,0.35)",
              },
              {
                key: "out",
                emoji: "🚗",
                title: "Going Out",
                sub: "Discover what type of restaurant fits the vibe",
                gradient: "linear-gradient(135deg, #63cd8c, #34d399)",
                glow: "rgba(99,205,140,0.35)",
              },
            ].map(opt => (
              <button key={opt.key} className="mode-btn" onClick={() => {
                setMode(opt.key);
                if (opt.key === "home") spinMeals();
                else setPhase("restaurants");
              }} style={{
                background: "rgba(255,255,255,0.04)",
                border: "2px solid rgba(255,255,255,0.1)",
                borderRadius: "22px",
                padding: "22px 20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "18px",
                textAlign: "left",
                boxShadow: "none",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = opt.key === "home" ? "#f97316" : "#63cd8c";
                  e.currentTarget.style.boxShadow = `0 8px 30px ${opt.glow}`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: "56px", height: "56px", borderRadius: "16px",
                  background: opt.gradient,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "26px", flexShrink: 0,
                  boxShadow: `0 4px 16px ${opt.glow}`,
                }}>
                  {opt.emoji}
                </div>
                <div>
                  <div style={{ color: "#fff", fontWeight: "700", fontSize: "17px", fontFamily: "'Syne', sans-serif" }}>{opt.title}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: "3px" }}>{opt.sub}</div>
                </div>
                <div style={{ marginLeft: "auto", color: "rgba(255,255,255,0.2)", fontSize: "20px" }}>›</div>
              </button>
            ))}

            {/* Footer tagline */}
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "11px", marginTop: "10px", letterSpacing: "1px" }}>
              THE DINNER DECIDER · MADE WITH ❤️
            </div>
          </div>
        )}

        {/* ── SPINNING / RESULT: Home meal ── */}
        {(phase === "spinning" || phase === "result") && mode === "home" && (
          <div>
            {/* Slot machine */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(249,115,22,0.2)",
              borderRadius: "24px",
              padding: "20px 16px 24px",
              marginBottom: "18px",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Top glow line */}
              <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "2px", background: "linear-gradient(90deg, transparent, #f97316, transparent)", borderRadius: "1px" }} />

              <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                {[
                  { label: "PROTEIN", color: "#f97316" },
                  { label: "CUISINE", color: "#fbbf24" },
                  { label: "SIDE", color: "#63cd8c" },
                ].map(col => (
                  <div key={col.label} style={{
                    flex: 1, textAlign: "center", fontSize: "9px",
                    letterSpacing: "1.5px", color: col.color,
                    textTransform: "uppercase", fontWeight: "700",
                  }}>{col.label}</div>
                ))}
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <SlotColumn key={`p-${spinKey}`} items={PROTEINS} spinning={spinning} finalIndex={results.protein} delay={0} accentColor="#f97316" />
                <SlotColumn key={`c-${spinKey}`} items={CUISINES} spinning={spinning} finalIndex={results.cuisine} delay={220} accentColor="#fbbf24" />
                <SlotColumn key={`s-${spinKey}`} items={SIDES} spinning={spinning} finalIndex={results.side} delay={440} accentColor="#63cd8c" />
              </div>

              {/* Spinning indicator */}
              {spinning && (
                <div style={{ textAlign: "center", marginTop: "14px", color: "rgba(255,255,255,0.35)", fontSize: "12px", letterSpacing: "2px" }}>
                  <span className="wiggle" style={{ display: "inline-block" }}>🎲</span> SPINNING...
                </div>
              )}
            </div>

            {/* Result reveal */}
            {showResult && (
              <div className="pop" style={{
                background: "linear-gradient(135deg, rgba(249,115,22,0.14), rgba(251,191,36,0.1))",
                border: "2px solid rgba(249,115,22,0.45)",
                borderRadius: "22px",
                padding: "22px",
                textAlign: "center",
                marginBottom: "18px",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: "-20px", left: "50%", transform: "translateX(-50%)", fontSize: "60px", opacity: 0.06 }}>🍽️</div>
                <div style={{
                  fontSize: "11px", letterSpacing: "2.5px",
                  color: "#f97316", textTransform: "uppercase",
                  marginBottom: "12px", fontWeight: "700",
                }}>
                  🎉 Tonight You're Having
                </div>
                <div style={{
                  fontSize: "clamp(18px, 5vw, 24px)",
                  color: "#fff",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: "800",
                  lineHeight: 1.3,
                }}>
                  {CUISINES[results.cuisine].split(" ").slice(1).join(" ")} {PROTEINS[results.protein].split(" ").slice(1).join(" ")}
                </div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", marginTop: "8px" }}>
                  with {SIDES[results.side].split(" ").slice(1).join(" ")}
                </div>
                <div style={{ marginTop: "14px", display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap" }}>
                  {[PROTEINS[results.protein].split(" ")[0], CUISINES[results.cuisine].split(" ")[0], SIDES[results.side].split(" ")[0]].map((e, i) => (
                    <span key={i} style={{ fontSize: "28px" }}>{e}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              {showResult && (
                <button className="spin-btn" onClick={spinMeals} style={{
                  flex: 1,
                  background: "linear-gradient(135deg, #f97316, #fbbf24)",
                  border: "none", borderRadius: "16px", padding: "16px",
                  color: "#111827", fontWeight: "800", fontSize: "15px",
                  cursor: "pointer", fontFamily: "'Syne', sans-serif",
                  boxShadow: "0 4px 20px rgba(249,115,22,0.4)",
                }}>
                  🎰 Spin Again
                </button>
              )}
              <button onClick={reset} style={{
                flex: showResult ? "0 0 90px" : 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "16px", padding: "16px",
                color: "rgba(255,255,255,0.6)", fontWeight: "600",
                fontSize: "14px", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}>
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* ── RESTAURANTS ── */}
        {phase === "restaurants" && (
          <div>
            {/* Random pick button */}
            <div style={{
              background: "rgba(99,205,140,0.06)",
              border: "1px solid rgba(99,205,140,0.2)",
              borderRadius: "22px",
              padding: "20px",
              marginBottom: "20px",
              textAlign: "center",
            }}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginBottom: "14px" }}>
                Can't decide? Let the app pick a restaurant type for you.
              </div>

              <button className="spin-btn" onClick={spinRestaurant} style={{
                width: "100%",
                background: "linear-gradient(135deg, #63cd8c, #34d399)",
                border: "none", borderRadius: "16px", padding: "18px",
                color: "#0a2a18", fontWeight: "800", fontSize: "17px",
                cursor: "pointer", fontFamily: "'Syne', sans-serif",
                boxShadow: "0 4px 20px rgba(99,205,140,0.35)",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "10px",
              }}>
                {restSpinning
                  ? <><span className="wiggle" style={{ display: "inline-block", fontSize: "22px" }}>{restSpinEmoji}</span> Deciding...</>
                  : <><span>🎲</span> Pick a Restaurant Type</>
                }
              </button>

              {restResult && !restSpinning && (
                <div className="pop" style={{
                  marginTop: "16px",
                  background: "linear-gradient(135deg, rgba(99,205,140,0.18), rgba(52,211,153,0.1))",
                  border: "2px solid rgba(99,205,140,0.5)",
                  borderRadius: "18px",
                  padding: "20px",
                }}>
                  <div style={{ fontSize: "44px", marginBottom: "8px" }}>{restResult.emoji}</div>
                  <div style={{ color: "#63cd8c", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: "700" }}>Tonight's Pick</div>
                  <div style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: "800", fontSize: "22px", marginTop: "6px" }}>{restResult.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "4px" }}>{restResult.desc}</div>
                  <div style={{
                    display: "inline-block", marginTop: "10px",
                    background: "rgba(99,205,140,0.2)", borderRadius: "20px",
                    padding: "4px 12px", fontSize: "11px", color: "#63cd8c", fontWeight: "700",
                  }}>
                    {restResult.vibe}
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>or browse</div>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            </div>

            {/* Restaurant grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "18px" }}>
              {RESTAURANT_TYPES.map((r, i) => (
                <RestaurantCard
                  key={i}
                  r={r}
                  selected={selectedRestaurant?.name === r.name}
                  onClick={() => setSelectedRestaurant(selectedRestaurant?.name === r.name ? null : r)}
                />
              ))}
            </div>

            {/* Selected reveal */}
            {selectedRestaurant && (
              <div className="pop" style={{
                background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(251,191,36,0.1))",
                border: "2px solid #f97316",
                borderRadius: "20px", padding: "20px",
                textAlign: "center", marginBottom: "16px",
              }}>
                <div style={{ fontSize: "40px" }}>{selectedRestaurant.emoji}</div>
                <div style={{ color: "#f97316", fontFamily: "'Syne', sans-serif", fontWeight: "800", fontSize: "18px", marginTop: "8px" }}>
                  Decision Made!
                </div>
                <div style={{ color: "#fff", fontWeight: "700", fontSize: "20px", marginTop: "4px" }}>{selectedRestaurant.name}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", marginTop: "4px" }}>{selectedRestaurant.desc}</div>
              </div>
            )}

            <button onClick={reset} style={{
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "16px", padding: "16px",
              color: "rgba(255,255,255,0.6)", fontWeight: "600",
              fontSize: "14px", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              ← Start Over
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
