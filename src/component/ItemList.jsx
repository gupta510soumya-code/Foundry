import React from "react";
import { ItemCard } from "./ItemCard";
import "./ItemList.css";

export function ItemList({ items, loading, error, emptyMessage }) {
  if (loading) {
    return (
      <div className="item-list-loading">
        <div className="spinner" />
        <p>Loading items…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="item-list-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="item-list-empty">
        <p>{emptyMessage || "No items yet."}</p>
      </div>
    );
  }

  return (
    <div className="item-list">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
