import {LEVELS,HEROES} from '../game/levels.mjs';
import {createGame,step} from '../game/engine.mjs';
import {Painter} from '../game/art.mjs';
import {climb} from './climb-helper.mjs';
const modes=[];
for(let index=0;index<9;index++){
 const l=LEVELS[index],card=document.createElement('article'),h=document.createElement('h2'),canvas=document.createElement('canvas'),p=document.createElement('p');h.textContent=String(index+1).padStart(2,'0')+' / '+l.encounter.name;p.textContent=l.encounter.tip;card.append(h,canvas,p);document.querySelector('#gallery').append(card);
 const g=createGame(null,index,HEROES[index%4].id),target=l.kind==='echo'?{x:480,y:740}:l.kind==='arena'||l.kind==='sanctuary'?{x:480,y:730}:l.kind==='mirror'?{x:l.goals[0].x,y:l.goals[0].y+50}:l.goals[0];
 Object.assign(g.player,{x:target.x,y:target.y+45,invulnerable:0});g.challenge.escort={x:target.x-65,y:target.y+55,r:10};g.time=2;step(g,{},0);
 if(l.kind==='storm')g.challenge.storm=[{x:target.x+50,y:target.y+60,life:.7,hit:false},{x:target.x-60,y:target.y-45,life:1,hit:false}];
 if(l.kind==='sanctuary')g.challenge.charge=4.5;
 const painter=new Painter(canvas);painter.resize();painter.draw(g,2,false,false);modes.push({g,painter});
}
document.querySelector('#verify').onclick=async()=>{
 const result=document.querySelector('#results');result.textContent='Running real movement, combat, puzzles, reflections, escorts, waves and exits…';let pass=0;const failures=[];
 for(const hero of HEROES){for(const l of LEVELS)try{const g=climb(l.index,hero.id);if(g.status!=='won')throw Error('not won');pass++;}catch(error){failures.push(hero.name+' / '+(l.index+1)+': '+error.message);}result.textContent=pass+' / 108 complete climbs passed.\n'+failures.join('\n');await new Promise(resolve=>requestAnimationFrame(resolve));}
};
