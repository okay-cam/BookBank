import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import styles from "../styles/home.module.css";
import CardContainer from "../components/CardContainer";
import { listingData } from "../config/config";
import { getListings } from "../backend/readData";
import WishlistButton from "../components/WishlistButton";

import { useLocation } from "react-router-dom";

const Search = () => {

  // Get search query from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");

  // State to hold the listings fetched from the database
  const [listings, setListings] = useState<listingData[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  // Fetch listings when the component mounts
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // prevent empty search
        if (!searchQuery?.trim()) {
          console.log("Empty search query: '" + searchQuery + "' ")
          setLoadingListings(false);
          return;
        }
        console.log("Search query: '" + searchQuery + "' ")

        // First fetch listings based on course code
        let updatedListings = await getListings("courseCode", searchQuery);

        if (updatedListings.length <= 0) {
          // Fetch listings based on listing titles instead
          updatedListings = await getListings("title", searchQuery);
        }

        setLoadingListings(false);
        setListings(updatedListings); // Update state with fetched listings


      } catch (error) {
        console.error("Error fetching listings:", error); // Handle any errors
      } finally {
        setLoadingListings(false);
      }
    };

    fetchListings(); // Trigger the fetch when the component mounts
  }, [searchQuery]); // Empty dependency array ensures this runs once when the component is mounted

  if (!searchQuery?.trim()) {
    // If searchQuery is empty or contains only whitespace
    return (
      <main className={styles.gridContainer}>
        <div className={styles.listingsSection}>
          <h1>Search Query is Empty</h1>
          <p>Please enter a search query to see results.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.gridContainer}>
      <div className={styles.listingsSection}>

        <h1>Search Results for "{searchQuery}"</h1>
        <br />
        {

          loadingListings ? (
            <div className="spinner-border text-dark" role="status">
              <span className="sr-only"></span>
            </div>
          ) : listings.length > 0 ? (
            // Pass the listings from state
            <>
              <CardContainer listings={listings} />
              <br />
              <p>Do you want to wishlist textbooks with the course code "{searchQuery}"?
                <WishlistButton className={styles.wishlistButton} courseCode={searchQuery} />
              </p>
            </>
          ) : (
            <>
              <p>No listings found for "{searchQuery}". Please try another search.</p>
              <p>Do you want to wishlist textbooks with the course code "{searchQuery}"?
                <WishlistButton className={styles.wishlistButton} courseCode={searchQuery} />
              </p>
            </>
          )
        }

      </div>
    </main>
  );
};

export default Search;
