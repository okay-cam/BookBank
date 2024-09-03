
import { Listing, ProfileData } from "../backend/types";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore"; 
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const useListings = (field?: string, value?: string) => {
  const [listings, setListings] = useState<Listing[]>([]); // State to hold the listings
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading status
  const [error, setError] = useState<string | null>(null); // State to manage errors

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true); // Start loading
      try {
        const fetchedListings = await getListings(field, value); // Fetch listings using the function
        setListings(fetchedListings); // Set the fetched listings
        setError(null); // Reset error state
      } catch (err) {
        setError("Failed to fetch the listings."); // Set error state
        console.error(err);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchListings(); // Call fetch function
  }, [field, value]); // Re-run effect if field or value changes

  return { listings, loading, error }; // Return state and fetched data
};


export async function getListings(field?: string, value?: string): Promise<Listing[]>{ // field? allows for the values to be empty
  
  const listingsRef = collection(db, "listings");
  
  let q;
  if (field && value) {
    q = query(listingsRef, where(field, "==", value)); // Return all listings that match parameters
  } else {
    q = query(listingsRef); // Return all listings if no parameters are provided
  }

  const querySnapshot = await getDocs(q);
  const listings: Listing[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data() as Listing;
    const listing: Listing = {
        id: data.id,
        title: data.title,
        authors: data.authors,
        courseCode: data.courseCode,
        description: data.description,
        imageUrl: data.imageUrl,
        userID: data.userID
      };
      listings.push(listing);
    });
  console.log(listings);
  return listings;
}

// Function to fetch profile data
export async function getProfileData(userID: string): Promise<ProfileData | null> {
  try {
    const docRef = doc(db, "users", userID);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      console.log("UID: ", userID);
      return docSnapshot.data() as ProfileData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching profile data: ", error);
    return null;
  }
}