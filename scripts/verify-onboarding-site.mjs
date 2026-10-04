#!/usr/bin/env node
import { readFileSync } from 'node:fs';import { resolve,dirname } from 'node:path';import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),files=['site/index.html','site/install/mac/index.html','site/install/windows/index.html','site/install/server/index.html','site/docs/index.html','site/security/index.html','site/status/index.html','site/support/index.html','site/download/index.html','site/changelog/index.html'],errors=[];
for(const file of files){let t='';try{t=readFileSync(resolve(root,file),'utf8')}catch{errors.push(`missing ${file}`);continue}if(!t.includes('name="viewport"'))errors.push(`viewport ${file}`);if(/API[_ -]?KEY\s*=|BOT_TOKEN\s*=|PG_DATABASE_PASSWORD\s*=/i.test(t))errors.push(`secret-like content ${file}`)}
const home=readFileSync(resolve(root,'site/index.html'),'utf8'),carousel=readFileSync(resolve(root,'site/assets/projects-carousel.js'),'utf8');for(const s of ['id="join"','id="how"','data-entry="telegram"','https://github.com/VDAI-me/vdai-os'])if(!home.includes(s))errors.push(`home missing ${s}`);for(const s of ['7000','ArrowLeft','ArrowRight','pointerdown','prefers-reduced-motion','mouseenter','focusin'])if(!carousel.includes(s))errors.push(`carousel missing ${s}`);if(errors.length){console.error(errors.join('\n'));process.exit(1)}console.log(`ONBOARDING_SITE_PASS ${files.length} pages + accessible carousel`);

// Check the complete translated journey, including language changes on inner pages.
const languageErrors=[];
const ruPages=files.map(file=>file.replace(/^site\//,''));
for(const rel of ruPages){
  for(const lang of ['ru','en']){
    const file=`site/${lang==='en'?'en/':''}${rel}`;
    let html;
    try{html=readFileSync(resolve(root,file),'utf8')}catch{languageErrors.push(`missing ${file}`);continue}
    if(!html.includes(`<html lang="${lang}">`))languageErrors.push(`document language ${file}`);
    if(!html.includes('name="viewport"'))languageErrors.push(`viewport ${file}`);
    if(lang==='en'&&/[А-Яа-яЁё]/.test(html))languageErrors.push(`untranslated content ${file}`);
    if(/API[_ -]?KEY\s*=|BOT_TOKEN\s*=|PG_DATABASE_PASSWORD\s*=/i.test(html))languageErrors.push(`secret-like content ${file}`);
    const path=rel==='index.html'?'/':`/${rel.replace(/index.html$/,'')}`;
    for(const target of [path,`/en${path}`]){
      if(!html.includes(`href="${target}"`))languageErrors.push(`language counterpart ${file}: ${target}`);
    }
    if(!html.includes('class="language-switch"')||!html.includes(`lang="${lang}" hreflang="${lang}" href="${lang==='ru'?path:'/en'+path}" aria-current="page"`))languageErrors.push(`active language ${file}`);
    for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
      const href=match[1];if(!href.startsWith('/')&&!href.startsWith('#'))continue;
      const [url,fragment]=href.split('#');
      const localPath=url?(url.endsWith('/')?`site${url}index.html`:`site${url}`):file;
      let target;
      try{target=readFileSync(resolve(root,localPath),'utf8')}catch{languageErrors.push(`broken local link ${file}: ${href}`);continue}
      if(fragment&&!target.includes(`id="${fragment}"`))languageErrors.push(`broken fragment ${file}: ${href}`);
      if(lang==='en'&&url&&url.endsWith('/')&&!url.startsWith('/en/')&&!html.includes(`hreflang="ru" href="${url}"`))languageErrors.push(`English journey leaves locale ${file}: ${href}`);
    }
  }
}
if(languageErrors.length){console.error(languageErrors.join('\n'));process.exit(1)}
console.log(`BILINGUAL_SITE_PASS ${ruPages.length*2} pages · languages, counterparts, local links and fragments`);

// Regressions: participation requires a real contact action; an empty release page is not a download.
const entryErrors=[];
for(const locale of ['', 'en/']){
 const entry=readFileSync(resolve(root,`site/${locale}index.html`),'utf8');
 const join=entry.match(/<section id="join">([\s\S]*?)<\/section>/)?.[1]||'';
 for(const channel of ['telegram','email'])if(!join.includes(`data-entry="${channel}"`))entryErrors.push(`missing contact channel ${locale}${channel}`);
 if(!join.includes('https://t.me/Posbitcoin')||!join.includes('mailto:dima@vda.vc'))entryErrors.push(`owner contact missing ${locale}`);
 for(const rel of ['download/index.html','install/mac/index.html','install/windows/index.html']){
  const html=readFileSync(resolve(root,`site/${locale}${rel}`),'utf8');
  if(/href="https:\/\/github\.com\/VDAI-me\/vdai-os\/releases/.test(html))entryErrors.push(`empty release route ${locale}${rel}`);
 }
}
if(entryErrors.length){console.error(entryErrors.join('\n'));process.exit(1)}
console.log('ENTRY_REGRESSION_PASS contact channels and no fictitious release download');

for(const locale of ['', 'en/']){const html=readFileSync(resolve(root,`site/${locale}index.html`),'utf8');if(html.includes('vdai.me/en#contact')||html.includes('data-entry="club"'))throw Error('duplicate public entry route');if((html.match(/class="button" href="#join"/g)||[]).length!==1)throw Error('one primary join action required');}
console.log('UNIFIED_ENTRY_PASS one primary route and corporate repository');
