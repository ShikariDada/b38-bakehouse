// Fetches Satoshi (Fontshare) + Caveat (Google) for the v2 design system.
import { mkdir, writeFile } from "node:fs/promises";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
await mkdir("public/fonts-v2", { recursive: true });

// Satoshi — Fontshare v2 css api
const res = await fetch("https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap", { headers: { "User-Agent": UA } });
const css = await res.text();
const urls = [...css.matchAll(/url\((https:[^)]+\.woff2?)\)/g)].map(m => m[1]);
let i = 0;
const seen = new Set();
for (const u of urls) {
  if (seen.has(u)) continue;
  seen.add(u);
  const bin = await fetch(u, { headers: { "User-Agent": UA } });
  const name = u.split("/").pop().split("?")[0];
  await writeFile(`public/fonts-v2/satoshi-${i}-${name}`, Buffer.from(await bin.arrayBuffer()));
  console.log(`satoshi-${i}-${name}`);
  i++;
}

// Caveat — Google
const g = await fetch("https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap", { headers: { "User-Agent": UA } });
const gcss = await g.text();
for (const block of gcss.split("/* ").filter(b => b.startsWith("latin */"))) {
  const m = block.match(/url\((https:[^)]+\.woff2)\)/);
  if (!m) continue;
  const bin = await fetch(m[1], { headers: { "User-Agent": UA } });
  await writeFile("public/fonts-v2/caveat.woff2", Buffer.from(await bin.arrayBuffer()));
  console.log("caveat.woff2");
  break;
}
