import { test, expect } from 'claude-code/testing';

// The real mod host validates element trees for these surfaces.
// This does not exercise the desktop application's final paint/layout.
test('pane controls work under terminal and desktop element contracts', async ($) => {
  let clicks = 0;
  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({
      plugin: 'kitchen-sink', surface, component: 'Pane',
      requestId: 'kitchen-sink-lab', props: {},
    });
    expect(await ui.find({ type: 'Text', text: 'CLAUDE MOD KITCHEN SINK' })).toBeDefined();
    await ui.press({ key: 'tab-recipes' });
    await ui.press({ key: 'counter' });
    clicks += 1;
    expect(await ui.find({ key: 'counter', text: `Click counter: ${clicks}` })).toBeDefined();
    await ui.press({ key: 'tab-notes' });
    expect(await ui.find({ key: 'scratch-note' })).toBeDefined();
    await ui.unmount();
  }
});
