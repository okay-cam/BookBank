
import { Listing, ProfileData } from "../backend/types";
import { useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import { collection_name, listings_field, users_field } from "../config/config";

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


export async function getListings(field?: string, value?: string): Promise<Listing[]> { // field? allows for the values to be empty

  const listingsRef = collection(db, collection_name.listings);

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
      modalId: "modal-" + doc.id
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
    const docRef = doc(db, collection_name.users, userID);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      console.log("UID: ", userID);
      const data = docSnapshot.data();

      // Assign values based on ProfileData interface and convert necessary types
      const profileData: ProfileData = {

        // data from users collection
        userId: userID,
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

export async function getPins(): Promise<Listing[]> {
  const userId = auth.currentUser!.uid;
  const pinsRef = collection(db, collection_name.pins);
  const listingsRef = collection(db, collection_name.listings);
  const pinsQuery = query(pinsRef, where(users_field.userId, "==", userId));

  // get pinned collection for userId
  try {
    const querySnapshot = await getDocs(pinsQuery);

    if (querySnapshot.empty) {
      console.log("No matching documents found.");
      return [];
    } else {
      const pinnedListings: Listing[] = [];

      // iterate through pinned listing collection and use id's to create listing[]
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        const listingId = data.listingId;

        if (listingId) {
          try {
            const listingDocRef = doc(listingsRef, listingId);
            const listingDoc = await getDoc(listingDocRef);

            if (listingDoc.exists()) {
              const listingData = listingDoc.data() as Listing;
              pinnedListings.push({
                ...listingData,
                id: listingDoc.id,
                modalId: "modal-" + listingDoc.id,
              });
            } else {
              console.log(`Listing with ID ${listingId} not found.`);
            }
          } catch (error) {
            console.error(`Error fetching listing with ID ${listingId}:`, error);
          }
        }
      }

      console.log("Pinned listings found:", pinnedListings);
      return pinnedListings;
    }
  } catch (error) {
    console.error("Error getting pinned listings: ", error);
    return [];
  }
}

export async function getWishlist(): Promise<Listing[]> {
  const userId = auth.currentUser!.uid;
  const wishlistRef = collection(db, collection_name.wishlist);
  const listingsRef = collection(db, collection_name.listings);

  // Create a query to get all wishlist entries for the current user
  const wishlistQuery = query(wishlistRef, where(users_field.userId, "==", userId));

  try {
    const wishlistSnapshot = await getDocs(wishlistQuery);

    if (wishlistSnapshot.empty) {
      console.log("No wishlist entries found.");
      return [];
    }

    // Collect all course codes from the wishlist
    const courseCodes: string[] = [];
    wishlistSnapshot.docs.forEach(docSnap => {
      const data = docSnap.data();
      if (data.courseCode) {
        courseCodes.push(data.courseCode);
      }
    });

    if (courseCodes.length === 0) {
      console.log("No course codes found in wishlist.");
      return [];
    }

    // Create a query to get all listings that match the course codes
    const listingsQuery = query(listingsRef, where(listings_field.courseCode, "in", courseCodes));
    const listingsSnapshot = await getDocs(listingsQuery);

    if (listingsSnapshot.empty) {
      console.log("No matching listings found.");
      return [];
    }

    // Collect and return all matching listings
    const wishlistListings: Listing[] = [];
    listingsSnapshot.docs.forEach(docSnap => {
      const data = docSnap.data() as Listing;
      wishlistListings.push({
        ...data,
        id: docSnap.id,
        modalId: "modal-" + docSnap.id,
      });
    });

    console.log("Wishlist listings found:", wishlistListings);
    return wishlistListings;

  } catch (error) {
    console.error("Error getting wishlist listings: ", error);
    return [];
  }
}

export async function checkArray(
  collection: string,
  docId: string,
  fieldName: string,
  userId: string
): Promise<boolean> {
  const docRef = doc(db, collection, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const arrayField = data[fieldName] as string[] | undefined;

    if (Array.isArray(arrayField)) {
      if (arrayField.includes(userId)) {
        console.log(`UserID (${userId}) found in ${collection}: ${docId}, field: ${fieldName}`);
        return true;
      }
    }
  }
  
  console.log(`UserID (${userId}) not found in ${collection}: ${docId}, field: ${fieldName}`);
  return false;
}