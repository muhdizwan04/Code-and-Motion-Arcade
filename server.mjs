import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)));
const preferredPort = Number(process.env.PORT) || 8000;
const host = process.env.HOST || "127.0.0.1";
let port = preferredPort;

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".task": "application/octet-stream",
  ".wasm": "application/wasm",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

function safePath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const target = resolve(root, `.${decoded}`);
  return target === root || target.startsWith(root + sep) ? target : null;
}

const server = createServer(async (request, response) => {
  if (!["GET", "HEAD"].includes(request.method || "")) {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method Not Allowed");
    return;
  }

  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
    let target = safePath(url.pathname);
    if (!target) throw Object.assign(new Error("Forbidden"), { code: "EACCES" });

    const info = await stat(target);
    if (info.isDirectory()) target = resolve(target, "index.html");

    const body = await readFile(target);
    const extension = extname(target).toLowerCase();
    const headers = {
      "Content-Type": types[extension] || "application/octet-stream",
      "Content-Length": body.length,
      "Cache-Control": target.endsWith("sw.js") ? "no-cache" : "no-store",
      "X-Content-Type-Options": "nosniff",
    };
    response.writeHead(200, headers);
    response.end(request.method === "HEAD" ? undefined : body);
  } catch (error) {
    const status = error?.code === "EACCES" ? 403 : 404;
    response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(status === 403 ? "Forbidden" : "Not Found");
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE" && !process.env.PORT && port < preferredPort + 10) {
    console.log(`Port ${port} is busy; trying ${port + 1}…`);
    port++;
    server.listen(port, host);
    return;
  }
  throw error;
});

server.on("listening", () => {
  const origin = `http://${host}:${port}`;
  console.log(`\nPWA Game Hub is ready:\n`);
  console.log(`  Home:          ${origin}/`);
  console.log(`  Gesture Games: ${origin}/gesturegame/`);
  console.log(`  Cyber Heist:   ${origin}/codinggame/\n`);
  console.log("Press Control+C to stop.\n");
});

server.listen(port, host);
