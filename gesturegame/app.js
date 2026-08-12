/* ================= AI HAND ARCADE =================
   5 games powered by one hand-tracking AI (MediaPipe, runs 100% on-device):
   - Air Ninja: slice fruit with your fingertip (Time Attack or 3-life Survival)
   - Gesture Battle: rock-paper-scissors vs a pattern-learning AI
   - Hand Snake: your fingertip is a free-moving snake
   - Hand Blast: pinch-drag block puzzle
   - Hand Lab: pinch-craft elements, Infinite-Craft style
================================================== */
import { FilesetResolver, HandLandmarker } from "./vendor/vision_bundle.mjs";

"use strict";

/* ---------------- i18n ---------------- */
const STR = {
  en: {
    langBtn: "BM",
    title: "AI HAND ARCADE",
    tagline: "The camera AI sees your hand. No touching allowed! 🖐️",
    ninjaTitle: "Air Ninja",
    ninjaDesc: "Slice the fruit with your finger — in the air!",
    battleTitle: "Gesture Battle",
    battleDesc: "Rock-paper-scissors vs an AI that learns your mind",
    madeWith: "PWA · AI runs on this device · no internet needed",
    loading: "Waking up the AI brain… 🧠",
    loadingCam: "Turning on the camera… 📷",
    camFail: "Camera blocked! Allow camera access in your browser settings, then reload.",
    aiFail: "Could not load the AI. Reload the page to try again.",
    start: "START ▶",
    back: "MENU",
    again: "PLAY AGAIN ↺",
    calibShow: "Show me your hand! ✋",
    calibHint: "Hold your hand up so the camera can see it clearly",
    calibReady: "Got it! Ready…",
    calibSkip: "Can't see your hand? Start anyway →",
    // ninja
    ninjaHow: "Fruit is flying through the air! 🍉 Move your POINTER FINGER to slice it. Avoid the bombs 💣!",
    score: "Score", time: "Time", combo: "Combo", best: "Best", lives: "Lives",
    debugged: "SYSTEM DEBUGGED!",
    newBest: "🎉 NEW HIGH SCORE!",
    ninjaRanks: ["🥷 FRUIT NINJA MASTER", "⚔️ BLADE WARRIOR", "🍃 ROOKIE SLICER"],
    ninjaModeTime: "⏱ TIME ATTACK",
    ninjaModeTimeDesc: "60 seconds on the clock — score as much as you can!",
    ninjaModeLife: "❤️ SURVIVAL",
    ninjaModeLifeDesc: "3 lives, no clock — slicing a bomb costs a life!",
    // battle
    battleHow: "First to 5 wins! Show ✊ ✋ or ✌️ to the camera when I say GO. Warning: my AI brain learns your pattern… 🧠",
    you: "You", ai: "AI",
    show: "SHOW!",
    win: "YOU WIN! 🎉", lose: "AI WINS 🤖", draw: "DRAW 😐",
    roundPraise: "BRILLIANT MOVE! +1 POINT",
    roundRetry: "Good try — read the AI and strike back!",
    roundDraw: "Same move! Get ready for the next round.",
    noHand: "I couldn't see your hand! 👀",
    brainStart: "🧠 AI brain: watching you…",
    brainLearn: (g, c) => `🧠 AI brain: I predicted you'd play ${g} (${c}% sure)`,
    battleWinYou: "YOU BEAT THE AI!",
    battleWinAi: "THE AI READ YOUR MIND!",
    battleMsgYou: "Impressive! You stayed unpredictable. That's the only way to beat a pattern-learning AI!",
    battleMsgAi: "Humans always fall into patterns — and AI is built to find patterns. That's exactly how real AI learns!",
    predicted: (p) => `AI predicted your moves ${p}% of the time`,
    handLost: "Show your full hand inside the camera.",
    // snake
    snakeTitle: "Hand Snake",
    snakeDesc: "Your finger is the snake — eat, grow, survive!",
    snakeHow: "Move your INDEX FINGER to steer the snake 🐍 Eat the glowing food to grow longer. Don't crash into yourself!",
    snakeRanks: ["🐍 SERPENT KING", "🔥 VENOM STRIKER", "🐛 BABY WORM"],
    length: "Length",
    gameOver: "GAME OVER",
    reset: "RESET",
    snakePointer: "Point your index finger inside the grid to steer",
    // blast
    blastTitle: "Hand Blast",
    blastDesc: "Pinch, drag and drop blocks — clear rows to score!",
    blastHow: "Hover over a block, PINCH 👌 to grab it. Drag onto the grid and release to place. Fill a row or column to clear it! 🧱",
    lines: "Lines",
    noMoves: "NO MOVES LEFT!",
    blastRanks: ["🧱 BLOCK MASTER", "⚡ LINE BREAKER", "🔰 STACKER"],
    pinchHint: "👌 PINCH to grab · release to place",
    pinchOpen: "OPEN",
    pinchClosed: "PINCHED",
    // lab
    labTitle: "Hand Lab",
    labDesc: "Pinch and combine elements — how many can you discover?",
    labHow: "PINCH 👌 a tag from the library or workbench, then drag it onto another tag to combine. Your library stays open while you experiment!",
    labSlotHint: "PINCH a tag · drag onto another to combine",
    labShelf: "ELEMENT LIBRARY",
    labBook: n => `📖 ${n}`,
    labBookTitle: "Discoveries",
    labDiscovered: (n, total) => `${n} / ${total} discovered`,
    labNew: "✨ NEW DISCOVERY!",
    labClose: "CLOSE",
    labReset: "RESET",
    labRecipes: "RECIPES",
    labRecipesTitle: "Recipe Book",
    labNoRecipes: "Combine elements to record recipes here.",
    labCheatTitle: "All Combination Possibilities",
    labCamera: "ROBOT HAND · pinch to craft",
    labPossibilities: n => `${n} possible recipes`,
  },
  bm: {
    langBtn: "EN",
    title: "ARKED TANGAN AI",
    tagline: "AI kamera nampak tangan anda. Tak boleh sentuh skrin! 🖐️",
    ninjaTitle: "Air Ninja",
    ninjaDesc: "Tetak buah dengan jari — di udara!",
    battleTitle: "Gesture Battle",
    battleDesc: "Batu-kertas-gunting lawan AI yang belajar corak anda",
    madeWith: "PWA · AI berjalan pada peranti ini · tiada internet diperlukan",
    loading: "Mengejutkan otak AI… 🧠",
    loadingCam: "Menghidupkan kamera… 📷",
    camFail: "Kamera disekat! Benarkan akses kamera dalam tetapan pelayar, kemudian muat semula.",
    aiFail: "AI gagal dimuatkan. Muat semula halaman untuk cuba lagi.",
    start: "MULA ▶",
    back: "MENU",
    again: "MAIN LAGI ↺",
    calibShow: "Tunjukkan tangan anda! ✋",
    calibHint: "Angkat tangan anda supaya kamera dapat melihatnya dengan jelas",
    calibReady: "Dapat! Bersedia…",
    calibSkip: "Kamera tak nampak tangan? Mula juga →",
    ninjaHow: "Buah-buahan terbang di udara! 🍉 Gerakkan JARI TELUNJUK untuk menetaknya. Elakkan bom 💣!",
    score: "Skor", time: "Masa", combo: "Combo", best: "Terbaik", lives: "Nyawa",
    debugged: "SISTEM DIBAIKI!",
    newBest: "🎉 REKOD BARU!",
    ninjaRanks: ["🥷 NINJA BUAH", "⚔️ PAHLAWAN PEDANG", "🍃 PEMULA"],
    ninjaModeTime: "⏱ SERANGAN MASA",
    ninjaModeTimeDesc: "60 saat di jam — kumpul skor sebanyak mungkin!",
    ninjaModeLife: "❤️ BERTAHAN",
    ninjaModeLifeDesc: "3 nyawa, tiada jam — tetak bom hilang satu nyawa!",
    battleHow: "Siapa dapat 5 dulu menang! Tunjuk ✊ ✋ atau ✌️ pada kamera bila saya kata GO. Amaran: otak AI saya belajar corak anda… 🧠",
    you: "Anda", ai: "AI",
    show: "TUNJUK!",
    win: "ANDA MENANG! 🎉", lose: "AI MENANG 🤖", draw: "SERI 😐",
    roundPraise: "GERAKAN HEBAT! +1 MATA",
    roundRetry: "Cubaan baik — baca AI dan lawan semula!",
    roundDraw: "Gerakan sama! Bersedia untuk pusingan seterusnya.",
    noHand: "Saya tak nampak tangan anda! 👀",
    brainStart: "🧠 Otak AI: sedang memerhati…",
    brainLearn: (g, c) => `🧠 Otak AI: Saya ramal anda akan tunjuk ${g} (${c}% yakin)`,
    battleWinYou: "ANDA KALAHKAN AI!",
    battleWinAi: "AI BACA FIKIRAN ANDA!",
    battleMsgYou: "Hebat! Anda kekal tidak menentu. Itu saja cara nak kalahkan AI yang belajar corak!",
    battleMsgAi: "Manusia selalu ada corak — dan AI dibina untuk mencari corak. Beginilah cara AI sebenar belajar!",
    predicted: (p) => `AI meramal pergerakan anda ${p}% daripada masa`,
    handLost: "Tunjukkan seluruh tangan di dalam kamera.",
    // snake
    snakeTitle: "Ular Tangan",
    snakeDesc: "Jari anda ialah ular — makan, membesar, bertahan!",
    snakeHow: "Gerakkan JARI TELUNJUK untuk mengawal ular 🐍 Makan makanan bercahaya untuk membesar. Jangan langgar diri sendiri!",
    snakeRanks: ["🐍 RAJA ULAR", "🔥 PENYERANG BISA", "🐛 ULAT KECIL"],
    length: "Panjang",
    gameOver: "TAMAT!",
    reset: "RESET",
    snakePointer: "Tuding jari telunjuk ke dalam grid untuk mengawal",
    // blast
    blastTitle: "Hand Blast",
    blastDesc: "Cubit, seret dan letak blok — kosongkan baris untuk skor!",
    blastHow: "Tuding ke atas blok, CUBIT 👌 untuk mengambilnya. Seret ke grid dan lepaskan untuk meletakkan. Penuhkan baris atau lajur untuk mengosongkannya! 🧱",
    lines: "Baris",
    noMoves: "TIADA LANGKAH LAGI!",
    blastRanks: ["🧱 TUAN BLOK", "⚡ PEMECAH BARIS", "🔰 PENYUSUN"],
    pinchHint: "👌 CUBIT untuk ambil · lepas untuk letak",
    pinchOpen: "BUKA",
    pinchClosed: "DICUBIT",
    // lab
    labTitle: "Hand Lab",
    labDesc: "Cubit dan gabungkan unsur — berapa banyak boleh anda jumpa?",
    labHow: "CUBIT 👌 tag daripada perpustakaan atau meja kerja, kemudian seret ke atas tag lain untuk gabung. Perpustakaan kekal terbuka semasa anda mencuba!",
    labSlotHint: "CUBIT tag · seret ke atas tag lain untuk gabung",
    labShelf: "PERPUSTAKAAN UNSUR",
    labBook: n => `📖 ${n}`,
    labBookTitle: "Penemuan",
    labDiscovered: (n, total) => `${n} / ${total} dijumpai`,
    labNew: "✨ PENEMUAN BAHARU!",
    labClose: "TUTUP",
    labReset: "RESET",
    labRecipes: "RESIPI",
    labRecipesTitle: "Buku Resipi",
    labNoRecipes: "Gabungkan unsur untuk merekod resipi di sini.",
    labCheatTitle: "Semua Kemungkinan Gabungan",
    labCamera: "TANGAN ROBOT · cubit untuk mencipta",
    labPossibilities: n => `${n} resipi yang mungkin`,
  },
};
let lang = localStorage.getItem("ha-lang") || "en";
const t = (k) => STR[lang][k];

/* ---------------- camera background toggle ----------------
   Some games can hide the live camera feed entirely and render a
   procedural robot hand from the landmarks instead (same idea as Hand
   Lab). Whether that's on is a per-device preference; whether the CURRENT
   game supports it at all is a per-game flag checked at start time. */
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
function chord(freqs, dur = 0.35, type = "triangle", vol = 0.05) {
  freqs.forEach(f => beep(f, dur, type, vol));
}
const sfx = {
  click: () => beep(520, 0.05),
  open: () => { beep(660, 0.05, "sine", 0.05); setTimeout(() => beep(880, 0.07, "sine", 0.045), 45); },
  slice: () => beep(880 + Math.random() * 300, 0.06, "sawtooth", 0.05),
  bomb: () => { beep(120, 0.3, "sawtooth", 0.09); beep(85, 0.22, "square", 0.05); },
  good: () => { beep(660, 0.09); setTimeout(() => beep(880, 0.12), 90); },
  bad: () => beep(160, 0.25, "sawtooth", 0.07),
  count: () => beep(440, 0.1, "sine", 0.07),
  go: () => beep(880, 0.2, "sine", 0.08),
  win: () => {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.16, "triangle", 0.08), i * 130));
    setTimeout(() => chord([1047, 1319, 1568], 0.5, "triangle", 0.05), 520); // land on a full major chord, not just a lone top note
  },
  tick: () => beep(1200, 0.02, "sine", 0.02),
};

/* ---------------- DOM ---------------- */
const ui = document.getElementById("ui");
const cam = document.getElementById("cam");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const homeBtn = document.getElementById("homeBtn");
const camBtn = document.getElementById("camBtn");
const handStatus = document.getElementById("handStatus");
const topbar = document.getElementById("topbar");

function resize() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
resize();
addEventListener("resize", resize);

const el = (html) => { const d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; };
function show(node) {
  ui.innerHTML = "";
  ui.scrollTop = 0; // a new screen always starts at the top, never mid-scroll
  if (node) { ui.appendChild(node); node.classList.add("fade-in"); }
}

