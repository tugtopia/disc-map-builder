# DISC Map Builder: rebuild guide

How the app works and every rule it follows, so it can be moved, rebuilt, or adjusted, for example in GoHighLevel AI Studio. Prompts for AI Studio are in `AI-STUDIO-PROMPTS.md` in this folder.

## Getting the files into AI Studio from this private repo

Because the repo is private, AI Studio can't open the files by plain link. Use one of these:

1. **Download and upload.** On GitHub, choose **Code → Download ZIP**, unzip it, and upload the files to AI Studio. Upload the app files (`index.html`, the two `.js` files, `disc-map-template.b64.txt` and `fonts/`) if it accepts files, or paste `standalone/disc-map-builder-standalone.html` into a custom code block if it only accepts pasted code.
2. **AI Studio's own GitHub connection**, if it has one. Connect it to this repo and point it at `index.html`.
3. **Host the app elsewhere** (any static web host) and embed or link it from the GHL site.

Don't let AI Studio's AI regenerate or "improve" the code. It can lose the placement math and the file formats. Paste or upload the code as-is, and have the AI build only the surrounding page.

### Things to check once it's in place
- **Outside code libraries:** if outside scripts are blocked, the page stays blank. The fix is to host the six library files (below) with the page.
- **Downloads:** inside a sandboxed iframe, downloads need the `allow-downloads` permission, or the page should run on its own URL.
- **Size:** check that a custom code block accepts the 3.4 MB standalone file.

## Outside libraries (exact versions)

| Library | URL | Used for |
|---|---|---|
| pdf.js 3.11.174 | `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js` | Reading the team PDF |
| pdf.js worker | `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js` | Same (runs on the page) |
| JSZip 3.10.1 | `https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js` | Filling in the PowerPoint, zipping reports |
| pdf-lib 1.17.1 | `https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js` | Writing PDFs, splitting individual reports |
| fontkit 1.1.1 | `https://cdn.jsdelivr.net/npm/@pdf-lib/fontkit@1.1.1/dist/fontkit.umd.min.js` | Embedding Carlito in the DISC PDF |
| ExcelJS 4.4.0 | `https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js` | Writing the Motivators Excel file |

## What the app does

1. **Input:** one or more MapMyStrengths team PDFs. Each person has a "The DISC Map" page and, on some teams, a "Hierarchy of Motivators" page. More PDFs can be added at any time; a person who appears twice keeps the newer page.
2. **Team table:** one row per person, with these controls:
   - an on/off tick for the map;
   - an editable "name on map" (first name by default, with last initial when two people share a first name, e.g. "Mary L.");
   - "Save report" links for that person's DISC and Motivators pages;
   - Natural and Adapted numbers, the box plotted, the text size, and a fit status;
   - an × to remove the person.
