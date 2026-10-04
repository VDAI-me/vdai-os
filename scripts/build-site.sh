#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
python3 scripts/build-starter.py
pnpm site:verify
out=".build/site"
rm -rf "$out"
mkdir -p "$out/.well-known"
cp -R site/. "$out/"
cp vercel.json "$out/vercel.json"
commit="$(git rev-parse HEAD)"
source_epoch="${SOURCE_DATE_EPOCH:-$(git show -s --format=%ct HEAD)}"
generated="$(date -u -r "$source_epoch" '+%Y-%m-%dT%H:%M:%SZ')"
modified=false
if ! git diff --quiet || ! git diff --cached --quiet; then modified=true; fi
printf '{"schema":"vdai.site-build.v1","source":"VDAI-me/vdai-os/site","baseCommit":"%s","generatedAt":"%s","workingTreeModified":%s}\n' "$commit" "$generated" "$modified" > "$out/.well-known/vdai-build.json"
find "$out" -type f -exec touch -t "$(date -u -r "$source_epoch" '+%Y%m%d%H%M.%S')" {} +
echo "SITE_BUILD_PASS $commit"
