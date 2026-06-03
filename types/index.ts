export type ProductCategory = "T-Shirts" | "Shirts" | "Overshirts";
export type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  images: string[];
  sizes: string[];
  colors: string[];
  category: ProductCategory;
  stock: number;
  description: string;
  fabric: string;
  rating: number;
  reviews: number;
  popularity: number;
  createdAt: string;
  tone: string;
  accent: string;
  shape: "tee" | "shirt" | "overshirt";
};

export type CartItem = {
  productId: string;
  size: string;
  color: string;
  quantity: number;
};

export type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  customer: Customer;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  payment: "Cash on Delivery";
  createdAt: string;
};
