// Downloads latin-subset variable WOFF2 files for self-hosting (Newsreader + Georama, SIL OFL 1.1).
import { mkdir, writeFile } from "node:fs/promises";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const FAMILIES = [
  { name: "newsreader", css: "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap" },
  { name: "georama", css: "https://fonts.googleapis.com/css2?family=Georama:wght@100..900&display=swap" },
];

await mkdir("public/fonts", { recursive: true });
const cssOut = [];

for (const fam of FAMILIES) {
  const res = await fetch(fam.css, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`css fetch failed ${res.status}`);
  const css = await res.text();
  // Extract only the /* latin */ blocks
  const blocks = css.split("/* ").filter(b => b.startsWith("latin */"));
  for (const block of blocks) {
    const face = "/* " + block.slice(0, block.indexOf("}") + 1);
    const urlMatch = face.match(/url\((https:[^)]+\.woff2)\)/);
    if (!urlMatch) continue;
    const style = /font-style:\s*(\w+)/.exec(face)?.[1] ?? "normal";
    const fname = `${fam.name}-${style}.woff2`;
    const bin = await fetch(urlMatch[1], { headers: { "User-Agent": UA } });
    if (!bin.ok) throw new Error(`font fetch failed ${bin.status}`);
    await writeFile(`public/fonts/${fname}`, Buffer.from(await bin.arrayBuffer()));
    const fixed = face.replace(urlMatch[1], `/fonts/${fname}`);
    cssOut.push(fixed);
    console.log(`${fname}  ${(Number(bin.headers.get("content-length") || 0) / 1024).toFixed(0)}KB`);
  }
}

await writeFile("src/styles/fonts.css", cssOut.join("\n") + "\n");
console.log("Wrote src/styles/fonts.css");
