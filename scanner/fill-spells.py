#!/usr/bin/env python3
"""
Generate full_text for all spells using local Ollama.
Skips spells that already have full_text on the server.
"""
import json, subprocess, sys, os, time
from datetime import datetime

MODEL = os.environ.get('OLLAMA_MODEL', 'qwen3.6:35b')
SERVER = 'https://magusme.com'
OUTDIR = os.path.join(os.path.dirname(__file__), 'output')
os.makedirs(OUTDIR, exist_ok=True)

def fetch(url):
    result = subprocess.run(['curl', '-sf', url], capture_output=True, text=True, timeout=15)
    if result.returncode != 0:
        raise RuntimeError(f'fetch failed: {result.stderr[:200]}')
    return result.stdout

def check_exists(slug):
    try:
        resp = json.loads(fetch(f'{SERVER}/api/spells/{slug}'))
        ft = resp.get('full_text', '') or ''
        return len(ft) > 50
    except:
        return False

def generate_full_text(title, category, tradition, summary):
    prompt = f'''You are a grimoire author writing detailed spell instructions.
Return ONLY a JSON object (no markdown, no backticks) with this schema:
{{"full_text":"..."}}

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

    result = subprocess.run(
        ['ollama', 'run', MODEL, '--format', 'json', prompt],
        capture_output=True, text=True, timeout=300,
        stdin=subprocess.DEVNULL
    )
    if result.returncode != 0:
        raise RuntimeError(f'ollama error: {result.stderr[:200]}')

    data = result.stdout
    start = data.find('{')
    if start < 0:
        raise RuntimeError('no JSON in response')
    data = data[start:]
    end = data.rfind('}')
    data = data[:end+1]

    obj = json.loads(data, strict=False)
    ft = obj.get('full_text', '')
    if not ft:
        raise RuntimeError('empty full_text')
    return ft

def main():
    auto = '--auto' in sys.argv

    print('=' * 50)
    print(f' MagusMe Spell Content Filler')
    print(f' Model: {MODEL}')
    print(f' Server: {SERVER}')
    print('=' * 50)

    # Fetch spells
    print(f'Fetching spells from {SERVER}/api/spells...')
    raw = fetch(f'{SERVER}/api/spells?limit=100')
    data = json.loads(raw)
    spells = data.get('spells', data if isinstance(data, list) else [])
    print(f'Found {len(spells)} spells to process')
    print()

    updates = []
    errors = []

    for i, s in enumerate(spells):
        slug = s['slug']
        title = s['title']
        category = s.get('category', '')
        tradition = s.get('tradition', '')
        summary = s.get('summary', '') or ''

        # Check if existing content
        if check_exists(slug):
            print(f'  SKIP [{slug}] {title} (already has content)')
            continue

        print(f'')
        print(f'→ [{slug}] {title} ({category}, {tradition})')

        try:
            ft = generate_full_text(title, category, tradition, summary)
            updates.append({'slug': slug, 'full_text': ft})
            print(f'  ✓ Generated {len(ft)} chars')
        except Exception as e:
            errors.append((slug, title, str(e)))
            print(f'  ✗ Failed to generate for {title}: {str(e)[:80]}')
            with open(f'{OUTDIR}/errors.log', 'a') as f:
                f.write(f'[{datetime.now().strftime("%H:%M:%S")}] FAILED: {slug} — {title}\n')

        # Small delay between generations
        time.sleep(1)

    # Summary
    print()
    print('=' * 50)
    print(f' Generated {len(updates)} spell texts')
    print(f' Failed {len(errors)} spell texts')
    print('=' * 50)

    if not updates:
        print('Nothing to upload.')
        return

    # Write output
    ts = datetime.now().strftime('%Y%m%d_%H%M%S')
    outfile = f'{OUTDIR}/spell_fill_{ts}.json'
    with open(outfile, 'w') as f:
        json.dump(updates, f, indent=2, ensure_ascii=False)
    print(f'Wrote {len(updates)} updates to {outfile}')

    # Curate
    curated = outfile.replace('.json', '_curated.json')
    subprocess.run([sys.executable,
        os.path.join(os.path.dirname(__file__), 'curate-fulltext.py'),
        outfile, curated], check=True)

    # Preview
    print()
    print('Preview:')
    for u in updates:
        preview = u['full_text'][:120].replace('\n', ' ')
        print(f'  [{u["slug"]}] {preview}...')

    # Upload
    if auto:
        ans = 'y'
    else:
        ans = input('Upload to MagusMe server? [y/N] ')

    if ans.lower() == 'y':
        admin_secret = os.environ.get('ADMIN_SECRET', '')

        if not admin_secret:
            try:
                with open(os.path.join(os.path.dirname(__file__), '..', '.env')) as f:
                    for line in f:
                        if line.startswith('ADMIN_SECRET='):
                            admin_secret = line.strip().split('=', 1)[1]
                            break
            except:
                pass

        if not admin_secret:
            print('ERROR: ADMIN_SECRET not found.')
            return

        # Get CSRF
        try:
            csrf_raw = subprocess.run(
                ['curl', '-sf', f'{SERVER}/api/auth/csrf', '-c', '/tmp/magusme_fill_cookies.txt'],
                capture_output=True, text=True, timeout=15)
            csrf_data = json.loads(csrf_raw.stdout)
            csrf = csrf_data.get('csrfToken', '')
            if not csrf:
                import re
                cookie_data = open('/tmp/magusme_fill_cookies.txt').read()
                m = re.search(r'nc_csrf\s+(\w+)', cookie_data)
                if m:
                    csrf = m.group(1)
        except Exception as e:
            print(f'ERROR getting CSRF: {e}')
            return

        if not csrf:
            print('ERROR: Could not get CSRF token')
            return

        # Admin login
        login_result = subprocess.run(
            ['curl', '-sf', '-X', 'POST', f'{SERVER}/api/auth/admin-login',
             '-H', 'Content-Type: application/json',
             '-H', f'X-CSRF-Token: {csrf}',
             '-b', '/tmp/magusme_fill_cookies.txt',
             '-c', '/tmp/magusme_fill_cookies.txt',
             '-d', json.dumps({'secret': admin_secret})],
            capture_output=True, text=True, timeout=15)
        if login_result.returncode != 0:
            print(f'ERROR admin login: {login_result.stderr[:200]}')
            return
        print('Login OK')

        # Get fresh CSRF from cookie
        import re
        cookie_data = open('/tmp/magusme_fill_cookies.txt').read()
        m = re.search(r'nc_csrf\s+(\w+)', cookie_data)
        if m:
            csrf = m.group(1)

        # Upload
        tmpfile = '/tmp/magusme_fill_updates.json'
        with open(tmpfile, 'w') as f:
            json.dump(updates, f)

        upload_result = subprocess.run(
            ['curl', '-sf', '-X', 'POST', f'{SERVER}/api/admin/spells/update-fulltext',
             '-H', 'Content-Type: application/json',
             '-H', f'X-CSRF-Token: {csrf}',
             '-b', '/tmp/magusme_fill_cookies.txt',
             '-d', f'@{tmpfile}'],
            capture_output=True, text=True, timeout=30)
        if upload_result.returncode != 0:
            print(f'ERROR upload: {upload_result.stderr[:200]}')
        else:
            print(f'Upload result: {upload_result.stdout}')

        os.unlink(tmpfile) if os.path.exists(tmpfile) else None
        os.unlink('/tmp/magusme_fill_cookies.txt') if os.path.exists('/tmp/magusme_fill_cookies.txt') else None
    else:
        print(f'Saved locally at: {outfile}')

if __name__ == '__main__':
    main()