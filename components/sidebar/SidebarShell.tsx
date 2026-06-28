"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import SidebarContent from "./SidebarContent";
import { sidebarBase } from "./sidebar.config";
import { SidebarShellProps } from "./sidebar.types";
import { useFabTop, saveFabTop } from "./useFabTop";
import { Menu, X } from "lucide-react";

const DRAG_THRESHOLD = 5;
const BTN_SIZE = 64; 
const SAFE_MARGIN = 24;

export default function SidebarShell({
  mobileOpen,
  desktopOpen,
  theme,
  onToggleTheme,
  onToggleMobile,
  onCloseMobile,
  onToggleDesktop,
}: SidebarShellProps) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const pointerStartYRef = useRef(0);
  const topStartRef = useRef(0);
  const movedRef = useRef(false);
  const storedTop = useFabTop();
  const [dragTop, setDragTop] = useState<number | null>(null);
  
  const btnTop = dragTop ?? storedTop;

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    pointerStartYRef.current = e.clientY;
    topStartRef.current = btnTop;
    movedRef.current = false;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    const deltaY = e.clientY - pointerStartYRef.current;
    if (!movedRef.current && Math.abs(deltaY) >= DRAG_THRESHOLD) {
      movedRef.current = true;
    }
    
    const newTop = topStartRef.current + deltaY;
    const minTop = SAFE_MARGIN;
    const maxTop = window.innerHeight - BTN_SIZE - SAFE_MARGIN;
    setDragTop(Math.min(Math.max(minTop, newTop), maxTop));
  };

  const endDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    setDragging(false);
    if (dragTop !== null) {
      saveFabTop(dragTop);
      setDragTop(null);
    }
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
  };

  const handleClick = (e: React.MouseEvent) => {
    if (movedRef.current) {
      e.preventDefault();
      return;
    }
    onToggleMobile();
  };

  return (
    <>
      {/* Mobile FAB */}
      <button
        ref={btnRef}
        type="button"
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{ top: `${btnTop}px`, touchAction: "none" }}
        className={cn(
          "fixed z-[60] flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white shadow-2xl transition-[right] duration-300 sm:hidden",
          mobileOpen ? "right-72 -translate-x-1/2" : "right-4",
          dragging ? "cursor-grabbing scale-95" : "cursor-grab"
        )}
      >
        {mobileOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-md sm:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-72 transform transition-transform duration-300 ease-in-out sm:hidden",
          sidebarBase,
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <SidebarContent
          expanded
          theme={theme}
          onToggleTheme={onToggleTheme}
          onLinkClick={onCloseMobile}
        />
      </aside>

      {/* Desktop Sidebar Spacer */}
      <div
        className={cn(
          "hidden shrink-0 sm:block transition-[width] duration-300 ease-in-out",
          desktopOpen ? "w-64" : "w-20"
        )}
      />

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed right-0 top-0 hidden h-screen flex-col border-l border-border/50 sm:flex transition-[width] duration-300 ease-in-out",
          sidebarBase,
          desktopOpen ? "w-64" : "w-20"
        )}
      >
        <SidebarContent
          expanded={desktopOpen}
          theme={theme}
          onToggleTheme={onToggleTheme}
          onLogoClick={onToggleDesktop}
        />
      </aside>
    </>
  );
}
