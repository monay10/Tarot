/* ═══════════════════════════════════════════
   Mistik Tarot — data
   22 Major Arcana (TR + EN) & UI strings
   yesno: "yes" | "maybe" | "no"  (upright tendency;
          reversed shifts one step toward "no")
   love:  one-line love-context reading
   ═══════════════════════════════════════════ */

const UI = {
  tr: {
    title: "Mistik Tarot",
    tagline: "Kartlar seni bekliyor. İçinden geçen soruya odaklan, derin bir nefes al ve yolculuğa başla.",
    start: "Başla",
    disclaimer: "✦ Sadece eğlence amaçlıdır ✦",
    chooseSpread: "Bir Açılım Seç",
    dailyTitle: "Günün Kartı",
    dailyDesc: "Tek kart çek — bugünün mesajını al. Kart o güne özeldir.",
    threeTitle: "Geçmiş • Şimdi • Gelecek",
    threeDesc: "Üç kart çek — hikâyenin akışını gör.",
    yesnoTitle: "Evet / Hayır",
    yesnoDesc: "Bir soru tut — kartlar cevabı fısıldasın.",
    loveTitle: "Aşk Açılımı",
    loveDesc: "Sen, o ve aranızdaki bağ — üç kartlık aşk okuması.",
    promptDaily: "Odaklan ve bir kart seç",
    promptYesno: "Sorunu içinden tut ve bir kart seç",
    promptThree: "{pos} için bir kart seç",
    dailyResult: "Günün Mesajı",
    yesnoResult: "Kartların Cevabı",
    dailyNote: "Bu kart bugüne özel — yarın yeni bir kart seni bekliyor.",
    positions: {
      past: "Geçmiş", present: "Şimdi", future: "Gelecek",
      daily: "Günün Kartı", answer: "Cevap",
      you: "Sen", them: "O", bond: "İlişki"
    },
    verdict_yes: "Evet",
    verdict_maybe: "Belki",
    verdict_no: "Hayır",
    verdictText_yes: "İşaretler olumlu — kalbinin sesini dinle.",
    verdictText_maybe: "Kartlar net değil — biraz zaman tanı, koşullar olgunlaşsın.",
    verdictText_no: "Şu an için işaretler olumsuz — zorlamamak en iyisi.",
    upright: "Düz",
    reversed: "Ters",
    again: "Tekrar Çek",
    share: "Görseli Paylaş",
    backMenu: "Açılımlar"
  },
  en: {
    title: "Mystic Tarot",
    tagline: "The cards await you. Focus on the question within, take a deep breath, and begin the journey.",
    start: "Begin",
    disclaimer: "✦ For entertainment purposes only ✦",
    chooseSpread: "Choose a Spread",
    dailyTitle: "Card of the Day",
    dailyDesc: "Draw a single card — receive today's message. The card is bound to the day.",
    threeTitle: "Past • Present • Future",
    threeDesc: "Draw three cards — see the flow of your story.",
    yesnoTitle: "Yes / No",
    yesnoDesc: "Hold a question — let the cards whisper the answer.",
    loveTitle: "Love Spread",
    loveDesc: "You, them, and the bond between — a three-card love reading.",
    promptDaily: "Focus and choose a card",
    promptYesno: "Hold your question in mind and choose a card",
    promptThree: "Choose a card for {pos}",
    dailyResult: "Today's Message",
    yesnoResult: "The Cards' Answer",
    dailyNote: "This card is bound to today — a new one awaits tomorrow.",
    positions: {
      past: "Past", present: "Present", future: "Future",
      daily: "Card of the Day", answer: "Answer",
      you: "You", them: "Them", bond: "The Bond"
    },
    verdict_yes: "Yes",
    verdict_maybe: "Maybe",
    verdict_no: "No",
    verdictText_yes: "The signs are favorable — trust your heart.",
    verdictText_maybe: "The cards are unclear — give it time, let things ripen.",
    verdictText_no: "The signs are unfavorable for now — best not to force it.",
    upright: "Upright",
    reversed: "Reversed",
    again: "Draw Again",
    share: "Share Image",
    backMenu: "Spreads"
  }
};

const NUMERALS = ["0","I","II","III","IV","V","VI","VII","VIII","IX","X","XI",
                  "XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX","XXI"];

