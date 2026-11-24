# Prompts for GoHighLevel AI Studio

Use **Prompt 1** first. It has AI Studio build the page and drop in the finished app, which is the safest path because the app's logic is already written and tested. Use **Prompt 2** only if AI Studio won't accept the code. The follow-up prompts fix the common problems.

The repo is private, so get the files with **Code → Download ZIP** on GitHub, or through AI Studio's own GitHub connection if it has one.

Replace anything in [square brackets] before pasting.

---

## Prompt 1: Build the page and install the finished app (recommended)

```
Build a single-page internal tool called "DISC Map Builder" for [client name].

Page layout:
- A simple header with [logo / company name] on the left and the title "DISC Map Builder".
- Below it, ONE full-width section containing a Custom Code (HTML/CSS/JS) element. This element will hold the entire tool. Give it the full content width, no max height, no inner padding, and no scroll container. It must grow to the height of its content.
- A short footer: "[footer text, e.g. Competitive Edge | 770.487.6460]".
- Use these brand colors for the header and footer only: [colors]. Do not restyle anything inside the Custom Code element.

Important rules for the Custom Code element:
- I will paste the tool's complete HTML into it myself. Do not generate, rewrite, shorten, reformat, or "improve" that code, now or in any later change.
- The code loads JavaScript libraries from cdnjs.cloudflare.com and cdn.jsdelivr.net. Allow those scripts.
- The tool saves files (PowerPoint, PDF, Excel, ZIP) through the browser. If the element runs in an iframe, the iframe must allow downloads and scripts (sandbox "allow-scripts allow-same-origin allow-downloads allow-popups").
- The tool reads PDFs the visitor selects, entirely in the browser. It needs no forms, no contact capture, no workflows, and no GHL data.

Do not add any other sections, pop-ups, chat widgets, or forms to this page.
```

**After the page is built:** open the Custom Code element and paste the entire contents of `standalone/disc-map-builder-standalone.html`, from `<!doctype html>` to `</html>`. Save and preview.

**If AI Studio lets you upload files, or connects to GitHub:** use the app files at the top of the repo instead, with this prompt:

```
Add these files to this project exactly as they are: index.html, disc-map-engine.js, disc-map-exports.js, disc-map-template.b64.txt and the fonts folder (carlito-regular.ttf, carlito-bold.ttf, OFL.txt). Serve index.html as the page at /disc-map-builder (or embed it full-width in the main section). Keep the file names and folder structure unchanged, because the page loads the other files by those relative paths. Do not edit any of these files.
```

---

## Prompt 2: Recreate the tool from a description (only if the code can't be installed)

Use this only as a last resort. A rebuild from a description will not match the tested version exactly, so check it against the test list in `REBUILD-SPEC.md`. Attach or paste `REBUILD-SPEC.md` along with this prompt if AI Studio accepts files.

