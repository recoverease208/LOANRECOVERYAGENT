import { createServer } from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "dist");
const port = Number(process.env.PORT ?? 4173);
const host = "127.0.0.1";
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg"
};

createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${host}:${port}`);
  const requested = normalize(url.pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(root, requested === "/" ? "index.html" : requested);
  const target = existsSync(filePath) ? filePath : join(root, "index.html");
  res.setHeader("Content-Type", types[extname(target)] ?? "application/octet-stream");
  createReadStream(target).pipe(res);
}).listen(port, host, () => {
  // Keep stdout quiet so detached Windows launches do not close on pipe errors.
});
