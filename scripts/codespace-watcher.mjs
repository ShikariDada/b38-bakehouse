// Watches for the codespace scope grant, then auto-deploys the full app:
// creates the codespace (post-create installs + seeds + builds), starts the
// server, opens port 3000 publicly, and writes the public URL to deploy-url.txt.
import { execSync } from "node:child_process";
import fs from "node:fs";

const sh = (c) => { try { return execSync(c, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim(); } catch (e) { return `ERR:${String(e).slice(0, 200)}`; } };

const DEADLINE = Date.now() + 14 * 60 * 1000;
let granted = false;
while (Date.now() < DEADLINE) {
  const st = sh("gh auth status");
  if (st.includes("codespace")) { granted = true; break; }
  await new Promise(r => setTimeout(r, 15000));
}
if (!granted) { console.log("SCOPE_NOT_GRANTED"); process.exit(1); }
console.log("scope granted at", new Date().toISOString());

const name = sh(`gh codespace create -r ShikariDada/b38-bakehouse -b main -m basicLinux32gb --idle-timeout 240m --retention-period 720h`);
console.log("codespace:", name);
if (name.startsWith("ERR:")) process.exit(1);

// create resolves after post-create completes (install + seed + build)
console.log("post-create done; starting server");
const start = sh(`gh codespace ssh -c "${name}" -- "cd /workspaces/b38-bakehouse && (nohup npx next start -p 3000 > server.log 2>&1 &) && sleep 6 && curl -s -o /dev/null -w %{http_code} http://localhost:3000/"`);
console.log("server check:", start);

console.log(sh(`gh codespace ports visibility 3000:public -c "${name}"`));
const url = `https://${name.replace(/[^a-z0-9-]/gi, "-")}-3000.app.github.dev`;
fs.writeFileSync("deploy-url.txt", url + "\ncodespace: " + name + "\n");
console.log("PUBLIC_URL", url);
