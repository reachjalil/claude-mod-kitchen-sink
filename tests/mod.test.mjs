import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from '../plugins/kitchen-sink/hooks/register.js';

// A tiny API double, not a renderer or a replacement for native validation.
function lab(saved, options = {}) {
  const hooks = [];
  const store = new Map(saved === undefined ? [] : [['scratch-note', saved]]);
  const commands = [], tools = [], drafts = [];
  let pane = true;
  const elements = Object.fromEntries(['Box', 'Text', 'Button', 'Input'].map(name => [name, props => ({ type: name, ...props })]));
  const api = {
    store: { get: async k => { if (options.storeError) throw new Error('unavailable'); return store.get(k); }, set: async (k,v) => { store.set(k,v); }, delete: async k => { store.delete(k); } },
    command: { register: async c => { commands.push(c); } },
    tool: { register: async t => { tools.push(t); } },
    session: { surfaces: async () => [] },
    prompt: { read: async () => ({ text: options.draft || '' }), fill: async v => { drafts.push(v); return { isFilled: true }; } },
    ui: { resolve: () => elements, invalidate: () => {}, toast: async () => {}, open: async () => ({ isPlaced: pane }) },
  };
  register((event, filter, fn) => {
    if (typeof filter === 'function') { fn = filter; filter = {}; }
    const hook = { event, filter, fn };
    hooks.push(hook);
    return { catch: cb => { hook.catch = cb; } };
  });
  async function fire(event, data = {}, tail = async e => ({ passed: e })) {
    const matches = hooks.filter(h => h.event === event && Object.entries(h.filter).every(([k,v]) => data[k] === v));
    const dispatch = async (i,e) => i === matches.length ? tail(e) : matches[i].fn(api,e,n => dispatch(i+1,n));
    return dispatch(0, Object.freeze(data));
  }
  const render = (component, extra = {}, tail) => fire('ui.render', { component, requestId: 'kitchen-sink-lab', surface: 'desktop', props: {}, ...extra }, tail);
  return { fire, render, store, commands, tools, drafts, noPane: () => { pane = false; } };
}
function walk(tree) { return tree && typeof tree === 'object' ? [tree, ...(tree.children || []).flatMap(walk)] : []; }
function control(tree,key) { const found = walk(tree).find(n => n.key === key); assert.ok(found, key); return found; }
async function ready(saved) { const l=lab(saved); await l.fire('session.start'); return l; }

test('registers commands and a strictly bounded imaginary tool', async () => {
  const l=await ready();
  assert.deepEqual(l.commands.map(c=>c.name), ['kitchen','kitchen-status']);
  assert.equal(l.tools[0].inputSchema.properties.portions.maximum, 3);
});
test('ordinary prompts pass through identically; explicit prefix rewrites only that prompt', async () => {
  const l=await ready();
  const original={text:'Keep this exactly.  ', origin:{kind:'user'}};
  assert.deepEqual((await l.fire('prompt.submit',original)).passed,original);
  const changed=(await l.fire('prompt.submit',{text:'[ks:brief] Explain panes'})).passed;
  assert.equal(changed.text,'Explain panes\n\nPlease answer in at most three concise bullet points.');
});
test('demo tool refuses invalid inputs and never reaches the external tool runner', async () => {
  const l=await ready(); let reached=false;
  for(const portions of [0,4,1.5,'2',null,undefined]) {
    assert.ok((await l.fire('tool.call',{tool:'mcp__kitchen-sink__mix',portions},async()=>{reached=true;})).deny);
  }
  assert.match((await l.fire('tool.call',{tool:'mcp__kitchen-sink__mix',portions:2})).result,/2 imaginary/);
  assert.equal(reached,false);
});
test('unrelated tools pass through and activity labels do not keep tool arguments', async () => {
  const l=await ready(); const e={tool:'Read',secret:'do-not-record'};
  assert.deepEqual((await l.fire('tool.call',e)).passed,e);
  let tree=await l.render('Pane'); await control(tree,'tab-events').onPress(); tree=await l.render('Pane');
  assert.ok(!JSON.stringify(tree).includes('do-not-record'));
  assert.match((await l.fire('command.run',{command:'kitchen-status'})).text,/tools: 1/);
});
test('band composes with other mods and unrelated panes pass through', async () => {
  const l=await ready(); const other={type:'OtherMod'};
  assert.deepEqual((await l.render('AbovePrompt',{},async()=>other)).children[0],other);
  assert.deepEqual(await l.render('Pane',{requestId:'someone-else'},async()=>other),other);
});
test('buttons change counters and fill a draft without submitting a prompt', async () => {
  const l=await ready(); let tree=await l.render('Pane');
  control(tree,'counter').onPress(); await control(tree,'draft-brief').onPress();
  assert.equal(l.drafts[0].mode,'append');
  assert.match(l.drafts[0].text,/^\[ks:brief\]/);
  assert.match((await l.fire('command.run',{command:'kitchen-status'})).text,/clicks: 1/);
});
test('saved notes survive a fresh module and can be deleted; text stays bounded', async () => {
  const l=await ready(); let tree=await l.render('Pane'); await control(tree,'tab-notes').onPress(); tree=await l.render('Pane');
  await control(tree,'scratch-note').onSubmit('n'.repeat(700));
  assert.equal(l.store.get('scratch-note').length,500);
  const fresh=await ready(l.store.get('scratch-note')); tree=await fresh.render('Pane'); await control(tree,'tab-notes').onPress(); tree=await fresh.render('Pane');
  assert.equal(control(tree,'scratch-note').value.length,500);
  await control(tree,'forget-note').onPress(); assert.equal(fresh.store.size,0);
});
test('headless command explains absent renderer and status still works', async () => {
  const l=await ready(); l.noPane();
  assert.match((await l.fire('command.run',{command:'kitchen'})).text,/No pane/);
  assert.match((await l.fire('command.run',{command:'kitchen-status'})).text,/none/);
});
test('event labels remain bounded and reset does not remove the saved note', async () => {
  const l=await ready('keep');
  for(let i=0;i<20;i++) await l.fire('turn.complete');
  let tree=await l.render('Pane'); await control(tree,'tab-events').onPress(); tree=await l.render('Pane');
  assert.equal(walk(tree).filter(n=>n.type==='Text' && n.children?.[0]==='turn.complete').length,12);
  await control(tree,'reset-events').onPress();
  assert.match((await l.fire('command.run',{command:'kitchen-status'})).text,/turns: 0/);
  assert.equal(l.store.get('scratch-note'),'keep');
});

// Regression checks from the public-guide review.
test('a note-store read failure still registers the lab', async () => {
  const l=lab(undefined,{storeError:true}); await l.fire('session.start');
  assert.deepEqual(l.commands.map(c=>c.name), ['kitchen','kitchen-status']);
});
test('draft buttons preserve an existing prompt instead of concatenating examples', async () => {
  const l=lab(undefined,{draft:'Keep my work'}); await l.fire('session.start');
  const tree=await l.render('Pane');
  await control(tree,'draft-brief').onPress(); await control(tree,'draft-mix').onPress();
  assert.equal(l.drafts.length,0);
});
