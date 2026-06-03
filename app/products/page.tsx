"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Grid2X2, List, SlidersHorizontal, X } from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/Button";
import { productMatches } from "@/lib/utils";
import { useProducts } from "@/store/product-store";
import { PageTransition } from "@/components/Motion";
import { fadeUp, panelMotion, premiumEase, staggerContainer } from "@/lib/animations";

const categories = ["All", "T-Shirts", "Shirts", "Overshirts"];
const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = ["Black", "Charcoal", "Off White", "White", "Beige"];

export default function ProductsPage() {
  return (
    <Suspense fallback={<section className="container-pad py-12">Loading collection...</section>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const params = useSearchParams();
  const { products, ready } = useProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(params.get("category") || "All");
  const [size, setSize] = useState("All");
  const [color, setColor] = useState("All");
  const [stock, setStock] = useState("All");
  const [maxPrice, setMaxPrice] = useState(8000);
  const [sort, setSort] = useState(params.get("sort") || "popularity");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    const list = products
      .filter((product) => productMatches(product, query))
      .filter((product) => category === "All" || product.category === category)
      .filter((product) => size === "All" || product.sizes.includes(size))
      .filter((product) => color === "All" || product.colors.includes(color))
      .filter((product) => stock === "All" || (stock === "In stock" ? product.stock > 0 : product.stock === 0))
      .filter((product) => product.price <= maxPrice);

    return list.sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "newest") return +new Date(b.createdAt) - +new Date(a.createdAt);
      return b.popularity - a.popularity;
    });
  }, [category, color, maxPrice, products, query, size, sort, stock]);

  const filters = (
    <div className="space-y-6">
      <div>
        <label className="text-sm text-smoke" htmlFor="search">Search</label>
        <input id="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" className="focus-ring mt-2 h-12 w-full rounded-full border border-black/10 bg-white/70 px-4" />
      </div>
      <FilterSelect label="Category" value={category} onChange={setCategory} options={categories} />
      <FilterSelect label="Size" value={size} onChange={setSize} options={["All", ...sizes]} />
      <FilterSelect label="Color" value={color} onChange={setColor} options={["All", ...colors]} />
      <FilterSelect label="Stock" value={stock} onChange={setStock} options={["All", "In stock", "Sold out"]} />
      <div>
        <div className="flex justify-between text-sm text-smoke">
          <label htmlFor="price">Max price</label>
          <span>₹{maxPrice}</span>
        </div>
        <input id="price" type="range" min="2000" max="9000" step="500" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="mt-3 w-full accent-gilt" />
      </div>
    </div>
  );

  return (
    <PageTransition className="container-pad py-12">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-3 text-sm text-gilt">Collection</p>
          <h1 className="font-display text-5xl">Premium essentials</h1>
          <p className="mt-3 text-sm text-smoke">{filtered.length} pieces shown</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} type="button" onClick={() => setFiltersOpen(true)} className="inline-flex h-12 items-center gap-2 rounded-full border border-black/10 px-4 md:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </motion.button>
          <div className="inline-flex rounded-full border border-black/10 bg-white/70 p-1">
            <button type="button" aria-label="Grid view" onClick={() => setView("grid")} className={view === "grid" ? "grid h-10 w-10 place-items-center rounded-full bg-ink text-bone" : "grid h-10 w-10 place-items-center rounded-full"}>
              <Grid2X2 className="h-4 w-4" />
            </button>
            <button type="button" aria-label="List view" onClick={() => setView("list")} className={view === "list" ? "grid h-10 w-10 place-items-center rounded-full bg-ink text-bone" : "grid h-10 w-10 place-items-center rounded-full"}>
              <List className="h-4 w-4" />
            </button>
          </div>
          <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.22, ease: premiumEase }}>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="focus-ring h-12 rounded-full border border-black/10 bg-white/70 px-4 shadow-sm transition focus:shadow-glow">
              <option value="popularity">Popularity</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </motion.div>
        </div>
      </motion.div>
      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <motion.aside variants={fadeUp} initial="hidden" animate="show" className="hidden border border-black/10 bg-white/54 p-5 md:block">{filters}</motion.aside>
        <div>
          {!ready && <SkeletonGrid />}
          {ready && filtered.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid min-h-72 place-items-center border border-black/10 bg-white/52 p-8 text-center">
              <div>
                <h2 className="font-display text-3xl">No products found</h2>
                <p className="mt-2 text-sm text-smoke">Try changing the search, price, stock or size filters.</p>
                <Button className="mt-5" onClick={() => { setQuery(""); setCategory("All"); setSize("All"); setColor("All"); setStock("All"); setMaxPrice(9000); }}>Clear filters</Button>
              </div>
            </motion.div>
          )}
          <motion.div
            key={`${query}-${category}-${size}-${color}-${stock}-${sort}-${view}`}
            layout
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className={view === "grid" ? "grid gap-5 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-5"}
          >
            <AnimatePresence>
              {filtered.map((product) => <ProductCard key={product.id} product={product} view={view} />)}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {filtersOpen && (
          <motion.div className="fixed inset-0 z-[70] bg-ink/50 p-4 backdrop-blur-sm md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFiltersOpen(false)}>
            <motion.div variants={panelMotion} initial="hidden" animate="show" exit="exit" className="ml-auto h-full w-[88vw] max-w-sm overflow-y-auto bg-bone p-5" onClick={(event) => event.stopPropagation()}>
              <div className="mb-8 flex items-center justify-between">
                <h2 className="font-display text-3xl">Filters</h2>
                <button onClick={() => setFiltersOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-black/10"><X className="h-4 w-4" /></button>
              </div>
              {filters}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <div>
      <label className="text-sm text-smoke">{label}</label>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring mt-2 h-12 w-full rounded-full border border-black/10 bg-white/70 px-4">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0.45 }}
          animate={{ opacity: [0.45, 0.82, 0.45] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: index * 0.08, ease: "easeInOut" }}
          className="border border-black/10 bg-white/50 p-4"
        >
          <div className="aspect-[4/5] bg-black/10" />
          <div className="mt-4 h-4 w-24 rounded-full bg-black/10" />
          <div className="mt-3 h-6 w-4/5 rounded-full bg-black/10" />
          <div className="mt-3 h-4 w-2/3 rounded-full bg-black/10" />
        </motion.div>
      ))}
    </div>
  );
}
