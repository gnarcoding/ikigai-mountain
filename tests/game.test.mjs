import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, step, blocked, move, strike, dash, retry, readProgress, saveProgress, SPARKS, distance } from '../game/engine.mjs';
import { CHAPTERS } from '../game/chapters.mjs';

const idle={x:0,y:0};
function run(g,input,seconds){for(let t=0;t<seconds;t+=1/60)step(g,input,1/60);}
function walkTo(g,x,y,attack=true){
  for(let i=0;i<2400;i++){
    const dx=x-g.player.x,dy=y-g.player.y,d=Math.hypot(dx,dy);
    if(d<5 || g.status==='won')return;
    if(g.status!=='playing')throw new Error('Climb stopped: '+g.status);
    step(g,{x:dx/d,y:dy/d,strike:attack},1/60);
  }
  throw new Error('Unreachable waypoint: '+[x,y]+' from '+[g.player.x,g.player.y]);
}
test('all 27 authored stops have unique chapter addresses',()=>{
  assert.equal(CHAPTERS.length,27);assert.equal(new Set(CHAPTERS.map(c=>c.id)).size,27);
  assert.equal(CHAPTERS[0].id,'trailhead-love');assert.equal(CHAPTERS[26].id,'summit');
});
test('malformed saves cannot skip the gate, forge completion or poison time',()=>{
  assert.equal(readProgress({version:2}),null);
  const p=readProgress({version:1,sparks:['fake','curiosity','curiosity'],defeated:null,checkpoint:'gate',complete:true,seconds:Infinity,deaths:-6});
  assert.deepEqual(p.sparks,['curiosity']);assert.equal(p.checkpoint,'camp');assert.equal(p.complete,false);assert.equal(p.seconds,0);assert.equal(p.deaths,0);
});
test('diagonal movement is normalized and oversized frames are clamped',()=>{
  const a=createGame(),b=createGame();run(a,{x:1,y:0},.2);run(b,{x:1,y:1},.2);
  assert.ok(Math.abs(distance(a.player,{x:480,y:1340})-distance(b.player,{x:480,y:1340}))<.001);
  const c=createGame();step(c,{x:1,y:0},20);assert.ok(c.player.x<490);
});
test('dash and knockback cannot cross cliffs, ponds or the world edge',()=>{
  const g=createGame();g.player.x=480;g.player.y=1160;move(g,g.player,0,-500);assert.ok(g.player.y>=1132);
  g.player.x=410;g.player.y=950;move(g,g.player,0,-250);assert.ok(g.player.y>=933);
  move(g,g.player,-2000,0);assert.ok(g.player.x>=44);
});
test('stairs are walkable and the upper gate requires three distinct sparks',()=>{
  const g=createGame();assert.equal(blocked(g,256,1080),false);assert.equal(blocked(g,704,735),false);
  assert.equal(blocked(g,480,365),true);
  for(const s of SPARKS){g.player.x=s.x;g.player.y=s.y;step(g,idle,0);}
  assert.equal(g.sparks.size,3);assert.equal(g.checkpoint,'gate');assert.equal(blocked(g,480,365),false);
});
test('a strike hits once, respects range and cannot repeat during cooldown',()=>{
  const g=createGame(),e=g.enemies[0];g.player.x=e.x-55;g.player.y=e.y;assert.equal(strike(g),true);
  assert.equal(e.hp,1);assert.equal(strike(g),false);assert.equal(e.hp,1);
  run(g,idle,.34);g.player.x=e.x-45;strike(g);assert.equal(e.hp,0);assert.ok(g.defeated.has(e.id));assert.equal(g.hearts.length,1);
});
test('dash provides temporary protection and has a cooldown',()=>{
  const g=createGame();assert.equal(dash(g),true);assert.ok(g.player.invulnerable>0);assert.equal(dash(g),false);
  run(g,idle,1.2);assert.equal(dash(g),true);
});
test('enemy damage, death and checkpoint retry preserve earned progress',()=>{
  const g=createGame();g.sparks.add('curiosity');g.player.hp=1;
  g.enemies[0].x=g.player.x;g.enemies[0].y=g.player.y;step(g,idle,.02);
  assert.equal(g.status,'fallen');assert.equal(g.deaths,1);
  const restored=retry(g);assert.equal(restored.player.hp,5);assert.ok(restored.sparks.has('curiosity'));assert.equal(restored.status,'playing');
});
test('guardian telegraphs a charge and then leaves a recovery window',()=>{
  const g=createGame();SPARKS.forEach(s=>g.sparks.add(s.id));g.player.x=480;g.player.y=300;g.player.invulnerable=100;
  const b=g.enemies.find(e=>e.type==='boss');b.cooldown=0;step(g,idle,.02);assert.equal(b.phase,'warning');
  run(g,idle,.9);assert.equal(b.phase,'charge');run(g,idle,.5);assert.equal(b.phase,'rest');
});
test('complete level is reachable with ordinary movement and combat',()=>{
  const g=createGame();
  // Follow the actual walkable route. No teleports, invincibility or enemy edits.
  for(const [x,y] of [[550,1340],[730,1340],[760,1220],[550,1190],[256,1190],[256,1010],[160,870],[250,960],[650,960],[704,810],[704,670],[800,540],[680,640],[480,640],[480,450],[480,305]])walkTo(g,x,y);
  assert.equal(g.sparks.size,3);assert.ok(g.player.hp>0);
  const boss=g.enemies.find(e=>e.type==='boss');
  for(let i=0;i<3600&&boss.hp>0;i++){
    const dx=boss.x-g.player.x,dy=boss.y-g.player.y,d=Math.hypot(dx,dy)||1;
    // Close to sword range and dash through the telegraphed windup.
    const move=d>60;
    step(g,{x:move?dx/d:0,y:move?dy/d:0,strike:true,dash:boss.phase==='warning'},1/60);
    assert.equal(g.status,'playing','player should survive the ordinary route and guardian');
  }
  assert.equal(boss.hp,0);walkTo(g,480,145);
  assert.equal(g.status,'won');assert.equal(saveProgress(g).complete,true);
  const resumed=createGame(saveProgress(g));assert.ok(resumed.completed);assert.ok(resumed.defeated.has('keeper'));
});
test('fallen and won simulations freeze instead of accepting movement',()=>{
  const g=createGame();for(const state of ['fallen','won']){g.status=state;const x=g.player.x;step(g,{x:1,y:0},.05);assert.equal(g.player.x,x);assert.equal(strike(g),false);}
});
