/* ================= AI CIVILIZATION =================
   You set every tribe's spec yourself (intelligence / work / health /
   aggression, level 1-4 each), pick an era, then WATCH. Nobody steers the
   tribes: they explore, discover, build and fight on their own, and what
   they manage to figure out depends entirely on the traits you gave them.
   A clever tribe works out what trees are for and builds huts; a dull one
   walks straight past them. That is agent-based simulation (classical AI).

   The learning part is honest and measurable: every finished run records
   which trait profile won in which era, those real statistics are shown
   back on the setup screen, and they nudge later tribes' starting edge.

   Hand input is deliberately minimal: hold your hand over an option for
   one second to choose it. No pinching, no gestures.
================================================== */
import { FilesetResolver, HandLandmarker } from "../gesturegame/vendor/vision_bundle.mjs";

"use strict";

/* ---------------- i18n ---------------- */
const STR = {
  en: {
    langBtn: "BM",
    title: "AI Civilization",
    desc: "Give three tribes their stats, choose an era, then watch them explore, discover and fight for the land.",
    how: "✋ HOLD your hand over an option for 1 second to choose. Then just watch — use the speed buttons to fast-forward.",
    start: "START ▶", back: "← HUB", again: "PLAY AGAIN ↺",
    loading: "Waking up the AI brain… 🧠",
    loadingCam: "Turning on the camera… 📷",
    camFail: "Camera blocked! Allow camera access in your browser settings, then reload.",
    aiFail: "Could not load the AI. Reload the page to try again.",
    calibShow: "Show me your hand! ✋", calibHint: "Hold your hand up so the camera can see it clearly",
    calibReady: "Got it! Ready…", calibSkip: "Can't see your hand? Start anyway →",
    camTroubleTitle: "Camera trouble", camTroubleDesc: "The camera feed froze. Trying to reconnect…",
    camReconnecting: "Reconnecting camera…", camRetryBtn: "🔄 TRY AGAIN",
    handLost: "Show your hand to choose.",
    pickEra: "CHOOSE THE ERA",
    pickSpec: n => `SET UP TRIBE ${n}`,
    holdToPick: "✋ Hold your hand over an option for 1 second",
    specHint: "Set a level for every stat",
    aiLearned: "🧠 WHAT THE AI HAS LEARNED",
    aiNoData: "🧠 No games yet today — the AI is starting fresh!",
    aiStat: (trait, era, pct, runs) => `High ${trait} wins ${era} ${pct}% of the time (${runs} runs)`,
    growthPhase: "🌱 EXPLORE & GROW", warPhase: "⚔️ CONQUEST",
    speed: "Speed", tribe: n => `TRIBE ${n}`,
    traitInt: "Intelligence", traitWork: "Work", traitHealth: "Health", traitAggro: "Aggression",
    lvl: ["", "Low", "Fair", "High", "Genius"],
    lvlWork: ["", "Lazy", "Steady", "Hard", "Tireless"],
    lvlHealth: ["", "Frail", "Okay", "Tough", "Hardy"],
    lvlAggro: ["", "Peaceful", "Wary", "Bold", "Ruthless"],
    winner: n => `${n} RULES THE LAND!`,
    resultTitle: "CIVILIZATION COMPLETE",
    runsToday: n => `🧠 The AI has simulated ${n} civilization${n === 1 ? "" : "s"} today`,
    discovered: "discovered", nothing: "—",
    viewMap: "🔍 VIEW THE MAP", backToResults: "📊 BACK TO RESULTS",
    // log events
    evStart: "The tribe settles here.",
    evFoundTree: "Found strange tall plants…",
    evFoundRock: "Found hard grey lumps…",
    evFoundWater: "Reached the water's edge.",
    evIgnore: thing => `Walks past the ${thing}, not knowing what they are for.`,
    evDiscover: (emoji, name) => `${emoji} DISCOVERED: ${name}!`,
    evBuildHut: "🏠 Built a hut.",
    evBuildWall: "🧱 Raised a wall.",
    evStarve: "😰 Food is running out!",
    evGrow: n => `👥 Population reaches ${n}.`,
    evAttack: n => `⚔️ Attacking ${n}!`,
    evCapture: n => `🚩 Took land from ${n}.`,
    evLost: "💀 The tribe has fallen.",
    evExpand: "🚶 Claimed new land.",
    thingTree: "trees", thingRock: "stones", thingWater: "water",
    evChop: "🪓 Started chopping wood.",
    evMine: "⛏️ Started mining stone.",
    evIdle: "😴 Most people are idle.",
    evNoWood: "🪵 Out of wood — can't build.",
    whyInt: lv => `Intelligence ${lv}/4 — ${lv >= 3 ? "clever enough to work new things out" : "struggles to understand new things"}`,
    whyWork: lv => `Work ${lv}/4 — ${lv >= 3 ? "they keep busy and produce a lot" : "they idle often and produce little"}`,
    whyHealth: lv => `Health ${lv}/4 — ${lv >= 3 ? "they resist hunger and grow fast" : "they tire and starve easily"}`,
    whyAggro: lv => `Aggression ${lv}/4 — ${lv >= 3 ? "they attack often and hit hard" : "they rarely pick a fight"}`,
    jobChop: "chopping", jobMine: "mining", jobFarm: "farming", jobBuild: "building", jobFight: "fighting", jobIdle: "idle",
    evThirst: "💧 No water nearby — people are thirsty!",
    evWaterFound: "💧 Found drinking water!",
    evNoRoom: "🏕️ No huts — the camp cannot hold more people.",
    warBegins: "⚔️ THE CONQUEST BEGINS",
    kingFell: n => `💀 ${n} HAS FALLEN`,
    discPop: (emoji, name) => `${emoji} ${name}`,
    scLand: "Land", scBuild: "Buildings", scKnow: "Knowledge", scPeople: "People", scTotal: "Score",
    whyWon: "WHY THEY WON",
    confirmTitle: "READY?", confirmStart: "▶ START",
    redo: "↩ REDO", holdRedo: "Hold over a row again to change it",
    bestToday: n => `🏆 Best score today: ${n}`,
  },
  bm: {
    langBtn: "EN",
    title: "Tamadun AI",
    desc: "Beri tiga puak statistik mereka, pilih era, kemudian tonton mereka meneroka, menemui dan berebut tanah.",
    how: "✋ TAHAN tangan di atas pilihan selama 1 saat. Kemudian tonton — guna butang laju untuk mempercepat.",
    start: "MULA ▶", back: "← HUB", again: "MAIN LAGI ↺",
    loading: "Mengejutkan otak AI… 🧠",
    loadingCam: "Menghidupkan kamera… 📷",
    camFail: "Kamera disekat! Benarkan akses kamera dalam tetapan pelayar, kemudian muat semula.",
    aiFail: "AI gagal dimuatkan. Muat semula halaman untuk cuba lagi.",
    calibShow: "Tunjukkan tangan anda! ✋", calibHint: "Angkat tangan supaya kamera nampak dengan jelas",
    calibReady: "Dapat! Bersedia…", calibSkip: "Kamera tak nampak tangan? Mula juga →",
    camTroubleTitle: "Masalah kamera", camTroubleDesc: "Suapan kamera terhenti. Cuba sambung semula…",
    camReconnecting: "Menyambung semula kamera…", camRetryBtn: "🔄 CUBA LAGI",
    handLost: "Tunjukkan tangan untuk memilih.",
    pickEra: "PILIH ERA",
    pickSpec: n => `TETAPKAN PUAK ${n}`,
    holdToPick: "✋ Tahan tangan di atas pilihan selama 1 saat",
    specHint: "Tetapkan tahap untuk setiap statistik",
    aiLearned: "🧠 APA YANG AI TELAH PELAJARI",
    aiNoData: "🧠 Belum ada permainan hari ini — AI bermula dari kosong!",
    aiStat: (trait, era, pct, runs) => `${trait} tinggi menang ${era} ${pct}% masa (${runs} larian)`,
    growthPhase: "🌱 TEROKA & MEMBESAR", warPhase: "⚔️ PENAKLUKAN",
    speed: "Laju", tribe: n => `PUAK ${n}`,
    traitInt: "Kecerdasan", traitWork: "Kerajinan", traitHealth: "Kesihatan", traitAggro: "Agresif",
    lvl: ["", "Rendah", "Sederhana", "Tinggi", "Genius"],
    lvlWork: ["", "Malas", "Sederhana", "Rajin", "Kuat"],
    lvlHealth: ["", "Lemah", "Okay", "Kuat", "Tahan"],
    lvlAggro: ["", "Aman", "Berhati", "Berani", "Kejam"],
    winner: n => `${n} MENGUASAI TANAH!`,
    resultTitle: "TAMADUN SELESAI",
    runsToday: n => `🧠 AI telah mensimulasi ${n} tamadun hari ini`,
    discovered: "ditemui", nothing: "—",
    viewMap: "🔍 LIHAT PETA", backToResults: "📊 KEMBALI KE KEPUTUSAN",
    evStart: "Puak menetap di sini.",
    evFoundTree: "Jumpa tumbuhan tinggi pelik…",
    evFoundRock: "Jumpa ketulan kelabu keras…",
    evFoundWater: "Sampai ke tepi air.",
    evIgnore: thing => `Lalu di sebelah ${thing}, tidak tahu apa gunanya.`,
    evDiscover: (emoji, name) => `${emoji} DITEMUI: ${name}!`,
    evBuildHut: "🏠 Bina pondok.",
    evBuildWall: "🧱 Dirikan tembok.",
    evStarve: "😰 Makanan semakin habis!",
    evGrow: n => `👥 Penduduk mencapai ${n}.`,
    evAttack: n => `⚔️ Menyerang ${n}!`,
    evCapture: n => `🚩 Rampas tanah ${n}.`,
    evLost: "💀 Puak telah tumbang.",
    evExpand: "🚶 Menuntut tanah baru.",
    thingTree: "pokok", thingRock: "batu", thingWater: "air",
    evChop: "🪓 Mula menebang kayu.",
    evMine: "⛏️ Mula melombong batu.",
    evIdle: "😴 Kebanyakan rakyat menganggur.",
    evNoWood: "🪵 Kehabisan kayu — tak boleh bina.",
    whyInt: lv => `Kecerdasan ${lv}/4 — ${lv >= 3 ? "cukup pandai untuk memikirkan perkara baru" : "sukar memahami perkara baru"}`,
    whyWork: lv => `Kerajinan ${lv}/4 — ${lv >= 3 ? "mereka sentiasa sibuk dan hasilkan banyak" : "mereka kerap menganggur, hasil sedikit"}`,
    whyHealth: lv => `Kesihatan ${lv}/4 — ${lv >= 3 ? "tahan lapar dan membesar cepat" : "mudah letih dan kebuluran"}`,
    whyAggro: lv => `Agresif ${lv}/4 — ${lv >= 3 ? "kerap menyerang dan kuat" : "jarang mencari gaduh"}`,
    jobChop: "menebang", jobMine: "melombong", jobFarm: "bertani", jobBuild: "membina", jobFight: "berperang", jobIdle: "menganggur",
    evThirst: "💧 Tiada air berdekatan — rakyat kehausan!",
    evWaterFound: "💧 Jumpa air minuman!",
    evNoRoom: "🏕️ Tiada pondok — perkampungan tidak muat lagi.",
    warBegins: "⚔️ PENAKLUKAN BERMULA",
    kingFell: n => `💀 ${n} TELAH TUMBANG`,
    discPop: (emoji, name) => `${emoji} ${name}`,
    scLand: "Tanah", scBuild: "Bangunan", scKnow: "Ilmu", scPeople: "Rakyat", scTotal: "Skor",
    whyWon: "KENAPA MEREKA MENANG",
    confirmTitle: "SEDIA?", confirmStart: "▶ MULA",
    redo: "↩ ULANG", holdRedo: "Tahan semula pada baris untuk menukar",
    bestToday: n => `🏆 Skor terbaik hari ini: ${n}`,
  },
};
let lang = localStorage.getItem("ha-lang") || "en";
const t = (k) => STR[lang][k];
let camBgOn = localStorage.getItem("ha-cambg") !== "off";

