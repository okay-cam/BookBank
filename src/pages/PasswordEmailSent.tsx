import React from "react";
import { Link } from "react-router-dom";


const PasswordEmailSent = () => {

  return (
    <>
      <br />
      <h1>Email sent!</h1>
      <h2>You should soon receive an email to reset your password.</h2>

      <br />
      <br />
      <div>
        <Link to={'/'}>Back to Login</Link>
      </div>

    </>
  );
};

export default PasswordEmailSent;
