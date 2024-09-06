import { useState, useEffect } from "react";
import styles from "../styles/pins.module.css";
import PinsCardContainer from "../components/PinsCardContainer";
import testListings from "../backend/testListings";

// This page needs to be updated so that the actual listings are passed in instead of test listings
// The test listings don't have request functionality attached
import { Listing } from "../backend/types";
import { getListings } from "../backend/readData";

const Pins = () => {
  const [listings, setListings] = useState<Listing[]>([]); // Copied code for getting listings from Home.tsx

  useEffect(() => {
    const fetchListings = async () => {
      const updatedListings = await getListings();
      setListings(updatedListings);
    };

    fetchListings();
  }, []);

  return (
    <>
      <div className={styles.listingsSection}>
        <h1 className={styles.pinsHeader}>Your current listings</h1>
        {testListings.length > 0 ? (
          <PinsCardContainer listings={listings} />
        ) : (
          <p>You have no current listings</p>
        )}
      </div>

      <div className={styles.listingsSection}>
        <h1 className={styles.pinsHeader}>Your pinned listings</h1>
        {testListings.length > 0 ? (
          <PinsCardContainer listings={testListings} />
        ) : (
          <p>You have no pinned listings</p>
        )}
      </div>

      <div className={styles.listingsSection}>
        <h1 className={styles.pinsHeader}>Your watchlist</h1>
        {testListings.length > 0 ? (
          <PinsCardContainer listings={testListings} />
        ) : (
          <p>You have no watchlist items</p>
        )}
      </div>
    </>
  );
};

export default Pins;
