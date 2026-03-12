/**
 * usePdfDownload
 * ──────────────────────────────────────────────────────────────────────────────
 * Generates a branded, watermarked PDF entirely client-side using pdf-lib
 * (loaded from CDN via dynamic import).  No server round-trip required.
 *
 * Usage:
 *   const { downloading, downloadNotesPdf, downloadExercisePdf } = usePdfDownload();
 *
 * downloadNotesPdf(note, selectedExerciseIds)
 *   – note           : full topic object (with .content HTML, .exercises, etc.)
 *   – selectedExerciseIds : Set of exercise IDs to include (empty = notes only)
 *
 * downloadExercisePdf(exercise, note)
 *   – standalone exercise PDF
 */

import { useState, useCallback } from "react";

// ─── Brand constants ──────────────────────────────────────────────────────────

const BRAND = {
  name:    "Hone Your Marks",
  domain:  "www.honeyourmarks.com",
  email:   "ask@honeyourmarks.com",
  phones:  "+254 724 094 472  /  +254 748 800 714",
  primary: [0.91, 0.29, 0.047],   // #E84A0C  as rgb 0-1
  dark:    [0.04, 0.08, 0.13],    // #0A1420
  white:   [1, 1, 1],
  muted:   [0.55, 0.55, 0.6],
};

// A4 dimensions in points (72pt = 1 inch)
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 50;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ─── HTML → plain-text paragraphs ─────────────────────────────────────────────
// DOMParser is available in all modern browsers.
// We convert Quill HTML to an array of { type, text, indent } objects.

