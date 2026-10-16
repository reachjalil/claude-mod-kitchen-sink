# First experiments

Use synthetic data throughout. Record your app surface and version before comparing results.

1. **Cowork: one reusable workflow.** Package and upload kitchen-cowork. Attach the synthetic workshop notes and invoke `/kitchen-cowork:experiment`. Expect four fields. Change one field in `commands/experiment.md`, rebuild, re-upload, and compare. The format is model-driven, so it is not a deterministic schema guarantee.
2. **Open the mod.** In a supported local Code session, run `/kitchen`. Expect a pane with three tabs and a counter. Run `/kitchen-status` to see which renderer the host reports. A headless run should list no renderer.
3. **Interaction without a model turn.** Click the counter three times. Expect the number to change immediately. Edit the button label in `hooks/register.js`. With `--plugin-dir`, expect a hot reload; the in-memory counter resets.
4. **Inspect the draft boundary.** Press “Draft a brief prompt.” Expect text in the input box. Review it before sending. Start with an empty input. With existing text, the button leaves your draft alone and shows a notice. Compare a normal prompt with the same prompt prefixed by `[ks:brief] `; only the latter requests at most three bullets.
5. **Add a tool.** Press “Draft a demo tool request,” then send. Expect an imaginary mixing result if Claude calls the registered tool. The input schema already limits portions, so Claude may reject or repair invalid requests before the hook sees them. `npm test` directly exercises the hook's invalid-input branch.
6. **Watch events.** Ask Claude to read a harmless file. Expect the tool count and generic event labels to update. The buffer never keeps tool arguments or output. Reset it and observe the counters return to zero.
7. **Save and forget.** Open Notes, save “My first mod experiment,” then restart with the same plugin. Expect it to reload. Delete the saved note and start again. Expect an empty field. Do not use secrets; this is local plain-text plugin storage.
8. **Make one extension.** Add a new tab with two buttons that change an in-memory value. Run native validation and the local tests. Then check the actual renderer. Document surface limitations instead of assuming terminal and desktop layouts match.

## Desktop acceptance checklist

- [ ] Record Desktop version and Code tab `/status` version.
- [ ] Install the local marketplace plugin and reload it.
- [ ] `/kitchen` opens; tabs, button, text field and band are visible.
- [ ] Counter changes; draft button fills input without sending.
- [ ] Ordinary prompt stays ordinary; explicit prefix requests brief formatting.
- [ ] Demo tool completes a valid imaginary operation.
- [ ] Note survives a new session and delete removes it.
- [ ] Other panes are unaffected; narrow layout is usable.
- [ ] Cowork ZIP imports and both commands appear; attached notes produce a card.

These boxes are intentionally unchecked until someone performs those steps on the target application. A mock or validator pass does not fill them in.
