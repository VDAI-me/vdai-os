#!/usr/bin/env python3
"""Public project-local format validation, not a delivery or native naming hook."""
import argparse
import json
import pathlib
import re
import sys

p = argparse.ArgumentParser()
p.add_argument('--task', required=True)
p.add_argument('--draft', type=pathlib.Path, required=True)
p.add_argument('--commit-visible', action='store_true')
args = p.parse_args()
root = pathlib.Path(__file__).resolve().parent.parent
state_path = root / '.vdai/menu-state.json'
state = json.loads(state_path.read_text()) if state_path.exists() else {}
text = args.draft.read_text(encoding='utf-8')
last = state.get(args.task, 0)
numbers = [int(n) for n in re.findall(r'^\s*(\d+)\s*=\s*.+$', text, re.M) if int(n) != 0]
errors = []
if len(numbers) not in (4, 5) or numbers != list(range(last + 1, last + 1 + len(numbers))):
    errors.append(f'Use 4–5 continuous actions starting at {last + 1}')
labels = [('Result:', 'Результат:'), ('Check:', 'Проверка:'), ('Critique:', 'Критика:'),
          ('Bottlenecks:', 'Узкие места:'), ('ProblemOS',), ('Where next:', 'Куда двигаться:')]
positions = []
for choices in labels:
    found = [text.find(s) for s in choices if s in text]
    if not found:
        errors.append('Missing ' + choices[0])
    else:
        positions.append(min(found))
if positions != sorted(positions):
    errors.append('Sections are out of order')
for letter in 'PULRN':
    if not re.search(rf'\b{letter}\s*[—=:-]', text):
        errors.append('Missing ProblemOS ' + letter)
if text.count('⭐') != 1:
    errors.append('Exactly one recommendation star required')
star = re.search(r'^\s*(\d+)\s*=.*⭐', text, re.M)
recommend = re.search(r'(?:Recommend|Реко):\s*(\d+)', text)
if not star or not recommend or star.group(1) != recommend.group(1) or int(star.group(1)) not in numbers:
    errors.append('Recommendation must match the starred action')
if not re.search(r'(Why|Почему):\s*\S', text):
    errors.append('Explain the recommendation')
if not re.search(r'^\s*0\s*=\s*\S', text, re.M):
    errors.append('Missing 0 = Do all compatible actions')
if len(positions) == len(labels):
    block = text[positions[3]:positions[4]]
    if len(re.findall(r'^\s*[-*]\s+\S', block, re.M)) not in range(2, 5):
        errors.append('Use 2–4 bottleneck bullets')
if errors:
    print(json.dumps({'status': 'FAIL', 'errors': errors, 'expectedNext': last + 1}))
    sys.exit(1)
if args.commit_visible:
    state_path.parent.mkdir(exist_ok=True)
    state[args.task] = numbers[-1]
    temp = state_path.with_suffix('.tmp')
    temp.write_text(json.dumps(state, indent=2), encoding='utf-8')
    temp.replace(state_path)
print(json.dumps({'status': 'PASS', 'first': numbers[0], 'last': numbers[-1],
                  'next': numbers[-1] + 1, 'committed': args.commit_visible}))
