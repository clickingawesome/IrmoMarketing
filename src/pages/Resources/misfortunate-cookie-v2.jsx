import { useState, useEffect, useCallback, useRef } from "react";

const F = [
  "Your soulmate is currently swiping left on you.",
  "You will step in something unidentifiable before noon tomorrow.",
  "The WiFi will be weakest wherever you sit.",
  "Your next haircut will be a conversation piece — but not in a good way.",
  "Someone is thinking about you. Unfortunately, it's your dentist.",
  "You will reply-all to something devastating this quarter.",
  "The parking spot you just passed was the last one.",
  "Your phone will die at the worst possible moment. Again.",
  "You will wave back at someone who wasn't waving at you.",
  "Your leftovers in the office fridge have already been claimed.",
  "A bird has your car in its sights today.",
  "You will confidently walk in the wrong direction for two blocks.",
  "Your next Amazon package will arrive after you no longer need it.",
  "Someone just screenshotted your text and sent it to the group chat.",
  "The elevator will close just as you approach. Every time.",
  "You will accidentally like a photo from 2017 while stalking.",
  "Your umbrella is at home. It will rain.",
  "The vending machine will eat your dollar and keep your snack.",
  "You will say 'you too' when the waiter says 'enjoy your meal.'",
  "Your charger cable has three good months left. Maybe two.",
  "A meeting that could've been an email is in your very near future.",
  "You will push a pull door in front of someone attractive.",
  "Your GPS will reroute you into a worse situation.",
  "The thing you're looking for is in the last place you'd think to look. Literally the last.",
  "You will discover a typo in an important email five seconds after sending it.",
  "Your next sneeze will happen during a quiet moment.",
  "Someone will tell you that you look tired when you feel great.",
  "The ice cream truck will drive past without stopping.",
  "Your headphones will snag on a doorknob at maximum velocity.",
  "You will burn the roof of your mouth on something you were warned was hot.",
  "A software update will break something you relied on.",
  "Your pen will run out mid-signature on something important.",
  "You will remember a perfect comeback three hours too late.",
  "The line you're not in will always move faster.",
  "Your toast will land butter-side down. It's physics, not luck.",
  "You will pocket-dial someone at the worst possible time.",
  "The avocado you bought will go from rock to rotten overnight.",
  "You will be overdressed or underdressed. Never just dressed.",
  "Your autocorrect will humiliate you in a professional setting.",
  "A pigeon will make eye contact and choose violence.",
  "The bathroom stall you pick will be out of toilet paper.",
  "You will trip on absolutely nothing in front of witnesses.",
  "Your food delivery driver is currently lost.",
  "The person ahead of you in line will have 47 coupons.",
  "You will say something weird and replay it mentally for 6 years.",
  "Your sock will slowly slide down inside your shoe all day.",
  "A zipper will betray you at a critical moment.",
  "The printer will jam the moment your deadline arrives.",
  "You will forget why you walked into a room at least twice today.",
  "Your New Year's resolution has an expiration date of January 12th.",
  "Someone will spoil the show you were about to watch.",
  "The checkout lane you choose will develop technical difficulties.",
  "Your next yawn will happen during someone's important story.",
  "You will misjudge the last step on a staircase.",
  "The fitted sheet will defeat you again tonight.",
  "Your phone screen will crack in a way that's juuust usable enough to not replace.",
  "You will hold a door for someone who's way too far away.",
  "A fly will find your drink before you do.",
  "The shirt you want to wear is in the laundry. Always.",
  "You will accidentally send a half-finished text to the wrong person.",
  "Your next online purchase will look nothing like the photo.",
  "A coworker will microwave fish in the office kitchen today.",
  "You will sneeze and nobody will say bless you.",
  "The sticker on your new purchase will leave residue forever.",
  "Your next Zoom call will feature an unmuted embarrassment.",
  "You will realize your shirt was inside out at 4 PM.",
  "The tangled earbuds in your pocket have formed a new knot species.",
  "You will be the last to get the joke.",
  "Your next photo will capture you mid-blink.",
  "Someone will eat the last slice you were saving.",
  "The 'close door' button on the elevator does absolutely nothing.",
  "You will Google something and forget to open an incognito window.",
  "Your neighbor will mow the lawn at 7 AM on Saturday.",
  "A shopping cart with one wobbly wheel awaits you.",
  "You will sit in something mysterious on public transit.",
  "The thing you just bought will go on sale tomorrow.",
  "Your horoscope was accurate today. Unfortunately.",
  "You will put on mismatched socks and not notice until 2 PM.",
  "A spam caller will reach you during the one call you were expecting.",
  "The movie you want to watch just left streaming.",
  "You will walk into a spiderweb face-first in the near future.",
  "Your next sneeze will be a multi-sneeze event with no end in sight.",
  "Someone will ask 'Are you okay?' and you'll realize you look terrible.",
  "The USB will take three tries to plug in. As is tradition.",
  "Your plants are judging your watering schedule.",
  "You will accidentally join a video call with your camera on.",
  "The weather app lied to you and your outfit proves it.",
  "You will lock your keys in the car on a day you're already late.",
  "A seagull is currently planning a heist on your lunch.",
  "Your password will be wrong on the first three attempts. It was right the first time.",
  "You will bite your tongue while eating something soft.",
  "The group project will be carried entirely by you. Again.",
  "Your alarm will not go off on the one day it matters.",
  "A revolving door will challenge your spatial reasoning.",
  "You will discover a stain on your shirt after the presentation.",
  "The person behind you in line will stand uncomfortably close.",
  "Your next high-five will miss and become a hand-grab.",
  "You will stub your toe on furniture that hasn't moved in years.",
  "Someone will ask you to help them move this weekend.",
  "The buffet will run out of the one thing you came for.",
  "Your phone will autocorrect a name in a way that starts drama.",
  "You will confidently give wrong directions to a stranger.",
  "A motion-sensor light will not detect you. You are a ghost now.",
  "Your next attempt at small talk will achieve new levels of awkward.",
  "The store will be closed when you arrive. Yes, you checked the hours.",
  "You will drop your phone on your face while lying in bed.",
  "Your earbuds will die right before the best part of the song.",
  "A surprise expense is lurking in next month's bank statement.",
  "You will accidentally text your boss what you meant for your friend.",
  "The elevator music will be stuck in your head for 72 hours.",
  "Your chair will make a noise that sounds like a fart. No one will believe you.",
  "You will try to be spontaneous and it will backfire spectacularly.",
  "Someone will pronounce your name wrong in front of a crowd.",
  "The thing you assembled will have one screw left over.",
  "Your next 'quick errand' will take two hours.",
  "A glass of water is destined to spill on something electronic.",
  "You will hit every red light on your commute tomorrow.",
  "The public restroom soap dispenser will be empty.",
  "Your new white shirt's first outing will involve pasta sauce.",
  "You will accidentally like and then unlike someone's post at 2 AM.",
  "The package says 'easy open.' It lies.",
  "You will develop a mysterious itch in a place you can't scratch in public.",
  "Someone will stand in the exact spot you need to be.",
  "Your cooking will set off the smoke alarm but not be fully cooked.",
  "The self-checkout machine will need attendant assistance. For you. Only you.",
  "You will wave goodbye and then walk in the same direction as the person.",
  "A paper cut is in your immediate future.",
  "Your next compliment will accidentally sound like an insult.",
  "The ice in your drink will conspire to splash your face.",
  "You will show up to a party on the wrong day.",
  "Your sock drawer has given up on matching.",
  "A bug will fly directly into your mouth mid-conversation.",
  "You will realize you've been on mute for the past five minutes.",
  "The milk in your fridge has a surprise expiration date.",
  "Your umbrella will invert at the worst possible gust.",
  "Someone will start a sentence with 'No offense, but...'",
  "You will drop food on the only part of your shirt people can see.",
  "The shipping label says 'fragile.' The delivery driver cannot read.",
  "Your next attempt at parallel parking will have an audience.",
  "You will accidentally ghost someone by forgetting to reply for 3 weeks.",
  "A hangnail is forming as you read this.",
  "The restaurant will be out of what you wanted. You saw someone else order it.",
  "You will realize mid-story that nobody is listening.",
  "Your next selfie will have something unfortunate in the background.",
  "The scale will deliver news you weren't prepared for.",
  "You will spend 20 minutes looking for your sunglasses. They're on your head.",
  "A pop quiz is coming. Not in school. In life.",
  "Your bed will feel most comfortable 5 minutes before your alarm.",
  "The gas pump will click off at $50.01.",
  "You will accidentally call your teacher 'mom' as an adult somehow.",
  "Someone will point out something you can't unsee.",
  "Your fortune cookie is ironic. This one, specifically.",
  "You will try to catch something falling and make it worse.",
  "The Bluetooth will connect to the wrong speaker at the wrong time.",
  "Your secret snack stash has been discovered.",
  "A bird will sing outside your window at 4:47 AM. Just for you.",
  "You will spend the next hour in a Wikipedia rabbit hole.",
  "The 'quick phone call' will last 47 minutes.",
  "You will accidentally use someone's name wrong and it's too late to fix.",
  "Your shopping bag will rip in the parking lot. The eggs are in that one.",
  "A mosquito has already filed a flight plan to your ankle.",
  "You will open the fridge three times hoping something new will appear.",
  "The book you need is checked out by someone who won't return it.",
  "You will sit on your sunglasses. It's almost a tradition now.",
  "A plot twist in your life is loading. Buffering... buffering...",
  "Your next attempt at DIY will require a professional to fix.",
  "You will start a diet on Monday. It's always Monday.",
  "Someone is about to 'per my last email' you.",
  "The pen you borrowed will explode in your pocket.",
  "You will nod confidently while understanding absolutely nothing.",
  "Your laundry will sit in the dryer for three days. You know this.",
  "A coworker will take the last coffee and not make a new pot.",
  "You will accidentally make eye contact with a stranger for too long.",
  "The coupon you saved expired yesterday.",
  "Your jeans from last year have a different opinion about your waistline.",
  "You will Google your symptoms and convince yourself of the worst.",
  "A squirrel will judge you from a tree today.",
  "You will forget someone's name mid-introduction. Classic you.",
  "The restaurant will lose your reservation. You triple-confirmed it.",
  "Your next 'I'll remember this without writing it down' will fail.",
  "A puddle will be deeper than it appears.",
  "You will confidently answer a rhetorical question.",
  "Your neighbor's dog has opinions about you. They are not favorable.",
  "The thing you just cleaned will immediately get dirty again.",
  "You will try to take a candid photo and look like a potato.",
  "Someone will chew loudly near you during a crucial thinking moment.",
  "Your next 'quick nap' will be three hours.",
  "The wifi password will have a zero that looks like an O.",
  "You will hold in a yawn so hard your eyes water.",
  "A pen lid will go missing and never be found.",
  "Your neighbor will start renovations. On a Sunday morning.",
  "You will try to be cool and immediately fumble something.",
  "The fortune you wanted was in the other cookie.",
  "Someone will leave you on 'read' for an uncomfortable duration.",
  "Your garden is losing the war against weeds.",
  "You will mispronounce a common word in front of an expert.",
  "A traffic jam awaits you on a road you thought was a shortcut.",
  "Your voicemail will cut you off mid-word.",
  "The ice cream scoop will fall off the cone within 30 seconds.",
  "You will tell a joke that gets zero laughs and maximum silence.",
  "Your coat pocket has a hole. Your keys know about it.",
  "A candle will drip wax on something it shouldn't.",
  "You will read an email wrong and panic unnecessarily.",
  "The 'one size fits all' will fit nobody, especially you.",
  "Someone will use your mug at the office. You will never recover.",
  "Your shoe will come untied at the top of a staircase.",
  "A confetti cannon will malfunction in your direction someday.",
  "Your next airport security check will be extra thorough.",
  "You will pour cereal before realizing there's no milk.",
  "The thing you fixed will break again in a creative new way.",
  "Your laugh will come out weird at the worst time.",
  "A glitter bomb from a past event still lives in your car.",
  "You will misread a text and create unnecessary drama.",
  "The song stuck in your head will be one you hate.",
  "Your future holds a very long hold time with customer service.",
  "You will lean on something that isn't sturdy.",
  "Someone will eat your clearly labeled lunch.",
  "Your sunscreen will miss one specific spot. You'll know which one tomorrow.",
  "A revolving door will make you question your own intelligence.",
  "The recipe said 'easy' but your kitchen says otherwise.",
  "You will discover you've been sitting on a crumb for an hour.",
  "Your indoor voice will accidentally become your outdoor voice.",
  "A bird has selected your freshly washed car for target practice.",
  "You will say 'see you tomorrow' to someone you won't see for months.",
  "The popcorn will burn in the last 3 seconds.",
  "Your next road trip will feature a rest stop with no soap.",
  "You will notice a typo on your resume after 47 applications.",
  "A jacket potato will outsmart you in the microwave.",
  "Someone will borrow something and return it slightly worse.",
  "Your next 'be right back' will be a lie.",
  "The thing you Googled has no satisfying answer.",
  "Your confidence and your competence are in different zip codes today.",
  "You will find a gray hair you weren't emotionally ready for.",
  "A candle you love has been discontinued.",
  "Your future self is embarrassed by something you'll do this week.",
  "The crossword puzzle will defeat you on a Tuesday.",
  "Your sandwich will structurally fail mid-bite.",
  "A surprise bill is composing itself as we speak.",
  "You will walk into a glass door while someone watches.",
  "Your streaming service will buffer at the climax.",
  "Someone will tell you the ending of something you're reading.",
  "You will buy batteries and they'll be the wrong size.",
  "Your shower will go cold at the exact moment you apply shampoo.",
  "A drawer in your kitchen will jam at a critical cooking moment.",
  "You will pronounce 'quinoa' wrong in a restaurant and the waiter will know.",
];