/* ---------------- sound ---------------- */
let soundOn = localStorage.getItem("ha-sound") !== "off";
let actx = null;
function beep(freq = 660, dur = 0.08, type = "square", vol = 0.05) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + dur);
    o.connect(g).connect(actx.destination);
    o.start(); o.stop(actx.currentTime + dur);
  } catch (e) {}
}
function chord(freqs, dur = 0.35, type = "triangle", vol = 0.05) { freqs.forEach(f => beep(f, dur, type, vol)); }
const sfx = {
  click: () => beep(520, 0.05),
  pick: () => { beep(660, 0.06, "sine", 0.05); setTimeout(() => beep(990, 0.09, "sine", 0.05), 55); },
  good: () => { beep(660, 0.09); setTimeout(() => beep(880, 0.12), 90); },
  discover: () => { [700, 900, 1200].forEach((f, i) => setTimeout(() => beep(f, 0.09, "sine", 0.05), i * 70)); },
  bad: () => beep(160, 0.25, "sawtooth", 0.07),
  battle: () => beep(180 + Math.random() * 60, 0.05, "sawtooth", 0.03),
  win: () => {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.16, "triangle", 0.08), i * 130));
    setTimeout(() => chord([1047, 1319, 1568], 0.5, "triangle", 0.05), 520);
  },
};

/* ---------------- DOM ---------------- */
const ui = document.getElementById("ui");
const cam = document.getElementById("cam");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const homeBtn = document.getElementById("homeBtn");
const camBtn = document.getElementById("camBtn");
const soundBtn = document.getElementById("soundBtn");
const langBtn = document.getElementById("langBtn");
const handStatus = document.getElementById("handStatus");

function resize() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  // No need to invalidate the terrain cache here — draw() already rebuilds
  // it whenever the computed cell size changes, and touching SIM from this
  // function would hit its temporal dead zone on first load.
}
resize();
addEventListener("resize", resize);

const el = (html) => { const d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; };
function show(node) {
  ui.innerHTML = ""; ui.scrollTop = 0;
  if (node) { ui.appendChild(node); node.classList.add("fade-in"); }
}
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    const radius = Math.min(typeof r === "number" ? r : 0, w / 2, h / 2);
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + w, y, x + w, y + h, radius);
    this.arcTo(x + w, y + h, x, y + h, radius);
    this.arcTo(x, y + h, x, y, radius);
    this.arcTo(x, y, x + w, y, radius);
    this.closePath();
    return this;
  };
}

/* ---------------- hand engine (position only) ---------------- */
const CAM_CONSTRAINTS = {
  video: { facingMode: "user", width: { ideal: 960, min: 640 }, height: { ideal: 720, min: 480 }, frameRate: { ideal: 60, min: 24 }, resizeMode: "crop-and-scale" },
  audio: false,
};
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const engine = {
  landmarker: null, ready: false, camReady: false,
  hand: null, norm: null, lastVideoTime: -1, lastSeenAt: 0, frameAt: 0, lastFrameOkAt: 0,
  async init(onStatus) {
    if (!this.ready) {
      onStatus(t("loading"));
      const fileset = await FilesetResolver.forVisionTasks("../gesturegame/vendor/wasm");
      const options = (delegate) => ({
        baseOptions: { modelAssetPath: "../gesturegame/vendor/hand_landmarker.task", delegate },
        runningMode: "VIDEO", numHands: 1,
        minHandDetectionConfidence: 0.42, minHandPresenceConfidence: 0.45, minTrackingConfidence: 0.42,
      });
      try { this.landmarker = await HandLandmarker.createFromOptions(fileset, options("GPU")); }
      catch { this.landmarker = await HandLandmarker.createFromOptions(fileset, options("CPU")); }
      this.ready = true;
    }
    if (!this.camReady) { onStatus(t("loadingCam")); await this.startVideoStream(); }
  },
  async startVideoStream() {
    const stream = await navigator.mediaDevices.getUserMedia(CAM_CONSTRAINTS);
    cam.srcObject = stream;
    await new Promise((res) => { cam.onloadedmetadata = res; });
    await cam.play();
    this.camReady = true; this.lastFrameOkAt = performance.now();
  },
  async reconnectCamera() { this.stopCamera(); await this.startVideoStream(); },
  stopCamera() {
    const stream = cam.srcObject;
    if (stream) stream.getTracks().forEach((tr) => tr.stop());
    cam.srcObject = null; this.camReady = false; this.lastVideoTime = -1;
    this.hand = null; this.norm = null; this.lastSeenAt = 0;
    handStatus.classList.remove("seen");
  },
  detect() {
    if (!this.ready || !this.camReady || cam.readyState < 2) { this.hand = null; return false; }
    if (cam.currentTime === this.lastVideoTime) return false;
    this.lastVideoTime = cam.currentTime;
    this.lastFrameOkAt = performance.now();
    const frameNow = performance.now();
    this.frameAt = frameNow;
    const res = this.landmarker.detectForVideo(cam, frameNow);
    if (res.landmarks && res.landmarks.length) {
      const vw = cam.videoWidth, vh = cam.videoHeight;
      const scale = Math.max(innerWidth / vw, innerHeight / vh);
      const dw = vw * scale, dh = vh * scale;
      const ox = (innerWidth - dw) / 2, oy = (innerHeight - dh) / 2;
      const raw = res.landmarks[0].map(p => ({ x: 1 - p.x, y: p.y, z: p.z }));
      if (!this.norm) this.norm = raw.map(p => ({ ...p }));
      else this.norm = raw.map((p, i) => {
        const prev = this.norm[i], d = dist(p, prev);
        const alpha = Math.min(0.5, 0.1 + d * 4);
        return { x: prev.x + (p.x - prev.x) * alpha, y: prev.y + (p.y - prev.y) * alpha, z: p.z };
      });
      this.hand = this.norm.map(p => ({ x: p.x * dw + ox, y: p.y * dh + oy, z: p.z }));
      this.lastSeenAt = performance.now();
    } else if (performance.now() - this.lastSeenAt > 350) { this.hand = null; this.norm = null; }
    handStatus.classList.toggle("seen", !!this.hand);
    return true;
  },
  cursor() {
    if (!this.hand) return null;
    const P = [0, 5, 9, 13, 17];
    return {
      x: P.reduce((s, i) => s + this.hand[i].x, 0) / P.length,
      y: P.reduce((s, i) => s + this.hand[i].y, 0) / P.length,
    };
  },
};

/* ---------------- eras ---------------- */
/* Each era now generates visibly different land: the thresholds below decide
   how common trees / rock / water are, which in turn decides which
   discoveries are even reachable and whether a tribe can find drinking
   water at all. `frozen` means the water is ice until the tribe finds fire. */
const ERAS = {
  ice:    { emoji: "❄️", en: "Ice Age", bm: "Zaman Ais", food: 0.62, growth: 0.82, strength: 1.20,
            tTree: 1.72, tRock: 1.05, tWater: -1.72, frozen: true,
            ground: "#8aa6bd", alt: "#9db7cc", rock: "#e9f3fb", tree: "#4a6b57", water: "#7fb4d4", treeDot: "#dff0e6" },
  forest: { emoji: "🌲", en: "Forest", bm: "Hutan", food: 1.15, growth: 1.10, strength: 0.95,
            tTree: 0.82, tRock: 1.55, tWater: -1.55, frozen: false,
            ground: "#3a7a45", alt: "#488a52", rock: "#6b6157", tree: "#14401f", water: "#2b6f9c", treeDot: "#1c5c2b" },
  cave:   { emoji: "🪨", en: "Caves", bm: "Gua", food: 0.80, growth: 0.92, strength: 1.15,
            tTree: 1.95, tRock: 0.72, tWater: -1.60, frozen: false,
            ground: "#5f564c", alt: "#6e6459", rock: "#38312b", tree: "#4a5540", water: "#2f5f73", treeDot: "#59684c" },
  beach:  { emoji: "🏖️", en: "Coast", bm: "Pantai", food: 1.30, growth: 1.20, strength: 0.82,
            tTree: 1.30, tRock: 1.62, tWater: -0.72, frozen: false,
            ground: "#cdb68a", alt: "#dcc79e", rock: "#8b8070", tree: "#3f7a4a", water: "#1e83b8", treeDot: "#2f6f3c" },
};
const ERA_KEYS = Object.keys(ERAS);
const eraName = (k) => ERAS[k][lang];

/* ---------------- traits ---------------- */
const TRAITS = [
  { id: "int",    emoji: "🧠", key: "traitInt",    lvlKey: "lvl" },
  { id: "work",   emoji: "💪", key: "traitWork",   lvlKey: "lvlWork" },
  { id: "health", emoji: "🩺", key: "traitHealth", lvlKey: "lvlHealth" },
  { id: "aggro",  emoji: "⚔️", key: "traitAggro",  lvlKey: "lvlAggro" },
];
const TRIBE_COLORS = ["#ff3860", "#00c8ff", "#ffd700"];
const TRIBE_GLOW = ["rgba(255,56,96,", "rgba(0,200,255,", "rgba(255,215,0,"];

/* Trait curves, indexed by level 1-4. These are deliberately steep so that
   a level 1 tribe and a level 4 tribe look like completely different
   civilizations on screen, not the same one running slightly slower. */
const CURVE = {
  // Work: how often a citizen actually gets up and does something, and how
  // fast they finish a job. A lazy tribe visibly stands around.
  idleChance: [0.62, 0.36, 0.14, 0.03],
  // How long a refused job is slept off before trying again. Without this a
  // lazy worker would just walk slowly and still look busy.
  idleWait:   [3.20, 1.90, 1.00, 0.45],
  workSpeed:  [0.55, 0.85, 1.25, 1.75],
  output:     [0.45, 0.80, 1.25, 1.75],
  // Intelligence: how quickly unknowns get worked out.
  discover:   [0.45, 0.85, 1.35, 2.00],
  // Health: hunger resistance and growth.
  upkeep:     [1.45, 1.15, 0.92, 0.75],
  growth:     [0.70, 0.90, 1.10, 1.30],
  // Aggression: how many citizens march to the border, and how hard they hit.
  fightUrge:  [0.04, 0.20, 0.48, 0.80],
  attack:     [0.45, 0.80, 1.25, 1.75],
};
const cv = (name, lv) => CURVE[name][Math.max(1, Math.min(4, lv)) - 1];

