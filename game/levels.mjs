import { CHAPTERS } from './chapters.mjs';

export const HEROES = [
  {id:'ember',name:'Ember',role:'The Wanderer',description:'A steady heart and a curious spirit.',trait:'Balanced · 5 hearts',hp:5,speed:155,reach:68,dashCooldown:1.1,coat:'#e8ad60',cape:'#ad663e',hair:'#4a3b2d',skin:'#efd3a2',accent:'#f5d486',hat:'#799778'},
  {id:'reed',name:'Reed',role:'The Wayfinder',description:'Light on their feet. Always one step ahead.',trait:'Faster movement · 4 hearts',hp:4,speed:180,reach:68,dashCooldown:.85,coat:'#6fbdaf',cape:'#306c69',hair:'#293d40',skin:'#bc805a',accent:'#c1e1bd',hat:'#ced7a2'},
  {id:'flint',name:'Flint',role:'The Guardian',description:'Patient, grounded, and hard to knock down.',trait:'Sturdier · 6 hearts',hp:6,speed:140,reach:68,dashCooldown:1.25,coat:'#8da6bb',cape:'#485b80',hair:'#d7cfb5',skin:'#81563f',accent:'#d8d9ce',hat:'#526b82'},
  {id:'wren',name:'Wren',role:'The Lantern Keeper',description:'A longer reach for the things that matter.',trait:'Longer strike · 5 hearts',hp:5,speed:150,reach:86,dashCooldown:1.15,coat:'#b797cf',cape:'#705482',hair:'#633e37',skin:'#e7b49b',accent:'#f3d19d',hat:'#9487b0'}
];
export const heroById=id=>HEROES.find(h=>h.id===id)||HEROES[0];
export const THEMES = {
  forest:{name:'The living forest',ground:'#638354',fleck:'#526f4c',light:'#a1ac6d',cliff:'#405e46',cliffFace:'#526b4f',edge:'#aec07a',path:'#c5b585',tree:'#386a45',water:'#367f78',accent:'#f7cc79',sky:'#204b49'},
  ruins:{name:'The blue stone ruins',ground:'#667f89',fleck:'#536974',light:'#a3b3af',cliff:'#394e62',cliffFace:'#526776',edge:'#a9bdbb',path:'#c2c8b2',tree:'#4b7279',water:'#44788f',accent:'#afe3ed',sky:'#203747'},
  marsh:{name:'The lantern wetlands',ground:'#487e70',fleck:'#336658',light:'#87ad89',cliff:'#214f49',cliffFace:'#38695b',edge:'#9ab99a',path:'#b9b58d',tree:'#397b67',water:'#2a596a',accent:'#9ae1cb',sky:'#163b44'},
  canyon:{name:'The copper canyons',ground:'#ad8863',fleck:'#92714f',light:'#cbb78a',cliff:'#694e40',cliffFace:'#936b4c',edge:'#d9bd86',path:'#e3cc9e',tree:'#92784e',water:'#568b8d',accent:'#ffd393',sky:'#453b3a'},
  dusk:{name:'The violet ridgelands',ground:'#79718b',fleck:'#5d5c77',light:'#aaa1b8',cliff:'#454259',cliffFace:'#655d7b',edge:'#b4abc6',path:'#ccbdac',tree:'#6c658c',water:'#697a9e',accent:'#e7bcf1',sky:'#37344e'},
  summit:{name:'The cloud gardens',ground:'#b5c4b6',fleck:'#95aa9e',light:'#e4e4cb',cliff:'#6e8890',cliffFace:'#8ca4a0',edge:'#e1e7d0',path:'#e6dcb9',tree:'#98b8a4',water:'#80b9c3',accent:'#ffe7ab',sky:'#5d8091'}
};
// Each stop has its own objective, encounter mix, layout seed and guardian.
const specs = [
 ['collect','Curiosity|Play|Courage','Find your three sparks','The Doubtkeeper','charge','forest','none'],
 ['rescue','Listener|Neighbor|Friend','Find the people who need your work','The Echo','volley','forest','bramble'],
 ['sequence','First try|Another try|One more','Strike the practice runes in order','The Mirror Knight','charge','ruins','pulse'],
 ['wardens','Patience|Ingenuity|Clarity','Reclaim three portable skills','The Old Armor','stomp','ruins','none'],
 ['collect','An hour|A day|A choice','Gather a little breathing room','The Clockwork Maw','volley','canyon','pulse'],
 ['beacons','Notice|Choose|Begin','Light a path you choose yourself','The Drifter','charge','canyon','bramble'],
 ['rescue','One person|One place|One hour','Help three small corners of the world','The Overwhelm','stomp','marsh','none'],
 ['beacons','Training|Support|A living','Light a sustainable way to serve','The Hollow Lantern','volley','marsh','pulse'],
 ['collect','A sketch|A song|A first draft','Make room for what you love','The Monday Shade','charge','forest','bramble'],
 ['wardens','Craft|Value|A fair price','Defeat the story that art must suffer','The Gilded Critic','volley','dusk','pulse'],
 ['sequence','Learn|Unlearn|Try again','Break your old pattern in order','The Familiar','stomp','ruins','bramble'],
 ['wardens','Evidence|Your number|Ask','Recover the courage to name a price','The Bargain King','volley','canyon','pulse'],
 ['beacons','Enough|Space|Freedom','Break the three golden chains','The Golden Jailer','stomp','canyon','none'],
 ['rescue','A spark|A voice|A choice','Find the joy buried under duty','The Burden Bearer','charge','marsh','bramble'],
 ['sequence','Ask|Learn|Practice','Build a foundation before the leap','The Impostor','volley','ruins','pulse'],
 ['beacons','Budget|Follow through|Measure','Light the unglamorous skills','The Wishmaker','stomp','marsh','pulse'],
 ['collect','A free hour|A private joy|A day off','Protect a corner of your craft','The Joy Thief','charge','forest','bramble'],
 ['rescue','A need|A person|A collaboration','Point your craft toward someone','The Lone Virtuoso','volley','dusk','pulse'],
 ['sequence','Teach|Share|Serve','Take mastery beyond yourself','The Stone Master','stomp','ruins','pulse'],
 ['beacons','Curiosity|Humility|A new name','Let the old title fall away','The Crownless','charge','dusk','bramble'],
 ['collect','A small yes|A new direction|A real want','Find what still lights you up','The Velvet Void','volley','canyon','pulse'],
 ['wardens','Pride|Mastery|Meaning','Earn a new love for the work','The Unfinished','stomp','ruins','bramble'],
 ['rescue','Rest|A boundary|Yourself','Put yourself on the list of people to help','The Empty Cup','volley','marsh','pulse'],
 ['wardens','Outcomes|Costs|Fair support','Build a mission that can support you','The Martyr King','charge','canyon','pulse'],
 ['beacons','The work|The craft|The real thing','Release the dream and keep the work','The Dream Phantom','stomp','dusk','bramble'],
 ['sequence','Notice|Adjust|Begin again','Find balance when the circles move','The False Summit','volley','summit','pulse'],
 ['beacons','Love|Skill|Need|Livelihood','Bring the four faces together','The Mountain Within','cycle','summit','pulse']
];
const stairsX=[[192,640,416],[640,192,416],[320,640,496],[640,320,336],[128,544,416],[544,128,496],[256,512,336],[512,256,416]];
const enemySets={
  forest:['slime','thorn','wisp'],ruins:['beetle','sentinel','thorn'],
  marsh:['wisp','bat','slime'],canyon:['beetle','sentinel','bat'],
  dusk:['bat','thorn','wisp'],summit:['sentinel','wisp','beetle']
};
const noise=(a,b)=>{let n=Math.sin(a*127.1+b*311.7)*43758.5453;return n-Math.floor(n);};
function segmentDistance(x,y,a,b){
  const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy||1)));
  return Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t);
}
export const LEVELS=specs.map((spec,index)=>{
  const [kind,names,objective,bossName,pattern,biome,hazardKind]=spec,chapter=CHAPTERS[index];
  const height=index===0?1440:[1440,1376,1536,1472][index%4],width=960;
  const xs=stairsX[index%stairsX.length];
  const stairs=[{x:xs[0],y:height-384,w:128,h:64},{x:xs[1],y:height-736,w:128,h:64},{x:xs[2],y:352,w:128,h:64}];
  const [s1,s2,gate]=stairs,center=s=>s.x+s.w/2;
  const spawn={x:480,y:height-100},beacon={x:center(gate),y:112};
  const points=[{x:center(s1)<480?760:200,y:height-220},{x:center(s1)<480?160:800,y:(s1.y+s2.y)/2-10},{x:center(s2)>480?800:160,y:(s2.y+352)/2+12}];
  if(index===0){points[1].y=870;points[2].y=540;}
  if(index===26)points.push({x:center(gate),y:455});
  const goals=names.split('|').map((name,i)=>({id:index===0?['curiosity','practice','courage'][i]:'goal-'+i,...points[i],name,order:i,words:chapter.question}));
  const g1=goals[0],g2=goals[1],g3=goals[2];
  const paths=[
    [[spawn.x, height-32],[spawn.x,spawn.y],[g1.x,spawn.y],[g1.x,g1.y]],
    [[g1.x,g1.y],[g1.x,s1.y+136],[center(s1),s1.y+136],[center(s1),s1.y-46],[g2.x,g2.y]],
    [[g2.x,g2.y],[g2.x,s1.y-96],[center(s2),s1.y-96],[center(s2),s2.y-52],[g3.x,g3.y]],
    [[g3.x,g3.y],[g3.x,s2.y-72],[center(gate),s2.y-72],[center(gate),300],[beacon.x,beacon.y]]
  ];
  const nearPath=(x,y)=>paths.some(p=>p.some((v,i)=>i&&segmentDistance(x,y,p[i-1],v)<82));
  const rocks=[];
  for(let j=0;j<36;j++){
    const x=80+noise(j,index+4)*740,y=440+noise(j+15,index+2)*(height-570);
    if(nearPath(x,y)||stairs.some(s=>Math.abs(s.y+32-y)<110)||goals.some(g=>Math.hypot(g.x-x,g.y-y)<100)||rocks.some(r=>Math.hypot(r.x-x,r.y-y)<130))continue;
    rocks.push({x:x-25,y:y-16,w:50,h:32,kind:rocks.length%3===0?'pond':'rock'});
    if(rocks.length===7)break;
  }
  const types=enemySets[biome],enemies=[];
  goals.slice(0,3).forEach((g,i)=>{
    enemies.push(['guard-'+i,kind==='wardens'?'beetle':types[i%3],g.x+(g.x>480?-48:48),g.y-35]);
    enemies.push(['roamer-'+i,types[(i+1)%3],(g.x+480)/2,g.y+35]);
    if(index>8)enemies.push(['hunter-'+i,types[(i+2)%3],(g.x+480)/2+35,g.y-25]);
  });
  enemies.push(['keeper','boss',beacon.x,200]);
  const hazards=hazardKind==='none'?[]:goals.slice(0,3).map((g,i)=>({
    x:(g.x+480)/2-42,y:g.y+62,w:84,h:30,kind:hazardKind,offset:i*.9+index*.2
  }));
  return {id:chapter.id,index,chapter,kind,objective,bossName,pattern,biome,theme:THEMES[biome],width,height,stairs,rocks,paths,goals,enemies,hazards,spawn,beacon,
    bossHp:index===0?12:12+Math.floor(index/7)*2,
    instructions:kind==='collect'?'Walk into each glowing spark.':kind==='sequence'?'Strike the numbered runes in order: 1, 2, 3.':kind==='rescue'?'Defeat the nearby monsters, then approach each spirit.':kind==='wardens'?'Defeat each armored guardian, then claim its sigil.':'Strike each unlit shrine to awaken it.',
    checkpoint:{x:center(gate),y:gate.y+103}};
});
export const levelAt=index=>LEVELS[Number.isInteger(index)&&index>=0&&index<LEVELS.length?index:0];
