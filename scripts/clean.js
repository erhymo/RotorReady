#!/usr/bin/env node
const fs = require('fs/promises');
const path = require('path');

async function rm(target) {
  const p = path.join(process.cwd(), target);
  try {
    await fs.rm(p, { recursive: true, force: true });
    console.log(`✓ Removed ${target}`);
  } catch (e) {
    console.warn(`! Could not remove ${target}: ${e.message}`);
  }
}

(async () => {
  await rm('.next');
  await rm('node_modules/.cache');
  // Optional: clean other transient dirs if they appear later
  // await rm('.turbo');
})();
