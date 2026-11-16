import { LEVELS, heroById } from './levels.mjs';
import { readProgress, saveProgress } from './engine.mjs';
export const SAVE_KEY='ikigai-mountain:game:journey:v2';
export const LEGACY_KEY='ikigai-mountain:game:base-camp:v1';
export function emptyJourney(){return{version:2,heroId:'ember',chosen:false,currentLevel:0,mode:'campaign',records:{},updatedAt:0};}
export function normalizeJourney(raw){
  if(!raw||raw.version!==2)return null;
  const j=emptyJourney();j.heroId=heroById(raw.heroId).id;j.chosen=raw.chosen===true;
  j.currentLevel=Number.isInteger(raw.currentLevel)&&raw.currentLevel>=0&&raw.currentLevel<27?raw.currentLevel:0;
  j.mode=raw.mode==='single'?'single':'campaign';
  for(const level of LEVELS){
    const record=raw.records?.[level.id];if(!record)continue;
    const progress=readProgress(record.progress,level.index);if(!progress)continue;
    j.records[level.id]={progress,cleared:record.cleared===true||progress.complete,
      bestSeconds:Number.isFinite(record.bestSeconds)&&record.bestSeconds>0?record.bestSeconds:null,
      updatedAt:Number.isFinite(record.updatedAt)?record.updatedAt:0};
  }
  j.updatedAt=Number.isFinite(raw.updatedAt)?raw.updatedAt:0;return j;
}
export function loadJourney(storage){
  try{
    const raw=storage.getItem(SAVE_KEY);
    if(raw){try{const j=normalizeJourney(JSON.parse(raw));if(j)return{journey:j,status:'saved'};}catch{}
      // Preserve unreadable data for recovery instead of silently erasing it.
      try{storage.setItem(SAVE_KEY+':recovery',raw);}catch{}
      return{journey:emptyJourney(),status:'recovered'};
    }
    const old=storage.getItem(LEGACY_KEY);
    if(old){try{
      const p=readProgress(JSON.parse(old),0);
      if(p){const j=emptyJourney();j.chosen=true;j.records[LEVELS[0].id]={progress:p,cleared:p.complete,bestSeconds:p.complete?p.seconds:null,updatedAt:0};return{journey:j,status:'migrated'};}
    }catch{}}
    return{journey:emptyJourney(),status:'new'};
  }catch{return{journey:emptyJourney(),status:'unavailable'};}
}
export function recordGame(journey,g,now=Date.now()){
  const id=g.level.id,old=journey.records[id];
  journey.records[id]={progress:saveProgress(g),cleared:!!old?.cleared||g.completed,
    bestSeconds:g.completed?Math.min(old?.bestSeconds||Infinity,g.seconds):old?.bestSeconds||null,updatedAt:now};
  journey.heroId=g.hero.id;journey.currentLevel=g.level.index;journey.updatedAt=now;
  return journey;
}
export function persistJourney(storage,journey){
  try{
    // Preserve newer progress from another tab in other chapters.
    let other=null;try{other=normalizeJourney(JSON.parse(storage.getItem(SAVE_KEY)));}catch{}
    if(other)for(const level of LEVELS){
      const a=journey.records[level.id],b=other.records[level.id];
      if(!b)continue;
      const selected=!a||b.updatedAt>a.updatedAt?b:a;
      if(a){
        selected.cleared=a.cleared||b.cleared;
        const best=Math.min(a.bestSeconds||Infinity,b.bestSeconds||Infinity);
        selected.bestSeconds=Number.isFinite(best)?best:null;
      }
      journey.records[level.id]=selected;
    }
    storage.setItem(SAVE_KEY,JSON.stringify(journey));return true;
  }catch{return false;}
}
export const clearedCount=j=>Object.values(j.records).filter(r=>r.cleared).length;
export function campaignNext(j,index){
  // Keep the route sequential; any chapter can also be played independently.
  return index<LEVELS.length-1?index+1:null;
}
