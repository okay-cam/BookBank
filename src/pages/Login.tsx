import React, { useState } from 'react'
// importing bootstrap must be done before importing CSS files
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/general.css";
import { Navigate, Link } from "react-router-dom";

// get auth functions for checking login state
import { doSignInWithEmailAndPassword } from '../config/auth'
import { useAuth } from '../contexts/auth_context'

const Login = () => {

  // Stores web page states which are used during account authentication
  // const { userLoggedIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Used to prevent extra login attempts while processing auth. toggled when pressing submit
  const [isSigningIn, setIsSigningIn] = useState(false)
  // TODO: Add a label for error messages to be displayed.
  // it may look something like:
  // {errorMessage && (
  //  {errorMessage}
  // )}
  // so it checks if the error message exists, and if so, shows it.
  // const [errorMessage, setErrorMessage] = useState('')


  // Attempt sign in after pressing submit button
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!isSigningIn) {
      // Attempt sign-in here
      setIsSigningIn(true);
      try {
          await doSignInWithEmailAndPassword(email, password);
      } catch (error) {
          setIsSigningIn(false);
          console.log(error);
          // show correct error message depending on the issue
          // switch (error.code) {
          //     case 'auth/invalid-credential':
          //         setErrorMessage('Invalid credentials. Please check your input.');
          //         break;
          //     case 'auth/user-not-found':
          //         setErrorMessage('No user found with this email.');
          //         break;
          //     case 'auth/wrong-password':
          //         setErrorMessage('Incorrect password. Please try again.');
          //         break;
          //     case 'auth/too-many-requests':
          //         setErrorMessage('Too many failed login attempts. Please try again later.');
          //         break;
          //     case 'auth/network-request-failed':
          //         setErrorMessage('Network error. Please check your connection and try again.');
          //         break;
          //     default:
          //         setErrorMessage('An unexpected error occurred. Please try again.');
          //         break;
          // }
      }
    }
  }


  return (
    <>
      <h1>Kia ora!</h1>
      <h2>Welcome to BookBank</h2>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <br />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <br />
        <label>Password</label>
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <input
          type="submit"
          value="Sign In"
        />
      </form>
    </>
  );
};

export default Login;
