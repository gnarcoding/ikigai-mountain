/* Pure simulation shared by every chapter; no DOM, storage or rendering. */
import { levelAt, heroById } from './levels.mjs';
import { RELICS, POWERS, initEncounter, encounterSnapshot, encounterStrike, updateEncounter } from './encounters.mjs';
export const WORLD={width:960,height:1440};
export const SPARKS=levelAt(0).goals,STAIRS=levelAt(0).stairs,ROCKS=levelAt(0).rocks,PATH=levelAt(0).paths;
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const finite=(v,d=0)=>typeof v==='number'&&Number.isFinite(v)?v:d;
const legacyEnemies={'moss-1':'guard-0','moss-2':'roamer-0','wisp-1':'guard-1','moss-3':'roamer-1','wisp-2':'roamer-2','thorn-1':'guard-2'};
export function readProgress(raw,index=0){
  const level=levelAt(index);
  if(!raw||!([1,2,3].includes(raw.version))||(raw.version===1&&index!==0)||(raw.version>=2&&raw.levelId!==level.id))return null;
  let sparks=level.goals.filter(s=>Array.isArray(raw.sparks)&&raw.sparks.includes(s.id)).map(s=>s.id);
  if(raw.version<3&&level.kind==='race'){const n=Array.isArray(raw.sparks)?raw.sparks.filter(id=>/^goal-[0-2]$/.test(id)).length:0;sparks=level.goals.slice(0,raw.complete?level.goals.length:n).map(s=>s.id);}
  if(['echo','arena','race','escort','sanctuary'].includes(level.kind)){const firstMissing=level.goals.findIndex(s=>!sparks.includes(s.id));if(firstMissing>=0)sparks=sparks.slice(0,firstMissing);}
  const defeatedInput=Array.isArray(raw.defeated)?raw.defeated.map(id=>raw.version===1?(legacyEnemies[id]||id):id):[];
  const defeated=level.enemies.filter(e=>defeatedInput.includes(e[0])).map(e=>e[0]);
  const all=sparks.length===level.goals.length;
  let position=null;
  if(raw.version===3&&raw.position&&Number.isFinite(raw.position.x)&&Number.isFinite(raw.position.y)&&raw.position.hp>0){
    position={x:clamp(raw.position.x,44,level.width-44),y:clamp(raw.position.y,60,level.height-44),
      hp:clamp(Math.floor(finite(raw.position.hp,5)),1,6),face:finite(raw.position.face,-Math.PI/2)};
  }
  return {version:3,levelId:level.id,heroId:heroById(raw.heroId).id,relic:RELICS.some(r=>r.id===raw.relic)?raw.relic:'comet',challenge:raw.version===3?raw.challenge:null,power:clamp(finite(raw.power,100),0,100),sparks,defeated,checkpoint:raw.checkpoint==='gate'&&all?'gate':'camp',
    complete:raw.complete===true&&all&&defeated.includes('keeper'),seconds:clamp(finite(raw.seconds),0,86400),deaths:clamp(Math.floor(finite(raw.deaths)),0,999),position,
    enemies:raw.version===3&&Array.isArray(raw.enemies)?raw.enemies.filter(e=>e&&level.enemies.some(s=>s[0]===e.id)).map(e=>({id:e.id,hp:clamp(finite(e.hp,99),1,30),x:finite(e.x,-1),y:finite(e.y,-1)})):[]};
}
export function createGame(saved=null,index=0,heroId=null){
  const level=levelAt(index),progress=readProgress(saved,index),hero=heroById(heroId||progress?.heroId);
  const g={level,hero,time:0,seconds:progress?.seconds||0,status:'playing',sparks:new Set(progress?.sparks||[]),defeated:new Set(progress?.defeated||[]),
    relic:progress?.relic||'comet',power:progress?.power??100,strikeHeld:false,attackChain:0,chainTime:0,checkpoint:progress?.checkpoint||'camp',deaths:progress?.deaths||0,completed:!!progress?.complete,
    player:{...level.spawn,r:12,hp:hero.hp,face:-Math.PI/2,invulnerable:1,attackTime:0,attackCooldown:0,dashTime:0,dashCooldown:0,walk:0},
    enemies:level.enemies.map(([id,type,x,y,wave])=>{const hp=type==='boss'?level.bossHp:type==='beetle'?4:type==='thorn'||type==='sentinel'?3:2;return{id,type,x,y,wave,dormant:false,stun:0,look:Math.PI/2,homeX:x,homeY:y,r:type==='boss'?26:15,hp,maxHp:hp,cooldown:1.2,flash:0,phase:'idle',timer:0,vx:0,vy:0,cycle:0,pattern:level.pattern};}),
    projectiles:[],hearts:[],particles:[],events:[],zone:'camp',gateHint:0,goalHint:0};
  for(const e of g.enemies){
    if(g.defeated.has(e.id)){e.hp=0;continue;}
    const s=progress?.enemies.find(s=>s.id===e.id);
    if(s){e.hp=Math.min(e.maxHp,s.hp);if(!blocked(g,s.x,s.y,e.r)){e.x=s.x;e.y=s.y;}}
  }
  if(g.checkpoint==='gate')Object.assign(g.player,level.checkpoint);
  if(progress?.position&&!blocked(g,progress.position.x,progress.position.y,g.player.r)){
    Object.assign(g.player,progress.position,{hp:Math.min(hero.hp,progress.position.hp)});
  }
  initEncounter(g,progress?.position?progress.challenge:progress?.challenge?{...progress.challenge,escort:null,history:[]}:null);
  g.zone=zoneAt(g,g.player.y);
  return g;
}
export function saveProgress(g){
  return {version:3,levelId:g.level.id,relic:g.relic,power:g.power,challenge:encounterSnapshot(g),heroId:g.hero.id,sparks:[...g.sparks],defeated:[...g.defeated],checkpoint:g.checkpoint,
    complete:g.completed,seconds:g.seconds,deaths:g.deaths,
    position:g.status==='fallen'?null:{x:g.player.x,y:g.player.y,hp:g.player.hp,face:g.player.face},
    enemies:g.status==='fallen'?[]:g.enemies.filter(e=>e.hp>0).map(e=>({id:e.id,hp:e.hp,x:e.x,y:e.y}))};
}
export function emit(g,type,text='',data={}){g.events.push({type,text,...data});}
function circleRect(x,y,r,b){return Math.hypot(x-clamp(x,b.x,b.x+b.w),y-clamp(y,b.y,b.y+b.h))<r;}
export function blocked(g,x,y,r=12){
  const l=g.level;
  if(!Number.isFinite(x)||!Number.isFinite(y)||x-r<32||x+r>l.width-32||y-r<48||y+r>l.height-32)return true;
  for(const s of l.stairs)if(y+r>s.y&&y-r<s.y+s.h&&(x-r<s.x||x+r>s.x+s.w))return true;
  const gate=l.stairs[2];
  if(g.sparks.size<l.goals.length&&circleRect(x,y,r,{...gate,h:32}))return true;
  return l.rocks.some(b=>circleRect(x,y,r,b));
}
export function move(g,e,dx,dy){
  const count=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/5));
  for(let i=0;i<count;i++){
    if(!blocked(g,e.x+dx/count,e.y,e.r))e.x+=dx/count;
    if(!blocked(g,e.x,e.y+dy/count,e.r))e.y+=dy/count;
  }
  if(e.type==='boss'){e.x=clamp(e.x,80,880);e.y=clamp(e.y,82,320);}
}
function burst(g,x,y,color,count=10){
  for(let i=0;i<count;i++){const a=i/count*Math.PI*2;g.particles.push({x,y,vx:Math.cos(a)*(30+i*3),vy:Math.sin(a)*(30+i*3),life:.5,max:.5,color});}
}
export function claim(g,s){
  if(g.sparks.has(s.id))return;
  g.sparks.add(s.id);g.challenge.score+=100;g.power=Math.min(100,g.power+20);g.player.hp=Math.min(g.hero.hp,g.player.hp+1);burst(g,s.x,s.y,g.level.theme.accent,20);
  emit(g,'spark',s.name+' · '+g.sparks.size+' of '+g.level.goals.length,{x:s.x,y:s.y});emit(g,'save');
  if(g.sparks.size===g.level.goals.length){g.checkpoint='gate';g.player.hp=g.hero.hp;g.challenge.storm=[];if(!g.level.hasBoss)g.projectiles=[];emit(g,'gate','The upper gate is open. Your checkpoint is saved.');emit(g,'save');}
}
export function hitEnemy(g,e,damage=1){
  if(e.hp<=0||e.dormant)return;
  e.hp-=damage;e.flash=.15;g.power=Math.min(100,g.power+7);
  const c=g.challenge;c.combo=c.comboTime>0?c.combo+1:1;c.comboTime=2.6;c.bestCombo=Math.max(c.bestCombo,c.combo);c.score+=10*Math.min(c.combo,10);
  burst(g,e.x,e.y,'#f7d98c',7);emit(g,'hit','',{x:e.x,y:e.y,damage});
  if(e.hp<=0){
    e.hp=0;g.defeated.add(e.id);burst(g,e.x,e.y,g.level.theme.accent,20);c.score+=50;
    if(e.type==='boss'){g.projectiles=[];emit(g,'guardian',g.level.bossName+' is quiet. Light the beacon.',{x:e.x,y:e.y});}
    else{g.hearts.push({x:e.x,y:e.y});emit(g,'defeat');}
    emit(g,'save');
  }
}
export function strike(g,interact=true){
  const p=g.player;
  if(g.status!=='playing'||p.attackCooldown>0)return false;
  g.attackChain=g.chainTime>0?(g.attackChain+1)%3:0;g.chainTime=1.1;
  const finisher=g.attackChain===2;p.attackCooldown=finisher?.43:.27;p.attackTime=.22;
  const near=g.enemies.filter(e=>e.hp>0&&!e.dormant&&distance(e,p)<g.hero.reach+25).sort((a,b)=>distance(a,p)-distance(b,p))[0];
  if(near)p.face=Math.atan2(near.y-p.y,near.x-p.x);
  emit(g,finisher?'finisher':'strike');
  if(interact||g.level.kind==='storm')encounterStrike(g,{claim,emit});
  for(const bolt of g.projectiles){
    if(bolt.friendly||bolt.life<=0||distance(bolt,p)>g.hero.reach+30)continue;
    const goal=bolt.mirror?g.level.goals.find(x=>x.id===bolt.mirror):null;
    const target=goal||g.enemies.filter(e=>e.hp>0&&!e.dormant).sort((a,b)=>distance(a,bolt)-distance(b,bolt))[0];
    if(target){const a=Math.atan2(target.y-bolt.y,target.x-bolt.x);bolt.vx=Math.cos(a)*300;bolt.vy=Math.sin(a)*300;bolt.friendly=true;bolt.life=5;g.power=Math.min(100,g.power+12);emit(g,'parry','Reflected!',{x:bolt.x,y:bolt.y});}
  }
  for(const e of g.enemies){
    if(e.hp<=0||e.dormant||distance(e,p)>g.hero.reach+e.r+(finisher?25:0))continue;
    const a=Math.atan2(e.y-p.y,e.x-p.x);
    if((!finisher&&Math.cos(a-p.face)<.1)||blocked(g,(e.x+p.x)/2,(e.y+p.y)/2,2))continue;
    hitEnemy(g,e,finisher?(g.relic==='comet'?3:2):1);
    if(e.type!=='boss')move(g,e,Math.cos(a)*(e.type==='beetle'?10:24),Math.sin(a)*(e.type==='beetle'?10:24));
  }
  return true;
}
export function special(g){
 if(g.status!=='playing'||g.power<100)return false;
 g.power=0;const p=g.player,id=g.hero.id;
 p.invulnerable=Math.max(p.invulnerable,g.relic==='moss'?2.3:id==='flint'?2:1);
 if(g.relic==='moss')p.hp=Math.min(g.hero.hp,p.hp+1);
 if(id==='reed'){p.dashCooldown=0;p.haste=3;}
 const reach=id==='wren'?330:id==='flint'?165:id==='reed'?160:195;
 let targets=g.enemies.filter(e=>e.hp>0&&!e.dormant&&distance(e,p)<reach&&!blocked(g,(e.x+p.x)/2,(e.y+p.y)/2,2));
 if(id==='wren')targets=targets.sort((a,b)=>distance(a,p)-distance(b,p)).slice(0,4);
 for(const e of targets){e.stun=id==='flint'?2.2:id==='reed'?1.6:.45;hitEnemy(g,e,id==='reed'?2:id==='wren'?3:4);emit(g,'powerhit','',{x:e.x,y:e.y});}
 g.projectiles=g.projectiles.filter(b=>b.friendly||distance(b,p)>reach);
 emit(g,'power',POWERS[id].name+'!',{x:p.x,y:p.y,radius:reach});emit(g,'save');return true;
}
export function dash(g){
  const p=g.player;if(g.status!=='playing'||p.dashCooldown>0)return false;
  p.dashTime=.2;p.dashCooldown=g.hero.dashCooldown*(g.relic==='zephyr'?.65:1);p.invulnerable=Math.max(p.invulnerable,.3);emit(g,'dash');return true;
}
export function hurt(g,source){
  const p=g.player;if(p.invulnerable>0||g.status!=='playing')return;
  p.hp--;p.invulnerable=1.25;g.challenge.hits++;g.challenge.combo=0;g.challenge.comboTime=0;if(g.level.kind==='sanctuary')g.challenge.charge=Math.max(0,g.challenge.charge-2);
  const a=Math.atan2(p.y-source.y,p.x-source.x);move(g,p,Math.cos(a)*20,Math.sin(a)*20);
  burst(g,p.x,p.y,'#ef9477',8);emit(g,'hurt');
  if(p.hp<=0){g.status='fallen';g.deaths++;emit(g,'fallen');emit(g,'save');}
}
export function retry(g){const p=saveProgress(g);p.position=null;p.enemies=[];if(p.challenge){p.challenge.escort=null;p.challenge.history=[];p.challenge.charge=0;}p.power=100;return createGame(p,g.level.index,g.hero.id);}
export function zoneAt(g,y){const s=g.level.stairs;if(['arena','echo','sanctuary','mirror'].includes(g.level.kind))return y>352?'court':'guardian';return y>s[0].y?'camp':y>s[1].y?'grove':y>s[2].y?'heights':'guardian';}
export function hazardPhase(g,h){return (g.time+h.offset)%4.8;}
function shoot(g,e,angles,speed=110){
  for(const a of angles)g.projectiles.push({x:e.x,y:e.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,life:4});
}
function updateBoss(g,e,dt){
  const p=g.player,d=distance(e,p),a=Math.atan2(p.y-e.y,p.x-e.x);
  if(p.y>345||g.sparks.size<g.level.goals.length){e.phase='idle';e.timer=0;e.cooldown=Math.max(.5,e.cooldown);return;}
  if(e.phase==='warning'){
    e.timer-=dt;
    if(e.timer<=0){
      if(e.attack==='charge'){e.phase='charge';e.timer=.48;}
      else{
        if(e.attack==='volley')shoot(g,e,[-.48,-.24,0,.24,.48].map(v=>a+v),125);
        if(e.attack==='ring')shoot(g,e,Array.from({length:10},(_,i)=>i*Math.PI/5+e.cycle*.2),92);
        if(e.attack==='stomp'){burst(g,e.targetX,e.targetY,'#dfbb83',24);if(distance(p,{x:e.targetX,y:e.targetY})<62)hurt(g,{x:e.targetX,y:e.targetY});}
        e.phase='rest';e.timer=1.2;
      }
    }
  }else if(e.phase==='charge'){
    move(g,e,e.vx*dt,e.vy*dt);e.timer-=dt;if(e.timer<=0){e.phase='rest';e.timer=1.1;}
  }else if(e.phase==='rest'){
    e.timer-=dt;if(e.timer<=0){e.phase='idle';e.cooldown=.35;}
  }else if(d<360&&e.cooldown<=0){
    const rage=e.hp<=e.maxHp/2;e.enraged=rage;
    const patterns=g.level.bossStyle==='tempest'?['volley','ring']:g.level.bossStyle==='quake'?['stomp','ring']:['charge','volley'];
    e.attack=e.pattern==='cycle'?['charge','volley','stomp','ring'][e.cycle%4]:rage?patterns[e.cycle%patterns.length]:e.pattern;
    e.cycle++;e.phase='warning';e.timer=e.attack==='stomp'?1:e.enraged?.65:.85;
    e.vx=Math.cos(a)*300;e.vy=Math.sin(a)*300;e.targetX=p.x;e.targetY=p.y;emit(g,'warning','',{x:e.x,y:e.y});
  }else if(d>75)move(g,e,Math.cos(a)*dt*30,Math.sin(a)*dt*30);
}
export function step(g,input,dt){
  if(g.status!=='playing')return;
  dt=clamp(finite(dt),0,.05);g.time+=dt;g.seconds+=dt;
  const p=g.player;
  for(const key of ['invulnerable','attackTime','attackCooldown','dashTime','dashCooldown'])p[key]=Math.max(0,p[key]-dt);
  let x=finite(input.x),y=finite(input.y),len=Math.hypot(x,y);
  if(len>1){x/=len;y/=len;len=1;}
  if(len>.1&&p.dashTime<=0)p.face=Math.atan2(y,x);
  g.chainTime=Math.max(0,g.chainTime-dt);g.power=Math.min(100,g.power+dt*100/POWERS[g.hero.id].cooldown);p.haste=Math.max(0,(p.haste||0)-dt);
  if(input.special)special(g);
  if(input.strike)strike(g,!g.strikeHeld);g.strikeHeld=!!input.strike;
  if(input.dash){if(len>.1&&p.dashCooldown<=0)p.face=Math.atan2(y,x);dash(g);}
  const slow=g.level.hazards.some(h=>h.kind==='bramble'&&circleRect(p.x,p.y,2,h));
  const speed=p.dashTime>0?430:g.hero.speed*(slow?.6:1)*(g.relic==='zephyr'?1.1:1)*(p.haste>0?1.5:1);
  if(p.dashTime>0){x=Math.cos(p.face);y=Math.sin(p.face);len=1;}
  move(g,p,x*speed*dt,y*speed*dt);p.walk+=len*dt*12;
  updateEncounter(g,dt,{move,hurt,claim,emit});
  const gate=g.level.stairs[2],cx=gate.x+64;
  if(g.sparks.size<g.level.goals.length&&p.y<475&&p.y>350&&Math.abs(p.x-cx)<90&&g.time>g.gateHint){g.gateHint=g.time+6;emit(g,'message',g.level.instructions);}
  const zone=zoneAt(g,p.y);if(zone!==g.zone){g.zone=zone;emit(g,'zone');}
  for(const e of g.enemies){
    if(e.hp<=0||e.dormant)continue;e.flash=Math.max(0,e.flash-dt);e.cooldown-=dt;
    e.stun=Math.max(0,e.stun-dt);if(e.stun>0)continue;
    const d=distance(e,p),a=Math.atan2(p.y-e.y,p.x-e.x),same=zoneAt(g,e.y)===zoneAt(g,p.y);
    if(e.type==='boss')updateBoss(g,e,dt);
    else if(g.level.kind==='heist'&&e.type==='sentinel'){
      e.look=g.time*.7+e.homeX;e.x=e.homeX+Math.sin(g.time*.55+e.homeX)*24;
      const seen=same&&d<215&&Math.cos(a-e.look)>.72;if(seen)g.challenge.alarm=3;
      if(same&&d<300&&g.challenge.alarm>0&&e.cooldown<=0){shoot(g,e,[a-.12,a,a+.12],140);e.cooldown=1.7;}
    }else if(e.type==='thorn'){
      if(e.phase==='warning'){e.timer-=dt;if(e.timer<=0){e.phase='charge';e.timer=.3;}}
      else if(e.phase==='charge'){move(g,e,e.vx*dt,e.vy*dt);e.timer-=dt;if(e.timer<=0){e.phase='rest';e.timer=.7;}}
      else if(e.phase==='rest'){e.timer-=dt;if(e.timer<=0){e.phase='idle';e.cooldown=.5;}}
      else if(same&&d<260&&e.cooldown<=0){e.phase='warning';e.timer=.65;e.vx=Math.cos(a)*230;e.vy=Math.sin(a)*230;}
      else if(same&&d<260&&d>60)move(g,e,Math.cos(a)*dt*25,Math.sin(a)*dt*25);
    }else if(e.type==='wisp'||e.type==='sentinel'){
      if(same&&d<245){
        if(e.type==='wisp'&&d>135)move(g,e,Math.cos(a)*dt*32,Math.sin(a)*dt*32);
        if(e.cooldown<=0){e.cooldown=e.type==='sentinel'?3:2.5;shoot(g,e,e.type==='sentinel'?[a-.22,a,a+.22]:[a],105);}
      }
    }else if(same&&d<240&&d>p.r+e.r){
      const speed=e.type==='bat'?80:e.type==='beetle'?30:43;
      move(g,e,Math.cos(a)*dt*speed,Math.sin(a)*dt*speed);
    }
    if(distance(p,e)<p.r+e.r+2)hurt(g,e);
  }
  for(const h of g.level.hazards)if(h.kind==='pulse'&&hazardPhase(g,h)>3.4&&circleRect(p.x,p.y,p.r,h))hurt(g,{x:h.x+h.w/2,y:h.y+h.h/2});
  for(const b of g.projectiles){
    b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;
    if(blocked(g,b.x,b.y,4))b.life=0;
    if(b.life>0&&b.friendly){
      if(b.mirror){const goal=g.level.goals.find(s=>s.id===b.mirror);if(goal&&distance(goal,b)<32){b.life=0;if(!g.sparks.has(goal.id)){g.challenge.reflections[goal.id]++;emit(g,'parry','Mirror '+g.challenge.reflections[goal.id]+' / 3');if(g.challenge.reflections[goal.id]>=3)claim(g,goal);}}}
      else{const e=g.enemies.find(e=>e.hp>0&&!e.dormant&&distance(e,b)<e.r+8);if(e){hitEnemy(g,e,3);b.life=0;}}
    }else if(b.life>0&&distance(p,b)<p.r+6){hurt(g,b);b.life=0;}
  }
  g.projectiles=g.projectiles.filter(b=>b.life>0);
  g.hearts=g.hearts.filter(h=>{if(p.hp<g.hero.hp&&distance(p,h)<25){p.hp++;emit(g,'heal');return false;}return true;});
  for(const b of g.particles){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;}g.particles=g.particles.filter(b=>b.life>0);
  if(g.status==='playing'&&g.sparks.size===g.level.goals.length&&g.defeated.has('keeper')&&distance(p,g.level.beacon)<42&&(g.level.kind!=='escort'||distance(g.challenge.escort,p)<85)){g.status='won';g.completed=true;burst(g,g.level.beacon.x,g.level.beacon.y,g.level.theme.accent,40);emit(g,'won');emit(g,'save');}
}
