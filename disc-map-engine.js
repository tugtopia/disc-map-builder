// Plots names on the DISC Map template: one box per wheel number, stacked, 11 pt down to 9 pt.
const CALIBRI_BOLD = {" ":0.2261,"!":0.3257,"\"":0.4385,"#":0.498,"$":0.5068,"%":0.729,"&":0.7046,"'":0.2334,"(":0.3115,")":0.3115,"*":0.498,"+":0.498,",":0.2578,"-":0.3062,".":0.2671,"/":0.4297,"0":0.5068,"1":0.5068,"2":0.5068,"3":0.5068,"4":0.5068,"5":0.5068,"6":0.5068,"7":0.5068,"8":0.5068,"9":0.5068,":":0.2759,";":0.2759,"<":0.498,"=":0.498,">":0.498,"?":0.4634,"@":0.8984,"A":0.606,"B":0.5605,"C":0.5293,"D":0.6304,"E":0.4878,"F":0.459,"G":0.6372,"H":0.6309,"I":0.2666,"J":0.3311,"K":0.5469,"L":0.4229,"M":0.874,"N":0.6587,"O":0.6763,"P":0.5322,"Q":0.686,"R":0.563,"S":0.4727,"T":0.4951,"U":0.6528,"V":0.5913,"W":0.9062,"X":0.5508,"Y":0.5195,"Z":0.478,"[":0.3247,"\\":0.4297,"]":0.3247,"^":0.498,"_":0.498,"`":0.3003,"a":0.4937,"b":0.5366,"c":0.4185,"d":0.5366,"e":0.5034,"f":0.3164,"g":0.4741,"h":0.5366,"i":0.2456,"j":0.2554,"k":0.48,"l":0.2456,"m":0.8135,"n":0.5366,"o":0.5376,"p":0.5366,"q":0.5366,"r":0.3555,"s":0.3989,"t":0.3467,"u":0.5366,"v":0.4731,"w":0.7451,"x":0.4595,"y":0.4736,"z":0.3975,"{":0.3438,"|":0.4751,"}":0.3438,"~":0.498,"\u00c0":0.606,"\u00c1":0.606,"\u00c2":0.606,"\u00c3":0.606,"\u00c4":0.606,"\u00c5":0.606,"\u00c6":0.7754,"\u00c7":0.5293,"\u00c8":0.4878,"\u00c9":0.4878,"\u00ca":0.4878,"\u00cb":0.4878,"\u00cc":0.2666,"\u00cd":0.2666,"\u00ce":0.2666,"\u00cf":0.2666,"\u00d0":0.6392,"\u00d1":0.6587,"\u00d2":0.6763,"\u00d3":0.6763,"\u00d4":0.6763,"\u00d5":0.6763,"\u00d6":0.6763,"\u00d7":0.498,"\u00d8":0.6807,"\u00d9":0.6528,"\u00da":0.6528,"\u00db":0.6528,"\u00dc":0.6528,"\u00dd":0.5195,"\u00de":0.5322,"\u00df":0.5547,"\u00e0":0.4937,"\u00e1":0.4937,"\u00e2":0.4937,"\u00e3":0.4937,"\u00e4":0.4937,"\u00e5":0.4937,"\u00e6":0.7749,"\u00e7":0.4185,"\u00e8":0.5034,"\u00e9":0.5034,"\u00ea":0.5034,"\u00eb":0.5034,"\u00ec":0.2456,"\u00ed":0.2456,"\u00ee":0.2456,"\u00ef":0.2456,"\u00f0":0.5366,"\u00f1":0.5366,"\u00f2":0.5376,"\u00f3":0.5376,"\u00f4":0.5376,"\u00f5":0.5376,"\u00f6":0.5376,"\u00f7":0.498,"\u00f8":0.5439,"\u00f9":0.5366,"\u00fa":0.5366,"\u00fb":0.5366,"\u00fc":0.5366,"\u00fd":0.4736,"\u00fe":0.5366,"\u00ff":0.4736,"\u2019":0.2578};
const WHEEL = { cx: 3899478, cy: 4961515, kx: 1.363 * 4161.4, ky: 1.363 * 4151.2 };
const RINGS = [0, 85.7, 153.5, 221, 288, 355.5]; // ring radii, in pixels of the numbered key wheel
const PT = 12700 / ((WHEEL.kx + WHEEL.ky) / 2);  // key-wheel pixels per point
const SIZES = [11, 10.5, 10, 9.5, 9];
const LINE_STEP = 1.1, CLEAR = 1.5, GLYPH_H = 0.82;              // stack spacing (x font size); minimum gap to a wheel line

