/* ================= AI HAND ARCADE =================
   3 games powered by one hand-tracking AI (MediaPipe, runs 100% on-device):
   - Air Ninja: slice bugs with your fingertip
   - Gesture Battle: rock-paper-scissors vs a pattern-learning AI
   - Sign Speller: learn sign-language letters
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
    ninjaDesc: "Slice the bugs with your finger — in the air!",
    battleTitle: "Gesture Battle",
    battleDesc: "Rock-paper-scissors vs an AI that learns your mind",
    signTitle: "Sign Speller",
    signDesc: "Learn real sign language — the AI checks your hand",
    madeWith: "PWA · AI runs on this device · no internet needed",
    loading: "Waking up the AI brain… 🧠",
    loadingCam: "Turning on the camera… 📷",
    camFail: "Camera blocked! Allow camera access in your browser settings, then reload.",
    aiFail: "Could not load the AI. Reload the page to try again.",
    start: "START ▶",
    back: "MENU",
    again: "PLAY AGAIN ↺",
    // ninja
    ninjaHow: "Bugs are attacking the system! 🐛 Move your POINTER FINGER in the air to slice them. Avoid the bombs 💣!",
    score: "Score", time: "Time", combo: "Combo", best: "Best",
    debugged: "SYSTEM DEBUGGED!",
    newBest: "🎉 NEW HIGH SCORE!",
    ninjaRanks: ["🥷 BUG NINJA MASTER", "⚔️ CODE WARRIOR", "🐣 BUG CATCHER"],
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
    // sign
    signHow: "Learn supported static ASL handshapes with live AI feedback.",
    freeMode: "🔍 FREE PRACTICE", spellMode: "🎯 SPELL WORDS", phraseMode: "💬 SIMPLE PHRASES",
    freeExplain: "What is Free Practice? Show any supported sign and the AI tells you what it sees. No score, no timer — just experiment.",
    spellExplain: "Follow a real hand photo and hold each letter to spell short words.",
    phraseExplain: "Perform each phrase for the camera. The AI waits, checks every step, and only passes a correct sign.",
    aslNotice: "ASL (American Sign Language) practice · static hand AI",
    freeHint: "AI-supported: A B D F I L O U V W Y · I LOVE YOU · HI",
    sensorTip: "Palm toward camera · show your wrist · hold steady",
    confidence: n => `${n}% match`,
    holdIt: "Hold it…",
    keepTrying: "Not matched yet — adjust your hand and keep trying.",
    handLost: "Show your full hand inside the camera.",
    phraseWaiting: "Waiting for the correct sign…",
    phraseStep: (n, total, text) => `Step ${n}/${total}: ${text}`,
    phraseSteps: {
      ILY: ["Show 🤟 and hold it steady"],
      HI: ["Open your palm", "Wave your hand left and right"],
      MISS: ["Point to yourself", "Touch near your chin", "Point toward the other person"],
      NAME: ["Place a flat hand on your chest", "Show two H handshapes", "Tap the two H handshapes together twice"],
    },
    signGot: "✔ GOT IT!",
    spellDone: (w) => `You spelled ${w} in sign language! 🎉`,
    wordsDone: "🏆 ALL WORDS DONE! You're a sign master!",
    skipLetter: "skip »",
    detected: "I see…",
    tryAi: "TRY WITH AI",
    guidedPractice: "GUIDED PRACTICE",
    donePractice: "DONE / BACK TO PHRASES",
    phraseSuccess: p => `Great! You signed “${p}”`,
    phraseGuideMiss: "Point to yourself → touch your chin with your index finger → point to the other person.",
    phraseGuideName: "Place a flat hand on your chest for MY → tap two H-handshapes together twice for NAME → fingerspell your name.",
    phraseLove: "I LOVE YOU",
    phraseHi: "HI",
    phraseMiss: "I MISS YOU",
    phraseName: "MY NAME IS…",
    photoCredit: "Photo credits",
    hints: {
      A: "Fist ✊", B: "4 fingers up, thumb tucked", D: "Point up ☝️", F: "OK sign 👌",
      I: "Little finger only", L: "Thumb + pointer, like L", O: "All fingertips touch thumb, round O",
      U: "2 fingers together", V: "Peace sign ✌️ spread", W: "3 fingers up", Y: "Thumb + pinky 🤙",
      ILY: "🤟 thumb + pointer + pinky", HI: "Open hand 🖐",
    },
    // snake
    snakeTitle: "Hand Snake",
    snakeDesc: "Your finger is the snake — eat, grow, survive!",
    snakeHow: "Move your INDEX FINGER to steer the snake 🐍 Eat the glowing food to grow longer. Don't crash into yourself!",
    snakeRanks: ["🐍 SERPENT KING", "🔥 VENOM STRIKER", "🐛 BABY WORM"],
    length: "Length",
    gameOver: "GAME OVER",
    reset: "RESET",
    // blast
    blastTitle: "Block Blast",
    blastDesc: "Pinch, drag and drop blocks — clear rows to score!",
    blastHow: "Hover over a block, PINCH 👌 to grab it. Drag onto the grid and release to place. Fill a row or column to clear it! 🧱",
    lines: "Lines",
    noMoves: "NO MOVES LEFT!",
    blastRanks: ["🧱 BLOCK MASTER", "⚡ LINE BREAKER", "🔰 STACKER"],
    pinchHint: "👌 PINCH to grab · release to place",
  },
  bm: {
    langBtn: "EN",
    title: "ARKED TANGAN AI",
    tagline: "AI kamera nampak tangan anda. Tak boleh sentuh skrin! 🖐️",
    ninjaTitle: "Air Ninja",
    ninjaDesc: "Tetak pepijat dengan jari — di udara!",
    battleTitle: "Gesture Battle",
    battleDesc: "Batu-kertas-gunting lawan AI yang belajar corak anda",
    signTitle: "Sign Speller",
    signDesc: "Belajar bahasa isyarat sebenar — AI semak tangan anda",
    madeWith: "PWA · AI berjalan pada peranti ini · tiada internet diperlukan",
    loading: "Mengejutkan otak AI… 🧠",
    loadingCam: "Menghidupkan kamera… 📷",
    camFail: "Kamera disekat! Benarkan akses kamera dalam tetapan pelayar, kemudian muat semula.",
    aiFail: "AI gagal dimuatkan. Muat semula halaman untuk cuba lagi.",
    start: "MULA ▶",
    back: "MENU",
    again: "MAIN LAGI ↺",
    ninjaHow: "Pepijat menyerang sistem! 🐛 Gerakkan JARI TELUNJUK di udara untuk menetaknya. Elakkan bom 💣!",
    score: "Skor", time: "Masa", combo: "Combo", best: "Terbaik",
    debugged: "SISTEM DIBAIKI!",
    newBest: "🎉 REKOD BARU!",
    ninjaRanks: ["🥷 NINJA PEPIJAT", "⚔️ PAHLAWAN KOD", "🐣 PENANGKAP PEPIJAT"],
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
    signHow: "Belajar bentuk tangan ASL statik yang disokong dengan maklum balas AI.",
    freeMode: "🔍 LATIHAN BEBAS", spellMode: "🎯 EJA PERKATAAN", phraseMode: "💬 FRASA MUDAH",
    freeExplain: "Apa itu Latihan Bebas? Tunjuk mana-mana isyarat yang disokong dan AI beritahu apa yang dilihat. Tiada skor atau masa.",
    spellExplain: "Ikut foto tangan sebenar dan tahan setiap huruf untuk mengeja perkataan pendek.",
    phraseExplain: "Lakukan setiap frasa di depan kamera. AI menunggu, menyemak setiap langkah dan hanya menerima isyarat yang betul.",
    aslNotice: "Latihan ASL (Bahasa Isyarat Amerika) · AI tangan statik",
    freeHint: "Disokong AI: A B D F I L O U V W Y · SAYA SAYANG AWAK · HAI",
    sensorTip: "Tapak tangan ke kamera · tunjuk pergelangan · tahan stabil",
    confidence: n => `${n}% padan`,
    holdIt: "Tahan…",
    keepTrying: "Belum tepat — laraskan tangan dan terus cuba.",
    handLost: "Tunjukkan seluruh tangan di dalam kamera.",
    phraseWaiting: "Menunggu isyarat yang betul…",
    phraseStep: (n, total, text) => `Langkah ${n}/${total}: ${text}`,
    phraseSteps: {
      ILY: ["Tunjukkan 🤟 dan tahan dengan stabil"],
      HI: ["Buka tapak tangan", "Lambai tangan ke kiri dan kanan"],
      MISS: ["Tuding diri sendiri", "Sentuh berhampiran dagu", "Tuding ke arah orang lain"],
      NAME: ["Letak tapak tangan rata di dada", "Tunjukkan dua bentuk tangan H", "Ketuk dua bentuk tangan H bersama dua kali"],
    },
    signGot: "✔ BETUL!",
    spellDone: (w) => `Anda mengeja ${w} dalam bahasa isyarat! 🎉`,
    wordsDone: "🏆 SEMUA PERKATAAN SIAP! Anda mahir isyarat!",
    skipLetter: "langkau »",
    detected: "Saya nampak…",
    tryAi: "CUBA DENGAN AI",
    guidedPractice: "LATIHAN BERPANDU",
    donePractice: "SIAP / KEMBALI KE FRASA",
    phraseSuccess: p => `Hebat! Anda tunjuk “${p}”`,
    phraseGuideMiss: "Tuding diri sendiri → sentuh dagu dengan jari telunjuk → tuding orang di hadapan.",
    phraseGuideName: "Letak tapak tangan rata di dada untuk SAYA → ketuk dua bentuk tangan H dua kali untuk NAMA → eja nama anda.",
    phraseLove: "SAYA SAYANG AWAK",
    phraseHi: "HAI",
    phraseMiss: "SAYA RINDU AWAK",
    phraseName: "NAMA SAYA…",
    photoCredit: "Kredit foto",
    hints: {
      A: "Genggam ✊", B: "4 jari tegak, ibu jari lipat", D: "Tuding ke atas ☝️", F: "Isyarat OK 👌",
      I: "Jari kelingking sahaja", L: "Ibu jari + telunjuk, macam L", O: "Semua hujung jari sentuh ibu jari, bentuk O",
      U: "2 jari rapat", V: "Isyarat peace ✌️ jarak", W: "3 jari tegak", Y: "Ibu jari + kelingking 🤙",
      ILY: "🤟 ibu jari + telunjuk + kelingking", HI: "Tangan terbuka 🖐",
    },
    // snake
    snakeTitle: "Ular Tangan",
    snakeDesc: "Jari anda ialah ular — makan, membesar, bertahan!",
    snakeHow: "Gerakkan JARI TELUNJUK untuk mengawal ular 🐍 Makan makanan bercahaya untuk membesar. Jangan langgar diri sendiri!",
    snakeRanks: ["🐍 RAJA ULAR", "🔥 PENYERANG BISA", "🐛 ULAT KECIL"],
    length: "Panjang",
    gameOver: "TAMAT!",
    reset: "RESET",
    // blast
    blastTitle: "Block Blast",
    blastDesc: "Cubit, seret dan letak blok — kosongkan baris untuk skor!",
    blastHow: "Tuding ke atas blok, CUBIT 👌 untuk mengambilnya. Seret ke grid dan lepaskan untuk meletakkan. Penuhkan baris atau lajur untuk mengosongkannya! 🧱",
    lines: "Baris",
    noMoves: "TIADA LANGKAH LAGI!",
    blastRanks: ["🧱 TUAN BLOK", "⚡ PEMECAH BARIS", "🔰 PENYUSUN"],
    pinchHint: "👌 CUBIT untuk ambil · lepas untuk letak",
  },
};
let lang = localStorage.getItem("ha-lang") || "en";
const t = (k) => STR[lang][k];
const aslCreditsHtml = () => `<div class="asl-credits">${t("photoCredit")}:
  <a href="https://www.lifeprint.com/asl101/fingerspelling/" target="_blank" rel="noreferrer">ASL alphabet © William Vicars / Lifeprint</a> ·
  <a href="https://commons.wikimedia.org/wiki/File:Ily.jpg" target="_blank" rel="noreferrer">ILY: Rico38, public domain</a> ·
  <a href="https://commons.wikimedia.org/wiki/File:ChocHello.jpg" target="_blank" rel="noreferrer">Hello: Loran Davis, CC BY 3.0</a>
</div>`;

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
const sfx = {
  click: () => beep(520, 0.05),
  slice: () => beep(880 + Math.random() * 300, 0.06, "sawtooth", 0.05),
  bomb: () => { beep(120, 0.3, "sawtooth", 0.09); },
  good: () => { beep(660, 0.09); setTimeout(() => beep(880, 0.12), 90); },
  bad: () => beep(160, 0.25, "sawtooth", 0.07),
  count: () => beep(440, 0.1, "sine", 0.07),
  go: () => beep(880, 0.2, "sine", 0.08),
  win: () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => beep(f, 0.16, "triangle", 0.08), i * 130)); },
  tick: () => beep(1200, 0.02, "sine", 0.02),
};

/* ---------------- DOM ---------------- */
const ui = document.getElementById("ui");
const cam = document.getElementById("cam");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const homeBtn = document.getElementById("homeBtn");
const handStatus = document.getElementById("handStatus");

