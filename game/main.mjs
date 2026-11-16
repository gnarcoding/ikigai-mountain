import { createGame, step, retry, readProgress, saveProgress, clamp } from './engine.mjs';
import { Painter } from './art.mjs';
import { CHAPTERS } from './chapters.mjs';

const $=id=>document.getElementById(id);
const canvas=$('gameCanvas'), painter=new Painter(canvas);
const storageKey='ikigai-mountain:game:base-camp:v1';
const dialogs=[...document.querySelectorAll('dialog')];
let stored=null,storageAvailable=true;
try{stored=readProgress(JSON.parse(localStorage.getItem(storageKey)));}catch{storageAvailable=false;}
let game=createGame(),started=false,last=0,frame=0,soundOn=false,audioContext=null,manifest=null;
let toastUntil=0,lastSave=0,returnToMap=false,guideIndex=0;
let lastPaint=0;
const keys=new Set(),touch={x:0,y:0,strike:false,dash:false};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const paused=()=>dialogs.some(d=>d.open);
function resetInput(){keys.clear();joystickPointer=null;touch.x=touch.y=0;touch.strike=touch.dash=false;$('joystickKnob').style.transform='';}
function save(){
  stored=saveProgress(game);
  try{localStorage.setItem(storageKey,JSON.stringify(stored));}
  catch{if(storageAvailable)toast('Progress stays in this tab; device storage is unavailable.');storageAvailable=false;}
}
function toast(text){$('toast').textContent=text;$('toast').classList.add('visible');toastUntil=performance.now()+4200;}
function sound(type){
  if(!soundOn||!audioContext)return;
  if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
  const notes={strike:[170,110],dash:[300,170],hit:[350,210],spark:[523,659,784],gate:[392,523,659,784],won:[523,659,784,1047],hurt:[140,80],heal:[523,784],guardian:[392,523,784]}[type];
  if(!notes)return;
  notes.forEach((freq,i)=>{const osc=audioContext.createOscillator(),gain=audioContext.createGain(),at=audioContext.currentTime+i*.09;osc.type=type==='hurt'?'triangle':'sine';osc.frequency.setValueAtTime(freq,at);gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.055,at+.008);gain.gain.exponentialRampToValueAtTime(.001,at+.15);osc.connect(gain);gain.connect(audioContext.destination);osc.start(at);osc.stop(at+.17);});
}
function toggleSound(){
  soundOn=!soundOn;
  if(soundOn&&!audioContext){try{audioContext=new (window.AudioContext||window.webkitAudioContext)();}catch{soundOn=false;toast('Game sound is unavailable in this browser.');}}
  $('soundButton').textContent=soundOn?'Sound on':'Sound off';
  $('soundButton').setAttribute('aria-pressed',String(soundOn));
  $('soundButton').setAttribute('aria-label',soundOn?'Turn game sound off':'Turn game sound on');
  if(soundOn)sound('heal');
}
function openDialog(el){resetInput();el.showModal();saveIfStarted();}
function saveIfStarted(){if(started)save();}
for(const d of dialogs){
  d.addEventListener('close',()=>{resetInput();last=0;if(d===$('guideDialog')){$('narration').pause();if(returnToMap){returnToMap=false;openDialog($('levelsDialog'));return;}}if(started&&!paused())canvas.focus({preventScroll:true});});
}
function start(resume=false){
  dialogs.forEach(d=>{if(d.open)d.close();});returnToMap=false;
  game=createGame(resume?stored:null);started=true;resetInput();
  $('startScreen').hidden=true;$('gameCredit').hidden=true;$('hud').hidden=false;$('controlDeck').hidden=false;$('pauseButton').hidden=false;
  document.body.classList.add('playing');painter.resize();canvas.focus({preventScroll:true});last=0;
  toast(resume?'Welcome back. Your sparks are safe.':'Find three sparks. Move with WASD or the thumbstick. Strike to clear your path.');
  save();paintHUD();
}
function paintHUD(){
  const put=(id,text)=>{if($(id).textContent!==text)$(id).textContent=text;};
  put('hearts','♥'.repeat(game.player.hp)+'♡'.repeat(5-game.player.hp));
  const heartLabel=game.player.hp+' of 5 hearts';
  if($('hearts').getAttribute('aria-label')!==heartLabel)$('hearts').setAttribute('aria-label',heartLabel);
  $('dashMeter').style.width=((1-game.player.dashCooldown/1.1)*100)+'%';
  const keeper=game.enemies.find(e=>e.type==='boss');
  const objective=game.sparks.size<3?'Find your three sparks':keeper.hp>0?'Face the Doubtkeeper':'Light the summit beacon';
  if($('objective').textContent!==objective)$('objective').textContent=objective;
  put('sparkCount',game.sparks.size+' / 3 sparks');
  put('regionLabel',{camp:'01 / BASE CAMP',grove:'02 / THE QUIET GROVE',heights:'03 / COURAGE HEIGHTS',guardian:'04 / THE FIRST ASCENT'}[game.zone]);
  $('bossHud').hidden=game.zone!=='guardian'||keeper.hp<=0;
  $('bossHealth').style.width=(keeper.hp/keeper.maxHp*100)+'%';
  $('worldHint').hidden=game.zone!=='guardian'||keeper.hp<=0;
  put('worldHint',keeper.phase==='warning'?'Glowing eyes. Dash out of the charge.':keeper.phase==='rest'?'The guardian is tired. Strike now.':'Watch. Dodge. Find your opening.');
  put('controlTip',game.zone==='camp'?'Follow the gold trail. Walk into a spark to collect it.':game.zone==='grove'?'Wisps throw doubt. Dash through it, or strike close.':game.zone==='heights'?'Thornlings pause before they lunge. Use the opening.':'Your courage is stronger than your doubt.');
}
function finishScreen(won){
  $('endKicker').textContent=won?'THE FIRST STEP IS YOURS':'REST. THEN TRY AGAIN.';
  $('endTitle').textContent=won?'You kept the spark.':'A stumble is not the end.';
  $('endMessage').textContent=won?'You don’t have to be good at it yet. Loving it is enough to start. The next chapter is The Beautiful Thing No One Asked For.':'Your sparks are safe. Catch your breath and return to your last checkpoint with full hearts.';
  $('endStats').textContent=won?game.sparks.size+' sparks · '+Math.floor(game.seconds/60)+'m '+Math.floor(game.seconds%60)+'s · '+game.defeated.size+' doubts overcome':(game.checkpoint==='gate'?'Upper gate':'Base Camp')+' checkpoint · '+game.sparks.size+' / 3 sparks kept';
  $('endAction').textContent=won?'Read / listen to the next stop ↗':'Return to checkpoint ↗';
  $('replayButton').hidden=!won;openDialog($('endDialog'));
}
$('endDialog').addEventListener('cancel',e=>e.preventDefault());
$('endAction').addEventListener('click',()=>{
  const won=game.status==='won';$('endDialog').close();
  if(won)showGuide(1);else{game=retry(game);paintHUD();toast('You still have your sparks. Keep climbing.');}
});
$('replayButton').addEventListener('click',()=>start(false));
$('startButton').addEventListener('click',()=>start(false));
$('resumeButton').hidden=!stored;
$('resumeButton').textContent=stored?.complete?'Revisit your completed climb':'Continue your climb';
$('resumeButton').addEventListener('click',()=>start(true));
$('pauseButton').addEventListener('click',()=>openDialog($('pauseDialog')));
$('restartButton').addEventListener('click',()=>start(false));
$('soundButton').addEventListener('click',toggleSound);
$('playChapter').addEventListener('click',()=>{if(started&&game.status==='playing'){$('levelsDialog').close();}else start(!!stored&&!stored.complete);});
$('levelsButton').addEventListener('click',()=>{renderChapters();openDialog($('levelsDialog'));});
$('closeLevels').addEventListener('click',()=>$('levelsDialog').close());
$('guideButton').addEventListener('click',()=>showGuide(0));
$('closeGuide').addEventListener('click',()=>$('guideDialog').close());

