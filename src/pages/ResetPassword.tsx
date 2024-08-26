import React, { useState } from "react";
// import { Navigate, Link } from "react-router-dom";
import { Link } from "react-router-dom";

// get auth functions for checking login state
import { doSendPasswordResetEmail } from "../config/auth";
import { FirebaseError } from "firebase/app";

const ResetPassword = () => {
  // Stores web page states which are used during account authentication
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Attempt to send password reset email after pressing submit button
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoading) {
      // Attempt sign-in here
      setIsLoading(true);
      try {
        await doSendPasswordResetEmail(email);
      } catch (error) {
        setIsLoading(false);
        // Type assertion to FirebaseError
        const firebaseError = error as FirebaseError;

        console.log(firebaseError);
        // show correct error message depending on the issue
        // TODO
        // switch (firebaseError.code) {
        //   case "auth/invalid-credential":
        //     setErrorMessage("Invalid credentials. Please check your input.");
        //     break;
        //   case "auth/user-not-found":
        //     setErrorMessage("No user found with this email.");
        //     break;
        //   default:
        //     setErrorMessage("An unexpected error occurred. Please try again.");
        //     break;
        // }
      }
    }
  };

  return (
    <>
      <br />
      <h1>Reset Password</h1>
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

        <input
          type="submit"
          value="Sign in"
          className="button call-to-action"
          disabled={isLoading}
        />

        <br />
        <br />
        {errorMessage && (
          <p className="error-msg">{errorMessage}</p>
        )}
      </form>

      <div>
        <Link to={'/'}>Back</Link>
      </div>

    </>
  );
};

export default ResetPassword;