3. **Deck details:** company name (the slide title, defaulting to the PDF's file name) and footer text (remembered in the browser).
4. **Downloads:**
   - DISC Map as **PowerPoint** (the template filled in) and **PDF** (drawn from that same PowerPoint).
   - Motivators Map as **PDF** and **Excel**, only when Motivators pages are present. The row order is set with up and down arrows.
   - **Individual reports:** each person's DISC and Motivators pages as separate PDFs, one at a time or all in a zip.

## Reading the team PDF

- **DISC page:** the title starts "The DISC Map". The name prints twice near the top; the app takes the highest-placed repeated text with no digits. The two numbers print near the bottom of the page: **Natural in the left column** (x < 130 pt) and **Adapted in the right column**. A person may have only one number.
- **Motivators page:** contains "Hierarchy of Motivators". Each of ECONOMIC, CONCEPTUAL, POWER, AESTHETIC, REGULATORY and HUMANITARIAN shares a row with its result, e.g. `#3 - MODERATE`. Levels are VERY HIGH, HIGH, MODERATE, LOW and VERY LOW.
- Pages that are neither are skipped.

## DISC Map rules (agreed with the client)

- **Plot the Natural number only.** With no Natural number, plot the Adapted number and put `*` before the name.
- **Each number has a box:** the cell just clockwise of that number's line on the wheel. Names go inside the box, never on a line. The wheel on the slide shows no numbers.
- **Center first:** a name stays centered in its box if it fits at any size from 11 pt down to 9 pt (the minimum). Only if it can't fit centered does it move off center, as little as possible.
- **Shared boxes:** names in the same box are stacked.
- **Overcrowded boxes:** any stack of 2 or more names that doesn't fit its box at 9 pt goes **outside the wheel**. It's placed in one of 8 open spaces around the wheel, at 11 pt where possible, with a blue line from the stack to a dot at the box's center. Lines avoid names, text blocks and each other.
- **A single name too wide for its box** stays in the box at 9 pt, touching a line, and is shown in red in the preview only. The client's sample for this case is still outstanding.
- **Name style:** Calibri bold, color #0000CC. Each name is its own text box, so it can be nudged in PowerPoint.
- **Title:** the company name, with "DISC Map" on the line below. Long company names shrink to stay on one line, down to 18 pt.
- **Current reports win:** if an old hand-built slide disagrees with a current report, use the report.

### Wheel geometry (in `disc-map-engine.js`)
- **Wheel center on the slide:** (3,899,478 ; 4,961,515) EMU. Scale: 1.363 × 4161.4 EMU per key-wheel pixel across, and 1.363 × 4151.2 down.
- **Ring radii** in key-wheel pixels: 85.7, 153.5, 221, 288, 355.5.
- **Boxes:**

| Numbers | Ring | Boxes |
|---|---|---|
| 57–60 | Center, radius 0 to 85.7 | Four 90° quadrants from the top: 57 is top-right, then clockwise |
| 41–56 | 85.7 to 153.5 | 22.5° boxes, 41 starting at the top line |
| 25–40 | 153.5 to 221 | 22.5° boxes, 25 starting at the top line |
| 9–24 | 221 to 288 | 22.5° boxes, 9 starting at the top line |
| 1–8 | 288 to 355.5 | 45° boxes starting at 22.5° |

- **Fit test:** text widths come from Calibri Bold's real letter widths. Names must clear the box edges by 1.5 key-wheel pixels. Stacked lines are spaced 1.1 × the font size.

## Motivators Map rules (matches the client's existing summaries)

- **Page layout:** landscape, one page. The title reads "[Company] Motivators Map" in Arial 16 bold #0000CC.
- **Table:** one row per person, name in Arial 14 bold #0000CC. Six columns rank motivators 1 to 6 in Arial 12, with a dark divider column after rank 3.
- **Intensity is a thick outline around the cell:**

| Level | Outline color |
|---|---|
| Very High | #339966 |
| High | #CCFF99 |
| Moderate | none |
| Low | #FFFF66 |
| Very Low | #CC3300 |

- **Below the table:** the six definitions (bold term, then text), then the Intensity Results legend with standard deviations, then the footer.
- **Excel version:** the column widths are A 21.71, B/D/F/H/J/L 15.71, C/E/I/K 1.43 and G 0.86. It prints landscape, fitted to one page, centered horizontally, with the footer in the page footer.

## Test checklist (use the client's real files)

- **Pinnacle View Wealth Management Group.pdf** should give 10 people:

| Box | Name |
|---|---|
| 11 | Timothy |
| 20 | *Jack |
| 21 | Jayden |
| 22 | David, Jera |
| 36 | Anne |
| 53 | Stacy |
| 58 | Alison, Jake |
| 60 | Maddie |

  It has no Motivators pages, so the Motivators section stays off.
- **NMA Group.pdf** should give 5 people, each with DISC and Motivators. For example, Nicole's Motivators row reads Power (High), Economic, Conceptual, Regulatory, Humanitarian (Low), Aesthetic (Low).
- **Nashville Legacy Wealth Management Group.pdf** should give 11 people, all matching the client's "Nashville Legacy ... Motivators Summary", with Russell's Aesthetic outlined red.
- **Comprehensive Financial Solutions.pdf** should give 23 people. Six stacks go outside the wheel, and Zach Kirka is in box 56.

## Claude-specific code to know about

The download code first checks for a Claude-only feature (`window.claude`). Outside Claude it isn't there, so the app falls back to a normal browser download automatically. Nothing needs changing.