/* ---------------- hand engine ---------------- */
const engine = {
  landmarker: null, ready: false, camReady: false,
  hand: null,        // mirrored screen-space landmarks [{x,y}] or null
  norm: null,        // mirrored normalized landmarks
  hands: [], handsNorm: [],
  lastVideoTime: -1, frameUpdated: false, lastSeenAt: 0, frameAt: 0, frameDelta: 0,
  async init(onStatus) {
    if (!this.ready) {
      onStatus(t("loading"));
      const fileset = await FilesetResolver.forVisionTasks("vendor/wasm");
      const options = (delegate) => ({
        baseOptions: { modelAssetPath: "vendor/hand_landmarker.task", delegate },
        runningMode: "VIDEO",
        numHands: 2,
        // A slightly more forgiving entrance threshold helps on phone cameras,
        // while the temporal filter below keeps the cursor calm once tracked.
        minHandDetectionConfidence: 0.50,
        minHandPresenceConfidence: 0.50,
        minTrackingConfidence: 0.48,
      });
      try {
        this.landmarker = await HandLandmarker.createFromOptions(fileset, options("GPU"));
      } catch {
        // Some older booth devices do not expose a compatible WebGL/GPU path.
        this.landmarker = await HandLandmarker.createFromOptions(fileset, options("CPU"));
      }
      this.ready = true;
    }
    if (!this.camReady) {
      onStatus(t("loadingCam"));
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 20 },
          resizeMode: "crop-and-scale",
        },
        audio: false,
      });
      cam.srcObject = stream;
      await new Promise((res) => { cam.onloadedmetadata = res; });
      await cam.play();
      this.camReady = true;
    }
  },
  stopCamera() {
    const stream = cam.srcObject;
    if (stream) stream.getTracks().forEach((track) => track.stop());
    cam.srcObject = null;
    this.camReady = false;
    this.lastVideoTime = -1;
    this.hand = null;
    this.norm = null;
    this.hands = [];
    this.handsNorm = [];
    this.frameUpdated = false;
    this.lastSeenAt = 0;
    this.frameAt = 0;
    this.frameDelta = 0;
    handStatus.classList.remove("seen");
  },
  detect() {
    this.frameUpdated = false;
    if (!this.ready || !this.camReady || cam.readyState < 2) { this.hand = null; return false; }
    if (cam.currentTime === this.lastVideoTime) return false; // same frame, keep previous
    this.lastVideoTime = cam.currentTime;
    this.frameUpdated = true;
    const frameNow = performance.now();
    this.frameDelta = this.frameAt ? Math.min(0.1, Math.max(0.01, (frameNow - this.frameAt) / 1000)) : 0;
    this.frameAt = frameNow;
    const res = this.landmarker.detectForVideo(cam, frameNow);
    if (res.landmarks && res.landmarks.length) {
      // video uses object-fit: cover -> compute the crop mapping
      const vw = cam.videoWidth, vh = cam.videoHeight;
      const scale = Math.max(innerWidth / vw, innerHeight / vh);
      const dw = vw * scale, dh = vh * scale;
      const ox = (innerWidth - dw) / 2, oy = (innerHeight - dh) / 2;
      const rawHands = res.landmarks.map(hand => hand.map(p => ({ x: 1 - p.x, y: p.y, z: p.z })));
      // Keep the same primary hand when two hands cross the camera.
      if (this.norm && rawHands.length > 1) {
        rawHands.sort((a, b) => dist(a[0], this.norm[0]) - dist(b[0], this.norm[0]));
      }
      const raw = rawHands[0];
      if (!this.norm) {
        this.norm = raw;
      } else {
        // Adaptive smoothing: steady hands are filtered strongly, but a quick
        // fingertip movement still feels immediate. This is much less jumpy on
        // lower-light phone cameras than smoothing from wrist motion alone.
        const motion = raw.reduce((sum, p, i) => sum + dist(p, this.norm[i]), 0) / raw.length;
        this.norm = raw.map((p, i) => ({
          // Per-landmark filtering lets thumb/index tips react quickly while
          // the palm remains steady—a better fit for pinch-and-drag games.
          ...(() => {
            const localMotion = dist(p, this.norm[i]);
            const isControlTip = i === 4 || i === 8;
            const alpha = Math.max(isControlTip ? 0.28 : 0.17, Math.min(0.88, (isControlTip ? 0.28 : 0.17) + localMotion * 10 + motion * 2));
            return {
              x: this.norm[i].x + (p.x - this.norm[i].x) * alpha,
              y: this.norm[i].y + (p.y - this.norm[i].y) * alpha,
              z: this.norm[i].z + (p.z - this.norm[i].z) * alpha,
            };
          })(),
        }));
      }
      const toScreen = hand => hand.map(p => ({ x: p.x * dw + ox, y: p.y * dh + oy, z: p.z }));
      this.handsNorm = rawHands;
      this.hands = rawHands.map(toScreen);
      this.hand = toScreen(this.norm);
      this.lastSeenAt = performance.now();
    } else if (performance.now() - this.lastSeenAt > 300) {
      // Ignore a few dropped inference frames so the cursor/sign does not flicker.
      this.hand = null;
      this.norm = null;
      this.hands = [];
      this.handsNorm = [];
    }
    handStatus.classList.toggle("seen", !!this.hand);
    return true;
  },
};

/* Older iPadOS Safari (< 16.4) has no roundRect; without this the whole
   canvas frame throws and the board never draws. */
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    const radius = Math.min(typeof r === "number" ? r : (Array.isArray(r) ? r[0] : 0) || 0, w / 2, h / 2);
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

/* ---------------- hand maths ---------------- */
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
/* Removes dead entries without allocating a new array — Air Ninja calls this
   on 3-4 particle/trail arrays every single frame at 60fps, and .filter()
   there was pure avoidable GC pressure on lower-end tablets. */
function pruneInPlace(arr, keep) {
  let w = 0;
  for (let i = 0; i < arr.length; i++) if (keep(arr[i])) arr[w++] = arr[i];
  arr.length = w;
}
function jointAngle(a, b, c) {
  const abx = a.x - b.x, aby = a.y - b.y;
  const cbx = c.x - b.x, cby = c.y - b.y;
  const den = Math.hypot(abx, aby) * Math.hypot(cbx, cby) || 1e-6;
  return Math.acos(Math.max(-1, Math.min(1, (abx * cbx + aby * cby) / den))) * 180 / Math.PI;
}
function fingerStates(lms) {
  // lms: normalized landmarks. Returns {thumb, index, middle, ring, pinky} booleans + helpers
  const hs = dist(lms[0], lms[9]) || 1e-6;
  const ext = (mcp, pip, tip) =>
    jointAngle(lms[mcp], lms[pip], lms[tip]) > 145 &&
    dist(lms[tip], lms[0]) > dist(lms[pip], lms[0]) * 1.04;
  const thumbStraight = jointAngle(lms[2], lms[3], lms[4]) > 142;
  return {
    hs,
    thumb: thumbStraight && dist(lms[4], lms[5]) / hs > 0.72,
    index: ext(5, 6, 8), middle: ext(9, 10, 12), ring: ext(13, 14, 16), pinky: ext(17, 18, 20),
    pinch: dist(lms[4], lms[8]) / hs,          // thumb-index distance
    midPinch: dist(lms[4], lms[12]) / hs,
    spread: dist(lms[8], lms[12]) / hs,        // index-middle tip distance
    indexOut: dist(lms[8], lms[0]) / hs,
    palmX: (lms[0].x + lms[5].x + lms[17].x) / 3,
    palmY: (lms[0].y + lms[5].y + lms[17].y) / 3,
  };
}
function pinchState() {
  if (!engine.norm || !engine.hand) return null;
  const fingers = fingerStates(engine.norm);
  const thumb = engine.hand[4], index = engine.hand[8];
  return {
    ...fingers,
    thumb,
    index,
    center: { x: (thumb.x + index.x) / 2, y: (thumb.y + index.y) / 2 },
  };
}
function classifyRPS(lms) {
  const f = fingerStates(lms);
  const n = [f.index, f.middle, f.ring, f.pinky].filter(Boolean).length;
  if (n === 0 || (n === 1 && !f.index && !f.middle)) return "rock";
  if (f.index && f.middle && !f.ring && !f.pinky) return "scissors";
  if (n >= 3) return "paper";
  return null;
}
function drawSkeleton(lms, color = "rgba(34,211,238,.9)") {
  if (!lms) return;
  const C = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17]];
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.lineCap = "round";
  ctx.shadowColor = color; ctx.shadowBlur = 10;
  C.forEach(([a, b]) => {
    ctx.beginPath(); ctx.moveTo(lms[a].x, lms[a].y); ctx.lineTo(lms[b].x, lms[b].y); ctx.stroke();
  });
  ctx.fillStyle = "#fff";
  lms.forEach((p, i) => {
    ctx.beginPath(); ctx.arc(p.x, p.y, [4, 8, 12, 16, 20].includes(i) ? 5 : 3, 0, 7); ctx.fill();
  });
  ctx.restore();
}
// A stand-in for the raw camera feed: a stylized mechanical hand rendered
// entirely from the live landmark positions, so it mirrors real hand motion
// without ever showing the actual video.
function drawRobotHand(lms) {
  if (!lms) return;
  const BONES = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20]];
  const PALM = [0, 5, 9, 13, 17];
  ctx.save();
  const cx = PALM.reduce((s, i) => s + lms[i].x, 0) / PALM.length;
  const cy = PALM.reduce((s, i) => s + lms[i].y, 0) / PALM.length;
  ctx.beginPath();
  PALM.forEach((i, idx) => { const p = lms[i]; if (idx === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
  ctx.closePath();
  const plate = ctx.createRadialGradient(cx, cy, 4, cx, cy, 70);
  plate.addColorStop(0, "#94a3b8"); plate.addColorStop(1, "#334155");
  ctx.fillStyle = plate; ctx.strokeStyle = "#0f172a"; ctx.lineWidth = 2;
  ctx.shadowColor = "rgba(34,211,238,.55)"; ctx.shadowBlur = 16;
  ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
  BONES.forEach(([a, b]) => {
    const p1 = lms[a], p2 = lms[b];
    ctx.lineCap = "round";
    ctx.strokeStyle = "#64748b"; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
  });
  lms.forEach((p, i) => {
    const tip = [4, 8, 12, 16, 20].includes(i);
    const r = i === 0 ? 11 : tip ? 6.5 : 8;
    const jg = ctx.createRadialGradient(p.x - 2, p.y - 2, 1, p.x, p.y, r);
    jg.addColorStop(0, tip ? "#67e8f9" : "#e2e8f0"); jg.addColorStop(1, tip ? "#0891b2" : "#475569");
    ctx.fillStyle = jg; ctx.strokeStyle = "#0f172a"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 7); ctx.fill(); ctx.stroke();
    if (tip) {
      ctx.shadowColor = "#22d3ee"; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, 7); ctx.fillStyle = "#ecfeff"; ctx.fill();
      ctx.shadowBlur = 0;
    }
  });
  ctx.restore();
}

