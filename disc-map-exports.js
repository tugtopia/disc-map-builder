// Downloads beyond the PowerPoint: the DISC Map as a PDF, and the Motivators Map as a PDF and an Excel workbook.

/* ---------- Motivators Map: shared model ---------- */

const MOT_LEVELS = {
  'VERY HIGH': { color: '339966', note: '3 Standard Deviations - 2%' },
  'HIGH': { color: 'CCFF99', note: '2 Standard Deviations - 14%' },
  'MODERATE': { color: null, note: '1 Standard Deviation - 68%' },
  'LOW': { color: 'FFFF66', note: '2 Standard Deviations - 14%' },
  'VERY LOW': { color: 'CC3300', note: '3 Standard Deviations - 2%' },
};
const MOT_DEFINITIONS = [
  ['ECONOMIC: ', 'utilization of time, money, and resources to achieve a measurable return on investment.  ', 'Interests: ', 'practicality, efficiency, conservation.'],
  ['CONCEPTUAL: ', 'search for or pursuit of knowledge and learning.  ', 'Interests: ', 'continuing education, training, lifelong learning, research and analysis.'],
  ['POWER: ', 'pursuit to lead, direct, and control self and others toward success.  ', 'Interests: ', ' leadership roles, strategizing, authority.'],
  ['AESTHETIC: ', 'appreciation and pursuit of form, harmony, beauty, and balance.  ', 'Interests: ', 'personal growth, nature, fine arts, self-help, creativity.'],
  ['REGULATORY: ', 'search for the highest meaning of life.  ', 'Interests: ', 'religion, principled-living, converting others to a system for living, upholding traditions.'],
  ['HUMANITARIAN: ', 'desire to eliminate pain and conflict.  ', 'Interests: ', 'helping others, charitable causes, community activities, volunteer work.'],
];
const titleCaseWord = s => s.charAt(0) + s.slice(1).toLowerCase();

// The PDF library measures with letter-pair kerning but draws without it, so measure letter by letter to match what is drawn.
const drawnWidth = (font, s, size) => [...s].reduce((w, ch) => w + font.widthOfTextAtSize(ch, size), 0);

// One row per person: their six motivators in rank order, each with its intensity.
function motivatorRows(people) {
  return people.filter(p => p.ranks).map(p => ({
    id: p.id, name: p.name,
    cells: Object.entries(p.ranks).sort((a, b) => a[1].rank - b[1].rank).map(([cat, r]) => ({ label: titleCaseWord(cat), level: r.level })),
  }));
}

// Column widths and row heights as in the Motivators Summary workbook (Excel width units, points).
const MOT_COLS = [21.71, 15.71, 1.43, 15.71, 1.43, 15.71, 0.86, 15.71, 1.43, 15.71, 1.43, 15.71];
const RANK_COLS = [1, 3, 5, 7, 9, 11]; // B D F H J L
const DIVIDER_COL = 6;                  // G
const excelColPt = w => Math.trunc(w * 7 + 5) * 0.75;

/* ---------- Motivators Map: Excel ---------- */

