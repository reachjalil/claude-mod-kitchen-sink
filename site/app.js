// Browser-only teaching interactions. Never connects to Claude or a model.
(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const escape = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const paths = {
    cowork: { title: 'A reusable workflow, right in Cowork.', badge: 'PROMPT COMMANDS', intro: 'Use the tiny plugin to turn supplied workshop notes into a four-field experiment card. Then change its instructions and compare the next result.', steps: ['Download the plugin ZIP below. In Customize → Plugins, use the custom upload option.', 'Run /kitchen-cowork:tour. Then attach the sample notes and run /kitchen-cowork:experiment.', 'Expect Goal, Smallest change, Observable result, and Next question. The model follows the command instructions; results may vary.'], commands: '/kitchen-cowork:tour\n/kitchen-cowork:experiment', note: 'Uses your normal conversation-model usage. It adds workflow instructions, not a native custom pane.', action: '<a class="button primary" href="./downloads/kitchen-cowork.zip" download>Download Cowork plugin ↓</a> <a class="text-link" href="./downloads/workshop-notes.md" download>Sample notes ↓</a>' },
    code: { title: 'An interactive pane in the desktop Code tab.', badge: 'EXECUTABLE UI MOD', intro: 'Use a local Code session. First clone or download this repository, then add its absolute path as a marketplace. Replace the example path below.', steps: ['Check /status in the Code tab. The documented desktop mod minimum is 2.1.286; your terminal can have a different version.', 'Add the marketplace, install kitchen-sink, and reload plugins using the commands below.', 'Run /kitchen. Expect recipes, events, and notes tabs. Click the counter, then try a draft button with an empty prompt box.'], commands: '/plugin marketplace add /absolute/path/to/claude-mod-kitchen-sink\n/plugin install kitchen-sink@claude-mod-kitchen-sink\n/reload-plugins\n/kitchen', note: 'The starter passes native desktop element-contract tests. Final layout and installation in the actual desktop app remain manual acceptance checks.', action: '<a class="text-link" data-repo href="https://github.com/reachjalil/claude-mod-kitchen-sink">Get the repository ↗</a>' },
    terminal: { title: 'The shortest edit → reload → try loop.', badge: 'LOCAL DEVELOPMENT', intro: 'Open a terminal in your clone. Use Claude Code 2.1.287+ for mods. No npm install or build step is needed to load this JavaScript example.', steps: ['Launch Claude with --plugin-dir, using the command below from the repository root.', 'At Claude’s prompt, enter /kitchen. The pane may sit beside the conversation or above the input, depending on available space.', 'Edit hooks/register.js. Claude watches the loaded directory. Try the changed behavior after the module reloads.'], commands: 'claude --plugin-dir ./plugins/kitchen-sink', note: 'The direct plugin directory is the development copy. Installed marketplace copies may need an update or reload after changes.', action: '<a class="text-link" data-repo href="https://github.com/reachjalil/claude-mod-kitchen-sink">Get the repository ↗</a>' },
  };
  function surface(name) {
    const p=paths[name];
    $$('[data-surface]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.surface===name)));
    $('#surface-content').innerHTML=`<div class="path-header"><h3>${p.title}</h3><span class="path-badge">${p.badge}</span></div><p>${p.intro}</p><ol>${p.steps.map(s=>`<li>${escape(s)}</li>`).join('')}</ol><div class="command-box"><button class="copy" data-copy="path-command" type="button">Copy</button><pre id="path-command">${escape(p.commands)}</pre></div><p><strong>Know the boundary:</strong> ${p.note}</p><div class="hero-actions">${p.action}</div>`;
    if(window.KITCHEN_GUIDE) $$('[data-repo]').forEach(a=>a.href=window.KITCHEN_GUIDE.repository);
  }
  if ($('#surface-content')) { $$('[data-surface]').forEach(b=>b.addEventListener('click',()=>surface(b.dataset.surface))); surface('cowork'); }
  let count=0;
  $('#hero-click')?.addEventListener('click',()=>{ count++; $('#hero-count').textContent=String(count).padStart(2,'0'); });
  let mode='observe';
  const behavior={ observe:{label:'A normal tool call',input:'Read README.md',description:'Observe the call and pass the same event to the next handler.'}, rewrite:{label:'A prompt with an explicit recipe prefix',input:'[ks:brief] Explain panes',description:'Remove the explicit prefix and add a request for a short answer. Ordinary prompts pass through unchanged.'}, answer:{label:'Imaginary portions (integer from 1 to 3)',input:'2',description:'Handle this demo tool here. Valid input gets a result; invalid input gets a denial. The downstream tool does not run.'} };
  function chooseMode(name) {
    mode=name; const b=behavior[name];
    $$('[data-mode]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.mode===name)));
    $('#sim-label').textContent=b.label; $('#sim-input').value=b.input; $('#sim-explanation').textContent=b.description;
    $('#flow-next').textContent=name==='answer'?'Handled here':'Next handler'; $('#flow-next').classList.toggle('handled',name==='answer');
    $('#sim-output').textContent='Ready. Nothing has run yet.';
  }
  $$('[data-mode]').forEach(b=>b.addEventListener('click',()=>chooseMode(b.dataset.mode)));
  $('#reset-sim')?.addEventListener('click',()=>chooseMode('observe'));
  $('#run-sim')?.addEventListener('click',()=>{
    const text=$('#sim-input').value;
    if(mode==='observe') $('#sim-output').textContent=`1. Event arrives: ${text}\n2. Hook increments an in-memory counter.\n3. next(e) forwards the original event.\n4. The next handler can continue normally.\n\nSimulated only; no file was read.`;
    if(mode==='rewrite') {
      const enabled=text.startsWith('[ks:brief] ');
      const result=enabled?text.slice(11)+'\n\nPlease answer in at most three concise bullet points.':text;
      $('#sim-output').textContent=`1. Prompt arrives.\n2. ${enabled?'Explicit recipe prefix found. Create a new event.':'No prefix. Preserve the original event.'}\n3. Forwarded text:\n\n${result}\n\nSimulated only; nothing was sent to a model.`;
    }
    if(mode==='answer') {
      // This text field approximates the JSON tool argument for the browser lesson.
      const n=Number(text); const valid=text.trim()!=='' && Number.isInteger(n) && n>=1 && n<=3;
      $('#sim-output').textContent=`1. Demo tool call arrives.\n2. Check that portions is an integer from 1 to 3.\n3. ${valid?`Return result: Mixed ${n} imaginary portion(s).`:'Return deny: Choose an integer from 1 to 3.'}\n4. next(e) is not called.\n\nSimulated only; no real-world action was taken.`;
    }
  });
  document.addEventListener('click',async e=>{
    const b=e.target.closest('[data-copy]'); if(!b) return;
    const target=document.getElementById(b.dataset.copy); if(!target) return;
    try { await navigator.clipboard.writeText(target.textContent); b.textContent='Copied'; $('#copy-status').textContent='Command copied to clipboard.'; setTimeout(()=>{b.textContent='Copy';},1600); }
    catch { const range=document.createRange();range.selectNodeContents(target);const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);b.textContent='Select & copy';$('#copy-status').textContent='Clipboard unavailable. Text selected; use your copy shortcut.'; }
  });
  const source=window.KITCHEN_GUIDE;
  if(source) $$('[data-repo]').forEach(a=>a.href=source.repository);
  if(source && $('#recipe-list')){
    function recipe(id) {
      const r=source.recipes.find(x=>x.id===id);
      $$('#recipe-list button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.recipe===id)));
      $('#recipe-detail').innerHTML=`<h3>${escape(r.title)}</h3><p>${escape(r.description)}</p><p class="recipe-expected"><strong>Try:</strong> ${escape(r.try)}</p><pre><code>${escape(r.code)}</code></pre><p class="source-note">Excerpt from the real starter · lines ${r.line}–${r.end}</p><a href="${source.repository}/blob/main/plugins/kitchen-sink/hooks/register.js#L${r.line}">Open the surrounding source ↗</a>`;
    }
    $('#recipe-list').innerHTML=source.recipes.map((r,i)=>`<button type="button" data-recipe="${r.id}" aria-pressed="${i===0}">${escape(r.title)}<small>${escape(r.event)}</small></button>`).join('');
    $$('#recipe-list button').forEach(b=>b.addEventListener('click',()=>recipe(b.dataset.recipe)));recipe(source.recipes[0].id);
  }
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){$$('nav a[href^="#"]').forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}},{rootMargin:'-10% 0px -65% 0px'});
    $$('.guide-section').forEach(s=>observer.observe(s));
  }
})();
