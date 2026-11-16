import { clamp, hazardPhase } from './engine.mjs';
import { levelAt, heroById } from './levels.mjs';
const hash=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
const rect=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
function poly(c,points,color){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
function oval(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
function line(c,points,width,color){c.strokeStyle=color;c.lineWidth=width;c.lineJoin='round';c.lineCap='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
function tree(c,x,y,s=1,type=0,theme=null,biome='forest'){
  c.save();c.translate(Math.round(x),Math.round(y));c.scale(s,s);
  oval(c,5,1,24,9,'#102d2859');rect(c,-4,-30,8,32,'#695840');rect(c,-1,-30,3,29,'#ad8c54');
  if(biome==='ruins'){
    poly(c,[[-22,0],[-13,-48],[0,-78],[12,-43],[23,0]],theme?.tree||'#587c8b');
    poly(c,[[0,-78],[5,-12],[23,0],[12,-43]],theme?.light||'#9bc5cb');
    rect(c,-8,-40,3,16,'#d5eae0');c.restore();return;
  }
  if(biome==='canyon'){
    rect(c,-7,-60,14,62,'#6e8961');rect(c,-22,-35,18,9,'#758d61');rect(c,-23,-52,8,22,'#8ba46b');
    rect(c,6,-22,19,9,'#687b50');rect(c,18,-39,8,25,'#7d925e');rect(c,-3,-55,2,50,'#adc184');c.restore();return;
  }
  if(type===0){
    poly(c,[[-28,-16],[0,-68],[28,-16]],'#183e32');
    poly(c,[[-25,-27],[0,-76],[25,-27]],'#24563d');
    poly(c,[[-20,-41],[0,-85],[20,-41]],theme?.tree||'#386a45');
    poly(c,[[-13,-56],[0,-87],[5,-58]],theme?.light||'#678347');
    rect(c,-18,-33,6,3,'#527449');rect(c,8,-18,5,2,'#42633b');
  }else{
    const leaf=theme?[theme.tree,theme.ground,theme.light]:['#3d6d49','#638b50','#91a55b'];
    for(let i=0;i<9;i++){let a=i*2.4;oval(c,Math.cos(a)*16,-41+Math.sin(a)*15,18,16,leaf[i%3]);}
    rect(c,-4,-65,6,4,'#b0ba6b');rect(c,12,-46,7,3,'#a0b062');
  }c.restore();
}
function rock(c,b){
  if(b.kind==='pond'){
    oval(c,b.x+b.w/2,b.y+b.h/2,b.w/2+8,b.h/2+6,'#a2ac7180');
    oval(c,b.x+b.w/2,b.y+b.h/2,b.w/2,b.h/2,'#285f60');
    oval(c,b.x+b.w/2,b.y+b.h/2,b.w/2-9,b.h/2-8,'#367f78');
    for(let i=0;i<9;i++){const x=b.x+18+hash(i,8)*(b.w-36),y=b.y+13+hash(i,9)*(b.h-26);rect(c,x,y,14,2,'#8bb8a67a');}
    for(let i=0;i<3;i++){oval(c,b.x+25+i*43,b.y+b.h/2+(i%2)*15,10,5,'#9bb272');rect(c,b.x+20+i*43,b.y+b.h/2+(i%2)*15,3,3,'#d2cb83');}
  }else if(b.kind==='tent'){
    oval(c,b.x+b.w/2,b.y+b.h,b.w*.6,10,'#1a382d55');
    poly(c,[[b.x-8,b.y+b.h],[b.x+b.w/2,b.y-20],[b.x+b.w+8,b.y+b.h]],'#d8af6b');
    poly(c,[[b.x+b.w/2,b.y-20],[b.x+b.w/2,b.y+b.h],[b.x+b.w+8,b.y+b.h]],'#af784a');
    poly(c,[[b.x+b.w/2,b.y+9],[b.x+16,b.y+b.h],[b.x+59,b.y+b.h]],'#354b38');
    line(c,[[b.x+b.w/2,b.y-25],[b.x+b.w/2,b.y+b.h]],2,'#f5d490');
  }else{
    poly(c,[[b.x,b.y+b.h],[b.x-5,b.y+18],[b.x+14,b.y],[b.x+b.w-15,b.y-6],[b.x+b.w+3,b.y+17],[b.x+b.w,b.y+b.h]],'#4a5e4e');
    poly(c,[[b.x-5,b.y+18],[b.x+14,b.y],[b.x+b.w-15,b.y-6],[b.x+b.w+3,b.y+17],[b.x+b.w*.4,b.y+29]],'#819178');
    rect(c,b.x+12,b.y+3,17,4,'#a5af88');rect(c,b.x+b.w-15,b.y+24,8,16,'#344e40');
  }
}
function brazier(c,x,y,t,lit=true){
  oval(c,x,y+12,24,8,'#183d2b66');
  rect(c,x-15,y-6,30,14,'#747f64');rect(c,x-11,y+6,22,8,'#3c5749');
  rect(c,x-20,y-10,40,7,'#c4c299');rect(c,x-15,y-8,30,3,'#e4d6a4');
  if(lit){
    const h=3*Math.sin(t*7);
    oval(c,x,y-13,35,32,'#f5c56513');
    poly(c,[[x-12,y-11],[x-10,y-27],[x-3,y-21],[x+4,y-43+h],[x+12,y-24],[x+10,y-10]],'#f0a950');
    poly(c,[[x-7,y-11],[x,y-32+h],[x+7,y-14]],'#ffe3a0');
  }
}
function sparkle(c,x,y,size,color){
  poly(c,[[x,y-size],[x+size*.3,y-size*.3],[x+size,y],[x+size*.3,y+size*.3],[x,y+size],[x-size*.3,y+size*.3],[x-size,y],[x-size*.3,y-size*.3]],color);
}
function player(c,p,t,reduced=false,hero=heroById('ember')){
  c.save();c.translate(Math.round(p.x),Math.round(p.y));
  if(p.invulnerable>0&&Math.floor(t*12)%2&&!reduced)c.globalAlpha=.5;
  oval(c,0,3,16,6,'#0f302b66');
  const walk=Math.sin(p.walk)*2;
  rect(c,-8,-3+walk,6,8,'#2d403b');rect(c,3,-3-walk,6,8,'#2d403b');
  poly(c,[[-12,-21],[-9,0],[12,0],[9,-23]],hero.cape);
  rect(c,-8,-24,16,19,hero.coat);rect(c,-8,-9,16,4,'#9b6d45');
  rect(c,-6,-37,13,14,hero.skin);rect(c,-8,-38,17,6,hero.hair);rect(c,-8,-33,5,8,hero.hair);
  rect(c,-8,-40,15,4,hero.hat);rect(c,6,-39,6,6,hero.hat);
  rect(c,-12,-23,5,12,hero.skin);rect(c,8,-23,5,12,hero.skin);
  if(hero.id==='reed'){poly(c,[[7,-40],[15,-51],[13,-34]],hero.accent);}
  if(hero.id==='flint'){rect(c,-10,-39,20,5,hero.hat);rect(c,-12,-23,6,9,hero.accent);rect(c,7,-23,6,9,hero.accent);}
  if(hero.id==='wren'){poly(c,[[-12,-36],[-1,-54],[13,-36]],hero.hat);rect(c,12,-17,7,10,hero.accent);}
  if(p.face>-2.8&&p.face<.7){rect(c,3,-32,2,3,'#314039');rect(c,7,-32,2,3,'#314039');}
  rect(c,-9,-22,18,4,hero.accent);rect(c,-14,-22,6,17,'#e3bd74');
  if(p.attackTime>0){
    c.rotate(p.face);
    c.strokeStyle='#fff5cc';c.lineWidth=6;c.beginPath();c.arc(0,0,49,-1.05,1.05);c.stroke();
    c.strokeStyle='#e6bc7366';c.lineWidth=14;c.beginPath();c.arc(0,0,54,-.9,.9);c.stroke();
    rect(c,9,-3,35,6,'#e3edcf');rect(c,14,-8,4,16,'#f9cd75');
  }else{
    c.rotate(p.face+.5);rect(c,12,-2,26,3,'#dae4c3');rect(c,15,-6,4,11,'#e0b36b');
  }
  c.restore();
}
function monster(c,e,t){
  if(e.hp<=0)return;
  c.save();c.translate(Math.round(e.x),Math.round(e.y));
  oval(c,0,4,e.r+4,e.r*.4,'#112f295c');
  const flash=e.flash>0;
  if(e.type==='slime'){
    const bob=Math.sin(t*4+e.homeX)*2;
    oval(c,0,-5,e.r,e.r*.8+bob,flash?'#fff1bd':'#8b9d69');
    oval(c,-4,-10,10,6,flash?'#fff1bd':'#adb677');
    poly(c,[[-4,-15],[-9,-28],[0,-23],[5,-16]],'#d2ce83');
    rect(c,-8,-8,3,4,'#273f34');rect(c,5,-8,3,4,'#273f34');rect(c,-1,-3,4,2,'#536044');
  }else if(e.type==='wisp'){
    const bob=Math.sin(t*3)*5;
    oval(c,0,-16+bob,23,24,'#b4e1c71b');
    poly(c,[[-15,-12+bob],[-9,-30+bob],[0,-37+bob],[12,-26+bob],[16,-10+bob],[7,-3+bob],[0,-9+bob],[-10,-2+bob]],flash?'#ffefc0':'#a8cabb');
    rect(c,-7,-20+bob,4,5,'#326760');rect(c,4,-20+bob,4,5,'#326760');
  }else if(e.type==='bat'){
    const flap=Math.sin(t*9)*8;
    poly(c,[[0,-15],[-30,-24+flap],[-21,-3],[-8,-4],[0,4],[8,-4],[21,-3],[30,-24+flap]],flash?'#fff0c4':'#6f5486');
    oval(c,0,-11,9,13,'#a990ba');rect(c,-5,-15,3,4,'#fff0ab');rect(c,3,-15,3,4,'#fff0ab');
  }else if(e.type==='beetle'){
    oval(c,0,-7,19,19,flash?'#fff0c4':'#86795b');
    poly(c,[[0,-27],[-15,-14],[-12,3],[12,3],[15,-14]],flash?'#fff0c4':'#b1a272');
    rect(c,-1,-25,2,25,'#5d5f49');rect(c,-10,-5,4,4,'#f9da8c');rect(c,6,-5,4,4,'#f9da8c');
    for(const x of [-24,17])for(const y of [-13,-3,7])rect(c,x,y,7,4,'#4f5747');
  }else if(e.type==='sentinel'){
    rect(c,-17,-24,34,29,flash?'#fff0c4':'#596a76');
    poly(c,[[-22,-24],[0,-46],[22,-24]],'#adbaac');rect(c,-5,-28,10,10,'#f3c17d');
    rect(c,-21,3,42,6,'#89978e');rect(c,-12,-17,24,3,'#8d9a91');
  }else if(e.type==='thorn'){
    for(let i=0;i<7;i++){const a=i*Math.PI*2/7;poly(c,[[0,-6],[Math.cos(a)*25,-6+Math.sin(a)*25],[Math.cos(a+.5)*12,-6+Math.sin(a+.5)*12]],'#9baa70');}
    oval(c,0,-6,14,14,flash?'#fff0c4':'#465f47');
    rect(c,-7,-11,4,5,'#f4c47a');rect(c,4,-11,4,5,'#f4c47a');
  }else{
    const stone=flash?'#fff0c4':(e.pattern==='volley'?'#5c6080':e.pattern==='stomp'?'#8b665a':'#556b5d'),top=flash?'#fff0c4':(e.pattern==='cycle'?'#ddc78d':e.pattern==='volley'?'#aaa0c3':'#91a184');
    rect(c,-22,-9,15,14,stone);rect(c,8,-9,15,14,stone);
    poly(c,[[-26,-15],[-32,-44],[-19,-60],[19,-60],[32,-44],[26,-15]],stone);
    poly(c,[[-20,-58],[-15,-73],[-8,-57],[11,-57],[19,-74],[24,-52]],'#a2b28c');
    poly(c,[[-25,-46],[-15,-61],[18,-61],[26,-46],[12,-37],[-14,-37]],top);
    rect(c,-15,-44,10,5,e.phase==='warning'?'#ffbc85':'#f8da8c');rect(c,5,-44,10,5,e.phase==='warning'?'#ffbc85':'#f8da8c');
    poly(c,[[-7,-28],[0,-35],[7,-28],[0,-16]],'#f0c976');
    rect(c,-36,-38,12,24,stone);rect(c,25,-38,12,24,stone);rect(c,-31,-41,8,5,'#a7af8a');
    for(let i=0;i<3;i++)rect(c,-15+i*12,-66,5,7,'#759268');
  }
  if(e.hp<e.maxHp&&e.type!=='boss'){rect(c,-15,12,30,3,'#1c392c');rect(c,-15,12,30*e.hp/e.maxHp,3,'#edd092');}
  c.restore();
}
export class Painter {
  constructor(canvas){
    this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.camera={x:0,y:0};this.trees=[];
    this.base=document.createElement('canvas');this.setLevel(levelAt(0));
  }
  resize(){const b=this.canvas.getBoundingClientRect();this.canvas.width=Math.round(b.width>700?b.width*.75:b.width);this.canvas.height=Math.round(this.canvas.width*b.height/b.width);this.ctx.imageSmoothingEnabled=false;}
  setLevel(level){
    this.level=level;this.trees=[];this.base.width=level.width;this.base.height=level.height;this.makeGround();
  }
  makeGround(){
    const l=this.level,t=l.theme,c=this.base.getContext('2d');rect(c,0,0,l.width,l.height,t.ground);
    for(let y=0;y<l.height;y+=8)for(let x=0;x<l.width;x+=8){
      let h=hash(x,y);if(h>.69)rect(c,x,y,3,2,h>.9?t.light:t.fleck);
      if(h<.015){rect(c,x,y,2,5,'#b9ba76');rect(c,x-2,y+2,6,2,'#a3ae65');}
    }
    for(const pts of l.paths){line(c,pts,94,'#526f4888');line(c,pts,76,'#b2a573');line(c,pts,57,t.path);}
    for(const pts of l.paths)for(let i=1;i<pts.length;i++){
      const [ax,ay]=pts[i-1],[bx,by]=pts[i],d=Math.hypot(bx-ax,by-ay);
      for(let n=0;n<d;n+=19){const t=n/d,x=ax+(bx-ax)*t,y=ay+(by-ay)*t;rect(c,x+hash(n,i)*26-13,y+hash(i,n)*20-10,7,3,'#a9996b');}
    }
    for(const s of l.stairs){
      rect(c,32,s.y,896,s.h,t.cliff);rect(c,32,s.y+14,896,43,t.cliffFace);rect(c,32,s.y+52,896,12,'#2b503c');
      for(let x=34;x<928;x+=36){rect(c,x,s.y+19,2,29,'#3a563f');rect(c,x+5,s.y+22,21,3,'#748565');rect(c,x+14,s.y+44,23,3,'#304f3a');}
      rect(c,32,s.y-7,896,13,'#8fa05f');rect(c,32,s.y+3,896,5,t.edge);
      for(let x=36;x<925;x+=14)rect(c,x,s.y+3,5,6+hash(x,s.y)*11,'#6f8b50');
      rect(c,s.x,s.y-8,s.w,s.h+15,'#7c8661');
      for(let y=s.y;y<s.y+s.h;y+=10){rect(c,s.x+3,y,s.w-6,7,'#babc91');rect(c,s.x+3,y+7,s.w-6,3,'#606d54');}
      rect(c,s.x-9,s.y-8,8,s.h+15,'#9ba982');rect(c,s.x+s.w+1,s.y-8,8,s.h+15,'#637d58');
    }
    for(const b of l.rocks)rock(c,b);
    // The camp and summit are readable landmarks along the zigzag ascent.
    oval(c,l.spawn.x,l.spawn.y-12,56,30,'#b6a673');
    for(let i=0;i<10;i++){let a=i/10*Math.PI*2;rect(c,l.spawn.x+Math.cos(a)*33-6,l.spawn.y-12+Math.sin(a)*20-4,12,8,'#7b8063');}
    rect(c,l.spawn.x-12,l.spawn.y-16,24,5,'#70573b');
    for(let y=90;y<290;y+=32)for(let x=l.beacon.x-128;x<l.beacon.x+128;x+=32){rect(c,x,y,30,29,hash(x,y)>.5?'#9d9f79':'#929975');rect(c,x+3,y+2,21,2,'#b5b38b');}
    // Stone lanterns and weathered boundary trees.
    for(const [x,y] of [[360,310],[600,310],[410,470],[550,470]]){rect(c,x-7,y-21,14,22,'#61775a');rect(c,x-13,y-27,26,8,'#9baa7c');rect(c,x-9,y-39,18,13,'#c0b580');rect(c,x-3,y-36,6,7,'#f7d68a');}
    for(let y=80;y<l.height;y+=75)for(const x of [25,60,900,935])this.trees.push({x:x+hash(x,y)*20,y:y+hash(y,x)*40,s:.8+hash(y,1)*.5,type:hash(x,y)>.75?1:0});
    const groups=l.goals.map(g=>[g.x>480?g.x-120:g.x+120,g.y+110]).concat(l.stairs.map(s=>[s.x>480?s.x-180:s.x+210,s.y-50]));
    groups.forEach(([x,y],j)=>{for(let i=0;i<4;i++){
      const tx=x+(i%2)*35,ty=y+Math.floor(i/2)*30;
      if(!l.goals.some(g=>Math.hypot(g.x-tx,g.y-ty)<90))this.trees.push({x:tx,y:ty,s:.8+hash(i,j)*.4,type:j%3===0?1:0});
    }});
  }
  draw(g,t,cover=false,reduced=false){
    if(this.level.id!==g.level.id)this.setLevel(g.level);
    const l=g.level,c=this.ctx,w=this.canvas.width,h=this.canvas.height;
    if(cover){this.cover(t,reduced);return;}
    const desiredX=clamp(g.player.x-w/2,0,Math.max(0,l.width-w));
    const desiredY=clamp(g.player.y-h*.58,0,Math.max(0,l.height-h));
    this.camera.x=desiredX;this.camera.y=desiredY;
    c.save();rect(c,0,0,w,h,'#163e32');c.translate(-Math.round(desiredX),-Math.round(desiredY));c.drawImage(this.base,0,0);
    const anim=reduced?0:t;
    // The direction marker points to the next real objective.
    const target=l.goals.find(s=>!g.sparks.has(s.id)) || (g.defeated.has('keeper')?l.beacon:{x:l.beacon.x,y:250});
    for(const s of l.goals)if(!g.sparks.has(s.id)){
      oval(c,s.x,s.y,28,14,'#f5d9821c');
      if(l.kind==='beacons'){
        brazier(c,s.x,s.y,anim,false);sparkle(c,s.x,s.y-32,6,l.theme.accent);
      }else if(l.kind==='sequence'){
        rect(c,s.x-15,s.y-24,30,27,l.theme.cliff);rect(c,s.x-17,s.y-26,34,5,l.theme.edge);
        c.font='bold 17px Zen,sans-serif';c.fillStyle=l.theme.accent;c.textAlign='center';c.fillText(String(s.order+1),s.x,s.y-4);
      }else if(l.kind==='rescue'){
        oval(c,s.x,s.y-18+Math.sin(anim*2)*3,11,16,l.theme.accent);
        rect(c,s.x-5,s.y-22,3,3,'#33594f');rect(c,s.x+3,s.y-22,3,3,'#33594f');
      }else{
        sparkle(c,s.x,s.y-13+Math.sin(anim*2+s.x)*3,13,l.theme.accent);sparkle(c,s.x,s.y-13+Math.sin(anim*2+s.x)*3,6,'#fff6d9');
      }
      c.font='9px Zen,sans-serif';c.textAlign='center';c.fillStyle='#fff3dc';c.fillText(s.name.toUpperCase(),s.x,s.y+26);
    }else if(l.kind==='beacons')brazier(c,s.x,s.y,anim,true);
    for(const hazard of l.hazards){
      const phase=hazardPhase(g,hazard);
      if(hazard.kind==='bramble'){
        for(let x=hazard.x;x<hazard.x+hazard.w;x+=10)poly(c,[[x,hazard.y+hazard.h],[x+5,hazard.y],[x+10,hazard.y+hazard.h]],l.theme.cliff);
      }else{
        rect(c,hazard.x,hazard.y,hazard.w,hazard.h,phase>3.4?'#e2a96b99':phase>2.6?'#f0d08f77':'#253e4522');
        for(let x=hazard.x;x<hazard.x+hazard.w;x+=14)rect(c,x,hazard.y,2,hazard.h,phase>2.6?'#ffe2a8':'#d3c5a033');
      }
    }
    if(g.sparks.size<l.goals.length){
      const gx=l.stairs[2].x;
      rect(c,gx-4,352,8,38,'#7f6b4e');rect(c,gx+124,352,8,38,'#7f6b4e');rect(c,gx-6,347,140,9,'#cbaf74');
      for(let x=gx+14;x<gx+124;x+=20)rect(c,x,355,5,30,'#e4cd8a');
      for(let i=0;i<l.goals.length;i++)sparkle(c,gx+22+i*25,341,5,g.sparks.size>i?'#ffe6a8':'#70694c');
    }
    brazier(c,l.beacon.x,l.beacon.y,anim,g.defeated.has('keeper'));brazier(c,l.spawn.x,l.spawn.y-16,anim,true);
    for(const e of g.enemies)if(e.hp>0&&e.phase==='warning'){
      if(e.attack==='stomp'){oval(c,e.targetX,e.targetY,62,62,'#f5c98e55');c.strokeStyle='#f5dba4';c.lineWidth=2;c.beginPath();c.arc(e.targetX,e.targetY,62,0,Math.PI*2);c.stroke();continue;}
      if(e.type==='boss'&&e.attack!=='charge'){oval(c,e.x,e.y,44,44,'#ebd1a344');continue;}
      c.save();c.globalAlpha=.24+Math.sin(anim*15)*.08;line(c,[[e.x,e.y],[e.x+e.vx*.5,e.y+e.vy*.5]],e.type==='boss'?55:30,'#ffcf8f');c.restore();
      c.strokeStyle='#f8cf8a';c.lineWidth=2;c.beginPath();c.arc(e.x,e.y,e.r+10,0,Math.PI*2);c.stroke();
    }
    const things=this.trees.map(o=>({y:o.y,paint:()=>tree(c,o.x,o.y,o.s,o.type,l.theme,l.biome)}));
    for(const e of g.enemies)if(e.hp>0)things.push({y:e.y,paint:()=>monster(c,e,anim)});
    things.push({y:g.player.y,paint:()=>player(c,g.player,anim,reduced,g.hero)});
    things.sort((a,b)=>a.y-b.y);for(const o of things)o.paint();
    for(const b of g.projectiles){oval(c,b.x,b.y,10,10,'#cfdbba33');sparkle(c,b.x,b.y,6,'#d7e1b8');}
    for(const q of g.hearts){c.fillStyle='#f2a189';c.font='16px sans-serif';c.textAlign='center';c.fillText('♥',q.x,q.y+Math.sin(anim*2)*3);}
    for(const p of g.particles){c.globalAlpha=p.life/p.max;rect(c,p.x,p.y,3,3,p.color);}c.globalAlpha=1;
    if(!reduced)for(let i=0;i<18;i++){
      const x=desiredX+(hash(i,2)*w+t*5)%w,y=desiredY+(hash(i,3)*h+t*2)%h;
      rect(c,x,y,2,2,'#e9e9a057');
    }
    c.restore();
    const tx=target.x-desiredX,ty=target.y-desiredY;
    if(tx<28||tx>w-28||ty<105||ty>h-30){
      const a=Math.atan2(ty-h/2,tx-w/2),x=clamp(tx,25,w-25),y=clamp(ty,110,h-30);
      c.save();c.translate(x,y);c.rotate(a);poly(c,[[11,0],[-7,-6],[-3,0],[-7,6]],'#ffe3a2');c.restore();
    }
    // Compact, live overview in the unobtrusive bottom-left corner.
    if(h<300)return; // Leave landscape thumb controls clear.
    const mx=14,my=h-99,mw=55,mh=82;
    rect(c,mx-4,my-4,mw+8,mh+8,'#113b2ad9');
    rect(c,mx,my,mw,mh,l.theme.ground);
    for(const s of l.stairs)rect(c,mx,my+s.y/l.height*mh,mw,3,l.theme.cliff);
    for(const s of l.goals)if(!g.sparks.has(s.id))rect(c,mx+s.x/l.width*mw-2,my+s.y/l.height*mh-2,4,4,'#f8d78d');
    rect(c,mx+l.beacon.x/l.width*mw-2,my+112/l.height*mh-2,4,4,'#dce7bf');
    rect(c,mx+g.player.x/l.width*mw-2,my+g.player.y/l.height*mh-2,4,4,'#fff6d6');
  }
  cover(t,reduced){
    const c=this.ctx,w=this.canvas.width,h=this.canvas.height;const time=reduced?0:t;
    const sky=c.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#204b49');sky.addColorStop(.6,'#749582');sky.addColorStop(1,'#193e34');c.fillStyle=sky;c.fillRect(0,0,w,h);
    // A bespoke, layered mountain diorama; no external image or WebGL needed.
    const sx=w<600?w*.7:w*.72,sy=h*.64,scale=Math.min(w/680,h/480);
    c.save();c.translate(sx,sy);c.scale(scale,scale);
    oval(c,130,-210,37,37,'#e3d69e');
    for(let i=0;i<5;i++){
      const x=-600+i*230;poly(c,[[x,140],[x+140,-280+i%2*50],[x+330,140]],i%2?'#385f57':'#48746a');
      poly(c,[[x+140,-280+i%2*50],[x+183,-192+i%2*40],[x+154,-204+i%2*40],[x+125,-192+i%2*40]],'#9ab09a');
    }
    for(let i=0;i<6;i++){let x=-390+i*145+Math.sin(time*.08+i)*20;oval(c,x,-160+i%3*38,100,9,'#c5d2b030');}
    const terraces=[
      {x:-210,y:132,wide:480,deep:130,color:'#467044'},
      {x:-165,y:30,wide:370,deep:108,color:'#648447'},
      {x:-100,y:-70,wide:250,deep:105,color:'#80954e'},
      {x:-35,y:-157,wide:115,deep:88,color:'#98a664'}
    ];
    for(const a of terraces){
      poly(c,[[a.x,a.y],[a.x+a.wide,a.y],[a.x+a.wide-24,a.y+a.deep],[a.x+45,a.y+a.deep]],'#375b40');
      for(let i=0;i<a.wide;i+=22){rect(c,a.x+i+6,a.y+14,8,a.deep*.55+hash(i,a.y)*15,'#59734c');rect(c,a.x+i+2,a.y+14,3,a.deep*.5,'#2a4c37');}
      poly(c,[[a.x,a.y],[a.x+40,a.y-29],[a.x+a.wide-35,a.y-29],[a.x+a.wide,a.y]],a.color);
      rect(c,a.x+10,a.y-2,a.wide-20,6,'#adc073');
    }
    // Winding gold steps visibly connect all four ledges.
    line(c,[[-60,247],[-118,158],[120,105],[110,43],[-50,0],[-35,-70],[60,-105],[30,-158]],16,'#cfbc82');
    for(let i=0;i<11;i++)rect(c,101,34+i*6,19,2,'#8b8c60');
    for(let i=0;i<12;i++)rect(c,-44,-69+i*6,18,2,'#939269');
    // Waterfall catches the moonlight.
    rect(c,159,32,16,113,'#94bdb0');rect(c,164,36,4,110,'#d1dcca');oval(c,168,147,29,8,'#b6d0ba60');
    for(const [x,y,s] of [[-195,128,1.3],[-140,140,1],[-100,177,.9],[180,122,1.1],[215,150,1.4],[-130,24,.85],[145,24,.8],[-80,-80,.7],[95,-74,.7]])tree(c,x,y,s);
    // Shrine gateway, warm beacon and a tiny traveller.
    rect(c,-3,-193,7,37,'#72583d');rect(c,45,-193,7,37,'#72583d');
    rect(c,-11,-196,71,8,'#ceb07b');rect(c,-8,-185,65,4,'#ab8b5d');
    brazier(c,25,-162,time,true);
    player(c,{x:100,y:87,face:-Math.PI/2,walk:0,invulnerable:0,attackTime:0},time);
    sparkle(c,-82,139+Math.sin(time)*3,9,'#ffe9a9');
    monster(c,{x:-80,y:35,type:'slime',r:15,hp:2,maxHp:2,homeX:0,flash:0},time);
    for(let i=0;i<14;i++){const x=-200+hash(i,3)*450,y=-200+hash(i,8)*430;rect(c,x+Math.sin(time*.3+i)*8,y,2,2,'#f9dda081');}
    c.restore();
    const haze=c.createLinearGradient(0,h*.7,0,h);haze.addColorStop(0,'#0b2a2600');haze.addColorStop(1,'#0b2a26b0');c.fillStyle=haze;c.fillRect(0,0,w,h);
  }
}

export function drawHeroPortrait(canvas,id){
  const c=canvas.getContext('2d'),hero=heroById(id);canvas.width=144;canvas.height=144;c.imageSmoothingEnabled=false;
  rect(c,0,0,144,144,'#173a34');oval(c,72,86,50,40,hero.cape+'55');
  c.save();c.translate(72,116);c.scale(2.5,2.5);player(c,{x:0,y:0,face:0,walk:0,invulnerable:0,attackTime:0},0,true,hero);c.restore();
}
