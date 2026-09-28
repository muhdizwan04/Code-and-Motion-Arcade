/* ================= AI HAND ARCADE =================
   4 games powered by one hand-tracking AI (MediaPipe, runs 100% on-device):
   - Air Ninja: slice fruit with your fingertip (Time Attack or 3-life Survival)
   - Hand Snake: your fingertip is a free-moving snake
   - Hand Blast: pinch-drag block puzzle
   - Hand Lab: pinch-craft elements, Infinite-Craft style
================================================== */
import { FilesetResolver, HandLandmarker } from "./vendor/vision_bundle.mjs";

"use strict";

function shakeScreen() {
  document.body.classList.add("screen-shake");
  setTimeout(() => document.body.classList.remove("screen-shake"), 350);
}

/* ---------------- i18n ---------------- */
const STR = {
  en: {
    langBtn: "BM",
    title: "AI HAND ARCADE",
    tagline: "The camera AI sees your hand. No touching allowed! 🖐️",
    ninjaTitle: "Air Ninja",
    ninjaDesc: "Slice the fruit with your finger — in the air!",
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
    calibHold: "Hold it there… ✋",
    calibSkip: "Can't see your hand? Start anyway →",
    // camera recovery
    camTroubleTitle: "Camera trouble",
    camTroubleDesc: "The camera feed froze. Trying to reconnect…",
    camReconnecting: "Reconnecting camera…",
    camRetryBtn: "🔄 TRY AGAIN",
    // attract loop (idle screen)
    attractMsg1: "🖐️ Wave to play!",
    attractMsg2: "🎮 Tap a game to start!",
    attractMsg3: "🤖 No internet needed — AI runs right here!",
    attractMsg4: "🏆 Can you beat today's top score?",
    // ninja
    ninjaHow: "Fruit is flying through the air! 🍉 Move your POINTER FINGER to slice it. Avoid the bombs 💣!",
    score: "Score", time: "Time", combo: "Combo", best: "Best", lives: "Lives",
    todaysBest: "Today's Best", newDailyBest: "🔥 NEW TODAY'S BEST!", todayBadge: n => `🏆 ${n} today`,
    debugged: "SYSTEM DEBUGGED!",
    newBest: "🎉 NEW HIGH SCORE!",
    ninjaRanks: ["🥷 FRUIT NINJA MASTER", "⚔️ BLADE WARRIOR", "🍃 ROOKIE SLICER"],
    vsNinjaTitle: "Ninja Duel",
    vsNinjaDesc: "Two players, one camera — slice your own side!",
    vsNinjaHow: "Player 1 stands LEFT, player 2 stands RIGHT. Each of you shows ONE hand on your own side of the line. Slice the fruit in your half, dodge the bombs — 3 lives each. Highest score after 90 seconds wins! ⚔️",
    p1: "P1", p2: "P2", twoPlayer: "2 PEMAIN", twoPlayer: "2 PLAYERS",
    vsShowHand: "show your hand ✋",
    vsSnakeTitle: "Snake Duel",
    vsSnakeDesc: "Two arenas, two snakes — who grows longest?",
    vsSnakeHow: "Player 1 takes the LEFT arena, player 2 the RIGHT. Point with one finger to steer your own snake. Eat to grow and score — hit your own tail and you lose a life and restart. Highest score after 90 seconds wins! 🐍",
    vsCrash: "CRASHED!",
    vsBlastTitle: "Blast Duel",
    vsBlastDesc: "A board each — clear the most lines!",
    vsBlastHow: "Player 1 takes the LEFT board, player 2 the RIGHT. PINCH 👌 a block from your own tray, drag it onto your board and release. Clear rows and columns to score. Highest score after 90 seconds wins! 🧱",
    vsJammed: "NO MOVES LEFT!",
    vsWinner: (n) => `PLAYER ${n} WINS!`,
    vsDraw: "IT'S A DRAW!",
    puSlow: "SLOW-MO!", puDouble: "DOUBLE POINTS!", puMagnet: "BIG BLADE!", puLife: "EXTRA LIFE!",
    puGhost: "GHOST MODE!", puBonus: "BONUS!", puShrink: "SHRINK!", puPull: "MAGNET!",
    puBomb: "BOOM!", puZap: "ZAP!",
    ninjaModeTime: "⏱ TIME ATTACK",
    ninjaModeTimeDesc: "60 seconds on the clock — score as much as you can!",
    ninjaModeLife: "❤️ SURVIVAL",
    ninjaModeLifeDesc: "3 lives, no clock — slicing a bomb costs a life!",
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
    timeUp: "TIME'S UP!",
    blastAddTime: n => `+${n}s`,
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
    labNoReaction: "No reaction — try another pair",
  },
  bm: {
    langBtn: "EN",
    title: "ARKED TANGAN AI",
    tagline: "AI kamera nampak tangan anda. Tak boleh sentuh skrin! 🖐️",
    ninjaTitle: "Air Ninja",
    ninjaDesc: "Tetak buah dengan jari — di udara!",
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
    calibHold: "Tahan di situ… ✋",
    calibSkip: "Kamera tak nampak tangan? Mula juga →",
    // camera recovery
    camTroubleTitle: "Masalah kamera",
    camTroubleDesc: "Suapan kamera terhenti. Cuba sambung semula…",
    camReconnecting: "Menyambung semula kamera…",
    camRetryBtn: "🔄 CUBA LAGI",
    // attract loop (idle screen)
    attractMsg1: "🖐️ Lambai untuk main!",
    attractMsg2: "🎮 Ketik permainan untuk mula!",
    attractMsg3: "🤖 Tak perlu internet — AI berjalan di sini!",
    attractMsg4: "🏆 Boleh kalahkan skor terbaik hari ini?",
    ninjaHow: "Buah-buahan terbang di udara! 🍉 Gerakkan JARI TELUNJUK untuk menetaknya. Elakkan bom 💣!",
    score: "Skor", time: "Masa", combo: "Combo", best: "Terbaik", lives: "Nyawa",
    todaysBest: "Skor Terbaik Hari Ini", newDailyBest: "🔥 REKOD TERBAIK HARI INI!", todayBadge: n => `🏆 ${n} hari ini`,
    debugged: "SISTEM DIBAIKI!",
    newBest: "🎉 REKOD BARU!",
    ninjaRanks: ["🥷 NINJA BUAH", "⚔️ PAHLAWAN PEDANG", "🍃 PEMULA"],
    vsNinjaTitle: "Pertarungan Ninja",
    vsNinjaDesc: "Dua pemain, satu kamera — tetak bahagian anda!",
    vsNinjaHow: "Pemain 1 di KIRI, pemain 2 di KANAN. Setiap seorang tunjuk SATU tangan di bahagian sendiri. Tetak buah di bahagian anda, elak bom — 3 nyawa setiap seorang. Skor tertinggi selepas 90 saat menang! ⚔️",
    p1: "P1", p2: "P2",
    vsShowHand: "tunjuk tangan ✋",
    vsSnakeTitle: "Pertarungan Ular",
    vsSnakeDesc: "Dua arena, dua ular — siapa paling panjang?",
    vsSnakeHow: "Pemain 1 di arena KIRI, pemain 2 di KANAN. Tunjuk satu jari untuk kemudikan ular anda. Makan untuk membesar dan dapat mata — langgar ekor sendiri, hilang satu nyawa dan mula semula. Skor tertinggi selepas 90 saat menang! 🐍",
    vsCrash: "TERLANGGAR!",
    vsBlastTitle: "Pertarungan Blast",
    vsBlastDesc: "Satu papan seorang — siapa kosongkan paling banyak?",
    vsBlastHow: "Pemain 1 papan KIRI, pemain 2 papan KANAN. CUBIT 👌 blok dari dulang sendiri, seret ke papan anda dan lepaskan. Kosongkan baris dan lajur untuk mata. Skor tertinggi selepas 90 saat menang! 🧱",
    vsJammed: "TIADA LANGKAH!",
    vsWinner: (n) => `PEMAIN ${n} MENANG!`,
    vsDraw: "SERI!",
    puSlow: "GERAK PERLAHAN!", puDouble: "MATA BERGANDA!", puMagnet: "BILAH BESAR!", puLife: "NYAWA TAMBAHAN!",
    puGhost: "MOD HANTU!", puBonus: "BONUS!", puShrink: "MENGECUT!", puPull: "MAGNET!",
    puBomb: "BOOM!", puZap: "ZAP!",
    ninjaModeTime: "⏱ SERANGAN MASA",
    ninjaModeTimeDesc: "60 saat di jam — kumpul skor sebanyak mungkin!",
    ninjaModeLife: "❤️ BERTAHAN",
    ninjaModeLifeDesc: "3 nyawa, tiada jam — tetak bom hilang satu nyawa!",
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
    timeUp: "MASA TAMAT!",
    blastAddTime: n => `+${n}s`,
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
    labNoReaction: "Tiada tindak balas — cuba pasangan lain",
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

/* ---------------- today's best score (Malaysia time, resets daily) ----------------
   A booth-day leaderboard: separate from the permanent all-time best, this
   tracks the top score set today only, so it means something fresh for
   whoever's visiting the booth right now. Malaysia (Asia/Kuala_Lumpur) is a
   fixed UTC+8 with no DST, so the offset math below is exact year-round. */
function malaysiaDateStr() {
  const utcMs = Date.now() + new Date().getTimezoneOffset() * 60000;
  return new Date(utcMs + 8 * 3600000).toISOString().slice(0, 10);
}
function getDailyBest(gameKey) {
  let rec = {};
  try { rec = JSON.parse(localStorage.getItem(`ha-daily-${gameKey}`) || "{}"); } catch {}
  return rec.date === malaysiaDateStr() ? (rec.score || 0) : 0;
}
function setDailyBest(gameKey, score) {
  const current = getDailyBest(gameKey);
  if (score <= current) return { isNew: false, best: current };
  localStorage.setItem(`ha-daily-${gameKey}`, JSON.stringify({ date: malaysiaDateStr(), score }));
  return { isNew: true, best: score };
}

/* ---------------- sound ---------------- */
let soundOn = localStorage.getItem("ha-sound") !== "off";
let actx = null;
/* The music bed is deliberately loud, so the effects are lifted by the same
   amount to stay on top of it — the relative mix between effects is kept. */
const SFX_GAIN = 3.4;
function beep(freq = 660, dur = 0.08, type = "square", vol = 0.05) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(Math.min(0.5, vol * SFX_GAIN), actx.currentTime);
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

/* ---------------- background music ----------------
   Procedural chiptune rather than audio files: the PWA stays fully offline,
   adds no download weight and carries no licensed audio.

   Each track is a 32-step (two bar) loop with four voices — a detuned lead,
   a harmony line, an octave-jumping bass and a drum kit — which is what
   keeps a loop from wearing thin after the third play at a booth. A little
   swing stops it sounding like a metronome, and the whole mix runs through a
   compressor so it can be genuinely loud without clipping. */
const MUSIC_VOL = 0.30;           // loud and present, still under the sfx
const NOTE = (n) => 27.5 * Math.pow(2, (n + 3) / 12);   // n = 45 is A4 (440Hz)
const R = null;                   // rest — keeps the patterns readable

const TRACKS = {
  // Hub: warm and inviting, with a hook that pulls you toward a card.
  menu: {
    bpm: 108, wave: "triangle", swing: 0.14,
    lead: [57, R, 55, 57, 60, R, 57, R, 55, R, 52, 55, 57, R, R, R,
           55, R, 52, 55, 57, R, 60, R, 62, R, 60, 57, 55, R, R, R],
    harm: [52, R, 50, 52, 55, R, 52, R, 50, R, 48, 50, 52, R, R, R,
           50, R, 48, 50, 52, R, 55, R, 57, R, 55, 52, 50, R, R, R],
    bass: [21, R, 33, R, 21, R, 33, R, 17, R, 29, R, 17, R, 29, R,
           19, R, 31, R, 19, R, 31, R, 16, R, 28, R, 16, R, 28, R],
    kick: [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,0,0,  1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0],
    snare:[0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0,  0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1],
    hat:  [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,1,  0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,1],
  },
  // Air Ninja: relentless 16ths, minor key, built to make you swipe faster.
  ninja: {
    bpm: 158, wave: "square", swing: 0.04,
    lead: [57, R, 55, 57, 52, R, 55, R, 53, R, 52, 50, 52, R, 55, R,
           57, R, 60, 57, 55, R, 52, R, 50, 50, 52, 55, 57, R, 57, 59],
    harm: [45, R, 43, 45, 40, R, 43, R, 41, R, 40, 38, 40, R, 43, R,
           45, R, 48, 45, 43, R, 40, R, 38, 38, 40, 43, 45, R, 45, 47],
    bass: [21,21,33,21, 21,21,33,21, 29,29,41,29, 29,29,41,29,
           26,26,38,26, 26,26,38,26, 28,28,40,28, 28,28,40,40],
    kick: [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0,  1,0,0,1, 0,0,1,0, 1,0,0,1, 0,1,0,1],
    snare:[0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0,  0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,1,0],
    hat:  [1,1,0,1, 1,1,0,1, 1,1,0,1, 1,1,0,1,  1,1,0,1, 1,1,0,1, 1,1,0,1, 1,1,1,1],
  },
  // Hand Snake: bright major bounce, playful and easy to move to.
  snake: {
    bpm: 126, wave: "square", swing: 0.16,
    lead: [55, R, 55, 57, R, 55, 52, R, 50, R, 52, 55, R, 52, R, R,
           57, R, 57, 60, R, 57, 55, R, 52, R, 55, 57, R, 55, 52, R],
    harm: [48, R, 48, 52, R, 48, 45, R, 43, R, 45, 48, R, 45, R, R,
           52, R, 52, 55, R, 52, 48, R, 45, R, 48, 52, R, 48, 45, R],
    bass: [24, R, 36, 24, 24, R, 36, R, 19, R, 31, 19, 19, R, 31, R,
           21, R, 33, 21, 21, R, 33, R, 26, R, 38, 26, 26, R, 38, 38],
    kick: [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,0,0,  1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,1,0],
    snare:[0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1,  0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1],
    hat:  [0,0,1,0, 0,1,1,0, 0,0,1,0, 0,1,1,1,  0,0,1,0, 0,1,1,0, 0,0,1,0, 0,1,1,1],
  },
  // Hand Blast: a groove with room to think — never rushes a puzzle.
  blast: {
    bpm: 112, wave: "triangle", swing: 0.18,
    lead: [52, R, R, 55, R, 57, R, R, 60, R, 57, R, 55, R, R, R,
           50, R, R, 52, R, 55, R, R, 57, R, 55, R, 52, R, R, R],
    harm: [45, R, R, 48, R, 50, R, R, 52, R, 50, R, 48, R, R, R,
           43, R, R, 45, R, 48, R, R, 50, R, 48, R, 45, R, R, R],
    bass: [16, R, 28, R, 16, R, 28, R, 21, R, 33, R, 21, R, 33, R,
           19, R, 31, R, 19, R, 31, R, 14, R, 26, R, 14, R, 26, R],
    kick: [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0,  1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0],
    snare:[0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0,  0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,1],
    hat:  [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0,  0,0,1,0, 0,0,1,1, 0,0,1,0, 0,0,1,0],
  },
  // Hand Lab: dreamy and curious, but with enough pulse to feel alive.
  lab: {
    bpm: 96, wave: "sine", swing: 0.20,
    lead: [57, R, R, R, 60, R, 62, R, 64, R, 62, R, 60, R, R, R,
           55, R, R, R, 57, R, 60, R, 62, R, 60, R, 57, R, R, R],
    harm: [52, R, R, R, 55, R, 57, R, 57, R, 57, R, 55, R, R, R,
           50, R, R, R, 52, R, 55, R, 55, R, 55, R, 52, R, R, R],
    bass: [21, R, R, R, 21, R, 33, R, 17, R, R, R, 17, R, 29, R,
           19, R, R, R, 19, R, 31, R, 16, R, R, R, 16, R, 28, R],
    kick: [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,  1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
    snare:[0,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0,  0,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
    hat:  [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0,  0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,1,0],
  },
};

const music = {
  timer: null, step: 0, nextTime: 0, name: null, track: null, master: null, noiseBuf: null,

  start(name) {
    if (!TRACKS[name]) return;
    if (this.name === name && this.timer) return;   // already playing this one
    this.stop();
    this.name = name;
    if (!soundOn) return;                            // remembered, but silent
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      this.track = TRACKS[name]; this.step = 0;
      // Compressor lets the mix sit genuinely loud without clipping when the
      // kick, bass and lead all land on the same step.
      const comp = actx.createDynamicsCompressor();
      comp.threshold.value = -18; comp.knee.value = 24;
      comp.ratio.value = 8; comp.attack.value = 0.004; comp.release.value = 0.2;
      this.master = actx.createGain();
      this.master.gain.setValueAtTime(0.0001, actx.currentTime);
      this.master.gain.linearRampToValueAtTime(MUSIC_VOL, actx.currentTime + 0.9);
      this.master.connect(comp).connect(actx.destination);
      this.comp = comp;
      this.nextTime = actx.currentTime + 0.1;
      this.timer = setInterval(() => this.schedule(), 40);
    } catch (e) {}
  },

  stop() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    const m = this.master, c = this.comp;
    if (m && actx) {
      try {
        m.gain.cancelScheduledValues(actx.currentTime);
        m.gain.setValueAtTime(m.gain.value, actx.currentTime);
        m.gain.linearRampToValueAtTime(0.0001, actx.currentTime + 0.25);   // fade out
        setTimeout(() => { try { m.disconnect(); c && c.disconnect(); } catch (e) {} }, 400);
      } catch (e) {}
    }
    this.master = null; this.comp = null; this.name = null; this.track = null;
  },

  // Notes are scheduled ahead of time so the groove holds steady even when
  // the render loop stutters.
  schedule() {
    if (!actx || !this.track || !this.master) return;
    const spb = 60 / this.track.bpm / 4;            // one 16th step
    while (this.nextTime < actx.currentTime + 0.22) {
      const i = this.step % 32;
      // Swing: push the off-beats late so it grooves instead of marching.
      const at = this.nextTime + (i % 2 ? (this.track.swing || 0) * spb : 0);
      this.playStep(i, at, spb);
      this.nextTime += spb;
      this.step++;
    }
  },

  // Two oscillators a few cents apart read as one fat chiptune voice.
  voice(freq, at, dur, type, vol, detune = 0) {
    for (const d of (detune ? [-detune, detune] : [0])) {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, at);
      o.detune.setValueAtTime(d, at);
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(vol / (detune ? 2 : 1), at + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      o.connect(g).connect(this.master);
      o.start(at); o.stop(at + dur + 0.02);
    }
  },

  noise() {
    if (this.noiseBuf) return this.noiseBuf;
    const n = actx.sampleRate * 0.2, b = actx.createBuffer(1, n, actx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    this.noiseBuf = b;
    return b;
  },

  hit(at, dur, freq, vol, q = 1) {
    const src = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
    src.buffer = this.noise();
    f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(vol, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    src.connect(f).connect(g).connect(this.master);
    src.start(at); src.stop(at + dur + 0.02);
  },

  playStep(i, at, spb) {
    const T = this.track;
    if (T.lead[i] != null) this.voice(NOTE(T.lead[i]), at, spb * 1.8, T.wave, 0.44, 9);
    if (T.harm && T.harm[i] != null) this.voice(NOTE(T.harm[i]), at, spb * 1.5, "triangle", 0.20);
    if (T.bass[i] != null) this.voice(NOTE(T.bass[i]), at, spb * 2.2, "triangle", 0.80);
    if (T.kick[i]) {                                  // pitch-drop sine = kick
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(150, at);
      o.frequency.exponentialRampToValueAtTime(44, at + 0.12);
      g.gain.setValueAtTime(1.0, at);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.16);
      o.connect(g).connect(this.master);
      o.start(at); o.stop(at + 0.18);
    }
    if (T.snare && T.snare[i]) this.hit(at, 0.13, 1900, 0.42, 0.7);
    if (T.hat[i]) this.hit(at, 0.03, 9000, 0.16, 1.4);
  },
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
  // Every screen transition counts as "fresh attention" for the idle-return
  // watchdog below — hand-tracked gameplay never fires pointer/key events, so
  // resetting only on real screen changes (not on generic input) is what
  // keeps a just-finished game's score screen from instantly bouncing to menu.
  lastInteraction = Date.now();
}

/* ---------------- hand engine ---------------- */
const CAM_CONSTRAINTS = {
  video: {
    facingMode: "user",
    // A 960×720 stream is detailed enough for fingertips but much easier for
    // a phone/tablet to analyse in real time than a full-HD stream. Keeping
    // inference fast is more important to control quality than raw pixels.
    width: { ideal: 960, min: 640 },
    height: { ideal: 720, min: 480 },
    frameRate: { ideal: 60, min: 24 },
    resizeMode: "crop-and-scale",
  },
  audio: false,
};
const engine = {
  landmarker: null, ready: false, camReady: false,
  hand: null,        // mirrored screen-space landmarks [{x,y}] or null
  norm: null,        // mirrored normalized landmarks
  renderNorm: null,  // tiny velocity prediction: makes 30fps camera input feel continuous at 60fps
  velocity: [],
  hands: [], handsNorm: [],
  // Versus mode tracks two hands and assigns them to a side of the screen.
  handCount: 1, multi: [null, null], multiNorm: [null, null],
  lastVideoTime: -1, frameUpdated: false, lastSeenAt: 0, frameAt: 0, frameDelta: 0,
  speed: 0,          // peak landmark speed, normalized units/sec — drives the
                     // prediction window and the hand-lost grace period below
  lastFrameOkAt: 0,  // last time a genuinely new video frame was processed —
                      // the camera-stall watchdog below watches this, separately
                      // from "hand visible", to catch a frozen/dead camera feed.
  async init(onStatus) {
    if (!this.ready) {
      onStatus(t("loading"));
      const fileset = await FilesetResolver.forVisionTasks("vendor/wasm");
      const options = (delegate) => ({
        baseOptions: { modelAssetPath: "vendor/hand_landmarker.task", delegate },
        runningMode: "VIDEO",
        // Every game uses one controlling hand. Tracking one hand keeps the
        // inference loop light and stops a background hand from stealing focus.
        numHands: 1,
        // Let a hand enter in normal indoor light, then rely on the temporal
        // filter below instead of rapidly dropping/reacquiring it.
        // Acquisition stays strict so a face or background object cannot be
        // mistaken for a hand, but once a hand IS being tracked the presence
        // and tracking gates are deliberately loose: a fast swipe motion-blurs
        // the fingers, and the old 0.45/0.42 gates dropped the hand mid-motion
        // exactly when the student was moving quickest.
        minHandDetectionConfidence: 0.42,
        minHandPresenceConfidence: 0.32,
        minTrackingConfidence: 0.30,
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
      await this.startVideoStream();
    }
  },
  /* One hand is the default: it keeps inference light and stops a bystander's
     hand stealing the cursor. Versus games ask for two, and the model is
     reconfigured in place when possible rather than reloaded. */
  async setHandCount(n) {
    if (this.handCount === n) return;
    this.handCount = n;
    this.multi = [null, null]; this.multiNorm = [null, null];
    if (!this.landmarker) return;
    try {
      await this.landmarker.setOptions({ numHands: n });
    } catch (e) {
      // Older builds cannot change it live; rebuilding is slower but works.
      try {
        const fileset = await FilesetResolver.forVisionTasks("vendor/wasm");
        this.landmarker = await HandLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: "vendor/hand_landmarker.task", delegate: "GPU" },
          runningMode: "VIDEO", numHands: n,
          minHandDetectionConfidence: 0.42, minHandPresenceConfidence: 0.32, minTrackingConfidence: 0.30,
        });
      } catch (e2) {}
    }
  },
  /* Leftmost hand is player 1, rightmost is player 2. Sorting by wrist x each
     frame keeps the assignment stable without needing MediaPipe's handedness,
     which reports which hand it is, not which side of the screen it is on. */
  updateMulti(rawHands, toScreen) {
    const sorted = rawHands.slice().sort((a, b) => a[0].x - b[0].x);
    const out = [null, null];
    for (let i = 0; i < 2; i++) {
      const raw = sorted[i];
      if (!raw) { this.multiNorm[i] = null; continue; }
      const prev = this.multiNorm[i];
      const sm = !prev ? raw.map(p => ({ ...p })) : raw.map((p, k) => {
        const q = prev[k], d = dist(p, q);
        const a = Math.min(0.96, 0.22 + d * 10);   // same adaptive idea as the solo filter
        return { x: q.x + (p.x - q.x) * a, y: q.y + (p.y - q.y) * a, z: q.z + (p.z - q.z) * a };
      });
      this.multiNorm[i] = sm;
      out[i] = toScreen(sm);
    }
    this.multi = out;
  },
  async startVideoStream() {
    const stream = await navigator.mediaDevices.getUserMedia(CAM_CONSTRAINTS);
    cam.srcObject = stream;
    await new Promise((res) => { cam.onloadedmetadata = res; });
    await cam.play();
    this.camReady = true;
    this.lastFrameOkAt = performance.now(); // grace period before the watchdog can fire
  },
  // Used by the camera-stall watchdog to recover without reloading the AI
  // model (which stays loaded) — just tears down and re-requests the stream.
  async reconnectCamera() {
    this.stopCamera();
    await this.startVideoStream();
  },
  stopCamera() {
    const stream = cam.srcObject;
    if (stream) stream.getTracks().forEach((track) => track.stop());
    cam.srcObject = null;
    this.camReady = false;
    this.lastVideoTime = -1;
    this.hand = null;
    this.norm = null;
    this.renderNorm = null;
    this.velocity = [];
    this.hands = [];
    this.handsNorm = [];
    this.frameUpdated = false;
    this.lastSeenAt = 0;
    this.frameAt = 0;
    this.frameDelta = 0;
    this.speed = 0;
    handStatus.classList.remove("seen");
  },
  detect() {
    this.frameUpdated = false;
    if (!this.ready || !this.camReady || cam.readyState < 2) { this.hand = null; this.renderNorm = null; return false; }
    if (cam.currentTime === this.lastVideoTime) return false; // same frame, keep previous
    this.lastVideoTime = cam.currentTime;
    this.frameUpdated = true;
    this.lastFrameOkAt = performance.now();
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
      const raw = rawHands[0];
      if (!this.norm) {
        this.norm = raw.map(p => ({ ...p }));
        this.renderNorm = raw.map(p => ({ ...p }));
        this.velocity = raw.map(() => ({ x: 0, y: 0, z: 0 }));
      } else {
        // Adaptive low-pass filter: steady hands get a calm cursor, while a
        // deliberate fast movement receives a high alpha so games stay direct.
        // Thumb and index receive a little more responsiveness for pinch games.
        const dt = this.frameDelta || 1 / 30;
        let peak = 0;   // fastest landmark this frame: "still" vs "thrown"
        this.norm = raw.map((p, i) => {
          const prev = this.norm[i];
          const d = dist(p, prev);
          if (d > peak) peak = d;
          const controlTip = i === 4 || i === 8;
          // The responsive term used to be clamped at 0.56, so even a full-speed
          // swipe kept ~20% of the old position on every camera frame and the
          // cursor visibly trailed the hand. Alpha now runs all the way to ~1
          // (no smoothing at all) once the hand is genuinely moving, while a
          // resting hand keeps exactly the calm filtering it had before.
          const alpha = Math.min(controlTip ? 0.97 : 0.94,
            (controlTip ? 0.24 : 0.18) + d * (controlTip ? 11 : 9));
          const next = {
            x: prev.x + (p.x - prev.x) * alpha,
            y: prev.y + (p.y - prev.y) * alpha,
            z: prev.z + (p.z - prev.z) * alpha,
          };
          // Velocity is measured from the RAW landmark, not the filtered one.
          // Deriving it from the filtered position under-reports true speed
          // precisely when the hand is fastest — which is when the between-frame
          // prediction below depends on it most. Its own light smoothing keeps
          // it from jittering on a still hand.
          const prevV = this.velocity[i] || { x: 0, y: 0, z: 0 };
          const clamp = (n) => Math.max(-3, Math.min(3, n));
          this.velocity[i] = {
            x: prevV.x + (clamp((p.x - prev.x) / dt) - prevV.x) * 0.5,
            y: prevV.y + (clamp((p.y - prev.y) / dt) - prevV.y) * 0.5,
            z: prevV.z + (clamp((p.z - prev.z) / dt) - prevV.z) * 0.5,
          };
          return next;
        });
        this.speed = peak / dt;
      }
      const toScreen = hand => hand.map(p => ({ x: p.x * dw + ox, y: p.y * dh + oy, z: p.z }));
      this.handsNorm = rawHands;
      this.hands = rawHands.map(toScreen);
      if (this.handCount === 2) this.updateMulti(rawHands, toScreen);
      this.updateRenderedHand(toScreen);
      this.lastSeenAt = performance.now();
    } else if (performance.now() - this.lastSeenAt > this.lostGraceMs()) {
      // Ignore a few dropped inference frames so the cursor/sign does not flicker.
      this.hand = null;
      this.norm = null;
      this.renderNorm = null;
      this.velocity = [];
      this.hands = [];
      this.handsNorm = [];
      this.multi = [null, null]; this.multiNorm = [null, null];
    }
    handStatus.classList.toggle("seen", !!this.hand);
    return true;
  },
  // A hand that was moving fast is the one most likely to be lost to a single
  // motion-blurred frame, so it earns a longer grace period before the games
  // are told it has gone. A resting hand that disappears really has left.
  lostGraceMs() {
    return 300 + Math.min(320, (this.speed || 0) * 260);
  },
  // Run on every animation frame, not just every camera frame. A capped
  // 24ms prediction bridges the gap between camera frames without making the
  // cursor drift when a hand stops. Gesture decisions still use `norm`, not
  // this presentation-only position, so a predicted frame cannot fake a pinch.
  advanceRender(now = performance.now()) {
    if (!this.norm || !this.camReady || !cam.videoWidth || !cam.videoHeight) return;
    // Between camera frames the rendered hand keeps travelling along its last
    // measured velocity. The window is wider than one frame so that one or two
    // dropped detections during a fast swipe cannot freeze the cursor, and the
    // confidence fades to zero by ~140ms so it coasts to a stop rather than
    // flying off when the hand really has left the frame.
    const stale = Math.max(0, (now - this.frameAt) / 1000);
    const ahead = Math.min(0.055, stale) * Math.max(0, 1 - stale / 0.14);
    const vw = cam.videoWidth, vh = cam.videoHeight;
    const scale = Math.max(innerWidth / vw, innerHeight / vh);
    const dw = vw * scale, dh = vh * scale;
    const ox = (innerWidth - dw) / 2, oy = (innerHeight - dh) / 2;
    const toScreen = hand => hand.map(p => ({ x: p.x * dw + ox, y: p.y * dh + oy, z: p.z }));
    this.updateRenderedHand(toScreen, ahead);
  },
  updateRenderedHand(toScreen, ahead = 0) {
    this.renderNorm = this.norm.map((p, i) => {
      const v = this.velocity[i] || { x: 0, y: 0, z: 0 };
      return { x: p.x + v.x * ahead, y: p.y + v.y * ahead, z: p.z + v.z * ahead };
    });
    this.hand = toScreen(this.renderNorm);
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
      // Camera frames usually arrive at 24–30fps while the display refreshes
      // at 60fps. Advance only the rendered hand between detections so cursor
      // movement and game feedback stay fluid on phones and iPads.
      engine.advanceRender(now);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      if (activeGame && activeGame.onFrame) activeGame.onFrame(dt);
    } catch (e) { console.error("frame error:", e); }
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function stopGame() {
  music.stop();
  if (activeGame && activeGame.cleanup) activeGame.cleanup();
  activeGame = null;
  engine.stopCamera();
  document.body.classList.remove("playing");
  homeBtn.classList.add("hidden");
  camBtn.classList.add("hidden");
  handStatus.classList.add("hidden");
  camTroubleNode?.remove(); camTroubleNode = null; camRecovering = false;
}

/* ---------------- camera stall recovery ----------------
   A frozen/disconnected camera doesn't throw — it just stops delivering new
   video frames, so engine.hand quietly freezes at its last position and the
   booth looks "stuck" with nobody able to tell why. This watches for that
   specific failure (no new frame for several seconds while a camera game is
   active) and self-heals by re-requesting the stream, with a visible retry
   button as the fallback if auto-recovery can't get it back. */
let camTroubleNode = null, camRecovering = false;
const CAM_STALL_MS = 6000;
setInterval(() => {
  if (camRecovering || !document.body.classList.contains("playing") || !engine.camReady) return;
  if (performance.now() - engine.lastFrameOkAt > CAM_STALL_MS) startCameraRecovery();
}, 1000);
async function startCameraRecovery(attempt = 1) {
  camRecovering = true;
  if (!camTroubleNode) {
    camTroubleNode = el(`<div class="cam-trouble">
      <div class="panel">
        <div class="big-emoji">📷💤</div>
        <h2>${t("camTroubleTitle")}</h2>
        <div class="desc" id="camTroubleDesc">${t("camTroubleDesc")}</div>
        <button class="btn" id="camRetryBtn">${t("camRetryBtn")}</button>
      </div>
    </div>`);
    camTroubleNode.querySelector("#camRetryBtn").onclick = () => { sfx.click(); startCameraRecovery(1); };
    document.body.appendChild(camTroubleNode);
  }
  const desc = camTroubleNode.querySelector("#camTroubleDesc");
  desc.textContent = t("camReconnecting");
  try {
    await engine.reconnectCamera();
    await new Promise((res) => setTimeout(res, 700));
    if (performance.now() - engine.lastFrameOkAt > 1500) throw new Error("no frame after reconnect");
    camTroubleNode.remove(); camTroubleNode = null;
    camRecovering = false;
  } catch {
    if (attempt < 3) { setTimeout(() => startCameraRecovery(attempt + 1), 1500); }
    else { desc.textContent = t("camTroubleDesc"); camRecovering = false; }
  }
}

/* ---------------- attract loop (booth idle screen) ----------------
   Nobody babysits a booth all day. If the menu sits idle, spotlight the game
   cards in turn and cycle a friendly, kid-aimed call-to-action so it reads as
   "come play" rather than "abandoned kiosk". If a non-gameplay screen (mode
   picker, calibrate, a finished game's score screen) sits idle even longer,
   assume whoever was there walked off and quietly return to the menu so the
   next visitor doesn't inherit somebody else's half-finished setup screen. */
const ATTRACT_AFTER_S = 25, IDLE_RETURN_AFTER_S = 45;
let atMenu = false, lastInteraction = Date.now();
let attractActive = false, attractCardTimer = null, attractMsgTimer = null, attractNode = null;
const ATTRACT_MSG_KEYS = ["attractMsg1", "attractMsg2", "attractMsg3", "attractMsg4"];
addEventListener("pointerdown", () => { lastInteraction = Date.now(); if (attractActive) stopAttract(); }, { capture: true });
function startAttract() {
  if (attractActive || !atMenu) return;
  const cards = [...document.querySelectorAll(".card")];
  if (!cards.length) return;
  attractActive = true;
  let i = 0;
  cards[i].classList.add("spotlight");
  attractCardTimer = setInterval(() => {
    cards[i].classList.remove("spotlight");
    i = (i + 1) % cards.length;
    cards[i].classList.add("spotlight");
  }, 1400);
  attractNode = el(`<div class="attract-banner"><span id="attractMsg"></span></div>`);
  document.body.appendChild(attractNode);
  let mi = 0;
  const cycleMsg = () => { attractNode.querySelector("#attractMsg").textContent = t(ATTRACT_MSG_KEYS[mi % ATTRACT_MSG_KEYS.length]); mi++; };
  cycleMsg();
  attractMsgTimer = setInterval(cycleMsg, 3200);
}
function stopAttract() {
  if (!attractActive) return;
  attractActive = false;
  clearInterval(attractCardTimer); clearInterval(attractMsgTimer);
  document.querySelectorAll(".card.spotlight").forEach((c) => c.classList.remove("spotlight"));
  attractNode?.remove(); attractNode = null;
}
setInterval(() => {
  const idleFor = (Date.now() - lastInteraction) / 1000;
  if (atMenu) {
    if (idleFor > ATTRACT_AFTER_S && !attractActive) startAttract();
  } else if (!ui.classList.contains("passthrough") && ui.querySelector(".panel") && idleFor > IDLE_RETURN_AFTER_S) {
    menu();
  }
}, 1000);

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
  const labels = { ninja: "🥷 Air Ninja", snake: "🐍 Hand Snake", blast: "🧱 Hand Blast", lab: "🧪 Hand Lab" };
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
  atMenu = true;
  music.start("menu");
  const dailyBadge = (key) => { const b = getDailyBest(key); return b > 0 ? `<span class="card-badge">${t("todayBadge")(b)}</span>` : ""; };
  const node = el(`<div style="margin:auto;width:100%">
    <h1 class="arcade" id="arcadeTitle">${t("title")}</h1>
    <div class="tagline">${t("tagline")}</div>
    <div class="cards">
      <div class="card ninja" id="cNinja">
        <div class="emo">🥷</div>
        <div><h3>${t("ninjaTitle")} <span style="font-size:14px">🍉</span></h3><p>${t("ninjaDesc")}</p>${dailyBadge("ninja")}</div>
      </div>
      <div class="card snake" id="cSnake">
        <div class="emo">🐍</div>
        <div><h3>${t("snakeTitle")} <span style="font-size:14px">🎮</span></h3><p>${t("snakeDesc")}</p>${dailyBadge("snake")}</div>
      </div>
      <div class="card blast" id="cBlast">
        <div class="emo">🧱</div>
        <div><h3>${t("blastTitle")} <span style="font-size:14px">🧩</span></h3><p>${t("blastDesc")}</p>${dailyBadge("blast")}</div>
      </div>
      <div class="card vs" id="cNinjaVs">
        <div class="emo">⚔️</div>
        <div><h3>${t("vsNinjaTitle")} <span style="font-size:14px">👥</span></h3><p>${t("vsNinjaDesc")}</p><span class="card-badge vs-badge">${t("twoPlayer")}</span></div>
      </div>
      <div class="card vs" id="cSnakeVs">
        <div class="emo">🐍</div>
        <div><h3>${t("vsSnakeTitle")} <span style="font-size:14px">👥</span></h3><p>${t("vsSnakeDesc")}</p><span class="card-badge vs-badge">${t("twoPlayer")}</span></div>
      </div>
      <div class="card vs" id="cBlastVs">
        <div class="emo">🧱</div>
        <div><h3>${t("vsBlastTitle")} <span style="font-size:14px">👥</span></h3><p>${t("vsBlastDesc")}</p><span class="card-badge vs-badge">${t("twoPlayer")}</span></div>
      </div>
      <div class="card lab" id="cLab">
        <div class="emo">🧪</div>
        <div><h3>${t("labTitle")} <span style="font-size:14px">🔬</span></h3><p>${t("labDesc")}</p></div>
      </div>
    </div>
    <div class="made-with">🤖 ${t("madeWith")}</div>
  </div>`);
  node.querySelector("#cNinja").onclick = () => { sfx.open(); intro(NINJA); };
  node.querySelector("#cSnake").onclick = () => { sfx.open(); intro(SNAKE); };
  node.querySelector("#cBlast").onclick = () => { sfx.open(); intro(BLAST); };
  node.querySelector("#cNinjaVs").onclick = () => { sfx.open(); intro(NINJA_VS); };
  node.querySelector("#cSnakeVs").onclick = () => { sfx.open(); intro(SNAKE_VS); };
  node.querySelector("#cBlastVs").onclick = () => { sfx.open(); intro(BLAST_VS); };
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
  atMenu = false;
  stopAttract();
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
    music.start(game.track || "menu");
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
    // A three second hold, not a glimpse. Holding still while the ring fills
    // gives the tracker a steady view of the hand and gives the player a
    // moment to get their arm comfortable before anything starts moving.
    const HOLD_MS = 3000, TICK = 50;
    const node = el(`<div class="panel calib-panel">
      <div class="calib-ring">
        <svg class="calib-prog" viewBox="0 0 120 120" aria-hidden="true">
          <circle class="calib-track" cx="60" cy="60" r="54"></circle>
          <circle class="calib-fill" id="calibFill" cx="60" cy="60" r="54"></circle>
        </svg>
        <span id="calibIcon">✋</span>
        <span class="calib-count" id="calibCount"></span>
      </div>
      <h2 id="calibTitle">${t("calibShow")}</h2>
      <div class="desc" id="calibDesc">${t("calibHint")}</div>
      <button class="btn ghost hidden" id="calibSkip" style="font-size:15px;padding:10px 24px">${t("calibSkip")}</button>
    </div>`);
    show(node);
    const CIRC = 2 * Math.PI * 54;
    const fill = node.querySelector("#calibFill");
    const countEl = node.querySelector("#calibCount");
    const iconEl = node.querySelector("#calibIcon");
    const titleEl = node.querySelector("#calibTitle");
    if (fill) { fill.style.strokeDasharray = CIRC; fill.style.strokeDashoffset = CIRC; }
    let held = 0, done = false, lastBeep = -1;
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
        if (held === 0) {
          iconEl.textContent = "✅";
          titleEl.textContent = t("calibHold");
          node.classList.add("calib-ok");
        }
        held += TICK;
        const frac = Math.min(1, held / HOLD_MS);
        if (fill) fill.style.strokeDashoffset = CIRC * (1 - frac);
        const left = Math.ceil((HOLD_MS - held) / 1000);
        if (countEl) countEl.textContent = left > 0 ? left : "";
        // one tick per second so the countdown is audible as well as visible
        if (left !== lastBeep && left > 0) { lastBeep = left; sfx.click(); }
        if (held >= HOLD_MS) { sfx.good(); finish(); }
      } else if (held > 0) {
        // Lost the hand: start the hold again rather than creeping forward.
        held = 0; lastBeep = -1;
        if (fill) fill.style.strokeDashoffset = CIRC;
        if (countEl) countEl.textContent = "";
        iconEl.textContent = "✋";
        titleEl.textContent = t("calibShow");
        node.classList.remove("calib-ok");
      }
    }, TICK);
    const skipTimer = setTimeout(() => { skipBtn.classList.remove("hidden"); }, 7000);
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
/* Power-ups drop in among the fruit. Each one is a visible emoji you have to
   actually slice, so picking one up is a skill moment rather than a freebie. */
