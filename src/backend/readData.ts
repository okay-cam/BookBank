
import { Listing, ProfileData } from "../backend/types";
import { useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { collection, query, where, getDocs, getDoc, doc, DocumentData } from "firebase/firestore";
import { db } from "../config/firebase";
import { fb_location, listings_field, users_field } from "../config/config";

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

  const listingsRef = collection(db, fb_location.listings);

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
export const getProfileData = async (userID: string): Promise<ProfileData | null> => {
  console.log("Fetching profile data for userID:", userID); // Add this line
  if (!userID) {
    console.error("userID is undefined or null");
    return null; // Early return if userID is not valid
  }

  try {
    const docRef = doc(db, fb_location.users, userID); // Ensure this is a valid path
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as ProfileData; // Adjust according to your data structure
    } else {
      console.error("No such document!");
      return null; // Return null if no document is found
    }
  } catch (error) {
    console.error("Error fetching profile data: ", error);
    return null; // Handle the error appropriately
  }
};

export function checkListingOwner(listing: Listing): boolean {
  // Ensure auth.currentUser and the listing's userID exist
  if (auth.currentUser && listing.userID) {
    return auth.currentUser.uid === listing.userID;
  }
  return false;
}

export async function checkArray( // returns boolean if user in array or not
  collection: string, 
  docId: string, 
  fieldName: string, // array name
  value: string // what should be in array
): Promise<boolean> {
  const docRef = doc(db, collection, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const arrayField = data[fieldName] as string[] | undefined;

    if (Array.isArray(arrayField)) {
      if (arrayField.includes(value)) {
        console.log(`UserID (${value}) found in ${collection}: ${docId}, field: ${fieldName}`);
        return true;
      }
    }
  }
  
  console.log(`UserID (${value}) not found in ${collection}: ${docId}, field: ${fieldName}`);
  return false;
}

// TERRIBLE NAME: SHOULD BE RENAMED!!!!!!
export async function getDocumentsWhereArray(
  collectionName: string,
  fieldName: string, // array name
  userID: string // check if user is in the array
): Promise<any[]> {
  console.log(`Starting to get documents from collection: ${collectionName}, where field: ${fieldName} contains userID: ${userID}`);

  try {
    // Construct the query
    const q = query(collection(db, collectionName), where(fieldName, "array-contains", userID));
    
    // Execute the query
    const querySnapshot = await getDocs(q);
    
    console.log(`Query executed, number of documents found: ${querySnapshot.size}`);

    // Map the results to an array of documents
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`Documents retrieved: ${JSON.stringify(documents)}`);

    return documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Reads array and then returns all documents from a collection where a field matche
export async function getWishlist(userID: string) {
  try {
    // 1. Get the user's profile document from the 'users' collection
    const usersRef = collection(db, fb_location.users); // 'users' collection
    const userQuery = query(usersRef, where(users_field.userID, '==', userID));
    const userSnapshot = await getDocs(userQuery);
    
    if (userSnapshot.empty) {
      console.log("No user profile found for the given userId.");
      return [];
    }

    const userProfile = userSnapshot.docs[0].data(); // Assuming userId is unique, get the first result

    // 2. Extract the wishlist array from the user's profile
    const wishlist: string[] = userProfile.wishlist || [];
    
    if (wishlist.length === 0) {
      console.log("User's wishlist is empty.");
      return [];
    }

    // 3. Query the 'listings' collection for matching courseCode using 'in' operator
    const listingsRef = collection(db, fb_location.listings); // 'listings' collection
    const listingsQuery = query(listingsRef, where(listings_field.courseCode, 'in', wishlist));

    const listingsSnapshot = await getDocs(listingsQuery);

    if (listingsSnapshot.empty) {
      console.log("No matching listings found.");
      return [];
    }

    // 4. Map over the snapshot to extract document data
    const matchedListings = listingsSnapshot.docs.map((doc: DocumentData) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return matchedListings;

  } catch (error) {
    console.error("Error fetching listings: ", error);
    throw error;
  }
}

export async function getImageUrl(collection: string, docId: string): Promise<string | null> {
  const docRef = doc(db, collection, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const listingData = docSnap.data();
    // Check if the imageUrl field exists in document
    if (listingData && listingData[listings_field.imageUrl]) {
      console.log(listingData[listings_field.imageUrl]); 
      return listingData[listings_field.imageUrl] as string; 
    } else {
      return null; // Return null if the imageUrl field is missing
    }
  } else {
    console.log("Document does not exist!"); 
    return null; 
  }
}