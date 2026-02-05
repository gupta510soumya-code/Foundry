import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { db, storage } from "../config/firebase.jsx";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSearch } from "../context/SearchContext";
import { useAuth } from "../context/AuthContext";
import { ItemList } from "./ItemList";
import "./Home.css";

const Home = () => {
  const location = useLocation();
  const { searchQuery } = useSearch();
  const { user } = useAuth();

  const view = location.pathname === "/" ? "all" : location.pathname.slice(1);

  const [activeForm, setForm] = useState(null);
  const [itemName, setItemName] = useState("");
  const [locationVal, setLocationVal] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [claimingId, setClaimingId] = useState(null);

  const itemsCollectionRef = collection(db, "campusItems");
  const q = query(itemsCollectionRef, orderBy("time", "desc"));

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      setError(null);
      try {
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          time: d.data().time,
        }));
        setItems(list);
      } catch (err) {
        console.error(err);
        setError("Failed to load items.");
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    let list = items;

    if (view === "lost") list = list.filter((i) => i.status === "LOST");
    else if (view === "found") list = list.filter((i) => i.status === "FOUND");
    else if (view === "my-reports" && user)
      list = list.filter((i) => i.userId === user.uid);
    else if (view === "my-reports" && !user) list = [];

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (i) =>
          (i.title && i.title.toLowerCase().includes(q)) ||
          (i.description && i.description.toLowerCase().includes(q)) ||
          (i.location && i.location.toLowerCase().includes(q))
      );
    }
    return list;
  }, [items, view, user, searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, "campusItems"), {
        title: itemName,
        location: locationVal,
        description: description,
        status: activeForm.toUpperCase(),
        time: new Date(),
        userId: user.uid,
        userEmail: user.email || null,
      });

      if (imageFile) {
        const storageRef = ref(storage, `items/${docRef.id}/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        await updateDoc(doc(db, "campusItems", docRef.id), { imageUrl });
      }

      setItemName("");
      setLocationVal("");
      setDescription("");
      setImageFile(null);
      setForm(null);
      const snapshot = await getDocs(query(itemsCollectionRef, orderBy("time", "desc")));
      setItems(
        snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          time: d.data().time,
        }))
      );
    } catch (err) {
      console.error("Error adding document: ", err);
      setError("Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  const openForm = (type) => {
    if (!user) {
      alert("Please sign in to report a lost or found item.");
      return;
    }
    setForm(type);
  };

  const handleClaimFromCard = async (item) => {
    if (!user) {
      alert("Please sign in to claim an item.");
      return;
    }
    if (item.userId === user.uid || item.resolved || item.claimedBy) return;

    setClaimingId(item.id);
    try {
      await updateDoc(doc(db, "campusItems", item.id), {
        claimedBy: user.uid,
        claimedAt: new Date(),
        claimedEmail: user.email,
      });
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? {
                ...it,
                claimedBy: user.uid,
                claimedAt: new Date(),
                claimedEmail: user.email,
              }
            : it
        )
      );

      // Notify the original reporter
      if (item.userId) {
        await addDoc(collection(db, "notifications"), {
          recipientId: item.userId,
          itemId: item.id,
          type: "claim",
          createdAt: new Date(),
          read: false,
          claimerEmail: user.email || null,
          claimerName: user.displayName || null,
          claimerId: user.uid,
          itemTitle: item.title || "",
          itemStatus: item.status || "",
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to claim item.");
    } finally {
      setClaimingId(null);
    }
  };

  const emptyMessages = {
    all: "No items yet. Be the first to report something!",
    lost: "No lost items reported yet.",
    found: "No found items reported yet.",
    "my-reports": "You haven't reported any items yet.",
  };

  return (
    <div className="homeContainer">
      {!activeForm ? (
        <>
          <div className="hero">
            <h1 className="hero-title">Lost & Found</h1>
            <p className="hero-tagline">
              Reconnect items with their owners. Your campus community starts here.
            </p>
          </div>
          <div className="action-cards">
            <button
              className="action-card lost"
              onClick={() => openForm("lost")}
            >
              <span className="action-icon">🔍</span>
              <h3>Lost Something?</h3>
              <p>Report a lost item and help others find it for you</p>
            </button>
            <button
              className="action-card found"
              onClick={() => openForm("found")}
            >
              <span className="action-icon">🎁</span>
              <h3>Found Something?</h3>
              <p>Post what you found and reunite it with its owner</p>
            </button>
          </div>

          <section className="items-section">
            <h2 className="items-section-title">
              {view === "all" && "All items"}
              {view === "lost" && "Lost items"}
              {view === "found" && "Found items"}
              {view === "my-reports" && "My reports"}
            </h2>
            <ItemList
              items={filteredItems}
              loading={loading}
              error={error}
              emptyMessage={emptyMessages[view] || emptyMessages.all}
              onClaim={handleClaimFromCard}
              currentUser={user}
              claimingId={claimingId}
            />
          </section>
        </>
      ) : (
        <div className="formContainer">
          <button
            className="back-btn"
            onClick={() => setForm(null)}
            aria-label="Go back"
          >
            ← Back
          </button>
          <h2 className="form-title">Have you {activeForm} something?</h2>
          <form className="itemForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>What have you {activeForm}?</label>
              <input
                type="text"
                placeholder="e.g. Keys, Phone, Wallet..."
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Where did you {activeForm} it?</label>
              <input
                type="text"
                placeholder="e.g. Library, Cafeteria, Building A..."
                required
                value={locationVal}
                onChange={(e) => setLocationVal(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Description & details</label>
              <textarea
                placeholder="Color, brand, distinguishing features..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Add an image (optional)</label>
              <input
                type="file"
                accept="image/*"
                className="file-input"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Report"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;
