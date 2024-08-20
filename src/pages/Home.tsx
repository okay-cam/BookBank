import React from "react";
import "../styles/general.css";
import Banner from "../components/Banner";
import { Link } from "react-router-dom";
import styles from "../styles/home.module.css";

const Home = () => {
  return (
    <>
      <main className={styles.gridContainer}>
        <div className={styles.bannerSection}>
          <Banner />
        </div>
        <div className={styles.listingsSection}>
          <h1>Current listings</h1>
          <Link to="/listing">
            <button>Temp button to go to listing page</button>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Home;
