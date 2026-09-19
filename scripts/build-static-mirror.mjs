// Builds a static mirror of the public site for GitHub Pages: crawls the running
// production server, snapshots HTML + assets, and degrades commerce UI to
// WhatsApp CTAs. The full ordering app still lives in the Next.js deployment.
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.SNAPSHOT_BASE || "http://localhost:3111";
const OUT = "_pages";
const SUBPATH = process.env.PAGES_SUBPATH || ""; // e.g. "/b38-bakehouse" when deploying to project pages

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const DESIGNS = JSON.parse(fs.readFileSync("content/designs.json", "utf8")).designs.map(d => d.slug);

const ROUTES = [
  ["/", ""],
  ["/designs", "designs"],
  ...DESIGNS.map(s => [`/designs/${s}`, `designs/${s}`]),
  ["/custom", "custom"],
  ["/custom/from-scratch", "custom/from-scratch"],
  ["/custom/from-design", "custom/from-design"],
  ["/how-it-works", "how-it-works"],
  ["/about", "about"],
  ["/faq", "faq"],
  ["/contact", "contact"],
  ["/policies/terms", "policies/terms"],
  ["/policies/privacy", "policies/privacy"],
  ["/policies/refunds", "policies/refunds"],
];

const assets = new Set();

function collectAssets(html, pagePath) {
  const dir = path.dirname(pagePath);
  const re = /(?:src|href)="(\/[^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    let u = m[1].split("?")[0].split("#")[0];
    if (u.startsWith("//") || u.startsWith("/https")) continue;
    if (/\.(png|jpe?g|webp|avif|svg|ico|woff2?|css|js|txt|xml|json)$/.test(u) || u.startsWith("/_next/")) {
      assets.add(u);
    }
  }
}

async function fetchBuf(url) {
  const res = await fetch(BASE + url);
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

for (const [route, pagePath] of ROUTES) {
  const raw = (await fetchBuf(route)).toString("utf8");
  const processed = raw
    // serve originals directly instead of the runtime optimizer
    .replace(/\/_next\/image\?url=([^&"\s,]+)(?:&|&amp;)w=\d+(?:&|&amp;)q=\d+/g, (_, u) => decodeURIComponent(u))
    // subpath base for project pages
    .replace(/<head>/, `<head><base href="${SUBPATH}/">`)
    // neutralise forms so nothing half-works on the mirror
    .replace(/<form[^>]*action="(\/api[^"]*)"[^>]*>/g, "<form onsubmit=\"return false\">");
  collectAssets(processed, pagePath);
  const dir = path.join(OUT, pagePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), processed);
  console.log("page", route);
}

console.log("assets referenced:", assets.size);
let failed = 0;
for (const a of assets) {
  const target = path.join(OUT, a);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  try {
    fs.writeFileSync(target, await fetchBuf(a));
  } catch (e) {
    failed++;
    console.log("asset failed:", a, String(e).slice(0, 80));
  }
}

// Static-mirror degradation: hide live-ordering UI, add WhatsApp fallback per page type.
const degrade = `
<script>
(function () {
  var WA = "919368565911";
  document.documentElement.setAttribute("data-static", "1");
  function banner(text) {
    var b = document.createElement("div");
    b.style.cssText = "margin:2rem auto 0;max-width:640px;padding:1.2rem 1.4rem;border:1px solid rgba(116,46,21,.3);border-left:4px solid #F1C662;background:#FFFDF9;border-radius:4px;font-size:.95rem;line-height:1.55";
    b.innerHTML = text;
    document.getElementById("main").prepend(b);
  }
  var path = location.pathname.replace(/\\/$/, "");
  var design = path.match(/designs\\/([a-z0-9-]+)$/);
  if (design) {
    document.querySelectorAll(".order-configurator, .commerce-bar").forEach(function (el) { el.style.display = "none"; });
    var name = (document.querySelector("h1") || {}).textContent || "this design";
    var wa = document.createElement("div");
    wa.style.cssText = "margin-top:1.5rem;padding:1.4rem;border:1px solid rgba(116,46,21,.25);border-radius:4px;background:#FBEBC3";
    wa.innerHTML = '<p style="margin:0 0 .8rem;font-size:.98rem">Ordering here happens in the full app — on this mirror, message us and mention <strong>' + name.trim() + '</strong>, your date and your city.</p><a class="btn btn-cocoa" href="https://wa.me/' + WA + '?text=' + encodeURIComponent("Hi B38! I'd like to order " + name.trim() + ". My date is __ and I'm in __.") + '" target="_blank" rel="noopener">Order ' + name.trim() + ' on WhatsApp</a>';
    var cfg = document.querySelector(".order-configurator");
    if (cfg) cfg.parentNode.insertBefore(wa, cfg);
  } else if (path.indexOf("from-scratch") > -1 || path.indexOf("from-design") > -1) {
    document.querySelectorAll("form").forEach(function (f) { f.style.display = "none"; });
    banner('This is the browsable catalogue mirror. Custom briefs are taken in the full app — <a href="https://wa.me/' + WA + '?text=' + encodeURIComponent("Hi B38! I want to plan a custom cake.") + '" target="_blank" rel="noopener" style="text-decoration:underline">send yours on WhatsApp</a>.');
  } else if (path === "" || path === "/" ) {
    banner('Browsable mirror of the B38 catalogue. Full online ordering lives in the main app.');
  }
})();
</script>`;
for (const [route, pagePath] of ROUTES) {
  const f = path.join(OUT, pagePath, "index.html");
  let html = fs.readFileSync(f, "utf8");
  html = html.replace("</body>", degrade + "</body>");
  fs.writeFileSync(f, html);
}

fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
console.log("mirror built:", OUT, "| asset failures:", failed);
