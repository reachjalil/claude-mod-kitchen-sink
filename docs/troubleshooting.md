# Troubleshooting

Start with the smallest diagnostic that explains the symptom. Keep unrelated plugins and personal settings intact.

| Symptom | Likely explanation | Next useful check |
| --- | --- | --- |
| No custom pane in Cowork | This is the workflow-command plugin surface | Use the Code tab or terminal for kitchen-sink UI |
| `/kitchen` is missing | Wrong plugin, unloaded hook module, version or policy | Check `/plugin`, `/status`, then native validation |
| `/kitchen` returns text but no pane | No renderer, unsupported session, or placement limit | Run `/kitchen-status`; try a local interactive session |
| Edits have no effect | Installed copy differs from working tree | Use `--plugin-dir` pointing at your edited folder |
| Cowork command still has old wording | Old uploaded archive | Rebuild and re-upload the ZIP |
| Draft button shows a notice | Input already contains text | Clear or send your draft first |
| Brief recipe does not apply | Prefix is not at the start, or missing trailing space | Begin the prompt with `[ks:brief] ` |
| Tool count increased after a refusal | Counter observes attempted calls, not only successes | This is expected for a tool.call observer |
| Note differs between sessions | Each has an in-memory copy; last save wins | Reload after another session saves |
| Counters reset after an edit | Module state reinitialized | Expected; only the explicitly saved note persists |
| Invalid mix never reaches the guard | Model/schema repaired input first | Use the direct behavioral test to inspect this branch |

## What to collect for a useful report

Include the app surface, desktop/extension version when relevant, Claude Code version, a minimal synthetic prompt or click sequence, observed behavior and expected behavior. Include validation output only after removing private paths or sensitive context. Never include raw conversations or real credentials.

## Disable, remove, reset

- In an installed Code session, use `/plugin` to disable or uninstall the relevant plugin. Do not delete all Claude configuration.
- A plugin supplied only through `--plugin-dir` stops loading when that session exits.
- To remove the stored scratch note, use **Notes → Delete saved note** before removing the plugin. Uninstalling should not be assumed to delete stored data.
- In Cowork, remove the uploaded plugin through Customize. Account UI and policy can differ.

Official troubleshooting and surface references are linked in [sources](sources.md). If your exact build's generated types disagree with this starter or online docs, use the build's declarations and report the mismatch.