function resize() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
resize();
addEventListener("resize", resize);

const el = (html) => { const d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; };
function show(node) { ui.innerHTML = ""; if (node) { ui.appendChild(node); node.classList.add("fade-in"); } }

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
        minHandDetectionConfidence: 0.62,
        minHandPresenceConfidence: 0.62,
        minTrackingConfidence: 0.60,
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
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30, min: 24 },
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
        const wristMotion = dist(raw[0], this.norm[0]);
        const alpha = Math.max(0.38, Math.min(0.82, 0.38 + wristMotion * 4.5));
        this.norm = raw.map((p, i) => ({
          x: this.norm[i].x + (p.x - this.norm[i].x) * alpha,
          y: this.norm[i].y + (p.y - this.norm[i].y) * alpha,
          z: this.norm[i].z + (p.z - this.norm[i].z) * alpha,
        }));
      }
      const toScreen = hand => hand.map(p => ({ x: p.x * dw + ox, y: p.y * dh + oy, z: p.z }));
      this.handsNorm = rawHands;
      this.hands = rawHands.map(toScreen);
      this.hand = toScreen(this.norm);
      this.lastSeenAt = performance.now();
    } else if (performance.now() - this.lastSeenAt > 140) {
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

/* ---------------- hand maths ---------------- */
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
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
const clamp01 = value => Math.max(0, Math.min(1, value));
function fingerFeatures(lms) {
  const hs = dist(lms[0], lms[9]) || 1e-6;
  const openness = (mcp, pip, tip) => {
    const straight = clamp01((jointAngle(lms[mcp], lms[pip], lms[tip]) - 100) / 62);
    const reachRatio = dist(lms[tip], lms[0]) / (dist(lms[pip], lms[0]) || 1e-6);
    return straight * 0.62 + clamp01((reachRatio - 0.88) / 0.30) * 0.38;
  };
  const thumbStraight = clamp01((jointAngle(lms[2], lms[3], lms[4]) - 105) / 55);
  const thumbReach = clamp01((dist(lms[4], lms[5]) / hs - 0.42) / 0.62);
  return {
    i: openness(5, 6, 8),
    m: openness(9, 10, 12),
    r: openness(13, 14, 16),
    p: openness(17, 18, 20),
    thumb: thumbStraight * 0.55 + thumbReach * 0.45,
    pinchClose: 1 - clamp01((dist(lms[4], lms[8]) / hs - 0.18) / 0.52),
    midClose: 1 - clamp01((dist(lms[4], lms[12]) / hs - 0.22) / 0.58),
    spreadClose: 1 - clamp01((dist(lms[8], lms[12]) / hs - 0.12) / 0.36),
    spreadWide: clamp01((dist(lms[8], lms[12]) / hs - 0.22) / 0.40),
  };
}
function patternScore(features, wanted) {
  const keys = ["i", "m", "r", "p"];
  return keys.reduce((total, key, index) =>
    total + (wanted[index] ? features[key] : 1 - features[key]), 0) / keys.length;
}
function signScores(lms) {
  const f = fingerFeatures(lms);
  const down = patternScore(f, [0, 0, 0, 0]);
  const one = patternScore(f, [1, 0, 0, 0]);
  const pinky = patternScore(f, [0, 0, 0, 1]);
  const two = patternScore(f, [1, 1, 0, 0]);
  const open = patternScore(f, [1, 1, 1, 1]);
  return {
    A: down * 0.82 + (1 - f.pinchClose) * 0.18,
    B: open * 0.76 + (1 - f.thumb) * 0.24,
    D: one * 0.80 + (1 - f.thumb) * 0.20,
    F: patternScore(f, [0, 1, 1, 1]) * 0.66 + f.pinchClose * 0.34,
    I: pinky * 0.82 + (1 - f.thumb) * 0.18,
    L: one * 0.74 + f.thumb * 0.26,
    O: down * 0.45 + f.pinchClose * 0.32 + f.midClose * 0.23,
    U: two * 0.76 + f.spreadClose * 0.24,
    V: two * 0.72 + f.spreadWide * 0.28,
    W: patternScore(f, [1, 1, 1, 0]) * 0.88 + (1 - f.p) * 0.12,
    Y: pinky * 0.72 + f.thumb * 0.28,
    ILY: patternScore(f, [1, 0, 0, 1]) * 0.72 + f.thumb * 0.28,
    HI: open * 0.74 + f.thumb * 0.26,
  };
}
function signReading(lms) {
  const scores = signScores(lms);
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [sign, confidence] = ranked[0];
  return { sign: confidence >= 0.64 ? sign : null, confidence, scores };
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
  handStatus.classList.add("hidden");
}

/* ---------------- screens ---------------- */
function menu() {
  stopGame();
  const node = el(`<div style="margin:auto;width:100%">
    <h1 class="arcade">${t("title")}</h1>
    <div class="tagline">${t("tagline")}</div>
    <div class="cards">
      <div class="card ninja" id="cNinja">
        <div class="emo">🥷</div>
        <div><h3>${t("ninjaTitle")} <span style="font-size:14px">🐛</span></h3><p>${t("ninjaDesc")}</p></div>
      </div>
      <div class="card battle" id="cBattle">
        <div class="emo">✊</div>
        <div><h3>${t("battleTitle")} <span style="font-size:14px">🧠</span></h3><p>${t("battleDesc")}</p></div>
      </div>
      <div class="card sign" id="cSign">
        <div class="emo">🤟</div>
        <div><h3>${t("signTitle")} <span style="font-size:14px">📖</span></h3><p>${t("signDesc")}</p></div>
      </div>
      <div class="card snake" id="cSnake">
        <div class="emo">🐍</div>
        <div><h3>${t("snakeTitle")} <span style="font-size:14px">🎮</span></h3><p>${t("snakeDesc")}</p></div>
      </div>
      <div class="card blast" id="cBlast">
        <div class="emo">🧱</div>
        <div><h3>${t("blastTitle")} <span style="font-size:14px">🧩</span></h3><p>${t("blastDesc")}</p></div>
      </div>
    </div>
    <div class="made-with">🤖 ${t("madeWith")}</div>
  </div>`);
  node.querySelector("#cNinja").onclick = () => { sfx.click(); intro(NINJA); };
  node.querySelector("#cBattle").onclick = () => { sfx.click(); intro(BATTLE); };
  node.querySelector("#cSign").onclick = () => { sfx.click(); intro(SIGN); };
  node.querySelector("#cSnake").onclick = () => { sfx.click(); intro(SNAKE); };
  node.querySelector("#cBlast").onclick = () => { sfx.click(); intro(BLAST); };
  show(node);
}

async function intro(game) {
  const node = el(`<div class="panel">
    <div class="big-emoji">${game.emoji}</div>
    <h2>${t(game.titleKey)}</h2>
    <div class="desc">${t(game.howKey)}</div>
    <div id="loadArea"></div>
    <button class="btn" id="startBtn">${t("start")}</button>
    <br><button class="btn ghost" id="backBtn" style="font-size:15px;padding:10px 24px">← ${t("back")}</button>
  </div>`);
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
    show(null);
    ui.classList.add("passthrough");
    activeGame = game;
    game.start();
  };
  show(node);
}

