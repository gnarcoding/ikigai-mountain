import { createGame, step, retry } from './engine.mjs';
import { Painter, drawHeroPortrait } from './art.mjs';
import { MountainAudio } from './audio.mjs';
import { CHAPTERS } from './chapters.mjs';
import { LEVELS, HEROES, heroById } from './levels.mjs';
import { loadJourney, recordGame, persistJourney, clearedCount, campaignNext } from './progress.mjs';

const $=id=>document.getElementById(id),canvas=$('gameCanvas'),painter=new Painter(canvas);
let storage;try{storage=window.localStorage;}catch{storage=null;}
const audio=new MountainAudio(storage);
let cinematic=true;try{cinematic=storage?.getItem('ikigai-mountain:cinematic')!=='false';}catch{}
const loaded=loadJourney(storage);let journey=loaded.journey,storageAvailable=loaded.status!=='unavailable';
const dialogs=[...document.querySelectorAll('dialog')],keys=new Set(),touch={x:0,y:0,strike:false,dash:false};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let game=createGame(),started=false,last=0,frame=0,manifest=null;
let toastUntil=0,lastSave=0,returnToMap=false,guideIndex=0,lastPaint=0,joystickPointer=null,pendingStart=null;
const paused=()=>dialogs.some(d=>d.open);
const put=(id,text)=>{if($(id).textContent!==text)$(id).textContent=text;};
function resetInput(){keys.clear();joystickPointer=null;touch.x=touch.y=0;touch.strike=touch.dash=false;$('joystickKnob').style.transform='';}
function toast(text){$('toast').textContent=text;$('toast').classList.add('visible');toastUntil=performance.now()+4200;}
function save(){
  if(started)recordGame(journey,game);
  storageAvailable=persistJourney(storage,journey);
  paintProgress();
}
function saveIfStarted(){if(started)save();}
function paintProgress(){
  const count=clearedCount(journey),hero=heroById(journey.heroId),record=journey.records[LEVELS[journey.currentLevel].id];
  $('resumeButton').hidden=!record;
  $('resumeButton').textContent='Continue · chapter '+String(journey.currentLevel+1).padStart(2,'0');
  put('journeySummary',journey.chosen?hero.name+' · '+count+' / 27 chapters complete':'Four climbers. Twenty-seven chapters. Your own way up.');
  put('progressSummary',count+' / 27 chapters complete');
  $('journeyMeter').style.width=(count/27*100)+'%';
  const status=storageAvailable?'Progress saves in this browser on this device.':'Browser saving is unavailable. Keep this tab open to retain this session.';
  document.querySelectorAll('[data-save-status]').forEach(el=>{if(el.textContent!==status)el.textContent=status;});
  $('savedHero').textContent=hero.name+' · '+hero.role;
}
async function unlockAudio(){
  const ok=await audio.unlock();if(!ok)toast('Audio is unavailable in this browser. You can keep playing.');syncAudio();
}
function paintAudio(){
  const p=audio.preferences;
  for(const key of ['music','effects']){$(key+'Enabled').checked=p[key];$(key+'Volume').value=Math.round(p[key+'Volume']*100);$(key+'VolumeValue').textContent=Math.round(p[key+'Volume']*100)+'%';}
  $('cinematicEnabled').checked=cinematic;document.documentElement.dataset.vfx=cinematic?'full':'quiet';
}
function syncAudio(){
  const boss=game.enemies.find(e=>e.type==='boss'),battle=started&&game.zone==='guardian'&&boss.hp>0;
  audio.setState({paused:paused()||game.status!=='playing',hidden:document.hidden,narrating:!$('narration').paused,battle});
  const audible=!!audio.context&&!audio.failed&&audio.preferences.music&&audio.preferences.musicVolume>0&&!document.hidden&&$('narration').paused;
  $('testAudio').disabled=!audio.preferences.effects||audio.preferences.effectsVolume===0;
  $('testAudio').textContent=$('testAudio').disabled?'Enable sound effects to test':'Test a relic chime ♫';
  $('soundButton').dataset.active=String(audible);$('musicStrip').hidden=!started;
  $('musicStrip').dataset.playing=String(audible&&!paused()&&cinematic&&!reduced.matches);
  if(audio.score){put('trackLabel',audio.score.title);put('settingsTrack','Chapter '+String(game.level.index+1).padStart(2,'0')+' · '+audio.score.title);}
  put('musicMode',!audio.preferences.music||!audio.preferences.musicVolume?'MUSIC OFF':audio.failed?'AUDIO UNAVAILABLE':!audio.context?'TAP AUDIO TO LISTEN':battle?'GUARDIAN VARIATION':'ORIGINAL SCORE');
}
$('soundButton').addEventListener('click',()=>{unlockAudio();paintAudio();openDialog($('audioDialog'));});
$('closeAudio').addEventListener('click',()=>$('audioDialog').close());
$('testAudio').addEventListener('click',async()=>{if(await audio.unlock())audio.effect('spark');syncAudio();});
for(const key of ['music','effects']){
  $(key+'Enabled').addEventListener('change',()=>{audio.setPreferences({[key]:$(key+'Enabled').checked});unlockAudio();syncAudio();});
  $(key+'Volume').addEventListener('input',()=>{audio.setPreferences({[key+'Volume']:Number($(key+'Volume').value)/100});$(key+'VolumeValue').textContent=$(key+'Volume').value+'%';syncAudio();});
}
$('cinematicEnabled').addEventListener('change',()=>{cinematic=$('cinematicEnabled').checked;try{storage?.setItem('ikigai-mountain:cinematic',String(cinematic));}catch{}paintAudio();});
for(const event of ['play','pause','ended'])$('narration').addEventListener(event,syncAudio);
function openDialog(el){resetInput();if(!el.open)el.showModal();saveIfStarted();syncAudio();}
function closeDialogs(){returnToMap=false;dialogs.forEach(d=>{if(d.open)d.close();});}
for(const d of dialogs)d.addEventListener('close',()=>{
  resetInput();last=0;syncAudio();
  if(d===$('guideDialog')){$('narration').pause();if(returnToMap){returnToMap=false;openDialog($('levelsDialog'));return;}}
  if(started&&!paused())canvas.focus({preventScroll:true});
});
function choosePlayer(request){
  pendingStart=request;closeDialogs();
  for(const radio of $('heroChoices').querySelectorAll('input'))radio.checked=radio.value===journey.heroId;
  openDialog($('playerDialog'));
}
function requestStart(index,mode='single',options={}){
  saveIfStarted();
  const request={index,mode,resume:options.resume!==false};
  if(options.pick||!journey.chosen)choosePlayer(request);else startLevel(request);
}
function startLevel({index,mode,resume=true}){
  closeDialogs();const level=LEVELS[index];
  const saved=resume?journey.records[level.id]?.progress:null;
  game=createGame(saved,index,journey.heroId);journey.mode=mode;journey.currentLevel=index;started=true;resetInput();
  // Consume the entry link so a reload offers the latest saved chapter.
  const entryURL=new URL(location.href);entryURL.searchParams.delete('chapter');history.replaceState(null,'',entryURL);
  $('startScreen').hidden=true;$('gameCredit').hidden=true;$('hud').hidden=false;$('controlDeck').hidden=false;$('pauseButton').hidden=false;
  document.body.classList.add('playing');document.documentElement.style.setProperty('--gold',level.theme.accent);
  painter.setLevel(level);painter.resize();audio.setChapter(level);last=0;save();paintHUD();syncAudio();
  if(game.completed){game.status='won';finishScreen(true);return;}
  put('briefKicker','CHAPTER '+String(index+1).padStart(2,'0')+' / 27 · '+level.theme.name.toUpperCase());
  put('briefTitle',level.chapter.title);put('briefMission',level.objective);put('briefInstructions',level.instructions);
  put('briefBoss','Guardian: '+level.bossName);
  put('briefReflection','“'+level.chapter.voice+'”');
  $('enterLevel').textContent=saved?'Resume this chapter ↗':'Enter this chapter ↗';
  openDialog($('briefDialog'));
}
function paintHUD(){
  const {hero,level,player:p}=game,keeper=game.enemies.find(e=>e.type==='boss');
  put('hearts','♥'.repeat(p.hp)+'♡'.repeat(hero.hp-p.hp));
  const label=p.hp+' of '+hero.hp+' hearts';if($('hearts').getAttribute('aria-label')!==label)$('hearts').setAttribute('aria-label',label);
  $('dashMeter').style.width=((1-p.dashCooldown/hero.dashCooldown)*100)+'%';
  put('objective',game.sparks.size<level.goals.length?level.objective:keeper.hp>0?'Face '+level.bossName:'Light the beacon');
  put('sparkCount',game.sparks.size+' / '+level.goals.length+' '+({collect:'sparks',rescue:'spirits',sequence:'runes',wardens:'sigils',beacons:'shrines'}[level.kind]));
  put('regionLabel',String(level.index+1).padStart(2,'0')+' / '+level.theme.name.toUpperCase());
  put('bossName',level.bossName.toUpperCase());
  $('bossHud').hidden=game.zone!=='guardian'||keeper.hp<=0;$('bossHealth').style.width=(keeper.hp/keeper.maxHp*100)+'%';
  $('worldHint').hidden=game.zone!=='guardian'||keeper.hp<=0;
  put('worldHint',keeper.phase==='warning'?(keeper.attack==='stomp'?'Leave the glowing circle.':keeper.attack==='charge'?'Dash out of the charge.':'A volley is coming. Keep moving.'):keeper.phase==='rest'?'Your opening. Strike now.':'Watch. Dodge. Find your opening.');
  put('controlTip',level.instructions+' '+(level.hazards.length?'Glowing ground hurts; brambles slow you down.':''));
}
function finishScreen(won){
  const index=game.level.index,final=index===26,count=clearedCount(journey);
  put('endKicker',won?(final?'THE SUMMIT · A REASON FOR BEING':'CHAPTER '+String(index+1).padStart(2,'0')+' COMPLETE'):'REST. THEN TRY AGAIN.');
  put('endTitle',won?(final?'You reached Ikigai.':'A little higher. A little wiser.'):'A stumble is not the end.');
  put('endMessage',won?game.level.chapter.question:'Your objectives are safe. Return to your checkpoint with full hearts.');
  put('endStats',won?Math.floor(game.seconds/60)+'m '+Math.floor(game.seconds%60)+'s · '+game.defeated.size+' doubts overcome · '+count+' / 27 chapters complete':(game.checkpoint==='gate'?'Upper gate':'Trailhead')+' checkpoint · '+game.sparks.size+' / '+game.level.goals.length+' objectives kept');
  put('endAction',won?(final?'Explore the mountain again ↗':journey.mode==='campaign'?'Next chapter ↗':'Choose another chapter ↗'):'Return to checkpoint ↗');
  $('replayButton').hidden=!won;$('endReadButton').hidden=!won;openDialog($('endDialog'));
}
$('endDialog').addEventListener('cancel',e=>e.preventDefault());
$('endAction').addEventListener('click',()=>{
  if(game.status==='fallen'){closeDialogs();game=retry(game);save();paintHUD();canvas.focus({preventScroll:true});return;}
  const next=campaignNext(journey,game.level.index);closeDialogs();
  if(journey.mode==='campaign'&&next!==null)requestStart(next,'campaign',{resume:true});
  else{renderChapters();openDialog($('levelsDialog'));}
});
$('endReadButton').addEventListener('click',()=>{closeDialogs();showGuide(game.level.index);});
$('replayButton').addEventListener('click',()=>requestStart(game.level.index,journey.mode,{resume:false}));
$('startButton').addEventListener('click',()=>requestStart(0,'campaign',{pick:true,resume:true}));
$('resumeButton').addEventListener('click',()=>requestStart(journey.currentLevel,journey.mode,{resume:true}));
$('pauseButton').addEventListener('click',()=>openDialog($('pauseDialog')));
$('restartButton').addEventListener('click',()=>requestStart(game.level.index,journey.mode,{resume:false}));
$('changePlayerButton').addEventListener('click',()=>requestStart(game.level.index,journey.mode,{pick:true,resume:true}));
$('playChapter').addEventListener('click',()=>requestStart(0,'campaign',{resume:true}));
$('levelsButton').addEventListener('click',()=>{renderChapters();openDialog($('levelsDialog'));});
$('closeLevels').addEventListener('click',()=>$('levelsDialog').close());
$('guideButton').addEventListener('click',()=>showGuide(started?game.level.index:0));
$('closeGuide').addEventListener('click',()=>$('guideDialog').close());
$('closePlayer').addEventListener('click',()=>$('playerDialog').close());
$('enterLevel').addEventListener('click',()=>{unlockAudio();$('briefDialog').close();toast(game.level.instructions);});
$('briefMap').addEventListener('click',()=>{closeDialogs();renderChapters();openDialog($('levelsDialog'));});
$('briefDialog').addEventListener('cancel',e=>{e.preventDefault();$('briefMap').click();});
for(const hero of HEROES){
  const label=document.createElement('label');label.className='hero-card';
  const radio=document.createElement('input');radio.type='radio';radio.name='hero';radio.value=hero.id;radio.checked=hero.id===journey.heroId;
  const portrait=document.createElement('canvas');portrait.setAttribute('aria-hidden','true');
  const name=document.createElement('strong');name.className='foil-text';name.textContent=hero.name;
  radio.addEventListener('change',()=>audio.effect('select'));
  const role=document.createElement('span');role.className='hero-role';role.textContent=hero.role;
  const description=document.createElement('span');description.className='hero-description';description.textContent=hero.description;
  const trait=document.createElement('small');trait.textContent=hero.trait;
  label.append(radio,portrait,name,role,description,trait);$('heroChoices').append(label);drawHeroPortrait(portrait,hero.id);
}
$('confirmPlayer').addEventListener('click',()=>{
  const selected=$('heroChoices').querySelector('input:checked');if(!selected)return;
  journey.heroId=selected.value;journey.chosen=true;
  // Persist the choice before a new run exists; do not overwrite it with the old hero.
  storageAvailable=persistJourney(storage,journey);paintProgress();
  startLevel(pendingStart||{index:0,mode:'campaign',resume:true});pendingStart=null;
});

