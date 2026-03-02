import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import * as Tone from "tone";

/* ═══════════════════════════════════════════════════════════════════════
   TROLL KING'S BOREDOM — Upgraded with top-down map, pixel art & music
   ═══════════════════════════════════════════════════════════════════════ */

const TS = 24; // tile size for map
const COLS = 28, ROWS = 20;
const PX = 4; // pixel size for sprite drawing

// ─── COLORS ──────────────────────────────────────────────────────────
const COL = {
  skin: "#f4b87e", skinDk: "#d49a5c", hair: "#5c3317", hairLt: "#7a4a2a",
  shirt: "#3b82f6", shirtDk: "#2563eb", pants: "#4a2f20", pantsLt: "#6b4226",
  boots: "#2d1b0e", sword: "#c0c0c0", swordHi: "#e0e0e0", cape: "#dc2626",
  eye: "#1a1a2e", white: "#fff",
  // enemies
  mushR: "#e74c3c", mushW: "#f5f0e1", mushBr: "#8b6914",
  slimeG: "#4ade80", slimeGd: "#22c55e", slimeGl: "#86efac",
  trollG: "#6b8e23", trollGd: "#556b2f", crown: "#fbbf24", crownGem: "#dc2626",
  batPurp: "#7c3aed", batDk: "#5b21b6",
  wolfGr: "#9ca3af", wolfDk: "#6b7280",
  knightBk: "#1f2937", knightGr: "#374151",
  witchPurp: "#a855f7", witchDk: "#7c3aed",
};

// ─── PIXEL SPRITE DRAWING ────────────────────────────────────────────
const drawPixels = (ctx, ox, oy, pixels, s = PX) => {
  pixels.forEach(([x, y, c]) => { ctx.fillStyle = c; ctx.fillRect(ox + x * s, oy + y * s, s, s); });
};

// Hero sprite (16x16 grid at PX scale)
const HERO_DOWN = [
  [5,0,COL.hair],[6,0,COL.hair],[7,0,COL.hair],[8,0,COL.hair],[9,0,COL.hair],[10,0,COL.hair],
  [4,1,COL.hair],[5,1,COL.hairLt],[6,1,COL.hairLt],[7,1,COL.hairLt],[8,1,COL.hairLt],[9,1,COL.hairLt],[10,1,COL.hair],[11,1,COL.hair],
  [4,2,COL.hair],[5,2,COL.skin],[6,2,COL.skin],[7,2,COL.skin],[8,2,COL.skin],[9,2,COL.skin],[10,2,COL.skin],[11,2,COL.hair],
  [4,3,COL.skin],[5,3,COL.skin],[6,3,COL.eye],[7,3,COL.skin],[8,3,COL.skin],[9,3,COL.eye],[10,3,COL.skin],[11,3,COL.skin],
  [5,4,COL.skin],[6,4,COL.skin],[7,4,COL.skinDk],[8,4,COL.skinDk],[9,4,COL.skin],[10,4,COL.skin],
  [5,5,COL.skin],[6,5,COL.skin],[7,5,COL.skin],[8,5,COL.skin],[9,5,COL.skin],[10,5,COL.skin],
  [4,6,COL.cape],[5,6,COL.shirt],[6,6,COL.shirt],[7,6,COL.shirt],[8,6,COL.shirt],[9,6,COL.shirt],[10,6,COL.shirt],[11,6,COL.cape],
  [3,7,COL.cape],[4,7,COL.cape],[5,7,COL.shirt],[6,7,COL.shirtDk],[7,7,COL.shirtDk],[8,7,COL.shirtDk],[9,7,COL.shirtDk],[10,7,COL.shirt],[11,7,COL.cape],[12,7,COL.cape],
  [3,8,COL.skin],[4,8,COL.cape],[5,8,COL.shirt],[6,8,COL.shirt],[7,8,COL.shirt],[8,8,COL.shirt],[9,8,COL.shirt],[10,8,COL.shirt],[11,8,COL.cape],[12,8,COL.skin],
  [3,9,COL.skin],[5,9,COL.shirt],[6,9,COL.shirt],[7,9,COL.shirt],[8,9,COL.shirt],[9,9,COL.shirt],[10,9,COL.shirt],[12,9,COL.sword],
  [5,10,COL.pants],[6,10,COL.pants],[7,10,COL.pants],[8,10,COL.pants],[9,10,COL.pants],[10,10,COL.pants],[12,10,COL.sword],
  [5,11,COL.pants],[6,11,COL.pantsLt],[7,11,COL.pants],[8,11,COL.pants],[9,11,COL.pantsLt],[10,11,COL.pants],[12,11,COL.swordHi],
  [5,12,COL.boots],[6,12,COL.boots],[7,12,COL.pants],[8,12,COL.pants],[9,12,COL.boots],[10,12,COL.boots],
  [4,13,COL.boots],[5,13,COL.boots],[6,13,COL.boots],[9,13,COL.boots],[10,13,COL.boots],[11,13,COL.boots],
];

// Enemy sprites for battle (drawn bigger)
const SPRITE_MUSHROOM = (s) => [
  [4,0,COL.mushR],[5,0,COL.mushR],[6,0,COL.mushR],[7,0,COL.mushR],
  [3,1,COL.mushR],[4,1,"#ff6b6b"],[5,1,COL.mushR],[6,1,"#ff6b6b"],[7,1,COL.mushR],[8,1,COL.mushR],
  [2,2,COL.mushR],[3,2,COL.mushR],[4,2,COL.white],[5,2,COL.mushR],[6,2,COL.mushR],[7,2,COL.white],[8,2,COL.mushR],[9,2,COL.mushR],
  [2,3,COL.mushR],[3,3,COL.mushR],[4,3,COL.mushR],[5,3,COL.mushR],[6,3,COL.mushR],[7,3,COL.mushR],[8,3,COL.mushR],[9,3,COL.mushR],
  [4,4,COL.mushW],[5,4,COL.mushW],[6,4,COL.mushW],[7,4,COL.mushW],
  [4,5,COL.mushW],[5,5,COL.eye],[6,5,COL.eye],[7,5,COL.mushW],
  [4,6,COL.mushBr],[5,6,COL.mushW],[6,6,COL.mushW],[7,6,COL.mushBr],
  [3,7,COL.mushBr],[4,7,COL.mushBr],[5,7,COL.mushBr],[6,7,COL.mushBr],[7,7,COL.mushBr],[8,7,COL.mushBr],
];

const SPRITE_SLIME = () => [
  [4,1,COL.slimeGl],[5,1,COL.slimeG],[6,1,COL.slimeG],[7,1,COL.slimeGl],
  [3,2,COL.slimeG],[4,2,COL.slimeGl],[5,2,COL.slimeG],[6,2,COL.slimeG],[7,2,COL.slimeG],[8,2,COL.slimeG],
  [2,3,COL.slimeG],[3,3,COL.slimeG],[4,3,COL.white],[5,3,COL.eye],[6,3,COL.slimeG],[7,3,COL.white],[8,3,COL.eye],[9,3,COL.slimeG],
  [2,4,COL.slimeGd],[3,4,COL.slimeG],[4,4,COL.slimeG],[5,4,COL.slimeG],[6,4,COL.slimeG],[7,4,COL.slimeG],[8,4,COL.slimeG],[9,4,COL.slimeGd],
  [2,5,COL.slimeGd],[3,5,COL.slimeGd],[4,5,COL.slimeG],[5,5,COL.slimeG],[6,5,COL.slimeG],[7,5,COL.slimeG],[8,5,COL.slimeGd],[9,5,COL.slimeGd],
  [3,6,COL.slimeGd],[4,6,COL.slimeGd],[5,6,COL.slimeGd],[6,6,COL.slimeGd],[7,6,COL.slimeGd],[8,6,COL.slimeGd],
];

const SPRITE_WOLF = () => [
  [2,1,COL.wolfGr],[3,1,COL.wolfGr],[8,0,COL.wolfGr],[9,0,COL.wolfGr],
  [1,2,COL.wolfGr],[2,2,COL.wolfDk],[3,2,COL.wolfGr],[4,2,COL.wolfGr],[5,2,COL.wolfGr],[6,2,COL.wolfGr],[7,2,COL.wolfGr],[8,2,COL.wolfGr],[9,2,COL.wolfDk],
  [1,3,COL.wolfGr],[2,3,COL.white],[3,3,COL.eye],[4,3,COL.wolfGr],[5,3,COL.wolfGr],[6,3,COL.wolfGr],[7,3,COL.white],[8,3,COL.eye],[9,3,COL.wolfGr],
  [2,4,COL.wolfGr],[3,4,COL.wolfGr],[4,4,COL.wolfDk],[5,4,"#ef4444"],[6,4,"#ef4444"],[7,4,COL.wolfDk],[8,4,COL.wolfGr],[9,4,COL.wolfGr],
  [1,5,COL.wolfDk],[2,5,COL.wolfGr],[3,5,COL.wolfGr],[4,5,COL.wolfGr],[5,5,COL.wolfGr],[6,5,COL.wolfGr],[7,5,COL.wolfGr],[8,5,COL.wolfGr],[9,5,COL.wolfDk],[10,5,COL.wolfDk],
  [1,6,COL.wolfDk],[2,6,COL.wolfDk],[4,6,COL.wolfDk],[5,6,COL.wolfDk],[7,6,COL.wolfDk],[8,6,COL.wolfDk],[10,6,COL.wolfDk],
];