const NINJA_POWERS = [
  { id: "slow",   emoji: "❄️", color: "#67e8f9", secs: 6, key: "puSlow" },
  { id: "double", emoji: "⭐", color: "#fbbf24", secs: 8, key: "puDouble" },
  { id: "magnet", emoji: "🧲", color: "#f472b6", secs: 7, key: "puMagnet" },
  { id: "life",   emoji: "💖", color: "#fb7185", secs: 0, key: "puLife" },
];
const NINJA = {
  track: "ninja",
  emoji: "🥷", titleKey: "ninjaTitle", howKey: "ninjaHow", bgToggle: true,
  objs: [], parts: [], trail: [], score: 0, combo: 0, comboT: 0, timeLeft: 60,
  spawnT: 0, running: false, hud: null, floaties: [], shake: 0, comboBanner: null,
  lastTipAt: 0, noHandSince: 0, mode: "time", selectedMode: "time", lives: 3,
  powers: {}, powerBanner: null,

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
    this.powers = {}; this.powerBanner = null;
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
    // An extra life is only worth dropping in Survival, where lives exist.
    const pool = this.mode === "life" ? NINJA_POWERS : NINJA_POWERS.filter(p => p.id !== "life");
    const power = Math.random() < 0.08 ? pool[Math.floor(Math.random() * pool.length)] : null;
    const isBomb = !power && Math.random() < 0.16;
    const x = 60 + Math.random() * (innerWidth - 120);
    this.objs.push({
      emoji: power ? power.emoji : isBomb ? "💣" : FRUITS[Math.floor(Math.random() * FRUITS.length)],
      bomb: isBomb, power,
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
    // active power-ups expire on their own clock
    Object.keys(this.powers).forEach(k => {
      this.powers[k] -= dt;
      if (this.powers[k] <= 0) delete this.powers[k];
    });
    if (this.powerBanner) { this.powerBanner.life -= dt; if (this.powerBanner.life <= 0) this.powerBanner = null; }
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
    const slowF = this.powers.slow > 0 ? 0.45 : 1;   // ❄️ slow-motion
    this.objs.forEach(o => {
      o.age += dt;
      o.vy += G * dt * slowF;
      o.x += o.vx * dt * slowF; o.y += o.vy * dt * slowF; o.rot += o.vrot * dt * slowF;
      ctx.save();
      ctx.translate(o.x, o.y); ctx.rotate(o.rot * 0.15);
      const pulse = 1 + Math.sin(o.age * 8) * .045;
      ctx.scale(pulse, pulse);
      ctx.font = `${o.r * 2}px sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      if (o.bomb) { ctx.shadowColor = "#f43f5e"; ctx.shadowBlur = 18; }
      if (o.power) {
        ctx.shadowColor = o.power.color; ctx.shadowBlur = 26;
        ctx.strokeStyle = o.power.color; ctx.lineWidth = 3;
        ctx.globalAlpha = .55 + Math.sin(o.age * 7) * .35;
        ctx.beginPath(); ctx.arc(0, 0, o.r * 1.15, 0, 7); ctx.stroke();
        ctx.globalAlpha = 1;
      }
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
          const halo = this.powers.magnet > 0 ? 74 : 24;   // 🧲 easier to connect
          if (Math.hypot(o.x - px, o.y - py) < o.r + halo) this.slice(o);
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

    /* active power-ups: a chip per effect with its time draining away */
    const live = NINJA_POWERS.filter(P => this.powers[P.id] > 0);
    if (live.length) {
      ctx.save();
      live.forEach((P, i) => {
        const w = 108, h = 30, x = 14, y = innerHeight - 52 - i * 38;
        const frac = Math.max(0, this.powers[P.id] / P.secs);
        ctx.fillStyle = "rgba(6,4,18,.82)";
        ctx.strokeStyle = P.color; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(x, y, w, h, 15); ctx.fill(); ctx.stroke();
        ctx.fillStyle = P.color; ctx.globalAlpha = .28;
        ctx.beginPath(); ctx.roundRect(x, y, w * frac, h, 15); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#fff"; ctx.font = "700 13px system-ui";
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(`${P.emoji} ${t(P.key)}`, x + 9, y + h / 2);
      });
      ctx.restore();
    }
    /* big flash when one is collected */
    if (this.powerBanner) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, this.powerBanner.life / 0.4);
      ctx.font = "900 clamp(24px,7vw,46px) Orbitron, system-ui";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = this.powerBanner.color;
      ctx.shadowColor = this.powerBanner.color; ctx.shadowBlur = 26;
      ctx.fillText(this.powerBanner.text, innerWidth / 2, innerHeight * 0.3);
      ctx.restore();
    }

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
    if (o.power) {
      const P = o.power;
      sfx.win();
      this.impact(P.color);
      this.powerBanner = { text: t(P.key), color: P.color, life: 1.6 };
      if (P.id === "life") {
        // Survival only: a heart is worth points once you are already at full.
        if (this.lives < 3) {
          this.lives++;
          const el2 = this.hud.querySelector("#nLives");
          if (el2) el2.textContent = "❤️".repeat(this.lives) + "🤍".repeat(3 - this.lives);
          this.floaties.push({ x: o.x, y: o.y, text: "+1 ❤️", color: P.color, life: 1.1 });
        } else {
          this.score += 50;
          this.floaties.push({ x: o.x, y: o.y, text: "+50", color: P.color, life: 1.1 });
          this.hud.querySelector("#nScore").textContent = this.score;
        }
      } else {
        this.powers[P.id] = P.secs;
        this.floaties.push({ x: o.x, y: o.y, text: t(P.key), color: P.color, life: 1.2 });
      }
      for (let i = 0; i < 16; i++) this.parts.push({
        x: o.x, y: o.y, vx: -260 + Math.random() * 520, vy: -320 + Math.random() * 420,
        size: 3 + Math.random() * 5, color: P.color, life: 0.45 + Math.random() * 0.35,
      });
      this.parts.push({ x: o.x, y: o.y, vx: 0, vy: 0, size: 14, ring: true, color: P.color, life: .5 });
      return;
    }
    if (o.bomb) {
      sfx.bomb();
      shakeScreen();
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
        if (livesEl) livesEl.textContent = "❤️".repeat(this.lives) + "🤍".repeat(3 - this.lives);
        if (this.lives <= 0) {
          this.hud.querySelector("#nScore").textContent = this.score;
          return this.end();
        }
      }
    } else {
      sfx.slice();
      this.combo++; this.comboT = 1.1;
      const mult = Math.min(5, 1 + Math.floor(this.combo / 3));
      const pts = 10 * mult * (this.powers.double > 0 ? 2 : 1);   // ⭐ double points
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
      for (let i = 0; i < 18; i++) this.parts.push({
        x: o.x, y: o.y, vx: -320 + Math.random() * 640, vy: -400 + Math.random() * 450,
        size: 3 + Math.random() * 6, color: ["#ff007f", "#00f0ff", "#39ff14"][i % 3], life: 0.45 + Math.random() * 0.4,
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
    const daily = setDailyBest("ninja", this.score);
    const rank = this.score >= 400 ? 0 : this.score >= 200 ? 1 : 2;
    if (this.hud) this.hud.remove();
    ui.classList.remove("passthrough");
    const node = el(`<div class="panel">
      <div class="big-emoji">🏆</div>
      <h2>${t("debugged")}</h2>
      <div class="score-line">${this.score}</div>
      <div class="result-rank">${t("ninjaRanks")[rank]}</div>
      ${isNew ? `<div class="desc" style="color:var(--amber)">${t("newBest")}</div>` : daily.isNew ? `<div class="desc" style="color:var(--cyan)">${t("newDailyBest")}</div>` : ""}
      <div class="best-line">${t("best")}: ${best} · ${t("todaysBest")}: ${daily.best}</div>
      <button class="btn" id="againBtn">${t("again")}</button>
      <br><button class="btn ghost" id="menuBtn" style="font-size:15px;padding:10px 24px">← ${t("back")}</button>
    </div>`);
    node.querySelector("#againBtn").onclick = () => { sfx.click(); show(null); ui.classList.add("passthrough"); this.start(); };
    node.querySelector("#menuBtn").onclick = () => { sfx.click(); menu(); };
    show(node);
  },
};


/* ================================================
   VERSUS : AIR NINJA — two players, one camera
   Player 1 owns the left half of the screen, player 2 the right. Each side
   spawns its own fruit and reads its own hand, so neither can reach into the
   other's lane. Three lives each; a bomb costs one. Whoever still has lives
   when the clock runs out and has scored most, wins.
================================================ */
const VS_DURATION = 90, VS_LIVES = 3;
const VS_COLORS = ["#22d3ee", "#f472b6"];

const NINJA_VS = {
  track: "ninja",
  emoji: "⚔️", titleKey: "vsNinjaTitle", howKey: "vsNinjaHow", bgToggle: true, versus: true,
  sides: [], timeLeft: VS_DURATION, running: false, hud: null, shake: 0, winner: null,

  makeSide(i) {
    return {
      i, color: VS_COLORS[i],
      objs: [], parts: [], trail: [], floaties: [],
      score: 0, combo: 0, comboT: 0, lives: VS_LIVES,
      spawnT: 0.6 + i * 0.3, powers: {}, banner: null, lastTipAt: 0, out: false,
    };
  },
  bounds(i) {
    const mid = innerWidth / 2;
    return i === 0 ? { x0: 0, x1: mid } : { x0: mid, x1: innerWidth };
  },

  start() {
    this.cleanup();
    this.sides = [this.makeSide(0), this.makeSide(1)];
    this.timeLeft = VS_DURATION; this.shake = 0; this.winner = null; this.running = true;
    this.hud = el(`<div class="hud vs-hud">
      <div class="stat vs-p1"><div class="lbl">${t("p1")}</div><div class="num cyan" id="vsS0">0</div><div class="vs-lives" id="vsL0">❤️❤️❤️</div></div>
      <div class="stat"><div class="lbl">${t("time")}</div><div class="num amber" id="vsTime">${VS_DURATION}</div></div>
      <div class="stat vs-p2"><div class="lbl">${t("p2")}</div><div class="num pink" id="vsS1">0</div><div class="vs-lives" id="vsL1">❤️❤️❤️</div></div>
    </div>`);
    document.body.append(this.hud);
    engine.setHandCount(2);
  },

  cleanup() {
    this.hud?.remove(); this.hud = null; this.running = false;
    engine.setHandCount(1);
  },

  spawn(side) {
    const b = this.bounds(side.i);
    const pool = NINJA_POWERS.filter(p => p.id !== "magnet");   // no reach-extending power in a split lane
    const power = Math.random() < 0.08 ? pool[Math.floor(Math.random() * pool.length)] : null;
    const isBomb = !power && Math.random() < 0.16;
    const pad = 50;
    const x = b.x0 + pad + Math.random() * Math.max(10, (b.x1 - b.x0) - pad * 2);
    side.objs.push({
      emoji: power ? power.emoji : isBomb ? "💣" : FRUITS[Math.floor(Math.random() * FRUITS.length)],
      bomb: isBomb, power,
      x, y: innerHeight + 60,
      vx: ((b.x0 + b.x1) / 2 - x) * (0.3 + Math.random() * 0.5) / 100 * 60,
      vy: -(innerHeight * (0.95 + Math.random() * 0.3)),
      r: 32 + Math.random() * 12,
      rot: Math.random() * 6, vrot: -2 + Math.random() * 4,
      sliced: false, age: 0,
    });
  },

  hit(side, o) {
    o.sliced = true;
    if (o.power) {
      const P = o.power;
      sfx.win();
      side.banner = { text: t(P.key), color: P.color, life: 1.3 };
      if (P.id === "life") {
        if (side.lives < VS_LIVES) side.lives++;
        else { side.score += 50; }
      } else side.powers[P.id] = P.secs;
      for (let k = 0; k < 14; k++) side.parts.push({
        x: o.x, y: o.y, vx: -240 + Math.random() * 480, vy: -300 + Math.random() * 400,
        size: 3 + Math.random() * 5, color: P.color, life: 0.4 + Math.random() * 0.3,
      });
      this.refreshHud();
      return;
    }
    if (o.bomb) {
      sfx.bomb(); shakeScreen();
      this.shake = 20;
      side.combo = 0;
      side.score = Math.max(0, side.score - 20);
      side.lives = Math.max(0, side.lives - 1);
      side.floaties.push({ x: o.x, y: o.y, text: "-1 ❤️", color: "#f43f5e", life: 1 });
      for (let k = 0; k < 20; k++) side.parts.push({
        x: o.x, y: o.y, vx: -340 + Math.random() * 680, vy: -400 + Math.random() * 480,
        size: 3 + Math.random() * 6, color: ["#f43f5e", "#fbbf24", "#fff"][k % 3], life: 0.5 + Math.random() * 0.4,
      });
      if (side.lives <= 0) { side.out = true; this.refreshHud(); return this.end(); }
    } else {
      sfx.slice();
      side.combo++; side.comboT = 1.1;
      const mult = Math.min(5, 1 + Math.floor(side.combo / 3));
      const pts = 10 * mult * (side.powers.double > 0 ? 2 : 1);
      side.score += pts;
      side.floaties.push({ x: o.x, y: o.y, text: "+" + pts, color: "#a3e635", life: 0.9 });
      side.parts.push({ x: o.x, y: o.y, vx: 0, vy: 0, size: 12, ring: true, color: side.color, life: .42 });
      for (let k = 0; k < 9; k++) side.parts.push({
        x: o.x, y: o.y, vx: -220 + Math.random() * 440, vy: -280 + Math.random() * 360,
        size: 2 + Math.random() * 4, color: side.color, life: 0.35 + Math.random() * 0.3,
      });
    }
    this.refreshHud();
  },

  refreshHud() {
    if (!this.hud) return;
    this.sides.forEach((s, i) => {
      const sc = this.hud.querySelector(`#vsS${i}`), lv = this.hud.querySelector(`#vsL${i}`);
      if (sc) sc.textContent = s.score;
      if (lv) lv.textContent = "❤️".repeat(s.lives) + "🤍".repeat(VS_LIVES - s.lives);
    });
  },

  onFrame(dt) {
    if (!this.running) return;
    this.timeLeft -= dt;
    if (this.timeLeft <= 0) return this.end();
    const tEl = this.hud?.querySelector("#vsTime");
    if (tEl) tEl.textContent = Math.ceil(this.timeLeft);

    this.shake = Math.max(0, this.shake - dt * 34);
    ctx.save();
    if (this.shake > 0) ctx.translate((Math.random() - .5) * this.shake, (Math.random() - .5) * this.shake);
    if (!camBgOn) { ctx.fillStyle = "#0b0518"; ctx.fillRect(0, 0, innerWidth, innerHeight); }

    const G = innerHeight * 1.1, nowT = performance.now();

    this.sides.forEach((side) => {
      const b = this.bounds(side.i);

      // each player only ever sees their own hand, clamped into their lane
      const raw = engine.multi[side.i];
      let tip = null;
      if (raw) {
        const p = raw[8];
        tip = { x: Math.max(b.x0 + 6, Math.min(b.x1 - 6, p.x)), y: p.y };
        const last = side.trail[side.trail.length - 1];
        if (!last || nowT - side.lastTipAt > 180 || dist(last, tip) > 1.5) {
          if (last && nowT - side.lastTipAt > 180) side.trail = [];
          side.trail.push({ x: tip.x, y: tip.y, t: nowT });
          side.lastTipAt = nowT;
        }
      }
      pruneInPlace(side.trail, p => nowT - p.t < 260);

      Object.keys(side.powers).forEach(k => { side.powers[k] -= dt; if (side.powers[k] <= 0) delete side.powers[k]; });
      if (side.banner) { side.banner.life -= dt; if (side.banner.life <= 0) side.banner = null; }

      side.spawnT -= dt;
      if (side.spawnT <= 0) {
        const prog = 1 - this.timeLeft / VS_DURATION;
        const wave = 1 + Math.floor(Math.random() * (prog > .5 ? 2 : 1.4));
        for (let k = 0; k < wave; k++) setTimeout(() => this.running && this.spawn(side), k * 150);
        side.spawnT = prog > .66 ? 0.85 : prog > .33 ? 1.05 : 1.3;
      }

      const slowF = side.powers.slow > 0 ? 0.45 : 1;
      side.objs.forEach(o => {
        o.age += dt; o.vy += G * dt * slowF;
        o.x += o.vx * dt * slowF; o.y += o.vy * dt * slowF; o.rot += o.vrot * dt * slowF;
        ctx.save();
        ctx.translate(o.x, o.y); ctx.rotate(o.rot * 0.15);
        ctx.font = `${o.r * 2}px sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        if (o.bomb) { ctx.shadowColor = "#f43f5e"; ctx.shadowBlur = 18; }
        if (o.power) {
          ctx.shadowColor = o.power.color; ctx.shadowBlur = 24;
          ctx.strokeStyle = o.power.color; ctx.lineWidth = 3;
          ctx.globalAlpha = .55 + Math.sin(o.age * 7) * .35;
          ctx.beginPath(); ctx.arc(0, 0, o.r * 1.15, 0, 7); ctx.stroke();
          ctx.globalAlpha = 1;
        }
        ctx.fillText(o.emoji, 0, 0);
        ctx.restore();
      });
      pruneInPlace(side.objs, o => o.y < innerHeight + 120 && !o.sliced);

      if (side.trail.length >= 2) {
        const a = side.trail[side.trail.length - 2], c = side.trail[side.trail.length - 1];
        if (dist(a, c) > 3.5) {
          side.objs.forEach(o => {
            if (o.sliced) return;
            const dx = c.x - a.x, dy = c.y - a.y;
            const len2 = dx * dx + dy * dy || 1e-6;
            let u = ((o.x - a.x) * dx + (o.y - a.y) * dy) / len2;
            u = Math.max(0, Math.min(1, u));
            const px = a.x + u * dx, py = a.y + u * dy;
            if (Math.hypot(o.x - px, o.y - py) < o.r + 26) this.hit(side, o);
          });
        }
      }

      side.comboT -= dt;
      if (side.comboT <= 0) side.combo = 0;

      side.parts.forEach(p => {
        if (!p.ring) p.vy += 600 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
        ctx.globalAlpha = Math.max(0, p.life * 2);
        if (p.ring) {
          p.size += 260 * dt;
          ctx.strokeStyle = p.color; ctx.lineWidth = Math.max(1, 8 * p.life);
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 7); ctx.stroke();
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 7); ctx.fill();
        }
        ctx.globalAlpha = 1;
      });
      pruneInPlace(side.parts, p => p.life > 0);

      side.floaties.forEach(f => {
        f.y -= 60 * dt; f.life -= dt;
        ctx.globalAlpha = Math.max(0, f.life);
        ctx.font = "bold 24px sans-serif"; ctx.textAlign = "center";
        ctx.fillStyle = f.color; ctx.shadowColor = f.color; ctx.shadowBlur = 12;
        ctx.fillText(f.text, f.x, f.y);
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      });
      pruneInPlace(side.floaties, f => f.life > 0);

      if (side.trail.length >= 2) {
        ctx.save();
        ctx.lineCap = "round"; ctx.lineJoin = "round";
        for (let k = 1; k < side.trail.length; k++) {
          const p0 = side.trail[k - 1], p1 = side.trail[k];
          const age = (nowT - p1.t) / 260;
          ctx.strokeStyle = side.color.replace(")", `,${1 - age})`).replace("rgb", "rgba");
          ctx.globalAlpha = 1 - age;
          ctx.strokeStyle = side.color;
          ctx.lineWidth = 12 * (1 - age) + 2;
          ctx.shadowColor = side.color; ctx.shadowBlur = 16;
          ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
        }
        ctx.restore();
      }
      if (tip) {
        ctx.save();
        ctx.strokeStyle = side.color; ctx.lineWidth = 3;
        ctx.shadowColor = side.color; ctx.shadowBlur = 14;
        ctx.beginPath(); ctx.arc(tip.x, tip.y, 16, 0, 7); ctx.stroke();
        ctx.restore();
      } else {
        ctx.save();
        ctx.globalAlpha = .5 + Math.sin(nowT / 300) * .3;
        ctx.fillStyle = side.color; ctx.font = "800 15px system-ui";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(t("vsShowHand"), (b.x0 + b.x1) / 2, innerHeight / 2);
        ctx.restore();
      }

      if (side.banner) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, side.banner.life / .4);
        ctx.font = "900 clamp(16px,3vw,26px) Orbitron, system-ui";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = side.banner.color;
        ctx.shadowColor = side.banner.color; ctx.shadowBlur = 20;
        ctx.fillText(side.banner.text, (b.x0 + b.x1) / 2, innerHeight * 0.26);
        ctx.restore();
      }
    });

    /* the divider — makes the two lanes unmistakable */
    ctx.save();
    const grad = ctx.createLinearGradient(0, 0, 0, innerHeight);
    grad.addColorStop(0, "rgba(255,255,255,.05)");
    grad.addColorStop(.5, "rgba(255,255,255,.55)");
    grad.addColorStop(1, "rgba(255,255,255,.05)");
    ctx.strokeStyle = grad; ctx.lineWidth = 3;
    ctx.setLineDash([12, 10]);
    ctx.beginPath(); ctx.moveTo(innerWidth / 2, 0); ctx.lineTo(innerWidth / 2, innerHeight); ctx.stroke();
    ctx.restore();
    ctx.restore();
  },

  end() {
    if (!this.running) return;
    this.running = false;
    sfx.win();
    const [a, b] = this.sides;
    // Running out of lives loses it outright, whatever the score says.
    let win;
    if (a.out && !b.out) win = 1;
    else if (b.out && !a.out) win = 0;
    else win = a.score === b.score ? -1 : (a.score > b.score ? 0 : 1);
    this.winner = win;
    this.hud?.remove(); this.hud = null;
    engine.setHandCount(1);
    ui.classList.remove("passthrough");
    const title = win === -1 ? t("vsDraw") : t("vsWinner")(win + 1);
    const node = el(`<div class="panel">
      <div class="big-emoji">${win === -1 ? "🤝" : "🏆"}</div>
      <h2>${title}</h2>
      <div class="vs-result">
        <div class="vs-col" style="--c:${VS_COLORS[0]}"><b>${t("p1")}</b><span>${a.score}</span><i>${"❤️".repeat(a.lives) || "💀"}</i></div>
        <div class="vs-col" style="--c:${VS_COLORS[1]}"><b>${t("p2")}</b><span>${b.score}</span><i>${"❤️".repeat(b.lives) || "💀"}</i></div>
      </div>
      <button class="btn" id="againBtn">${t("again")}</button>
      <br><button class="btn ghost" id="menuBtn" style="font-size:15px;padding:10px 24px">← ${t("back")}</button>
    </div>`);
    node.querySelector("#againBtn").onclick = () => { sfx.click(); show(null); ui.classList.add("passthrough"); this.start(); };
    node.querySelector("#menuBtn").onclick = () => { sfx.click(); menu(); };
    show(node);
  },
};

/* ================================================
   GAME 2 : HAND SNAKE
================================================ */
/* Free-movement snake: the head IS the smoothed fingertip position every
   frame — there is no grid tick to fall behind on, so it can never "outrun"
   detection the way a fixed-speed grid step could. The body is a rope of
   recent head positions, trimmed to a length budget that grows on each food. */
/* Most food is ordinary. Roughly one in five is a special pickup, which
   gives a long run some variety and a way out of trouble. */
const SNAKE_FOODS = [
  { id: "ghost",  emoji: "👻", color: "#c4b5fd", secs: 6, key: "puGhost" },
  { id: "bonus",  emoji: "⭐", color: "#fbbf24", secs: 0, key: "puBonus" },
  { id: "shrink", emoji: "✂️", color: "#67e8f9", secs: 0, key: "puShrink" },
  { id: "magnet", emoji: "🧲", color: "#f472b6", secs: 8, key: "puPull" },
];
const SNAKE = {
  track: "snake",
  emoji: "🐍", titleKey: "snakeTitle", howKey: "snakeHow", bgToggle: true,
  head: null, dir: { x: 1, y: 0 }, path: [], budget: 0, thickness: 22,
  score: 0, food: null, tracking: false, field: null, bg: null,
  hud: null, resetBtn: null, running: false,
  powers: {}, powerBanner: null,

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
    this.powers = {}; this.powerBanner = null;
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
      if (!this.head || Math.hypot(p.x - this.head.x, p.y - this.head.y) > this.thickness * 4) {
        p.kind = Math.random() < 0.2 ? SNAKE_FOODS[Math.floor(Math.random() * SNAKE_FOODS.length)] : null;
        return p;
      }
    }
    return { x: this.field.x + this.field.width / 2, y: this.field.y + this.field.height / 2, kind: null };
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
          const K = this.food.kind;
          if (K) {
            sfx.win();
            this.powerBanner = { text: t(K.key), color: K.color, life: 1.5 };
            if (K.id === "bonus") { this.score += 50; this.budget += this.segUnit; }
            else if (K.id === "shrink") {
              // A deliberate escape hatch once the tail gets unmanageable.
              this.budget = Math.max(this.segUnit * 3, this.budget * 0.6);
              this.score += 10;
              this.trimPath();
            } else { this.powers[K.id] = K.secs; this.score += 10; this.budget += this.segUnit; }
          } else {
            this.score += 10; this.budget += this.segUnit; sfx.good();
          }
          this.food = this.newFood();
          const score = this.hud?.querySelector("#sScore"), length = this.hud?.querySelector("#sLength");
          if (score) { score.textContent = this.score; score.classList.remove("score-punch"); void score.offsetWidth; score.classList.add("score-punch"); }
          if (length) length.textContent = Math.round(this.budget / this.segUnit);
        }

        /* self-collision: skip a short arc right behind the head (that's
           just the neck, always close) then check the rest of the trail. */
        if (this.powers.ghost > 0) { /* 👻 pass straight through your own tail */ }
        else {
        const skipArc = this.thickness * 3.6, hitR = this.thickness * .5;
        let acc = 0, cut = 0;
        for (let i = this.path.length - 1; i > 0; i--) {
          acc += dist(this.path[i], this.path[i - 1]);
          if (acc > skipArc) { cut = i; break; }
        }
        for (let j = 0; j < cut; j++) {
          if (dist(this.head, this.path[j]) < hitR) {
            shakeScreen();
            this.end();
            return;
          }
        }
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

    /* power-up timers */
    Object.keys(this.powers).forEach(k => { this.powers[k] -= dt; if (this.powers[k] <= 0) delete this.powers[k]; });
    if (this.powerBanner) { this.powerBanner.life -= dt; if (this.powerBanner.life <= 0) this.powerBanner = null; }

    /* 🧲 magnet: the food drifts toward the head instead of sitting still */
    if (this.powers.magnet > 0 && this.head) {
      const dx = this.head.x - this.food.x, dy = this.head.y - this.food.y;
      const d = Math.hypot(dx, dy) || 1;
      const pull = Math.min(d, this.thickness * 5 * dt);
      this.food.x += dx / d * pull; this.food.y += dy / d * pull;
    }

    /* food — special pickups show their emoji and a pulsing halo */
    const FK = this.food.kind;
    if (FK) {
      ctx.save();
      ctx.shadowColor = FK.color; ctx.shadowBlur = 26;
      ctx.strokeStyle = FK.color; ctx.lineWidth = 3;
      ctx.globalAlpha = .5 + Math.sin(now / 180) * .4;
      ctx.beginPath(); ctx.arc(this.food.x, this.food.y, this.thickness * .85, 0, 7); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.font = `${this.thickness * 1.25}px sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(FK.emoji, this.food.x, this.food.y);
      ctx.restore();
    } else {
      ctx.shadowColor = "#ec4899"; ctx.shadowBlur = 22; ctx.fillStyle = "#f9a8d4";
      ctx.beginPath(); ctx.arc(this.food.x, this.food.y, this.thickness * (.42 + Math.sin(now / 260) * .05), 0, 7); ctx.fill();
    }
    ctx.shadowBlur = 0;

    /* body as one continuous rounded ribbon */
    const width = this.thickness;
    const ghosting = this.powers.ghost > 0;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.shadowColor = ghosting ? "#c4b5fd" : "#a855f7"; ctx.shadowBlur = ghosting ? 22 : 14;
    ctx.strokeStyle = ghosting ? "rgba(196,181,253,.55)" : "rgba(168,85,247,.92)";
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

    /* active power-ups, same chip style as Air Ninja */
    const liveS = SNAKE_FOODS.filter(P => this.powers[P.id] > 0);
    if (liveS.length) {
      ctx.save();
      liveS.forEach((P, i) => {
        const w = 108, h = 30, x = 14, y = innerHeight - 52 - i * 38;
        const frac = Math.max(0, this.powers[P.id] / P.secs);
        ctx.fillStyle = "rgba(6,4,18,.82)";
        ctx.strokeStyle = P.color; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(x, y, w, h, 15); ctx.fill(); ctx.stroke();
        ctx.fillStyle = P.color; ctx.globalAlpha = .28;
        ctx.beginPath(); ctx.roundRect(x, y, w * frac, h, 15); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#fff"; ctx.font = "700 13px system-ui";
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText(`${P.emoji} ${t(P.key)}`, x + 9, y + h / 2);
      });
      ctx.restore();
    }
    if (this.powerBanner) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, this.powerBanner.life / 0.4);
      ctx.font = "900 clamp(22px,6vw,40px) Orbitron, system-ui";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = this.powerBanner.color;
      ctx.shadowColor = this.powerBanner.color; ctx.shadowBlur = 24;
      ctx.fillText(this.powerBanner.text, innerWidth / 2, field.y + field.height * 0.25);
      ctx.restore();
    }
  },

  end() {
    if (!this.running) return;
    const score = this.score, rank = score >= 180 ? 0 : score >= 80 ? 1 : 2;
    const daily = setDailyBest("snake", score);
    this.cleanup(); sfx.bad(); ui.classList.remove("passthrough");
    const node = el(`<div class="panel"><div class="big-emoji">🐍</div><h2>${t("gameOver")}</h2><div class="score-line">${score}</div><div class="result-rank">${t("snakeRanks")[rank]}</div>${daily.isNew ? `<div class="desc" style="color:var(--cyan)">${t("newDailyBest")}</div>` : ""}<div class="best-line">${t("todaysBest")}: ${daily.best}</div><button class="btn" id="againBtn">${t("again")}</button><br><button class="btn ghost" id="menuBtn" style="font-size:15px;padding:10px 24px">← ${t("back")}</button></div>`);
    node.querySelector("#againBtn").onclick = () => { sfx.click(); show(null); ui.classList.add("passthrough"); this.start(); };
    node.querySelector("#menuBtn").onclick = () => { sfx.click(); menu(); };
    show(node);
  },
};


/* ================================================
   VERSUS : HAND SNAKE — one arena each
   Two arenas side by side, one per player. Crashing into your own tail does
   not end the match, it costs a life and restarts that player's snake, so a
   single early mistake does not leave one child watching the other play.
================================================ */
const SNAKE_VS = {
  track: "snake",
  emoji: "🐍", titleKey: "vsSnakeTitle", howKey: "vsSnakeHow", bgToggle: true, versus: true,
  sides: [], timeLeft: VS_DURATION, running: false, hud: null,

  makeSide(i, field) {
    const thickness = Math.max(13, Math.min(24, Math.min(field.width, field.height) / 15));
    return {
      i, color: VS_COLORS[i], field, thickness, segUnit: thickness * 2.6,
      head: { x: field.x + field.width / 2, y: field.y + field.height / 2 },
      path: [], dir: { x: 1, y: 0 }, budget: thickness * 2.6 * 3,
      score: 0, lives: VS_LIVES, food: null, tracking: false,
      powers: {}, banner: null, deadFor: 0,
    };
  },
  layoutFields() {
    const topSafe = 132, bottomSafe = 60, gap = 14;
    const halfW = (innerWidth - gap * 3) / 2;
    const w = Math.max(180, Math.min(520, halfW));
    const h = Math.max(200, Math.min(560, innerHeight - topSafe - bottomSafe));
    const y = Math.round(topSafe + Math.max(0, (innerHeight - topSafe - bottomSafe - h) / 2));
    const leftX = Math.round(innerWidth / 2 - gap / 2 - w);
    const rightX = Math.round(innerWidth / 2 + gap / 2);
    return [{ x: leftX, y, width: w, height: h }, { x: rightX, y, width: w, height: h }];
  },

  start() {
    this.cleanup();
    const fields = this.layoutFields();
    this.sides = [this.makeSide(0, fields[0]), this.makeSide(1, fields[1])];
    this.sides.forEach(s => { s.path = [{ ...s.head }]; s.food = this.newFood(s); });
    this.timeLeft = VS_DURATION; this.running = true;
    this.hud = el(`<div class="hud vs-hud">
      <div class="stat vs-p1"><div class="lbl">${t("p1")}</div><div class="num cyan" id="vnS0">0</div><div class="vs-lives" id="vnL0">❤️❤️❤️</div></div>
      <div class="stat"><div class="lbl">${t("time")}</div><div class="num amber" id="vnTime">${VS_DURATION}</div></div>
      <div class="stat vs-p2"><div class="lbl">${t("p2")}</div><div class="num pink" id="vnS1">0</div><div class="vs-lives" id="vnL1">❤️❤️❤️</div></div>
    </div>`);
    document.body.append(this.hud);
    engine.setHandCount(2);
  },

  cleanup() {
    this.hud?.remove(); this.hud = null; this.running = false;
    engine.setHandCount(1);
  },

  newFood(s) {
    const m = s.thickness * 1.6;
    for (let a = 0; a < 20; a++) {
      const p = {
        x: s.field.x + m + Math.random() * (s.field.width - m * 2),
        y: s.field.y + m + Math.random() * (s.field.height - m * 2),
      };
      if (!s.head || Math.hypot(p.x - s.head.x, p.y - s.head.y) > s.thickness * 4) {
        p.kind = Math.random() < 0.2 ? SNAKE_FOODS[Math.floor(Math.random() * SNAKE_FOODS.length)] : null;
        return p;
      }
    }
    return { x: s.field.x + s.field.width / 2, y: s.field.y + s.field.height / 2, kind: null };
  },
  trimPath(s) {
    let total = 0;
    for (let i = s.path.length - 1; i > 0; i--) {
      total += dist(s.path[i], s.path[i - 1]);
      if (total > s.budget) { s.path.splice(0, i - 1); return; }
    }
  },
  // A crash costs a life and respawns that player only; the match continues.
  respawn(s) {
    s.lives = Math.max(0, s.lives - 1);
    s.head = { x: s.field.x + s.field.width / 2, y: s.field.y + s.field.height / 2 };
    s.path = [{ ...s.head }];
    s.budget = s.segUnit * 3;
    s.powers = {}; s.tracking = false; s.deadFor = 1.1;
    s.banner = { text: t("vsCrash"), color: "#f43f5e", life: 1.2 };
    sfx.bad(); shakeScreen();
    this.refreshHud();
    if (s.lives <= 0) this.end();
  },
  refreshHud() {
    if (!this.hud) return;
    this.sides.forEach((s, i) => {
      const sc = this.hud.querySelector(`#vnS${i}`), lv = this.hud.querySelector(`#vnL${i}`);
      if (sc) sc.textContent = s.score;
      if (lv) lv.textContent = "❤️".repeat(s.lives) + "🤍".repeat(VS_LIVES - s.lives);
    });
  },

  onFrame(dt) {
    if (!this.running) return;
    this.timeLeft -= dt;
    if (this.timeLeft <= 0) return this.end();
    const tEl = this.hud?.querySelector("#vnTime");
    if (tEl) tEl.textContent = Math.ceil(this.timeLeft);

    if (!camBgOn) { ctx.fillStyle = "#0b0518"; ctx.fillRect(0, 0, innerWidth, innerHeight); }
    else { ctx.fillStyle = "rgba(5,8,28,.22)"; ctx.fillRect(0, 0, innerWidth, innerHeight); }
    const now = performance.now();

    this.sides.forEach(s => {
      const f = s.field;
      Object.keys(s.powers).forEach(k => { s.powers[k] -= dt; if (s.powers[k] <= 0) delete s.powers[k]; });
      if (s.banner) { s.banner.life -= dt; if (s.banner.life <= 0) s.banner = null; }
      if (s.deadFor > 0) s.deadFor -= dt;

      /* arena frame */
      ctx.save();
      ctx.strokeStyle = s.color; ctx.lineWidth = 2.5;
      ctx.shadowColor = s.color; ctx.shadowBlur = 14;
      ctx.fillStyle = "rgba(10,6,26,.5)";
      ctx.beginPath(); ctx.roundRect(f.x - 8, f.y - 8, f.width + 16, f.height + 16, 18);
      ctx.fill(); ctx.stroke();
      ctx.restore();

      const raw = engine.multi[s.i];
      if (raw && s.deadFor <= 0) {
        const m = s.thickness / 2;
        const tx = Math.max(f.x + m, Math.min(f.x + f.width - m, raw[8].x));
        const ty = Math.max(f.y + m, Math.min(f.y + f.height - m, raw[8].y));
        const k = 1 - Math.pow(1e-7, dt);
        if (!s.tracking) s.head = { x: tx, y: ty };
        else { s.head.x += (tx - s.head.x) * k; s.head.y += (ty - s.head.y) * k; }
        s.tracking = true;

        const last = s.path[s.path.length - 1];
        if (!last || dist(s.head, last) > 3) {
          if (last) {
            const dx = s.head.x - last.x, dy = s.head.y - last.y;
            const len = Math.hypot(dx, dy) || 1;
            s.dir = { x: dx / len, y: dy / len };
          }
          s.path.push({ x: s.head.x, y: s.head.y });
          this.trimPath(s);

          if (dist(s.head, s.food) < s.thickness * .85) {
            const K = s.food.kind;
            if (K) {
              sfx.win();
              s.banner = { text: t(K.key), color: K.color, life: 1.3 };
              if (K.id === "bonus") { s.score += 50; s.budget += s.segUnit; }
              else if (K.id === "shrink") { s.budget = Math.max(s.segUnit * 3, s.budget * .6); s.score += 10; this.trimPath(s); }
              else { s.powers[K.id] = K.secs; s.score += 10; s.budget += s.segUnit; }
            } else { s.score += 10; s.budget += s.segUnit; sfx.good(); }
            s.food = this.newFood(s);
            this.refreshHud();
          }

          if (s.powers.ghost > 0) { /* pass through your own tail */ }
          else {
            const skipArc = s.thickness * 3.6, hitR = s.thickness * .5;
            let acc = 0, cut = 0;
            for (let i = s.path.length - 1; i > 0; i--) {
              acc += dist(s.path[i], s.path[i - 1]);
              if (acc > skipArc) { cut = i; break; }
            }
            for (let j = 0; j < cut; j++) {
              if (dist(s.head, s.path[j]) < hitR) { this.respawn(s); return; }
            }
          }
        }
      } else if (!raw) s.tracking = false;

      /* magnet pulls the food in */
      if (s.powers.magnet > 0) {
        const dx = s.head.x - s.food.x, dy = s.head.y - s.food.y;
        const d = Math.hypot(dx, dy) || 1, pull = Math.min(d, s.thickness * 5 * dt);
        s.food.x += dx / d * pull; s.food.y += dy / d * pull;
      }

      /* food */
      const FK = s.food.kind;
      ctx.save();
      if (FK) {
        ctx.shadowColor = FK.color; ctx.shadowBlur = 22;
        ctx.strokeStyle = FK.color; ctx.lineWidth = 2.5;
        ctx.globalAlpha = .5 + Math.sin(now / 180) * .4;
        ctx.beginPath(); ctx.arc(s.food.x, s.food.y, s.thickness * .85, 0, 7); ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.font = `${s.thickness * 1.2}px sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(FK.emoji, s.food.x, s.food.y);
      } else {
        ctx.shadowColor = "#ec4899"; ctx.shadowBlur = 20; ctx.fillStyle = "#f9a8d4";
        ctx.beginPath(); ctx.arc(s.food.x, s.food.y, s.thickness * (.42 + Math.sin(now / 260) * .05), 0, 7); ctx.fill();
      }
      ctx.restore();

      /* body */
      if (s.path.length >= 2) {
        const ghosting = s.powers.ghost > 0;
        ctx.save();
        ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.shadowColor = ghosting ? "#c4b5fd" : s.color; ctx.shadowBlur = ghosting ? 20 : 12;
        ctx.strokeStyle = ghosting ? "rgba(196,181,253,.55)" : s.color;
        ctx.globalAlpha = s.deadFor > 0 ? .3 : 1;
        ctx.lineWidth = s.thickness;
        ctx.beginPath();
        ctx.moveTo(s.path[0].x, s.path[0].y);
        for (let i = 1; i < s.path.length; i++) ctx.lineTo(s.path[i].x, s.path[i].y);
        ctx.stroke();
        ctx.restore();
      }
      /* head */
      ctx.save();
      ctx.globalAlpha = s.deadFor > 0 ? .3 : 1;
      ctx.shadowColor = s.color; ctx.shadowBlur = 14; ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(s.head.x, s.head.y, s.thickness * .62, 0, 7); ctx.fill();
      ctx.restore();

      /* labels and prompts */
      ctx.save();
      ctx.textAlign = "center";
      ctx.font = "900 12px Orbitron, system-ui"; ctx.fillStyle = s.color;
      ctx.fillText(t(s.i === 0 ? "p1" : "p2"), f.x + f.width / 2, f.y - 16);
      if (!raw) {
        ctx.globalAlpha = .5 + Math.sin(now / 300) * .3;
        ctx.font = "800 14px system-ui";
        ctx.fillText(t("vsShowHand"), f.x + f.width / 2, f.y + f.height / 2);
      }
      ctx.restore();

      if (s.banner) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, s.banner.life / .4);
        ctx.font = "900 clamp(14px,2.4vw,22px) Orbitron, system-ui";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = s.banner.color;
        ctx.shadowColor = s.banner.color; ctx.shadowBlur = 18;
        ctx.fillText(s.banner.text, f.x + f.width / 2, f.y + 34);
        ctx.restore();
      }
    });
  },

  end() {
    if (!this.running) return;
    this.running = false;
    sfx.win();
    const [a, b] = this.sides;
    let win;
    if (a.lives <= 0 && b.lives > 0) win = 1;
    else if (b.lives <= 0 && a.lives > 0) win = 0;
    else win = a.score === b.score ? -1 : (a.score > b.score ? 0 : 1);
    this.winner = win;
    this.hud?.remove(); this.hud = null;
    engine.setHandCount(1);
    ui.classList.remove("passthrough");
    const node = el(`<div class="panel">
      <div class="big-emoji">${win === -1 ? "🤝" : "🏆"}</div>
      <h2>${win === -1 ? t("vsDraw") : t("vsWinner")(win + 1)}</h2>
      <div class="vs-result">
        <div class="vs-col" style="--c:${VS_COLORS[0]}"><b>${t("p1")}</b><span>${a.score}</span><i>${"❤️".repeat(a.lives) || "💀"}</i></div>
        <div class="vs-col" style="--c:${VS_COLORS[1]}"><b>${t("p2")}</b><span>${b.score}</span><i>${"❤️".repeat(b.lives) || "💀"}</i></div>
      </div>
      <button class="btn" id="againBtn">${t("again")}</button>
      <br><button class="btn ghost" id="menuBtn" style="font-size:15px;padding:10px 24px">← ${t("back")}</button>
    </div>`);
    node.querySelector("#againBtn").onclick = () => { sfx.click(); show(null); ui.classList.add("passthrough"); this.start(); };
    node.querySelector("#menuBtn").onclick = () => { sfx.click(); menu(); };
    show(node);
  },
};

/* ================================================
   GAME 3 : HAND BLAST
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
/* Board size. Everything below derives from this, so the grid can be changed
   here alone. */
const BLAST_GRID = 5;

/* The weights above were tuned for an 8x8 board. On a smaller grid a piece
   that spans most of a row leaves almost no room to recover from a bad drop,
   so the bag is filtered to shapes that actually fit — nothing longer than
   three cells in either direction, nothing bigger than four cells — and then
   re-weighted to favour small pieces, which is what keeps a 5x5 breathing. */
const shapeSpan = (cells) => Math.max(
  Math.max(...cells.map((c) => c[0])) + 1,
  Math.max(...cells.map((c) => c[1])) + 1,
);
const BLAST_MAX_SPAN = BLAST_GRID <= 6 ? 3 : 4;
const BLAST_BAG = BLAST_GRID > 6 ? BLAST_SHAPES : BLAST_SHAPES
  .filter((entry) => shapeSpan(entry.s) <= BLAST_MAX_SPAN && entry.s.length <= 4)
  .map((entry) => {
    // Weights chosen by simulation: with a flatter curve a casual player hit a
    // dead board inside six placements 11% of the time, which at a booth means
    // roughly one visitor in nine getting a game that ends before it starts.
    // This brings that to ~3% and roughly doubles a typical run.
    const bias = entry.s.length <= 2 ? 5 : entry.s.length === 3 ? 2 : 0.4;
    return { w: entry.w * bias, s: entry.s };
  });
const BLAST_BAG_TOTAL = BLAST_BAG.reduce((sum, entry) => sum + entry.w, 0);
const BLAST_COLORS = ["#22d3ee", "#a855f7", "#ec4899", "#a3e635", "#fbbf24"];
/* Timed mode: a run starts at two minutes and every cleared line buys more.
   Tuned so a typical booth visit finishes well inside five minutes — raise
   BLAST_TIME_START or BLAST_TIME_PER_LINE to make runs longer. */
const BLAST_TIME_START = 120, BLAST_TIME_PER_LINE = 6, BLAST_TIME_MAX = 240;
/* Power pieces ride in the tray and are placed exactly like ordinary blocks,
   so they need no extra controls. What makes them worth waiting for is that
   they ignore what is already on the board — dropping one on a crowded grid
   is the way out of a board that is closing in. */
const BLAST_POWERS = [
  { id: "bomb", emoji: "💣", color: "#fb7185", key: "puBomb" },
  { id: "zap",  emoji: "⚡", color: "#fbbf24", key: "puZap" },
];
const BLAST = {
  track: "blast",
  emoji: "🧱", titleKey: "blastTitle", howKey: "blastHow", bgToggle: true,
  board: [], pieces: [], score: 0, lines: 0, dragging: null,
  flashCells: [], flashT: 0, hud: null, resetBtn: null, running: false,
  timeLeft: BLAST_TIME_START, bonusT: 0, bonusN: 0, endReason: "noMoves",

  cursorPos: null, dragPos: null, bg: null, bgKey: "", powerBanner: null,
  pinchLog: [], openSince: 0, handLostSince: 0,

  start() {
    this.cleanup();
    this.board = Array.from({ length: BLAST_GRID }, () => Array(BLAST_GRID).fill(null));
    this.score = 0; this.lines = 0; this.dragging = null; this.flashCells = []; this.flashT = 0;
    this.cursorPos = null; this.dragPos = null; this.bg = null; this.bgKey = "";
    this.pinchLog = []; this.openSince = 0; this.handLostSince = 0;
    this.timeLeft = BLAST_TIME_START; this.bonusT = 0; this.bonusN = 0; this.endReason = "noMoves";
    this.powerBanner = null;
    this.spawnPieces(); this.running = true;
    this.hud = el(`<div class="hud"><div class="stat"><div class="lbl">${t("time")}</div><div class="num" id="bTime">2:00</div></div><div class="stat"><div class="lbl">${t("score")}</div><div class="num cyan" id="bScore">0</div></div><div class="stat"><div class="lbl">${t("lines")}</div><div class="num pink" id="bLines">0</div></div></div>`);
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
    for (const entry of BLAST_BAG) { roll -= entry.w; if (roll <= 0) return entry.s; }
    return BLAST_BAG[0].s;
  },
  makePiece() {
    if (Math.random() < 0.12) {
      const P = BLAST_POWERS[Math.floor(Math.random() * BLAST_POWERS.length)];
      return { shape: [[0, 0]], color: P.color, power: P };
    }
    return { shape: this.randomShape(), color: BLAST_COLORS[Math.floor(Math.random() * BLAST_COLORS.length)] };
  },
  spawnPieces() {
    // Never hand out a set that is dead on arrival.
    for (let attempt = 0; attempt < 30; attempt++) {
      const set = [0, 1, 2].map(() => this.makePiece());
      if (set.some(p => this.canFit(p.shape, p))) { this.pieces = set; return; }
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
    // The board keeps its overall size; a smaller grid simply means bigger cells.
    const cell = Math.max(15, Math.floor(Math.min(availW * .92, availH * .96, 336) / BLAST_GRID));
    const boardSize = cell * BLAST_GRID;
    const gx = Math.round(trayW + 18 + Math.max(0, (availW - boardSize) / 2));
    const gy = Math.round(topSafe + Math.max(0, (availH - boardSize) / 2));
    // The tray is sized from the tray column and the screen — deliberately NOT
    // from the board's cell size. Capping the board to make the grid compact
    // must not drag the pieces you pick up down with it; they stay easy to see
    // and easy to grab with a fingertip whatever the grid is doing.
    const trayCell = Math.max(11, Math.min(30, Math.floor((trayW - 26) / BLAST_MAX_SPAN)));
    const trayH = Math.round(Math.min(availH, Math.max(boardSize + 20, trayCell * 12)));
    const trayY = Math.round(topSafe + Math.max(0, (availH - trayH) / 2));
    const trayX = Math.round(trayW / 2 + 6);
    return { gx, gy, cell, boardSize, trayW, trayX, trayCell, trayH, trayY };
  },
  pieceOrigin(piece) {
    const maxX = Math.max(...piece.shape.map(p => p[0])), maxY = Math.max(...piece.shape.map(p => p[1]));
    return { w: maxX + 1, h: maxY + 1 };
  },
  trayPosition(index, layout) {
    return { x: layout.trayX, y: layout.trayY + layout.trayH * ((index + .5) / 3) };
  },
  valid(shape, col, row, piece) {
    // A power piece only has to land on the board; it clears whatever is there.
    if (piece && piece.power) return row >= 0 && row < BLAST_GRID && col >= 0 && col < BLAST_GRID;
    return shape.every(([x, y]) => row + y >= 0 && row + y < BLAST_GRID && col + x >= 0 && col + x < BLAST_GRID && !this.board[row + y][col + x]);
  },
  canFit(shape, piece) {
    if (piece && piece.power) return true;   // always playable, so never a dead tray
    for (let y = 0; y < BLAST_GRID; y++) for (let x = 0; x < BLAST_GRID; x++) if (this.valid(shape, x, y)) return true;
    return false;
  },
  hoveredPiece(layout, cursor) {
    if (!cursor) return -1;
    return this.pieces.findIndex((piece, index) => {
      if (!piece) return false;
      const p = this.trayPosition(index, layout), d = this.pieceOrigin(piece);
      const w = d.w * layout.trayCell, h = d.h * layout.trayCell;
      // Generous grab box: the fingertip never has to be pixel-accurate.
      const padX = 34, padY = Math.max(24, layout.trayH / 9);
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
    this.updateClock();
  },
  updateClock() {
    const el_ = this.hud?.querySelector("#bTime");
    if (!el_) return;
    const secs = Math.max(0, Math.ceil(this.timeLeft));
    el_.textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
    // The last 15 seconds turn red so a student glancing at the board can see
    // the run is nearly over without having to read the number.
    el_.classList.toggle("cyan", this.timeLeft > 15);
    el_.classList.toggle("danger", this.timeLeft <= 15);
  },
  place(index, layout, cursor) {
    const piece = this.pieces[index], { col, row } = this.dragCell(layout, cursor, piece);
    if (!this.valid(piece.shape, col, row, piece)) {
      sfx.bad();
      shakeScreen();
      return;
    }
    if (piece.power) return this.detonate(index, piece, col, row);
    piece.shape.forEach(([x, y]) => { this.board[row + y][col + x] = piece.color; });
    this.pieces[index] = null; this.score += piece.shape.length * 10;
    const clear = [];
    this.board.forEach((r, y) => { if (r.every(Boolean)) for (let x = 0; x < BLAST_GRID; x++) clear.push([x, y]); });
    for (let x = 0; x < BLAST_GRID; x++) if (this.board.every(r => r[x])) for (let y = 0; y < BLAST_GRID; y++) clear.push([x, y]);
    const unique = [...new Map(clear.map(p => [`${p[0]},${p[1]}`, p])).values()];
    if (unique.length) {
      unique.forEach(([x, y]) => { this.board[y][x] = null; });
      const cleared = Math.round(unique.length / BLAST_GRID);
      this.lines += cleared; this.score += cleared * 100;
      // Every cleared line buys time back. Capped so a strong run cannot bank
      // an unbounded clock and hold up the queue behind them.
      const bonus = cleared * BLAST_TIME_PER_LINE;
      this.timeLeft = Math.min(BLAST_TIME_MAX, this.timeLeft + bonus);
      this.bonusN = bonus; this.bonusT = 1.1;
      this.flashCells = unique; this.flashT = .42; sfx.good();
    }
    else sfx.slice();
    if (this.pieces.every(p => !p)) this.spawnPieces();
    this.updateHud();
    if (!this.pieces.some(p => p && this.canFit(p.shape, p))) { this.endReason = "noMoves"; this.end(); }
  },

  /* 💣 clears the 3x3 around where it lands, ⚡ clears the whole row and
     column. Both count as cleared cells, so they pay out time and score the
     same way a normal line does. */
  detonate(index, piece, col, row) {
    const hits = [];
    if (piece.power.id === "bomb") {
      for (let y = row - 1; y <= row + 1; y++) for (let x = col - 1; x <= col + 1; x++) {
        if (y >= 0 && y < BLAST_GRID && x >= 0 && x < BLAST_GRID && this.board[y][x]) hits.push([x, y]);
      }
    } else {
      for (let x = 0; x < BLAST_GRID; x++) if (this.board[row][x]) hits.push([x, row]);
      for (let y = 0; y < BLAST_GRID; y++) if (this.board[y][col]) hits.push([col, y]);
    }
    const unique = [...new Map(hits.map(p => [`${p[0]},${p[1]}`, p])).values()];
    unique.forEach(([x, y]) => { this.board[y][x] = null; });
    this.pieces[index] = null;
    this.score += unique.length * 15;
    // Time back is proportional to how much it actually freed up.
    const bonus = Math.min(BLAST_TIME_PER_LINE * 2, Math.ceil(unique.length / 2));
    if (bonus > 0) {
      this.timeLeft = Math.min(BLAST_TIME_MAX, this.timeLeft + bonus);
      this.bonusN = bonus; this.bonusT = 1.1;
    }
    this.flashCells = unique.length ? unique : [[col, row]];
    this.flashT = .5;
    this.powerBanner = { text: t(piece.power.key), color: piece.power.color, life: 1.4 };
    if (unique.length) { sfx.bomb(); shakeScreen(); } else sfx.slice();
    if (this.pieces.every(p => !p)) this.spawnPieces();
    this.updateHud();
    if (!this.pieces.some(p => p && this.canFit(p.shape, p))) { this.endReason = "noMoves"; this.end(); }
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
    for (let y = 0; y < BLAST_GRID; y++) for (let x = 0; x < BLAST_GRID; x++) {
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
    if (piece.power) {
      // Marked clearly so nobody mistakes it for an ordinary single block.
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = piece.power.color; ctx.lineWidth = 2.5;
      ctx.shadowColor = piece.power.color; ctx.shadowBlur = 16;
      ctx.globalAlpha = alpha * (.55 + Math.sin(performance.now() / 180) * .35);
      ctx.beginPath(); ctx.arc(cx, cy, cell * .62, 0, 7); ctx.stroke();
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 0;
      ctx.font = `${cell * .72}px sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(piece.power.emoji, cx, cy);
      ctx.restore();
    }
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
    this.bonusT = Math.max(0, this.bonusT - dt);
    this.timeLeft -= dt;
    this.updateClock();
    if (this.timeLeft <= 0) { this.timeLeft = 0; this.endReason = "timeUp"; this.end(); return; }
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
    for (let y = 0; y < BLAST_GRID; y++) for (let x = 0; x < BLAST_GRID; x++) {
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
    ctx.beginPath(); ctx.roundRect(layout.trayX - layout.trayW / 2, layout.trayY - 10, layout.trayW, layout.trayH + 20, 18);
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
      const ok = this.valid(piece.shape, cell.col, cell.row, piece);
      if (piece.power) {
        // Preview exactly which cells this power would take out.
        const foot = [];
        if (piece.power.id === "bomb") {
          for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) {
            const gx = cell.col + x, gy = cell.row + y;
            if (gx >= 0 && gx < BLAST_GRID && gy >= 0 && gy < BLAST_GRID) foot.push([x, y]);
          }
        } else {
          for (let x = 0; x < BLAST_GRID; x++) foot.push([x - cell.col, 0]);
          for (let y = 0; y < BLAST_GRID; y++) foot.push([0, y - cell.row]);
        }
        this.drawCells(foot, layout.gx + cell.col * layout.cell, layout.gy + cell.row * layout.cell,
          layout.cell, piece.power.color, .34);
      } else {
        this.drawCells(piece.shape, layout.gx + cell.col * layout.cell, layout.gy + cell.row * layout.cell,
          layout.cell, ok ? "#ffffff" : "#f43f5e", ok ? .28 : .22);
      }
      this.drawPiece(piece, this.dragPos.x, this.dragPos.y - layout.cell * .35, layout.cell, .95,
        ok ? piece.color : "#f43f5e", 18);
    }

    if (this.powerBanner) {
      this.powerBanner.life -= dt;
      if (this.powerBanner.life <= 0) this.powerBanner = null;
      else {
        ctx.save();
        ctx.globalAlpha = Math.min(1, this.powerBanner.life / 0.4);
        ctx.font = "900 clamp(20px,5vw,36px) Orbitron, system-ui";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = this.powerBanner.color;
        ctx.shadowColor = this.powerBanner.color; ctx.shadowBlur = 24;
        ctx.fillText(this.powerBanner.text, layout.gx + layout.boardSize / 2, layout.gy + layout.boardSize / 2);
        ctx.restore();
      }
    }

    if (this.bonusT > 0) {
      const p = 1 - this.bonusT / 1.1;
      ctx.save();
      ctx.globalAlpha = Math.min(1, this.bonusT * 1.6);
      ctx.font = "900 clamp(20px,4vw,32px) Orbitron, system-ui"; ctx.textAlign = "center";
      ctx.fillStyle = "#4ade80"; ctx.shadowColor = "#4ade80"; ctx.shadowBlur = 18;
      ctx.fillText(t("blastAddTime")(this.bonusN), layout.gx + layout.boardSize / 2, layout.gy - 16 - p * 26);
      ctx.restore();
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
    const daily = setDailyBest("blast", score);
    this.cleanup(); sfx.bad(); ui.classList.remove("passthrough");
    const node = el(`<div class="panel"><div class="big-emoji">${this.endReason === "timeUp" ? "⏰" : "🧱"}</div><h2>${t(this.endReason)}</h2><div class="score-line">${score}</div><div class="result-rank">${t("blastRanks")[rank]}</div>${daily.isNew ? `<div class="desc" style="color:var(--cyan)">${t("newDailyBest")}</div>` : ""}<div class="best-line">${t("todaysBest")}: ${daily.best}</div><button class="btn" id="againBtn">${t("again")}</button><br><button class="btn ghost" id="menuBtn" style="font-size:15px;padding:10px 24px">← ${t("back")}</button></div>`);
    node.querySelector("#againBtn").onclick = () => { sfx.click(); show(null); ui.classList.add("passthrough"); this.start(); };
    node.querySelector("#menuBtn").onclick = () => { sfx.click(); menu(); };
    show(node);
  },
};


/* ================================================
   VERSUS : HAND BLAST — a board each
   Two independent boards with their own tray, using the same pinch-to-grab
   controls as the solo game. A player whose board jams sits out the rest of
   the clock rather than ending the match, so the other can keep scoring.
================================================ */
// Each player reads their own hand, so pinch has to be derived per side
// rather than from the single shared `engine.norm`.
function pinchStateFor(i) {
  const norm = engine.multiNorm[i], hand = engine.multi[i];
  if (!norm || !hand) return null;
  const f = fingerStates(norm);
  const thumb = hand[4], index = hand[8];
  return { ...f, thumb, index, center: { x: (thumb.x + index.x) / 2, y: (thumb.y + index.y) / 2 } };
}

const BLAST_VS = {
  track: "blast",
  emoji: "🧱", titleKey: "vsBlastTitle", howKey: "vsBlastHow", bgToggle: true, versus: true,
  sides: [], timeLeft: VS_DURATION, running: false, hud: null, winner: null,

  makeSide(i) {
    return {
      i, color: VS_COLORS[i],
      board: Array.from({ length: BLAST_GRID }, () => Array(BLAST_GRID).fill(null)),
      pieces: [], score: 0, lines: 0, dragging: null, dragPos: null,
      pinchLog: [], openSince: 0, handLostSince: 0,
      flashCells: [], flashT: 0, banner: null, jammed: false,
    };
  },
  // Region for one player, then a tray column and a square board inside it.
  layoutFor(i) {
    const half = innerWidth / 2;
    const x0 = i === 0 ? 0 : half;
    const topSafe = 132, bottomSafe = 56;
    const trayW = Math.round(Math.min(96, Math.max(58, half * .2)));
    const avail = Math.min(half - trayW - 26, innerHeight - topSafe - bottomSafe);
    const boardSize = Math.max(150, Math.floor(avail / BLAST_GRID) * BLAST_GRID);
    const cell = boardSize / BLAST_GRID;
    const gx = Math.round(x0 + trayW + 18);
    const gy = Math.round(topSafe + Math.max(0, (innerHeight - topSafe - bottomSafe - boardSize) / 2));
    return {
      gx, gy, cell, boardSize,
      trayX: Math.round(x0 + trayW / 2 + 6), trayY: gy, trayH: boardSize,
      trayCell: Math.max(11, Math.min(20, cell * .42)),
    };
  },

  start() {
    this.cleanup();
    this.sides = [this.makeSide(0), this.makeSide(1)];
    this.sides.forEach(s => this.spawnPieces(s));
    this.timeLeft = VS_DURATION; this.running = true; this.winner = null;
    this.hud = el(`<div class="hud vs-hud">
      <div class="stat vs-p1"><div class="lbl">${t("p1")}</div><div class="num cyan" id="vbS0">0</div><div class="vs-lives" id="vbL0">0 ${t("lines")}</div></div>
      <div class="stat"><div class="lbl">${t("time")}</div><div class="num amber" id="vbTime">${VS_DURATION}</div></div>
      <div class="stat vs-p2"><div class="lbl">${t("p2")}</div><div class="num pink" id="vbS1">0</div><div class="vs-lives" id="vbL1">0 ${t("lines")}</div></div>
    </div>`);
    document.body.append(this.hud);
    engine.setHandCount(2);
  },
  cleanup() {
    this.hud?.remove(); this.hud = null; this.running = false;
    engine.setHandCount(1);
  },

  spawnPieces(s) {
    for (let a = 0; a < 30; a++) {
      const set = [0, 1, 2].map(() => BLAST.makePiece());
      if (set.some(p => this.canFit(s, p.shape, p))) { s.pieces = set; return; }
    }
    s.pieces = [0, 1, 2].map(() => ({ shape: [[0, 0]], color: BLAST_COLORS[0] }));
  },
  valid(s, shape, col, row, piece) {
    if (piece && piece.power) return row >= 0 && row < BLAST_GRID && col >= 0 && col < BLAST_GRID;
    return shape.every(([x, y]) => row + y >= 0 && row + y < BLAST_GRID && col + x >= 0 && col + x < BLAST_GRID && !s.board[row + y][col + x]);
  },
  canFit(s, shape, piece) {
    if (piece && piece.power) return true;
    for (let y = 0; y < BLAST_GRID; y++) for (let x = 0; x < BLAST_GRID; x++) if (this.valid(s, shape, x, y)) return true;
    return false;
  },
  countBuild() { return 0; },
  dragCell(s, L, cursor, piece) {
    const d = BLAST.pieceOrigin(piece);
    const col = Math.round((cursor.x - L.gx - d.w * L.cell / 2) / L.cell);
    const row = Math.round((cursor.y - L.gy - d.h * L.cell / 2) / L.cell);
    return { col, row };
  },
  hoveredPiece(s, L, cursor) {
    if (!cursor) return -1;
    return s.pieces.findIndex((piece, index) => {
      if (!piece) return false;
      const p = { x: L.trayX, y: L.trayY + L.trayH * ((index + .5) / 3) };
      const d = BLAST.pieceOrigin(piece);
      const w = d.w * L.trayCell, h = d.h * L.trayCell;
      const padX = 30, padY = Math.max(22, L.trayH / 9);
      return cursor.x >= p.x - w / 2 - padX && cursor.x <= p.x + w / 2 + padX &&
             cursor.y >= p.y - h / 2 - padY && cursor.y <= p.y + h / 2 + padY;
    });
  },

  place(s, index, L, cursor) {
    const piece = s.pieces[index], { col, row } = this.dragCell(s, L, cursor, piece);
    if (!this.valid(s, piece.shape, col, row, piece)) { sfx.bad(); shakeScreen(); return; }
    if (piece.power) {
      const hits = [];
      if (piece.power.id === "bomb") {
        for (let y = row - 1; y <= row + 1; y++) for (let x = col - 1; x <= col + 1; x++)
          if (y >= 0 && y < BLAST_GRID && x >= 0 && x < BLAST_GRID && s.board[y][x]) hits.push([x, y]);
      } else {
        for (let x = 0; x < BLAST_GRID; x++) if (s.board[row][x]) hits.push([x, row]);
        for (let y = 0; y < BLAST_GRID; y++) if (s.board[y][col]) hits.push([col, y]);
      }
      const uniq = [...new Map(hits.map(p => [`${p[0]},${p[1]}`, p])).values()];
      uniq.forEach(([x, y]) => { s.board[y][x] = null; });
      s.pieces[index] = null;
      s.score += uniq.length * 15;
      s.flashCells = uniq.length ? uniq : [[col, row]]; s.flashT = .5;
      s.banner = { text: t(piece.power.key), color: piece.power.color, life: 1.3 };
      if (uniq.length) { sfx.bomb(); shakeScreen(); } else sfx.slice();
    } else {
      piece.shape.forEach(([x, y]) => { s.board[row + y][col + x] = piece.color; });
      s.pieces[index] = null; s.score += piece.shape.length * 10;
      const clear = [];
      s.board.forEach((r, y) => { if (r.every(Boolean)) for (let x = 0; x < BLAST_GRID; x++) clear.push([x, y]); });
      for (let x = 0; x < BLAST_GRID; x++) if (s.board.every(r => r[x])) for (let y = 0; y < BLAST_GRID; y++) clear.push([x, y]);
      const uniq = [...new Map(clear.map(p => [`${p[0]},${p[1]}`, p])).values()];
      if (uniq.length) {
        uniq.forEach(([x, y]) => { s.board[y][x] = null; });
        const cleared = Math.round(uniq.length / BLAST_GRID);
        s.lines += cleared; s.score += cleared * 100;
        s.flashCells = uniq; s.flashT = .42; sfx.good();
      } else sfx.slice();
    }
    if (s.pieces.every(p => !p)) this.spawnPieces(s);
    this.refreshHud();
    // A jammed board sits out the rest of the clock; the match keeps going.
    if (!s.pieces.some(p => p && this.canFit(s, p.shape, p))) {
      s.jammed = true;
      s.banner = { text: t("vsJammed"), color: "#f43f5e", life: 2.4 };
      if (this.sides.every(x => x.jammed)) this.end();
    }
  },
  refreshHud() {
    if (!this.hud) return;
    this.sides.forEach((s, i) => {
      const sc = this.hud.querySelector(`#vbS${i}`), ln = this.hud.querySelector(`#vbL${i}`);
      if (sc) sc.textContent = s.score;
      if (ln) ln.textContent = `${s.lines} ${t("lines")}`;
    });
  },

  onFrame(dt) {
    if (!this.running) return;
    this.timeLeft -= dt;
    if (this.timeLeft <= 0) return this.end();
    const tEl = this.hud?.querySelector("#vbTime");
    if (tEl) tEl.textContent = Math.ceil(this.timeLeft);

    if (!camBgOn) { ctx.fillStyle = "#0b0518"; ctx.fillRect(0, 0, innerWidth, innerHeight); }
    else { ctx.fillStyle = "rgba(5,8,28,.3)"; ctx.fillRect(0, 0, innerWidth, innerHeight); }
    const now = performance.now();

    this.sides.forEach(s => {
      const L = this.layoutFor(s.i);
      s.flashT = Math.max(0, s.flashT - dt);
      if (s.banner) { s.banner.life -= dt; if (s.banner.life <= 0) s.banner = null; }

      /* board frame + grid */
      ctx.save();
      ctx.fillStyle = "rgba(11,5,24,.6)"; ctx.strokeStyle = s.color; ctx.lineWidth = 2;
      ctx.shadowColor = s.color; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.roundRect(L.gx - 9, L.gy - 9, L.boardSize + 18, L.boardSize + 18, 16);
      ctx.fill(); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,.05)"; ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.lineWidth = 1;
      for (let y = 0; y < BLAST_GRID; y++) for (let x = 0; x < BLAST_GRID; x++) {
        ctx.beginPath();
        ctx.roundRect(L.gx + x * L.cell + 2, L.gy + y * L.cell + 2, L.cell - 4, L.cell - 4, 6);
        ctx.fill(); ctx.stroke();
      }
      ctx.restore();

      /* settled blocks */
      for (let y = 0; y < BLAST_GRID; y++) for (let x = 0; x < BLAST_GRID; x++) {
        const c = s.board[y][x];
        if (!c) continue;
        ctx.save();
        ctx.fillStyle = c; ctx.shadowColor = c; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.roundRect(L.gx + x * L.cell + 2, L.gy + y * L.cell + 2, L.cell - 4, L.cell - 4, 6);
        ctx.fill(); ctx.restore();
      }
      /* clear flash */
      if (s.flashT > 0) {
        ctx.save();
        ctx.globalAlpha = s.flashT / .5;
        ctx.fillStyle = "#fff";
        s.flashCells.forEach(([x, y]) => {
          ctx.beginPath(); ctx.roundRect(L.gx + x * L.cell + 2, L.gy + y * L.cell + 2, L.cell - 4, L.cell - 4, 6); ctx.fill();
        });
        ctx.restore();
      }

      /* tray */
      ctx.save();
      ctx.fillStyle = "rgba(11,5,24,.5)"; ctx.strokeStyle = "rgba(255,255,255,.14)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(L.trayX - L.trayCell * 2.2, L.trayY - 8, L.trayCell * 4.4, L.trayH + 16, 14);
      ctx.fill(); ctx.stroke(); ctx.restore();
      s.pieces.forEach((piece, index) => {
        if (!piece || index === s.dragging) return;
        const p = { x: L.trayX, y: L.trayY + L.trayH * ((index + .5) / 3) };
        BLAST.drawPiece(piece, p.x, p.y, L.trayCell, .85);
      });

      /* per-player pinch handling, mirroring the solo game's thresholds */
      const pinch = s.jammed ? null : pinchStateFor(s.i);
      if (pinch) s.pinchLog.push({ t: now, v: pinch.pinch, cursor: { x: pinch.center.x, y: pinch.center.y } });
      while (s.pinchLog.length && now - s.pinchLog[0].t > 160) s.pinchLog.shift();

      if (s.dragging === null) {
        const closest = s.pinchLog.reduce((best, e) => (!best || e.v < best.v ? e : best), null);
        if (closest && closest.v < .48) {
          const idx = this.hoveredPiece(s, L, closest.cursor);
          if (idx >= 0) { s.dragging = idx; sfx.click(); s.dragPos = { ...closest.cursor }; s.openSince = 0; }
        }
      } else if (!pinch) {
        s.handLostSince = s.handLostSince || now;
        if (now - s.handLostSince > 900) { s.dragging = null; s.dragPos = null; sfx.bad(); }
      } else {
        s.handLostSince = 0;
        s.dragPos = { x: pinch.center.x, y: pinch.center.y };
        if (pinch.pinch >= .62) s.openSince = s.openSince || now; else s.openSince = 0;
        if (s.openSince && now - s.openSince > 70 && s.dragPos) {
          this.place(s, s.dragging, L, s.dragPos);
          s.dragging = null; s.dragPos = null; s.openSince = 0;
        }
      }

      /* carried piece + landing preview */
      if (s.dragging !== null && s.dragPos && s.pieces[s.dragging]) {
        const piece = s.pieces[s.dragging];
        const c = this.dragCell(s, L, s.dragPos, piece);
        const ok = this.valid(s, piece.shape, c.col, c.row, piece);
        if (piece.power) {
          const foot = [];
          if (piece.power.id === "bomb") {
            for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) {
              const gx = c.col + x, gy = c.row + y;
              if (gx >= 0 && gx < BLAST_GRID && gy >= 0 && gy < BLAST_GRID) foot.push([x, y]);
            }
          } else {
            for (let x = 0; x < BLAST_GRID; x++) foot.push([x - c.col, 0]);
            for (let y = 0; y < BLAST_GRID; y++) foot.push([0, y - c.row]);
          }
          BLAST.drawCells(foot, L.gx + c.col * L.cell, L.gy + c.row * L.cell, L.cell, piece.power.color, .34);
        } else {
          BLAST.drawCells(piece.shape, L.gx + c.col * L.cell, L.gy + c.row * L.cell, L.cell,
            ok ? "#ffffff" : "#f43f5e", ok ? .28 : .22);
        }
        BLAST.drawPiece(piece, s.dragPos.x, s.dragPos.y - L.cell * .35, L.cell, .95, ok ? piece.color : "#f43f5e", 16);
      }

      /* cursor + labels */
      ctx.save();
      ctx.textAlign = "center";
      ctx.font = "900 12px Orbitron, system-ui"; ctx.fillStyle = s.color;
      ctx.fillText(t(s.i === 0 ? "p1" : "p2"), L.gx + L.boardSize / 2, L.gy - 20);
      if (pinch) {
        const closed = pinch.pinch < .5;
        ctx.strokeStyle = closed ? "#a855f7" : s.color; ctx.lineWidth = 3;
        ctx.shadowColor = closed ? "#a855f7" : s.color; ctx.shadowBlur = 14;
        ctx.beginPath(); ctx.arc(pinch.center.x, pinch.center.y, closed ? 8 : 14, 0, 7); ctx.stroke();
      } else if (!s.jammed) {
        ctx.globalAlpha = .5 + Math.sin(now / 300) * .3;
        ctx.font = "800 14px system-ui"; ctx.fillStyle = s.color;
        ctx.fillText(t("vsShowHand"), L.gx + L.boardSize / 2, L.gy + L.boardSize / 2);
      }
      ctx.restore();

      if (s.banner) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, s.banner.life / .4);
        ctx.font = "900 clamp(14px,2.4vw,22px) Orbitron, system-ui";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = s.banner.color; ctx.shadowColor = s.banner.color; ctx.shadowBlur = 18;
        ctx.fillText(s.banner.text, L.gx + L.boardSize / 2, L.gy + L.boardSize / 2);
        ctx.restore();
      }
    });

    /* divider */
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,.28)"; ctx.lineWidth = 2;
    ctx.setLineDash([12, 10]);
    ctx.beginPath(); ctx.moveTo(innerWidth / 2, 96); ctx.lineTo(innerWidth / 2, innerHeight - 20); ctx.stroke();
    ctx.restore();
  },

  end() {
    if (!this.running) return;
    this.running = false;
    sfx.win();
    const [a, b] = this.sides;
    const win = a.score === b.score ? -1 : (a.score > b.score ? 0 : 1);
    this.winner = win;
    this.hud?.remove(); this.hud = null;
    engine.setHandCount(1);
    ui.classList.remove("passthrough");
    const node = el(`<div class="panel">
      <div class="big-emoji">${win === -1 ? "🤝" : "🏆"}</div>
      <h2>${win === -1 ? t("vsDraw") : t("vsWinner")(win + 1)}</h2>
      <div class="vs-result">
        <div class="vs-col" style="--c:${VS_COLORS[0]}"><b>${t("p1")}</b><span>${a.score}</span><i>${a.lines} ${t("lines")}</i></div>
        <div class="vs-col" style="--c:${VS_COLORS[1]}"><b>${t("p2")}</b><span>${b.score}</span><i>${b.lines} ${t("lines")}</i></div>
      </div>
      <button class="btn" id="againBtn">${t("again")}</button>
      <br><button class="btn ghost" id="menuBtn" style="font-size:15px;padding:10px 24px">← ${t("back")}</button>
    </div>`);
    node.querySelector("#againBtn").onclick = () => { sfx.click(); show(null); ui.classList.add("passthrough"); this.start(); };
    node.querySelector("#menuBtn").onclick = () => { sfx.click(); menu(); };
    show(node);
  },
};

