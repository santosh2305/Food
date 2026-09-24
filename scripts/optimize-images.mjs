import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const manifestPath = new URL('../src/data/photo-credits.json', import.meta.url);
const credits = JSON.parse((await readFile(manifestPath, 'utf8')).replace(/^\uFEFF/, ''));
for (const [key, photo] of Object.entries(credits)) {
  const input = new URL(`../public/assets/dishes/${key}.jpg`, import.meta.url);
  for (const width of [320, 640]) {
    const suffix = width === 320 ? '-small' : '';
    await sharp(fileURLToPath(input))
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(
        fileURLToPath(new URL(`../public/assets/dishes/${key}${suffix}.webp`, import.meta.url)),
      );
  }
  photo.path = `/assets/dishes/${key}.webp`;
}
await writeFile(manifestPath, JSON.stringify(credits, null, 2) + '\n');
console.log(
  `Optimized ${Object.keys(credits).length} licensed photographs at two responsive sizes.`,
);