// Builds the small colour-coded tag plus the full sentence used as its
// tooltip, so every log line can show WHY it happened.
function reason(tr, traitId) {
  const T = TRAITS.find(x => x.id === traitId);
  const lv = tr.spec[traitId];
  const whyKey = { int: "whyInt", work: "whyWork", health: "whyHealth", aggro: "whyAggro" }[traitId];
  return { tag: `${T.emoji}${lv}`, why: t(whyKey)(lv) };
}

const WORKER_CAP = 18;   // drawn workers per tribe — they represent the population
const JOB_TREE = "chop", JOB_ROCK = "mine", JOB_FARM = "farm", JOB_BUILD = "build", JOB_FIGHT = "fight";

/* ---------------- discoveries (12) ----------------
   Each needs a minimum intelligence, sometimes a prior discovery, and
   sometimes that the tribe actually owns land containing that resource —
   which is what makes conquering more land reveal more unknowns. */
const DISCOVERIES = [
  { id: "fire",    emoji: "🔥", en: "Fire",      bm: "Api",       int: 1 },
  { id: "farming", emoji: "🌾", en: "Farming",   bm: "Pertanian", int: 1 },
  { id: "tools",   emoji: "🪓", en: "Tools",     bm: "Alatan",    int: 2, needs: ["fire"] },
  { id: "wood",    emoji: "🪵", en: "Woodwork",  bm: "Kayu",      int: 2, needs: ["tools"], res: "tree" },
  { id: "huts",    emoji: "🏠", en: "Huts",      bm: "Pondok",    int: 2, needs: ["wood"] },
  { id: "stone",   emoji: "🪨", en: "Stonework", bm: "Batu",      int: 3, needs: ["tools"], res: "rock" },
  { id: "wheel",   emoji: "🛞", en: "The Wheel", bm: "Roda",      int: 3, needs: ["wood"] },
  { id: "walls",   emoji: "🧱", en: "Walls",     bm: "Tembok",    int: 3, needs: ["stone"] },
  { id: "boats",   emoji: "⛵", en: "Boats",     bm: "Bot",       int: 3, needs: ["wood"], res: "water" },
  { id: "metal",   emoji: "⚒️", en: "Metal",     bm: "Logam",     int: 4, needs: ["stone", "fire"] },
  { id: "writing", emoji: "📜", en: "Writing",   bm: "Tulisan",   int: 4, needs: ["tools"] },
  { id: "army",    emoji: "🛡️", en: "Army",      bm: "Tentera",   int: 4, needs: ["metal"] },
];
const discName = (d) => d[lang];

/* ---------------- learning layer ---------------- */
const LEARN_KEY = "civsim-learn";
function malaysiaDateStr() {
  const utcMs = Date.now() + new Date().getTimezoneOffset() * 60000;
  return new Date(utcMs + 8 * 3600000).toISOString().slice(0, 10);
}
function loadLearn() {
  let rec = null;
  try { rec = JSON.parse(localStorage.getItem(LEARN_KEY) || "null"); } catch {}
  if (!rec || rec.date !== malaysiaDateStr()) rec = { date: malaysiaDateStr(), runs: 0, stats: {} };
  return rec;
}
// The winner is summarised by whichever trait they were strongest in —
// that is what gets counted, so the statistics stay readable on screen.
function topTrait(spec) {
  let best = TRAITS[0].id, bv = -1;
  TRAITS.forEach(tr => { if (spec[tr.id] > bv) { bv = spec[tr.id]; best = tr.id; } });
  return best;
}
function recordRun(era, winnerSpec, allSpecs) {
  const rec = loadLearn();
  rec.runs++;
  const winTrait = topTrait(winnerSpec);
  allSpecs.forEach(s => {
    const key = `${era}|${topTrait(s)}`;
    if (!rec.stats[key]) rec.stats[key] = { played: 0, won: 0 };
    rec.stats[key].played++;
    if (topTrait(s) === winTrait) rec.stats[key].won++;
  });
  localStorage.setItem(LEARN_KEY, JSON.stringify(rec));
}
function learnedBonus(era, spec) {
  const s = loadLearn().stats[`${era}|${topTrait(spec)}`];
  if (!s || s.played < 3) return 1;
  const pct = (s.won / s.played) * 100;
  return 1 + Math.max(-0.06, Math.min(0.12, (pct - 33) / 100 * 0.35));
}
function bestLearned() {
  const rec = loadLearn(), rows = [];
  Object.entries(rec.stats).forEach(([key, s]) => {
    if (s.played < 3) return;
    const [era, trait] = key.split("|");
    rows.push({ era, trait, pct: Math.round((s.won / s.played) * 100), runs: s.played });
  });
  rows.sort((a, b) => b.pct - a.pct || b.runs - a.runs);
  return rows.slice(0, 3);
}
const traitLabel = (id) => t(TRAITS.find(x => x.id === id).key);

/* ---------------- loop ---------------- */
let activeScreen = null;
let lastT = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - lastT) / 1000);
  lastT = now;
  if (document.body.classList.contains("playing")) {
    try {
      engine.detect();
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      if (activeScreen && activeScreen.onFrame) activeScreen.onFrame(dt);
    } catch (e) { console.error("frame error:", e); }
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function stopAll() {
  if (activeScreen && activeScreen.cleanup) activeScreen.cleanup();
  activeScreen = null;
  engine.stopCamera();
  document.body.classList.remove("playing");
  homeBtn.classList.add("hidden"); camBtn.classList.add("hidden"); handStatus.classList.add("hidden");
  document.querySelectorAll(".speed-bar,.civ-log,.civ-hud,.review-chip").forEach(n => n.remove());
  camTroubleNode?.remove(); camTroubleNode = null; camRecovering = false;
}

/* ---------------- camera recovery ---------------- */
let camTroubleNode = null, camRecovering = false;
setInterval(() => {
  if (camRecovering || !document.body.classList.contains("playing") || !engine.camReady) return;
  if (performance.now() - engine.lastFrameOkAt > 6000) startCameraRecovery();
}, 1000);
async function startCameraRecovery(attempt = 1) {
  camRecovering = true;
  if (!camTroubleNode) {
    camTroubleNode = el(`<div class="cam-trouble"><div class="panel">
      <div class="big-emoji">📷💤</div><h2>${t("camTroubleTitle")}</h2>
      <div class="desc" id="camTroubleDesc">${t("camTroubleDesc")}</div>
      <button class="btn" id="camRetryBtn">${t("camRetryBtn")}</button></div></div>`);
    camTroubleNode.querySelector("#camRetryBtn").onclick = () => { sfx.click(); startCameraRecovery(1); };
    document.body.appendChild(camTroubleNode);
  }
  const d = camTroubleNode.querySelector("#camTroubleDesc");
  d.textContent = t("camReconnecting");
  try {
    await engine.reconnectCamera();
    await new Promise(r => setTimeout(r, 700));
    if (performance.now() - engine.lastFrameOkAt > 1500) throw new Error("no frame");
    camTroubleNode.remove(); camTroubleNode = null; camRecovering = false;
  } catch {
    if (attempt < 3) setTimeout(() => startCameraRecovery(attempt + 1), 1500);
    else { d.textContent = t("camTroubleDesc"); camRecovering = false; }
  }
}

/* ---------------- calibration ---------------- */
function calibrate() {
  return new Promise((resolve) => {
    const node = el(`<div class="panel calib-panel">
      <div class="calib-ring"><span id="calibIcon">✋</span></div>
      <h2 id="calibTitle">${t("calibShow")}</h2>
      <div class="desc">${t("calibHint")}</div>
      <button class="btn ghost hidden" id="calibSkip" style="font-size:15px;padding:10px 24px">${t("calibSkip")}</button>
    </div>`);
    show(node);
    let seen = 0, done = false;
    const skipBtn = node.querySelector("#calibSkip");
    const finish = () => { if (done) return; done = true; clearInterval(poll); clearTimeout(skipTimer); resolve(); };
    skipBtn.onclick = () => { sfx.click(); finish(); };
    const poll = setInterval(() => {
      if (engine.hand) {
        seen++;
        if (seen === 1) {
          node.querySelector("#calibIcon").textContent = "✅";
          node.querySelector("#calibTitle").textContent = t("calibReady");
          node.classList.add("calib-ok");
        }
        if (seen >= 10) { sfx.good(); finish(); }
      } else if (seen > 0) {
        seen = 0;
        node.querySelector("#calibIcon").textContent = "✋";
        node.querySelector("#calibTitle").textContent = t("calibShow");
        node.classList.remove("calib-ok");
      }
    }, 60);
    const skipTimer = setTimeout(() => skipBtn.classList.remove("hidden"), 4000);
  });
}

/* ---------------- topbar ---------------- */
homeBtn.onclick = () => { sfx.click(); stopAll(); location.href = "../"; };
function applyCamBg() { cam.style.display = camBgOn ? "" : "none"; camBtn.textContent = camBgOn ? "📷" : "🤖"; }
camBtn.onclick = () => { sfx.click(); camBgOn = !camBgOn; localStorage.setItem("ha-cambg", camBgOn ? "on" : "off"); applyCamBg(); };
soundBtn.onclick = () => { soundOn = !soundOn; localStorage.setItem("ha-sound", soundOn ? "on" : "off"); soundBtn.textContent = soundOn ? "🔊" : "🔇"; if (soundOn) sfx.click(); };
langBtn.onclick = () => { sfx.click(); lang = lang === "en" ? "bm" : "en"; localStorage.setItem("ha-lang", lang); langBtn.textContent = t("langBtn"); if (!document.body.classList.contains("playing")) showIntro(); };
langBtn.textContent = t("langBtn");
soundBtn.textContent = soundOn ? "🔊" : "🔇";

/* ---------------- intro ---------------- */
function showIntro() {
  stopAll();
  const learned = bestLearned(), rec = loadLearn();
  const learnHtml = learned.length
    ? `<div class="learn-box"><div class="learn-title">${t("aiLearned")}</div>${learned.map(r =>
        `<div class="learn-row">${TRAITS.find(x => x.id === r.trait).emoji} ${t("aiStat")(traitLabel(r.trait), eraName(r.era), r.pct, r.runs)}</div>`).join("")}</div>`
    : `<div class="learn-box"><div class="learn-row">${t("aiNoData")}</div></div>`;
  const node = el(`<div class="panel">
    <div class="big-emoji">🏰</div>
    <h2>${t("title")}</h2>
    <div class="desc">${t("desc")}</div>
    <div class="desc" style="margin-top:8px;font-size:13px">${t("how")}</div>
    ${learnHtml}
    ${rec.runs ? `<div class="best-line">${t("runsToday")(rec.runs)}</div>` : ""}
    <div id="loadArea"></div>
    <button class="btn" id="startBtn">${t("start")}</button>
    <br><button class="btn ghost" id="backBtn" style="font-size:15px;padding:10px 24px">${t("back")}</button>
  </div>`);
  node.querySelector("#backBtn").onclick = () => { sfx.click(); location.href = "../"; };
  node.querySelector("#startBtn").onclick = async () => {
    sfx.click();
    const b = node.querySelector("#startBtn");
    b.disabled = true; b.style.opacity = 0.4;
    const loadArea = node.querySelector("#loadArea");
    try {
      await engine.init((msg) => { loadArea.innerHTML = `<div class="desc" style="color:var(--green)">${msg}</div><div class="loader-bar"><i></i></div>`; });
    } catch (err) {
      const isCam = String(err.name || err).match(/NotAllowed|NotFound|NotReadable|Security/i);
      loadArea.innerHTML = `<div class="desc" style="color:var(--red)">⚠ ${isCam ? t("camFail") : t("aiFail")}</div>`;
      b.disabled = false; b.style.opacity = 1;
      return;
    }
    document.body.classList.add("playing");
    homeBtn.classList.remove("hidden"); handStatus.classList.remove("hidden");
    camBtn.classList.remove("hidden"); applyCamBg();
    await calibrate();
    show(null); ui.classList.add("passthrough");
    startSetup();
  };
  show(node);
}

/* ================================================
   SETUP — hold hand 1s over a choice
================================================ */
const DWELL_MS = 1000;

/* Simple one-row chooser (used for the era). */
const CHOOSER = {
  open(title, options, onPick) {
    Object.assign(this, { title, options, onPick, hoverIndex: -1, hoverSince: 0, locked: false });
    activeScreen = this;
  },
  layout() {
    const n = this.options.length;
    const maxW = Math.min(innerWidth - 60, 1000), gap = 16;
    const cellW = Math.min(220, (maxW - gap * (n - 1)) / n);
    const totalW = cellW * n + gap * (n - 1);
    const h = Math.min(230, innerHeight * 0.4);
    return this.options.map((o, i) => ({ ...o, w: cellW, h, x: innerWidth / 2 - totalW / 2 + i * (cellW + gap) + cellW / 2, y: innerHeight / 2 + 20 }));
  },
  onFrame() {
    drawBackdrop();
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "900 clamp(22px,5vw,38px) Orbitron, system-ui";
    ctx.fillStyle = "#fff"; ctx.shadowColor = "#000"; ctx.shadowBlur = 12;
    ctx.fillText(this.title, innerWidth / 2, innerHeight / 2 - 150);
    ctx.font = "700 14px system-ui"; ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.shadowBlur = 5;
    ctx.fillText(t("holdToPick"), innerWidth / 2, innerHeight / 2 - 112);
    ctx.shadowBlur = 0; ctx.restore();

    const boxes = this.layout(), cur = engine.cursor();
    let hovering = -1;
    if (cur && !this.locked) boxes.forEach((b, i) => {
      if (Math.abs(cur.x - b.x) < b.w / 2 && Math.abs(cur.y - b.y) < b.h / 2) hovering = i;
    });
    if (hovering !== this.hoverIndex) { this.hoverIndex = hovering; this.hoverSince = performance.now(); }
    const prog = hovering >= 0 ? Math.min(1, (performance.now() - this.hoverSince) / DWELL_MS) : 0;

    boxes.forEach((b, i) => {
      const hot = i === hovering;
      ctx.save();
      ctx.fillStyle = hot ? "rgba(74,222,128,.2)" : "rgba(10,6,22,.82)";
      ctx.strokeStyle = hot ? "#4ade80" : "rgba(255,255,255,.22)";
      ctx.lineWidth = hot ? 3 : 2;
      if (hot) { ctx.shadowColor = "#4ade80"; ctx.shadowBlur = 22; }
      ctx.beginPath(); ctx.roundRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, 20); ctx.fill(); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.font = "52px system-ui"; ctx.fillStyle = "#fff";
      ctx.fillText(b.emoji, b.x, b.y - b.h / 2 + 56);
      ctx.font = "900 17px Orbitron, system-ui";
      ctx.fillText(b.label, b.x, b.y - b.h / 2 + 106);
      if (b.sub) {
        ctx.font = "600 12px system-ui"; ctx.fillStyle = "rgba(255,255,255,.72)";
        b.sub.split("\n").forEach((line, k) => ctx.fillText(line, b.x, b.y - b.h / 2 + 132 + k * 17));
      }
      if (hot && prog > 0) drawDwellRing(b.x, b.y + b.h / 2 - 26, prog);
      ctx.restore();
    });
    drawCursor(cur);
    if (prog >= 1 && !this.locked) {
      this.locked = true; sfx.pick();
      const chosen = this.options[hovering];
      setTimeout(() => this.onPick(chosen.id), 110);
    }
  },
};