function showGuide(index,fromMap=false){
  guideIndex=index;const chapter=CHAPTERS[index];
  if(!chapter)return;
  returnToMap=false;if($('levelsDialog').open)$('levelsDialog').close();returnToMap=fromMap;
  $('guideKicker').textContent='FIELD GUIDE · STOP '+String(index+1).padStart(2,'0');
  $('guideTitle').textContent=chapter.title;
  $('guideVoice').textContent='“'+chapter.voice+'”';
  $('guideFeels').textContent=chapter.feels;$('guideThrough').textContent=chapter.through;$('guideQuestion').textContent=chapter.question;
  $('readingLink').href='/?stop='+encodeURIComponent(index===0?'trailhead':chapter.id);
  setNarration(chapter);if(!$('guideDialog').open)openDialog($('guideDialog'));
}
function setNarration(chapter){
  const track=manifest?.sections?.[chapter.id];const audio=$('narration');audio.pause();
  // Only the self-hosted filenames from this repository's manifest are used.
  const available=track&&/^[a-z0-9-]+\.mp3$/.test(track.file);
  audio.hidden=!available;$('audioUnavailable').hidden=!!available;
  if(available)audio.src='/audio/'+track.file;else{audio.removeAttribute('src');audio.load();}
}
fetch('/audio/manifest.json').then(r=>r.ok?r.json():null).then(m=>{manifest=m;if($('guideDialog').open)setNarration(CHAPTERS[guideIndex]);}).catch(()=>{});
function renderChapters(face='all'){
  $('mapFilter').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.face===face)));
  const list=$('chapterList');list.replaceChildren();
  CHAPTERS.forEach((chapter,index)=>{
    if(face!=='all'&&chapter.face!==face)return;
    const card=document.createElement('article');card.className='chapter-card'+(index===0?' ready':'');
    const number=document.createElement('span');number.className='chapter-number';number.textContent=String(index+1).padStart(2,'0');
    const content=document.createElement('div'),title=document.createElement('h3'),note=document.createElement('p'),button=document.createElement('button');
    title.textContent=chapter.title;note.textContent=index===0?(stored?.complete?'Level complete · play again':'Playable now · chapter one'):'Story available · game level to come';
    button.textContent='Read / listen ↗';button.addEventListener('click',()=>showGuide(index,true));
    content.append(title,note,button);card.append(number,content);list.append(card);
  });
}
$('mapFilter').addEventListener('click',e=>{
  const button=e.target.closest('button[data-face]');if(!button)return;
  $('mapFilter').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  renderChapters(button.dataset.face);
});
function keyInput(e,down){
  if(e.code==='Escape'&&down&&started&&!paused()){e.preventDefault();openDialog($('pauseDialog'));return;}
  if(!started||paused()||game.status!=='playing')return;
  // Keep normal keyboard activation available on navigation and action buttons.
  if(e.target instanceof HTMLElement&&e.target.closest('button,a,input,select,textarea'))return;
  const accepted=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','KeyW','KeyA','KeyS','KeyD','Space','KeyJ','ShiftLeft','ShiftRight','KeyK'];
  if(accepted.includes(e.code)){e.preventDefault();if(down)keys.add(e.code);else keys.delete(e.code);}
}
window.addEventListener('keydown',e=>keyInput(e,true));window.addEventListener('keyup',e=>{keys.delete(e.code);});
window.addEventListener('blur',()=>{resetInput();if(started&&!paused()&&game.status==='playing')openDialog($('pauseDialog'));});
document.addEventListener('visibilitychange',()=>{
  resetInput();last=0;
  if(document.hidden){saveIfStarted();$('narration').pause();if(started&&!paused()&&game.status==='playing')openDialog($('pauseDialog'));cancelAnimationFrame(frame);frame=0;}
  else if(!frame)frame=requestAnimationFrame(loop);
});
window.addEventListener('pagehide',saveIfStarted);

