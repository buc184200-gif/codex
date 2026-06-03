import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-bone">
      <div className="container-pad grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <h2 className="font-display text-3xl">Maison Noir</h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-bone/70">
            Premium cotton essentials, cut with streetwear ease and finished with quiet luxury.
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-sm text-sand">Shop</h3>
          <div className="flex flex-col gap-3 text-sm text-bone/72">
            <Link href="/products">All Products</Link>
            <Link href="/products?category=T-Shirts">T-Shirts</Link>
            <Link href="/products?category=Shirts">Shirts</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm text-sand">Policies</h3>
          <div className="flex flex-col gap-3 text-sm text-bone/72">
            <span>Easy 7-day returns</span>
            <span>Cash on Delivery</span>
            <span>Privacy & terms</span>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm text-sand">Social</h3>
          <div className="flex flex-col gap-3 text-sm text-bone/72">
            <span>Instagram</span>
            <span>Pinterest</span>
            <span>X</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-bone/54">
        © 2026 Maison Noir. Crafted for launch.
      </div>
    </footer>
  );
}
