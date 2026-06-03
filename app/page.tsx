"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PackageCheck, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/Button";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { Section } from "@/components/Section";
import { useProducts } from "@/store/product-store";

const ease = [0.22, 1, 0.36, 1] as const;

export default function HomePage() {
  const { products } = useProducts();
  const featured = products.slice(0, 4);
  const arrivals = [...products].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 4);
  const sellers = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-bone">
        <div className="absolute inset-0 opacity-42">
          <Image src="/hero-atelier.png" alt="Maison Noir premium product studio" fill priority className="object-cover object-center" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/82 to-ink/20" />
        <div className="container-pad relative grid min-h-[calc(100vh-80px)] items-center gap-12 py-16 lg:grid-cols-[0.95fr_1fr]">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease }}>
            <p className="mb-5 text-sm text-sand">Premium cotton essentials, delivered COD</p>
            <h1 className="font-display text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">
              Maison Noir
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-bone/76">
              Luxury streetwear T-shirts, shirts and overshirts cut in refined neutrals, dense cotton and calm silhouettes.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/products">
                <Button variant="light">
                  Shop collection <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products?sort=newest">
                <Button variant="outline" className="border-white/25 text-bone hover:bg-white/10">
                  New arrivals
                </Button>
              </Link>
            </div>
          </motion.div>
          <div className="hidden min-h-[520px] lg:block">
            {featured.slice(0, 3).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: index === 1 ? 4 : -3 }}
                transition={{ delay: 0.2 + index * 0.12, duration: 0.62, ease }}
                className="absolute"
                style={{
                  right: `${index * 13 + 4}%`,
                  bottom: `${index * 12 + 7}%`,
                  width: index === 0 ? 280 : 230
                }}
              >
                <ProductImage product={product} floating className="aspect-[4/5] rounded-[28px] border border-white/12" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Section eyebrow="Featured" title="Tailored for daily rotation">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </Section>

      <Section eyebrow="New arrivals" title="Just landed">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {arrivals.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </Section>

      <Section dark eyebrow="Best sellers" title="The pieces clients keep coming back for">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sellers.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </Section>

      <Section eyebrow="Benefits" title="Built like a premium wardrobe service">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "Premium cotton", body: "Dense, refined fabric selected for structure and softness." },
            { icon: Truck, title: "Fast delivery", body: "Dispatch-ready essentials across major serviceable pin codes." },
            { icon: PackageCheck, title: "COD available", body: "Pay by Cash on Delivery at checkout, clean and simple." },
            { icon: RefreshCcw, title: "Easy returns", body: "A clear 7-day return window for fit and quality confidence." }
          ].map((item) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -5 }}
              className="border border-black/10 bg-white/60 p-6"
            >
              <item.icon className="mb-5 h-7 w-7 text-gilt" />
              <h3 className="font-display text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-smoke">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Reviews" title="Quiet praise, strong repeat orders">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["The fabric has real weight without feeling stiff. It looks expensive in person.", "Arjun M."],
            ["The overshirt feels like a designer layer, but I can wear it every week.", "Rhea S."],
            ["Checkout was easy and COD made the first order feel risk-free.", "Kabir A."]
          ].map(([quote, name]) => (
            <div key={name} className="border border-black/10 bg-white/62 p-7">
              <p className="text-lg leading-8">“{quote}”</p>
              <p className="mt-6 text-sm text-gilt">{name}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="bg-[#e9dfcf] py-20">
        <div className="container-pad grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-sm text-gilt">Brand story</p>
            <h2 className="font-display text-5xl">Streetwear restraint, atelier finish.</h2>
          </div>
          <p className="text-base leading-8 text-smoke">
            Maison Noir is built around fewer, better pieces: deep neutrals, warm accents, precise silhouettes and fabrics
            that hold their shape from the first wear to the fiftieth.
          </p>
        </div>
      </section>

      <Section eyebrow="Newsletter" title="Private drops, first access">
        <form
          className="flex flex-col gap-3 bg-ink p-4 text-bone sm:flex-row"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            required
            type="email"
            placeholder="Email address"
            className="focus-ring min-h-14 flex-1 rounded-full border border-white/12 bg-white/8 px-5 text-bone placeholder:text-bone/50"
          />
          <Button variant="light" type="submit">Join list</Button>
        </form>
      </Section>

      <section className="container-pad py-16 text-center">
        <h2 className="font-display text-5xl">Ready for the new uniform?</h2>
        <Link href="/products" className="mt-8 inline-flex">
          <Button>Build your wardrobe</Button>
        </Link>
      </section>
    </>
  );
}
