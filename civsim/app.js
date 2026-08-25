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

   Input is deliberately simple: hold your hand over an option for one
   second, or point and click with a mouse/trackpad. No pinching required.
================================================== */
import { FilesetResolver, HandLandmarker } from "../gesturegame/vendor/vision_bundle.mjs";

"use strict";

/* ---------------- i18n ---------------- */
const STR = {
  en: {
    langBtn: "BM",
    title: "AI Civilization",
    desc: "Give three tribes their stats, choose an era, then watch them explore, discover and fight for the land.",
    how: "Choose with either your hand or cursor. Hold your hand for 1 second, or simply point and click. Then watch the AI run the world.",
    start: "START ▶", startHand: "✋ USE HAND + CAMERA", startCursor: "🖱️ USE CURSOR + CLICK", back: "← HUB", again: "PLAY AGAIN ↺",
    loading: "Waking up the AI brain… 🧠",
    loadingCam: "Turning on the camera… 📷",
    camFail: "Camera blocked! Allow camera access in your browser settings, then reload.",
    aiFail: "Could not load the AI. Reload the page to try again.",
    calibShow: "Show me your hand! ✋", calibHint: "Hold your hand up so the camera can see it clearly",
    calibReady: "Got it! Ready…", calibSkip: "Can't see your hand? Start anyway →",
    camTroubleTitle: "Camera trouble", camTroubleDesc: "The camera feed froze. Trying to reconnect…",
    camReconnecting: "Reconnecting camera…", camRetryBtn: "🔄 TRY AGAIN",
    handLost: "Show your hand or move the cursor to choose.",
    pickEra: "CHOOSE THE ERA",
    pickSpec: n => `SET UP TRIBE ${n}`,
    holdToPick: "✋ Hold for 1 second, or 🖱️ click an option",
    specHint: "Set a level for every stat",
    budget: (used, total) => `POINTS  ${used} / ${total}  ·  spend wisely`,
    aiLearned: "🧠 WHAT THE AI HAS LEARNED",
    aiNoData: "🧠 No games yet today — the AI is starting fresh!",
    aiStat: (trait, era, pct, runs) => `High ${trait} wins ${era} ${pct}% of the time (${runs} runs)`,
    growthPhase: "🌱 EXPLORE & GROW", warPhase: "⚔️ CONQUEST",
    speed: "Speed", tribe: n => `TRIBE ${n}`,
    traitInt: "Intelligence", traitWork: "Work", traitHealth: "Health", traitAggro: "Aggression",
    lvl: ["", "Low", "Fair", "High", "Genius"],
    lvlWork: ["", "Getting Started", "Steady", "Hardworking", "Tireless"],
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
    evFoundWater: "Reached the water's edge.", evFoundGem: "Found a sparkling hidden gem!", evFoundAnimal: "Found wild animals roaming here!", evFoundIron: "Found iron ore in the ground!",
    evIgnore: thing => `Walks past the ${thing}, not knowing what they are for.`,
    evDiscover: (emoji, name) => `${emoji} DISCOVERED: ${name}!`,
    evBuildHut: "🏠 Built a hut.",
    evBuildWall: "🧱 Raised a wall.",
    evStarve: "😰 Food is running out!",
    evGrow: n => `👥 Population reaches ${n}.`,
    evAttack: n => `⚔️ Attacking ${n}!`, evAttackWhy: reason => `⚔️ Attack reason: ${reason}.`,
    evCapture: n => `🚩 Took land from ${n}.`,
    evLost: "💀 This tribe could not continue.",
    evLostStarve: "💀 This tribe could not continue because food ran out.", evLostIllness: "💀 This tribe could not continue because of illness.", evLostConquest: "💀 Their capital was captured.",
    evCollapse: "⚠️ Population is collapsing — help is needed!",
    evExpand: "🚶 Claimed new land.",
    thingTree: "trees", thingRock: "stones", thingWater: "water",
    evChop: "🪓 Started chopping wood.",
    evMine: "⛏️ Started mining stone.",
    evIdle: "😴 The team is taking a short rest.",
    evNoWood: "🪵 Out of wood — can't build.",
    whyInt: lv => `Intelligence ${lv}/4 — ${lv >= 3 ? "clever enough to work new things out" : "struggles to understand new things"}`,
    whyWork: lv => `Work ${lv}/4 — ${lv >= 3 ? "they work together and produce a lot" : "they need more time to get things done"}`,
    whyHealth: lv => `Health ${lv}/4 — ${lv >= 3 ? "they resist hunger and grow fast" : "they tire and starve easily"}`,
    whyAggro: lv => `Aggression ${lv}/4 — ${lv >= 3 ? "they attack often and hit hard" : "they rarely pick a fight"}`,
    jobChop: "chopping", jobMine: "mining", jobFarm: "farming", jobBuild: "building", jobFight: "fighting", jobIdle: "resting",
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
    evNoTrees: "🪵 The last tree is gone!",
    evSpoil: "🥀 Food is spoiling — not enough storage!",
    evNoStone: "⛏️ All the stone is mined out.",
    evGangUp: n => `⚔️ Everyone is attacking ${n} — they are in front!`,
    evCoalition: n => `🤝 Alliance formed against ${n}!`,
    evCoalitionOn: n => `🎯 The others have allied against ${n}.`,
    evElite: "🍖 So many skilled people to feed!",
    storyTitle: "WHAT HAPPENED",
    stTop: (d, h) => `built the strongest civilization — ${d} discoveries, ${h} huts`,
    stConquered: n => `conquered by ${n}`,
    stStarved: n => `starved — ${n} people lost to famine`,
    stNoWood: "stripped its forest bare and ran out of wood",
    stNoStone: "mined out all its stone",
    stGanged: "led early, so both rivals turned on it",
    stIgnorant: n => `never worked out how to use what it found (only ${n} discoveries)`,
    stIdle: "spent most of the time standing idle",
    stThirsty: "never found drinking water",
    stElite: "too many skilled mouths to feed for this land",
    stSteady: "steady, but simply out-built",
    stOverrun: "overrun — its capital was taken",
    pickPolicy: n => `CHOOSE TRIBE ${n} POLICY`,
    policyHint: "A policy changes what this civilization values most",
    policyResearch: "Research First", policyResearchSub: "Find inventions and cures sooner",
    policyFood: "Food First", policyFoodSub: "Grow food and population faster",
    policyDefend: "Defence First", policyDefendSub: "Build walls and survive outbreaks",
    policyConquest: "Conquest First", policyConquestSub: "Fight harder, but take bigger risks",
    policyCooperate: "Cooperate", policyCooperateSub: "Trade resources and share cures",
    evPolicy: n => `📜 Policy: ${n}`,
    evIllness: "🦠 Illness is spreading!", evCured: "💊 The outbreak is under control!",
    evClinic: "🏥 Built a clinic.", evNoCure: "🦠 No cure yet — more people are falling ill.",
    evTrade: n => `🤝 Shared supplies with ${n}.`, evOffer: n => `🤝 Sent a cooperation offer to ${n}.`, evAccept: n => `✅ ${n} accepted cooperation.`, evReject: n => `❌ ${n} declined cooperation.`, evEvolve: (n, title) => `⬆️ EVOLVED: ${n} → ${title}!`,
    evEvent: n => `🌍 World event: ${n}`, evDrought: "Drought", evFlood: "Flood", evMigration: "Migration", evPlague: "Plague", evHarvest: "Rich harvest",
    stageNoob: "New Settlers", stageGatherer: "Gatherers", stageBuilder: "Builders", stageScholar: "Scholars", stageInventor: "Inventors",
    reportTitle: "AI INTELLIGENCE REPORT", reportSmart: "Smart choices", reportLuck: "Risk & luck", reportStage: "Evolution", reportIll: "Illness losses", reportTech: "Technology", reportPolicy: "Policy",
    choiceGood: "WHAT WORKED WELL", choiceTry: "TRY THIS NEXT TIME",
    goodResearch: "Research First helped this tribe discover new ideas sooner.", goodFood: "Food First helped the tribe grow and keep food ready.", goodDefend: "Defence First helped the tribe prepare for danger.", goodConquest: "Conquest First helped the tribe claim more land.", goodCooperate: "Cooperate helped the tribe share food and cures.",
    tryWork: "Choose more Work next time so the team can gather food and build sooner.", tryInt: "Choose more Intelligence next time to discover useful inventions.", tryHealth: "Choose more Health next time to better handle illness and hunger.", tryMedicine: "Find Medicine and build a Clinic to protect the community from illness.",
    riverName: "NORTH RIVER", floodFromRiver: "Flood water is flowing from the river!", newDiscovery: "NEW", wheelTravel: "🛞 Wheel explorers found new land.", gemName: "Crystal Craft", objective: "NEXT GOAL", legend: "MAP KEY", relation: "Relations", timeline: "TIMELINE",
  },
  bm: {
    langBtn: "EN",
    title: "Tamadun AI",
    desc: "Beri tiga puak statistik mereka, pilih era, kemudian tonton mereka meneroka, menemui dan berebut tanah.",
    how: "Pilih menggunakan tangan atau kursor. Tahan tangan selama 1 saat, atau tunjuk dan klik. Kemudian tonton AI mengurus dunia.",
    start: "MULA ▶", startHand: "✋ GUNA TANGAN + KAMERA", startCursor: "🖱️ GUNA KURSOR + KLIK", back: "← HUB", again: "MAIN LAGI ↺",
    loading: "Mengejutkan otak AI… 🧠",
    loadingCam: "Menghidupkan kamera… 📷",
    camFail: "Kamera disekat! Benarkan akses kamera dalam tetapan pelayar, kemudian muat semula.",
    aiFail: "AI gagal dimuatkan. Muat semula halaman untuk cuba lagi.",
    calibShow: "Tunjukkan tangan anda! ✋", calibHint: "Angkat tangan supaya kamera nampak dengan jelas",
    calibReady: "Dapat! Bersedia…", calibSkip: "Kamera tak nampak tangan? Mula juga →",
    camTroubleTitle: "Masalah kamera", camTroubleDesc: "Suapan kamera terhenti. Cuba sambung semula…",
    camReconnecting: "Menyambung semula kamera…", camRetryBtn: "🔄 CUBA LAGI",
    handLost: "Tunjukkan tangan atau gerakkan kursor untuk memilih.",
    pickEra: "PILIH ERA",
    pickSpec: n => `TETAPKAN PUAK ${n}`,
    holdToPick: "✋ Tahan 1 saat, atau 🖱️ klik pilihan",
    specHint: "Tetapkan tahap untuk setiap statistik",
    budget: (used, total) => `MATA  ${used} / ${total}  ·  guna dengan bijak`,
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
    evFoundWater: "Sampai ke tepi air.", evFoundGem: "Menemui permata tersembunyi yang berkilau!", evFoundAnimal: "Menemui haiwan liar di kawasan ini!", evFoundIron: "Menemui bijih besi dalam tanah!",
    evIgnore: thing => `Lalu di sebelah ${thing}, tidak tahu apa gunanya.`,
    evDiscover: (emoji, name) => `${emoji} DITEMUI: ${name}!`,
    evBuildHut: "🏠 Bina pondok.",
    evBuildWall: "🧱 Dirikan tembok.",
    evStarve: "😰 Makanan semakin habis!",
    evGrow: n => `👥 Penduduk mencapai ${n}.`,
    evAttack: n => `⚔️ Menyerang ${n}!`, evAttackWhy: reason => `⚔️ Sebab serangan: ${reason}.`,
    evCapture: n => `🚩 Rampas tanah ${n}.`,
    evLost: "💀 Puak ini tidak dapat meneruskan.",
    evLostStarve: "💀 Puak ini tidak dapat meneruskan kerana makanan habis.", evLostIllness: "💀 Puak ini tidak dapat meneruskan kerana penyakit.", evLostConquest: "💀 Ibu kota mereka telah dirampas.",
    evCollapse: "⚠️ Penduduk semakin pupus — bantuan diperlukan!",
    evExpand: "🚶 Menuntut tanah baru.",
    thingTree: "pokok", thingRock: "batu", thingWater: "air",
    evChop: "🪓 Mula menebang kayu.",
    evMine: "⛏️ Mula melombong batu.",
    evIdle: "😴 Pasukan sedang berehat seketika.",
    evNoWood: "🪵 Kehabisan kayu — tak boleh bina.",
    whyInt: lv => `Kecerdasan ${lv}/4 — ${lv >= 3 ? "cukup pandai untuk memikirkan perkara baru" : "sukar memahami perkara baru"}`,
    whyWork: lv => `Kerajinan ${lv}/4 — ${lv >= 3 ? "mereka bekerjasama dan hasilkan banyak" : "mereka perlukan lebih masa untuk menyiapkan kerja"}`,
    whyHealth: lv => `Kesihatan ${lv}/4 — ${lv >= 3 ? "tahan lapar dan membesar cepat" : "mudah letih dan kebuluran"}`,
    whyAggro: lv => `Agresif ${lv}/4 — ${lv >= 3 ? "kerap menyerang dan kuat" : "jarang mencari gaduh"}`,
    jobChop: "menebang", jobMine: "melombong", jobFarm: "bertani", jobBuild: "membina", jobFight: "berperang", jobIdle: "berehat",
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
    evNoTrees: "🪵 Pokok terakhir sudah habis!",
    evSpoil: "🥀 Makanan rosak — tiada tempat simpanan!",
    evNoStone: "⛏️ Semua batu sudah habis dilombong.",
    evGangUp: n => `⚔️ Semua menyerang ${n} — mereka di hadapan!`,
    evCoalition: n => `🤝 Pakatan dibentuk menentang ${n}!`,
    evCoalitionOn: n => `🎯 Yang lain berpakat menentang ${n}.`,
    evElite: "🍖 Terlalu ramai orang mahir untuk diberi makan!",
    storyTitle: "APA YANG BERLAKU",
    stTop: (d, h) => `membina tamadun terkuat — ${d} penemuan, ${h} pondok`,
    stConquered: n => `ditakluk oleh ${n}`,
    stStarved: n => `kebuluran — ${n} rakyat terkorban`,
    stNoWood: "menebang habis hutannya dan kehabisan kayu",
    stNoStone: "melombong habis semua batunya",
    stGanged: "mendahulu awal, jadi kedua-dua lawan menyerangnya",
    stIgnorant: n => `tidak tahu menggunakan apa yang dijumpai (hanya ${n} penemuan)`,
    stIdle: "menghabiskan masa menganggur",
    stThirsty: "tidak pernah menjumpai air minuman",
    stElite: "terlalu ramai mulut mahir untuk tanah ini",
    stSteady: "stabil, tetapi kalah dari segi pembinaan",
    stOverrun: "tumpas — ibu kotanya dirampas",
    pickPolicy: n => `PILIH DASAR PUAK ${n}`,
    policyHint: "Dasar mengubah keutamaan tamadun ini",
    policyResearch: "Utamakan Kajian", policyResearchSub: "Temui ciptaan dan penawar lebih awal",
    policyFood: "Utamakan Makanan", policyFoodSub: "Hasil makanan dan rakyat lebih cepat",
    policyDefend: "Utamakan Pertahanan", policyDefendSub: "Bina tembok dan tahan wabak",
    policyConquest: "Utamakan Penaklukan", policyConquestSub: "Menyerang lebih kuat, tetapi berisiko",
    policyCooperate: "Bekerjasama", policyCooperateSub: "Berdagang sumber dan berkongsi penawar",
    evPolicy: n => `📜 Dasar: ${n}`,
    evIllness: "🦠 Penyakit sedang merebak!", evCured: "💊 Wabak sudah terkawal!",
    evClinic: "🏥 Bina klinik.", evNoCure: "🦠 Belum ada penawar — lebih ramai jatuh sakit.",
    evTrade: n => `🤝 Berkongsi bekalan dengan ${n}.`, evOffer: n => `🤝 Menghantar tawaran kerjasama kepada ${n}.`, evAccept: n => `✅ ${n} menerima kerjasama.`, evReject: n => `❌ ${n} menolak kerjasama.`, evEvolve: (n, title) => `⬆️ BEREVOLUSI: ${n} → ${title}!`,
    evEvent: n => `🌍 Peristiwa dunia: ${n}`, evDrought: "Kemarau", evFlood: "Banjir", evMigration: "Migrasi", evPlague: "Wabak", evHarvest: "Tuai lumayan",
    stageNoob: "Peneroka Baharu", stageGatherer: "Pengumpul", stageBuilder: "Pembina", stageScholar: "Cendekiawan", stageInventor: "Pencipta",
    reportTitle: "LAPORAN KECERDASAN AI", reportSmart: "Pilihan bijak", reportLuck: "Risiko & nasib", reportStage: "Evolusi", reportIll: "Kehilangan penyakit", reportTech: "Teknologi", reportPolicy: "Dasar",
    choiceGood: "APA YANG MENJADI", choiceTry: "CUBA INI PADA PUSINGAN SETERUSNYA",
    goodResearch: "Utamakan Kajian membantu puak menemui idea baharu lebih awal.", goodFood: "Utamakan Makanan membantu puak membesar dan menyimpan makanan.", goodDefend: "Utamakan Pertahanan membantu puak bersedia menghadapi bahaya.", goodConquest: "Utamakan Penaklukan membantu puak menuntut lebih banyak tanah.", goodCooperate: "Bekerjasama membantu puak berkongsi makanan dan penawar.",
    tryWork: "Pilih Kerajinan lebih tinggi supaya pasukan dapat mengumpul makanan dan membina lebih awal.", tryInt: "Pilih Kecerdasan lebih tinggi untuk menemui ciptaan yang berguna.", tryHealth: "Pilih Kesihatan lebih tinggi untuk menghadapi penyakit dan kelaparan dengan lebih baik.", tryMedicine: "Cari Ubat dan bina Klinik untuk melindungi komuniti daripada penyakit.",
    riverName: "SUNGAI UTARA", floodFromRiver: "Air banjir sedang mengalir dari sungai!", newDiscovery: "BAHARU", wheelTravel: "🛞 Peneroka beroda menemui tanah baharu.", gemName: "Seni Kristal", objective: "MATLAMAT SETERUSNYA", legend: "PETUNJUK PETA", relation: "Hubungan", timeline: "GARIS MASA",
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
const POLICIES = [
  { id: "research", emoji: "🧪", key: "policyResearch", subKey: "policyResearchSub" },
  { id: "food", emoji: "🌾", key: "policyFood", subKey: "policyFoodSub" },
  { id: "defend", emoji: "🛡️", key: "policyDefend", subKey: "policyDefendSub" },
  { id: "conquest", emoji: "⚔️", key: "policyConquest", subKey: "policyConquestSub" },
  { id: "cooperate", emoji: "🤝", key: "policyCooperate", subKey: "policyCooperateSub" },
];
const policyOf = (id) => POLICIES.find(p => p.id === id) || POLICIES[0];

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

/* ---------------- discoveries ----------------
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
  { id: "bridge",  emoji: "🌉", en: "Bridges",   bm: "Jambatan",  int: 3, needs: ["wood", "stone"] },
  { id: "metal",   emoji: "⚒️", en: "Metal",     bm: "Logam",     int: 4, needs: ["stone", "fire"] },
  { id: "iron",    emoji: "⛓️", en: "Ironworking", bm: "Kerja Besi", int: 3, needs: ["tools"], res: "iron" },
  { id: "animals", emoji: "🐑", en: "Animal Farming", bm: "Ternakan Haiwan", int: 2, needs: ["farming"], res: "animal" },
  { id: "transport", emoji: "🐎", en: "Animal Transport", bm: "Pengangkutan Haiwan", int: 3, needs: ["animals", "wheel"] },
  { id: "writing", emoji: "📜", en: "Writing",   bm: "Tulisan",   int: 4, needs: ["tools"] },
  { id: "communication", emoji: "📡", en: "Communication", bm: "Komunikasi", int: 3, needs: ["writing"] },
  { id: "fishing", emoji: "🎣", en: "Fishing", bm: "Memancing", int: 2, needs: ["tools"], res: "water" },
  { id: "weapons", emoji: "⚔️", en: "Weapons",    bm: "Senjata",   int: 4, needs: ["metal", "iron"] },
  { id: "army",    emoji: "🛡️", en: "Army",      bm: "Tentera",   int: 4, needs: ["weapons"] },
  { id: "medicine", emoji: "💊", en: "Medicine", bm: "Ubat", int: 3, needs: ["fire", "tools"] },
  { id: "sanitation", emoji: "🧼", en: "Sanitation", bm: "Kebersihan", int: 3, needs: ["medicine"], res: "water" },
  { id: "electricity", emoji: "⚡", en: "Electricity", bm: "Elektrik", int: 4, needs: ["metal", "writing"] },
  { id: "crystal", emoji: "💎", en: "Crystal Craft", bm: "Seni Kristal", int: 2, res: "gem" },
  { id: "engineering", emoji: "⚙️", en: "Engineering", bm: "Kejuruteraan", int: 3, needs: ["crystal", "stone"] },
  { id: "computing", emoji: "💻", en: "Computing", bm: "Komputer", int: 4, needs: ["electricity", "writing"] },
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
let setupUsesCamera = false;
const pointerInput = { x: 0, y: 0, inside: false };
function updatePointer(e) {
  const r = canvas.getBoundingClientRect();
  pointerInput.x = (e.clientX - r.left) * innerWidth / Math.max(1, r.width);
  pointerInput.y = (e.clientY - r.top) * innerHeight / Math.max(1, r.height);
  pointerInput.inside = true;
}
function selectionCursor() {
  return pointerInput.inside ? { x: pointerInput.x, y: pointerInput.y, pointer: true } : engine.cursor();
}
canvas.addEventListener("pointermove", updatePointer);
canvas.addEventListener("pointerenter", updatePointer);
canvas.addEventListener("pointerleave", (e) => { if (e.pointerType !== "touch") pointerInput.inside = false; });
canvas.addEventListener("pointerup", (e) => { if (e.pointerType === "touch") pointerInput.inside = false; });
canvas.addEventListener("pointerdown", (e) => {
  updatePointer(e);
  if (activeScreen?.onPointerDown) activeScreen.onPointerDown(pointerInput.x, pointerInput.y);
});
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
  pointerInput.inside = false;
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
    <button class="btn" id="cursorBtn">${t("startCursor")}</button>
    <br><button class="btn ghost" id="startBtn" style="font-size:15px;padding:11px 25px">${t("startHand")}</button>
    <br><button class="btn ghost" id="backBtn" style="font-size:15px;padding:10px 24px">${t("back")}</button>
  </div>`);
  node.querySelector("#backBtn").onclick = () => { sfx.click(); location.href = "../"; };
  node.querySelector("#cursorBtn").onclick = () => {
    sfx.click(); setupUsesCamera = false; pointerInput.inside = false;
    document.body.classList.add("playing");
    homeBtn.classList.remove("hidden"); handStatus.classList.add("hidden"); camBtn.classList.add("hidden");
    engine.stopCamera(); cam.style.display = "none";
    show(null); ui.classList.add("passthrough"); startSetup();
  };
  node.querySelector("#startBtn").onclick = async () => {
    sfx.click();
    setupUsesCamera = true;
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
  open(title, options, onPick, context = null) {
    Object.assign(this, { title, options, onPick, context, hoverIndex: -1, hoverSince: 0, locked: false });
    activeScreen = this;
  },
  layout() {
    const n = this.options.length;
    const cols = n > 4 ? 3 : n, rows = Math.ceil(n / cols), gap = 16;
    const maxW = Math.min(innerWidth - 48, 1000);
    const cellW = Math.min(220, (maxW - gap * (cols - 1)) / cols);
    const h = n > 4 ? Math.min(150, innerHeight * .23) : Math.min(230, innerHeight * .4);
    const totalW = cellW * cols + gap * (cols - 1), baseY = n > 4 ? innerHeight * .60 : innerHeight / 2 + 20;
    return this.options.map((o, i) => {
      const row = Math.floor(i / cols), col = i % cols;
      return { ...o, w: cellW, h, x: innerWidth / 2 - totalW / 2 + col * (cellW + gap) + cellW / 2,
        y: baseY + (row - (rows - 1) / 2) * (h + gap) };
    });
  },
  onPointerDown(x, y) {
    if (this.locked) return;
    const i = this.layout().findIndex(b => Math.abs(x - b.x) < b.w / 2 && Math.abs(y - b.y) < b.h / 2);
    if (i < 0) return;
    this.locked = true; sfx.pick();
    const chosen = this.options[i];
    setTimeout(() => this.onPick(chosen.id), 110);
  },
  onFrame() {
    drawBackdrop();
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "900 clamp(22px,5vw,38px) Orbitron, system-ui";
    ctx.fillStyle = "#fff"; ctx.shadowColor = "#000"; ctx.shadowBlur = 12;
    const titleY = this.options.length > 4 ? 84 : innerHeight / 2 - 150;
    ctx.fillText(this.title, innerWidth / 2, titleY);
    ctx.font = "700 14px system-ui"; ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.shadowBlur = 5;
    ctx.fillText(this.options.length > 4 ? t("policyHint") : t("holdToPick"), innerWidth / 2, titleY + 30);
    if (this.context?.spec) {
      const sp = this.context.spec, tribe = this.context.tribeIndex + 1;
      const attrs = TRAITS.map(tr => `${tr.emoji}${"●".repeat(sp[tr.id])}`).join("  ");
      ctx.font = "800 12px system-ui"; ctx.fillStyle = TRIBE_COLORS[this.context.tribeIndex];
      ctx.fillText(`${t("tribe")(tribe)} · ${attrs}`, innerWidth / 2, titleY + 54);
    }
    ctx.shadowBlur = 0; ctx.restore();

    const boxes = this.layout(), cur = selectionCursor();
    let hovering = -1;
    if (cur && !this.locked) boxes.forEach((b, i) => {
      if (Math.abs(cur.x - b.x) < b.w / 2 && Math.abs(cur.y - b.y) < b.h / 2) hovering = i;
    });
    if (hovering !== this.hoverIndex) { this.hoverIndex = hovering; this.hoverSince = performance.now(); }
    const prog = hovering >= 0 && !cur?.pointer ? Math.min(1, (performance.now() - this.hoverSince) / DWELL_MS) : 0;

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
/* Every tribe shares one pool of points, so a stat can only be raised by
   giving something else up — 4/4/4/4 would need 16 and is simply not
   buyable. Each stat costs its own level, and one point is always held
   back for every stat still unset so the sheet can never be made
   impossible to finish. */
const SPEC_BUDGET = 12;
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
  spent() { return TRAITS.reduce((n, x) => n + (this.values[x.id] || 0), 0); },
  // Can this level be afforded, leaving at least 1 point for each stat
  // that has not been set yet?
  affordable(traitId, lv) {
    let other = 0, unset = 0;
    TRAITS.forEach(x => {
      if (x.id === traitId) return;
      if (this.values[x.id]) other += this.values[x.id]; else unset++;
    });
    return other + lv + unset <= SPEC_BUDGET;
  },
  chooseCell(c) {
    if (this.locked || !c || this.values[c.trait.id] === c.lv) return;
    if (!this.affordable(c.trait.id, c.lv)) { sfx.bad(); return; }
    const wasComplete = TRAITS.every(x => this.values[x.id]);
    this.values[c.trait.id] = c.lv;
    this.hoverKey = ""; this.hoverSince = performance.now();
    sfx.pick();
    if (!wasComplete && TRAITS.every(x => this.values[x.id])) {
      this.locked = true;
      const spec = { ...this.values };
      setTimeout(() => this.onDone(spec), 300);
    }
  },
  onPointerDown(x, y) {
    const c = this.layout().find(cell => Math.abs(x - cell.x) < cell.w / 2 && Math.abs(y - cell.y) < cell.h / 2);
    this.chooseCell(c);
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
    ctx.shadowBlur = 0;
    const left = SPEC_BUDGET - this.spent();
    ctx.font = "900 15px Orbitron, system-ui";
    ctx.fillStyle = left > 0 ? "#4ade80" : "#ffc857";
    ctx.fillText(t("budget")(this.spent(), SPEC_BUDGET), innerWidth / 2, 174);
    ctx.restore();

    const cells = this.layout(), cur = selectionCursor();
    let hoverKey = "";
    // Any row stays re-selectable, so a mis-set stat can simply be held
    // again rather than being locked in for the whole run.
    if (cur && !this.locked) cells.forEach(c => {
      if (this.values[c.trait.id] === c.lv) return;
      if (!this.affordable(c.trait.id, c.lv)) return;
      if (Math.abs(cur.x - c.x) < c.w / 2 && Math.abs(cur.y - c.y) < c.h / 2) hoverKey = `${c.trait.id}:${c.lv}`;
    });
    if (hoverKey !== this.hoverKey) { this.hoverKey = hoverKey; this.hoverSince = performance.now(); }
    const prog = hoverKey && !cur?.pointer ? Math.min(1, (performance.now() - this.hoverSince) / DWELL_MS) : 0;

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
        const tooDear = !isChosen && !this.affordable(tr.id, c.lv);
        const dim = (chosen && !isChosen) || tooDear;
        ctx.save();
        ctx.globalAlpha = tooDear ? 0.16 : dim ? 0.28 : 1;
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
        if (tooDear) {
          ctx.globalAlpha = 0.5; ctx.font = "12px system-ui";
          ctx.fillText("🔒", c.x + c.w / 2 - 12, c.y - c.h / 2 + 12);
        }
        if (hot && prog > 0) drawDwellRing(c.x, c.y, prog, 15);
        ctx.restore();
      });
    });
    drawCursor(cur);

    if (prog >= 1 && !this.locked) {
      const [tid, lv] = hoverKey.split(":");
      this.chooseCell(cells.find(c => c.trait.id === tid && c.lv === +lv));
    }
  },
};

