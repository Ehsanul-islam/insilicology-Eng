import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const logo = readFileSync(join(publicDir, 'icon-512.png'));

const width = 1200;
const height = 630;

const background = Buffer.from(`
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="50%" stop-color="#4c1d95"/>
      <stop offset="100%" stop-color="#0e7490"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <text x="600" y="380" text-anchor="middle" font-family="Arial, sans-serif" font-size="72" font-weight="700" fill="#ffffff">insilicology</text>
  <text x="600" y="450" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="#c4b5fd">Professional Skills Development</text>
</svg>
`);

const logoResized = await sharp(logo).resize(200, 200).png().toBuffer();

await sharp(background)
  .composite([{ input: logoResized, top: 120, left: Math.round((width - 200) / 2) }])
  .png()
  .toFile(join(publicDir, 'og-image.png'));

console.log('Generated og-image.png');
