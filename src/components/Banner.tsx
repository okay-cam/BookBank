// this is the call-to-action on the home page
import React from "react";
import { Link } from "react-router-dom";
import "../styles/general.css";

const Banner = () => {
  return (
    <>
      <h1>From dusty to desired</h1>
      <p>Help a student get the textbooks they need.</p>
      <Link to="/create">
        <button>Donate now!</button>
      </Link>
    </>
  );
};

export default Banner;
