import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS } from '../game/levels.mjs';
import { scoreFor, TRACK_NAMES, AUDIO_KEY, audioPreferences, midiHz } from '../game/score.mjs';
import { MountainAudio } from '../game/audio.mjs';
function parameter(value=0){return{value,events:[],setValueAtTime(v,t){assert.ok(Number.isFinite(v)&&Number.isFinite(t));this.value=v;this.events.push([v,t]);},exponentialRampToValueAtTime(v,t){assert.ok(v>0);this.setValueAtTime(v,t);},setTargetAtTime(v,t){this.setValueAtTime(v,t);},cancelScheduledValues(){}};}
function node(){return{gain:parameter(),frequency:parameter(),pan:parameter(),Q:parameter(),threshold:parameter(),knee:parameter(),ratio:parameter(),attack:parameter(),release:parameter(),connect(){},disconnect(){this.disconnected=true;},start(t){this.started=t;},stop(t){this.stopped=t;}};}
function context(){return{state:'running',currentTime:0,sampleRate:24000,destination:node(),created:[],createGain:node,createDynamicsCompressor:node,createConvolver:node,createBiquadFilter:node,createStereoPanner:node,createBuffer(ch,n){const data=Array.from({length:ch},()=>new Float32Array(n));return{getChannelData:c=>data[c]};},createOscillator(){const n=node();this.created.push(n);return n;},createBufferSource(){const n=node();this.created.push(n);return n;},async resume(){this.state='running';},async suspend(){this.state='suspended';},async close(){this.state='closed';}};}
function memory(){const m=new Map();return{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)};}
function instrument(){const c=context(),storage=memory(),a=new MountainAudio(storage,{createContext:()=>c});return{a,c,storage};}

