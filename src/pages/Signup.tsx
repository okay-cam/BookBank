import React, { useState } from 'react'
// importing bootstrap must be done before importing CSS files
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/general.css";
import { Link } from "react-router-dom";

// get auth functions for checking login state
import { doCreateUserWithEmailAndPassword } from "../config/auth";
import { FirebaseError } from "firebase/app";

// get functions for adding new user data
import { setDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";

const Signup = () => {
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Attempt sign in after pressing submit button
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isRegistering) {
      // Attempt sign-in here
      setIsRegistering(true);

      // if passwords don't match, show error
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please retype your password.');
        setIsRegistering(false);
        return;
      }

      try {

        // create account
        const userCredential = await doCreateUserWithEmailAndPassword(email, password);
        const userID = userCredential.user.uid;

        // Add placeholder user data to "users" document
        await setDoc(doc(db, "users", userID), {
          name: "Placeholder Name",
          // Change to a more suitable placeholder image instead of Teletubbies
          imageURL: "https://firebasestorage.googleapis.com/v0/b/bookbankaut.appspot.com/o/listings%2F1724547904675-tele.png?alt=media&token=bd1267b9-ddca-4635-b6e7-461ecb76978d",
          location: "Ponsonholder",
          university: "Placeholder Uni",
          degree: "Bachelor of Placeholders",
          totalDonations: 2,
          totalRatingsReceived: 5,
          rating: 80,
        });

      } catch (error) {
        // show correct error message depending on the issue
        setIsRegistering(false);

        // Type assertion to FirebaseError
        const firebaseError = error as FirebaseError;
        
        switch (firebaseError.code) {
          case 'auth/email-already-in-use':
            setErrorMessage('The email address is already in use. Please use a different email or log in.');
            break;
          case 'auth/invalid-email':
            setErrorMessage('The email address is invalid. Please enter a valid email address.');
            break;
          case 'auth/operation-not-allowed':
            setErrorMessage('Email/Password accounts are not enabled. Please enable this sign-in method in the Firebase Console.');
            break;
          case 'auth/weak-password':
            setErrorMessage('The password is too weak. Please choose a stronger password.');
            break;
          case 'auth/invalid-credential':
            setErrorMessage('Invalid credential. Please check your input and try again.');
            break;
          case 'auth/too-many-requests':
            setErrorMessage('Too many registration attempts. Please try again later.');
            break;
          case 'auth/network-request-failed':
            setErrorMessage('Network error. Please check your connection and try again.');
            break;
          case 'auth/invalid-action-code':
            setErrorMessage('The action code is invalid or expired. Please request a new action code.');
            break;
          default:
            setErrorMessage('An unexpected error occurred. Please try again.');
            console.log(error);
            break;
        }
      }
    }
  }

  return (
    <>
      <br />
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <br />
        <input
          type="email"
          value={email}
          // name="email"
          // id="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <br />
        <label htmlFor="password">Enter Password</label>
        <br />
        <input
          type="password"
          value={password}
          name="password"
          id="password"
          autoComplete="off"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <label htmlFor="password">Confirm Password</label>
        <br />
        <input
          type="password"
          value={confirmPassword}
          name="confirmPassword"
          id="confirmPassword"
          autoComplete="off"
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br />
        <br />
        <input
          type="submit"
          name="submit"
          id="submit"
          value="Create Account"
          className="button call-to-action"
          disabled={isRegistering}
        />
        <br />
        <br />
        {errorMessage && (
          <p className="error-msg">{errorMessage}</p>
        )}
      </form>
      
      <br />
      <br />
      <div>
        Already have an account? {'   '}
        <Link to={'/'}>Log in</Link>
      </div>

    </>
  );
};

export default Signup;