async function buildMotivatorsXlsx({ company, footer, rows }) {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Motivators Map', {
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 1, horizontalCentered: true,
      margins: { left: 0.75, right: 0.75, top: 0.5, bottom: 0.5, header: 0.5, footer: 0.25 } },
  });
  ws.columns = MOT_COLS.map(width => ({ width }));
  if (footer) ws.headerFooter.oddFooter = `&C&"Arial,Bold"&10&K0000CC${footer.replace(/&/g, '&&')}`;

  const font = (size, bold = false, color) => ({ name: 'Arial', size, bold, ...(color ? { color: { argb: 'FF' + color } } : {}) });
  const thin = { style: 'thin', color: { argb: 'FF000000' } };
  const thick = color => ({ style: 'thick', color: { argb: 'FF' + color } });
  const dark = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF262626' } };
  const center = { horizontal: 'center', vertical: 'middle' };
  const cell = (r, c) => ws.getCell(r, c + 1);
  let r = 1;

  ws.mergeCells(r, 2, r, 12);
  Object.assign(cell(r, 1), { value: `${company} Motivators Map`, font: font(16, true, '0000CC'), alignment: { horizontal: 'center' } });
  for (let c = 1; c <= 11; c++) cell(r, c).border = { bottom: thin };
  ws.getRow(r).height = 21;
  ws.getRow(++r).height = 7.5;

  // Inside the table: left and right outline, the dark divider, and a bottom line on the last row.
  const tableRow = (height, bottom) => {
    r++;
    ws.getRow(r).height = height;
    cell(r, 1).border = { left: thin, ...(bottom ? { bottom: thin } : {}) };
    cell(r, 11).border = { right: thin, ...(bottom ? { bottom: thin } : {}) };
    for (let c = 2; c <= 10; c++) if (bottom) cell(r, c).border = { bottom: thin };
    cell(r, DIVIDER_COL).fill = dark;
  };

  tableRow(18, true);
  RANK_COLS.forEach((c, i) => Object.assign(cell(r, c), { value: i + 1, font: font(12, true), alignment: center }));
  cell(r, DIVIDER_COL).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
  tableRow(7.5, false);

  rows.forEach((row, i) => {
    const last = i === rows.length - 1;
    tableRow(19.9, last);
    Object.assign(cell(r, 0), { value: row.name, font: font(14, true, '0000CC'), alignment: { horizontal: 'left', vertical: 'middle' } });
    row.cells.forEach((m, k) => {
      const x = cell(r, RANK_COLS[k]), color = MOT_LEVELS[m.level]?.color;
      Object.assign(x, { value: m.label, font: font(12), alignment: center });
      if (color) x.border = { top: thick(color), left: thick(color), bottom: thick(color), right: thick(color) };
    });
    if (!last) tableRow(7.5, false);
  });

  ws.getRow(++r).height = 5.25;
  ws.getRow(++r).height = 5.25;
  for (const [term, text, label, interests] of MOT_DEFINITIONS) {
    r++;
    ws.mergeCells(r, 1, r, 12);
    cell(r, 0).value = { richText: [
      { text: term, font: font(10, true) }, { text, font: font(10) }, { text: label, font: font(10, true) }, { text: interests, font: font(10) },
    ] };
  }

  r++;
  Object.assign(cell(++r, 0), { value: 'Intensity Results', font: font(12, true), alignment: { horizontal: 'center' } });
  ws.getRow(r).height = 17.25;
  ws.getRow(++r).height = 9.75;
  Object.entries(MOT_LEVELS).forEach(([level, { color, note }], i) => {
    if (i) ws.getRow(++r).height = 5.25;
    ws.getRow(++r).height = 16.5;
    const a = cell(r, 0);
    Object.assign(a, { value: level, font: font(12), alignment: center });
    if (color) a.border = { top: thick(color), left: thick(color), bottom: thick(color), right: thick(color) };
    ws.mergeCells(r, 2, r, 4);
    Object.assign(cell(r, 1), { value: note, font: font(10), alignment: center });
  });

  return new Uint8Array(await wb.xlsx.writeBuffer());
}

/* ---------- Motivators Map: PDF (same layout as the workbook, printed landscape on one page) ---------- */

