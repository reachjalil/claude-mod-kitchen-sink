# Validation record — October 16, 2026

## Passed locally

- `npm test`: 9 Node tests. Covers prompt opt-in and pass-through, custom tool guard, unrelated tool forwarding, UI composition, drafts, counters, note persistence/deletion, headless fallback and bounded event labels.
- `npm run validate`: strict native validation of both plugins and the marketplace, with Claude Code 2.1.301. All three pass, without warnings.
- `npm run test:native`: 1 native host test, spanning terminal and desktop element contracts. The actual plugin is loaded; its pane is mounted, the counter is pressed, and the notes tab is opened. This is the host testing API, not a replacement browser renderer.
- `npm run package:cowork`: builds a ZIP with the plugin manifest at its root, two commands, synthetic notes and the MIT license. Archive integrity, expected members and reproducibility checked.

The initial strict marketplace check found missing description metadata; it was fixed. The first native UI test assumed each surface starts with fresh tab state. The host shares the mod state across mounts, so the test now explicitly selects its tab and accounts for accumulated clicks. The subsequent native run passes. This is expected multi-surface state behavior, not a separate state store per renderer.

## Still needs live application acceptance

- Installation and final visual layout in Claude Desktop's Code tab.
- Cowork ZIP upload and command discovery on the user's account rollout.
- A real conversation invoking the imaginary tool and producing a brief answer.
- Other extension versions, managed policy combinations and remote sessions.

No external services were connected. No plugin was globally installed. No model request was used for the checks above. GitHub CI was configured but has not run, since this is a local repository with no remote. See [experiments](experiments.md) for the manual checklist. Recheck the documented API against your version's generated declarations when extending the examples.
