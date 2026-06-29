"use client";

import * as React from "react";
import SidebarMain from "@/components/sections/sidebar-section";
import FooterSection from "@/components/sections/footer-section";
import { CartProvider } from "@/components/shop/cart-context";
import Chatbot from "@/components/chatbot";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
    <div className="relative min-h-screen text-foreground">
      <div className="relative z-10 flex min-h-screen w-full">
        <SidebarMain />
        <main className="min-w-0 flex-1 flex flex-col">
          <div className="flex-1 w-full">
            {children}
          </div>
          <FooterSection />
        </main>
      </div>
      <Chatbot />
    </div>
    </CartProvider>
  );
}
