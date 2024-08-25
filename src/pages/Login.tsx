import React, { useState, useEffect } from "react";
// import { Navigate, Link } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";

// get auth functions for checking login state
import { doSignInWithEmailAndPassword } from "../config/auth";
import { useAuth } from "../contexts/auth_context";
import { FirebaseError } from "firebase/app";

const Login = () => {
  // Stores web page states which are used during account authentication
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Used to prevent extra login attempts while processing auth. toggled when pressing submit
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Attempt sign in after pressing submit button
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSigningIn) {
      // Attempt sign-in here
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (error) {
        setIsSigningIn(false);
        // Type assertion to FirebaseError
        const firebaseError = error as FirebaseError;

        console.log(firebaseError);
        // show correct error message depending on the issue
        switch (firebaseError.code) {
          case "auth/invalid-credential":
            setErrorMessage("Invalid credentials. Please check your input.");
            break;
          case "auth/user-not-found":
            setErrorMessage("No user found with this email.");
            break;
          case "auth/wrong-password":
            setErrorMessage("Incorrect password. Please try again.");
            break;
          case "auth/too-many-requests":
            setErrorMessage(
              "Too many failed login attempts. Please try again later."
            );
            break;
          case "auth/network-request-failed":
            setErrorMessage(
              "Network error. Please check your connection and try again."
            );
            break;
          default:
            setErrorMessage("An unexpected error occurred. Please try again.");
            break;
        }
      }
    }
  };

  return (
    <>
      <br />
      <h1>Kia ora!</h1>
      <h2>Welcome to BookBank</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="email">Email</label>
        <br />
        <input
          type="email"
          value={email}
          name="email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          autoComplete='email'
          required
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
          autoComplete='current-password'
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <br />
        <input
          type="submit"
          value="Sign in"
          className="button call-to-action"
          disabled={isSigningIn}
        />
        <br />
        <br />
        {errorMessage && (
          <p className="error-msg">{errorMessage}</p>
        )}
      </form>

      <div>
        Don't have an account? {'   '}
        <Link to={'/signup'}>Sign Up</Link>
      </div>

    </>
  );
};

export default Login;
