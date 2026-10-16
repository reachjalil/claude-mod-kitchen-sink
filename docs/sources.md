# Sources and public examples

Research checked October 16, 2026. These are upstream references, not vendored dependencies. The implementation in this repository is original teaching code; sample repositories are linked for further study. Follow each upstream repository's own license before copying its code.

## Official documentation

- [Mods announcement, October 1, 2026](https://claude.com/resources/articles/claude-code-mods): launch context and motivation.
- [Mods overview](https://code.claude.com/docs/en/plugins/mods/overview): capabilities, installation, surfaces and trust model.
- [Create a mod](https://code.claude.com/docs/en/plugins/mods/create): file layout, static analysis, hot reload and exact-build generated types.
- [Draw in the interface](https://code.claude.com/docs/en/plugins/mods/interface): panes, composition, controls and persistence.
- [Mods API](https://code.claude.com/docs/en/plugins/mods/api): commands, custom tools and host capabilities.
- [Reference](https://code.claude.com/docs/en/plugins/mods/reference): event fields and render-site support.
- [Use plugins in Claude](https://support.claude.com/en/articles/13837440-use-plugins-in-claude): Cowork installation and component differences.
- [Customize Cowork with plugins](https://claude.com/resources/articles/cowork-plugins): workflow plugin examples.

## Official open-source examples worth reading

- [Claude Code public mods directory](https://github.com/anthropics/claude-code/tree/main/mods): built-in feature source and type declarations.
- [Published mods types](https://github.com/anthropics/claude-code/blob/main/mods/types/claude-code.d.ts): useful searchable contracts; generated local declarations can be newer.
- [Playground mod collection](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods): linked by the official overview.
- [Token Weather](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/token-weather): context visualization.
- [Blast Radius](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/blast-radius): command impact review.
- [Replay Theater](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/replay-theater): edit replay workflow.

The playground links are supplied by the official overview; their source trees were not independently executed or verified for this project. The public types were fetched and consulted for API signatures. This repo does not claim the sample mods are tested or safe simply because they are linked.

## Research conclusion

A workflow plugin is a useful Cowork teaching target. The documented custom rendering mechanism belongs to Claude Code's supported surfaces. That distinction shaped the two-plugin layout. Version-dependent behavior belongs in compatibility notes and live acceptance results, not unconditional promises.
