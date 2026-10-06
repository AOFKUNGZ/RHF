"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CATEGORIES, defaultQuery, SearchQuerySchema } from "@/lib/products";
import type { SearchQuery } from "@/lib/products";

type ProductSearchFormProps = {
  onSearch: (query: SearchQuery) => Promise<void>;
};

export default function ProductSearchForm({
  onSearch,
}: ProductSearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchQuery>({
    resolver: zodResolver(SearchQuerySchema),
    mode: "onTouched",
    defaultValues: defaultQuery,
  });
  return (
    <form className="search-form" onSubmit={handleSubmit(onSearch)} noValidate>
      <div className="field field-wide">
        <label htmlFor="q">ค้นหาสินค้า</label>
        <input
          id="q"
          type="search"
          placeholder="กรุณากรอกชื่อสินค้า"
          {...register("q")}
        />
      </div>
      <div className="field">
        <label htmlFor="limit">จำนวนรายการ</label>
        <input
          id="limit"
          type="number"
          min="1"
          max="30"
          {...register("limit", { valueAsNumber: true })}
          aria-invalid={!!errors.limit}
          aria-describedby="limit-error"
        />
        <span id="limit-error" className="field-error" role="alert">
          {errors.limit?.message}
        </span>
      </div>
      <div className="field">
        <label htmlFor="category">หมวดหมู่</label>
        <select id="category" {...register("category")}>
          <option value=""></option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <button
        className="button button-primary"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "กำลังค้นหา…" : "ค้นหาสินค้า"}
      </button>
    </form>
  );
}
