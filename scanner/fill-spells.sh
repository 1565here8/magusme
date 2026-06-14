#!/usr/bin/env bash
set -euo pipefail

# Fills full_text for all existing spells using local Ollama
# Usage: bash scanner/fill-spells.sh [--auto]
#   --auto  Skip upload prompt, upload automatically

DIR="$(cd "$(dirname "$0")" && pwd)"
OUTDIR="$DIR/output"
mkdir -p "$OUTDIR"
OUTFILE="$OUTDIR/spell_fill_$(date +%Y%m%d_%H%M%S).json"
MODEL="${OLLAMA_MODEL:-qwen3.6:35b}"
SERVER="https://magusme.com"

echo "=========================================="
echo " MagusMe Spell Content Filler"
echo " Model: $MODEL"
echo " Server: $SERVER"
echo "=========================================="

# Fetch all spells from API
echo "Fetching spells from $SERVER/api/spells..."
SPELLS_DATA=$(curl -sf "$SERVER/api/spells?limit=100" 2>/dev/null)

if [[ -z "$SPELLS_DATA" ]]; then
  echo "ERROR: Could not fetch spells from $SERVER"
  exit 1
fi

echo "$SPELLS_DATA" > /tmp/magusme_spells_tmp.json
UPDATES=()

# Use Python to loop - avoids bash stdin issues
python3 -c "
import json, subprocess, sys, os, re

data = json.loads(open('/tmp/magusme_spells_tmp.json').read())
spells = data.get('spells', data if isinstance(data, list) else [])

for s in spells:
    slug = s['slug']
    title = s['title']
    tradition = s.get('tradition', '')
    category = s.get('category', '')
    summary = s.get('summary', '') or ''

    # Check if already has full_text
    import urllib.request
    try:
        resp = json.loads(urllib.request.urlopen(f'https://magusme.com/api/spells/{slug}', timeout=10).read())
        existing_ft = resp.get('full_text', '') or ''
        if len(existing_ft) > 50:
            print(f'SKIP|{slug}|{title}|already has content')
            continue
    except:
        pass

    print(f'PROCESS|{slug}|{title}|{category}|{tradition}')

    prompt = f'''You are a grimoire author writing detailed spell instructions.
Return ONLY a JSON object (no markdown, no backticks) with this schema:
{\"full_text\":\"...\"}

The full_text field must contain between 500 and 2000 characters of detailed spell instructions including:
- Purpose and intent
- Materials or ingredients needed
- Step-by-step instructions
- Timing (planetary hours, moon phase)
- Warnings or cautions if applicable

Write in an authoritative, mystical but clear tone. Be specific and practical.

Spell Title: {title}
Category: {category}
Tradition: {tradition}
Summary: {summary}

Write the complete full_text for this spell.'''

    try:
        result = subprocess.run(
            ['ollama', 'run', '$MODEL', '--format', 'json', prompt],
            capture_output=True, text=True, timeout=300, stdin=subprocess.DEVNULL
        )
        if result.returncode != 0:
            print(f'FAIL|{slug}|{title}|ollama error: {result.stderr[:100]}')
            continue

        data_out = result.stdout
        # Strip any non-JSON prefix
        start = data_out.find('{')
        if start < 0:
            print(f'FAIL|{slug}|{title}|no JSON in response')
            continue
        data_out = data_out[start:]
        end = data_out.rfind('}')
        data_out = data_out[:end+1]

        obj = json.loads(data_out)
        ft = obj.get('full_text', '')
        if not ft:
            print(f'FAIL|{slug}|{title}|empty full_text')
            continue

        # Write to stdout for bash to read
        print(f'OK|{slug}|{json.dumps(ft)}')

    except subprocess.TimeoutExpired:
        print(f'FAIL|{slug}|{title}|timeout')
    except Exception as e:
        print(f'FAIL|{slug}|{title}|{str(e)[:100]}')
" 2>&1 | tee /tmp/magusme_spells_pipe.log

# Read results from Python's output
UPDATES=()
while IFS='|' read -r status slug title rest; do
  case "$status" in
    OK)
      UPDATES+=("{\"slug\":\"$slug\",\"full_text\":$rest}")
      echo "  ✓ Generated for $slug"
      ;;
    FAIL)
      echo "  ✗ Failed to generate for $title"
      echo "[$(date +%H:%M:%S)] FAILED: $slug — $title" >> "$OUTDIR/errors.log"
      ;;
    SKIP)
      echo "  SKIP [$slug] $title ($rest)"
      ;;
    PROCESS)
      echo ""
      echo "→ [$slug] $title ($rest)"
      ;;
  esac
