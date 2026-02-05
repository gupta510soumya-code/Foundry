import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth, googleProvider, db } from "../config/firebase.jsx";
import { signInWithPopup, signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useSearch } from "../context/SearchContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export const Navbar = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const { user } = useAuth();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const q = query(
      collection(db, "notifications"),
      where("recipientId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotifications(list);
    });

    return () => unsub();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpenNotifications = async () => {
    if (!notifications.length) return;
    setNotifOpen((open) => !open);
    setActiveNotification(null);

    if (!notifOpen) {
      const unread = notifications.filter((n) => !n.read);
      for (const n of unread) {
        try {
          await updateDoc(doc(db, "notifications", n.id), { read: true });
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  const navItems = [
    { path: "/", label: "All Items", icon: "🏠" },
    { path: "/lost", label: "Lost", icon: "🔍" },
    { path: "/found", label: "Found", icon: "🎁" },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Foundry
      </Link>

      <div className="navbar-links">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
        {user && (
          <Link
            to="/my-reports"
            className={`nav-link ${location.pathname === "/my-reports" ? "active" : ""}`}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-label">My Reports</span>
          </Link>
        )}
      </div>

      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="navbar-actions">
        {user && (
          <div className="navbar-notifications">
            <button
              type="button"
              className="notif-bell"
              onClick={handleOpenNotifications}
            >
              🔔
              {unreadCount > 0 && (
                <span className="notif-badge">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && notifications.length > 0 && (
              <div className="notif-dropdown">
                <div className="notif-list">
                  {notifications.slice(0, 5).map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      className={`notif-item ${n.read ? "read" : "unread"}`}
                      onClick={() => setActiveNotification(n)}
                    >
                      <span className="notif-text">
                        Someone claimed \"{n.itemTitle || "your item"}\"
                      </span>
                    </button>
                  ))}
                  {notifications.length === 0 && (
                    <div className="notif-empty">No notifications yet.</div>
                  )}
                </div>
                {activeNotification && (
                  <div className="notif-detail">
                    <p className="notif-detail-title">
                      Claim for \"{activeNotification.itemTitle || "your item"}\"
                    </p>
                    {activeNotification.claimerEmail && (
                      <p className="notif-detail-line">
                        Claimed by: {activeNotification.claimerEmail}
                      </p>
                    )}
                    {activeNotification.createdAt && (
                      <p className="notif-detail-line">
                        At:{" "}
                        {activeNotification.createdAt?.toDate?.()
                          ? activeNotification.createdAt
                              .toDate()
                              .toLocaleString()
                          : new Date(
                              activeNotification.createdAt
                            ).toLocaleString()}
                      </p>
                    )}
                    <p className="notif-detail-hint">
                      Open \"My Reports\" and the item detail to manage this
                      claim.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {user ? (
          <div className="user-section">
            <span className="user-email">{user.email}</span>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="btn-login" onClick={handleGoogleLogin}>
            Sign in with Google
          </button>
        )}
      </div>
    </nav>
  );
};