let joystickPointer=null;
const joystick=$('joystick');
function moveStick(e){
  if(e.pointerId!==joystickPointer)return;
  const box=joystick.getBoundingClientRect(),x=e.clientX-box.left-box.width/2,y=e.clientY-box.top-box.height/2,d=Math.hypot(x,y),radius=box.width*.36;
  const amount=Math.min(d,radius);touch.x=d>5?x/d*amount/radius:0;touch.y=d>5?y/d*amount/radius:0;
  $('joystickKnob').style.transform='translate('+touch.x*radius+'px,'+touch.y*radius+'px)';
}
joystick.addEventListener('pointerdown',e=>{if(joystickPointer!==null)return;joystickPointer=e.pointerId;joystick.setPointerCapture(e.pointerId);moveStick(e);e.preventDefault();});
joystick.addEventListener('pointermove',moveStick);
function releaseStick(e){if(e.pointerId!==joystickPointer)return;joystickPointer=null;touch.x=touch.y=0;$('joystickKnob').style.transform='';}
for(const ev of ['pointerup','pointercancel','lostpointercapture'])joystick.addEventListener(ev,releaseStick);
function bindAction(id,action){
  const button=$(id);
  button.addEventListener('pointerdown',e=>{button.setPointerCapture(e.pointerId);touch[action]=true;e.preventDefault();});
  for(const ev of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(ev,()=>{touch[action]=false;});
  button.addEventListener('click',e=>{if(e.detail===0&&!paused()){step(game,{x:0,y:0,[action]:true},0);}});
}
bindAction('strikeButton','strike');bindAction('dashButton','dash');
function loop(now){
  frame=0;if(document.hidden)return;
  const dt=last?Math.min((now-last)/1000,.05):0;last=now;
  if(started&&!paused()&&game.status==='playing'){
    const x=touch.x+(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0);
    const y=touch.y+(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0);
    step(game,{x,y,strike:touch.strike||keys.has('Space')||keys.has('KeyJ'),dash:touch.dash||keys.has('ShiftLeft')||keys.has('ShiftRight')||keys.has('KeyK')},dt);
    for(const event of game.events.splice(0)){
      if(event.text)toast(event.text);sound(event.type);
      if(event.type==='save')save();
      if(event.type==='won'||event.type==='fallen')finishScreen(event.type==='won');
    }
    if(now-lastSave>10000){lastSave=now;save();}
    paintHUD();
  }
  // Menus and narration do not need a continuously repainted world behind them.
  if((!paused()&&(started||!reduced.matches))||now-lastPaint>500){
    painter.draw(game,now/1000,!started,reduced.matches);lastPaint=now;
  }
  if(toastUntil&&now>toastUntil){$('toast').classList.remove('visible');toastUntil=0;}
  frame=requestAnimationFrame(loop);
}
new ResizeObserver(()=>painter.resize()).observe(canvas);
painter.resize();frame=requestAnimationFrame(loop);
renderChapters();
const selected=new URLSearchParams(location.search).get('chapter');
if(selected){const index=CHAPTERS.findIndex(c=>c.id===selected);if(index>0)showGuide(index);else if(selected==='map')openDialog($('levelsDialog'));}
