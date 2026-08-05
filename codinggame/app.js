/* ================= CYBER HEIST ================= */
"use strict";

/* ---------- i18n ---------- */
const STR = {
  en: {
    langBtn: "BM",
    tapStart: "TAP TO START",
    subtitle: "A TOP-SECRET HACKING MISSION",
    bootLines: ["> CONNECTING TO MEGACORP NETWORK...", "> FIREWALL BYPASSED ✔", "> IDENTITY REQUIRED"],
    agentPrompt: "ENTER YOUR AGENT NAME:",
    startMission: "START MISSION ▶",
    brief: n => `AGENT ${n}, YOUR MISSION:\n\nBreak into the MEGACORP vault and steal the SECRET FILE.\n\n4 security doors stand in your way. Each door is protected by real computer technology. Hack them all!\n\nThe timer starts... NOW.`,
    go: "GO! ▶",
    door: "DOOR",
    s1title: "DOOR 1 // THE BINARY LOCK",
    s1help: "Computers store numbers using ON/OFF switches called BITS. Tap the switches so the numbers add up to the PASSCODE!",
    passcode: "PASSCODE",
    yourCode: "YOUR CODE",
    s2title: "DOOR 2 // THE SECRET MESSAGE",
    s2help: "To a computer, letters are numbers too! Use the DECODER CHART to translate the binary and type the secret password.",
    s3title: "DOOR 3 // PROGRAM THE ROBOT",
    s3help: "The door robot only does EXACTLY what you program — nothing else! Add moves to the program, then press RUN to reach the 💎. Don't touch the lasers!",
    run: "RUN ▶",
    clear: "CLEAR ✖",
    crash: "⚠ ALARM! The robot crashed. Fix your program and RUN again!",
    s4title: "DOOR 4 // THE SECRET FILE",
    s4help: "Every row is an 8-bit picture. Tap the PIXEL BOX under each 1. Leave every 0 dark. A wrong box flashes red and does not count!",
    pixelsLeft: n => `${n} correct pixel${n === 1 ? "" : "s"} left`,
    wrongPixel: "WRONG BIT! Read the binary row again.",
    fileDecoded: "FILE DECODED!",
    unlocked: "UNLOCKED!",
    complete: "MISSION COMPLETE",
    agentRank: "AGENT RANK",
    yourTime: "TIME",
    ranks: ["⚡ ELITE HACKER", "🔥 PRO AGENT", "🎓 CYBER CADET"],
    secretIs: "The secret file was... the hacker's selfie! 😎",
    playAgain: "PLAY AGAIN ↺",
    leaderboard: "SESSION FASTEST AGENTS",
    noScores: "No completed missions yet",
    newRecord: "⚡ NEW SESSION RECORD!",
    resetScores: "RESET SCORES",
    scoresReset: "Session scores reset",
    skip: "skip »",
    learned: n => `AGENT ${n} learned today:\n\n① Numbers are ON/OFF switches (binary)\n② Letters are numbers (codes)\n③ Computers follow EXACT instructions (algorithms)\n④ Pictures are numbers too (pixels)\n\nThat's how ALL computers work!`,
  },
  bm: {
    langBtn: "EN",
    tapStart: "TEKAN UNTUK MULA",
    subtitle: "MISI PENGGODAM RAHSIA",
    bootLines: ["> MENYAMBUNG KE RANGKAIAN MEGACORP...", "> FIREWALL DIPINTAS ✔", "> IDENTITI DIPERLUKAN"],
    agentPrompt: "MASUKKAN NAMA EJEN ANDA:",
    startMission: "MULA MISI ▶",
    brief: n => `EJEN ${n}, MISI ANDA:\n\nCeroboh bilik kebal MEGACORP dan curi FAIL RAHSIA.\n\n4 pintu keselamatan menghalang anda. Setiap pintu dilindungi teknologi komputer sebenar. Godam semuanya!\n\nMasa bermula... SEKARANG.`,
    go: "MULA! ▶",
    door: "PINTU",
    s1title: "PINTU 1 // KUNCI BINARI",
    s1help: "Komputer menyimpan nombor guna suis ON/OFF dipanggil BIT. Tekan suis supaya jumlahnya sama dengan KOD LALUAN!",
    passcode: "KOD LALUAN",
    yourCode: "KOD ANDA",
    s2title: "PINTU 2 // MESEJ RAHSIA",
    s2help: "Bagi komputer, huruf pun nombor! Guna CARTA PENYAHKOD untuk terjemah kod binari dan taip kata laluan rahsia.",
    s3title: "PINTU 3 // PROGRAM ROBOT",
    s3help: "Robot pintu hanya buat APA YANG DIPROGRAM sahaja! Susun arahan, kemudian tekan RUN untuk sampai ke 💎. Jangan sentuh laser!",
    run: "RUN ▶",
    clear: "PADAM ✖",
    crash: "⚠ PENGGERA! Robot terlanggar. Betulkan program dan RUN semula!",
    s4title: "PINTU 4 // FAIL RAHSIA",
    s4help: "Setiap baris ialah gambar 8-bit. Tekan KOTAK PIKSEL di bawah setiap 1. Biarkan semua 0 gelap. Kotak salah berkelip merah dan tidak dikira!",
    pixelsLeft: n => `${n} piksel betul lagi`,
    wrongPixel: "BIT SALAH! Baca semula baris binari.",
    fileDecoded: "FAIL DINYAHKOD!",
    unlocked: "TERBUKA!",
    complete: "MISI SELESAI",
    agentRank: "PANGKAT EJEN",
    yourTime: "MASA",
    ranks: ["⚡ PENGGODAM ELIT", "🔥 EJEN PRO", "🎓 KADET SIBER"],
    secretIs: "Fail rahsia itu ialah... swafoto penggodam! 😎",
    playAgain: "MAIN LAGI ↺",
    leaderboard: "EJEN TERPANTAS SESI INI",
    noScores: "Belum ada misi selesai",
    newRecord: "⚡ REKOD SESI BARU!",
    resetScores: "PADAM SKOR",
    scoresReset: "Skor sesi dipadam",
    skip: "langkau »",
    learned: n => `EJEN ${n} belajar hari ini:\n\n① Nombor ialah suis ON/OFF (binari)\n② Huruf ialah nombor (kod)\n③ Komputer ikut arahan TEPAT (algoritma)\n④ Gambar pun nombor (piksel)\n\nBeginilah SEMUA komputer berfungsi!`,
  },
};