const SPRITE_TROLL_KING = () => [
  [4,0,COL.crownGem],[5,0,COL.crown],[6,0,COL.crownGem],[7,0,COL.crown],[8,0,COL.crownGem],
  [3,1,COL.crown],[4,1,COL.crown],[5,1,COL.crown],[6,1,COL.crown],[7,1,COL.crown],[8,1,COL.crown],[9,1,COL.crown],
  [3,2,COL.trollG],[4,2,COL.trollG],[5,2,COL.trollG],[6,2,COL.trollG],[7,2,COL.trollG],[8,2,COL.trollG],[9,2,COL.trollG],
  [2,3,COL.trollG],[3,3,COL.trollG],[4,3,COL.white],[5,3,"#dc2626"],[6,3,COL.trollG],[7,3,COL.white],[8,3,"#dc2626"],[9,3,COL.trollG],[10,3,COL.trollG],
  [2,4,COL.trollG],[3,4,COL.trollG],[4,4,COL.trollG],[5,4,COL.trollG],[6,4,COL.trollGd],[7,4,COL.trollG],[8,4,COL.trollG],[9,4,COL.trollG],[10,4,COL.trollG],
  [2,5,COL.trollGd],[3,5,COL.trollG],[4,5,"#f5f0e1"],[5,5,"#f5f0e1"],[6,5,"#f5f0e1"],[7,5,"#f5f0e1"],[8,5,"#f5f0e1"],[9,5,COL.trollG],[10,5,COL.trollGd],
  [1,6,COL.trollG],[2,6,COL.trollGd],[3,6,COL.cape],[4,6,COL.cape],[5,6,COL.cape],[6,6,COL.cape],[7,6,COL.cape],[8,6,COL.cape],[9,6,COL.cape],[10,6,COL.trollGd],[11,6,COL.trollG],
  [1,7,COL.trollG],[2,7,COL.cape],[3,7,"#b91c1c"],[4,7,COL.cape],[5,7,COL.crown],[6,7,COL.cape],[7,7,COL.crown],[8,7,COL.cape],[9,7,"#b91c1c"],[10,7,COL.cape],[11,7,COL.trollG],
  [1,8,COL.trollG],[3,8,COL.cape],[4,8,COL.cape],[5,8,COL.cape],[6,8,COL.cape],[7,8,COL.cape],[8,8,COL.cape],[9,8,COL.cape],[11,8,COL.trollG],
  [3,9,COL.trollGd],[4,9,COL.trollGd],[5,9,COL.trollGd],[6,9,COL.trollGd],[7,9,COL.trollGd],[8,9,COL.trollGd],[9,9,COL.trollGd],
  [3,10,COL.trollGd],[4,10,COL.boots],[5,10,COL.boots],[7,10,COL.boots],[8,10,COL.boots],[9,10,COL.trollGd],
];

const SPRITE_KNIGHT = () => [
  [5,0,COL.knightGr],[6,0,COL.knightGr],[7,0,COL.knightGr],
  [4,1,COL.knightBk],[5,1,COL.knightGr],[6,1,COL.knightGr],[7,1,COL.knightGr],[8,1,COL.knightBk],
  [4,2,COL.knightBk],[5,2,"#ef4444"],[6,2,COL.knightBk],[7,2,"#ef4444"],[8,2,COL.knightBk],
  [3,3,COL.knightBk],[4,3,COL.knightGr],[5,3,COL.knightGr],[6,3,COL.knightGr],[7,3,COL.knightGr],[8,3,COL.knightGr],[9,3,COL.knightBk],
  [2,4,COL.sword],[3,4,COL.knightBk],[4,4,COL.knightGr],[5,4,COL.knightBk],[6,4,COL.knightBk],[7,4,COL.knightBk],[8,4,COL.knightGr],[9,4,COL.knightBk],
  [2,5,COL.swordHi],[3,5,COL.knightBk],[4,5,COL.knightGr],[5,5,COL.knightGr],[6,5,COL.knightGr],[7,5,COL.knightGr],[8,5,COL.knightGr],[9,5,COL.knightBk],
  [3,6,COL.knightBk],[4,6,COL.knightBk],[5,6,COL.knightBk],[6,6,COL.knightBk],[7,6,COL.knightBk],[8,6,COL.knightBk],[9,6,COL.knightBk],
  [4,7,COL.knightBk],[5,7,COL.knightBk],[7,7,COL.knightBk],[8,7,COL.knightBk],
];

const ENEMY_SPRITES = {
  "🍄": SPRITE_MUSHROOM, "🟢": SPRITE_SLIME, "🐿️": SPRITE_MUSHROOM, "🐝": SPRITE_SLIME,
  "🦉": SPRITE_WOLF, "🌿": SPRITE_SLIME, "🪨": SPRITE_KNIGHT, "🐉": SPRITE_WOLF,
  "❄️": SPRITE_WOLF, "🦅": SPRITE_WOLF, "🐺": SPRITE_WOLF,
  "👹": SPRITE_KNIGHT, "🖤": SPRITE_KNIGHT, "⚔️": SPRITE_KNIGHT,
  "🧙": SPRITE_KNIGHT, "📦": SPRITE_MUSHROOM, "👑": SPRITE_TROLL_KING,
};

// ─── TILE MAP DATA ───────────────────────────────────────────────────
// 0=grass,1=tree,2=path,3=water,4=mountain,5=wall,6=floor,7=door,8=house,9=bridge,10=castle
const T_GRASS=0,T_TREE=1,T_PATH=2,T_WATER=3,T_MTN=4,T_WALL=5,T_FLOOR=6,T_DOOR=7,T_HOUSE=8,T_BRIDGE=9,T_CASTLE=10,T_SAND=11,T_FLOWERS=12,T_CAVE=13;

const TILE_COL = {
  [T_GRASS]:["#4a7a2e","#3d6b25"], [T_TREE]:["#1a472a","#2d5a1e"],
  [T_PATH]:["#c4a66a","#b8976a"], [T_WATER]:["#2563eb","#3b82f6"],
  [T_MTN]:["#64748b","#475569"], [T_WALL]:["#44403c","#57534e"],
  [T_FLOOR]:["#78716c","#6b6560"], [T_DOOR]:["#92400e","#78350f"],
  [T_HOUSE]:["#b45309","#a3470e"], [T_BRIDGE]:["#92400e","#7c3a0e"],
  [T_CASTLE]:["#581c87","#4c1d95"], [T_SAND]:["#d4a657","#c9974d"],
  [T_FLOWERS]:["#4a7a2e","#ec4899"], [T_CAVE]:["#292524","#1c1917"],
};
const SOLID = new Set([T_TREE,T_WATER,T_MTN,T_WALL,T_HOUSE,T_CASTLE]);

