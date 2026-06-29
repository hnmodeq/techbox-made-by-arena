"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
export function Modal({ open, onClose, children, className }: { open: boolean; onClose: ()=>void; children: React.ReactNode; className?: string }){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4" dir="rtl" style={{zIndex:500}}>
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm z-modal" style={{zIndex:500}} onClick={onClose} />
      <div className={cn("relative card w-full max-w-lg z-[501] max-h-[85vh] overflow-auto", className)}>{children}</div>
    </div>
  );
}
export default Modal;