function showGuide(index,fromMap=false){
  guideIndex=index;const chapter=CHAPTERS[index];if(!chapter)return;
  returnToMap=false;if($('levelsDialog').open)$('levelsDialog').close();returnToMap=fromMap;
  put('guideKicker','FIELD GUIDE · STOP '+String(index+1).padStart(2,'0'));put('guideTitle',chapter.title);
  put('guideVoice','“'+chapter.voice+'”');put('guideFeels',chapter.feels);put('guideThrough',chapter.through);put('guideQuestion',chapter.question);
  $('readingLink').href='/?stop='+encodeURIComponent(index===0?'trailhead':chapter.id);
  setNarration(chapter);openDialog($('guideDialog'));
}
function setNarration(chapter){
  const track=manifest?.sections?.[chapter.id],audio=$('narration');audio.pause();
  const available=track&&/^[a-z0-9-]+\.mp3$/.test(track.file);
  audio.hidden=!available;$('audioUnavailable').hidden=!!available;
  if(available)audio.src='/audio/'+track.file;else{audio.removeAttribute('src');audio.load();}
}
fetch('/audio/manifest.json').then(r=>r.ok?r.json():null).then(m=>{manifest=m;if($('guideDialog').open)setNarration(CHAPTERS[guideIndex]);}).catch(()=>{});
function renderChapters(face='all'){
  paintProgress();$('mapFilter').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.face===face)));
  const list=$('chapterList');list.replaceChildren();
  for(const level of LEVELS){
    const chapter=level.chapter,index=level.index,record=journey.records[level.id];
    if(face!=='all'&&chapter.face!==face)continue;
    const card=document.createElement('article');card.className='chapter-card ready'+(record?.cleared?' completed':'');
    card.style.setProperty('--chapter-color',level.theme.accent);
    const number=document.createElement('span');number.className='chapter-number';number.textContent=record?.cleared?'✓':String(index+1).padStart(2,'0');
    const content=document.createElement('div'),title=document.createElement('h3'),note=document.createElement('p'),actions=document.createElement('div');actions.className='chapter-actions';
    title.className='foil-text';title.textContent=chapter.title;
    note.textContent=(record?.cleared?'Complete · ':record?'In progress · ':'')+level.theme.name+' · '+({collect:'Collect',rescue:'Rescue',sequence:'Rune puzzle',wardens:'Guardian trial',beacons:'Shrine quest'}[level.kind]);
    const play=document.createElement('button');play.textContent=record?.cleared?'Replay level ↗':record?'Continue level ↗':'Play level ↗';
    play.addEventListener('click',()=>requestStart(index,'single',{resume:!record?.cleared}));
    const read=document.createElement('button');read.textContent='Read / listen';read.addEventListener('click',()=>showGuide(index,true));
    actions.append(play,read);content.append(title,note,actions);
    if(record?.bestSeconds){const best=document.createElement('small');best.className='best-time';best.textContent='Best climb: '+Math.floor(record.bestSeconds/60)+'m '+Math.floor(record.bestSeconds%60)+'s';content.append(best);}
    card.append(number,content);list.append(card);
  }
}
$('mapFilter').addEventListener('click',e=>{const b=e.target.closest('button[data-face]');if(b)renderChapters(b.dataset.face);});
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
  audio.setState({hidden:document.hidden});
  if(document.hidden){saveIfStarted();$('narration').pause();if(started&&!paused()&&game.status==='playing')openDialog($('pauseDialog'));cancelAnimationFrame(frame);frame=0;}
  else if(!frame)frame=requestAnimationFrame(loop);
});
window.addEventListener('pagehide',()=>{saveIfStarted();audio.setState({hidden:true});});
window.addEventListener('pageshow',()=>audio.setState({hidden:document.hidden}));


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
    const events=game.events.splice(0);
    // Save the win before its completion screen reports the campaign count.
    if(events.some(e=>e.type==='save'))save();
    for(const event of events){if(event.text)toast(event.text);audio.effect(event.type,event.x!==undefined?event:game.player);painter.react(event,game,reduced.matches||!cinematic);if(event.type==='won'||event.type==='fallen')finishScreen(event.type==='won');}
    audio.footsteps(game);syncAudio();
    if(now-lastSave>2000){lastSave=now;save();}paintHUD();
  }
  if((!paused()&&(started||!reduced.matches))||now-lastPaint>500){painter.draw(game,now/1000,!started,reduced.matches||!cinematic);lastPaint=now;}
  if(toastUntil&&now>toastUntil){$('toast').classList.remove('visible');toastUntil=0;}
  frame=requestAnimationFrame(loop);
}
new ResizeObserver(()=>painter.resize()).observe(canvas);painter.resize();frame=requestAnimationFrame(loop);
paintProgress();renderChapters();paintAudio();syncAudio();
if(loaded.status==='recovered')toast('The previous save could not be read. A recovery copy was kept in this browser.');
const selected=new URLSearchParams(location.search).get('chapter');
if(selected){
  const index=CHAPTERS.findIndex(c=>c.id===selected);
  if(index>=0)requestStart(index,'single',{resume:true});
  else if(selected==='map')openDialog($('levelsDialog'));
}
