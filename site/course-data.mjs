// Course content is rendered to standalone static pages by scripts/render-course.mjs.
export const lessons = [
  {
    "id": "01-building-blocks",
    "section": "Foundations",
    "title": "Know the building blocks",
    "short": "Building blocks",
    "summary": "Separate instructions, connections, packages, and executable behavior before choosing what to build.",
    "objectives": [
      "Tell a workflow command from a mod hook.",
      "Choose the smallest extension that fits an outcome."
    ],
    "content": "<p class=\"lesson-lead\">Claude customization has a few overlapping names. Start by connecting each piece to the job it does.</p><section id=\"understand\" class=\"lesson-part\">\n  \n  <div class=\"glossary\"><article><span class=\"number\">A</span><h3>Skill or command</h3><p>Reusable instructions for a recurring job. Our Cowork command asks for an experiment card with four fields.</p><span class=\"concept-tag\">“Do this the way I like.”</span></article><article><span class=\"number\">B</span><h3>Connector / MCP</h3><p>Tools or data supplied by an external service or process. The starter doesn’t need a connected account.</p><span class=\"concept-tag\">“Reach this system.”</span></article><article><span class=\"number\">C</span><h3>Plugin</h3><p>The package people install. This repo ships two independent plugins through one small marketplace.</p><span class=\"concept-tag\">“Bundle these pieces.”</span></article><article><span class=\"number\">D</span><h3>Mod</h3><p>Code inside a Claude Code plugin that reacts to events. Our mod adds a pane and changes selected behavior.</p><span class=\"concept-tag\">“React when this happens.”</span></article></div>\n  <div class=\"plain-note\"><strong>Two meanings of “hook.”</strong> A settings hook runs a configured command, request, or prompt. A mod hook is a JavaScript or TypeScript function inside Claude Code. The examples here use mod functions. <a href=\"https://code.claude.com/docs/en/plugins/mods/overview#compare-mods-settings-hooks-skills-and-mcp-servers\">Compare the extension types ↗</a></div>\n</section>",
    "task": [
      "Pick one repeated task you want to improve.",
      "Describe whether it needs instructions, external tools, or custom interface behavior.",
      "Write a one-sentence outcome before choosing a technology."
    ],
    "question": "You keep pasting the same formatting instructions. What is the smallest useful starting point?",
    "options": [
      "A reusable skill or command",
      "A native UI pane",
      "A separate MCP server"
    ],
    "answer": 0,
    "feedback": "A skill or command can capture repeatable instructions. Add executable UI or an external server when the outcome calls for it."
  },
  {
    "id": "02-choose-your-surface",
    "section": "Foundations",
    "title": "Choose your Claude surface",
    "short": "Choose a surface",
    "summary": "Find the right path for Cowork, the desktop Code tab, or the terminal.",
    "objectives": [
      "Understand the Cowork and Code distinction.",
      "Check the version in the surface you actually use."
    ],
    "content": "<figure class=\"lesson-figure\"><a href=\"./assets/extension-surfaces.webp\" target=\"_blank\" rel=\"noopener\" aria-label=\"Open this lesson illustration at full size\"><img src=\"./assets/extension-surfaces.webp\" width=\"1536\" height=\"1024\" alt=\"Two separate customization paths: Cowork workflow commands turn instructions into a conversation result; Claude Code adds UI and event hooks.\" loading=\"lazy\"></a><figcaption>Conceptual paths. Cowork workflow commands and Claude Code UI hooks do different jobs.</figcaption></figure><section id=\"start\" class=\"lesson-part\">\n  \n  <div class=\"surface-buttons\" role=\"group\" aria-label=\"Choose Claude surface\"><button type=\"button\" data-surface=\"cowork\" aria-pressed=\"true\">Cowork / Claude desktop</button><button type=\"button\" data-surface=\"code\" aria-pressed=\"false\">Desktop Code tab</button><button type=\"button\" data-surface=\"terminal\" aria-pressed=\"false\">Terminal</button></div>\n  <div id=\"surface-content\" class=\"path-panel\" aria-live=\"polite\"></div>\n  <noscript><p>JavaScript is optional for reading the rest of this guide. Download <a href=\"./downloads/kitchen-cowork.zip\">the Cowork plugin</a> and upload it through Customize → Plugins, or read <a href=\"./reference/README.md\">the full README</a> for terminal and desktop Code setup.</p></noscript>\n  <p class=\"source-note\">Surface support: <a href=\"https://code.claude.com/docs/en/plugins/mods/overview#where-mods-run\">official mods documentation</a> · Cowork setup: <a href=\"https://support.claude.com/en/articles/13837440-use-plugins-in-claude\">official plugin help</a>. Labels and availability vary by rollout and organization policy.</p>\n</section>",
    "task": [
      "Choose Cowork, the desktop Code tab, or terminal above.",
      "Read the prerequisites and the expected result for that path.",
      "For Code, check the relevant version; do not substitute the terminal version for the desktop bundled version."
    ],
    "question": "Where does this course place the custom kitchen-sink pane?",
    "options": [
      "In any ordinary Claude chat",
      "In a supported Claude Code surface",
      "In the Cowork command output"
    ],
    "answer": 1,
    "feedback": "The pane is a Claude Code UI-mod example. The Cowork plugin teaches reusable workflow commands instead."
  },
  {
    "id": "03-cowork-workflow",
    "section": "Hands-on",
    "title": "Try a Cowork workflow",
    "short": "Cowork workflow",
    "summary": "Install the small workflow plugin and change the shape of a repeatable result.",
    "objectives": [
      "Run a command with supplied synthetic notes.",
      "Change one instruction and compare the next output."
    ],
    "content": "<div class=\"lesson-prose\"><h2>Start with a reusable instruction.</h2><p>The Cowork example is a small plugin with two Markdown commands. It asks the conversation model to follow a repeatable process; it does not draw a native pane.</p><ol><li><a href=\"./downloads/kitchen-cowork.zip\" download>Download kitchen-cowork.zip</a> and keep it zipped.</li><li>In the Cowork or unified Claude desktop experience, use <strong>Customize → Plugins</strong> and the custom upload option. Availability and labels can vary by account and organization policy.</li><li>Run <code>/kitchen-cowork:tour</code>.</li><li>Attach the <a href=\"./downloads/workshop-notes.md\" download>synthetic workshop notes</a>, then run <code>/kitchen-cowork:experiment</code>.</li></ol><div class=\"command-box\"><button class=\"copy\" type=\"button\" data-copy=\"cowork-command\">Copy</button><pre id=\"cowork-command\">/kitchen-cowork:tour\n/kitchen-cowork:experiment</pre></div><h2>What should happen?</h2><p>The command asks for four fields: <strong>Goal</strong>, <strong>Smallest change</strong>, <strong>Observable result</strong>, and <strong>Next question</strong>. Output can vary because the model follows instructions rather than a deterministic schema.</p><div class=\"result-card\"><span class=\"mini-label\">ILLUSTRATIVE OUTPUT SHAPE</span><dl><dt>Goal</dt><dd>Produce a consistent experiment card from the supplied notes.</dd><dt>Smallest change</dt><dd>Rename one output field in the command.</dd><dt>Observable result</dt><dd>The next card uses the new field name.</dd><dt>Next question</dt><dd>Which other part of the workflow is worth making repeatable?</dd></dl></div><h2>Make the first edit.</h2><p>In <code>plugins/kitchen-cowork/commands/experiment.md</code>, rename <code>Next question</code> to <code>What to try next</code>. From the repository root run <code>npm run package:cowork</code>, then upload the new ZIP and try again with the same notes. Packaging needs Python 3.9+; the npm wrapper also needs Node.</p><p>Invoking these commands uses normal conversation-model usage. If the session cannot access the bundled notes, attach them explicitly.</p></div>",
    "task": [
      "Run the original command using the synthetic notes.",
      "Rename one output field, rebuild, and re-upload the plugin.",
      "Compare the two cards and explain which instruction changed the output."
    ],
    "question": "Why can two runs produce slightly different experiment cards?",
    "options": [
      "The image is changing the output",
      "A model is following a reusable prompt",
      "The plugin contains a random output generator"
    ],
    "answer": 1,
    "feedback": "This command supplies instructions to the conversation model. The requested structure is useful, but it is not a guaranteed output schema."
  },
  {
    "id": "04-follow-an-event",
    "section": "Hands-on",
    "title": "Follow an event through a hook",
    "short": "Events and hooks",
    "summary": "See the three core choices: observe, rewrite, or answer.",
    "objectives": [
      "Explain $, e, and next.",
      "Predict whether the next handler will run."
    ],
    "content": "<figure class=\"lesson-figure\"><a href=\"./assets/hook-event-flow.webp\" target=\"_blank\" rel=\"noopener\" aria-label=\"Open this lesson illustration at full size\"><img src=\"./assets/hook-event-flow.webp\" width=\"1536\" height=\"1024\" alt=\"An event enters your hook; observe forwards the same event, rewrite forwards a changed copy, and answer returns a result locally.\" loading=\"lazy\"></a><figcaption>Observe and rewrite continue the event chain. Answer handles the event locally.</figcaption></figure><section id=\"playground\" class=\"lesson-part\">\n  \n  <div class=\"hook-options\" aria-label=\"Three hook choices\"><p><strong>Observe</strong><span>Forward the same event.</span></p><p><strong>Rewrite</strong><span>Forward a changed copy.</span></p><p><strong>Answer</strong><span>Return a result here.</span></p></div>\n  <div class=\"simulation\"><div class=\"sim-toolbar\"><span class=\"tiny-tag\">BROWSER SIMULATION · NO CLAUDE CONNECTION</span><button id=\"reset-sim\" class=\"quiet-button\" type=\"button\">Reset</button></div>\n    <div class=\"sim-modes\" role=\"group\" aria-label=\"Hook behavior\"><button type=\"button\" data-mode=\"observe\" aria-pressed=\"true\">Observe</button><button type=\"button\" data-mode=\"rewrite\" aria-pressed=\"false\">Rewrite</button><button type=\"button\" data-mode=\"answer\" aria-pressed=\"false\">Answer</button></div>\n    <label for=\"sim-input\" id=\"sim-label\">A normal tool call</label><input id=\"sim-input\" value=\"Read README.md\" maxlength=\"180\" autocomplete=\"off\">\n    <div class=\"event-flow\" aria-label=\"Event flow\"><span id=\"flow-in\">Event</span><span aria-hidden=\"true\">→</span><strong id=\"flow-hook\">Our hook</strong><span aria-hidden=\"true\">→</span><span id=\"flow-next\">Next handler</span></div>\n    <div class=\"sim-bottom\"><button class=\"button primary\" id=\"run-sim\" type=\"button\">Run one event →</button><p id=\"sim-explanation\">Observe the call and pass the same event to the next handler.</p></div>\n    <div class=\"sim-result\" role=\"status\"><span class=\"nav-label\">TRACE</span><pre id=\"sim-output\">Ready. Nothing has run yet.</pre></div>\n  </div>\n  <div class=\"explain-grid\"><div><h3>What are <code>$</code>, <code>e</code>, and <code>next</code>?</h3><dl><dt><code>$</code> · the host API</dt><dd>Register a command, fill a draft, save a value, or ask the UI to redraw.</dd><dt><code>e</code> · the event</dt><dd>The data for this action. Treat it as immutable; create a copy to change it.</dd><dt><code>next(e)</code> · continue the chain</dt><dd>Pass the event to downstream mods and the engine. Return your own result to handle it instead.</dd></dl></div><div class=\"code-card\"><div class=\"code-title\">A minimal observer <span>JavaScript</span></div><pre><code>on('tool.call', async ($, e, next) => {\n  calls += 1;\n  $.ui.invalidate('ui.render');\n  return next(e);\n});</code></pre><p>Counting is ordinary JavaScript. Redrawing is a host API call. Forwarding preserves the tool’s normal behavior.</p></div></div>\n</section>",
    "task": [
      "Run Observe and inspect the trace.",
      "Run Rewrite with the prefix, then with an ordinary prompt.",
      "Run Answer with 2 and 4 portions. Compare a result with a denial."
    ],
    "question": "What makes the demo tool handler answer locally?",
    "options": [
      "It returns its own result without calling next",
      "It changes a button label",
      "It calls next(e) twice"
    ],
    "answer": 0,
    "feedback": "Returning the handler’s own result handles that event. Calling next forwards it to downstream handlers and the engine."
  },
  {
    "id": "05-draw-and-redraw",
    "section": "Hands-on",
    "title": "Draw a pane. Change its state.",
    "short": "UI and state",
    "summary": "Connect a button press, an in-memory value, and the next drawing.",
    "objectives": [
      "Understand the local redraw loop.",
      "Distinguish temporary state from a saved note."
    ],
    "content": "<figure class=\"lesson-figure\"><a href=\"./assets/ui-redraw-loop.webp\" target=\"_blank\" rel=\"noopener\" aria-label=\"Open this lesson illustration at full size\"><img src=\"./assets/ui-redraw-loop.webp\" width=\"1536\" height=\"1024\" alt=\"A local counter cycle: click, update state, request redraw, render the new UI, then click again. This interaction needs no model request.\" loading=\"lazy\"></a><figcaption>This local counter loop does not need a model request. Other mod actions can have different effects.</figcaption></figure><div class=\"lesson-prose\"><h2>A drawing is a description of the current state.</h2><p>The <code>ui.render</code> handler returns boxes, text, buttons and fields supported by the current surface. A button callback changes a variable and calls <code>$.ui.invalidate</code>. The host asks for a new tree and draws the updated value.</p></div><div class=\"click-example\"><div><span class=\"mini-label\">BROWSER COUNTER EXAMPLE</span><p>A click updates local state, then redraws the number.</p></div><button id=\"hero-click\" type=\"button\">Try a click <span id=\"hero-count\" aria-live=\"polite\">00</span><span aria-hidden=\"true\">↗</span></button></div><div class=\"lesson-prose\"><h2>Try it in the real starter.</h2><p>In a supported local Code session, run <code>/kitchen</code>, open Recipes, and click the counter. Its value lives in the loaded module and resets on reload. The Notes tab explicitly saves a separate value to the plugin store. That note is local plain-text data shared across this plugin’s sessions; use synthetic notes.</p><h2>Compose with other mods.</h2><p>The band above the prompt keeps the downstream drawing returned by <code>await next(e)</code> and adds this mod’s elements. The Pane hook also checks the pane ID before drawing. Those two choices keep the example from assuming it owns every render site.</p><h2>Respect a draft.</h2><p>The starter’s draft button checks for existing input. It fills an empty draft and leaves sending to the user; it preserves existing text. Filling a prompt box is distinct from submitting a prompt.</p></div>",
    "task": [
      "Click the browser counter and identify which value changes.",
      "In the real Code mod, save a synthetic note and reopen a session.",
      "Explain why the saved note survives while the counter can reset."
    ],
    "question": "Which value is designed to survive a module reload in this starter?",
    "options": [
      "The click counter",
      "The active tab",
      "The explicitly saved scratch note"
    ],
    "answer": 2,
    "feedback": "The scratch note is saved through the plugin store. The counter and active tab are in-memory module variables."
  },
  {
    "id": "06-read-the-plugin",
    "section": "Hands-on",
    "title": "Read the plugin from the outside in",
    "short": "Plugin anatomy",
    "summary": "Trace the loading path, then inspect six excerpts from the actual implementation.",
    "objectives": [
      "Find the manifest, module declaration and event handlers.",
      "Read a source recipe in its surrounding file."
    ],
    "content": "<figure class=\"lesson-figure\"><a href=\"./assets/plugin-structure.webp\" target=\"_blank\" rel=\"noopener\" aria-label=\"Open this lesson illustration at full size\"><img src=\"./assets/plugin-structure.webp\" width=\"1536\" height=\"1024\" alt=\"A plugin contains its identity manifest, hooks module declaration, and register.js event handlers, which provide commands, tools, and UI.\" loading=\"lazy\"></a><figcaption>The loading path leads from the plugin files to the code that reacts to events.</figcaption></figure><div class=\"lesson-prose\"><h2>Three files get the mod loaded.</h2><div class=\"file-map\"><p><code>.claude-plugin/plugin.json</code><span>Identifies the plugin.</span></p><p><code>hooks/hooks.json</code><span>Names the hooks module to load.</span></p><p><code>hooks/register.js</code><span>Exports <code>register(on)</code> and handles events.</span></p></div><p>The repository’s root marketplace lists two plugins. Adding that marketplace does not install every plugin in it; select the one you need.</p><h2>Read one real recipe.</h2><p>The excerpts below are extracted from the current source at build time. Open the surrounding file to see the state, registration, filters, and continuation together.</p></div><section id=\"recipes\" class=\"lesson-part\">\n  \n  <div class=\"recipe-browser\"><div class=\"recipe-list\" role=\"group\" aria-label=\"Choose a source recipe\" id=\"recipe-list\"></div><article class=\"recipe-detail\" id=\"recipe-detail\" aria-live=\"polite\"></article></div>\n</section>",
    "task": [
      "Find the plugin identity and the hooks module path.",
      "Choose a recipe and identify its event filter.",
      "Explain whether it observes, rewrites or answers the event."
    ],
    "question": "Which file contains this starter’s executable event handlers?",
    "options": [
      "The README",
      "hooks/register.js",
      "The marketplace description"
    ],
    "answer": 1,
    "feedback": "register.js exports the registration function and defines the handlers. The other files provide instructions or package metadata."
  },
  {
    "id": "07-make-a-change",
    "section": "Finish and share",
    "title": "Make one change you can explain",
    "short": "Your first change",
    "summary": "Keep a baseline, edit a visible behavior, and compare the result.",
    "objectives": [
      "Use a focused edit/reload loop.",
      "Update an assertion when the intended behavior changes."
    ],
    "content": "<section id=\"build\" class=\"lesson-part\">\n  \n  <ol class=\"workshop\"><li><div class=\"step-number\">1</div><div><h3>See the original work.</h3><p>In Cowork, run the experiment command with the supplied notes. In Code, open <code>/kitchen</code> and click the counter. Write down what you expect to change.</p></div></li><li><div class=\"step-number\">2</div><div><h3>Edit one observable detail.</h3><p>Change a field name in <code>commands/experiment.md</code>, or change the counter button’s label in <code>hooks/register.js</code>. Repackage Cowork; use <code>--plugin-dir</code> for Code’s edit/reload loop.</p></div></li><li><div class=\"step-number\">3</div><div><h3>Prove that specific change.</h3><p>Invoke the command again or press the button. Run the relevant checks, then record the app surface and version. A host test can validate an element tree; the app still needs a visual check.</p></div></li></ol>\n  <div class=\"checks\"><div><h3>Useful local checks</h3><p>No <code>npm install</code> is needed. Node.js 20+, Python 3.9+, and a recent Claude Code are enough for the full set.</p></div><div class=\"command-box\"><button class=\"copy\" data-copy=\"checks-command\" type=\"button\">Copy</button><pre id=\"checks-command\">npm test\nnpm run validate\nnpm run test:native\nnpm run site:build\nnpm run site:check</pre></div></div>\n  <div class=\"plain-note\"><strong>Keep these boundaries visible.</strong> This mod makes no network calls, spawns no processes, and makes no extra model requests. Its saved note uses local plain-text plugin storage. Installed mods can have much broader access: review their code and validator inventory before loading them. <a href=\"https://code.claude.com/docs/en/plugins/mods/overview#decide-whether-to-trust-a-mod\">Understand mod access ↗</a></div>\n</section><div class=\"lesson-prose\"><h2>Concrete Code exercise: change the counter label.</h2><ol><li>From the repository root launch <code>claude --plugin-dir ./plugins/kitchen-sink</code>.</li><li>Run <code>/kitchen</code> and click the counter once.</li><li>In <code>hooks/register.js</code>, find the button keyed <code>counter</code>. Change only its label to <code>My experiment: ${clicks}</code>.</li><li>Save, wait for the reload notice, reopen the pane if needed, and click again.</li></ol><p><strong>Expect:</strong> the new label appears, the counter increments, and its value starts over after a module reload. The key and callback stay the same.</p><p>The native test currently expects the original label. Update that assertion to your intentional new label before running <code>npm run test:native</code>. A behavior test should reflect the change you mean to keep.</p><h2>Or use the Cowork path.</h2><p>Rename one experiment-card field, rebuild the ZIP, and re-upload it. That changes workflow instructions rather than a rendering callback. Use the same synthetic notes to make the comparison easier.</p></div>",
    "task": [
      "Describe your intended before/after result in one sentence.",
      "Change one label or output-field instruction.",
      "Observe the new result and identify the relevant check."
    ],
    "question": "After intentionally changing a UI label, what should you do with a test that expects the old label?",
    "options": [
      "Delete all tests",
      "Update that assertion to the intended new label",
      "Ignore the failure indefinitely"
    ],
    "answer": 1,
    "feedback": "Keep the test useful by aligning the relevant assertion with the behavior you intentionally changed. Other checks should continue to cover their original concerns."
  },
  {
    "id": "08-check-and-share",
    "section": "Finish and share",
    "title": "Check it. Explain it. Share it.",
    "short": "Check and share",
    "summary": "Match proof to the claim, then package a useful recipe for the next person.",
    "objectives": [
      "Distinguish static, host and live-app checks.",
      "Report the surface, data behavior and known limits."
    ],
    "content": "<div class=\"lesson-prose\"><h2>Different checks answer different questions.</h2><div class=\"proof-grid\"><article><h3>Static validation</h3><p>Does Claude recognize the package, hook names and host API calls?</p></article><article><h3>Behavior and host tests</h3><p>Do the handlers and supported element contracts behave as expected?</p></article><article><h3>Live application check</h3><p>Does the installed example actually appear and work in your target app build?</p></article></div><p>A passing browser simulation does not establish Claude Desktop compatibility. Record what you actually ran and the relevant version.</p><div class=\"command-box\"><button class=\"copy\" type=\"button\" data-copy=\"final-checks\">Copy</button><pre id=\"final-checks\">npm test\nnpm run validate\nnpm run test:native\nnpm run site:build\nnpm run site:check</pre></div><h2>Give the next person a useful handoff.</h2><ul><li>The outcome and a small synthetic input.</li><li>The smallest setup and the expected result.</li><li>The event and host APIs used.</li><li>What data persists and how to remove it.</li><li>The exact surface/version checked and any missing acceptance.</li></ul><p>Read the repository’s <a href=\"./reference/validation.md\">validation record</a> for this starter’s actual scope and remaining live-app checks.</p></div><h2>Get unstuck</h2><section id=\"troubleshoot\" class=\"lesson-part\">\n  \n  <div class=\"faq\"><details><summary>I installed it in Cowork. Where is the custom pane?</summary><p>The Cowork plugin demonstrates prompt commands. The UI pane belongs to the separate <code>kitchen-sink</code> mod in a supported Claude Code session. Start with the Desktop Code or Terminal path above.</p></details><details><summary>/kitchen isn’t in the command list.</summary><p>Check <code>/plugin</code> for an active kitchen-sink mod, then <code>/status</code> for the version. Validate the correct plugin directory. In an existing session, try <code>/reload-plugins</code>. Managed policy can prevent mods from loading.</p></details><details><summary>The command works, but no UI appears.</summary><p>Run <code>/kitchen-status</code> and inspect the reported surfaces. Headless sessions do not draw. Remote Control shows mod drawings in the host terminal. VS Code has different supported render sites, and the full desktop example should be checked in a local Code session.</p></details><details><summary>My edit isn’t showing up.</summary><p>For mod development, launch with <code>--plugin-dir ./plugins/kitchen-sink</code> from the repository root. An installed marketplace copy may differ from your working tree. For Cowork, rebuild the ZIP and re-upload. In-memory counters reset when the module reloads.</p></details><details><summary>The draft button did nothing.</summary><p>It preserves an existing prompt. Clear or send your draft first; the button displays a notice instead of combining unrelated text. It fills the box and leaves sending to you.</p></details><details><summary>Can this be my production command-security policy?</summary><p>The sample guard only checks the plugin’s imaginary mixing tool. It is a teaching example, not a general shell policy. Read the host’s permission and managed-policy documentation before designing real controls.</p></details><details><summary>How do I remove it or delete my scratch note?</summary><p>Use the Notes tab’s delete button for the saved note. For an installed plugin, open <code>/plugin</code> and disable or uninstall it. A session loaded with <code>--plugin-dir</code> stops using that copy when you exit. In Cowork, remove the uploaded plugin through Customize.</p></details></div>\n</section><h2>Share one useful recipe</h2><section id=\"share\" class=\"lesson-part\">\n  <p class=\"eyebrow\">07 / KEEP GOING</p><h2 id=\"share-title\">Learn it. Change it.<br>Share what you make.</h2><p>Fork the workshop. Add one useful example, explain its boundaries, and help the next person understand what changed.</p><div class=\"hero-actions\"><a class=\"button primary\" data-repo href=\"https://github.com/reachjalil/claude-mod-kitchen-sink\">Explore the repository ↗</a><a class=\"text-link\" href=\"./downloads/kitchen-cowork.zip\" download>Download Cowork plugin ↓</a></div>\n  <div class=\"reading-list\"><div><h3>Keep learning</h3><a href=\"https://code.claude.com/docs/en/plugins/mods/create\">Official mod authoring guide ↗</a><a href=\"https://code.claude.com/docs/en/plugins/mods/interface\">Interface guide ↗</a><a href=\"https://github.com/anthropics/claude-code/tree/main/mods\">Public built-in mod source ↗</a></div><div><h3>Project notes</h3><a href=\"./reference/compatibility.md\">Compatibility snapshot</a><a href=\"./reference/validation.md\">What was verified</a><a href=\"./reference/sources.md\">Research and public examples</a><a href=\"./reference/publishing.md\">Host this guide on GitHub Pages</a></div></div>\n</section>",
    "task": [
      "Run the check that proves your changed behavior.",
      "Try it in the actual target surface and record the version.",
      "Write a short handoff using synthetic data and known limitations."
    ],
    "question": "What establishes that a pane works in a particular desktop app build?",
    "options": [
      "Only the browser simulation",
      "Only a static validator pass",
      "A live check in that target build"
    ],
    "answer": 2,
    "feedback": "Static and host tests are useful, but the final app surface still needs its own acceptance check. State each kind of evidence accurately."
  }
];
