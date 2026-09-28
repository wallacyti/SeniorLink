import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 4173);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.jpeg':'image/jpeg', '.jpg':'image/jpeg', '.png':'image/png', '.mp4':'video/mp4' };
const server = createServer(async (req, res) => {
  if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405); res.end('Method not allowed'); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    // Serve the presentation only, never .reference, .git or development files.
    if (pathname !== '/' && pathname !== '/index.html' && pathname !== '/index.js' && !pathname.startsWith('/css/') && !pathname.startsWith('/assets/')) { res.writeHead(404); res.end('Not found'); return; }
    if (pathname.split(/[\\/]/).some(part => part.startsWith('.'))) { res.writeHead(403); res.end('Forbidden'); return; }
    const path = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!path.startsWith(root + sep)) { res.writeHead(403); res.end('Forbidden'); return; }
    const fileStat = await stat(path);
    if (!fileStat.isFile()) { res.writeHead(404); res.end('Not found'); return; }
    const headers = { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control':'no-cache', 'X-Content-Type-Options':'nosniff', 'Accept-Ranges':'bytes' };
    const range = req.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      let start = match?.[1] ? Number(match[1]) : 0;
      let end = match?.[2] ? Number(match[2]) : fileStat.size - 1;
      if (match && !match[1] && match[2]) { start = Math.max(0,fileStat.size - Number(match[2])); end = fileStat.size - 1; }
      if (!match || (!match[1] && !match[2]) || start >= fileStat.size || start > end) { res.writeHead(416, { 'Content-Range':`bytes */${fileStat.size}` }); res.end(); return; }
      end = Math.min(end,fileStat.size - 1);
      res.writeHead(206,{...headers, 'Content-Range':`bytes ${start}-${end}/${fileStat.size}`, 'Content-Length':end-start+1});
      res.end(req.method === 'HEAD' ? undefined : (await readFile(path)).subarray(start,end+1));
    } else {
      res.writeHead(200,{...headers,'Content-Length':fileStat.size});
      res.end(req.method === 'HEAD' ? undefined : await readFile(path));
    }
  } catch (error) { res.writeHead(error instanceof URIError ? 400 : 404); res.end('Not found'); }
});
server.listen(port,'127.0.0.1', () => console.log(`SeniorLink: http://localhost:${port}\nPressione Ctrl+C para encerrar.`));
server.on('error',error => { console.error(error.code === 'EADDRINUSE' ? `A porta ${port} está ocupada. Defina PORT para usar outra.` : error.message); process.exitCode = 1; });