homeBtn.onclick = () => { sfx.click(); ui.classList.remove("passthrough"); menu(); };

/* ================================================
   GAME 1 : AIR NINJA
================================================ */
const BUGS = ["🐛", "🐞", "🦠", "👾", "🕷️"];
const NINJA = {
  emoji: "🥷", titleKey: "ninjaTitle", howKey: "ninjaHow",
  objs: [], parts: [], trail: [], score: 0, combo: 0, comboT: 0, timeLeft: 60,
  spawnT: 0, running: false, hud: null, floaties: [], shake: 0, comboBanner: null,
  lastTipAt: 0,

  start() {
    this.objs = []; this.parts = []; this.trail = []; this.floaties = [];
    this.score = 0; this.combo = 0; this.timeLeft = 60; this.spawnT = 0.5; this.shake = 0;
    this.lastTipAt = 0; this.running = true;
    this.hud = el(`<div class="hud">
      <div class="stat"><div class="lbl">${t("score")}</div><div class="num cyan" id="nScore">0</div></div>
      <div class="stat"><div class="lbl">${t("time")}</div><div class="num amber" id="nTime">60</div></div>
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

  spawn() {
    const isBomb = Math.random() < 0.16;
    const x = 60 + Math.random() * (innerWidth - 120);
    this.objs.push({
      emoji: isBomb ? "💣" : BUGS[Math.floor(Math.random() * BUGS.length)],
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
    /* timer */
    this.timeLeft -= dt;
    if (this.timeLeft <= 0) return this.end();
    this.hud.querySelector("#nTime").textContent = Math.ceil(this.timeLeft);
    this.shake = Math.max(0, this.shake - dt * 34);
    ctx.save();
    if (this.shake > 0) ctx.translate((Math.random() - .5) * this.shake, (Math.random() - .5) * this.shake);

    /* animated speed lines make the camera view feel like an arcade arena */
    ctx.save();
    ctx.globalAlpha = .12 + (60 - this.timeLeft) / 600;
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

    /* spawn — speeds up over time */
    this.spawnT -= dt;
    if (this.spawnT <= 0) {
      const wave = 1 + Math.floor(Math.random() * (this.timeLeft < 30 ? 3 : 2));
      for (let i = 0; i < wave; i++) setTimeout(() => this.running && this.spawn(), i * 140);
      this.spawnT = this.timeLeft < 20 ? 0.75 : this.timeLeft < 40 ? 0.95 : 1.2;
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
    this.trail = this.trail.filter(p => nowT - p.t < 260);

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
    this.objs = this.objs.filter(o => o.y < innerHeight + 120 && !o.sliced);

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
    this.parts = this.parts.filter(p => p.life > 0);

    /* score floaties */
    this.floaties.forEach(f => {
      f.y -= 60 * dt; f.life -= dt;
      ctx.globalAlpha = Math.max(0, f.life);
      ctx.font = "bold 26px sans-serif"; ctx.textAlign = "center";
      ctx.fillStyle = f.color; ctx.shadowColor = f.color; ctx.shadowBlur = 12;
      ctx.fillText(f.text, f.x, f.y);
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    });
    this.floaties = this.floaties.filter(f => f.life > 0);

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
      ctx.save();
      ctx.strokeStyle = "rgba(34,211,238,.7)";
      ctx.lineWidth = 3;
      ctx.fillStyle = "#fff"; ctx.shadowColor = "#22d3ee"; ctx.shadowBlur = 24;
      ctx.beginPath(); ctx.arc(tip.x, tip.y, 22 + Math.sin(nowT / 90) * 2, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.arc(tip.x, tip.y, 10, 0, 7); ctx.fill();
      ctx.restore();
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
  emoji: "🧠", titleKey: "battleTitle", howKey: "battleHow",
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
    drawSkeleton(engine.hand);
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
   GAME 3 : SIGN SPELLER
================================================ */
const SIGN_WORDS = ["AI", "LAB", "WAU", "DUA", "UBI", "BOLA", "WIFI", "YOYO", "ABU", "VIVA", "LAWA", "BUDI"];
const SIGN_EMO = { ILY: "🤟", HI: "🖐" };
const SIGN_PHOTO_POS = {
  A: "-14px -7px", B: "-191px -7px", D: "-543px -7px", F: "-100px -107px",
  I: "-614px -79px", L: "-343px -229px", O: "-93px -343px", U: "-343px -429px",
  V: "-507px -426px", W: "-700px -414px", Y: "-264px -550px",
};
const SIGN = {
  emoji: "🤟", titleKey: "signTitle", howKey: "signHow",
  mode: null, wordIdx: 0, letterIdx: 0, holdT: 0, current: null, lockUntil: 0,
  dom: [], phraseTarget: null, phraseTitle: "", phrasePhoto: "", phrase: null,
  signSamples: [], phraseStep: 0, phraseState: null,
  latestScores: {}, targetSince: 0, targetFrames: 0,

  start() {
    this.clearDom();
    ui.classList.remove("passthrough");
    const node = el(`<div class="panel">
      <div class="big-emoji">🤟</div>
      <h2>${t("signTitle")}</h2>
      <div class="desc">${t("signHow")}</div>
      <div class="sign-mode-list">
        <button class="sign-mode" id="freeBtn"><b>${t("freeMode")}</b><span>${t("freeExplain")}</span></button>
        <button class="sign-mode" id="spellBtn"><b>${t("spellMode")}</b><span>${t("spellExplain")}</span></button>
        <button class="sign-mode phrase" id="phraseBtn"><b>${t("phraseMode")}</b><span>${t("phraseExplain")}</span></button>
      </div>
      <div class="asl-notice">${t("aslNotice")}</div>
      ${aslCreditsHtml()}
      <br><button class="btn ghost" id="menuBtn" style="font-size:15px;padding:10px 24px">← ${t("back")}</button>
    </div>`);
    node.querySelector("#freeBtn").onclick = () => { sfx.click(); this.begin("free"); };
    node.querySelector("#spellBtn").onclick = () => { sfx.click(); this.wordIdx = 0; this.begin("spell"); };
    node.querySelector("#phraseBtn").onclick = () => { sfx.click(); this.phraseMenu(); };
    node.querySelector("#menuBtn").onclick = () => { sfx.click(); menu(); };
    show(node);
  },
  phraseMenu() {
    this.clearDom();
    this.mode = null;
    ui.classList.remove("passthrough");
    const phrases = [
      { key: "ILY", kind: "static", title: t("phraseLove"), target: "ILY", photo: "assets/asl-i-love-you.jpg", action: t("tryAi") },
      { key: "HI", kind: "wave", title: t("phraseHi"), target: "HI", photo: "assets/asl-hello.jpg", action: t("tryAi") },
      { key: "MISS", kind: "miss", title: t("phraseMiss"), guide: t("phraseGuideMiss"), icon: "☝️", action: t("tryAi") },
      { key: "NAME", kind: "name", title: t("phraseName"), guide: t("phraseGuideName"), icon: "🤲", action: t("tryAi") },
    ];
    const node = el(`<div class="panel phrase-panel">
      <h2>${t("phraseMode")}</h2>
      <div class="desc">${t("phraseExplain")}</div>
      <div class="phrase-grid" id="phraseGrid"></div>
      <div class="asl-notice">${t("aslNotice")}</div>
      ${aslCreditsHtml()}
      <button class="btn ghost" id="backSign" style="font-size:15px;padding:10px 24px">← ${t("back")}</button>
    </div>`);
    const grid = node.querySelector("#phraseGrid");
    phrases.forEach((phrase) => {
      const card = el(`<button class="phrase-card">
        ${phrase.photo ? `<img src="${phrase.photo}" alt="${phrase.title} ASL reference">` : `<span class="phrase-icon">${phrase.icon}</span>`}
        <b>${phrase.title}</b>
        <small>${phrase.action}</small>
      </button>`);
      card.onclick = () => {
        sfx.click();
        this.beginPhrase(phrase);
      };
      grid.appendChild(card);
    });
    node.querySelector("#backSign").onclick = () => { sfx.click(); this.start(); };
    show(node);
  },
  beginPhrase(phrase) {
    this.mode = "phrase";
    this.phrase = phrase;
    this.phraseTarget = phrase.target;
    this.phraseTitle = phrase.title;
    this.phrasePhoto = phrase.photo;
    this.holdT = 0;
    this.current = null;
    this.signSamples = [];
    this.resetTargetConfirmation();
    this.phraseStep = 0;
    this.phraseState = {
      startedAt: performance.now(), lastX: null, minX: 1, maxX: 0,
      waveTravel: 0, touchCount: 0, touching: false,
    };
    show(null);
    ui.classList.add("passthrough");
    this.buildDom();
  },
  begin(mode) {
    this.mode = mode; this.letterIdx = 0; this.holdT = 0; this.current = null; this.signSamples = [];
    this.resetTargetConfirmation();
    show(null); ui.classList.add("passthrough");
    this.buildDom();
  },
  buildDom() {
    this.clearDom();
    const detect = el(`<div class="sign-detect">
      <div class="bubble"><span id="sLetter">…</span>
        <svg viewBox="0 0 120 120" width="100%" height="100%">
          <circle cx="60" cy="60" r="56" fill="none" stroke="rgba(163,230,53,.95)" stroke-width="6"
            stroke-dasharray="352" stroke-dashoffset="352" id="sRing" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="hint" id="sHint">${this.mode === "free" ? t("freeHint") : ""}</div>
      <div class="sign-confidence" id="sConfidence">${t("sensorTip")}</div>
    </div>`);
    document.body.appendChild(detect);
    this.dom.push(detect);
    if (this.mode === "free") {
      const freeRef = el(`<div class="free-reference">
        <div class="free-title">${t("freeMode")}</div>
        <img src="assets/asl-alphabet.jpg" alt="ASL alphabet hand reference">
        <div class="supported-signs">${t("freeHint")}</div>
        <div>${t("sensorTip")}</div>
      </div>`);
      document.body.appendChild(freeRef);
      this.dom.push(freeRef);
      const back = el(`<button class="chip sign-back">← ${t("back")}</button>`);
      back.onclick = () => { sfx.click(); this.start(); };
      document.body.appendChild(back);
      this.dom.push(back);
    } else if (this.mode === "spell") {
      const word = SIGN_WORDS[this.wordIdx];
      const bar = el(`<div class="spell-bar" id="spellBar"></div>`);
      [...word].forEach((ch, i) => bar.appendChild(el(`<div class="slot ${i === 0 ? "now" : ""}">${ch}</div>`)));
      document.body.appendChild(bar);
      this.dom.push(bar);
      const ref = el(`<div class="ref-hand">
        <div class="asl-photo" id="refPic" role="img"></div>
        <div class="cap" id="refCap"></div>
      </div>`);
      document.body.appendChild(ref);
      this.dom.push(ref);
      const skip = el(`<button class="chip" style="position:fixed;bottom:calc(20px + env(safe-area-inset-bottom));right:14px;z-index:26">${t("skipLetter")}</button>`);
      skip.onclick = () => { sfx.click(); this.advance(); };
      document.body.appendChild(skip);
      this.dom.push(skip);
      this.updateHint();
    } else if (this.mode === "phrase") {
      const steps = STR[lang].phraseSteps[this.phrase.key];
      const ref = el(`<div class="phrase-check-card">
        ${this.phrasePhoto
          ? `<img src="${this.phrasePhoto}" alt="${this.phraseTitle} ASL reference">`
          : `<div class="phrase-live-icon">${this.phrase.icon}</div>`}
        <strong>${this.phraseTitle}</strong>
        ${this.phrase.guide ? `<span>${this.phrase.guide}</span>` : ""}
        <ol class="phrase-steps" id="phraseSteps">
          ${steps.map((step, i) => `<li class="${i === 0 ? "active" : ""}">${step}</li>`).join("")}
        </ol>
        <div class="phrase-live-status" id="phraseStatus">${t("phraseWaiting")}</div>
        <div class="phrase-progress"><i id="phraseProgress"></i></div>
      </div>`);
      document.body.appendChild(ref);
      this.dom.push(ref);
      const back = el(`<button class="chip sign-back">← ${t("phraseMode")}</button>`);
      back.onclick = () => { sfx.click(); this.phraseMenu(); };
      document.body.appendChild(back);
      this.dom.push(back);
    }
  },
  clearDom() { this.dom.forEach(d => d.remove()); this.dom = []; },
  cleanup() { this.clearDom(); },

  targetLetter() { return this.mode === "phrase" ? this.phraseTarget : SIGN_WORDS[this.wordIdx][this.letterIdx]; },
  stableSign(raw) {
    if (engine.frameUpdated) {
      this.signSamples.push(raw);
      if (this.signSamples.length > 9) this.signSamples.shift();
    }
    const counts = {};
    this.signSamples.forEach(sign => { if (sign) counts[sign] = (counts[sign] || 0) + 1; });
    const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return ranked.length && ranked[0][1] >= 4 ? ranked[0][0] : null;
  },
  resetTargetConfirmation() {
    this.targetSince = 0;
    this.targetFrames = 0;
  },
  targetProgress(matches, now) {
    if (engine.frameUpdated) {
      if (matches) {
        if (!this.targetSince) this.targetSince = engine.frameAt || now;
        this.targetFrames++;
      } else {
        this.resetTargetConfirmation();
      }
    }
    if (!this.targetSince) return 0;
    return Math.min(1, (now - this.targetSince) / 1100);
  },
  setPhraseFeedback(progress, status) {
    const bar = document.getElementById("phraseProgress");
    const statusEl = document.getElementById("phraseStatus");
    const stepsEl = document.getElementById("phraseSteps");
    if (bar) bar.style.width = `${Math.max(0, Math.min(1, progress)) * 100}%`;
    if (statusEl) statusEl.textContent = status;
    if (stepsEl) [...stepsEl.children].forEach((li, i) => {
      li.classList.toggle("done", i < this.phraseStep);
      li.classList.toggle("active", i === this.phraseStep);
    });
  },
  nextPhraseStep() {
    this.phraseStep++;
    this.holdT = 0;
    this.signSamples = [];
    sfx.good();
  },
  phraseFrame(dt, sign) {
    const phrase = this.phrase;
    const steps = STR[lang].phraseSteps[phrase.key];
    const hand = engine.norm;
    if (!hand) {
      this.setPhraseFeedback(0, t("handLost"));
      return;
    }
    const f = fingerStates(hand);
    const stepText = () => t("phraseStep")(Math.min(this.phraseStep + 1, steps.length), steps.length, steps[Math.min(this.phraseStep, steps.length - 1)]);
    const holdMatch = (matched, seconds = 0.9) => {
      if (engine.frameUpdated) {
        if (matched) this.holdT += engine.frameDelta || 0.03;
        else this.holdT = Math.max(0, this.holdT - (engine.frameDelta || 0.03) * 1.2);
      }
      this.setPhraseFeedback(this.holdT / seconds, matched ? t("holdIt") : `${stepText()} · ${t("keepTrying")}`);
      return this.holdT >= seconds;
    };

    if (phrase.kind === "static") {
      const score = this.latestScores[phrase.target] || 0;
      if (holdMatch(score >= 0.80 && sign === phrase.target, 1.1) && this.mode === "phrase") this.phraseComplete();
      return;
    }

    if (phrase.kind === "wave") {
      const open = sign === "HI" || sign === "B" || (f.index && f.middle && f.ring && f.pinky);
      if (this.phraseStep === 0) {
        if (holdMatch(open, 0.35)) {
          this.nextPhraseStep();
          this.phraseState.lastX = f.palmX;
          this.phraseState.minX = f.palmX;
          this.phraseState.maxX = f.palmX;
        }
      } else {
        if (open && engine.frameUpdated) {
          const x = f.palmX;
          if (this.phraseState.lastX != null) this.phraseState.waveTravel += Math.abs(x - this.phraseState.lastX);
          this.phraseState.lastX = x;
          this.phraseState.minX = Math.min(this.phraseState.minX, x);
          this.phraseState.maxX = Math.max(this.phraseState.maxX, x);
        }
        const travel = this.phraseState.waveTravel;
        const range = this.phraseState.maxX - this.phraseState.minX;
        const progress = Math.min(1, Math.max(travel / 0.34, range / 0.18));
        this.setPhraseFeedback(progress, open ? stepText() : t("keepTrying"));
        if (open && travel >= 0.28 && range >= 0.13) this.phraseComplete();
      }
      return;
    }

    const pointing = f.index && !f.middle && !f.ring && !f.pinky;
    if (phrase.kind === "miss") {
      const tip = hand[8];
      let matched = false;
      if (this.phraseStep === 0) matched = pointing && tip.y > 0.58 && Math.abs(tip.x - 0.5) < 0.34;
      else if (this.phraseStep === 1) matched = pointing && tip.y > 0.27 && tip.y < 0.57 && Math.abs(tip.x - 0.5) < 0.30;
      else matched = pointing && (tip.x < 0.30 || tip.x > 0.70);
      if (holdMatch(matched, 0.38)) {
        if (this.phraseStep >= steps.length - 1) this.phraseComplete();
        else this.nextPhraseStep();
      }
      return;
    }

    if (phrase.kind === "name") {
      if (this.phraseStep === 0) {
        const open = sign === "HI" || sign === "B" || (f.index && f.middle && f.ring && f.pinky);
        if (holdMatch(open && f.palmY > 0.54, 0.4)) this.nextPhraseStep();
        return;
      }
      const twoHands = engine.handsNorm.length >= 2;
      const h1 = twoHands ? fingerStates(engine.handsNorm[0]) : null;
      const h2 = twoHands ? fingerStates(engine.handsNorm[1]) : null;
      const hShape = state => state && state.index && state.middle && !state.ring && !state.pinky;
      const bothH = hShape(h1) && hShape(h2);
      if (this.phraseStep === 1) {
        if (holdMatch(bothH, 0.4)) {
          this.nextPhraseStep();
          this.phraseState.touchCount = 0;
          this.phraseState.touching = false;
        }
        return;
      }
      if (!bothH) {
        this.setPhraseFeedback(this.phraseState.touchCount / 2, `${stepText()} · ${t("keepTrying")}`);
        return;
      }
      const gap = dist(engine.handsNorm[0][8], engine.handsNorm[1][8]);
      const touching = gap < 0.19;
      if (touching && !this.phraseState.touching) {
        this.phraseState.touchCount++;
        sfx.tick();
      }
      this.phraseState.touching = touching;
      this.setPhraseFeedback(this.phraseState.touchCount / 2, stepText());
      if (this.phraseState.touchCount >= 2) this.phraseComplete();
    }
  },
  updateHint() {
    if (this.mode !== "spell") return;
    const L = this.targetLetter();
    const hint = STR[lang].hints[L] || "";
    const cap = document.getElementById("refCap");
    const pic = document.getElementById("refPic");
    if (cap) cap.textContent = `${L}: ${hint}`;
    if (pic) {
      pic.style.backgroundPosition = SIGN_PHOTO_POS[L] || "center";
      pic.setAttribute("aria-label", `${L}: ${hint}`);
    }
    const hintEl = document.getElementById("sHint");
    if (hintEl) hintEl.textContent = `${L} → ${hint}`;
  },

  onFrame(dt) {
    drawSkeleton(engine.hand, "rgba(236,72,153,.9)");
    if (this.mode === "phrase" && engine.hands.length > 1) {
      drawSkeleton(engine.hands[1], "rgba(34,211,238,.9)");
    }
    const letterEl = document.getElementById("sLetter");
    const ring = document.getElementById("sRing");
    const confidenceEl = document.getElementById("sConfidence");
    if (!letterEl) return;
    const now = performance.now();
    const reading = engine.norm ? signReading(engine.norm) : null;
    this.latestScores = reading ? reading.scores : {};
    const rawSign = reading ? reading.sign : null;
    let sign = this.stableSign(rawSign);
    if (now < this.lockUntil) sign = null;

    const display = sign ? (SIGN_EMO[sign] || sign) : "…";
    letterEl.textContent = display;
    if (confidenceEl) {
      confidenceEl.textContent = reading
        ? `${t("confidence")(Math.round(reading.confidence * 100))} · ${t("sensorTip")}`
        : t("handLost");
    }

    if (this.mode === "free") {
      if (sign && sign !== this.current) { sfx.tick(); this.current = sign; }
      if (!sign) this.current = null;
      if (ring) ring.style.strokeDashoffset = 352;
      return;
    }
    if (this.mode === "phrase") {
      this.phraseFrame(dt, sign);
      return;
    }
    /* spell mode: hold the target handshape */
    const target = this.targetLetter();
    const targetScore = this.latestScores[target] || 0;
    const targetMatches = sign === target && targetScore >= 0.80;
    const frac = this.targetProgress(targetMatches, now);
    if (ring) ring.style.strokeDashoffset = 352 * (1 - frac);
    if (targetMatches && frac >= 1 && this.targetFrames >= 18) {
        sfx.good();
        this.resetTargetConfirmation();
        this.lockUntil = now + 700;
        this.advance();
    }
  },

  phraseComplete() {
    const title = this.phraseTitle;
    this.clearDom();
    const pop = el(`<div class="center-pop phrase-success">
      <div class="huge">🎉</div>
      <div class="word">${t("phraseSuccess")(title)}</div>
    </div>`);
    document.body.appendChild(pop);
    this.dom.push(pop);
    setTimeout(() => this.phraseMenu(), 2200);
  },

  advance() {
    const bar = document.getElementById("spellBar");
    if (!bar) return;
    bar.children[this.letterIdx].classList.remove("now");
    bar.children[this.letterIdx].classList.add("done");
    this.letterIdx++;
    if (this.letterIdx >= SIGN_WORDS[this.wordIdx].length) {
      const word = SIGN_WORDS[this.wordIdx];
      sfx.win();
      const pop = el(`<div class="center-pop"><div class="huge">🎉</div><div class="word">${t("spellDone")(word)}</div></div>`);
      document.body.appendChild(pop);
      setTimeout(() => {
        pop.remove();
        this.wordIdx++;
        if (this.wordIdx >= SIGN_WORDS.length) {
          ui.classList.remove("passthrough");
          this.clearDom();
          const node = el(`<div class="panel">
            <div class="big-emoji">🏆</div>
            <h2>${t("wordsDone")}</h2>
            <button class="btn" id="againBtn">${t("again")}</button>
            <br><button class="btn ghost" id="menuBtn" style="font-size:15px;padding:10px 24px">← ${t("back")}</button>
          </div>`);
          node.querySelector("#againBtn").onclick = () => { sfx.click(); this.wordIdx = 0; this.begin("spell"); };
          node.querySelector("#menuBtn").onclick = () => { sfx.click(); menu(); };
          show(node);
          return;
        }
        this.letterIdx = 0;
        this.buildDom();
      }, 1800);
    } else {
      bar.children[this.letterIdx].classList.add("now");
      this.updateHint();
    }
  },
};

/* ================================================
   GAME 4 : HAND SNAKE
================================================ */
const SNAKE = {
  emoji: "🐍", titleKey: "snakeTitle", howKey: "snakeHow",
  body: [], food: null, trail: [], score: 0, moveT: 0, dir: { x: 1, y: 0 },
  cols: 0, rows: 0, cell: 26, hud: null, resetBtn: null, running: false,

  start() {
    this.cleanup();
    this.cell = Math.max(20, Math.min(34, Math.floor(Math.min(innerWidth, innerHeight) / 19)));
    this.cols = Math.max(12, Math.floor(innerWidth / this.cell));
    this.rows = Math.max(12, Math.floor(innerHeight / this.cell));
    const cx = Math.floor(this.cols / 2), cy = Math.floor(this.rows / 2);
    this.body = [{ x: cx, y: cy }, { x: cx - 1, y: cy }, { x: cx - 2, y: cy }];
    this.dir = { x: 1, y: 0 }; this.score = 0; this.moveT = 0; this.trail = [];
    this.food = this.newFood(); this.running = true;
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
    this.hud = null; this.resetBtn = null; this.running = false;
  },

  newFood() {
    const free = [];
    for (let y = 1; y < this.rows - 1; y++) for (let x = 1; x < this.cols - 1; x++) {
      if (!this.body.some(p => p.x === x && p.y === y)) free.push({ x, y });
    }
    return free[Math.floor(Math.random() * free.length)] || { x: 2, y: 2 };
  },

  steer() {
    const tip = engine.hand?.[8];
    if (!tip) return;
    const head = this.body[0];
    const hx = (head.x + .5) * this.cell, hy = (head.y + .5) * this.cell;
    const dx = tip.x - hx, dy = tip.y - hy;
    const next = Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) };
    if ((next.x || next.y) && !(next.x === -this.dir.x && next.y === -this.dir.y)) this.dir = next;
  },

  move() {
    const head = this.body[0];
    const next = {
      x: (head.x + this.dir.x + this.cols) % this.cols,
      y: (head.y + this.dir.y + this.rows) % this.rows,
    };
    if (this.body.some(p => p.x === next.x && p.y === next.y)) { this.end(); return; }
    this.trail.push({ x: (head.x + .5) * this.cell, y: (head.y + .5) * this.cell, life: 1 });
    this.body.unshift(next);
    if (next.x === this.food.x && next.y === this.food.y) {
      this.score += 10; this.food = this.newFood(); sfx.good();
      const score = this.hud?.querySelector("#sScore"), length = this.hud?.querySelector("#sLength");
      if (score) { score.textContent = this.score; score.classList.remove("score-punch"); void score.offsetWidth; score.classList.add("score-punch"); }
      if (length) length.textContent = this.body.length;
    } else this.body.pop();
  },

  onFrame(dt) {
    if (!this.running) return;
    this.steer();
    this.moveT += dt;
    const speed = Math.max(.07, .18 - this.score * .0022);
    while (this.moveT >= speed && this.running) { this.moveT -= speed; this.move(); }
    this.trail.forEach(p => p.life -= dt * 2.3); this.trail = this.trail.filter(p => p.life > 0);
    const tip = engine.hand?.[8];
    ctx.save();
    ctx.fillStyle = "rgba(5,8,28,.28)"; ctx.fillRect(0, 0, innerWidth, innerHeight);
    ctx.strokeStyle = "rgba(34,211,238,.07)"; ctx.lineWidth = 1;
    for (let x = 0; x <= innerWidth; x += this.cell) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, innerHeight); ctx.stroke(); }
    for (let y = 0; y <= innerHeight; y += this.cell) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(innerWidth, y); ctx.stroke(); }
    this.trail.forEach(p => { ctx.fillStyle = `rgba(168,85,247,${p.life * .25})`; ctx.beginPath(); ctx.arc(p.x, p.y, this.cell * (1.1 - p.life * .3), 0, 7); ctx.fill(); });
    const fx = (this.food.x + .5) * this.cell, fy = (this.food.y + .5) * this.cell;
    ctx.shadowColor = "#ec4899"; ctx.shadowBlur = 25; ctx.fillStyle = "#f9a8d4"; ctx.beginPath(); ctx.arc(fx, fy, this.cell * .26, 0, 7); ctx.fill();
    this.body.slice().reverse().forEach((p, index) => {
      const headIndex = this.body.length - 1 - index, shade = Math.max(.35, 1 - headIndex / (this.body.length + 3));
      const x = p.x * this.cell + 2, y = p.y * this.cell + 2, size = this.cell - 4;
      ctx.shadowColor = headIndex === 0 ? "#22d3ee" : "#a855f7"; ctx.shadowBlur = 15;
      ctx.fillStyle = headIndex === 0 ? "#67e8f9" : `rgba(168,85,247,${shade})`;
      ctx.beginPath(); ctx.roundRect(x, y, size, size, Math.max(6, this.cell * .28)); ctx.fill();
      if (headIndex === 0) { ctx.fillStyle = "#0b0518"; ctx.shadowBlur = 0; ctx.beginPath(); ctx.arc(x + size * .68, y + size * .35, 2.4, 0, 7); ctx.fill(); }
    });
    if (tip) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.shadowColor = "#22d3ee"; ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(tip.x, tip.y, 15, 0, 7); ctx.stroke(); }
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
   GAME 5 : BLOCK BLAST
================================================ */
const BLAST_SHAPES = [
  [[0,0]], [[0,0],[1,0]], [[0,0],[0,1]], [[0,0],[1,0],[2,0]], [[0,0],[0,1],[0,2]],
  [[0,0],[1,0],[0,1],[1,1]], [[0,0],[1,0],[1,1]], [[0,0],[0,1],[1,1]], [[0,0],[1,0],[2,0],[1,1]],
];
const BLAST_COLORS = ["#22d3ee", "#a855f7", "#ec4899", "#a3e635", "#fbbf24"];
const BLAST = {
  emoji: "🧱", titleKey: "blastTitle", howKey: "blastHow",
  board: [], pieces: [], score: 0, lines: 0, dragging: null, wasPinching: false,
  flashCells: [], flashT: 0, hud: null, resetBtn: null, running: false,

  start() {
    this.cleanup();
    this.board = Array.from({ length: 8 }, () => Array(8).fill(null));
    this.score = 0; this.lines = 0; this.dragging = null; this.wasPinching = false; this.flashCells = []; this.flashT = 0;
    this.spawnPieces(); this.running = true;
    this.hud = el(`<div class="hud"><div class="stat"><div class="lbl">${t("score")}</div><div class="num cyan" id="bScore">0</div></div><div class="stat"><div class="lbl">${t("lines")}</div><div class="num pink" id="bLines">0</div></div></div>`);
    this.resetBtn = el(`<button class="reset-btn" type="button">↺ ${t("reset")}</button>`);
    this.resetBtn.onclick = () => { sfx.click(); this.start(); };
    document.body.append(this.hud, this.resetBtn);
  },

  cleanup() { this.hud?.remove(); this.resetBtn?.remove(); this.hud = null; this.resetBtn = null; this.running = false; },
  spawnPieces() {
    this.pieces = Array.from({ length: 3 }, (_, i) => ({
      shape: BLAST_SHAPES[Math.floor(Math.random() * BLAST_SHAPES.length)], color: BLAST_COLORS[(this.score / 10 + i) % BLAST_COLORS.length | 0],
    }));
  },
  layout() {
    const portrait = innerHeight > innerWidth;
    const size = Math.min(portrait ? innerWidth * .84 : innerWidth * .56, portrait ? innerHeight * .50 : innerHeight * .62, 470);
    const cell = Math.max(20, Math.floor(size / 8)); const boardSize = cell * 8;
    const gx = Math.round((innerWidth - boardSize) / 2);
    const gy = portrait ? Math.max(105, Math.round(innerHeight * .16)) : Math.max(102, Math.round((innerHeight - boardSize) / 2 - 12));
    const trayY = Math.min(innerHeight - 54, gy + boardSize + Math.min(72, Math.max(42, innerHeight - (gy + boardSize) - 25)));
    return { gx, gy, cell, boardSize, trayY };
  },
  pieceOrigin(piece) {
    const maxX = Math.max(...piece.shape.map(p => p[0])), maxY = Math.max(...piece.shape.map(p => p[1]));
    return { w: maxX + 1, h: maxY + 1 };
  },
  trayPosition(index, layout) { return { x: innerWidth * ((index + 1) / 4), y: layout.trayY }; },
  valid(shape, col, row) {
    return shape.every(([x, y]) => row + y >= 0 && row + y < 8 && col + x >= 0 && col + x < 8 && !this.board[row + y][col + x]);
  },
  canFit(shape) {
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (this.valid(shape, x, y)) return true;
    return false;
  },
  cursor() { return engine.hand?.[8] || null; },
  hoveredPiece(layout, cursor) {
    if (!cursor) return -1;
    return this.pieces.findIndex((piece, index) => {
      if (!piece) return false;
      const p = this.trayPosition(index, layout), d = this.pieceOrigin(piece);
      const w = d.w * layout.cell, h = d.h * layout.cell;
      return cursor.x >= p.x - w / 2 - 20 && cursor.x <= p.x + w / 2 + 20 && cursor.y >= p.y - h / 2 - 20 && cursor.y <= p.y + h / 2 + 20;
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
  drawPiece(piece, x, y, layout, alpha = 1, valid = true) {
    if (!piece) return;
    const d = this.pieceOrigin(piece), startX = x - d.w * layout.cell / 2, startY = y - d.h * layout.cell / 2;
    ctx.save(); ctx.globalAlpha = alpha; ctx.shadowColor = valid ? piece.color : "#f43f5e"; ctx.shadowBlur = 18;
    piece.shape.forEach(([sx, sy]) => { const px = startX + sx * layout.cell + 3, py = startY + sy * layout.cell + 3; ctx.fillStyle = valid ? piece.color : "#f43f5e"; ctx.beginPath(); ctx.roundRect(px, py, layout.cell - 6, layout.cell - 6, 7); ctx.fill(); });
    ctx.restore();
  },
  onFrame(dt) {
    if (!this.running) return;
    const layout = this.layout(), cursor = this.cursor(), f = engine.norm ? fingerStates(engine.norm) : null;
    const pinching = !!f && f.pinch < .46;
    if (pinching && !this.wasPinching && this.dragging === null) {
      const index = this.hoveredPiece(layout, cursor); if (index >= 0) { this.dragging = index; sfx.click(); }
    }
    if (!pinching && this.wasPinching && this.dragging !== null && cursor) { this.place(this.dragging, layout, cursor); this.dragging = null; }
    this.wasPinching = pinching; this.flashT = Math.max(0, this.flashT - dt);
    ctx.save(); ctx.fillStyle = "rgba(5,8,28,.34)"; ctx.fillRect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = "rgba(11,5,24,.65)"; ctx.strokeStyle = "rgba(34,211,238,.55)"; ctx.lineWidth = 2; ctx.shadowColor = "#22d3ee"; ctx.shadowBlur = 18; ctx.beginPath(); ctx.roundRect(layout.gx - 9, layout.gy - 9, layout.boardSize + 18, layout.boardSize + 18, 18); ctx.fill(); ctx.stroke();
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      const px = layout.gx + x * layout.cell, py = layout.gy + y * layout.cell, color = this.board[y][x];
      ctx.shadowBlur = color ? 14 : 0; ctx.shadowColor = color || "transparent"; ctx.fillStyle = color || "rgba(255,255,255,.055)"; ctx.strokeStyle = color ? `${color}bb` : "rgba(255,255,255,.12)";
      ctx.beginPath(); ctx.roundRect(px + 2, py + 2, layout.cell - 4, layout.cell - 4, 6); ctx.fill(); ctx.stroke();
    }
    if (this.flashT) { ctx.fillStyle = `rgba(255,255,255,${this.flashT * 1.7})`; this.flashCells.forEach(([x,y]) => ctx.fillRect(layout.gx + x * layout.cell, layout.gy + y * layout.cell, layout.cell, layout.cell)); }
    const hover = this.hoveredPiece(layout, cursor);
    this.pieces.forEach((piece, index) => { if (!piece || index === this.dragging) return; const p = this.trayPosition(index, layout); this.drawPiece(piece, p.x, p.y, layout, index === hover ? 1 : .72); });
    if (this.dragging !== null && cursor) { const piece = this.pieces[this.dragging], cell = this.dragCell(layout, cursor, piece); this.drawPiece(piece, layout.gx + (cell.col + this.pieceOrigin(piece).w / 2) * layout.cell, layout.gy + (cell.row + this.pieceOrigin(piece).h / 2) * layout.cell, layout, .9, this.valid(piece.shape, cell.col, cell.row)); }
    ctx.font = "800 13px system-ui"; ctx.textAlign = "center"; ctx.shadowBlur = 0; ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.fillText(t("pinchHint"), innerWidth / 2, Math.min(innerHeight - 12, layout.trayY + 54));
    if (cursor) { ctx.strokeStyle = pinching ? "#f9a8d4" : "#fff"; ctx.lineWidth = 3; ctx.shadowColor = pinching ? "#ec4899" : "#22d3ee"; ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(cursor.x, cursor.y, pinching ? 11 : 16, 0, 7); ctx.stroke(); }
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

/* debug hook (harmless in production) */
window.__ha = { engine, NINJA, BATTLE, SIGN, SNAKE, BLAST, ctx, step: (dt) => activeGame && activeGame.onFrame && activeGame.onFrame(dt || 1 / 60) };

menu();
