// Captures key pages at mobile + desktop for visual QA.
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3111";
const OUT = "_screenshots";
fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  ["home", "/"],
  ["designs", "/designs"],
  ["design-detail", "/designs/lavender-ombre-pearls"],
  ["custom-entry", "/custom"],
  ["custom-brief", "/custom/from-scratch"],
  ["how-it-works", "/how-it-works"],
  ["about", "/about"],
  ["faq", "/faq"],
  ["studio", "/studio"],
];

const VIEWPORTS = [
  ["m", { width: 390, height: 844 }],
  ["d", { width: 1440, height: 900 }],
];

const browser = await chromium.launch();
const only = process.argv[2]; // optional: capture one page by key

for (const [vk, viewport] of VIEWPORTS) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
  for (const [key, path] of PAGES) {
    if (only && key !== only) continue;
    try {
      await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${OUT}/${key}-${vk}.png`, fullPage: key !== "home" || vk === "m" });
      console.log(`ok ${key}-${vk}`);
    } catch (e) {
      console.log(`FAIL ${key}-${vk}: ${String(e).slice(0, 120)}`);
    }
  }
  await page.close();
}
await browser.close();
console.log("done");