let lang = localStorage.getItem("ch-lang") || "en";
const t = key => STR[lang][key];

/* ---------- sound (WebAudio, no files) ---------- */
let soundOn = localStorage.getItem("ch-sound") !== "off";
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
  toggle: () => beep(700, 0.06, "sine"),
  good: () => { beep(660, 0.09); setTimeout(() => beep(880, 0.12), 90); },
  unlock: () => { [440, 550, 660, 880].forEach((f, i) => setTimeout(() => beep(f, 0.12, "triangle", 0.07), i * 110)); },
  bad: () => beep(160, 0.25, "sawtooth", 0.07),
  alarm: () => { beep(880, 0.15, "square", 0.06); setTimeout(() => beep(620, 0.15, "square", 0.06), 160); },
  pixel: () => beep(980, 0.03, "sine", 0.04),
  win: () => {
    [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => beep(f, 0.18, "triangle", 0.08), i * 140));
    // Land the mission-complete fanfare on a full chord instead of a lone note.
    setTimeout(() => [1319, 1568, 2093].forEach(f => beep(f, 0.5, "triangle", 0.05)), 580);
  },
};

/* ---------- state ---------- */
const screen = document.getElementById("screen");
const topbar = document.getElementById("topbar");
const timerEl = document.getElementById("timer");
const progressEl = document.getElementById("progress");
let agent = "";
let startTime = 0, timerInt = null;
let currentDoor = 0; // 1..4
const SCORE_KEY = "ch-session-scores";

