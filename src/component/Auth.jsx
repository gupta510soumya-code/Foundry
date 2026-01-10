import { auth,googleProvider } from "../config/firebase.jsk"
import { createUserWithEmailAndPassword,signInWithPopup } from "firebase/auth"
import { useState } from "react"

export const Auth = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const signIn = async () => {
        // try{
        await createUserWithEmailAndPassword(auth,email,password);
        alert("Account Created!");
        // catch(err){
        //     console.error(err);

        // }
     }

    const signInWithGoogle = async () => {
        // try{
        await signInWithPopup (auth,googleProvider);
        alert("Account Created!");
        // catch(err){
        //     console.error(err);

        // }
    }

    return (
        <div>
            <input
                placeholder="Email.."
                onChange={(e) => setEmail(e.target.value)} />
            <input
                placeholder="Password.."
                type="password"
                onChange={(e) => setPassword(e.target.value)} />
            <button onClick={signIn}>Sign in</button>
            <button onClick={signInWithGoogle}>Sign in with Google</button>

        </div>
    )
}