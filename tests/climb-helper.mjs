import {createGame,step,distance} from '../game/engine.mjs';
const tick=(g,input)=>{step(g,input,1/60);g.events=[];if(g.status==='fallen')throw Error(`fell at ${g.player.x.toFixed()},${g.player.y.toFixed()}, goals ${g.sparks.size}`);};
function walk(g,x,y){for(let i=0;i<2400;i++){const dx=x-g.player.x,dy=y-g.player.y,d=Math.hypot(dx,dy);if(d<5||g.status==='won')return;tick(g,{x:dx/d,y:dy/d,strike:true});}throw Error('stuck going '+[x,y]+' from '+[g.player.x,g.player.y]);}
function objective(g,goal){
 for(let i=0;i<1600&&!g.sparks.has(goal.id);i++){
 const e=g.enemies.filter(e=>e.hp>0&&distance(e,goal)<150).sort((a,b)=>distance(a,g.player)-distance(b,g.player))[0];
 const target=e&&g.level.kind==='rescue'||e&&g.level.kind==='wardens'?e:goal;
 const dx=target.x-g.player.x,dy=target.y-g.player.y,d=Math.hypot(dx,dy)||1;
 const advance=target===goal?d>4:d>50;
 tick(g,{x:advance?dx/d:0,y:advance?dy/d:0,strike:true});
 }
 if(!g.sparks.has(goal.id))throw Error('goal failed '+goal.id);
}
export function climb(index,hero='ember'){
 const g=createGame(null,index,hero),l=g.level;
 for(let section=0;section<3;section++){
  for(const [x,y] of l.paths[section].slice(section===0?1:0))walk(g,x,y);
  objective(g,l.goals[section]);
 }
 const gate=l.stairs[2];
 // Follow the last terrace to the gate, taking the fourth shrine on the summit.
 const route=l.paths[3];for(const [x,y] of route.slice(0,3))walk(g,x,y);
 if(l.goals[3]){walk(g,l.goals[3].x,l.goals[3].y);objective(g,l.goals[3]);}
 walk(g,gate.x+64,300);
 const boss=g.enemies.find(e=>e.type==='boss');
 for(let i=0;i<3600&&boss.hp>0;i++){
  const dx=boss.x-g.player.x,dy=boss.y-g.player.y,d=Math.hypot(dx,dy)||1;
  const advance=d>60,dodge=boss.phase==='warning'&&boss.timer<.25&&g.player.dashCooldown<=0;
  tick(g,{x:dodge?-dy/d:advance?dx/d:0,y:dodge?dx/d:advance?dy/d:0,strike:true,dash:dodge});
 }
 if(boss.hp>0)throw Error('boss still alive');
 walk(g,l.beacon.x,l.beacon.y);if(g.status!=='won')throw Error('beacon not lit');return g;
}
