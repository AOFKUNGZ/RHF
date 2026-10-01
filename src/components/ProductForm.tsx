"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CATEGORIES, ProductDraftSchema } from "@/lib/products";
import type { Product, ProductDraft } from "@/lib/products";

type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

function getFormValues(editing: Product | null) {
  if (editing) {
    return {
      title: editing.title,
      price: editing.price,
      stock: editing.stock,
      category: editing.category,
      thumbnail: editing.thumbnail,
      description: editing.description,
    };
  }

  return {
    title: "",
    price: undefined,
    stock: undefined,
    category: undefined,
    thumbnail: "",
    description: "",
  };
}

export default function ProductForm({
  editing,
  onSave,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onTouched",
    defaultValues: getFormValues(editing),
  });

  useEffect(() => {
    // เมื่อเลือกแก้ไขสินค้า หรือยกเลิกการแก้ไข ให้เปลี่ยนค่าทุกช่องในฟอร์ม
    reset(getFormValues(editing));
  }, [editing, reset]);

  function saveProduct(values: ProductDraft) {
    // ส่งค่าทั้งหมดจากฟอร์มกลับไปให้ ProductExplorer จัดการ
    onSave(values);
  }

  function cancelProduct() {
    reset(getFormValues(null));
    onCancel();
  }
  
  return (
    <form
      className="product-form"
      onSubmit={handleSubmit(saveProduct)}
      noValidate
    >
      <div className="field">
        <label htmlFor="title">ชื่อสินค้า</label>
        <input
          id="title"
          placeholder="เช่น หูฟังไร้สาย"
          {...register("title")}
          aria-invalid={!!errors.title}
        />
        <span className="field-error" role="alert">
          {errors.title?.message}
        </span>
      </div>
      <div className="field">
        <label htmlFor="price">ราคา (บาท)</label>
        <input
          id="price"
          type="number"
          step="0.01"
          min="0"
          {...register("price", { valueAsNumber: true })}
          aria-invalid={!!errors.price}
        />
        <span className="field-error" role="alert">
          {errors.price?.message}
        </span>
      </div>
      <div className="field">
        <label htmlFor="stock">จำนวนคงเหลือ</label>
        <input
          id="stock"
          type="number"
          min="0"
          {...register("stock", { valueAsNumber: true })}
          aria-invalid={!!errors.stock}
        />
        <span className="field-error" role="alert">
          {errors.stock?.message}
        </span>
      </div>
      <div className="field">
        <label htmlFor="category">หมวดหมู่</label>
        <select
          id="category"
          {...register("category")}
          aria-invalid={!!errors.category}
        >
          <option value="">เลือกหมวดหมู่</option>
          {CATEGORIES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <span className="field-error" role="alert">
          {errors.category?.message}
        </span>
      </div>
      <div className="field field-wide">
        <label htmlFor="thumbnail">ลิงก์รูปภาพ</label>
        <input
          id="thumbnail"
          type="url"
          placeholder="https://example.com/product.jpg"
          {...register("thumbnail")}
          aria-invalid={!!errors.thumbnail}
        />
        <span className="field-error" role="alert">
          {errors.thumbnail?.message}
        </span>
      </div>
      <div className="field field-wide">
        <label htmlFor="description">
          รายละเอียด <span>(ไม่บังคับ)</span>
        </label>
        <textarea
          id="description"
          rows={2}
          placeholder="รายละเอียดสั้น ๆ ของสินค้า"
          {...register("description")}
        />
      </div>
      <div className="form-actions">
        <button
          className="button button-secondary"
          type="submit"
          disabled={!isDirty || !isValid}
        >
          {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
        </button>
        <button
          className="button button-ghost"
          type="button"
          onClick={cancelProduct}
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
}
