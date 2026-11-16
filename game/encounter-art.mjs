import { encounterTarget, runeVerse, RUNE_SYMBOLS } from './encounters.mjs';
import { glow, sigil } from './scenery.mjs';
const circle=(c,x,y,r,color,fill=false)=>{c.beginPath();c.arc(x,y,r,0,Math.PI*2);if(fill){c.fillStyle=color;c.fill();}else{c.strokeStyle=color;c.lineWidth=3;c.stroke();}};
const label=(c,text,x,y,color='#fff2cf',size=13)=>{c.font='bold '+size+'px Zen,sans-serif';c.textAlign='center';c.fillStyle=color;c.fillText(text,x,y);};
export function paintEncounter(c,g,t){
 const l=g.level,s=g.challenge,next=encounterTarget(g),color=l.theme.accent;
 if(['arena','sanctuary','echo'].includes(l.kind)){
  circle(c,480,690,250,l.theme.cliffFace+'aa',true);circle(c,480,690,234,color+'55');circle(c,480,690,220,color+'44');
  for(let i=0;i<12;i++){const a=i*Math.PI/6;sigil(c,480+Math.cos(a)*236,690+Math.sin(a)*236,12,color,0,.65);}
 }
 if(l.kind==='arena'){
  label(c,'THE CRUCIBLE',480,470,color,16);label(c,'WAVE '+Math.min(3,g.sparks.size+1),480,704,color,30);
  for(const e of g.enemies)if(e.dormant&&e.hp>0&&e.wave===g.sparks.size+1){sigil(c,e.homeX,e.homeY,22,color,t*.3,.4);}
 }
 if(l.kind==='sanctuary'){
  circle(c,480,690,115,'#8cdcc822',true);circle(c,480,690,115,'#bcebd088');
  c.beginPath();c.arc(480,690,119,-Math.PI/2,-Math.PI/2+s.charge/10*Math.PI*2);c.strokeStyle='#d7ffb5';c.lineWidth=7;c.stroke();
  sigil(c,480,690,60,color,t*.1,.9);glow(c,480,690,125,'#a2eed2',.5);label(c,'HOLD THE LIGHT',480,700,color,12);
 }
 if(l.kind==='echo'){
  const verse=runeVerse(g);label(c,'ECHO CHAMBER',480,660,color,15);
  label(c,g.sparks.size<3?verse.map((r,i)=>i<s.runeStep?'✓':RUNE_SYMBOLS[r]).join('   '):'HARMONY',480,705,'#fff4cc',27);
  label(c,'TAP STRIKE AT A RUNE',480,739,'#d5dfde',10);
  for(const [i,r] of l.runes.entries()){
   const lit=s.flashTime>0&&s.runeFlash===i;circle(c,r.x,r.y,34,lit?'#e6d9a7':'#263e52',true);circle(c,r.x,r.y,36,color);sigil(c,r.x,r.y+18,43,color,0,.5);
   glow(c,r.x,r.y,lit?105:55,color,lit?.9:.3);label(c,RUNE_SYMBOLS[i],r.x,r.y+10,lit?'#18384a':color,32);
  }
 }
 if(l.kind==='mirror')for(const goal of l.goals){
  const done=g.sparks.has(goal.id),count=s.reflections[goal.id]||0;
  sigil(c,goal.x,goal.y,45,done?'#a2ebd0':'#c2b4fa',t*.2,.8);glow(c,goal.x,goal.y-22,90,'#b7bbfc',.6);
  c.save();c.translate(goal.x,goal.y-20);c.rotate(Math.PI/4);c.fillStyle=done?'#7ccbab':'#788cc4';c.fillRect(-20,-20,40,40);c.strokeStyle='#e3f7ff';c.lineWidth=3;c.strokeRect(-20,-20,40,40);c.restore();
  label(c,done?'BROKEN':('◆'.repeat(count)+'◇'.repeat(3-count)),goal.x,goal.y+43,'#e7daff',14);
 }
 if(l.kind==='race')for(const goal of l.goals){
  const done=g.sparks.has(goal.id),active=goal===next;
  circle(c,goal.x,goal.y,41,done?'#8ed3b744':active?'#ffdfa1':'#b6cad277');circle(c,goal.x,goal.y,34,active?'#ffefa533':'#9acbb411',true);
  if(active)glow(c,goal.x,goal.y,84,color,.7);label(c,done?'✓':String(goal.order+1),goal.x,goal.y+7,done?'#aacfb3':color,22);
  if(active)label(c,'DASH THROUGH',goal.x,goal.y-55,color,10);
 }
 if(l.kind==='escort'){
  const f=s.escort;glow(c,f.x,f.y-18,67,color,.6);circle(c,f.x,f.y-17+Math.sin(t*4)*3,13,'#d4f6d3',true);
  circle(c,f.x-4,f.y-19,2,'#32544b',true);circle(c,f.x+5,f.y-19,2,'#32544b',true);label(c,'MOTE',f.x,f.y+16,'#def3cf',9);
  if(g.sparks.size<l.goals.length){circle(c,next.x,next.y,55,color+'77');label(c,'BRING MOTE HERE',next.x,next.y+67,color,10);}
 }
 if(l.kind==='heist')for(const e of g.enemies)if(e.type==='sentinel'&&e.hp>0){
  c.save();c.translate(e.x,e.y);c.rotate(e.look);c.beginPath();c.moveTo(0,0);c.arc(0,0,215,-.76,.76);c.closePath();c.fillStyle=s.alarm>0?'#ff82683c':'#ffda8224';c.fill();c.restore();
  label(c,s.alarm>0?'!':'◦',e.x,e.y-55,s.alarm>0?'#ffa58d':color,23);
 }
 for(const rock of s.storm){
  const progress=1-rock.life/1.25;circle(c,rock.x,rock.y,38,rock.hit?'#ffca8caa':'#ef917c44',true);circle(c,rock.x,rock.y,38,'#ffd399');
  c.beginPath();c.arc(rock.x,rock.y,43,-Math.PI/2,-Math.PI/2+progress*Math.PI*2);c.strokeStyle='#fff2ca';c.lineWidth=4;c.stroke();
  if(!rock.hit){label(c,'!',rock.x,rock.y+7,'#fff1d4',20);const y=rock.y-(1-progress)*160;c.save();c.translate(rock.x,y);c.rotate(progress*3);c.fillStyle='#d0aa82';c.fillRect(-10,-10,20,20);c.restore();}
 }
}
