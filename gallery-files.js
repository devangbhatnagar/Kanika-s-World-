import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const galleryPath = path.join(root, 'gallery');
const supportedExtensions = new Set([
  '.gif', '.jpeg', '.jpg', '.mov', '.mp4', '.png', '.webm', '.webp'
]);

export async function listGalleryMedia() {
  const entries = await readdir(galleryPath, { withFileTypes: true });
  return entries
    .filter(entry => entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase()))
    .map(entry => ({
      file: entry.name,
      type: ['.mov', '.mp4', '.webm'].includes(path.extname(entry.name).toLowerCase()) ? 'video' : 'image'
    }))
    .sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true, sensitivity: 'base' }));
}