/* ---------------- game loop ---------------- */
let activeGame = null; // {onFrame(dt), cleanup()}
let lastT = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - lastT) / 1000);
  lastT = now;
  if (document.body.classList.contains("playing")) {
    try {
      engine.detect();
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      if (activeGame && activeGame.onFrame) activeGame.onFrame(dt);
    } catch (e) { console.error("frame error:", e); }
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function stopGame() {
  if (activeGame && activeGame.cleanup) activeGame.cleanup();
  activeGame = null;
  engine.stopCamera();
  document.body.classList.remove("playing");
  homeBtn.classList.add("hidden");
  camBtn.classList.add("hidden");
  handStatus.classList.add("hidden");
}

/* ---------------- screens ---------------- */
/* ---------------- lightweight booth play-count tracking ----------------
   No server, no external analytics — just a localStorage tally the booth
   operator can peek at by tapping the title 5 times. */
const PLAY_COUNT_KEY = "ha-plays";
function bumpPlayCount(gameKey) {
  let counts = {};
  try { counts = JSON.parse(localStorage.getItem(PLAY_COUNT_KEY) || "{}"); } catch {}
  counts[gameKey] = (counts[gameKey] || 0) + 1;
  localStorage.setItem(PLAY_COUNT_KEY, JSON.stringify(counts));
}
function showPlayStats() {
  let counts = {};
  try { counts = JSON.parse(localStorage.getItem(PLAY_COUNT_KEY) || "{}"); } catch {}
  const labels = { ninja: "🥷 Air Ninja", battle: "✊ Gesture Battle", snake: "🐍 Hand Snake", blast: "🧱 Hand Blast", lab: "🧪 Hand Lab" };
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const rows = Object.keys(labels).map(k => `<div class="stats-row"><span>${labels[k]}</span><b>${counts[k] || 0}</b></div>`).join("");
  const node = el(`<div class="lab-book" id="statsOverlay">
    <div class="lab-book-panel" style="color:var(--text);background:rgba(17,10,32,.95)">
      <h2>📊 Booth Stats</h2>
      <div class="desc">${total} total plays this device</div>
      <div style="margin:16px 0;text-align:left">${rows}</div>
      <button class="btn ghost" id="statsResetBtn" style="font-size:14px;padding:9px 20px">Reset Stats</button>
      <br><button class="btn" id="statsCloseBtn">Close</button>
    </div>
  </div>`);
  node.querySelector("#statsResetBtn").onclick = () => { sfx.click(); localStorage.removeItem(PLAY_COUNT_KEY); node.remove(); showPlayStats(); };
  node.querySelector("#statsCloseBtn").onclick = () => { sfx.click(); node.remove(); };
  document.body.appendChild(node);
}
function menu() {
  stopGame();
  const node = el(`<div style="margin:auto;width:100%">
    <h1 class="arcade" id="arcadeTitle">${t("title")}</h1>
    <div class="tagline">${t("tagline")}</div>
    <div class="cards">
      <div class="card ninja" id="cNinja">
        <div class="emo">🥷</div>
        <div><h3>${t("ninjaTitle")} <span style="font-size:14px">🍉</span></h3><p>${t("ninjaDesc")}</p></div>
      </div>
      <div class="card battle" id="cBattle">
        <div class="emo">✊</div>
        <div><h3>${t("battleTitle")} <span style="font-size:14px">🧠</span></h3><p>${t("battleDesc")}</p></div>
      </div>
      <div class="card snake" id="cSnake">
        <div class="emo">🐍</div>
        <div><h3>${t("snakeTitle")} <span style="font-size:14px">🎮</span></h3><p>${t("snakeDesc")}</p></div>
      </div>
      <div class="card blast" id="cBlast">
        <div class="emo">🧱</div>
        <div><h3>${t("blastTitle")} <span style="font-size:14px">🧩</span></h3><p>${t("blastDesc")}</p></div>
      </div>
      <div class="card lab" id="cLab">
        <div class="emo">🧪</div>
        <div><h3>${t("labTitle")} <span style="font-size:14px">🔬</span></h3><p>${t("labDesc")}</p></div>
      </div>
    </div>
    <div class="made-with">🤖 ${t("madeWith")}</div>
  </div>`);
  node.querySelector("#cNinja").onclick = () => { sfx.open(); intro(NINJA); };
  node.querySelector("#cBattle").onclick = () => { sfx.open(); intro(BATTLE); };
  node.querySelector("#cSnake").onclick = () => { sfx.open(); intro(SNAKE); };
  node.querySelector("#cBlast").onclick = () => { sfx.open(); intro(BLAST); };
  node.querySelector("#cLab").onclick = () => { sfx.open(); intro(LAB); };
  // Secret booth-operator gesture: 5 taps on the title within 3s opens the
  // play-count overlay, out of the way of normal kid usage.
  let titleTaps = 0, titleTapTimer = null;
  node.querySelector("#arcadeTitle").onclick = () => {
    titleTaps++;
    clearTimeout(titleTapTimer);
    titleTapTimer = setTimeout(() => { titleTaps = 0; }, 3000);
    if (titleTaps >= 5) { titleTaps = 0; showPlayStats(); }
  };
  show(node);
}

async function intro(game) {
  // Some games (currently just Air Ninja) offer more than one way to play;
  // they expose a modes() method returning the choices so this stays generic.
  const modes = typeof game.modes === "function" ? game.modes() : null;
  const modeHtml = modes ? `<div class="mode-select" id="modeSelect">${modes.map((m, i) => `
    <button class="mode-btn${i === 0 ? " active" : ""}" data-mode="${m.id}" type="button">
      <span class="mode-label">${m.label}</span><span class="mode-desc">${m.desc}</span>
    </button>`).join("")}</div>` : "";
  const node = el(`<div class="panel">
    <div class="big-emoji">${game.emoji}</div>
    <h2>${t(game.titleKey)}</h2>
    <div class="desc">${t(game.howKey)}</div>
    ${modeHtml}
    <div id="loadArea"></div>
    <button class="btn" id="startBtn">${t("start")}</button>
    <br><button class="btn ghost" id="backBtn" style="font-size:15px;padding:10px 24px">← ${t("back")}</button>
  </div>`);
  if (modes) {
    game.selectedMode = modes[0].id;
    node.querySelectorAll(".mode-btn").forEach(btn => {
      btn.onclick = () => {
        sfx.click();
        node.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        game.selectedMode = btn.dataset.mode;
      };
    });
  }
  node.querySelector("#backBtn").onclick = () => { sfx.click(); menu(); };
  node.querySelector("#startBtn").onclick = async () => {
    sfx.click();
    const startBtn = node.querySelector("#startBtn");
    startBtn.disabled = true; startBtn.style.opacity = 0.4;
    const loadArea = node.querySelector("#loadArea");
    try {
      await engine.init((msg) => {
        loadArea.innerHTML = `<div class="desc" style="color:var(--cyan)">${msg}</div><div class="loader-bar"><i></i></div>`;
      });
    } catch (err) {
      const isCam = String(err.name || err).match(/NotAllowed|NotFound|NotReadable|Security/i);
      loadArea.innerHTML = `<div class="desc" style="color:var(--red)">⚠ ${isCam ? t("camFail") : t("aiFail")}</div>`;
      startBtn.disabled = false; startBtn.style.opacity = 1;
      return;
    }
    document.body.classList.add("playing");
    homeBtn.classList.remove("hidden");
    handStatus.classList.remove("hidden");
    if (game.bgToggle) { camBtn.classList.remove("hidden"); applyCamBg(); } else { camBtn.classList.add("hidden"); }
    await calibrate();
    show(null);
    ui.classList.add("passthrough");
    activeGame = game;
    bumpPlayCount(game.titleKey.replace("Title", ""));
    game.start();
  };
  show(node);
}

/* A booth gets walk-up strangers with zero warm-up: this beat makes sure a
   hand is actually visible to the camera BEFORE the timer/round starts,
   instead of a kid's first few seconds being spent fumbling while a crowd
   watches. Skippable after a few seconds so no one ever gets stuck. */
function calibrate() {
  return new Promise((resolve) => {
    const node = el(`<div class="panel calib-panel">
      <div class="calib-ring"><span id="calibIcon">✋</span></div>
      <h2 id="calibTitle">${t("calibShow")}</h2>
      <div class="desc" id="calibDesc">${t("calibHint")}</div>
      <button class="btn ghost hidden" id="calibSkip" style="font-size:15px;padding:10px 24px">${t("calibSkip")}</button>
    </div>`);
    show(node);
    let seenFrames = 0, done = false;
    const skipBtn = node.querySelector("#calibSkip");
    const finish = () => {
      if (done) return;
      done = true;
      clearInterval(poll);
      clearTimeout(skipTimer);
      resolve();
    };
    skipBtn.onclick = () => { sfx.click(); finish(); };
    const poll = setInterval(() => {
      if (engine.hand) {
        seenFrames++;
        if (seenFrames === 1) {
          node.querySelector("#calibIcon").textContent = "✅";
          node.querySelector("#calibTitle").textContent = t("calibReady");
          node.classList.add("calib-ok");
        }
        if (seenFrames >= 10) { sfx.good(); finish(); } // ~600ms of steady tracking
      } else if (seenFrames > 0) {
        seenFrames = 0;
        node.querySelector("#calibIcon").textContent = "✋";
        node.querySelector("#calibTitle").textContent = t("calibShow");
        node.classList.remove("calib-ok");
      }
    }, 60);
    const skipTimer = setTimeout(() => { skipBtn.classList.remove("hidden"); }, 4000);
  });
}

homeBtn.onclick = () => { sfx.click(); ui.classList.remove("passthrough"); menu(); };

// Applies the current on/off preference to the live <video> feed and the
// toggle button's icon. Only called for games that opt in via bgToggle —
// Hand Lab manages cam visibility itself and never shows this button.
function applyCamBg() {
  cam.style.display = camBgOn ? "" : "none";
  camBtn.textContent = camBgOn ? "📷" : "🤖";
}
camBtn.onclick = () => {
  sfx.click();
  camBgOn = !camBgOn;
  localStorage.setItem("ha-cambg", camBgOn ? "on" : "off");
  applyCamBg();
};

/* ================================================
   GAME 1 : AIR NINJA
================================================ */
const FRUITS = ["🍎", "🍊", "🍋", "🍉", "🍇", "🍓", "🍑", "🥝", "🍍", "🍌"];
const NINJA = {
  emoji: "🥷", titleKey: "ninjaTitle", howKey: "ninjaHow", bgToggle: true,
  objs: [], parts: [], trail: [], score: 0, combo: 0, comboT: 0, timeLeft: 60,
  spawnT: 0, running: false, hud: null, floaties: [], shake: 0, comboBanner: null,
  lastTipAt: 0, noHandSince: 0, mode: "time", selectedMode: "time", lives: 3,

  // Offered on the intro screen: Time Attack (the original 60s clock) or
  // Survival (no clock, 3 lives, a bomb costs one instead of just points).
  modes() {
    return [
      { id: "time", label: t("ninjaModeTime"), desc: t("ninjaModeTimeDesc") },
      { id: "life", label: t("ninjaModeLife"), desc: t("ninjaModeLifeDesc") },
    ];
  },

  start() {
    this.objs = []; this.parts = []; this.trail = []; this.floaties = [];
    this.mode = this.selectedMode === "life" ? "life" : "time";
    this.score = 0; this.combo = 0; this.timeLeft = 60; this.lives = 3; this.spawnT = 0.5; this.shake = 0;
    this.lastTipAt = 0; this.noHandSince = 0; this.running = true;
    const secondStat = this.mode === "life"
      ? `<div class="stat"><div class="lbl">${t("lives")}</div><div class="num pink" id="nLives">❤️❤️❤️</div></div>`
      : `<div class="stat"><div class="lbl">${t("time")}</div><div class="num amber" id="nTime">60</div></div>`;
    this.hud = el(`<div class="hud">
      <div class="stat"><div class="lbl">${t("score")}</div><div class="num cyan" id="nScore">0</div></div>
      ${secondStat}
      <div class="stat"><div class="lbl">${t("combo")}</div><div class="num pink" id="nCombo">x1</div></div>
    </div>`);
    document.body.appendChild(this.hud);
    const go = el(`<div class="center-pop"><div class="huge">GO!</div></div>`);
    document.body.appendChild(go); sfx.go();
    setTimeout(() => go.remove(), 900);
  },
  cleanup() {
    if (this.hud) this.hud.remove();
    if (this.comboBanner) this.comboBanner.remove();
    document.querySelectorAll(".center-pop,.impact-flash").forEach(n => n.remove());
    this.running = false;
  },

  // How far into the round we are, 0..1, used to ramp difficulty and visual
  // intensity the same way regardless of which mode is driving the round.
  progress() {
    return this.mode === "time" ? (60 - this.timeLeft) / 60 : Math.min(1, this.score / 500);
  },

  spawn() {
    const isBomb = Math.random() < 0.16;
    const x = 60 + Math.random() * (innerWidth - 120);
    this.objs.push({
      emoji: isBomb ? "💣" : FRUITS[Math.floor(Math.random() * FRUITS.length)],
      bomb: isBomb,
      x, y: innerHeight + 60,
      vx: (innerWidth / 2 - x) * (0.3 + Math.random() * 0.5) / 100 * 60,
      vy: -(innerHeight * (0.95 + Math.random() * 0.35)),
      r: 34 + Math.random() * 14,
      rot: Math.random() * 6, vrot: -2 + Math.random() * 4,
      sliced: false, age: 0,
    });
  },

  onFrame(dt) {
    if (!this.running) return;
    /* timer — Survival mode has no clock, it ends when lives run out */
    if (this.mode === "time") {
      this.timeLeft -= dt;
      if (this.timeLeft <= 0) return this.end();
      this.hud.querySelector("#nTime").textContent = Math.ceil(this.timeLeft);
    }
    this.shake = Math.max(0, this.shake - dt * 34);
    ctx.save();
    if (this.shake > 0) ctx.translate((Math.random() - .5) * this.shake, (Math.random() - .5) * this.shake);

    if (!camBgOn) { ctx.fillStyle = "#0b0518"; ctx.fillRect(0, 0, innerWidth, innerHeight); }

    /* animated speed lines make the camera view feel like an arcade arena */
    ctx.save();
    ctx.globalAlpha = .12 + this.progress() * .1;
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 2;
    for (let i = 0; i < 7; i++) {
      const y = ((performance.now() * (.08 + i * .01)) + i * 137) % (innerHeight + 180) - 90;
      ctx.beginPath();
      ctx.moveTo(-30, y);
      ctx.lineTo(innerWidth * .28, y - 100);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(innerWidth + 30, y + 40);
      ctx.lineTo(innerWidth * .72, y - 60);
      ctx.stroke();
    }
    ctx.restore();

    if (!camBgOn && engine.hand) drawRobotHand(engine.hand);

    /* spawn — speeds up as the round progresses */
    this.spawnT -= dt;
    if (this.spawnT <= 0) {
      const wave = 1 + Math.floor(Math.random() * (this.progress() > .5 ? 3 : 2));
      for (let i = 0; i < wave; i++) setTimeout(() => this.running && this.spawn(), i * 140);
      this.spawnT = this.progress() > .67 ? 0.75 : this.progress() > .33 ? 0.95 : 1.2;
    }

    /* finger trail */
    const G = innerHeight * 1.1;
    let tip = null;
    if (engine.hand) {
      tip = engine.hand[8];
      const last = this.trail[this.trail.length - 1];
      const now = performance.now();
      // Add one cursor point per real camera movement. Repeated animation frames
      // previously hid slow swipes because the final segment had zero length.
      if (!last || now - this.lastTipAt > 180 || dist(last, tip) > 1.5) {
        if (last && now - this.lastTipAt > 180) this.trail = [];
        this.trail.push({ x: tip.x, y: tip.y, t: now });
        this.lastTipAt = now;
      }
    }
    const nowT = performance.now();
    pruneInPlace(this.trail, p => nowT - p.t < 260);

    /* physics + draw objects */
    ctx.font = "40px sans-serif";
    this.objs.forEach(o => {
      o.age += dt; o.vy += G * dt; o.x += o.vx * dt; o.y += o.vy * dt; o.rot += o.vrot * dt;
      ctx.save();
      ctx.translate(o.x, o.y); ctx.rotate(o.rot * 0.15);
      const pulse = 1 + Math.sin(o.age * 8) * .045;
      ctx.scale(pulse, pulse);
      ctx.font = `${o.r * 2}px sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      if (o.bomb) { ctx.shadowColor = "#f43f5e"; ctx.shadowBlur = 18; }
      ctx.fillText(o.emoji, 0, 0);
      ctx.restore();
    });
    pruneInPlace(this.objs, o => o.y < innerHeight + 120 && !o.sliced);

    /* slicing */
    if (this.trail.length >= 2) {
      const a = this.trail[this.trail.length - 2], b = this.trail[this.trail.length - 1];
      const speed = dist(a, b);
      if (speed > 3.5) {
        this.objs.forEach(o => {
          if (o.sliced) return;
          // distance from segment ab to center o
          const dx = b.x - a.x, dy = b.y - a.y;
          const len2 = dx * dx + dy * dy || 1e-6;
          let u = ((o.x - a.x) * dx + (o.y - a.y) * dy) / len2;
          u = Math.max(0, Math.min(1, u));
          const px = a.x + u * dx, py = a.y + u * dy;
          // Generous fingertip halo compensates for camera latency without
          // letting the palm or other fingers trigger a hit.
          if (Math.hypot(o.x - px, o.y - py) < o.r + 24) this.slice(o);
        });
      }
    }

    /* combo decay */
    this.comboT -= dt;
    if (this.comboT <= 0 && this.combo > 0) { this.combo = 0; this.hud.querySelector("#nCombo").textContent = "x1"; }

    /* particles */
    this.parts.forEach(p => {
      if (!p.ring) p.vy += 600 * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      ctx.globalAlpha = Math.max(0, p.life * 2);
      if (p.ring) {
        p.size += 260 * dt;
        ctx.strokeStyle = p.color; ctx.lineWidth = Math.max(1, 8 * p.life);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.stroke();
      } else if (p.emoji) {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot += p.vrot * dt);
        ctx.font = `${p.size}px sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(p.emoji, 0, 0); ctx.restore();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
    });
    pruneInPlace(this.parts, p => p.life > 0);

    /* score floaties */
    this.floaties.forEach(f => {
      f.y -= 60 * dt; f.life -= dt;
      ctx.globalAlpha = Math.max(0, f.life);
      ctx.font = "bold 26px sans-serif"; ctx.textAlign = "center";
      ctx.fillStyle = f.color; ctx.shadowColor = f.color; ctx.shadowBlur = 12;
      ctx.fillText(f.text, f.x, f.y);
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    });
    pruneInPlace(this.floaties, f => f.life > 0);

    /* draw trail (comet) */
    if (this.trail.length >= 2) {
      ctx.save();
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      for (let i = 1; i < this.trail.length; i++) {
        const p0 = this.trail[i - 1], p1 = this.trail[i];
        const age = (nowT - p1.t) / 260;
        ctx.strokeStyle = `rgba(34,211,238,${1 - age})`;
        ctx.lineWidth = 12 * (1 - age) + 2;
        ctx.shadowColor = "#22d3ee"; ctx.shadowBlur = 16;
        ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
      }
      ctx.restore();
    }
    if (tip) {
      this.noHandSince = 0;
      ctx.save();
      ctx.strokeStyle = "rgba(34,211,238,.7)";
      ctx.lineWidth = 3;
      ctx.fillStyle = "#fff"; ctx.shadowColor = "#22d3ee"; ctx.shadowBlur = 24;
      ctx.beginPath(); ctx.arc(tip.x, tip.y, 22 + Math.sin(nowT / 90) * 2, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.arc(tip.x, tip.y, 10, 0, 7); ctx.fill();
      ctx.restore();
    } else {
      // Same "show your hand" grace-period treatment as the other games —
      // brief drops stay silent, but a real loss gets an explicit hint
      // instead of the player wondering why nothing is slicing.
      this.noHandSince = this.noHandSince || nowT;
      if (nowT - this.noHandSince > 500) {
        ctx.save();
        ctx.font = "800 20px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(11,5,24,.7)";
        ctx.beginPath(); ctx.roundRect(innerWidth / 2 - 140, innerHeight / 2 - 24, 280, 48, 24); ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.fillText(t("handLost"), innerWidth / 2, innerHeight / 2);
        ctx.restore();
      }
    }
    ctx.restore();
  },

  showCombo(mult) {
    if (this.comboBanner) this.comboBanner.remove();
    this.comboBanner = el(`<div class="combo-burst">
      <span>${this.combo} HIT STREAK</span>
      <strong>x${mult} COMBO!</strong>
    </div>`);
    const banner = this.comboBanner;
    document.body.appendChild(banner);
    setTimeout(() => {
      banner.remove();
      if (this.comboBanner === banner) this.comboBanner = null;
    }, 900);
  },

  impact(color) {
    const flash = el(`<div class="impact-flash" style="--impact:${color}"></div>`);
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 280);
  },

  slice(o) {
    o.sliced = true;
    if (o.bomb) {
      sfx.bomb();
      this.score = Math.max(0, this.score - 20);
      this.combo = 0;
      this.shake = 22;
      this.impact("#f43f5e");
      this.hud.querySelector("#nCombo").textContent = "x1";
      this.floaties.push({ x: o.x, y: o.y, text: "-20 💥", color: "#f43f5e", life: 1 });
      for (let i = 0; i < 22; i++) this.parts.push({
        x: o.x, y: o.y, vx: -350 + Math.random() * 700, vy: -420 + Math.random() * 500,
        size: 3 + Math.random() * 6, color: ["#f43f5e", "#fbbf24", "#ffffff"][i % 3], life: 0.5 + Math.random() * 0.4,
      });
      if (this.mode === "life") {
        this.lives = Math.max(0, this.lives - 1);
        const livesEl = this.hud.querySelector("#nLives");
        if (livesEl) livesEl.textContent = "❤️".repeat(this.lives) + "🖤".repeat(3 - this.lives);
        if (this.lives <= 0) {
          this.hud.querySelector("#nScore").textContent = this.score;
          return this.end();
        }
      }
    } else {
      sfx.slice();
      this.combo++; this.comboT = 1.1;
      const mult = Math.min(5, 1 + Math.floor(this.combo / 3));
      const pts = 10 * mult;
      this.score += pts;
      this.shake = Math.min(13, 3 + mult * 2);
      this.hud.querySelector("#nCombo").textContent = `x${mult} · ${this.combo}`;
      this.hud.querySelector("#nCombo").classList.remove("score-punch");
      void this.hud.querySelector("#nCombo").offsetWidth;
      this.hud.querySelector("#nCombo").classList.add("score-punch");
      if (this.combo % 3 === 0) {
        this.showCombo(mult);
        this.impact(mult >= 4 ? "#ec4899" : "#22d3ee");
      }
      this.floaties.push({ x: o.x, y: o.y, text: "+" + pts, color: "#a3e635", life: 0.9 });
      this.parts.push({ x: o.x, y: o.y, vx: 0, vy: 0, size: 12, ring: true, color: "#22d3ee", life: .42 });
      // two emoji halves fly apart + green splat
      for (const dir of [-1, 1]) this.parts.push({
        x: o.x, y: o.y, vx: dir * (120 + Math.random() * 160), vy: -180 + Math.random() * 120,
        size: o.r, emoji: o.emoji, rot: 0, vrot: dir * 6, life: 0.55,
      });
      for (let i = 0; i < 10; i++) this.parts.push({
        x: o.x, y: o.y, vx: -260 + Math.random() * 520, vy: -350 + Math.random() * 400,
        size: 2 + Math.random() * 5, color: ["#a3e635", "#22d3ee", "#ffffff"][i % 3], life: 0.4 + Math.random() * 0.35,
      });
    }
    this.hud.querySelector("#nScore").textContent = this.score;
  },

  end() {
    this.running = false;
    sfx.win();
    const best = Math.max(this.score, +(localStorage.getItem("ha-ninja-best") || 0));
    const isNew = this.score >= best && this.score > 0;
    localStorage.setItem("ha-ninja-best", best);
    const rank = this.score >= 400 ? 0 : this.score >= 200 ? 1 : 2;
    if (this.hud) this.hud.remove();
    ui.classList.remove("passthrough");
    const node = el(`<div class="panel">
      <div class="big-emoji">🏆</div>
      <h2>${t("debugged")}</h2>
      <div class="score-line">${this.score}</div>
      <div class="result-rank">${t("ninjaRanks")[rank]}</div>
      ${isNew ? `<div class="desc" style="color:var(--amber)">${t("newBest")}</div>` : ""}
      <div class="best-line">${t("best")}: ${best}</div>
      <button class="btn" id="againBtn">${t("again")}</button>
      <br><button class="btn ghost" id="menuBtn" style="font-size:15px;padding:10px 24px">← ${t("back")}</button>
    </div>`);
    node.querySelector("#againBtn").onclick = () => { sfx.click(); show(null); ui.classList.add("passthrough"); this.start(); };
    node.querySelector("#menuBtn").onclick = () => { sfx.click(); menu(); };
    show(node);
  },
};

/* ================================================
   GAME 2 : GESTURE BATTLE (with mind-reading AI)
================================================ */
const RPS_EMO = { rock: "✊", paper: "✋", scissors: "✌️" };
const BEATS = { rock: "paper", paper: "scissors", scissors: "rock" };
const BATTLE = {
  emoji: "🧠", titleKey: "battleTitle", howKey: "battleHow", bgToggle: true,
  you: 0, ai: 0, history: [], trans: {}, predHits: 0, predTotal: 0,
  state: "idle", samples: [], arena: null, pop: null, timers: [],

  start() {
    this.you = 0; this.ai = 0; this.history = []; this.trans = {}; this.predHits = 0; this.predTotal = 0;
    this.state = "countdown"; this.timers = [];
    this.arena = el(`<div class="arena">
      <div class="brain-box" id="brainBox">${t("brainStart")}</div>
      <div class="vs-row">
        <div class="fighter" id="fYou"><div class="who">${t("you")}</div><div class="hand" id="hYou">❔</div><div class="pts" id="pYou">0</div></div>
        <div class="vs">VS</div>
        <div class="fighter" id="fAi"><div class="who">🤖 ${t("ai")}</div><div class="hand" id="hAi">❔</div><div class="pts" id="pAi">0</div></div>
      </div>
    </div>`);
    document.body.appendChild(this.arena);
    this.pop = el(`<div class="center-pop"><div class="huge" id="popBig"></div><div class="word" id="popWord"></div></div>`);
    document.body.appendChild(this.pop);
    this.round();
  },
  cleanup() {
    this.timers.forEach(clearTimeout);
    if (this.arena) this.arena.remove();
    if (this.pop) this.pop.remove();
    this.state = "idle";
  },
  later(fn, ms) { this.timers.push(setTimeout(fn, ms)); },
  celebrateRound() {
    for (let i = 0; i < 14; i++) {
      const spark = el(`<span class="round-spark">${["✨", "⭐", "🎉"][i % 3]}</span>`);
      spark.style.setProperty("--angle", `${i * 27}deg`);
      this.pop.appendChild(spark);
    }
  },

  predict() {
    // order-2 then order-1 then global frequency
    const h = this.history;
    const tryKey = (key, table) => {
      const c = table[key];
      if (!c) return null;
      const total = c.rock + c.paper + c.scissors;
      if (total < 1) return null;
      const bestMove = ["rock", "paper", "scissors"].reduce((a, b) => (c[a] >= c[b] ? a : b));
      return { move: bestMove, conf: Math.round((c[bestMove] / total) * 100) };
    };
    if (h.length >= 2) {
      const p2 = tryKey(h.slice(-2).join(","), this.trans);
      if (p2 && p2.conf > 40) return p2;
    }
    if (h.length >= 1) {
      const p1 = tryKey(h[h.length - 1], this.trans);
      if (p1) return p1;
    }
    if (h.length >= 3) {
      const c = { rock: 0, paper: 0, scissors: 0 };
      h.forEach(m => c[m]++);
      const bestMove = ["rock", "paper", "scissors"].reduce((a, b) => (c[a] >= c[b] ? a : b));
      return { move: bestMove, conf: Math.round((c[bestMove] / h.length) * 100) };
    }
    const moves = ["rock", "paper", "scissors"];
    return { move: moves[Math.floor(Math.random() * 3)], conf: 33 };
  },
  learn(move) {
    const h = this.history;
    if (h.length >= 1) {
      const k1 = h[h.length - 1];
      this.trans[k1] = this.trans[k1] || { rock: 0, paper: 0, scissors: 0 };
      this.trans[k1][move]++;
    }
    if (h.length >= 2) {
      const k2 = h.slice(-2).join(",");
      this.trans[k2] = this.trans[k2] || { rock: 0, paper: 0, scissors: 0 };
      this.trans[k2][move]++;
    }
    h.push(move);
  },

  round() {
    if (this.state === "idle") return;
    this.prediction = this.predict();
    this.aiMove = BEATS[this.prediction.move]; // counter the predicted player move
    this.arena.querySelector("#hYou").textContent = "❔";
    this.arena.querySelector("#hAi").textContent = "❔";
    this.arena.querySelectorAll(".fighter").forEach(f => f.classList.remove("winner"));
    const big = this.pop.querySelector("#popBig"), word = this.pop.querySelector("#popWord");
    this.pop.className = "center-pop";
    this.pop.querySelectorAll(".round-spark").forEach(spark => spark.remove());
    word.textContent = "";
    let n = 3;
    const step = () => {
      if (this.state === "idle") return;
      if (n > 0) {
        big.textContent = n; big.style.animation = "none"; void big.offsetWidth; big.style.animation = "";
        sfx.count(); n--;
        this.later(step, 750);
      } else {
        big.textContent = "";
        word.textContent = "✊ ✋ ✌️ " + t("show");
        sfx.go();
        this.samples = [];
        this.state = "capture";
        this.later(() => this.resolve(), 1100);
      }
    };
    this.state = "countdown";
    step();
  },

  onFrame() {
    if (!camBgOn) {
      ctx.fillStyle = "#0b0518"; ctx.fillRect(0, 0, innerWidth, innerHeight);
      drawRobotHand(engine.hand);
    } else {
      drawSkeleton(engine.hand);
    }
    if (this.state === "capture" && engine.norm) {
      const g = classifyRPS(engine.norm);
      if (g) this.samples.push(g);
    }
  },

  resolve() {
    if (this.state === "idle") return;
    this.state = "reveal";
    const word = this.pop.querySelector("#popWord");
    if (!this.samples.length) {
      this.pop.className = "center-pop battle-result no-hand-result";
      this.pop.querySelector("#popBig").textContent = "👀";
      word.textContent = t("noHand");
      sfx.bad();
      this.later(() => this.round(), 2300);
      return;
    }
    const counts = {};
    this.samples.forEach(s => counts[s] = (counts[s] || 0) + 1);
    const player = Object.keys(counts).reduce((a, b) => (counts[a] >= counts[b] ? a : b));

    // honest bookkeeping: prediction was made BEFORE seeing the move
    this.predTotal++;
    if (player === this.prediction.move) this.predHits++;
    this.arena.querySelector("#brainBox").textContent =
      t("brainLearn")(RPS_EMO[this.prediction.move], this.prediction.conf) +
      (player === this.prediction.move ? " ✔" : " ✘");
    this.learn(player);

    this.arena.querySelector("#hYou").textContent = RPS_EMO[player];
    this.arena.querySelector("#hAi").textContent = RPS_EMO[this.aiMove];

    let msg, detail, resultClass;
    if (player === this.aiMove) {
      msg = t("draw"); detail = t("roundDraw"); resultClass = "draw-result";
      this.pop.querySelector("#popBig").textContent = "EVEN";
    }
    else if (BEATS[player] === this.aiMove) {
      this.ai++; msg = t("lose"); detail = t("roundRetry"); resultClass = "ai-result";
      this.pop.querySelector("#popBig").textContent = "AI +1";
      sfx.bad(); this.arena.querySelector("#fAi").classList.add("winner");
    }
    else {
      this.you++; msg = t("win"); detail = t("roundPraise"); resultClass = "player-result";
      this.pop.querySelector("#popBig").textContent = "+1";
      sfx.good(); this.arena.querySelector("#fYou").classList.add("winner");
      this.celebrateRound();
    }
    this.pop.className = `center-pop battle-result ${resultClass}`;
    word.textContent = `${msg}\n${detail}`;
    this.arena.querySelector("#pYou").textContent = this.you;
    this.arena.querySelector("#pAi").textContent = this.ai;

    if (this.you >= 5 || this.ai >= 5) { this.later(() => this.end(), 3000); }
    else this.later(() => this.round(), 3200);
  },

  end() {
    const youWon = this.you > this.ai;
    sfx.win();
    const acc = this.predTotal ? Math.round((this.predHits / this.predTotal) * 100) : 0;
    this.cleanup();
    this.state = "idle";
    activeGame = this; // keep skeleton off; ui shown
    ui.classList.remove("passthrough");
    const node = el(`<div class="panel">
      <div class="big-emoji">${youWon ? "🏆" : "🤖"}</div>
      <h2>${youWon ? t("battleWinYou") : t("battleWinAi")}</h2>
      <div class="score-line">${this.you} : ${this.ai}</div>
      <div class="desc" style="color:var(--cyan)">🧠 ${t("predicted")(acc)}</div>
      <div class="desc">${youWon ? t("battleMsgYou") : t("battleMsgAi")}</div>
      <button class="btn" id="againBtn">${t("again")}</button>
      <br><button class="btn ghost" id="menuBtn" style="font-size:15px;padding:10px 24px">← ${t("back")}</button>
    </div>`);
    node.querySelector("#againBtn").onclick = () => { sfx.click(); show(null); ui.classList.add("passthrough"); this.start(); };
    node.querySelector("#menuBtn").onclick = () => { sfx.click(); menu(); };
    show(node);
  },
};

/* ================================================
   GAME 3 : HAND SNAKE
================================================ */
/* Free-movement snake: the head IS the smoothed fingertip position every
   frame — there is no grid tick to fall behind on, so it can never "outrun"
   detection the way a fixed-speed grid step could. The body is a rope of
   recent head positions, trimmed to a length budget that grows on each food. */
const SNAKE = {
  emoji: "🐍", titleKey: "snakeTitle", howKey: "snakeHow", bgToggle: true,
  head: null, dir: { x: 1, y: 0 }, path: [], budget: 0, thickness: 22,
  score: 0, food: null, tracking: false, field: null, bg: null,
  hud: null, resetBtn: null, running: false,

  start() {
    this.cleanup();
    const safeTop = 122, safeBottom = 76;
    const width = Math.max(260, Math.min(620, innerWidth - 28));
    const height = Math.max(260, Math.min(620, innerHeight - safeTop - safeBottom));
    this.field = { x: Math.round((innerWidth - width) / 2), y: Math.round(safeTop + Math.max(0, (innerHeight - safeTop - safeBottom - height) / 2)), width, height };
    this.thickness = Math.max(16, Math.min(30, Math.min(width, height) / 16));
    this.segUnit = this.thickness * 2.6;
    this.head = { x: this.field.x + width / 2, y: this.field.y + height / 2 };
    this.path = [{ ...this.head }];
    this.dir = { x: 1, y: 0 };
    this.budget = this.segUnit * 3; // starts at "length 3" to match the old game's feel
    this.score = 0; this.tracking = false; this.running = true;
    this.food = this.newFood();
    this.buildBackground();
    this.hud = el(`<div class="hud">
      <div class="stat"><div class="lbl">${t("score")}</div><div class="num cyan" id="sScore">0</div></div>
      <div class="stat"><div class="lbl">${t("length")}</div><div class="num lime" id="sLength">3</div></div>
    </div>`);
    this.resetBtn = el(`<button class="reset-btn" type="button">↺ ${t("reset")}</button>`);
    this.resetBtn.onclick = () => { sfx.click(); this.start(); };
    document.body.append(this.hud, this.resetBtn);
  },

  cleanup() {
    this.hud?.remove(); this.resetBtn?.remove();
    this.hud = null; this.resetBtn = null; this.running = false; this.bg = null;
  },

  /* The arena frame never changes during a run, so it is rendered once into
     an offscreen canvas and blitted — no grid lines this time, since the
     snake is no longer bound to a grid. */
  buildBackground() {
    const pad = 14;
    const dpr = Math.min(2, devicePixelRatio || 1);
    const c = document.createElement("canvas");
    c.width = Math.ceil((this.field.width + pad * 2) * dpr);
    c.height = Math.ceil((this.field.height + pad * 2) * dpr);
    const g = c.getContext("2d");
    g.scale(dpr, dpr);
    g.fillStyle = "rgba(7,14,35,.52)";
    g.strokeStyle = "rgba(34,211,238,.72)";
    g.lineWidth = 2;
    g.shadowColor = "#22d3ee"; g.shadowBlur = 16;
    g.beginPath(); g.roundRect(pad - 9, pad - 9, this.field.width + 18, this.field.height + 18, 22);
    g.fill(); g.stroke();
    this.bg = { canvas: c, pad, w: this.field.width + pad * 2, h: this.field.height + pad * 2 };
  },

  newFood() {
    const margin = this.thickness * 1.6;
    for (let attempt = 0; attempt < 20; attempt++) {
      const p = {
        x: this.field.x + margin + Math.random() * (this.field.width - margin * 2),
        y: this.field.y + margin + Math.random() * (this.field.height - margin * 2),
      };
      if (!this.head || Math.hypot(p.x - this.head.x, p.y - this.head.y) > this.thickness * 4) return p;
    }
    return { x: this.field.x + this.field.width / 2, y: this.field.y + this.field.height / 2 };
  },

  /* Keep only as much trailing path as the current length budget allows —
     this is what makes the tail "follow" at a fixed rope length instead of
     recording an ever-growing history. */
  trimPath() {
    let acc = 0;
    for (let i = this.path.length - 1; i > 0; i--) {
      acc += dist(this.path[i], this.path[i - 1]);
      if (acc > this.budget) { this.path.splice(0, i); return; }
    }
  },

  onFrame(dt) {
    if (!this.running) return;
    const field = this.field;
    const tipRaw = engine.hand?.[8] || null;

    if (tipRaw) {
      const m = this.thickness / 2;
      const clampedX = Math.max(field.x + m, Math.min(field.x + field.width - m, tipRaw.x));
      const clampedY = Math.max(field.y + m, Math.min(field.y + field.height - m, tipRaw.y));
      // A very light ease removes camera micro-jitter without adding lag —
      // there's no grid tick to hide behind now, the head really is the
      // fingertip, so this has to stay responsive even during a fast swipe.
      const k = 1 - Math.pow(1e-7, dt);
      if (!this.tracking) { this.head = { x: clampedX, y: clampedY }; }
      else { this.head.x += (clampedX - this.head.x) * k; this.head.y += (clampedY - this.head.y) * k; }
      this.tracking = true;

      const last = this.path[this.path.length - 1];
      if (!last || dist(this.head, last) > 3) {
        if (last) {
          const dx = this.head.x - last.x, dy = this.head.y - last.y;
          const len = Math.hypot(dx, dy) || 1;
          this.dir = { x: dx / len, y: dy / len };
        }
        this.path.push({ x: this.head.x, y: this.head.y });
        this.trimPath();

        /* food */
        if (dist(this.head, this.food) < this.thickness * .85) {
          this.score += 10; this.budget += this.segUnit; sfx.good();
          this.food = this.newFood();
          const score = this.hud?.querySelector("#sScore"), length = this.hud?.querySelector("#sLength");
          if (score) { score.textContent = this.score; score.classList.remove("score-punch"); void score.offsetWidth; score.classList.add("score-punch"); }
          if (length) length.textContent = Math.round(this.budget / this.segUnit);
        }

        /* self-collision: skip a short arc right behind the head (that's
           just the neck, always close) then check the rest of the trail. */
        const skipArc = this.thickness * 3.6, hitR = this.thickness * .5;
        let acc = 0, cut = 0;
        for (let i = this.path.length - 1; i > 0; i--) {
          acc += dist(this.path[i], this.path[i - 1]);
          if (acc > skipArc) { cut = i; break; }
        }
        for (let j = 0; j < cut; j++) {
          if (dist(this.head, this.path[j]) < hitR) { this.end(); return; }
        }
      }
    } else {
      this.tracking = false; // hand lost: freeze in place rather than crash
    }

    const now = performance.now();
    ctx.save();
    if (camBgOn) {
      ctx.fillStyle = "rgba(5,8,28,.22)"; ctx.fillRect(0, 0, innerWidth, innerHeight);
    } else {
      ctx.fillStyle = "#0b0518"; ctx.fillRect(0, 0, innerWidth, innerHeight);
      drawRobotHand(engine.hand);
    }
    if (this.bg) ctx.drawImage(this.bg.canvas, field.x - this.bg.pad, field.y - this.bg.pad, this.bg.w, this.bg.h);

    /* food */
    ctx.shadowColor = "#ec4899"; ctx.shadowBlur = 22; ctx.fillStyle = "#f9a8d4";
    ctx.beginPath(); ctx.arc(this.food.x, this.food.y, this.thickness * (.42 + Math.sin(now / 260) * .05), 0, 7); ctx.fill();

    /* body as one continuous rounded ribbon */
    const width = this.thickness;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.shadowColor = "#a855f7"; ctx.shadowBlur = 14;
    ctx.strokeStyle = "rgba(168,85,247,.92)";
    ctx.lineWidth = width;
    if (this.path.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.path[0].x, this.path[0].y);
      for (let i = 1; i < this.path.length; i++) ctx.lineTo(this.path[i].x, this.path[i].y);
      ctx.stroke();
    }

    /* head, with eyes oriented toward the direction of travel */
    ctx.shadowColor = "#22d3ee"; ctx.shadowBlur = 16; ctx.fillStyle = "#67e8f9";
    ctx.beginPath(); ctx.arc(this.head.x, this.head.y, width * .62, 0, 7); ctx.fill();
    ctx.shadowBlur = 0; ctx.fillStyle = "#0b0518";
    const ex = this.dir.x * width * .2, ey = this.dir.y * width * .2;
    ctx.beginPath(); ctx.arc(this.head.x + ex - this.dir.y * width * .2, this.head.y + ey + this.dir.x * width * .2, 2.4, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(this.head.x + ex + this.dir.y * width * .2, this.head.y + ey - this.dir.x * width * .2, 2.4, 0, 7); ctx.fill();

    ctx.font = "800 12px system-ui"; ctx.textAlign = "center"; ctx.shadowBlur = 0; ctx.fillStyle = "rgba(255,255,255,.88)";
    ctx.fillText(t("snakePointer"), innerWidth / 2, Math.min(innerHeight - 14, field.y + field.height + 42));
    ctx.restore();
  },

  end() {
    if (!this.running) return;
    const score = this.score, rank = score >= 180 ? 0 : score >= 80 ? 1 : 2;
    this.cleanup(); sfx.bad(); ui.classList.remove("passthrough");
    const node = el(`<div class="panel"><div class="big-emoji">🐍</div><h2>${t("gameOver")}</h2><div class="score-line">${score}</div><div class="result-rank">${t("snakeRanks")[rank]}</div><button class="btn" id="againBtn">${t("again")}</button><br><button class="btn ghost" id="menuBtn" style="font-size:15px;padding:10px 24px">← ${t("back")}</button></div>`);
    node.querySelector("#againBtn").onclick = () => { sfx.click(); show(null); ui.classList.add("passthrough"); this.start(); };
    node.querySelector("#menuBtn").onclick = () => { sfx.click(); menu(); };
    show(node);
  },
};

/* ================================================
   GAME 4 : HAND BLAST
================================================ */
/* Weighted shape bag — small pieces stay common so the board keeps breathing,
   while the rarer 5–9 cell shapes give older students something to plan around. */
const BLAST_SHAPES = [
  { w: 3, s: [[0,0]] },
  { w: 6, s: [[0,0],[1,0]] },
  { w: 6, s: [[0,0],[0,1]] },
  { w: 5, s: [[0,0],[1,0],[2,0]] },
  { w: 5, s: [[0,0],[0,1],[0,2]] },
  { w: 5, s: [[0,0],[1,0],[0,1],[1,1]] },
  { w: 4, s: [[0,0],[1,0],[1,1]] },
  { w: 4, s: [[0,0],[0,1],[1,1]] },
  { w: 4, s: [[0,0],[1,0],[0,1]] },
  { w: 4, s: [[1,0],[0,1],[1,1]] },
  { w: 3, s: [[0,0],[1,0],[2,0],[3,0]] },
  { w: 3, s: [[0,0],[0,1],[0,2],[0,3]] },
  { w: 3, s: [[0,0],[1,0],[2,0],[1,1]] },
  { w: 3, s: [[1,0],[0,1],[1,1],[2,1]] },
  { w: 3, s: [[0,0],[0,1],[0,2],[1,2]] },
  { w: 3, s: [[1,0],[1,1],[0,2],[1,2]] },
  { w: 3, s: [[0,0],[1,0],[2,0],[2,1]] },
  { w: 3, s: [[0,0],[1,0],[2,0],[0,1]] },
  { w: 2, s: [[0,0],[1,0],[1,1],[2,1]] },
  { w: 2, s: [[1,0],[2,0],[0,1],[1,1]] },
  { w: 2, s: [[0,0],[0,1],[1,1],[1,2]] },
  { w: 2, s: [[1,0],[0,1],[1,1],[0,2]] },
  { w: 2, s: [[0,0],[1,0],[2,0],[0,1],[0,2]] },
  { w: 2, s: [[0,0],[1,0],[2,0],[2,1],[2,2]] },
  { w: 2, s: [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]] },
  { w: 2, s: [[0,0],[1,0],[0,1],[1,1],[0,2],[1,2]] },
  { w: 1, s: [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]] },
];
const BLAST_BAG_TOTAL = BLAST_SHAPES.reduce((sum, entry) => sum + entry.w, 0);
const BLAST_COLORS = ["#22d3ee", "#a855f7", "#ec4899", "#a3e635", "#fbbf24"];
const BLAST = {
  emoji: "🧱", titleKey: "blastTitle", howKey: "blastHow", bgToggle: true,
  board: [], pieces: [], score: 0, lines: 0, dragging: null,
  flashCells: [], flashT: 0, hud: null, resetBtn: null, running: false,

  cursorPos: null, dragPos: null, bg: null, bgKey: "",
  pinchLog: [], openSince: 0, handLostSince: 0,

  start() {
    this.cleanup();
    this.board = Array.from({ length: 8 }, () => Array(8).fill(null));
    this.score = 0; this.lines = 0; this.dragging = null; this.flashCells = []; this.flashT = 0;
    this.cursorPos = null; this.dragPos = null; this.bg = null; this.bgKey = "";
    this.pinchLog = []; this.openSince = 0; this.handLostSince = 0;
    this.spawnPieces(); this.running = true;
    this.hud = el(`<div class="hud"><div class="stat"><div class="lbl">${t("score")}</div><div class="num cyan" id="bScore">0</div></div><div class="stat"><div class="lbl">${t("lines")}</div><div class="num pink" id="bLines">0</div></div></div>`);
    this.resetBtn = el(`<button class="reset-btn" type="button">↺ ${t("reset")}</button>`);
    this.resetBtn.onclick = () => { sfx.click(); this.start(); };
    document.body.append(this.hud, this.resetBtn);
  },

  cleanup() {
    this.hud?.remove(); this.resetBtn?.remove();
    this.hud = null; this.resetBtn = null; this.running = false; this.bg = null;
  },

  randomShape() {
    let roll = Math.random() * BLAST_BAG_TOTAL;
    for (const entry of BLAST_SHAPES) { roll -= entry.w; if (roll <= 0) return entry.s; }
    return BLAST_SHAPES[0].s;
  },
  makePiece() {
    return { shape: this.randomShape(), color: BLAST_COLORS[Math.floor(Math.random() * BLAST_COLORS.length)] };
  },
  spawnPieces() {
    // Never hand out a set that is dead on arrival.
    for (let attempt = 0; attempt < 30; attempt++) {
      const set = [0, 1, 2].map(() => this.makePiece());
      if (set.some(p => this.canFit(p.shape))) { this.pieces = set; return; }
    }
    this.pieces = [0, 1, 2].map(() => ({ shape: [[0, 0]], color: BLAST_COLORS[0] }));
  },

  /* Pieces stacked in a column down the left edge, board to the right — a
     vertical tray is far easier to reach into with one hand than a bottom row. */
  layout() {
    const topSafe = 104, bottomSafe = 66;
    const availH = Math.max(220, innerHeight - topSafe - bottomSafe);
    const trayW = Math.round(Math.min(150, Math.max(92, innerWidth * .2)));
    const availW = Math.max(200, innerWidth - trayW - 26);
    const cell = Math.max(15, Math.floor(Math.min(availW * .92, availH * .96, 336) / 8));
    const boardSize = cell * 8;
    const gx = Math.round(trayW + 18 + Math.max(0, (availW - boardSize) / 2));
    const gy = Math.round(topSafe + Math.max(0, (availH - boardSize) / 2));
    const trayCell = Math.max(11, Math.min(Math.round(cell * .7), Math.floor((trayW - 26) / 4)));
    const trayX = Math.round(trayW / 2 + 6);
    return { gx, gy, cell, boardSize, trayW, trayX, trayCell };
  },
  pieceOrigin(piece) {
    const maxX = Math.max(...piece.shape.map(p => p[0])), maxY = Math.max(...piece.shape.map(p => p[1]));
    return { w: maxX + 1, h: maxY + 1 };
  },
  trayPosition(index, layout) {
    return { x: layout.trayX, y: layout.gy + layout.boardSize * ((index + .5) / 3) };
  },
  valid(shape, col, row) {
    return shape.every(([x, y]) => row + y >= 0 && row + y < 8 && col + x >= 0 && col + x < 8 && !this.board[row + y][col + x]);
  },
  canFit(shape) {
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (this.valid(shape, x, y)) return true;
    return false;
  },
  hoveredPiece(layout, cursor) {
    if (!cursor) return -1;
    return this.pieces.findIndex((piece, index) => {
      if (!piece) return false;
      const p = this.trayPosition(index, layout), d = this.pieceOrigin(piece);
      const w = d.w * layout.trayCell, h = d.h * layout.trayCell;
      // Generous grab box: the fingertip never has to be pixel-accurate.
      const padX = 34, padY = Math.max(24, layout.boardSize / 9);
      return cursor.x >= p.x - w / 2 - padX && cursor.x <= p.x + w / 2 + padX &&
             cursor.y >= p.y - h / 2 - padY && cursor.y <= p.y + h / 2 + padY;
    });
  },
  dragCell(layout, cursor, piece) {
    const d = this.pieceOrigin(piece);
    return { col: Math.round((cursor.x - layout.gx) / layout.cell - d.w / 2), row: Math.round((cursor.y - layout.gy) / layout.cell - d.h / 2) };
  },
  updateHud() {
    const score = this.hud?.querySelector("#bScore"), lines = this.hud?.querySelector("#bLines");
    if (score) { score.textContent = this.score; score.classList.remove("score-punch"); void score.offsetWidth; score.classList.add("score-punch"); }
    if (lines) lines.textContent = this.lines;
  },
  place(index, layout, cursor) {
    const piece = this.pieces[index], { col, row } = this.dragCell(layout, cursor, piece);
    if (!this.valid(piece.shape, col, row)) { sfx.bad(); return; }
    piece.shape.forEach(([x, y]) => { this.board[row + y][col + x] = piece.color; });
    this.pieces[index] = null; this.score += piece.shape.length * 10;
    const clear = [];
    this.board.forEach((r, y) => { if (r.every(Boolean)) for (let x = 0; x < 8; x++) clear.push([x, y]); });
    for (let x = 0; x < 8; x++) if (this.board.every(r => r[x])) for (let y = 0; y < 8; y++) clear.push([x, y]);
    const unique = [...new Map(clear.map(p => [`${p[0]},${p[1]}`, p])).values()];
    if (unique.length) { unique.forEach(([x, y]) => { this.board[y][x] = null; }); this.lines += Math.round(unique.length / 8); this.score += Math.round(unique.length / 8) * 100; this.flashCells = unique; this.flashT = .42; sfx.good(); }
    else sfx.slice();
    if (this.pieces.every(p => !p)) this.spawnPieces();
    this.updateHud();
    if (!this.pieces.some(p => p && this.canFit(p.shape))) this.end();
  },

  /* Empty board frame + grid cached offscreen: it is identical every frame and
     the per-cell shadow pass used to cost more than the rest of the game. */
  buildBackground(layout) {
    const key = `${layout.gx}:${layout.gy}:${layout.cell}`;
    if (this.bgKey === key && this.bg) return;
    const pad = 14, dpr = Math.min(2, devicePixelRatio || 1);
    const size = layout.boardSize + pad * 2;
    const c = document.createElement("canvas");
    c.width = c.height = Math.ceil(size * dpr);
    const g = c.getContext("2d");
    g.scale(dpr, dpr);
    g.fillStyle = "rgba(11,5,24,.65)"; g.strokeStyle = "rgba(34,211,238,.55)"; g.lineWidth = 2;
    g.shadowColor = "#22d3ee"; g.shadowBlur = 16;
    g.beginPath(); g.roundRect(pad - 9, pad - 9, layout.boardSize + 18, layout.boardSize + 18, 18);
    g.fill(); g.stroke();
    g.shadowBlur = 0;
    g.fillStyle = "rgba(255,255,255,.055)"; g.strokeStyle = "rgba(255,255,255,.12)"; g.lineWidth = 1;
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      g.beginPath();
      g.roundRect(pad + x * layout.cell + 2, pad + y * layout.cell + 2, layout.cell - 4, layout.cell - 4, 6);
      g.fill(); g.stroke();
    }
    this.bg = { canvas: c, pad, size };
    this.bgKey = key;
  },

  drawCells(cells, x, y, cell, color, alpha = 1, glow = 0) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    if (glow) { ctx.shadowColor = color; ctx.shadowBlur = glow; }
    cells.forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.roundRect(x + sx * cell + 2, y + sy * cell + 2, cell - 4, cell - 4, Math.max(4, cell * .2));
      ctx.fill();
    });
    ctx.restore();
  },
  drawPiece(piece, cx, cy, cell, alpha = 1, color = null, glow = 0) {
    if (!piece) return;
    const d = this.pieceOrigin(piece);
    this.drawCells(piece.shape, cx - d.w * cell / 2, cy - d.h * cell / 2, cell, color || piece.color, alpha, glow);
  },

  onFrame(dt) {
    if (!this.running) return;
    const layout = this.layout();
    this.buildBackground(layout);
    const pinch = pinchState();
    const raw = pinch?.center || null;
    const now = performance.now();

    /* Ease the cursor and the carried block. The tracker is already filtered,
       but a second light ease is what turns "twitchy" into "glides". */
    if (raw) {
      const k = 1 - Math.pow(1e-9, dt); // frame-rate independent, ~0.29 at 60fps
      if (!this.cursorPos) this.cursorPos = { x: raw.x, y: raw.y };
      else { this.cursorPos.x += (raw.x - this.cursorPos.x) * k; this.cursorPos.y += (raw.y - this.cursorPos.y) * k; }
    } else this.cursorPos = null;
    const cursor = this.cursorPos;

    /* Rolling short pinch log: a fast pinch-and-swipe can produce one or two
       blurry camera frames where the fingertip gap briefly reads "open" even
       though the student's fingers are together. Remembering the most-closed
       raw reading from the last ~160ms means a single clean frame is enough
       to register the grab, instead of needing every single frame to agree. */
    if (pinch) this.pinchLog.push({ t: now, v: pinch.pinch, cursor: { x: pinch.center.x, y: pinch.center.y } });
    while (this.pinchLog.length && now - this.pinchLog[0].t > 160) this.pinchLog.shift();

    let pinching = false;
    if (this.dragging === null) {
      const closest = this.pinchLog.reduce((best, e) => (!best || e.v < best.v ? e : best), null);
      if (closest && closest.v < .48) {
        const index = this.hoveredPiece(layout, closest.cursor);
        if (index >= 0) {
          this.dragging = index; sfx.click();
          this.dragPos = { x: closest.cursor.x, y: closest.cursor.y };
          this.openSince = 0;
        }
      }
      pinching = !!pinch && pinch.pinch < .5;
    } else if (!pinch) {
      // Hand briefly lost mid-swipe (common during a fast motion blur):
      // pause the drag in place instead of dropping the block wherever it
      // last was. Only give up and hand the piece back after a real gap.
      this.handLostSince = this.handLostSince || now;
      if (now - this.handLostSince > 900) { this.dragging = null; this.dragPos = null; sfx.bad(); }
      pinching = true;
    } else {
      this.handLostSince = 0;
      // Require the fingers to read "open" for a short stretch before
      // committing to a release, so one noisy frame during a fast swipe
      // can't drop the piece early.
      if (pinch.pinch >= .62) this.openSince = this.openSince || now;
      else this.openSince = 0;
      if (this.openSince && now - this.openSince > 70 && this.dragPos) {
        this.place(this.dragging, layout, this.dragPos);
        this.dragging = null; this.dragPos = null; this.openSince = 0;
      }
      pinching = pinch.pinch < .58;
    }
    this.flashT = Math.max(0, this.flashT - dt);
    if (this.dragging !== null && cursor) {
      const k = 1 - Math.pow(1e-11, dt); // the held block chases a touch faster
      if (!this.dragPos) this.dragPos = { x: cursor.x, y: cursor.y };
      else { this.dragPos.x += (cursor.x - this.dragPos.x) * k; this.dragPos.y += (cursor.y - this.dragPos.y) * k; }
    }

    ctx.save();
    if (camBgOn) {
      ctx.fillStyle = "rgba(5,8,28,.34)"; ctx.fillRect(0, 0, innerWidth, innerHeight);
    } else {
      ctx.fillStyle = "#0b0518"; ctx.fillRect(0, 0, innerWidth, innerHeight);
      drawRobotHand(engine.hand);
    }
    if (this.bg) ctx.drawImage(this.bg.canvas, layout.gx - this.bg.pad, layout.gy - this.bg.pad, this.bg.size, this.bg.size);

    /* filled cells */
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      const color = this.board[y][x];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(layout.gx + x * layout.cell + 2, layout.gy + y * layout.cell + 2, layout.cell - 4, layout.cell - 4, 6);
      ctx.fill();
    }
    if (this.flashT) {
      ctx.fillStyle = `rgba(255,255,255,${this.flashT * 1.7})`;
      this.flashCells.forEach(([x, y]) => ctx.fillRect(layout.gx + x * layout.cell, layout.gy + y * layout.cell, layout.cell, layout.cell));
    }

    /* side tray */
    const hover = this.hoveredPiece(layout, cursor);
    ctx.save();
    ctx.fillStyle = "rgba(11,5,24,.5)"; ctx.strokeStyle = "rgba(168,85,247,.35)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(layout.trayX - layout.trayW / 2, layout.gy - 10, layout.trayW, layout.boardSize + 20, 18);
    ctx.fill(); ctx.stroke();
    ctx.restore();
    this.pieces.forEach((piece, index) => {
      if (!piece || index === this.dragging) return;
      const p = this.trayPosition(index, layout);
      const active = index === hover;
      if (active) {
        ctx.save();
        ctx.strokeStyle = "rgba(34,211,238,.7)"; ctx.lineWidth = 2;
        ctx.shadowColor = "#22d3ee"; ctx.shadowBlur = 14;
        const d = this.pieceOrigin(piece);
        const w = d.w * layout.trayCell + 22, h = d.h * layout.trayCell + 22;
        ctx.beginPath(); ctx.roundRect(p.x - w / 2, p.y - h / 2, w, h, 12); ctx.stroke();
        ctx.restore();
      }
      this.drawPiece(piece, p.x, p.y, layout.trayCell, active ? 1 : .78, null, active ? 14 : 0);
    });

    /* carried block + snapped landing ghost */
    if (this.dragging !== null && this.dragPos) {
      const piece = this.pieces[this.dragging];
      const cell = this.dragCell(layout, this.dragPos, piece);
      const ok = this.valid(piece.shape, cell.col, cell.row);
      this.drawCells(piece.shape, layout.gx + cell.col * layout.cell, layout.gy + cell.row * layout.cell,
        layout.cell, ok ? "#ffffff" : "#f43f5e", ok ? .28 : .22);
      this.drawPiece(piece, this.dragPos.x, this.dragPos.y - layout.cell * .35, layout.cell, .95,
        ok ? piece.color : "#f43f5e", 18);
    }

    ctx.font = "800 13px system-ui"; ctx.textAlign = "center"; ctx.shadowBlur = 0; ctx.fillStyle = "rgba(255,255,255,.9)";
    ctx.fillText(t("pinchHint"), innerWidth / 2, innerHeight - 22);
    if (pinch) {
      const color = pinching ? "#f9a8d4" : "#67e8f9";
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3; ctx.shadowColor = pinching ? "#ec4899" : "#22d3ee"; ctx.shadowBlur = 16;
      ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(pinch.thumb.x, pinch.thumb.y); ctx.lineTo(pinch.index.x, pinch.index.y); ctx.stroke(); ctx.setLineDash([]);
      [pinch.thumb, pinch.index].forEach((point) => { ctx.beginPath(); ctx.arc(point.x, point.y, 10, 0, 7); ctx.stroke(); });
      if (cursor) {
        ctx.fillStyle = pinching ? "rgba(236,72,153,.92)" : "rgba(34,211,238,.82)";
        ctx.beginPath(); ctx.arc(cursor.x, cursor.y, pinching ? 8 : 6, 0, 7); ctx.fill();
        ctx.shadowBlur = 0; ctx.font = "800 11px system-ui"; ctx.textAlign = "center"; ctx.fillStyle = "#fff";
        ctx.fillText(pinching ? t("pinchClosed") : t("pinchOpen"), cursor.x, cursor.y - 20);
      }
    }
    ctx.restore();
  },
  end() {
    if (!this.running) return;
    const score = this.score, rank = score >= 500 ? 0 : score >= 200 ? 1 : 2;
    this.cleanup(); sfx.bad(); ui.classList.remove("passthrough");
    const node = el(`<div class="panel"><div class="big-emoji">🧱</div><h2>${t("noMoves")}</h2><div class="score-line">${score}</div><div class="result-rank">${t("blastRanks")[rank]}</div><button class="btn" id="againBtn">${t("again")}</button><br><button class="btn ghost" id="menuBtn" style="font-size:15px;padding:10px 24px">← ${t("back")}</button></div>`);
    node.querySelector("#againBtn").onclick = () => { sfx.click(); show(null); ui.classList.add("passthrough"); this.start(); };
    node.querySelector("#menuBtn").onclick = () => { sfx.click(); menu(); };
    show(node);
  },
};

