# Course experience and design decisions

The course should help a newcomer answer three questions quickly: **Which Claude experience do I use? Where should I start? What happens next?** This is a small static teaching site, so the navigation works with ordinary lesson URLs and a little browser JavaScript.

## Changes from the first course version

| Friction | Current behavior | Reason |
| --- | --- | --- |
| One sequence sent Cowork learners into Code-only UI lessons | Five-lesson Cowork path, seven-lesson Code path, or all eight lessons | Keep the next lesson relevant to the learner's surface |
| A large opening illustration delayed the learning controls | Compact introduction, visible path choices, named start/resume panel | Put the learner's next action before supplementary explanation |
| Resume did not preview the destination | Title, path position, completion count, and a specific Start/Continue action | Make returning to the course predictable |
| Completion and next navigation required separate actions | Complete & continue; a separate reversible completion mark is still available | Let one deliberate action save progress and advance |
| Reset immediately erased marks | Reset sits inside Progress settings and offers Undo reset until dismissal or navigation | Give a mistaken click a recovery path without a confirmation dialog |
| Small lesson descriptions and mobile prose | 14px desktop / 13px mobile card descriptions; 16px / 15px lesson prose | Improve reading at the tested sizes |
| Reading, exercise, and quiz were far apart | Jump links, expandable diagrams, optional checkpoint, persistent mobile lesson navigation | Support reading or practice without requiring every activity |
| The small letter-based logo was hard to parse | Shared SVG event-branch symbol for header and favicon | Use a distinct, scalable shape that stays legible at small sizes |

The branding is independent of Anthropic's product marks. The event branch represents the course's observe/rewrite/answer model. Its lime input dot and white output dots work without lettering or a raster image.

## Paths, progress, and links

- `site/course-data.mjs` owns lesson content; `site/paths.mjs` chooses which lessons belong to each path. Shared lessons keep the same IDs across paths.
- `scripts/render-course.mjs` builds the homepage and eight real lesson pages. `site/course.js` adjusts the active path, counts, resume action, and neighbors. `site/course.css` defines the responsive course layout.
- Completion records use `kitchen-sink-course-progress-v1`. The separate `kitchen-sink-course-path-v1` value stores only `all`, `cowork`, or `code`. No quiz answers, identity, reading times, or activity logs are stored.
- Valid `?path=` parameters take priority over the remembered preference. Lesson and course-home navigation carries the selected path in its URL. Switching paths preserves every valid completion mark. Completion changes from another tab update the current tab; its selected path stays in place.
- Direct links to a lesson outside the selected path remain readable. The page explains the mismatch and offers a route back or a switch to all lessons. Returning to the path does not silently mark that extra lesson complete.
- Complete & continue is idempotent: revisiting and continuing from an already completed lesson never removes its mark. At the final lesson, Complete & review returns to the overview; the overview declares completion only when every lesson in the selected path is marked.
- Undo reset is an in-memory snapshot, available on the current page until dismissed or navigation. It is not a backup across reloads. A blocked-storage notice explains the loss of persistence; path URLs still work.

All lesson content and links are rendered in HTML. Progress, path filtering, quizzes, and the interactive explainers require JavaScript. There is no account, analytics, backend, framework runtime, or dependency installation step.

## Focused acceptance checklist

When changing navigation or presentation, use a fresh browser context so existing progress does not hide the first-visit state.

1. At 390px width, see the path choices and named start action without scrolling. At 320px, confirm no horizontal page overflow and usable lesson navigation.
2. Choose Cowork. Confirm five lessons, then open its workflow lesson: next must be **Your first change**, not the event-hook lesson. Choose Code: seven lessons, without the Cowork lesson.
3. Complete and continue, then return to the same lesson and continue again. Its mark should remain saved, and the homepage should name the next unfinished visited lesson.
4. Switch paths. Shared completions count in both paths; other-path completions remain stored but do not inflate the selected path's count.
5. Reset and undo. The previous completion marks and last opened lesson should return. Test from the homepage and the mobile lesson menu.
6. Open an outside-path deep link. Read it, return to the chosen path, and verify that returning alone did not mark the extra lesson complete.
7. Mark every lesson in a path complete. The overview should show a finished state and a Review these lessons action.
8. Expand a diagram, use the lesson jump links, and change a quiz answer after checking it. The previous feedback should clear.
9. Block local storage. Confirm the notice, working navigation, and the path parameter on next and course-home links. Use Tab/Enter to check the path choices, menu, and diagram without a pointer.
10. Inspect desktop and mobile screenshots, including the fixed mobile navigation at the end of a lesson. Check the quick reference because it shares the header assets.

See [the validation record](validation.md) for the checks actually run. These are engineering and browser checks, not evidence from a participant usability study or acceptance in the Claude Desktop application.
