"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { fadeUp, pageMotion, premiumEase, staggerContainer } from "@/lib/animations";
import { cn, money } from "@/lib/utils";

export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : "hidden"}
      animate="show"
      variants={pageMotion}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={fadeUp}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.62, delay, ease: premiumEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={staggerContainer}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-70px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SpotlightCursor() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const smoothX = useSpring(x, { stiffness: 120, damping: 28, mass: 0.35 });
  const smoothY = useSpring(y, { stiffness: 120, damping: 28, mass: 0.35 });
  const background = useMotionTemplate`radial-gradient(420px circle at ${smoothX}px ${smoothY}px, rgba(199,170,115,0.13), transparent 58%)`;

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [reduce, x, y]);

  if (reduce) return null;
  return <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-[1] hidden mix-blend-multiply md:block" style={{ background }} />;
}

export function CountUpMoney({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  const shownRef = useRef(value);

  useEffect(() => {
    if (reduce) {
      setShown(value);
      shownRef.current = value;
      return;
    }
    const start = shownRef.current;
    const diff = value - start;
    if (diff === 0) return;
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - started) / 450, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(start + diff * eased);
      shownRef.current = next;
      setShown(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduce]);

  return <span className={cn("tabular-nums", className)}>{money(shown)}</span>;
}
