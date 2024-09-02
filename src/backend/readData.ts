
import { Listing, ProfileData } from "../backend/types";

import { collection, query, where, getDocs } from "firebase/firestore"; 
import { doc, getDoc } from "firebase/firestore";

import { db } from "../config/firebase";


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