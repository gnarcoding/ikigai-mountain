import test from 'node:test';
import {climb} from './climb-helper.mjs';
import assert from 'node:assert/strict';
import {createGame,step,strike,special,dash,saveProgress,retry,readProgress,distance} from '../game/engine.mjs';
import {LEVELS,HEROES} from '../game/levels.mjs';
import {runeVerse,rankFor,encounterStatus} from '../game/encounters.mjs';
import {emptyJourney,recordGame,persistJourney,loadJourney} from '../game/progress.mjs';
const run=(g,input,seconds)=>{for(let t=0;t<seconds;t+=1/60)step(g,input,1/60);};
const quiet=g=>{for(const e of g.enemies)if(e.type!=='boss')e.hp=0;};
test('nine encounters alternate, and noncombat chapters have no mandatory boss',()=>{
 assert.equal(new Set(LEVELS.map(l=>l.kind)).size,9);
 for(const l of LEVELS){assert.ok(l.encounter.name&&l.par>0);if(l.index)assert.notEqual(l.kind,LEVELS[l.index-1].kind);const g=createGame(null,l.index);assert.equal(g.defeated.has('keeper'),!l.hasBoss);assert.ok(encounterStatus(g));}
});
test('walking through a race ring is insufficient; dash claims only the next ring and refreshes',()=>{
 const g=createGame(null,4);Object.assign(g.player,g.level.goals[1]);dash(g);step(g,{},0);assert.equal(g.sparks.size,0);
 Object.assign(g.player,g.level.goals[0]);g.player.dashTime=0;step(g,{},0);assert.equal(g.sparks.size,0);
 g.player.dashCooldown=0;dash(g);step(g,{},0);assert.equal(g.sparks.size,1);assert.equal(g.player.dashCooldown,0);run(g,{},70);assert.equal(g.status,'playing');
});
test('holding Strike cannot auto-enter a rune verse; wrong input restarts only its current verse',()=>{
 const g=createGame(null,2),r=runeVerse(g)[0];Object.assign(g.player,g.level.runes[r]);run(g,{strike:true},2);assert.equal(g.challenge.runeStep,1);
 step(g,{},.05);g.player.attackCooldown=0;strike(g);assert.equal(g.challenge.runeStep,0);assert.equal(g.sparks.size,0);
});
test('mirror seals ignore direct attacks and require three real reflected bolts',()=>{
 const g=createGame(null,7),goal=g.level.goals[0];Object.assign(g.player,{x:goal.x,y:goal.y+70});strike(g);assert.equal(g.sparks.size,0);
 for(let i=0;i<3;i++){g.player.attackCooldown=0;g.projectiles=[{x:g.player.x,y:g.player.y-30,vx:0,vy:110,life:5,mirror:goal.id}];strike(g);assert.equal(g.projectiles[0].friendly,true);run(g,{},.3);}
 assert.ok(g.sparks.has(goal.id));assert.equal(g.challenge.reflections[goal.id],3);
});
test('sanctuary charge pauses outside the circle and earned waves survive reload',()=>{
 const g=createGame(null,6);quiet(g);Object.assign(g.player,{x:480,y:690});run(g,{},4);assert.ok(g.challenge.charge>3.9);const before=g.challenge.charge;g.player.x=700;run(g,{},2);assert.equal(g.challenge.charge,before);
 g.player.x=480;run(g,{},6.1);assert.equal(g.sparks.size,1);const r=createGame(saveProgress(g),6);assert.equal(r.sparks.size,1);assert.ok(r.enemies.filter(e=>e.wave===0).every(e=>e.hp===0));
});
test('Mote waits for a distant guide and follows saved breadcrumbs after reload',()=>{
 const g=createGame(null,1);quiet(g);g.player.x+=240;const x=g.challenge.escort.x;run(g,{},1);assert.equal(g.challenge.escort.x,x);
 const a=createGame(null,1);quiet(a);run(a,{x:1},.45);const restored=createGame(saveProgress(a),1);assert.deepEqual(restored.challenge.history,a.challenge.history);assert.equal(restored.challenge.escort.x,a.challenge.escort.x);
 restored.status='fallen';restored.player.hp=0;const r=retry(restored);assert.ok(distance(r.player,r.challenge.escort)<35);assert.equal(r.challenge.history.length,0);
});
test('storm impacts are telegraphed, damage idle players, and respect dash invulnerability',()=>{
 const g=createGame(null,5);quiet(g);g.challenge.storm=[{x:g.player.x,y:g.player.y,life:.3,hit:false}];g.challenge.stormClock=100;g.player.invulnerable=0;run(g,{},.05);assert.equal(g.player.hp,g.hero.hp);run(g,{},.1);assert.equal(g.player.hp,g.hero.hp-1);
 const h=createGame(null,5);quiet(h);h.player.invulnerable=0;h.challenge.storm=[{x:h.player.x,y:h.player.y,life:.21,hit:false}];dash(h);step(h,{},.02);assert.equal(h.player.hp,h.hero.hp);
});
test('watchers detect a player in their cone; the alarm decays out of view',()=>{
 const g=createGame(null,8),e=g.enemies.find(e=>e.type==='sentinel');g.enemies=[e,g.enemies.at(-1)];const a=e.homeX;Object.assign(g.player,{x:e.homeX+Math.cos(a)*100,y:e.homeY+Math.sin(a)*100});step(g,{},.001);assert.ok(g.challenge.alarm>0);
 Object.assign(g.player,g.level.spawn);run(g,{},5);assert.equal(g.challenge.alarm,0);
});
test('each special has a real effect, spends charge, cannot be spammed, and recharges',()=>{
 for(const hero of HEROES){const g=createGame(null,0,hero.id),e=g.enemies[0];Object.assign(e,{x:g.player.x+60,y:g.player.y,hp:10,maxHp:10});g.enemies=[e,g.enemies.at(-1)];assert.equal(special(g),true);assert.ok(e.hp<10);assert.ok(g.power<100);assert.equal(special(g),false);if(hero.id==='reed')assert.equal(g.player.haste,3);if(hero.id==='flint')assert.ok(e.stun>=2);e.hp=0;run(g,{},13);assert.equal(g.power,100);}
});
test('relics change combat/movement and persist without affecting the journey schema',()=>{
 const g=createGame(),r=createGame();g.relic='zephyr';dash(g);dash(r);assert.ok(g.player.dashCooldown<r.player.dashCooldown);
 g.relic='moss';g.player.hp=2;special(g);assert.equal(g.player.hp,3);assert.ok(g.player.invulnerable>=2);const restored=createGame(saveProgress(g));assert.equal(restored.relic,'moss');assert.equal(restored.power,g.power);
});
test('third strikes sweep harder; damage breaks the hit flow',()=>{
 const g=createGame(),e=g.enemies[0];Object.assign(e,{x:g.player.x+50,y:g.player.y,hp:20,maxHp:20});g.enemies=[e];for(let i=0;i<3;i++){g.player.attackCooldown=0;strike(g);}assert.equal(e.hp,15);assert.equal(g.challenge.bestCombo,3);
 Object.assign(e,{x:g.player.x,y:g.player.y});g.player.invulnerable=0;step(g,{},.01);assert.equal(g.challenge.combo,0);
});
test('old completed chapters retain completion, and changed race layouts migrate safely',()=>{
 for(const l of LEVELS){const raw={version:2,levelId:l.id,heroId:'wren',sparks:l.kind==='race'?['goal-0','goal-1','goal-2']:l.goals.map(s=>s.id),defeated:['keeper'],complete:true,checkpoint:'gate',position:{x:480,y:1340,hp:5}};const p=readProgress(raw,l.index),g=createGame(raw,l.index);assert.equal(p.complete,true);assert.equal(p.position,null);assert.equal(g.completed,true);assert.equal(g.sparks.size,l.goals.length);}
});
test('bad encounter data cannot poison timers, positions, charge or chosen relics',()=>{
 const g=createGame(null,1),raw={...saveProgress(g),relic:'fake',power:Infinity,challenge:{charge:NaN,score:Infinity,hits:-5,escort:{x:NaN,y:0},history:[null,{x:Infinity,y:1}]}};const r=createGame(raw,1);assert.equal(r.relic,'comet');assert.equal(r.power,100);assert.equal(r.challenge.score,0);assert.equal(r.challenge.hits,0);assert.equal(r.challenge.history.length,0);assert.ok(Number.isFinite(r.challenge.escort.x));
});
test('medals reward pace and survival; replay preserves the best medal and score',()=>{
 const g=createGame();g.completed=true;g.sparks=new Set(g.level.goals.map(s=>s.id));g.defeated.add('keeper');g.seconds=20;g.challenge.score=500;assert.equal(rankFor(g),'gold');const j=emptyJourney();recordGame(j,g,1);g.seconds=200;g.deaths=1;g.challenge.score=100;assert.equal(rankFor(g),'bronze');recordGame(j,g,2);assert.equal(j.records[g.level.id].bestRank,'gold');assert.equal(j.records[g.level.id].bestScore,500);
 const values=new Map(),storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};persistJourney(storage,j);assert.equal(loadJourney(storage).journey.records[g.level.id].bestRank,'gold');
});

for(const relic of ['zephyr','moss'])for(const hero of HEROES)for(const l of LEVELS)test(`${hero.name} completes chapter ${l.index+1} with ${relic}`,()=>{const g=climb(l.index,hero.id,relic);assert.equal(g.status,'won');assert.ok(g.player.hp>0);});