done < <(grep -E '^(OK|FAIL|SKIP|PRODUCT)' /tmp/magusme_spells_pipe.log 2>/dev/null || true)
rm -f /tmp/magusme_spells_pipe.log /tmp/magusme_spells_tmp.json

  # Skip if no slug
  [[ -z "$SLUG" ]] && continue

  # Check if already has full_text
  EXISTING=$(curl -sf "$SERVER/api/spells/$SLUG" | python3 -c "
import sys, json
d = json.load(sys.stdin)
ft = d.get('full_text')
print('HAS_CONTENT' if ft and len(ft) > 50 else 'EMPTY')
" 2>/dev/null || echo "EMPTY")

  if [[ "$EXISTING" == "HAS_CONTENT" ]]; then
    echo "  SKIP [$SLUG] $TITLE (already has content)"
    continue
  fi

  echo ""
  echo "→ [$SLUG] $TITLE ($CATEGORY, $TRADITION)"

  SYSTEM_MSG="You are a grimoire author writing detailed spell instructions.
Return ONLY a JSON object (no markdown, no backticks) with this schema:
{\"full_text\":\"...\"}

The full_text field must contain between 500 and 2000 characters of detailed spell instructions including:
- Purpose and intent
- Materials or ingredients needed
- Step-by-step instructions
- Timing (planetary hours, moon phase)
- Warnings or cautions if applicable

Write in an authoritative, mystical but clear tone. Be specific and practical."

  RESP=$(ollama run "$MODEL" --format json "$SYSTEM_MSG

Spell Title: $TITLE
Category: $CATEGORY
Tradition: $TRADITION
Summary: $SUMMARY

Write the complete full_text for this spell." </dev/null 2>/dev/null) || true

  FULL_TEXT=$(echo "$RESP" | python3 -c "
import sys, re, json
data = sys.stdin.read()
# Strip ANSI escape sequences
data = re.sub(r'\x1b\[[0-9;]*[a-zA-Z]', '', data)
data = re.sub(r'\x1b\][0-9;]*[^\x1b]*\x1b\\\\', '', data)
start = data.find('{')
if start < 0:
    print('')
    sys.exit(0)
data = data[start:]
end = data.rfind('}')
if end <= 0:
    print('')
    sys.exit(0)
try:
    obj = json.loads(data[:end+1], strict=False)
    ft = obj.get('full_text', '')
    print(json.dumps(ft))
except:
    print('')
" 2>/dev/null) || FULL_TEXT=""

  if [[ -n "$FULL_TEXT" && "$FULL_TEXT" != '""' ]]; then
    UPDATES+=("{\"slug\":\"$SLUG\",\"full_text\":$FULL_TEXT}")
    echo "  ✓ Generated $(echo "$FULL_TEXT" | python3 -c "import sys; print(len(sys.stdin.read()))" 2>/dev/null || echo "?") chars"
  else
    echo "  ✗ Failed to generate for $TITLE"
    echo "[$(date +%H:%M:%S)] FAILED: $SLUG — $TITLE" >> "$OUTDIR/errors.log"
  fi
done < /tmp/magusme_spells_tmp.json

rm -f /tmp/magusme_spells_tmp.json

echo ""
echo "=========================================="
echo " Generated ${#UPDATES[@]} spell texts"
echo "=========================================="

if [[ ${#UPDATES[@]} -eq 0 ]]; then
  echo "Nothing to upload."
  exit 0
fi

# Write output file
TMPJSON=$(mktemp)
for u in "${UPDATES[@]}"; do echo "$u" >> "$TMPJSON"; done
python3 -c "
import json
entries = []
with open('$TMPJSON') as f:
    for line in f:
        line = line.strip()
        if line:
            entries.append(json.loads(line))
with open('$OUTFILE', 'w') as f:
    json.dump(entries, f, indent=2)
print(f'Wrote {len(entries)} updates to $OUTFILE')
"
rm -f "$TMPJSON"

echo ""
echo "Preview:"
python3 -c "
import json
updates = json.load(open('$OUTFILE'))
for u in updates:
    slug = u['slug']
    ft = u['full_text']
    preview = ft[:120].replace('\n', ' ')
    print(f'  [{slug}] {preview}...')
" 2>/dev/null

echo ""
AUTO_UPLOAD=false
for arg in "$@"; do [[ "$arg" == "--auto" ]] && AUTO_UPLOAD=true; done

if $AUTO_UPLOAD; then
  ANS="y"
else
  read -rp "Upload to MagusMe server? [y/N] " ANS
fi

if [[ "$ANS" =~ ^[Yy] ]]; then
  echo "Uploading ${#UPDATES[@]} spell updates to $SERVER..."

  # We need to admin-login first. Get the ADMIN_SECRET from local .env
  ADMIN_SECRET=$(grep ADMIN_SECRET /Users/mymac/Desktop/magusme-main/.env 2>/dev/null | cut -d= -f2-) || ADMIN_SECRET=""

  if [[ -z "$ADMIN_SECRET" ]]; then
    echo "ADMIN_SECRET not found in .env. Trying server..."
    ADMIN_SECRET=$(ssh -i ~/.ssh/magusme-vps root@178.105.155.211 "grep ADMIN_SECRET /root/magusme-live/.env | cut -d= -f2-" 2>/dev/null) || true
  fi

  if [[ -z "$ADMIN_SECRET" ]]; then
    echo "ERROR: Could not find ADMIN_SECRET. Set it manually."
    exit 1
  fi

  # Get CSRF token
  CSRF=$(curl -sf "$SERVER/api/auth/csrf" -c /tmp/magusme_cookies.txt | python3 -c "import sys,json; print(json.load(sys.stdin).get('csrfToken',''))" 2>/dev/null || echo "")
  [[ -z "$CSRF" ]] && CSRF=$(grep nc_csrf /tmp/magusme_cookies.txt 2>/dev/null | awk '{print $NF}' || echo "")

  # Admin login
  curl -sf -X POST "$SERVER/api/auth/admin-login" \
    -H "Content-Type: application/json" \
    -H "X-CSRF-Token: $CSRF" \
    -b /tmp/magusme_cookies.txt -c /tmp/magusme_cookies.txt \
    -d "{\"secret\":\"$ADMIN_SECRET\"}" > /dev/null 2>&1

  # Send updates
  RESULT=$(curl -sf -X POST "$SERVER/api/admin/spells/update-fulltext" \
    -H "Content-Type: application/json" \
    -H "X-CSRF-Token: $CSRF" \
    -b /tmp/magusme_cookies.txt \
    -d "$(cat "$OUTFILE")" 2>&1)

  echo "Server response: $RESULT"
  rm -f /tmp/magusme_cookies.txt
else
  echo "Saved locally at: $OUTFILE"
fi
