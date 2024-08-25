import React from "react";
import Banner from "../components/Banner";
import { Link } from "react-router-dom";
import styles from "../styles/home.module.css";
import CardContainer from "../components/CardContainer";
import testListings from "../backend/testListings";

const Home = () => {
  return (
    <>
      <main className={styles.gridContainer}>
        <div className={styles.bannerSection}>
          <Banner />
        </div>
        <div className={styles.listingsSection}>
          <h1>Current listings</h1>
          <CardContainer listings={testListings}/>

          <Link to="/listing">
            <button>Temp button to go to listing page</button>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Home;
