import { scoreFor, midiHz, AUDIO_KEY, audioPreferences } from './score.mjs';
const limit=(v,a,b)=>Math.max(a,Math.min(b,v));
export class MountainAudio {
 constructor(storage,options={}){
  this.storage=storage;this.createContext=options.createContext||(()=>new (window.AudioContext||window.webkitAudioContext)({latencyHint:'interactive'}));
  let stored;try{stored=JSON.parse(storage?.getItem(AUDIO_KEY));}catch{}
  this.preferences=audioPreferences(stored);this.context=null;this.timer=0;this.score=null;this.sceneId=null;this.nodes=new Set();this.lastEffects=new Map();
  this.hidden=false;this.narrating=false;this.paused=true;this.battle=false;this.enabled=false;this.eventIndex=0;this.cycle=0;this.stepPhase=0;this.failed=false;this.musicNodes=new Set();
 }
 async unlock(){
  try{
   if(!this.context){this.context=this.createContext();this.buildGraph();}
   if(this.context.state==='suspended')await this.context.resume();
   this.failed=false;this.schedule();this.startTimer();return true;
  }catch{this.failed=true;return false;}
 }
 buildGraph(){
  const c=this.context;
  this.master=c.createGain();this.master.gain.value=.72;
  const compressor=c.createDynamicsCompressor();compressor.threshold.value=-16;compressor.knee.value=15;compressor.ratio.value=5;compressor.attack.value=.006;compressor.release.value=.18;
  this.master.connect(compressor);compressor.connect(c.destination);
  this.musicBus=c.createGain();this.effectsBus=c.createGain();this.musicBus.gain.value=0;this.effectsBus.gain.value=0;this.musicBus.connect(this.master);this.effectsBus.connect(this.master);
  this.reverb=c.createConvolver();const length=Math.floor(c.sampleRate*1.7),impulse=c.createBuffer(2,length,c.sampleRate);
  let seed=7141;for(let channel=0;channel<2;channel++){const data=impulse.getChannelData(channel);for(let i=0;i<length;i++){seed=(seed*1664525+1013904223)>>>0;data[i]=(seed/2147483648-1)*Math.pow(1-i/length,3)*.45;}}
  this.reverb.buffer=impulse;const wet=c.createGain();wet.gain.value=.27;this.musicBus.connect(this.reverb);this.reverb.connect(wet);wet.connect(this.master);
  this.noise=c.createBuffer(1,c.sampleRate,c.sampleRate);const data=this.noise.getChannelData(0);for(let i=0;i<data.length;i++){seed=(seed*1664525+1013904223)>>>0;data[i]=seed/2147483648-1;}
  this.mix();
 }
 startTimer(){if(!this.timer&&!this.hidden)this.timer=setInterval(()=>this.schedule(),35);}
 stopTimer(){if(this.timer)clearInterval(this.timer);this.timer=0;}
 setPreferences(patch){this.preferences=audioPreferences({...this.preferences,...patch});try{this.storage?.setItem(AUDIO_KEY,JSON.stringify(this.preferences));}catch{}this.mix();}
 mix(){
  if(!this.context)return;const at=this.context.currentTime,p=this.preferences;
  const music=this.enabled&&p.music&&!this.hidden&&!this.narrating?p.musicVolume*(this.paused?.24:1)*.6:0;
  const effects=p.effects&&!this.hidden?p.effectsVolume*.7:0,signature=music+':'+effects;if(this.mixSignature===signature)return;this.mixSignature=signature;
  this.musicBus.gain.setTargetAtTime(music,at,.12);this.effectsBus.gain.setTargetAtTime(effects,at,.025);
 }
 setChapter(level){
  if(this.sceneId===level.id)return;
  this.sceneId=level.id;this.score=scoreFor(level);this.enabled=true;this.battle=false;
  this.stopVoices(this.musicNodes);this.eventIndex=0;this.cycle=0;this.origin=this.context?this.context.currentTime+.08:0;this.mix();
 }
 setState({paused=this.paused,narrating=this.narrating,hidden=this.hidden,battle=this.battle}={}){
  const wasHidden=this.hidden;this.paused=paused;this.narrating=narrating;this.hidden=hidden;this.battle=battle;this.mix();
  if(hidden&&!wasHidden){this.stopTimer();this.context?.suspend().catch(()=>{});}
  else if(!hidden&&wasHidden&&this.context){this.context.resume().then(()=>{this.schedule();this.startTimer();}).catch(()=>{});}
 }
 schedule(){
  const c=this.context,s=this.score;if(!c||c.state!=='running'||!s||!this.enabled||this.hidden)return;
  if(!this.origin)this.origin=c.currentTime+.06;
  const beat=60/s.bpm,loop=s.beats*beat;
  // A throttled tab never catches up by playing a backlog of notes.
  let at=this.origin+this.cycle*loop+s.events[this.eventIndex].beat*beat;
  if(at<c.currentTime-.15){this.origin=c.currentTime+.06;this.cycle=0;this.eventIndex=0;}
  let scheduled=0;
  while(scheduled++<100){
   const e=s.events[this.eventIndex];at=this.origin+this.cycle*loop+e.beat*beat;if(at>c.currentTime+.12)break;
   if(this.preferences.music&&!this.narrating&&(!e.battle||this.battle))this.note(e,at,beat);
   this.eventIndex++;if(this.eventIndex===s.events.length){this.eventIndex=0;this.cycle++;}
  }
 }
 voice({at,duration,frequency=440,endFrequency=null,type='sine',volume=.1,pan=0,noise=false,filter=0,highpass=false,attack=.007,music=false}){
  const c=this.context;if(!c||this.nodes.size>100)return;
  const source=noise?c.createBufferSource():c.createOscillator(),gain=c.createGain(),tail=Math.max(.025,duration),bus=music?this.musicBus:this.effectsBus;
  if(noise)source.buffer=this.noise;else{source.type=type;source.frequency.setValueAtTime(Math.max(20,frequency),at);if(endFrequency)source.frequency.exponentialRampToValueAtTime(Math.max(20,endFrequency),at+tail*.8);}
  gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),at+Math.min(attack,tail*.3));gain.gain.exponentialRampToValueAtTime(.0001,at+tail);
  const intermediates=[];let output=source;
  if(filter){const f=c.createBiquadFilter();f.type=highpass?'highpass':'lowpass';f.frequency.value=filter;f.Q.value=.65;output.connect(f);output=f;intermediates.push(f);}
  output.connect(gain);
  if(c.createStereoPanner){const stereo=c.createStereoPanner();stereo.pan.value=limit(pan,-1,1);gain.connect(stereo);stereo.connect(bus);intermediates.push(stereo);}else gain.connect(bus);
  const handle={source,gain};this.nodes.add(handle);if(music)this.musicNodes.add(handle);
  source.onended=()=>{source.disconnect();gain.disconnect();intermediates.forEach(n=>n.disconnect());this.nodes.delete(handle);this.musicNodes.delete(handle);};
  source.start(at);source.stop(at+tail+.02);
 }
 note(e,at,beat){
  const frequency=midiHz(e.note),common={at,duration:e.duration*beat,frequency,volume:e.velocity,pan:e.pan,music:true};
  if(e.instrument==='pad'){this.voice({...common,type:this.score.pad,volume:e.velocity*.52,attack:.32,filter:1300});return;}
  if(e.instrument==='bass'){this.voice({...common,type:'triangle',filter:520,attack:.015});return;}
  if(e.instrument==='kick'||e.instrument==='war-drum'){this.voice({...common,frequency:e.instrument==='kick'?100:130,endFrequency:36,type:'sine',duration:.24});return;}
  if(e.instrument==='rim'||e.instrument==='hat'){this.voice({...common,noise:true,filter:e.instrument==='hat'?6500:1600,highpass:true,volume:e.velocity*.48,duration:e.instrument==='hat'?.035:.055});return;}
  if(e.instrument==='glass'||e.instrument==='bell'){
   this.voice({...common,type:'sine',duration:Math.max(.55,common.duration),volume:e.velocity*.65});
   this.voice({...common,frequency:frequency*(e.instrument==='glass'?2:3),type:'sine',duration:.24,volume:e.velocity*.12});return;
  }
  this.voice({...common,type:e.instrument==='pulse'?'square':'triangle',filter:e.instrument==='pulse'?950:2800,volume:e.velocity*(e.instrument==='pulse'?.45:1)});
 }
 effect(type,position=null){
  const c=this.context;if(!c||c.state!=='running'||!this.preferences.effects||this.hidden)return;
  const now=c.currentTime,last=this.lastEffects.get(type)??-100;
  const gap=type==='hit'?.045:type==='step'?.23:.09;if(now-last<gap)return;this.lastEffects.set(type,now);
  const pan=position?limit((position.x-480)/650,-.65,.65):0,at=now+.005;
  const v=(opts)=>this.voice({at,pan,...opts});
  const chime=(notes,spacing=.09,volume=.16)=>notes.forEach((n,i)=>v({at:at+i*spacing,frequency:midiHz(n),duration:.62,volume,type:'sine'}));
  const root=this.score?.root||50;
  switch(type){
   case 'strike':v({noise:true,filter:2400,highpass:true,duration:.12,volume:.14});v({frequency:560,endFrequency:150,duration:.11,volume:.07,type:'triangle'});break;
   case 'hit':v({noise:true,filter:2400,duration:.065,volume:.22});v({frequency:220,endFrequency:65,duration:.13,volume:.18,type:'triangle'});break;
   case 'dash':v({noise:true,filter:1100,duration:.26,volume:.2,attack:.05});v({frequency:300,endFrequency:900,duration:.18,volume:.055});break;
   case 'hurt':v({frequency:110,endFrequency:42,duration:.28,volume:.35,type:'triangle'});v({noise:true,filter:700,duration:.12,volume:.15});break;
   case 'step':v({noise:true,filter:650,duration:.045,volume:.055});break;
   case 'heal':chime([root+24,root+31],.1,.12);break;
   case 'spark':chime([root+12,root+16,root+19,root+26],.07,.17);break;
   case 'defeat':v({frequency:280,endFrequency:70,duration:.19,volume:.15});v({noise:true,filter:900,duration:.12,volume:.12});break;
   case 'warning':v({frequency:root===55?130:100,endFrequency:180,duration:.6,volume:.16,type:'triangle',attack:.12});break;
   case 'gate':chime([root,root+7,root+12,root+16,root+19,root+24],.11,.2);break;
   case 'guardian':chime([root,root+12,root+7,root+19,root+24],.13,.2);v({frequency:80,endFrequency:30,duration:.8,volume:.3});break;
   case 'won':chime([root+12,root+16,root+19,root+24,root+28,root+31,root+36],.14,.22);break;
   case 'fallen':chime([root+19,root+15,root+10,root],.18,.15);break;
   case 'zone':chime([root+19,root+24],.15,.075);break;
   case 'select':v({frequency:midiHz(root+24),duration:.13,volume:.08});break;
  }
 }
 footsteps(g){const phase=Math.floor(g.player.walk/3);if(phase!==this.stepPhase&&g.player.dashTime<=0)this.effect('step',g.player);this.stepPhase=phase;}
 stopVoices(set=this.nodes){if(!this.context)return;const at=this.context.currentTime;for(const n of set){n.gain.gain.cancelScheduledValues(at);n.gain.gain.setTargetAtTime(.0001,at,.025);try{n.source.stop(at+.12);}catch{}}}
 dispose(){this.stopTimer();this.stopVoices();this.context?.close().catch(()=>{});}
}
