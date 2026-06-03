"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/Button";
import { productMatches } from "@/lib/utils";
import { useProducts } from "@/store/product-store";

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
    <section className="container-pad py-12">
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="mb-3 text-sm text-gilt">Collection</p>
          <h1 className="font-display text-5xl">Premium essentials</h1>
          <p className="mt-3 text-sm text-smoke">{filtered.length} pieces shown</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => setFiltersOpen(true)} className="inline-flex h-12 items-center gap-2 rounded-full border border-black/10 px-4 md:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="focus-ring h-12 rounded-full border border-black/10 bg-white/70 px-4">
            <option value="popularity">Popularity</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <aside className="hidden border border-black/10 bg-white/54 p-5 md:block">{filters}</aside>
        <div>
          {!ready && <div className="grid min-h-72 place-items-center border border-black/10 bg-white/52">Loading collection...</div>}
          {ready && filtered.length === 0 && (
            <div className="grid min-h-72 place-items-center border border-black/10 bg-white/52 p-8 text-center">
              <div>
                <h2 className="font-display text-3xl">No products found</h2>
                <p className="mt-2 text-sm text-smoke">Try changing the search, price, stock or size filters.</p>
                <Button className="mt-5" onClick={() => { setQuery(""); setCategory("All"); setSize("All"); setColor("All"); setStock("All"); setMaxPrice(9000); }}>Clear filters</Button>
              </div>
            </div>
          )}
          <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {filtersOpen && (
          <motion.div className="fixed inset-0 z-[70] bg-ink/50 p-4 backdrop-blur-sm md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFiltersOpen(false)}>
            <motion.div className="ml-auto h-full w-[88vw] max-w-sm overflow-y-auto bg-bone p-5" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }} onClick={(event) => event.stopPropagation()}>
              <div className="mb-8 flex items-center justify-between">
                <h2 className="font-display text-3xl">Filters</h2>
                <button onClick={() => setFiltersOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-black/10"><X className="h-4 w-4" /></button>
              </div>
              {filters}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
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
