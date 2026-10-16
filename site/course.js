import { sanitizeProgress, toggleLesson, resumeLesson } from './progress.mjs';
const metadata = document.querySelector('#course-data');
if (metadata) {
  const lessons=JSON.parse(metadata.textContent);
  const ids=lessons.map(l=>l.id);
  const base=document.body.dataset.courseBase || './';
  const current=document.body.dataset.lesson;
  const key='kitchen-sink-course-progress-v1';
  let storageAvailable=true;
  let progress;
  try { progress=sanitizeProgress(JSON.parse(localStorage.getItem(key)),ids); }
  catch { progress=sanitizeProgress(null,ids); }
  function save() {
    try { localStorage.setItem(key,JSON.stringify(progress)); }
    catch { storageAvailable=false; }
  }
  if(ids.includes(current))progress.lastLesson=current;
  save();
  function paint() {
    const count=progress.completed.length;
    document.querySelectorAll('[data-progress-count]').forEach(el=>el.textContent=`${count} of ${ids.length} complete`);
    document.querySelectorAll('[data-progress-percent]').forEach(el=>el.textContent=`${Math.round(count/ids.length*100)}%`);
    document.querySelectorAll('[data-course-progress]').forEach(el=>{el.max=ids.length;el.value=count;});
    document.querySelectorAll('[data-lesson-marker]').forEach(el=>{
      const id=el.dataset.lessonMarker;
      el.textContent=progress.completed.includes(id)?'✓':String(ids.indexOf(id)+1).padStart(2,'0');
      el.closest('[data-lesson-link]')?.classList.toggle('is-complete',progress.completed.includes(id));
    });
    document.querySelectorAll('[data-lesson-status]').forEach(el=>el.textContent=progress.completed.includes(el.dataset.lessonStatus)?'Completed':'');
    document.querySelectorAll('[data-storage-status]').forEach(el=>el.textContent=storageAvailable?'Progress is saved only in this browser.':'Browser storage is unavailable. Progress will not survive navigation.');
    document.querySelectorAll('[data-resume-course]').forEach(el=>{
      el.href=base+lessons.find(l=>l.id===resumeLesson(progress,ids)).href;
      el.innerHTML=(progress.lastLesson||count?'Continue learning':'Start the course')+' <span aria-hidden="true">↗</span>';
    });
    document.querySelectorAll('[data-progress-message]').forEach(el=>el.textContent=count===ids.length?'All lessons marked complete. Revisit any lesson.':'Every lesson stays open. Pick up where you left off.');
    document.querySelectorAll('[data-complete-lesson]').forEach(button=>{
      const done=progress.completed.includes(button.dataset.completeLesson);
      button.setAttribute('aria-pressed',String(done));button.textContent=done?'✓ Lesson complete · undo':'Mark lesson complete';
    });
  }
  document.querySelectorAll('[data-complete-lesson]').forEach(button=>button.addEventListener('click',()=>{
    progress=toggleLesson(progress,button.dataset.completeLesson,ids);save();paint();
    document.querySelector('[data-completion-status]').textContent=progress.completed.includes(button.dataset.completeLesson)?'Lesson marked complete.':'Completion mark removed.';
  }));
  document.querySelectorAll('[data-reset-progress]').forEach(button=>button.addEventListener('click',()=>{
    progress=sanitizeProgress(null,ids);save();paint();
  }));
  document.querySelectorAll('[data-checkpoint]').forEach(form=>form.addEventListener('submit',event=>{
    event.preventDefault();
    const selected=new FormData(form).get('checkpoint');
    const feedback=form.querySelector('[data-checkpoint-feedback]');
    if(selected===null){feedback.textContent='Choose one answer first.';return;}
    const correct=selected===form.dataset.answer;
    feedback.textContent=(correct?'That’s right. ':'Try again. ')+form.dataset.explanation;
    feedback.dataset.result=correct?'correct':'retry';
  }));
  window.addEventListener('storage',event=>{
    if(event.key!==key)return;
    try{progress=sanitizeProgress(JSON.parse(event.newValue),ids);paint();}catch{}
  });
  const legacy={start:'02-choose-your-surface',understand:'01-building-blocks',playground:'04-follow-an-event',recipes:'06-read-the-plugin',build:'07-make-a-change',troubleshoot:'08-check-and-share',share:'08-check-and-share'};
  if(!current && legacy[location.hash.slice(1)])location.replace(`${base}lessons/${legacy[location.hash.slice(1)]}.html${location.hash}`);
  paint();
}
