import React, { useState } from 'react'
// importing bootstrap must be done before importing CSS files
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/general.css";
import { Navigate, Link } from "react-router-dom";

// get auth functions for checking login state
// TODO: add firebase auth functions for signing in
import { useAuth } from '../contexts/auth_context'

const Login = () => {

  // Stores web page states which are used during account authentication
  // const { userLoggedIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // isSigningIn may be used to prevent extra login attempts when processing authentication
  // const [isSigningIn, setIsSigningIn] = useState(false)
  // TODO: Add a label for error messages to be displayed. Cam can set the text through code later
  // const [errorMessage, setErrorMessage] = useState('')

  return (
    <>
      <h1>Kia ora!</h1>
      <h2>Welcome to BookBank</h2>
      <label>Email</label>
      <br />
      <input
        type="text"
        value={email}
        onChange={(e) => { setEmail(e.target.value) }}
      />
      <br />
      <br />
      <label>Password</label>
      <br />
      <input type="password"
        value={password}
        onChange={(e) => { setPassword(e.target.value) }} />
      <br />
      <br />
      <Link to="/home">
        <input type="submit" />
      </Link>
    </>
  );
};

export default Login;