/* Final look at all three tribes before the run starts — it lets the player
   (and the crowd around the booth) predict who should win. */
const CONFIRM = {
  open(specs, policies, onStart) {
    Object.assign(this, { specs, policies, onStart, hover: false, hoverSince: 0, locked: false });
    activeScreen = this;
  },
  box() { return { x: innerWidth / 2, y: innerHeight - 108, w: Math.min(300, innerWidth - 60), h: 74 }; },
  onPointerDown(x, y) {
    if (this.locked) return;
    const b = this.box();
    if (Math.abs(x - b.x) >= b.w / 2 || Math.abs(y - b.y) >= b.h / 2) return;
    this.locked = true; sfx.pick(); setTimeout(() => this.onStart(), 120);
  },
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
      const policy = policyOf(this.policies[i]);
      ctx.font = "700 10px system-ui"; ctx.fillStyle = "rgba(255,255,255,.78)";
      ctx.fillText(`${policy.emoji} ${t(policy.key)}`, x + cw / 2, y + 49);
      TRAITS.forEach((tr, r) => {
        const ry = y + 78 + r * 35;
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

    const b = this.box(), cur = selectionCursor();
    const hot = !!cur && !this.locked && Math.abs(cur.x - b.x) < b.w / 2 && Math.abs(cur.y - b.y) < b.h / 2;
    if (hot !== this.hover) { this.hover = hot; this.hoverSince = performance.now(); }
    const prog = hot && !cur?.pointer ? Math.min(1, (performance.now() - this.hoverSince) / DWELL_MS) : 0;
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
const chosenSpecs = [], chosenPolicies = [];
function startSetup() {
  // Play Again starts from a blank overlay state. The previous activity log
  // and review chip are removed before another selection screen is drawn.
  SIM.cleanup(); SIM.exitReview();
  document.querySelectorAll(".speed-bar,.civ-log,.review-chip").forEach(n => n.remove());
  chosenEra = "forest"; chosenSpecs.length = 0; chosenPolicies.length = 0;
  canvas.style.cursor = "pointer";
  if (setupUsesCamera && !engine.camReady) engine.startVideoStream().then(applyCamBg).catch(() => {});
  nextSpec(0);
}
function nextSpec(i) {
  if (i >= 3) return nextPolicy(0);
  SPEC.open(i, (spec) => { chosenSpecs.push(spec); nextSpec(i + 1); });
}
function nextPolicy(i) {
  if (i >= 3) return CONFIRM.open(chosenSpecs.slice(), chosenPolicies.slice(), () => SIM.start(chosenEra, chosenSpecs.slice(), chosenPolicies.slice()));
  CHOOSER.open(t("pickPolicy")(i + 1), POLICIES.map(p => ({
    id: p.id, emoji: p.emoji, label: t(p.key), sub: t(p.subKey),
  })), (id) => { chosenPolicies.push(id); nextPolicy(i + 1); }, { tribeIndex: i, spec: chosenSpecs[i] });
}

/* ================================================
   SIMULATION
================================================ */
const COLS = 60, ROWS = 34;
const SIM_DURATION = 150, CONQUEST_AT = 55;
const SPEEDS = [1, 2, 5, 10];
const F_NONE = 0, F_TREE = 1, F_ROCK = 2, F_WATER = 3, F_GEM = 4, F_ANIMAL = 5, F_IRON = 6;

const SIM = {
  feat: [], owner: [], build: [], tribes: [], simT: 0, speed: 1, running: false,
  era: null, ended: false, battles: [], terrainCache: null, logNode: null, speedBar: null,

  start(era, specs, policies = []) {
    this.era = era; this.simT = 0; this.speed = 1; this.running = true; this.ended = false;
    this.battles = []; this.effects = []; this.terrainCache = null; this.toasts = []; this.banner = null; this.warAnnounced = false; this.timeline = []; this.announcedDiscoveries = new Set(); this.announcementQueue = []; this.momentQueue = []; this.currentMoment = null;
    // Hand input is only needed for setup. Closing the stream here reduces
    // heat and battery use while the autonomous simulation is running.
    engine.stopCamera(); cam.style.display = "none"; canvas.style.cursor = "default"; pointerInput.inside = false;
    this.worldEvent = null; this.eventT = 18; this.tradeT = 8; this.autoEvents = true; this.paused = false;

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
    // Every world has one named, continuous river. It gives students an easy
    // landmark, makes water access understandable, and becomes the visible
    // source when a flood changes nearby tiles.
    this.river = [];
    let riverX = Math.floor(COLS * .68);
    for (let y = 0; y < ROWS; y++) {
      riverX = Math.max(2, Math.min(COLS - 3, riverX + Math.round(Math.sin(y * .58) * .7 + Math.sin(y * .17) * .55)));
      for (let dx = -1; dx <= 1; dx++) {
        const idx = this.idx(riverX + dx, y);
        this.feat[idx] = F_WATER;
        this.river.push(idx);
      }
    }
    this.riverSource = this.river[Math.min(this.river.length - 1, Math.floor(this.river.length * .12))];
    // Rare crystals reward tribes that explore beyond their first camp.
    this.gems = [];
    for (let tries = 0; this.gems.length < 9 && tries < 300; tries++) {
      const i = Math.floor(Math.random() * this.feat.length);
      if (this.feat[i] === F_NONE && !this.river.includes(i)) { this.feat[i] = F_GEM; this.gems.push(i); }
    }
    this.animals = []; this.irons = [];
    for (let tries = 0; this.animals.length < 12 && tries < 400; tries++) {
      const i = Math.floor(Math.random() * this.feat.length);
      if (this.feat[i] === F_NONE) { this.feat[i] = F_ANIMAL; this.animals.push(i); }
    }
    for (let tries = 0; this.irons.length < 9 && tries < 400; tries++) {
      const i = Math.floor(Math.random() * this.feat.length);
      if (this.feat[i] === F_ROCK) { this.feat[i] = F_IRON; this.irons.push(i); }
    }
    this.owner = new Array(COLS * ROWS).fill(-1);
    this.build = new Array(COLS * ROWS).fill(0); // 0 none, 1 hut, 2 wall

    const spots = this.randomStartSpots();
    this.tribes = specs.map((spec, i) => {
      const boost = learnedBonus(era, spec);
      const home = this.nearestOpen(spots[i].x, spots[i].y);
      const tr = {
        spec, color: TRIBE_COLORS[i], glow: TRIBE_GLOW[i], name: t("tribe")(i + 1), idx: i,
        int: spec.int, work: spec.work, health: spec.health, aggro: spec.aggro, boost,
        policy: policyOf(policies[i]), stage: 0, sick: 0, illnessLoss: 0, outbreaks: 0, cureLogged: false,
        lastThreat: "starvation", collapseT: 0, collapseWarned: false,
        pop: 6, food: 30, morale: 1, home, alive: true,
        known: new Set(), seen: new Set(), explore: 0,
        gainT: 0, expandT: 0, fightT: 0, buildT: 0, ignoreT: 0, lastPopLog: 6,
        wood: 0, stone: 0, iron: 0, workers: [], activeFrac: 1, idleLogged: 0, jobLogged: {},
        log: [], relations: {}, captures: 0, defeated: [],
        // Cost of excellence: a tribe of geniuses, tireless workers and
        // warriors simply eats more than a modest one, so a maxed-out spec
        // is expensive to keep alive on poor land.
        elite: 1 + ((spec.int + spec.work + spec.health + spec.aggro) - 10) * 0.10,
        stats: { famine: 0, attacksTaken: 0, outOfWood: false, outOfStone: false,
                 leaderSecs: 0, thirstySecs: 0, idleSecs: 0, peakPop: 6 },
      };
      const hp = this.xy(home);
      for (let k = 0; k < WORKER_CAP; k++) {
        tr.workers.push({ x: hp.x + (Math.random() - 0.5) * 2, y: hp.y + (Math.random() - 0.5) * 2,
          state: "idle", job: null, timer: Math.random() * 1.5, anim: Math.random() * 6 });
      }
      this.owner[home] = i;
      this.neighbors(home).forEach(n => { if (this.owner[n] === -1) this.owner[n] = i; });
      this.pushLog(tr, t("evStart"));
      this.pushLog(tr, t("evPolicy")(t(tr.policy.key)));
      return tr;
    });
    this.tribes.forEach(a => this.tribes.forEach(b => { if (a !== b) a.relations[b.idx] = "neutral"; }));

    this.logNode = el(`<div class="civ-log">${this.tribes.map((tr, i) => `
      <div class="log-col" id="logCol${i}" style="--c:${tr.color}">
        <div class="log-head">
          <span class="log-name">${tr.name}</span>
          <span class="log-stats"><b id="lgPop${i}">6</b>👥 <b id="lgLand${i}">1</b>🗺️</span>
        </div>
        <div class="log-traits">${TRAITS.map(x => `${x.emoji}${"●".repeat(tr.spec[x.id])}`).join(" ")}</div>
        <div class="log-disc" id="lgDisc${i}">${t("nothing")}</div>
        <div class="log-meta" id="lgMeta${i}">${policyOf(policies[i]).emoji} ${t(policyOf(policies[i]).key)}</div>
        <div class="log-goal" id="lgGoal${i}"></div>
        <div class="log-body" id="lgBody${i}"></div>
      </div>`).join("")}</div>`);
    document.body.appendChild(this.logNode);
    this.legendNode = el(`<div class="map-legend"><b>${t("legend")}</b><span>🌊 Water</span><span>🌉 Bridge</span><span>💎 Gem</span><span>🐑 Wild animals</span><span>⛓️ Iron</span><span>🏥 Clinic</span><span>🧱 Wall</span></div>`);
    document.body.appendChild(this.legendNode);

    this.speedBar = el(`<div class="speed-bar"><span class="speed-lbl">${t("speed")}</span>
      ${SPEEDS.map(s => `<button class="speed-btn${s === 1 ? " active" : ""}" data-s="${s}">×${s}</button>`).join("")}<button class="stop-btn" id="stopBtn">⏸ STOP</button>
      <span class="event-divider"></span><button class="event-mode" id="eventMode">⚙ AUTO</button>
      <span class="event-picks" id="eventPicks" hidden>${[["drought","☀️"],["flood","🌊"],["migration","🚶"],["plague","🦠"],["harvest","🌾"]].map(([id, icon]) => `<button data-event="${id}" title="${id}">${icon}</button>`).join("")}</span><button class="timeline-btn" id="timelineBtn">🕘</button></div>`);
    this.speedBar.querySelectorAll(".speed-btn").forEach(b => {
      b.onclick = () => {
        sfx.click(); this.speed = +b.dataset.s;
        this.speedBar.querySelectorAll(".speed-btn").forEach(o => o.classList.toggle("active", o === b));
      };
    });
    const stop = this.speedBar.querySelector("#stopBtn");
    stop.onclick = () => { this.paused = !this.paused; stop.textContent = this.paused ? "▶ RESUME" : "⏸ STOP"; stop.classList.toggle("paused", this.paused); };
    const mode = this.speedBar.querySelector("#eventMode"), picks = this.speedBar.querySelector("#eventPicks");
    mode.onclick = () => { this.autoEvents = !this.autoEvents; mode.textContent = this.autoEvents ? "⚙ AUTO" : "⚙ MANUAL"; picks.hidden = this.autoEvents; };
    picks.querySelectorAll("[data-event]").forEach(b => b.onclick = () => { this.triggerEvent(b.dataset.event); });
    this.timelineNode = el(`<div class="timeline-panel" hidden><b>🕘 ${t("timeline")}</b><div id="timelineList"></div></div>`);
    this.speedBar.querySelector("#timelineBtn").onclick = () => { this.timelineNode.hidden = !this.timelineNode.hidden; this.refreshTimeline(); };
    document.body.appendChild(this.speedBar);
    document.body.appendChild(this.timelineNode);
    activeScreen = this;
    this.refreshLog();
  },
  cleanup() {
    this.logNode?.remove(); this.logNode = null;
    this.speedBar?.remove(); this.speedBar = null;
    this.timelineNode?.remove(); this.timelineNode = null;
    this.legendNode?.remove(); this.legendNode = null;
    this.running = false;
  },

  pushLog(tr, msg, traitId) {
    const last = tr.log[tr.log.length - 1], now = performance.now();
    if (last?.msg === msg && now - (last.at || 0) < 5500) return;
    const r = traitId ? reason(tr, traitId) : null;
    tr.log.push({ msg, tag: r ? r.tag : "", why: r ? r.why : "", at: now });
    if (tr.log.length > 40) tr.log.shift();
    tr.logDirty = true;
  },
  markTimeline(icon, text) {
    this.timeline.push({ icon, text, time: Math.floor(this.simT) });
    if (this.timeline.length > 16) this.timeline.shift();
    this.refreshTimeline();
  },
  queueMoment(type, text, color = "#67e8f9", detail = {}) {
    if (this.currentMoment?.type === type && this.currentMoment?.text === text) return;
    if (this.momentQueue.some(m => m.type === type && m.text === text)) return;
    this.momentQueue.push({ type, text, color, detail, life: 3.6, max: 3.6 });
    if (this.momentQueue.length > 6) this.momentQueue.shift();
  },
  refreshTimeline() {
    const list = this.timelineNode?.querySelector("#timelineList");
    if (list) list.innerHTML = this.timeline.slice().reverse().map(x => `<div><b>${String(x.time).padStart(3, "0")}s</b> ${x.icon} ${x.text}</div>`).join("") || `<div>—</div>`;
  },
  refreshLog() {
    if (!this.logNode) return;
    this.tribes.forEach((tr, i) => {
      if (!tr.logDirty) return;
      tr.logDirty = false;
      const body = this.logNode.querySelector(`#lgBody${i}`);
      if (body) {
        body.innerHTML = tr.log.slice(-14).map(e => {
          const critical = /ATTACK|WAR|DIED|could not continue|ROBBERY|DECLINED|ACCEPTED|cooperation|ILLNESS|Food is running/i.test(e.msg) ? " critical" : /DISCOVERED|EVOLVED|Built|found/i.test(e.msg) ? " positive" : "";
          return `<div class="log-line${critical}"><span class="lg-msg">${e.msg}</span>${e.tag ? `<span class="lg-tag" title="${e.why}">${e.tag}</span>` : ""}</div>`;
        }).join("");
        body.scrollTop = body.scrollHeight;
      }
      const disc = this.logNode.querySelector(`#lgDisc${i}`);
      if (disc) {
        const list = DISCOVERIES.filter(d => tr.known.has(d.id));
        disc.innerHTML = list.length ? list.map(d => `<span title="${discName(d)}">${d.emoji}</span>`).join("") : t("nothing");
      }
      const meta = this.logNode.querySelector(`#lgMeta${i}`);
      if (meta) {
        const rel = Object.values(tr.relations).includes("allied") ? "🤝 ally" : Object.values(tr.relations).includes("rejected") ? "↔ declined" : "↔ neutral";
        meta.textContent = `${tr.policy.emoji} ${t(tr.policy.key)} · ${this.stageTitle(tr.stage)} · ${rel}${tr.sick > .15 ? ` · 🦠 ${Math.ceil(tr.sick)}` : ""}`;
      }
      const goal = this.logNode.querySelector(`#lgGoal${i}`);
      if (goal) goal.textContent = `${t("objective")}: ${this.nextGoal(tr)}`;
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
  randomStartSpots() {
    const spots = [];
    for (let tries = 0; spots.length < 3 && tries < 160; tries++) {
      const p = this.xy(this.nearestOpen(3 + Math.floor(Math.random() * (COLS - 6)), 3 + Math.floor(Math.random() * (ROWS - 6))));
      if (spots.every(s => Math.hypot(s.x - p.x, s.y - p.y) >= 17)) spots.push(p);
    }
    return spots.length === 3 ? spots : [{ x: 7, y: ROWS - 8 }, { x: COLS - 8, y: 7 }, { x: Math.floor(COLS / 2), y: ROWS - 6 }];
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
  featureForRes(res) { return ({ tree: F_TREE, rock: F_ROCK, water: F_WATER, gem: F_GEM, animal: F_ANIMAL, iron: F_IRON })[res]; },
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
      evolve: tr.stage * 12,
    };
    parts.total = Math.round(parts.land + parts.build + parts.know + parts.people + parts.evolve);
    if (!tr.alive) parts.total = Math.round(parts.total * 0.35);
    return parts;
  },
  intelligenceReport(tr) {
    const smart = tr.known.size * 2 + tr.stage * 4 + (tr.known.has("medicine") ? 4 : 0) + (tr.known.has("sanitation") ? 3 : 0);
    const risk = Math.round(tr.illnessLoss * 10) + tr.outbreaks * 2 + (tr.policy.id === "conquest" ? 2 : 0);
    return { smart, risk, tech: DISCOVERIES.filter(d => tr.known.has(d.id)).map(d => d.emoji).join("") || "—" };
  },
  choiceFeedback(tr) {
    const goodKey = { research: "goodResearch", food: "goodFood", defend: "goodDefend", conquest: "goodConquest", cooperate: "goodCooperate" }[tr.policy.id] || "goodResearch";
    let tryKey = "tryInt";
    if (tr.illnessLoss > 1.5 || tr.outbreaks > 0) tryKey = "tryMedicine";
    else if (tr.work <= 2) tryKey = "tryWork";
    else if (tr.int <= 2) tryKey = "tryInt";
    else if (tr.health <= 2) tryKey = "tryHealth";
    return { good: t(goodKey), try: t(tryKey) };
  },
  nextGoal(tr) {
    const bm = lang === "bm";
    if (!tr.known.has("farming")) return bm ? "🌾 Temui Pertanian" : "🌾 Discover Farming";
    if (this.ownsFeature(tr, F_ANIMAL) && !tr.known.has("animals")) return bm ? "🐑 Pelajari Ternakan Haiwan" : "🐑 Learn Animal Farming";
    if (!tr.known.has("boats") && !tr.known.has("bridge")) return bm ? "🌊 Cari cara menyeberangi air" : "🌊 Find a way across water";
    if (!tr.known.has("medicine")) return bm ? "💊 Temui Ubat" : "💊 Discover Medicine";
    return bm ? "🗺️ Teroka tanah baharu" : "🗺️ Explore new land";
  },

  /* Discovery: expanding reveals resources; whether the tribe can make
     anything of them is gated on the intelligence the player chose. */
  tryDiscover(tr, dt) {
    const research = tr.policy.id === "research" ? 1.65 : tr.policy.id === "conquest" ? .78 : 1;
    tr.explore += dt * (0.35 + this.landOf(tr) * 0.012) * cv("discover", tr.int) * (tr.known.has("writing") ? 1.5 : 1) * research;
    if (tr.explore < 1) return;
    tr.explore = 0;
    const avail = DISCOVERIES.filter(d =>
      !tr.known.has(d.id) &&
      d.int <= tr.int &&
      (!d.needs || d.needs.every(n => tr.known.has(n))) &&
      (!d.res || this.ownsFeature(tr, this.featureForRes(d.res))));
    if (!avail.length) {
      // Owns the resource but is not clever enough to use it — this is the
      // moment the player's trait choice becomes a visible story beat.
      tr.ignoreT += 1;
      if (tr.ignoreT % 3 === 0) {
        const blocked = DISCOVERIES.find(d => !tr.known.has(d.id) && d.res && d.int > tr.int &&
          this.ownsFeature(tr, this.featureForRes(d.res)));
        if (blocked) this.pushLog(tr, t("evIgnore")(blocked.res === "gem" ? t("gemName") : t(blocked.res === "tree" ? "thingTree" : blocked.res === "rock" ? "thingRock" : "thingWater")));
      }
      return;
    }
    const d = avail[0];
    tr.known.add(d.id);
    this.pushLog(tr, t("evDiscover")(d.emoji, discName(d)), "int");
    const foundAt = d.res ? this.ownedTiles(tr, i => this.feat[i] === this.featureForRes(d.res))[0] : tr.home;
    const at = this.xy(foundAt ?? tr.home);
    // The first tribe to make an invention gets the big map moment. Later
    // discoveries stay in the tribe log, so the screen never becomes spammy.
    if (!this.announcedDiscoveries.has(d.id)) {
      this.announcedDiscoveries.add(d.id);
      this.toasts.push({ text: `${d.emoji} ${tr.name}: ${discName(d)}`, color: tr.color, life: 2.4 });
      this.announcementQueue.push({ type: "tech", x: at.x, y: at.y, life: 3.2, max: 3.2, color: tr.color, icon: d.emoji, label: discName(d) });
      this.markTimeline(d.emoji, `${tr.name}: ${discName(d)}`);
    }
    if (this.speed <= 5) sfx.discover();
  },
  stageTitle(stage) {
    return t(["stageNoob", "stageGatherer", "stageBuilder", "stageScholar", "stageInventor"][stage] || "stageNoob");
  },
  evolve(tr) {
    let next = 0;
    if (tr.known.size >= 2) next = 1;
    if (tr.known.has("huts") && tr.known.has("tools")) next = 2;
    if (tr.known.has("medicine") || tr.known.has("writing")) next = 3;
    if (tr.known.has("computing") || (tr.known.has("engineering") && tr.known.has("electricity"))) next = 4;
    if (next > tr.stage) {
      tr.stage = next;
      this.pushLog(tr, t("evEvolve")(tr.name, this.stageTitle(next)), "int");
      this.toasts.push({ text: `⬆️ ${tr.name}: ${this.stageTitle(next)}`, color: tr.color, life: 2.8 });
      const home = this.xy(tr.home);
      this.effects.push({ type: "evolve", x: home.x, y: home.y, life: 3, max: 3, color: tr.color, label: this.stageTitle(next) });
    }
  },
  infectedNeighbor(tr) {
    for (let i = 0; i < this.owner.length; i++) {
      if (this.owner[i] !== tr.idx) continue;
      for (const n of this.neighbors(i)) {
        const other = this.owner[n];
        if (other >= 0 && other !== tr.idx && this.tribes[other].sick > 1) return true;
      }
    }
    return false;
  },
  hasContact(a, b) {
    for (let i = 0; i < this.owner.length; i++) if (this.owner[i] === a.idx && this.neighbors(i).some(n => this.owner[n] === b.idx)) return true;
    return false;
  },
  updateIllness(tr, dt, water) {
    const clinic = this.countBuild(tr, 3);
    const crowded = Math.max(0, tr.pop - 16) * .0035;
    const exposure = this.infectedNeighbor(tr) ? .035 : 0;
    const risk = crowded + exposure + (!water ? .018 : 0) + (tr.policy.id === "conquest" ? .012 : 0);
    if (tr.sick < .1 && Math.random() < risk * dt) {
      tr.sick = Math.min(tr.pop, 1.1 + tr.pop * .07); tr.outbreaks++;
      this.pushLog(tr, t("evIllness"), "health");
      this.toasts.push({ text: `🦠 ${tr.name}`, color: "#f87171", life: 2.4 });
      const home = this.xy(tr.home);
      this.effects.push({ type: "illness", x: home.x, y: home.y, life: 3.4, max: 3.4, color: "#7ee787" });
    }
    if (tr.sick <= .1) return;
    const sanitation = tr.known.has("sanitation") ? .46 : 1;
    const spread = tr.sick * (.045 + crowded * 1.8 + exposure) * sanitation * dt;
    tr.sick = Math.min(tr.pop, tr.sick + spread);
    const cure = tr.known.has("medicine") ? (.16 + clinic * .20 + (tr.policy.id === "research" ? .07 : 0)) * dt : 0;
    if (cure) tr.sick = Math.max(0, tr.sick - cure * (1 + tr.work * .12));
    else if (!tr.noCureAt || performance.now() - tr.noCureAt > 11000) {
      tr.noCureAt = performance.now(); this.pushLog(tr, t("evNoCure"), "int");
    }
    const loss = tr.sick * .024 * (1.22 - tr.health * .11) * (clinic ? .55 : 1) * dt;
    tr.pop = Math.max(0, tr.pop - loss); tr.illnessLoss += loss;
    if (loss > .002) tr.lastThreat = "illness";
    if (tr.sick < .12 && !tr.cureLogged) { tr.cureLogged = true; this.pushLog(tr, t("evCured"), "int"); }
    if (tr.sick >= .12) tr.cureLogged = false;
  },
  requestEmergencyAid(tr) {
    if (tr.aidT > 0) return;
    tr.aidT = 12;
    const helper = this.tribes.find(other => other.alive && other.idx !== tr.idx && other.food > 18 && tr.relations[other.idx] === "allied");
    if (helper) {
      helper.food -= 9; tr.food += 9; tr.sick = Math.max(0, tr.sick - .5);
      this.pushLog(tr, `🆘 ${helper.name} sent emergency food and help.`);
      this.pushLog(helper, `🤝 Sent emergency help to ${tr.name}.`);
      const a = this.xy(helper.home), b = this.xy(tr.home);
      this.effects.push({ type: "alliance", x: a.x, y: a.y, x2: b.x, y2: b.y, life: 4, max: 4, color: "#6ee7b7" });
    } else if (!tr.lastChanceUsed) {
      // Every community gets one recovery chance before a collapse, which
      // gives the AI time to build, discover, or receive a later treaty.
      tr.lastChanceUsed = true; tr.food += 6; tr.pop = Math.max(tr.pop, 2.1);
      this.pushLog(tr, "🏕️ The tribe shares its last supplies and tries again.");
    }
  },
  triggerEvent(forcedType = null) {
    const types = ["drought", "flood", "migration", "plague", "harvest"];
    const type = forcedType || types[Math.floor(Math.random() * types.length)];
    this.worldEvent = { type, life: 13 };
    const key = { drought: "evDrought", flood: "evFlood", migration: "evMigration", plague: "evPlague", harvest: "evHarvest" }[type];
    this.banner = { text: `🌍 ${t("evEvent")(t(key))}`, color: type === "plague" ? "#f87171" : "#67e8f9", life: 2.8 };
    this.markTimeline("🌍", t(key));
    this.tribes.filter(tr => tr.alive).forEach(tr => {
      const home = this.xy(tr.home);
      this.effects.push({ type, x: home.x, y: home.y, life: 4.5, max: 4.5, color: type === "plague" ? "#7ee787" : type === "drought" ? "#ffd95a" : "#67e8f9" });
      if (type === "plague") tr.sick = Math.max(tr.sick, .8 + tr.pop * .05);
      if (type === "harvest") tr.food += 16 * (tr.policy.id === "food" ? 1.5 : 1);
      if (type === "migration" && tr.policy.id === "cooperate") tr.pop += 3;
      this.pushLog(tr, t("evEvent")(t(key)));
    });
    if (type === "flood") this.applyFlood();
    if (type === "drought") this.applyDrought();
  },
  applyFlood() {
    // Floods start at the river, then spill out to neighboring land. The
    // changed tiles remain blue afterwards, so the world genuinely remembers
    // the event instead of only showing a temporary message.
    const start = this.river[Math.floor(this.river.length * (.22 + Math.random() * .48))] || this.riverSource;
    const changed = new Set([start]);
    let frontier = [start];
    for (let wave = 0; wave < 5; wave++) {
      const next = [];
      frontier.forEach(tile => this.neighbors(tile).forEach(n => {
        if (changed.size >= 68 || changed.has(n) || this.feat[n] === F_WATER) return;
        changed.add(n); next.push(n);
      }));
      frontier = next;
    }
    changed.forEach(tile => {
      this.feat[tile] = F_WATER;
      if (this.build[tile]) this.build[tile] = 0;
    });
    const p = this.xy(start);
    this.worldEvent.origin = p; this.worldEvent.changed = [...changed];
    this.effects.push({ type: "floodSource", x: p.x, y: p.y, life: 5.2, max: 5.2, color: "#67e8f9", label: t("floodFromRiver") });
    this.terrainCache = null;
  },
  applyDrought() {
    // Small ponds can dry up, but the named river remains so the map stays
    // fair and players can see why settling by a river matters.
    const riverSet = new Set(this.river);
    const ponds = [];
    this.feat.forEach((f, i) => { if (f === F_WATER && !riverSet.has(i)) ponds.push(i); });
    ponds.slice(0, Math.min(10, ponds.length)).forEach(i => { if (Math.random() < .55) this.feat[i] = F_NONE; });
    // Drought has lasting consequences: dry trees die and farms/enclosures
    // fail, so preparation and water access matter in later decisions.
    let damage = 0;
    for (let i = 0; i < this.feat.length && damage < 52; i++) {
      if ((this.feat[i] === F_TREE || this.build[i] === 5 || this.build[i] === 6) && Math.random() < .15) {
        if (this.feat[i] === F_TREE) this.feat[i] = F_NONE;
        if (this.build[i] === 5 || this.build[i] === 6) this.build[i] = 0;
        damage++;
      }
    }
    this.terrainCache = null;
  },
  trade() {
    const alive = this.tribes.filter(tr => tr.alive);
    alive.filter(a => a.policy.id === "cooperate" && a.known.has("communication")).forEach(a => {
      const targets = alive.filter(b => b !== a && a.relations[b.idx] === "neutral" && b.known.has("communication") && this.hasContact(a, b));
      const b = targets[Math.floor(Math.random() * targets.length)];
      if (!b) return;
      const aCanDefend = a.known.has("army") || this.countBuild(a, 2) >= 2;
      const bNeedsDefence = b.defendT > 0 || !b.known.has("walls");
      const bCanSupply = b.food > 20;
      const deal = aCanDefend && bNeedsDefence && bCanSupply ? "🛡️ defence ⇄ 🍎 supplies" : a.known.has("medicine") && b.sick > .3 ? "💊 cure ⇄ 🍎 supplies" : "🍎 supplies ⇄ 🤝 safe border";
      this.pushLog(a, `${t("evOffer")(b.name)} ${deal}`);
      // A treaty is only accepted when BOTH sides gain something. This makes
      // cooperation a decision, not a free bonus.
      const useful = (aCanDefend && bNeedsDefence && bCanSupply) || (a.known.has("medicine") && b.sick > .3 && bCanSupply) || (a.food > b.food + 12);
      const chance = useful ? (b.policy.id === "conquest" ? .28 : b.policy.id === "defend" ? .68 : .86) : .08;
      const accepted = Math.random() < chance;
      a.relations[b.idx] = b.relations[a.idx] = accepted ? "allied" : "rejected";
      if (accepted) { a.deals ??= {}; b.deals ??= {}; a.deals[b.idx] = b.deals[a.idx] = deal; }
      const p = this.xy(a.home), q = this.xy(b.home);
      this.effects.push({ type: accepted ? "alliance" : "reject", x: p.x, y: p.y, x2: q.x, y2: q.y, life: 5, max: 5, color: accepted ? "#6ee7b7" : "#fb7185" });
      if (accepted) this.queueMoment("cooperate", `COOPERATION · ${a.name} + ${b.name}`, "#6ee7b7", { left: a.color, right: b.color, deal });
      const noReason = !useful ? "no useful exchange yet" : b.policy.id === "conquest" ? "they prefer to take land themselves" : "they are not ready to trust";
      this.pushLog(a, accepted ? t("evAccept")(b.name) : `${t("evReject")(b.name)} Reason: ${noReason}.`);
      this.pushLog(b, accepted ? t("evAccept")(a.name) : `${t("evReject")(a.name)} Reason: ${noReason}.`);
    });
    alive.forEach(a => alive.forEach(b => {
      if (a.idx >= b.idx || a.relations[b.idx] !== "allied") return;
      // Treaty terms have a visible, measurable give-and-take effect.
      if (a.deals?.[b.idx]?.includes("defence") && b.food >= 5) { b.food -= 5; a.food += 5; b.allyDefence = Math.max(b.allyDefence || 0, 8); this.pushLog(b, `🍎 Supplies sent to ${a.name}; 🛡️ defence received.`); }
      if (a.known.has("medicine") && a.sick < 1 && b.sick > .3) { b.sick = Math.max(0, b.sick - 1.25); this.pushLog(a, t("evTrade")(b.name)); this.pushLog(b, t("evCured")); }
      if (b.known.has("medicine") && b.sick < 1 && a.sick > .3) { a.sick = Math.max(0, a.sick - 1.25); this.pushLog(b, t("evTrade")(a.name)); this.pushLog(a, t("evCured")); }
      if (a.food > b.food + 20) { a.food -= 6; b.food += 6; this.pushLog(a, t("evTrade")(b.name)); }
      if (b.food > a.food + 20) { b.food -= 6; a.food += 6; this.pushLog(b, t("evTrade")(a.name)); }
    }));
    // Risky AI choices: a desperate aggressive tribe may rob, while a smart
    // tribe can send a disguised scout to learn before choosing a war.
    alive.forEach(a => {
      const targets = alive.filter(b => b !== a && a.relations[b.idx] !== "allied");
      const b = targets[Math.floor(Math.random() * targets.length)];
      if (!b) return;
      const p = this.xy(a.home), q = this.xy(b.home);
      if (a.food < 8 && a.aggro >= 3 && b.food > 12 && Math.random() < .42) {
        const stolen = Math.min(7, b.food); b.food -= stolen; a.food += stolen;
        this.pushLog(a, `🕵️ Robbed ${stolen} food from ${b.name}.`, "aggro"); this.pushLog(b, `🚨 Robbery! Food was taken by ${a.name}.`, "health");
        this.effects.push({ type: "robbery", x: p.x, y: p.y, x2: q.x, y2: q.y, life: 3.5, max: 3.5, color: "#f59e0b" });
        this.queueMoment("robbery", `ROBBERY · ${a.name} stole from ${b.name}`, "#f59e0b", { left: a.color, right: b.color, stolen });
      } else if (a.int >= 3 && Math.random() < .30) {
        this.pushLog(a, `🥸 Disguised scout learned ${b.name}'s defence: ${this.countBuild(b, 2)} walls.`, "int");
        this.effects.push({ type: "spy", x: p.x, y: p.y, x2: q.x, y2: q.y, life: 3.5, max: 3.5, color: "#a78bfa" });
      }
    });
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

    // When an attack lands, protect the settlement before counterattacking.
    if (tr.defendT > 0 && tr.known.has("walls") && tr.stone >= 3) {
      const contact = this.ownedTiles(tr, i => !this.build[i] && this.feat[i] !== F_WATER && this.neighbors(i).some(n => this.owner[n] >= 0 && this.owner[n] !== tr.idx));
      const safe = (contact.length ? contact : this.ownedTiles(tr, i => !this.build[i] && this.feat[i] !== F_WATER)).sort((a, b) => {
        const pa = this.xy(a), pb = this.xy(b), h = this.xy(tr.home);
        return Math.hypot(pa.x - h.x, pa.y - h.y) - Math.hypot(pb.x - h.x, pb.y - h.y);
      });
      if (safe.length) return { type: JOB_BUILD, build: 2, tile: safe[Math.floor(Math.random() * Math.min(3, safe.length))], dur: 2.1 };
    }

    // Being behind the front-runner is itself a reason to pick up a spear.
    const behindLeader = this.leaderIdx !== undefined && this.leaderIdx !== -1 &&
      this.leaderIdx !== tr.idx && this.scoreOf(tr).total < this.leaderScore * 0.85;
    const urge = cv("fightUrge", tr.aggro)
      * (tr.policy.id === "conquest" ? 1.5 : tr.policy.id === "cooperate" ? .45 : 1)
      * (behindLeader ? 1.8 : 1);
    if ((war || tr.policy.id === "conquest" || tr.aggro >= 3) && Math.random() < urge) {
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
      const rocks = this.ownedTiles(tr, i => this.feat[i] === F_ROCK || this.feat[i] === F_IRON);
      if (rocks.length && Math.random() < 0.35) return { type: JOB_ROCK, tile: rocks[Math.floor(Math.random() * rocks.length)], dur: 2.8 };
    }
    const wantHut = tr.known.has("huts") && tr.wood >= 3 && this.countBuild(tr, 1) < Math.floor(tr.pop / 6);
    const wantWall = tr.known.has("walls") && tr.stone >= 3 && this.countBuild(tr, 2) < (tr.policy.id === "defend" ? 9 : 6);
    const wantClinic = tr.known.has("medicine") && tr.wood >= 2 && tr.stone >= 2 && this.countBuild(tr, 3) < 2 && (tr.sick > .4 || tr.policy.id === "research");
    const animals = this.ownedTiles(tr, i => !this.build[i] && this.feat[i] === F_ANIMAL);
    const wantEnclosure = tr.known.has("animals") && tr.wood >= 2 && animals.length && this.countBuild(tr, 5) < 3;
    const wantFarm = tr.known.has("farming") && tr.wood >= 1 && this.countBuild(tr, 6) < Math.max(1, Math.floor(tr.pop / 12));
    const wantBarracks = tr.known.has("army") && tr.wood >= 3 && tr.stone >= 4 && this.countBuild(tr, 7) < 1;
    if (wantHut || wantWall || wantClinic || wantEnclosure || wantFarm || wantBarracks) {
      const buildKind = wantEnclosure ? 5 : wantClinic ? 3 : wantBarracks ? 7 : wantHut ? 1 : wantWall ? 2 : 6;
      let spots = wantEnclosure ? animals : this.ownedTiles(tr, i => !this.build[i] && this.feat[i] === F_NONE);
      if (buildKind === 2) {
        const border = spots.filter(i => this.neighbors(i).some(n => this.owner[n] >= 0 && this.owner[n] !== tr.idx));
        if (border.length) spots = border;
      }
      if (spots.length) return { type: JOB_BUILD, build: buildKind, tile: spots[Math.floor(Math.random() * spots.length)], dur: wantEnclosure ? 3 : wantClinic ? 3.5 : wantBarracks ? 4 : 2.4 };
    }
    const fields = this.ownedTiles(tr, i => this.feat[i] !== F_WATER);
    if (fields.length) return { type: JOB_FARM, tile: fields[Math.floor(Math.random() * fields.length)], dur: 2 };
    return null;
  },
  // Did this tribe just take the last of a resource it still needs?
  noteExhausted(tr) {
    if (!tr.stats.outOfWood && tr.known.has("wood") && !this.ownedTiles(tr, i => this.feat[i] === F_TREE).length) {
      tr.stats.outOfWood = true; this.pushLog(tr, t("evNoTrees"), "work");
    }
    if (!tr.stats.outOfStone && tr.known.has("stone") && !this.ownedTiles(tr, i => this.feat[i] === F_ROCK).length) {
      tr.stats.outOfStone = true; this.pushLog(tr, t("evNoStone"), "work");
    }
  },
  finishJob(tr, job, E) {
    if (job.type === JOB_TREE) {
      tr.wood += 1;
      this.feat[job.tile] = F_NONE; this.terrainCache = null;
      if (!tr.jobLogged.chop) { tr.jobLogged.chop = 1; this.pushLog(tr, t("evChop"), "work"); }
      this.noteExhausted(tr);
    } else if (job.type === JOB_ROCK) {
      tr.stone += 1;
      if (this.feat[job.tile] === F_IRON) tr.iron += 1;
      this.feat[job.tile] = F_NONE; this.terrainCache = null;
      if (!tr.jobLogged.mine) { tr.jobLogged.mine = 1; this.pushLog(tr, t("evMine"), "work"); }
      this.noteExhausted(tr);
    } else if (job.type === JOB_BUILD) {
      if (!this.build[job.tile] && this.owner[job.tile] === tr.idx) {
        if (job.build === 1 && tr.wood >= 3) {
          tr.wood -= 3; this.build[job.tile] = 1; this.pushLog(tr, t("evBuildHut"), "int");
        } else if (job.build === 2 && tr.stone >= 3) {
          tr.stone -= 3; this.build[job.tile] = 2; this.pushLog(tr, t("evBuildWall"), "int");
        } else if (job.build === 3 && tr.wood >= 2 && tr.stone >= 2) {
          tr.wood -= 2; tr.stone -= 2; this.build[job.tile] = 3; this.pushLog(tr, t("evClinic"), "int");
        } else if (job.build === 5 && tr.wood >= 2) {
          tr.wood -= 2; this.build[job.tile] = 5; this.pushLog(tr, "🐑 Built an animal enclosure.", "work");
        } else if (job.build === 6 && tr.wood >= 1) {
          tr.wood -= 1; this.build[job.tile] = 6; this.pushLog(tr, "🌾 Built a farm.", "work");
        } else if (job.build === 7 && tr.wood >= 3 && tr.stone >= 4) {
          tr.wood -= 3; tr.stone -= 4; this.build[job.tile] = 7; this.pushLog(tr, "🛡️ Built an army base.", "work");
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
          const nx = w.x + (dx / d) * speed * dt, ny = w.y + (dy / d) * speed * dt;
          const tile = this.idx(Math.max(0, Math.min(COLS - 1, Math.floor(nx))), Math.max(0, Math.min(ROWS - 1, Math.floor(ny))));
          if (this.feat[tile] === F_WATER && !tr.known.has("boats") && this.build[tile] !== 4) {
            // No invisible swimming: without a boat or bridge, turn back.
            w.state = "toHome";
          } else {
            w.x = nx; w.y = ny; w.boat = this.feat[tile] === F_WATER;
          }
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
    this.refreshLeader(dt);
    this.eventT -= dt;
    if (this.autoEvents && this.eventT <= 0) { this.triggerEvent(); this.eventT = 23 + Math.random() * 18; }
    if (this.worldEvent && (this.worldEvent.life -= dt) <= 0) this.worldEvent = null;
    this.tradeT -= dt;
    if (this.tradeT <= 0) { this.trade(); this.tradeT = 11; }
    if (this.announcementQueue.length && !this.effects.some(e => e.type === "tech")) this.effects.push(this.announcementQueue.shift());
    this.tribes.forEach((tr) => {
      if (!tr.alive) return;
      tr.defendT = Math.max(0, (tr.defendT || 0) - dt);
      tr.allyDefence = Math.max(0, (tr.allyDefence || 0) - dt);
      tr.aidT = Math.max(0, (tr.aidT || 0) - dt);
      const land = this.landOf(tr);

      // resource discovery from newly owned tiles
      for (let i = 0; i < this.owner.length; i++) {
        if (this.owner[i] !== tr.idx) continue;
        const f = this.feat[i];
        if (f === F_NONE || tr.seen.has(f)) continue;
        tr.seen.add(f);
        this.pushLog(tr, f === F_TREE ? t("evFoundTree") : f === F_ROCK ? t("evFoundRock") : f === F_GEM ? t("evFoundGem") : f === F_ANIMAL ? t("evFoundAnimal") : f === F_IRON ? t("evFoundIron") : t("evFoundWater"));
        if (f === F_GEM) { const p = this.xy(i); this.effects.push({ type: "gem", x: p.x, y: p.y, life: 4, max: 4, color: "#c084fc" }); }
      }
      this.tryDiscover(tr, dt);
      this.evolve(tr);

      this.updateWorkers(tr, dt, E);

      // --- water: a civilization without drinking water is in real trouble.
      // In the Ice Age the water is frozen solid, so it only counts once the
      // tribe has discovered fire to melt it.
      const water = this.hasWater(tr, E);
      if (!water && !tr.thirstLogged) { tr.thirstLogged = true; this.pushLog(tr, t("evThirst"), "int"); }
      if (water && tr.thirstLogged) { tr.thirstLogged = false; this.pushLog(tr, t("evWaterFound"), "int"); }
      const thirst = water ? 1 : 1.85;
      if (!water) tr.stats.thirstySecs += dt;
      if (tr.activeFrac < 0.4) tr.stats.idleSecs += dt;
      if (tr.pop > tr.stats.peakPop) tr.stats.peakPop = tr.pop;

      // Food scales with population, but is gated by the fraction of workers
      // actually doing something — so visible idling directly starves them.
      const workMul = cv("output", tr.work) * tr.boost;
      const gemBoost = this.ownsFeature(tr, F_GEM) ? 1.12 : 1;
      const animalBonus = 1 + this.countBuild(tr, 5) * .18;
      const fishingBonus = tr.known.has("fishing") && this.hasWater(tr, E) ? 1.2 : 1;
      const farmBonus = (tr.known.has("farming") ? 1.6 : 0.55) * (tr.policy.id === "food" ? 1.32 : 1);   // no farming = foraging only
      const toolBonus = tr.known.has("tools") ? 1.3 : 1;
      const fireBonus = tr.known.has("fire") ? 1.25 : 1;
      const effort = 0.25 + tr.activeFrac * 0.75;

      const drought = this.worldEvent?.type === "drought" ? 0.62 : 1;
      const fieldBonus = 1 + this.countBuild(tr, 6) * .08;
      tr.food += tr.pop * workMul * E.food * farmBonus * toolBonus * fireBonus * effort * drought * dt * 1.35 * gemBoost * animalBonus * fishingBonus * fieldBonus;
      tr.food -= tr.pop * 0.42 * cv("upkeep", tr.health) * thirst * tr.elite * dt;
      if (this.worldEvent?.type === "flood" && Math.random() < dt * .012) tr.food = Math.max(0, tr.food - 2);
      this.updateIllness(tr, dt, water);

      if (tr.activeFrac < 0.35 && performance.now() - tr.idleLogged > 12000) {
        tr.idleLogged = performance.now();
        this.pushLog(tr, t("evIdle"), "work");
      }

      // Storage limit: without granaries most of a huge harvest simply rots,
      // so a big elite population cannot coast on an endless food pile.
      const store = 60 + this.countBuild(tr, 1) * 26 + (tr.known.has("farming") ? 40 : 0);
      if (tr.food > store) {
        const spoiled = tr.food - store;
        tr.food = store;
        tr.stats.spoiled = (tr.stats.spoiled || 0) + spoiled;
        if (!tr.spoilLogged && spoiled > 8) { tr.spoilLogged = true; this.pushLog(tr, t("evSpoil"), "int"); }
      }
      if (tr.food < 0) {
        this.requestEmergencyAid(tr);
        tr.food = 0;
        const lost = dt * 1.3 * cv("upkeep", tr.health);
        tr.stats.famine += Math.min(tr.pop, lost);
        tr.pop = Math.max(0, tr.pop - lost);
        tr.lastThreat = "starvation";
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
        tr.pop += 1 * E.growth * cv("growth", tr.health) * (water ? 1 : 0.45) * (tr.policy.id === "food" ? 1.22 : 1) * (tr.sick > 1 ? .45 : 1);
        tr.food -= tr.pop * 0.35;
        if (Math.floor(tr.pop / 15) > Math.floor(tr.lastPopLog / 15)) { this.pushLog(tr, t("evGrow")(Math.floor(tr.pop))); tr.lastPopLog = tr.pop; }
      }

      // Expansion still scales with effort, so a lazy tribe also spreads slowly.
      tr.expandT += dt;
      // A wheel is only an idea. Fast expansion arrives after the tribe also
      // learns animal transport and can visibly move people and supplies.
      const wheel = tr.known.has("transport") ? 0.54 : tr.known.has("wheel") ? 0.86 : 1;
      if (tr.pop >= 4 && tr.expandT > Math.max(0.3, (1.7 - cv("output", tr.work) * 0.5 - tr.pop * 0.01) * wheel)) {
        tr.expandT = 0;
        const claimed = this.claimFree(tr);
        if (claimed !== false) {
          tr.expandCount = (tr.expandCount || 0) + 1;
          if (tr.known.has("transport")) {
            const p = this.xy(tr.home), q = this.xy(claimed);
            this.effects.push({ type: "travel", x: p.x, y: p.y, x2: q.x, y2: q.y, life: 3.5, max: 3.5, color: tr.color });
            if (!tr.wheelTravelLogged || performance.now() - tr.wheelTravelLogged > 9000) { this.pushLog(tr, t("wheelTravel"), "work"); tr.wheelTravelLogged = performance.now(); }
            if (Math.random() < .38) this.claimFree(tr);
          }
          if (tr.expandCount % 12 === 0) this.pushLog(tr, t("evExpand"), "work");
          // The final chapter is an exploration rush: by the result screen,
          // students can read a mostly explored world instead of tiny islands.
          if (this.simT > SIM_DURATION * .68) for (let n = 0; n < 6; n++) this.claimFree(tr);
        }
      }
      // Building and fighting are now carried out by the workers themselves
      // (see updateWorkers/finishJob) so what you see on the map is what
      // actually drives the simulation.

      // A short visible danger phase makes a collapse understandable instead
      // of looking like a tribe vanished on the next frame.
      if (tr.pop <= 1.1) {
        tr.collapseT += dt;
        if (!tr.collapseWarned) { tr.collapseWarned = true; this.pushLog(tr, t("evCollapse"), "health"); }
        if (tr.collapseT > 2.4) {
          tr.alive = false;
          const key = tr.lastThreat === "illness" ? "evLostIllness" : "evLostStarve";
          this.pushLog(tr, t(key), tr.lastThreat === "illness" ? "health" : "work"); sfx.bad();
          const hp = this.xy(tr.home); this.effects.push({ type: "death", x: hp.x, y: hp.y, life: 5, max: 5, color: tr.color });
          this.queueMoment("death", `${tr.name} COULD NOT CONTINUE`, tr.color);
        }
      } else { tr.collapseT = 0; tr.collapseWarned = false; }
    });

    this.tribes.forEach(tr => {
      if (tr.alive && this.owner[tr.home] !== tr.idx) {
        const conqueror = this.tribes[this.owner[tr.home]];
        tr.alive = false; tr.lastThreat = "conquest"; this.pushLog(tr, t("evLostConquest"), "aggro");
        if (conqueror && !conqueror.defeated.includes(tr.name)) conqueror.defeated.push(tr.name);
        this.banner = { text: t("kingFell")(tr.name), color: tr.color, life: 2.2 };
        const hp = this.xy(tr.home); this.effects.push({ type: "death", x: hp.x, y: hp.y, life: 5, max: 5, color: tr.color });
        this.queueMoment("death", `${tr.name} CAPITAL FELL`, tr.color);
      }
    });
    if (war && !this.warAnnounced) {
      this.warAnnounced = true;
      this.banner = { text: t("warBegins"), color: "#ff6b6b", life: 2.6 };
      sfx.bad();
    }
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
        if (this.feat[n] === F_WATER && !tr.known.has("boats") && !tr.known.has("bridge")) continue;
        frontier.push({ tile: n, from: i }); break;
      }
    }
    if (!frontier.length) return false;
    const chosen = frontier[Math.floor(Math.random() * frontier.length)], tile = chosen.tile;
    this.owner[tile] = tr.idx;
    if (this.feat[tile] === F_WATER && !tr.known.has("boats") && tr.known.has("bridge") && tr.wood >= 1 && tr.stone >= 1) {
      tr.wood--; tr.stone--; this.build[tile] = 4;
    }
    if (this.feat[tile] === F_WATER && tr.known.has("boats")) {
      const a = this.xy(chosen.from), b = this.xy(tile);
      this.effects.push({ type: "boatTravel", x: a.x, y: a.y, x2: b.x, y2: b.y, life: 3, max: 3, color: tr.color });
    }
    return tile;
  },
  // Whoever is ahead becomes everyone's problem. Recomputed about once a
  // sim-second rather than every step, since scoring walks the whole map.
  refreshLeader(dt) {
    this.leaderT = (this.leaderT || 0) + dt;
    if (this.leaderT < 1) return;
    this.leaderT = 0;
    let best = -1, idx = -1;
    this.tribes.forEach(tr => { if (!tr.alive) return; const v = this.scoreOf(tr).total; if (v > best) { best = v; idx = tr.idx; } });
    this.leaderIdx = idx; this.leaderScore = best;
    // A runaway leader unites everyone else: the rivals ally against them.
    const rivals = this.tribes.filter(x => x.alive && x.idx !== idx);
    if (rivals.length >= 2 && best > 0) {
      const second = Math.max(...rivals.map(r => this.scoreOf(r).total));
      if (second < best * 0.72 && rivals.some(r => r.relations[rivals.find(o => o !== r).idx] !== "allied")) {
        rivals.forEach(a => rivals.forEach(b => { if (a !== b) a.relations[b.idx] = "allied"; }));
        if (!this.coalitionLogged) {
          this.coalitionLogged = true;
          const L = this.tribes[idx];
          rivals.forEach(r => this.pushLog(r, t("evCoalition")(L.name), "aggro"));
          this.pushLog(L, t("evCoalitionOn")(L.name), "aggro");
          this.banner = { text: t("evCoalition")(L.name), color: "#fb7185", life: 2.6 };
        }
      }
    }
    const L = this.tribes[idx];
    if (L) {
      L.stats.leaderSecs += 1;
      // Announce the pile-on once, when the leader is clearly in front.
      const others = this.tribes.filter(x => x.alive && x.idx !== idx);
      if (!this.gangLogged && others.length > 1 && this.simT >= CONQUEST_AT &&
          others.every(o => this.scoreOf(o).total < best * 0.85)) {
        this.gangLogged = true;
        others.forEach(o => this.pushLog(o, t("evGangUp")(L.name), "aggro"));
        this.pushLog(L, t("evGangUp")(L.name), "aggro");
        this.banner = { text: t("evGangUp")(L.name), color: L.color, life: 2.4 };
      }
    }
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
    // Gang up: if someone else is out in front, most attacks go their way.
    const lead = this.leaderIdx;
    let pool = targets;
    if (lead !== undefined && lead !== -1 && lead !== tr.idx) {
      const onLeader = targets.filter(i => this.owner[i] === lead);
      if (onLeader.length && Math.random() < 0.75) pool = onLeader;
    }
    const tile = pool[Math.floor(Math.random() * pool.length)];
    const def = this.tribes[this.owner[tile]];
    def.stats.attacksTaken++;
    def.recentAtk = (def.recentAtk || []).filter(a => this.simT - a.t < 12);
    if (!def.recentAtk.some(a => a.by === tr.idx)) def.recentAtk.push({ by: tr.idx, t: this.simT });
    else def.recentAtk.find(a => a.by === tr.idx).t = this.simT;
    const fronts = def.recentAtk.length;
    const metal = tr.known.has("metal") ? 1.3 : 1, army = tr.known.has("army") ? (this.countBuild(tr, 7) ? 1.6 : 1.12) : 1;
    const wall = this.build[tile] === 2 ? 1.5 : 1;
    const atk = tr.pop * cv("attack", tr.aggro) * 0.3 * tr.morale * E.strength * metal * army;
    const dfn = def.pop * (0.35 + def.health * 0.18) * def.morale * wall * (def.known.has("walls") ? 1.15 : 1) * (def.allyDefence > 0 ? 1.3 : 1) * (fronts >= 2 ? 0.68 : 1);
    if (!tr.attackLogged || performance.now() - tr.attackLogged > 9000) {
      const why = tr.policy.id === "conquest" ? "expand territory" : tr.food < tr.pop * .7 ? "need food" : tr.known.has("army") ? "army is ready" : "protect the border";
      this.pushLog(tr, t("evAttack")(def.name)); this.pushLog(tr, t("evAttackWhy")(why)); tr.attackLogged = performance.now();
    }
    def.defendT = 9;
    const bp = this.xy(tile);
    this.battles.push({ x: bp.x, y: bp.y, life: 3.1, max: 3.1, attacker: tr.color, defender: def.color, wall: this.build[tile] === 2 });
    const attackWon = atk > dfn * (0.75 + Math.random() * 0.5);
    this.queueMoment("fight", `BATTLE · ${tr.name} VS ${def.name}`, "#fb7185", {
      left: tr.color, right: def.color, winner: attackWon ? "left" : "right",
      wall: this.build[tile] === 2, result: attackWon ? "LAND CAPTURED" : "DEFENCE HELD",
    });
    if (attackWon) {
      this.owner[tile] = tr.idx; this.build[tile] = 0; tr.captures++;
      // Being everyone's target grinds morale down over time.
      const pileOn = def.idx === this.leaderIdx ? 0.09 : 0.05;
      def.morale = Math.max(0.28, def.morale - pileOn);
      def.pop = Math.max(0, def.pop - 0.35);
      tr.pop = Math.max(0, tr.pop - 0.22 * cv("attack", tr.aggro));
      if (!tr.capLogged || performance.now() - tr.capLogged > 7000) { this.pushLog(tr, t("evCapture")(def.name)); tr.capLogged = performance.now(); }
      if (this.speed <= 2) sfx.battle();
      return true;
    }
    // A failed assault costs real people, so constant aggression bleeds.
    tr.pop = Math.max(0, tr.pop - 0.30 * cv("attack", tr.aggro));
    tr.morale = Math.max(0.3, tr.morale - 0.02);
    return false;
  },

  /* One plain sentence per tribe explaining how it ended up where it did.
     Checked in priority order so the most decisive cause is the one shown. */
  storyFor(r, rank) {
    const tr = r.tr, st = tr.stats;
    if (rank === 0) return t("stTop")(tr.known.size, this.countBuild(tr, 1));
    if (!tr.alive) {
      const killer = this.tribes.find(o => o.defeated && o.defeated.includes(tr.name));
      if (killer) return t("stConquered")(killer.name);
      return st.famine >= 1 ? t("stStarved")(Math.round(st.famine)) : t("stOverrun");
    }
    if (st.famine > tr.pop * 0.5 && st.famine > 12) return t("stStarved")(Math.round(st.famine));
    if (st.thirstySecs > 25) return t("stThirsty");
    if (tr.elite > 1.2 && st.famine > 6) return t("stElite");
    if (st.outOfWood && tr.known.has("huts")) return t("stNoWood");
    if (st.outOfStone && tr.known.has("walls")) return t("stNoStone");
    if (st.leaderSecs > 25 && st.attacksTaken > 12) return t("stGanged");
    if (tr.known.size <= 3) return t("stIgnorant")(tr.known.size);
    if (st.idleSecs > 40) return t("stIdle");
    return t("stSteady");
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
    const runner = ranked[1];
    const discoveries = DISCOVERIES.filter(d => win.tr.known.has(d.id)).map(d => `${d.emoji} ${discName(d)}`);
    const story = [];
    if (win.sc.land > runner.sc.land) story.push(lang === "bm" ? `Menguasai ${win.sc.land - runner.sc.land} petak tanah lebih banyak daripada tempat kedua.` : `Controlled ${win.sc.land - runner.sc.land} more land tiles than second place.`);
    if (win.tr.captures) story.push(lang === "bm" ? `Menawan ${win.tr.captures} petak musuh dalam pertempuran.` : `Captured ${win.tr.captures} enemy tiles in battle.`);
    if (win.tr.defeated.length) story.push(lang === "bm" ? `Menjatuhkan ${win.tr.defeated.join(", ")}.` : `Defeated ${win.tr.defeated.join(", ")}.`);
    else story.push(lang === "bm" ? `Tidak menawan ibu kota puak lain; kemenangan datang daripada perkembangan dan pengetahuan.` : `Did not conquer another capital; the win came from growth and knowledge.`);
    if (win.sc.know > runner.sc.know) story.push(lang === "bm" ? `Mempunyai kelebihan pengetahuan sebanyak ${win.sc.know - runner.sc.know} mata.` : `Held a ${win.sc.know - runner.sc.know}-point knowledge advantage.`);
    const conquestResult = win.tr.defeated.length === this.tribes.length - 1 ? (lang === "bm" ? "Ya — semua puak lain telah ditawan." : "Yes — every other tribe was conquered.") : (lang === "bm" ? `Tidak — ${win.tr.defeated.length} daripada ${this.tribes.length - 1} puak ditawan.` : `No — ${win.tr.defeated.length} of ${this.tribes.length - 1} rival tribes were conquered.`);
    const node = el(`<div class="panel result-panel">
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
          <span>⬆️ ${t("reportStage")}</span><b>${this.stageTitle(win.tr.stage)}</b>
        </div>
        <div class="why-main">▲ ${t(contrib.k)}</div>
      </div>
      <div class="victory-story">
        <b>${lang === "bm" ? "CERITA KEMENANGAN" : "VICTORY STORY"}</b>
        ${story.map(s => `<p>✓ ${s}</p>`).join("")}
        <p><strong>${lang === "bm" ? "Menawan semua puak?" : "Conquered every tribe?"}</strong> ${conquestResult}</p>
        <p><strong>${lang === "bm" ? "Penemuan penting:" : "Important discoveries:"}</strong> ${discoveries.slice(-10).join(" · ") || "—"}</p>
      </div>
      <div class="story-box">
        <div class="story-title">${t("storyTitle")}</div>
        ${ranked.map((r, i) => `<div class="story-row" style="--c:${r.tr.color}">
          <b>${i + 1}. ${r.tr.name}</b> — ${this.storyFor(r, i)}</div>`).join("")}
      </div>
      <div class="why-box intelligence-box">
        <div class="why-title">🧠 ${t("reportTitle")}</div>
        <div class="why-grid">
          <span>${t("reportPolicy")}</span><b>${win.tr.policy.emoji} ${t(win.tr.policy.key)}</b>
          <span>${t("reportSmart")}</span><b>${this.intelligenceReport(win.tr).smart}</b>
          <span>${t("reportIll")}</span><b>${Math.ceil(win.tr.illnessLoss)}</b>
          <span>${t("reportTech")}</span><b>${this.intelligenceReport(win.tr).tech}</b>
        </div>
        <div class="why-main">${t("reportLuck")}: ${this.intelligenceReport(win.tr).risk}</div>
      </div>
      <div class="student-summary">
        ${ranked.map(r => {
          const note = this.choiceFeedback(r.tr);
          return `<div class="summary-row" style="--c:${r.tr.color}">
            <b>${r.tr.name} · ${r.tr.policy.emoji} ${t(r.tr.policy.key)}</b>
            <span><i>✓</i> ${note.good} <i>→</i> ${note.try}</span>
          </div>`;
        }).join("")}
      </div>
      <div class="civ-rank">${ranked.map((r, i) => `
        <div class="civ-rank-row" style="--c:${r.tr.color}">
          <span>${i + 1}. ${r.tr.name} · ${this.stageTitle(r.tr.stage)} · ${r.tr.policy.emoji}</span>
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
    if (this.running && !this.paused) {
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
    // Visual story moments use real screen time, not simulation time. At
    // ×10 speed an attack/cooperation/death animation still remains visible
    // for its full duration instead of vanishing ten times faster.
    if (!this.paused) {
      this.battles = this.battles.filter(b => (b.life -= dt) > 0);
      this.effects = this.effects.filter(e => (e.life -= dt) > 0);
      this.toasts = this.toasts.filter(x => (x.life -= dt) > 0);
      if (this.banner && (this.banner.life -= dt) <= 0) this.banner = null;
      if (!this.currentMoment && this.momentQueue.length) this.currentMoment = this.momentQueue.shift();
      if (this.currentMoment && (this.currentMoment.life -= dt) <= 0) this.currentMoment = null;
    }
    this.draw();
  },

  mapRect() {
    const panelW = this.logNode ? this.logNode.getBoundingClientRect().width : 0;
    const left = panelW + 14, top = 66, right = 14, bottom = 78;
    const availW = innerWidth - left - right, availH = innerHeight - top - bottom;
    const cell = Math.max(4, Math.floor(Math.min(availW / COLS, availH / ROWS)));
    const w = cell * COLS, h = cell * ROWS;
    // Snap the whole map to physical pixels. Fractional canvas coordinates
    // soften a pixel sprite even when image smoothing is disabled.
    return { cell, w, h, ox: Math.round(left + (availW - w) / 2), oy: Math.round(top + (availH - h) / 2) };
  },
  buildTerrain(cell) {
    const E = ERAS[this.era];
    const c = document.createElement("canvas");
    c.width = COLS * cell; c.height = ROWS * cell;
    const g = c.getContext("2d");
    // Terrain is cached, so we can afford richer tile art without putting
    // extra work into the simulation's animation loop.
    g.imageSmoothingEnabled = false;
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
      const i = y * COLS + x, f = this.feat[i];
      const shade = (x + y) % 2 === 0 ? E.ground : E.alt;
      const px = x * cell, py = y * cell;
      // Stable, per-tile variation creates a hand-drawn pixel map while
      // keeping the same world readable for the entire simulation.
      const seed = ((x * 73856093) ^ (y * 19349663) ^ (i * 83492791)) >>> 0;
      const dot = Math.max(1, Math.floor(cell * 0.11));
      const detailed = cell >= 7;
      g.fillStyle = f === F_WATER ? E.water : shade;
      g.fillRect(px, py, cell, cell);
      // A one-pixel lower edge gives every tile depth at any map scale.
      g.fillStyle = "rgba(0,0,0,.10)";
      g.fillRect(px, py + cell - Math.max(1, Math.floor(cell * .08)), cell, Math.max(1, Math.floor(cell * .08)));
      if (detailed && f !== F_WATER) {
        g.fillStyle = "rgba(255,255,255,.11)";
        g.fillRect(px + ((seed >>> 3) % Math.max(1, cell - dot)), py + ((seed >>> 9) % Math.max(1, cell - dot)), dot, dot);
        g.fillStyle = "rgba(0,0,0,.11)";
        g.fillRect(px + ((seed >>> 15) % Math.max(1, cell - dot)), py + ((seed >>> 21) % Math.max(1, cell - dot)), dot, dot);
        // Era-specific micro details make the same simulation rules look like
        // genuinely different worlds, not just palette swaps.
        if (this.era === "forest") {
          g.fillStyle = "rgba(175,235,110,.30)";
          g.fillRect(px + cell * .17, py + cell * .67, dot, Math.max(1, cell * .17));
          g.fillRect(px + cell * .23, py + cell * .61, dot, Math.max(1, cell * .23));
        } else if (this.era === "beach") {
          g.fillStyle = "rgba(120,82,38,.22)";
          g.fillRect(px + cell * .22, py + cell * .28, dot, dot);
          g.fillRect(px + cell * .68, py + cell * .68, dot, dot);
        } else if (this.era === "cave") {
          g.fillStyle = "rgba(25,20,18,.30)";
          g.fillRect(px + cell * .24, py + cell * .31, dot, Math.max(1, cell * .26));
          g.fillRect(px + cell * .24, py + cell * .51, Math.max(1, cell * .30), dot);
        } else if (this.era === "ice") {
          g.fillStyle = "rgba(242,252,255,.25)";
          g.fillRect(px + cell * .18, py + cell * .24, Math.max(1, cell * .29), dot);
        }
      }
      if (f === F_TREE) {
        // Tree shadow, trunk, two canopy shades and a light leaf pixel.
        g.fillStyle = "rgba(0,0,0,.20)";
        g.fillRect(px + cell * .21, py + cell * .76, cell * .62, Math.max(1, cell * .12));
        g.fillStyle = "#74451f";
        g.fillRect(px + cell * .43, py + cell * .53, Math.max(1, cell * .16), cell * .34);
        g.fillStyle = E.tree;
        g.fillRect(px + cell * .24, py + cell * .36, cell * .56, cell * .30);
        g.fillRect(px + cell * .34, py + cell * .17, cell * .36, cell * .55);
        g.fillStyle = E.treeDot;
        g.fillRect(px + cell * .39, py + cell * .24, Math.max(1, cell * .19), Math.max(1, cell * .15));
        if (detailed) {
          g.fillStyle = "rgba(255,255,255,.16)";
          g.fillRect(px + cell * .32, py + cell * .39, dot, dot);
          g.fillStyle = "rgba(0,0,0,.18)";
          g.fillRect(px + cell * .66, py + cell * .56, dot, dot);
        }
      } else if (f === F_ROCK) {
        // Square facets read more clearly than a smooth ellipse at small size.
        g.fillStyle = "rgba(0,0,0,.20)";
        g.fillRect(px + cell * .21, py + cell * .73, cell * .60, Math.max(1, cell * .12));
        g.fillStyle = E.rock;
        g.fillRect(px + cell * .24, py + cell * .48, cell * .56, cell * .26);
        g.fillRect(px + cell * .34, py + cell * .36, cell * .34, cell * .42);
        g.fillStyle = "rgba(255,255,255,.24)";
        g.fillRect(px + cell * .35, py + cell * .44, Math.max(1, cell * .16), Math.max(1, cell * .12));
        g.fillStyle = "rgba(0,0,0,.22)";
        g.fillRect(px + cell * .60, py + cell * .62, Math.max(1, cell * .14), Math.max(1, cell * .12));
      } else if (f === F_GEM) {
        g.fillStyle = "rgba(0,0,0,.28)";
        g.fillRect(px + cell * .22, py + cell * .76, cell * .58, Math.max(1, cell * .1));
        g.fillStyle = "#573a7d";
        g.fillRect(px + cell * .37, py + cell * .46, cell * .28, cell * .30);
        g.fillStyle = "#c084fc";
        g.fillRect(px + cell * .42, py + cell * .20, cell * .18, cell * .56);
        g.fillStyle = "#f5d0fe";
        g.fillRect(px + cell * .45, py + cell * .27, Math.max(1, cell * .09), cell * .18);
      } else if (f === F_ANIMAL) {
        // Wild cows and sheep are a findable resource; only Animal Farming turns them into steady food.
        g.fillStyle = "#f1e1c0";
        g.fillRect(px + cell * .25, py + cell * .48, cell * .42, cell * .25);
        g.fillRect(px + cell * .62, py + cell * .40, cell * .18, cell * .20);
        g.fillStyle = "#5b3c2c";
        g.fillRect(px + cell * .68, py + cell * .46, Math.max(1, cell * .06), Math.max(1, cell * .06));
        g.fillRect(px + cell * .32, py + cell * .68, Math.max(1, cell * .08), cell * .14);
        g.fillRect(px + cell * .58, py + cell * .68, Math.max(1, cell * .08), cell * .14);
      } else if (f === F_IRON) {
        g.fillStyle = "#475569";
        g.fillRect(px + cell * .22, py + cell * .48, cell * .56, cell * .28);
        g.fillRect(px + cell * .34, py + cell * .35, cell * .34, cell * .43);
        g.fillStyle = "#f97316";
        g.fillRect(px + cell * .38, py + cell * .48, cell * .12, cell * .10);
        g.fillRect(px + cell * .58, py + cell * .62, cell * .11, cell * .09);
      } else if (f === F_WATER) {
        // Two offset wave bands avoid a flat blue field. Ice Age additionally
        // gets a pale crack/ice shard pattern.
        g.fillStyle = "rgba(0,0,0,.12)";
        g.fillRect(px, py + cell * .82, cell, Math.max(1, cell * .12));
        g.fillStyle = "rgba(255,255,255,.24)";
        g.fillRect(px + cell * .12, py + cell * .34, cell * .35, Math.max(1, cell * .10));
        g.fillRect(px + cell * .58, py + cell * .60, cell * .26, Math.max(1, cell * .10));
        if (detailed) {
          g.fillStyle = "rgba(255,255,255,.15)";
          g.fillRect(px + ((seed >>> 5) % Math.max(1, cell - dot)), py + ((seed >>> 13) % Math.max(1, cell - dot)), dot, dot);
        }
        if (E.frozen) {
          g.fillStyle = "rgba(235,250,255,.38)";
          g.fillRect(px + cell * .42, py + cell * .16, Math.max(1, cell * .08), cell * .58);
          g.fillRect(px + cell * .28, py + cell * .43, cell * .38, Math.max(1, cell * .08));
        }
        // White coast pixels outline every shore. This gives rivers and lakes
        // a readable shape, especially in the Coast era.
        const edge = Math.max(1, Math.floor(cell * .08));
        g.fillStyle = "rgba(235,252,255,.48)";
        const north = y ? this.feat[(y - 1) * COLS + x] : F_NONE;
        const south = y < ROWS - 1 ? this.feat[(y + 1) * COLS + x] : F_NONE;
        const west = x ? this.feat[y * COLS + x - 1] : F_NONE;
        const east = x < COLS - 1 ? this.feat[y * COLS + x + 1] : F_NONE;
        if (north !== F_WATER) g.fillRect(px + cell * .12, py, cell * .76, edge);
        if (south !== F_WATER) g.fillRect(px + cell * .12, py + cell - edge, cell * .76, edge);
        if (west !== F_WATER) g.fillRect(px, py + cell * .16, edge, cell * .68);
        if (east !== F_WATER) g.fillRect(px + cell - edge, py + cell * .16, edge, cell * .68);
      }
    }
    return c;
  },
  drawBuilding(px, py, cell, type, color) {
    const roof = this.era === "ice" ? "#64748b" : this.era === "cave" ? "#795548" : this.era === "beach" ? "#c46b3c" : "#d9534f";
    const wall = this.era === "ice" ? "#b8d5e5" : this.era === "cave" ? "#8a735d" : this.era === "beach" ? "#d5a869" : "#79471f";
    if (type === 4) {
      // A simple timber bridge is the visible proof that this tribe can cross water.
      ctx.fillStyle = "#4b2c18";
      ctx.fillRect(px, py + cell * .42, cell, cell * .22);
      ctx.fillStyle = "#d59a52";
      ctx.fillRect(px, py + cell * .47, cell, cell * .10);
      for (let x = .12; x < 1; x += .25) { ctx.fillStyle = "#2b180e"; ctx.fillRect(px + cell * x, py + cell * .35, Math.max(1, cell * .07), cell * .35); }
    } else if (type === 1) {
      // Hut: shadow, walls, door, roof, chimney and a little tribal flag.
      ctx.fillStyle = "rgba(0,0,0,.25)";
      ctx.fillRect(px + cell * .18, py + cell * .76, cell * .68, Math.max(1, cell * .12));
      ctx.fillStyle = wall;
      ctx.fillRect(px + cell * .24, py + cell * .47, cell * .52, cell * .31);
      ctx.fillStyle = "#c98b3a";
      ctx.fillRect(px + cell * .31, py + cell * .51, cell * .38, Math.max(1, cell * .09));
      ctx.fillStyle = "#3b2415";
      ctx.fillRect(px + cell * .47, py + cell * .62, cell * .12, cell * .16);
      ctx.fillStyle = roof;
      ctx.fillRect(px + cell * .18, py + cell * .35, cell * .64, cell * .16);
      ctx.fillRect(px + cell * .30, py + cell * .23, cell * .40, cell * .17);
      ctx.fillStyle = "rgba(255,230,170,.35)";
      ctx.fillRect(px + cell * .34, py + cell * .29, cell * .16, Math.max(1, cell * .07));
      if (cell >= 9) {
        ctx.fillStyle = "#5b361e";
        ctx.fillRect(px + cell * .68, py + cell * .20, Math.max(1, cell * .08), cell * .24);
        ctx.fillStyle = color;
        ctx.fillRect(px + cell * .76, py + cell * .18, cell * .12, cell * .12);
        ctx.fillStyle = "rgba(255,244,190,.58)";
        ctx.fillRect(px + cell * .17, py + cell * .59, cell * .10, cell * .09);
      }
    } else if (type === 3) {
      // Clinic: a bright roof and cross make a discovered cure visible on
      // the map, so students can link Medicine to a real survival benefit.
      ctx.fillStyle = "rgba(0,0,0,.25)";
      ctx.fillRect(px + cell * .16, py + cell * .77, cell * .68, Math.max(1, cell * .12));
      ctx.fillStyle = "#e9f5ff";
      ctx.fillRect(px + cell * .22, py + cell * .42, cell * .56, cell * .37);
      ctx.fillStyle = "#d9475d";
      ctx.fillRect(px + cell * .44, py + cell * .48, cell * .12, cell * .25);
      ctx.fillRect(px + cell * .36, py + cell * .56, cell * .28, cell * .10);
      ctx.fillStyle = "#7ac7e6";
      ctx.fillRect(px + cell * .20, py + cell * .30, cell * .60, cell * .15);
      ctx.fillStyle = "#334155";
      ctx.fillRect(px + cell * .48, py + cell * .65, cell * .12, cell * .14);
    } else if (type === 5) {
      // Fence, shed and a tiny animal turn Animal Farming into a readable map story.
      ctx.fillStyle = "#6b3f22";
      ctx.fillRect(px + cell * .12, py + cell * .70, cell * .76, Math.max(1, cell * .08));
      [0.16, .42, .68, .84].forEach(k => ctx.fillRect(px + cell * k, py + cell * .43, Math.max(1, cell * .07), cell * .36));
      ctx.fillStyle = "#b86f35";
      ctx.fillRect(px + cell * .22, py + cell * .36, cell * .24, cell * .22);
      ctx.fillStyle = "#f5e4bd";
      ctx.fillRect(px + cell * .53, py + cell * .52, cell * .20, cell * .13);
      ctx.fillStyle = "#3f2a21";
      ctx.fillRect(px + cell * .69, py + cell * .55, Math.max(1, cell * .05), Math.max(1, cell * .05));
    } else if (type === 6) {
      ctx.fillStyle = "#9b6a2f";
      ctx.fillRect(px + cell * .10, py + cell * .18, cell * .80, cell * .68);
      ctx.fillStyle = "#d8bd45";
      for (let x = .18; x < .9; x += .18) ctx.fillRect(px + cell * x, py + cell * .28, Math.max(1, cell * .06), cell * .48);
      ctx.fillStyle = "#65a30d";
      ctx.fillRect(px + cell * .12, py + cell * .74, cell * .76, Math.max(1, cell * .10));
    } else if (type === 7) {
      ctx.fillStyle = "#475569"; ctx.fillRect(px + cell * .15, py + cell * .35, cell * .70, cell * .48);
      ctx.fillStyle = "#94a3b8";
      [0.16, .41, .66].forEach(k => ctx.fillRect(px + cell * k, py + cell * .23, cell * .18, cell * .22));
      ctx.fillStyle = "#1e293b"; ctx.fillRect(px + cell * .42, py + cell * .58, cell * .17, cell * .25);
      ctx.fillStyle = color; ctx.fillRect(px + cell * .64, py + cell * .18, cell * .22, cell * .14);
    } else {
      // Wall: crenellations, brick seams and a gate make conquered borders
      // feel like an actual defended settlement.
      ctx.fillStyle = "rgba(0,0,0,.24)";
      ctx.fillRect(px + cell * .08, py + cell * .70, cell * .84, Math.max(1, cell * .13));
      ctx.fillStyle = "#77808a";
      ctx.fillRect(px + cell * .10, py + cell * .37, cell * .80, cell * .38);
      ctx.fillStyle = "#aeb8c2";
      [0.12, 0.42, 0.72].forEach(k => ctx.fillRect(px + cell * k, py + cell * .28, cell * .16, cell * .18));
      ctx.fillStyle = "rgba(0,0,0,.25)";
      ctx.fillRect(px + cell * .10, py + cell * .55, cell * .80, Math.max(1, cell * .08));
      ctx.fillRect(px + cell * .38, py + cell * .37, Math.max(1, cell * .08), cell * .38);
      ctx.fillStyle = "#303943";
      ctx.fillRect(px + cell * .49, py + cell * .58, cell * .15, cell * .17);
      if (cell >= 10) { ctx.fillStyle = color; ctx.fillRect(px + cell * .17, py + cell * .42, cell * .12, cell * .10); }
    }
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

    if (w.boat) {
      ctx.fillStyle = "#5b351d"; ctx.fillRect(px - s * 1.4, py + s * .25, s * 2.8, s * .42);
      ctx.fillStyle = "#f8e0a5"; ctx.fillRect(px - s * .12, py - s * 1.25, s * .16, s * 1.55); ctx.fillRect(px, py - s * 1.2, s * .75, s * .75);
      ctx.fillStyle = tr.color; ctx.fillRect(px - s * .35, py - s * .28, s * .7, s * .7);
      ctx.restore(); return;
    }
    if (walking && tr.known.has("transport")) {
      ctx.fillStyle = "#8b5a2b";
      ctx.fillRect(px - s * 1.25, py + s * .15 + bob, s * 2.1, s * .82);
      ctx.fillRect(px + s * .60, py - s * .35 + bob, s * .65, s * .85);
      ctx.fillStyle = "#3d2718";
      ctx.fillRect(px - s * .92, py + s * .78 + bob, s * .28, s * .72);
      ctx.fillRect(px + s * .42, py + s * .78 + bob, s * .28, s * .72);
    }

    if (w.state === "idle") ctx.globalAlpha = 0.55;
    // A tiny but readable pixel citizen: ground shadow, boots, tunic, face,
    // hair and one bright eye. It stays clear even when the map is zoomed out.
    ctx.fillStyle = "rgba(0,0,0,.28)";
    ctx.fillRect(px - s * .68, py + s * .70 + bob, s * 1.36, Math.max(1, s * .22));
    ctx.fillStyle = "#39291f";
    ctx.fillRect(px - s * .52, py + s * .52 + bob, s * .32, s * .28);
    ctx.fillRect(px + s * .20, py + s * .52 + bob, s * .32, s * .28);
    // body/tunic
    ctx.fillStyle = tr.color;
    ctx.fillRect(px - s * 0.5, py - s * 0.6 + bob, s, s * 1.3);
    ctx.fillStyle = "rgba(255,255,255,.28)";
    ctx.fillRect(px - s * .34, py - s * .45 + bob, s * .20, s * .82);
    // head
    ctx.fillStyle = "#ffe8c8";
    ctx.fillRect(px - s * 0.45, py - s * 1.75 + bob, s * 0.9, s * 0.95);
    ctx.fillStyle = "#49301f";
    ctx.fillRect(px - s * .45, py - s * 1.75 + bob, s * .9, s * .24);
    ctx.fillStyle = "#16202c";
    ctx.fillRect(px + s * .13, py - s * 1.34 + bob, Math.max(1, s * .16), Math.max(1, s * .16));
    // Tiny arms and role-coloured headwear help the viewer distinguish a
    // gathering worker from a soldier at a quick glance.
    ctx.fillStyle = "#ffe0bb";
    ctx.fillRect(px - s * .78, py - s * .40 + bob, s * .28, s * .48);
    ctx.fillRect(px + s * .50, py - s * .40 + bob, s * .28, s * .48);
    if (w.job?.type === JOB_FIGHT) {
      ctx.fillStyle = "#c7d2fe";
      ctx.fillRect(px - s * .50, py - s * 1.88 + bob, s, s * .22);
      ctx.fillStyle = "#94a3b8"; ctx.fillRect(px - s * .58, py - s * .72 + bob, s * 1.16, s * .95);
      ctx.fillStyle = "#dbeafe"; ctx.fillRect(px - s * 1.02, py - s * .58 + bob, s * .42, s * .86);
    } else if (w.job?.type === JOB_TREE || w.job?.type === JOB_FARM) {
      ctx.fillStyle = "#d8a34d";
      ctx.fillRect(px - s * .50, py - s * 1.88 + bob, s, s * .22);
    }
    if (tr.stage >= 3) {
      ctx.fillStyle = tr.stage >= 4 ? "#8be9fd" : "#f5d76e";
      ctx.fillRect(px - s * .18, py - s * .13 + bob, s * .36, s * .42);
    }

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
  drawHomeMarker(tr, px, py, cell) {
    const u = Math.max(1, cell * .13), pulse = 1 + Math.sin(performance.now() / 320) * .08;
    ctx.save();
    ctx.translate(px + cell / 2, py + cell / 2);
    ctx.scale(pulse, pulse);
    // Pixel crown/leader marker instead of a platform-dependent emoji.
    ctx.fillStyle = "rgba(0,0,0,.28)";
    ctx.fillRect(-u * 3.1, u * 2.0, u * 6.2, Math.max(1, u));
    ctx.fillStyle = "#ffd95a";
    ctx.fillRect(-u * 2.6, -u * 1.1, u * 5.2, u * 2.7);
    ctx.fillRect(-u * 2.6, -u * 2.4, u * 1.1, u * 1.5);
    ctx.fillRect(-u * .55, -u * 2.8, u * 1.1, u * 1.9);
    ctx.fillRect(u * 1.5, -u * 2.4, u * 1.1, u * 1.5);
    ctx.fillStyle = tr.color;
    ctx.fillRect(-u * 1.8, -u * .22, u * 3.6, u * .58);
    ctx.fillStyle = "#fff5c2";
    ctx.fillRect(-u * .35, -u * .65, u * .7, u * .7);
    // Flag pole and a two-frame flutter derived from time make the capital
    // feel alive without adding another image asset.
    ctx.fillStyle = "#69401d";
    ctx.fillRect(u * 2.35, -u * 3.2, Math.max(1, u * .28), u * 4.2);
    ctx.fillStyle = tr.color;
    ctx.fillRect(u * 2.58, -u * 3.05, u * (Math.sin(performance.now() / 260) > 0 ? 1.55 : 1.15), u * .85);
    ctx.restore();
  },
  drawLivingTerrain(ox, oy, cell) {
    // Only a few tiny wave pixels animate each frame. The static terrain is
    // still cached, so this gives life to the world without costing frame rate.
    if (cell < 7) return;
    const phase = Math.floor(performance.now() / 220) % 3;
    const wave = Math.max(1, Math.floor(cell * .11));
    ctx.fillStyle = "rgba(235,252,255,.30)";
    for (let i = phase; i < this.feat.length; i += 3) {
      if (this.feat[i] !== F_WATER) continue;
      const p = this.xy(i);
      const px = ox + p.x * cell, py = oy + p.y * cell;
      ctx.fillRect(px + cell * .28, py + cell * (phase === 1 ? .66 : .43), cell * .22, wave);
    }
  },
  drawRiverLabel(ox, oy, cell) {
    if (!this.river?.length || cell < 6) return;
    const p = this.xy(this.river[Math.floor(this.river.length * .48)]);
    const x = ox + (p.x + .5) * cell, y = oy + (p.y + .5) * cell;
    ctx.save();
    ctx.font = `900 ${Math.max(9, cell * .52)}px Orbitron, system-ui`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(235,252,255,.78)"; ctx.shadowColor = "#0284c7"; ctx.shadowBlur = 6;
    ctx.fillText(`≈ ${t("riverName")} ≈`, x, y);
    ctx.restore();
  },
  drawWorldEventOverlay(ox, oy, cell) {
    const event = this.worldEvent;
    if (!event) return;
    const now = performance.now();
    ctx.save();
    if (event.type === "drought") {
      ctx.fillStyle = "rgba(91,52,28,.58)";
      for (let i = 0; i < this.feat.length; i++) if (this.feat[i] !== F_WATER) {
        const p = this.xy(i), px = ox + p.x * cell, py = oy + p.y * cell;
        ctx.fillRect(px, py, cell, cell);
        if ((p.x * 7 + p.y * 11) % 9 === 0) { ctx.fillStyle = "rgba(55,30,18,.55)"; ctx.fillRect(px + cell * .35, py + cell * .25, Math.max(1, cell * .1), cell * .5); ctx.fillStyle = "rgba(91,52,28,.58)"; }
      }
    } else if (event.type === "flood" && event.changed) {
      ctx.fillStyle = "rgba(186,245,255,.75)";
      event.changed.forEach((i, n) => { const p = this.xy(i); ctx.fillRect(ox + p.x * cell + ((n + Math.floor(now / 160)) % 2) * cell * .22, oy + p.y * cell + cell * .48, cell * .46, Math.max(1, cell * .11)); });
    } else if (event.type === "harvest") {
      ctx.fillStyle = "rgba(250,204,21,.65)";
      this.tribes.filter(tr => tr.alive).forEach(tr => this.ownedTiles(tr).slice(0, 18).forEach((i, n) => { if (n % 4) return; const p = this.xy(i); ctx.fillRect(ox + (p.x + .38) * cell, oy + (p.y + .24) * cell, Math.max(1, cell * .18), Math.max(1, cell * .5)); }));
    } else if (event.type === "plague") {
      ctx.fillStyle = "rgba(126,231,135,.88)";
      this.tribes.filter(tr => tr.alive).forEach(tr => this.ownedTiles(tr).slice(0, 30).forEach((i, n) => {
        if (n % 6) return;
        const p = this.xy(i), px = ox + (p.x + .5) * cell, py = oy + (p.y + .5) * cell, u = Math.max(1, cell * .1);
        [[0,0],[-2,0],[2,0],[0,-2],[0,2]].forEach(([x,y]) => ctx.fillRect(px + x * u, py + y * u, u, u));
      }));
    }
    ctx.restore();
  },
  drawMapEffects(ox, oy, cell) {
    if (!this.effects?.length) return;
    const now = performance.now();
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    this.effects.forEach(e => {
      const a = Math.max(0, Math.min(1, e.life / e.max));
      const cx = ox + (e.x + .5) * cell, cy = oy + (e.y + .5) * cell;
      const u = Math.max(1, Math.floor(cell * .16));
      const pulse = 1 + Math.sin(now / 100 + e.x) * .22;
      ctx.globalAlpha = Math.min(1, a * 1.45);
      if (e.type === "tech" || e.type === "evolve") {
        // Four expanding pixel sparks turn every discovery into a visible
        // map moment, rather than leaving it only in the text log.
        const r = cell * (1.0 + (1 - a) * 2.4) * pulse;
        ctx.fillStyle = e.color;
        [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dx,dy]) => ctx.fillRect(cx + dx * r - u / 2, cy + dy * r - u / 2, u, u));
        ctx.fillStyle = "#fff8be";
        ctx.fillRect(cx - u, cy - u, u * 2, u * 2);
        ctx.globalAlpha = Math.min(1, a * 2);
        ctx.font = `900 ${Math.max(10, cell * .72)}px system-ui`;
        ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        ctx.fillStyle = "#fff"; ctx.shadowColor = e.color; ctx.shadowBlur = 10;
        ctx.fillText(e.type === "tech" ? `${t("newDiscovery")} · ${e.icon} ${e.label}` : `⬆️ ${e.label}`, cx, cy - cell * 1.55);
        ctx.shadowBlur = 0;
      } else if (e.type === "drought") {
        ctx.fillStyle = "#ffd95a";
        ctx.fillRect(cx - u, cy - u, u * 2, u * 2);
        [[-3,0],[3,0],[0,-3],[0,3],[-2,-2],[2,2],[2,-2],[-2,2]].forEach(([dx,dy]) => ctx.fillRect(cx + dx * u - u / 2, cy + dy * u - u / 2, u, u));
      } else if (e.type === "flood") {
        ctx.fillStyle = "#67e8f9";
        for (let n = 0; n < 3; n++) ctx.fillRect(cx - cell + ((n + Math.floor(now / 190)) % 3) * cell * .65, cy + (n - 1) * u * 2, cell * .46, u);
      } else if (e.type === "floodSource") {
        ctx.fillStyle = "#7dd3fc";
        for (let ring = 1; ring <= 3; ring++) {
          const r = ring * cell * (.38 + (1 - a) * .16);
          ctx.fillRect(cx - r, cy - r, r * 2, u);
          ctx.fillRect(cx - r, cy + r - u, r * 2, u);
          ctx.fillRect(cx - r, cy - r, u, r * 2);
          ctx.fillRect(cx + r - u, cy - r, u, r * 2);
        }
        ctx.globalAlpha = Math.min(1, a * 2);
        ctx.font = `900 ${Math.max(10, cell * .68)}px system-ui`;
        ctx.textAlign = "center"; ctx.textBaseline = "bottom";
        ctx.fillStyle = "#e0f7ff"; ctx.shadowColor = "#0284c7"; ctx.shadowBlur = 10;
        ctx.fillText(`🌊 ${e.label}`, cx, cy - cell * 1.6);
        ctx.shadowBlur = 0;
      } else if (e.type === "plague" || e.type === "illness") {
        ctx.fillStyle = "#7ee787";
        [[0,0],[-2,0],[2,0],[0,-2],[0,2],[-1,-1],[1,1]].forEach(([dx,dy]) => ctx.fillRect(cx + dx * u - u / 2, cy + dy * u - u / 2, u, u));
        ctx.fillStyle = "#203a2a";
        ctx.fillRect(cx - u * .4, cy - u * .4, u * .8, u * .8);
      } else if (e.type === "harvest") {
        ctx.fillStyle = "#facc15";
        for (let n = -2; n <= 2; n++) { ctx.fillRect(cx + n * u, cy + u, u, u * 2); ctx.fillRect(cx + n * u - u, cy, u * 3, u); }
      } else if (e.type === "migration") {
        ctx.fillStyle = "#f8fafc";
        for (let n = 0; n < 4; n++) ctx.fillRect(cx - cell + n * u * 2, cy + (n % 2 ? u : -u), u, u);
      } else if (e.type === "gem") {
        ctx.fillStyle = "#e9d5ff";
        for (let n = 0; n < 4; n++) ctx.fillRect(cx + Math.cos(now / 150 + n * 1.57) * cell, cy + Math.sin(now / 150 + n * 1.57) * cell, u * 2, u * 2);
      } else if (e.type === "death") {
        const rise = (1 - a) * cell * 2.2;
        ctx.fillStyle = "rgba(255,255,255,.82)";
        ctx.fillRect(cx - u, cy - rise - u * 2, u * 2, u * 2);
        ctx.fillStyle = e.color; ctx.fillRect(cx - u * 1.5, cy - rise, u * 3, u * 2.2);
        ctx.fillStyle = "#cbd5e1";
        for (let n = 0; n < 5; n++) ctx.fillRect(cx + (n - 2) * u * 1.3, cy + cell * .7 + Math.sin(now / 130 + n) * u, u, u);
      } else if (e.type === "alliance" || e.type === "reject" || e.type === "travel" || e.type === "boatTravel" || e.type === "robbery" || e.type === "spy") {
        const ex = ox + (e.x2 + .5) * cell, ey = oy + (e.y2 + .5) * cell;
        ctx.strokeStyle = e.color; ctx.lineWidth = Math.max(1, cell * .1); ctx.setLineDash([Math.max(2, cell * .35), Math.max(2, cell * .28)]);
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke(); ctx.setLineDash([]);
        const progress = (e.type === "travel" || e.type === "boatTravel") ? 1 - a : .5;
        const mx = cx + (ex - cx) * progress, my = cy + (ey - cy) * progress;
        ctx.fillStyle = e.type === "boatTravel" ? "#f8e0a5" : e.color;
        if (e.type === "boatTravel") { ctx.fillRect(mx - u * 2, my, u * 4, u); ctx.fillRect(mx - u, my - u * 2, u * 2, u * 2); }
        else ctx.fillRect(mx - u, my - u, u * 2, u * 2);
        if (e.type === "alliance") {
          ctx.fillStyle = "#ecfdf5"; ctx.fillRect(mx - u * 2.6, my - u, u * 1.5, u * 3); ctx.fillRect(mx + u * 1.1, my - u, u * 1.5, u * 3);
          ctx.fillStyle = "#fbbf24"; ctx.fillRect(mx - u * 1.1, my, u * 2.2, u);
          ctx.fillStyle = "#fb7185"; ctx.fillRect(mx - u * .5, my - u * 2.2, u, u); ctx.fillRect(mx - u, my - u * 1.7, u * 2, u);
        }
        if (e.type === "reject") { ctx.fillStyle = "#ffe4e6"; ctx.fillRect(ex - u, ey - u, u * 2, u * 2); }
        if (e.type === "robbery" || e.type === "spy") {
          ctx.font = `900 ${Math.max(9, cell * .55)}px system-ui`; ctx.textAlign = "center"; ctx.fillStyle = e.color;
          ctx.fillText(e.type === "robbery" ? "🚨" : "🥸", mx, my - cell);
        }
      }
    });
    ctx.restore();
  },
  drawStoryMoment(ox, oy, mapW) {
    const m = this.currentMoment;
    if (!m) return;
    const p = Math.max(0, Math.min(1, 1 - m.life / m.max));
    const ease = v => 1 - Math.pow(1 - Math.max(0, Math.min(1, v)), 3);
    const enter = ease(p / .12), leave = ease((1 - p) / .10), visible = Math.min(enter, leave);
    const w = Math.min(470, mapW - 24), h = Math.min(142, Math.max(116, w * .31));
    const x = ox + mapW / 2 - w / 2, y = oy + 12 - (1 - enter) * 24;
    const u = Math.max(3, Math.floor(h / 28)), ground = y + h - u * 3.2;
    const d = m.detail || {}, leftColor = d.left || "#fb7185", rightColor = d.right || "#38bdf8";
    const beat = Math.sin(p * Math.PI * 18), hitBeat = Math.max(0, Math.sin(p * Math.PI * 10));

    ctx.save(); ctx.globalAlpha = visible;
    ctx.shadowColor = m.color; ctx.shadowBlur = 22;
    const panel = ctx.createLinearGradient(x, y, x, y + h);
    panel.addColorStop(0, "rgba(8,7,22,.97)"); panel.addColorStop(1, "rgba(17,10,31,.94)");
    ctx.fillStyle = panel; ctx.strokeStyle = m.color; ctx.lineWidth = Math.max(2, u * .6);
    ctx.beginPath(); ctx.roundRect(x, y, w, h, 15); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.save(); ctx.beginPath(); ctx.roundRect(x + 3, y + 3, w - 6, h - 6, 12); ctx.clip();
    // Pixel sky, distant terrain and scanlines make this read as a small
    // animated scene rather than a notification covering the map.
    ctx.fillStyle = "rgba(255,255,255,.025)";
    for (let sy = y + 30; sy < y + h; sy += 8) ctx.fillRect(x + 4, sy, w - 8, 1);
    ctx.fillStyle = "rgba(103,232,249,.07)";
    for (let n = 0; n < 9; n++) {
      const px = x + ((n * 67 + Math.floor(p * 18)) % Math.max(1, w - 20)) + 10;
      ctx.fillRect(px, y + 36 + (n % 3) * 7, u * .65, u * .65);
    }
    ctx.fillStyle = "rgba(24,38,48,.92)"; ctx.fillRect(x + 4, ground, w - 8, h);
    ctx.fillStyle = "rgba(92,126,104,.52)"; ctx.fillRect(x + 4, ground, w - 8, u);
    for (let gx = x + 8; gx < x + w; gx += u * 5) {
      ctx.fillStyle = gx % 2 ? "#273f38" : "#21352f"; ctx.fillRect(gx, ground + u, u * 3, u);
    }

    const flag = (px, color, flip = 1) => {
      ctx.fillStyle = "#d6c7a1"; ctx.fillRect(px, ground - u * 8, u * .65, u * 8);
      ctx.fillStyle = color; ctx.fillRect(px + (flip < 0 ? -u * 4 : u * .65), ground - u * 8, u * 4, u * 2.5);
      ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(px + (flip < 0 ? -u * 3.2 : u * 1.3), ground - u * 7.5, u * 1.2, u * .7);
    };
    const fighter = (px, py, color, face = 1, action = 0, fall = 0, small = 1) => {
      const z = small, q = u * z, bob = Math.abs(Math.sin(p * Math.PI * 18 + px)) * q * .45;
      ctx.save(); ctx.translate(px, py - bob); ctx.rotate(fall * face * Math.PI * .46);
      ctx.globalAlpha *= small < 1 ? .62 : 1;
      ctx.fillStyle = "rgba(0,0,0,.42)"; ctx.fillRect(-q * 2.2, q * 2.7, q * 4.4, q * .7);
      // Boots and animated legs.
      ctx.fillStyle = "#192231";
      ctx.fillRect(-q * 1.25 + action * q * .35, q * .8, q, q * 2); ctx.fillRect(q * .25 - action * q * .35, q * .8, q, q * 2);
      ctx.fillStyle = "#111827"; ctx.fillRect(-q * 1.5 + action * q * .35, q * 2.35, q * 1.4, q * .65); ctx.fillRect(q * .1 - action * q * .35, q * 2.35, q * 1.4, q * .65);
      // Armour, belt and shoulder plates.
      ctx.fillStyle = color; ctx.fillRect(-q * 1.45, -q * 1.65, q * 2.9, q * 2.7);
      ctx.fillStyle = "rgba(255,255,255,.35)"; ctx.fillRect(-q * 1.8, -q * 1.35, q * .65, q * 1.3); ctx.fillRect(q * 1.15, -q * 1.35, q * .65, q * 1.3);
      ctx.fillStyle = "#3f2e2b"; ctx.fillRect(-q * 1.45, q * .35, q * 2.9, q * .55);
      // Face, helmet and one bright eye pixel.
      ctx.fillStyle = "#f3c99c"; ctx.fillRect(-q, -q * 3.1, q * 2, q * 1.7);
      ctx.fillStyle = "#64748b"; ctx.fillRect(-q * 1.2, -q * 3.55, q * 2.4, q * .8); ctx.fillRect(-q * 1.05, -q * 3.1, q * 2.1, q * .45);
      ctx.fillStyle = "#f8fafc"; ctx.fillRect(face > 0 ? q * .35 : -q * .7, -q * 2.45, q * .35, q * .35);
      // Shield on the rear arm.
      ctx.fillStyle = "#334155"; ctx.fillRect(face > 0 ? -q * 2.25 : q * 1.35, -q * 1.2, q * .9, q * 2.4);
      ctx.strokeStyle = "#cbd5e1"; ctx.lineWidth = Math.max(1, q * .28); ctx.strokeRect(face > 0 ? -q * 2.25 : q * 1.35, -q * 1.2, q * .9, q * 2.4);
      // Sword arm swings during each clash.
      const handX = face * q * 1.4, handY = -q * .8;
      ctx.save(); ctx.translate(handX, handY); ctx.rotate(face * (-.72 + action * 1.18));
      ctx.fillStyle = "#9a6b3b"; ctx.fillRect(-q * .25, -q * .15, q * .5, q * 1.1);
      ctx.fillStyle = "#f8e7ad"; ctx.fillRect(-q * .22, -q * 3.2, q * .44, q * 3.1);
      ctx.fillStyle = "#fff"; ctx.fillRect(-q * .1, -q * 3.05, q * .18, q * 2.6);
      ctx.restore(); ctx.restore();
    };
    const label = (text, px, color) => {
      ctx.font = `900 ${Math.max(7, u * 1.55)}px Orbitron, system-ui`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = color; ctx.fillText(text, px, y + 42);
    };

    if (m.type === "fight") {
      flag(x + u * 5, leftColor, 1); flag(x + w - u * 5, rightColor, -1);
      label("ATTACK", x + w * .18, leftColor); label(d.wall ? "WALL DEFENCE" : "DEFEND", x + w * .82, rightColor);
      const approach = ease(p / .28), outcome = ease((p - .70) / .16);
      const clash = p > .24 && p < .76 ? beat : 0, leftWon = d.winner !== "right";
      const lx = x + w * (.19 + approach * .23) + clash * u * 1.2;
      const rx = x + w * (.81 - approach * .23) - clash * u * 1.2;
      // Background troops make the battle feel larger without hiding the map.
      fighter(lx - u * 7, ground - u * .1, leftColor, 1, -clash, 0, .66);
      fighter(rx + u * 7, ground - u * .1, rightColor, -1, clash, 0, .66);
      fighter(lx, ground - u * .1, leftColor, 1, clash, leftWon ? 0 : outcome, 1);
      fighter(rx, ground - u * .1, rightColor, -1, -clash, leftWon ? outcome : 0, 1);
      // Impact flash, flying sparks and dust only appear while weapons meet.
      if (p > .25 && p < .76) {
        const mx = (lx + rx) / 2, my = ground - u * 3.5;
        ctx.fillStyle = `rgba(255,247,190,${.25 + hitBeat * .75})`; ctx.fillRect(mx - u, my - u, u * 2, u * 2);
        for (let n = 0; n < 8; n++) {
          const a = n * Math.PI / 4 + p * 4, r = u * (2 + hitBeat * 3);
          ctx.fillStyle = n % 2 ? "#fb7185" : "#fde68a";
          ctx.fillRect(mx + Math.cos(a) * r, my + Math.sin(a) * r, u * .55, u * .55);
        }
        ctx.fillStyle = "rgba(203,213,225,.24)";
        for (let n = 0; n < 5; n++) ctx.fillRect(mx + (n - 2) * u * 2, ground - Math.abs(beat) * u * 2, u * 1.4, u * .65);
      }
      // Health bars drain toward the final result.
      const barW = w * .23, barY = y + 51;
      [[x + w * .08, leftColor, leftWon ? .66 : .13], [x + w * .69, rightColor, leftWon ? .13 : .66]].forEach(([bx, color, end]) => {
        ctx.fillStyle = "#1f2937"; ctx.fillRect(bx, barY, barW, u * .9);
        ctx.fillStyle = color; ctx.fillRect(bx, barY, barW * (1 - outcome * (1 - end)), u * .9);
      });
      if (outcome > .15) {
        const wx = leftWon ? lx : rx;
        ctx.globalAlpha *= outcome; ctx.fillStyle = "#facc15";
        ctx.fillRect(wx - u * 1.4, ground - u * 7.6, u * 2.8, u * .6);
        ctx.fillRect(wx - u * 1.2, ground - u * 8.5, u * .6, u); ctx.fillRect(wx - u * .3, ground - u * 8.8, u * .6, u * 1.3); ctx.fillRect(wx + u * .6, ground - u * 8.5, u * .6, u);
      }
    } else if (m.type === "cooperate") {
      const meet = ease(p / .42), lx = x + w * (.20 + meet * .25), rx = x + w * (.80 - meet * .25);
      flag(x + u * 5, leftColor, 1); flag(x + w - u * 5, rightColor, -1);
      fighter(lx, ground, leftColor, 1, 0, 0, .9); fighter(rx, ground, rightColor, -1, 0, 0, .9);
      if (p > .35) {
        const glow = Math.min(1, (p - .35) * 5);
        ctx.globalAlpha *= glow; ctx.fillStyle = "#facc15"; ctx.fillRect(x + w / 2 - u * 2.6, ground - u * 2.4, u * 5.2, u * 2.4);
        ctx.fillStyle = "#9a6b3b"; ctx.fillRect(x + w / 2 - u * 2.2, ground - u * 2, u * 4.4, u * 1.6);
        ctx.fillStyle = "#fb7185"; ctx.fillRect(x + w / 2 - u * .8, ground - u * 6 - Math.abs(beat) * u, u * 1.6, u * 1.6); ctx.fillRect(x + w / 2 - u * 1.2, ground - u * 5.4 - Math.abs(beat) * u, u * 2.4, u);
      }
      label("SHARE", x + w * .2, leftColor); label("PROTECT", x + w * .8, rightColor);
    } else if (m.type === "robbery") {
      const run = ease(p / .82), tx = x + w * (.76 - run * .56), alarm = p > .55;
      // Storehouse and sleeping guard.
      ctx.fillStyle = rightColor; ctx.fillRect(x + w * .76, ground - u * 5, u * 7, u * 5);
      ctx.fillStyle = "#422006"; ctx.fillRect(x + w * .76 + u * 2.5, ground - u * 2.5, u * 2, u * 2.5);
      fighter(x + w * .69, ground, rightColor, 1, 0, 0, .7);
      fighter(tx, ground - Math.abs(beat) * u * .3, leftColor, -1, beat, 0, .85);
      ctx.fillStyle = "#9a6b3b"; ctx.fillRect(tx + u, ground - u * 2.3, u * 2.4, u * 2.5);
      ctx.fillStyle = "#facc15"; for (let n = 0; n < 3; n++) ctx.fillRect(tx + u * (1.3 + n * .6), ground - u * (1.9 + n % 2 * .5), u * .4, u * .4);
      if (alarm) {
        ctx.fillStyle = "#fb7185"; ctx.fillRect(x + w * .68, y + 41, u * 1.2, u * 3);
        for (let n = 0; n < 3; n++) ctx.fillRect(x + w * .68 + (n - 1) * u * 2, y + 38 - Math.abs(beat) * u, u, u);
      }
      label(`-${d.stolen || "?"} FOOD`, x + w * .5, "#fbbf24");
    } else if (m.type === "death") {
      const fall = ease(p / .45), rise = ease((p - .28) / .58), cx = x + w / 2;
      fighter(cx, ground, d.left || m.color, 1, 0, fall, 1.05);
      ctx.globalAlpha *= rise * .75; ctx.fillStyle = "#e2e8f0";
      const gy = ground - u * (4 + rise * 6);
      ctx.fillRect(cx - u, gy - u * 2, u * 2, u * 2); ctx.fillRect(cx - u * 1.5, gy, u * 3, u * 2.2);
      ctx.fillStyle = "#94a3b8"; for (let n = 0; n < 6; n++) ctx.fillRect(cx + (n - 3) * u * 1.5, ground + Math.sin(p * 16 + n) * u, u, u);
    }
    ctx.restore();

    // Title and outcome remain crisp above the pixel scene.
    ctx.font = `900 ${Math.max(11, Math.min(18, w * .043))}px Orbitron, system-ui`; ctx.textAlign = "center"; ctx.textBaseline = "top";
    ctx.fillStyle = "#fff"; ctx.shadowColor = m.color; ctx.shadowBlur = 8; ctx.fillText(m.text, x + w / 2, y + 9, w - 24); ctx.shadowBlur = 0;
    if (m.type === "fight" && d.result && p > .70) {
      const resultAlpha = ease((p - .70) / .12);
      ctx.globalAlpha = visible * resultAlpha; ctx.font = `900 ${Math.max(9, u * 1.7)}px Orbitron, system-ui`;
      ctx.fillStyle = d.winner === "left" ? leftColor : rightColor; ctx.fillText(d.result, x + w / 2, y + h - u * 3, w - 30);
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
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.terrainCache.canvas, ox, oy);
    this.drawLivingTerrain(ox, oy, cell);
    this.drawWorldEventOverlay(ox, oy, cell);
    this.drawRiverLabel(ox, oy, cell);

    // Ownership tint, crisp borders and buildings. Border pixels make each
    // civilization's expanding territory much easier to read at a glance.
    for (let i = 0; i < this.owner.length; i++) {
      const o = this.owner[i];
      if (o === -1) continue;
      const p = this.xy(i), px = ox + p.x * cell, py = oy + p.y * cell;
      ctx.fillStyle = this.tribes[o].glow + "0.27)";
      ctx.fillRect(px, py, cell, cell);
      if (cell >= 6) {
        const edge = Math.max(1, Math.floor(cell * .08));
        ctx.fillStyle = this.tribes[o].color;
        const north = p.y === 0 ? -1 : i - COLS, south = p.y === ROWS - 1 ? -1 : i + COLS;
        const west = p.x === 0 ? -1 : i - 1, east = p.x === COLS - 1 ? -1 : i + 1;
        if (north < 0 || this.owner[north] !== o) ctx.fillRect(px, py, cell, edge);
        if (south < 0 || this.owner[south] !== o) ctx.fillRect(px, py + cell - edge, cell, edge);
        if (west < 0 || this.owner[west] !== o) ctx.fillRect(px, py, edge, cell);
        if (east < 0 || this.owner[east] !== o) ctx.fillRect(px + cell - edge, py, edge, cell);
      }
      const b = this.build[i];
      if (b) {
        this.drawBuilding(px, py, cell, b, this.tribes[o].color);
        if (b === 2) {
          // Extend the wall sprite onto the exact contested edges so it reads
          // as a defensive line between civilizations, not a random monument.
          const edge = Math.max(2, cell * .18);
          ctx.fillStyle = "#aeb8c2";
          const foreign = n => n >= 0 && this.owner[n] >= 0 && this.owner[n] !== o;
          if (foreign(p.y ? i - COLS : -1)) ctx.fillRect(px, py, cell, edge);
          if (foreign(p.y < ROWS - 1 ? i + COLS : -1)) ctx.fillRect(px, py + cell - edge, cell, edge);
          if (foreign(p.x ? i - 1 : -1)) ctx.fillRect(px, py, edge, cell);
          if (foreign(p.x < COLS - 1 ? i + 1 : -1)) ctx.fillRect(px + cell - edge, py, edge, cell);
        }
        if (cell >= 10) {
          const label = ({ 1: "HUT", 2: "WALL", 3: "CLINIC", 4: "BRIDGE", 5: "ANIMAL PEN", 6: "FARM", 7: "ARMY BASE" })[b];
          ctx.save(); ctx.font = `900 ${Math.max(6, cell * .34)}px Orbitron, system-ui`; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
          ctx.fillStyle = "#fff"; ctx.shadowColor = "#05020d"; ctx.shadowBlur = 4;
          ctx.fillText(label, px + cell * .5, py - Math.max(1, cell * .08)); ctx.restore();
        }
      }
    }

    // workers — each one is a real agent you can watch do its job
    this.tribes.forEach((tr) => {
      if (!tr.alive) return;
      tr.workers.forEach(w => this.drawWorker(tr, w, ox, oy, cell));
    });

    // Discoveries, evolution, outbreaks and world events are animated at
    // the relevant tribe's capital so students can see cause and effect.
    this.drawMapEffects(ox, oy, cell);

    this.battles.forEach(b => {
      const bx = ox + b.x * cell, by = oy + b.y * cell;
      const u = Math.max(1, cell * .13), swing = Math.sin(performance.now() / 90) * u * 1.6;
      // Two pixel citizens/armies meet at the real border tile. A wall is
      // visible behind the defender, making its combat value easy to see.
      if (b.wall) { ctx.fillStyle = "#aeb8c2"; ctx.fillRect(bx + cell * .62, by + cell * .12, cell * .18, cell * .72); }
      [[.18, b.attacker, 1], [.62, b.defender, -1]].forEach(([x, color, dir]) => {
        ctx.fillStyle = color; ctx.fillRect(bx + cell * x, by + cell * .38, u * 2, u * 3);
        ctx.fillStyle = "#f7d6b5"; ctx.fillRect(bx + cell * x + u * .45, by + cell * .16, u * 1.1, u * 1.1);
        ctx.strokeStyle = "#fff1a8"; ctx.lineWidth = u;
        ctx.beginPath(); ctx.moveTo(bx + cell * x + u, by + cell * .6); ctx.lineTo(bx + cell * x + u + dir * (u * 2 + swing), by + cell * .22); ctx.stroke();
      });
      ctx.fillStyle = "#fff4a8"; ctx.fillRect(bx + cell * .46, by + cell * .38, u * 2, u * 2);
    });
    this.drawStoryMoment(ox, oy, w);

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
      ctx.globalAlpha = tr.alive ? 1 : 0.35;
      if (tr.alive) this.drawHomeMarker(tr, ox + p.x * cell, oy + p.y * cell, cell);
      else {
        const skull = Math.max(2, cell * .18);
        ctx.fillStyle = "#d6d6d6";
        ctx.fillRect(cx - skull, cy - skull, skull * 2, skull * 1.5);
        ctx.fillStyle = "#31313a";
        ctx.fillRect(cx - skull * .55, cy - skull * .45, skull * .35, skull * .35);
        ctx.fillRect(cx + skull * .20, cy - skull * .45, skull * .35, skull * .35);
        ctx.fillRect(cx - skull * .6, cy + skull * .6, skull * 1.2, skull * .5);
      }
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
  navigator.serviceWorker.register("sw.js").then(reg => reg.update()).catch(() => {});
  let refreshingForNewWorker = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshingForNewWorker) return;
    refreshingForNewWorker = true;
    location.reload();
  });
}
window.__civ = { engine, SIM, CHOOSER, SPEC, CONFIRM, loadLearn, DISCOVERIES, TRAITS, ERAS, POLICIES,
  _confirm: (era, specs, policies = ["research", "food", "defend"], cb = () => {}) => { chosenEra = era; show(null); ui.classList.add("passthrough"); CONFIRM.open(specs, policies, cb); },
  _force: (era, specs, policies = ["research", "food", "defend"]) => { show(null); ui.classList.add("passthrough"); SIM.start(era, specs, policies); } };
showIntro();
