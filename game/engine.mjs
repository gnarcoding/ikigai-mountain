/* Pure simulation. Rendering, storage and input are deliberately separate. */
export const WORLD = { width: 960, height: 1440 };
export const SPARKS = [
  { id: 'curiosity', x: 760, y: 1220, name: 'Curiosity', words: 'Follow the thing that makes you curious.' },
  { id: 'practice', x: 160, y: 870, name: 'Play', words: 'Make something just because you love it.' },
  { id: 'courage', x: 800, y: 540, name: 'Courage', words: 'You can begin before you feel ready.' }
];
export const STAIRS = [{ x:192,y:1056,w:128,h:64 },{ x:640,y:704,w:128,h:64 },{ x:416,y:352,w:128,h:64 }];
export const ROCKS = [
  {x:330,y:1260,w:76,h:56,kind:'tent'}, {x:620,y:1288,w:60,h:38,kind:'rock'},
  {x:64,y:1140,w:110,h:50,kind:'rock'}, {x:365,y:826,w:180,h:95,kind:'pond'},
  {x:720,y:900,w:68,h:50,kind:'rock'}, {x:248,y:524,w:150,h:90,kind:'pond'},
  {x:550,y:500,w:62,h:44,kind:'rock'}, {x:128,y:170,w:60,h:40,kind:'rock'},
  {x:742,y:210,w:70,h:45,kind:'rock'}
];
export const PATH = [
  [[480,1408],[480,1328],[760,1220]],
  [[480,1328],[256,1340],[256,1020],[160,870]],
  [[160,870],[260,960],[650,960],[704,810],[704,670],[800,540]],
  [[800,540],[680,610],[480,550],[480,300],[480,112]]
];
const enemySeeds = [
  ['moss-1','slime',635,1190],['moss-2','slime',330,1170],
  ['wisp-1','wisp',215,815],['moss-3','slime',610,925],
  ['wisp-2','wisp',760,830],['thorn-1','thorn',760,580],['thorn-2','thorn',450,485],
  ['keeper','boss',480,200]
];
export const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
export const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
const finite = (v,d=0) => typeof v === 'number' && Number.isFinite(v) ? v : d;
export function readProgress(raw) {
  if (!raw || raw.version !== 1) return null;
  const sparks = SPARKS.filter(s => Array.isArray(raw.sparks) && raw.sparks.includes(s.id)).map(s=>s.id);
  const defeated = enemySeeds.filter(s => Array.isArray(raw.defeated) && raw.defeated.includes(s[0])).map(s=>s[0]);
  return {version:1,sparks,defeated,checkpoint:raw.checkpoint === 'gate' && sparks.length === 3 ? 'gate':'camp',
    complete:raw.complete === true && sparks.length === 3 && defeated.includes('keeper'),
    seconds:clamp(finite(raw.seconds),0,86400),deaths:clamp(Math.floor(finite(raw.deaths)),0,999)};
}
export function createGame(saved=null) {
  const progress=readProgress(saved);
  const g = { time:0,seconds:progress?.seconds||0,status:'playing',sparks:new Set(progress?.sparks||[]),
    defeated:new Set(progress?.defeated||[]),checkpoint:progress?.checkpoint||'camp',deaths:progress?.deaths||0,
    player:{x:480,y:1340,r:12,hp:5,face:-Math.PI/2,invulnerable:0,attackTime:0,attackCooldown:0,dashTime:0,dashCooldown:0,walk:0},
    enemies:enemySeeds.map(([id,type,x,y])=>({id,type,x,y,homeX:x,homeY:y,r:type==='boss'?26:15,hp:type==='boss'?12:type==='thorn'?3:2,maxHp:type==='boss'?12:type==='thorn'?3:2,cooldown:1.2,flash:0,phase:'idle',timer:0,vx:0,vy:0})),
    projectiles:[],hearts:[],particles:[],events:[],zone:'camp',gateHint:0,completed:!!progress?.complete };
  for (const e of g.enemies) if(g.defeated.has(e.id))e.hp=0;
  if(g.checkpoint==='gate'){g.player.x=480;g.player.y=455;}
  return g;
}
export function saveProgress(g) {
  return {version:1,sparks:[...g.sparks],defeated:[...g.defeated],checkpoint:g.checkpoint,
    complete:g.completed,seconds:Math.floor(g.seconds),deaths:g.deaths};
}
export function emit(g,type,text=''){g.events.push({type,text});}
function circleRect(x,y,r,b){return Math.hypot(x-clamp(x,b.x,b.x+b.w),y-clamp(y,b.y,b.y+b.h))<r;}
export function blocked(g,x,y,r=12) {
  if(x-r<32||x+r>WORLD.width-32||y-r<48||y+r>WORLD.height-32)return true;
  for(const s of STAIRS){
    if(y+r>s.y && y-r<s.y+s.h && (x-r<s.x||x+r>s.x+s.w))return true;
  }
  if(g.sparks.size<3 && circleRect(x,y,r,{x:416,y:352,w:128,h:32}))return true;
  return ROCKS.some(b=>circleRect(x,y,r,b));
}
export function move(g,entity,dx,dy) {
  // Substeps prevent a dash, a knockback or a slow frame crossing a cliff.
  const steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/5));
  for(let i=0;i<steps;i++){
    if(!blocked(g,entity.x+dx/steps,entity.y,entity.r))entity.x+=dx/steps;
    if(!blocked(g,entity.x,entity.y+dy/steps,entity.r))entity.y+=dy/steps;
  }
  if(entity.type==='boss'){entity.x=clamp(entity.x,80,880);entity.y=clamp(entity.y,82,320);}
}
function burst(g,x,y,color,count=10) {
  for(let i=0;i<count;i++){const a=i/count*Math.PI*2;g.particles.push({x,y,vx:Math.cos(a)*(30+i*3),vy:Math.sin(a)*(30+i*3),life:.5,max:.5,color});}
}
export function strike(g) {
  const p=g.player;
  if(g.status!=='playing'||p.attackCooldown>0)return false;
  p.attackCooldown=.33;p.attackTime=.22;
  // Nearby targets get gentle auto-aim for thumb controls.
  const near=g.enemies.filter(e=>e.hp>0&&distance(e,p)<88).sort((a,b)=>distance(a,p)-distance(b,p))[0];
  if(near)p.face=Math.atan2(near.y-p.y,near.x-p.x);
  emit(g,'strike');
  for(const e of g.enemies){
    if(e.hp<=0||distance(e,p)>68+e.r)continue;
    const angle=Math.atan2(e.y-p.y,e.x-p.x);
    if(Math.cos(angle-p.face)<.1)continue;
    // No attacking through the locked terrace or a wall.
    if(blocked(g,(e.x+p.x)/2,(e.y+p.y)/2,2))continue;
    e.hp--;e.flash=.15;
    if(e.type!=='boss')move(g,e,Math.cos(angle)*24,Math.sin(angle)*24);
    burst(g,e.x,e.y,'#f7d98c',7);emit(g,'hit');
    if(e.hp<=0){
      g.defeated.add(e.id);burst(g,e.x,e.y,e.type==='boss'?'#f6c86e':'#b4d8a2',20);
      if(e.type==='boss'){emit(g,'guardian','The doubt is quieter. Light the beacon.');}
      else{g.hearts.push({x:e.x,y:e.y});emit(g,'defeat');}
      emit(g,'save');
    }
  }
  return true;
}
export function dash(g) {
  const p=g.player;
  if(g.status!=='playing'||p.dashCooldown>0)return false;
  p.dashTime=.2;p.dashCooldown=1.1;p.invulnerable=Math.max(p.invulnerable,.28);emit(g,'dash');return true;
}
function hurt(g,source) {
  const p=g.player;
  if(p.invulnerable>0||g.status!=='playing')return;
  p.hp--;p.invulnerable=1.25;
  const a=Math.atan2(p.y-source.y,p.x-source.x);move(g,p,Math.cos(a)*22,Math.sin(a)*22);
  burst(g,p.x,p.y,'#ef9477',9);emit(g,'hurt');
  if(p.hp<=0){g.status='fallen';g.deaths++;emit(g,'fallen');emit(g,'save');}
}
export function retry(g) {
  const next=createGame(saveProgress(g));
  // A failed boss fight starts afresh; collected sparks and defeated small foes persist.
  return next;
}
export function step(g,input,dt) {
  if(g.status!=='playing')return;
  dt=clamp(finite(dt),0,.05);g.time+=dt;g.seconds+=dt;
  const p=g.player;
  for(const key of ['invulnerable','attackTime','attackCooldown','dashTime','dashCooldown'])p[key]=Math.max(0,p[key]-dt);
  let x=finite(input.x),y=finite(input.y),len=Math.hypot(x,y);
  if(len>1){x/=len;y/=len;len=1;}
  if(len>.1 && p.dashTime<=0)p.face=Math.atan2(y,x);
  if(input.strike)strike(g);
  if(input.dash)dash(g);
  const speed=p.dashTime>0?430:155;
  if(p.dashTime>0){x=Math.cos(p.face);y=Math.sin(p.face);len=1;}
  move(g,p,x*speed*dt,y*speed*dt);p.walk+=len*dt*12;
  for(const s of SPARKS){
    if(!g.sparks.has(s.id)&&distance(p,s)<30){
      g.sparks.add(s.id);p.hp=Math.min(5,p.hp+1);burst(g,s.x,s.y,'#ffe6a2',24);
      emit(g,'spark',s.name+' · '+s.words);emit(g,'save');
      if(g.sparks.size===3){g.checkpoint='gate';p.hp=5;emit(g,'gate','Three sparks. The upper gate is open.');emit(g,'save');}
    }
  }
  if(g.sparks.size<3&&p.y<475&&p.y>350&&Math.abs(p.x-480)<90&&g.time>g.gateHint){
    g.gateHint=g.time+6;emit(g,'message','The gate needs all three sparks. Follow the gold trail.');
  }
  const zone=p.y>1056?'camp':p.y>704?'grove':p.y>352?'heights':'guardian';
  if(zone!==g.zone){g.zone=zone;emit(g,'zone');}
  for(const e of g.enemies){
    if(e.hp<=0)continue;
    e.flash=Math.max(0,e.flash-dt);e.cooldown-=dt;
    const d=distance(e,p),a=Math.atan2(p.y-e.y,p.x-e.x);
    const sameTerrace=(e.y>1056?0:e.y>704?1:e.y>352?2:3)===(p.y>1056?0:p.y>704?1:p.y>352?2:3);
    if(e.type==='boss'||e.type==='thorn'){
      if(e.type==='boss'&&(p.y>345||g.sparks.size<3)){
        e.phase='idle';e.timer=0;e.cooldown=Math.max(.5,e.cooldown);continue;
      }
      if(e.phase==='warning'){
        e.timer-=dt;
        if(e.timer<=0){e.phase='charge';e.timer=e.type==='boss'?.48:.3;}
      }else if(e.phase==='charge'){
        move(g,e,e.vx*dt,e.vy*dt);e.timer-=dt;
        if(e.timer<=0){e.phase='rest';e.timer=e.type==='boss'?1.1:.7;}
      }else if(e.phase==='rest'){
        e.timer-=dt;if(e.timer<=0){e.phase='idle';e.cooldown=.5;}
      }else if(sameTerrace&&d<310&&e.cooldown<=0){
        e.phase='warning';e.timer=e.type==='boss'?.85:.65;
        const speed=e.type==='boss'?300:230;e.vx=Math.cos(a)*speed;e.vy=Math.sin(a)*speed;
      }else if(sameTerrace&&d<300&&d>60){move(g,e,Math.cos(a)*dt*25,Math.sin(a)*dt*25);}
    }else if(e.type==='wisp'){
      if(sameTerrace&&d<235){
        if(d>135)move(g,e,Math.cos(a)*dt*32,Math.sin(a)*dt*32);
        if(e.cooldown<=0){e.cooldown=2.5;g.projectiles.push({x:e.x,y:e.y,vx:Math.cos(a)*105,vy:Math.sin(a)*105,life:3.5});emit(g,'wisp');}
      }
    }else if(sameTerrace&&d<205&&d>p.r+e.r){move(g,e,Math.cos(a)*dt*43,Math.sin(a)*dt*43);}
    if(distance(p,e)<p.r+e.r+2)hurt(g,e);
  }
  for(const b of g.projectiles){
    b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;
    if(blocked(g,b.x,b.y,4))b.life=0;
    if(distance(p,b)<p.r+6){hurt(g,b);b.life=0;}
  }
  g.projectiles=g.projectiles.filter(b=>b.life>0);
  g.hearts=g.hearts.filter(h=>{
    if(p.hp<5&&distance(p,h)<25){p.hp++;emit(g,'heal');return false;}return true;
  });
  for(const b of g.particles){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;}
  g.particles=g.particles.filter(b=>b.life>0);
  if(g.defeated.has('keeper')&&distance(p,{x:480,y:112})<42){
    g.status='won';g.completed=true;burst(g,480,112,'#ffeeb4',50);emit(g,'won');emit(g,'save');
  }
}