/* ================================================
   GAME 5 : HAND LAB (element combining)
================================================ */
const LAB_ELEMENTS = {
  fire: { emoji: "🔥", en: { name: "Fire", fact: "Fire needs fuel, heat and oxygen to burn." }, bm: { name: "Api", fact: "Api perlukan bahan bakar, haba dan oksigen untuk menyala." } },
  water: { emoji: "💧", en: { name: "Water", fact: "Water covers most of planet Earth." }, bm: { name: "Air", fact: "Air menutupi kebanyakan permukaan Bumi." } },
  earth: { emoji: "🌍", en: { name: "Earth", fact: "Soil and rock make up the ground beneath us." }, bm: { name: "Bumi", fact: "Tanah dan batu membentuk permukaan di bawah kita." } },
  air: { emoji: "💨", en: { name: "Air", fact: "Air is an invisible mix of gases we breathe." }, bm: { name: "Udara", fact: "Udara ialah campuran gas halimunan yang kita hirup." } },
  steam: { emoji: "♨️", en: { name: "Steam", fact: "Water turns to steam at 100°C." }, bm: { name: "Wap", fact: "Air bertukar menjadi wap pada suhu 100°C." } },
  lava: { emoji: "🌋", en: { name: "Lava", fact: "Lava is molten rock from deep underground." }, bm: { name: "Lava", fact: "Lava ialah batuan cair dari dalam bumi." } },
  energy: { emoji: "⚡", en: { name: "Energy", fact: "Fire releases energy as heat and light." }, bm: { name: "Tenaga", fact: "Api membebaskan tenaga sebagai haba dan cahaya." } },
  mud: { emoji: "🟤", en: { name: "Mud", fact: "Wet soil sticks together to form mud." }, bm: { name: "Lumpur", fact: "Tanah basah melekat membentuk lumpur." } },
  cloud: { emoji: "☁️", en: { name: "Cloud", fact: "Clouds are tiny water droplets floating in the sky." }, bm: { name: "Awan", fact: "Awan ialah titisan air halus terapung di langit." } },
  dust: { emoji: "🌪️", en: { name: "Dust", fact: "Wind can carry tiny bits of earth as dust." }, bm: { name: "Debu", fact: "Angin boleh membawa serpihan halus tanah sebagai debu." } },
  sun: { emoji: "☀️", en: { name: "Sun", fact: "The Sun is a giant ball of burning gas." }, bm: { name: "Matahari", fact: "Matahari ialah bola gas raksasa yang membara." } },
  ocean: { emoji: "🌊", en: { name: "Ocean", fact: "Oceans cover about 70% of Earth's surface." }, bm: { name: "Lautan", fact: "Lautan menutupi kira-kira 70% permukaan Bumi." } },
  mountain: { emoji: "⛰️", en: { name: "Mountain", fact: "Mountains form from rock layers pushed upward." }, bm: { name: "Gunung", fact: "Gunung terbentuk daripada lapisan batu yang tertolak ke atas." } },
  wind: { emoji: "🌬️", en: { name: "Wind", fact: "Wind is just air that's on the move." }, bm: { name: "Angin", fact: "Angin ialah udara yang sedang bergerak." } },
  obsidian: { emoji: "🪨", en: { name: "Obsidian", fact: "Lava cooled instantly by water turns to glassy rock." }, bm: { name: "Obsidian", fact: "Lava yang disejukkan segera oleh air bertukar menjadi batu kaca." } },
  life: { emoji: "🌱", en: { name: "Life", fact: "Energy plus matter can spark the first living things." }, bm: { name: "Hidupan", fact: "Tenaga dan bahan boleh mencetuskan hidupan pertama." } },
  rain: { emoji: "🌧️", en: { name: "Rain", fact: "Clouds get heavy with water and fall as rain." }, bm: { name: "Hujan", fact: "Awan menjadi berat dengan air lalu turun sebagai hujan." } },
  rainbow: { emoji: "🌈", en: { name: "Rainbow", fact: "Sunlight bends through raindrops to make a rainbow." }, bm: { name: "Pelangi", fact: "Cahaya matahari membias melalui titisan hujan membentuk pelangi." } },
  brick: { emoji: "🧱", en: { name: "Brick", fact: "Sun-dried mud becomes a hard building block." }, bm: { name: "Bata", fact: "Lumpur yang dikeringkan matahari menjadi bata yang keras." } },
  storm: { emoji: "⛈️", en: { name: "Storm", fact: "Storms bring thunder, lightning and heavy rain." }, bm: { name: "Ribut", fact: "Ribut membawa guruh, kilat dan hujan lebat." } },
  plant: { emoji: "🌿", en: { name: "Plant", fact: "Living things need water to grow." }, bm: { name: "Tumbuhan", fact: "Hidupan memerlukan air untuk membesar." } },
  sand: { emoji: "🏖️", en: { name: "Sand", fact: "Wind slowly wears mountains down into sand." }, bm: { name: "Pasir", fact: "Angin perlahan-lahan mengikis gunung menjadi pasir." } },
  fish: { emoji: "🐟", en: { name: "Fish", fact: "Scientists think life began in the ocean." }, bm: { name: "Ikan", fact: "Saintis percaya hidupan bermula di lautan." } },
  metal: { emoji: "⛏️", en: { name: "Metal", fact: "Heat can pull metal out of mountain rock." }, bm: { name: "Logam", fact: "Haba boleh mengeluarkan logam daripada batuan gunung." } },
  glass: { emoji: "🪟", en: { name: "Glass", fact: "Melting sand at high heat makes glass." }, bm: { name: "Kaca", fact: "Melebur pasir pada suhu tinggi menghasilkan kaca." } },
  animal: { emoji: "🐾", en: { name: "Animal", fact: "Animals get their energy by eating plants." }, bm: { name: "Haiwan", fact: "Haiwan mendapat tenaga dengan memakan tumbuhan." } },
  human: { emoji: "🧑", en: { name: "Human", fact: "Humans are animals who build tools and ideas." }, bm: { name: "Manusia", fact: "Manusia ialah haiwan yang mencipta alat dan idea." } },
  idea: { emoji: "💡", en: { name: "Idea", fact: "Every invention starts as a single idea." }, bm: { name: "Idea", fact: "Setiap ciptaan bermula sebagai satu idea." } },
  robot: { emoji: "🤖", en: { name: "Robot", fact: "A robot is an idea for a machine, built in metal." }, bm: { name: "Robot", fact: "Robot ialah idea untuk mesin, dibina daripada logam." } },
  smoke: { emoji: "🌫️", en: { name: "Smoke", fact: "Smoke is made of tiny particles carried by hot air." }, bm: { name: "Asap", fact: "Asap terdiri daripada zarah halus yang dibawa udara panas." } },
  volcano: { emoji: "🌋", en: { name: "Volcano", fact: "A volcano is an opening where molten rock reaches the surface." }, bm: { name: "Gunung Berapi", fact: "Gunung berapi ialah bukaan tempat batuan cair sampai ke permukaan." } },
  stone: { emoji: "🪨", en: { name: "Stone", fact: "Stone forms when minerals are pressed, cooled or cemented together." }, bm: { name: "Batu", fact: "Batu terbentuk apabila mineral ditekan, disejukkan atau bercantum." } },
  lake: { emoji: "🏞️", en: { name: "Lake", fact: "A lake is water surrounded by land." }, bm: { name: "Tasik", fact: "Tasik ialah air yang dikelilingi daratan." } },
  tree: { emoji: "🌳", en: { name: "Tree", fact: "Trees store carbon and release oxygen." }, bm: { name: "Pokok", fact: "Pokok menyimpan karbon dan membebaskan oksigen." } },
  forest: { emoji: "🌲", en: { name: "Forest", fact: "A forest is a community of trees, plants and animals." }, bm: { name: "Hutan", fact: "Hutan ialah komuniti pokok, tumbuhan dan haiwan." } },
  electricity: { emoji: "🔌", en: { name: "Electricity", fact: "Electricity is the movement of electric charge." }, bm: { name: "Elektrik", fact: "Elektrik ialah pergerakan cas elektrik." } },
  computer: { emoji: "💻", en: { name: "Computer", fact: "Computers follow instructions to process information." }, bm: { name: "Komputer", fact: "Komputer mengikuti arahan untuk memproses maklumat." } },
  city: { emoji: "🏙️", en: { name: "City", fact: "Cities connect people, buildings, transport and ideas." }, bm: { name: "Bandar", fact: "Bandar menghubungkan manusia, bangunan, pengangkutan dan idea." } },
  boat: { emoji: "⛵", en: { name: "Boat", fact: "A boat floats by displacing its weight in water." }, bm: { name: "Bot", fact: "Bot terapung dengan menyesarkan beratnya di dalam air." } },
  bird: { emoji: "🐦", en: { name: "Bird", fact: "Most birds have lightweight bones and feathered wings." }, bm: { name: "Burung", fact: "Kebanyakan burung mempunyai tulang ringan dan sayap berbulu." } },
  space: { emoji: "🚀", en: { name: "Space", fact: "Space begins beyond Earth's atmosphere." }, bm: { name: "Angkasa", fact: "Angkasa bermula di luar atmosfera Bumi." } },
};
const LAB_BASE = ["fire", "water", "earth", "air"];
const LAB_RECIPES = {
  "fire+water": "steam", "earth+fire": "lava", "air+fire": "energy",
  "earth+water": "mud", "air+water": "cloud", "air+earth": "dust",
  "fire+fire": "sun", "water+water": "ocean", "earth+earth": "mountain", "air+air": "wind",
  "lava+water": "obsidian", "earth+energy": "life", "cloud+water": "rain",
  "cloud+sun": "rainbow", "mud+sun": "brick", "cloud+cloud": "storm",
  "life+water": "plant", "mountain+wind": "sand", "life+ocean": "fish",
  "fire+mountain": "metal", "fire+sand": "glass", "energy+plant": "animal",
  "animal+energy": "human", "energy+human": "idea", "idea+metal": "robot",
  "fire+wind": "smoke", "air+lava": "volcano", "earth+lava": "stone",
  "mountain+water": "lake", "earth+plant": "tree", "plant+plant": "forest",
  "energy+metal": "electricity", "electricity+idea": "computer", "brick+human": "city",
  "metal+water": "boat", "air+animal": "bird", "idea+sun": "space",
  // The 37 recipes above were the original curated set; everything below
  // fills in far more of the "obvious things a kid would actually try"
  // pairings so combining feels like authored chemistry rather than mostly
  // landing on the arbitrary (if stable) hash fallback further down.
  "air+steam": "cloud", "earth+steam": "rain", "steam+wind": "cloud", "steam+sun": "cloud",
  "lava+lava": "volcano", "lava+mountain": "obsidian", "lava+sand": "glass", "lava+ocean": "obsidian", "lava+stone": "volcano",
  "energy+wind": "electricity", "energy+sun": "electricity", "energy+ocean": "electricity", "energy+life": "animal",
  "fire+mud": "brick", "mud+plant": "tree", "life+mud": "plant",
  "cloud+mountain": "storm", "cloud+wind": "storm", "cloud+electricity": "storm",
  "dust+wind": "sand", "dust+water": "mud", "dust+fire": "smoke",
  "sun+water": "steam", "earth+sun": "life", "plant+sun": "forest", "ocean+sun": "rain", "glass+sun": "rainbow",
  "earth+ocean": "mud", "fire+ocean": "steam", "animal+ocean": "fish", "ocean+wind": "storm", "ocean+rain": "storm", "ocean+volcano": "obsidian", "fish+ocean": "fish",
  "life+mountain": "tree", "mountain+plant": "forest", "mountain+rain": "lake",
  "rain+wind": "storm", "sand+wind": "dust", "stone+wind": "sand",
  "fire+obsidian": "lava",
  "air+life": "bird", "idea+life": "human",
  "earth+rain": "mud", "fire+rain": "steam",
  "plant+water": "tree",
  "sand+water": "mud",
  "air+fish": "bird", "fish+water": "fish",
  "human+metal": "robot", "metal+metal": "robot",
  "animal+idea": "human", "animal+water": "fish",
  "human+water": "boat", "human+stone": "brick", "human+tree": "boat", "human+human": "city",
  "idea+robot": "computer",
  "robot+robot": "city",
  "air+smoke": "cloud", "smoke+water": "cloud",
  "volcano+water": "obsidian",
  "fire+stone": "metal", "fire+lake": "steam", "fire+tree": "smoke", "fire+forest": "smoke",
  "electricity+robot": "computer", "computer+computer": "robot",
  "city+city": "space",
  "boat+fire": "smoke",
  "brick+brick": "city",
  // Every element combined with itself needs its own explicit answer.
  // Infinite Craft always escalates a self-combo into a bigger, more
  // intense version of the same idea (Water+Water=Lake, Fire+Fire=Volcano,
  // Dust+Dust=Sand, Smoke+Smoke=Cloud — verified against the live game).
  // Without an entry here the old hash fallback could match on nothing more
  // than a shared "hot" tag, which is how Energy+Energy ended up at Lava.
  "steam+steam": "cloud", "energy+energy": "electricity", "mud+mud": "brick", "dust+dust": "sand",
  "sun+sun": "energy", "ocean+ocean": "storm", "mountain+mountain": "volcano", "wind+wind": "storm",
  "obsidian+obsidian": "stone", "life+life": "animal", "rain+rain": "storm", "rainbow+rainbow": "idea",
  "storm+storm": "electricity", "sand+sand": "stone", "fish+fish": "animal", "glass+glass": "computer",
  "animal+animal": "human", "idea+idea": "robot", "smoke+smoke": "cloud", "volcano+volcano": "mountain",
  "stone+stone": "mountain", "lake+lake": "ocean", "tree+tree": "forest", "forest+forest": "life",
  "electricity+electricity": "computer", "boat+boat": "city", "bird+bird": "forest", "space+space": "idea",
};
const LAB_TOTAL = Object.keys(LAB_ELEMENTS).length;
const LAB_FALLBACK_POOL = Object.keys(LAB_ELEMENTS).filter(id => !LAB_BASE.includes(id));
// Every element gets a handful of category tags so an *unlisted* combo can
// still land on something in the same neighbourhood (idea+idea should drift
// toward other abstract/tech things, never toward "lava"). This is what the
// old fallback lacked: it picked from ALL 36 elements with no notion of
// "related", so any two inputs could land on anything.
const LAB_TAGS = {
  fire: ["hot", "elemental"], water: ["liquid", "elemental"], earth: ["solid", "elemental"], air: ["gas", "elemental"],
  steam: ["gas", "hot", "elemental"], lava: ["hot", "liquid", "solid", "elemental"], energy: ["abstract", "tech", "power"],
  mud: ["liquid", "solid", "elemental"], cloud: ["gas", "weather", "sky"], dust: ["solid", "gas", "weather"],
  sun: ["hot", "sky", "elemental"], ocean: ["liquid", "life", "elemental"], mountain: ["solid", "sky", "elemental"],
  wind: ["gas", "weather", "elemental"], obsidian: ["solid", "hot", "structure"], life: ["life", "abstract"],
  rain: ["liquid", "weather", "sky"], rainbow: ["sky", "weather", "abstract"], brick: ["structure", "solid"],
  storm: ["weather", "sky", "hot"], plant: ["life", "solid"], sand: ["solid", "elemental"], fish: ["life", "liquid"],
  metal: ["structure", "solid", "hot"], glass: ["structure", "solid", "hot"], animal: ["life"], human: ["life", "tech"],
  idea: ["abstract", "tech"], robot: ["tech", "structure"], smoke: ["gas", "hot", "weather"],
  volcano: ["hot", "solid", "sky", "elemental"], stone: ["solid", "elemental"], lake: ["liquid", "elemental"],
  tree: ["life", "solid"], forest: ["life", "solid"], electricity: ["tech", "abstract", "power"],
  computer: ["tech", "structure", "abstract"], city: ["structure", "tech", "life"], boat: ["structure", "tech", "liquid"],
  bird: ["life", "sky"], space: ["sky", "abstract", "tech"],
};
function stableHash(key) {
  let hash = 2166136261;
  for (const char of key) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); }
  return hash >>> 0;
}
function labCombinationResult(idA, idB) {
  const key = [idA, idB].sort().join("+");
  if (LAB_RECIPES[key]) return { id: LAB_RECIPES[key], exact: true, key };
  // Infinite Craft nearly always rewards experimentation. The booth version
  // stays offline, so unknown pairs use a stable fallback: the same two
  // inputs always produce the same result on every device and session — and
  // that result is picked only from elements sharing a tag with either
  // input, so it stays thematically plausible instead of fully arbitrary.
  const wantTags = new Set([...(LAB_TAGS[idA] || []), ...(LAB_TAGS[idB] || [])]);
  const related = LAB_FALLBACK_POOL.filter(id => id !== idA && id !== idB && (LAB_TAGS[id] || []).some(tag => wantTags.has(tag)));
  const pool = related.length ? related : LAB_FALLBACK_POOL;
  return { id: pool[stableHash(key) % pool.length], exact: false, key };
}

