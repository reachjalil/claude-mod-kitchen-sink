import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const out=path.join(root,'dist/site');
const html=await readFile(path.join(out,'index.html'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size,'Duplicate HTML IDs');
const refs=[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m=>m[1]);
for(const ref of refs){
 if(/^(https?:|data:|mailto:)/.test(ref))continue;
 if(ref.startsWith('#')){assert.ok(ids.includes(ref.slice(1)),`Missing anchor ${ref}`);continue;}
 assert.ok(!ref.startsWith('/'),`Root-relative asset breaks project Pages: ${ref}`);
 await stat(path.join(out,ref.split('#')[0]));
}
const css=await readFile(path.join(out,'style.css'),'utf8');
for(const match of css.matchAll(/url\(['"]?([^)'"]+)['"]?\)/g)){
 const asset=match[1];
 assert.ok(!/^(https?:|\/)/.test(asset),`Expected a self-hosted, project-relative CSS asset: ${asset}`);
 await stat(path.join(out,asset));
}
const illustrations=[...html.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);
assert.ok(illustrations.length>0,'The guide needs its explainer illustration');
for(const img of illustrations){
 assert.match(img,/alt="[^"]+"/,'Explainer needs descriptive alt text');
 assert.match(img,/width="\d+"/,'Reserve image width');
 assert.match(img,/height="\d+"/,'Reserve image height');
}
const context={window:{}};vm.runInNewContext(await readFile(path.join(out,'assets/recipes.js'),'utf8'),context);
assert.equal(context.window.KITCHEN_GUIDE.recipes.length,6);
const source=(await readFile(path.join(root,'plugins/kitchen-sink/hooks/register.js'),'utf8')).trimEnd().split('\n');
for(const recipe of context.window.KITCHEN_GUIDE.recipes)assert.equal(recipe.code,source.slice(recipe.line-1,recipe.end).join('\n'),`Stale excerpt: ${recipe.id}`);
assert.ok(html.includes('BROWSER SIMULATION'));
assert.ok(html.includes('prefers-reduced-motion') || (await readFile(path.join(out,'style.css'),'utf8')).includes('prefers-reduced-motion'));
console.log(`Guide check passed: ${ids.length} unique anchors, ${refs.length} static references, ${illustrations.length} accessible illustration, self-hosted CSS assets, 6 current source excerpts.`);