/* ---------- helpers ---------- */
const el = (html) => { const d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; };
function show(node) { screen.innerHTML = ""; screen.appendChild(node); node.classList.add("fade-in"); }
function fmtTime(ms) {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
function getScores() {
  try { return JSON.parse(sessionStorage.getItem(SCORE_KEY) || "[]"); }
  catch { return []; }
}
function addScore(name, ms) {
  const scores = [...getScores(), { name, ms }]
    .sort((a, b) => a.ms - b.ms)
    .slice(0, 5);
  sessionStorage.setItem(SCORE_KEY, JSON.stringify(scores));
  return scores;
}
function leaderboardHtml(scores = getScores()) {
  const rows = scores.length
    ? scores.map((score, i) => `<li><span>${i + 1}. ${score.name}</span><b>${fmtTime(score.ms)}</b></li>`).join("")
    : `<li class="empty">${t("noScores")}</li>`;
  return `<section class="score-board" aria-label="${t("leaderboard")}">
    <div class="score-title">${t("leaderboard")}</div>
    <ol>${rows}</ol>
  </section>`;
}
function scoreToast(message) {
  const toast = el(`<div class="score-toast">${message}</div>`);
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1500);
}
function startTimer() {
  startTime = Date.now();
  timerInt = setInterval(() => { timerEl.textContent = fmtTime(Date.now() - startTime); }, 500);
}
function renderProgress() {
  progressEl.innerHTML = "";
  for (let i = 1; i <= 4; i++) {
    const d = document.createElement("span");
    d.className = "door" + (i < currentDoor ? " done" : i === currentDoor ? " now" : "");
    d.textContent = `[${i < currentDoor ? "✔" : i}]`;
    progressEl.appendChild(d);
  }
  const label = document.createElement("span");
  label.textContent = ` ${t("door")} ${Math.min(currentDoor, 4)}/4`;
  progressEl.appendChild(label);
}
function skipBtn(fn) {
  const b = el(`<button class="skip-link">${t("skip")}</button>`);
  b.onclick = () => { sfx.click(); b.remove(); fn(); };
  document.body.appendChild(b);
  return b;
}
function clearSkip() { document.querySelectorAll(".skip-link").forEach(b => b.remove()); }

/* typing effect */
function typeText(node, text, speed = 22) {
  return new Promise(res => {
    node.classList.add("cursor");
    let i = 0;
    const int = setInterval(() => {
      node.textContent = text.slice(0, ++i);
      if (text[i - 1] && text[i - 1] !== " " && i % 2 === 0) beep(1200 + Math.random() * 300, 0.015, "sine", 0.015);
      if (i >= text.length) { clearInterval(int); node.classList.remove("cursor"); res(); }
    }, speed);
  });
}

/* unlocked interstitial */
function doorUnlocked(next) {
  clearSkip();
  sfx.unlock();
  const node = el(`<div>
    <div class="big-emoji">🔓</div>
    <div class="unlock-banner">${t("unlocked")}</div>
  </div>`);
  show(node);
  setTimeout(next, 1400);
}

/* ================= SCREENS ================= */

/* ---- title ---- */
/* ---------------- lightweight booth play-count tracking ----------------
   No server, no external analytics — just a localStorage tally the booth
   operator can peek at by tapping the title 5 times. */
const CH_PLAY_COUNT_KEY = "ch-plays";
function bumpMissionCount() {
  const n = +(localStorage.getItem(CH_PLAY_COUNT_KEY) || 0) + 1;
  localStorage.setItem(CH_PLAY_COUNT_KEY, String(n));
}
function showPlayStats() {
  const n = +(localStorage.getItem(CH_PLAY_COUNT_KEY) || 0);
  const node = el(`<div class="stats-overlay">
    <div class="stats-card">
      <div class="stage-title">📊 BOOTH STATS</div>
      <div class="stage-help">${n} mission${n === 1 ? "" : "s"} started on this device</div>
      <button class="btn amber small" id="statsResetBtn">RESET</button>
      <button class="btn small" id="statsCloseBtn">CLOSE</button>
    </div>
  </div>`);
  node.querySelector("#statsResetBtn").onclick = () => { sfx.click(); localStorage.removeItem(CH_PLAY_COUNT_KEY); node.remove(); showPlayStats(); };
  node.querySelector("#statsCloseBtn").onclick = () => { sfx.click(); node.remove(); };
  document.body.appendChild(node);
}

