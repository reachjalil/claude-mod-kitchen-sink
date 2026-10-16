// No imports or build step. Keep $ API calls explicit for Claude's static validator.
// UI callbacks run on a click; no background model requests or session messages.
export function register(on) {
  let tab = 'recipes';
  let note = '';
  let clicks = 0;
  let tools = 0;
  let turns = 0;
  let events = [];
  const record = (label) => { events = [...events, label].slice(-12); };

  on('session.start', async ($, e, next) => {
    const saved = await $.store.get('scratch-note');
    note = typeof saved === 'string' ? saved.slice(0, 500) : '';
    record('session.start');
    await $.tool.register({
      name: 'mix',
      description: 'Kitchen Sink demo only. Mix 1–3 imaginary portions; no real-world action.',
      inputSchema: { type: 'object', properties: { portions: { type: 'integer', minimum: 1, maximum: 3 } }, required: ['portions'], additionalProperties: false },
    });
    await $.command.register({ name: 'kitchen', description: 'Open the Kitchen Sink learning pane', immediate: true });
    await $.command.register({ name: 'kitchen-status', description: 'Print lab counters and available render surfaces', immediate: true });
    return next(e);
  });

  on('command.run', { command: 'kitchen' }, async ($) => {
    const placed = await $.ui.open({ id: 'kitchen-sink-lab', title: 'Kitchen Sink', focus: true, closeOnEscape: true });
    return { text: placed.isPlaced ? 'Kitchen Sink opened. Try the tabs, then /kitchen-status.' : 'No pane was placed. Use /kitchen-status; try a local Desktop Code tab or interactive terminal.' };
  });

  on('command.run', { command: 'kitchen-status' }, async ($) => {
    const surfaces = await $.session.surfaces();
    return { text: `Kitchen Sink | tools: ${tools} | turns: ${turns} | clicks: ${clicks} | surfaces: ${surfaces.join(', ') || 'none (headless or no renderer)'}` };
  });

  // Observe a call without keeping arguments, prompts, results or file paths.
  on('tool.call', async ($, e, next) => {
    tools += 1;
    record('tool.call');
    $.ui.invalidate('ui.render');
    return next(e);
  });

  // A deliberately narrow gate: it only handles this plugin's imaginary tool.
  on('tool.call', { tool: 'mcp__kitchen-sink__mix' }, async ($, e) => {
    if (!Number.isInteger(e.portions) || e.portions < 1 || e.portions > 3) {
      record('mix: refused invalid portion count');
      return { deny: 'Demo limit: choose an integer from 1 to 3 portions.' };
    }
    record('mix: completed');
    return { result: `Mixed ${e.portions} imaginary portion(s). Nothing was written, purchased or sent.` };
  }).catch(async () => ({ deny: 'Kitchen demo tool failed; no action was taken.' }));

  // Opt in on one prompt only. Other prompts pass through byte for byte.
  on('prompt.submit', async ($, e, next) => {
    if (!e.text.startsWith('[ks:brief] ')) return next(e);
    record('prompt.submit: brief recipe');
    return next({ ...e, text: e.text.slice('[ks:brief] '.length) + '\n\nPlease answer in at most three concise bullet points.' });
  });

  on('turn.complete', async ($, e, next) => {
    turns += 1;
    record('turn.complete');
    $.ui.invalidate('ui.render');
    return next(e);
  });

  on('ui.render', { component: 'Spinner' }, async ($, e, next) =>
    next({ ...e, props: { ...e.props, suffix: `${e.props.suffix || ''} · kitchen: ${tools} calls` } })
  );

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const { Box, Text, Button } = $.ui.resolve(e);
    const others = await next(e);
    return Box({ flexDirection: 'column', children: [
      ...(others ? [others] : []),
      Box({ flexDirection: 'row', columnGap: 2, children: [
        Text({ dimColor: true, children: [`Kitchen Sink · ${tools} tools · ${turns} turns`] }),
        Button({ key: 'open-lab', label: 'Open lab', onPress: async () => {
          await $.ui.open({ id: 'kitchen-sink-lab', title: 'Kitchen Sink', focus: true, closeOnEscape: true });
        } }),
      ] }),
    ] });
  });

  on('ui.render', { component: 'Pane' }, async ($, e, next) => {
    if (e.requestId !== 'kitchen-sink-lab') return next(e);
    const { Box, Text, Button, Input } = $.ui.resolve(e);
    const tabs = ['recipes', 'events', 'notes'].map((name) => Button({
      key: `tab-${name}`, label: name === tab ? `[${name}]` : name,
      onPress: () => { tab = name; $.ui.invalidate('ui.render'); },
    }));
    let body = [];
    if (tab === 'recipes') body = [
      Text({ children: ['Explore a real mod, one small interaction at a time.'] }),
      Text({ dimColor: true, children: ['Draft buttons append to your input. Review it, then send.'] }),
      Button({ key: 'counter', label: `Click counter: ${clicks}`, onPress: () => { clicks += 1; $.ui.invalidate('ui.render'); } }),
      Button({ key: 'draft-brief', label: 'Draft a brief prompt', onPress: async () => {
        await $.prompt.fill({ text: '[ks:brief] Explain how Claude Code mods work.', mode: 'append' });
      } }),
      Button({ key: 'draft-mix', label: 'Draft a demo tool request', onPress: async () => {
        await $.prompt.fill({ text: 'Use the kitchen-sink mix tool to mix 2 imaginary portions.', mode: 'append' });
      } }),
      Text({ children: ['The tool has a 1–3 portion guard. The note tab persists only what you explicitly save.'] }),
    ];
    if (tab === 'events') body = [
      Text({ bold: true, children: [`${tools} tool calls · ${turns} turns · ${clicks} clicks`] }),
      Text({ dimColor: true, children: ['Last 12 labels, in memory only. No prompt or tool contents are recorded.'] }),
      ...events.map((label) => Text({ children: [label] })),
      Button({ key: 'reset-events', label: 'Reset counters and event labels', onPress: () => {
        tools = 0; turns = 0; clicks = 0; events = []; $.ui.invalidate('ui.render');
      } }),
    ];
    if (tab === 'notes') body = [
      Text({ children: ['One local scratch note, shared by this plugin across sessions. Last save wins.'] }),
      Input({ key: 'scratch-note', label: 'Scratch note', value: note, placeholder: 'Synthetic notes only; 500 characters max', submitLabel: 'Save', onSubmit: async (value) => {
        const text = value.slice(0, 500);
        await $.store.set('scratch-note', text);
        note = text;
        $.ui.invalidate('ui.render');
      } }),
      Text({ children: [`Saved / loaded: ${note || '(empty)'}`] }),
      Button({ key: 'forget-note', label: 'Delete saved note', onPress: async () => {
        await $.store.delete('scratch-note'); note = ''; $.ui.invalidate('ui.render');
      } }),
    ];
    return Box({ flexDirection: 'column', rowGap: 1, children: [
      Text({ bold: true, children: ['CLAUDE MOD KITCHEN SINK'] }),
      Text({ dimColor: true, children: [`Renderer: ${e.surface} · experimental learning lab`] }),
      Box({ flexDirection: 'row', columnGap: 1, children: tabs }),
      ...body,
    ] });
  });
}
