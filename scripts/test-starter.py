import tempfile,pathlib,subprocess,shutil,json,zipfile,os
r=pathlib.Path(__file__).resolve().parent.parent
report={'format':[],'launcher':[],'bundles':[]}
with tempfile.TemporaryDirectory() as d:
 p=pathlib.Path(d);shutil.copytree(r/'onboarding/agent-starter',p/'agent');a=p/'agent';draft=a/'draft.md'
 def text(start=1):
  return '''Result: Useful local artifact.\nCheck: File read back.\nCritique: No customer acceptance.\nBottlenecks:\n- One machine only.\n- Shared access unknown.\nProblemOS\nP — confusing installation\nU — missing proof\nL — no hidden approval\nR — checked local artifact\nN — user readback\nWhere next:\n'''+''.join(f'{i} = '+('⭐ ' if i==start else '')+'Check one thing\n' for i in range(start,start+4))+f'0 = Do all compatible actions\nWhy: verifies the real result.\nRecommend: {start}\n'
 def check(t,commit=False):
  draft.write_text(t);cmd=['python3',str(a/'tools/check-response.py'),'--task','test','--draft',str(draft)]+(['--commit-visible'] if commit else []);return subprocess.run(cmd,capture_output=True,text=True)
 assert check(text()).returncode==0
 assert not (a/'.vdai').exists()
 assert check(text(),True).returncode==0
 assert check(text()).returncode==1
 assert check(text(5),True).returncode==0
 assert check(text(9).replace('N — user readback','')).returncode==1
 assert check(text(9).replace('Recommend: 9','Recommend: 10')).returncode==1
 assert json.loads((a/'.vdai/menu-state.json').read_text())['test']==8
 report['format']=['preview does not mutate state','first commit 1–4','repeated numbers rejected','second commit 5–8','missing ProblemOS rejected','wrong recommendation rejected']
 b=p/'launcher';(b/'scripts').mkdir(parents=True);shutil.copy(r/'scripts/start-guided.sh',b/'scripts/start-guided.sh');(b/'scripts/bootstrap.sh').write_text('#!/bin/bash\necho bootstrap >> "$VDAI_TEST_LOG"\n')
 bin=p/'bin';bin.mkdir();log=p/'log'
 for name,body in {'node':'exit 0','pnpm':'echo "pnpm $*" >> "$VDAI_TEST_LOG"\nif [[ "$1" == --version ]]; then echo 11.19.0; fi','docker':'if [[ "$1" == info && "${VDAI_TEST_DOCKER:-}" == blocked ]]; then exit 1; fi\necho "docker $*" >> "$VDAI_TEST_LOG"','openssl':'echo synthetic','curl':'if [[ "$*" == *healthz* ]]; then exit 0; fi\nexit 1'}.items():
  f=bin/name;f.write_text('#!/bin/bash\n'+body+'\n');f.chmod(0o755)
 env={**os.environ,'PATH':str(bin)+':/usr/bin:/bin','VDAI_TEST_LOG':str(log)}
 script=str(b/'scripts/start-guided.sh')
 def run(args=[],input='',more={}):return subprocess.run(['bash',script,*args],input=input,capture_output=True,text=True,env={**env,**more})
 assert run(['--check']).returncode==0
 assert 'pnpm install' not in log.read_text()
 assert run(['--check'],more={'VDAI_TEST_DOCKER':'blocked'}).returncode==1
 assert run(input='n\n').returncode==0
 assert 'bootstrap' not in log.read_text()
 assert run(input='y\n\n').returncode==0
 s=log.read_text();assert 'pnpm install --frozen-lockfile' in s and 'pnpm twenty remote:add --url http://localhost:3000' in s and 'pnpm twenty apply' in s
 assert run(input='y\n',more={'SERVER_URL':'https://example.invalid'}).returncode==1
 report['launcher']=['check-only does not install','stopped Docker is explained','decline makes no startup changes','mock full path checks consent/account/OAuth/apply order','custom remote endpoint rejected']
for name in ['vdai-agent-starter.zip','vdai-os-starter.zip']:
 with zipfile.ZipFile(r/'site/assets'/name) as z:
  assert z.testzip() is None
  for n in z.namelist():
   assert not n.startswith('/') and '..' not in pathlib.PurePosixPath(n).parts
   assert not pathlib.PurePosixPath(n).name in ['.env','.env.local','auth.json']
  if name.startswith('vdai-agent'):assert len(z.namelist())==4
  else:
   mode=z.getinfo('vdai-os/Start VDAI.command').external_attr>>16;assert mode&0o111
  report['bundles'].append({'file':name,'files':len(z.namelist()),'safePaths':True,'excludedSecrets':True})
(r/'runtime').mkdir(exist_ok=True)
(r/'runtime/starter-tests.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report))
