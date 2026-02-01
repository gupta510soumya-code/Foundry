import React from 'react';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

const Sidebar = ({ setView, user }) => {

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert("Logged out successfully");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="sidebar">
            <h2 className="logo">Foundry</h2>

            <nav>
                <ul>
                    <li onClick={() => setView('all')}>🏠 All Items</li>
                    <li onClick={() => setView('lost')}>🔍 Lost Gallery</li>
                    <li onClick={() => setView('found')}>🎁 Found Gallery</li>
                    {user && <li onClick={() => setView('my-reports')}>📋 My Reports</li>}
                </ul>
            </nav>

            <div className="sidebar-footer">
                {user ? (
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                ) : (
                    <p>Login to report items</p>
                )}
            </div>
        </div>
    );
};

export default Sidebar;