const LAB = {
  emoji: "🧪", titleKey: "labTitle", howKey: "labHow",
  found: new Set(), workspace: [], drag: null, cursorPos: null, pinchLog: [],
  openSince: 0, grabReadyAt: 0, dwellKey: "", dwellSince: 0, bookOpen: false,
  history: new Map(), bookNode: null, recipeBtn: null, cheatBtn: null, running: false,

  start() {
    this.cleanup();
    this.found = new Set(LAB_BASE);
    // Like Infinite Craft, the board begins empty: pinch an item from the
    // library and release it anywhere on the open canvas to create a copy.
    this.workspace = [];
    this.drag = null; this.cursorPos = null; this.pinchLog = [];
    this.history = new Map();
    this.openSince = 0; this.grabReadyAt = 0; this.dwellKey = ""; this.dwellSince = 0; this.bookOpen = false; this.running = true;
    this.recipeBtn = el(`<button class="lab-tool-btn recipe" type="button">📖 ${t("labRecipes")}</button>`);
    this.cheatBtn = el(`<button class="lab-tool-btn cheat" type="button" aria-label="${t("labCheatTitle")}" title="${t("labCheatTitle")}">⌘</button>`);
    this.recipeBtn.onclick = () => { sfx.click(); this.openRecipes(false); };
    this.cheatBtn.onclick = () => { sfx.click(); this.openRecipes(true); };
    document.body.append(this.recipeBtn, this.cheatBtn);
    // Hand Lab draws a robot hand from the landmarks instead of the raw
    // feed, so the camera video itself stays hidden the whole time.
    cam.style.display = "none";
  },

  cleanup() {
    this.recipeBtn?.remove(); this.cheatBtn?.remove(); this.bookNode?.remove();
    this.recipeBtn = null; this.cheatBtn = null; this.bookNode = null; this.running = false;
    cam.style.display = "";
  },

  layout() {
    const items = [...this.found];
    // Read the real topbar height (it grows with the safe-area inset on a
    // notched iPad) so the library header and workspace title never sit
    // underneath the sound/language buttons like they did before.
    const topSafe = (topbar?.getBoundingClientRect().bottom || 54) + 6;
    const wide = innerWidth >= 760 && innerWidth > innerHeight * 1.15;
    const library = wide
      ? { x: Math.max(0, innerWidth - Math.min(330, Math.max(230, innerWidth * .24))), y: topSafe, w: Math.min(330, Math.max(230, innerWidth * .24)), h: innerHeight - topSafe, wide: true }
      : { x: 0, y: 0, w: innerWidth, h: 0, wide: false };
    if (!wide) {
      // The bottom panel's height now grows with how many elements have been
      // discovered (up to 41 by the end) instead of a fixed guess, and is
      // capped so the workspace always keeps real room — this is what stops
      // a near-complete library from running its rows off the bottom edge
      // on a shorter or unusually-shaped tablet.
      const colsGuess = Math.max(3, Math.min(7, Math.floor((innerWidth - 18) / 74)));
      const roughRows = Math.max(1, Math.ceil(items.length / colsGuess));
      const needed = 62 + roughRows * 34;
      library.h = Math.max(140, Math.min(needed, innerHeight * .55));
      library.y = innerHeight - library.h;
    }
    const workspace = wide
      ? { x: 0, y: topSafe, w: library.x - 1, h: innerHeight - topSafe }
      : { x: 0, y: topSafe, w: innerWidth, h: library.y - topSafe - 1 };
    const minCellH = library.wide ? 30 : 26;
    const maxCols = library.wide ? 5 : 8;
    let cols = library.wide
      ? Math.max(2, Math.min(4, Math.floor((library.w - 24) / 96)))
      : Math.max(3, Math.min(7, Math.floor((library.w - 18) / 74)));
    let rows = Math.max(1, Math.ceil(items.length / cols));
    // If even the smallest readable chip size would overflow the panel,
    // add columns until it fits rather than letting rows run off-screen.
    while (rows * minCellH > library.h - 62 && cols < maxCols) {
      cols++;
      rows = Math.max(1, Math.ceil(items.length / cols));
    }
    const cellW = (library.w - 20) / cols;
    const cellH = Math.max(minCellH, Math.min(42, Math.floor((library.h - 62) / rows)));
    return {
      items, cols, rows, cellW, cellH, library, workspace,
    };
  },
  libraryPos(index, layout) {
    const col = index % layout.cols, row = Math.floor(index / layout.cols);
    return {
      x: layout.library.x + 10 + col * layout.cellW + layout.cellW / 2,
      y: layout.library.y + 51 + row * layout.cellH + layout.cellH / 2,
    };
  },
  tagMetrics(id, compact = false) {
    ctx.save(); ctx.font = `${compact ? 700 : 800} ${compact ? 10 : 13}px system-ui`;
    const width = Math.min(compact ? 92 : 126, ctx.measureText(LAB_ELEMENTS[id][lang].name).width + (compact ? 37 : 47));
    ctx.restore();
    return { w: width, h: compact ? 24 : 32 };
  },
  hitTag(point, x, y, id, compact = false) {
    if (!point) return false;
    const m = this.tagMetrics(id, compact);
    return point.x >= x - m.w / 2 - 8 && point.x <= x + m.w / 2 + 8 && point.y >= y - m.h / 2 - 8 && point.y <= y + m.h / 2 + 8;
  },
  hitLibrary(layout, point) {
    for (let i = layout.items.length - 1; i >= 0; i--) {
      const id = layout.items[i], p = this.libraryPos(i, layout);
      if (this.hitTag(point, p.x, p.y, id, true)) return i;
    }
    return -1;
  },
  hitWorkspace(point, skip = -1) {
    for (let i = this.workspace.length - 1; i >= 0; i--) {
      const item = this.workspace[i];
      if (i !== skip && this.hitTag(point, item.x, item.y, item.id)) return i;
    }
    return -1;
  },
  clampToWorkbench(point, layout) {
    return {
      x: Math.max(layout.workspace.x + 66, Math.min(layout.workspace.x + layout.workspace.w - 66, point.x)),
      y: Math.max(layout.workspace.y + 28, Math.min(layout.workspace.y + layout.workspace.h - 28, point.y)),
    };
  },
  drawTag(x, y, id, options = {}) {
    const compact = !!options.compact, target = !!options.target, alpha = options.alpha ?? 1;
    const m = this.tagMetrics(id, compact), info = LAB_ELEMENTS[id][lang];
    ctx.save(); ctx.globalAlpha = alpha; ctx.shadowColor = target ? "#22d3ee" : "rgba(15,23,42,.24)"; ctx.shadowBlur = target ? 18 : 5;
    ctx.fillStyle = target ? "#ecfeff" : "#fff"; ctx.strokeStyle = target ? "#06b6d4" : "#334155"; ctx.lineWidth = target ? 2.5 : 1.25;
    ctx.beginPath(); ctx.roundRect(x - m.w / 2, y - m.h / 2, m.w, m.h, compact ? 8 : 12); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0; ctx.font = `${compact ? 13 : 17}px sans-serif`; ctx.textAlign = "left"; ctx.textBaseline = "middle"; ctx.fillStyle = "#111827";
    ctx.fillText(LAB_ELEMENTS[id].emoji, x - m.w / 2 + (compact ? 6 : 9), y + 1);
    ctx.font = `${compact ? 700 : 800} ${compact ? 10 : 13}px system-ui`; ctx.fillStyle = "#1e293b";
    ctx.fillText(info.name, x - m.w / 2 + (compact ? 24 : 31), y + 1);
    ctx.restore();
  },
  drawFact(x, y, id, layout) {
    const info = LAB_ELEMENTS[id][lang];
    ctx.save(); ctx.font = "700 12px system-ui";
    const maxW = Math.min(250, layout.workspace.w - 24), words = info.fact.split(" ");
    const lines = []; let line = "";
    words.forEach(word => { const next = line ? `${line} ${word}` : word; if (ctx.measureText(next).width > maxW - 22 && line) { lines.push(line); line = word; } else line = next; });
    if (line) lines.push(line);
    const h = lines.length * 16 + 20, w = Math.max(...lines.map(l => ctx.measureText(l).width), 100) + 22;
    const px = Math.max(12, Math.min(innerWidth - w - 12, x - w / 2)), py = Math.max(layout.workspace.y + 8, y - 58 - h);
    ctx.fillStyle = "rgba(15,23,42,.94)"; ctx.beginPath(); ctx.roundRect(px, py, w, h, 12); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    lines.forEach((lineText, i) => ctx.fillText(lineText, px + w / 2, py + 14 + i * 16));
    ctx.restore();
  },
  openRecipes(showAll) {
    this.bookOpen = true;
    const recipes = new Map();
    if (showAll) {
      const ids = Object.keys(LAB_ELEMENTS);
      ids.forEach((idA, a) => ids.slice(a).forEach(idB => {
        const combination = labCombinationResult(idA, idB);
        recipes.set(combination.key, combination.id);
      }));
    } else Object.entries(LAB_RECIPES).forEach(([key, result]) => {
      if (this.found.has(result)) recipes.set(key, result);
    });
    this.history.forEach((result, key) => recipes.set(key, result));
    const rows = [...recipes.entries()].sort((a, b) => LAB_ELEMENTS[a[1]][lang].name.localeCompare(LAB_ELEMENTS[b[1]][lang].name)).map(([key, result]) => {
      const [a, b] = key.split("+"), left = LAB_ELEMENTS[a], right = LAB_ELEMENTS[b], output = LAB_ELEMENTS[result];
      return `<div class="lab-recipe-row"><span>${left.emoji} ${left[lang].name}</span><b>+</b><span>${right.emoji} ${right[lang].name}</span><b>=</b><strong>${output.emoji} ${output[lang].name}</strong></div>`;
    }).join("");
    this.bookNode?.remove();
    this.bookNode = el(`<div class="lab-book"><div class="lab-book-panel recipe-panel"><h2>${showAll ? t("labCheatTitle") : t("labRecipesTitle")}</h2><div class="desc">${showAll ? t("labPossibilities")(recipes.size) : t("labDiscovered")(this.found.size, LAB_TOTAL)}</div><div class="lab-recipe-list">${rows || `<div class="lab-empty-recipes">${t("labNoRecipes")}</div>`}</div><button class="btn" id="labBookClose">${t("labClose")}</button></div></div>`);
    this.bookNode.querySelector("#labBookClose").onclick = () => { sfx.click(); this.bookOpen = false; this.bookNode?.remove(); this.bookNode = null; };
    document.body.appendChild(this.bookNode);
  },
  combine(sourceId, targetId, targetPoint) {
    const combination = labCombinationResult(sourceId, targetId), resultId = combination.id;
    this.history.set(combination.key, resultId);
    const isNew = !this.found.has(resultId);
    this.found.add(resultId);
    // Infinite Craft only interrupts you for a genuinely NEW discovery — a
    // combo landing on something you already have just merges quietly on
    // the canvas (the resulting tag already shows its name), no popup.
    if (isNew) { sfx.win(); this.showReveal(resultId); }
    else sfx.good();
    return resultId;
  },
  showReveal(resultId) {
    const info = LAB_ELEMENTS[resultId];
    const card = el(`<div class="lab-reveal new">
      <div class="lab-reveal-emo">${info.emoji}</div>
      <div class="lab-reveal-name">${info[lang].name}</div>
      <div class="lab-reveal-badge">${t("labNew")}</div>
      <div class="lab-reveal-fact">${info[lang].fact}</div>
    </div>`);
    document.body.appendChild(card);
    setTimeout(() => card.remove(), 2400);
  },
  release(layout, point) {
    if (!this.drag) return;
    if (!point) { this.drag = null; this.pinchLog = []; this.openSince = 0; this.grabReadyAt = performance.now() + 240; return; }
    const source = this.drag, targetIndex = this.hitWorkspace(point, source.type === "workspace" ? source.index : -1);
    if (targetIndex >= 0) {
      const target = this.workspace[targetIndex], result = this.combine(source.id, target.id, target);
      if (result) {
        if (source.type === "workspace") this.workspace = this.workspace.filter((_, i) => i !== source.index && i !== targetIndex);
        else this.workspace.splice(targetIndex, 1);
        this.workspace.push({ id: result, x: target.x, y: target.y });
      }
    } else if (source.type === "library") {
      this.workspace.push({ id: source.id, ...this.clampToWorkbench(point, layout) });
    } else {
      this.workspace[source.index] = { id: source.id, ...this.clampToWorkbench(point, layout) };
    }
    this.drag = null; this.pinchLog = []; this.openSince = 0; this.grabReadyAt = performance.now() + 240;
  },
  onFrame(dt) {
    if (!this.running || this.bookOpen) return;
    const layout = this.layout(), pinch = pinchState(), now = performance.now(), raw = pinch?.center || null;
    this.workspace.forEach((item, index) => {
      if (this.drag?.type === "workspace" && this.drag.index === index) return;
      Object.assign(item, this.clampToWorkbench(item, layout));
    });
    if (raw) {
      const k = 1 - Math.pow(1e-10, dt);
      if (!this.cursorPos) this.cursorPos = { ...raw };
      else { this.cursorPos.x += (raw.x - this.cursorPos.x) * k; this.cursorPos.y += (raw.y - this.cursorPos.y) * k; }
    } else this.cursorPos = null;
    const cursor = this.cursorPos;
    if (pinch) this.pinchLog.push({ t: now, v: pinch.pinch, point: { ...pinch.center } });
    while (this.pinchLog.length && now - this.pinchLog[0].t > 150) this.pinchLog.shift();

    if (!this.drag && now >= this.grabReadyAt) {
      const closed = this.pinchLog.reduce((best, sample) => !best || sample.v < best.v ? sample : best, null);
      if (closed && closed.v < .46) {
        const workIndex = this.hitWorkspace(closed.point);
        if (workIndex >= 0) this.drag = { type: "workspace", index: workIndex, id: this.workspace[workIndex].id, origin: { ...this.workspace[workIndex] } };
        else {
          const libraryIndex = this.hitLibrary(layout, closed.point);
          if (libraryIndex >= 0) this.drag = { type: "library", index: libraryIndex, id: layout.items[libraryIndex] };
        }
        if (this.drag) { sfx.click(); this.openSince = 0; }
      }
    } else if (!pinch || pinch.pinch > .60) {
      this.openSince = this.openSince || now;
      if (now - this.openSince > 70) this.release(layout, pinch?.center || this.cursorPos || this.drag.origin);
    } else this.openSince = 0;

    let dwell = null;
    if (!this.drag) {
      const workspaceIndex = this.hitWorkspace(cursor);
      if (workspaceIndex >= 0) dwell = { key: `w${workspaceIndex}`, item: this.workspace[workspaceIndex] };
      else { const libraryIndex = this.hitLibrary(layout, cursor); if (libraryIndex >= 0) { const p = this.libraryPos(libraryIndex, layout); dwell = { key: `l${libraryIndex}`, item: { id: layout.items[libraryIndex], ...p } }; } }
    }
    if (dwell?.key !== this.dwellKey) { this.dwellKey = dwell?.key || ""; this.dwellSince = dwell ? now : 0; }

    ctx.save();
    // No camera feed in Hand Lab — a flat workbench backdrop instead, with the
    // player's own hand rendered as a robot hand further down.
    const bgGrad = ctx.createLinearGradient(0, 0, 0, innerHeight);
    bgGrad.addColorStop(0, "#f8fafc"); bgGrad.addColorStop(1, "#e2e8f0");
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, innerWidth, innerHeight);
    // A quiet constellation field gives the free canvas the same open, calm
    // feeling as Infinite Craft without competing with the hand-controlled tags.
    ctx.save(); ctx.beginPath(); ctx.rect(layout.workspace.x, layout.workspace.y, layout.workspace.w, layout.workspace.h); ctx.clip();
    ctx.strokeStyle = "rgba(100,116,139,.11)"; ctx.fillStyle = "rgba(71,85,105,.18)"; ctx.lineWidth = 1;
    for (let i = 0; i < 26; i++) {
      const x = layout.workspace.x + ((Math.sin(i * 91.7) + 1) / 2) * layout.workspace.w;
      const y = layout.workspace.y + ((Math.sin(i * 47.3 + 1.5) + 1) / 2) * layout.workspace.h;
      const x2 = layout.workspace.x + ((Math.sin((i + 7) * 91.7) + 1) / 2) * layout.workspace.w;
      const y2 = layout.workspace.y + ((Math.sin((i + 7) * 47.3 + 1.5) + 1) / 2) * layout.workspace.h;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, i % 5 === 0 ? 3 : 1.7, 0, 7); ctx.fill();
    }
    ctx.restore();
    ctx.fillStyle = "#111827"; ctx.font = "900 15px system-ui"; ctx.textAlign = "center";
    ctx.fillText("HAND LAB", layout.workspace.x + layout.workspace.w / 2, layout.workspace.y + 26);
    ctx.font = "700 11px system-ui"; ctx.fillStyle = "#64748b";
    ctx.fillText(t("labSlotHint"), layout.workspace.x + layout.workspace.w / 2, layout.workspace.y + 45);
    ctx.font = "800 10px system-ui"; ctx.fillStyle = "rgba(15,118,110,.9)";
    ctx.fillText(`● ${t("labCamera")}`, layout.workspace.x + layout.workspace.w / 2, layout.workspace.y + 62);
    if (engine.hand) drawRobotHand(engine.hand);
    else { ctx.font = "700 13px system-ui"; ctx.fillStyle = "#94a3b8"; ctx.fillText(t("handLost"), layout.workspace.x + layout.workspace.w / 2, layout.workspace.y + layout.workspace.h / 2); }
    const targetIndex = this.drag ? this.hitWorkspace(cursor, this.drag.type === "workspace" ? this.drag.index : -1) : -1;
    this.workspace.forEach((item, index) => { if (this.drag?.type === "workspace" && this.drag.index === index) return; this.drawTag(item.x, item.y, item.id, { target: index === targetIndex }); });
    if (this.drag && cursor) this.drawTag(cursor.x, cursor.y, this.drag.id, { alpha: .96, target: targetIndex >= 0 });

    ctx.fillStyle = "rgba(255,255,255,.88)"; ctx.strokeStyle = "rgba(148,163,184,.72)"; ctx.lineWidth = 1.5;
    ctx.fillRect(layout.library.x, layout.library.y, layout.library.w, layout.library.h);
    ctx.beginPath(); ctx.rect(layout.library.x, layout.library.y, layout.library.w, layout.library.h); ctx.stroke();
    ctx.fillStyle = "rgba(241,245,249,.95)"; ctx.beginPath(); ctx.roundRect(layout.library.x + 11, layout.library.y + 12, layout.library.w - 22, 27, 9); ctx.fill();
    ctx.font = "800 12px system-ui"; ctx.textAlign = "left"; ctx.fillStyle = "#0f172a";
    // Title and counter are drawn from opposite edges so a long translated
    // label can never push the count off the panel.
    ctx.fillText(t("labShelf"), layout.library.x + 22, layout.library.y + 30);
    ctx.textAlign = "right";
    ctx.fillStyle = "#7c3aed";
    ctx.fillText(`${this.found.size}/${LAB_TOTAL}`, layout.library.x + layout.library.w - 22, layout.library.y + 30);
    layout.items.forEach((id, index) => { const p = this.libraryPos(index, layout); this.drawTag(p.x, p.y, id, { compact: true }); });
    if (dwell && now - this.dwellSince > 500) this.drawFact(dwell.item.x, dwell.item.y, dwell.item.id, layout);
    if (pinch) {
      const closed = pinch.pinch < .5, color = closed ? "#a855f7" : "#0891b2";
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3; ctx.shadowColor = color; ctx.shadowBlur = 15;
      ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(pinch.thumb.x, pinch.thumb.y); ctx.lineTo(pinch.index.x, pinch.index.y); ctx.stroke(); ctx.setLineDash([]);
      [pinch.thumb, pinch.index].forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, 7); ctx.stroke(); });
      ctx.beginPath(); ctx.arc(pinch.center.x, pinch.center.y, closed ? 7 : 5, 0, 7); ctx.fill();
    }
    ctx.restore();
  },
};