/* ================================================
   GAME 4 : HAND LAB (element combining)
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
  "earth+ocean": "mud", "fire+ocean": "steam", "animal+ocean": "fish", "ocean+wind": "storm", "ocean+rain": "storm", "ocean+volcano": "obsidian", "fish+ocean": null,
  "life+mountain": "tree", "mountain+plant": "forest", "mountain+rain": "lake",
  "rain+wind": "storm", "sand+wind": "dust", "stone+wind": "sand",
  "fire+obsidian": "lava",
  "air+life": "bird", "idea+life": "human",
  "earth+rain": "mud", "fire+rain": "steam",
  "plant+water": "tree",
  "sand+water": "mud",
  "air+fish": "bird",
  // A fish put in water is still just a fish: these consumed both tags and
  // produced nothing. Explicitly inert now, rather than silently eating one.
  "fish+water": null,
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
  /* ---- second curated pass -------------------------------------------
     Added when the tag-based guesser was removed. These are the pairs a
     student is most likely to actually try in the early game, so that
     experimenting still pays off now that an unlisted pair simply does
     not react. Each one is a plain physical statement, not a hash. */
  "air+cloud": "wind",
  "air+dust": "wind",
  "air+energy": "electricity",
  "air+mountain": "wind",
  "air+ocean": "wind",
  "air+rain": "cloud",
  "air+sun": "wind",
  "air+wind": "storm",
  "animal+forest": "bird",
  "animal+tree": "bird",
  "mud+wind": "dust",    // (wind dries mud back to loose dust)
  "water+wind": "cloud",
  "cloud+lake": "rain",
  "cloud+ocean": "rain",
  "cloud+rain": "storm",
  "dust+mountain": "sand",
  "dust+stone": "sand",
  "dust+earth": "sand",
  "earth+life": "plant",
  "earth+mountain": "stone",
  "earth+obsidian": "stone",
  "earth+stone": "mountain",
  "earth+volcano": "stone",
  "cloud+energy": "storm",
  "energy+idea": "electricity",
  "city+fire": "smoke",
  "energy+fire": "sun",
  "fire+lava": "volcano",
  "fire+plant": "smoke",
  "fire+sun": "energy",
  "dust+lava": "stone",
  "lava+rain": "obsidian",
  "lava+wind": "obsidian",
  "life+rain": "plant",
  "life+sun": "plant",
  "metal+steam": "electricity",
  "metal+storm": "electricity",
  "mountain+ocean": "lake",
  "rain+sun": "rainbow",
  "sand+sun": "glass",
  "cloud+steam": "rain",
  "dust+steam": "cloud",
  "energy+steam": "electricity",
  "mountain+steam": "cloud",
  "ocean+steam": "cloud",
  "rain+tree": "forest",
  "sun+tree": "forest",
  "tree+water": "forest",
};
const LAB_TOTAL = Object.keys(LAB_ELEMENTS).length;
/* ---- how a pair is resolved -------------------------------------------
   Version 1 gave every element a loose bag of tags and picked any element
   sharing ANY tag with EITHER input. Because "elemental" sat on almost
   everything primitive, nearly anything could reach nearly anything: 725 of
   the 861 possible pairs were invented by a hash, and among them were
   water+wind=lava, tree+boat=lava and animal+tree=lava.

   Tightening the tags helped but could not fix it, because tags do not
   encode chemistry: a "hot"+"solid" filter still happily produced
   water+steam=lava and mud+cloud=volcano. Anything general enough to answer
   861 pairs is general enough to be wrong in public, in front of a class.

   So nothing is guessed any more. A pair resolves in exactly three ways:

     1. LAB_RECIPES        — the curated table below (a null entry means
                             "these explicitly do not react").
     2. LAB_RULES          — a handful of named, physical transformations,
                             each one written out and reviewable.
     3. no reaction        — anything else.

   "Nothing happens" is a real and honest answer in a science exhibit, and
   it is a far better thing to show a student than a confident wrong one. */

