/* Original, deterministic chapter compositions. No samples or network requests. */
export const TRACK_NAMES=[
 'A Spark Before Dawn','The Listening Woods','Fragments of Practice','Stone Remembers',
 'Borrowed Hours','The Unwritten Road','Little Lanterns','A Light That Lasts',
 'Sunday Wildflowers','Gold in the Ashes','Unlearning the Mirror','Name Your Worth',
 'Gilded Gravity','Under the Weight','The Courage to Be New','The Quiet Work',
 'A Room of Your Own','Across the Violet Distance','Beyond the Plateau','Lay Down the Crown',
 'What Still Burns','Love, Learned Slowly','Fill Your Own Cup','A Mission That Lives',
 'Bury the Perfect Dream','The Moving Horizon','All Roads Become One'
];
const VOICES={
 forest:{root:50,scale:[0,2,4,7,9],bpm:88,voice:'harp',pad:'sine',progression:[0,3,1,4]},
 ruins:{root:50,scale:[0,3,5,7,10],bpm:94,voice:'glass',pad:'triangle',progression:[0,2,3,1]},
 marsh:{root:48,scale:[0,2,5,7,9],bpm:80,voice:'bell',pad:'sine',progression:[0,3,2,4]},
 canyon:{root:45,scale:[0,2,4,7,9],bpm:102,voice:'harp',pad:'triangle',progression:[0,4,3,1]},
 dusk:{root:48,scale:[0,3,5,7,10],bpm:86,voice:'glass',pad:'sine',progression:[0,3,4,2]},
 summit:{root:55,scale:[0,2,4,7,9],bpm:92,voice:'bell',pad:'sine',progression:[0,1,3,4]}
};
export const midiHz=n=>440*Math.pow(2,(n-69)/12);
function degree(scale,n){const octave=Math.floor(n/scale.length);return scale[((n%scale.length)+scale.length)%scale.length]+12*octave;}
export function scoreFor(level){
 const index=level.index,v=VOICES[level.biome]||VOICES.forest,root=v.root+[0,2,-2,5,-3][index%5],bpm=v.bpm+(index%3)*4;
 const motif=Array.from({length:8},(_,i)=>[0,2,4,1,3,2,1,0][(i+index)%8]+(index%3===0&&i===4?2:0));
 const events=[];
 const add=(beat,instrument,note,duration,velocity,pan=0,battle=false)=>events.push({beat,instrument,note,duration,velocity,pan,battle});
 for(let bar=0;bar<16;bar++){
  const chord=v.progression[(Math.floor(bar/2)+Math.floor(index/6))%4],at=bar*4;
  if(bar%2===0)for(const [i,d] of [chord,chord+2,chord+4].entries())add(at,'pad',root+degree(v.scale,d),7.8,.115,(i-1)*.4);
  add(at,'bass',root-12+degree(v.scale,chord),1.5,.3);
  add(at+2,'bass',root-12+degree(v.scale,chord+(bar%2?2:0)),1.35,.22);
  for(let j=0;j<8;j++){
   const note=root+12+degree(v.scale,motif[j]+(bar%4===3?-1:0)+(Math.floor(bar/4)%2?2:0));
   if((j+index+bar)%7!==5)add(at+j*.5,v.voice,note,j%3===0?.9:.42,j%2===0?.2:.13,(j%3-1)*.32);
   if(j%2===0)add(at+j*.5+.25,'pluck',root+degree(v.scale,chord+[0,2,4,2][j/2]),.35,.09,j%4===0?-.55:.55);
  }
  add(at,'kick',0,.2,.35);if(bar%2===1)add(at+2.5,'kick',0,.18,.2);
  add(at+2,'rim',0,.08,.16);
  for(let j=0;j<8;j++)add(at+j*.5,'hat',0,.045,j%2?.06:.1,(j%2?1:-1)*.35);
  // Guardian layer enters over the same musical phrase rather than restarting it.
  for(const b of [1,2,3])add(at+b,'war-drum',root-24,.22,.38,0,true);
  for(const b of [1.5,3.5])add(at+b,'pulse',root+degree(v.scale,chord+2),.18,.16,b<2?-.35:.35,true);
 }
 return {index,title:TRACK_NAMES[index],bpm,root,voice:v.voice,pad:v.pad,beats:64,events:events.sort((a,b)=>a.beat-b.beat)};
}
export const AUDIO_KEY='ikigai-mountain:audio:v1';
export const DEFAULT_AUDIO={music:true,effects:true,musicVolume:.5,effectsVolume:.7};
export function audioPreferences(raw){const p={...DEFAULT_AUDIO};for(const key of ['music','effects'])if(typeof raw?.[key]==='boolean')p[key]=raw[key];for(const key of ['musicVolume','effectsVolume'])if(Number.isFinite(raw?.[key]))p[key]=Math.max(0,Math.min(1,raw[key]));return p;}
