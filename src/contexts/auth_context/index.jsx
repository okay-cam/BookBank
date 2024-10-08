import React, { useContext, useState, useEffect } from 'react';
import { auth } from "../../config/firebase";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase"
import { onAuthStateChanged } from "firebase/auth";
import { getProfileData } from '../../backend/readData';

// stores currentUser (firebase auth data or null),
// userLoggedIn (bool),
// and loading (bool)
const AuthContext = React.createContext();

// Retrieve auth values. Import this when using auth!
export function useAuth() {
    return useContext(AuthContext)
}

// Provide data to the auth context
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    }, [])

    async function initializeUser(user) {
        if (user) {
            
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnapshot = await getDoc(userDocRef);

            // Check if the user document exists before attempting to update
            if (userDocSnapshot.exists()) {
                // Update only the lastLoggedIn field
                await updateDoc(userDocRef, {
                    lastLoggedIn: auth.currentUser.metadata.lastSignInTime,
                });
            } else {
                console.log("User document doesn't exist yet, skipping update.");
            }

            // setCurrentUser({ ...user });
            // // Update only the lastLoggedIn field
            // await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            //     lastLoggedIn: auth.currentUser.metadata.lastSignInTime
            // });
            setUserLoggedIn(true);

            // Fetch and store profile picture in local storage
            const profileData = await getProfileData(user.uid);
            if (profileData?.imageUrl) {
                localStorage.setItem('profilePic', profileData.imageUrl);
            }

        }
        else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false);
    }

    const auth_values = {
        // contains firebase auth data (uid, email, etc), or null
        currentUser,
        // boolean for if the user is logged in
        userLoggedIn,
        // 
        loading
    }

    return (
        <AuthContext.Provider value={auth_values}>
            {!loading && children}
        </AuthContext.Provider>
    )

}