import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, step, blocked, move, strike, dash, retry, readProgress, saveProgress, distance } from '../game/engine.mjs';
import { CHAPTERS } from '../game/chapters.mjs';
import { LEVELS, HEROES } from '../game/levels.mjs';
import { SAVE_KEY, LEGACY_KEY, emptyJourney, normalizeJourney, loadJourney, recordGame, persistJourney, clearedCount, campaignNext } from '../game/progress.mjs';
import { climb } from './climb-helper.mjs';
const idle={x:0,y:0};
function run(g,input,seconds){for(let t=0;t<seconds;t+=1/60)step(g,input,1/60);}
function storage(seed={}){const m=new Map(Object.entries(seed));return{getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)};}
function openArena(index){const g=createGame(null,index);g.level.goals.forEach(s=>g.sparks.add(s.id));g.player.x=g.level.beacon.x;g.player.y=300;return g;}

test('27 playable chapters retain all authored addresses and distinct content',()=>{
 assert.equal(CHAPTERS.length,27);assert.equal(LEVELS.length,27);assert.equal(new Set(LEVELS.map(l=>l.id)).size,27);
 assert.equal(new Set(LEVELS.map(l=>l.kind)).size,5);assert.equal(new Set(LEVELS.map(l=>l.biome)).size,6);
 assert.equal(new Set(LEVELS.map(l=>JSON.stringify(l.stairs))).size,8);
 for(const l of LEVELS){assert.equal(l.chapter,CHAPTERS[l.index]);assert.ok(l.objective&&l.instructions&&l.bossName);assert.ok(!blocked(createGame(null,l.index),l.spawn.x,l.spawn.y));}
 assert.equal(LEVELS[26].goals.length,4);assert.equal(LEVELS[26].pattern,'cycle');
});
test('each climber has real stats, matching hearts and a persistent identity',()=>{
 for(const h of HEROES){const g=createGame(null,4,h.id);assert.equal(g.player.hp,h.hp);const restored=createGame(saveProgress(g),4);assert.equal(restored.hero.id,h.id);dash(g);assert.equal(g.player.dashCooldown,h.dashCooldown);}
 const reed=createGame(null,0,'reed'),flint=createGame(null,0,'flint');run(reed,{x:1},.2);run(flint,{x:1},.2);assert.ok(reed.player.x>flint.player.x);
 const ember=createGame(),wren=createGame(null,0,'wren');for(const g of [ember,wren]){const e=g.enemies[0];e.x=g.player.x+95;e.y=g.player.y;g.enemies=[e];g.player.face=0;strike(g);}
 assert.equal(ember.enemies[0].hp,2);assert.equal(wren.enemies[0].hp,1);
});
test('malformed snapshots cannot skip objectives or poison numbers',()=>{
 assert.equal(readProgress({version:2}),null);assert.equal(readProgress({version:1},1),null);
 const p=readProgress({version:1,sparks:['fake','curiosity','curiosity'],defeated:null,checkpoint:'gate',complete:true,seconds:Infinity,deaths:-6});
 assert.deepEqual(p.sparks,['curiosity']);assert.equal(p.checkpoint,'camp');assert.equal(p.complete,false);assert.equal(p.seconds,0);assert.equal(p.deaths,0);
 const g=createGame({...saveProgress(createGame()),position:{x:Infinity,y:0,hp:4}});assert.deepEqual([g.player.x,g.player.y],[480,1340]);
});
test('diagonal movement is normalized; long frames and dash cannot cross boundaries',()=>{
 const a=createGame(),b=createGame();run(a,{x:1,y:0},.2);run(b,{x:1,y:1},.2);
 assert.ok(Math.abs(distance(a.player,a.level.spawn)-distance(b.player,b.level.spawn))<.001);
 const g=createGame();step(g,{x:1,y:0},20);assert.ok(g.player.x<490);
 g.player.x=480;g.player.y=g.level.stairs[0].y+100;move(g,g.player,0,-500);assert.ok(g.player.y>=g.level.stairs[0].y+64+12);
 const rock=g.level.rocks[0];g.player.x=rock.x+rock.w/2;g.player.y=rock.y+rock.h+30;move(g,g.player,0,-80);assert.ok(g.player.y>=rock.y+rock.h+12);
 move(g,g.player,-2000,0);assert.ok(g.player.x>=44);
});
test('every gate requires the exact number of distinct goals, including four at Ikigai',()=>{
 for(const l of LEVELS){const g=createGame(null,l.index),gate=l.stairs[2];assert.equal(blocked(g,gate.x+64,gate.y+10),true);l.goals.slice(0,-1).forEach(s=>g.sparks.add(s.id));assert.equal(blocked(g,gate.x+64,gate.y+10),true);g.sparks.add(l.goals.at(-1).id);assert.equal(blocked(g,gate.x+64,gate.y+10),false);}
});
test('ordered runes reject the wrong order and shrines require a strike',()=>{
 const g=createGame(null,2);Object.assign(g.player,g.level.goals[1]);strike(g);assert.equal(g.sparks.size,0);
 Object.assign(g.player,g.level.goals[0]);g.player.attackCooldown=0;strike(g);assert.equal(g.sparks.size,1);
 const b=createGame(null,5);Object.assign(b.player,b.level.goals[0]);step(b,idle,0);assert.equal(b.sparks.size,0);strike(b);assert.equal(b.sparks.size,1);
});
test('spirits and warden sigils cannot be collected until their enemies are cleared',()=>{
 for(const index of [1,3]){const g=createGame(null,index),goal=g.level.goals[0];Object.assign(g.player,{x:goal.x,y:goal.y});step(g,idle,0);assert.equal(g.sparks.size,0);
 for(const e of g.enemies)if(distance(e,goal)<150){e.hp=0;g.defeated.add(e.id);}step(g,idle,0);assert.equal(g.sparks.size,1);}
});
test('strike cooldown prevents repeated damage and dash protects briefly',()=>{
 const g=createGame(),e=g.enemies[0];g.player.x=e.x-55;g.player.y=e.y;assert.equal(strike(g),true);assert.equal(e.hp,1);assert.equal(strike(g),false);assert.equal(e.hp,1);
 assert.equal(dash(g),true);assert.ok(g.player.invulnerable>0);assert.equal(dash(g),false);
 run(g,idle,1.2);assert.equal(dash(g),true);
});
test('death and reload return safely to the checkpoint and preserve earned goals',()=>{
 const g=createGame();g.sparks.add('curiosity');g.player.hp=1;g.player.invulnerable=0;
 g.enemies[0].x=g.player.x;g.enemies[0].y=g.player.y;step(g,idle,.02);assert.equal(g.status,'fallen');assert.equal(g.deaths,1);
 for(const restored of [retry(g),createGame(saveProgress(g))]){assert.equal(restored.player.hp,5);assert.ok(restored.sparks.has('curiosity'));assert.equal(restored.status,'playing');assert.equal(restored.player.y,g.level.spawn.y);}
});
test('guardians telegraph each attack, recover, and stay inside their arena',()=>{
 for(const index of [0,1,3,26]){const g=openArena(index),b=g.enemies.at(-1);b.cooldown=0;step(g,idle,.02);assert.equal(b.phase,'warning');assert.ok(['charge','volley','stomp','ring'].includes(b.attack));
 run(g,idle,1.6);assert.equal(b.phase,'rest');move(g,b,2000,2000);assert.ok(b.x<=880&&b.y<=320);
 g.player.y=450;step(g,idle,.02);assert.equal(b.phase,'idle');assert.ok(b.cooldown>=.5);
 }
 const g=openArena(26),b=g.enemies.at(-1),patterns=[];for(let i=0;i<4;i++){b.phase='idle';b.cooldown=0;step(g,idle,.01);patterns.push(b.attack);}assert.deepEqual(patterns,['charge','volley','stomp','ring']);
});
test('defeating a guardian clears projectiles before the beacon walk',()=>{
 const g=openArena(1),b=g.enemies.at(-1);b.hp=1;g.player.x=b.x;g.player.y=b.y+60;g.projectiles.push({x:0,y:0,vx:0,vy:0,life:4});strike(g);assert.equal(b.hp,0);assert.equal(g.projectiles.length,0);
});
test('fallen and won simulations freeze',()=>{const g=createGame();for(const status of ['fallen','won']){g.status=status;const x=g.player.x;step(g,{x:1},.05);assert.equal(g.player.x,x);assert.equal(strike(g),false);}});

