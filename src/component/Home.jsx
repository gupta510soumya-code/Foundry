import React, { useState } from 'react';
import { db, auth } from "../config/firebase.jsx"; 
import { collection, addDoc } from "firebase/firestore";
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
            {!activeForm&&(
                <div className='twobuttons'>
                    <button className='lost'
                     onClick={()=>{
                        setForm('lost')
                     }} >
                        <span>🔍</span>
                        Lost Something?
                    </button>

                    <button 
                    className='found'
                    onClick={()=>{
                        setForm('found')
                    }}>
                        <span>🎁</span>
                        Found Something?

                    </button>

                </div>
            )}
            {activeForm&& (
            <div className='formContainer'>
                <button className='back-btn' onClick={()=>{setForm(null)}}>
                    🔙
                </button>
                <h2>
                    Have you {activeForm} something?
                </h2>
                    <form className='itemForm' onSubmit={handleSubmit}>
                    <div>
                        <label >What have you {activeForm} ? </label>
                        <input type="text"
                         placeholder="Item Name"
                         required 
                         value={itemName}
                         onChange={(e) => setItemName(e.target.value)} /></div>
                    <div>
                        <label >Where did you {activeForm} it? </label>
                        <input type="text"
                         placeholder="Location"
                         required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)} /></div>
                    <div>
                        <label >Tell us something about the item. </label>
                        <textarea placeholder='Description and Details'
                         rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                         ></textarea></div>
                    <div>
                        <label >Kindly share an image for the reference. </label>
                        <input type="file" accept='image/*' /></div>
                    <button type='submit' className='submit-btn'> Submit Report </button>



                </form>

            </div>)}

        </div>
    )

}
export default Home;