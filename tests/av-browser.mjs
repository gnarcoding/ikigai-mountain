import { LEVELS } from '../game/levels.mjs';
import { createGame } from '../game/engine.mjs';
import { Painter } from '../game/art.mjs';
import { scoreFor } from '../game/score.mjs';
import { MountainAudio } from '../game/audio.mjs';
const $=id=>document.getElementById(id);let lastURL=null;
for(const l of LEVELS){const o=document.createElement('option');o.value=l.index;o.textContent=`${l.index+1} · ${scoreFor(l).title}`;$('level').append(o);}
const views=[];
for(const index of [0,2,6,12,19,26]){
 const l=LEVELS[index],card=document.createElement('article'),label=document.createElement('h2'),canvas=document.createElement('canvas');label.textContent=l.theme.name;card.append(label,canvas);$('gallery').append(card);
 const g=createGame(null,index,'wren');l.goals.forEach(goal=>g.sparks.add(goal.id));g.player.x=l.beacon.x;g.player.y=290;g.player.invulnerable=0;g.time=10;g.zone='guardian';const boss=g.enemies.at(-1);boss.phase='warning';boss.attack=l.pattern==='cycle'?'volley':l.pattern;boss.targetX=g.player.x;boss.targetY=g.player.y;boss.vx=0;boss.vy=300;
 const p=new Painter(canvas);p.resize();p.draw(g,10,false,false);views.push({p,g});
}
function wave(buffer){
 const n=buffer.length,rate=buffer.sampleRate,b=new ArrayBuffer(44+n*4),v=new DataView(b);const text=(at,t)=>[...t].forEach((c,i)=>v.setUint8(at+i,c.charCodeAt(0)));
 text(0,'RIFF');v.setUint32(4,36+n*4,true);text(8,'WAVE');text(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,2,true);v.setUint32(24,rate,true);v.setUint32(28,rate*4,true);v.setUint16(32,4,true);v.setUint16(34,16,true);text(36,'data');v.setUint32(40,n*4,true);
 for(let i=0;i<n;i++)for(let c=0;c<2;c++)v.setInt16(44+i*4+c*2,Math.max(-1,Math.min(1,buffer.getChannelData(c)[i]))*32767,true);return new Blob([b],{type:'audio/wav'});
}
async function render(index){
 const l=LEVELS[index],ctx=new OfflineAudioContext(2,44100*8,44100),a=new MountainAudio(null);a.context=ctx;a.score=scoreFor(l);a.enabled=true;a.paused=false;a.buildGraph();
 for(const e of a.score.events)if(e.beat<8)a.note(e,.1+e.beat*60/a.score.bpm,60/a.score.bpm);
 // Layer combat FX over the music to check the combined peak and tails.
 for(const [time,type] of [[1,'finisher'],[1.2,'hit'],[2,'parry'],[3,'power'],[3.1,'impact'],[4,'rune']]){
  const existing=a.voice.bind(a);a.voice=o=>existing({...o,at:o.at+time});
  // OfflineAudioContext is suspended before render; exercise the same effect
  // envelopes through a tiny clock adapter without mutating the browser context.
  const clock=a.context;a.context=new Proxy(ctx,{get:(target,key)=>key==='state'?'running':typeof target[key]==='function'?target[key].bind(target):target[key]});
  a.effect(type);a.context=clock;a.voice=existing;
 }
 const b=await ctx.startRendering();let peak=0,sum=0,finite=true;
 for(let ch=0;ch<2;ch++)for(const value of b.getChannelData(ch)){if(!Number.isFinite(value))finite=false;peak=Math.max(peak,Math.abs(value));sum+=value*value;}
 const rms=Math.sqrt(sum/(b.length*2));return{buffer:b,peak,rms,pass:finite&&peak<.95&&rms>.005};
}
$('render').onclick=async()=>{try{$('result').textContent='Rendering…';const index=Number($('level').value),r=await render(index);if(lastURL)URL.revokeObjectURL(lastURL);lastURL=URL.createObjectURL(wave(r.buffer));$('listen').src=lastURL;$('download').href=lastURL;$('download').download='ikigai-'+(index+1)+'-mix.wav';$('download').hidden=false;$('result').textContent=`${r.pass?'PASS':'FAIL'} · ${scoreFor(LEVELS[index]).title}\nStereo peak ${r.peak.toFixed(4)} · RMS ${r.rms.toFixed(4)} · 8 seconds\nThe player above contains the rendered browser audio.`;}catch(e){$('result').textContent='FAIL: '+e.stack;}};
$('validate').onclick=async()=>{const lines=[];for(const l of LEVELS){try{const r=await render(l.index);lines.push(`${r.pass?'PASS':'FAIL'} ${l.index+1}: peak ${r.peak.toFixed(3)}, RMS ${r.rms.toFixed(3)} · ${scoreFor(l).title}`);}catch(e){lines.push('FAIL '+l.index+': '+e.message);}$('result').textContent=lines.join('\n');}lines.push(lines.every(l=>l.startsWith('PASS'))?'27 / 27 audio mixes pass.':'Audio validation failed.');$('result').textContent=lines.join('\n');};
$('benchmark').onclick=()=>{const lines=[];for(const {p,g} of views){const begin=performance.now();for(let n=0;n<120;n++){g.time=10+n/60;p.draw(g,g.time,false,false);}lines.push(g.level.biome+': '+((performance.now()-begin)/120).toFixed(2)+' ms / frame at '+p.canvas.width+'×'+p.canvas.height);} $('result').textContent=lines.join('\n');};
