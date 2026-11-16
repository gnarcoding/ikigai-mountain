import {createGame,step,distance} from '../game/engine.mjs';
import {runeVerse} from '../game/encounters.mjs';
const tick=(g,input={})=>{step(g,input,1/60);g.events=[];if(g.status==='fallen')throw Error(`fell at ${g.player.x.toFixed()},${g.player.y.toFixed()}, goals ${g.sparks.size}`);};
function walk(g,x,y,{attack=true,escort=false}={}){
 for(let i=0;i<4000;i++){
  const dx=x-g.player.x,dy=y-g.player.y,d=Math.hypot(dx,dy);if(d<5||g.status==='won')return;
  const waiting=escort&&distance(g.player,g.challenge.escort)>85;
  tick(g,{x:waiting?0:dx/d,y:waiting?0:dy/d,strike:attack,special:g.player.hp<g.hero.hp-1});
 }throw Error('stuck going '+[x,y]+' from '+[g.player.x,g.player.y]+' spirit '+JSON.stringify(g.challenge.escort));
}
function fight(g,until,max=7200){
 for(let i=0;i<max&&!until();i++){
  const enemy=g.enemies.filter(e=>e.hp>0&&!e.dormant).sort((a,b)=>distance(a,g.player)-distance(b,g.player))[0];
  const target=enemy||g.level.goals.find(s=>!g.sparks.has(s.id))||g.level.beacon;
  const dx=target.x-g.player.x,dy=target.y-g.player.y,d=Math.hypot(dx,dy)||1;
  const move=d>52,dodge=enemy?.phase==='warning'&&enemy.timer<.22&&g.player.dashCooldown<=0;
  tick(g,{x:dodge?-dy/d:move?dx/d:0,y:dodge?dx/d:move?dy/d:0,strike:true,dash:dodge,special:true});
 }if(!until())throw Error('fight did not finish');
}
function objective(g,goal){
 for(let i=0;i<2400&&!g.sparks.has(goal.id);i++){
  const dx=goal.x-g.player.x,dy=goal.y-g.player.y,d=Math.hypot(dx,dy)||1;
  tick(g,{x:d>4?dx/d:0,y:d>4?dy/d:0,strike:true,special:true});
 }if(!g.sparks.has(goal.id))throw Error('goal failed '+goal.id+' spirit '+JSON.stringify(g.challenge.escort));
}
export function climb(index,hero='ember',relic='comet'){
 const g=createGame(null,index,hero),l=g.level,k=l.kind;g.relic=relic;
 if(k==='echo'){
  for(let stage=0;stage<3;stage++)for(const rune of runeVerse(g)){
   const r=l.runes[rune];walk(g,r.x,r.y,{attack:false});for(let i=0;i<30;i++)tick(g,{});tick(g,{strike:true});tick(g,{});
  }
 }else if(k==='arena')fight(g,()=>g.sparks.size===l.goals.length);
 else if(k==='sanctuary'){
  walk(g,480,690);for(let i=0;i<7200&&g.sparks.size<3;i++){const dx=480-g.player.x,dy=690-g.player.y,d=Math.hypot(dx,dy)||1;tick(g,{x:d>20?dx/d:0,y:d>20?dy/d:0,strike:true,special:true});}
 }else if(k==='mirror'){
  for(const goal of l.goals){walk(g,goal.x,goal.y+95);for(let i=0;i<2400&&!g.sparks.has(goal.id);i++){const bolt=g.projectiles.find(b=>!b.friendly&&distance(b,g.player)<g.hero.reach+25);tick(g,{strike:!!bolt});}if(!g.sparks.has(goal.id))throw Error('mirror failed '+goal.id);}
 }else if(k==='race'){
  for(const goal of l.goals){walk(g,goal.x,goal.y,{attack:false});for(let i=0;i<120&&!g.sparks.has(goal.id);i++)tick(g,{dash:true});if(!g.sparks.has(goal.id))throw Error('ring failed '+goal.id);}
 }else{
  for(let section=0;section<3;section++){
   for(const [x,y] of l.paths[section].slice(section===0?1:0))walk(g,x,y,{escort:k==='escort'});
   objective(g,l.goals[section]);
  }
 }
 if(g.sparks.size!==l.goals.length&&l.goals.length===3)throw Error('incomplete goals '+g.sparks.size);
 const court=['echo','arena','mirror','sanctuary'].includes(k);
 if(court)walk(g,480,455);
 else{
  for(const [x,y] of l.paths[3].slice(0,3))walk(g,x,y,{escort:k==='escort'});
  if(k!=='race'&&l.goals[3]){walk(g,l.goals[3].x,l.goals[3].y);objective(g,l.goals[3]);}
 }
 const gate=l.stairs[2];walk(g,gate.x+64,300,{escort:k==='escort'});
 const boss=g.enemies.find(e=>e.type==='boss');if(boss.hp>0)fight(g,()=>boss.hp<=0,4800);
 walk(g,l.beacon.x,l.beacon.y,{escort:k==='escort'});for(let i=0;i<180&&g.status!=='won';i++)tick(g,{});
 if(g.status!=='won')throw Error('beacon not lit '+g.sparks.size+'/'+l.goals.length);return g;
}
