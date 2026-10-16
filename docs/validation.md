# Validation record — October 16, 2026

## Passed locally

- `npm test`: 15 tests. Three cover course-progress sanitization, reversible completion, and resume selection. Eleven cover the mod's behavior through a small API double: prompt opt-in and pass-through, the custom tool guard, unrelated-tool forwarding, UI composition, draft buttons, counters, note persistence/deletion, headless fallback, bounded event labels and store-read failure. One checks the Cowork ZIP's exact member allowlist, MIT license, integrity and deterministic rebuild.
- `npm run validate`: strict native validation of both plugins and the marketplace with Claude Code 2.1.301. All three pass without warnings. The inventory includes draft inspection/filling and UI notices, as used by the reviewed examples.
- `npm run test:native`: one native host test spanning terminal and desktop element contracts. The real plugin is loaded; its pane is mounted, the counter pressed and notes tab opened. This is not the desktop app's final painting/layout.
- `npm run site:build` and `npm run site:check`: ten static pages, eight linked lessons with checkpoints and completion controls, six excerpts extracted from the actual current source, relative assets, unique anchors, downloadable ZIP and synthetic notes.
- Browser acceptance: all three surface paths, all six source recipes, illustration counter, observe/rewrite/answer traces, ordinary-prompt pass-through, invalid and blank portion inputs, reset and local download/reference responses. Checked at a 1440-pixel desktop viewport and a 390-pixel emulated mobile viewport, including reduced motion. No horizontal overflow or browser console errors observed.

## Course update

The site now builds a course homepage, eight lesson pages, and the original quick reference. Static checks cover 373 local/external references, unique IDs, accessible labels, image dimensions, self-hosted assets, previous/next links, checkpoints, and source-excerpt freshness. The logo is a shared SVG monogram used by the header and favicon.

Browser acceptance covered all eight lesson pages at a 320-pixel mobile viewport, including correct checkpoint feedback and each page's applicable controls. Incorrect-answer feedback, completion, undo, reload persistence, and homepage resume were checked explicitly. Desktop and 390-pixel mobile layouts were inspected. A blocked-local-storage test verified usable in-page controls and the non-persistence notice. The old `#recipes` deep link was checked for redirect to its new lesson.

The three new conceptual illustrations were inspected for readable labels, path spelling, directional arrows, and the Cowork/Code distinction. They and the original event-flow image are stored with the course and have textual explanations.

## Illustrated guide update

The guide now uses a self-hosted Manrope variable font and an original event-flow illustration. The site check verifies local CSS assets, descriptive image alt text, and reserved image dimensions as well as links and source excerpts. The diagram has a full-size link and equivalent selectable text. The font's SIL Open Font License is retained separately from the project license.

Browser acceptance was refreshed for the sans-serif layout, compact navigation, image/font loading, the counter, surface paths, six source recipes and event simulations. The guide remains a browser lesson rather than a test of Claude Desktop.

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
