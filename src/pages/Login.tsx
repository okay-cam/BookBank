import React, { useState } from 'react'
// importing bootstrap must be done before importing CSS files
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/general.css";
import { Navigate, Link } from "react-router-dom";

// get auth functions for checking login state
// TODO: add firebase auth functions for signing in
import { useAuth } from '../../../contexts/authContext'

const Login = () => {

  const { userLoggedIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  return (
    <>
      <h1>Kia ora!</h1>
      <h2>Welcome to BookBank</h2>
      <label>Username</label>
      <br />
      <input type="text" />
      <br />
      <br />
      <label>Password</label>
      <br />
      <input type="password" />
      <br />
      <br />
      <Link to="/home">
        <input type="submit" />
      </Link>
    </>
  );
};

export default Login;
