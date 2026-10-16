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
const context={window:{}};vm.runInNewContext(await readFile(path.join(out,'assets/recipes.js'),'utf8'),context);
assert.equal(context.window.KITCHEN_GUIDE.recipes.length,6);
const source=(await readFile(path.join(root,'plugins/kitchen-sink/hooks/register.js'),'utf8')).trimEnd().split('\n');
for(const recipe of context.window.KITCHEN_GUIDE.recipes)assert.equal(recipe.code,source.slice(recipe.line-1,recipe.end).join('\n'),`Stale excerpt: ${recipe.id}`);
assert.ok(html.includes('BROWSER SIMULATION'));
assert.ok(html.includes('prefers-reduced-motion') || (await readFile(path.join(out,'style.css'),'utf8')).includes('prefers-reduced-motion'));
console.log(`Guide check passed: ${ids.length} unique anchors, ${refs.length} static references, 6 current source excerpts.`);