/* ---------------- top bar ---------------- */
document.getElementById("langBtn").onclick = () => {
  lang = lang === "en" ? "bm" : "en";
  localStorage.setItem("ha-lang", lang);
  document.getElementById("langBtn").textContent = t("langBtn");
  ui.classList.remove("passthrough");
  menu();
};
document.getElementById("soundBtn").onclick = () => {
  soundOn = !soundOn;
  localStorage.setItem("ha-sound", soundOn ? "on" : "off");
  document.getElementById("soundBtn").textContent = soundOn ? "🔊" : "🔇";
  if (soundOn) sfx.click();
};
document.getElementById("langBtn").textContent = t("langBtn");
document.getElementById("soundBtn").textContent = soundOn ? "🔊" : "🔇";

/* ---------------- PWA ---------------- */
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

/* Install banner: this app is only genuinely offline-ready once it's added
   to the home screen, and that's a one-time step the booth operator (or an
   interested teacher) needs to be told about, since browsers bury it —
   especially iOS Safari, which has no install-prompt API at all. */
(function setupInstallBanner() {
  const KEY = "ha-install-dismissed";
  if (localStorage.getItem(KEY)) return;
  if (window.matchMedia("(display-mode: standalone)").matches || navigator.standalone) return;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  let deferredPrompt = null;

  function showBanner(iosMode) {
    if (document.getElementById("installBanner")) return;
    const banner = el(`<div class="install-banner" id="installBanner">
      <span>${iosMode ? "📲 Tap Share ⬆️ then \"Add to Home Screen\" for full-screen offline play" : "📲 Install this app for full-screen offline play"}</span>
      ${iosMode ? "" : `<button class="chip" id="installBtn">Install</button>`}
      <button class="chip" id="installDismiss" aria-label="dismiss">✕</button>
    </div>`);
    document.body.appendChild(banner);
    if (!iosMode) {
      banner.querySelector("#installBtn").onclick = async () => {
        banner.remove();
        if (deferredPrompt) { deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; }
      };
    }
    banner.querySelector("#installDismiss").onclick = () => { localStorage.setItem(KEY, "1"); banner.remove(); };
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showBanner(false);
  });
  if (isIOS) showBanner(true);
})();

/* debug hook (harmless in production) */
window.__ha = { engine, NINJA, BATTLE, SNAKE, BLAST, LAB, ctx, step: (dt) => activeGame && activeGame.onFrame && activeGame.onFrame(dt || 1 / 60) };

menu();