/* Spec sheet: 4 stat rows × 4 levels, one hold per row. */
const SPEC = {
  open(tribeIndex, onDone) {
    Object.assign(this, {
      tribeIndex, onDone, values: {}, hoverKey: "", hoverSince: 0, locked: false,
    });
    activeScreen = this;
  },
  layout() {
    const rows = TRAITS.length;
    const panelW = Math.min(innerWidth - 50, 720);
    const rowH = Math.min(74, (innerHeight - 250) / rows);
    const cellW = (panelW - 190) / 4;
    const top = innerHeight / 2 - (rows * rowH) / 2 + 26;
    const out = [];
    TRAITS.forEach((tr, r) => {
      for (let lv = 1; lv <= 4; lv++) {
        out.push({
          trait: tr, lv,
          x: innerWidth / 2 - panelW / 2 + 190 + (lv - 1) * cellW + cellW / 2,
          y: top + r * rowH + rowH / 2,
          w: cellW - 8, h: rowH - 10,
          labelX: innerWidth / 2 - panelW / 2 + 12,
        });
      }
    });
    return out;
  },
  onFrame() {
    drawBackdrop();
    const color = TRIBE_COLORS[this.tribeIndex];
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "900 clamp(20px,4.4vw,34px) Orbitron, system-ui";
    ctx.fillStyle = color; ctx.shadowColor = "#000"; ctx.shadowBlur = 12;
    ctx.fillText(t("pickSpec")(this.tribeIndex + 1), innerWidth / 2, 118);
    ctx.font = "700 13px system-ui"; ctx.fillStyle = "rgba(255,255,255,.82)"; ctx.shadowBlur = 5;
    ctx.fillText(t("specHint") + " · " + t("holdToPick"), innerWidth / 2, 146);
    ctx.shadowBlur = 0; ctx.restore();

    const cells = this.layout(), cur = engine.cursor();
    let hoverKey = "";
    // Any row stays re-selectable, so a mis-set stat can simply be held
    // again rather than being locked in for the whole run.
    if (cur && !this.locked) cells.forEach(c => {
      if (this.values[c.trait.id] === c.lv) return;
      if (Math.abs(cur.x - c.x) < c.w / 2 && Math.abs(cur.y - c.y) < c.h / 2) hoverKey = `${c.trait.id}:${c.lv}`;
    });
    if (hoverKey !== this.hoverKey) { this.hoverKey = hoverKey; this.hoverSince = performance.now(); }
    const prog = hoverKey ? Math.min(1, (performance.now() - this.hoverSince) / DWELL_MS) : 0;

    TRAITS.forEach((tr, r) => {
      const row = cells.filter(c => c.trait.id === tr.id);
      const chosen = this.values[tr.id];
      ctx.save();
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.font = "800 15px system-ui";
      ctx.fillStyle = chosen ? "rgba(255,255,255,.55)" : "#fff";
      ctx.fillText(`${tr.emoji} ${t(tr.key)}`, row[0].labelX, row[0].y);
      ctx.restore();
      row.forEach(c => {
        const key = `${tr.id}:${c.lv}`;
        const hot = key === hoverKey;
        const isChosen = chosen === c.lv;
        const dim = chosen && !isChosen;
        ctx.save();
        ctx.globalAlpha = dim ? 0.28 : 1;
        ctx.fillStyle = isChosen ? "rgba(74,222,128,.3)" : hot ? "rgba(74,222,128,.18)" : "rgba(10,6,22,.8)";
        ctx.strokeStyle = isChosen ? "#4ade80" : hot ? "#4ade80" : "rgba(255,255,255,.2)";
        ctx.lineWidth = isChosen || hot ? 3 : 2;
        if (hot) { ctx.shadowColor = "#4ade80"; ctx.shadowBlur = 18; }
        ctx.beginPath(); ctx.roundRect(c.x - c.w / 2, c.y - c.h / 2, c.w, c.h, 12); ctx.fill(); ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.font = "900 14px Orbitron, system-ui"; ctx.fillStyle = "#fff";
        ctx.fillText("●".repeat(c.lv), c.x, c.y - 8);
        ctx.font = "600 10.5px system-ui"; ctx.fillStyle = "rgba(255,255,255,.75)";
        ctx.fillText(t(tr.lvlKey)[c.lv], c.x, c.y + 12);
        if (hot && prog > 0) drawDwellRing(c.x, c.y, prog, 15);
        ctx.restore();
      });
    });
    drawCursor(cur);

    if (prog >= 1 && !this.locked) {
      const [tid, lv] = hoverKey.split(":");
      const wasComplete = TRAITS.every(x => this.values[x.id]);
      this.values[tid] = +lv;
      this.hoverKey = ""; this.hoverSince = performance.now();
      sfx.pick();
      // Only advance the first time the sheet fills up — after that the
      // player is correcting a choice and should stay on this screen.
      if (!wasComplete && TRAITS.every(x => this.values[x.id])) {
        this.locked = true;
        const spec = { ...this.values };
        setTimeout(() => this.onDone(spec), 300);
      }
    }
  },
};

/* Final look at all three tribes before the run starts — it lets the player
   (and the crowd around the booth) predict who should win. */
const CONFIRM = {
  open(specs, onStart) {
    Object.assign(this, { specs, onStart, hover: false, hoverSince: 0, locked: false });
    activeScreen = this;
  },
  box() { return { x: innerWidth / 2, y: innerHeight - 108, w: Math.min(300, innerWidth - 60), h: 74 }; },
  onFrame() {
    drawBackdrop();
    const EE = ERAS[chosenEra];
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "900 clamp(22px,5vw,36px) Orbitron, system-ui";
    ctx.fillStyle = "#fff"; ctx.shadowColor = "#000"; ctx.shadowBlur = 12;
    ctx.fillText(EE ? `${EE.emoji} ${eraName(chosenEra)} · ${t("confirmTitle")}` : t("confirmTitle"), innerWidth / 2, 108);
    ctx.shadowBlur = 0;
    ctx.restore();

    const n = this.specs.length;
    const cw = Math.min(240, (innerWidth - 80) / n), gap = 16;
    const total = cw * n + gap * (n - 1);
    this.specs.forEach((sp, i) => {
      const x = innerWidth / 2 - total / 2 + i * (cw + gap), y = 152, h = 236;
      ctx.save();
      ctx.fillStyle = "rgba(10,6,22,.85)"; ctx.strokeStyle = TRIBE_COLORS[i]; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(x, y, cw, h, 18); ctx.fill(); ctx.stroke();
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.font = "900 15px Orbitron, system-ui"; ctx.fillStyle = TRIBE_COLORS[i];
      ctx.fillText(t("tribe")(i + 1), x + cw / 2, y + 30);
      TRAITS.forEach((tr, r) => {
        const ry = y + 66 + r * 40;
        ctx.textAlign = "left"; ctx.font = "700 12px system-ui"; ctx.fillStyle = "rgba(255,255,255,.8)";
        ctx.fillText(`${tr.emoji} ${t(tr.key)}`, x + 14, ry);
        const lv = sp[tr.id];
        for (let k = 0; k < 4; k++) {
          ctx.fillStyle = k < lv ? TRIBE_COLORS[i] : "rgba(255,255,255,.16)";
          ctx.beginPath(); ctx.roundRect(x + 14 + k * 22, ry + 8, 17, 7, 3); ctx.fill();
        }
      });
      ctx.restore();
    });

    const b = this.box(), cur = engine.cursor();
    const hot = !!cur && !this.locked && Math.abs(cur.x - b.x) < b.w / 2 && Math.abs(cur.y - b.y) < b.h / 2;
    if (hot !== this.hover) { this.hover = hot; this.hoverSince = performance.now(); }
    const prog = hot ? Math.min(1, (performance.now() - this.hoverSince) / DWELL_MS) : 0;
    ctx.save();
    ctx.fillStyle = hot ? "rgba(74,222,128,.22)" : "rgba(10,6,22,.85)";
    ctx.strokeStyle = "#4ade80"; ctx.lineWidth = hot ? 4 : 2;
    if (hot) { ctx.shadowColor = "#4ade80"; ctx.shadowBlur = 24; }
    ctx.beginPath(); ctx.roundRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, 20); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.font = "900 22px Orbitron, system-ui"; ctx.fillStyle = "#fff";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(t("confirmStart"), b.x, b.y);
    ctx.restore();
    if (hot && prog > 0) drawDwellRing(b.x + b.w / 2 - 26, b.y, prog, 16);
    drawCursor(cur);
    if (prog >= 1 && !this.locked) { this.locked = true; sfx.pick(); setTimeout(() => this.onStart(), 120); }
  },
};

