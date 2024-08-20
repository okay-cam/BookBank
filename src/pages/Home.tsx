import React from "react";
import "../styles/general.css";
import "../styles/home.css";
import Banner from "../components/Banner";

const Home = () => {
  return (
    <>
      <main>
        <div className="bannerSection">
          <Banner />
        </div>
        <div className="listingsSection">
          <h1>Current listings</h1>
        </div>
      </main>
    </>
  );
};

export default Home;
