# DISC Map Builder

A browser-only tool for team DISC and Motivators summaries. Drop in a team's MapMyStrengths PDF and it:

- places each person's Natural DISC style in their box on the DISC Map, downloadable as **PowerPoint** or **PDF**;
- builds the team's **Motivators Map**, downloadable as **PDF** or **Excel** (when the PDF has Motivators pages);
- saves each person's **individual DISC and Motivators reports** as separate PDFs, one at a time or all in a zip.

Everything runs in the visitor's browser. PDFs are read on the visitor's computer and nothing is uploaded or stored.

## What's here

| Path | What it is |
|---|---|
| `index.html` | The app page. It loads the files below by relative path, so keep them together. |
| `disc-map-engine.js` | Reads team PDFs and places names on the wheel. |
| `disc-map-exports.js` | Builds the DISC PDF and the Motivators PDF and Excel file. |
| `disc-map-template.b64.txt` | The DISC Map PowerPoint template, encoded as text. |
| `fonts/` | Carlito regular and bold (SIL Open Font License, see `fonts/OFL.txt`). Carlito has Calibri's exact letter widths, so the PDF matches the PowerPoint. |
| `standalone/disc-map-builder-standalone.html` | The whole app in one file (about 3.4 MB), with the template and fonts built in. Use this where only a single pasted HTML file is allowed. |
| `template/DISC Map Template.pptx` | The template as a normal PowerPoint file. |
| `docs/REBUILD-SPEC.md` | How the app works, every rule it follows, and a test checklist. |
| `docs/AI-STUDIO-PROMPTS.md` | Prompts for setting it up in GoHighLevel AI Studio. |

## Running it

Serve the repo's top folder from any web server and open `index.html`. Opening the file straight from disk won't work for the multi-file version, because browsers block it from loading its neighbouring files. The standalone file can be opened straight from disk.

To try it locally:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Outside libraries

The page loads six libraries from public sites:
- pdf.js 3.11.174 and its worker, JSZip 3.10.1, pdf-lib 1.17.1 and ExcelJS 4.4.0, all from cdnjs.cloudflare.com;
- @pdf-lib/fontkit 1.1.1, from cdn.jsdelivr.net.

The exact URLs are in `docs/REBUILD-SPEC.md`.

## Note on the template artwork

The DISC Map template contains the wheel and FIND/GRIND/MIND artwork and the Paragon Resources footer from the client's existing summaries. Keep this repository private unless the client approves sharing that artwork.