test('browser save roundtrip retains hero, mode, location, HP and living enemy damage',()=>{
 const s=storage(),j=emptyJourney(),g=createGame(null,9,'flint');j.chosen=true;j.mode='single';run(g,{x:1},.5);g.player.hp=4;g.enemies[0].hp=2;g.sparks.add(g.level.goals[0].id);recordGame(j,g,100);assert.equal(persistJourney(s,j),true);
 const loaded=loadJourney(s).journey;assert.equal(loaded.heroId,'flint');assert.equal(loaded.currentLevel,9);assert.equal(loaded.mode,'single');const r=createGame(loaded.records[g.level.id].progress,9,loaded.heroId);
 assert.equal(r.player.x,g.player.x);assert.equal(r.player.hp,4);assert.equal(r.enemies[0].hp,2);assert.deepEqual([...r.sparks],[...g.sparks]);
});
test('changing chapters and replaying cannot erase completions or best times',()=>{
 const j=emptyJourney(),s=storage(),win=climb(0);recordGame(j,win,10);const firstTime=j.records[win.level.id].bestSeconds;
 recordGame(j,createGame(null,17,'reed'),20);recordGame(j,createGame(null,0,'reed'),30);persistJourney(s,j);
 const loaded=loadJourney(s).journey;assert.equal(Object.keys(loaded.records).length,2);assert.equal(clearedCount(loaded),1);assert.equal(loaded.records[win.level.id].bestSeconds,firstTime);assert.equal(loaded.records[win.level.id].progress.complete,false);
 assert.equal(campaignNext(j,0),1);assert.equal(campaignNext(j,26),null);
});
test('existing Base Camp save migrates without deleting its original data',()=>{
 const raw=JSON.stringify({version:1,sparks:['curiosity','practice','courage'],defeated:['keeper','moss-1'],checkpoint:'gate',complete:true,seconds:50,deaths:2}),s=storage({[LEGACY_KEY]:raw});
 const {journey,status}=loadJourney(s);assert.equal(status,'migrated');assert.equal(clearedCount(journey),1);assert.ok(journey.records[LEVELS[0].id].progress.defeated.includes('guard-0'));assert.equal(persistJourney(s,journey),true);assert.equal(s.getItem(LEGACY_KEY),raw);assert.equal(loadJourney(s).status,'saved');
});
test('corrupt saves are retained for recovery; blocked and full storage do not crash',()=>{
 const s=storage({[SAVE_KEY]:'{broken'});assert.equal(loadJourney(s).status,'recovered');assert.equal(s.getItem(SAVE_KEY+':recovery'),'{broken');
 assert.equal(loadJourney(null).status,'unavailable');const j=recordGame(emptyJourney(),createGame());assert.equal(persistJourney(null,j),false);assert.equal(Object.keys(j.records).length,1);
 const full={getItem:()=>null,setItem:()=>{throw Error('quota');}};assert.equal(persistJourney(full,j),false);assert.equal(normalizeJourney({version:42}),null);
});
test('different tabs merge chapter progress instead of replacing the other climb',()=>{
 const s=storage(),a=emptyJourney(),b=emptyJourney();recordGame(a,createGame(null,4),10);persistJourney(s,a);recordGame(b,createGame(null,12),20);persistJourney(s,b);assert.equal(Object.keys(loadJourney(s).journey.records).length,2);
});
for(const hero of HEROES)for(const level of LEVELS)test(`${hero.name} can complete chapter ${level.index+1} (${level.kind}) with normal movement and combat`,()=>{
 const g=climb(level.index,hero.id);assert.equal(g.status,'won');assert.equal(g.sparks.size,level.goals.length);assert.ok(g.player.hp>0);assert.equal(saveProgress(g).complete,true);assert.ok(createGame(saveProgress(g),level.index).completed);
});

test('a later replay in another tab cannot remove a completed badge',()=>{
 const s=storage(),a=emptyJourney(),b=emptyJourney();recordGame(a,climb(0),10);persistJourney(s,a);recordGame(b,createGame(),20);persistJourney(s,b);const loaded=loadJourney(s).journey;assert.equal(clearedCount(loaded),1);assert.equal(loaded.records[LEVELS[0].id].progress.complete,false);assert.ok(loaded.records[LEVELS[0].id].bestSeconds>0);
});
test('invalid rune saves recover to a playable sequential prefix',()=>{
 const saved=saveProgress(createGame(null,2));saved.sparks=['goal-1','goal-2'];assert.deepEqual(readProgress(saved,2).sparks,[]);saved.sparks=['goal-0','goal-2'];assert.deepEqual(readProgress(saved,2).sparks,['goal-0']);
});
