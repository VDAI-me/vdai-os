#!/usr/bin/env node
// Real isolated browser regression: every page, link, disclosure and carousel control.
// Usage: node scripts/test-onboarding-browser.mjs <base-url> <output-dir> [playwright-module-path]
import {createRequire} from 'node:module';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[4]||'playwright');
const base=process.argv[2]||'http://127.0.0.1:8777',out=resolve(process.argv[3]||'work/browser-proof');mkdirSync(out,{recursive:true});
const paths=['','docs/','status/','support/','download/','security/','changelog/','install/mac/','install/windows/','install/server/'];
const browser=await chromium.launch({channel:'chrome',headless:true});
const report={base,mode:'isolated headless, anonymous; no form submission, messages or account creation',pages:[],failures:[],external:[],controls:0,links:0};
const context=await browser.newContext({reducedMotion:'reduce'}),page=await context.newPage();
page.on('pageerror',e=>report.failures.push({type:'pageerror',error:e.message,url:page.url()}));
for(const width of [1440,390])for(const lang of ['ru','en'])for(const path of paths){
 const url=base+'/'+(lang==='en'?'en/':'')+path;const item={url,width,lang,links:0,controls:0};
 try{
  await page.setViewportSize({width,height:900});let response=await page.goto(url);if(response.status()!==200)throw Error('HTTP '+response.status());
  if(await page.locator('html').getAttribute('lang')!==lang)throw Error('wrong locale');
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('horizontal overflow');
  if(!await page.locator('.language-switch').isVisible())throw Error('hidden language switch');
  // Check the inherited background, including transparent ancestor backgrounds.
  const contrast=await page.locator('.compare .good').evaluateAll(els=>els.map(el=>{
   const c=s=>s.match(/[\d.]+/g).map(Number);let bg=getComputedStyle(el).backgroundColor,p=el;
   while(c(bg)[3]===0&&p.parentElement){p=p.parentElement;bg=getComputedStyle(p).backgroundColor}
   const lum=s=>c(s).slice(0,3).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((v,x,i)=>v+x*[.2126,.7152,.0722][i],0);
   const a=lum(getComputedStyle(el).color),b=lum(bg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)
  }));if(contrast.some(x=>x<4.5))throw Error('unreadable card contrast '+contrast);item.contrast=contrast;
  if(path===''){
   for(const entry of ['telegram','email'])if(!await page.locator('[data-entry="'+entry+'"]').count())throw Error('missing join channel '+entry);
   await page.locator('a.button[href="#join"]').first().click();await page.locator('#join').scrollIntoViewIfNeeded();
   await page.locator('.contact-fallback > summary').click();
   for(const entry of ['telegram','email'])if(!await page.locator('[data-entry="'+entry+'"]').isVisible())throw Error('entry not reachable '+entry);
   if(await page.locator('[data-carousel]').count()){const live=page.locator('[data-live]');await page.locator('[data-next]').click();if(!(await live.innerText()).includes(lang==='en'?'2 of 6':'2 из 6'))throw Error('next button');
   await page.locator('[data-prev]').click();if(!(await live.innerText()).includes(lang==='en'?'1 of 6':'1 из 6'))throw Error('previous button');
   await page.locator('[data-carousel]').press('ArrowRight');await page.locator('[data-carousel]').press('ArrowLeft');
   for(let i=0;i<6;i++){await page.locator('[data-dots] button').nth(i).click();const label=await live.innerText();if(!label.includes(String(i+1)+(lang==='en'?' of 6':' из 6')))throw Error('dot '+i)}
   item.controls+=10;}
  }
  const summaries=await page.locator('summary').count();for(let i=0;i<summaries;i++){
   const summary=page.locator('summary').nth(i),before=await summary.evaluate(el=>el.parentElement.open);await summary.click();if(await summary.evaluate(el=>el.parentElement.open)===before)throw Error('disclosure not toggled');await summary.click();item.controls+=2;
  }
  while(await page.locator('details:not([open]) > summary').count()){await page.locator('details:not([open]) > summary').first().click();item.controls++;}
  const links=await page.locator('a[href]').evaluateAll(els=>els.map(el=>({href:el.getAttribute('href'),text:el.textContent.trim(),target:el.target,card:el.closest('.project-card')?.id})));
  for(let i=0;i<links.length;i++){
   const link=links[i],dest=new URL(link.href,url);
   if(dest.origin===new URL(base).origin){
    // Every local anchor must resolve to actual content, not only HTTP 200.
    const r=await context.request.get(dest.href);if(r.status()!==200)throw Error('broken local link '+link.href);const text=await r.text();
    if(dest.hash&&!text.includes('id="'+decodeURIComponent(dest.hash.slice(1))+'"'))throw Error('missing fragment '+link.href);
   }
   // Click the rendered link while intercepting navigation to avoid sending or invoking apps.
   if(link.card){const ids=await page.locator('.project-card').evaluateAll(els=>els.map(e=>e.id));await page.locator('[data-dots] button').nth(ids.indexOf(link.card)).click()}
   const locator=page.locator('a[href]').nth(i);if(!await locator.isVisible()){item.hidden=(item.hidden||0)+1;continue;}
   if(await locator.evaluate(el=>el.classList.contains('status-skip')))await locator.focus();
   const clicked=await locator.evaluate(el=>{window.__entryClicked=false;const handler=e=>{e.preventDefault();window.__entryClicked=true};el.addEventListener('click',handler,{once:true});return true});
   await locator.click({timeout:5000});if(!clicked||!await page.evaluate(()=>window.__entryClicked))throw Error('click did not reach link '+link.href);
   item.links++;
  }
  if(['','status/','download/'].includes(path)){
   await page.goto(url+(path===''?'#join':''));if(path==='')await page.locator('#join').scrollIntoViewIfNeeded();
   await page.screenshot({path:resolve(out,`${lang}-${path.replaceAll('/','')||'join'}-${width}.png`)});
  }
 }catch(e){report.failures.push({url,width,error:e.message})}
 report.pages.push(item);report.links+=item.links;report.controls+=item.controls;console.log(JSON.stringify(item));
}
// External destinations: inspect public landing content, not merely status codes.
for(const url of ['https://github.com/VDAI-me/vdai-os','https://api.github.com/repos/VDAI-me/vdai-os/releases','https://t.me/Posbitcoin']){
 try{
  const data=JSON.parse(execFileSync('python3',['-c',`import urllib.request,json,re,sys
u=sys.argv[1]
with urllib.request.urlopen(u,timeout=25) as r:
 s=r.read().decode(); title=re.search(r'<title>(.*?)</title>',s,re.S)
 j={'url':u,'finalUrl':r.url,'status':r.status,'title':title.group(1) if title else None}
 if 'api.github.com' in u: j['releases']=len(json.loads(s))
 if '#contact' in u: j['contactAnchor']='id="contact"' in s
 if 'github.com/VDAI-me/vdai-os' in u and 'api.' not in u: j['correctRepository']='VDAI-me/vdai-os' in s
 print(json.dumps(j))`,url],{encoding:'utf8'}));
  report.external.push({...data,verification:'Python standard HTTPS trust; public content, no authenticated profiles'});
  if(data.status!==200||data.contactAnchor===false||data.correctRepository===false)throw Error('external content mismatch');
 }catch(e){report.failures.push({url,error:e.message})}
}
report.passed=!report.failures.length;writeFileSync(resolve(out,'browser-report.json'),JSON.stringify(report,null,2));await browser.close();console.log('BROWSER_RESULT',JSON.stringify({passed:report.passed,pages:report.pages.length,links:report.links,controls:report.controls,failures:report.failures}));if(!report.passed)process.exitCode=1;