const HEAT = ["fire", "lava", "sun", "volcano", "energy", "electricity"];
const LIQUID = ["water", "ocean", "lake", "rain"];
const EARTHY = ["earth", "dust", "sand"];
const WEATHER = ["cloud", "wind", "rain", "storm"];
const GROWABLE = ["plant", "tree"];

/* Each rule is a plain physical statement. `when` matches either ordering. */
const LAB_RULES = [
  // Heat applied to open water boils it away.
  { when: [HEAT, LIQUID], result: "steam", why: "heat boils water into steam" },
  // Dry ground plus water makes mud — the classic first experiment.
  { when: [EARTHY, LIQUID], result: "mud", why: "dry ground plus water makes mud" },
  // Moving air over loose ground lifts it.
  { when: [["wind", "storm"], EARTHY], result: "dust", why: "moving air lifts loose ground" },
  // Weather feeding weather intensifies it.
  { when: [WEATHER, WEATHER], result: "storm", why: "weather feeding weather builds a storm" },
  // Water and sunlight are what green things need.
  { when: [GROWABLE, LIQUID], result: "tree", why: "plants given water grow" },
  { when: [GROWABLE, ["sun"]], result: "forest", why: "plants given sunlight spread" },
];

function stableHash(key) {
  let hash = 2166136261;
  for (const char of key) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); }
  return hash >>> 0;
}
/* Returns { id, exact, key }. `id` is null when the pair does not react. */
function labCombinationResult(idA, idB) {
  const key = [idA, idB].sort().join("+");
  // `in` rather than a truthiness test, so an explicit null entry below
  // reads as "authored as inert" and not as "not written yet".
  if (key in LAB_RECIPES) return { id: LAB_RECIPES[key], exact: true, key };
  for (const rule of LAB_RULES) {
    const [left, right] = rule.when;
    const hit = (left.includes(idA) && right.includes(idB)) || (left.includes(idB) && right.includes(idA));
    // A rule never returns one of its own inputs — Tree + Water must not
    // simply hand back Tree.
    if (hit && rule.result !== idA && rule.result !== idB) {
      return { id: rule.result, exact: false, key, why: rule.why };
    }
  }
  return { id: null, exact: false, key };
}

