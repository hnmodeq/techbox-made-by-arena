"use client";
import { useSyncExternalStore } from "react";
const STORAGE_KEY = "sidebar-mobile-fab-top";
const BTN_SIZE = 72;
const SAFE_MARGIN = 16;
function clampTopByHeight(top: number, btnH: number){
  if(typeof window==="undefined") return top;
  const minTop = SAFE_MARGIN;
  const maxTop = window.innerHeight - btnH - SAFE_MARGIN;
  if (maxTop <= minTop) return (window.innerHeight - btnH) / 2;
  return Math.min(Math.max(minTop, top), maxTop);
}
function getClientFabTop(){ 
  if(typeof window==="undefined") return SAFE_MARGIN;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved !== null) { const parsed = Number(saved); if (!Number.isNaN(parsed)) return clampTopByHeight(parsed, BTN_SIZE); }
  return clampTopByHeight((window.innerHeight - BTN_SIZE) / 2, BTN_SIZE);
}
function getServerFabTop(){ return SAFE_MARGIN; }
function subscribe(cb: ()=>void){
  if(typeof window==="undefined") return ()=>{};
  const onResize = ()=>cb();
  const onStorage = (e:StorageEvent)=>{ if(e.key===STORAGE_KEY) cb(); };
  window.addEventListener("resize", onResize);
  window.addEventListener("storage", onStorage);
  return ()=>{ window.removeEventListener("resize", onResize); window.removeEventListener("storage", onStorage); };
}
export function useFabTop(){ return useSyncExternalStore(subscribe, getClientFabTop, getServerFabTop); }
export function saveFabTop(top:number){ if(typeof window!=="undefined") window.localStorage.setItem(STORAGE_KEY, String(top)); }