// The box that belongs to a number: the cell just clockwise of its line.
function boxOf(n) {
  if (n >= 57 && n <= 60) return { r1: RINGS[0], r2: RINGS[1], a1: 90 * (n - 57), span: 90 };
  if (n >= 41 && n <= 56) return { r1: RINGS[1], r2: RINGS[2], a1: 22.5 * (n - 41), span: 22.5 };
  if (n >= 25 && n <= 40) return { r1: RINGS[2], r2: RINGS[3], a1: 22.5 * (n - 25), span: 22.5 };
  if (n >= 9 && n <= 24) return { r1: RINGS[3], r2: RINGS[4], a1: 22.5 * (n - 9), span: 22.5 };
  if (n >= 1 && n <= 8) return { r1: RINGS[4], r2: RINGS[5], a1: 22.5 + 45 * (n - 1), span: 45 };
  return null;
}

const textWidthPt = (s, size) => [...s].reduce((w, c) => w + (CALIBRI_BOLD[c] ?? 0.55), 0) * size;

// Smallest gap between a rectangle and the edges of the box; negative when it pokes outside.
function clearance(cx, cy, w, h, b) {
  let min = Infinity;
  for (let i = 0; i <= 8; i++) for (let j = 0; j <= 4; j++) {
    if (i > 0 && i < 8 && j > 0 && j < 4) continue;
    const x = cx - w / 2 + w * i / 8, y = cy - h / 2 + h * j / 4;
    const r = Math.hypot(x, y), ang = ((Math.atan2(x, -y) * 180 / Math.PI) + 360) % 360;
    const d1 = (ang - b.a1 + 360) % 360, d2 = b.span - d1;
    if (d1 > b.span) return -1;
    const toLine = t => r * Math.sin(Math.min(t, 90) * Math.PI / 180);
    min = Math.min(min, r - (b.r1 || -Infinity), b.r2 - r, toLine(d1), toLine(d2));
    if (min < 0) return min;
  }
  return min;
}

function bestSpot(w, h, b) {
  let best = { gap: -Infinity, x: 0, y: 0 };
  for (let i = 0; i <= 14; i++) for (let j = 0; j <= 18; j++) {
    const r = b.r1 + (b.r2 - b.r1) * i / 14, t = (b.a1 + b.span * j / 18) * Math.PI / 180;
    const x = r * Math.sin(t), y = -r * Math.cos(t), gap = clearance(x, y, w, h, b);
    if (gap > best.gap) best = { gap, x, y };
  }
  return best;
}

function centerOf(b) {
  const t = (b.a1 + b.span / 2) * Math.PI / 180, r = b.r1 ? (b.r1 + b.r2) / 2 : 0.6 * b.r2;
  return { x: r * Math.sin(t), y: -r * Math.cos(t) };
}

// The spot closest to the box's center where the rectangle fits, or null.
function nearestSpot(w, h, b) {
  const c = centerOf(b);
  let best = null, bestD = Infinity;
  for (let i = 0; i <= 28; i++) for (let j = 0; j <= 36; j++) {
    const r = b.r1 + (b.r2 - b.r1) * i / 28, t = (b.a1 + b.span * j / 36) * Math.PI / 180;
    const x = r * Math.sin(t), y = -r * Math.cos(t), d = Math.hypot(x - c.x, y - c.y);
    if (d < bestD && clearance(x, y, w, h, b) >= CLEAR) { best = { x, y }; bestD = d; }
  }
  return best;
}

