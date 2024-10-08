// import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";


export const doSendPasswordResetEmail = (email) => {
    return sendPasswordResetEmail(auth, email);
}

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// export const doSignInWithGoogle = async () => {
//     const provider = new GoogleAuthProvider();
//     const result = await signInWithPopup(auth, provider);
//     // optionally save the user account in firestore
//     //const user = result.user;
//     return result;
// };

export const doSignOut = () => {
    return auth.signOut();
};


// export const doPasswordChange = (password) => {
// return updatePassword(auth.currentUser, password);
// };

// export const doSendEmailVerification = () => {
// return sendEmailVerification(auth.currentUser, {
//     url: `${window.location.origin}/home`,
// });
// };