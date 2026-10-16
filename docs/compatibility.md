# Compatibility snapshot — October 16, 2026

| Surface | Intended use here | Evidence / limits |
| --- | --- | --- |
| Cowork / unified Claude desktop experience | kitchen-cowork commands | Official plugin help documents workflow plugins; account UI may differ |
| Desktop Code tab, local session | kitchen-sink UI mod | Official mods docs list this render surface; desktop smoke test pending |
| Interactive terminal | kitchen-sink UI mod | Officially supported; native validation run here, interactive rendering pending |
| VS Code chat panel | Some mod UI | Docs require 2.1.299+ and feature flags; AbovePrompt is not listed for VS Code |
| Headless CLI / Agent SDK | Non-UI hooks and text commands | No renderer; /kitchen-status is useful |
| Remote Control web/mobile | Host hooks | Docs place drawings in the host terminal, not remote viewers |
| Claude chat | Applicable plugin commands | Do not expect Code's custom UI hooks to render |

The desktop Code tab and Cowork are different execution surfaces even when they share one application. A local terminal version does not establish the desktop bundled version. Enterprise policy can restrict plugins. Desktop WSL sessions have additional plugin restrictions.

The help center also describes a gradual unified Chat/Cowork rollout. This project keeps “Cowork” in the guide so people can identify the intended workflow experience. It does not treat UI labels as proof of capabilities.

No patching application binaries, browser injection, private APIs or undocumented Cowork mod folders is required. A custom connector or a generated HTML artifact is a separate extension mechanism, not proof that Cowork renders a native mod pane.

References: [mods surfaces](https://code.claude.com/docs/en/plugins/mods/overview#where-mods-run), [render sites](https://code.claude.com/docs/en/plugins/mods/reference#render-sites), [plugins](https://support.claude.com/en/articles/13837440-use-plugins-in-claude), [unified-experience rollout note](https://support.claude.com/en/articles/14128542-let-claude-use-your-computer-in-cowork).
