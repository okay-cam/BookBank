import { useState, useEffect } from "react";
import styles from "../styles/pins.module.css";
import PinsCardContainer from "../components/PinsCardContainer";
//import testListings from "../backend/testListings";
import {
  getDocumentsWhereArray,
  getListings,
  getWishlist,
} from "../backend/readData";
import { auth } from "../config/firebase";
// This page needs to be updated so that the actual listings are passed in instead of test listings
// The test listings don't have request functionality attached
import {
  fb_location,
  listings_field,
  listingData as Listing,
  users_field,
} from "../config/config";

const SavedListings = () => {
  const [pins, setPins] = useState<Listing[]>([]); // Copied code for getting listings from Home.tsx
  const [wishlist, setWishlist] = useState<Listing[]>([]);

  useEffect(() => {
    const fetchPins = async () => {
      const updatedListings = await getDocumentsWhereArray(
        fb_location.listings,
        listings_field.pinned,
        auth.currentUser!.uid
      );
      setPins(updatedListings);
    };

    fetchPins();

    const fetchWishlist = async () => {
      const wishlistListings = await getWishlist(auth.currentUser!.uid);
      setWishlist(wishlistListings);
    };

    fetchWishlist();
  }, []);

  return (
    <>
      <div className={styles.listingsSection}>
        <h1 className={styles.pinsHeader}>Your pinned listings</h1>
        {pins.length > 0 ? (
          <PinsCardContainer listings={pins} collectionName="pins" />
        ) : (
          <p>You have no pinned listings.</p>
        )}
      </div>

      <div className={styles.listingsSection}>
        <h1 className={styles.pinsHeader}>Your wishlist</h1>
        {wishlist.length > 0 ? (
          <>
            <p>These are listings with course codes that you have wishlisted.</p>
            <PinsCardContainer listings={wishlist} collectionName="wishlist" />
          </>
        ) : (
          <p>You have no wishlisted courses</p>
        )}
      </div>
    </>
  );
};

export default SavedListings;