// Fit a stack of names into one box: centered at any size from 11 to 9 pt first, then moved
// only as far as needed. fits=false means it is still too big for the box at 9 pt.
function fitBox(n, names) {
  const b = boxOf(n), c = centerOf(b);
  const dims = size => ({
    w: Math.max(...names.map(t => textWidthPt(t, size))) * PT,
    h: (LINE_STEP * size * (names.length - 1) + GLYPH_H * size) * PT,
  });
  for (const size of SIZES) {
    const { w, h } = dims(size);
    if (clearance(c.x, c.y, w, h, b) >= CLEAR) return { n, names, size, x: c.x, y: c.y, fits: true, centered: true };
  }
  for (const size of SIZES) {
    const { w, h } = dims(size), s = nearestSpot(w, h, b);
    if (s) return { n, names, size, x: s.x, y: s.y, fits: true, centered: false };
  }
  const size = SIZES[SIZES.length - 1], { w, h } = dims(size), s = mostInside(w, h, b);
  return { n, names, size, x: s.x, y: s.y, fits: false, centered: false, share: s.share };
}

// Share of a rectangle's area that lies inside the box.
function insideShare(cx, cy, w, h, b) {
  let hit = 0, all = 0;
  for (let i = 0; i <= 12; i++) for (let j = 0; j <= 8; j++) {
    const x = cx - w / 2 + w * i / 12, y = cy - h / 2 + h * j / 8, r = Math.hypot(x, y);
    const ang = ((Math.atan2(x, -y) * 180 / Math.PI) + 360) % 360, d = (ang - b.a1 + 360) % 360;
    all++;
    if (r >= b.r1 && r <= b.r2 && d <= b.span) hit++;
  }
  return hit / all;
}

// Where a too-big rectangle overhangs its box the least, closest to center on a tie.
function mostInside(w, h, b) {
  const c = centerOf(b);
  let best = { share: -1, d: Infinity, x: c.x, y: c.y };
  for (let i = 0; i <= 20; i++) for (let j = 0; j <= 24; j++) {
    const r = b.r1 + (b.r2 - b.r1) * i / 20, t = (b.a1 + b.span * j / 24) * Math.PI / 180;
    const x = r * Math.sin(t), y = -r * Math.cos(t), share = insideShare(x, y, w, h, b), d = Math.hypot(x - c.x, y - c.y);
    if (share > best.share + 1e-9 || (Math.abs(share - best.share) <= 1e-9 && d < best.d)) best = { share, d, x, y };
  }
  return best;
}

/* ---------- Callouts: a crowded box's names stack in open space outside the wheel, with a line to a dot in the box ---------- */

const CALLOUT_STEP = 1.05;
const rect = (x1, y1, x2, y2) => ({ x1, y1, x2, y2 });
// Open space on the slide between the wheel and the fixed text, in slide units.
// `attach` is the side of the stack that faces the wheel, where the line meets it.
const ZONES = [
  { ...rect(350000, 5690000, 1550000, 6430000), attach: 'right' }, { ...rect(350000, 3500000, 1550000, 4250000), attach: 'right' },
  { ...rect(6250000, 5690000, 7500000, 6430000), attach: 'left' }, { ...rect(6250000, 3450000, 7500000, 4250000), attach: 'left' },
  { ...rect(1930000, 7250000, 3000000, 8500000), attach: 'top' }, { ...rect(4780000, 7460000, 5850000, 8500000), attach: 'top' },
  { ...rect(1500000, 1400000, 2950000, 2380000), attach: 'bottom' }, { ...rect(4850000, 1400000, 6280000, 2360000), attach: 'bottom' },
];
const TEXT_BLOCKS = [
  rect(2980000, 1400000, 4800000, 2330000), rect(640000, 2450000, 1990000, 3400000), rect(5400000, 2440000, 7370000, 3370000),
  rect(410000, 4270000, 1430000, 5660000), rect(6360000, 4260000, 7380000, 5640000),
  rect(800000, 6440000, 1780000, 7370000), rect(5660000, 6470000, 7310000, 7390000), rect(3060000, 7410000, 4700000, 8490000),
];

const toSlide = (x, y) => ({ x: WHEEL.cx + x * WHEEL.kx, y: WHEEL.cy + y * WHEEL.ky });

// Every name's center on the slide, in slide units.
function placedNames(fit) {
  if (fit.callout) return fit.callout.items;
  const c = toSlide(fit.x, fit.y), step = LINE_STEP * fit.size * 12700;
  return fit.names.map((name, i) => ({ name, x: c.x, y: c.y + (i - (fit.names.length - 1) / 2) * step, size: fit.size }));
}

