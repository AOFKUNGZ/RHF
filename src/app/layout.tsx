import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Explorer",
  description: "ค้นหาและจัดการรายการสินค้า",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