```
Build a browser-only web tool called "DISC Map Builder". Everything runs in the visitor's browser. Nothing is uploaded or stored on a server.

INPUT
- The visitor drops one or more PDF files exported from MapMyStrengths. Each person has a page titled "The DISC Map" and may also have a page containing "Hierarchy of Motivators".
- Read the PDFs with pdf.js 3.11.174 (cdnjs).
- On a DISC Map page, the person's full name appears twice near the top: use the highest repeated text that has no digits. Two numbers (1 to 60) print near the bottom: the LEFT one (x < 130pt) is Natural, the RIGHT one is Adapted. Either may be missing.
- On a Motivators page, each of ECONOMIC, CONCEPTUAL, POWER, AESTHETIC, REGULATORY, HUMANITARIAN sits on the same row as text like "#3 - MODERATE" (rank 1-6, and a level of VERY HIGH, HIGH, MODERATE, LOW or VERY LOW).
- Merge pages by person name. A later PDF replaces only the pages it contains for that person.

TEAM TABLE (one row per person)
- Columns: On map (checkbox), Name on map (editable; default first name, or first name plus last initial when two people share a first name, e.g. "Mary L."), Full name, Save report (links to save that person's DISC page and Motivators page as separate PDFs), Natural, Adapted, Box, Size, Fit status, and an × to remove the person.
- A "Save all reports (.zip)" button saves every person's report pages as separate PDFs named "[Full name] - DISC.pdf" and "[Full name] - Motivators.pdf". Use pdf-lib 1.17.1 to copy the pages and JSZip 3.10.1 for the zip.
- Fields: Company name (defaults to the PDF file name without .pdf), and Footer (default "For more information on our assessments, please call Paragon Resources at 770.319.0310 or visit www.ParagonResources.com").

DISC MAP (PowerPoint and PDF)
- Fill in the provided template "DISC Map Template.pptx" (portrait 8.5 x 11 in) using JSZip: replace the title text "Company Name" with the company name, replace the footer text, and add one text box per name on slide 1.
- Plot each person's NATURAL number only. If there is no Natural number, plot the Adapted number and put "*" before the name.
- Each number owns a box on the wheel: the cell just clockwise of that number's line. Wheel center on the slide: x = 3,899,478 EMU, y = 4,961,515 EMU; 1 wheel unit = 5,672 EMU across and 5,658 EMU down. Ring radii in wheel units: 85.7, 153.5, 221, 288, 355.5. Boxes: 57-60 are the four 90-degree quadrants of the center circle starting at the top (57 top-right, then clockwise); 41-56 are 22.5-degree boxes between radius 85.7 and 153.5 starting at the top line; 25-40 the same between 153.5 and 221; 9-24 the same between 221 and 288; 1-8 are 45-degree boxes between 288 and 355.5 starting at 22.5 degrees.
- Names: Calibri bold, color #0000CC, one text box per name, no wrapping. Center the name in its box at the largest size from 11pt down to 9pt (in 0.5pt steps) at which it fits inside the box without touching a line. Only if it can't fit centered at any size, move it the shortest distance that makes it fit. Names that share a box are stacked, with lines 1.1 x the font size apart.
- If a stack of 2 or more names can't fit its box even at 9pt, place the stack in open space outside the wheel (between the wheel and the fixed text blocks), at up to 11pt, with a 2pt #0000CC line from the stack to a 0.1-inch #0000CC dot at the center of the box. Lines must not cross names, text blocks, or each other.
- A single name too wide for its box stays in the box at 9pt.
- Shrink the company name to keep it on one line (minimum 18pt).
- Show a live preview of the slide on the page.
- Download as .pptx (the filled template) and as .pdf (draw the same slide with pdf-lib 1.17.1 plus @pdf-lib/fontkit 1.1.1, embedding the Carlito font in full with ligatures turned off, so text matches Calibri).

MOTIVATORS MAP (PDF and Excel), shown only when Motivators pages exist
- Landscape, one page. Title "[Company] Motivators Map" in Arial 16 bold #0000CC.
- One row per person (name in Arial 14 bold #0000CC), then six cells with their motivators in rank order 1-6 (Arial 12, title case), with a dark divider column between ranks 3 and 4.
- Draw each cell's intensity as a thick outline: Very High #339966, High #CCFF99, Moderate none, Low #FFFF66, Very Low #CC3300.
- Below the table: the six definitions (bold term, then text), and an "Intensity Results" legend listing each level with "3 Standard Deviations - 2%", "2 Standard Deviations - 14%", "1 Standard Deviation - 68%", "2 Standard Deviations - 14%" and "3 Standard Deviations - 2%". Put the footer at the bottom.
- The visitor can reorder people with up/down arrows. Both downloads use that order.
- Excel: use ExcelJS 4.4.0. Column widths A 21.71, B/D/F/H/J/L 15.71, C/E/I/K 1.43, G 0.86 (filled dark). Landscape, fit to one page, centered horizontally, with the footer in the page footer.

Use a clean, professional layout: a team table, then the slide preview with "Download PDF" and "Download PowerPoint" buttons, then the Motivators Map preview with "Download PDF" and "Download Excel" buttons.
```

---

## Follow-up prompts for common problems

**The page is blank, or the slide preview never appears**
```
The DISC Map Builder code inside the Custom Code element isn't running. Please make sure scripts from cdnjs.cloudflare.com and cdn.jsdelivr.net are allowed to load on this page, that the element doesn't strip <script> tags, and that it isn't inside a sandbox that blocks scripts. Do not change the code itself.
```

**The download buttons do nothing**
```
The tool's download buttons don't save files. If the Custom Code element is rendered inside an iframe, add "allow-downloads" (and keep "allow-scripts allow-same-origin") to the iframe's sandbox. Do not change the tool's code.
```

**The tool is cut off or has its own scroll bar**
```
Make the Custom Code section full width with automatic height so the whole tool shows without an inner scroll bar. Remove any max-height, fixed height, or overflow:hidden on that section and its containers.
```

**AI Studio changed the code after a later prompt**
```
Restore the Custom Code element to exactly the code I pasted, and from now on treat that element as locked: do not edit, regenerate, or reformat it when I ask for other changes to the page.
```
(If it can't restore it, paste `standalone/disc-map-builder-standalone.html` again.)
