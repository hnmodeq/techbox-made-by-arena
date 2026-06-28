"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import items from "@/data/hero-items.json";

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentItem = items[index];

  return (
    <section className="flex flex-col items-center pt-16 pb-12 text-center overflow-hidden">
      <h1 className="hero-title select-none">
        تکباکس
      </h1>
      
      <div className="mt-8 h-8 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Link
              href={currentItem.href}
              className="text-lg md:text-xl text-muted-foreground hover:text-brand transition-colors font-medium"
            >
              {currentItem.text}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
