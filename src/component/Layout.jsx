import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import "../App.css";

export function Layout() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-box">
        <Outlet />
      </main>
    </div>
  );
}
