#!/usr/bin/env bash
# One-time GitHub authorization so this machine can manage Codespaces (the
# deployment target). Prints a code — enter it at the URL it shows, using any
# browser signed into GitHub. Takes ~20 seconds. Then `npm run deploy:codespace`.
set -e
cd "$(dirname "$0")/.."
echo "A one-time code will be printed below."
echo "1. Open https://github.com/login/device in any browser signed into GitHub."
echo "2. Enter the code, click Continue, then Authorize."
echo
gh auth refresh -h github.com -s codespace
echo "Authorized. Now run: npm run deploy:codespace"
