import { readFile, stat, readdir } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { lessons } from '../site/course-data.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const out=path.join(root,'dist/site');
async function htmlFiles(directory) {
 const entries=await readdir(directory,{withFileTypes:true});
 const paths=[];
 for(const entry of entries){
  const file=path.join(directory,entry.name);
  if(entry.isDirectory())paths.push(...await htmlFiles(file));
  else if(file.endsWith('.html'))paths.push(file);
 }
 return paths;
}
const pages=new Map();
for(const file of await htmlFiles(out)){
 const html=await readFile(file,'utf8');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,`Duplicate IDs in ${path.relative(out,file)}`);
 assert.equal([...html.matchAll(/<h1\b/g)].length,1,`One page title in ${file}`);
 pages.set(file,{html,ids});
}
let references=0,illustrations=0;
for(const [file,{html,ids}] of pages){
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const ref=match[1];references++;
  if(/^(https?:|data:|mailto:)/.test(ref))continue;
  assert.ok(!ref.startsWith('/'),`Root-relative asset breaks project Pages: ${ref}`);
  const [urlpath,hash]=ref.split('#');
  const pathname=urlpath.split('?')[0];
  const target=pathname?path.resolve(path.dirname(file),pathname):file;
  assert.ok(target===out || target.startsWith(out+path.sep),`Path escaped site output: ${ref}`);
  await stat(target);
  if(hash && pages.has(target))assert.ok(pages.get(target).ids.includes(hash),`Missing anchor ${ref} in ${file}`);
 }
 for(const match of html.matchAll(/aria-labelledby="([^"]+)"/g)){
  for(const id of match[1].split(' '))assert.ok(ids.includes(id),`Missing accessible label ${id} in ${file}`);
 }
 for(const match of html.matchAll(/<img\b[^>]*>/g)){
  const img=match[0];
  assert.match(img,/alt="[^"]*"/,'Images need an alt attribute');
  if(!img.includes('assets/logo.svg'))assert.match(img,/alt="[^"]+"/,'Explain the lesson illustration');
  assert.match(img,/width="\d+"/,'Reserve image width');
  assert.match(img,/height="\d+"/,'Reserve image height');
  illustrations++;
 }
}
for(const cssFile of ['style.css','course.css']){
 const css=await readFile(path.join(out,cssFile),'utf8');
 for(const match of css.matchAll(/url\(['"]?([^)'"]+)['"]?\)/g)){
  const asset=match[1];
  assert.ok(!/^(https?:|\/)/.test(asset),`Expected a self-hosted CSS asset: ${asset}`);
  await stat(path.join(out,asset));
 }
}
assert.equal(lessons.length,8);
for(const file of ['index.html','lessons/03-cowork-workflow.html','reference.html']){
 const html=pages.get(path.join(out,file)).html;
 assert.match(html,/assets\/logo\.svg\?v=[a-f0-9]{12}/,'Version the shared logo for returning visitors');
 assert.match(html,/course\.css\?v=[a-f0-9]{12}/,'Version course styles with the matching markup');
}
const courseScript=await readFile(path.join(out,'course.js'),'utf8');
assert.match(courseScript,/progress\.mjs\?v=[a-f0-9]{12}/,'Version the progress module dependency');
assert.match(courseScript,/paths\.mjs\?v=[a-f0-9]{12}/,'Version the path module dependency');
for(const [i,lesson] of lessons.entries()){
 const page=pages.get(path.join(out,`lessons/${lesson.id}.html`));
 assert.ok(page,`Missing lesson ${lesson.id}`);
 assert.ok(page.html.includes(`data-lesson="${lesson.id}"`));
 assert.ok(page.html.includes('data-checkpoint'),'Every lesson needs a checkpoint');
 assert.ok(page.html.includes('data-complete-lesson'),'Every lesson needs a completion control');
 assert.ok(lesson.answer>=0 && lesson.answer<lesson.options.length,'Valid checkpoint answer');
 if(i<lessons.length-1)assert.ok(page.html.includes(`href="${lessons[i+1].id}.html"`),'Next lesson link');
 if(i>0)assert.ok(page.html.includes(`href="${lessons[i-1].id}.html"`),'Previous lesson link');
}
const context={window:{}};vm.runInNewContext(await readFile(path.join(out,'assets/recipes.js'),'utf8'),context);
assert.equal(context.window.KITCHEN_GUIDE.recipes.length,6);
const source=(await readFile(path.join(root,'plugins/kitchen-sink/hooks/register.js'),'utf8')).trimEnd().split('\n');
for(const recipe of context.window.KITCHEN_GUIDE.recipes)assert.equal(recipe.code,source.slice(recipe.line-1,recipe.end).join('\n'),`Stale excerpt: ${recipe.id}`);
assert.ok([...pages.values()].some(p=>p.html.includes('BROWSER SIMULATION')));
assert.ok((await readFile(path.join(out,'style.css'),'utf8')).includes('prefers-reduced-motion'));
console.log(`Course check passed: ${pages.size} pages, ${lessons.length} connected lessons, ${references} references, ${illustrations} described/decorative images, 6 current source excerpts.`);
