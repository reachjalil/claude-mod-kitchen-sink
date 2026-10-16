# Make your first change

Goal: change one interaction and explain why it works. Begin with the [README setup](../README.md#try-the-ui-mod), an interactive Code session, and a working baseline.

## Exercise A: change the counter

1. Launch from the repository root:

   ```sh
   claude --plugin-dir ./plugins/kitchen-sink
   ```

2. At Claude's prompt run `/kitchen`. Click the counter once and observe the label.
3. Open `plugins/kitchen-sink/hooks/register.js`. Find the button keyed `counter`.
4. Change only its label from `Click counter: ${clicks}` to `My experiment: ${clicks}`. Keep the key and callback unchanged.
5. Save. Wait for the mod reload notice. Run `/kitchen` again if needed and click the button.

**Expected:** the label changes, the number increments, and no model request is needed for the click. The number resets when the module reloads because it lives in a JavaScript variable.

**Check:** run `npm run validate`. The existing native test looks for the original label, so update that assertion to your intentional new label before running `npm run test:native`. A test tied to changed UI text should reflect the behavior you now want.

## Exercise B: change the prompt recipe

Find the `prompt.submit` handler. Change the requested answer length from three bullets to two. Send two prompts:

```text
Explain the three hook arguments.
[ks:brief] Explain the three hook arguments.
```

**Expected:** only the second prompt receives the extra short-answer instruction. The model's formatting is still probabilistic; a transformed prompt is not a schema guarantee. Update the regression assertion that expects the old instruction and run `npm test`.

## Exercise C: try the same idea in Cowork

1. In `plugins/kitchen-cowork/commands/experiment.md`, rename the `Next question` field to `What to try next`.
2. Run `npm run package:cowork`.
3. Re-upload `dist/kitchen-cowork.zip` through the plugin UI.
4. Attach the supplied workshop notes and run `/kitchen-cowork:experiment` again.

**Expected:** the next card uses the new field name. You changed instructions, not a rendering callback. This makes Cowork a useful starting point when your outcome is a repeatable workflow rather than native interface customization.

## Your own recipe

Add a small fourth tab that keeps an in-memory list of three synthetic checklist items. Give each item a button that changes its completed state, then redraw. Keep it local and avoid adding network, filesystem or model calls.

Before sharing, write down: what the user does, what should change, which event handles it, which host APIs are called, what data persists, and the exact surface/version you checked. Reuse the existing native pane test pattern to test the interaction. Finish with a real visual check on the surface you claim to support.