async function buildMotivatorsPdf({ company, footer, rows }) {
  const { PDFDocument, StandardFonts, rgb } = PDFLib;
  const doc = await PDFDocument.create();
  doc.setTitle(`${company} Motivators Map`);
  const W = 792, H = 612, page = doc.addPage([W, H]);
  const reg = await doc.embedFont(StandardFonts.Helvetica), bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const hex = h => rgb(parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255);
  const BLUE = hex('0000CC'), BLACK = hex('000000');
  const safe = s => String(s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/[^\x20-\x7E\xA0-\xFF]/g, '?');

  const colW = MOT_COLS.map(excelColPt), colX = [];
  colW.reduce((x, w, i) => (colX[i] = x, x + w), 0);
  const tableW = colW.reduce((a, b) => a + b, 0);
  const contentH = 21 + 7.5 + 18 + 7.5 + rows.length * 19.9 + Math.max(0, rows.length - 1) * 7.5 + 10.5 + 6 * 12.75 + 12.75 + 17.25 + 9.75 + 5 * 16.5 + 4 * 5.25;
  const k = Math.min(1, (W - 108) / tableW, (H - 36 - 54) / contentH);
  const left = (W - tableW * k) / 2;
  let y = H - 36;
  const X = c => left + colX[c] * k, CW = c => colW[c] * k;
  const text = (s, x, w, rowTop, rowH, size, f, color = BLACK, align = 'center') => {
    s = safe(s);
    const tw = drawnWidth(f, s, size * k);
    const tx = align === 'center' ? x + (w - tw) / 2 : x + 2 * k;
    page.drawText(s, { x: tx, y: rowTop - rowH / 2 - size * k * 0.35, size: size * k, font: f, color });
  };
  const box = (x, top, w, h, color) => page.drawRectangle({ x: x + 1.2 * k, y: top - h + 1.2 * k, width: w - 2.4 * k, height: h - 2.4 * k, borderColor: hex(color), borderWidth: 2.25 * k });
  const line = (x1, y1, x2, y2) => page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness: 0.75 * k, color: BLACK });

  // Title sits on the table's top line.
  let h = 21 * k;
  text(`${company} Motivators Map`, X(1), X(11) + CW(11) - X(1), y, h, 16, bold, BLUE);
  y -= h;
  const tableTop = y;
  line(X(1), tableTop, X(11) + CW(11), tableTop);
  y -= 7.5 * k;

  h = 18 * k;
  RANK_COLS.forEach((c, i) => text(String(i + 1), X(c), CW(c), y, h, 12, bold));
  y -= h;
  line(X(1), y, X(11) + CW(11), y);
  y -= 7.5 * k;

  rows.forEach((row, i) => {
    h = 19.9 * k;
    text(row.name, X(0), CW(0), y, h, 14, bold, BLUE, 'left');
    row.cells.forEach((m, c) => {
      const col = RANK_COLS[c], color = MOT_LEVELS[m.level]?.color;
      if (color) box(X(col), y, CW(col), h, color);
      text(m.label, X(col), CW(col), y, h, 12, reg);
    });
    y -= h;
    if (i < rows.length - 1) y -= 7.5 * k;
  });
  const tableBottom = y;
  line(X(1), tableBottom, X(11) + CW(11), tableBottom);
  line(X(1), tableTop, X(1), tableBottom);
  line(X(11) + CW(11), tableTop, X(11) + CW(11), tableBottom);
  page.drawRectangle({ x: X(DIVIDER_COL), y: tableBottom, width: CW(DIVIDER_COL), height: tableTop - tableBottom - 7.5 * k, color: hex('262626') });

  y -= 10.5 * k;
  for (const parts of MOT_DEFINITIONS) {
    h = 12.75 * k;
    let x = X(0) + 2 * k;
    parts.forEach((part, j) => {
      // Bold terms are drawn without their trailing space and followed by a fixed gap, so no viewer runs them together.
      const f = j % 2 ? reg : bold, s = safe(j % 2 ? part : part.trimEnd());
      page.drawText(s, { x, y: y - h / 2 - 10 * k * 0.35, size: 10 * k, font: f, color: BLACK });
      x += drawnWidth(f, s, 10 * k) + (j % 2 ? 0 : 2.8 * k);
    });
    y -= h;
  }

  y -= 12.75 * k;
  h = 17.25 * k;
  text('Intensity Results', X(0), CW(0), y, h, 12, bold);
  y -= h + 9.75 * k;
  Object.entries(MOT_LEVELS).forEach(([level, { color, note }], i) => {
    if (i) y -= 5.25 * k;
    h = 16.5 * k;
    if (color) box(X(0), y, CW(0), h, color);
    text(level, X(0), CW(0), y, h, 12, reg);
    text(note, X(1), X(3) + CW(3) - X(1), y, h, 10, reg);
    y -= h;
  });

  if (footer) {
    const s = safe(footer), size = 10, tw = drawnWidth(bold, s, size);
    page.drawText(s, { x: (W - tw) / 2, y: 0.25 * 72, size, font: bold, color: BLUE });
  }
  return doc.save();
}

/* ---------- DISC Map: PDF drawn from the finished PowerPoint ---------- */

// PowerPoint sets Calibri lines 1.2 x the font size apart, with the baseline this far below the top of each line.
const PPT_LINE = 1.2, PPT_BASELINE = 0.952;

const fontCache = {};
async function fontBytes(path) {
  if (!fontCache[path]) fontCache[path] = new Uint8Array(await (await fetch(path)).arrayBuffer());
  return fontCache[path];
}

