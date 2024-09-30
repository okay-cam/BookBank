import React, { useState } from 'react'
// importing bootstrap must be done before importing CSS files
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/general.css";
import { Link } from "react-router-dom";

// get auth functions for checking login state
import { doCreateUserWithEmailAndPassword } from "../config/auth";
import { FirebaseError } from "firebase/app";

// get functions for adding new user data
import { User } from 'firebase/auth';
import { ProfileData, fb_location } from "../config/config";
import { writeToFirestore } from "../backend/writeData";

const Signup = () => {
  
  const [email, setEmail] = useState('')
  const [username, setName] = useState('')
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

      // ensure a non-blank username
      if (username.trim().length === 0) {
        setErrorMessage('Please enter a non-blank name.');
        setIsRegistering(false);
        return;
      }

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

        // const testProfile: ProfileData = {
        //   name: "Chelsea Smith",
        //   email: "chelsmith1999@gmail.com",
        //   profilePic: image,
        //   university: "University of Auckland",
        //   degree: "Bachelor of Arts",
        //   location: "Ponsonby",
        //   joinDate: new Date("2019-11-21"), // Date object for joinDate
        //   lastLoggedIn: new Date("2022-03-03"), // Date object for lastLoggedIn
        //   totalDonations: 2,
        //   numRatings: 2,
        //   overallRating: 100
        // };

        // get auth data
        const currentUser: User = userCredential.user
        
        const newProfile: ProfileData = {
          userID: userID,
          username: username.trim(),
          // No profile picture initially
          // imageUrl: null,  // not sure why null, better to assign as optional.
          // location: null,
          // university: null,
          // degree: null,
          totalDonations: 0,
          totalRatingsReceived: 0,
          overallRating: 0,
          // add data from auth
          email: currentUser.email!,
          joinDate: currentUser.metadata.creationTime!,
          lastLoggedIn: currentUser.metadata.lastSignInTime!
        }

        // Add user data to "users" document
        const createdID = await writeToFirestore(fb_location.users, newProfile, userID);
        console.log(createdID);

        setIsRegistering(false);

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
    <div className="signUpContainer">
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
        <label htmlFor="username">Display Name</label>
        <br />
        <input
          type="text"
          value={username}
          required
          onChange={(e) => setName(e.target.value)}
          id="nameField"
        />
        <br />
        <br />
        <label htmlFor="password">Password</label>
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

    </div>
  );
};

export default Signup;