function drawBackdrop() {
  ctx.save();
  if (camBgOn) { ctx.fillStyle = "rgba(3,0,10,.6)"; ctx.fillRect(0, 0, innerWidth, innerHeight); }
  else { ctx.fillStyle = "#080511"; ctx.fillRect(0, 0, innerWidth, innerHeight); }
  ctx.restore();
}
function drawDwellRing(x, y, prog, r = 20) {
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke();
  ctx.strokeStyle = "#4ade80"; ctx.lineCap = "round";
  ctx.shadowColor = "#4ade80"; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + prog * Math.PI * 2); ctx.stroke();
  ctx.restore();
}
function drawCursor(cur) {
  ctx.save();
  if (cur) {
    ctx.strokeStyle = "#4ade80"; ctx.lineWidth = 3;
    ctx.shadowColor = "#4ade80"; ctx.shadowBlur = 16;
    ctx.beginPath(); ctx.arc(cur.x, cur.y, 14, 0, 7); ctx.stroke();
    ctx.fillStyle = "rgba(74,222,128,.35)";
    ctx.beginPath(); ctx.arc(cur.x, cur.y, 5, 0, 7); ctx.fill();
  } else {
    ctx.font = "700 16px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(11,5,24,.82)";
    ctx.beginPath(); ctx.roundRect(innerWidth / 2 - 150, innerHeight - 66, 300, 42, 21); ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText(t("handLost"), innerWidth / 2, innerHeight - 45);
  }
  ctx.restore();
}

let chosenEra = null;
const chosenSpecs = [];
function startSetup() {
  chosenEra = null; chosenSpecs.length = 0;
  CHOOSER.open(t("pickEra"), ERA_KEYS.map(k => ({
    id: k, emoji: ERAS[k].emoji, label: ERAS[k][lang],
    sub: `🍎 ${"▮".repeat(Math.round(ERAS[k].food * 2.5))}\n⚔ ${"▮".repeat(Math.round(ERAS[k].strength * 2.5))}`,
  })), (era) => { chosenEra = era; nextSpec(0); });
}
function nextSpec(i) {
  if (i >= 3) return CONFIRM.open(chosenSpecs.slice(), () => SIM.start(chosenEra, chosenSpecs.slice()));
  SPEC.open(i, (spec) => { chosenSpecs.push(spec); nextSpec(i + 1); });
}

/* ================================================
   SIMULATION
================================================ */
const COLS = 60, ROWS = 34;
const SIM_DURATION = 150, CONQUEST_AT = 55;
const SPEEDS = [1, 2, 5, 10];
const F_NONE = 0, F_TREE = 1, F_ROCK = 2, F_WATER = 3;