const TAROT_CARDS = [
  {
    id: 0,
    name: { tr: "Deli", en: "The Fool" },
    yesno: "yes",
    keywords: { tr: ["Yeni başlangıç", "Cesaret", "Spontanlık"], en: ["New beginnings", "Courage", "Spontaneity"] },
    upright: {
      tr: "Önünde tertemiz bir sayfa var. Bilinmeze güvenle adım at; evren cesaretinden yana.",
      en: "A fresh page lies before you. Step into the unknown with trust — the universe favors your courage."
    },
    reversed: {
      tr: "Aceleyle atılan bir adım seni yorabilir. Riski görmezden gelme; önce bir nefes al, sonra atla.",
      en: "A hasty leap may cost you. Don't ignore the risk — breathe first, then jump."
    },
    love: {
      tr: "Aşkta taze bir heyecan; kalbini korkmadan aç.",
      en: "A fresh spark in love — open your heart without fear."
    }
  },
  {
    id: 1,
    name: { tr: "Büyücü", en: "The Magician" },
    yesno: "yes",
    keywords: { tr: ["İrade", "Yaratıcılık", "Odak"], en: ["Willpower", "Creativity", "Focus"] },
    upright: {
      tr: "İhtiyacın olan her araç elinin altında. Niyetini netleştir; düşünceni gerçeğe dönüştürme gücün bugün zirvede.",
      en: "Every tool you need is already in your hands. Set a clear intention — your power to turn thought into reality peaks today."
    },
    reversed: {
      tr: "Gücünü dağıtıyorsun ya da kendini olduğundan küçük görüyorsun. Sözler değil, eylem seni ileri taşır.",
      en: "Your energy is scattered, or you're selling yourself short. Action, not words, will move you forward."
    },
    love: {
      tr: "Çekim gücün yüksek; niyetini açıkça ifade et.",
      en: "Your magnetism is strong — state your intentions clearly."
    }
  },
  {
    id: 2,
    name: { tr: "Azize", en: "The High Priestess" },
    yesno: "maybe",
    keywords: { tr: ["Sezgi", "Gizem", "İç bilgelik"], en: ["Intuition", "Mystery", "Inner wisdom"] },
    upright: {
      tr: "Cevap dışarıda değil, içinde. Sezgine kulak ver; sessizlikte duyacağın fısıltı doğru yolu gösterecek.",
      en: "The answer is not outside — it is within. Listen to your intuition; the whisper you hear in silence points the way."
    },
    reversed: {
      tr: "İç sesini bastırıyorsun. Başkalarının gürültüsünü kıs ve kendi bilgeliğine dön.",
      en: "You are silencing your inner voice. Turn down the noise of others and return to your own wisdom."
    },
    love: {
      tr: "Söylenmeyenlere kulak ver; kalbin zaten biliyor.",
      en: "Listen to what goes unsaid — your heart already knows."
    }
  },
  {
    id: 3,
    name: { tr: "İmparatoriçe", en: "The Empress" },
    yesno: "yes",
    keywords: { tr: ["Bolluk", "Şefkat", "Üretkenlik"], en: ["Abundance", "Nurturing", "Creativity"] },
    upright: {
      tr: "Bereketli bir dönemdesin. Emek verdiğin her şey büyüyor; kendine ve sevdiklerine şefkatle bak.",
      en: "You are in a fertile season. Everything you tend is growing — care for yourself and your loved ones with tenderness."
    },
    reversed: {
      tr: "Kendini ihmal ederken başkalarını besliyor olabilirsin. Önce kendi toprağını sula.",
      en: "You may be nourishing everyone but yourself. Water your own garden first."
    },
    love: {
      tr: "Şefkat ve bolluk; ilişkine bakım ver, çiçeklensin.",
      en: "Tenderness and abundance — nurture the bond and it blooms."
    }
  },
  {
    id: 4,
    name: { tr: "İmparator", en: "The Emperor" },
    yesno: "yes",
    keywords: { tr: ["Düzen", "Otorite", "İstikrar"], en: ["Structure", "Authority", "Stability"] },
    upright: {
      tr: "Sağlam temeller kurma zamanı. Disiplinin ve kararlılığın sana kalıcı bir güç kazandıracak.",
      en: "It is time to build solid foundations. Discipline and resolve will earn you lasting strength."
    },
    reversed: {
      tr: "Kontrol ihtiyacı katılığa dönüşüyor. Esneklikle dengelenmeyen güç, taşıyanı yorar.",
      en: "The need for control is hardening into rigidity. Power untempered by flexibility exhausts its bearer."
    },
    love: {
      tr: "Güven ve sadakat arayışı; sağlam temeller kur.",
      en: "A search for trust and loyalty — build on solid ground."
    }
  },
  {
    id: 5,
    name: { tr: "Aziz", en: "The Hierophant" },
    yesno: "maybe",
    keywords: { tr: ["Gelenek", "Rehberlik", "Öğreti"], en: ["Tradition", "Guidance", "Teaching"] },
    upright: {
      tr: "Bir öğretmenin ya da köklü bir bilginin rehberliği kapını çalıyor. Denenmiş yollardan öğrenmekte hikmet var.",
      en: "The guidance of a teacher or time-tested wisdom knocks at your door. There is merit in learning from proven paths."
    },
    reversed: {
      tr: "Kurallar sana dar geliyor. Kendi doğrunu tanımlamaktan korkma — ama köprüleri yakmadan.",
      en: "The rules feel too tight. Don't fear defining your own truth — just don't burn bridges on the way."
    },
    love: {
      tr: "Ciddi bağlılık enerjisi; geleneksel adımlar gündemde olabilir.",
      en: "Committed energy — traditional steps may be on the table."
    }
  },
  {
    id: 6,
    name: { tr: "Aşıklar", en: "The Lovers" },
    yesno: "yes",
    keywords: { tr: ["Aşk", "Uyum", "Seçim"], en: ["Love", "Harmony", "Choice"] },
    upright: {
      tr: "Kalbinle aklın aynı yöne bakıyor. Bir bağ derinleşiyor ya da önemli bir seçim seni bütünlüğe çağırıyor.",
      en: "Your heart and mind face the same direction. A bond deepens, or an important choice calls you toward wholeness."
    },
    reversed: {
      tr: "Bir uyumsuzluk ya da kararsızlık havada. Seçimi ertelemek de bir seçimdir — bedelini bilerek seç.",
      en: "Discord or indecision lingers in the air. Postponing a choice is also a choice — know its price."
    },
    love: {
      tr: "Kalpler aynı frekansta; gerçek bir uyum ve seçim anı.",
      en: "Hearts on the same frequency — true harmony, a moment of choice."
    }
  },
  {
    id: 7,
    name: { tr: "Savaş Arabası", en: "The Chariot" },
    yesno: "yes",
    keywords: { tr: ["Zafer", "İrade", "Kontrol"], en: ["Victory", "Willpower", "Momentum"] },
    upright: {
      tr: "Dizginler senin elinde. Zıt güçleri aynı yöne koşturmayı başarırsan zafer kaçınılmaz.",
      en: "The reins are in your hands. Steer opposing forces in one direction, and victory is inevitable."
    },
    reversed: {
      tr: "Yönsüz hız savrulmaya dönüşüyor. Durup rotanı kontrol etmeden gaza basma.",
      en: "Speed without direction becomes drift. Check your course before you accelerate."
    },
    love: {
      tr: "Aşkta inisiyatif sende; kararlı ol ama dizginleri nazik tut.",
      en: "You hold the initiative — be decisive, yet gentle with the reins."
    }
  },
  {
    id: 8,
    name: { tr: "Güç", en: "Strength" },
    yesno: "yes",
    keywords: { tr: ["İç güç", "Sabır", "Şefkat"], en: ["Inner strength", "Patience", "Compassion"] },
    upright: {
      tr: "Gerçek güç kaba kuvvette değil, sakin yüreğinde. Nazik ama kararlı duruşun her kapıyı açar.",
      en: "True strength lies not in force but in a calm heart. Your gentle yet firm stance opens every door."
    },
    reversed: {
      tr: "Şüphe iç gücünü kemiriyor. Kendine karşı da şefkatli ol; cesaret bazen dinlenmekle beslenir.",
      en: "Doubt is gnawing at your strength. Be gentle with yourself too — courage is sometimes fed by rest."
    },
    love: {
      tr: "Sabır ve şefkat kazanır; yumuşak kalp en güçlü mıknatıstır.",
      en: "Patience and warmth win — a soft heart is the strongest magnet."
    }
  },
  {
    id: 9,
    name: { tr: "Ermiş", en: "The Hermit" },
    yesno: "no",
    keywords: { tr: ["İçe dönüş", "Arayış", "Bilgelik"], en: ["Introspection", "Seeking", "Wisdom"] },
    upright: {
      tr: "Kalabalıktan uzaklaşıp kendi ışığını takip etme vakti. Bu yalnızlık değil — derin bir buluşma.",
      en: "It is time to step away from the crowd and follow your own light. This is not loneliness — it is a deep encounter."
    },
    reversed: {
      tr: "İçe dönüş kaçışa dönüşmüş olabilir. Kapıyı aralık bırak; bilgelik paylaşıldıkça çoğalır.",
      en: "Retreat may have turned into escape. Leave the door ajar — wisdom multiplies when shared."
    },
    love: {
      tr: "Kalbin yalnızlık değil, anlam arıyor; acele etme.",
      en: "Your heart seeks meaning, not solitude — take your time."
    }
  },
  {
    id: 10,
    name: { tr: "Kader Çarkı", en: "Wheel of Fortune" },
    yesno: "yes",
    keywords: { tr: ["Döngüler", "Şans", "Dönüm noktası"], en: ["Cycles", "Luck", "Turning point"] },
    upright: {
      tr: "Çark dönüyor ve rüzgâr senden yana. Değişimin akışına direnme; dans ederek eşlik et.",
      en: "The wheel turns, and the wind is at your back. Don't resist the current of change — dance with it."
    },
    reversed: {
      tr: "Talih geçici olarak ters esiyor. Unutma: çarkın en dibi, yükselişin başladığı yerdir.",
      en: "Fortune blows against you for now. Remember: the bottom of the wheel is where the rise begins."
    },
    love: {
      tr: "İlişkide bir dönüm noktası; kader kapıyı tıklatıyor.",
      en: "A turning point in love — fate is knocking."
    }
  },
  {
    id: 11,
    name: { tr: "Adalet", en: "Justice" },
    yesno: "maybe",
    keywords: { tr: ["Denge", "Hakikat", "Hesap"], en: ["Balance", "Truth", "Accountability"] },
    upright: {
      tr: "Terazi hassas çalışıyor; emeğin karşılığını, kararların sonucunu bulacak. Dürüstlük en güçlü kozun.",
      en: "The scales are finely tuned; your efforts and choices will meet their due. Honesty is your strongest card."
    },
    reversed: {
      tr: "Bir haksızlık ya da kendine söylediğin küçük bir yalan dengeyi bozuyor. Gerçekle yüzleşmek özgürleştirir.",
      en: "An injustice — or a small lie you tell yourself — is tipping the scales. Facing the truth sets you free."
    },
    love: {
      tr: "Denge ve dürüstlük şart; açık kartlarla oynayın.",
      en: "Balance and honesty are essential — play with open cards."
    }
  },
  {
    id: 12,
    name: { tr: "Asılan Adam", en: "The Hanged Man" },
    yesno: "no",
    keywords: { tr: ["Teslimiyet", "Farklı bakış", "Bekleyiş"], en: ["Surrender", "New perspective", "Pause"] },
    upright: {
      tr: "Dünyayı baş aşağı görmek bazen tek çıkış yoludur. Bu bekleyiş boşluk değil; olgunlaşma sürecidir.",
      en: "Sometimes seeing the world upside down is the only way out. This pause is not emptiness — it is ripening."
    },
    reversed: {
      tr: "Fedakârlık kurbanlığa dönüşmesin. Beklemek işe yaramıyorsa ipi çöz ve ayaklarının üstüne bas.",
      en: "Don't let sacrifice become martyrdom. If waiting no longer serves you, untie the rope and stand."
    },
    love: {
      tr: "Farklı açıdan bak; beklemek bazen en romantik hamledir.",
      en: "See it from another angle — waiting can be the most romantic move."
    }
  },
  {
    id: 13,
    name: { tr: "Dönüşüm", en: "Death" },
    yesno: "no",
    keywords: { tr: ["Bitiş", "Dönüşüm", "Yeniden doğuş"], en: ["Endings", "Transformation", "Rebirth"] },
    upright: {
      tr: "Bir kapı kapanıyor ki yenisi açılabilsin. Bırakmak kaybetmek değil; yer açmaktır.",
      en: "A door closes so another can open. Letting go is not losing — it is making room."
    },
    reversed: {
      tr: "Bitmesi gerekene tutunmak seni yoruyor. Direniş uzadıkça geçiş zorlaşır; akışa izin ver.",
      en: "Clinging to what must end is draining you. The longer the resistance, the harder the passage — allow the flow."
    },
    love: {
      tr: "Bir dönem kapanıyor; kalbinde yeniye yer aç.",
      en: "A chapter closes — make room in your heart for the new."
    }
  },
  {
    id: 14,
    name: { tr: "Denge", en: "Temperance" },
    yesno: "maybe",
    keywords: { tr: ["Ölçü", "Uyum", "Sabır"], en: ["Moderation", "Harmony", "Patience"] },
    upright: {
      tr: "Zıt akışları ustaca harmanlıyorsun. Acele etme; doğru karışım zamanla kıvamını bulur.",
      en: "You are blending opposing currents with skill. Don't rush — the right mixture finds its balance in time."
    },
    reversed: {
      tr: "Bir uçtan diğerine savruluyorsun. Orta yol sıkıcı değil; şifadır.",
      en: "You swing from one extreme to the other. The middle path is not dull — it is medicine."
    },
    love: {
      tr: "Orta yolda buluşun; uyum acele sevmez.",
      en: "Meet in the middle — harmony hates haste."
    }
  },
  {
    id: 15,
    name: { tr: "Şeytan", en: "The Devil" },
    yesno: "no",
    keywords: { tr: ["Bağımlılık", "Gölge", "Tutku"], en: ["Attachment", "Shadow", "Temptation"] },
    upright: {
      tr: "Seni tutan zincirin kilidi yok — sadece alışkanlık var. Gölgenle yüzleş; gücünü geri al.",
      en: "The chain that holds you has no lock — only habit. Face your shadow and take your power back."
    },
    reversed: {
      tr: "Zincirler gevşiyor; bir bağımlılıktan ya da seni küçülten bir bağdan kurtuluş yakın.",
      en: "The chains are loosening — freedom from an addiction or a diminishing bond is near."
    },
    love: {
      tr: "Tutku yüksek ama bağımlılığa dikkat; özgür seven güzel sever.",
      en: "Passion runs high — beware possession; love freely given is loveliest."
    }
  },
  {
    id: 16,
    name: { tr: "Kule", en: "The Tower" },
    yesno: "no",
    keywords: { tr: ["Sarsıntı", "Yıkım", "Aydınlanma"], en: ["Upheaval", "Revelation", "Awakening"] },
    upright: {
      tr: "Sarsıcı bir gerçek yanlış temeli yıkıyor. Enkaz korkutucu görünse de altından sahici bir zemin çıkacak.",
      en: "A jolting truth topples a false foundation. The rubble looks frightening, but solid ground lies beneath."
    },
    reversed: {
      tr: "Kaçınılmaz bir değişimi ertelemeye çalışıyorsun. Kontrollü yıkım, ani çöküşten iyidir.",
      en: "You are postponing an unavoidable change. A controlled demolition beats a sudden collapse."
    },
    love: {
      tr: "Sarsıcı bir itiraf ya da farkındalık; yıkılan, sahte olandır.",
      en: "A shaking confession or realization — only the false collapses."
    }
  },
  {
    id: 17,
    name: { tr: "Yıldız", en: "The Star" },
    yesno: "yes",
    keywords: { tr: ["Umut", "İlham", "Şifa"], en: ["Hope", "Inspiration", "Healing"] },
    upright: {
      tr: "Fırtınadan sonra gökyüzü berraklaşıyor. Umut yıldızın parlıyor; yaralar şifaya, dilekler yola koyuluyor.",
      en: "After the storm, the sky clears. Your star of hope is shining — wounds turn to healing, wishes set out on their way."
    },
    reversed: {
      tr: "Işığını görmekte zorlanıyorsun ama yıldız hep orada. Umudu küçük şeylerde yeniden bulacaksın.",
      en: "You struggle to see your light, yet the star never left. You will find hope again in small things."
    },
    love: {
      tr: "Kalp yaraları şifalanıyor; umutla sev.",
      en: "Heart wounds are healing — love with hope."
    }
  },
  {
    id: 18,
    name: { tr: "Ay", en: "The Moon" },
    yesno: "maybe",
    keywords: { tr: ["Belirsizlik", "Rüyalar", "Bilinçaltı"], en: ["Illusion", "Dreams", "The subconscious"] },
    upright: {
      tr: "Her şey göründüğü gibi değil. Sisin içinde acele karar verme; rüyaların sana bir şey anlatıyor.",
      en: "Not everything is as it seems. Don't rush decisions in the fog — your dreams are telling you something."
    },
    reversed: {
      tr: "Sis dağılıyor, korkuların küçülüyor. Belirsizlik yerini yavaş yavaş netliğe bırakıyor.",
      en: "The fog is lifting, and fears are shrinking. Uncertainty slowly gives way to clarity."
    },
    love: {
      tr: "Belirsiz sinyaller; varsayma, sor.",
      en: "Mixed signals — don't assume, ask."
    }
  },
  {
    id: 19,
    name: { tr: "Güneş", en: "The Sun" },
    yesno: "yes",
    keywords: { tr: ["Sevinç", "Başarı", "Canlılık"], en: ["Joy", "Success", "Vitality"] },
    upright: {
      tr: "En parlak kart seninle. Başarı, neşe ve saf bir canlılık günü; ışığını saklama, paylaş.",
      en: "The brightest card is with you. A day of success, joy, and pure vitality — don't hide your light, share it."
    },
    reversed: {
      tr: "Bulut geçici, güneş kalıcı. İçindeki çocuğa biraz alan aç; sevinç geri dönecek.",
      en: "The cloud is temporary; the sun is not. Give your inner child some room — joy will return."
    },
    love: {
      tr: "Aşkta parlak bir dönem; neşeyi birlikte çoğaltın.",
      en: "A radiant season in love — multiply the joy together."
    }
  },
  {
    id: 20,
    name: { tr: "Yargı", en: "Judgement" },
    yesno: "maybe",
    keywords: { tr: ["Uyanış", "Hesaplaşma", "Çağrı"], en: ["Awakening", "Reckoning", "Calling"] },
    upright: {
      tr: "Geçmişin dosyası kapanıyor ve yeni bir çağrı duyuluyor. Kendini affet, dersini al, ayağa kalk.",
      en: "The file of the past is closing, and a new call sounds. Forgive yourself, take the lesson, and rise."
    },
    reversed: {
      tr: "Kendine karşı fazla sert bir yargıçsın. Geçmişi yeniden yargılamak yerine bugünü yaşamaya başla.",
      en: "You are too harsh a judge of yourself. Stop retrying the past — start living today."
    },
    love: {
      tr: "Geçmiş bir bağ yeniden gündeme gelebilir; kalbinle hesaplaş.",
      en: "An old bond may resurface — settle accounts with your heart."
    }
  },
  {
    id: 21,
    name: { tr: "Dünya", en: "The World" },
    yesno: "yes",
    keywords: { tr: ["Tamamlanma", "Bütünlük", "Kutlama"], en: ["Completion", "Wholeness", "Celebration"] },
    upright: {
      tr: "Bir döngü zaferle tamamlanıyor. Emeğinin meyvesini kutla; dünya sahnesi alkışlarını bekliyor.",
      en: "A cycle completes in triumph. Celebrate the fruit of your labor — the world stage awaits your bow."
    },
    reversed: {
      tr: "Bitişe çok az kaldı ama bir ilmek eksik. Yarım kalanı tamamlamadan yeni yolculuğa çıkma.",
      en: "The finish line is near, yet one stitch is missing. Complete what's unfinished before the next journey."
    },
    love: {
      tr: "Tamamlanmış hissettiren bir bağ; kutlayın.",
      en: "A bond that feels complete — celebrate it."
    }
  }
];
