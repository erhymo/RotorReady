#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const pdfPath = process.argv[2] || path.join(process.cwd(), 'AS350 B3 E', '1_index-2.pdf');
const outTxt = process.argv[3] || path.join(process.cwd(), 'AS350 B3 E', '1_index-2.txt');
const outPages = path.join(path.dirname(outTxt), '1_index-2.pages.json');

async function extract() {
  if (!fs.existsSync(pdfPath)) {
    console.error('PDF not found:', pdfPath);
    process.exit(1);
  }
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;
  const pages = [];
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent({ normalizeWhitespace: false, disableCombineTextItems: false });
    const strings = textContent.items.map(it => (typeof it.str === 'string' ? it.str : ''));
    const text = strings.join(' ');
    pages.push({ page: i, text });
    fullText += text + '\n\n---PAGE-DELIM---\n';
  }
  fs.writeFileSync(outTxt, fullText, 'utf8');
  fs.writeFileSync(outPages, JSON.stringify({ pdf: path.basename(pdfPath), numpages: pdf.numPages, pages }, null, 2));
  console.log('Extracted to:', outTxt);
  console.log('Pages JSON:', outPages, 'pages=', pages.length);
}

extract().catch((e) => {
  console.error('Extraction failed:', e);
  process.exit(1);
});

