import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Access",
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
