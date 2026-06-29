"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Tabs({ value, onValueChange, children, className }:{
  value: string;
  onValueChange?: (v:string)=>void;
  children: React.ReactNode;
  className?: string;
}){
  return <div className={cn("w-full", className)} data-value={value}>{React.Children.map(children, child=>
    React.isValidElement(child) ? React.cloneElement(child as any, { __tb_active: (child.props as any).value === value, __tb_onSelect: onValueChange }) : child
  )}</div>;
}

export function TabsList({className, ...p}: React.HTMLAttributes<HTMLDivElement>){
  return <div className={cn("flex gap-1 p-1 rounded-[var(--tb-radius-lg)] bg-[var(--muted)]", className)} {...p} />;
}
export function TabsTrigger({value, children, __tb_active, __tb_onSelect, className}:{value:string; children:React.ReactNode; __tb_active?:boolean; __tb_onSelect?:(v:string)=>void; className?:string}){
  return (
    <button
      onClick={()=>__tb_onSelect?.(value)}
      className={cn(
        "px-3 py-1.5 text-[12px] font-semibold rounded-[var(--tb-radius-md)] transition-all",
        __tb_active ? "bg-[var(--card)] shadow-[var(--tb-shadow-sm)] text-[var(--foreground)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
        className
      )}
      aria-selected={__tb_active}
      role="tab"
      type="button"
    >{children}</button>
  );
}
