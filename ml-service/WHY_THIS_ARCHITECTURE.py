"""
Root cause explanation / reference commit.

WHY pdf-parse BREAKS IN NEXT.JS:
- pdf-parse is a CommonJS-only library.
- Next.js App Router bundles server code with Webpack using ESM by default.
- When Webpack processes a `require("pdf-parse")`, it wraps the module in
  an ESM interop object: { default: [Function] }
- This makes `typeof pdf === "function"` → FALSE, because pdf is now an object.
- All workarounds (pdf.default, pdf.default.default) are fragile and version-specific.

CORRECT FIX (implemented):
- Remove pdf-parse from Next.js completely.
- All PDF parsing happens inside the Python FastAPI /score endpoint (pdfminer).
- Next.js downloads the PDF as raw bytes (ArrayBuffer) from Google Drive.
- It sends those bytes as a multipart file to the FastAPI service.
- FastAPI returns { score, matched_keywords } in < 2 seconds.

BENEFITS:
- No more ESM/CJS interop issues.
- PDF parsing is handled by pdfminer (more reliable for multi-page PDFs).
- ML scoring is done by SentenceTransformers (more accurate than Gemini-only).
- Next.js stays lean, stateless, and fast.
"""