function titleScreen() {
  clearSkip();
  topbar.classList.remove("hidden");
  timerEl.textContent = "00:00";
  currentDoor = 0; renderProgress();
  const node = el(`<div style="margin:auto">
    <div class="big-emoji">🕵️</div>
    <h1 class="glitch" id="chTitle">CYBER HEIST</h1>
    <div class="subtitle">${t("subtitle")}</div>
    <button class="btn" id="startBtn">${t("tapStart")}</button>
    ${leaderboardHtml()}
  </div>`);
  node.querySelector("#startBtn").onclick = () => { sfx.click(); bumpMissionCount(); bootScreen(); };
  // Secret booth-operator gesture: 5 taps on the title within 3s opens the
  // play-count overlay, out of the way of normal play.
  let titleTaps = 0, titleTapTimer = null;
  node.querySelector("#chTitle").onclick = () => {
    titleTaps++;
    clearTimeout(titleTapTimer);
    titleTapTimer = setTimeout(() => { titleTaps = 0; }, 3000);
    if (titleTaps >= 5) { titleTaps = 0; showPlayStats(); }
  };
  show(node);
}

/* ---- boot / name ---- */
async function bootScreen() {
  const node = el(`<div style="margin:auto;width:100%;max-width:640px">
    <div class="type-line" id="bootText"></div>
    <div id="nameArea" class="hidden" style="margin-top:20px">
      <div class="stage-title">${t("agentPrompt")}</div>
      <input id="agentName" maxlength="12" autocomplete="off" autocapitalize="characters" autocorrect="off" spellcheck="false" inputmode="text" enterkeyhint="go" placeholder="???">
      <br><button class="btn" id="nameGo">${t("startMission")}</button>
    </div>
  </div>`);
  show(node);
  const bootText = node.querySelector("#bootText");
  for (const line of t("bootLines")) {
    const p = document.createElement("div");
    bootText.appendChild(p);
    await typeText(p, line, 18);
  }
  node.querySelector("#nameArea").classList.remove("hidden");
  const input = node.querySelector("#agentName");
  input.focus();
  const go = () => {
    agent = (input.value.trim() || "X").toUpperCase();
    sfx.good();
    briefScreen();
  };
  node.querySelector("#nameGo").onclick = go;
  input.addEventListener("keydown", e => { if (e.key === "Enter") go(); });
}

/* ---- mission brief ---- */
async function briefScreen() {
  const node = el(`<div style="margin:auto;width:100%;max-width:640px">
    <div class="type-line" id="briefText"></div>
    <button class="btn amber hidden" id="goBtn">${t("go")}</button>
  </div>`);
  show(node);
  await typeText(node.querySelector("#briefText"), t("brief")(agent), 16);
  const b = node.querySelector("#goBtn");
  b.classList.remove("hidden");
  b.onclick = () => { sfx.click(); startTimer(); stage1(); };
}

/* ================= STAGE 1 : binary lock ================= */
const S1_TARGETS = [
  () => 2 + Math.floor(Math.random() * 7),        // small
  () => 17 + Math.floor(Math.random() * 30),      // medium
  () => 70 + Math.floor(Math.random() * 120),     // big
];
function stage1() {
  currentDoor = 1; renderProgress();
  let round = 0, bits = new Array(8).fill(0), target = S1_TARGETS[0]();
  const node = el(`<div style="width:100%;max-width:680px;margin:auto">
    <div class="stage-title">${t("s1title")}</div>
    <div class="stage-help">${t("s1help")}</div>
    <div class="lock-display" id="lockDisp">
      <div><span class="label">${t("passcode")}</span><span class="val target-val" id="tgt"></span></div>
      <div style="font-size:30px;opacity:.5">→</div>
      <div><span class="label">${t("yourCode")}</span><span class="val cur-val" id="cur">0</span></div>
    </div>
    <div class="bits" id="bits"></div>
    <div class="round-dots" id="dots"><span></span><span></span><span></span></div>
  </div>`);
  const bitsEl = node.querySelector("#bits");
  const curEl = node.querySelector("#cur");
  const tgtEl = node.querySelector("#tgt");
  const disp = node.querySelector("#lockDisp");

  for (let i = 0; i < 8; i++) {
    const w = 2 ** (7 - i);
    const b = el(`<div class="bit">
      <span class="weight">${w}</span>
      <button class="switch" data-i="${i}"></button>
      <span class="bitval">0</span>
    </div>`);
    b.querySelector(".switch").onclick = (e) => {
      const idx = +e.currentTarget.dataset.i;
      bits[idx] ^= 1;
      e.currentTarget.classList.toggle("on", !!bits[idx]);
      b.querySelector(".bitval").textContent = bits[idx];
      b.classList.toggle("on", !!bits[idx]);
      sfx.toggle();
      update();
    };
    bitsEl.appendChild(b);
  }

  function value() { return bits.reduce((a, b, i) => a + b * 2 ** (7 - i), 0); }
  function update() {
    const v = value();
    curEl.textContent = v;
    disp.classList.toggle("match", v === target);
    if (v === target) {
      sfx.good();
      bitsEl.style.pointerEvents = "none";
      setTimeout(() => {
        node.querySelectorAll("#dots span")[round].classList.add("done");
        round++;
        if (round >= 3) return doorUnlocked(stage2);
        target = S1_TARGETS[round]();
        bits.fill(0);
        node.querySelectorAll(".switch").forEach(s => s.classList.remove("on"));
        node.querySelectorAll(".bitval").forEach(s => s.textContent = "0");
        node.querySelectorAll(".bit").forEach(s => s.classList.remove("on"));
        tgtEl.textContent = target;
        curEl.textContent = "0";
        disp.classList.remove("match");
        bitsEl.style.pointerEvents = "";
      }, 700);
    }
  }
  tgtEl.textContent = target;
  show(node);
  skipBtn(() => doorUnlocked(stage2));
}

