import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../site/course-data.mjs';
import { getPath, pathLessonIds, pathStats, pathNeighbors } from '../site/paths.mjs';
import { resumeLesson } from '../site/progress.mjs';
const ids=lessons.map(lesson=>lesson.id);

test('Cowork continuation skips Code-only lessons and ends with checking and sharing',()=>{
 const route=pathLessonIds('cowork',ids);
 assert.equal(route.length,5);
 assert.deepEqual(pathNeighbors('03-cowork-workflow',route),{
  previous:'02-choose-your-surface',next:'07-make-a-change',position:2
 });
 assert.equal(route.at(-1),'08-check-and-share');
 assert.ok(!route.some(id=>/^(04|05|06)-/.test(id)));
});
test('Code continuation skips Cowork and unknown paths show the full course',()=>{
 const route=pathLessonIds('code',ids);
 assert.equal(route.length,7);
 assert.equal(pathNeighbors('02-choose-your-surface',route).next,'04-follow-an-event');
 assert.deepEqual(pathNeighbors('03-cowork-workflow',route),{previous:null,next:null,position:-1});
 assert.equal(getPath('unknown').id,'all');
 assert.deepEqual(pathLessonIds('unknown',ids),ids);
});
test('path progress and resume ignore other-path visits without losing their completion',()=>{
 const progress={completed:['01-building-blocks','04-follow-an-event'],lastLesson:'05-draw-and-redraw'};
 const route=pathLessonIds('cowork',ids);
 assert.deepEqual(pathStats(progress,route),{completed:1,total:5});
 assert.equal(resumeLesson(progress,route),'02-choose-your-surface');
 assert.deepEqual(progress.completed,['01-building-blocks','04-follow-an-event']);
 const finished={completed:route,lastLesson:route.at(-1)};
 assert.deepEqual(pathStats(finished,route),{completed:5,total:5});
});
