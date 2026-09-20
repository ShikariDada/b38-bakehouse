// Crawls the site, collects console errors, failed requests, and broken images per page.
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3111";
const slugs = ["cocoa-drip-crown","blue-hour-milestone","blue-blossom-wreath","black-forest-classic","powder-blue-rosette","sapphire-shell-ring","vintage-rose-fringe","lavender-daisy-field","midnight-oreo-gold","midnight-truffle-nuts","cream-oreo-name-cake","mint-daisy-ribbons","blue-rosette-garden","pastel-rose-wreath","blush-ruffle-medallion","rainbow-rosette-crown","oreo-overload-drip","orchard-fruit-cream","lavender-ombre-pearls","groom-stop-ceremony"];

const PAGES = ["/", "/designs", "/custom", "/custom/from-scratch", "/custom/from-design",
  ...slugs.map(s => `/designs/${s}`), "/how-it-works", "/about", "/faq", "/contact",
  "/policies/terms", "/policies/privacy", "/policies/refunds", "/track"];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

let problems = 0;
for (const path of PAGES) {
  const errors = [];
  const failed = [];
  const onConsole = m => { if (m.type() === "error") errors.push(m.text().slice(0, 140)); };
  const onResponse = r => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url().slice(BASE.length, BASE.length + 90)}`); };
  page.on("console", onConsole);
  page.on("response", onResponse);
  try {
    await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 25000 });
    // check for broken <img>
    const brokenImgs = await page.evaluate(() =>
      Array.from(document.images).filter(i => i.complete && i.naturalWidth === 0).map(i => (i.src || "").slice(0, 100)));
    if (errors.length || failed.length || brokenImgs.length) {
      problems++;
      console.log(`PAGE ${path}`);
      errors.forEach(e => console.log("  console:", e));
      [...new Set(failed)].forEach(f => console.log("  http:", f));
      [...new Set(brokenImgs)].forEach(b => console.log("  img:", b));
    }
  } catch (e) {
    problems++;
    console.log(`PAGE ${path} NAV-FAIL ${String(e).slice(0, 100)}`);
  }
  page.off("console", onConsole);
  page.off("response", onResponse);
}
await browser.close();
console.log(problems === 0 ? "ALL CLEAN" : `${problems} pages with problems`);
