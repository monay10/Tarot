/* ═══════════════════════════════════════════
   Mistik Tarot — yerel yorum motoru (offline)
   Soru analizi + kart kombinasyonları + şablon
   havuzlarından kişisel yorum üretir. LLM yok,
   API yok — tamamen cihazda çalışır.
   ═══════════════════════════════════════════ */

const TarotOracle = (function () {
  "use strict";

  // upright polarity per card id (+1 bright / 0 neutral / -1 challenging)
  const POLARITY = { 0: 1, 1: 1, 2: 0, 3: 1, 4: 1, 5: 0, 6: 1, 7: 1, 8: 1, 9: 0, 10: 1,
                     11: 0, 12: 0, 13: -1, 14: 1, 15: -1, 16: -1, 17: 1, 18: 0, 19: 1, 20: 0, 21: 1 };
  // transformation-themed cards
  const CHANGE = [0, 10, 13, 16, 20];

  const TOPIC_WORDS = {
    love:   ["aşk", "ask", "sevgili", "ilişki", "iliski", "evlilik", "evlen", "hoşlan", "hoslan", "sevdiğim", "sevdigim", "flört", "flort", "kalp", "ayrıl", "ayril", "barış", "baris", "eski", "love", "relationship", "partner", "crush", "marry", "marriage", "boyfriend", "girlfriend", "ex ", "heart", "date"],
    career: ["iş", "is ", "kariyer", "patron", "terfi", "proje", "mülakat", "mulakat", "işe", "ise ", "meslek", "okul", "sınav", "sinav", "job", "career", "work", "boss", "promotion", "interview", "project", "exam", "school", "study"],
    money:  ["para", "maaş", "maas", "borç", "borc", "yatırım", "yatirim", "kira", "satın", "satin", "zengin", "kazan", "money", "salary", "debt", "invest", "rent", "buy", "rich", "earn", "financ"],
    health: ["sağlık", "saglik", "hasta", "iyileş", "iyiles", "beden", "uyku", "stres", "kaygı", "kaygi", "health", "sick", "heal", "sleep", "stress", "anxiety", "body"]
  };

  const T = {
    tr: {
      openings: {
        general: [
          "Kartlar bugün sana net bir hikâye anlatıyor.",
          "Çektiğin kartlar birbirini tamamlayan tek bir mesaj taşıyor.",
          "Enerjiler belirgin; kartların dili bugün her zamankinden açık."
        ],
        love: [
          "Kalbini ilgilendiren bu soruda kartlar duygu yüklü konuşuyor.",
          "Aşka dair sorularda kartlar nadiren bu kadar net olur — dinle."
        ],
        career: [
          "İş ve kariyer sorularında kartlar somut ipuçları verir; bugünküler özellikle konuşkan.",
          "Emeğinle ilgili bu soruda kartlar yol haritası çiziyor."
        ],
        money: [
          "Maddi konulara dair çektiğin kartlar dengeye dikkat çekiyor.",
          "Bolluk ve kaynaklarla ilgili bu soruda kartlar ölçüyü hatırlatıyor."
        ],
        health: [
          "İyilik hâline dair kartlar her şeyden önce kendine şefkati hatırlatıyor.",
          "Beden ve zihin dengen hakkında kartlar yumuşak ama net konuşuyor."
        ]
      },
      echo: [
        "“{q}” — bu soruyu içinde tutarak çektin; kartlar tam buna cevap veriyor.",
        "Sorduğun “{q}” sorusuna kartların yanıtı katmanlı ama anlaşılır."
      ],
      posIntro: {
        past:    ["Geçmişten gelen kart {c}{r}: ", "Hikâyenin kökünde {c}{r} duruyor: "],
        present: ["Şu anın kartı {c}{r}: ", "Bugününü anlatan {c}{r}: "],
        future:  ["Geleceğe uzanan kart {c}{r}: ", "Yolun ilerisinde {c}{r} bekliyor: "],
        daily:   ["Günün kartı {c}{r}: ", "Bugün sana eşlik eden {c}{r}: "],
        answer:  ["Cevabı taşıyan kart {c}{r}: "],
        you:     ["Seni anlatan kart {c}{r}: "],
        them:    ["Onu anlatan kart {c}{r}: "],
        bond:    ["Aranızdaki bağın kartı {c}{r}: "]
      },
      revNote: [
        "Ters gelmesi, bu enerjinin şu an içe döndüğünü ve olgunlaşmayı beklediğini söylüyor.",
        "Ters duruşu, bu gücün önünde küçük ama aşılabilir bir engel olduğuna işaret ediyor."
      ],
      topicLine: {
        career: ["Kariyer tarafında bu kart {k1} ve {k2} temalarını masaya getiriyor.", "İş hayatında {k1} enerjisi öne çıkacak; {k2} bunun anahtarı."],
        money:  ["Maddi açıdan {k1} vurgusu var; ölçülü adımlar kazandırır.", "Para konusunda bu kart {k1} ile {k2} arasında denge istiyor."],
        health: ["Beden-zihin dengesinde {k1} öne çıkıyor; kendine nazik davran.", "Sağlığın için bu kartın mesajı: {k1}. Aceleye getirme."],
        general: ["Anahtar temalar: {k1}, {k2}.", ""]
      },
      arc: {
        rising:  "Genel akış yokuş yukarı: zorlu bir başlangıçtan aydınlık bir yöne ilerliyorsun.",
        falling: "Kartlar dikkat çekiyor: elindeki güzel enerjiyi korumak için önümüzdeki dönemde daha bilinçli adımlar gerekiyor.",
        bright:  "Kartların hepsi aynı yöne bakıyor; akış senden yana.",
        mixed:   "Tablo karışık ama dengeli; ipler hâlâ senin elinde."
      },
      manyReversed: "Birden fazla ters kart, sürecin dış dünyadan çok iç dünyanda olgunlaştığını gösteriyor — acele etme.",
      manyChange: "Birden fazla dönüşüm kartı bir arada: kapanan ve açılan kapılar dönemindesin.",
      loveBond: "Üç kartın ortak dili şu: bağın gidişatı, iki tarafın da ne kadar açık iletişim kurduğuna bağlı.",
      verdictLead: "Kartların net cevabı: {v}.",
      closings: {
        bright: [
          "Sonuç: tablo umut verici. Kalbin rahat olsun, adımlarını cesaretle at. ✨",
          "Özetle: enerji senden yana akıyor — bu dönemi değerlendir. ✨"
        ],
        mixed: [
          "Sonuç: ne tamamen açık ne kapalı bir tablo — küçük, bilinçli adımlar dengeyi lehine çevirir. 🌙",
          "Özetle: sabırlı ve seçici ol; doğru zamanlama her kapıyı açar. 🌙"
        ],
        hard: [
          "Sonuç: kartlar uyarıyor ama korkutmuyor; farkındalık en büyük kalkanın ve bu dönem geçici. 🕯️",
          "Özetle: yavaşla, gözlemle, kendini koru — fırtına dindiğinde daha güçlü olacaksın. 🕯️"
        ]
      }
    },
    en: {
      openings: {
        general: [
          "The cards tell you a clear story today.",
          "The cards you drew carry one message that completes itself.",
          "The energies are distinct; the cards speak plainly today."
        ],
        love: [
          "On this matter of the heart, the cards speak with feeling.",
          "On questions of love the cards are rarely this clear — listen."
        ],
        career: [
          "On work and career the cards give concrete hints; today's are especially talkative.",
          "About your efforts, the cards are drawing a road map."
        ],
        money: [
          "The cards you drew about material matters point to balance.",
          "On abundance and resources, the cards recall the value of measure."
        ],
        health: [
          "On well-being, the cards remind you first of self-compassion.",
          "About your body and mind, the cards speak softly but clearly."
        ]
      },
      echo: [
        "“{q}” — you drew while holding this question; the cards answer exactly that.",
        "To your question “{q}” the cards reply in layers, yet clearly."
      ],
      posIntro: {
        past:    ["From the past comes {c}{r}: ", "At the root of the story stands {c}{r}: "],
        present: ["The card of the present, {c}{r}: ", "Describing your today, {c}{r}: "],
        future:  ["Reaching into the future, {c}{r}: ", "Further down the road waits {c}{r}: "],
        daily:   ["Your card of the day, {c}{r}: ", "Accompanying you today, {c}{r}: "],
        answer:  ["Carrying the answer, {c}{r}: "],
        you:     ["Describing you, {c}{r}: "],
        them:    ["Describing them, {c}{r}: "],
        bond:    ["The card of your bond, {c}{r}: "]
      },
      revNote: [
        "Its reversal says this energy has turned inward for now, waiting to ripen.",
        "Reversed, it points to a small but passable obstacle before this strength."
      ],
      topicLine: {
        career: ["At work this card brings {k1} and {k2} to the table.", "In your career, {k1} steps forward; {k2} is the key to it."],
        money:  ["Materially there is an emphasis on {k1}; measured steps pay off.", "With money, this card asks for balance between {k1} and {k2}."],
        health: ["In body-mind balance, {k1} stands out; be gentle with yourself.", "For your health this card's message is {k1}. Don't rush it."],
        general: ["Key themes: {k1}, {k2}.", ""]
      },
      arc: {
        rising:  "The overall flow is uphill: you are moving from a hard start toward the light.",
        falling: "The cards raise a flag: protecting the good energy you hold will take more deliberate steps ahead.",
        bright:  "All the cards face the same direction; the current is with you.",
        mixed:   "The picture is mixed but balanced; the reins are still in your hands."
      },
      manyReversed: "More than one reversed card shows the process is ripening inside you rather than out in the world — don't rush.",
      manyChange: "Several transformation cards together: you are in a season of closing and opening doors.",
      loveBond: "The three cards share one message: where this bond goes depends on how openly both sides speak.",
      verdictLead: "The cards' clear answer: {v}.",
      closings: {
        bright: [
          "In sum: the picture is hopeful. Ease your heart and step forward bravely. ✨",
          "Overall: the energy flows your way — make the most of this season. ✨"
        ],
        mixed: [
          "In sum: neither fully open nor closed — small, deliberate steps will tip the balance your way. 🌙",
          "Overall: be patient and selective; right timing opens every door. 🌙"
        ],
        hard: [
          "In sum: the cards warn but do not frighten; awareness is your shield, and this season will pass. 🕯️",
          "Overall: slow down, observe, protect yourself — you'll emerge stronger when the storm settles. 🕯️"
        ]
      }
    }
  };

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function detectTopic(question, spread) {
    if (spread === "love") return "love";
    if (!question) return "general";
    const q = " " + question.toLocaleLowerCase("tr-TR") + " ";
    for (const topic of ["love", "career", "money", "health"]) {
      if (TOPIC_WORDS[topic].some((w) => q.indexOf(w) !== -1)) return topic;
    }
    return "general";
  }

  function effPolarity(pick_) {
    const base = POLARITY[pick_.cardId];
    if (!pick_.reversed) return base;
    if (base === 1) return -0.5;   // blocked strength
    if (base === -1) return 0.5;   // easing difficulty
    return -0.25;
  }

  function generate(ctx) {
    const lang = ctx.lang, dict = T[lang], ui = UI[lang];
    const topic = detectTopic(ctx.question, ctx.spread);
    const paras = [];

    // opening
    let open = pick(dict.openings[topic] || dict.openings.general);
    if (ctx.question) {
      const q = ctx.question.length > 90 ? ctx.question.slice(0, 87) + "…" : ctx.question;
      open += " " + pick(dict.echo).replace("{q}", q);
    }
    paras.push(open);

    // yes/no verdict first
    if (ctx.spread === "yesno") {
      const data = TAROT_CARDS[ctx.picks[0].cardId];
      let v = data.yesno;
      if (ctx.picks[0].reversed) v = v === "yes" ? "maybe" : "no";
      paras.push(dict.verdictLead.replace("{v}", ui["verdict_" + v].toUpperCase()) + " " + ui["verdictText_" + v]);
    }

    // per-card paragraphs
    ctx.picks.forEach((p, i) => {
      const data = TAROT_CARDS[p.cardId];
      const posKey = ctx.posKeys[i];
      const intro = pick(dict.posIntro[posKey] || dict.posIntro.daily)
        .replace("{c}", data.name[lang])
        .replace("{r}", p.reversed ? " (" + ui.reversed.toLowerCase() + ")" : "");
      const core = p.reversed ? data.reversed[lang] : data.upright[lang];
      let line = intro + core;
      if (p.reversed) line += " " + pick(dict.revNote);
      // topic flavor
      const kw = data.keywords[lang];
      if (topic === "love") {
        line += " " + data.love[lang];
      } else {
        const tpl = pick(dict.topicLine[topic] || dict.topicLine.general);
        if (tpl) {
          line += " " + tpl
            .replace("{k1}", kw[0].toLocaleLowerCase(lang === "tr" ? "tr-TR" : "en-US"))
            .replace("{k2}", (kw[1] || kw[0]).toLocaleLowerCase(lang === "tr" ? "tr-TR" : "en-US"));
        }
      }
      paras.push(line);
    });

    // synthesis for multi-card spreads
    if (ctx.picks.length > 1) {
      const pols = ctx.picks.map(effPolarity);
      const first = pols[0], last = pols[pols.length - 1];
      let arc;
      if (first < 0 && last > 0) arc = dict.arc.rising;
      else if (first > 0 && last < 0) arc = dict.arc.falling;
      else if (pols.every((x) => x > 0)) arc = dict.arc.bright;
      else arc = dict.arc.mixed;
      const notes = [arc];
      if (ctx.picks.filter((p) => p.reversed).length >= 2) notes.push(dict.manyReversed);
      if (ctx.picks.filter((p) => CHANGE.indexOf(p.cardId) !== -1).length >= 2) notes.push(dict.manyChange);
      if (ctx.spread === "love") notes.push(dict.loveBond);
      paras.push(notes.join(" "));
    }

    // closing by overall score
    const score = ctx.picks.reduce((s, p) => s + effPolarity(p), 0);
    const mood = score >= 1 ? "bright" : score <= -1 ? "hard" : "mixed";
    paras.push(pick(dict.closings[mood]));

    return paras.join("\n\n");
  }

  return { generate: generate };
})();
