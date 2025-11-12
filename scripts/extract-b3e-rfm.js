#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

const pdfPath = process.argv[2] || path.join(process.cwd(), 'AS350 B3 E', '1_index-2.pdf');
const outTxt = process.argv[3] || path.join(process.cwd(), 'AS350 B3 E', '1_index-2.txt');
const outPages = path.join(path.dirname(outTxt), '1_index-2.pages.json');

function pageRenderer(pageData) {
  const render_options = {
    normalizeWhitespace: false,
    disableCombineTextItems: false,
  };
  return pageData.getTextContent(render_options).then((textContent) => {
    const strings = textContent.items.map((item) => item.str);
    const text = strings.join(' ');
    // Insert a unique delimiter so we can split back to pages later
    return text + '\n\n---PAGE-DELIM---\n';
  });
}

async function main() {
  if (!fs.existsSync(pdfPath)) {
    console.error('PDF not found:', pdfPath);
    process.exit(1);
  }
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(dataBuffer, { pagerender: pageRenderer });
  const text = data.text || '';
  fs.writeFileSync(outTxt, text, 'utf8');
  const pages = text.split('\n\n---PAGE-DELIM---\n').map((t, i) => ({ page: i + 1, text: t }));
  fs.writeFileSync(outPages, JSON.stringify({ pdf: path.basename(pdfPath), numpages: data.numpages, pages }, null, 2));
  console.log('Extracted to:', outTxt);
  console.log('Pages JSON:', outPages, 'pages=', pages.length);
}

main().catch((e) => {
  console.error('Extraction failed:', e);
  process.exit(1);
});

