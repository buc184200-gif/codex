"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, UserCog, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/store/cart-store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/admin", label: "Admin" }
];

export function Navbar() {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-bone/88 backdrop-blur-xl">
      <nav className="container-pad flex h-20 items-center justify-between">
        <Link href="/" className="font-display text-2xl text-ink">
          Maison Noir
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm text-smoke transition hover:text-ink",
                pathname === link.href && "text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/products"
            aria-label="Search products"
            className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white/60 transition hover:bg-white"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            href="/admin"
            aria-label="Admin dashboard"
            className="focus-ring hidden h-11 w-11 place-items-center rounded-full border border-black/10 bg-white/60 transition hover:bg-white sm:grid"
          >
            <UserCog className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="focus-ring relative grid h-11 w-11 place-items-center rounded-full bg-ink text-bone shadow-glow transition hover:bg-coal"
          >
            <ShoppingBag className="h-5 w-5" />
            <motion.span
              key={count}
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-sand px-1 text-xs text-ink"
            >
              {count}
            </motion.span>
          </Link>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white/70 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] bg-ink/45 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="ml-auto flex h-full w-[84vw] max-w-sm flex-col bg-bone p-6 shadow-soft"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-12 flex items-center justify-between">
                <span className="font-display text-2xl">Maison Noir</span>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-black/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {[...links, { href: "/cart", label: "Cart" }].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-black/10 py-5 font-display text-3xl text-ink"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
