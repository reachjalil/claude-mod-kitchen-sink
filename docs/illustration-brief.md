# Event-flow illustration brief

The guide uses this conceptual image to explain one event entering a hook and taking one of three paths. It does not depict an actual Claude application screen.

- **Observe:** forward the same event to the next handler.
- **Rewrite:** forward a changed copy of the event.
- **Answer:** return a result locally without continuing the handler chain.

The project asset is `site/assets/hook-event-flow.webp` (1536 × 1024). It is distributed under the project's MIT license. The original composition was exported to WebP for the guide; this is an encoding change only. Selectable HTML text, descriptive alt text, and the interactive event simulator explain the same concepts.

## Reusable image prompt

```text
Use case: infographic-diagram. Asset type: original educational illustration for an independent open-source Claude modding field guide. Create a wide landscape 3:2 editorial diagram, crisp polished flat illustration with subtle tactile paper grain, generous white space on a very pale blue-gray background (#f3f6fa). All typography is clean modern sans serif. Palette: deep midnight navy #14243b, vivid cobalt blue #365bed, fresh chartreuse lime #d5f269, soft periwinkle #dce3ff. No logos, mascots, Claude or Anthropic branding, watermarks, browser chrome, or fake screenshots.
Explain this exact event-hook mechanism with correct directional arrows and visual clarity. On the left a simple small input card labeled "EVENT" feeds a single central rounded navy block labeled "YOUR HOOK". From this block, split into three distinct horizontal lanes stacked top to bottom:
1. "OBSERVE" shown in cobalt: an unchanged small card passes along a solid arrow to a small outlined end block labeled "CONTINUE".
2. "REWRITE" shown in periwinkle with navy text: a card is visibly changed (two short lines become three) then follows a solid arrow to a second outlined end block labeled "CONTINUE".
3. "ANSWER" shown in lime with navy text: a result card ends locally in a round stop dot, with small label "RETURN A RESULT". This lane must terminate locally, never connect to CONTINUE.
All label text must be spelled exactly as quoted, large and very legible. Use only these labels; no title, no subtitle, no code or tiny decorative text. Create a beautifully balanced conceptual map occupying the image center, precise monoline connectors, simple card symbols, subtly offset modular blocks, modern playful technical-education feel, not a dashboard. Diagram accuracy is more important than ornament. Keep margins at least 8% on every edge so nothing is cropped.
```