function getLucky(){const s=new Set();while(s.size<6)s.add(Math.floor(Math.random()*99)+1);return[...s].sort((a,b)=>a-b);}

/* ── Realistic fortune cookie SVG ── */
function WholeCookie({ onClick }) {
  return (
    <div onClick={onClick} style={{ cursor:"pointer", position:"relative", userSelect:"none" }}>
      <div style={{ animation:"wobble 3s ease-in-out infinite", transformOrigin:"center bottom" }}>
        <svg viewBox="0 0 260 180" width="280" height="194" style={{ filter:"drop-shadow(0 12px 30px rgba(0,0,0,0.35))" }}>
          <defs>
            <radialGradient id="cg" cx="40%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#F5DEB3"/>
              <stop offset="35%" stopColor="#E8C97A"/>
              <stop offset="70%" stopColor="#D4A843"/>
              <stop offset="100%" stopColor="#B8892B"/>
            </radialGradient>
            <radialGradient id="cg2" cx="55%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#F5E6C8" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#D4A843" stopOpacity="0"/>
            </radialGradient>
            <filter id="inner">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
              <feOffset dx="1" dy="2" result="off"/>
              <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1"/>
              <feFlood floodColor="#8B6914" floodOpacity="0.3"/>
              <feComposite in2="SourceGraphic" operator="in"/>
              <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* Main cookie body — classic folded crescent shape */}
          <path d="
            M 50 130
            C 20 100, 15 60, 60 35
            C 90 15, 130 8, 160 15
            C 200 25, 235 55, 230 90
            C 225 120, 195 145, 160 150
            C 140 152, 130 140, 130 130
            C 130 115, 140 105, 130 100
            C 120 95, 110 105, 110 120
            C 108 135, 95 148, 75 148
            C 60 148, 52 138, 50 130
            Z
          " fill="url(#cg)" stroke="#A07825" strokeWidth="1" filter="url(#inner)"/>
          {/* Highlight sheen */}
          <path d="
            M 70 50
            C 90 30, 140 20, 180 35
            C 200 42, 210 55, 205 70
            C 170 45, 120 35, 70 50
            Z
          " fill="url(#cg2)"/>
          {/* Center fold crease */}
          <path d="M 95 140 C 105 115, 125 105, 135 115 C 140 120, 138 135, 145 142" fill="none" stroke="#A07825" strokeWidth="1.2" opacity="0.5" strokeLinecap="round"/>
          {/* Subtle ridges / texture */}
          <path d="M 60 45 C 80 35, 120 28, 170 30" fill="none" stroke="#C9A84C" strokeWidth="0.7" opacity="0.3"/>
          <path d="M 55 65 C 85 50, 140 42, 200 52" fill="none" stroke="#C9A84C" strokeWidth="0.7" opacity="0.25"/>
          <path d="M 50 90 C 80 75, 150 65, 215 78" fill="none" stroke="#C9A84C" strokeWidth="0.7" opacity="0.2"/>
          {/* Paper slip peeking out from fold */}
          <rect x="105" y="118" width="38" height="6" rx="1" fill="#FFFEF2" opacity="0.85" transform="rotate(-5 124 121)"/>
          <rect x="108" y="120" width="30" height="1" rx="0.5" fill="#D4C5A0" opacity="0.4" transform="rotate(-5 123 120.5)"/>
          {/* Cute face */}
          <circle cx="110" cy="68" r="5" fill="#7A5A1E"/>
          <circle cx="165" cy="58" r="5" fill="#7A5A1E"/>
          <circle cx="111.5" cy="66" r="2" fill="#FFF"/>
          <circle cx="166.5" cy="56" r="2" fill="#FFF"/>
          {/* Rosy cheeks */}
          <ellipse cx="95" cy="78" rx="10" ry="6" fill="#E8967A" opacity="0.25"/>
          <ellipse cx="180" cy="68" rx="10" ry="6" fill="#E8967A" opacity="0.25"/>
          {/* Smile */}
          <path d="M 122 82 Q 138 96, 155 78" fill="none" stroke="#7A5A1E" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ textAlign:"center", marginTop:4, fontFamily:"'Noto Serif SC', 'Cormorant Garamond', serif", fontSize:15, color:"#DAA520", animation:"pulse 1.8s ease-in-out infinite", letterSpacing:1 }}>
        点击我 · tap me
      </div>
    </div>
  );
}

