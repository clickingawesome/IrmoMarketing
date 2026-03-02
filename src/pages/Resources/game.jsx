import { useState, useEffect, useCallback, useRef } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
*::-webkit-scrollbar{width:6px}
*::-webkit-scrollbar-track{background:#1a0a2e}
*::-webkit-scrollbar-thumb{background:#6b4c9a;border-radius:4px}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px) rotate(-2deg)}75%{transform:translateX(6px) rotate(2deg)}}
@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes flash{0%,100%{opacity:1}50%{opacity:.15}}
@keyframes bossIn{0%{transform:scale(0) rotate(-180deg);opacity:0}60%{transform:scale(1.3) rotate(10deg)}100%{transform:scale(1) rotate(0)}}
@keyframes glow{0%,100%{text-shadow:0 0 10px #fbbf24,0 0 20px #f59e0b}50%{text-shadow:0 0 20px #fbbf24,0 0 40px #f59e0b,0 0 60px #d97706}}
@keyframes stars{0%{background-position:0 0}100%{background-position:0 -800px}}
@keyframes bounce{0%,100%{transform:translateY(0)}30%{transform:translateY(-25px)}70%{transform:translateY(-18px)}}
@keyframes idle{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-5px) scale(1.02)}}
@keyframes notif{from{opacity:0;transform:translate(-50%,-20px)}to{opacity:1;transform:translate(-50%,0)}}
button{cursor:pointer;transition:all .12s}
button:hover:not(:disabled){filter:brightness(1.25);transform:translateY(-2px)}
button:active:not(:disabled){transform:translateY(0)}
button:disabled{cursor:default;opacity:.4}
.es{animation:idle 2.5s ease-in-out infinite}
.es.hit{animation:shake .35s,flash .35s!important}
`;

const R = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const P = a => a[Math.floor(Math.random() * a.length)];
const C = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const XP = lv => Math.floor(30 * Math.pow(lv, 1.5));

const W = [
  { n: "Rusty Sword", a: 8, e: "🗡️" }, { n: "Iron Blade", a: 14, e: "⚔️" },
  { n: "Flame Edge", a: 22, e: "🔥" }, { n: "Holy Avenger", a: 30, e: "✨" },
];
const AR = [
  { n: "Cloth Tunic", d: 3, e: "👕" }, { n: "Chainmail", d: 8, e: "🛡️" },
  { n: "Plate Armor", d: 14, e: "🏰" },
];
const IT = [
  { n: "Herb", hp: 30, e: "🌿", sp: null }, { n: "Potion", hp: 60, e: "🧪", sp: null },
  { n: "Elixir", hp: 999, e: "✨", sp: null }, { n: "Smoke Bomb", hp: 0, e: "💨", sp: "escape" },
  { n: "Bomb", hp: 0, e: "💣", sp: "damage", dm: 40 }, { n: "Fire Flask", hp: 0, e: "🔥", sp: "aoe", dm: 25 },
];
const SP = [
  { n: "Fireball", mp: 8, dm: 25, t: "dmg", e: "🔥" }, { n: "Ice Shard", mp: 6, dm: 18, t: "dmg", e: "🧊" },
  { n: "Thunder", mp: 12, dm: 35, t: "dmg", e: "⚡" }, { n: "Inferno", mp: 18, dm: 22, t: "aoe", e: "🌋" },
  { n: "Heal", mp: 5, t: "heal", hl: 40, e: "💚" }, { n: "Greater Heal", mp: 10, t: "heal", hl: 80, e: "💖" },
];

const CRY = [
  { t: "Your tears form a puddle — enemies slip!", dm: 20, k: "aoe" },
  { t: "Your sobbing makes enemies feel guilty!", dm: 0, k: "debuff" },
  { t: "Your tears turn ACIDIC! Splash everywhere!", dm: 35, k: "aoe" },
  { t: "You accidentally headbutt the nearest foe!", dm: 15, k: "st" },
  { t: "Tears crystallize into a shield! DEF up!", dm: 0, k: "buff" },
  { t: "Everyone cries! You sucker punch the closest one!", dm: 25, k: "st" },
  { t: "Tears form a sentient water blob that attacks!", dm: 30, k: "st" },
  { t: "You ugly cry SO HARD enemies freeze in horror!", dm: 0, k: "stun" },
  { t: "Tears water a flower — it smacks a foe!", dm: 18, k: "st" },
  { t: "A rainbow from your tears LASER BEAMS them!", dm: 40, k: "aoe" },
  { t: "You slip on tears and do a sick backflip kick!", dm: 22, k: "st" },
  { t: "Tears evaporate into a poison cloud!", dm: 28, k: "aoe" },
];

const EF = [
  { t: "trips over its own feet!", sd: 10 }, { t: "gets distracted by a butterfly!", sd: 0 },
  { t: "laughs so hard it can't breathe!", sd: 5 }, { t: "sneezes mid-swing!", sd: 8 },
  { t: "ponders existence... loses its turn!", sd: 0 }, { t: "critical hits ITSELF!", sd: 25 },
  { t: "tries to flex, pulls a muscle!", sd: 12 }, { t: "gets weapon stuck in the ground!", sd: 0 },
  { t: "eats its own attack!", sd: 15 }, { t: "remembers it left the oven on!", sd: 0 },
  { t: "recreates Napoleon's retreat in circles!", sd: 7 }, { t: "bites its own tongue!", sd: 9 },
];

const EN = {
  forest: [
    { n: "Angry Mushroom", e: "🍄", hp: 30, a: 6, d: 2, xp: 12, g: 8 },
    { n: "Sassy Slime", e: "🟢", hp: 22, a: 5, d: 1, xp: 8, g: 5 },
    { n: "Grumpy Squirrel", e: "🐿️", hp: 28, a: 7, d: 3, xp: 10, g: 7 },
    { n: "Bee Swarm", e: "🐝", hp: 18, a: 8, d: 1, xp: 9, g: 4 },
    { n: "Confused Owl", e: "🦉", hp: 35, a: 9, d: 4, xp: 15, g: 10 },
    { n: "Vine Creeper", e: "🌿", hp: 25, a: 6, d: 5, xp: 11, g: 6 },
  ],
  mountains: [
    { n: "Rock Golem Jr.", e: "🪨", hp: 55, a: 12, d: 8, xp: 25, g: 18 },
    { n: "Sky Serpent", e: "🐉", hp: 50, a: 15, d: 5, xp: 28, g: 20 },
    { n: "Yeti Cub", e: "❄️", hp: 65, a: 14, d: 7, xp: 30, g: 22 },
    { n: "Cranky Eagle", e: "🦅", hp: 40, a: 16, d: 4, xp: 22, g: 15 },
    { n: "Snow Wolf", e: "🐺", hp: 45, a: 14, d: 6, xp: 24, g: 17 },
  ],
  castle: [
    { n: "Troll Guard", e: "👹", hp: 85, a: 18, d: 10, xp: 40, g: 30 },
    { n: "Dark Knight", e: "🖤", hp: 95, a: 20, d: 12, xp: 45, g: 35 },
    { n: "Possessed Armor", e: "⚔️", hp: 80, a: 22, d: 14, xp: 42, g: 32 },
    { n: "Shadow Witch", e: "🧙", hp: 65, a: 25, d: 8, xp: 48, g: 38 },
    { n: "Mimic Chest", e: "📦", hp: 75, a: 19, d: 11, xp: 50, g: 50 },
  ],
};

const BOSS = { n: "Troll King Grumbold", e: "👑", hp: 350, a: 28, d: 15, xp: 500, g: 999, boss: true };

const NPCS = [
  { n: "Elder Maplewood", e: "👴", d: ["Our people vanish at night...", "Rumbling from the northern mountains.", "Please find our missing townsfolk!"] },
  { n: "Baker Betty", e: "👩‍🍳", d: ["The trolls have a KING now!", "He's bored in his castle!", "He kidnaps people for BOARD GAMES?!"] },
  { n: "Guard Steve", e: "💂", d: ["A huge troll wearing a CROWN!", "He dragged farmer Jenkins away!", "Castle entrance: behind the waterfall."] },
  { n: "Merchant Mira", e: "🧝‍♀️", d: ["Stock up on potions!", "Mountains are dangerous.", "The Troll King is ticklish?"], shop: true },
  { n: "Little Timmy", e: "👦", d: ["My mom got taken!", "She makes the BEST cookies!", "Prison is in the EAST TOWER!"] },
  { n: "Mysterious Cat", e: "🐱", d: ["Meow. (Stares knowingly.)", "Meow meow. (Points north.)", "MEOW! (Gives you a potion.)"], gift: true },
];

const SHOP = [
  { n: "Herb", p: 15, i: 0 }, { n: "Potion", p: 40, i: 1 }, { n: "Smoke Bomb", p: 30, i: 3 },
  { n: "Bomb", p: 50, i: 4 }, { n: "Fire Flask", p: 75, i: 5 },
  { n: "Iron Blade", p: 120, i: 1, tp: "w" }, { n: "Flame Edge", p: 300, i: 2, tp: "w" },
  { n: "Chainmail", p: 100, i: 1, tp: "a" }, { n: "Plate Armor", p: 280, i: 2, tp: "a" },
];

const EV = {
  forest: [
    { tp: "get", e: "🪺", t: "A bird's nest with something shiny!", r: { g: 15 } },
    { tp: "get", e: "🍄", t: "A glowing mushroom restores your energy!", r: { hp: 25 } },
    { tp: "get", e: "🌸", t: "A peaceful flower patch. You feel calm.", r: { mp: 10 } },
    { tp: "pick", e: "🌳", t: "A massive tree blocks the path. A glowing hole in the trunk...", ch: [
      { l: "Reach inside", g: "You pull out an Herb!", b: "A squirrel bites you! -10 HP", gc: .6, r: { it: "Herb" }, p: { hp: -10 } },
      { l: "Climb over", g: "Great view! +5 EXP", b: "You slip! -8 HP", gc: .7, r: { xp: 5 }, p: { hp: -8 } },
    ]},
    { tp: "pick", e: "🦊", t: "A fox stares at you. It seems to want something...", ch: [
      { l: "Offer food", g: "The fox leads to hidden treasure! +25 Gold", b: "It snatches food and runs!", gc: .7, r: { g: 25 }, p: {} },
      { l: "Follow it", g: "Shortcut found! +2 steps", b: "Led in circles!", gc: .5, r: { st: 2 }, p: {} },
    ]},
    { tp: "rest", e: "⛺", t: "An abandoned campsite with a warm fire!", r: { hp: 20, mp: 10 } },
    { tp: "npc", e: "🧙‍♂️", t: "A wandering wizard: 'I'll enchant your blade for 30g!'", cost: 30, r: { ta: 5 } },
    { tp: "lore", e: "📜", t: "'BEWARE — Troll territory ahead. They hate lavender.'" },
    { tp: "lore", e: "🐸", t: "A frog wearing a tiny crown: 'I'm the REAL king here!' ...then hops away." },
  ],
  mountains: [
    { tp: "get", e: "💎", t: "Crystals in the rock wall! +30 Gold", r: { g: 30 } },
    { tp: "get", e: "🧊", t: "A magical ice spring! Refreshing!", r: { hp: 40, mp: 15 } },
    { tp: "get", e: "⚗️", t: "An alchemist's stash! You find a Potion!", r: { it: "Potion" } },
    { tp: "pick", e: "🌉", t: "A rickety rope bridge over a chasm. Looks unstable...", ch: [
      { l: "Cross carefully", g: "Made it! Shortcut! +3 steps", b: "Plank breaks! -15 HP", gc: .55, r: { st: 3 }, p: { hp: -15 } },
      { l: "Find another way", g: "Cave passage with gems! +20 Gold", b: "Long boring detour.", gc: .6, r: { g: 20 }, p: {} },
    ]},
    { tp: "pick", e: "🐻", t: "A bear is sleeping across the path. Snoring loudly...", ch: [
      { l: "Sneak past", g: "+10 EXP for bravery!", b: "Stepped on a twig! -20 HP", gc: .5, r: { xp: 10 }, p: { hp: -20 } },
      { l: "Go around", g: "Found berries! +15 HP", b: "Uneventful detour.", gc: .8, r: { hp: 15 }, p: {} },
    ]},
    { tp: "rest", e: "🏕️", t: "A mountain hut! The hermit offers warm soup.", r: { hp: 50, mp: 25 } },
    { tp: "npc", e: "⛏️", t: "A dwarf miner: 'Bomb for 25g? Good stuff!'", cost: 25, r: { it: "Bomb" } },
    { tp: "lore", e: "🗿", t: "Carvings show the Troll King playing chess. He looks bored." },
    { tp: "lore", e: "🐐", t: "A goat headbutts you off the trail. -3 HP. It bleats victoriously.", r: { hp: -3 } },
  ],
  castle: [
    { tp: "get", e: "🗝️", t: "A guard dropped keys and 40 gold!", r: { g: 40 } },
    { tp: "get", e: "🍖", t: "The castle kitchen! You feast!", r: { hp: 60, mp: 20 } },
    { tp: "pick", e: "🚪", t: "Two doors: 'DANGER' and 'BORING STUFF'.", ch: [
      { l: "DANGER door", g: "It's the armory! You find a Bomb!", b: "Trap! Poison darts! -25 HP", gc: .45, r: { it: "Bomb" }, p: { hp: -25 } },
      { l: "BORING door", g: "It's the treasury! +50 Gold!", b: "Literally just tax records.", gc: .5, r: { g: 50 }, p: {} },
    ]},
    { tp: "pick", e: "👹", t: "A troll guard sleeps at his post. Keys jingle...", ch: [
      { l: "Steal keys", g: "Got them! Shortcut! +4 steps", b: "He wakes up! -15 HP", gc: .4, r: { st: 4 }, p: { hp: -15 } },
      { l: "Sneak past", g: "Silent as a shadow! +15 EXP", b: "Knocked over a vase! -10 HP", gc: .55, r: { xp: 15 }, p: { hp: -10 } },
    ]},
    { tp: "rest", e: "🛏️", t: "An empty guest room — surprisingly comfy!", r: { hp: 40, mp: 20 } },
    { tp: "npc", e: "🧌", t: "A friendly troll whispers: 'I'm on YOUR side. Take this.'", cost: 0, r: { it: "Elixir" } },
    { tp: "lore", e: "📋", t: "'MANDATORY FUN NIGHT — All prisoners MUST play Monopoly. NO EXCEPTIONS.'" },
    { tp: "lore", e: "📝", t: "Prisoner's note: 'Day 47. Settlers of Catan AGAIN. The sheep trades are relentless.'" },
    { tp: "lore", e: "🖼️", t: "Painting of the Troll King playing solitaire. Someone graffitied a mustache." },
  ],
};

const init = () => ({
  sc: "title", p: {
    lv: 1, hp: 80, mhp: 80, mp: 30, mmp: 30, a: 10, d: 5,
    xp: 0, g: 50, w: { ...W[0] }, ar: { ...AR[0] },
    inv: [{ ...IT[0], q: 3 }, { ...IT[4], q: 1 }],
    sp: [SP[0], SP[4]], ta: 0,
  },
  z: "forest", en: [], ti: 0, log: [], pt: true, anim: null,
  def: false, stun: {}, proc: false, npc: {}, clues: 0,
  di: {}, steps: 0, enc: R(3, 7), ev: null, evr: null,
  sI: false, sS: false, sT: false, notif: null,
});
const NEED = { forest: 15, mountains: 28, castle: 40 };

export default function Game() {
  const [g, sG] = useState(init);
  const lr = useRef(null);
  const tr = useRef(null);

  useEffect(() => { if (lr.current) lr.current.scrollTop = lr.current.scrollHeight; }, [g.log]);

  const u = useCallback(fn => sG(p => { const n = JSON.parse(JSON.stringify(p)); fn(n); return n; }), []);
  const ntf = useCallback(m => {
    u(s => { s.notif = m; });
    clearTimeout(tr.current);
    tr.current = setTimeout(() => u(s => { s.notif = null; }), 2000);
  }, [u]);

  const giveIt = (s, name) => {
    const t = IT.find(i => i.n === name);
    if (!t) return;
    const ex = s.p.inv.find(i => i.n === name);
    if (ex) ex.q++; else s.p.inv.push({ ...t, q: 1 });
  };

  const lvUp = s => {
    let need = XP(s.p.lv);
    while (s.p.xp >= need && s.p.lv < 30) {
      s.p.lv++; s.p.xp -= need;
      s.p.mhp += 12; s.p.mmp += 5; s.p.a += 3; s.p.d += 2;
      s.p.hp = s.p.mhp; s.p.mp = s.p.mmp;
      need = XP(s.p.lv);
      if (s.p.lv === 3 && !s.p.sp.find(x => x.n === "Ice Shard")) s.p.sp.push(SP[1]);
      if (s.p.lv === 5 && !s.p.sp.find(x => x.n === "Greater Heal")) s.p.sp.push(SP[5]);
      if (s.p.lv === 7 && !s.p.sp.find(x => x.n === "Thunder")) s.p.sp.push(SP[2]);
      if (s.p.lv === 9 && !s.p.sp.find(x => x.n === "Inferno")) s.p.sp.push(SP[3]);
    }
  };

  const chkEnd = s => {
    const alive = s.en.filter(e => e.hp > 0);
    if (alive.length === 0) {
      let tx = 0, tg = 0;
      s.en.forEach(e => { tx += e.xp; tg += e.g; });
      s.log = [...s.log, `🎉 Victory! +${tx} EXP, +${tg} Gold`];
      s.p.xp += tx; s.p.g += tg; s.p.ta = 0; lvUp(s);
      return true;
    }
    if (s.en[s.ti] && s.en[s.ti].hp <= 0) {
      const ni = s.en.findIndex(e => e.hp > 0);
      if (ni >= 0) s.ti = ni;
    }
    return false;
  };

  // Start battle
  const startBattle = useCallback(boss => {
    u(s => {
      let list = [];
      if (boss) { list = [{ ...boss, mhp: boss.hp, id: 0 }]; }
      else {
        const pool = EN[s.z];
        const cnt = s.z === "forest" ? R(1, 2) : s.z === "mountains" ? R(1, 3) : R(2, 3);
        for (let i = 0; i < cnt; i++) { const e = { ...P(pool) }; e.mhp = e.hp; e.id = i; list.push(e); }
      }
      s.en = list; s.ti = 0; s.sc = "battle";
      s.log = list.length === 1
        ? [`${list[0].e} ${list[0].n} appeared!`]
        : [`${list.length} enemies! ${list.map(e => e.e).join(" ")} — Fight!`];
      s.pt = true; s.def = false; s.stun = {}; s.anim = null; s.proc = false;
      s.sI = false; s.sS = false;
    });
  }, [u]);

  // Enemy turns
  const enemyTurns = useCallback(() => {
    u(s => { s.proc = true; });
    const doOne = idx => {
      setTimeout(() => {
        let shouldContinue = true;
        u(s => {
          const alive = s.en.filter(e => e.hp > 0);
          const e = alive[idx];
          if (!e) { s.pt = true; s.def = false; s.proc = false; shouldContinue = false; return; }
          if (s.stun[e.id]) {
            s.log = [...s.log, `${e.e} ${e.n} is stunned!`];
            delete s.stun[e.id]; return;
          }
          if (Math.random() < 0.10) {
            const ev = P(EF);
            s.log = [...s.log, `${e.e} ${e.n} ${ev.t}`];
            if (ev.sd > 0) { e.hp = Math.max(0, e.hp - ev.sd); if (e.hp <= 0) { s.log = [...s.log, `${e.e} knocked itself out!`]; chkEnd(s); } }
            return;
          }
          let ap = e.a;
          if (e.boss) {
            const pct = e.hp / e.mhp;
            if (pct <= 0.3) ap = Math.floor(ap * 1.7);
            else if (pct <= 0.6) ap = Math.floor(ap * 1.3);
            if (Math.random() < 0.3) {
              const moves = [["TROLL SMASH", 1.5], ["BORING MONOLOGUE", 0.5], ["CROWN THROW", 1.3], ["TANTRUM STOMP", 1.8]];
              const m = P(moves);
              ap = Math.floor(ap * m[1]);
              s.log = [...s.log, `👑 ${m[0]}!`];
            }
          }
          const dm = s.def ? (s.p.d + s.p.ar.d) * 2 : s.p.d + s.p.ar.d;
          const dmg = Math.max(1, ap - Math.floor(dm * 0.6) + R(-3, 3));
          s.p.hp = Math.max(0, s.p.hp - dmg);
          s.log = [...s.log, `${e.e} ${e.n} hits you for ${dmg}!${s.def ? " (Guarded!)" : ""}`];
          s.anim = { t: "ph" };
          if (s.p.hp <= 0) s.log = [...s.log, "💀 Defeated..."];
        });

        setTimeout(() => {
          u(s => { s.anim = null; });
          u(s => {
            if (s.p.hp <= 0) { setTimeout(() => u(s2 => { s2.sc = "over"; }), 800); return; }
            const alive = s.en.filter(e => e.hp > 0);
            if (idx + 1 < alive.length) doOne(idx + 1);
            else { s.pt = true; s.def = false; s.proc = false; }
          });
        }, 650);
      }, 550);
    };
    doOne(0);
  }, [u]);

  const after = useCallback((dl = 500) => {
    setTimeout(() => {
      u(s => { s.anim = null; });
      u(s => {
        if (chkEnd(s)) {
          const wasBoss = s.en.some(e => e.boss);
          if (wasBoss) setTimeout(() => u(s2 => { s2.sc = "win"; }), 2000);
          else setTimeout(() => u(s2 => { s2.sc = "explore"; s2.en = []; s2.log = []; }), 1500);
          return;
        }
        if (!s.pt) {} // will chain to enemy turns
      });
      setTimeout(() => {
        u(s => {
          if (s.sc === "battle" && s.p.hp > 0 && s.en.some(e => e.hp > 0) && !s.pt) enemyTurns();
        });
      }, 100);
    }, dl);
  }, [u, enemyTurns]);

  // Player actions
  const act = {
    atk: () => {
      u(s => {
        if (!s.pt || s.proc) return; s.pt = false; s.sS = false; s.sI = false;
        const t = s.en[s.ti]; if (!t || t.hp <= 0) return;
        const ta = s.p.a + s.p.w.a + (s.p.ta || 0);
        const base = Math.max(1, ta - Math.floor(t.d * 0.5) + R(-2, 4));
        const crit = Math.random() < 0.12;
        const dmg = crit ? base * 2 : base;
        t.hp = Math.max(0, t.hp - dmg);
        s.log = [...s.log, `${s.p.w.e} Strike ${t.e} ${t.n} for ${dmg}!${crit ? " ✨CRIT!" : ""}`];
        s.anim = { t: "eh", i: s.ti };
        if (t.hp <= 0) s.log = [...s.log, `💥 ${t.n} defeated!`];
      }); after();
    },
    def: () => {
      u(s => {
        if (!s.pt || s.proc) return; s.pt = false; s.def = true; s.sS = false; s.sI = false;
        s.log = [...s.log, "🛡️ Defense doubled!"];
      }); after(300);
    },
    spell: sp => {
      u(s => {
        if (!s.pt || s.proc) return;
        if (s.p.mp < sp.mp) { s.log = [...s.log, "Not enough MP!"]; return; }
        s.pt = false; s.sS = false; s.p.mp -= sp.mp;
        if (sp.t === "heal") {
          const hl = Math.min(sp.hl, s.p.mhp - s.p.hp); s.p.hp += hl;
          s.log = [...s.log, `${sp.e} ${sp.n}! +${hl} HP!`];
        } else if (sp.t === "aoe") {
          s.en.filter(e => e.hp > 0).forEach(e => {
            const d = sp.dm + R(-3, 5); e.hp = Math.max(0, e.hp - d);
            s.log = [...s.log, `${sp.e} ${e.e} takes ${d}!`];
            if (e.hp <= 0) s.log = [...s.log, `💥 ${e.n} defeated!`];
          }); s.anim = { t: "all" };
        } else {
          const t = s.en[s.ti]; if (!t || t.hp <= 0) return;
          const d = sp.dm + R(-3, 5); t.hp = Math.max(0, t.hp - d);
          s.log = [...s.log, `${sp.e} ${sp.n} → ${t.e} for ${d}!`];
          s.anim = { t: "eh", i: s.ti };
          if (t.hp <= 0) s.log = [...s.log, `💥 ${t.n} defeated!`];
        }
      }); after();
    },
    item: idx => {
      u(s => {
        if (!s.pt || s.proc) return;
        const inv = s.p.inv; if (!inv[idx] || inv[idx].q <= 0) return;
        s.pt = false; s.sI = false;
        const it = inv[idx];
        if (it.sp === "escape") {
          s.log = [...s.log, "💨 Smoke bomb! You vanish!"];
          inv[idx].q--; if (inv[idx].q <= 0) inv.splice(idx, 1);
          setTimeout(() => u(s2 => { s2.sc = "explore"; s2.en = []; }), 500); return;
        } else if (it.sp === "aoe") {
          s.en.filter(e => e.hp > 0).forEach(e => {
            const d = it.dm + R(-5, 5); e.hp = Math.max(0, e.hp - d);
            s.log = [...s.log, `🔥 ${e.e} takes ${d}!`];
            if (e.hp <= 0) s.log = [...s.log, `💥 ${e.n} defeated!`];
          }); s.anim = { t: "all" };
        } else if (it.sp === "damage") {
          const t = s.en[s.ti]; if (t && t.hp > 0) {
            const d = it.dm + R(-5, 5); t.hp = Math.max(0, t.hp - d);
            s.log = [...s.log, `💣 ${t.e} takes ${d}!`];
            s.anim = { t: "eh", i: s.ti };
            if (t.hp <= 0) s.log = [...s.log, `💥 ${t.n} defeated!`];
          }
        } else {
          const hl = Math.min(it.hp, s.p.mhp - s.p.hp); s.p.hp += hl;
          s.log = [...s.log, `${it.e} ${it.n}! +${hl} HP!`];
        }
        inv[idx].q--; if (inv[idx].q <= 0) inv.splice(idx, 1);
      }); after();
    },
    run: () => {
      u(s => {
        if (!s.pt || s.proc) return; s.pt = false; s.sS = false; s.sI = false;
        const boss = s.en.some(e => e.boss && e.hp > 0);
        if (!boss && Math.random() < 0.55) {
          s.log = [...s.log, "🏃 Escaped!"]; setTimeout(() => u(s2 => { s2.sc = "explore"; s2.en = []; }), 500);
        } else s.log = [...s.log, boss ? "👑 \"Where do YOU think you're going?!\"" : "❌ Can't escape!"];
      }); after(300);
    },
    cry: () => {
      u(s => {
        if (!s.pt || s.proc) return; s.pt = false; s.sS = false; s.sI = false;
        const ev = P(CRY);
        s.log = [...s.log, `😭 ${ev.t}`];
        if (ev.k === "aoe") {
          s.en.filter(e => e.hp > 0).forEach(e => {
            e.hp = Math.max(0, e.hp - ev.dm);
            if (e.hp <= 0) s.log = [...s.log, `💥 ${e.n} — tears!`];
          }); s.anim = { t: "all" };
        } else if (ev.k === "st") {
          const t = s.en[s.ti]; if (t && t.hp > 0) {
            t.hp = Math.max(0, t.hp - ev.dm); s.anim = { t: "eh", i: s.ti };
            if (t.hp <= 0) s.log = [...s.log, `💥 ${t.n} — tears!`];
          }
        } else if (ev.k === "stun") s.en.filter(e => e.hp > 0).forEach(e => { s.stun[e.id] = true; });
        else if (ev.k === "buff") s.def = true;
        else if (ev.k === "debuff") s.en.filter(e => e.hp > 0).forEach(e => { e.d = Math.max(0, e.d - 3); });
      }); after();
    },
  };

  // Exploration
  const step = useCallback(() => {
    u(s => {
      s.steps++; s.ev = null; s.evr = null; s.enc--;
      if (s.enc <= 0) { s.enc = R(3, 7); setTimeout(() => startBattle(), 50); return; }
      if (Math.random() < 0.35) { s.ev = P(EV[s.z]); s.evr = null; }
    });
  }, [u, startBattle]);

  const evChoice = useCallback(ch => {
    u(s => {
      const ok = Math.random() < ch.gc;
      if (ok) {
        s.evr = `✅ ${ch.g}`;
        if (ch.r.g) s.p.g += ch.r.g;
        if (ch.r.hp) s.p.hp = C(s.p.hp + ch.r.hp, 0, s.p.mhp);
        if (ch.r.mp) s.p.mp = C(s.p.mp + ch.r.mp, 0, s.p.mmp);
        if (ch.r.xp) { s.p.xp += ch.r.xp; lvUp(s); }
        if (ch.r.it) giveIt(s, ch.r.it);
        if (ch.r.st) s.steps += ch.r.st;
      } else {
        s.evr = `❌ ${ch.b}`;
        if (ch.p?.hp) s.p.hp = Math.max(1, s.p.hp + ch.p.hp);
      }
    });
  }, [u]);

  const evAct = useCallback(() => {
    u(s => {
      const ev = s.ev; if (!ev) return;
      const r = ev.r || {};
      if (ev.cost !== undefined && ev.cost > 0 && s.p.g < ev.cost) { s.evr = "❌ Not enough gold!"; return; }
      if (ev.cost) s.p.g -= ev.cost;
      if (r.g) s.p.g += r.g;
      if (r.hp) s.p.hp = C(s.p.hp + r.hp, 1, s.p.mhp);
      if (r.mp) s.p.mp = C(s.p.mp + r.mp, 0, s.p.mmp);
      if (r.it) giveIt(s, r.it);
      if (r.ta) s.p.ta = (s.p.ta || 0) + r.ta;
      s.evr = ev.tp === "lore" ? "📖 Noted..." : "✅ Got it!";
    });
  }, [u]);

  // NPC / Shop / Inn
  const talk = useCallback(npc => {
    u(s => {
      const di = s.di[npc.n] || 0;
      s.di[npc.n] = Math.min(di + 1, npc.d.length - 1);
      if (!s.npc[npc.n]) { s.npc[npc.n] = true; s.clues++; }
      if (npc.gift && di === npc.d.length - 1 && !s.npc[npc.n + "_g"]) {
        s.npc[npc.n + "_g"] = true; giveIt(s, "Potion");
      }
    });
  }, [u]);

  const buy = useCallback(si => {
    u(s => {
      if (s.p.g < si.p) return;
      s.p.g -= si.p;
      if (si.tp === "w") s.p.w = { ...W[si.i] };
      else if (si.tp === "a") s.p.ar = { ...AR[si.i] };
      else giveIt(s, IT[si.i].n);
    }); ntf(`Bought ${si.n}!`);
  }, [u, ntf]);

  // ── Styles
  const B = (c = "#6b4c9a", dis = false) => ({
    fontFamily: "'Press Start 2P'", fontSize: 10, padding: "10px 14px",
    background: dis ? "#2a2a2a" : c, color: dis ? "#555" : "#fff",
    border: `2px solid ${dis ? "#333" : c}`, borderRadius: 4,
    letterSpacing: 1, textTransform: "uppercase", minWidth: 70, textAlign: "center",
  });

  const Bar = ({ c, m, color = "g", w = 90, label }) => {
    const pct = m > 0 ? (c / m) * 100 : 0;
    const bg = color === "b" ? "#60a5fa" : pct > 50 ? "#4ade80" : pct > 25 ? "#fbbf24" : "#ef4444";
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {label && <span style={{ fontSize: 8, color: "#a78bdb", fontFamily: "'Press Start 2P'" }}>{label}</span>}
        <div style={{ width: w, height: 8, background: "#1a0a2e", border: "2px solid #6b4c9a", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${C(pct, 0, 100)}%`, height: "100%", background: bg, transition: "width .4s, background .3s", borderRadius: 1 }} />
        </div>
        <span style={{ fontSize: 8, fontFamily: "'Press Start 2P'", color: "#ccc", minWidth: 48 }}>{c}/{m}</span>
      </div>
    );
  };

  const p = g.p;
  const hdr = !["title", "over", "win"].includes(g.sc);

  return (
    <div style={{ fontFamily: "'Press Start 2P', monospace", width: "100%", minHeight: "100vh", background: "#1a0a2e", color: "#e8d5b7", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{CSS}</style>
      {g.notif && <div style={{ position: "fixed", top: 56, left: "50%", transform: "translateX(-50%)", zIndex: 500, background: "#2d1b4e", border: "2px solid #8b5cf6", borderRadius: 6, padding: "8px 18px", fontFamily: "'VT323'", fontSize: 19, color: "#fbbf24", animation: "notif .3s ease", boxShadow: "0 4px 20px rgba(139,92,246,.4)" }}>{g.notif}</div>}

      <div style={{ width: "100%", maxWidth: 720, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* HEADER */}
        {hdr && (
          <div style={{ background: "linear-gradient(180deg,#2d1b4e,#1a0a2e)", borderBottom: "3px solid #6b4c9a", padding: "6px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, flexWrap: "wrap", gap: 4 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 8, color: "#fbbf24" }}>Lv{p.lv}</span>
              <Bar c={p.hp} m={p.mhp} label="HP" />
              <Bar c={p.mp} m={p.mmp} color="b" label="MP" w={55} />
              <span style={{ fontSize: 8, color: "#fbbf24" }}>💰{p.g}</span>
            </div>
            <button style={{ ...B("#4a3670"), fontSize: 7, padding: "5px 8px", minWidth: 0 }} onClick={() => u(s => { s.sT = !s.sT; })}>📊</button>
          </div>
        )}

        {/* STATUS MODAL */}
        {g.sT && <div onClick={() => u(s => { s.sT = false; })} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "linear-gradient(180deg,#2d1b4e,#1a0a2e)", border: "3px solid #6b4c9a", borderRadius: 8, padding: 18, width: "90%", maxWidth: 440, maxHeight: "80vh", overflowY: "auto" }}>
            <h3 style={{ fontSize: 12, color: "#fbbf24", marginBottom: 12 }}>📊 Status</h3>
            <div style={{ fontFamily: "'VT323'", fontSize: 17, lineHeight: 2 }}>
              <div>⚔️ Hero — Level {p.lv}</div>
              <div>❤️ HP: {p.hp}/{p.mhp} — 💎 MP: {p.mp}/{p.mmp}</div>
              <div>⚔️ ATK: {p.a}+{p.w.a}{p.ta ? `+${p.ta}` : ""} ({p.w.n})</div>
              <div>🛡️ DEF: {p.d}+{p.ar.d} ({p.ar.n})</div>
              <div>✨ EXP: {p.xp}/{XP(p.lv)}</div>
              <div style={{ borderTop: "1px solid #6b4c9a", paddingTop: 6, marginTop: 6 }}>📖 {p.sp.map(s => `${s.e}${s.n}`).join(", ")}</div>
              <div>🎒 {p.inv.map(i => `${i.e}${i.n}(${i.q})`).join(", ") || "Empty"}</div>
              <div>🗺️ {g.z} — Step {g.steps} — 🔍 Clues: {g.clues}/5</div>
            </div>
            <button style={{ ...B("#6b4c9a"), marginTop: 12, width: "100%" }} onClick={() => u(s => { s.sT = false; })}>Close</button>
          </div>
        </div>}

        {/* TITLE */}
        {g.sc === "title" && (
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 30, background: "linear-gradient(180deg,#0a0520,#1a0a3e,#2d1060)", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle,rgba(255,255,255,.04) 1px,transparent 1px)", backgroundSize: "28px 28px", animation: "stars 50s linear infinite" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 72, marginBottom: 12 }}>👑</div>
              <h1 style={{ fontSize: 18, color: "#fbbf24", animation: "glow 2s infinite", lineHeight: 2 }}>TROLL KING'S<br />BOREDOM</h1>
              <p style={{ fontFamily: "'VT323'", fontSize: 22, color: "#a78bdb", margin: "14px 0 32px" }}>A tale of kidnapping, board games, and tears</p>
              <div style={{ fontSize: 44, marginBottom: 32, letterSpacing: 8 }}>🏰 ⚔️ 😭</div>
              <button style={{ ...B("#8b5cf6"), fontSize: 13, padding: "16px 36px", animation: "pulse 2s infinite" }} onClick={() => u(s => { s.sc = "town"; })}>▶ BEGIN QUEST</button>
            </div>
          </div>
        )}

        {/* TOWN */}
        {g.sc === "town" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ minHeight: 200, padding: 16, background: "linear-gradient(180deg,#87CEEB,#98d8a0,#6db86d)", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontFamily: "'VT323'", fontSize: 20, color: "#1a4a10", marginBottom: 16 }}>🏘️ Willowbrook Village</div>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
                {NPCS.map((npc, i) => {
                  const talked = g.npc[npc.n];
                  return (
                    <div key={i} onClick={() => talk(npc)} style={{ textAlign: "center", cursor: "pointer", transition: "transform .2s", position: "relative" }}
                      onMouseOver={e => e.currentTarget.style.transform = "scale(1.15)"} onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}>
                      <div style={{ fontSize: 44, filter: "drop-shadow(0 3px 6px rgba(0,0,0,.3))" }}>{npc.e}</div>
                      {!talked && <span style={{ position: "absolute", top: -4, right: -4, fontSize: 13, animation: "pulse 1s infinite" }}>❗</span>}
                      <div style={{ fontFamily: "'VT323'", fontSize: 11, color: "#1a3a10", marginTop: 2 }}>{npc.n.split(" ")[0]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ background: "linear-gradient(180deg,#2d1b4e,#1a0a2e)", border: "3px solid #6b4c9a", borderRadius: 4, margin: "0 10px", padding: 12, fontFamily: "'VT323'", fontSize: 17, lineHeight: 1.5, minHeight: 60 }}>
              {(() => { const ln = Object.keys(g.di).pop(); const npc = NPCS.find(n => n.n === ln);
                return npc ? `${npc.e} ${npc.n}: "${npc.d[g.di[ln]]}"` : "The townsfolk look worried... Talk to them!"; })()}
            </div>
            <div style={{ padding: "5px 10px", fontFamily: "'VT323'", fontSize: 15, color: "#a78bdb", textAlign: "center" }}>
              🔍 Clues: {g.clues}/5 {g.clues >= 3 && <span style={{ color: "#4ade80" }}>— Ready to depart!</span>}
            </div>
            <div style={{ background: "#0d0520", borderTop: "3px solid #6b4c9a", padding: 10, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              <button style={B("#6b4c9a")} onClick={() => u(s => { s.sc = "shop"; })}>🛒 Shop</button>
              <button style={B("#2563eb", p.g < 20)} onClick={() => { u(s => { if (s.p.g >= 20) { s.p.g -= 20; s.p.hp = s.p.mhp; s.p.mp = s.p.mmp; } }); ntf("Fully rested!"); }}>🏨 Inn (20g)</button>
              <button style={B(g.clues >= 3 ? "#16a34a" : "#333", g.clues < 3)} onClick={() => { if (g.clues < 3) return; u(s => { s.sc = "explore"; s.z = "forest"; s.steps = 0; s.enc = R(3, 6); s.ev = null; }); }}>🗺️ Set Out!</button>
            </div>
          </div>
        )}

        {/* SHOP */}
        {g.sc === "shop" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ minHeight: 80, padding: 14, background: "linear-gradient(180deg,#5c3d2e,#4a2f20)", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: 44 }}>🧝‍♀️</div>
              <div style={{ fontFamily: "'VT323'", fontSize: 19, color: "#fbbf24" }}>Merchant Mira's Shop</div>
            </div>
            <div style={{ flex: 1, padding: 8, overflowY: "auto" }}>
              {SHOP.map((si, i) => {
                const it = si.tp === "w" ? W[si.i] : si.tp === "a" ? AR[si.i] : IT[si.i];
                return (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 8px", borderBottom: "1px solid #3a2555", fontFamily: "'VT323'", fontSize: 15 }}>
                    <span>{it.e} {si.n}</span>
                    <button style={B(p.g >= si.p ? "#16a34a" : "#333", p.g < si.p)} onClick={() => buy(si)}>💰{si.p}</button>
                  </div>
                );
              })}
            </div>
            <div style={{ background: "#0d0520", borderTop: "3px solid #6b4c9a", padding: 10, display: "flex", justifyContent: "center" }}>
              <button style={B("#6b4c9a")} onClick={() => u(s => { s.sc = "town"; })}>← Back</button>
            </div>
          </div>
        )}

        {/* EXPLORE */}
        {g.sc === "explore" && (() => {
          const zc = { forest: { bg: "linear-gradient(180deg,#0d2818,#1a472a)", em: "🌲🌿🍂", nm: "Dark Forest" }, mountains: { bg: "linear-gradient(180deg,#1e293b,#334155)", em: "⛰️🏔️🌨️", nm: "Troll Mountains" }, castle: { bg: "linear-gradient(180deg,#1a0a2e,#3d1555)", em: "🏰👹🔥", nm: "Troll King's Castle" } }[g.z];
          const need = NEED[g.z]; const pct = C((g.steps / need) * 100, 0, 100);
          const adv = g.z === "forest" && g.steps >= NEED.forest ? "mountains" : g.z === "mountains" && g.steps >= NEED.mountains ? "castle" : null;
          const boss = g.z === "castle" && g.steps >= NEED.castle;
          const ev = g.ev;
          return (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ minHeight: 160, padding: 16, background: zc.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 36, letterSpacing: 6 }}>{zc.em}</div>
                <div style={{ fontSize: 12, color: "#fbbf24", marginTop: 10 }}>{zc.nm}</div>
                <div style={{ width: "75%", maxWidth: 280, marginTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'VT323'", fontSize: 13, color: "#a78bdb", marginBottom: 3 }}>
                    <span>Progress</span><span>{g.steps}/{need}</span>
                  </div>
                  <div style={{ width: "100%", height: 9, background: "#1a0a2e", border: "2px solid #6b4c9a", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#8b5cf6,#a78bfa)", transition: "width .4s", borderRadius: 1 }} />
                  </div>
                </div>
              </div>
              <div style={{ background: "linear-gradient(180deg,#2d1b4e,#1a0a2e)", border: "3px solid #6b4c9a", borderRadius: 4, margin: "0 10px", padding: 12, minHeight: 90, fontFamily: "'VT323'", fontSize: 17, lineHeight: 1.5 }}>
                {ev ? (<div>
                  <div style={{ fontSize: 28, textAlign: "center", marginBottom: 6 }}>{ev.e}</div>
                  <div style={{ marginBottom: 8 }}>{ev.t}</div>
                  {g.evr ? <div style={{ padding: "6px 10px", borderRadius: 4, marginTop: 6, background: g.evr.startsWith("✅") ? "rgba(74,222,128,.12)" : g.evr.startsWith("❌") ? "rgba(239,68,68,.12)" : "rgba(139,92,246,.12)", color: g.evr.startsWith("✅") ? "#4ade80" : g.evr.startsWith("❌") ? "#ef4444" : "#a78bdb", fontSize: 16 }}>{g.evr}</div>
                    : ev.tp === "pick" ? <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>{ev.ch.map((ch, i) => <button key={i} style={B("#8b5cf6")} onClick={() => evChoice(ch)}>{ch.l}</button>)}</div>
                    : <button style={{ ...B(ev.cost > 0 && p.g < ev.cost ? "#333" : "#16a34a", ev.cost > 0 && p.g < ev.cost), marginTop: 6 }} onClick={evAct}>{ev.cost > 0 ? `Pay ${ev.cost}g` : ev.tp === "lore" ? "Continue" : "Take it!"}</button>
                  }
                </div>) : <div style={{ color: "#888" }}>{boss ? "💀 The throne room looms..." : adv ? `Path to ${adv} opens ahead...` : P(["You press onward...", "Something rustles...", "The air is tense..."])}</div>}
              </div>
              <div style={{ background: "#0d0520", borderTop: "3px solid #6b4c9a", padding: 10, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: "auto" }}>
                <button style={B("#16a34a")} onClick={step}>🚶 Walk</button>
                {adv && <button style={B("#8b5cf6")} onClick={() => u(s => { s.z = adv; s.enc = R(2, 5); s.ev = null; s.evr = null; })}>🗺️ Enter {adv === "mountains" ? "Mountains" : "Castle"}</button>}
                {boss && <button style={{ ...B("#dc2626"), animation: "pulse 1.5s infinite" }} onClick={() => startBattle({ ...BOSS })}>👑 FACE THE KING</button>}
                <button style={B("#6b4c9a")} onClick={() => u(s => { s.sc = "town"; s.ev = null; })}>🏘️ Town</button>
              </div>
            </div>
          );
        })()}

        {/* BATTLE */}
        {g.sc === "battle" && (() => {
          const en = g.en; const isBoss = en.some(e => e.boss);
          const bossE = isBoss ? en[0] : null;
          const phase = bossE && bossE.hp > 0 ? (bossE.hp / bossE.mhp <= 0.3 ? "ENRAGED" : bossE.hp / bossE.mhp <= 0.6 ? "Getting Serious" : "Bored Tantrum") : null;
          return (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {/* Scene */}
              <div style={{ minHeight: 220, padding: "14px 10px", position: "relative", background: isBoss ? "linear-gradient(180deg,#2d0a0a,#4a1010)" : g.z === "forest" ? "linear-gradient(180deg,#0d2818,#1a472a)" : g.z === "mountains" ? "linear-gradient(180deg,#1e293b,#334155)" : "linear-gradient(180deg,#1a0a2e,#3d1555)", display: "flex", flexDirection: "column" }}>
                {phase && <div style={{ textAlign: "center", fontSize: 8, color: phase === "ENRAGED" ? "#ef4444" : "#f97316", marginBottom: 6, animation: phase === "ENRAGED" ? "pulse .5s infinite" : "none" }}>⚠️ {phase}</div>}
                <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: isBoss ? 0 : 12, flex: 1, flexWrap: "wrap", padding: "8px 0" }}>
                  {en.map((e, i) => {
                    const tgt = i === g.ti && e.hp > 0;
                    const hit = (g.anim?.t === "eh" && g.anim.i === i) || (g.anim?.t === "all" && e.hp > 0);
                    const dead = e.hp <= 0;
                    return (
                      <div key={i} onClick={() => { if (e.hp > 0 && g.pt) u(s => { s.ti = i; }); }}
                        style={{ textAlign: "center", cursor: e.hp > 0 ? "pointer" : "default", transition: "all .3s", opacity: dead ? 0.12 : 1, transform: dead ? "scale(.5)" : tgt ? "scale(1.1)" : "scale(1)", filter: dead ? "grayscale(1)" : "none" }}>
                        {tgt && !dead && <div style={{ fontSize: 12, animation: "pulse .8s infinite", marginBottom: 2, color: "#fbbf24" }}>▼</div>}
                        <div className={`es${hit ? " hit" : ""}`} style={{ fontSize: e.boss ? 72 : 46, filter: "drop-shadow(0 4px 10px rgba(0,0,0,.5))", ...(e.boss && g.log.length <= 1 ? { animation: "bossIn 1.2s ease-out" } : {}) }}>{e.e}</div>
                        <div style={{ fontSize: 7, color: tgt ? "#fbbf24" : "#ccc", marginTop: 3 }}>{e.n}</div>
                        {!dead && <div style={{ marginTop: 3, display: "flex", justifyContent: "center" }}><Bar c={e.hp} m={e.mhp} w={e.boss ? 130 : 65} /></div>}
                      </div>
                    );
                  })}
                </div>
                {g.anim?.t === "ph" && <div style={{ position: "absolute", inset: 0, background: "rgba(239,68,68,.15)", animation: "flash .35s", pointerEvents: "none" }} />}
              </div>

              {/* Log */}
              <div ref={lr} style={{ background: "linear-gradient(180deg,#2d1b4e,#1a0a2e)", border: "3px solid #6b4c9a", borderRadius: 4, margin: "0 10px", padding: 8, maxHeight: 100, overflowY: "auto", fontFamily: "'VT323'", fontSize: 15, lineHeight: 1.5 }}>
                {g.log.map((m, i) => <div key={i} style={{ opacity: i === g.log.length - 1 ? 1 : .5, animation: i === g.log.length - 1 ? "slideUp .25s ease" : "none" }}>{m}</div>)}
              </div>

              {/* Player HP in battle */}
              <div style={{ padding: "5px 10px", display: "flex", gap: 10, alignItems: "center", background: "#0d0520", borderTop: "1px solid #3a2555", flexWrap: "wrap" }}>
                <Bar c={p.hp} m={p.mhp} label="HP" w={100} />
                <Bar c={p.mp} m={p.mmp} label="MP" color="b" w={65} />
                {g.def && <span style={{ fontSize: 7, color: "#60a5fa" }}>🛡️UP</span>}
              </div>

              {/* Spell/Item sub */}
              {g.sS && <div style={{ padding: "6px 8px", display: "flex", flexWrap: "wrap", gap: 5, background: "#0d0520", borderTop: "2px solid #6b4c9a" }}>
                {p.sp.map((sp, i) => <button key={i} style={B(p.mp >= sp.mp ? "#2563eb" : "#333", p.mp < sp.mp)} onClick={() => act.spell(sp)} disabled={p.mp < sp.mp || !g.pt}>{sp.e} {sp.n} ({sp.mp}){sp.t === "aoe" ? " ALL" : ""}</button>)}
                <button style={B("#6b4c9a")} onClick={() => u(s => { s.sS = false; })}>← Back</button>
              </div>}
              {g.sI && <div style={{ padding: "6px 8px", display: "flex", flexWrap: "wrap", gap: 5, background: "#0d0520", borderTop: "2px solid #6b4c9a" }}>
                {p.inv.length === 0 ? <span style={{ fontFamily: "'VT323'", fontSize: 17, color: "#666" }}>Empty!</span> : p.inv.map((it, i) => <button key={i} style={B("#16a34a")} onClick={() => act.item(i)} disabled={!g.pt}>{it.e} {it.n} x{it.q}</button>)}
                <button style={B("#6b4c9a")} onClick={() => u(s => { s.sI = false; })}>← Back</button>
              </div>}

              {/* Actions */}
              {!g.sS && !g.sI && <div style={{ background: "#0d0520", borderTop: "3px solid #6b4c9a", padding: 10, display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>
                {[
                  [p.w.e + " Fight", act.atk, "#dc2626"],
                  ["🛡️ Defend", act.def, "#2563eb"],
                  ["✨ Spell", () => u(s => { s.sS = true; }), "#8b5cf6"],
                  ["🎒 Item", () => u(s => { s.sI = true; }), "#16a34a"],
                  ["🏃 Run", act.run, "#ca8a04"],
                  ["😭 Cry", act.cry, "#ec4899"],
                ].map(([l, fn, c], i) => <button key={i} style={B(c, !g.pt || g.proc)} onClick={fn} disabled={!g.pt || g.proc}>{l}</button>)}
              </div>}
            </div>
          );
        })()}

        {/* GAME OVER */}
        {g.sc === "over" && (
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40, background: "linear-gradient(180deg,#0a0008,#1a0520)" }}>
            <div style={{ fontSize: 80 }}>💀</div>
            <h2 style={{ fontSize: 18, color: "#ef4444", margin: "20px 0" }}>GAME OVER</h2>
            <p style={{ fontFamily: "'VT323'", fontSize: 21, color: "#a78bdb", marginBottom: 6 }}>The Troll King adds you to board game night.</p>
            <p style={{ fontFamily: "'VT323'", fontSize: 16, color: "#666", marginBottom: 28 }}>"Finally! Monopoly buddy!" — Grumbold</p>
            <button style={{ ...B("#8b5cf6"), fontSize: 13, padding: "14px 30px" }} onClick={() => sG(init())}>▶ Try Again</button>
          </div>
        )}

        {/* VICTORY */}
        {g.sc === "win" && (
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40, background: "linear-gradient(180deg,#1a2a00,#2d4a10,#4a7a20)" }}>
            <div style={{ fontSize: 80, animation: "bounce 1.5s infinite" }}>🎉</div>
            <h2 style={{ fontSize: 16, color: "#fbbf24", animation: "glow 2s infinite", margin: "14px 0", lineHeight: 2 }}>VICTORY!</h2>
            <p style={{ fontFamily: "'VT323'", fontSize: 23, color: "#e8d5b7", marginBottom: 6 }}>Troll King Grumbold defeated!</p>
            <p style={{ fontFamily: "'VT323'", fontSize: 18, color: "#a78bdb", marginBottom: 10 }}>The townsfolk are free!</p>
            <p style={{ fontFamily: "'VT323'", fontSize: 18, color: "#888", fontStyle: "italic", margin: "8px 0 18px" }}>"I just wanted someone to play Catan with... 😢"</p>
            <div style={{ fontSize: 32, marginBottom: 14, letterSpacing: 5 }}>👨‍🌾👩‍🍳👦🧝‍♀️💂👴</div>
            <p style={{ fontFamily: "'VT323'", fontSize: 16, color: "#4ade80", marginBottom: 20 }}>Baker Betty bakes you a cake 🎂</p>
            <div style={{ fontFamily: "'VT323'", fontSize: 16, color: "#a78bdb", marginBottom: 18 }}>Lv {p.lv} | 💰{p.g} | 🔍{g.clues}/5</div>
            <button style={{ ...B("#8b5cf6"), fontSize: 13, padding: "14px 30px" }} onClick={() => sG(init())}>▶ New Game</button>
          </div>
        )}
      </div>
    </div>
  );
}
