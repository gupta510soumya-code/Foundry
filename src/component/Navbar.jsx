import React from "react";
import { Link, useLocation } from "react-router-dom";
import { auth, googleProvider } from "../config/firebase.jsx";
import { signInWithPopup, signOut } from "firebase/auth";
import { useSearch } from "../context/SearchContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export const Navbar = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const { user } = useAuth();
  const location = useLocation();

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
