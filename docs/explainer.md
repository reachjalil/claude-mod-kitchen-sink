# How a mod works, one event at a time

The starter is a small lab, not an abstraction framework. You can read its entire implementation in [register.js](../plugins/kitchen-sink/hooks/register.js).

## Start with the package

A plugin is an installable folder. For this mod, three files establish the loading path:

```text
.claude-plugin/plugin.json   Identifies the kitchen-sink plugin
hooks/hooks.json            Points to ./register.js
hooks/register.js           Exports register(on)
```

The marketplace at the repository root lists this plugin and the separate Cowork plugin. Installing a marketplace does not mean every listed plugin is installed. Select the one you want.

When Claude loads the hooks module, it calls `register(on)`. That function defines the state and registers functions for named events. A session-start handler then registers the commands and the imaginary mixing tool.

## The three hook arguments

```js
on('tool.call', async ($, e, next) => {
  tools += 1;
  $.ui.invalidate('ui.render');
  return next(e);
});
```

- **`$` is the host API.** Normal arithmetic changes the counter. `$.ui.invalidate` asks the host for a new drawing.
- **`e` is the event data.** In this handler it describes a tool call. Treat it as immutable.
- **`next` is the continuation.** `next(e)` passes the call onward. Other mods may run before Claude's normal tool implementation.

The handler does not need to retain the arguments or results to count activity. The starter stores only generic labels in a bounded in-memory event list.

## Three decisions: observe, rewrite, answer

**Observe** when you want to learn that something happened and preserve normal behavior. The counter above does this.

**Rewrite** when you want the next handler to see a changed event. The prompt recipe looks for an explicit `[ks:brief] ` prefix. With that prefix it creates a new event object containing modified text, then calls `next` with the copy. An ordinary prompt passes through unchanged. This changes one prompt, not the model itself.

**Answer** when your code should handle the event. The filtered mixing-tool handler returns its own result for 1–3 imaginary portions. Other inputs get a denial. It does not call `next`, so a downstream tool runner does not execute that imaginary action.

The filter matters. The starter handles only `mcp__kitchen-sink__mix`; it forwards unrelated tool calls. A broad handler that always returns its own result could intercept every tool. The demo guard is not a production shell policy.

## How a click becomes a new drawing

1. Claude asks the matching `ui.render` handler for a tree of elements.
2. The handler returns boxes, text, buttons and an input field supported by that surface.
3. A button press runs its callback.
4. The callback updates a variable and calls `$.ui.invalidate`.
5. The host requests a new drawing from the current state.

This path can run without a model request. A draft button also does not send a prompt: it inspects the input, fills an empty draft, and leaves sending to the user. With existing text it shows a notice and preserves the draft.

## Why call next when drawing UI?

The band above the prompt is shared. The starter obtains the downstream drawing from `await next(e)` and includes it alongside its own elements. That preserves what later mods draw. The Pane handler also checks its pane ID and forwards requests for someone else's pane.

The spinner handler changes just the suffix and calls `next` with copied props. This keeps the host's normal animation and allows the chain to continue. Composition is easier to share than a feature that assumes it owns the entire UI.

## State has more than one lifetime

| Value | Where it lives | When it resets |
| --- | --- | --- |
| Active tab, counters, event labels | Variables in the loaded mod | Module reload / new session |
| Saved scratch note | This plugin's local store | Explicit deletion |
| Draft text | Host input box | User or host changes it |
| Cowork experiment card | Conversation output | Host conversation lifecycle |

Two render surfaces attached to the same loaded mod can see the same in-memory state. Saving a note is shared across this plugin's local sessions and uses last-save-wins behavior. A running session can retain an older note in memory until it reloads. The starter has no concurrent editor or merge algorithm.

A failed store read does not stop the commands from registering. A saved note is plain local data; use synthetic text.

## What a test can tell you

Node tests inspect behavior through a small API double. Native `claude plugin test` loads the real plugin and checks interactions under the host's surface contracts. Static validation inventories hooks and APIs. None of those establishes the desktop app's final layout, successful Cowork import, or a real model's answer.

The [browser simulation](https://reachjalil.github.io/claude-mod-kitchen-sink/lessons/04-follow-an-event.html#playground) illustrates the same three decisions using local JavaScript. It never connects to Claude. Its behavior is teaching material, not compatibility evidence.

For the full event and API contracts, use the [official reference](https://code.claude.com/docs/en/plugins/mods/reference) and your installed build's generated declarations. The latter win if the online reference differs.