const MAPS = {
  town: (() => {
    const m = Array.from({length:ROWS},()=>Array(COLS).fill(T_GRASS));
    // borders
    for(let x=0;x<COLS;x++){m[0][x]=T_TREE;m[ROWS-1][x]=T_TREE;}
    for(let y=0;y<ROWS;y++){m[y][0]=T_TREE;m[y][COLS-1]=T_TREE;}
    // paths
    for(let x=3;x<COLS-3;x++){m[10][x]=T_PATH;m[9][x]=T_PATH;}
    for(let y=3;y<17;y++){m[y][14]=T_PATH;m[y][13]=T_PATH;}
    // houses
    for(let dy=0;dy<3;dy++)for(let dx=0;dx<4;dx++){m[3+dy][3+dx]=T_HOUSE;m[3+dy][20+dx]=T_HOUSE;m[14+dy][3+dx]=T_HOUSE;m[14+dy][20+dx]=T_HOUSE;}
    m[5][4]=T_DOOR;m[5][21]=T_DOOR;m[16][4]=T_DOOR;m[16][21]=T_DOOR;
    // flowers
    m[7][7]=T_FLOWERS;m[7][8]=T_FLOWERS;m[8][7]=T_FLOWERS;m[12][18]=T_FLOWERS;m[12][19]=T_FLOWERS;
    // water/well
    m[8][13]=T_WATER;m[8][14]=T_WATER;m[7][13]=T_WATER;
    // exit north
    m[0][13]=T_PATH;m[0][14]=T_PATH;
    return m;
  })(),
  overworld: (() => {
    const m = Array.from({length:ROWS},()=>Array(COLS).fill(T_GRASS));
    for(let x=0;x<COLS;x++){m[0][x]=T_MTN;m[ROWS-1][x]=T_TREE;}
    for(let y=0;y<ROWS;y++){m[y][0]=T_TREE;m[y][COLS-1]=T_TREE;}
    // forest areas
    for(let y=12;y<18;y++)for(let x=1;x<10;x++)if(Math.random()<0.5)m[y][x]=T_TREE;
    for(let y=12;y<18;y++)for(let x=18;x<27;x++)if(Math.random()<0.4)m[y][x]=T_TREE;
    // path from south to north
    for(let y=1;y<ROWS-1;y++){m[y][13]=T_PATH;m[y][14]=T_PATH;}
    // river
    for(let x=3;x<12;x++){m[8][x]=T_WATER;m[9][x]=T_WATER;}
    m[8][12]=T_BRIDGE;m[9][12]=T_BRIDGE;m[8][13]=T_PATH;m[9][13]=T_PATH;
    // mountains top
    for(let y=0;y<5;y++)for(let x=0;x<COLS;x++)if(x<5||x>22||Math.random()<0.3)m[y][x]=T_MTN;
    m[0][13]=T_CAVE;m[0][14]=T_CAVE;m[1][13]=T_PATH;m[1][14]=T_PATH;
    // sand patches
    m[11][10]=T_SAND;m[11][11]=T_SAND;m[10][10]=T_SAND;
    // flowers
    m[15][5]=T_FLOWERS;m[15][6]=T_FLOWERS;m[14][22]=T_FLOWERS;
    // south entrance
    m[ROWS-1][13]=T_PATH;m[ROWS-1][14]=T_PATH;
    return m;
  })(),
  castle: (() => {
    const m = Array.from({length:ROWS},()=>Array(COLS).fill(T_WALL));
    // hallways
    for(let y=2;y<ROWS-2;y++)for(let x=5;x<23;x++)m[y][x]=T_FLOOR;
    // rooms
    for(let y=3;y<8;y++)for(let x=6;x<12;x++)m[y][x]=T_FLOOR;
    for(let y=3;y<8;y++)for(let x=16;x<22;x++)m[y][x]=T_FLOOR;
    // walls inside
    for(let x=5;x<23;x++){m[2][x]=T_WALL;m[8][x]=T_WALL;m[ROWS-2][x]=T_WALL;}
    m[8][13]=T_DOOR;m[8][14]=T_DOOR;m[2][13]=T_DOOR;m[2][14]=T_DOOR;
    // throne room
    for(let y=9;y<ROWS-2;y++)for(let x=8;x<20;x++)m[y][x]=T_FLOOR;
    m[10][13]=T_CASTLE;m[10][14]=T_CASTLE;m[11][13]=T_CASTLE;m[11][14]=T_CASTLE;
    // entrance south
    m[ROWS-1][13]=T_PATH;m[ROWS-1][14]=T_PATH;m[ROWS-2][13]=T_FLOOR;m[ROWS-2][14]=T_FLOOR;
    return m;
  })(),
};

// ─── MUSIC with Tone.js ──────────────────────────────────────────────
let musicStarted = false;
let currentTrack = null;
let synthLead = null, synthBass = null, synthDrum = null;
let seqLead = null, seqBass = null, seqDrum = null;

const TRACKS = {
  town: {
    bpm: 110,
    lead: ["C4","E4","G4","A4","G4","E4","D4","C4","D4","E4","G4","E4","C4","D4","E4","C4"],
    bass: ["C2","C2","G2","G2","A2","A2","E2","E2","F2","F2","G2","G2","C2","C2","G2","G2"],
    time: "8n",
  },
  battle: {
    bpm: 155,
    lead: ["E4","E4","B4","B4","C5","C5","B4","null","A4","A4","G4","G4","A4","B4","A4","null",
           "E4","E4","B4","B4","C5","D5","C5","B4","A4","G4","A4","null","E4","null","E4","null"],
    bass: ["E2","E2","E2","E2","A2","A2","A2","A2","C3","C3","B2","B2","A2","A2","E2","E2"],
    time: "16n",
  },
  boss: {
    bpm: 170,
    lead: ["D4","D4","F4","A4","D5","null","C5","A4","F4","null","D4","F4","G4","A4","G4","F4",
           "D4","D4","F4","A4","D5","F5","D5","null","C5","A4","F4","D4","null","D4","null","null"],
    bass: ["D2","D2","D2","D2","F2","F2","F2","F2","A2","A2","G2","G2","F2","F2","D2","D2"],
    time: "16n",
  },
  explore: {
    bpm: 120,
    lead: ["G3","B3","D4","G4","F4","D4","B3","G3","A3","C4","E4","A4","G4","E4","C4","A3"],
    bass: ["G2","G2","D2","D2","A2","A2","E2","E2","G2","G2","D2","D2","C3","C3","G2","G2"],
    time: "8n",
  },
};

const startMusic = async (track) => {
  if (currentTrack === track) return;
  currentTrack = track;
  try {
    await Tone.start();
    Tone.getTransport().stop();
    Tone.getTransport().cancel();
    if (seqLead) { seqLead.dispose(); seqLead = null; }
    if (seqBass) { seqBass.dispose(); seqBass = null; }
    if (seqDrum) { seqDrum.dispose(); seqDrum = null; }
    if (!synthLead) {
      synthLead = new Tone.Synth({ oscillator: { type: "square" }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.1 }, volume: -14 }).toDestination();
      synthBass = new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.1 }, volume: -16 }).toDestination();
      synthDrum = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 }, volume: -22 }).toDestination();
    }
    const t = TRACKS[track]; if (!t) return;
    Tone.getTransport().bpm.value = t.bpm;
    let li = 0, bi = 0;
    seqLead = new Tone.Loop(time => {
      const note = t.lead[li % t.lead.length];
      if (note !== "null") synthLead.triggerAttackRelease(note, t.time, time);
      li++;
    }, t.time).start(0);
    seqBass = new Tone.Loop(time => {
      synthBass.triggerAttackRelease(t.bass[bi % t.bass.length], "8n", time);
      bi++;
    }, "8n").start(0);
    let di = 0;
    seqDrum = new Tone.Loop(time => {
      if (di % 4 === 0) synthDrum.triggerAttackRelease("16n", time);
      di++;
    }, "16n").start(0);
    Tone.getTransport().start();
    musicStarted = true;
  } catch(e) { console.warn("Music error:", e); }
};

const stopMusic = () => {
  try {
    Tone.getTransport().stop();
    Tone.getTransport().cancel();
    currentTrack = null;
  } catch(e) {}
};

const playSfx = (type) => {
  try {
    const s = new Tone.Synth({ oscillator: { type: "square" }, envelope: { attack: 0.01, decay: 0.08, sustain: 0, release: 0.05 }, volume: -10 }).toDestination();
    if (type === "hit") { s.triggerAttackRelease("C3", "32n"); setTimeout(() => s.triggerAttackRelease("G2", "32n"), 50); }
    else if (type === "heal") { s.triggerAttackRelease("C5", "16n"); setTimeout(() => s.triggerAttackRelease("E5", "16n"), 80); setTimeout(() => s.triggerAttackRelease("G5", "16n"), 160); }
    else if (type === "menu") { s.triggerAttackRelease("E5", "32n"); }
    else if (type === "die") { s.triggerAttackRelease("E3", "8n"); setTimeout(() => s.triggerAttackRelease("C3", "8n"), 150); setTimeout(() => s.triggerAttackRelease("A2", "4n"), 300); }
    else if (type === "levelup") { s.triggerAttackRelease("C4","16n"); setTimeout(()=>s.triggerAttackRelease("E4","16n"),100); setTimeout(()=>s.triggerAttackRelease("G4","16n"),200); setTimeout(()=>s.triggerAttackRelease("C5","8n"),300); }
    setTimeout(() => s.dispose(), 1000);
  } catch(e) {}
};

// ─── GAME DATA (compact) ────────────────────────────────────────────
const R = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const P = a => a[Math.floor(Math.random() * a.length)];
const CL = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const ITEMS=[{n:"Herb",hp:30,e:"🌿",sp:null},{n:"Potion",hp:60,e:"🧪",sp:null},{n:"Elixir",hp:999,e:"✨",sp:null},{n:"Smoke Bomb",hp:0,e:"💨",sp:"esc"},{n:"Bomb",hp:0,e:"💣",sp:"dmg",dm:40},{n:"Fire Flask",hp:0,e:"🔥",sp:"aoe",dm:25}];
const SPELLS=[{n:"Fireball",mp:8,dm:25,t:"dmg",e:"🔥"},{n:"Ice Shard",mp:6,dm:18,t:"dmg",e:"🧊"},{n:"Thunder",mp:12,dm:35,t:"dmg",e:"⚡"},{n:"Inferno",mp:18,dm:22,t:"aoe",e:"🌋"},{n:"Heal",mp:5,t:"heal",hl:40,e:"💚"},{n:"G.Heal",mp:10,t:"heal",hl:80,e:"💖"}];
const WEAPONS=[{n:"Rusty Sword",a:8},{n:"Iron Blade",a:14},{n:"Flame Edge",a:22},{n:"Holy Avenger",a:30}];
const ARMORS=[{n:"Cloth Tunic",d:3},{n:"Chainmail",d:8},{n:"Plate Armor",d:14}];

