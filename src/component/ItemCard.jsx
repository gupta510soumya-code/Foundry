import React from "react";
import { useNavigate } from "react-router-dom";
import "./ItemCard.css";

export function ItemCard({ item }) {
  const navigate = useNavigate();
  const date = item.time?.toDate?.()
    ? item.time.toDate().toLocaleDateString()
    : new Date(item.time).toLocaleDateString();

  return (
    <article
      className="item-card"
      onClick={() => navigate(`/item/${item.id}`)}
    >
      <div className="item-card-image-wrap">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="item-card-image" />
        ) : (
          <div className="item-card-placeholder">
            <span>{item.status === "LOST" ? "🔍" : "🎁"}</span>
          </div>
        )}
        <span className={`item-card-badge ${item.status?.toLowerCase()}`}>
          {item.status}
        </span>
      </div>
      <div className="item-card-body">
        <h3 className="item-card-title">{item.title}</h3>
        <p className="item-card-location">{item.location}</p>
        <p className="item-card-desc">{item.description?.slice(0, 80)}{item.description?.length > 80 ? "…" : ""}</p>
        <time className="item-card-time">{date}</time>
        {item.resolved && (
          <span className="item-card-resolved">Reunited</span>
        )}
      </div>
    </article>
  );
}
