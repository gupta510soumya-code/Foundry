import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../config/firebase.jsx";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "./ItemDetail.css";

export function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchItem() {
      if (!id) return;
      try {
        const snap = await getDoc(doc(db, "campusItems", id));
        if (snap.exists()) {
          setItem({ id: snap.id, ...snap.data(), time: snap.data().time });
        } else {
          setError("Item not found.");
        }
      } catch (err) {
        setError("Failed to load item.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  const handleClaim = async () => {
    if (!user) return;
    setClaiming(true);
    try {
      await updateDoc(doc(db, "campusItems", id), {
        claimedBy: user.uid,
        claimedAt: new Date(),
        claimedEmail: user.email,
      });
      setItem((prev) => ({
        ...prev,
        claimedBy: user.uid,
        claimedAt: new Date(),
        claimedEmail: user.email,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setClaiming(false);
    }
  };

  const handleMarkResolved = async () => {
    if (!user || item.userId !== user.uid) return;
    setUpdating(true);
    try {
      await updateDoc(doc(db, "campusItems", id), { resolved: true });
      setItem((prev) => ({ ...prev, resolved: true }));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!user || item.userId !== user.uid) return;
    if (!window.confirm("Delete this report?")) return;
    try {
      await deleteDoc(doc(db, "campusItems", id));
      navigate("/my-reports");
    } catch (err) {
      console.error(err);
    }
  };

  const dateStr = item?.time?.toDate?.()
    ? item.time.toDate().toLocaleString()
    : item?.time ? new Date(item.time).toLocaleString() : "";

  if (loading) {
    return (
      <div className="item-detail item-detail-loading">
        <div className="spinner" />
        <p>Loading…</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="item-detail item-detail-error">
        <p>{error || "Item not found."}</p>
        <button type="button" className="btn-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    );
  }

  const isOwner = user && item.userId === user.uid;
  const isClaimed = !!item.claimedBy;

  return (
    <div className="item-detail">
      <button type="button" className="btn-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="item-detail-card">
        <div className="item-detail-media">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title} />
          ) : (
            <div className="item-detail-placeholder">
              <span>{item.status === "LOST" ? "🔍" : "🎁"}</span>
            </div>
          )}
          <span className={`item-detail-badge ${item.status?.toLowerCase()}`}>
            {item.status}
          </span>
          {item.resolved && <span className="item-detail-resolved">Reunited</span>}
        </div>

        <div className="item-detail-body">
          <h1>{item.title}</h1>
          <p className="item-detail-location">📍 {item.location}</p>
          <p className="item-detail-desc">{item.description}</p>
          <time className="item-detail-time">{dateStr}</time>

          {!item.resolved && !isClaimed && user && !isOwner && (
            <button
              type="button"
              className="btn-claim"
              onClick={handleClaim}
              disabled={claiming}
            >
              {claiming ? "Sending…" : "This is mine / I found this"}
            </button>
          )}

          {isClaimed && (
            <p className="item-detail-claimed">
              Someone has requested this item. Contact may follow.
            </p>
          )}

          {isOwner && (
            <div className="item-detail-actions">
              {!item.resolved && (
                <button
                  type="button"
                  className="btn-resolved"
                  onClick={handleMarkResolved}
                  disabled={updating}
                >
                  Mark as reunited
                </button>
              )}
              <button type="button" className="btn-delete" onClick={handleDelete}>
                Delete report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
