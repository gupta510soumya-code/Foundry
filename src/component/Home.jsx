import React, { useState } from 'react';
import { db, auth } from "../config/firebase.jsx"; 
import { collection, addDoc } from "firebase/firestore";
import './Home.css';
const Home = () => {
    const [activeForm, setForm] = useState(null);

    const [itemName, setItemName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    const itemsCollectionRef = collection(db, "campusItems");
    
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the page from refreshing
        try {
            // This creates the collection "campusItems" automatically on first submit
            await addDoc(collection(db, "campusItems"), {
                title: itemName, // from your input state
                location: location, // from your input state
                description: description, // from your input state
                status: activeForm.toUpperCase(),
                time: new Date()
            });
            alert("Success! Check your Firestore tab now.");

            setItemName("");
            setLocation("");
            setDescription("");
            setForm(null);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    return(
        <div className='homeContainer'>
            {!activeForm ? (
                <>
                    <div className='hero'>
                        <h1 className='hero-title'>Lost & Found</h1>
                        <p className='hero-tagline'>
                            Reconnect items with their owners. Your campus community starts here.
                        </p>
                    </div>
                    <div className='action-cards'>
                        <button 
                            className='action-card lost'
                            onClick={() => setForm('lost')}
                        >
                            <span className='action-icon'>🔍</span>
                            <h3>Lost Something?</h3>
                            <p>Report a lost item and help others find it for you</p>
                        </button>

                        <button 
                            className='action-card found'
                            onClick={() => setForm('found')}
                        >
                            <span className='action-icon'>🎁</span>
                            <h3>Found Something?</h3>
                            <p>Post what you found and reunite it with its owner</p>
                        </button>
                    </div>
                </>
            ) : (
            <div className='formContainer'>
                <button className='back-btn' onClick={() => setForm(null)} aria-label="Go back">
                    ← Back
                </button>
                <h2 className='form-title'>
                    Have you {activeForm} something?
                </h2>
                <form className='itemForm' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label>What have you {activeForm}?</label>
                        <input 
                            type="text"
                            placeholder="e.g. Keys, Phone, Wallet..."
                            required 
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)} 
                        />
                    </div>
                    <div className='form-group'>
                        <label>Where did you {activeForm} it?</label>
                        <input 
                            type="text"
                            placeholder="e.g. Library, Cafeteria, Building A..."
                            required
                            value={location}
                            onChange={(e) => setLocation(e.target.value)} 
                        />
                    </div>
                    <div className='form-group'>
                        <label>Description & details</label>
                        <textarea 
                            placeholder="Color, brand, distinguishing features..."
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Add an image (optional)</label>
                        <input type="file" accept='image/*' className='file-input' />
                    </div>
                    <button type='submit' className='submit-btn'>Submit Report</button>
                </form>
            </div>
            )}
        </div>
    )

}
export default Home;