import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../config/firebase.jsx";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import "./Navbar.css";

export const Navbar = ({ setView }) => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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

  const navItems = [
    { id: "all", label: "All Items", icon: "🏠" },
    { id: "lost", label: "Lost", icon: "🔍" },
    { id: "found", label: "Found", icon: "🎁" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => setView("all")}>
        Foundry
      </div>

      <div className="navbar-links">
        {navItems.map((item) => (
          <button
            key={item.id}
            className="nav-link"
            onClick={() => setView(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
        {user && (
          <button
            className="nav-link"
            onClick={() => setView("my-reports")}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-label">My Reports</span>
          </button>
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