/* ================= STAGE 2 : decode message ================= */
const S2_WORD = "ROBOT";
function stage2() {
  currentDoor = 2; renderProgress();
  const word = S2_WORD;
  let pos = 0;
  const bytes = [...word].map(ch => ch.charCodeAt(0).toString(2).padStart(8, "0"));
  const node = el(`<div style="width:100%;max-width:680px;margin:auto">
    <div class="stage-title">${t("s2title")}</div>
    <div class="stage-help">${t("s2help")}</div>
    <div class="cipher-strip" id="strip"></div>
    <div class="decoder-chart" id="chart"></div>
    <div class="keyboard" id="kb"></div>
  </div>`);
  const strip = node.querySelector("#strip");
  [...word].forEach((_, i) => {
    strip.appendChild(el(`<div class="cipher-byte ${i === 0 ? "active" : ""}" id="cb${i}">
      <span class="bin">${bytes[i]}</span><span class="letter"></span>
    </div>`));
  });
  const chart = node.querySelector("#chart");
  for (let i = 0; i < 26; i++) {
    const ch = String.fromCharCode(65 + i);
    chart.appendChild(el(`<div><b>${ch}</b> = ${ch.charCodeAt(0).toString(2).padStart(8, "0")}</div>`));
  }
  const kb = node.querySelector("#kb");
  for (let i = 0; i < 26; i++) {
    const ch = String.fromCharCode(65 + i);
    const k = el(`<button class="key">${ch}</button>`);
    k.onclick = () => {
      if (ch === word[pos]) {
        sfx.good();
        const cb = node.querySelector(`#cb${pos}`);
        cb.querySelector(".letter").textContent = ch;
        cb.classList.remove("active");
        pos++;
        if (pos >= word.length) return setTimeout(() => doorUnlocked(stage3), 500);
        node.querySelector(`#cb${pos}`).classList.add("active");
      } else {
        sfx.bad();
        k.classList.remove("wrong"); void k.offsetWidth; k.classList.add("wrong");
      }
    };
    kb.appendChild(k);
  }
  show(node);
  skipBtn(() => doorUnlocked(stage3));
}