const SIM = {
  feat: [], owner: [], build: [], tribes: [], simT: 0, speed: 1, running: false,
  era: null, ended: false, battles: [], terrainCache: null, logNode: null, speedBar: null,

  start(era, specs) {
    this.era = era; this.simT = 0; this.speed = 1; this.running = true; this.ended = false;
    this.battles = []; this.terrainCache = null; this.toasts = []; this.banner = null; this.warAnnounced = false;

    const EG = ERAS[era];
    this.feat = new Array(COLS * ROWS).fill(F_NONE);
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      const n = Math.sin(x * 0.31 + y * 0.17) + Math.sin(x * 0.11 - y * 0.29) * 0.8 + Math.sin((x + y) * 0.07) * 0.6;
      const m = Math.sin(x * 0.53 - y * 0.41) + Math.cos(x * 0.19 + y * 0.23);
      let f = F_NONE;
      if (n < EG.tWater) f = F_WATER;
      else if (n > EG.tTree) f = F_TREE;
      else if (m > EG.tRock) f = F_ROCK;
      this.feat[y * COLS + x] = f;
    }
    this.owner = new Array(COLS * ROWS).fill(-1);
    this.build = new Array(COLS * ROWS).fill(0); // 0 none, 1 hut, 2 wall

    const spots = [{ x: 7, y: ROWS - 8 }, { x: COLS - 8, y: 7 }, { x: Math.floor(COLS / 2), y: ROWS - 6 }];
    this.tribes = specs.map((spec, i) => {
      const boost = learnedBonus(era, spec);
      const home = this.nearestOpen(spots[i].x, spots[i].y);
      const tr = {
        spec, color: TRIBE_COLORS[i], glow: TRIBE_GLOW[i], name: t("tribe")(i + 1), idx: i,
        int: spec.int, work: spec.work, health: spec.health, aggro: spec.aggro, boost,
        pop: 6, food: 30, morale: 1, home, alive: true,
        known: new Set(), seen: new Set(), explore: 0,
        gainT: 0, expandT: 0, fightT: 0, buildT: 0, ignoreT: 0, lastPopLog: 6,
        wood: 0, stone: 0, workers: [], activeFrac: 1, idleLogged: 0, jobLogged: {},
        log: [],
      };
      const hp = this.xy(home);
      for (let k = 0; k < WORKER_CAP; k++) {
        tr.workers.push({ x: hp.x + (Math.random() - 0.5) * 2, y: hp.y + (Math.random() - 0.5) * 2,
          state: "idle", job: null, timer: Math.random() * 1.5, anim: Math.random() * 6 });
      }
      this.owner[home] = i;
      this.neighbors(home).forEach(n => { if (this.owner[n] === -1) this.owner[n] = i; });
      this.pushLog(tr, t("evStart"));
      return tr;
    });

    this.logNode = el(`<div class="civ-log">${this.tribes.map((tr, i) => `
      <div class="log-col" id="logCol${i}" style="--c:${tr.color}">
        <div class="log-head">
          <span class="log-name">${tr.name}</span>
          <span class="log-stats"><b id="lgPop${i}">6</b>👥 <b id="lgLand${i}">1</b>🗺️</span>
        </div>
        <div class="log-traits">${TRAITS.map(x => `${x.emoji}${"●".repeat(tr.spec[x.id])}`).join(" ")}</div>
        <div class="log-disc" id="lgDisc${i}">${t("nothing")}</div>
        <div class="log-body" id="lgBody${i}"></div>
      </div>`).join("")}</div>`);
    document.body.appendChild(this.logNode);

    this.speedBar = el(`<div class="speed-bar"><span class="speed-lbl">${t("speed")}</span>
      ${SPEEDS.map(s => `<button class="speed-btn${s === 1 ? " active" : ""}" data-s="${s}">×${s}</button>`).join("")}</div>`);
    this.speedBar.querySelectorAll(".speed-btn").forEach(b => {
      b.onclick = () => {
        sfx.click(); this.speed = +b.dataset.s;
        this.speedBar.querySelectorAll(".speed-btn").forEach(o => o.classList.toggle("active", o === b));
      };
    });
    document.body.appendChild(this.speedBar);
    activeScreen = this;
    this.refreshLog();
  },
  cleanup() {
    this.logNode?.remove(); this.logNode = null;
    this.speedBar?.remove(); this.speedBar = null;
    this.running = false;
  },

  pushLog(tr, msg, traitId) {
    const r = traitId ? reason(tr, traitId) : null;
    tr.log.push({ msg, tag: r ? r.tag : "", why: r ? r.why : "" });
    if (tr.log.length > 40) tr.log.shift();
    tr.logDirty = true;
  },
  refreshLog() {
    if (!this.logNode) return;
    this.tribes.forEach((tr, i) => {
      if (!tr.logDirty) return;
      tr.logDirty = false;
      const body = this.logNode.querySelector(`#lgBody${i}`);
      if (body) {
        body.innerHTML = tr.log.slice(-14).map(e =>
          `<div class="log-line"><span class="lg-msg">${e.msg}</span>${e.tag ? `<span class="lg-tag" title="${e.why}">${e.tag}</span>` : ""}</div>`).join("");
        body.scrollTop = body.scrollHeight;
      }
      const disc = this.logNode.querySelector(`#lgDisc${i}`);
      if (disc) {
        const list = DISCOVERIES.filter(d => tr.known.has(d.id));
        disc.innerHTML = list.length ? list.map(d => `<span title="${discName(d)}">${d.emoji}</span>`).join("") : t("nothing");
      }
    });
  },

  xy(i) { return { x: i % COLS, y: Math.floor(i / COLS) }; },
  idx(x, y) { return y * COLS + x; },
  nearestOpen(x, y) {
    for (let r = 0; r < 12; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;
      const i = this.idx(nx, ny);
      if (this.feat[i] !== F_WATER) return i;
    }
    return this.idx(Math.max(1, Math.min(COLS - 2, x)), Math.max(1, Math.min(ROWS - 2, y)));
  },
  neighbors(i) {
    const { x, y } = this.xy(i), out = [];
    if (x > 0) out.push(i - 1);
    if (x < COLS - 1) out.push(i + 1);
    if (y > 0) out.push(i - COLS);
    if (y < ROWS - 1) out.push(i + COLS);
    return out;
  },
  landOf(tr) { let n = 0; for (let i = 0; i < this.owner.length; i++) if (this.owner[i] === tr.idx) n++; return n; },
  ownsFeature(tr, f) {
    for (let i = 0; i < this.owner.length; i++) if (this.owner[i] === tr.idx && this.feat[i] === f) return true;
    return false;
  },
  // Drinking water: owning a water tile, or holding land right next to one.
  // Frozen eras need fire before that water is any use.
  hasWater(tr, E) {
    if (E.frozen && !tr.known.has("fire")) return false;
    for (let i = 0; i < this.owner.length; i++) {
      if (this.owner[i] !== tr.idx) continue;
      if (this.feat[i] === F_WATER) return true;
      for (const n of this.neighbors(i)) if (this.feat[n] === F_WATER) return true;
    }
    return false;
  },
  /* Final score. Land alone used to decide everything, which meant a tribe
     that discovered nothing could still win — so knowledge and building now
     carry real weight, and the breakdown is shown to the player. */
  scoreOf(tr) {
    const land = this.landOf(tr);
    const huts = this.countBuild(tr, 1), walls = this.countBuild(tr, 2);
    const parts = {
      land,
      build: huts * 8 + walls * 5,
      know: tr.known.size * 16,
      people: Math.floor(tr.pop) * 0.5,
    };
    parts.total = Math.round(parts.land + parts.build + parts.know + parts.people);
    if (!tr.alive) parts.total = Math.round(parts.total * 0.35);
    return parts;
  },

  /* Discovery: expanding reveals resources; whether the tribe can make
     anything of them is gated on the intelligence the player chose. */
  tryDiscover(tr, dt) {
    tr.explore += dt * (0.35 + this.landOf(tr) * 0.012) * cv("discover", tr.int) * (tr.known.has("writing") ? 1.5 : 1);
    if (tr.explore < 1) return;
    tr.explore = 0;
    const avail = DISCOVERIES.filter(d =>
      !tr.known.has(d.id) &&
      d.int <= tr.int &&
      (!d.needs || d.needs.every(n => tr.known.has(n))) &&
      (!d.res || this.ownsFeature(tr, d.res === "tree" ? F_TREE : d.res === "rock" ? F_ROCK : F_WATER)));
    if (!avail.length) {
      // Owns the resource but is not clever enough to use it — this is the
      // moment the player's trait choice becomes a visible story beat.
      tr.ignoreT += 1;
      if (tr.ignoreT % 3 === 0) {
        const blocked = DISCOVERIES.find(d => !tr.known.has(d.id) && d.res && d.int > tr.int &&
          this.ownsFeature(tr, d.res === "tree" ? F_TREE : d.res === "rock" ? F_ROCK : F_WATER));
        if (blocked) this.pushLog(tr, t("evIgnore")(t(blocked.res === "tree" ? "thingTree" : blocked.res === "rock" ? "thingRock" : "thingWater")));
      }
      return;
    }
    const d = avail[0];
    tr.known.add(d.id);
    this.pushLog(tr, t("evDiscover")(d.emoji, discName(d)), "int");
    this.toasts.push({ text: `${d.emoji} ${tr.name}: ${discName(d)}`, color: tr.color, life: 2.4 });
    if (this.speed <= 5) sfx.discover();
  },

  /* ---- workers: walk to a job, do it, walk home ----
     What jobs even exist depends on what the tribe has discovered, and how
     often a worker bothers to take one depends on their Work level — which
     is what makes a lazy or unintelligent tribe visibly do nothing. */
  ownedTiles(tr, filter) {
    const out = [];
    for (let i = 0; i < this.owner.length; i++) {
      if (this.owner[i] !== tr.idx) continue;
      if (!filter || filter(i)) out.push(i);
    }
    return out;
  },
  pickJob(tr, war) {
    // Lazy tribes simply refuse the job and keep standing around.
    if (Math.random() < cv("idleChance", tr.work)) return null;

    if (war && Math.random() < cv("fightUrge", tr.aggro)) {
      const border = this.ownedTiles(tr, i => this.neighbors(i).some(n => {
        const o = this.owner[n];
        return o !== -1 && o !== tr.idx && this.tribes[o].alive;
      }));
      if (border.length) return { type: JOB_FIGHT, tile: border[Math.floor(Math.random() * border.length)], dur: 1.6 };
    }
    if (tr.known.has("wood")) {
      const trees = this.ownedTiles(tr, i => this.feat[i] === F_TREE);
      if (trees.length && Math.random() < 0.4) return { type: JOB_TREE, tile: trees[Math.floor(Math.random() * trees.length)], dur: 2.4 };
    }
    if (tr.known.has("stone")) {
      const rocks = this.ownedTiles(tr, i => this.feat[i] === F_ROCK);
      if (rocks.length && Math.random() < 0.35) return { type: JOB_ROCK, tile: rocks[Math.floor(Math.random() * rocks.length)], dur: 2.8 };
    }
    const wantHut = tr.known.has("huts") && tr.wood >= 3 && this.countBuild(tr, 1) < Math.floor(tr.pop / 6);
    const wantWall = tr.known.has("walls") && tr.stone >= 3 && this.countBuild(tr, 2) < 6;
    if (wantHut || wantWall) {
      const spots = this.ownedTiles(tr, i => !this.build[i] && this.feat[i] === F_NONE);
      if (spots.length) return { type: JOB_BUILD, build: wantHut ? 1 : 2, tile: spots[Math.floor(Math.random() * spots.length)], dur: 3 };
    }
    const fields = this.ownedTiles(tr, i => this.feat[i] !== F_WATER);
    if (fields.length) return { type: JOB_FARM, tile: fields[Math.floor(Math.random() * fields.length)], dur: 2 };
    return null;
  },
  finishJob(tr, job, E) {
    if (job.type === JOB_TREE) {
      tr.wood += 1;
      if (!tr.jobLogged.chop) { tr.jobLogged.chop = 1; this.pushLog(tr, t("evChop"), "work"); }
    } else if (job.type === JOB_ROCK) {
      tr.stone += 1;
      if (!tr.jobLogged.mine) { tr.jobLogged.mine = 1; this.pushLog(tr, t("evMine"), "work"); }
    } else if (job.type === JOB_BUILD) {
      if (!this.build[job.tile] && this.owner[job.tile] === tr.idx) {
        if (job.build === 1 && tr.wood >= 3) {
          tr.wood -= 3; this.build[job.tile] = 1; this.pushLog(tr, t("evBuildHut"), "int");
        } else if (job.build === 2 && tr.stone >= 3) {
          tr.stone -= 3; this.build[job.tile] = 2; this.pushLog(tr, t("evBuildWall"), "int");
        }
      }
    } else if (job.type === JOB_FIGHT) {
      this.attack(tr, E);
    }
  },
  updateWorkers(tr, dt, E) {
    const speed = 2.6 * cv("workSpeed", tr.work);
    let active = 0;
    tr.workers.forEach(w => {
      w.anim += dt * 8;
      if (w.state === "idle") {
        w.timer -= dt;
        if (w.timer <= 0) {
          const job = this.pickJob(tr, this.simT >= CONQUEST_AT);
          if (job) { w.job = job; w.state = "toJob"; }
          else { w.timer = cv("idleWait", tr.work) * (0.6 + Math.random() * 0.8); }
        }
      } else if (w.state === "toJob" || w.state === "toHome") {
        // Walking counts as only half-productive, so a slow tribe that spends
        // its life in transit does not read as a busy one.
        active += 0.5;
        const target = w.state === "toJob" ? this.xy(w.job.tile) : this.xy(tr.home);
        const dx = target.x - w.x, dy = target.y - w.y;
        const d = Math.hypot(dx, dy);
        if (d < 0.25) {
          if (w.state === "toJob") { w.state = "working"; w.timer = w.job.dur / cv("workSpeed", tr.work); }
          else { w.state = "idle"; w.timer = 0.2 + Math.random() * 0.9; w.job = null; }
        } else {
          w.x += (dx / d) * speed * dt;
          w.y += (dy / d) * speed * dt;
        }
      } else if (w.state === "working") {
        active++;
        w.timer -= dt;
        if (w.timer <= 0) { this.finishJob(tr, w.job, E); w.state = "toHome"; }
      }
    });
    tr.activeFrac = tr.workers.length ? active / tr.workers.length : 0;
  },

  step(dt) {
    const E = ERAS[this.era];
    const war = this.simT >= CONQUEST_AT;
    this.tribes.forEach((tr) => {
      if (!tr.alive) return;
      const land = this.landOf(tr);

      // resource discovery from newly owned tiles
      for (let i = 0; i < this.owner.length; i++) {
        if (this.owner[i] !== tr.idx) continue;
        const f = this.feat[i];
        if (f === F_NONE || tr.seen.has(f)) continue;
        tr.seen.add(f);
        this.pushLog(tr, f === F_TREE ? t("evFoundTree") : f === F_ROCK ? t("evFoundRock") : t("evFoundWater"));
      }
      this.tryDiscover(tr, dt);

      this.updateWorkers(tr, dt, E);

      // --- water: a civilization without drinking water is in real trouble.
      // In the Ice Age the water is frozen solid, so it only counts once the
      // tribe has discovered fire to melt it.
      const water = this.hasWater(tr, E);
      if (!water && !tr.thirstLogged) { tr.thirstLogged = true; this.pushLog(tr, t("evThirst"), "int"); }
      if (water && tr.thirstLogged) { tr.thirstLogged = false; this.pushLog(tr, t("evWaterFound"), "int"); }
      const thirst = water ? 1 : 1.85;

      // Food scales with population, but is gated by the fraction of workers
      // actually doing something — so visible idling directly starves them.
      const workMul = cv("output", tr.work) * tr.boost;
      const farmBonus = tr.known.has("farming") ? 1.6 : 0.55;   // no farming = foraging only
      const toolBonus = tr.known.has("tools") ? 1.3 : 1;
      const fireBonus = tr.known.has("fire") ? 1.25 : 1;
      const effort = 0.25 + tr.activeFrac * 0.75;

      tr.food += tr.pop * workMul * E.food * farmBonus * toolBonus * fireBonus * effort * dt * 1.35;
      tr.food -= tr.pop * 0.42 * cv("upkeep", tr.health) * thirst * dt;

      if (tr.activeFrac < 0.35 && performance.now() - tr.idleLogged > 12000) {
        tr.idleLogged = performance.now();
        this.pushLog(tr, t("evIdle"), "work");
      }

      if (tr.food < 0) {
        tr.food = 0;
        tr.pop = Math.max(0, tr.pop - dt * 1.3 * cv("upkeep", tr.health));
        tr.morale = Math.max(0.35, tr.morale - dt * 0.08);
        if (!tr.starveLogged) { this.pushLog(tr, t("evStarve")); tr.starveLogged = true; }
      } else {
        tr.starveLogged = false;
        tr.morale = Math.min(1.15, tr.morale + dt * 0.03 * (0.5 + tr.health * 0.18));
      }

      // Housing is the real population ceiling. Empty land barely supports
      // anyone, so a tribe that never works out huts simply plateaus no
      // matter how much territory it grabs.
      const hutCount = this.countBuild(tr, 1);
      const cap = 10 + land * 0.16 + hutCount * 14;
      tr.capped = tr.pop >= cap - 0.5;
      if (tr.capped && !tr.capLogged2 && !tr.known.has("huts")) {
        tr.capLogged2 = true; this.pushLog(tr, t("evNoRoom"), "int");
      }
      tr.gainT += dt;
      if (tr.food > tr.pop * 1.6 && tr.pop < cap && tr.gainT > 0.9) {
        tr.gainT = 0;
        tr.pop += 1 * E.growth * cv("growth", tr.health) * (water ? 1 : 0.45);
        tr.food -= tr.pop * 0.35;
        if (Math.floor(tr.pop / 15) > Math.floor(tr.lastPopLog / 15)) { this.pushLog(tr, t("evGrow")(Math.floor(tr.pop))); tr.lastPopLog = tr.pop; }
      }

      // Expansion still scales with effort, so a lazy tribe also spreads slowly.
      tr.expandT += dt;
      const wheel = tr.known.has("wheel") ? 0.65 : 1;
      if (tr.pop >= 4 && tr.expandT > Math.max(0.3, (1.7 - cv("output", tr.work) * 0.5 - tr.pop * 0.01) * wheel)) {
        tr.expandT = 0;
        if (this.claimFree(tr)) { tr.expandCount = (tr.expandCount || 0) + 1; if (tr.expandCount % 12 === 0) this.pushLog(tr, t("evExpand"), "work"); }
      }
      // Building and fighting are now carried out by the workers themselves
      // (see updateWorkers/finishJob) so what you see on the map is what
      // actually drives the simulation.

      if (tr.pop <= 0.5) { tr.alive = false; this.pushLog(tr, t("evLost"), "health"); sfx.bad(); }
    });

    this.tribes.forEach(tr => {
      if (tr.alive && this.owner[tr.home] !== tr.idx) {
        tr.alive = false; this.pushLog(tr, t("evLost"), "aggro");
        this.banner = { text: t("kingFell")(tr.name), color: tr.color, life: 2.2 };
      }
    });
    if (war && !this.warAnnounced) {
      this.warAnnounced = true;
      this.banner = { text: t("warBegins"), color: "#ff6b6b", life: 2.6 };
      sfx.bad();
    }
    this.battles = this.battles.filter(b => (b.life -= dt) > 0);
    this.toasts = this.toasts.filter(x => (x.life -= dt) > 0);
    if (this.banner && (this.banner.life -= dt) <= 0) this.banner = null;
    if (this.simT >= SIM_DURATION || this.tribes.filter(x => x.alive).length <= 1) this.finish();
  },

  countBuild(tr, type) { let n = 0; for (let i = 0; i < this.build.length; i++) if (this.build[i] === type && this.owner[i] === tr.idx) n++; return n; },
  placeBuild(tr, type) {
    const opts = [];
    for (let i = 0; i < this.owner.length; i++)
      if (this.owner[i] === tr.idx && !this.build[i] && this.feat[i] !== F_WATER) opts.push(i);
    if (!opts.length) return false;
    this.build[opts[Math.floor(Math.random() * opts.length)]] = type;
    return true;
  },
  claimFree(tr) {
    const frontier = [];
    for (let i = 0; i < this.owner.length; i++) {
      if (this.owner[i] !== tr.idx) continue;
      for (const n of this.neighbors(i)) {
        if (this.owner[n] !== -1) continue;
        if (this.feat[n] === F_WATER && !tr.known.has("boats")) continue;
        frontier.push(n); break;
      }
    }
    if (!frontier.length) return false;
    this.owner[frontier[Math.floor(Math.random() * frontier.length)]] = tr.idx;
    return true;
  },
  attack(tr, E) {
    const targets = [];
    for (let i = 0; i < this.owner.length; i++) {
      if (this.owner[i] !== tr.idx) continue;
      for (const n of this.neighbors(i)) {
        const o = this.owner[n];
        if (o !== -1 && o !== tr.idx && this.tribes[o].alive) targets.push(n);
      }
    }
    if (!targets.length) return false;
    const tile = targets[Math.floor(Math.random() * targets.length)];
    const def = this.tribes[this.owner[tile]];
    const metal = tr.known.has("metal") ? 1.3 : 1, army = tr.known.has("army") ? 1.45 : 1;
    const wall = this.build[tile] === 2 ? 1.5 : 1;
    const atk = tr.pop * cv("attack", tr.aggro) * 0.3 * tr.morale * E.strength * metal * army;
    const dfn = def.pop * (0.35 + def.health * 0.18) * def.morale * wall * (def.known.has("walls") ? 1.15 : 1);
    if (!tr.attackLogged || performance.now() - tr.attackLogged > 9000) {
      this.pushLog(tr, t("evAttack")(def.name)); tr.attackLogged = performance.now();
    }
    if (atk > dfn * (0.75 + Math.random() * 0.5)) {
      this.owner[tile] = tr.idx; this.build[tile] = 0;
      def.morale = Math.max(0.35, def.morale - 0.05);
      def.pop = Math.max(0, def.pop - 0.35);
      tr.pop = Math.max(0, tr.pop - 0.12);
      const p = this.xy(tile);
      this.battles.push({ x: p.x, y: p.y, life: 0.45 });
      if (!tr.capLogged || performance.now() - tr.capLogged > 7000) { this.pushLog(tr, t("evCapture")(def.name)); tr.capLogged = performance.now(); }
      if (this.speed <= 2) sfx.battle();
      return true;
    }
    tr.pop = Math.max(0, tr.pop - 0.2);
    return false;
  },

  finish() {
    if (this.ended) return;
    this.ended = true; this.running = false;
    const ranked = this.tribes.map(tr => ({ tr, land: this.landOf(tr), sc: this.scoreOf(tr) }))
      .sort((a, b) => b.sc.total - a.sc.total);
    const win = ranked[0];
    // Name the single biggest contributor to the winner's score, so the
    // player gets a straight answer to "why did they win?".
    const contrib = [
      { k: "scLand", v: win.sc.land }, { k: "scBuild", v: win.sc.build },
      { k: "scKnow", v: win.sc.know }, { k: "scPeople", v: win.sc.people },
    ].sort((a, b) => b.v - a.v)[0];
    const bestKey = "civsim-best-" + malaysiaDateStr();
    const prevBest = +(localStorage.getItem(bestKey) || 0);
    if (win.sc.total > prevBest) localStorage.setItem(bestKey, win.sc.total);
    const bestNow = Math.max(prevBest, win.sc.total);
    recordRun(this.era, win.tr.spec, this.tribes.map(x => x.spec));
    const wt = topTrait(win.tr.spec);
    // Keep the map and the logs alive so the player can go back and study
    // the final state; only the speed control is retired.
    this.speedBar?.remove(); this.speedBar = null;
    ui.classList.remove("passthrough");
    sfx.win();
    const rec = loadLearn();
    const node = el(`<div class="panel">
      <div class="big-emoji">🏆</div>
      <h2>${t("resultTitle")}</h2>
      <div class="result-rank" style="color:${win.tr.color}">${t("winner")(win.tr.name)}</div>
      <div class="desc">${TRAITS.find(x => x.id === wt).emoji} ${traitLabel(wt)} · ${ERAS[this.era].emoji} ${eraName(this.era)}</div>
      <div class="why-box">
        <div class="why-title">${t("whyWon")}</div>
        <div class="why-grid">
          <span>🗺️ ${t("scLand")}</span><b>${win.sc.land}</b>
          <span>🏠 ${t("scBuild")}</span><b>${win.sc.build}</b>
          <span>🧠 ${t("scKnow")}</span><b>${win.sc.know}</b>
          <span>👥 ${t("scPeople")}</span><b>${Math.round(win.sc.people)}</b>
        </div>
        <div class="why-main">▲ ${t(contrib.k)}</div>
      </div>
      <div class="civ-rank">${ranked.map((r, i) => `
        <div class="civ-rank-row" style="--c:${r.tr.color}">
          <span>${i + 1}. ${r.tr.name} ${DISCOVERIES.filter(d => r.tr.known.has(d.id)).map(d => d.emoji).join("")}</span>
          <b>${r.sc.total}</b>
        </div>`).join("")}</div>
      <div class="best-line">${t("bestToday")(bestNow)} · ${t("runsToday")(rec.runs)}</div>
      <button class="btn" id="againBtn">${t("again")}</button>
      <br><button class="btn ghost" id="viewBtn" style="font-size:15px;padding:10px 24px">${t("viewMap")}</button>
      <br><button class="btn ghost" id="backBtn" style="font-size:15px;padding:10px 24px">${t("back")}</button>
    </div>`);
    node.querySelector("#againBtn").onclick = () => { sfx.click(); this.exitReview(); show(null); ui.classList.add("passthrough"); startSetup(); };
    node.querySelector("#backBtn").onclick = () => { sfx.click(); stopAll(); location.href = "../"; };
    node.querySelector("#viewBtn").onclick = () => { sfx.click(); this.enterReview(node); };
    this.resultNode = node;
    show(node);
  },
  // Review mode: hide the result panel so the finished map and all three
  // logs are fully visible, with one chip to bring the results back.
  enterReview(resultNode) {
    show(null);
    ui.classList.add("passthrough");
    this.reviewChip?.remove();
    this.reviewChip = el(`<button class="review-chip">${t("backToResults")}</button>`);
    this.reviewChip.onclick = () => { sfx.click(); this.exitReview(); ui.classList.remove("passthrough"); show(resultNode); };
    document.body.appendChild(this.reviewChip);
  },
  exitReview() { this.reviewChip?.remove(); this.reviewChip = null; },

  onFrame(dt) {
    if (this.running) {
      const total = dt * this.speed;
      const steps = Math.min(12, Math.max(1, Math.ceil(total / 0.05)));
      for (let i = 0; i < steps && this.running; i++) { this.simT += total / steps; this.step(total / steps); }
      this.refreshLog();
      // Mark whoever is currently ahead on score, so the race is readable
      // at a glance instead of having to compare raw numbers.
      let leader = -1, best = -1;
      this.tribes.forEach((tr, i) => { const s = this.scoreOf(tr).total; if (tr.alive && s > best) { best = s; leader = i; } });
      this.tribes.forEach((tr, i) => {
        const p = this.logNode?.querySelector(`#lgPop${i}`), l = this.logNode?.querySelector(`#lgLand${i}`);
        if (p) p.textContent = Math.floor(tr.pop);
        if (l) l.textContent = this.landOf(tr);
        const col = this.logNode?.querySelector(`#logCol${i}`);
        col?.classList.toggle("fallen", !tr.alive);
        col?.classList.toggle("leading", i === leader);
      });
    }
    this.draw();
  },

  mapRect() {
    const panelW = this.logNode ? this.logNode.getBoundingClientRect().width : 0;
    const left = panelW + 14, top = 66, right = 14, bottom = 78;
    const availW = innerWidth - left - right, availH = innerHeight - top - bottom;
    const cell = Math.max(4, Math.floor(Math.min(availW / COLS, availH / ROWS)));
    const w = cell * COLS, h = cell * ROWS;
    return { cell, w, h, ox: left + (availW - w) / 2, oy: top + (availH - h) / 2 };
  },
  buildTerrain(cell) {
    const E = ERAS[this.era];
    const c = document.createElement("canvas");
    c.width = COLS * cell; c.height = ROWS * cell;
    const g = c.getContext("2d");
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      const i = y * COLS + x, f = this.feat[i];
      const shade = (x + y) % 2 === 0 ? E.ground : E.alt;
      g.fillStyle = f === F_WATER ? E.water : shade;
      g.fillRect(x * cell, y * cell, cell, cell);
      if (f === F_TREE) {
        g.fillStyle = E.tree;
        g.fillRect(x * cell + cell * 0.42, y * cell + cell * 0.55, Math.max(1, cell * 0.16), cell * 0.4);
        g.beginPath();
        g.moveTo(x * cell + cell * 0.5, y * cell + cell * 0.08);
        g.lineTo(x * cell + cell * 0.86, y * cell + cell * 0.66);
        g.lineTo(x * cell + cell * 0.14, y * cell + cell * 0.66);
        g.closePath(); g.fill();
        g.fillStyle = E.treeDot;
        g.fillRect(x * cell + cell * 0.44, y * cell + cell * 0.3, Math.max(1, cell * 0.12), Math.max(1, cell * 0.12));
      } else if (f === F_ROCK) {
        g.fillStyle = E.rock;
        g.beginPath(); g.ellipse(x * cell + cell / 2, y * cell + cell * 0.62, cell * 0.34, cell * 0.26, 0, 0, 7); g.fill();
        g.fillStyle = "rgba(255,255,255,.18)";
        g.beginPath(); g.ellipse(x * cell + cell * 0.42, y * cell + cell * 0.52, cell * 0.12, cell * 0.09, 0, 0, 7); g.fill();
      } else if (f === F_WATER) {
        g.fillStyle = "rgba(255,255,255,.16)";
        g.fillRect(x * cell + cell * 0.15, y * cell + cell * 0.45, cell * 0.7, Math.max(1, cell * 0.1));
      }
    }
    return c;
  },
  /* A tiny pixel person, plus a visible action for whatever they are doing —
     a swinging axe on a tree, a pick on stone, a hammer on a build site, a
     blade at the border, and a 💤 when they are simply not working. */
  drawWorker(tr, w, ox, oy, cell) {
    const px = ox + w.x * cell + cell * 0.5;
    const py = oy + w.y * cell + cell * 0.5;
    const s = Math.max(2.2, cell * 0.2);            // body unit
    const walking = w.state === "toJob" || w.state === "toHome";
    const bob = walking ? Math.sin(w.anim * 1.6) * s * 0.35 : 0;
    ctx.save();

    if (w.state === "idle") ctx.globalAlpha = 0.55;
    // body
    ctx.fillStyle = tr.color;
    ctx.fillRect(px - s * 0.5, py - s * 0.6 + bob, s, s * 1.3);
    // head
    ctx.fillStyle = "#ffe8c8";
    ctx.fillRect(px - s * 0.45, py - s * 1.75 + bob, s * 0.9, s * 0.95);

    if (w.state === "working" && w.job) {
      const swing = Math.sin(w.anim * 2.2);
      ctx.lineCap = "round";
      ctx.lineWidth = Math.max(1.2, s * 0.34);
      if (w.job.type === JOB_TREE) {
        ctx.strokeStyle = "#c98b3a";
        ctx.beginPath();
        ctx.moveTo(px + s * 0.5, py - s * 0.4);
        ctx.lineTo(px + s * 1.3, py - s * 0.4 - swing * s * 1.1);
        ctx.stroke();
        ctx.fillStyle = "#dbe4ea";
        ctx.fillRect(px + s * 1.05, py - s * 0.85 - swing * s * 1.1, s * 0.55, s * 0.5);
        if (swing > 0.85) { ctx.fillStyle = "rgba(255,240,180,.9)"; ctx.fillRect(px + s * 1.2, py - s * 0.2, s * 0.5, s * 0.3); }
      } else if (w.job.type === JOB_ROCK) {
        ctx.strokeStyle = "#9aa0a6";
        ctx.beginPath();
        ctx.moveTo(px + s * 0.5, py - s * 0.3);
        ctx.lineTo(px + s * 1.25, py - s * 0.3 - swing * s);
        ctx.stroke();
      } else if (w.job.type === JOB_BUILD) {
        ctx.strokeStyle = "#e0b070";
        ctx.beginPath();
        ctx.moveTo(px + s * 0.5, py - s * 0.5);
        ctx.lineTo(px + s * 1.1, py - s * 0.5 - Math.abs(swing) * s * 0.9);
        ctx.stroke();
        ctx.fillStyle = "#8b5a2b";
        ctx.fillRect(px + s * 0.9, py - s * 1.05 - Math.abs(swing) * s * 0.9, s * 0.7, s * 0.45);
      } else if (w.job.type === JOB_FIGHT) {
        ctx.strokeStyle = "#ffe08a";
        ctx.beginPath();
        ctx.moveTo(px + s * 0.4, py - s * 0.6);
        ctx.lineTo(px + s * 1.3, py - s * 1.1 - swing * s * 0.5);
        ctx.stroke();
      } else if (w.job.type === JOB_FARM) {
        ctx.strokeStyle = "#6ac46a";
        ctx.beginPath();
        ctx.moveTo(px + s * 0.45, py - s * 0.2);
        ctx.lineTo(px + s * 1.05, py + s * 0.3 - Math.abs(swing) * s * 0.5);
        ctx.stroke();
      }
    } else if (w.state === "idle" && cell >= 11) {
      ctx.globalAlpha = 0.5 + Math.sin(w.anim * 0.5) * 0.2;
      ctx.fillStyle = "#cfe6ff";
      ctx.font = `${Math.max(7, cell * 0.42)}px system-ui`;
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillText("💤", px + s * 0.9, py - s * 1.6);
    }
    ctx.restore();
  },

  draw() {
    const E = ERAS[this.era];
    const { cell, w, h, ox, oy } = this.mapRect();
    ctx.save();
    if (camBgOn) { ctx.fillStyle = "rgba(3,0,10,.66)"; ctx.fillRect(0, 0, innerWidth, innerHeight); }
    else { ctx.fillStyle = "#080511"; ctx.fillRect(0, 0, innerWidth, innerHeight); }

    if (!this.terrainCache || this.terrainCache.cell !== cell) {
      this.terrainCache = { cell, canvas: this.buildTerrain(cell) };
    }
    ctx.drawImage(this.terrainCache.canvas, ox, oy);

    // ownership tint + buildings
    for (let i = 0; i < this.owner.length; i++) {
      const o = this.owner[i];
      if (o === -1) continue;
      const p = this.xy(i), px = ox + p.x * cell, py = oy + p.y * cell;
      ctx.fillStyle = this.tribes[o].glow + "0.4)";
      ctx.fillRect(px, py, cell, cell);
      const b = this.build[i];
      if (b === 1) {
        ctx.fillStyle = "#8b5a2b";
        ctx.fillRect(px + cell * 0.22, py + cell * 0.45, cell * 0.56, cell * 0.42);
        ctx.fillStyle = "#d9534f";
        ctx.beginPath();
        ctx.moveTo(px + cell * 0.5, py + cell * 0.16);
        ctx.lineTo(px + cell * 0.88, py + cell * 0.5);
        ctx.lineTo(px + cell * 0.12, py + cell * 0.5);
        ctx.closePath(); ctx.fill();
      } else if (b === 2) {
        ctx.fillStyle = "#9aa0a6";
        ctx.fillRect(px + cell * 0.1, py + cell * 0.3, cell * 0.8, cell * 0.5);
        ctx.fillStyle = "rgba(0,0,0,.28)";
        ctx.fillRect(px + cell * 0.1, py + cell * 0.5, cell * 0.8, Math.max(1, cell * 0.09));
      }
    }

    // workers — each one is a real agent you can watch do its job
    this.tribes.forEach((tr) => {
      if (!tr.alive) return;
      tr.workers.forEach(w => this.drawWorker(tr, w, ox, oy, cell));
    });

    this.battles.forEach(b => {
      ctx.fillStyle = `rgba(255,220,120,${b.life * 1.7})`;
      ctx.fillRect(ox + b.x * cell - cell * .3, oy + b.y * cell - cell * .3, cell * 1.6, cell * 1.6);
    });

    // kings
    this.tribes.forEach(tr => {
      const p = this.xy(tr.home);
      const cx = ox + p.x * cell + cell / 2, cy = oy + p.y * cell + cell / 2;
      ctx.save();
      if (tr.alive) {
        const pulse = 1 + Math.sin(performance.now() / 320) * 0.12;
        ctx.strokeStyle = tr.color; ctx.lineWidth = 2.5;
        ctx.shadowColor = tr.color; ctx.shadowBlur = 14;
        ctx.beginPath(); ctx.arc(cx, cy, cell * 1.4 * pulse, 0, 7); ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.font = `${Math.max(13, cell * 1.6)}px system-ui`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.globalAlpha = tr.alive ? 1 : 0.35;
      ctx.fillText(tr.alive ? "👑" : "💀", cx, cy);
      ctx.restore();
    });

    ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 2;
    ctx.strokeRect(ox - 1, oy - 1, w + 2, h + 2);

    const war = this.simT >= CONQUEST_AT;
    ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    ctx.font = "900 14px Orbitron, system-ui";
    ctx.fillStyle = war ? "#ff6b6b" : "#4ade80";
    ctx.shadowColor = "#000"; ctx.shadowBlur = 8;
    ctx.fillText(`${E.emoji} ${eraName(this.era)} · ${war ? t("warPhase") : t("growthPhase")}`, ox + w / 2, oy - 12);
    ctx.shadowBlur = 0;
    const barW = Math.min(340, w), bx = ox + w / 2 - barW / 2, by = oy + h + 12;
    ctx.fillStyle = "rgba(255,255,255,.15)";
    ctx.beginPath(); ctx.roundRect(bx, by, barW, 7, 4); ctx.fill();
    ctx.fillStyle = war ? "#ff6b6b" : "#4ade80";
    ctx.beginPath(); ctx.roundRect(bx, by, barW * Math.min(1, this.simT / SIM_DURATION), 7, 4); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.45)";
    ctx.fillRect(bx + barW * (CONQUEST_AT / SIM_DURATION) - 1, by - 3, 2, 13);

    // discovery toasts — so a milestone is not missed in the scrolling log
    this.toasts.slice(-4).forEach((tsl, i) => {
      const a = Math.min(1, tsl.life / 0.5);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.font = "800 13px system-ui"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
      const tw = ctx.measureText(tsl.text).width + 22;
      const tx = ox + w - tw - 12, ty = oy + 14 + i * 30;
      ctx.fillStyle = "rgba(3,0,10,.86)"; ctx.strokeStyle = tsl.color; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(tx, ty, tw, 25, 12); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.fillText(tsl.text, tx + 11, ty + 13);
      ctx.restore();
    });

    // full-width dramatic beat (war starting, a king falling)
    if (this.banner) {
      const a = Math.min(1, this.banner.life / 0.6);
      ctx.save();
      ctx.globalAlpha = a * 0.92;
      ctx.fillStyle = "rgba(3,0,10,.9)";
      ctx.fillRect(ox, oy + h / 2 - 42, w, 84);
      ctx.fillStyle = this.banner.color;
      ctx.fillRect(ox, oy + h / 2 - 42, w, 3);
      ctx.fillRect(ox, oy + h / 2 + 39, w, 3);
      ctx.font = "900 clamp(20px,3.4vw,34px) Orbitron, system-ui";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.shadowColor = this.banner.color; ctx.shadowBlur = 24;
      ctx.fillText(this.banner.text, ox + w / 2, oy + h / 2);
      ctx.restore();
    }
    ctx.restore();
  },
};

/* ---------------- boot ---------------- */
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
window.__civ = { engine, SIM, CHOOSER, SPEC, CONFIRM, loadLearn, DISCOVERIES, TRAITS, ERAS,
  _confirm: (era, specs, cb) => { chosenEra = era; show(null); ui.classList.add("passthrough"); CONFIRM.open(specs, cb || (() => {})); },
  _force: (era, specs) => { show(null); ui.classList.add("passthrough"); SIM.start(era, specs); } };
showIntro();
