#!/usr/bin/env bash
set -euo pipefail

# PC-side Ollama Scanner — generates occult/divination content using local Ollama models
# Usage: bash scanner/generate.sh [topic ...]
#   Provide topic(s) as arguments, or leave blank to use default list

DIR="$(cd "$(dirname "$0")" && pwd)"
OUTDIR="$DIR/output"
mkdir -p "$OUTDIR"

MODEL="${OLLAMA_MODEL:-qwen3.6:35b}"
BATCH_ID="scan_$(date +%Y%m%d_%H%M%S)"
OUTFILE="$OUTDIR/$BATCH_ID.json"

SYSTEM_MSG="You are an occult research AI indexing a digital grimoire.
Return ONLY a JSON object (no markdown, no backticks, no extra text) with this schema:
{\"id\":\"sc_<8-char-hex>\",\"title\":\"...\",\"tradition\":\"...\",\"category\":\"...\",\"intentTags\":[...],\"summary\":\"...\",\"previewText\":\"...\",\"fullText\":\"...\",\"source\":{\"title\":\"...\"},\"isBaneful\":false,\"backlashText\":\"...\",\"alternativesText\":\"...\",\"planetaryTiming\":\"...\"}"

# Default topics if none provided
if [[ $# -eq 0 ]]; then
  set -- \
    "Hoodoo rootwork and candle magic" \
    "Norse seidr and rune divination" \
    "Sufi dhikr and spiritual practices" \
    "Tibetan Buddhist ritual and mantra" \
    "Celtic ogham divination system" \
    "Ancient Egyptian heka temple magic" \
    "Slavic folk magic and witchcraft" \
    "Korean shamanism (Mugyo)" \
    "Andean curanderismo and mesa" \
    "Brazilian Umbanda practices"
fi

echo "=========================================="
echo " MagusMe PC Scanner"
echo " Model: $MODEL"
echo " Topics: $#"
echo " Output: $OUTFILE"
echo "=========================================="

echo '[]' > "$OUTFILE"

for topic; do
  echo ""
  echo "→ $topic"
  RESP=$(ollama run "$MODEL" "$SYSTEM_MSG

Research and generate an entry about: $topic" 2>/dev/null)

  ENTRY=$(echo "$RESP" | python3 -c "
import sys, json
data = sys.stdin.read()
# Try to extract JSON block
start = data.find('{')
end = data.rfind('}')
if start >= 0 and end > start:
    try:
        obj = json.loads(data[start:end+1])
        print(json.dumps(obj))
    except:
        sys.exit(1)
" 2>/dev/null) || ENTRY=""

  if [[ -n "$ENTRY" ]]; then
    TITLE=$(echo "$ENTRY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('title','?'))" 2>/dev/null)
    python3 -c "
import json
with open('$OUTFILE') as f: entries = json.load(f)
entries.append(json.loads('$ENTRY'))
with open('$OUTFILE','w') as f: json.dump(entries, f, indent=2)
" 2>/dev/null
    echo "  ✓ $TITLE"
  else
    echo "  ✗ Failed — check $OUTDIR/errors.log"
    echo "[$(date +%H:%M:%S)] FAILED: $topic" >> "$OUTDIR/errors.log"
  fi
done

COUNT=$(python3 -c "import json; print(len(json.load(open('$OUTFILE'))))" 2>/dev/null || echo 0)
echo ""
echo "=========================================="
echo " Generated $COUNT entries"
echo "=========================================="

python3 -c "
import json
entries = json.load(open('$OUTFILE'))
for e in entries:
    cat = e.get('category','?')
    title = e.get('title','?')
    trad = e.get('tradition','?')
    summary = e.get('summary','?')[:90]
    print(f'  [{cat}] {title}')
    print(f'         {trad} — {summary}...')
    print()
" 2>/dev/null

echo ""
read -rp "Upload to MagusMe server? [y/N] " ANS
if [[ "$ANS" =~ ^[Yy] ]]; then
  ssh -i ~/.ssh/magusme-vps root@178.105.155.211 "mkdir -p /root/magusme-live/scanner-imports"
  rsync -avz -e "ssh -i ~/.ssh/magusme-vps" "$OUTFILE" "root@178.105.155.211:/root/magusme-live/scanner-imports/"
  echo "✓ Uploaded to /root/magusme-live/scanner-imports/"
  echo ""
  echo "To import on server:"
  echo "  ssh -i ~/.ssh/magusme-vps root@178.105.155.211"
  echo "  cd /root/magusme-live"
  echo "  npx tsx -e \"import('./src/server/arcana/arcanaDb').then(m=>m.getArcanaDb()).then(async db=>{const e=require('./scanner-imports/$(basename $OUTFILE)');for(const x of e)await db.upsertEntry(x);console.log('imported',e.length,'entries');process.exit()})\""
else
  echo "Saved locally at: $OUTFILE"
fi
