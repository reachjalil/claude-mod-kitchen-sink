# Contributing

Keep each recipe small enough to understand in one sitting. State its learning objective, host API calls, expected surface and observable result. Prefer no dependencies, no build step and synthetic input. Preserve downstream UI when adding a band or modifying existing drawing.

Run `npm test`, `npm run test:native`, `npm run validate` with a recent Claude Code, and `npm run package:cowork` if the Cowork plugin changes. Record the version used. A change to interactive UI also needs a manual check on the surface it claims to support; be explicit if that check is pending.

Keep `$` calls explicit for native static analysis. Use relative imports confined to the plugin if you split files. Do not check in generated exact-build declarations, plugin store contents, credentials or session transcripts. Never assume a mock pass establishes native compatibility.

For a bug report include app surface, relevant version, minimal synthetic reproduction, observed result and expected result. Screenshots should contain no private conversation content. Follow the MIT license.