const LAB = {
  track: "lab",
  emoji: "🧪", titleKey: "labTitle", howKey: "labHow",
  found: new Set(), workspace: [], drag: null, cursorPos: null, pinchLog: [],
  openSince: 0, grabReadyAt: 0, dwellKey: "", dwellSince: 0, bookOpen: false,
  history: new Map(), bookNode: null, noReactNode: null, recipeBtn: null, cheatBtn: null, running: false,

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
    this.recipeBtn?.remove(); this.cheatBtn?.remove(); this.bookNode?.remove(); this.noReactNode?.remove();
    this.recipeBtn = null; this.cheatBtn = null; this.bookNode = null; this.noReactNode = null; this.running = false;
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
        if (combination.id) recipes.set(combination.key, combination.id);
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
    // Not every pair reacts. Say so plainly and leave both tags on the bench,
    // rather than inventing a product the way the old hash fallback did.
    if (!resultId) { sfx.bad(); this.showNoReaction(); return null; }
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
  showNoReaction() {
    this.noReactNode?.remove();
    this.noReactNode = el(`<div class="lab-no-react">💨 ${t("labNoReaction")}</div>`);
    document.body.appendChild(this.noReactNode);
    const node = this.noReactNode;
    setTimeout(() => { node.remove(); if (this.noReactNode === node) this.noReactNode = null; }, 1500);
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
      } else {
        // Nothing happened: nudge the dragged tag clear of the target so both
        // stay visible and the student can immediately try a different pair.
        const spot = this.clampToWorkbench({ x: target.x + 70, y: target.y + 34 }, layout);
        if (source.type === "workspace") this.workspace[source.index] = { id: source.id, ...spot };
        else this.workspace.push({ id: source.id, ...spot });
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
  // Muting stops the music too; unmuting resumes whatever screen we are on.
  const wanted = music.name || (activeGame && activeGame.track) || "menu";
  if (soundOn) { sfx.click(); music.name = null; music.start(wanted); }
  else music.stop();
};
document.getElementById("langBtn").textContent = t("langBtn");
document.getElementById("soundBtn").textContent = soundOn ? "🔊" : "🔇";

/* ---------------- PWA ---------------- */
/* Service workers are a production feature. A cache-first worker answers from
   its own cache without ever consulting the dev server, so an edit to app.js
   silently never appears until the cache version is bumped or site data is
   cleared by hand. On localhost we therefore skip registration entirely AND
   tear down whatever an earlier session left behind, so a plain reload always
   shows the code currently on disk.

   To exercise offline mode locally, load any page once with ?sw=on — a service
   worker needs a secure context, so localhost is the only place offline can be
   tested without deploying. ?sw=off returns to normal development behaviour.
   The choice is remembered, so it survives navigating between the games. */
(function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;

  const DEV_HOSTS = ["localhost", "127.0.0.1", "[::1]", "::1", "0.0.0.0"];
  const isDevHost = DEV_HOSTS.includes(location.hostname) || location.hostname.endsWith(".local");
  let forced = false;
  try {
    const want = new URLSearchParams(location.search).get("sw");
    if (want === "on") localStorage.setItem("pwa-force-sw", "1");
    if (want === "off") localStorage.removeItem("pwa-force-sw");
    forced = localStorage.getItem("pwa-force-sw") === "1";
  } catch (e) { /* storage can throw in private mode; fall back to dev default */ }

  if (!isDevHost || forced) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
    return;
  }

  // Development: unregister anything controlling this origin and drop its
  // caches. If this page was itself served by one, reload once (guarded, so a
  // failed teardown can never loop) to pick the files up straight from disk.
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.getRegistrations()
    .then((list) => Promise.all(list.map((reg) => reg.unregister())))
    .then(() => (window.caches ? caches.keys() : []))
    .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
    .then(() => {
      if (!hadController || sessionStorage.getItem("pwa-dev-reloaded")) return;
      sessionStorage.setItem("pwa-dev-reloaded", "1");
      location.reload();
    })
    .catch(() => {});
})();

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
window.__ha = { calibrate, music, NINJA_VS, SNAKE_VS, BLAST_VS, pinchStateFor, TRACKS, NINJA_POWERS, SNAKE_FOODS, BLAST_POWERS, BLAST_GRID, t, engine, NINJA, SNAKE, BLAST, LAB, ctx, step: (dt) => activeGame && activeGame.onFrame && activeGame.onFrame(dt || 1 / 60),
  _setActive: (g) => { activeGame = g; } };

menu();
