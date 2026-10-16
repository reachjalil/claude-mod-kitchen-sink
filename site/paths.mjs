// Paths recommend a sequence; every lesson remains accessible.
export const paths = [
  { id: 'all', label: 'Full course', short: 'All lessons', description: 'Explore both customization paths', ids: null },
  { id: 'cowork', label: 'Cowork workflows', short: 'Cowork', description: 'Build repeatable instructions', ids: ['01-building-blocks','02-choose-your-surface','03-cowork-workflow','07-make-a-change','08-check-and-share'] },
  { id: 'code', label: 'Code UI mods', short: 'Claude Code', description: 'Build interface and event behavior', ids: ['01-building-blocks','02-choose-your-surface','04-follow-an-event','05-draw-and-redraw','06-read-the-plugin','07-make-a-change','08-check-and-share'] },
];
export function getPath(id) { return paths.find(p=>p.id===id) ?? paths[0]; }
export function pathLessonIds(id, ids) { const p=getPath(id);return p.ids ? ids.filter(item=>p.ids.includes(item)) : [...ids]; }
export function pathStats(progress, ids) { return { completed: ids.filter(id=>progress.completed.includes(id)).length, total: ids.length }; }
export function pathNeighbors(current, ids) {
  const position=ids.indexOf(current);
  return { previous: position>0 ? ids[position-1] : null, next: position>=0 ? ids[position+1] ?? null : null, position };
}
