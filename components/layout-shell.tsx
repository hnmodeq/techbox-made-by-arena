"use client";

import * as React from "react";
import SidebarMain from "@/components/sections/sidebar-section";
import FooterSection from "@/components/sections/footer-section";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 flex min-h-screen w-full">
        {/* Sidebar */}
        <SidebarMain />
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 w-full max-w-[1600px] mx-auto">
            {children}
          </div>
          <FooterSection />
        </main>
      </div>
    </div>
  );
}
