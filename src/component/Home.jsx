import React, { useState } from 'react';
const Home = () => {
    const [activeForm, setForm] = useState(null);
    
    return(
        <div className='homeContainer'>
            {!activeForm&&(
                <div className='twobuttons'>
                    <button
                     className='lost'
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
                <form className='itemForm'>
                    <div>
                        <label >What have you {activeForm} ? </label><input type="text" placeholder="Item Name" required  /></div>
                    <div>
                        <label >Where did you {activeForm} it? </label><input type="text" placeholder="Location" required /></div>
                    <div>
                        <label >Tell us something about the item. </label><textarea placeholder='Description and Details' rows={4}></textarea></div>
                    <div>
                        <label >Kindly share an image for the reference. </label><input type="file" accept='image/*' /></div>
                    <button type='submit' className='submit-btn'> Submit Report </button>



                </form>

            </div>)}

        </div>
    )

}
export default Home;