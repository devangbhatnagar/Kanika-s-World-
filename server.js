import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { networkInterfaces } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listGalleryMedia } from './gallery-files.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 8000);
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime'
};

const server = createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed');
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end('Invalid URL');
    return;
  }

  if (pathname === '/gallery.json') {
    listGalleryMedia().then(media => {
      const body = JSON.stringify(media);
      response.writeHead(200, {
        'Cache-Control': 'no-cache',
        'Content-Length': Buffer.byteLength(body),
        'Content-Type': 'application/json; charset=utf-8'
      }).end(body);
    }).catch(error => {
      console.error('Could not read gallery folder:', error);
      response.writeHead(500).end('Could not read gallery folder');
    });
    return;
  }

  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.resolve(root, `.${requestedPath}`);
  const relativePath = path.relative(root, filePath);
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  let fileInfo;
  try {
    fileInfo = statSync(filePath);
  } catch {
    response.writeHead(404).end('Not found');
    return;
  }
  if (!fileInfo.isFile()) {
    response.writeHead(404).end('Not found');
    return;
  }

  const headers = {
    'Accept-Ranges': 'bytes',
    'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff'
  };
  const range = request.headers.range;
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2])) {
      response.writeHead(416, { ...headers, 'Content-Range': `bytes */${fileInfo.size}` }).end();
      return;
    }

    let start;
    let end;
    if (!match[1]) {
      const suffixLength = Number(match[2]);
      if (suffixLength <= 0) {
        response.writeHead(416, { ...headers, 'Content-Range': `bytes */${fileInfo.size}` }).end();
        return;
      }
      start = Math.max(0, fileInfo.size - suffixLength);
      end = fileInfo.size - 1;
    } else {
      start = Number(match[1]);
      end = match[2] ? Math.min(Number(match[2]), fileInfo.size - 1) : fileInfo.size - 1;
    }

    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= fileInfo.size || start > end) {
      response.writeHead(416, { ...headers, 'Content-Range': `bytes */${fileInfo.size}` }).end();
      return;
    }

    headers['Content-Length'] = end - start + 1;
    headers['Content-Range'] = `bytes ${start}-${end}/${fileInfo.size}`;
    response.writeHead(206, headers);
    if (request.method === 'HEAD') {
      response.end();
      return;
    }
    createReadStream(filePath, { start, end }).pipe(response);
    return;
  }

  headers['Content-Length'] = fileInfo.size;
  response.writeHead(200, headers);
  if (request.method === 'HEAD') {
    response.end();
    return;
  }
  createReadStream(filePath).pipe(response);
});

server.listen(port, '0.0.0.0', () => {
  const threeModule = path.join(root, 'node_modules', 'three', 'build', 'three.module.js');
  try {
    statSync(threeModule);
  } catch {
    console.error('Three.js is not installed. Run "npm install" in the project folder, then restart with "npm start".');
  }
  console.log(`Diwali world running at http://localhost:${port}`);
  for (const addresses of Object.values(networkInterfaces())) {
    for (const address of addresses || []) {
      if (address.family === 'IPv4' && !address.internal) {
        console.log(`Open on a phone on the same Wi-Fi: http://${address.address}:${port}`);
      }
    }
  }
});
