import { mkdir, cp, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const out=path.join(root,'dist/site');
const repository=process.env.GITHUB_REPOSITORY || 'reachjalil/claude-mod-kitchen-sink';
if(!/^[\w.-]+\/[\w.-]+$/.test(repository))throw new Error('Expected GITHUB_REPOSITORY in owner/name form');
await mkdir(out,{recursive:true});
await cp(path.join(root,'site'),out,{recursive:true});
let html=await readFile(path.join(out,'index.html'),'utf8');
const rootDocs=new Set(['README.md','SECURITY.md','CONTRIBUTING.md','LICENSE']);
html=html.replace(/href="\.\/reference\/([^"]+)"/g,(_,file)=>`href="https://github.com/${repository}/blob/main/${rootDocs.has(file)?'':'docs/'}${file}"`);
await writeFile(path.join(out,'index.html'),html);
const raw=await readFile(path.join(root,'plugins/kitchen-sink/hooks/register.js'),'utf8');
const lines=raw.trimEnd().split('\n');
const definitions=[
  {id:'observe',title:'Observe a tool call',event:'tool.call → next(e)',start:"  on('tool.call', async",stop:"  // A deliberately narrow gate",description:'Count an action without keeping arguments or changing the tool call. Asking the host to redraw makes the new counter visible.',try:'Ask Claude to read a harmless file, then inspect Events.'},
  {id:'rewrite',title:'Rewrite one prompt',event:'prompt.submit → next(copy)',start:"  on('prompt.submit'",stop:"  on('turn.complete'",description:'The explicit prefix opts this prompt into the brief-answer recipe. All other prompt text passes through unchanged.',try:'Compare “Explain panes” with “[ks:brief] Explain panes”.'},
  {id:'answer',title:'Handle a demo tool',event:'tool.call → own result',start:"  on('tool.call', { tool:",stop:'  // Opt in on one prompt',description:'Answer only the imaginary tool registered by this plugin. Runtime validation also refuses invalid inputs, even though the tool schema already limits them.',try:'Ask to mix 2 imaginary portions. Unit tests exercise invalid calls directly.'},
  {id:'compose',title:'Compose a UI band',event:'ui.render / AbovePrompt',start:"  on('ui.render', { component: 'AbovePrompt'",stop:"  on('ui.render', { component: 'Pane'",description:'Keep the downstream drawing returned by next(e), then add this mod’s counter and open button. This avoids erasing another mod’s band.',try:'Watch the band as tool activity increases.'},
  {id:'spinner',title:'Change a UI detail',event:'ui.render / Spinner',start:"  on('ui.render', { component: 'Spinner'",stop:"  on('ui.render', { component: 'AbovePrompt'",description:'Copy the render event and extend its suffix. Forwarding to next lets the host keep drawing its usual spinner.',try:'Use a tool and watch the suffix while a turn runs.'},
  {id:'command',title:'Add a text command',event:'command.run → own text',start:"  on('command.run', { command: 'kitchen-status'",stop:'  // Observe a call',description:'A registered command can answer with ordinary text. This gives the lab a useful path when there is no renderer.',try:'Run /kitchen-status and read the reported surfaces.'},
];
const recipes=definitions.map(d=>{
 const start=lines.findIndex(l=>l.startsWith(d.start));
 const stop=lines.findIndex((l,i)=>i>start && l.startsWith(d.stop));
 if(start<0||stop<0)throw new Error(`Snippet not found: ${d.id}`);
 let end=stop;while(end>start && !lines[end-1].trim())end--;
 return { ...d,line:start+1,end,code:lines.slice(start,end).join('\n') };
});
await writeFile(path.join(out,'assets/recipes.js'),`window.KITCHEN_GUIDE = ${JSON.stringify({repository:`https://github.com/${repository}`,recipes})};\n`);
await mkdir(path.join(out,'reference'),{recursive:true});
await cp(path.join(root,'docs'),path.join(out,'reference'),{recursive:true});
for(const file of ['README.md','SECURITY.md','CONTRIBUTING.md','LICENSE'])await cp(path.join(root,file),path.join(out,'reference',file));
execFileSync('python3',[path.join(root,'scripts/package-cowork.py')],{stdio:'inherit'});
await mkdir(path.join(out,'downloads'),{recursive:true});
await cp(path.join(root,'dist/kitchen-cowork.zip'),path.join(out,'downloads/kitchen-cowork.zip'));
await cp(path.join(root,'plugins/kitchen-cowork/examples/workshop-notes.md'),path.join(out,'downloads/workshop-notes.md'));
await writeFile(path.join(out,'.nojekyll'),'');
console.log(`Built static guide: ${out}`);
