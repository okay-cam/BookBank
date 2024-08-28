import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import styles from "../styles/home.module.css";
import CardContainer from "../components/CardContainer";
import { Listing } from "../backend/types";
import { getListings } from "../backend/readData";

const Home = () => {
  const [listings, setListings] = useState<Listing[]>([]); // Initialize state with an empty array

  useEffect(() => {
    const fetchListings = async () => {
      const data = await getListings(); // Fetch listings
      setListings(data); // Set the fetched data to state
    };

    fetchListings(); // Call the async function inside useEffect
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <main className={styles.gridContainer}>
      <div className={styles.bannerSection}>
        <Banner />
      </div>
      <div className={styles.listingsSection}>
        <h1>Current listings</h1>
        <br />
        <CardContainer listings={listings} /> {/* Pass the listings from state */}
      </div>
    </main>
  );
};

export default Home;
