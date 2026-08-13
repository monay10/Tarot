/* ═══════════════════════════════════════════
   Mistik Tarot — logic & animation
   Flow: intro → spread menu → fan → pick → flip → results
   ═══════════════════════════════════════════ */

(function () {
  "use strict";

  const REVERSED_CHANCE = 1 / 3;

  const SPREAD_KEYS = {
    daily: ["daily"],
    three: ["past", "present", "future"],
    yesno: ["answer"],
    love:  ["you", "them", "bond"]
  };

  // deterministic PRNG so the daily card stays fixed for the whole day
  function seededRandom(seedStr) {
    let h = 1779033703 ^ seedStr.length;
    for (let i = 0; i < seedStr.length; i++) {
      h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      h ^= h >>> 16;
      return (h >>> 0) / 4294967296;
    };
  }

  function dailyCard() {
    const d = new Date();
    const key = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    const rand = seededRandom("mistik-tarot-" + key);
    return {
      cardId: Math.floor(rand() * TAROT_CARDS.length),
      reversed: rand() < REVERSED_CHANCE
    };
  }

  // storage helpers (localStorage may be unavailable in sandboxed contexts)
  function storeGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function storeSet(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* ignore */ } }

  const state = {
    lang: storeGet("tarot-lang") || "tr",
    fx: storeGet("tarot-fx") || "on",   // sound + vibration
    spread: null,        // 'daily' | 'three'
    posKeys: [],         // slot position keys
    picks: [],           // { cardId, reversed }
    fanCards: [],        // card elements still in the fan
    busy: false,
    finished: false
  };

  // ── elements ────────────────────────────
  const $ = (id) => document.getElementById(id);
  const introScreen = $("intro-screen");
  const menuScreen  = $("menu-screen");
  const tableScreen = $("table-screen");
  const fanEl       = $("fan");
  const slotsEl     = $("slots");
  const resultsEl   = $("results");
  const actionsEl   = $("result-actions");
  const promptEl    = $("draw-prompt");
  const langToggle  = $("lang-toggle");
  const soundToggle = $("sound-toggle");

  const t = (key) => UI[state.lang][key];

  // ── effects: soft chime + vibration ─────
  let audioCtx = null;
  function buzz() {
    if (state.fx !== "on") return;
    try { if (navigator.vibrate) navigator.vibrate(30); } catch (e) { /* optional */ }
  }
  function chime() {
    if (state.fx !== "on") return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;
      [523.25, 783.99].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.06, now + i * 0.09 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 1.1);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 1.2);
      });
    } catch (e) { /* audio is optional */ }
  }

  // ── i18n ────────────────────────────────
  function applyLang() {
    const dict = UI[state.lang];
    document.documentElement.lang = state.lang;
    document.title = dict.title;
    langToggle.textContent = state.lang === "tr" ? "EN" : "TR";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });

    // slot labels
    slotsEl.querySelectorAll(".slot-label").forEach((label) => {
      label.textContent = dict.positions[label.dataset.pos];
    });

    // card face names
    document.querySelectorAll(".card").forEach((card) => {
      const nameEl = card.querySelector(".face-name");
      if (nameEl) nameEl.textContent = TAROT_CARDS[card.dataset.cardId].name[state.lang];
    });

    updatePrompt();
    updateStreakBadge();
    if (state.finished) renderResults(false);
    if ($("journal-screen").classList.contains("active")) renderJournal();
  }

  langToggle.addEventListener("click", () => {
    state.lang = state.lang === "tr" ? "en" : "tr";
    storeSet("tarot-lang", state.lang);
    applyLang();
  });

  function updateFxButton() {
    soundToggle.textContent = state.fx === "on" ? "🔊" : "🔇";
  }

  soundToggle.addEventListener("click", () => {
    state.fx = state.fx === "on" ? "off" : "on";
    storeSet("tarot-fx", state.fx);
    updateFxButton();
    if (state.fx === "on") { chime(); buzz(); } // little preview
  });

  // ── screen switching ────────────────────
  function showScreen(next) {
    const current = document.querySelector(".screen.active");
    if (current === next) return;
    if (current) {
      gsap.to(current, {
        opacity: 0, duration: 0.25, ease: "power1.in",
        onComplete: () => {
          current.classList.remove("active");
          gsap.set(current, { clearProps: "opacity" });
          next.classList.add("active");
          gsap.fromTo(next, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" });
        }
      });
    } else {
      next.classList.add("active");
    }
  }

  // ── prompt ──────────────────────────────
  function updatePrompt() {
    const dict = UI[state.lang];
    if (!state.spread) { promptEl.textContent = ""; return; }
    if (state.finished) {
      promptEl.textContent = {
        daily: dict.dailyResult,
        three: dict.threeTitle,
        yesno: dict.yesnoResult,
        love:  dict.loveTitle
      }[state.spread];
    } else if (state.spread === "daily") {
      promptEl.textContent = dict.promptDaily;
    } else if (state.spread === "yesno") {
      promptEl.textContent = dict.promptYesno;
    } else {
      const pos = dict.positions[state.posKeys[state.picks.length]];
      promptEl.textContent = dict.promptThree.replace("{pos}", pos);
    }
  }

  // ── deck helpers ────────────────────────
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildCardEl(cardId, reversed) {
    const data = TAROT_CARDS[cardId];
    const card = document.createElement("div");
    card.className = "card" + (reversed ? " reversed" : "");
    card.dataset.cardId = cardId;
    card._reversed = reversed;
    card.innerHTML =
      '<div class="card-inner">' +
        '<div class="card-back"><svg><use href="#card-back-art"/></svg></div>' +
        '<div class="card-face"><div class="face-content">' +
          '<div class="face-numeral">' + NUMERALS[cardId] + "</div>" +
          '<div class="face-art"><svg><use href="#t-' + cardId + '"/></svg></div>' +
          '<div class="face-name">' + data.name[state.lang] + "</div>" +
        "</div></div>" +
      "</div>";
    return card;
  }

  // ── slots ───────────────────────────────
  function buildSlots() {
    slotsEl.innerHTML = "";
    state.posKeys.forEach((key) => {
      const wrap = document.createElement("div");
      wrap.className = "slot-wrap";
      const slot = document.createElement("div");
      slot.className = "slot";
      const label = document.createElement("div");
      label.className = "slot-label";
      label.dataset.pos = key;
      label.textContent = UI[state.lang].positions[key];
      wrap.appendChild(slot);
      wrap.appendChild(label);
      slotsEl.appendChild(wrap);
    });
  }

  // ── fan ─────────────────────────────────
  function fanGeometry() {
    const W = fanEl.offsetWidth;
    const sample = state.fanCards[0];
    const cardW = sample ? sample.offsetWidth : 90;
    const cardH = cardW * (5 / 3);
    const R = Math.max(W * 0.38, 300);
    const total = Math.min((110 * Math.PI) / 180, (W * 0.86) / R);
    return { W, cardW, cardH, R, total };
  }

  function layoutFan(animate) {
    const cards = state.fanCards;
    if (!cards.length) return;
    const { W, cardW, cardH, R, total } = fanGeometry();
    const cx = W / 2;
    const yc = R + 20 + cardH / 2;
    const n = cards.length;

    cards.forEach((card, i) => {
      const theta = n === 1 ? 0 : -total / 2 + (total * i) / (n - 1);
      const x = cx + R * Math.sin(theta) - cardW / 2;
      const y = yc - R * Math.cos(theta) - cardH / 2;
      const rot = (theta * 180) / Math.PI;
      card._fanX = x;
      card._fanY = y;
      card._fanRot = rot;
      card.style.zIndex = i + 1;
      if (animate) {
        gsap.to(card, { x, y, rotation: rot, scale: 1, duration: 0.5, ease: "power2.out" });
      } else {
        gsap.set(card, { x, y, rotation: rot, scale: 1 });
      }
    });
  }

  function buildFan() {
    fanEl.innerHTML = "";
    fanEl.style.display = "";
    fanEl.style.opacity = "";
    state.fanCards = [];

    // daily spread: every fan card hides the same date-locked card,
    // so whichever one is picked reveals today's card
    const daily = state.spread === "daily" ? dailyCard() : null;

    const order = shuffle(TAROT_CARDS.map((c) => c.id));
    order.forEach((cardId) => {
      const id = daily ? daily.cardId : cardId;
      const reversed = daily ? daily.reversed : Math.random() < REVERSED_CHANCE;
      const card = buildCardEl(id, reversed);
      card.addEventListener("click", () => pickCard(card));
      card.addEventListener("mouseenter", () => hoverCard(card, true));
      card.addEventListener("mouseleave", () => hoverCard(card, false));
      fanEl.appendChild(card);
      state.fanCards.push(card);
    });

    // entrance: rise from a deck at bottom-center into the fan
    requestAnimationFrame(() => {
      const { W, cardW } = fanGeometry();
      const startX = W / 2 - cardW / 2;
      const startY = fanEl.offsetHeight + 60;
      state.fanCards.forEach((card) => gsap.set(card, { x: startX, y: startY, rotation: 0, opacity: 1 }));
      layoutFanEntrance();
    });
  }

  function layoutFanEntrance() {
    const cards = state.fanCards;
    const { W, cardW, cardH, R, total } = fanGeometry();
    const cx = W / 2;
    const yc = R + 20 + cardH / 2;
    const n = cards.length;

    cards.forEach((card, i) => {
      const theta = n === 1 ? 0 : -total / 2 + (total * i) / (n - 1);
      const x = cx + R * Math.sin(theta) - cardW / 2;
      const y = yc - R * Math.cos(theta) - cardH / 2;
      const rot = (theta * 180) / Math.PI;
      card._fanX = x;
      card._fanY = y;
      card._fanRot = rot;
      card.style.zIndex = i + 1;
      gsap.to(card, {
        x, y, rotation: rot,
        duration: 0.7,
        delay: 0.15 + i * 0.035,
        ease: "back.out(1.2)"
      });
    });
  }

  function hoverCard(card, on) {
    if (state.busy || card._drawn) return;
    if (on) {
      card.style.zIndex = 200;
      gsap.to(card, { y: card._fanY - 22, scale: 1.07, duration: 0.25, ease: "power2.out" });
    } else {
      card.style.zIndex = state.fanCards.indexOf(card) + 1;
      gsap.to(card, { y: card._fanY, scale: 1, duration: 0.25, ease: "power2.out" });
    }
  }

  // ── picking ─────────────────────────────
  function pickCard(card) {
    if (state.busy || card._drawn || state.finished) return;
    state.busy = true;
    card._drawn = true;

    const slotIndex = state.picks.length;
    state.picks.push({ cardId: Number(card.dataset.cardId), reversed: card._reversed });

    const slotWrap = slotsEl.children[slotIndex];
    const slot = slotWrap.querySelector(".slot");

    // 1) straighten & lift in the fan
    gsap.to(card, {
      y: card._fanY - 30, rotation: 0, scale: 1.05,
      duration: 0.22, ease: "power2.out",
      onComplete: () => {
        // 2) FLIP move: reparent into the slot, then fly from old position
        const r1 = card.getBoundingClientRect();
        state.fanCards = state.fanCards.filter((c) => c !== card);
        slot.appendChild(card);
        card.classList.add("placed");
        gsap.set(card, { x: 0, y: 0, rotation: 0, scale: 1 });
        const r2 = card.getBoundingClientRect();
        gsap.set(card, {
          transformOrigin: "0 0",
          x: r1.left - r2.left,
          y: r1.top - r2.top,
          scale: r1.width / r2.width
        });
        gsap.to(card, {
          x: 0, y: 0, scale: 1,
          duration: 0.75, ease: "power3.inOut",
          onComplete: () => flipCard(card, slotWrap)
        });
        // close the gap left in the fan
        layoutFan(true);
      }
    });
  }

  function flipCard(card, slotWrap) {
    chime();
    buzz();
    const inner = card.querySelector(".card-inner");
    gsap.to(inner, {
      rotationY: 180,
      duration: 0.7,
      ease: "power2.inOut",
      onComplete: () => {
        slotWrap.classList.add("filled");
        gsap.fromTo(card, { scale: 1.06 }, { scale: 1, duration: 0.3, ease: "power2.out" });
        if (state.picks.length === state.posKeys.length) {
          finishDraw();
        } else {
          state.busy = false;
          updatePrompt();
        }
      }
    });
  }

  function finishDraw() {
    state.finished = true;
    updatePrompt();
    saveJournalEntry();
    updateStreakBadge();

    // sweep away the rest of the fan
    gsap.to(state.fanCards, {
      opacity: 0, y: "+=50",
      duration: 0.45, stagger: 0.015, ease: "power1.in",
      onComplete: () => { fanEl.style.display = "none"; }
    });

    renderResults(true);
    actionsEl.classList.remove("hidden");
    gsap.fromTo(actionsEl, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.6 });

    setTimeout(() => resultsEl.scrollIntoView({ behavior: "smooth", block: "nearest" }), 700);
    state.busy = false;
  }

  // ── results ─────────────────────────────
  function renderResults(animate) {
    const dict = UI[state.lang];
    resultsEl.innerHTML = "";

    state.picks.forEach((pick, i) => {
      const data = TAROT_CARDS[pick.cardId];
      const meaning = pick.reversed ? data.reversed[state.lang] : data.upright[state.lang];
      const posLabel = state.spread === "daily" ? dict.dailyResult : dict.positions[state.posKeys[i]];

      // yes/no verdict — reversed shifts the tendency one step toward "no"
      let verdictHtml = "";
      if (state.spread === "yesno") {
        let v = data.yesno;
        if (pick.reversed) v = v === "yes" ? "maybe" : "no";
        verdictHtml =
          '<div class="verdict ' + v + '">' +
            '<span class="verdict-word">' + dict["verdict_" + v] + "</span>" +
            '<span class="verdict-text">' + dict["verdictText_" + v] + "</span>" +
          "</div>";
      }

      let extraHtml = "";
      if (state.spread === "love")  extraHtml = '<p class="love-line">♥ ' + data.love[state.lang] + "</p>";
      if (state.spread === "daily") extraHtml = '<p class="daily-note">' + dict.dailyNote + "</p>";

      const panel = document.createElement("article");
      panel.className = "result-panel" + (pick.reversed ? " reversed" : "");
      panel.innerHTML =
        '<div class="result-head">' +
          '<div class="result-icon"><svg><use href="#t-' + pick.cardId + '"/></svg></div>' +
          '<div class="result-titles">' +
            '<div class="result-pos">' + posLabel + "</div>" +
            '<div class="result-name">' + data.name[state.lang] +
              "<span>" + NUMERALS[pick.cardId] + "</span></div>" +
          "</div>" +
          '<div class="orientation-badge ' + (pick.reversed ? "reversed" : "upright") + '">' +
            (pick.reversed ? dict.reversed : dict.upright) + "</div>" +
        "</div>" +
        verdictHtml +
        '<div class="result-keywords">' +
          data.keywords[state.lang].map((k) => '<span class="keyword-chip">' + k + "</span>").join("") +
        "</div>" +
        '<p class="result-text">' + meaning + "</p>" +
        extraHtml;
      resultsEl.appendChild(panel);
    });

    const panels = resultsEl.querySelectorAll(".result-panel");
    if (animate) {
      gsap.fromTo(panels,
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.18, delay: 0.35, ease: "power2.out" });
    } else {
      gsap.set(panels, { opacity: 1 });
    }
  }

  // ── journal & streak ────────────────────
  const JOURNAL_KEY = "tarot-journal";

  function dayKey(dt) {
    return dt.getFullYear() + "-" +
      String(dt.getMonth() + 1).padStart(2, "0") + "-" +
      String(dt.getDate()).padStart(2, "0");
  }

  function loadJournal() {
    try { return JSON.parse(storeGet(JOURNAL_KEY)) || []; } catch (e) { return []; }
  }

  function saveJournalEntry() {
    const list = loadJournal();
    list.push({
      d: dayKey(new Date()),
      t: Date.now(),
      s: state.spread,
      p: state.picks.map((p) => ({ c: p.cardId, r: p.reversed }))
    });
    while (list.length > 200) list.shift(); // keep the journal bounded
    storeSet(JOURNAL_KEY, JSON.stringify(list));
  }

  function calcStreak() {
    const days = new Set(loadJournal().map((e) => e.d));
    const cursor = new Date();
    if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1); // today not drawn yet → count up to yesterday
    let streak = 0;
    while (days.has(dayKey(cursor))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  function updateStreakBadge() {
    const badge = $("streak-badge");
    const s = calcStreak();
    if (s >= 1) {
      badge.classList.remove("hidden");
      $("streak-text").textContent = UI[state.lang].streak.replace("{n}", s);
    } else {
      badge.classList.add("hidden");
    }
  }

  function renderJournal() {
    const dict = UI[state.lang];
    const entries = loadJournal().slice().reverse();
    const statsEl = $("journal-stats");
    const listEl = $("journal-list");
    const clearBtn = $("journal-clear-btn");

    if (!entries.length) {
      statsEl.innerHTML = "";
      listEl.innerHTML = '<p class="journal-empty">' + dict.journalEmpty + "</p>";
      clearBtn.classList.add("hidden");
      return;
    }
    clearBtn.classList.remove("hidden");

    // stats
    const now = new Date();
    const monthPrefix = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
    const monthEntries = entries.filter((e) => e.d.indexOf(monthPrefix) === 0);
    const counts = {};
    monthEntries.forEach((e) => e.p.forEach((p) => { counts[p.c] = (counts[p.c] || 0) + 1; }));
    let topCard = null, topN = 0;
    Object.keys(counts).forEach((c) => { if (counts[c] > topN) { topN = counts[c]; topCard = Number(c); } });

    const tile = (big, label) =>
      '<div class="stat-tile"><span class="stat-big">' + big + '</span><span class="stat-label">' + label + "</span></div>";
    statsEl.innerHTML =
      tile("🔥 " + calcStreak(), dict.statStreak) +
      tile(String(monthEntries.length), dict.statMonth) +
      (topCard !== null ? tile(TAROT_CARDS[topCard].name[state.lang], dict.statTop + " · " + topN + "×") : "");

    // list
    const spreadNames = { daily: dict.dailyTitle, three: dict.threeTitle, yesno: dict.yesnoTitle, love: dict.loveTitle };
    listEl.innerHTML = entries.map((e) => {
      const dt = new Date(e.d + "T12:00:00");
      const opts = { day: "numeric", month: "long" };
      if (dt.getFullYear() !== now.getFullYear()) opts.year = "numeric";
      const dateStr = dt.toLocaleDateString(state.lang === "tr" ? "tr-TR" : "en-US", opts);
      const chips = e.p.map((p) =>
        '<span class="journal-chip' + (p.r ? " rev" : "") + '" title="' + (p.r ? dict.reversed : dict.upright) + '">' +
          TAROT_CARDS[p.c].name[state.lang] + (p.r ? " ↓" : "") +
        "</span>").join("");
      return '<div class="journal-row">' +
        '<div class="journal-row-head"><span class="journal-date">' + dateStr + '</span>' +
        '<span class="journal-spread">' + (spreadNames[e.s] || e.s) + "</span></div>" +
        '<div class="journal-chips">' + chips + "</div></div>";
    }).join("");
  }

  // two-step clear (no confirm() — it is blocked in sandboxed contexts)
  let clearArmed = false;
  $("journal-clear-btn").addEventListener("click", () => {
    const btn = $("journal-clear-btn");
    if (!clearArmed) {
      clearArmed = true;
      btn.textContent = UI[state.lang].clearConfirm;
      setTimeout(() => {
        clearArmed = false;
        btn.textContent = UI[state.lang].clearJournal;
      }, 3000);
    } else {
      clearArmed = false;
      storeSet(JOURNAL_KEY, "[]");
      renderJournal();
      updateStreakBadge();
    }
  });

  // ── share image (1080×1920 story format) ──
  function symbolToImage(cardId) {
    return new Promise((resolve) => {
      const sym = document.getElementById("t-" + cardId);
      if (!sym) return resolve(null);
      const inner = sym.innerHTML.replace(/currentColor/g, "#f2d68d");
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' + inner + "</svg>";
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    });
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function wrapText(ctx, text, x, y, maxW, lineH) {
    const words = text.split(" ");
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, x, y);
        y += lineH;
        line = w;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, x, y);
    return y + lineH;
  }

  async function drawShareCard(ctx, pick, x, y, w, h) {
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, "#241640");
    grad.addColorStop(1, "#150d2b");
    roundRect(ctx, x, y, w, h, w * 0.07);
    ctx.fillStyle = grad;
    ctx.shadowColor = "rgba(217,180,91,.35)";
    ctx.shadowBlur = 40;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#d9b45b";
    ctx.stroke();
    roundRect(ctx, x + 10, y + 10, w - 20, h - 20, w * 0.05);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(217,180,91,.35)";
    ctx.stroke();

    ctx.save();
    if (pick.reversed) {
      ctx.translate(x + w / 2, y + h / 2);
      ctx.rotate(Math.PI);
      ctx.translate(-(x + w / 2), -(y + h / 2));
    }
    ctx.textAlign = "center";
    ctx.fillStyle = "#d9b45b";
    ctx.font = "600 " + Math.round(w * 0.1) + "px Cinzel";
    ctx.fillText(NUMERALS[pick.cardId], x + w / 2, y + h * 0.12);
    const art = await symbolToImage(pick.cardId);
    if (art) {
      const aw = w * 0.72;
      ctx.drawImage(art, x + (w - aw) / 2, y + h * 0.2, aw, aw);
    }
    ctx.fillStyle = "#f2d68d";
    ctx.font = "600 " + Math.round(w * 0.085) + "px Cinzel";
    ctx.fillText(TAROT_CARDS[pick.cardId].name[state.lang], x + w / 2, y + h * 0.92);
    ctx.restore();
  }

  async function shareResult() {
    if (!state.finished || !state.picks.length) return;
    const dict = UI[state.lang];
    try { await document.fonts.ready; } catch (e) { /* draw anyway */ }

    const W = 1080, H = 1920;
    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext("2d");

    // background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#1d1435");
    bg.addColorStop(0.55, "#0b0716");
    bg.addColorStop(1, "#150e2e");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const glow = (x, y, r, color, a) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = a;
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
      ctx.globalAlpha = 1;
    };
    glow(140, 320, 520, "#5b2fbf", 0.35);
    glow(960, 1620, 560, "#7a5a14", 0.3);
    glow(920, 260, 420, "#7c1d55", 0.25);

    // scattered stars (deterministic)
    for (let i = 0; i < 42; i++) {
      ctx.globalAlpha = 0.15 + ((i * 7) % 5) * 0.11;
      ctx.fillStyle = i % 3 ? "rgba(255,255,255,.9)" : "#f2d68d";
      ctx.beginPath();
      ctx.arc(((i * 197 + 60) % W), ((i * 379 + 90) % H), 1.5 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // header
    ctx.textAlign = "center";
    ctx.fillStyle = "#d9b45b";
    ctx.font = "40px Quicksand";
    ctx.fillText("✦   ✧   ✦", W / 2, 150);
    ctx.fillStyle = "#f2d68d";
    ctx.font = "700 92px Cinzel";
    ctx.fillText(dict.title, W / 2, 262);
    const spreadName = { daily: dict.dailyTitle, three: dict.threeTitle, yesno: dict.yesnoTitle, love: dict.loveTitle }[state.spread];
    const dateStr = new Date().toLocaleDateString(state.lang === "tr" ? "tr-TR" : "en-US", { day: "numeric", month: "long", year: "numeric" });
    ctx.fillStyle = "#a396c4";
    ctx.font = "38px Quicksand";
    ctx.fillText(spreadName + "  •  " + dateStr, W / 2, 336);

    // cards
    const n = state.picks.length;
    const cardW = n === 1 ? 440 : 296;
    const cardH = cardW * (5 / 3);
    const gap = 40;
    const totalW = n * cardW + (n - 1) * gap;
    const yCards = 430;
    for (let i = 0; i < n; i++) {
      const x0 = (W - totalW) / 2 + i * (cardW + gap);
      await drawShareCard(ctx, state.picks[i], x0, yCards, cardW, cardH);
      if (n > 1) {
        ctx.fillStyle = "#a396c4";
        ctx.font = "600 34px Quicksand";
        ctx.fillText(dict.positions[state.posKeys[i]].toUpperCase(), x0 + cardW / 2, yCards + cardH + 56);
      }
    }

    // text block
    let ty = yCards + cardH + (n > 1 ? 130 : 90);
    if (state.spread === "yesno") {
      const data = TAROT_CARDS[state.picks[0].cardId];
      let v = data.yesno;
      if (state.picks[0].reversed) v = v === "yes" ? "maybe" : "no";
      ctx.fillStyle = v === "yes" ? "#8fd8a8" : v === "no" ? "#e2a1b4" : "#f2d68d";
      ctx.font = "700 96px Cinzel";
      ctx.fillText(dict["verdict_" + v], W / 2, ty + 40);
      ty += 130;
    }
    if (n === 1) {
      const pick = state.picks[0];
      const data = TAROT_CARDS[pick.cardId];
      ctx.fillStyle = "#f2d68d";
      ctx.font = "600 56px Cinzel";
      const orient = pick.reversed ? dict.reversed : dict.upright;
      ctx.fillText(data.name[state.lang] + "  •  " + orient, W / 2, ty + 20);
      ty += 90;
      ctx.fillStyle = "#efe9dc";
      ctx.font = "42px Quicksand";
      const meaning = pick.reversed ? data.reversed[state.lang] : data.upright[state.lang];
      ty = wrapText(ctx, meaning, W / 2, ty + 20, 860, 62);
    } else {
      for (let i = 0; i < n; i++) {
        const pick = state.picks[i];
        const data = TAROT_CARDS[pick.cardId];
        const orient = pick.reversed ? dict.reversed : dict.upright;
        ctx.fillStyle = "#f2d68d";
        ctx.font = "600 44px Cinzel";
        ctx.fillText(dict.positions[state.posKeys[i]] + ": " + data.name[state.lang] + " (" + orient + ")", W / 2, ty);
        ctx.fillStyle = "#a396c4";
        ctx.font = "36px Quicksand";
        ctx.fillText(data.keywords[state.lang].join(" • "), W / 2, ty + 50);
        ty += 130;
      }
    }

    // footer
    ctx.fillStyle = "rgba(163,150,196,.6)";
    ctx.font = "32px Quicksand";
    ctx.fillText(dict.disclaimer, W / 2, H - 70);

    cv.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "mistik-tarot.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: dict.title }); return; } catch (e) { /* fall back */ }
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "mistik-tarot.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }, "image/png");
  }

  // ── table setup / reset ─────────────────
  function startDraw(spread) {
    state.spread = spread;
    state.posKeys = SPREAD_KEYS[spread];
    state.picks = [];
    state.busy = false;
    state.finished = false;

    resultsEl.innerHTML = "";
    actionsEl.classList.add("hidden");
    buildSlots();
    updatePrompt();
    showScreen(tableScreen);
    setTimeout(buildFan, 350);
    window.scrollTo({ top: 0 });
  }

  // ── events ──────────────────────────────
  $("start-btn").addEventListener("click", () => showScreen(menuScreen));
  $("back-btn").addEventListener("click", () => showScreen(menuScreen));
  $("menu-btn").addEventListener("click", () => showScreen(menuScreen));
  $("journal-btn").addEventListener("click", () => { renderJournal(); showScreen($("journal-screen")); });
  $("journal-back-btn").addEventListener("click", () => showScreen(menuScreen));
  $("again-btn").addEventListener("click", () => startDraw(state.spread));
  $("share-btn").addEventListener("click", shareResult);

  document.querySelectorAll(".spread-card").forEach((btn) => {
    btn.addEventListener("click", () => startDraw(btn.dataset.spread));
  });

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (tableScreen.classList.contains("active") && !state.finished) layoutFan(false);
    }, 150);
  });

  // ── init ────────────────────────────────
  applyLang();
  updateFxButton();
  updateStreakBadge();
  gsap.from("#intro-screen .site-title", { opacity: 0, y: 24, duration: 0.9, ease: "power2.out", delay: 0.15 });
  gsap.from("#intro-screen .tagline",    { opacity: 0, y: 18, duration: 0.9, ease: "power2.out", delay: 0.35 });
  gsap.from("#intro-screen .btn-primary",{ opacity: 0, y: 14, duration: 0.9, ease: "power2.out", delay: 0.55 });
  gsap.from("#intro-screen .intro-ornament", { opacity: 0, duration: 1.2, delay: 0.05 });
})();
