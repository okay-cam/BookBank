import React from "react";
// importing bootstrap must be done before importing CSS files
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Login = () => {
  return (
    <>
      <h1>Login</h1>
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
      <input type="submit" />
    </>
  );
};

export default Login;
