"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "sidebar-mobile-fab-top";
const BTN_SIZE = 200;
const SAFE_MARGIN = 64;

function clampTopByHeight(top: number, btnH: number) {
  const minTop = SAFE_MARGIN;
  const maxTop = window.innerHeight - btnH - SAFE_MARGIN;
  if (maxTop <= minTop) return (window.innerHeight - btnH) / 2;
  return Math.min(Math.max(minTop, top), maxTop);
}

function getClientFabTop() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved !== null) {
    const parsed = Number(saved);
    if (!Number.isNaN(parsed)) return clampTopByHeight(parsed, BTN_SIZE);
  }
  return clampTopByHeight((window.innerHeight - BTN_SIZE) / 2, BTN_SIZE);
}

function getServerFabTop() {
  // مقدار ثابت SSR-safe
  return SAFE_MARGIN;
}

function subscribe(callback: () => void) {
  const onResize = () => callback();
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener("resize", onResize);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("storage", onStorage);
  };
}

export function useFabTop() {
  return useSyncExternalStore(subscribe, getClientFabTop, getServerFabTop);
}

export function saveFabTop(top: number) {
  window.localStorage.setItem(STORAGE_KEY, String(top));
}
