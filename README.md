# Claude Mod Kitchen Sink

A small, MIT-licensed workshop for experimenting with Claude Desktop customization. Read the code, change one thing, and observe what happens. No dependency install or build step is needed.

**Two plugins, two surfaces:** `kitchen-cowork` demonstrates reusable workflow commands in Cowork. `kitchen-sink` demonstrates executable UI mods in Claude Code, including Claude Desktop's **Code tab**. Custom Cowork panes are not a supported capability claimed by this project. Claude's naming and UI are evolving; see the dated [compatibility notes](docs/compatibility.md).

Independent community project. Not affiliated with or endorsed by Anthropic.

## Try it in Cowork

1. Build the upload archive from this repository:

   ```sh
   npm run package:cowork
   ```

2. In Claude Desktop's Cowork experience, open **Customize → Plugins**, and use the custom plugin upload option to select `dist/kitchen-cowork.zip`. Labels can vary by account rollout.
3. Try `/kitchen-cowork:tour`.
4. Attach `plugins/kitchen-cowork/examples/workshop-notes.md`, then try `/kitchen-cowork:experiment`.
5. Edit the command's four output fields, rebuild and re-upload the ZIP, and compare the next output.

The ZIP contains prompt commands and synthetic notes. These commands use the conversation model and your normal plan usage. They do not add custom panes. If your UI has unified Chat/Cowork, look for Customize in the available experience. Organization policy may limit plugin uploads.

## Try the UI mod in Claude Desktop's Code tab

Use a local Code session. In that session, add this folder as a local marketplace and install the mod:

```text
/plugin marketplace add /absolute/path/to/claude-mod-kitchen-sink
/plugin install kitchen-sink@claude-mod-kitchen-sink
/reload-plugins
/kitchen
```

Replace the absolute path with the location of your clone. Use `/status` in the Code tab to check its bundled Claude Code version. The terminal's version can differ. The documented desktop minimum is 2.1.286; this repository's native static validation was run with terminal Claude Code 2.1.301. Desktop rendering still needs a live acceptance pass on your build.

To also install the Cowork workflow commands in Code, install `kitchen-cowork@claude-mod-kitchen-sink` separately. The plugins have no dependency on one another.

## Fastest development loop: terminal

Requires Node.js 20+ for local checks and Claude Code 2.1.287+ for mods.

```sh
claude --plugin-dir ./plugins/kitchen-sink
```

Then run `/kitchen`. Edit `plugins/kitchen-sink/hooks/register.js` while the session is open. Claude Code watches a directory loaded with `--plugin-dir` and reloads it. Installed marketplace copies may require an update or reload; use the direct directory for active development.

## What's in the lab?

| Experiment | What to try | Where to read |
| --- | --- | --- |
| Pane and tabs | Run `/kitchen`; switch recipes / events / notes | `ui.render` for `Pane` |
| Buttons | Increment the click counter | `counter` button |
| Prompt drafts | Press “Draft a brief prompt”; inspect and send it | `$.prompt.fill` |
| Prompt rewrite | Send `[ks:brief] Explain mod hooks` | `prompt.submit` |
| Custom tool | Ask to mix 2 imaginary portions | `$.tool.register` and filtered `tool.call` |
| Narrow tool guard | Invalid portions are refused; no shell interception | filtered `tool.call` |
| Live activity | Use a tool, then inspect Events | observing `tool.call`, `turn.complete` |
| UI composition | The band keeps downstream mods' drawings | `AbovePrompt`, `next(e)` |
| Spinner detail | Watch the tool counter during a turn | `Spinner` |
| Persistence | Save a synthetic note; reopen a session; delete it | `$.store` |
| Text fallback | Run `/kitchen-status` | `command.run` |
| Cowork workflow | Turn supplied notes into an experiment card | `plugins/kitchen-cowork/commands` |

The teaching code is kept in one readable hooks module. API calls use explicit `$` names so Claude's static analyzer can inventory them. No packages, credentials, HTTP requests, process execution, automatic model calls, or inter-session messaging are needed by the mod.

## Learn, check, and share

- [First experiments](docs/experiments.md): a progressive walkthrough with observable results.
- [Compatibility](docs/compatibility.md): Cowork vs Code vs chat and rollout caveats.
- [Architecture](docs/architecture.md): event flow, composition and state.
- [Sources and examples](docs/sources.md): official docs and public example repositories, checked October 16, 2026.
- [Validation](docs/validation.md): what was actually tested and what still needs a desktop check.
- [Contributing](CONTRIBUTING.md): how to add a small, understandable recipe.
- [Security and data](SECURITY.md): access, storage, and limitations.

```sh
npm test
npm run validate
npm run test:native
npm run package:cowork
```

`npm test` uses Node's built-in test runner and a small API double. `npm run validate` calls the real installed Claude validator with `--strict`. `npm run test:native` exercises the real mod host and terminal/desktop element contracts, without a model request. Neither suite proves final app painting or layout. The package command creates a deterministic ZIP under ignored `dist/`.

This folder is a local Git repository, ready for publication wherever you choose. No hosting URL is assumed. Clone URLs can be used as marketplaces after publication. Keep synthetic data in contributions; remove generated types and local session data before sharing. See [LICENSE](LICENSE).