/* ================= STAGE 3 : robot ================= */
const MAZES = [
  { cols: 5, rows: 5, start: [0, 0], gem: [4, 4],
    walls: [[0, 2], [1, 2], [3, 0], [3, 1], [3, 2]] },
  { cols: 6, rows: 6, start: [0, 0], gem: [5, 5],
    walls: [[0, 3], [1, 0], [1, 1], [1, 3], [2, 3], [3, 1], [3, 5], [4, 1], [4, 2], [4, 3], [4, 5]] },
];
function stage3() {
  currentDoor = 3; renderProgress();
  let level = 0;
  const node = el(`<div style="width:100%;max-width:680px;margin:auto">
    <div class="stage-title">${t("s3title")}</div>
    <div class="stage-help">${t("s3help")}</div>
    <div id="mazeArea"></div>
    <div class="cmd-queue" id="queue"></div>
    <div class="dpad">
      <button class="key" data-d="U">⬆️</button>
      <button class="key" data-d="L">⬅️</button>
      <button class="key" data-d="D">⬇️</button>
      <button class="key" data-d="R">➡️</button>
    </div>
    <div class="runrow">
      <button class="btn small amber" id="runBtn">${t("run")}</button>
      <button class="btn small" id="clrBtn">${t("clear")}</button>
    </div>
    <div class="stage-help" id="msg" style="color:var(--red);min-height:1.4em;margin-top:8px"></div>
  </div>`);

  let queue = [], running = false, robotEl = null, maze = null;

  function cellSize(m) {
    return Math.min(56, Math.floor(Math.min(window.innerWidth - 60, 380) / m.cols));
  }
  function buildMaze() {
    maze = MAZES[level];
    const size = cellSize(maze);
    const area = node.querySelector("#mazeArea");
    area.innerHTML = "";
    const grid = el(`<div class="maze" style="--cell:${size}px;grid-template-columns:repeat(${maze.cols},${size}px)"></div>`);
    for (let r = 0; r < maze.rows; r++) {
      for (let c = 0; c < maze.cols; c++) {
        const isWall = maze.walls.some(w => w[0] === r && w[1] === c);
        const isGem = maze.gem[0] === r && maze.gem[1] === c;
        grid.appendChild(el(`<div class="cell ${isWall ? "wall" : ""}">${isGem ? "💎" : ""}</div>`));
      }
    }
    robotEl = el(`<div id="robot">🤖</div>`);
    grid.appendChild(robotEl);
    area.appendChild(grid);
    placeRobot(maze.start[0], maze.start[1], size);
  }
  function placeRobot(r, c, size) {
    robotEl.style.transform = `translate(${c * (size + 3)}px, ${r * (size + 3)}px)`;
  }
  function renderQueue(execIdx = -1) {
    const q = node.querySelector("#queue");
    q.innerHTML = queue.length ? "" : `<span class="placeholder">— PROGRAM —</span>`;
    const icons = { U: "⬆️", D: "⬇️", L: "⬅️", R: "➡️" };
    queue.forEach((d, i) => q.appendChild(el(`<span class="q ${i === execIdx ? "exec" : ""}">${icons[d]}</span>`)));
  }
  node.querySelectorAll(".dpad .key").forEach(k => {
    k.onclick = () => {
      if (running || queue.length >= 16) return;
      queue.push(k.dataset.d); sfx.click(); renderQueue();
    };
  });
  node.querySelector("#clrBtn").onclick = () => { if (!running) { queue = []; sfx.toggle(); renderQueue(); } };
  node.querySelector("#runBtn").onclick = async () => {
    if (running || !queue.length) return;
    running = true;
    node.querySelector("#msg").textContent = "";
    const size = cellSize(maze);
    let [r, c] = maze.start;
    placeRobot(r, c, size);
    await new Promise(res => setTimeout(res, 350));
    for (let i = 0; i < queue.length; i++) {
      renderQueue(i);
      const d = queue[i];
      r += d === "D" ? 1 : d === "U" ? -1 : 0;
      c += d === "R" ? 1 : d === "L" ? -1 : 0;
      const out = r < 0 || c < 0 || r >= maze.rows || c >= maze.cols;
      const wall = !out && maze.walls.some(w => w[0] === r && w[1] === c);
      if (!out) placeRobot(r, c, size);
      sfx.toggle();
      await new Promise(res => setTimeout(res, 380));
      if (out || wall) {
        sfx.alarm();
        robotEl.classList.add("crash");
        document.body.classList.add("alarm-flash");
        node.querySelector("#msg").textContent = t("crash");
        setTimeout(() => { robotEl.classList.remove("crash"); document.body.classList.remove("alarm-flash"); }, 900);
        placeRobot(maze.start[0], maze.start[1], size);
        renderQueue();
        running = false;
        return;
      }
      if (r === maze.gem[0] && c === maze.gem[1]) {
        sfx.good();
        renderQueue();
        level++;
        queue = [];
        if (level >= MAZES.length) { running = false; return doorUnlocked(stage4); }
        setTimeout(() => { buildMaze(); renderQueue(); running = false; }, 800);
        return;
      }
    }
    renderQueue();
    running = false;
  };
  buildMaze();
  renderQueue();
  show(node);
  skipBtn(() => doorUnlocked(stage4));
}

