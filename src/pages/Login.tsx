import React from "react";
// importing bootstrap must be done before importing CSS files
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/general.css";
import { Link } from "react-router-dom";

const Login = () => {
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