const CRY=[{t:"Tears form a puddle — everyone slips!",dm:20,k:"aoe"},{t:"Sobbing makes enemies feel guilty!",dm:0,k:"debuff"},{t:"ACID TEARS splash everywhere!",dm:35,k:"aoe"},{t:"Accidental headbutt!",dm:15,k:"st"},{t:"Tears crystallize into a shield!",dm:0,k:"buff"},{t:"Rainbow laser from your tears!",dm:40,k:"aoe"},{t:"Ugly cry freezes enemies!",dm:0,k:"stun"},{t:"Sentient water blob attacks!",dm:30,k:"st"},{t:"Backflip kick off your own tears!",dm:22,k:"st"},{t:"Tears evaporate — poison cloud!",dm:28,k:"aoe"}];
const EFUN=[{t:"trips over its own feet!",d:10},{t:"gets distracted by a butterfly!",d:0},{t:"sneezes mid-swing!",d:8},{t:"ponders existence...",d:0},{t:"critical hits ITSELF!",d:25},{t:"pulls a muscle flexing!",d:12},{t:"bites its own tongue!",d:9},{t:"recreates Napoleon's retreat!",d:7}];

const EN={
  forest:[{n:"Angry Mushroom",e:"🍄",hp:30,a:6,d:2,xp:12,g:8},{n:"Sassy Slime",e:"🟢",hp:22,a:5,d:1,xp:8,g:5},{n:"Grumpy Squirrel",e:"🐿️",hp:28,a:7,d:3,xp:10,g:7},{n:"Bee Swarm",e:"🐝",hp:18,a:8,d:1,xp:9,g:4},{n:"Confused Owl",e:"🦉",hp:35,a:9,d:4,xp:15,g:10}],
  mountains:[{n:"Rock Golem",e:"🪨",hp:55,a:12,d:8,xp:25,g:18},{n:"Sky Serpent",e:"🐉",hp:50,a:15,d:5,xp:28,g:20},{n:"Yeti Cub",e:"❄️",hp:65,a:14,d:7,xp:30,g:22},{n:"Snow Wolf",e:"🐺",hp:45,a:14,d:6,xp:24,g:17},{n:"Cranky Eagle",e:"🦅",hp:40,a:16,d:4,xp:22,g:15}],
  castle:[{n:"Troll Guard",e:"👹",hp:85,a:18,d:10,xp:40,g:30},{n:"Dark Knight",e:"🖤",hp:95,a:20,d:12,xp:45,g:35},{n:"Shadow Witch",e:"🧙",hp:65,a:25,d:8,xp:48,g:38},{n:"Mimic Chest",e:"📦",hp:75,a:19,d:11,xp:50,g:50}],
};
const BOSS={n:"Troll King Grumbold",e:"👑",hp:350,a:28,d:15,xp:500,g:999,boss:true};

const NPCS=[{n:"Elder",e:"👴",x:5,y:7,d:["People vanish at night...","Rumbling from the mountains.","Find our townsfolk!"]},{n:"Betty",e:"👩‍🍳",x:21,y:7,d:["Trolls have a KING!","He kidnaps for BOARD GAMES!","Castle is beyond mountains!"]},{n:"Steve",e:"💂",x:5,y:16,d:["Huge troll with a CROWN!","Castle behind the waterfall.","Be careful out there!"]},{n:"Mira",e:"🧝‍♀️",x:21,y:16,d:["Stock up on potions!","Mountains are dangerous.","Troll King is ticklish?"],shop:true},{n:"Timmy",e:"👦",x:11,y:12,d:["My mom was taken!","Prison in EAST TOWER!","Please save her!"]},{n:"Cat",e:"🐱",x:16,y:7,d:["Meow.","Meow meow.","MEOW! *gives potion*"],gift:true}];

const SHOP=[{n:"Herb",p:15,i:0},{n:"Potion",p:40,i:1},{n:"Smoke Bomb",p:30,i:3},{n:"Bomb",p:50,i:4},{n:"Fire Flask",p:75,i:5},{n:"Iron Blade",p:120,i:1,tp:"w"},{n:"Flame Edge",p:300,i:2,tp:"w"},{n:"Chainmail",p:100,i:1,tp:"a"},{n:"Plate Armor",p:280,i:2,tp:"a"}];

const XPF = lv => Math.floor(30 * Math.pow(lv, 1.5));

const init = () => ({
  sc:"title",p:{lv:1,hp:80,mhp:80,mp:30,mmp:30,a:10,d:5,xp:0,g:50,w:0,ar:0,inv:[{i:0,q:3},{i:4,q:1}],sp:[0,4],ta:0},
  zone:"town",map:"town",px:13,py:17,en:[],ti:0,log:[],pt:true,anim:null,def:false,stun:{},proc:false,
  npc:{},clues:0,di:{},trans:null,sI:false,sS:false,sT:false,showShop:false,showNpc:null,npcDlg:"",
  steps:0,
});