function parseHtml(html) {
  if (!html) return [];
  const doc  = new DOMParser().parseFromString(html, "text/html");
  const body = doc.body;
  const lines = [];

  function indentOf(el) {
    const cls = el.className ?? "";
    const m   = cls.match(/ql-indent-(\d)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  function textOf(el) {
    // Decode &nbsp; → space, trim runs of spaces
    return (el.textContent ?? "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  }

  let listCounter = {};   // track ordered list numbering per indent

  body.childNodes.forEach(node => {
    if (node.nodeType !== 1) return;
    const tag    = node.tagName.toLowerCase();
    const indent = indentOf(node);
    const text   = textOf(node);

    if (!text) return;

    if (tag === "ol" || tag === "ul") {
      // Direct list container — recurse into li children
      node.querySelectorAll("li").forEach((li, idx) => {
        const liIndent = indentOf(li);
        const liText   = textOf(li);
        if (!liText) return;
        lines.push({
          type:   tag === "ol" ? "ordered" : "bullet",
          text:   liText,
          indent: liIndent,
          num:    idx + 1,
        });
      });
      return;
    }

    lines.push({ type: "para", text, indent });
  });

  return lines;
}

// ─── Load pdf-lib from CDN ────────────────────────────────────────────────────

let _pdfLib = null;
async function getPdfLib() {
  if (_pdfLib) return _pdfLib;
  // Use the UMD build from cdnjs
  await new Promise((resolve, reject) => {
    if (window.PDFLib) { resolve(); return; }
    const s   = document.createElement("script");
    s.src     = "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
    s.onload  = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  _pdfLib = window.PDFLib;
  return _pdfLib;
}

// ─── Core PDF builder ─────────────────────────────────────────────────────────

async function buildPdf({ title, subject, authorName, sections, isWatermarked = false }) {
  const { PDFDocument, rgb, StandardFonts, degrees } = await getPdfLib();

  const pdfDoc  = await PDFDocument.create();
  pdfDoc.setTitle(title);
  pdfDoc.setAuthor(BRAND.name);
  pdfDoc.setSubject(subject ?? "");
  pdfDoc.setCreator(BRAND.name);
  pdfDoc.setProducer(BRAND.domain);

  const fontReg  = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontObl  = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // ── Colour helpers ──
  const C = {
    primary : rgb(...BRAND.primary),
    dark    : rgb(...BRAND.dark),
    white   : rgb(...BRAND.white),
    muted   : rgb(...BRAND.muted),
    lightBg : rgb(0.96, 0.97, 0.98),
    border  : rgb(0.88, 0.88, 0.90),
    accent  : rgb(0.91, 0.29, 0.047),
  };

  let page      = null;
  let cursorY   = 0;
  let pageIndex = 0;

  // ── Add a fresh page ──
  function newPage() {
    page      = pdfDoc.addPage([PAGE_W, PAGE_H]);
    pageIndex = pdfDoc.getPageCount();
    cursorY   = PAGE_H - MARGIN;
    drawHeader();
    drawWatermark();
    cursorY -= 20; // space after header
  }

  // ── Draw branded header (every page) ──
  function drawHeader() {
    // Accent bar
    page.drawRectangle({
      x: 0, y: PAGE_H - 32,
      width: PAGE_W, height: 32,
      color: C.primary,
    });
    // Brand name
    page.drawText(BRAND.name.toUpperCase(), {
      x: MARGIN, y: PAGE_H - 22,
      size: 11, font: fontBold, color: C.white,
    });
    // Domain
    page.drawText(BRAND.domain, {
      x: PAGE_W - MARGIN - fontReg.widthOfTextAtSize(BRAND.domain, 8),
      y: PAGE_H - 22,
      size: 8, font: fontReg, color: C.white,
    });
  }

  // ── Draw footer (every page) ──
  function drawFooter() {
    const footerY = 28;
    page.drawRectangle({
      x: 0, y: 0,
      width: PAGE_W, height: footerY + 8,
      color: C.dark,
    });
    const left  = `Phone ${BRAND.phones}`;
    const right = `Email  ${BRAND.email}`;
    const copy  = `© ${new Date().getFullYear()} ${BRAND.name}  ·  ${BRAND.domain}`;
    page.drawText(copy, {
      x: MARGIN, y: 18,
      size: 7, font: fontReg, color: C.muted,
    });
    page.drawText(right, {
      x: PAGE_W - MARGIN - fontReg.widthOfTextAtSize(right, 7),
      y: 18,
      size: 7, font: fontReg, color: C.muted,
    });
    page.drawText(`Page ${pageIndex}`, {
      x: PAGE_W / 2 - 12, y: 8,
      size: 6, font: fontReg, color: rgb(0.5, 0.5, 0.5),
    });
  }

  // ── Diagonal watermark ──
  function drawWatermark() {
    const wText = isWatermarked ? `${BRAND.name.toUpperCase()}  ·  ${BRAND.domain}` : BRAND.name.toUpperCase();
    const opacity = isWatermarked ? 0.07 : 0.04;
    // Draw multiple diagonal lines
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        page.drawText(wText, {
          x: -40 + col * 200,
          y: 80 + row * 130,
          size: 11,
          font: fontBold,
          color: C.primary,
          opacity,
          rotate: degrees(32),
        });
      }
    }
    if (isWatermarked) {
      // Extra "PARTIAL ACCESS" stamp centre
      page.drawText("PARTIAL ACCESS", {
        x: PAGE_W / 2 - 90,
        y: PAGE_H / 2 - 10,
        size: 36,
        font: fontBold,
        color: rgb(0.91, 0.29, 0.047),
        opacity: 0.05,
        rotate: degrees(-28),
      });
    }
  }

  // ── Text wrapping ──
  function wrapText(text, font, size, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let   cur   = "";
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w;
      if (font.widthOfTextAtSize(test, size) > maxWidth) {
        if (cur) lines.push(cur);
        cur = w;
      } else {
        cur = test;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  // ── Ensure enough vertical space; start new page if needed ──
  function ensureSpace(needed) {
    if (cursorY - needed < 55) { // 55 = footer height + buffer
      drawFooter();
      newPage();
    }
  }

  // ── Draw a text block with wrapping ──
  function drawTextBlock(text, { font = fontReg, size = 10, color = C.dark, indent = 0, lineGap = 5, prefix = "" } = {}) {
    const maxW    = CONTENT_W - indent * 16;
    const fullTxt = prefix ? `${prefix}${text}` : text;
    const wrapped = wrapText(fullTxt, font, size, maxW);
    for (const line of wrapped) {
      ensureSpace(size + lineGap);
      page.drawText(line, {
        x: MARGIN + indent * 16,
        y: cursorY,
        size, font, color,
      });
      cursorY -= (size + lineGap);
    }
  }

  function space(pts = 8) {
    cursorY -= pts;
  }

  // ── Draw a divider ──
  function divider(color = C.border) {
    ensureSpace(10);
    page.drawLine({
      start: { x: MARGIN, y: cursorY },
      end:   { x: PAGE_W - MARGIN, y: cursorY },
      thickness: 0.5,
      color,
    });
    cursorY -= 10;
  }

  // ── Draw a section chip (coloured label) ──
  function sectionChip(label, chipColor) {
    ensureSpace(24);
    const pad = 8;
    const w   = fontBold.widthOfTextAtSize(label, 8) + pad * 2;
    page.drawRectangle({
      x: MARGIN, y: cursorY - 4,
      width: w, height: 16,
      color: chipColor,
      borderRadius: 4,
    });
    page.drawText(label, {
      x: MARGIN + pad, y: cursorY,
      size: 8, font: fontBold, color: C.white,
    });
    cursorY -= 22;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ── COVER PAGE ──
  // ─────────────────────────────────────────────────────────────────────────
  newPage();

  // Big accent block top
  page.drawRectangle({ x: 0, y: PAGE_H - 32, width: PAGE_W, height: 32, color: C.primary });
  page.drawText(BRAND.name.toUpperCase(), { x: MARGIN, y: PAGE_H - 22, size: 11, font: fontBold, color: C.white });
  page.drawText(BRAND.domain, {
    x: PAGE_W - MARGIN - fontReg.widthOfTextAtSize(BRAND.domain, 8),
    y: PAGE_H - 22, size: 8, font: fontReg, color: C.white,
  });

  // Cover hero block
  const heroH = 160;
  page.drawRectangle({ x: MARGIN, y: PAGE_H - 32 - heroH - 20, width: CONTENT_W, height: heroH, color: C.dark, borderRadius: 8 });

  // Subject chip on hero
  if (subject) {
    page.drawRectangle({
      x: MARGIN + 20, y: PAGE_H - 32 - 20 - 30,
      width: fontBold.widthOfTextAtSize(subject.toUpperCase(), 8) + 16,
      height: 16, color: C.primary, borderRadius: 3,
    });
    page.drawText(subject.toUpperCase(), {
      x: MARGIN + 28, y: PAGE_H - 32 - 20 - 24,
      size: 8, font: fontBold, color: C.white,
    });
  }

  // Title
  const titleLines = wrapText(title, fontBold, 22, CONTENT_W - 40);
  let titleY = PAGE_H - 32 - 68;
  for (const tl of titleLines) {
    page.drawText(tl, { x: MARGIN + 20, y: titleY, size: 22, font: fontBold, color: C.white });
    titleY -= 28;
  }

  // Author
  if (authorName) {
    page.drawText(`By ${authorName}`, {
      x: MARGIN + 20, y: PAGE_H - 32 - heroH - 6,
      size: 9, font: fontObl, color: rgb(0.7, 0.7, 0.75),
    });
  }

  // Move cursor below hero
  cursorY = PAGE_H - 32 - heroH - 50;

  // About box
  page.drawRectangle({
    x: MARGIN, y: cursorY - 80,
    width: CONTENT_W, height: 82,
    color: C.lightBg, borderRadius: 6,
  });
  page.drawText("ABOUT HONE YOUR MARKS", {
    x: MARGIN + 16, y: cursorY - 14,
    size: 8, font: fontBold, color: C.primary,
  });
  const aboutText = "Hone Your Marks is a premier online learning platform dedicated to helping students achieve academic excellence. We provide high-quality notes, practise exercises, recorded lessons, and personalised feedback from experienced educators.";
  const aboutLines = wrapText(aboutText, fontReg, 9, CONTENT_W - 32);
  let aboutY = cursorY - 28;
  for (const al of aboutLines) {
    page.drawText(al, { x: MARGIN + 16, y: aboutY, size: 9, font: fontReg, color: C.dark });
    aboutY -= 13;
  }
  cursorY -= 100;

  // Contact row
  space(10);
  page.drawText("Phone " + BRAND.phones, { x: MARGIN, y: cursorY, size: 9, font: fontReg, color: C.muted });
  cursorY -= 14;
  page.drawText("Email  " + BRAND.email, { x: MARGIN, y: cursorY, size: 9, font: fontReg, color: C.muted });
  cursorY -= 14;
  page.drawText("Website " + BRAND.domain, { x: MARGIN, y: cursorY, size: 9, font: fontReg, color: C.primary });
  cursorY -= 30;
  drawFooter();

  // ─────────────────────────────────────────────────────────────────────────
  // ── CONTENT SECTIONS ──
  // ─────────────────────────────────────────────────────────────────────────
  for (const section of sections) {
    newPage();

    // Section title bar
    page.drawRectangle({ x: MARGIN, y: cursorY - 4, width: CONTENT_W, height: 26, color: C.lightBg, borderRadius: 4 });
    page.drawRectangle({ x: MARGIN, y: cursorY - 4, width: 4, height: 26, color: C.primary });
    page.drawText((section.title ?? "").toUpperCase(), {
      x: MARGIN + 12, y: cursorY + 5,
      size: 11, font: fontBold, color: C.dark,
    });
    cursorY -= 36;

    if (section.instructions) {
      drawTextBlock(section.instructions, { font: fontObl, size: 9.5, color: C.muted });
      space(4);
    }

    // Render parsed lines
    for (const line of section.lines) {
      switch (line.type) {
        case "para":
          drawTextBlock(line.text, { indent: line.indent, size: 10 });
          space(3);
          break;
        case "ordered":
          drawTextBlock(line.text, {
            indent: line.indent + 1,
            prefix: `${line.num}.  `,
            size: 10,
          });
          space(2);
          break;
        case "bullet":
          drawTextBlock(line.text, {
            indent: line.indent + 1,
            prefix: "•  ",
            size: 10,
          });
          space(2);
          break;
        default:
          break;
      }
    }

    drawFooter();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ── BACK COVER / MARKETING PAGE ──
  // ─────────────────────────────────────────────────────────────────────────
  newPage();
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: C.dark });
  // Re-draw header over dark bg
  page.drawRectangle({ x: 0, y: PAGE_H - 32, width: PAGE_W, height: 32, color: C.primary });
  page.drawText(BRAND.name.toUpperCase(), { x: MARGIN, y: PAGE_H - 22, size: 11, font: fontBold, color: C.white });

  const marketLines = [
    { text: "STUDY SMARTER.", size: 32, font: fontBold, color: C.white },
    { text: "SCORE HIGHER.", size: 32, font: fontBold, color: C.primary },
    { text: " ", size: 14 },
    { text: "Quality notes · Practise exercises · Video lessons", size: 12, font: fontReg, color: rgb(0.7, 0.75, 0.8) },
    { text: "Expert feedback · Progress tracking", size: 12, font: fontReg, color: rgb(0.7, 0.75, 0.8) },
    { text: " ", size: 20 },
    { text: `Visit us at  ${BRAND.domain}`, size: 13, font: fontBold, color: C.white },
    { text: `Email: ${BRAND.email}`, size: 11, font: fontReg, color: C.muted },
    { text: `Phone: ${BRAND.phones}`, size: 11, font: fontReg, color: C.muted },
  ];

  let mY = PAGE_H / 2 + 80;
  for (const ml of marketLines) {
    const f = ml.font ?? fontBold;
    page.drawText(ml.text, {
      x: MARGIN, y: mY,
      size: ml.size, font: f,
      color: ml.color ?? C.white,
    });
    mY -= (ml.size + 8);
  }

  // QR placeholder box
  page.drawRectangle({ x: PAGE_W - 120, y: PAGE_H / 2 - 30, width: 80, height: 80, color: rgb(0.1, 0.15, 0.22), borderRadius: 6 });
  page.drawText("Scan to visit", { x: PAGE_W - 113, y: PAGE_H / 2 - 42, size: 7, font: fontReg, color: C.muted });
  page.drawText(BRAND.domain, { x: PAGE_W - 118, y: PAGE_H / 2 + 60, size: 7, font: fontBold, color: C.muted });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

// ─── Trigger browser download ─────────────────────────────────────────────────

function triggerDownload(bytes, filename) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ─── Public hook ─────────────────────────────────────────────────────────────

export function usePdfDownload() {
  const [downloading, setDownloading] = useState(false);
  const [error, setError]             = useState(null);

  /**
   * Download a combined notes + selected-exercises PDF.
   * @param {object} note               - full topic object
   * @param {Set}    selectedExerciseIds - Set of exercise IDs to include
   * @param {boolean} isWatermarked     - partial-access watermark flag
   */
  const downloadNotesPdf = useCallback(async (note, selectedExerciseIds = new Set(), isWatermarked = false) => {
    setDownloading(true);
    setError(null);
    try {
      const subject    = note.subject?.name ?? note.subject_name ?? "";
      const authorFirst = note.author?.first_name ?? "";
      const authorLast  = note.author?.last_name  ?? "";
      const authorName  = [authorFirst, authorLast].filter(Boolean).join(" ") || "Hone Your Marks";

      const sections = [];

      // Notes content section
      if (note.content) {
        sections.push({
          title: note.title ?? "Notes",
          instructions: note.description ?? null,
          lines: parseHtml(note.content),
        });
      }

      // Selected exercises
      const exercises = (note.exercises ?? []).filter(ex => selectedExerciseIds.has(ex.id));
      for (const ex of exercises) {
        sections.push({
          title: `Exercise: ${ex.title ?? "Exercise"}  [${(ex.level ?? "").toUpperCase()}]`,
          instructions: ex.instructions ?? null,
          lines: parseHtml(ex.content),
        });
      }

      const bytes    = await buildPdf({ title: note.title ?? "Notes", subject, authorName, sections, isWatermarked });
      const safeName = (note.title ?? "notes").replace(/[^a-z0-9]/gi, "_").toLowerCase();
      triggerDownload(bytes, `${safeName}_hone_your_marks.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setError("Could not generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }, []);

  /**
   * Download a single exercise as PDF.
   */
  const downloadExercisePdf = useCallback(async (exercise, note, isWatermarked = false) => {
    setDownloading(true);
    setError(null);
    try {
      const subject    = note?.subject?.name ?? "";
      const authorName = "Hone Your Marks";
      const sections   = [{
        title: exercise.title ?? "Exercise",
        instructions: exercise.instructions ?? null,
        lines: parseHtml(exercise.content),
      }];

      const bytes    = await buildPdf({ title: exercise.title ?? "Exercise", subject, authorName, sections, isWatermarked });
      const safeName = (exercise.title ?? "exercise").replace(/[^a-z0-9]/gi, "_").toLowerCase();
      triggerDownload(bytes, `${safeName}_hone_your_marks.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setError("Could not generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }, []);

  return { downloading, error, downloadNotesPdf, downloadExercisePdf };
}

