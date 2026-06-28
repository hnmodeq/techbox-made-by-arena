"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "sidebar-mobile-fab-top";
const BTN_SIZE = 80; // Adjusted from 200 to be more reasonable
const SAFE_MARGIN = 24;

function clampTopByHeight(top: number, btnH: number) {
  if (typeof window === "undefined") return SAFE_MARGIN;
  const minTop = SAFE_MARGIN;
  const maxTop = window.innerHeight - btnH - SAFE_MARGIN;
  if (maxTop <= minTop) return (window.innerHeight - btnH) / 2;
  return Math.min(Math.max(minTop, top), maxTop);
}

function getClientFabTop() {
  if (typeof window === "undefined") return SAFE_MARGIN;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved !== null) {
    const parsed = Number(saved);
    if (!Number.isNaN(parsed)) return clampTopByHeight(parsed, BTN_SIZE);
  }
  return clampTopByHeight((window.innerHeight - BTN_SIZE) / 2, BTN_SIZE);
}

function getServerFabTop() {
  return SAFE_MARGIN;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("resize", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("resize", callback);
    window.removeEventListener("storage", callback);
  };
}

export function useFabTop() {
  return useSyncExternalStore(subscribe, getClientFabTop, getServerFabTop);
}

export function saveFabTop(top: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, String(top));
}
