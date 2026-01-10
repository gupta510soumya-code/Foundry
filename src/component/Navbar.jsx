import React from "react";
import './Navbar.css';
export const Navbar=()=>{
return(
    <nav className="navbar">
        <div className="logo">FOUNDRY</div>
        <div className="searchBar">
            <input type="text" placeholder="Search for items..." />
        </div>
    </nav>
)}