function nameRect(p) {
  const w = textWidthPt(p.name, p.size) * 12700, h = p.size * 12700;
  return rect(p.x - w / 2, p.y - h / 2, p.x + w / 2, p.y + h / 2);
}

// Lay names out in a zone: one column as large as fits, then more columns.
function stackIn(z, names) {
  const zw = z.x2 - z.x1, zh = z.y2 - z.y1;
  for (let cols = 1; cols <= 3; cols++) {
    const rows = Math.ceil(names.length / cols);
    for (const size of SIZES) {
      const colNames = Array.from({ length: cols }, (_, c) => names.slice(c * rows, (c + 1) * rows));
      const widths = colNames.map(l => l.length ? Math.max(...l.map(t => textWidthPt(t, size))) * 12700 : 0);
      const gap = 100000, W = widths.reduce((a, b) => a + b, 0) + gap * (cols - 1);
      const step = CALLOUT_STEP * size * 12700, H = step * (rows - 1) + size * 12700;
      if (W > zw || H > zh) continue;
      const cx = (z.x1 + z.x2) / 2, cy = (z.y1 + z.y2) / 2, items = [];
      let left = cx - W / 2;
      colNames.forEach((l, c) => {
        l.forEach((name, i) => items.push({ name, size, x: left + widths[c] / 2, y: cy - H / 2 + size * 6350 + i * step }));
        left += widths[c] + gap;
      });
      return { items, size, box: rect(cx - W / 2, cy - H / 2, cx + W / 2, cy + H / 2) };
    }
  }
  return null;
}

const crosses = (a, b, r) => {
  for (let i = 0; i <= 80; i++) {
    const x = a.x + (b.x - a.x) * i / 80, y = a.y + (b.y - a.y) * i / 80;
    if (x >= r.x1 && x <= r.x2 && y >= r.y1 && y <= r.y2) return true;
  }
  return false;
};
const segmentsCross = (a, b, c, d) => {
  const side = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  return side(a, b, c) * side(a, b, d) < 0 && side(c, d, a) * side(c, d, b) < 0;
};

// A stack of names that doesn't fit its box at 9 pt goes outside. A single name stays in its box.
const goesOutside = f => !f.fits && f.names.length >= 2;

