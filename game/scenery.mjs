/* Cached terrain detail and bounded, viewport-relative atmosphere. */
export const noise=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
const rect=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
function poly(c,p,color){c.fillStyle=color;c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
function oval(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
function line(c,p,width,color){c.strokeStyle=color;c.lineWidth=width;c.lineJoin='round';c.lineCap='round';c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
function segmentDistance(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy||1)));return Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t);}
export function onTrail(l,x,y,margin=55){return l.paths.some(p=>p.some((v,i)=>i&&segmentDistance(x,y,p[i-1],v)<margin));}
const lights=new Map();
export function glow(c,x,y,r,color,alpha=1){
 if(alpha<=0)return;let light=lights.get(color);
 if(!light){light=document.createElement('canvas');light.width=light.height=128;const a=light.getContext('2d'),g=a.createRadialGradient(64,64,1,64,64,64);g.addColorStop(0,color+'b0');g.addColorStop(.25,color+'54');g.addColorStop(1,color+'00');a.fillStyle=g;a.fillRect(0,0,128,128);lights.set(color,light);}
 c.save();c.globalAlpha=alpha;c.globalCompositeOperation='screen';c.drawImage(light,x-r,y-r,r*2,r*2);c.restore();
}
export function sigil(c,x,y,r,color,turn=0,alpha=.7){
 c.save();c.translate(x,y);c.rotate(turn);c.globalAlpha=alpha;c.strokeStyle=color;c.lineWidth=1.2;
 c.beginPath();c.ellipse(0,0,r,r*.55,0,0,Math.PI*2);c.stroke();
 c.beginPath();c.ellipse(0,0,r*.78,r*.43,0,0,Math.PI*2);c.stroke();
 for(let i=0;i<8;i++){const a=i*Math.PI/4;c.beginPath();c.moveTo(Math.cos(a)*r*.84,Math.sin(a)*r*.46);c.lineTo(Math.cos(a)*r,Math.sin(a)*r*.55);c.stroke();}
 c.restore();
}
export function paintTerrain(c,l){
 const t=l.theme,forest=['forest','marsh','summit'].includes(l.biome);
 rect(c,0,0,l.width,l.height,t.ground);
 for(let i=0;i<120;i++){const x=noise(i,l.index)*l.width,y=noise(i+10,7)*l.height;oval(c,x,y,35+noise(i,2)*95,18+noise(i,3)*48,i%3===0?t.light+'0f':'#061f2710');}
 for(let y=0;y<l.height;y+=9)for(let x=0;x<l.width;x+=9){const n=noise(x+l.index,y);if(n>.66)rect(c,x,y,n>.92?4:2,2,n>.9?t.light+'99':t.fleck);}
 for(let i=0;i<650;i++){
  const x=42+noise(i,18+l.index)*876,y=65+noise(i,22)* (l.height-110);if(onTrail(l,x,y,55))continue;
  if(forest){line(c,[[x-3,y],[x-6,y-6],[x-1,y-2],[x+2,y-10],[x+3,y]],1.4,i%3===0?t.light+'99':t.cliff);if(i%11===0){rect(c,x,y-6,3,3,i%2?'#e5a6c8':'#c7e3ad');rect(c,x+4,y-3,2,2,'#f2dca4');}}
  else if(l.biome==='ruins'){line(c,[[x,y],[x+8,y+2],[x+12,y-2],[x+17,y+4]],1,t.cliff+'88');if(i%13===0)poly(c,[[x,y],[x+4,y-12],[x+9,y-2]],t.accent+'88');}
  else{rect(c,x,y,5,2,t.cliff+'aa');if(i%8===0)line(c,[[x,y],[x+2,y-7],[x+5,y-4]],1.5,t.light);}
 }
 for(const p of l.paths){line(c,p,97,'#061f2544');line(c,p,83,t.edge+'66');line(c,p,72,t.path);line(c,p,50,t.path);}
 for(const pts of l.paths)for(let i=1;i<pts.length;i++){
  const [ax,ay]=pts[i-1],[bx,by]=pts[i],d=Math.hypot(bx-ax,by-ay),nx=-(by-ay)/(d||1),ny=(bx-ax)/(d||1);
  for(let j=0;j<d;j+=23){const x=ax+(bx-ax)*j/d,y=ay+(by-ay)*j/d,n=noise(j,i+l.index);
   rect(c,x+(n-.5)*34,y+(noise(i,j)-.5)*20,4+n*5,2,t.cliff+'55');
   if(j%46===0)for(const side of [-1,1]){const px=x+nx*side*39,py=y+ny*side*39;poly(c,[[px-5,py],[px-2,py-4],[px+4,py-3],[px+5,py+2],[px,py+4]],t.edge+'99');rect(c,px-2,py-3,5,1,t.light);}
  }
 }
 for(const s of l.stairs){
  if(s.y>l.height)continue;
  rect(c,32,s.y+54,896,24,'#061b283d');rect(c,32,s.y,896,64,t.cliff);
  for(let x=32;x<928;x+=30){const n=noise(x,s.y);poly(c,[[x,s.y+7],[x+29,s.y+12],[x+26,s.y+56],[x+8,s.y+62],[x,s.y+45]],n>.5?t.cliffFace:t.cliff);rect(c,x+3,s.y+12,2,34,'#e9efd422');line(c,[[x+8,s.y+19],[x+22,s.y+24],[x+16,s.y+32]],1,'#09233066');}
  rect(c,32,s.y-6,896,11,t.ground);rect(c,32,s.y+2,896,3,t.edge);rect(c,32,s.y+6,896,3,t.light+'66');
  if(forest)for(let x=38;x<925;x+=17){const h=8+noise(x,s.y)*24;rect(c,x,s.y+4,3,h,t.ground);rect(c,x+3,s.y+h*.4,5,3,t.light+'77');}
  rect(c,s.x-6,s.y-8,s.w+12,s.h+18,t.cliff);
  for(let y=s.y;y<s.y+s.h;y+=8){rect(c,s.x+2,y,s.w-4,5,t.path);rect(c,s.x+2,y,s.w-4,1,'#f8efd6aa');rect(c,s.x+2,y+5,s.w-4,3,t.cliffFace);}
  for(const x of [s.x-7,s.x+s.w+1]){rect(c,x,s.y-10,7,s.h+17,t.edge);for(const y of [s.y-12,s.y+53]){rect(c,x-3,y,13,10,t.cliffFace);rect(c,x-4,y-3,15,4,t.path);}}
 }
 for(const b of l.rocks){
  oval(c,b.x+b.w/2+5,b.y+b.h,b.w*.65,12,'#08202b55');
  if(b.kind==='pond'){
   oval(c,b.x+b.w/2,b.y+b.h/2,b.w/2+8,b.h/2+6,t.edge+'66');oval(c,b.x+b.w/2,b.y+b.h/2,b.w/2,b.h/2,t.water);oval(c,b.x+b.w/2+3,b.y+b.h/2,b.w/2-8,b.h/2-6,t.cliff+'aa');
   line(c,[[b.x+11,b.y+7],[b.x+b.w-13,b.y+7]],2,t.accent+'88');if(forest){oval(c,b.x+12,b.y+18,7,4,t.light);rect(c,b.x+11,b.y+13,3,3,'#ffd6cb');}
  }else{
   poly(c,[[b.x,b.y+b.h],[b.x-3,b.y+13],[b.x+13,b.y-2],[b.x+b.w-14,b.y-7],[b.x+b.w+3,b.y+14],[b.x+b.w,b.y+b.h]],t.cliff);
   poly(c,[[b.x-3,b.y+13],[b.x+13,b.y-2],[b.x+b.w-14,b.y-7],[b.x+b.w+3,b.y+14],[b.x+18,b.y+23]],t.cliffFace);
   line(c,[[b.x+4,b.y+11],[b.x+15,b.y+2],[b.x+b.w-16,b.y-2]],2,t.edge);line(c,[[b.x+25,b.y+11],[b.x+19,b.y+22],[b.x+22,b.y+31]],1,'#061b2caa');
   if(l.biome==='ruins'||l.biome==='dusk'){rect(c,b.x+28,b.y+7,2,10,t.accent);rect(c,b.x+24,b.y+10,9,2,t.accent+'aa');}
  }
 }
 // A carved guardian court, a luminous gate and a sheltered trailhead.
 const bx=l.beacon.x;
 oval(c,bx,212,139,108,t.cliff+'77');oval(c,bx,205,130,103,t.cliffFace+'99');
 for(let row=0;row<6;row++)for(let col=0;col<7;col++){const x=bx-111+col*33,y=112+row*31;if(Math.hypot((x+16-bx)/1.2,y+15-210)<96){rect(c,x,y,31,28,noise(col,row)>.5?t.path+'66':t.edge+'44');rect(c,x+3,y+2,24,1,t.light+'77');}}
 sigil(c,bx,215,108,t.accent,0,.45);sigil(c,bx,110,38,t.accent,0,.9);
 for(const side of [-1,1]){
  const x=bx+side*137;rect(c,x-9,154,18,121,t.cliff);rect(c,x-6,152,12,115,t.cliffFace);rect(c,x-13,145,26,9,t.edge);rect(c,x-11,273,22,8,t.edge);rect(c,x-2,168,4,34,t.accent+'88');
  const sx=l.spawn.x+side*74,sy=l.spawn.y;line(c,[[sx,sy+6],[sx,sy-63]],3,t.path);poly(c,[[sx,sy-60],[sx+side*32,sy-53],[sx+side*24,sy-30],[sx,sy-38]],t.cliff);line(c,[[sx,sy-60],[sx+side*32,sy-53]],2,t.accent);rect(c,sx-2,sy-67,4,5,t.accent);
 }
 oval(c,l.spawn.x,l.spawn.y-12,54,30,t.cliffFace);sigil(c,l.spawn.x,l.spawn.y,47,t.edge,0,.65);
 // Cliff drops at the edge of the playable terraces.
 for(const x of [0,l.width-30]){rect(c,x,0,30,l.height,'#071c2bcc');for(let y=0;y<l.height;y+=60)poly(c,[[x,y],[x+30,y+12],[x+20,y+50],[x+4,y+58]],t.cliff+'99');}
}
export function atmosphere(c,l,w,h,t,camera,reduced=false){
 const dark=l.biome!=='summit';
 c.save();
 const shade=c.createLinearGradient(0,0,w,h);shade.addColorStop(0,dark?'#071b2e33':'#36536d12');shade.addColorStop(.48,'#102e3d00');shade.addColorStop(1,dark?'#09142644':'#26404d18');c.fillStyle=shade;c.fillRect(0,0,w,h);
 if(reduced){c.restore();return;}
 const count=w<500?22:36;
 for(let i=0;i<count;i++){
  const n=noise(i,l.index+14),x=(n*w+t*(l.biome==='canyon'?14:4)+Math.sin(t*.4+i)*12)%w,y=(noise(i,8)*h+t*(l.biome==='summit'?9:2))%h;
  const a=.2+.5*(.5+.5*Math.sin(t*1.5+i*4));
  if(l.biome==='forest'||l.biome==='marsh'){glow(c,x,y,10,l.theme.accent,a*.55);rect(c,x,y,2,2,'#effdd5');}
  else if(l.biome==='summit'){oval(c,x,y,1.5,1.2,'#f5f9e2aa');}
  else if(l.biome==='canyon'){rect(c,x,y,5,1,'#ffe0ba66');}
  else{rect(c,x,y,2,2,l.theme.accent+'bb');if(i%9===0){rect(c,x-2,y+1,6,1,l.theme.accent+'77');rect(c,x+1,y-2,1,6,l.theme.accent+'77');}}
 }
 // Broad translucent shafts are cheap polygons, not screen-sized blur filters.
 c.globalCompositeOperation='screen';
 for(let i=0;i<3;i++){const x=(noise(i,l.index)*w+t*2)%(w+300)-150;poly(c,[[x,-20],[x+24,-20],[x+240,h],[x+120,h]],l.theme.accent+(i===1?'09':'05'));}
 if(l.biome==='marsh'||l.biome==='dusk'||l.biome==='summit'){
  const fog=c.createLinearGradient(0,0,w,0);fog.addColorStop(0,'#e9ecff00');fog.addColorStop(.5,l.theme.accent+'0d');fog.addColorStop(1,'#e9ecff00');c.fillStyle=fog;
  for(let i=0;i<3;i++){const y=(noise(i,l.index)*h+t*3-camera.y*.12)%(h+100);c.fillRect(0,y,w,24);}
 }
 c.restore();
}
