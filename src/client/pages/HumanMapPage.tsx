import { useState, useRef } from "react";
import { Sparkles, Moon, Star, Scroll, Brain, BookOpen, Shield,
  AlertTriangle, ChevronRight, Loader2, User, Map, Sun, Heart, Eye,
  Camera, Upload, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";
import { SeoHead } from "../components/SeoHead";

const CHINESE_ANIMALS = ["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"];
const CHINESE_ELEMENTS = ["Wood","Fire","Earth","Metal","Water"];
const ZODIAC_SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const AZTEC_SIGNS = ["Cipactli","Ehecatl","Calli","Cuetzpallin","Coatl","Miquiztli","Mazatl","Tochtli","Atl","Itzcuintli","Ozomahtli","Malinalli","Acatl","Ocelotl","Cuauhtli","Cozcacuauhtli","Ollin","Tecpatl","Quiahuitl","Xochitl"];
const SYSTEMS_LIST = ["Western Astrology","Chinese Zodiac","Aztec Calendar","Numerology","Tarot","Runes","Face Reading","Palmistry"];

function chineseZodiac(year: number) { return { animal: CHINESE_ANIMALS[(year - 4) % 12], element: CHINESE_ELEMENTS[Math.floor(((year - 4) % 10) / 2)] }; }
function aztecSign(day: number) { return AZTEC_SIGNS[day % 20]; }
function reduceNum(n: number): number { return n < 10 ? n : reduceNum(String(n).split('').reduce((a,c)=>a+Number(c),0)); }
function numerologyLifePath(y: number, m: number, d: number) { return reduceNum(y+m+d); }
function numerologyName(name: string) { const vals: Record<string,number>={a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8}; return name.toLowerCase().replace(/[^a-z]/g,"").split("").reduce((a,c)=>a+(vals[c]||0),0); }
function tarotCard(seed: number) { const cards = ["The Fool","The Magician","The High Priestess","The Empress","The Emperor","The Hierophant","The Lovers","The Chariot","Strength","The Hermit","Wheel of Fortune","Justice","The Hanged Man","Death","Temperance","The Devil","The Tower","The Star","The Moon","The Sun","Judgement","The World"]; return cards[seed % 22]; }
function runeCast(seed: number) { const runes = ["Fehu","Uruz","Thurisaz","Ansuz","Raidho","Kenaz","Gebo","Wunjo","Hagalaz","Nauthiz","Isa","Jera","Eihwaz","Perthro","Algiz","Sowilo","Tiwaz","Berkano","Ehwaz","Mannaz","Laguz","Ingwaz","Dagaz","Othala"]; return { primary: runes[seed % 24], shadow: runes[(seed+7) % 24], advice: runes[(seed+13) % 24] }; }

function DatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  function pickDay(d: number) {
    const m = String(month + 1).padStart(2, "0");
    const day = String(d).padStart(2, "0");
    onChange(`${year}-${m}-${day}`);
  }

  const sel = value ? value.split("-").map(Number) : null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="mb-2 flex items-center justify-between">
        <button onClick={() => setYear(y => y - 10)} className="p-1 text-zinc-500 hover:text-white"><ChevronsLeft className="h-4 w-4" /></button>
        <button onClick={() => setYear(y => y - 1)} className="p-1 text-zinc-500 hover:text-white"><ChevronLeft className="h-4 w-4" /></button>
        <span className="text-sm font-medium text-white">{months[month]} {year}</span>
        <button onClick={() => setYear(y => y + 1)} className="p-1 text-zinc-500 hover:text-white"><ChevronRight className="h-4 w-4" /></button>
        <button onClick={() => setYear(y => y + 10)} className="p-1 text-zinc-500 hover:text-white"><ChevronsRight className="h-4 w-4" /></button>
      </div>
      <div className="mb-1 grid grid-cols-7 text-center text-[10px] text-zinc-600">{"SMTWTFS".split("").map(d=><span key={d}>{d}</span>)}</div>
      <div className="grid grid-cols-7 text-center">
        {Array.from({length: firstDay}).map((_,i)=><div key={`e${i}`} />)}
        {Array.from({length: daysInMonth}).map((_,i)=>{
          const d = i + 1;
          const isSel = sel && sel[0] === year && sel[1] === month + 1 && sel[2] === d;
          return (
            <button key={d} onClick={() => pickDay(d)}
              className={`rounded p-1 text-xs transition ${isSel ? "bg-violet-500/30 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}>
              {d}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex gap-1">
        {months.map((m,i)=>(
          <button key={m} onClick={() => setMonth(i)}
            className={`flex-1 rounded py-0.5 text-[10px] transition ${month===i ? "bg-violet-500/20 text-violet-300" : "text-zinc-600 hover:text-zinc-400"}`}>
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

function PhotoUpload({ label, icon: Icon, onChange }: { label: string; icon: any; onChange: (file: File | null) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <label className="mb-1 block text-xs text-zinc-500">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] p-6 transition hover:border-violet-500/30 hover:bg-violet-500/5"
      >
        {preview ? (
          <img src={preview} alt={label} className="max-h-28 rounded-lg object-contain" />
        ) : (
          <>
            <Icon className="mb-2 h-8 w-8 text-zinc-500" />
            <p className="text-xs text-zinc-500">Tap to upload {label.toLowerCase()}</p>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => {
          const f = e.target.files?.[0];
          if (f) { setPreview(URL.createObjectURL(f)); onChange(f); }
        }} />
      </div>
    </div>
  );
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

export function HumanMapPage() {
  const [step, setStep] = useState<"input" | "mapping" | "result">("input");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [location, setLocation] = useState("");
  const [question, setQuestion] = useState("");
  const [facePhoto, setFacePhoto] = useState<File | null>(null);
  const [handPhoto, setHandPhoto] = useState<File | null>(null);
  const [mapData, setMapData] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState("");

  async function generateMap() {
    if (!birthDate) return;
    setStep("mapping");
    const [y,m,d] = birthDate.split("-").map(Number);
    const seed = y * 10000 + m * 100 + d;

    setAnalyzing("Western Astrology"); await sleep(600);
    let western = null;
    try {
      const r = await fetch("/api/arcana/astro/natal", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({birthDate, birthTime:birthTime||"12:00", lat:40.7, lon:-74, label:location||"Unknown"})
      });
      western = await r.json();
    } catch { western = { error: "Could not compute chart" }; }

    setAnalyzing("Chinese Zodiac"); await sleep(400);
    const chinese = chineseZodiac(y);

    setAnalyzing("Aztec Calendar"); await sleep(300);
    const aztec = { sign: aztecSign(d), dayNumber: d % 20 };

    setAnalyzing("Numerology"); await sleep(400);
    const lp = numerologyLifePath(y,m,d);
    const expr = reduceNum(numerologyName(name || "Unknown"));
    const soul = reduceNum(numerologyName((name || "U").replace(/[^aeiou]/gi,"") || "u"));
    const per = reduceNum(numerologyName((name || "N").replace(/[aeiou]/gi,"") || "n"));

    setAnalyzing("Tarot"); await sleep(400);
    const tarot = { card: tarotCard(seed), reversed: seed % 3 === 0 };

    setAnalyzing("Runes"); await sleep(300);
    const runes = runeCast(seed + m);

    setAnalyzing("Face Reading"); await sleep(500);
    const faceShape = ["Round","Oval","Square","Heart","Diamond"][seed % 5];
    const complexion = ["Fair","Olive","Dark","Warm","Cool"][m % 5];
    const features = ["Strong brows, deep-set eyes","Sharp eyes, full lips","Defined jaw, high cheekbones","Wide forehead, delicate chin","Balanced features, warm expression"][d % 5];

    setAnalyzing("Palmistry"); await sleep(400);
    const handType = ["Earth. practical, grounded","Air. intellectual, communicative","Water. emotional, intuitive","Fire. passionate, energetic"][seed % 4];
    const lifeline = ["Long & deep. strong vitality","Clear & defined. balanced energy","Short. lives in the moment","Double. protected by guides"][m % 4];
    const headline = ["Straight. logical mind","Curved. creative thinker","Long & deep. intense focus","Wavy. adaptable intelligence"][d % 4];

    setAnalyzing("Generating Unified Reading"); await sleep(800);

    setMapData({
      name: name || "Seeker", birthDate, birthTime, location, question, facePhoto, handPhoto,
      western, chinese, aztec,
      numerology: { lifePath: lp, expression: expr, soulUrge: soul, personality: per, dayNumber: d },
      tarot, runes,
      face: { shape: faceShape, complexion, features },
      palm: { handType, lifeline, headline },
    });
    setStep("result");
  }

  function answer(q: string, d: any): string {
    const s = d.western?.ascendant?.sign || "?";
    const su = d.western?.planets?.find((p:any)=>p.body==="Sun")?.sign?.sign || "?";
    const mo = d.western?.moon?.sign || "?";
    const ve = d.western?.planets?.find((p:any)=>p.body==="Venus")?.sign?.sign || "?";
    const ca = d.chinese.animal;
    const ce = d.chinese.element;
    const az = d.aztec.sign;
    const lp = d.numerology.lifePath;
    const tc = d.tarot.card;
    const tr = d.runes.primary;
    const fs = d.face.shape;

    const isLove = /love|date|girl|boy|relationship|marry|partner/i.test(q);
    const isCareer = /career|job|money|work|business/i.test(q);

    if (isLove) {
      return `**🔮 Love Reading for ${d.name}**\n\n` +
        `**The Cross-System Pattern:**\n` +
        `Sun in **${su}** · Rising **${s}** · Venus in **${ve}** · Moon in **${mo}**\n` +
        `Chinese: **${ca}** (${ce}) · Aztec: **${az}** · Life Path **${lp}**\n` +
        `Tarot: **${tc}** · Rune: **${tr}** · Face: **${fs}**\n\n` +
        `**Interpretation:** Your Venus in **${ve}** shows you love through ${["fire","earth","air","water","fire","earth","air","water","fire","earth","air","water"][["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"].indexOf(ve)]} energy. ${["passionate and bold","steady and devoted","curious and witty","deep and nurturing","dramatic and generous","practical and serving","harmonious and fair","intense and transformative","adventurous and free","disciplined and loyal","detached and cerebral","dreamy and romantic"][["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"].indexOf(ve)]}.\n\n` +
        `**Answer:** The **${tc}** card and **${tr}** rune together say: trust what you feel but watch what you see. Your **${ca}** year gives you natural intuition about people. use it. This connection has something real if both of you are willing to be honest. The stars don't lie, but they also don't make choices for you.`;
    }

    if (isCareer) {
      return `**🔮 Career Reading for ${d.name}**\n\n` +
        `Sun in **${su}** drives you toward ${["leadership","financial security","communication","nurturing","recognition","service","partnership","transformation","exploration","authority","innovation","spirituality"][["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"].indexOf(su)]}. Life Path **${lp}** confirms this is your growth edge.\n\n` +
        `**The cards say:** **${tc}**. ${["new cycle begins","master your craft","trust your knowing","abundance","lead with authority","learn and teach","connections matter","willpower wins","find inner strength","go within","change is coming","truth will surface","pause and reflect","transform","find balance","face the shadow","release and rebuild","hope","clarity coming","success is near","be accountable","completion"][["The Fool","The Magician","The High Priestess","The Empress","The Emperor","The Hierophant","The Lovers","The Chariot","Strength","The Hermit","Wheel of Fortune","Justice","The Hanged Man","Death","Temperance","The Devil","The Tower","The Star","The Moon","The Sun","Judgement","The World"].indexOf(tc)]}.`;
    }

    return `**🔮 Reading for ${d.name}**\n\n**The Complete Human Map:**\n` +
      `• Sun: **${su}** · Rising: **${s}** · Moon: **${mo}**\n` +
      `• Chinese: **${ca}** (${ce}) · Aztec: **${az}**\n` +
      `• Life Path **${lp}** · Expression **${d.numerology.expression}** · Soul Urge **${d.numerology.soulUrge}**\n` +
      `• Tarot: **${tc}** · Runes: **${tr}**\n` +
      `• Face: **${fs}** · Palm: **${d.palm.handType.split(". ")[0].trim()}**\n\n` +
      `**Answer:** The **${tc}** card reversed says look beneath the surface. Your **${ca}** wisdom + Life Path **${lp}** gives you everything needed to navigate this. Trust your instincts. they've been trained by every lifetime you've lived before this one.`;
  }

  const PLANET_SYMBOLS: Record<string,string> = { Sun:"☀", Moon:"☽", Mercury:"☿", Venus:"♀", Mars:"♂", Jupiter:"♃", Saturn:"♄", Uranus:"♅", Neptune:"♆", Pluto:"♇" };

  return (
    <div className="min-h-screen">
      <SeoHead title="Human Map · Complete Esoteric Profile" description="Your complete esoteric profile. Chinese zodiac, Aztec sign, numerology, astrological chart, tarot card, palmistry, and face reading from your name and birth date." path="/human-map" />
      <div className="mx-auto max-w-4xl px-5 py-8 md:px-8">

        {step === "input" && (
          <>
            <div className="mb-6 text-center">
              <div className="mb-3 inline-flex rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 p-3">
                <Map className="h-7 w-7 text-violet-400" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-white">Complete Human Map</h1>
              <p className="mx-auto mt-2 max-w-lg text-sm text-zinc-400">
                8 systems. 1 unified reading. Enter your details and ask anything.
              </p>
            </div>

            <div className="mx-auto max-w-2xl space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Full Name</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your full name"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-violet-500/40 focus:bg-white/[0.05]" />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Birth Date</label>
                <DatePicker value={birthDate} onChange={setBirthDate} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">Birth Time (optional)</label>
                  <input type="time" value={birthTime} onChange={e=>setBirthTime(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-500/40" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">Location (optional)</label>
                  <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="City"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-violet-500/40" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <PhotoUpload label="Face Photo (optional)" icon={Camera} onChange={setFacePhoto} />
                <PhotoUpload label="Hand Photo (optional)" icon={Camera} onChange={setHandPhoto} />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Your Question</label>
                <textarea value={question} onChange={e=>setQuestion(e.target.value)} rows={2}
                  placeholder='What do you want to know? e.g. "What does the oracle say about this girl I am dating?"'
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-violet-500/40" />
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {["What does the oracle say about this girl I am dating?","Should I change careers?","What is my purpose?"].map(q=>(
                    <button key={q} onClick={()=>setQuestion(q)}
                      className="rounded-full border border-white/5 px-2.5 py-1 text-[10px] text-zinc-500 transition hover:border-violet-500/30 hover:text-violet-300">{q}</button>
                  ))}
                </div>
              </div>

              <button onClick={generateMap} disabled={!birthDate}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:opacity-90 disabled:opacity-40">
                <Map className="h-5 w-5" />
                Generate My Complete Human Map
              </button>

              <div className="flex flex-wrap justify-center gap-2 text-xs">
                {SYSTEMS_LIST.map(s=>(
                  <span key={s} className="rounded-full border border-white/5 bg-white/[0.02] px-3 py-1 text-zinc-500">{s}</span>
                ))}
              </div>
            </div>
          </>
        )}

        {step === "mapping" && (
          <div className="flex flex-col items-center py-16">
            <div className="relative mb-6">
              <Loader2 className="h-12 w-12 animate-spin text-violet-400" />
              <div className="absolute inset-0 animate-ping rounded-full bg-violet-500/10" />
            </div>
            <h2 className="font-serif text-xl font-bold text-white">Building Your Human Map</h2>
            <p className="mt-2 text-sm text-zinc-500">{analyzing}...</p>
            <div className="mt-8 space-y-2">
              {SYSTEMS_LIST.map(s=>(
                <div key={s} className="flex items-center gap-3 text-sm">
                  <div className={`h-2 w-2 rounded-full ${SYSTEMS_LIST.indexOf(analyzing) > SYSTEMS_LIST.indexOf(s) ? "bg-emerald-500" : SYSTEMS_LIST.indexOf(analyzing) === SYSTEMS_LIST.indexOf(s) ? "bg-violet-500 animate-pulse" : "bg-zinc-700"}`} />
                  <span className={SYSTEMS_LIST.indexOf(analyzing) >= SYSTEMS_LIST.indexOf(s) ? "text-zinc-300" : "text-zinc-600"}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === "result" && mapData && (() => {
          const [revealStep, setRevealStep] = useState(0);
          const journey = [
            { title: "Your Question", icon: Sparkles, render: () => (
              <div className="rounded-xl border border-violet-500/10 bg-violet-500/[0.02] p-5">
                <p className="text-xs text-violet-300">You asked:</p>
                <p className="mt-1 text-lg italic text-white">"{mapData.question || "Show me my complete map"}"</p>
                <p className="mt-2 text-sm text-zinc-400">Let us consult the heavens, the ancients, and the cards to find your answer...</p>
              </div>
            )},
            { title: "The Natal Map. Your Birth Chart", icon: Moon, render: () => (
              <div>
                <p className="mb-4 text-sm text-zinc-400">
                  Your soul entered this world at a specific cosmic moment. The planets were positioned in a unique pattern
                  that shapes your nature, your challenges, and your gifts.
                </p>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                  {mapData.western?.planets?.slice(0,10).map((p:any) => (
                    <div key={p.body} className="rounded-xl border border-white/10 bg-white/[0.02] p-2 text-center">
                      <div className="text-lg">{PLANET_SYMBOLS[p.body] || "●"}</div>
                      <div className="text-[10px] font-medium text-white">{p.body}</div>
                      <div className="text-[9px] text-zinc-500">{p.sign?.sign || "?"}</div>
                      <div className="text-[9px] text-zinc-600">H{p.house}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-zinc-500">
                  Sun in {mapData.western?.planets?.find((p:any)=>p.body==="Sun")?.sign?.sign || "?"} · 
                  Rising {mapData.western?.ascendant?.sign || "?"} · 
                  Moon in {mapData.western?.moon?.sign || "?"}
                </p>
              </div>
            )},
            { title: "Ancient China. Your Zodiac Animal", icon: Star, render: () => (
              <div>
                <p className="mb-4 text-sm text-zinc-400">
                  The Chinese zodiac looks at the year of your birth to reveal your deepest character.
                  Each animal carries wisdom from thousands of years of observation.
                </p>
                <div className="flex items-center gap-4 rounded-xl border border-amber-500/10 bg-amber-500/[0.02] p-4">
                  <div className="text-4xl">{["🐀","🐂","🐅","🐇","🐉","🐍","🐴","🐐","🐒","🐓","🐕","🐖"][CHINESE_ANIMALS.indexOf(mapData.chinese.animal)]}</div>
                  <div>
                    <div className="text-xl font-bold text-white">{mapData.chinese.animal}</div>
                    <div className="text-sm text-amber-300">{mapData.chinese.element} Element</div>
                    <div className="mt-1 text-xs text-zinc-500">{["Clever and resourceful","Diligent and reliable","Brave and competitive","Gentle and elegant","Confident and ambitious","Wise and mysterious","Free-spirited and energetic","Calm and creative","Smart and versatile","Punctual and organized","Loyal and honest","Compassionate and generous"][CHINESE_ANIMALS.indexOf(mapData.chinese.animal)]}</div>
                  </div>
                </div>
              </div>
            )},
            { title: "Aztec Calendar. Your Day Sign", icon: Sun, render: () => (
              <div>
                <p className="mb-4 text-sm text-zinc-400">
                  The Aztec calendar assigns a sacred sign to the day you were born.
                  This reveals your spiritual mission in this lifetime.
                </p>
                <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] p-4 text-center">
                  <div className="mb-1 text-3xl">🌿</div>
                  <div className="text-lg font-bold text-white">{mapData.aztec.sign}</div>
                  <div className="text-xs text-zinc-500">Day {mapData.aztec.dayNumber} of 20</div>
                </div>
              </div>
            )},
            { title: "Numerology. The Numbers of Your Soul", icon: Brain, render: () => (
              <div>
                <p className="mb-4 text-sm text-zinc-400">
                  Numbers are the language of the universe. Your name and birth date
                  combine into patterns that reveal your life's purpose.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Life Path", value: mapData.numerology.lifePath, desc: "Your life's purpose", color: "text-violet-300" },
                    { label: "Expression", value: mapData.numerology.expression, desc: "Your natural talents", color: "text-emerald-300" },
                    { label: "Soul Urge", value: mapData.numerology.soulUrge, desc: "Your heart's desire", color: "text-amber-300" },
                    { label: "Personality", value: mapData.numerology.personality, desc: "How the world sees you", color: "text-sky-300" },
                  ].map(n => (
                    <div key={n.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center">
                      <div className="text-xs text-zinc-500">{n.label}</div>
                      <div className={`text-2xl font-bold ${n.color}`}>{n.value}</div>
                      <div className="text-[10px] text-zinc-600">{n.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )},
            { title: "The Runes. Ancient Wisdom", icon: Scroll, render: () => (
              <div>
                <p className="mb-4 text-sm text-zinc-400">
                  The runes were carved by the Norse seers. Each symbol holds a key
                  to understanding your path. Three runes speak to your situation.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.02] p-3 text-center">
                    <div className="text-2xl text-amber-400">{["ᚠ","ᚢ","ᚦ","ᚨ","ᚱ","ᚲ","ᚷ","ᚹ","ᚺ","ᚾ","ᛁ","ᛃ","ᛇ","ᛈ","ᛉ","ᛊ","ᛏ","ᛒ","ᛖ","ᛗ","ᛚ","ᛝ","ᛞ","ᛟ"][["Fehu","Uruz","Thurisaz","Ansuz","Raidho","Kenaz","Gebo","Wunjo","Hagalaz","Nauthiz","Isa","Jera","Eihwaz","Perthro","Algiz","Sowilo","Tiwaz","Berkano","Ehwaz","Mannaz","Laguz","Ingwaz","Dagaz","Othala"].indexOf(mapData.runes.primary)]}</div>
                    <div className="text-xs font-medium text-white">Your Rune</div>
                    <div className="text-sm font-bold text-amber-300">{mapData.runes.primary}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-center">
                    <div className="text-2xl text-zinc-400">{["ᚠ","ᚢ","ᚦ","ᚨ","ᚱ","ᚲ","ᚷ","ᚹ","ᚺ","ᚾ","ᛁ","ᛃ","ᛇ","ᛈ","ᛉ","ᛊ","ᛏ","ᛒ","ᛖ","ᛗ","ᛚ","ᛝ","ᛞ","ᛟ"][["Fehu","Uruz","Thurisaz","Ansuz","Raidho","Kenaz","Gebo","Wunjo","Hagalaz","Nauthiz","Isa","Jera","Eihwaz","Perthro","Algiz","Sowilo","Tiwaz","Berkano","Ehwaz","Mannaz","Laguz","Ingwaz","Dagaz","Othala"].indexOf(mapData.runes.shadow)]}</div>
                    <div className="text-xs font-medium text-white">Shadow</div>
                    <div className="text-sm font-bold text-zinc-300">{mapData.runes.shadow}</div>
                  </div>
                  <div className="rounded-xl border border-sky-500/10 bg-sky-500/[0.02] p-3 text-center">
                    <div className="text-2xl text-sky-400">{["ᚠ","ᚢ","ᚦ","ᚨ","ᚱ","ᚲ","ᚷ","ᚹ","ᚺ","ᚾ","ᛁ","ᛃ","ᛇ","ᛈ","ᛉ","ᛊ","ᛏ","ᛒ","ᛖ","ᛗ","ᛚ","ᛝ","ᛞ","ᛟ"][["Fehu","Uruz","Thurisaz","Ansuz","Raidho","Kenaz","Gebo","Wunjo","Hagalaz","Nauthiz","Isa","Jera","Eihwaz","Perthro","Algiz","Sowilo","Tiwaz","Berkano","Ehwaz","Mannaz","Laguz","Ingwaz","Dagaz","Othala"].indexOf(mapData.runes.advice)]}</div>
                    <div className="text-xs font-medium text-white">Advice</div>
                    <div className="text-sm font-bold text-sky-300">{mapData.runes.advice}</div>
                  </div>
                </div>
              </div>
            )},
            { title: "The Tarot. A Card for Your Journey", icon: Heart, render: () => (
              <div>
                <p className="mb-4 text-sm text-zinc-400">
                  The Tarot speaks in symbols that transcend time. The card drawn for you
                  reflects the energy surrounding your question.
                </p>
                <div className="flex flex-col items-center rounded-xl border border-violet-500/10 bg-violet-500/[0.02] p-6">
                  <div className="mb-2 text-5xl">🎴</div>
                  <div className="text-xl font-bold text-white">{mapData.tarot.card}</div>
                  <div className={`text-sm font-medium ${mapData.tarot.reversed ? "text-amber-400" : "text-emerald-400"}`}>
                    {mapData.tarot.reversed ? "Reversed. Look within" : "Upright. Move forward"}
                  </div>
                </div>
              </div>
            )},
            { title: "Face & Palm. The Body's Map", icon: Eye, render: () => (
              <div>
                <p className="mb-4 text-sm text-zinc-400">
                  Your face and hands reveal what the stars have written. These ancient arts
                  read the visible signs of your character and destiny.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-rose-500/10 bg-rose-500/[0.02] p-4">
                    <div className="mb-1 text-2xl">👤</div>
                    <div className="text-sm font-bold text-white">{mapData.face.shape}</div>
                    <div className="text-xs text-zinc-400">{mapData.face.features}</div>
                  </div>
                  <div className="rounded-xl border border-teal-500/10 bg-teal-500/[0.02] p-4">
                    <div className="mb-1 text-2xl">✋</div>
                    <div className="text-sm font-bold text-white">{mapData.palm.handType.split(". ")[0].trim()}</div>
                    <div className="text-xs text-zinc-400">{mapData.palm.lifeline.split(". ")[0].trim()}</div>
                  </div>
                </div>
              </div>
            )},
            { title: "The Oracle Answers", icon: Sparkles, render: () => (
              <div>
                <p className="mb-4 text-sm text-zinc-400">
                  Having consulted the stars, the ancients, the cards, and the numbers . 
                  here is the unified answer to your question.
                </p>
                <div className="whitespace-pre-line text-sm leading-relaxed text-zinc-300">
                  {answer(mapData.question || "Show me my path", mapData).split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.includes('**') && line.indexOf('**') !== line.lastIndexOf('**'))
                      return <p key={i} className="mt-3 mb-1 font-bold text-white">{line.replace(/\*\*/g, '')}</p>;
                    return <p key={i} className="mb-1">{line}</p>;
                  })}
                </div>
              </div>
            )},
          ];

          return (
            <div className="pb-16">
              <div className="mb-6 text-center">
                <div className="mb-3 inline-flex rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 p-3">
                  <Map className="h-7 w-7 text-violet-400" />
                </div>
                <h1 className="font-serif text-2xl font-bold text-white">{mapData.name}'s Journey</h1>
                <p className="text-sm text-zinc-500">Revelation {Math.min(revealStep + 1, journey.length)} of {journey.length}</p>
                {/* Progress bar */}
                <div className="mx-auto mt-3 h-1 max-w-md overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                       style={{ width: `${(revealStep / (journey.length - 1)) * 100}%` }} />
                </div>
              </div>

              {journey.slice(0, revealStep + 1).map((section, i) => (
                <div key={i} className="mb-6 animate-[fadeIn_0.5s_ease-out]">
                  <div className="mb-3 flex items-center gap-2">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${i < revealStep ? "bg-emerald-500/20 text-emerald-400" : "bg-violet-500/20 text-violet-400"}`}>
                      {i < revealStep ? "✓" : i + 1}
                    </div>
                    <h2 className="font-serif text-lg font-bold text-white">{section.title}</h2>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                    {section.render()}
                  </div>
                </div>
              ))}

              {revealStep < journey.length - 1 ? (
                <div className="flex justify-center">
                  <button onClick={() => setRevealStep(s => s + 1)}
                    className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-8 py-3 text-sm font-medium text-white transition hover:bg-violet-500">
                    Continue the Journey <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-center gap-4">
                  <button onClick={() => setStep("input")} className="rounded-full border border-white/10 px-6 py-3 text-sm text-zinc-400 transition hover:border-white/20">
                    Begin a New Journey
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function SystemCard({ title, emoji, main, sub }: { title: string; emoji: string; main: string; sub: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <div className="mb-1 text-lg">{emoji}</div>
      <div className="text-[10px] font-medium text-zinc-500">{title}</div>
      <div className="text-sm font-bold text-white">{main}</div>
      <div className="text-[10px] text-zinc-500">{sub}</div>
    </div>
  );
}
