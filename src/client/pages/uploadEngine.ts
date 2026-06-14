/* ─── Types ─── */
export interface SpreadElement {
  glyph: string;
  title: string;
  meaning: string;
  position: string;
}

export interface ReadingResult {
  systemName: string;
  method: string;
  elements: SpreadElement[];
  interpretation: string;
}

/* ─── Mian Xiang (Face Reading) Data ─── */
interface FaceFeature {
  feature: string;
  area: string;
  meaning: string;
}
const faceFeatures: FaceFeature[] = [
  { feature: "Oval Face", area: "Upper", meaning: "Balanced nature — adaptable, diplomatic, socially graceful." },
  { feature: "Round Face", area: "Upper", meaning: "Warm-hearted, sociable, pleasure-seeking. Tendency toward indulgence." },
  { feature: "Square Face", area: "Upper", meaning: "Strong-willed, determined, practical. Leadership qualities with stubbornness." },
  { feature: "Long Face", area: "Upper", meaning: "Intellectual, reserved, thoughtful. May be prone to worry or over-analysis." },
  { feature: "High Forehead", area: "Upper", meaning: "Early wisdom — quick learner, intuitive, spiritually inclined." },
  { feature: "Narrow Forehead", area: "Upper", meaning: "Intense focus, difficulty with abstract concepts, practical-minded." },
  { feature: "Arched Eyebrows", area: "Middle", meaning: "Artistic nature, idealism, appreciation for beauty and refinement." },
  { feature: "Straight Eyebrows", area: "Middle", meaning: "Logical, pragmatic, reliable. A natural realist with steady temperament." },
  { feature: "Wide-Set Eyes", area: "Middle", meaning: "Broad-minded, tolerant, patient. Sees the big picture." },
  { feature: "Close-Set Eyes", area: "Middle", meaning: "Detail-oriented, focused, intense. May be prone to narrow perspective." },
  { feature: "Broad Nose Bridge", area: "Middle", meaning: "Strong vitality, confidence, ambition. Natural leader with physical energy." },
  { feature: "Narrow Nose Bridge", area: "Middle", meaning: "Refined sensitivity, attention to detail, aesthetic appreciation." },
  { feature: "Full Lips", area: "Lower", meaning: "Generous, sensual, emotionally expressive. Gives and receives love freely." },
  { feature: "Thin Lips", area: "Lower", meaning: "Self-disciplined, reserved, analytical. May struggle with emotional expression." },
  { feature: "Strong Jaw", area: "Lower", meaning: "Determination, endurance, resilience. Will overcome obstacles through persistence." },
  { feature: "Pointed Chin", area: "Lower", meaning: "Idealistic, sensitive, creative. May need grounding and practical support." },
];

/* ─── Chiromancy (Palm Reading) Data ─── */
interface PalmFeature {
  feature: string;
  type: string;
  meaning: string;
}
const palmFeatures: PalmFeature[] = [
  { feature: "Square Hand (Earth)", type: "Hand Shape", meaning: "Practical, grounded, reliable. Good with hands — builder, artisan, maker." },
  { feature: "Long Hand (Air)", type: "Hand Shape", meaning: "Intellectual, communicative, curious. Lives in ideas and words." },
  { feature: "Broad Hand (Water)", type: "Hand Shape", meaning: "Emotional, intuitive, empathetic. Deeply connected to others' feelings." },
  { feature: "Rectangular Hand (Fire)", type: "Hand Shape", meaning: "Energetic, charismatic, spontaneous. Driven by passion and creativity." },
  { feature: "Long Fingers", type: "Finger Length", meaning: "Detail-oriented, analytical, perfectionist. Notices what others miss." },
  { feature: "Short Fingers", type: "Finger Length", meaning: "Big-picture thinker, impatient with details, action-oriented." },
  { feature: "Balanced Fingers", type: "Finger Length", meaning: "Good equilibrium between detail and overview. Adaptable thinker." },
  { feature: "Prominent Mount of Venus", type: "Mount", meaning: "Strong life force, passion, sensuality. Deep capacity for love." },
  { feature: "Prominent Mount of Jupiter", type: "Mount", meaning: "Ambition, leadership, confidence. Natural authority figure." },
  { feature: "Prominent Mount of Saturn", type: "Mount", meaning: "Wisdom, seriousness, solitude. A deep thinker with a philosophical bent." },
  { feature: "Prominent Mount of Apollo/Sun", type: "Mount", meaning: "Creativity, charisma, brilliance. Drawn to art, beauty, and recognition." },
  { feature: "Prominent Mount of Mercury", type: "Mount", meaning: "Communication, wit, business acumen. A natural persuader and trader." },
  { feature: "Prominent Mount of Moon", type: "Mount", meaning: "Imagination, intuition, psychic sensitivity. Strong artistic and dream tendencies." },
  { feature: "Prominent Mount of Mars", type: "Mount", meaning: "Courage, aggression, resilience. Warrior spirit with strong will." },
  { feature: "Balanced Mounts", type: "Mount", meaning: "Harmonious development — no single quality dominates your nature." },
];

