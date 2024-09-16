import { useState, useEffect } from "react";
import styles from "../styles/pins.module.css";
import PinsCardContainer from "../components/PinsCardContainer";
import testListings from "../backend/testListings";
import { getPins, getListings } from "../backend/readData";
import { auth } from "../config/firebase";
// This page needs to be updated so that the actual listings are passed in instead of test listings
// The test listings don't have request functionality attached
import { Listing } from "../backend/types";

const Pins = () => {
  const [pins, setPins] = useState<Listing[]>([]); // Copied code for getting listings from Home.tsx
  const [activeListings, setActiveListings] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchPins = async () => {
      const updatedListings = await getPins();
      setPins(updatedListings);
    };

    fetchPins();

    const fetchAndSetActiveListings = async () => {
      if (auth.currentUser) {
        const data = await getListings("userID", auth.currentUser.uid);
        console.log("Fetched Listings:", data);
        console.log("User ID is ", auth.currentUser.uid);
        setActiveListings(data);
      }
    };

    fetchAndSetActiveListings();
  }, []);

  return (
    <>
      <div className={styles.listingsSection}>
        <h1 className={styles.pinsHeader}>Your current listings</h1>
        {activeListings.length > 0 ? (
          <PinsCardContainer listings={activeListings} />
        ) : (
          <p>You have no active listings.</p>
        )}
      </div>

      <div className={styles.listingsSection}>
        <h1 className={styles.pinsHeader}>Your pinned listings</h1>
        {pins.length > 0 ? (
          <PinsCardContainer listings={pins} />
        ) : (
          <p>You have no pinned listings.</p>
        )}
      </div>

      <div className={styles.listingsSection}>
        <h1 className={styles.pinsHeader}>Your watchlist</h1>
        {/* {testListings.length > 0 ? (
          <PinsCardContainer listings={pins} />
        ) : (
          <p>You have no watchlist items</p>
        )} */}
        <p>Watchlist feature not yet available.</p>
      </div>
    </>
  );
};

export default Pins;