function CrackedView({ fortune, nums, onReset }) {
  const [phase, setPhase] = useState(0);
  useEffect(()=>{
    const t1=setTimeout(()=>setPhase(1),600);
    const t2=setTimeout(()=>setPhase(2),1400);
    const t3=setTimeout(()=>setPhase(3),2200);
    return()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
  },[]);

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:"100%", maxWidth:380 }}>
      {/* Cracked halves */}
      <div style={{ position:"relative", width:300, height:140, marginBottom:12 }}>
        {/* Left half */}
        <svg viewBox="0 0 140 180" width="140" height="180" style={{
          position:"absolute", left:0, top:0,
          animation:"splitL .7s cubic-bezier(.34,1.56,.64,1) forwards",
          filter:"drop-shadow(0 6px 16px rgba(0,0,0,0.25))",
        }}>
          <defs><radialGradient id="cl" cx="45%" cy="35%" r="60%"><stop offset="0%" stopColor="#F5DEB3"/><stop offset="100%" stopColor="#B8892B"/></radialGradient></defs>
          <path d="M 50 130 C 20 100, 15 60, 60 35 C 80 22, 100 16, 120 18 L 115 55 L 120 80 L 112 110 L 105 130 C 95 142, 78 148, 65 146 C 55 144, 50 138, 50 130 Z" fill="url(#cl)" stroke="#A07825" strokeWidth="1"/>
          <path d="M 115 55 L 120 80 L 112 110" fill="none" stroke="#8B6914" strokeWidth="1.5" opacity="0.4"/>
          <circle cx="95" cy="68" r="4" fill="#7A5A1E"/>
          <circle cx="96.2" cy="66.5" r="1.5" fill="#FFF"/>
        </svg>
        {/* Right half */}
        <svg viewBox="0 0 140 180" width="140" height="180" style={{
          position:"absolute", right:0, top:0,
          animation:"splitR .7s cubic-bezier(.34,1.56,.64,1) forwards",
          filter:"drop-shadow(0 6px 16px rgba(0,0,0,0.25))",
        }}>
          <defs><radialGradient id="cr" cx="50%" cy="35%" r="60%"><stop offset="0%" stopColor="#F5DEB3"/><stop offset="100%" stopColor="#B8892B"/></radialGradient></defs>
          <path d="M 20 18 C 50 10, 80 15, 100 30 C 130 55, 135 90, 120 120 C 108 145, 80 152, 55 148 C 45 146, 38 138, 38 128 L 42 110 L 35 80 L 40 55 L 20 18 Z" fill="url(#cr)" stroke="#A07825" strokeWidth="1"/>
          <path d="M 40 55 L 35 80 L 42 110" fill="none" stroke="#8B6914" strokeWidth="1.5" opacity="0.4"/>
          <circle cx="75" cy="58" r="4" fill="#7A5A1E"/>
          <circle cx="76.2" cy="56.5" r="1.5" fill="#FFF"/>
        </svg>
        {/* Crumbs */}
        {[...Array(10)].map((_,i)=>(
          <div key={i} style={{
            position:"absolute",
            left:`${130+Math.random()*40}px`, top:`${80+Math.random()*40}px`,
            width:3+Math.random()*5, height:2+Math.random()*4, borderRadius:2,
            background:`hsl(${38+Math.random()*8}, ${55+Math.random()*20}%, ${60+Math.random()*20}%)`,
            animation:`crumb .9s cubic-bezier(.2,.8,.3,1) ${i*.04}s forwards`,
            opacity:0, transform:"scale(0)",
          }}/>
        ))}
      </div>

      {/* Fortune paper */}
      {phase >= 1 && (
        <div style={{
          background:"linear-gradient(180deg, #FFFEF5 0%, #FFF8E1 50%, #FFF3D0 100%)",
          borderRadius:4, padding:"22px 26px", width:"100%",
          boxShadow:"0 3px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
          animation:"paperUp .7s cubic-bezier(.34,1.56,.64,1) forwards",
          border:"1px solid rgba(180,140,60,0.15)",
          position:"relative", overflow:"hidden",
        }}>
          {/* Faint line texture */}
          <div style={{ position:"absolute", inset:0, opacity:.04, background:"repeating-linear-gradient(0deg, #8B6914 0px, #8B6914 1px, transparent 1px, transparent 24px)", pointerEvents:"none" }}/>
          {/* Red accent border top */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg, #C41E3A, #8B0000)" }}/>

          {phase >= 2 && (
            <div style={{ animation:"fadeUp .6s ease-out forwards" }}>
              {/* Chinese decorative bracket */}
              <div style={{ textAlign:"center", fontSize:12, color:"#C41E3A", marginBottom:8, letterSpacing:4, fontFamily:"'Noto Serif SC', serif" }}>
                ━━━ 厄运 ━━━
              </div>
              <p style={{
                fontFamily:"'Cormorant Garamond', 'Noto Serif SC', serif",
                fontSize:19, color:"#3D2B1F", textAlign:"center",
                margin:"0 0 14px", lineHeight:1.5, fontWeight:500,
                fontStyle:"italic",
              }}>
                "{fortune}"
              </p>
            </div>
          )}

          {phase >= 3 && (
            <div style={{ animation:"fadeUp .5s ease-out forwards" }}>
              <div style={{ borderTop:"1px dashed rgba(139,69,19,0.15)", paddingTop:14, textAlign:"center" }}>
                <div style={{ fontFamily:"'Noto Serif SC', serif", fontSize:9, color:"#8B6914", letterSpacing:3, marginBottom:8, textTransform:"uppercase" }}>
                  不幸数字 · Unlucky Numbers
                </div>
                <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                  {nums.map((n,i)=>(
                    <span key={i} style={{
                      fontFamily:"'DM Mono', monospace", fontSize:16, fontWeight:700,
                      color:"#C41E3A", background:"rgba(196,30,58,0.06)",
                      padding:"4px 10px", borderRadius:4, minWidth:32, textAlign:"center",
                      border:"1px solid rgba(196,30,58,0.1)",
                    }}>{String(n).padStart(2,'0')}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {phase >= 3 && (
        <button onClick={onReset} style={{
          marginTop:28, padding:"14px 36px",
          background:"linear-gradient(135deg, #C41E3A, #8B0000)",
          border:"2px solid rgba(255,215,0,0.3)", borderRadius:28, color:"#FFD700",
          fontFamily:"'Cormorant Garamond', serif", fontSize:17, fontWeight:600,
          cursor:"pointer", boxShadow:"0 4px 20px rgba(196,30,58,0.3)",
          animation:"fadeUp .5s ease-out forwards", letterSpacing:1,
        }}>
          🥠 Crack Another Cookie
        </button>
      )}
    </div>
  );
}

export default function MisfortunateCookieV2() {
  const [state, setState] = useState("whole");
  const [fortune, setFortune] = useState("");
  const [nums, setNums] = useState([]);
  const [count, setCount] = useState(0);

  const crack = useCallback(()=>{
    if(state!=="whole")return;
    setFortune(F[Math.floor(Math.random()*F.length)]);
    setNums(getLucky());
    setState("cracked");
    setCount(c=>c+1);
  },[state]);

  const reset = ()=>setState("whole");

  return (
    <div style={{
      minHeight:"100vh",
      background:"radial-gradient(ellipse at 50% 20%, #3D0C0C 0%, #1A0505 40%, #0A0202 100%)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:20, position:"relative", overflow:"hidden",
    }}>
      {/* Decorative Chinese lattice pattern */}
      <div style={{ position:"fixed", inset:0, opacity:.025, pointerEvents:"none",
        backgroundImage:`
          linear-gradient(45deg, #FFD700 1px, transparent 1px),
          linear-gradient(-45deg, #FFD700 1px, transparent 1px),
          linear-gradient(45deg, transparent 49%, #FFD700 49%, #FFD700 51%, transparent 51%),
          linear-gradient(-45deg, transparent 49%, #FFD700 49%, #FFD700 51%, transparent 51%)
        `,
        backgroundSize:"40px 40px",
      }}/>
      {/* Lantern glow effects */}
      <div style={{ position:"fixed", top:-100, left:"20%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(196,30,58,0.08) 0%, transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"fixed", top:-80, right:"15%", width:250, height:250, borderRadius:"50%", background:"radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"fixed", bottom:-120, left:"50%", transform:"translateX(-50%)", width:500, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(196,30,58,0.06) 0%, transparent 60%)", pointerEvents:"none" }}/>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Noto+Serif+SC:wght@400;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes wobble {
          0%,100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-6px) rotate(-1.5deg); }
          75% { transform: translateY(-3px) rotate(1deg); }
        }
        @keyframes pulse {
          0%,100% { opacity:1; }
          50% { opacity:.35; }
        }
        @keyframes splitL {
          0% { transform: translate(70px, 0) rotate(0); opacity:1; }
          100% { transform: translate(-10px, 10px) rotate(-15deg); opacity:1; }
        }
        @keyframes splitR {
          0% { transform: translate(-50px, 0) rotate(0); opacity:1; }
          100% { transform: translate(30px, 10px) rotate(14deg); opacity:1; }
        }
        @keyframes crumb {
          0% { opacity:0; transform: scale(0) translate(0, 0); }
          40% { opacity:1; transform: scale(1.2) translate(var(--cx, 10px), -20px); }
          100% { opacity:0; transform: scale(.4) translate(var(--cx, 15px), 50px); }
        }
        @keyframes paperUp {
          0% { opacity:0; transform: translateY(20px) scaleY(.5); }
          100% { opacity:1; transform: translateY(0) scaleY(1); }
        }
        @keyframes fadeUp {
          0% { opacity:0; transform: translateY(10px); }
          100% { opacity:1; transform: translateY(0); }
        }
        @keyframes lanternSwing {
          0%,100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes titleShimmer {
          0%,100% { text-shadow: 0 0 20px rgba(255,215,0,.3), 0 0 40px rgba(196,30,58,.1); }
          50% { text-shadow: 0 0 30px rgba(255,215,0,.5), 0 0 60px rgba(196,30,58,.2); }
        }
        button:hover { filter:brightness(1.12); transform:scale(1.03); }
        button { transition: all .2s ease; }
        *{box-sizing:border-box;}
      `}</style>

      {/* Hanging lanterns */}
      <div style={{ position:"fixed", top:0, left:"12%", textAlign:"center", animation:"lanternSwing 4s ease-in-out infinite", transformOrigin:"top center" }}>
        <div style={{ width:2, height:40, background:"linear-gradient(#FFD700, #8B6914)", margin:"0 auto" }}/>
        <div style={{ fontSize:36, filter:"drop-shadow(0 4px 12px rgba(196,30,58,0.4))" }}>🏮</div>
      </div>
      <div style={{ position:"fixed", top:0, right:"10%", textAlign:"center", animation:"lanternSwing 5s ease-in-out infinite .5s", transformOrigin:"top center" }}>
        <div style={{ width:2, height:55, background:"linear-gradient(#FFD700, #8B6914)", margin:"0 auto" }}/>
        <div style={{ fontSize:30, filter:"drop-shadow(0 4px 12px rgba(196,30,58,0.4))" }}>🏮</div>
      </div>

      {/* Title */}
      <div style={{ textAlign:"center", marginBottom: state==="whole" ? 36 : 20, zIndex:1 }}>
        <div style={{ fontFamily:"'Noto Serif SC', serif", fontSize:14, color:"#C41E3A", letterSpacing:6, marginBottom:4 }}>
          不幸饼干
        </div>
        <h1 style={{
          fontFamily:"'Cormorant Garamond', serif", fontSize:46, fontWeight:700,
          color:"#FFD700", margin:"0 0 2px", letterSpacing:3,
          animation:"titleShimmer 3s ease-in-out infinite", lineHeight:1.1,
        }}>
          Misfortunate
        </h1>
        <h1 style={{
          fontFamily:"'Cormorant Garamond', serif", fontSize:46, fontWeight:700,
          color:"#FFD700", margin:"0 0 8px", letterSpacing:3,
          animation:"titleShimmer 3s ease-in-out infinite", lineHeight:1.1,
        }}>
          Cookie
        </h1>
        <p style={{
          fontFamily:"'Cormorant Garamond', serif", fontSize:15, color:"#8B6914",
          margin:0, fontStyle:"italic", letterSpacing:1,
        }}>
          {state === "whole"
            ? "fate is sealed inside… break it open"
            : "the universe has spoken — listen carefully"}
        </p>
      </div>

      {/* Cookie */}
      <div style={{ minHeight:220, display:"flex", alignItems:"center", justifyContent:"center", zIndex:1 }}>
        {state === "whole" && <WholeCookie onClick={crack}/>}
        {state === "cracked" && <CrackedView fortune={fortune} nums={nums} onReset={reset}/>}
      </div>

      {/* Counter */}
      {count > 0 && (
        <div style={{
          position:"fixed", bottom:18, right:18,
          fontFamily:"'DM Mono', monospace", fontSize:10,
          color:"#8B6914", background:"rgba(139,105,20,0.08)",
          padding:"4px 12px", borderRadius:14,
          border:"1px solid rgba(139,105,20,0.1)", zIndex:2,
        }}>
          🥠 {count} cracked
        </div>
      )}

      {/* Bottom decorative border */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0, height:3,
        background:"linear-gradient(90deg, transparent, #C41E3A, #FFD700, #C41E3A, transparent)",
        opacity:.3,
      }}/>
    </div>
  );
}