async function cropToPng(blob, crop) {
  const bmp = await createImageBitmap(blob);
  const sx = bmp.width * crop.l, sy = bmp.height * crop.t;
  const sw = bmp.width * (1 - crop.l - crop.r), sh = bmp.height * (1 - crop.t - crop.b);
  const cv = document.createElement('canvas');
  cv.width = Math.round(sw); cv.height = Math.round(sh);
  cv.getContext('2d').drawImage(bmp, sx, sy, sw, sh, 0, 0, cv.width, cv.height);
  return new Uint8Array(await (await new Promise(res => cv.toBlob(res, 'image/png'))).arrayBuffer());
}

async function buildDiscPdf(pptxBytes, title) {
  const { PDFDocument, StandardFonts, rgb, degrees } = PDFLib;
  const A = 'http://schemas.openxmlformats.org/drawingml/2006/main', P = 'http://schemas.openxmlformats.org/presentationml/2006/main';
  const R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
  const zip = await JSZip.loadAsync(pptxBytes);
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  doc.setTitle(title);
  // Embedded whole: the library's font trimming drops glyphs from Carlito. Ligatures off so "ti" stays two letters.
  const plainText = { subset: false, features: { liga: false, clig: false, dlig: false, calt: false, rlig: false } };
  const fonts = {
    reg: await doc.embedFont(await fontBytes('fonts/carlito-regular.ttf'), plainText),
    bold: await doc.embedFont(await fontBytes('fonts/carlito-bold.ttf'), plainText),
    arial: await doc.embedFont(StandardFonts.Helvetica),
    arialBold: await doc.embedFont(StandardFonts.HelveticaBold),
  };
  const PW = 612, PH = 792, E = 12700;
  const page = doc.addPage([PW, PH]);
  page.drawRectangle({ x: 0, y: 0, width: PW, height: PH, color: rgb(1, 1, 1) });
  const hex = h => rgb(parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255);
  const one = (el, ns, tag) => el.getElementsByTagNameNS(ns, tag)[0];
  const xml = async path => new DOMParser().parseFromString(await zip.file(path).async('string'), 'application/xml');
  const rels = async path => {
    const d = await xml(path), map = {};
    for (const r of d.getElementsByTagName('Relationship')) map[r.getAttribute('Id')] = r.getAttribute('Target');
    return map;
  };
  const frame = el => {
    const xf = one(el, A, 'xfrm'), off = one(xf, A, 'off'), ext = one(xf, A, 'ext');
    return { x: +off.getAttribute('x') / E, y: +off.getAttribute('y') / E, w: +ext.getAttribute('cx') / E, h: +ext.getAttribute('cy') / E,
      rot: +(xf.getAttribute('rot') || 0) / 60000, flipH: xf.getAttribute('flipH') === '1', flipV: xf.getAttribute('flipV') === '1' };
  };
  const fillColor = el => one(el, A, 'srgbClr')?.getAttribute('val') || '000000';

  async function drawPicture(pic, base, relMap) {
    const f = frame(pic), blip = one(pic, A, 'blip'), target = relMap[blip.getAttributeNS(R, 'embed')];
    const media = zip.file(new URL(target, 'http://x/' + base).pathname.slice(1));
    const src = one(pic, A, 'srcRect'), c = k => +(src?.getAttribute(k) || 0) / 100000;
    const png = await cropToPng(await media.async('blob'), { l: c('l'), t: c('t'), r: c('r'), b: c('b') });
    page.drawImage(await doc.embedPng(png), { x: f.x, y: PH - f.y - f.h, width: f.w, height: f.h });
  }

  function drawText(sp) {
    const body = one(sp, P, 'txBody');
    if (!body) return;
    const f = frame(sp), bp = one(body, A, 'bodyPr');
    const ins = (k, d) => +(bp.getAttribute(k) ?? d) / E;
    const lIns = ins('lIns', 91440), rIns = ins('rIns', 91440), tIns = ins('tIns', 45720), bIns = ins('bIns', 45720);
    const paras = [...body.getElementsByTagNameNS(A, 'p')].map(p => {
      const pPr = one(p, A, 'pPr'), runs = [];
      let line = [];
      const lines = [line];
      for (const c of p.children) {
        if (c.localName === 'br') { line = []; lines.push(line); continue; }
        if (c.localName !== 'r') continue;
        const rPr = one(c, A, 'rPr');
        const run = { text: one(c, A, 't')?.textContent || '', size: +(rPr?.getAttribute('sz') || 1800) / 100, bold: rPr?.getAttribute('b') === '1',
          color: rPr ? fillColor(rPr) : '000000', face: one(rPr || c, A, 'latin')?.getAttribute('typeface') || 'Calibri' };
        line.push(run); runs.push(run);
      }
      const end = one(p, A, 'endParaRPr');
      const size = runs.length ? Math.max(...runs.map(r => r.size)) : +(end?.getAttribute('sz') || 1800) / 100;
      const spc = one(pPr || p, A, 'lnSpc'), pct = spc ? +(one(spc, A, 'spcPct')?.getAttribute('val') || 100000) / 100000 : 1;
      const aft = one(pPr || p, A, 'spcAft'), after = aft ? +(one(aft, A, 'spcPts')?.getAttribute('val') || 0) / 100 : 0;
      return { lines, size, step: size * PPT_LINE * pct, after, align: pPr?.getAttribute('algn') || 'l' };
    });
    const fontFor = r => r.face === 'Arial' ? (r.bold ? fonts.arialBold : fonts.arial) : (r.bold ? fonts.bold : fonts.reg);
    // The font library can't measure a run that is only spaces; Calibri and Arial spaces are both about 0.23 em.
    const runWidth = r => /^\s*$/.test(r.text) ? r.text.length * (r.face === 'Arial' ? 0.278 : 0.2261) * r.size : drawnWidth(fontFor(r), r.text, r.size);
    const total = paras.reduce((t, p, i) => t + p.lines.length * p.step + (i < paras.length - 1 ? p.after : 0), 0);
    const anchor = bp.getAttribute('anchor') || 't';
    let top = anchor === 'ctr' ? (f.h - total) / 2 : tIns;   // from the box top, in points
    const cx = f.x + f.w / 2, cy = f.y + f.h / 2, th = f.rot * Math.PI / 180;
    for (const p of paras) {
      for (const runs of p.lines) {
        const widths = runs.map(runWidth), lineW = widths.reduce((a, b) => a + b, 0);
        let x = p.align === 'ctr' ? (f.w - lIns - rIns - lineW) / 2 + lIns : p.align === 'r' ? f.w - rIns - lineW : lIns;
        const base = top + p.size * PPT_BASELINE;
        runs.forEach((r, i) => {
          if (r.text.trim()) {
            // Position within the box, relative to its center, turned with the box about that center.
            const lx = x - f.w / 2, ly = base - f.h / 2;
            const px = cx + lx * Math.cos(th) - ly * Math.sin(th), py = cy + lx * Math.sin(th) + ly * Math.cos(th);
            page.drawText(r.text, { x: px, y: PH - py, size: r.size, font: fontFor(r), color: hex(r.color), rotate: degrees(-f.rot) });
          }
          x += widths[i];
        });
        top += p.step;
      }
      top += p.after;
    }
  }

  function drawShape(sp) {
    const geom = one(sp, A, 'prstGeom')?.getAttribute('prst'), spPr = one(sp, P, 'spPr');
    if (geom === 'ellipse') {
      const f = frame(sp);
      page.drawEllipse({ x: f.x + f.w / 2, y: PH - f.y - f.h / 2, xScale: f.w / 2, yScale: f.h / 2, color: hex(fillColor(spPr)) });
    }
    drawText(sp);
  }

  function drawLine(cxn) {
    const f = frame(cxn), ln = one(cxn, A, 'ln');
    const x1 = f.flipH ? f.x + f.w : f.x, x2 = f.flipH ? f.x : f.x + f.w, y1 = f.flipV ? f.y + f.h : f.y, y2 = f.flipV ? f.y : f.y + f.h;
    page.drawLine({ start: { x: x1, y: PH - y1 }, end: { x: x2, y: PH - y2 }, thickness: +(ln?.getAttribute('w') || 12700) / E, color: hex(fillColor(ln || cxn)) });
  }

  for (const base of ['ppt/slideLayouts/slideLayout1.xml', 'ppt/slides/slide1.xml']) {
    const d = await xml(base), relMap = await rels(base.replace(/([^/]+)$/, '_rels/$1.rels'));
    const tree = one(d, P, 'spTree');
    for (const el of tree.children) {
      if (el.localName === 'pic') await drawPicture(el, base, relMap);
      else if (el.localName === 'sp' && !one(el, P, 'ph')) drawShape(el);
      else if (el.localName === 'cxnSp') drawLine(el);
    }
  }
  return doc.save();
}
