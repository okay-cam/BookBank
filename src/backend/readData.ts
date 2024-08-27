import { collection, query, where, getDocs } from "firebase/firestore"; 
import { Listing } from "../backend/types";
import { db } from "../config/firebase";

export async function getListings(field?: string, value?: string): Promise<Listing[]> { // field? allows for the values to be empty
  
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