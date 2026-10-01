"use client";

import { useState, useEffect } from "react";
import { defaultQuery, fetchProducts } from "@/lib/products";
import type {
  Product,
  ProductDraft,
  ProductList,
  SearchQuery,
} from "@/lib/products";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";

type LoadState = "idle" | "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [total, setTotal] = useState(0);
  // เก็บสินค้าที่กำลังแก้ไขไว้ ถ้าเป็น null แปลว่าอยู่ในโหมดเพิ่มสินค้า
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
3
  function showResult(list: ProductList) {
    // สร้าง array ใหม่ก่อนเก็บลง state เพื่อไม่อ้างอิง array จากผลลัพธ์เดิม
    setProducts([...list.products]);
    setTotal(list.total);
    setStatus("ready");
  }
  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error ? error.message : "ไม่สามารถเรียกข้อมูลได้",
    );
    setStatus("error");
  }
  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");
    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }
  function saveProduct(draft: ProductDraft) {
    // กรณีที่ 1: กำลังแก้ไขสินค้าเดิม
    if (editingProduct) {
      const updatedProducts = products.map((item) => {
        // เปลี่ยนข้อมูลเฉพาะรายการที่มี id ตรงกับสินค้าที่เลือกแก้ไข
        if (item.id === editingProduct.id) {
          return { ...draft, id: item.id };
        }

        // รายการอื่นคืนค่าเดิม จึงไม่มีอะไรเปลี่ยน
        return item;
      });

      setProducts(updatedProducts);

      // ล้างสินค้าที่กำลังแก้ไข เพื่อกลับไปเป็นโหมดเพิ่มสินค้า
      setEditingProduct(null);
      return;
    }

    // กรณีที่ 2: ไม่มีรายการที่กำลังแก้ไข จึงเพิ่มสินค้าใหม่
    setProducts((items) => [{ ...draft, id: Date.now() }, ...items]);
    setTotal((value) => value + 1);
    setStatus("ready");
  }
  function deleteProduct(product: Product) {
    setProducts((items) => items.filter((item) => item.id !== product.id));
    setTotal((value) => Math.max(0, value - 1));
    if (editingProduct?.id === product.id) setEditingProduct(null);
  }
  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Product Explorer home">
          <span className="brand-mark" aria-hidden="true">
            P
          </span>
          <span>Product Explorer</span>
        </a>
        <span className="live-status">
          <i aria-hidden="true" /> อัปเดตข้อมูลแบบเรียลไทม์
        </span>
      </header>
      <header className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">PRODUCT MANAGEMENT</p>
          <h1>
            ทุกสินค้าของคุณ
            <br />
            <em>ชัดเจนในที่เดียว</em>
          </h1>
          <p>
            ค้นหา ตรวจสอบ และเพิ่มรายการสินค้าได้อย่างรวดเร็ว
            พร้อมมุมมองที่อ่านง่ายสำหรับทุกวันทำงาน
          </p>
          <div className="hero-actions">
            <a className="hero-link" href="#search-heading">
              เริ่มค้นหาสินค้า <span aria-hidden="true">→</span>
            </a>
            <span className="hero-note">จัดการได้สูงสุด 30 รายการต่อครั้ง</span>
          </div>
        </div>
        <div className="hero-stats" aria-label="ภาพรวมสินค้า">
          <div className="stat-card stat-card-featured">
            <span className="stat-icon" aria-hidden="true">
              ◈
            </span>
            <span>สินค้าที่แสดง</span>
            <strong>{status === "ready" ? products.length : "—"}</strong>
            <small>รายการในมุมมองนี้</small>
          </div>
          <div className="stat-card">
            <span>สินค้าทั้งหมด</span>
            <strong>{status === "ready" ? total.toLocaleString() : "—"}</strong>
            <small>พร้อมให้สำรวจ</small>
          </div>
        </div>
      </header>
      <section className="panel search-panel" aria-labelledby="search-heading">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">ค้นหาคลังสินค้า</p>
            <h2 id="search-heading">ค้นหาสินค้า</h2>
          </div>
          <span className="hint">
            <span aria-hidden="true">⌘</span> ค้นหาได้สูงสุด 30 รายการ
          </span>
        </div>
        <ProductSearchForm onSearch={loadProducts} />
      </section>
      <section className="panel add-panel" aria-labelledby="add-heading">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">
              {editingProduct ? "แก้ไขรายการ" : "สร้างรายการใหม่"}
            </p>
            <h2 id="add-heading">
              {editingProduct ? `แก้ไข ${editingProduct.title}` : "เพิ่มสินค้า"}
            </h2>
          </div>
        </div>
        <ProductForm
          key={editingProduct?.id ?? "new-product"}
          editing={editingProduct}
          onSave={saveProduct}
          onCancel={() => setEditingProduct(null)}
        />
      </section>
      <section
        className="results"
        aria-live="polite"
        aria-labelledby="results-heading"
      >
        <div className="results-heading">
          <div>
            <p className="eyebrow">ผลการค้นหา</p>
            <h2 id="results-heading">รายการสินค้า</h2>
          </div>
          {status === "ready" && (
            <span className="count">
              แสดง {products.length} จาก {total} รายการ
            </span>
          )}
        </div>
        {status === "idle" && (
          <p className="empty-state">
            เลือกเงื่อนไขแล้วกด “ค้นหาสินค้า” เพื่อเริ่มต้น
          </p>
        )}
        {status === "loading" && (
          <p className="notice">กำลังโหลดข้อมูลสินค้า…</p>
        )}
        {status === "error" && (
          <p className="notice notice-error" role="alert">
            {errorMessage}
          </p>
        )}
        {status === "ready" && products.length === 0 && (
          <p className="empty-state">ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>
        )}
        {status === "ready" && products.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>สินค้า</th>
                  <th>ราคา</th>
                  <th>คงเหลือ</th>
                  <th>หมวดหมู่</th>
                  <th>รูปภาพ</th>
                  <th>
                    <span className="sr-only">การจัดการ</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.id}>
                    <td className="product-name">
                      <span className="product-avatar">
                        {item.title.charAt(0)}
                      </span>
                      {item.title}
                    </td>
                    <td className="price">฿{item.price.toLocaleString()}</td>
                    <td>
                      <span
                        className={item.stock > 10 ? "stock-good" : "stock-low"}
                      >
                        {item.stock} ชิ้น
                      </span>
                    </td>
                    <td>
                      <span className="tag">{item.category}</span>
                    </td>
                    <td>
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        width={52}
                        height={52}
                      />
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="row-action row-action-edit"
                          type="button"
                          onClick={() => setEditingProduct(item)}
                        >
                          แก้ไข
                        </button>
                        <button
                          className="row-action row-action-delete"
                          type="button"
                          onClick={() => deleteProduct(item)}
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
