"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
export function Avatar({ src, alt, size=40, className, ...p }: { src?: string; alt?: string; size?: number } & React.HTMLAttributes<HTMLSpanElement>){
  return (
    <span className={cn("relative inline-block shrink-0 overflow-hidden bg-[var(--muted)]", className)} style={{width:size, height:size, borderRadius:"var(--tb-radius-full)", ...p.style}} {...p}>
      {src ? <img src={src} alt={alt||""} width={size} height={size} className="w-full h-full object-cover" /> :
        <span className="w-full h-full flex items-center justify-center text-[11px]" style={{color:"var(--muted-foreground)"}}>{(alt||"?").slice(0,2).toUpperCase()}</span>}
    </span>
  );
}
export default Avatar;
