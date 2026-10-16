// Only known lesson IDs and completion marks are stored. No names or activity logs.
export function sanitizeProgress(value, ids) {
  const valid = new Set(ids);
  const completed = Array.isArray(value?.completed) ? [...new Set(value.completed.filter(id => valid.has(id)))] : [];
  return { completed, lastLesson: valid.has(value?.lastLesson) ? value.lastLesson : null };
}
export function toggleLesson(value, id, ids) {
  const progress = sanitizeProgress(value, ids);
  if (!ids.includes(id)) return progress;
  const completed = progress.completed.includes(id) ? progress.completed.filter(item=>item!==id) : [...progress.completed,id];
  return { completed, lastLesson: id };
}
export function resumeLesson(value, ids) {
  const progress = sanitizeProgress(value, ids);
  if (progress.lastLesson && !progress.completed.includes(progress.lastLesson)) return progress.lastLesson;
  return ids.find(id=>!progress.completed.includes(id)) ?? ids[0];
}