function layoutCallouts(fits) {
  const crowded = fits.filter(goesOutside).sort((a, b) => b.names.length - a.names.length);
  const nameRects = fits.filter(f => !crowded.includes(f)).flatMap(f => placedNames(f).map(nameRect));
  const free = [...ZONES], lines = [];
  for (const f of crowded) {
    const c = centerOf(boxOf(f.n)), dot = toSlide(c.x, c.y);
    let best = null;
    for (const z of free) {
      const s = stackIn(z, f.names);
      if (!s) continue;
      const midX = (s.box.x1 + s.box.x2) / 2, midY = (s.box.y1 + s.box.y2) / 2, gap = 45000;
      const end = {
        right: { x: s.box.x2 + gap, y: midY }, left: { x: s.box.x1 - gap, y: midY },
        top: { x: midX, y: s.box.y1 - gap }, bottom: { x: midX, y: s.box.y2 + gap },
      }[z.attach];
      const len = Math.hypot(end.x - dot.x, end.y - dot.y);
      const hits = nameRects.filter(r => crosses(dot, end, r)).length + TEXT_BLOCKS.filter(r => crosses(dot, end, r)).length
        + lines.filter(l => segmentsCross(dot, end, l.dot, l.end)).length;
      const score = len + hits * 3000000;
      if (!best || score < best.score) best = { score, z, s, end };
    }
    if (!best) continue; // no open space left: it stays in its box and is flagged as too big
    free.splice(free.indexOf(best.z), 1);
    f.callout = { items: best.s.items, size: best.s.size, dot, end: best.end };
    lines.push({ dot, end: best.end });
    nameRects.push(...best.s.items.map(nameRect));
  }
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function calloutShapes(fit, id) {
  const { dot, end } = fit.callout, d = 91440;
  const x = Math.round(Math.min(dot.x, end.x)), y = Math.round(Math.min(dot.y, end.y));
  const cx = Math.round(Math.abs(end.x - dot.x)), cy = Math.round(Math.abs(end.y - dot.y));
  const flip = (end.x < dot.x ? ' flipH="1"' : '') + (end.y < dot.y ? ' flipV="1"' : '');
  const fill = '<a:solidFill><a:srgbClr val="0000CC"/></a:solidFill>';
  return `<p:cxnSp><p:nvCxnSpPr><p:cNvPr id="${id}" name="Callout line box ${fit.n}"/><p:cNvCxnSpPr/><p:nvPr/></p:nvCxnSpPr><p:spPr><a:xfrm${flip}><a:off x="${x}" y="${y}"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="line"><a:avLst/></a:prstGeom><a:ln w="25400">${fill}</a:ln></p:spPr></p:cxnSp>`
    + `<p:sp><p:nvSpPr><p:cNvPr id="${id + 1}" name="Callout dot box ${fit.n}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${Math.round(dot.x - d / 2)}" y="${Math.round(dot.y - d / 2)}"/><a:ext cx="${d}" cy="${d}"/></a:xfrm><a:prstGeom prst="ellipse"><a:avLst/></a:prstGeom>${fill}<a:ln><a:noFill/></a:ln></p:spPr><p:txBody><a:bodyPr rtlCol="0" anchor="ctr"/><a:lstStyle/><a:p><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp>`;
}

// The name prints twice on every report page, near the top, and has no digits. Chart labels also repeat, lower down.
function repeatedName(items) {
  const repeats = items.filter(i => !/\d/.test(i.s) && items.filter(o => o.s === i.s).length > 1);
  return repeats.sort((a, b) => b.y - a.y)[0]?.s || '';
}

const MOTIVATORS = ['ECONOMIC', 'CONCEPTUAL', 'POWER', 'AESTHETIC', 'REGULATORY', 'HUMANITARIAN'];

// Each motivator label shares a row with its result, e.g. ECONOMIC | #3 - MODERATE. Null unless all six are found.
function readMotivatorRanks(items) {
  const ranks = {};
  for (const cat of MOTIVATORS) {
    const label = items.find(i => i.s.toUpperCase() === cat);
    if (!label) return null;
    const row = items.filter(o => Math.abs(o.y - label.y) < 4 && o.x > label.x).sort((a, b) => a.x - b.x).map(o => o.s).join(' ');
    const m = row.match(/#\s*([1-6])\s*-\s*(VERY HIGH|VERY LOW|HIGH|MODERATE|LOW)/i);
    if (!m) return null;
    ranks[cat] = { rank: +m[1], level: m[2].toUpperCase() };
  }
  return new Set(Object.values(ranks).map(r => r.rank)).size === 6 ? ranks : null;
}

// A team PDF holds a "The DISC Map" page per person and, on some teams, a "Hierarchy of Motivators" page.
// DISC numbers print in two columns: Natural on the left, Adapted on the right.
async function readTeamPdf(bytes) {
  const pdf = await pdfjsLib.getDocument({ data: bytes.slice(), isEvalSupported: false }).promise;
  const byName = new Map();
  const person = fullName => {
    if (!byName.has(fullName)) byName.set(fullName, { fullName, first: fullName.split(/\s+/)[0], natural: null, adapted: null, disc: null, mot: null });
    return byName.get(fullName);
  };
  let skipped = 0;
  for (let p = 1; p <= pdf.numPages; p++) {
    const tc = await (await pdf.getPage(p)).getTextContent();
    const items = tc.items.filter(i => i.str.trim()).map(i => ({ s: i.str.trim(), x: i.transform[4], y: i.transform[5] }));
    const title = items.findIndex(i => /^The DISC Map/.test(i.s));
    const motTitle = items.findIndex(i => /^Hierarchy of Motivators/i.test(i.s));
    if (title >= 0) {
      const name = repeatedName(items.slice(title + 1).filter(i => !/^™$/.test(i.s))) || `Page ${p}`;
      const numbers = items.filter(i => /^\d{1,2}$/.test(i.s) && i.y < 130);
      const natural = numbers.find(i => i.x < 130), adapted = numbers.find(i => i.x >= 130);
      Object.assign(person(name), { natural: natural ? +natural.s : null, adapted: adapted ? +adapted.s : null, disc: { bytes, pages: [p - 1] } });
    } else if (motTitle >= 0) {
      const name = repeatedName(items) || `Page ${p}`;
      person(name).mot = { bytes, pages: [p - 1], ranks: readMotivatorRanks(items) };
    } else skipped++;
  }
  await pdf.destroy();
  return { people: [...byName.values()], skipped };
}

const xmlEsc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function nameShapes(fit, startId) {
  return placedNames(fit).map(({ name, x: cx, y: lineY, size }, i) => {
    const w = Math.round(textWidthPt(name, size) * 12700 + 25400), h = Math.round(1.22 * size * 12700);
    return `<p:sp><p:nvSpPr><p:cNvPr id="${startId + i}" name="Name ${xmlEsc(name)}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${Math.round(cx - w / 2)}" y="${Math.round(lineY - h / 2)}"/><a:ext cx="${w}" cy="${h}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></p:spPr><p:txBody><a:bodyPr wrap="none" lIns="0" tIns="0" rIns="0" bIns="0" rtlCol="0" anchor="ctr"><a:noAutofit/></a:bodyPr><a:lstStyle/><a:p><a:pPr algn="ctr"/><a:r><a:rPr lang="en-US" sz="${Math.round(size * 100)}" b="1" dirty="0"><a:solidFill><a:srgbClr val="0000CC"/></a:solidFill><a:latin typeface="Calibri" panose="020F0502020204030204" pitchFamily="34" charset="0"/><a:cs typeface="Arial" panose="020B0604020202020204" pitchFamily="34" charset="0"/></a:rPr><a:t>${xmlEsc(name)}</a:t></a:r></a:p></p:txBody></p:sp>`;
  }).join('');
}

// people: [{ name, natural, adapted }]. Plots Natural; with no Natural number, plots Adapted and marks the name with *.
function planWheel(people) {
  const byBox = new Map(), unplotted = [];
  for (const p of people) {
    const box = p.natural ?? p.adapted;
    if (!boxOf(box)) { unplotted.push(p.name); continue; }
    const label = p.natural == null ? '*' + p.name : p.name;
    if (!byBox.has(box)) byBox.set(box, []);
    byBox.get(box).push(label);
  }
  const fits = [...byBox].sort((a, b) => a[0] - b[0]).map(([n, names]) => fitBox(n, names));
  layoutCallouts(fits);
  return { fits, unplotted };
}

// Keep the company name on one line; the fixed text below the title has no room for a third line.
function titleSize(company) {
  const room = (7772400 - 182880) / 12700;
  for (let sz = 28; sz > 18; sz--) if (textWidthPt(company, sz) <= room) return sz;
  return 18;
}

async function buildDiscMap(templateBytes, { company, footer, people }) {
  const zip = await JSZip.loadAsync(templateBytes);
  const plan = planWheel(people);
  let slide = await zip.file('ppt/slides/slide1.xml').async('string');
  const sz = titleSize(company);
  slide = slide.replace(/(<a:rPr[^>]*?)sz="2800"([^>]*>(?:(?!<\/a:rPr>).)*<\/a:rPr><a:t>)Company Name(<\/a:t>)/s, `$1sz="${sz * 100}"$2${xmlEsc(company)}$3`);
  let id = 100, shapes = '';
  for (const f of plan.fits) {
    if (f.callout) { shapes += calloutShapes(f, id); id += 2; }
    shapes += nameShapes(f, id); id += f.names.length;
  }
  slide = slide.replace('</p:spTree>', shapes + '</p:spTree>');
  zip.file('ppt/slides/slide1.xml', slide, { createFolders: false });
  if (footer) {
    let layout = await zip.file('ppt/slideLayouts/slideLayout1.xml').async('string');
    layout = layout.replace(/<a:t>For more information[^<]*<\/a:t>/, `<a:t>${xmlEsc(footer)}</a:t>`);
    zip.file('ppt/slideLayouts/slideLayout1.xml', layout, { createFolders: false });
  }
  const bytes = await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
  return { bytes, plan };
}