test('every chapter has a distinct, deterministic playable score',()=>{
 assert.equal(TRACK_NAMES.length,27);assert.equal(new Set(TRACK_NAMES).size,27);
 const signatures=new Set();for(const l of LEVELS){const s=scoreFor(l);assert.deepEqual(s,scoreFor(l));assert.ok(s.bpm>=75&&s.bpm<=115);assert.equal(s.beats,64);assert.ok(s.events.some(e=>e.battle));assert.ok(s.events.some(e=>e.instrument==='pad'));assert.ok(s.events.some(e=>e.instrument==='bass'));
 let previous=-1;for(const e of s.events){assert.ok(e.beat>=previous&&e.beat<s.beats);previous=e.beat;assert.ok(e.duration>0&&e.velocity>0&&e.velocity<=1);assert.ok(Number.isFinite(midiHz(e.note)));assert.ok(Math.abs(e.pan)<=1);}signatures.add(JSON.stringify(s.events)+s.bpm+s.root);}
 assert.equal(signatures.size,27);
});
test('preferences reject invalid values, clamp volume and roundtrip independently from saves',()=>{
 assert.deepEqual(audioPreferences({music:'yes',effects:false,musicVolume:8,effectsVolume:NaN}),{music:true,effects:false,musicVolume:1,effectsVolume:.7});
 const {a,storage}=instrument();a.setPreferences({music:false,effectsVolume:.23});const b=new MountainAudio(storage);assert.equal(b.preferences.music,false);assert.equal(b.preferences.effectsVolume,.23);assert.ok(storage.getItem(AUDIO_KEY));
});
test('audio context is created only after an interaction and reused',async()=>{
 const {a,c}=instrument();assert.equal(a.context,null);a.setChapter(LEVELS[0]);assert.equal(a.context,null);await a.unlock();assert.equal(a.context,c);const graph=a.musicBus;await a.unlock();assert.equal(a.musicBus,graph);a.dispose();
});
test('audio failure does not throw into gameplay or lose preferences',async()=>{
 const a=new MountainAudio(null,{createContext:()=>{throw Error('unavailable');}});assert.equal(await a.unlock(),false);assert.equal(a.failed,true);a.setPreferences({music:false});assert.equal(a.preferences.music,false);a.dispose();
});
test('music ducks in menus, mutes for narration, and restores its chosen volume',async()=>{
 const {a}=instrument();a.setChapter(LEVELS[0]);await a.unlock();a.setState({paused:false});const loud=a.musicBus.gain.value;a.setState({paused:true});assert.ok(a.musicBus.gain.value<loud);a.setState({narrating:true});assert.equal(a.musicBus.gain.value,0);a.setState({narrating:false,paused:false});assert.equal(a.musicBus.gain.value,loud);a.dispose();
});
test('hidden pages suspend audio and stop the scheduler',async()=>{
 const {a,c}=instrument();a.setChapter(LEVELS[1]);await a.unlock();assert.ok(a.timer);a.setState({hidden:true});assert.equal(c.state,'suspended');assert.equal(a.timer,0);assert.equal(a.musicBus.gain.value,0);assert.equal(a.effectsBus.gain.value,0);a.setState({hidden:false});await Promise.resolve();assert.equal(c.state,'running');a.dispose();
});
test('scheduler skips stale backlogs and activates only the guardian layer in combat',async()=>{
 const {a,c}=instrument();a.setChapter(LEVELS[1]);await a.unlock();const heard=[];a.note=e=>heard.push(e);a.eventIndex=0;a.origin=.05;a.cycle=0;
 for(let t=0;t<3;t+=.08){c.currentTime=t;a.schedule();}assert.ok(heard.length>10);assert.ok(!heard.some(e=>e.battle));
 heard.length=0;a.battle=true;a.origin=c.currentTime+.05;a.eventIndex=0;a.cycle=0;for(let i=0;i<40;i++){c.currentTime+=.08;a.schedule();}assert.ok(heard.some(e=>e.battle));
 heard.length=0;c.currentTime+=300;a.schedule();assert.ok(heard.length<15);a.dispose();
});
test('chapter changes retire old music and never restart on an unchanged chapter',async()=>{
 const {a,c}=instrument();a.setChapter(LEVELS[0]);await a.unlock();const old=[...a.musicNodes];assert.ok(old.length);const origin=a.origin;a.setChapter(LEVELS[0]);assert.equal(a.origin,origin);c.currentTime=5;a.setChapter(LEVELS[26]);assert.equal(a.score.title,'All Roads Become One');assert.equal(a.eventIndex,0);assert.ok(old.every(n=>n.source.stopped<=5.12));a.dispose();
});
test('effects are distinct, rate limited, muted independently and release audio nodes',async()=>{
 const {a,c}=instrument();await a.unlock();a.effect('strike');const count=a.nodes.size;assert.ok(count>0);a.effect('strike');assert.equal(a.nodes.size,count);c.currentTime+=1;a.effect('spark');assert.ok(a.nodes.size>count);
 a.setPreferences({effects:false});const before=a.nodes.size;a.effect('dash');assert.equal(a.nodes.size,before);assert.equal(a.effectsBus.gain.value,0);a.setPreferences({effects:true});c.currentTime+=1;a.effect('dash');assert.ok(a.nodes.size>before);
 for(const n of [...a.nodes])n.source.onended();assert.equal(a.nodes.size,0);assert.equal(a.musicNodes.size,0);a.dispose();
});
test('all notes and effects create finite envelopes and bounded voices',async()=>{
 const {a,c}=instrument();a.setChapter(LEVELS[26]);await a.unlock();
 for(const e of a.score.events.slice(0,100)){a.note(e,c.currentTime+.01,60/a.score.bpm);for(const n of [...a.nodes])n.source.onended();c.currentTime+=.05;}
 for(const type of ['strike','hit','dash','hurt','step','heal','spark','defeat','warning','gate','guardian','won','fallen','zone','select']){a.effect(type,{x:300});assert.ok(a.nodes.size<40);for(const n of [...a.nodes])n.source.onended();c.currentTime+=1;}
 a.dispose();
});