/* ================= STAGE 4 : pixel file ================= */
const SMILEY = ["00111100", "01000010", "10100101", "10000001", "10100101", "10011001", "01000010", "00111100"];
function stage4() {
  currentDoor = 4; renderProgress();
  const total = SMILEY.join("").split("").filter(bit => bit === "1").length;
  let correct = 0, finished = false;
  const node = el(`<div style="width:100%;max-width:720px;margin:auto">
    <div class="stage-title">${t("s4title")}</div>
    <div class="stage-help">${t("s4help")}</div>
    <div class="pix-wrap">
      <div class="pix-rows" id="rows"></div>
      <div class="pix-grid" id="grid"></div>
    </div>
    <div class="pixel-status" id="pixelStatus">${t("pixelsLeft")(total)}</div>
    <div class="stage-help" id="doneMsg"></div>
  </div>`);
  const grid = node.querySelector("#grid");
  const rowsEl = node.querySelector("#rows");
  SMILEY.forEach((bin, r) => {
    const row = el(`<div class="pix-row" data-row="${r}">
      <span class="row-num">${String(r + 1).padStart(2, "0")}</span>
      <span class="binary">${[...bin].map(bit => `<i class="bit-${bit}">${bit}</i>`).join("")}</span>
    </div>`);
    rowsEl.appendChild(row);
    [...bin].forEach((bit, c) => {
      const pixel = el(`<button type="button" class="px" aria-label="Row ${r + 1}, bit ${c + 1}"></button>`);
      pixel.onclick = () => {
        if (finished || pixel.classList.contains("on")) return;
        if (bit === "0") {
          sfx.bad();
          pixel.classList.remove("wrong");
          void pixel.offsetWidth;
          pixel.classList.add("wrong");
          const message = node.querySelector("#doneMsg");
          message.style.color = "var(--red)";
          message.textContent = t("wrongPixel");
          return;
        }
        pixel.classList.add("on");
        sfx.pixel();
        correct++;
        const rowPixels = [...grid.children].slice(r * 8, r * 8 + 8);
        const rowDone = [...bin].every((value, index) => value === "0" || rowPixels[index].classList.contains("on"));
        row.classList.toggle("done", rowDone);
        node.querySelector("#pixelStatus").textContent = t("pixelsLeft")(total - correct);
        node.querySelector("#doneMsg").textContent = "";
        if (correct === total) {
          finished = true;
          grid.classList.add("revealed");
          sfx.unlock();
          node.querySelector("#pixelStatus").textContent = `✔ ${t("fileDecoded")}`;
          const done = node.querySelector("#doneMsg");
          done.style.color = "var(--green)";
          done.textContent = t("secretIs");
          setTimeout(completeScreen, 2200);
        }
      }
      grid.appendChild(pixel);
    });
  });
  show(node);
}

/* ================= COMPLETE ================= */
function completeScreen() {
  clearSkip();
  clearInterval(timerInt);
  const ms = Date.now() - startTime;
  const previousBest = getScores()[0]?.ms ?? Infinity;
  const scores = addScore(agent, ms);
  const isRecord = ms <= previousBest;
  currentDoor = 5; renderProgress();
  const rank = ms < 4 * 60000 ? 0 : ms < 7 * 60000 ? 1 : 2;
  const node = el(`<div style="margin:auto">
    <div class="big-emoji">🏆</div>
    <h1 class="glitch" style="font-size:clamp(26px,7vw,54px)">${t("complete")}</h1>
    <div class="rank-card">
      <div style="font-size:12px;letter-spacing:2px;opacity:.7">${t("agentRank")}</div>
      <div class="rank">${t("ranks")[rank]}</div>
      <div class="time">⏱ ${t("yourTime")}: ${fmtTime(ms)}</div>
    </div>
    ${isRecord ? `<div class="new-record">${t("newRecord")}</div>` : ""}
    ${leaderboardHtml(scores)}
    <div class="type-line" style="margin:18px auto 0;max-width:520px" id="learnedText"></div>
    <button class="btn" id="againBtn">${t("playAgain")}</button>
  </div>`);
  node.querySelector("#againBtn").onclick = () => { sfx.click(); stopConfetti(); titleScreen(); };
  show(node);
  sfx.win();
  startConfetti();
  typeText(node.querySelector("#learnedText"), t("learned")(agent), 14);
}

