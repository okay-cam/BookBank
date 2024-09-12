
import { Listing, ProfileData } from "../backend/types";
import { useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
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
        id: doc.id,
        title: data.title,
        authors: data.authors,
        courseCode: data.courseCode,
        description: data.description,
        imageUrl: data.imageUrl,
        userID: data.userID,
        modalId: "modal-"+doc.id
      };
      listings.push(listing);
    });
  console.log(listings);
  return listings;
}

// in future, may add less strict searching which ignores case & whitespace


// Function to fetch profile data
export async function getProfileData(userID: string): Promise<ProfileData | null> {
  try {
    const docRef = doc(db, "users", userID);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      console.log("UID: ", userID);
      const data = docSnapshot.data();

      // Assign values based on ProfileData interface and convert necessary types
      const profileData: ProfileData = {
        
        // data from users collection
        name: data.name,
        profilePic: data.profilePic,
        university: data.university,
        degree: data.degree,
        location: data.location,
        totalDonations: data.totalDonations,
        totalRatingsReceived: data.totalRatingsReceived,
        overallRating: data.overallRating,

        // data from auth -> users collection
        email: data.email,
        joinDate: data.joinDate, 
        lastLoggedIn: data.lastLoggedIn

        // Add other fields as needed
      };
      


      return profileData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching profile data: ", error);
    return null;
  }
}

export function checkListingOwner(listing: Listing): boolean {
  // Ensure auth.currentUser and the listing's userID exist
  if (auth.currentUser && listing.userID) {
    return auth.currentUser.uid === listing.userID;
  }
  return false;
}

export async function getPins(userId: string) {
  const listingsRef = collection(db, "pins");

  // Create a compound query to filter listings by listingId and userId
  const q = query(listingsRef, where("userId", "==", userId));

  try {
    // Execute the query
    const querySnapshot = await getDocs(q);

    // Check if there are any results
    if (querySnapshot.empty) {
      console.log("No matching documents found.");
    } else {
      // Log the results
      querySnapshot.forEach((doc) => {
        console.log(`Found listing: ${doc.id} =>`, doc.data());
      });
    }
  } catch (error) {
    console.error("Error getting documents: ", error);
  }
}