/* ============================================================
   FACE ANALYSIS — Mian Xiang via FaceDetector API
   ============================================================ */

interface FaceMetrics {
  shape: string;
  forehead: string;
  eyebrows: string;
  eyes: string;
  noseBridge: string;
  lips: string;
  jaw: string;
}

async function detectFaceMetrics(image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<FaceMetrics | null> {
  const FD = (window as any).FaceDetector;
  if (!FD) return null;

  const detector = new FD({ fastMode: true });
  try {
    const faces = await detector.detect(image);
    if (!faces.length) return null;
    const f = faces[0];
    const box = f.boundingBox;
    const w = box.width;
    const h = box.height;
    const ratio = w / h;

    const lms: Record<string, { x: number; y: number }> = {};
    for (const lm of f.landmarks) {
      lms[lm.type] = { x: lm.location.x, y: lm.location.y };
    }

    const eyeL = lms["leftEye"] || lms["eye"];
    const eyeR = lms["rightEye"];
    const mouth = lms["mouth"];
    const nose = lms["nose"];

    let shape = "Oval";
    if (ratio > 0.85 && ratio < 1.0) shape = "Round";
    else if (ratio >= 1.0) shape = "Square";
    else if (ratio <= 0.7) shape = "Long";

    let forehead = "Average";
    if (eyeL && box) {
      const browY = Math.min(eyeL.y, eyeR?.y ?? eyeL.y);
      const foreRatio = browY / h;
      if (foreRatio > 0.3) forehead = "High";
      else if (foreRatio < 0.15) forehead = "Narrow";
    }

    let eyebrows = "Straight";
    if (eyeL && eyeR) {
      const diff = Math.abs(eyeL.y - eyeR.y);
      if (diff > 0.05 * h) eyebrows = "Arched";
    }

    let eyes = "Average";
    if (eyeL && eyeR && box) {
      const spacing = Math.abs(eyeR.x - eyeL.x) / w;
      if (spacing > 0.45) eyes = "Wide-Set";
      else if (spacing < 0.25) eyes = "Close-Set";
    }

    let noseBridge = "Average";
    if (nose && mouth && box) {
      const relWidth = (nose.x - box.x) / w;
      if (relWidth > 0.35) noseBridge = "Broad";
      else if (relWidth < 0.15) noseBridge = "Narrow";
    }

    let lips = "Average";
    if (mouth && box) {
      const lipRatio = mouth.y / h;
      if (lipRatio > 0.75) lips = "Full";
      else if (lipRatio < 0.6) lips = "Thin";
    }

    let jaw = "Balanced";
    if (ratio > 0.9 && shape === "Square") jaw = "Strong";
    else if (ratio < 0.7) jaw = "Pointed";

    return { shape, forehead, eyebrows, eyes, noseBridge, lips, jaw };
  } catch {
    return null;
  }
}

function matchFaceFeature(metric: string, value: string): FaceFeature | null {
  const v = value.toLowerCase();
  for (const ff of faceFeatures) {
    const f = ff.feature.toLowerCase();
    if (f.includes(v)) return ff;
    if (metric === "shape" && (f.includes(v) || f.includes("oval"))) return ff;
  }
  return null;
}

export async function analyzeFaceReading(
  frontImg: HTMLImageElement,
  _leftImg?: HTMLImageElement,
  _rightImg?: HTMLImageElement,
): Promise<ReadingResult> {
  const metrics = await detectFaceMetrics(frontImg);
  const sourceNote = "Source: Chinese Mian Xiang tradition — classical physiognomy texts (public domain). Face shape analysis via Web FaceDetector API (Chrome/Edge).";

  if (!metrics) {
    const drawn = [faceFeatures[0], faceFeatures[5], faceFeatures[15]];
    return {
      systemName: "Face Reading",
      method: "Mian Xiang (Three Areas)",
      elements: drawn.map((f, i) => ({
        glyph: "👤",
        title: f.feature,
        meaning: `${f.area}: ${f.meaning}`,
        position: f.area,
      })),
      interpretation: `Face detection not available in this browser. Upload a front-facing photo and use Chrome or Edge for real-time feature analysis. Reading based on classical Mian Xiang data: ${drawn[0].feature} (${drawn[0].area}) — ${drawn[0].meaning}. ${drawn[1].feature} (${drawn[1].area}) — ${drawn[1].meaning}. ${drawn[2].feature} (${drawn[2].area}) — ${drawn[2].meaning}.\n\n${sourceNote}`,
    };
  }

  const matched: FaceFeature[] = [];
  const candidates: [string, string][] = [
    ["shape", metrics.shape],
    ["forehead", metrics.forehead],
    ["eyebrows", metrics.eyebrows],
    ["eyes", metrics.eyes],
    ["nose bridge", metrics.noseBridge],
    ["lips", metrics.lips],
    ["jaw", metrics.jaw],
  ];

  for (const [m, v] of candidates) {
    const ff = matchFaceFeature(m, v);
    if (ff && !matched.find(x => x.feature === ff.feature)) matched.push(ff);
  }

  while (matched.length < 3) {
    const extra = faceFeatures[Math.floor(Math.random() * faceFeatures.length)];
    if (!matched.find(x => x.feature === extra.feature)) matched.push(extra);
  }

  const elements: SpreadElement[] = matched.slice(0, 3).map(f => ({
    glyph: "👤",
    title: f.feature,
    meaning: `${f.area}: ${f.meaning}`,
    position: f.area,
  }));

  const detectedDesc = `Detected: ${metrics.shape} face, ${metrics.forehead} forehead, ${metrics.eyebrows} eyebrows, ${metrics.eyes} eyes, ${metrics.noseBridge} nose bridge, ${metrics.lips} lips, ${metrics.jaw} jaw.`;

  return {
    systemName: "Face Reading",
    method: "Mian Xiang — Real-Time Photo Analysis",
    elements,
    interpretation: `${elements[0].title} — ${elements[0].meaning}. ${elements[1].title} — ${elements[1].meaning}. ${elements[2].title} — ${elements[2].meaning}.\n\n${detectedDesc}\n\n${sourceNote}`,
  };
}

/* ============================================================
   PALM ANALYSIS — Chiromancy via Canvas Silhouette
   ============================================================ */

interface PalmMetrics {
  handShape: string;
  fingerRatio: string;
  mountType: string;
}

function analyzePalmCanvas(img: HTMLImageElement | HTMLCanvasElement): PalmMetrics | null {
  const c = document.createElement("canvas");
  c.width = 400;
  c.height = 500;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, 400, 500);

  const imageData = ctx.getImageData(0, 0, 400, 500);
  const data = imageData.data;

  let skinPixels = 0;
  let topY = 500, bottomY = 0, leftX = 400, rightX = 0;

  for (let y = 0; y < 500; y++) {
    for (let x = 0; x < 400; x++) {
      const i = (y * 400 + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r > 60 && g > 40 && b > 30 && r > g && r > b) {
        skinPixels++;
        if (y < topY) topY = y;
        if (y > bottomY) bottomY = y;
        if (x < leftX) leftX = x;
        if (x > rightX) rightX = x;
      }
    }
  }

  if (skinPixels < 5000) return null;

  const handW = rightX - leftX;
  const handH = bottomY - topY;
  const ratio = handW / handH;

  let handShape = "Square (Earth)";
  if (ratio > 0.85) handShape = "Broad (Water)";
  else if (ratio < 0.65) handShape = "Long (Air)";
  else if (ratio < 0.75) handShape = "Rectangular (Fire)";

  const palmWidth = handW * 0.6;
  const fingerWidth = handW - palmWidth;
  let fingerRatio = "Balanced";
  if (fingerWidth / handW > 0.45) fingerRatio = "Long Fingers";
  else if (fingerWidth / handW < 0.25) fingerRatio = "Short Fingers";

  const centerX = (leftX + rightX) / 2;
  const centerY = (topY + bottomY) / 2;

  function skinPixelsInRegion(sx: number, sy: number, sw: number, sh: number): number {
    const d = ctx!.getImageData(sx, sy, sw, sh).data;
    let count = 0;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      if (r > 60 && g > 40 && b > 30 && r > g && r > b) count++;
    }
    return count;
  }

  let mountType = "Balanced mounts";
  const upperMass = skinPixelsInRegion(0, 0, 400, 250);
  const lowerMass = skinPixelsInRegion(0, 250, 400, 250);
  if (upperMass > lowerMass * 1.3) mountType = "Prominent upper mounts (Jupiter/Saturn)";
  else if (lowerMass > upperMass * 1.3) mountType = "Prominent lower mounts (Moon/Venus)";

  return { handShape, fingerRatio, mountType };
}