/* ================= confetti ================= */
const confCanvas = document.getElementById("confetti");
const cctx = confCanvas.getContext("2d");
let confAnim = null, confPieces = [];
function startConfetti() {
  confCanvas.width = innerWidth; confCanvas.height = innerHeight;
  confPieces = Array.from({ length: 130 }, () => ({
    x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight,
    w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
    vy: 2 + Math.random() * 3, vx: -1 + Math.random() * 2,
    rot: Math.random() * Math.PI, vr: -0.1 + Math.random() * 0.2,
    color: ["#00ff9c", "#00e5ff", "#ffc857", "#ff3860", "#ffffff"][Math.floor(Math.random() * 5)],
  }));
  (function loop() {
    cctx.clearRect(0, 0, confCanvas.width, confCanvas.height);
    confPieces.forEach(p => {
      p.y += p.vy; p.x += p.vx; p.rot += p.vr;
      if (p.y > innerHeight + 20) { p.y = -20; p.x = Math.random() * innerWidth; }
      cctx.save(); cctx.translate(p.x, p.y); cctx.rotate(p.rot);
      cctx.fillStyle = p.color; cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cctx.restore();
    });
    confAnim = requestAnimationFrame(loop);
  })();
}
function stopConfetti() { cancelAnimationFrame(confAnim); cctx.clearRect(0, 0, confCanvas.width, confCanvas.height); }

/* ================= matrix rain background ================= */
const mtx = document.getElementById("matrix-bg");
const mctx = mtx.getContext("2d");
let drops = [];
function setupMatrix() {
  mtx.width = innerWidth; mtx.height = innerHeight;
  const cols = Math.floor(innerWidth / 16);
  drops = Array.from({ length: cols }, () => Math.random() * -50);
}
setupMatrix();
addEventListener("resize", setupMatrix);
setInterval(() => {
  mctx.fillStyle = "rgba(2,4,10,0.12)";
  mctx.fillRect(0, 0, mtx.width, mtx.height);
  mctx.fillStyle = "#00ff9c";
  mctx.font = "14px monospace";
  drops.forEach((y, i) => {
    const ch = Math.random() > 0.5 ? "1" : "0";
    mctx.fillText(ch, i * 16, y * 16);
    drops[i] = y * 16 > mtx.height && Math.random() > 0.975 ? 0 : y + 0.5;
  });
}, 66);

/* ================= top bar buttons ================= */
document.getElementById("langBtn").onclick = () => {
  lang = lang === "en" ? "bm" : "en";
  localStorage.setItem("ch-lang", lang);
  document.getElementById("langBtn").textContent = t("langBtn");
  document.getElementById("resetScoreBtn").textContent = t("resetScores");
  clearSkip();
  clearInterval(timerInt);
  titleScreen();
};
document.getElementById("soundBtn").onclick = () => {
  soundOn = !soundOn;
  localStorage.setItem("ch-sound", soundOn ? "on" : "off");
  document.getElementById("soundBtn").textContent = soundOn ? "🔊" : "🔇";
  if (soundOn) sfx.click();
};
document.getElementById("resetScoreBtn").onclick = () => {
  sessionStorage.removeItem(SCORE_KEY);
  sfx.toggle();
  scoreToast(t("scoresReset"));
  document.querySelectorAll(".score-board").forEach((board) => {
    board.replaceWith(el(leaderboardHtml([])));
  });
};
document.getElementById("langBtn").textContent = t("langBtn");
document.getElementById("soundBtn").textContent = soundOn ? "🔊" : "🔇";
document.getElementById("resetScoreBtn").textContent = t("resetScores");

/* ================= PWA ================= */
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

/* Install banner: offline-ready only matters once this is on the home
   screen, and browsers bury that step — especially iOS Safari, which has
   no install-prompt API at all and needs plain-text instructions instead. */
(function setupInstallBanner() {
  const KEY = "ch-install-dismissed";
  if (localStorage.getItem(KEY)) return;
  if (window.matchMedia("(display-mode: standalone)").matches || navigator.standalone) return;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  let deferredPrompt = null;

  function showBanner(iosMode) {
    if (document.getElementById("installBanner")) return;
    const banner = el(`<div class="install-banner" id="installBanner">
      <span>${iosMode ? "📲 Tap Share ⬆️ then \"Add to Home Screen\"" : "📲 Install this app for offline play"}</span>
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

/* go */
titleScreen();
