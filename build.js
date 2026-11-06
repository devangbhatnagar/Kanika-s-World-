import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listGalleryMedia } from './gallery-files.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, 'dist');

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const item of ['index.html', 'css', 'gallery', 'images', 'js']) {
  await cp(path.join(root, item), path.join(output, item), { recursive: true });
}
await writeFile(path.join(output, 'gallery.json'), JSON.stringify(await listGalleryMedia(), null, 2));
const threeOutput = path.join(output, 'node_modules', 'three', 'build', 'three.module.js');
await mkdir(path.dirname(threeOutput), { recursive: true });
await cp(path.join(root, 'node_modules', 'three', 'build', 'three.module.js'), threeOutput);
console.log('Static site built in dist/');
