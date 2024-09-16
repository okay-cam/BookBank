import React, { useContext, useState, useEffect } from 'react';
import { auth } from "../../config/firebase";
import { updateDoc, doc } from "firebase/firestore";
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
            setCurrentUser({ ...user });
            // Update only the lastLoggedIn field
            await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                lastLoggedIn: auth.currentUser.metadata.lastSignInTime
            });
            setUserLoggedIn(true);

            // Fetch and store profile picture in local storage
            const profileData = await getProfileData(user.uid);
            if (profileData?.profilePic) {
                localStorage.setItem('profilePic', profileData.profilePic);
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