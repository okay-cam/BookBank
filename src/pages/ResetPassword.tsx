import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// get auth functions for checking login state
import { doSendPasswordResetEmail } from "../config/auth";
import { FirebaseError } from "firebase/app";

const ResetPassword = () => {
  // Stores web page states which are used during account authentication
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Attempt to send password reset email after pressing submit button
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoading) {
      // Attempt sign-in here
      setIsLoading(true);
      try {
        await doSendPasswordResetEmail(email)
					.then(() => {
						// Password reset email sent!
            console.log("password email sent!");
            navigate("/password-email-sent");
					})
      } catch (error) {
        setIsLoading(false);
        // Type assertion to FirebaseError
        const firebaseError = error as FirebaseError;

        console.log(firebaseError);
        // show correct error message depending on the issue
        switch (firebaseError.code) {
          case "auth/invalid-email":
            setErrorMessage("Invalid email. Please fix the email's formatting.");
            break;
          case "auth/too-many-requests":
            setErrorMessage("Too many requests. Please try again later.");
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
          value="Send Reset Email"
          className="button call-to-action"
          disabled={isLoading}
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
        <Link to={'/'}>Back to Login</Link>
      </div>

    </>
  );
};

export default ResetPassword;
