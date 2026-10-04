#!/usr/bin/env python3
"""Bundle public tracked source and explicitly named new onboarding files only."""
import hashlib
import json
import pathlib
import subprocess
import zipfile

root = pathlib.Path(__file__).resolve().parent.parent
new_files = ['Start VDAI.command', 'Start VDAI.cmd', 'START-HERE.md',
             'scripts/start-guided.sh', 'scripts/build-starter.py', 'docs/WORKING.md']
files = set(subprocess.check_output(['git', 'ls-files', '-z'], cwd=root).decode().split('\0'))
files.update(new_files)
files.discard('')
files = sorted(p for p in files if not p.startswith(('site/', '.build/', 'runtime/', 'backups/'))
               and p not in ('.env', '.env.local') and (root / p).is_file())
dest = root / 'site/assets/vdai-os-starter.zip'
manifest = {'schema': 'vdai.starter.v1', 'kind': 'public-source-guided-launcher',
            'files': {p: hashlib.sha256((root / p).read_bytes()).hexdigest() for p in files}}
manifest['sourceSnapshot'] = hashlib.sha256(json.dumps(manifest['files'], sort_keys=True).encode()).hexdigest()
with zipfile.ZipFile(dest, 'w', zipfile.ZIP_DEFLATED) as z:
    for p in files:
        if (root / p).is_symlink():
            raise SystemExit('Refuse symlink: ' + p)
        info = zipfile.ZipInfo('vdai-os/' + p, (2026, 10, 3, 0, 0, 0))
        info.create_system = 3
        mode = 0o755 if p.endswith(('.sh', '.command')) else 0o644
        info.external_attr = (0o100000 | mode) << 16
        info.compress_type = zipfile.ZIP_DEFLATED
        z.writestr(info, (root / p).read_bytes())
    info = zipfile.ZipInfo('vdai-os/STARTER-MANIFEST.json', (2026, 10, 3, 0, 0, 0))
    info.create_system = 3
    info.external_attr = 0o100644 << 16
    info.compress_type = zipfile.ZIP_DEFLATED
    z.writestr(info, json.dumps(manifest, indent=2))
print(json.dumps({'path': str(dest), 'files': len(files), 'bytes': dest.stat().st_size,
                  'sha256': hashlib.sha256(dest.read_bytes()).hexdigest()}))
agent_root = root / 'onboarding/agent-starter'
agent_dest = root / 'site/assets/vdai-agent-starter.zip'
agent_files = ['AGENTS.md', 'START-HERE.md', '.gitignore', 'tools/check-response.py']
with zipfile.ZipFile(agent_dest, 'w', zipfile.ZIP_DEFLATED) as z:
    for p in agent_files:
        info = zipfile.ZipInfo('VDAI-Start/' + p, (2026, 10, 3, 0, 0, 0))
        info.create_system = 3
        info.external_attr = (0o100644 << 16)
        info.compress_type = zipfile.ZIP_DEFLATED
        z.writestr(info, (agent_root / p).read_bytes())
print(json.dumps({'path': str(agent_dest), 'files': len(agent_files), 'bytes': agent_dest.stat().st_size,
                  'sha256': hashlib.sha256(agent_dest.read_bytes()).hexdigest()}))