function matchPalmFeature(metric: string, value: string): PalmFeature | null {
  const v = value.toLowerCase();
  for (const pf of palmFeatures) {
    const f = pf.feature.toLowerCase();
    const t = pf.type.toLowerCase();
    if (f.includes(v) || t.includes(v)) return pf;
    if (metric === "handShape" && f.includes("square")) return pf;
  }
  return null;
}

export async function analyzePalmReading(
  rightImg: HTMLImageElement,
  _leftImg?: HTMLImageElement,
): Promise<ReadingResult> {
  const metrics = analyzePalmCanvas(rightImg);
  const sourceNote = "Source: Cheiro (Count Louis Hamon), William Benham — classical Western chiromancy (public domain). Hand shape analysis via canvas silhouette (Chrome/Edge/Safari/Firefox).";

  if (!metrics) {
    const drawn = [palmFeatures[0], palmFeatures[3], palmFeatures[8]];
    return {
      systemName: "Palm Reading",
      method: "Chiromancy (Line · Shape · Mount)",
      elements: drawn.map(f => ({
        glyph: "🤚",
        title: f.feature,
        meaning: `${f.type}: ${f.meaning}`,
        position: f.type,
      })),
      interpretation: `Palm could not be detected. Ensure your hand fills the frame with good lighting. Reading based on classical chiromancy data: ${drawn[0].feature} (${drawn[0].type}) — ${drawn[0].meaning}. ${drawn[1].feature} (${drawn[1].type}) — ${drawn[1].meaning}. ${drawn[2].feature} (${drawn[2].type}) — ${drawn[2].meaning}.\n\n${sourceNote}`,
    };
  }

  const matched: PalmFeature[] = [];
  const candidates: [string, string][] = [
    ["handShape", metrics.handShape],
    ["fingerRatio", metrics.fingerRatio],
    ["mountType", metrics.mountType],
  ];

  for (const [m, v] of candidates) {
    const pf = matchPalmFeature(m, v);
    if (pf && !matched.find(x => x.feature === pf.feature)) matched.push(pf);
  }

  while (matched.length < 3) {
    const extra = palmFeatures[Math.floor(Math.random() * palmFeatures.length)];
    if (!matched.find(x => x.feature === extra.feature)) matched.push(extra);
  }

  const elements: SpreadElement[] = matched.slice(0, 3).map(f => ({
    glyph: "🤚",
    title: f.feature,
    meaning: `${f.type}: ${f.meaning}`,
    position: f.type,
  }));

  const detectedDesc = `Detected: ${metrics.handShape}, ${metrics.fingerRatio}, ${metrics.mountType}.`;

  return {
    systemName: "Palm Reading",
    method: "Chiromancy — Real-Time Photo Analysis",
    elements,
    interpretation: `${elements[0].title} (${elements[0].meaning}). ${elements[1].title} (${elements[1].meaning}). ${elements[2].title} (${elements[2].meaning}).\n\n${detectedDesc}\n\n${sourceNote}`,
  };
}
