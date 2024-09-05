import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import styles from "../styles/home.module.css";
import CardContainer from "../components/CardContainer";
import { Listing } from "../backend/types";
import { getListings } from "../backend/readData";

const Home = () => {
  // State to hold the listings fetched from the database
  const [listings, setListings] = useState<Listing[]>([]);

  // Fetch listings when the component mounts
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const updatedListings = await getListings(); // Fetch listings from backend
        setListings(updatedListings); // Update state with fetched listings
      } catch (error) {
        console.error("Error fetching listings:", error); // Handle any errors
      }
    };

    fetchListings(); // Trigger the fetch when the component mounts
  }, []); // Empty dependency array ensures this runs once when the component is mounted

  return (
    <main className={styles.gridContainer}>
      <div className={styles.bannerSection}>
        <Banner />
      </div>
      <div className={styles.listingsSection}>
        <h1>Current listings</h1>
        <br />
        <CardContainer listings={listings} />{" "}
        {/* Pass the listings from state */}
      </div>
    </main>
  );
};

export default Home;