// ═══════════════════════════════════════════════════════════════════════
export default function Game() {
  const [g, sG] = useState(init);
  const canvasRef = useRef(null);
  const lr = useRef(null);
  const animRef = useRef(null);
  const keysRef = useRef({});
  const moveTimerRef = useRef(null);

  const u = useCallback(fn => sG(p => { const n = JSON.parse(JSON.stringify(p)); fn(n); return n; }), []);

  const giveIt = (s, idx) => { const ex = s.p.inv.find(i => i.i === idx); if (ex) ex.q++; else s.p.inv.push({i:idx,q:1}); };
  const lvUp = s => {
    let need = XPF(s.p.lv); let lvd = false;
    while (s.p.xp >= need && s.p.lv < 30) {
      s.p.lv++; s.p.xp -= need; s.p.mhp += 12; s.p.mmp += 5; s.p.a += 3; s.p.d += 2;
      s.p.hp = s.p.mhp; s.p.mp = s.p.mmp; need = XPF(s.p.lv); lvd = true;
      if (s.p.lv===3&&!s.p.sp.includes(1)) s.p.sp.push(1);
      if (s.p.lv===5&&!s.p.sp.includes(5)) s.p.sp.push(5);
      if (s.p.lv===7&&!s.p.sp.includes(2)) s.p.sp.push(2);
      if (s.p.lv===9&&!s.p.sp.includes(3)) s.p.sp.push(3);
    }
    if (lvd) playSfx("levelup");
  };

  // ─── MAP RENDERING ──
  useEffect(() => {
    if (g.sc !== "map") return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = COLS * TS, H = ROWS * TS;
    canvas.width = W; canvas.height = H;

    const draw = () => {
      const map = MAPS[g.map]; if (!map) return;
      // Draw tiles
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
        const t = map[y][x];
        const cols = TILE_COL[t] || ["#333","#444"];
        ctx.fillStyle = cols[(x + y) % 2];
        ctx.fillRect(x * TS, y * TS, TS, TS);
        // tile details
        if (t === T_TREE) {
          ctx.fillStyle = "#0d3b10"; ctx.fillRect(x*TS+8,y*TS+2,8,6);
          ctx.fillStyle = "#2d5a1e"; ctx.fillRect(x*TS+4,y*TS+4,16,8);
          ctx.fillStyle = "#5c3317"; ctx.fillRect(x*TS+10,y*TS+12,4,12);
        } else if (t === T_WATER) {
          ctx.fillStyle = "rgba(255,255,255,0.15)";
          ctx.fillRect(x*TS+4,y*TS+8+Math.sin(Date.now()/500+x)*2,12,2);
        } else if (t === T_HOUSE) {
          ctx.fillStyle = "#92400e"; ctx.fillRect(x*TS+2,y*TS+2,TS-4,TS-4);
          ctx.fillStyle = "#dc2626"; ctx.fillRect(x*TS,y*TS,TS,6);
        } else if (t === T_DOOR) {
          ctx.fillStyle = "#78350f"; ctx.fillRect(x*TS+6,y*TS+4,12,16);
          ctx.fillStyle = "#fbbf24"; ctx.fillRect(x*TS+15,y*TS+12,3,3);
        } else if (t === T_FLOWERS) {
          ctx.fillStyle = "#ec4899"; ctx.fillRect(x*TS+4,y*TS+6,4,4);
          ctx.fillStyle = "#f472b6"; ctx.fillRect(x*TS+14,y*TS+10,4,4);
          ctx.fillStyle = "#fbbf24"; ctx.fillRect(x*TS+8,y*TS+14,4,4);
        } else if (t === T_MTN) {
          ctx.fillStyle = "#94a3b8"; ctx.beginPath(); ctx.moveTo(x*TS+12,y*TS+2); ctx.lineTo(x*TS+22,y*TS+22); ctx.lineTo(x*TS+2,y*TS+22); ctx.fill();
          ctx.fillStyle = "#e2e8f0"; ctx.beginPath(); ctx.moveTo(x*TS+12,y*TS+2); ctx.lineTo(x*TS+16,y*TS+8); ctx.lineTo(x*TS+8,y*TS+8); ctx.fill();
        } else if (t === T_CASTLE) {
          ctx.fillStyle = "#7c3aed"; ctx.fillRect(x*TS+2,y*TS+2,TS-4,TS-4);
          ctx.fillStyle = "#fbbf24"; ctx.fillRect(x*TS+8,y*TS+6,8,8);
        } else if (t === T_CAVE) {
          ctx.fillStyle = "#1c1917"; ctx.fillRect(x*TS+4,y*TS+4,16,16);
          ctx.fillStyle = "#44403c"; ctx.fillRect(x*TS+2,y*TS+2,20,4);
        } else if (t === T_BRIDGE) {
          ctx.fillStyle = "#78350f"; ctx.fillRect(x*TS,y*TS+4,TS,TS-8);
          ctx.fillStyle = "#92400e"; for(let i=0;i<3;i++) ctx.fillRect(x*TS+2+i*8,y*TS+4,6,2);
        }
      }

      // Draw NPCs (town only)
      if (g.map === "town") {
        NPCS.forEach(npc => {
          ctx.font = `${TS-4}px serif`;
          ctx.textAlign = "center";
          ctx.fillText(npc.e, npc.x * TS + TS/2, npc.y * TS + TS - 2);
          if (!g.npc[npc.n]) {
            ctx.fillStyle = "#ef4444"; ctx.font = "bold 10px sans-serif";
            ctx.fillText("!", npc.x * TS + TS/2, npc.y * TS - 2);
          }
        });
      }

      // Draw player
      const px = g.px * TS, py = g.py * TS;
      drawPixels(ctx, px - 8, py - 12, HERO_DOWN, 3);

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [g.sc, g.map, g.px, g.py, g.npc]);

  // ─── KEYBOARD INPUT ──
  useEffect(() => {
    if (g.sc !== "map") return;
    const onKey = (e) => {
      if (g.trans || g.showShop || g.showNpc) return;
      let dx = 0, dy = 0;
      if (e.key === "ArrowUp" || e.key === "w") dy = -1;
      else if (e.key === "ArrowDown" || e.key === "s") dy = 1;
      else if (e.key === "ArrowLeft" || e.key === "a") dx = -1;
      else if (e.key === "ArrowRight" || e.key === "d") dx = 1;
      else if (e.key === " " || e.key === "Enter") { handleInteract(); return; }
      else return;
      e.preventDefault();
      tryMove(dx, dy);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [g.sc, g.px, g.py, g.map, g.trans, g.showShop, g.showNpc, g.npc, g.clues]);

  const tryMove = useCallback((dx, dy) => {
    u(s => {
      const nx = s.px + dx, ny = s.py + dy;
      const map = MAPS[s.map]; if (!map) return;
      // zone transitions
      if (ny < 0) {
        if (s.map === "town") {
          if (s.clues < 3) return;
          s.map = "overworld"; s.py = ROWS - 2; s.px = 13; return;
        }
        if (s.map === "overworld") { s.map = "castle"; s.py = ROWS - 2; s.px = 13; return; }
      }
      if (ny >= ROWS) {
        if (s.map === "overworld") { s.map = "town"; s.py = 1; s.px = 13; return; }
        if (s.map === "castle") { s.map = "overworld"; s.py = 1; s.px = 13; return; }
      }
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return;
      const tile = map[ny][nx];
      if (SOLID.has(tile)) return;
      // NPC collision
      if (s.map === "town") {
        const npc = NPCS.find(n => n.x === nx && n.y === ny);
        if (npc) return;
      }
      s.px = nx; s.py = ny;
      // random encounter on overworld/castle
      if (s.map === "overworld" || s.map === "castle") {
        s.steps++;
        if (s.steps % R(4, 8) === 0 && tile !== T_PATH) {
          // trigger battle transition
          s.trans = "battle";
        }
      }
      // boss trigger
      if (s.map === "castle" && tile === T_CASTLE) {
        s.trans = "boss";
      }
    });
  }, [u]);

  const handleInteract = useCallback(() => {
    u(s => {
      if (s.map !== "town") return;
      const dirs = [[0,-1],[0,1],[-1,0],[1,0]];
      for (const [dx, dy] of dirs) {
        const npc = NPCS.find(n => n.x === s.px + dx && n.y === s.py + dy);
        if (npc) {
          const di = s.di[npc.n] || 0;
          s.npcDlg = `${npc.e} ${npc.n}: "${npc.d[di]}"`;
          s.di[npc.n] = Math.min(di + 1, npc.d.length - 1);
          if (!s.npc[npc.n]) { s.npc[npc.n] = true; s.clues++; }
          if (npc.gift && di === npc.d.length - 1 && !s.npc[npc.n + "_g"]) { s.npc[npc.n + "_g"] = true; giveIt(s, 1); }
          if (npc.shop) { s.showShop = true; } else { s.showNpc = npc.n; }
          playSfx("menu");
          return;
        }
      }
    });
  }, [u]);

  // Handle transitions
  useEffect(() => {
    if (!g.trans) return;
    const t = setTimeout(() => {
      if (g.trans === "battle" || g.trans === "boss") {
        u(s => {
          const zone = s.map === "overworld" ? (s.py < 8 ? "mountains" : "forest") : "castle";
          let list = [];
          if (s.trans === "boss") {
            list = [{ ...BOSS, mhp: BOSS.hp, id: 0 }];
          } else {
            const pool = EN[zone]; const cnt = zone === "forest" ? R(1,2) : R(1,3);
            for (let i = 0; i < cnt; i++) { const e = {...P(pool)}; e.mhp = e.hp; e.id = i; list.push(e); }
          }
          s.en = list; s.ti = 0; s.sc = "battle"; s.trans = null;
          s.log = list.length === 1 ? [`${list[0].e} ${list[0].n} appeared!`] : [`${list.length} enemies! ${list.map(e=>e.e).join(" ")}`];
          s.pt = true; s.def = false; s.stun = {}; s.anim = null; s.proc = false; s.sI = false; s.sS = false;
        });
        startMusic(g.trans === "boss" ? "boss" : "battle");
      }
    }, 600);
    return () => clearTimeout(t);
  }, [g.trans, u]);

  // Music management
  useEffect(() => {
    if (g.sc === "map" && g.map === "town") startMusic("town");
    else if (g.sc === "map") startMusic("explore");
  }, [g.sc, g.map]);

  useEffect(() => { if (lr.current) lr.current.scrollTop = lr.current.scrollHeight; }, [g.log]);

  // ── Battle logic ──
  const chkEnd = s => {
    const alive = s.en.filter(e => e.hp > 0);
    if (alive.length === 0) {
      let tx = 0, tg = 0; s.en.forEach(e => { tx += e.xp; tg += e.g; });
      s.log = [...s.log, `🎉 Victory! +${tx} EXP +${tg}g`]; s.p.xp += tx; s.p.g += tg; s.p.ta = 0; lvUp(s);
      return true;
    }
    if (s.en[s.ti]?.hp <= 0) { const ni = s.en.findIndex(e => e.hp > 0); if (ni >= 0) s.ti = ni; }
    return false;
  };

  const enemyTurns = useCallback(() => {
    u(s => { s.proc = true; });
    const doOne = idx => {
      setTimeout(() => {
        u(s => {
          const alive = s.en.filter(e => e.hp > 0); const e = alive[idx];
          if (!e) { s.pt = true; s.def = false; s.proc = false; return; }
          if (s.stun[e.id]) { s.log = [...s.log, `${e.n} is stunned!`]; delete s.stun[e.id]; return; }
          if (Math.random() < 0.10) {
            const ev = P(EFUN); s.log = [...s.log, `${e.n} ${ev.t}`];
            if (ev.d > 0) { e.hp = Math.max(0, e.hp - ev.d); if (e.hp <= 0) chkEnd(s); } return;
          }
          let ap = e.a;
          if (e.boss) { const pct = e.hp/e.mhp; if(pct<=0.3)ap=Math.floor(ap*1.7);else if(pct<=0.6)ap=Math.floor(ap*1.3);
            if(Math.random()<0.3){const m=P([["TROLL SMASH",1.5],["BORING MONOLOGUE",0.5],["CROWN THROW",1.3],["TANTRUM STOMP",1.8]]);ap=Math.floor(ap*m[1]);s.log=[...s.log,`👑 ${m[0]}!`];}
          }
          const dm = s.def ? (s.p.d+ARMORS[s.p.ar].d)*2 : s.p.d+ARMORS[s.p.ar].d;
          const dmg = Math.max(1, ap - Math.floor(dm*0.6) + R(-3,3));
          s.p.hp = Math.max(0, s.p.hp - dmg); playSfx("hit");
          s.log = [...s.log, `${e.n} hits for ${dmg}!${s.def?" (Guard!)":""}`]; s.anim = {t:"ph"};
          if (s.p.hp <= 0) { s.log = [...s.log, "💀 Defeated..."]; playSfx("die"); }
        });
        setTimeout(() => {
          u(s => { s.anim = null; });
          u(s => {
            if (s.p.hp <= 0) { setTimeout(() => u(s2 => { s2.sc = "over"; stopMusic(); }), 800); return; }
            const alive = s.en.filter(e => e.hp > 0);
            if (idx + 1 < alive.length) doOne(idx + 1);
            else { s.pt = true; s.def = false; s.proc = false; }
          });
        }, 600);
      }, 500);
    }; doOne(0);
  }, [u]);

  const after = useCallback((dl = 500) => {
    setTimeout(() => {
      u(s => { s.anim = null; });
      u(s => {
        if (chkEnd(s)) {
          const wasBoss = s.en.some(e => e.boss);
          if (wasBoss) setTimeout(() => u(s2 => { s2.sc = "win"; stopMusic(); }), 2000);
          else setTimeout(() => { u(s2 => { s2.sc = "map"; s2.en = []; s2.log = []; }); startMusic(g.map === "town" ? "town" : "explore"); }, 1500);
          return;
        }
        if (!s.pt) {} 
      });
      setTimeout(() => u(s => { if (s.sc === "battle" && s.p.hp > 0 && s.en.some(e => e.hp > 0) && !s.pt) enemyTurns(); }), 100);
    }, dl);
  }, [u, enemyTurns, g.map]);

  // ── Player battle actions ──
  const act = {
    atk: () => { u(s=>{if(!s.pt||s.proc)return;s.pt=false;s.sS=false;s.sI=false;const t=s.en[s.ti];if(!t||t.hp<=0)return;const ta=s.p.a+WEAPONS[s.p.w].a+(s.p.ta||0);const base=Math.max(1,ta-Math.floor(t.d*0.5)+R(-2,4));const crit=Math.random()<0.12;const dmg=crit?base*2:base;t.hp=Math.max(0,t.hp-dmg);playSfx("hit");s.log=[...s.log,`⚔️ Strike ${t.n} for ${dmg}!${crit?" CRIT!":""}`];s.anim={t:"eh",i:s.ti};if(t.hp<=0)s.log=[...s.log,`💥 ${t.n} defeated!`];}); after(); },
    def: () => { u(s=>{if(!s.pt||s.proc)return;s.pt=false;s.def=true;s.sS=false;s.sI=false;s.log=[...s.log,"🛡️ Defense doubled!"];}); after(300); },
    spell: si => { u(s=>{if(!s.pt||s.proc)return;const sp=SPELLS[si];if(s.p.mp<sp.mp){s.log=[...s.log,"Not enough MP!"];return;}s.pt=false;s.sS=false;s.p.mp-=sp.mp;if(sp.t==="heal"){const hl=Math.min(sp.hl,s.p.mhp-s.p.hp);s.p.hp+=hl;playSfx("heal");s.log=[...s.log,`${sp.e} +${hl} HP!`];}else if(sp.t==="aoe"){s.en.filter(e=>e.hp>0).forEach(e=>{const d=sp.dm+R(-3,5);e.hp=Math.max(0,e.hp-d);s.log=[...s.log,`${sp.e} ${e.n} -${d}!`];if(e.hp<=0)s.log=[...s.log,`💥 ${e.n} down!`];});playSfx("hit");s.anim={t:"all"};}else{const t=s.en[s.ti];if(!t||t.hp<=0)return;const d=sp.dm+R(-3,5);t.hp=Math.max(0,t.hp-d);playSfx("hit");s.log=[...s.log,`${sp.e} ${t.n} -${d}!`];s.anim={t:"eh",i:s.ti};if(t.hp<=0)s.log=[...s.log,`💥 ${t.n} down!`];}}); after(); },
    item: ii => { u(s=>{if(!s.pt||s.proc)return;const inv=s.p.inv;const slot=inv[ii];if(!slot||slot.q<=0)return;s.pt=false;s.sI=false;const it=ITEMS[slot.i];if(it.sp==="esc"){s.log=[...s.log,"💨 Escaped!"];slot.q--;if(slot.q<=0)inv.splice(ii,1);setTimeout(()=>{u(s2=>{s2.sc="map";s2.en=[];});startMusic(g.map==="town"?"town":"explore");},500);return;}else if(it.sp==="aoe"){s.en.filter(e=>e.hp>0).forEach(e=>{const d=it.dm+R(-5,5);e.hp=Math.max(0,e.hp-d);s.log=[...s.log,`🔥 ${e.n} -${d}!`];if(e.hp<=0)s.log=[...s.log,`💥 ${e.n} down!`];});playSfx("hit");s.anim={t:"all"};}else if(it.sp==="dmg"){const t=s.en[s.ti];if(t&&t.hp>0){const d=it.dm+R(-5,5);t.hp=Math.max(0,t.hp-d);playSfx("hit");s.log=[...s.log,`💣 ${t.n} -${d}!`];s.anim={t:"eh",i:s.ti};if(t.hp<=0)s.log=[...s.log,`💥 ${t.n} down!`];}}else{const hl=Math.min(it.hp,s.p.mhp-s.p.hp);s.p.hp+=hl;playSfx("heal");s.log=[...s.log,`${it.e} +${hl} HP!`];}slot.q--;if(slot.q<=0)inv.splice(ii,1);}); after(); },
    run: () => { u(s=>{if(!s.pt||s.proc)return;s.pt=false;s.sS=false;s.sI=false;const boss=s.en.some(e=>e.boss&&e.hp>0);if(!boss&&Math.random()<0.55){s.log=[...s.log,"🏃 Escaped!"];setTimeout(()=>{u(s2=>{s2.sc="map";s2.en=[];});startMusic(g.map==="town"?"town":"explore");},500);}else s.log=[...s.log,boss?"👑 No escape!":"❌ Can't escape!"];}); after(300); },
    cry: () => { u(s=>{if(!s.pt||s.proc)return;s.pt=false;s.sS=false;s.sI=false;const ev=P(CRY);s.log=[...s.log,`😭 ${ev.t}`];if(ev.k==="aoe"){s.en.filter(e=>e.hp>0).forEach(e=>{e.hp=Math.max(0,e.hp-ev.dm);if(e.hp<=0)s.log=[...s.log,`💥 ${e.n} — tears!`];});playSfx("hit");s.anim={t:"all"};}else if(ev.k==="st"){const t=s.en[s.ti];if(t&&t.hp>0){t.hp=Math.max(0,t.hp-ev.dm);playSfx("hit");s.anim={t:"eh",i:s.ti};if(t.hp<=0)s.log=[...s.log,`💥 ${t.n} — tears!`];}}else if(ev.k==="stun")s.en.filter(e=>e.hp>0).forEach(e=>{s.stun[e.id]=true;});else if(ev.k==="buff")s.def=true;else if(ev.k==="debuff")s.en.filter(e=>e.hp>0).forEach(e=>{e.d=Math.max(0,e.d-3);});}); after(); },
  };

  const buy = si => { u(s => { if(s.p.g<si.p)return;s.p.g-=si.p;if(si.tp==="w")s.p.w=si.i;else if(si.tp==="a")s.p.ar=si.i;else giveIt(s,si.i); }); playSfx("menu"); };

  // ── Styles ──
  const B = (c="#6b4c9a", dis=false) => ({
    fontFamily:"'Press Start 2P'",fontSize:9,padding:"8px 12px",
    background:dis?"#2a2a2a":c,color:dis?"#555":"#fff",
    border:`2px solid ${dis?"#333":c}`,borderRadius:4,
    letterSpacing:1,textTransform:"uppercase",minWidth:64,textAlign:"center",
  });
  const Bar = ({c:cur,m:max,color="g",w=80,label}) => {
    const pct=max>0?(cur/max)*100:0;
    const bg=color==="b"?"#60a5fa":pct>50?"#4ade80":pct>25?"#fbbf24":"#ef4444";
    return (<div style={{display:"flex",alignItems:"center",gap:3}}>
      {label&&<span style={{fontSize:7,color:"#a78bdb",fontFamily:"'Press Start 2P'"}}>{label}</span>}
      <div style={{width:w,height:7,background:"#1a0a2e",border:"2px solid #6b4c9a",borderRadius:2,overflow:"hidden"}}>
        <div style={{width:`${CL(pct,0,100)}%`,height:"100%",background:bg,transition:"width .4s,background .3s"}}/>
      </div>
      <span style={{fontSize:7,fontFamily:"'Press Start 2P'",color:"#ccc",minWidth:40}}>{cur}/{max}</span>
    </div>);
  };

  // ─── BATTLE CANVAS ──
  const battleCanvasRef = useRef(null);
  useEffect(() => {
    if (g.sc !== "battle") return;
    const cv = battleCanvasRef.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    cv.width = 672; cv.height = 200;

    const drawBattle = () => {
      // BG
      const isBoss = g.en.some(e => e.boss);
      const grd = ctx.createLinearGradient(0, 0, 0, 200);
      if (isBoss) { grd.addColorStop(0, "#2d0a0a"); grd.addColorStop(1, "#5a1818"); }
      else { grd.addColorStop(0, "#1a0a2e"); grd.addColorStop(1, "#2d1b4e"); }
      ctx.fillStyle = grd; ctx.fillRect(0, 0, 672, 200);

      // Ground
      ctx.fillStyle = isBoss ? "#3a1010" : "#1a1040";
      ctx.fillRect(0, 150, 672, 50);
      for (let i = 0; i < 672; i += 20) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.03})`;
        ctx.fillRect(i, 155, 15, 2);
      }

      // Draw enemies
      const alive = g.en.filter(e => e.hp > 0);
      const total = g.en.length;
      g.en.forEach((e, i) => {
        const spriteFn = ENEMY_SPRITES[e.e];
        if (!spriteFn) return;
        const isTarget = i === g.ti && e.hp > 0;
        const isHit = (g.anim?.t === "eh" && g.anim.i === i) || g.anim?.t === "all";
        const dead = e.hp <= 0;
        const spacing = Math.min(200, 600 / total);
        const ox = (672 / 2) - ((total - 1) * spacing / 2) + i * spacing - 30;
        const oy = dead ? 130 : 60 + Math.sin(Date.now() / 600 + i) * 4;
        const scale = e.boss ? 7 : 5;

        ctx.globalAlpha = dead ? 0.15 : 1;
        if (isHit && !dead) {
          ctx.save();
          ctx.translate(ox + 30, oy + 30);
          ctx.rotate(Math.sin(Date.now() / 30) * 0.1);
          ctx.translate(-30, -30);
          drawPixels(ctx, 0, 0, spriteFn(), scale);
          ctx.restore();
        } else {
          drawPixels(ctx, ox, oy, spriteFn(), scale);
        }

        // HP bar under enemy
        if (!dead) {
          const bw = e.boss ? 100 : 55;
          const bx = ox + (e.boss ? -5 : 5);
          const by = oy + (e.boss ? 85 : 55);
          ctx.fillStyle = "#000"; ctx.fillRect(bx - 1, by - 1, bw + 2, 7);
          ctx.fillStyle = "#333"; ctx.fillRect(bx, by, bw, 5);
          const hpPct = e.hp / e.mhp;
          ctx.fillStyle = hpPct > 0.5 ? "#ef4444" : hpPct > 0.25 ? "#f97316" : "#dc2626";
          ctx.fillRect(bx, by, bw * hpPct, 5);
          // Name
          ctx.fillStyle = isTarget ? "#fbbf24" : "#aaa";
          ctx.font = "bold 9px 'Press Start 2P'";
          ctx.textAlign = "center";
          ctx.fillText(e.n, ox + (e.boss ? 35 : 25), by + 14);
          // HP text
          ctx.fillStyle = "#ccc";
          ctx.font = "7px 'Press Start 2P'";
          ctx.fillText(`${e.hp}/${e.mhp}`, ox + (e.boss ? 35 : 25), by + 22);
          // Target arrow
          if (isTarget) {
            ctx.fillStyle = "#fbbf24";
            ctx.beginPath();
            ctx.moveTo(ox + (e.boss ? 35 : 25), oy - 10);
            ctx.lineTo(ox + (e.boss ? 30 : 20), oy - 18);
            ctx.lineTo(ox + (e.boss ? 40 : 30), oy - 18);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      });

      // Player hit flash
      if (g.anim?.t === "ph") {
        ctx.fillStyle = "rgba(255,50,50,0.2)";
        ctx.fillRect(0, 0, 672, 200);
      }

      animRef.current = requestAnimationFrame(drawBattle);
    };
    drawBattle();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [g.sc, g.en, g.ti, g.anim]);

  const p = g.p;
  const hdr = !["title","over","win"].includes(g.sc);

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    button{cursor:pointer;transition:all .12s}
    button:hover:not(:disabled){filter:brightness(1.2);transform:translateY(-1px)}
    button:disabled{opacity:.4;cursor:default}
    @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes glow{0%,100%{text-shadow:0 0 10px #fbbf24,0 0 20px #f59e0b}50%{text-shadow:0 0 20px #fbbf24,0 0 40px #f59e0b,0 0 60px #d97706}}
    @keyframes bounce{0%,100%{transform:translateY(0)}30%{transform:translateY(-20px)}}
    @keyframes transIn{0%{clip-path:circle(100% at 50% 50%)}100%{clip-path:circle(0% at 50% 50%)}}
    @keyframes transOut{0%{clip-path:circle(0% at 50% 50%)}100%{clip-path:circle(100% at 50% 50%)}}
    @keyframes stars{0%{background-position:0 0}100%{background-position:0 -800px}}
    canvas{image-rendering:pixelated;image-rendering:crisp-edges}
  `;

  return (
    <div style={{fontFamily:"'Press Start 2P',monospace",width:"100%",minHeight:"100vh",background:"#1a0a2e",color:"#e8d5b7",display:"flex",flexDirection:"column",alignItems:"center"}}>
      <style>{CSS}</style>
      <div style={{width:"100%",maxWidth:720,minHeight:"100vh",display:"flex",flexDirection:"column",position:"relative"}}>

        {/* Header */}
        {hdr && <div style={{background:"linear-gradient(180deg,#2d1b4e,#1a0a2e)",borderBottom:"3px solid #6b4c9a",padding:"5px 8px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100,flexWrap:"wrap",gap:3}}>
          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontSize:7,color:"#fbbf24"}}>Lv{p.lv}</span>
            <Bar c={p.hp} m={p.mhp} label="HP"/>
            <Bar c={p.mp} m={p.mmp} color="b" label="MP" w={50}/>
            <span style={{fontSize:7,color:"#fbbf24"}}>💰{p.g}</span>
          </div>
          <button style={{...B("#4a3670"),fontSize:7,padding:"4px 7px",minWidth:0}} onClick={()=>u(s=>{s.sT=!s.sT;})}>📊</button>
        </div>}

        {/* Status modal */}
        {g.sT&&<div onClick={()=>u(s=>{s.sT=false;})} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"linear-gradient(180deg,#2d1b4e,#1a0a2e)",border:"3px solid #6b4c9a",borderRadius:8,padding:16,width:"90%",maxWidth:420}}>
            <div style={{fontFamily:"'VT323'",fontSize:17,lineHeight:2}}>
              <div>⚔️ Hero Lv{p.lv} | ATK:{p.a}+{WEAPONS[p.w].a} | DEF:{p.d}+{ARMORS[p.ar].d}</div>
              <div>❤️ {p.hp}/{p.mhp} 💎 {p.mp}/{p.mmp} ✨ {p.xp}/{XPF(p.lv)}</div>
              <div>🗡️ {WEAPONS[p.w].n} | 🛡️ {ARMORS[p.ar].n}</div>
              <div>📖 {p.sp.map(i=>SPELLS[i].e+SPELLS[i].n).join(", ")}</div>
              <div>🎒 {p.inv.map(s=>`${ITEMS[s.i].e}${ITEMS[s.i].n}(${s.q})`).join(", ")||"Empty"}</div>
              <div>🔍 Clues: {g.clues}/6 | Zone: {g.map}</div>
            </div>
            <button style={{...B("#6b4c9a"),marginTop:10,width:"100%"}} onClick={()=>u(s=>{s.sT=false;})}>Close</button>
          </div>
        </div>}

        {/* TITLE */}
        {g.sc==="title"&&<div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:30,background:"linear-gradient(180deg,#0a0520,#1a0a3e,#2d1060)",position:"relative"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,255,255,.04) 1px,transparent 1px)",backgroundSize:"28px 28px",animation:"stars 50s linear infinite"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontSize:72,marginBottom:12}}>👑</div>
            <h1 style={{fontSize:18,color:"#fbbf24",animation:"glow 2s infinite",lineHeight:2}}>TROLL KING'S<br/>BOREDOM</h1>
            <p style={{fontFamily:"'VT323'",fontSize:20,color:"#a78bdb",margin:"12px 0 28px"}}>A tale of kidnapping, board games, and tears</p>
            <button style={{...B("#8b5cf6"),fontSize:12,padding:"14px 32px",animation:"pulse 2s infinite"}} onClick={async()=>{await Tone.start();u(s=>{s.sc="map";s.map="town";});startMusic("town");}}>▶ BEGIN QUEST</button>
            <p style={{fontFamily:"'VT323'",fontSize:14,color:"#6b4c9a",marginTop:16}}>Use WASD/Arrows to move · Space to interact</p>
          </div>
        </div>}

        {/* MAP */}
        {g.sc==="map"&&<div style={{flex:1,display:"flex",flexDirection:"column"}}>
          <div style={{flex:1,display:"flex",justifyContent:"center",alignItems:"center",background:"#000",position:"relative"}}>
            <canvas ref={canvasRef} style={{width:"100%",maxWidth:672,aspectRatio:`${COLS}/${ROWS}`}}/>
            {/* Battle transition overlay */}
            {g.trans&&<div style={{position:"absolute",inset:0,background:"#000",animation:"transIn .6s ease-in forwards",zIndex:50}}/>}
          </div>

          {/* Dialogue / info */}
          <div style={{background:"linear-gradient(180deg,#2d1b4e,#1a0a2e)",borderTop:"3px solid #6b4c9a",padding:10,minHeight:60,fontFamily:"'VT323'",fontSize:16,lineHeight:1.5}}>
            {g.showNpc ? <div>{g.npcDlg}<button style={{...B("#6b4c9a"),marginLeft:8,fontSize:7,padding:"4px 8px"}} onClick={()=>u(s=>{s.showNpc=null;})}>OK</button></div>
             : g.showShop ? <div>
                <div style={{marginBottom:6}}>{g.npcDlg}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {SHOP.map((si,i)=><button key={i} style={B(p.g>=si.p?"#16a34a":"#333",p.g<si.p)} onClick={()=>buy(si)}>{si.n} ({si.p}g)</button>)}
                  <button style={B("#6b4c9a")} onClick={()=>u(s=>{s.showShop=false;})}>Close</button>
                </div>
              </div>
             : <div style={{color:"#888"}}>
                {g.map==="town"?`🏘️ Willowbrook Village — Walk to NPCs and press Space | 🔍 Clues: ${g.clues}/6${g.clues>=3?" ✅ Exit north to begin your journey!":""}`:
                 g.map==="overworld"?"🗺️ The Wilds — Explore carefully! Random encounters await...":
                 "🏰 Troll King's Castle — Find the throne room!"}
              </div>}
          </div>

          {/* D-pad for mobile */}
          <div style={{background:"#0d0520",borderTop:"3px solid #6b4c9a",padding:8,display:"flex",justifyContent:"center",gap:4}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:3,width:120}}>
              <div/>
              <button style={B("#4a3670")} onClick={()=>tryMove(0,-1)}>▲</button>
              <div/>
              <button style={B("#4a3670")} onClick={()=>tryMove(-1,0)}>◀</button>
              <button style={B("#8b5cf6")} onClick={handleInteract}>●</button>
              <button style={B("#4a3670")} onClick={()=>tryMove(1,0)}>▶</button>
              <div/>
              <button style={B("#4a3670")} onClick={()=>tryMove(0,1)}>▼</button>
              <div/>
            </div>
          </div>
        </div>}

        {/* BATTLE */}
        {g.sc==="battle"&&<div style={{flex:1,display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",justifyContent:"center",background:"#000"}}>
            <canvas ref={battleCanvasRef} style={{width:"100%",maxWidth:672,height:200}}/>
          </div>
          <div ref={lr} style={{background:"linear-gradient(180deg,#2d1b4e,#1a0a2e)",border:"3px solid #6b4c9a",borderRadius:4,margin:"0 8px",padding:8,maxHeight:90,overflowY:"auto",fontFamily:"'VT323'",fontSize:15,lineHeight:1.5}}>
            {g.log.map((m,i)=><div key={i} style={{opacity:i===g.log.length-1?1:.5,animation:i===g.log.length-1?"slideUp .25s":""}}>{m}</div>)}
          </div>
          <div style={{padding:"4px 8px",display:"flex",gap:8,alignItems:"center",background:"#0d0520",borderTop:"1px solid #3a2555",flexWrap:"wrap"}}>
            <Bar c={p.hp} m={p.mhp} label="HP" w={90}/>
            <Bar c={p.mp} m={p.mmp} label="MP" color="b" w={55}/>
            {g.def&&<span style={{fontSize:7,color:"#60a5fa"}}>🛡️</span>}
          </div>
          {g.sS&&<div style={{padding:"5px 8px",display:"flex",flexWrap:"wrap",gap:4,background:"#0d0520",borderTop:"2px solid #6b4c9a"}}>
            {p.sp.map(si=>{const sp=SPELLS[si];return<button key={si} style={B(p.mp>=sp.mp?"#2563eb":"#333",p.mp<sp.mp)} onClick={()=>act.spell(si)} disabled={p.mp<sp.mp||!g.pt}>{sp.e}{sp.n}({sp.mp}){sp.t==="aoe"?" ALL":""}</button>;})}
            <button style={B("#6b4c9a")} onClick={()=>u(s=>{s.sS=false;})}>←</button>
          </div>}
          {g.sI&&<div style={{padding:"5px 8px",display:"flex",flexWrap:"wrap",gap:4,background:"#0d0520",borderTop:"2px solid #6b4c9a"}}>
            {p.inv.length===0?<span style={{fontFamily:"'VT323'",fontSize:16,color:"#666"}}>Empty!</span>:p.inv.map((s,i)=><button key={i} style={B("#16a34a")} onClick={()=>act.item(i)} disabled={!g.pt}>{ITEMS[s.i].e}{ITEMS[s.i].n} x{s.q}</button>)}
            <button style={B("#6b4c9a")} onClick={()=>u(s=>{s.sI=false;})}>←</button>
          </div>}
          {!g.sS&&!g.sI&&<div style={{background:"#0d0520",borderTop:"3px solid #6b4c9a",padding:8,display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>
            {[["⚔️Fight",act.atk,"#dc2626"],["🛡️Defend",act.def,"#2563eb"],["✨Spell",()=>u(s=>{s.sS=true;}),"#8b5cf6"],["🎒Item",()=>u(s=>{s.sI=true;}),"#16a34a"],["🏃Run",act.run,"#ca8a04"],["😭Cry",act.cry,"#ec4899"]].map(([l,fn,c],i)=><button key={i} style={B(c,!g.pt||g.proc)} onClick={fn} disabled={!g.pt||g.proc}>{l}</button>)}
          </div>}
        </div>}

        {/* GAME OVER */}
        {g.sc==="over"&&<div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:40,background:"linear-gradient(180deg,#0a0008,#1a0520)"}}>
          <div style={{fontSize:80}}>💀</div>
          <h2 style={{fontSize:18,color:"#ef4444",margin:"20px 0"}}>GAME OVER</h2>
          <p style={{fontFamily:"'VT323'",fontSize:20,color:"#a78bdb",marginBottom:6}}>Board game night for you.</p>
          <p style={{fontFamily:"'VT323'",fontSize:16,color:"#666",marginBottom:28}}>"Monopoly buddy!" — Grumbold</p>
          <button style={{...B("#8b5cf6"),fontSize:12,padding:"12px 28px"}} onClick={()=>{sG(init());stopMusic();}}>▶ Retry</button>
        </div>}

        {/* VICTORY */}
        {g.sc==="win"&&<div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:40,background:"linear-gradient(180deg,#1a2a00,#2d4a10,#4a7a20)"}}>
          <div style={{fontSize:80,animation:"bounce 1.5s infinite"}}>🎉</div>
          <h2 style={{fontSize:16,color:"#fbbf24",animation:"glow 2s infinite",margin:"14px 0",lineHeight:2}}>VICTORY!</h2>
          <p style={{fontFamily:"'VT323'",fontSize:22,marginBottom:6}}>Troll King Grumbold defeated!</p>
          <p style={{fontFamily:"'VT323'",fontSize:18,color:"#888",fontStyle:"italic",margin:"8px 0 18px"}}>"I just wanted Catan friends... 😢"</p>
          <p style={{fontFamily:"'VT323'",fontSize:16,color:"#4ade80",marginBottom:20}}>The townsfolk are saved! 🎂</p>
          <button style={{...B("#8b5cf6"),fontSize:12,padding:"12px 28px"}} onClick={()=>{sG(init());stopMusic();}}>▶ New Game</button>
        </div>}

      </div>
    </div>
  );
}
