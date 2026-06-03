"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

export function Section({
  eyebrow,
  title,
  children,
  dark = false
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <section className={dark ? "bg-ink py-20 text-bone" : "py-20"}>
      <motion.div
        className="container-pad"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      >
        {eyebrow && <p className={dark ? "mb-3 text-sm text-sand" : "mb-3 text-sm text-gilt"}>{eyebrow}</p>}
        <h2 className="font-display text-4xl md:text-5xl">{title}</h2>
        <div className="mt-10">{children}</div>
      </motion.div>
    </section>
  );
}
