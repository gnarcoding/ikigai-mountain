// Authored encounter rules. All progress advances through the same public simulation.
export const MODES={
 trail:{name:'Spark hunt',verb:'sparks',tip:'Explore for sparks. Chain three strikes for a sweeping finisher.'},
 escort:{name:'Spirit escort',verb:'waypoints',tip:'Lead the little spirit through each waypoint. Stay close: it waits when you run ahead.'},
 echo:{name:'Echo chamber',verb:'verses',tip:'Read the glowing verse, then tap Strike beside the matching rune pillars. Release between taps. A mistake restarts only this verse.'},
 arena:{name:'Wave arena',verb:'waves',tip:'Clear three waves in the central court. Each wave brings a different enemy formation.'},
 race:{name:'Dash rally',verb:'gates',tip:'Dash through the numbered rings in order. Each ring refreshes Dash. Race for gold; the clock never ends your run.'},
 storm:{name:'Storm ascent',verb:'seals',tip:'Dodge the marked falling stones. Strike the seals to open the summit. Dash and your special can save you.'},
 sanctuary:{name:'Sanctuary stand',verb:'wards',tip:'Stay inside the sanctuary circle to charge it. Lure monsters close, then use your special. Leaving pauses the charge.'},
 mirror:{name:'Mirror trial',verb:'mirrors',tip:'Stand near a mirror and strike its incoming bolt to send it back. Three reflected hits break each seal.'},
 heist:{name:'Relic heist',verb:'relics',tip:'Slip behind patrolling watchers to steal the relics. Their glowing cones raise an alarm. Fight or dash out of trouble.'}
};
export const RELICS=[
 {id:'comet',name:'Comet Fang',icon:'✦',text:'Your third-strike finisher hits harder.',color:'#ffc582'},
 {id:'zephyr',name:'Zephyr Feather',icon:'↝',text:'Dash recharges 35% faster. Move 10% faster.',color:'#a3e9dd'},
 {id:'moss',name:'Mossheart',icon:'❖',text:'Your special restores one heart and grants a longer shield.',color:'#bde5a4'}
];
export const POWERS={ember:{name:'Flare',tip:'A wide blast that burns nearby enemies.',cooldown:10},reed:{name:'Slipstream',tip:'A burst of speed that stuns nearby enemies.',cooldown:8},flint:{name:'Earthbreaker',tip:'An armored slam with a long stun.',cooldown:12},wren:{name:'Starcall',tip:'Homing light strikes distant enemies.',cooldown:10}};
const itinerary=['trail','escort','echo','arena','race','storm','sanctuary','mirror','heist','arena','echo','mirror','heist','escort','echo','sanctuary','race','escort','arena','heist','storm','mirror','sanctuary','arena','storm','race','storm'];
export const RUNE_SYMBOLS=['☀','☽','❖','✦'];
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function configureEncounter(l){
 l.legacyKind=l.kind;l.kind=itinerary[l.index];l.encounter=MODES[l.kind];l.remix=Math.floor(l.index/9);
 l.hasBoss=['trail','storm','heist'].includes(l.kind);l.instructions=l.encounter.tip;
 l.objective=({trail:'Find the sparks of your first adventure',escort:'Bring your spirit safely up the mountain',echo:'Play back the mountain’s rune verses',arena:'Survive the changing waves',race:'Dash the mountain’s racing line',storm:l.index===26?'Break the seals. Face the mountain within.':'Climb through the falling storm',sanctuary:'Charge the sanctuary through the siege',mirror:'Turn the mirrors’ magic against them',heist:'Steal the relics from the watchers'})[l.kind];
 l.par=({trail:100,escort:140,echo:105,arena:85,race:28,storm:110,sanctuary:85,mirror:100,heist:95})[l.kind]+l.remix*(l.kind==='race'?4:10);
 // Encounters use different spaces: compact courts, a puzzle garden, a slalom,
 // or the climbing trail. The gate is always the final stair in the catalogue.
 const court=['arena','echo','sanctuary','mirror'].includes(l.kind);
 if(court){
  l.height=1056;l.spawn={x:480,y:930};l.beacon={x:480,y:112};
  l.stairs=[{x:32,y:1300,w:896,h:64},{x:32,y:1400,w:896,h:64},{x:416,y:352,w:128,h:64}];
  const sites=l.kind==='mirror'?[[260,650],[700,650],[480,470]]:[[480,690],[480,690],[480,690]];
  l.goals=l.goals.map((g,i)=>({...g,x:sites[i][0],y:sites[i][1]}));
  l.paths=[[[480,960],[480,690]],[[220,690],[740,690]],[[480,880],[480,480]],[[480,690],[480,300],[480,112]]];
  l.rocks=[];l.hazards=[];l.checkpoint={x:480,y:455};
  l.runes=[{x:330,y:690},{x:480,y:540},{x:630,y:690},{x:480,y:840}];
 }
 if(l.kind==='race'){
  l.rocks=[];l.hazards=[];
  // Extra slalom rings span each terrace instead of three identical pickups.
  const route=l.paths.slice(0,3).flatMap(p=>p.slice(1));
  const points=route.filter((p,i)=>i===0||dist({x:p[0],y:p[1]},{x:route[i-1][0],y:route[i-1][1]})>80);
  l.goals=points.map(([x,y],i)=>({id:'gate-'+i,x,y,name:'Ring '+(i+1),order:i}));
  l.instructions+=' Target: '+l.par+' seconds.';
 }
 const boss=['keeper','boss',l.beacon.x,200];
 if(l.kind==='arena'||l.kind==='sanctuary'){
  l.enemies=[];
  for(let wave=0;wave<3;wave++){
   const types=wave===0?['slime','bat','slime']:wave===1?['thorn','wisp','beetle']:['sentinel','thorn','bat','beetle'];
   for(let j=0;j<types.length+l.remix;j++){const a=j/(types.length+l.remix)*Math.PI*2;l.enemies.push(['wave-'+wave+'-'+j,types[(j+l.index)%types.length],480+Math.cos(a)*205,690+Math.sin(a)*155,wave]);}
  }
 }
 if(l.kind==='echo'||l.kind==='mirror'||l.kind==='race')l.enemies=[];
 if(l.kind==='escort')l.enemies=l.enemies.filter(e=>e[0]!=='keeper'&&!e[0].startsWith('hunter'));
 if(l.kind==='heist')l.enemies=l.goals.flatMap((g,i)=>[['watch-'+i,'sentinel',g.x+(g.x>480?-115:115),g.y+20],['guard-'+i,'beetle',g.x,g.y-80]]);
 l.enemies=l.enemies.filter(e=>e[0]!=='keeper');l.enemies.push(boss);
 if(l.kind==='storm'){l.hazards=[];l.stormPeriod=2.4-l.remix*.25;}
 if(l.hasBoss){l.bossStyle=l.index===26?'mountain':['duelist','tempest','quake'][l.index%3];}
 return l;
}
export function runeVerse(g){const n=g.sparks.size,i=g.level.index;return Array.from({length:3+g.level.remix},(_,j)=>(i+n*2+j*(n%2?3:1))%4);}
export function initEncounter(g,raw=null){
 const f=(v,max)=>Number.isFinite(v)?Math.max(0,Math.min(max,v)):0;
 const l=g.level;
 g.challenge={charge:f(raw?.charge,12),runeStep:0,runeFlash:-1,flashTime:0,alarm:0,storm:[],stormClock:1.5,reflections:{},turretClock:0,
  escort:{x:l.spawn.x,y:l.spawn.y+30,r:10},history:[],hits:f(raw?.hits,999),score:f(raw?.score,99999),combo:0,comboTime:0,bestCombo:f(raw?.bestCombo,999)};
 if(raw?.escort&&Number.isFinite(raw.escort.x)&&Number.isFinite(raw.escort.y)&&raw.escort.x>=44&&raw.escort.x<=916&&raw.escort.y>=60&&raw.escort.y<=l.height-44)g.challenge.escort={x:raw.escort.x,y:raw.escort.y,r:10};
 g.challenge.history=Array.isArray(raw?.history)?raw.history.slice(-240).filter(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=44&&p.x<=916&&p.y>=60&&p.y<=l.height-44).map(p=>({x:p.x,y:p.y})):[];
 for(const goal of l.goals)g.challenge.reflections[goal.id]=f(raw?.reflections?.[goal.id],2);
 for(const e of g.enemies){if(e.wave!==undefined&&e.wave<g.sparks.size){e.hp=0;g.defeated.add(e.id);}e.dormant=e.wave!==undefined&&e.wave!==g.sparks.size;}
 if(!l.hasBoss){const boss=g.enemies.find(e=>e.id==='keeper');boss.hp=0;g.defeated.add('keeper');}
 // A spirit resumes alongside its guide when an older layout is migrated.
 if(!raw?.escort)g.challenge.escort={x:g.player.x,y:g.player.y+28,r:10};
}
export function encounterSnapshot(g){const c=g.challenge;return{charge:c.charge,history:c.history.map(p=>({...p})),escort:{...c.escort},reflections:{...c.reflections},hits:c.hits,score:c.score,bestCombo:c.bestCombo};}
export function encounterTarget(g){
 const l=g.level,c=g.challenge,next=l.goals.find(s=>!g.sparks.has(s.id));
 if(!next)return g.defeated.has('keeper')?l.beacon:{x:l.beacon.x,y:250};
 if(l.kind==='echo')return l.runes[runeVerse(g)[c.runeStep]];
 if(l.kind==='escort'&&dist(g.player,c.escort)>150)return c.escort;
 return next;
}
export function encounterStatus(g){
 const l=g.level,c=g.challenge;
 if(g.sparks.size===l.goals.length)return l.hasBoss&&!g.defeated.has('keeper')?'Summit guardian':'Exit open · follow the beacon';
 if(l.kind==='echo')return runeVerse(g).map((n,i)=>(i<c.runeStep?'✓':RUNE_SYMBOLS[n])).join('  ')+' · verse '+(g.sparks.size+1);
 if(l.kind==='arena')return 'Wave '+(g.sparks.size+1)+' · '+g.enemies.filter(e=>e.hp>0&&!e.dormant&&e.type!=='boss').length+' enemies';
 if(l.kind==='sanctuary')return 'Ward '+(g.sparks.size+1)+' · '+Math.floor(c.charge/10*100)+'% · stay in the circle';
 if(l.kind==='escort'&&c.frightened)return 'Mote is frightened · clear the nearby monsters';
 if(l.kind==='escort')return dist(g.player,c.escort)>150?'Your spirit is waiting behind you':'Spirit following · '+g.sparks.size+' / '+l.goals.length+' waypoints';
 if(l.kind==='mirror'){const goal=encounterTarget(g);return (c.reflections[goal.id]||0)+' / 3 reflections · '+g.sparks.size+' seals broken';}
 if(l.kind==='race')return Math.floor(g.seconds)+'s / '+l.par+'s gold pace · '+g.sparks.size+' / '+l.goals.length+' rings';
 if(l.kind==='heist')return c.alarm>0?'ALARM · watchers are firing':'Unseen · avoid the watchers’ cones';
 return l.kind==='storm'?'Marked ground is about to fall. Keep moving.':(c.combo>1?c.combo+' hit flow · keep it going':l.encounter.tip);
}
export function encounterStrike(g,api){
 const l=g.level,c=g.challenge,p=g.player;
 if(l.kind==='echo'&&g.sparks.size<l.goals.length){
  const rune=l.runes.findIndex(r=>dist(r,p)<60);if(rune<0)return;
  c.runeFlash=rune;c.flashTime=.55;
  if(rune===runeVerse(g)[c.runeStep]){c.runeStep++;api.emit(g,'rune',RUNE_SYMBOLS[rune]);if(c.runeStep===runeVerse(g).length){api.claim(g,l.goals[g.sparks.size]);c.runeStep=0;}}
  else{c.runeStep=0;api.emit(g,'miss','The verse starts again. Follow the symbols above.');}
 }
 if(l.kind==='storm')for(const goal of l.goals)if(dist(p,goal)<55)api.claim(g,goal);
}
export function updateEncounter(g,dt,api){
 const l=g.level,c=g.challenge,p=g.player,next=l.goals.find(s=>!g.sparks.has(s.id));
 c.comboTime=Math.max(0,c.comboTime-dt);if(!c.comboTime)c.combo=0;c.flashTime=Math.max(0,c.flashTime-dt);c.alarm=Math.max(0,c.alarm-dt);
 for(const e of g.enemies)if(e.wave!==undefined)e.dormant=e.wave!==g.sparks.size;
 if(l.kind==='escort'){
  // Breadcrumbs follow the actual walked route, so companions cannot cut cliffs.
  const tail=c.history.at(-1)||c.escort;if(dist(tail,p)>12)c.history.push({x:p.x,y:p.y});
  if(c.history.length>240)c.history.shift();
  c.frightened=g.enemies.some(e=>e.hp>0&&!e.dormant&&dist(e,c.escort)<75);
  if(!c.frightened&&dist(c.escort,p)<190&&dist(c.escort,p)>25){const target=c.history[0]||p,d=dist(c.escort,target);if(d<9)c.history.shift();else api.move(g,c.escort,(target.x-c.escort.x)/d*145*dt,(target.y-c.escort.y)/d*145*dt);}
  if(next&&dist(c.escort,next)<58&&dist(p,next)<85)api.claim(g,next);
 }
 if(l.kind==='arena'&&next&&!g.enemies.some(e=>e.hp>0&&!e.dormant&&e.type!=='boss'))api.claim(g,next);
 if(l.kind==='sanctuary'&&next){
  if(dist(p,next)<115)c.charge+=dt;
  if(c.charge>=10){c.charge=0;for(const e of g.enemies)if(e.wave===g.sparks.size){e.hp=0;g.defeated.add(e.id);}api.claim(g,next);api.emit(g,'power','Sanctuary restored. The next wave approaches.');}
 }
 if(l.kind==='race'&&next&&dist(p,next)<46&&p.dashTime>0){api.claim(g,next);p.dashCooldown=0;api.emit(g,'boost','Dash refreshed!');}
 if(l.kind==='trail'||l.kind==='heist')for(const goal of l.goals)if(!g.sparks.has(goal.id)&&dist(p,goal)<30){api.claim(g,goal);if(l.kind==='heist')c.alarm=4;}
 if(l.kind==='mirror'&&next){
  c.turretClock-=dt;
  if(c.turretClock<=0){c.turretClock=1.9-l.remix*.2;for(const goal of l.goals)if(!g.sparks.has(goal.id)&&dist(p,goal)<380){const a=Math.atan2(p.y-goal.y,p.x-goal.x);g.projectiles.push({x:goal.x,y:goal.y,vx:Math.cos(a)*115,vy:Math.sin(a)*115,life:5,mirror:goal.id});}}
 }
 if(l.kind==='storm'&&next){
  c.stormClock-=dt;if(c.stormClock<=0){c.stormClock=l.stormPeriod;const count=2+l.remix;for(let i=0;i<count;i++)c.storm.push({x:i?Math.max(60,Math.min(900,p.x+Math.sin(g.time*3+i)*130)):p.x,y:i?p.y+Math.cos(g.time*2+i)*85:p.y,life:1.25,hit:false});api.emit(g,'warning');}
  for(const s of c.storm){s.life-=dt;if(s.life<=.2&&!s.hit){s.hit=true;if(dist(p,s)<38)api.hurt(g,s);api.emit(g,'impact','',{x:s.x,y:s.y});}}c.storm=c.storm.filter(s=>s.life>0);
 }
}
export function rankFor(g){return g.deaths===0&&g.seconds<=g.level.par?'gold':g.deaths===0?'silver':'bronze';}
