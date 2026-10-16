import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeProgress, toggleLesson, resumeLesson, completeLesson } from '../site/progress.mjs';
const ids=['a','b','c'];
test('progress accepts only known unique lesson IDs and drops unrelated data',()=>{
 assert.deepEqual(sanitizeProgress({completed:['a','a','unknown',null],lastLesson:'unknown',name:'private'},ids),{completed:['a'],lastLesson:null});
 assert.deepEqual(sanitizeProgress(null,ids),{completed:[],lastLesson:null});
 assert.deepEqual(sanitizeProgress({completed:'not-an-array'},ids),{completed:[],lastLesson:null});
});
test('completion is reversible and unknown lesson IDs cannot be added',()=>{
 const marked=toggleLesson(null,'b',ids);
 assert.deepEqual(marked,{completed:['b'],lastLesson:'b'});
 assert.deepEqual(toggleLesson(marked,'b',ids),{completed:[],lastLesson:'b'});
 assert.deepEqual(toggleLesson(marked,'unknown',ids),marked);
});
test('resume keeps an unfinished visited lesson or chooses the next incomplete one',()=>{
 assert.equal(resumeLesson({completed:['a'],lastLesson:'c'},ids),'c');
 assert.equal(resumeLesson({completed:['a'],lastLesson:'a'},ids),'b');
 assert.equal(resumeLesson({completed:ids,lastLesson:'c'},ids),'a');
});
test('complete and continue is idempotent and preserves other completion marks',()=>{
 const completed=completeLesson({completed:['a'],lastLesson:'a'},'b',ids);
 assert.deepEqual(completed,{completed:['a','b'],lastLesson:'b'});
 assert.deepEqual(completeLesson(completed,'b',ids),completed);
 assert.deepEqual(completeLesson(completed,'unknown',ids),completed);
});
