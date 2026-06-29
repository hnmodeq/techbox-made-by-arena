"use client";
import { motion } from "framer-motion";
import { slideIn } from "@/styles/motion";
export function SlideIn(p: any){ return <motion.div {...slideIn} {...p} /> }
export default SlideIn;
