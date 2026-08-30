import sharp from 'sharp';
import { readdirSync, statSync, unlinkSync } from 'fs';
import { join, extname, basename, dirname } from 'path';

const ROOT = 'public';
// Assets referenced by metadata/scrapers stay PNG; everything else becomes WebP.
const KEEP_PNG = new Set(['icon.png', 'og-image.png', 'nfq.png']);
const MAX_WIDTH = 1600;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = walk(ROOT).filter((f) => ['.png', '.jpg', '.jpeg'].includes(extname(f).toLowerCase()));

let before = 0;
let after = 0;
const report = [];

for (const file of files) {
  const name = basename(file);
  const originalSize = statSync(file).size;
  before += originalSize;

  const image = sharp(file);
  const meta = await image.metadata();
  const resize = meta.width > MAX_WIDTH ? { width: MAX_WIDTH } : null;

  if (KEEP_PNG.has(name)) {
    const buf = await sharp(file)
      .resize(resize ? { width: Math.min(meta.width, 512) } : { width: Math.min(meta.width, 512) })
      .png({ compressionLevel: 9, palette: true })
      .toBuffer();
    const { writeFileSync } = await import('fs');
    writeFileSync(file, buf);
    after += buf.length;
    report.push([file, originalSize, buf.length, 'png']);
    continue;
  }

  const target = join(dirname(file), basename(file, extname(file)) + '.webp');
  const pipeline = sharp(file);
  if (resize) pipeline.resize(resize);
  const buf = await pipeline.webp({ quality: 82, effort: 6 }).toBuffer();
  const { writeFileSync } = await import('fs');
  writeFileSync(target, buf);
  unlinkSync(file);
  after += buf.length;
  report.push([target, originalSize, buf.length, 'webp']);
}

report.sort((a, b) => b[1] - a[1]);
for (const [file, o, n, kind] of report) {
  console.log(
    `${(o / 1024).toFixed(0).padStart(6)}K -> ${(n / 1024).toFixed(0).padStart(5)}K  ${kind}  ${file}`
  );
}
console.log(`\nTOTAL: ${(before / 1024 / 1024).toFixed(1)}MB -> ${(after / 1024 / 1024).toFixed(1)}MB`);
