// Fetches 2026-modern font candidates for the redesign (SIL OFL via Google Fonts).
import { mkdir, writeFile } from "node:fs/promises";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const FAMILIES = [
  { name: "fraunces", css: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,100..900,0..100;1,9..144,100..900,0..100&display=swap" },
  { name: "instrument-serif", css: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" },
  { name: "instrument-sans", css: "https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap" },
  { name: "bricolage", css: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap" },
];

await mkdir("public/fonts-v2", { recursive: true });
for (const fam of FAMILIES) {
  const res = await fetch(fam.css, { headers: { "User-Agent": UA } });
  const css = await res.text();
  const blocks = css.split("/* ").filter(b => b.startsWith("latin */"));
  for (const block of blocks) {
    const face = "/* " + block.slice(0, block.indexOf("}") + 1);
    const urlMatch = face.match(/url\((https:[^)]+\.woff2)\)/);
    if (!urlMatch) continue;
    const style = /font-style:\s*(\w+)/.exec(face)?.[1] ?? "normal";
    const fname = `public/fonts-v2/${fam.name}-${style}.woff2`;
    const bin = await fetch(urlMatch[1], { headers: { "User-Agent": UA } });
    await writeFile(fname, Buffer.from(await bin.arrayBuffer()));
    console.log(fname, `${(Number(bin.headers.get("content-length") || 0) / 1024).toFixed(0)}KB`);
  }
}
