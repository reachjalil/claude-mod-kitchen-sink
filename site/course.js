import { sanitizeProgress, toggleLesson, resumeLesson, completeLesson } from './progress.mjs';
import { paths, getPath, pathLessonIds, pathStats, pathNeighbors } from './paths.mjs';
const metadata=document.querySelector('#course-data');
if(metadata){
 const lessons=JSON.parse(metadata.textContent);
 const ids=lessons.map(l=>l.id);
 const byId=id=>lessons.find(l=>l.id===id);
 const base=document.body.dataset.courseBase || './';
 const current=document.body.dataset.lesson;
 const key='kitchen-sink-course-progress-v1';
 const pathKey='kitchen-sink-course-path-v1';
 let storageAvailable=true,progress,pathId='all',resetSnapshot=null;
 try{
  progress=sanitizeProgress(JSON.parse(localStorage.getItem(key)),ids);
  pathId=getPath(localStorage.getItem(pathKey)).id;
 }catch{storageAvailable=false;progress=sanitizeProgress(null,ids);}
 const queryPath=new URL(location.href).searchParams.get('path');
 if(paths.some(p=>p.id===queryPath))pathId=queryPath;
 if(ids.includes(current))progress.lastLesson=current;
 function save(){
  try{localStorage.setItem(key,JSON.stringify(progress));localStorage.setItem(pathKey,pathId);storageAvailable=true;}
  catch{storageAvailable=false;}
 }
 function lessonURL(id){
  const url=new URL(id?base+byId(id).href:base+'index.html',location.href);
  if(pathId!=='all')url.searchParams.set('path',pathId);
  return url.href;
 }
 function setPath(value){
  pathId=getPath(value).id;
  const url=new URL(location.href);
  if(pathId==='all')url.searchParams.delete('path');else url.searchParams.set('path',pathId);
  history.replaceState(null,'',url);
  save();paint();
 }
 function paint(){
  const path=getPath(pathId),route=pathLessonIds(pathId,ids);
  const stats=pathStats(progress,route),done=stats.completed===stats.total;
  const resume=resumeLesson(progress,route),target=byId(resume);
  const neighbors=pathNeighbors(current,route),outside=!!current&&neighbors.position<0;
  document.querySelectorAll('[data-path]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.path===pathId)));
  document.querySelectorAll('[data-course-home]').forEach(el=>el.href=lessonURL(null));
  document.querySelectorAll('[data-path-select]').forEach(el=>el.value=pathId);
  document.querySelectorAll('[data-path-label]').forEach(el=>el.textContent=path.label);
  document.querySelectorAll('[data-path-description]').forEach(el=>el.textContent=path.description+'. Your completed lessons carry across paths.');
  document.querySelectorAll('[data-progress-count]').forEach(el=>el.textContent=`${stats.completed} of ${stats.total} complete`);
  document.querySelectorAll('[data-progress-percent]').forEach(el=>el.textContent=`${Math.round(stats.completed/stats.total*100)}%`);
  document.querySelectorAll('[data-course-progress]').forEach(el=>{el.max=stats.total;el.value=stats.completed;});
  document.querySelectorAll('[data-current-position]').forEach(el=>el.textContent=outside?'EXTRA LESSON · '+path.label.toUpperCase():`STEP ${neighbors.position+1} OF ${route.length} · ${path.label.toUpperCase()}`);
  document.querySelectorAll('[data-outside-path]').forEach(el=>el.hidden=!outside);
  document.querySelectorAll('[data-set-path="all"]').forEach(el=>el.hidden=pathId==='all');
  document.querySelectorAll('[data-lesson-link]').forEach(el=>{
   const id=el.dataset.lessonLink;
   el.hidden=!route.includes(id)&&id!==current;
   el.href=lessonURL(id);
   el.classList.toggle('is-complete',progress.completed.includes(id));
  });
  document.querySelectorAll('[data-lesson-marker]').forEach(el=>{
   const id=el.dataset.lessonMarker,position=route.indexOf(id);
   el.textContent=progress.completed.includes(id)?'✓':position>=0?String(position+1).padStart(2,'0'):'+';
  });
  document.querySelectorAll('[data-lesson-status]').forEach(el=>{
   const id=el.dataset.lessonStatus;
   el.textContent=progress.completed.includes(id)?'Completed':progress.lastLesson===id?'Last opened':'Not started';
  });
  document.querySelectorAll('[data-mobile-lesson]').forEach(el=>{
   const id=el.dataset.mobileLesson;
   el.hidden=!route.includes(id)&&id!==current;el.href=lessonURL(id);
   const marker=el.querySelector('[data-mobile-marker]');
   marker.textContent=progress.completed.includes(id)?'✓':route.indexOf(id)>=0?String(route.indexOf(id)+1).padStart(2,'0'):'+';
  });
  document.querySelectorAll('[data-course-group]').forEach(group=>{
   const count=[...group.querySelectorAll('[data-lesson-link]')].filter(el=>!el.hidden).length;
   group.hidden=count===0;
   const label=group.querySelector('[data-group-count]');if(label)label.textContent=`${count} ${count===1?'lesson':'lessons'}`;
  });
  document.querySelectorAll('[data-storage-status]').forEach(el=>el.textContent=storageAvailable?'Saved only in this browser.':'Storage is unavailable. Completion will not survive navigation.');
  document.querySelectorAll('[data-resume-kicker]').forEach(el=>el.textContent=done?'PATH COMPLETE':progress.lastLesson||progress.completed.length?'PICK UP WHERE YOU LEFT OFF':'YOUR FIRST STEP');
  document.querySelectorAll('[data-resume-position]').forEach(el=>el.textContent=done?path.label:`Lesson ${route.indexOf(resume)+1} of ${route.length} · ${path.label}`);
  document.querySelectorAll('[data-resume-title]').forEach(el=>el.textContent=done?'You’ve finished this path.':target.title);
  document.querySelectorAll('[data-resume-summary]').forEach(el=>el.textContent=done?'Revisit a topic or switch paths to explore another kind of customization.':target.summary);
  document.querySelectorAll('[data-resume-course]').forEach(el=>{
   el.href=done?lessonURL(null)+'#curriculum':lessonURL(resume);
   el.innerHTML=(done?'Review these lessons':`${progress.lastLesson||progress.completed.length?'Continue':'Start'} lesson ${route.indexOf(resume)+1}`)+' <span aria-hidden="true">→</span>';
  });
  document.querySelectorAll('[data-curriculum-title]').forEach(el=>el.textContent=pathId==='all'?'The full course':path.label+' path');
  document.querySelectorAll('[data-progress-message]').forEach(el=>el.textContent=`${route.length} lessons in this path. You can switch paths or open any lesson at any time.`);
  const completed=progress.completed.includes(current);
  document.querySelectorAll('[data-complete-lesson]').forEach(el=>{
   el.setAttribute('aria-pressed',String(completed));el.textContent=completed?'✓ Completed · undo':'Mark complete without leaving';
  });
  document.querySelectorAll('[data-lesson-state]').forEach(el=>el.textContent=completed?'Your completion is saved.':'Finish at your own pace.');
  document.querySelectorAll('[data-previous-lesson]').forEach(el=>el.href=lessonURL(neighbors.previous));
  document.querySelectorAll('[data-previous-title]').forEach(el=>el.textContent=neighbors.previous?byId(neighbors.previous).short:'Course overview');
  const next=outside?resume:neighbors.next;
  document.querySelectorAll('[data-next-lesson]').forEach(el=>el.href=lessonURL(next));
  document.querySelectorAll('[data-next-action]').forEach(el=>el.textContent=outside?'Return to my path':next?(completed?'Continue':'Complete & continue'):(completed?'Review my path':'Complete & review'));
  document.querySelectorAll('[data-next-title]').forEach(el=>el.textContent=next?byId(next).short:'Course overview');
  document.querySelectorAll('[data-undo-notice]').forEach(el=>el.hidden=!resetSnapshot);
 }
 document.querySelectorAll('[data-path]').forEach(el=>el.addEventListener('click',()=>setPath(el.dataset.path)));
 document.querySelectorAll('[data-path-select]').forEach(el=>el.addEventListener('change',()=>setPath(el.value)));
 document.querySelectorAll('[data-set-path]').forEach(el=>el.addEventListener('click',()=>setPath(el.dataset.setPath)));
 document.querySelectorAll('[data-complete-lesson]').forEach(el=>el.addEventListener('click',()=>{
  progress=toggleLesson(progress,current,ids);save();paint();
  document.querySelector('[data-completion-status]').textContent=progress.completed.includes(current)?'Lesson marked complete.':'Completion mark removed.';
 }));
 document.querySelectorAll('[data-complete-continue]').forEach(el=>el.addEventListener('click',event=>{
  if(pathLessonIds(pathId,ids).includes(current)){
   progress=completeLesson(progress,current,ids);save();paint();
  }
  if(!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey){event.preventDefault();location.assign(el.href);}
 }));
 document.querySelectorAll('[data-reset-progress]').forEach(el=>el.addEventListener('click',()=>{
  resetSnapshot=sanitizeProgress(progress,ids);progress=sanitizeProgress(null,ids);save();paint();
  document.querySelector('[data-undo-message]').textContent='Completion marks reset for this course.';
 }));
 document.querySelector('[data-undo-reset]')?.addEventListener('click',()=>{
  if(!resetSnapshot)return;progress=resetSnapshot;resetSnapshot=null;save();paint();
 });
 document.querySelector('[data-dismiss-notice]')?.addEventListener('click',()=>{resetSnapshot=null;paint();});
 document.querySelectorAll('[data-checkpoint]').forEach(form=>{
  form.addEventListener('change',()=>{const feedback=form.querySelector('[data-checkpoint-feedback]');feedback.textContent='';delete feedback.dataset.result;});
  form.addEventListener('submit',event=>{
   event.preventDefault();const selected=new FormData(form).get('checkpoint');
   const feedback=form.querySelector('[data-checkpoint-feedback]');
   if(selected===null){feedback.textContent='Choose one answer first.';return;}
   const correct=selected===form.dataset.answer;
   feedback.textContent=(correct?'Correct. ':'Not quite. ')+form.dataset.explanation;
   feedback.dataset.result=correct?'correct':'retry';
  });
 });
 window.addEventListener('storage',event=>{
  if(event.key!==key)return;
  try{progress=sanitizeProgress(JSON.parse(event.newValue),ids);resetSnapshot=null;paint();}catch{}
 });
 const legacy={start:'02-choose-your-surface',understand:'01-building-blocks',playground:'04-follow-an-event',recipes:'06-read-the-plugin',build:'07-make-a-change',troubleshoot:'08-check-and-share',share:'08-check-and-share'};
 if(!current&&legacy[location.hash.slice(1)])location.replace(lessonURL(legacy[location.hash.slice(1)])+location.hash);
 save();paint();
}
