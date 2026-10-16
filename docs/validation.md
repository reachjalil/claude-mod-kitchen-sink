# Validation record — October 16, 2026

## Passed locally

- `npm test`: 12 tests. Eleven cover the mod's behavior through a small API double: prompt opt-in and pass-through, the custom tool guard, unrelated-tool forwarding, UI composition, draft buttons, counters, note persistence/deletion, headless fallback, bounded event labels and store-read failure. One checks the Cowork ZIP's exact member allowlist, MIT license, integrity and deterministic rebuild.
- `npm run validate`: strict native validation of both plugins and the marketplace with Claude Code 2.1.301. All three pass without warnings. The inventory includes draft inspection/filling and UI notices, as used by the reviewed examples.
- `npm run test:native`: one native host test spanning terminal and desktop element contracts. The real plugin is loaded; its pane is mounted, the counter pressed and notes tab opened. This is not the desktop app's final painting/layout.
- `npm run site:build` and `npm run site:check`: static guide, six excerpts extracted from the actual current source, relative assets, unique anchors, downloadable ZIP and synthetic notes.
- Browser acceptance: all three surface paths, all six source recipes, illustration counter, observe/rewrite/answer traces, ordinary-prompt pass-through, invalid and blank portion inputs, reset and local download/reference responses. Checked at a 1440-pixel desktop viewport and a 390-pixel emulated mobile viewport, including reduced motion. No horizontal overflow or browser console errors observed.

## Review changes

Draft buttons now preserve existing input and show a notice, avoiding accidental concatenation that would also prevent the prefix recipe from applying. A failed note-store read no longer prevents command registration. Packaging uses an explicit list of public files and refuses symlinks or paths escaping the plugin root. Regression checks cover these paths.

The initial native UI test assumed fresh state for each surface. The host shares the mod state across mounts, so the test now selects its tab explicitly and accounts for accumulated clicks.

## Still needs live Claude application acceptance

- Installation and final layout in Claude Desktop's Code tab.
- Cowork ZIP upload and command discovery on the user's account rollout.
- A real conversation invoking the imaginary tool and producing a brief answer.
- Other extension versions, managed policy combinations and remote sessions.

No plugin was globally installed and no model request was used for these checks. Website browser tests do not establish Claude Desktop compatibility. See [experiments](experiments.md) for the manual app checklist. Recheck the API against your version's generated declarations when extending it.

GitHub Actions and Pages results are reported separately from local checks; a workflow file by itself is not evidence of a live deployment.
