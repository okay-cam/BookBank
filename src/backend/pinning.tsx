import { Listing } from "./types";
import { auth, db } from "../config/firebase";
import { collection, query, where, getDocs, deleteDoc, addDoc } from "firebase/firestore";
import { collection_name, listings_field } from "../config/config";

export async function togglePinListing(listing: Listing) {
  const pinsRef = collection(db, collection_name.pins);
  const userId = auth.currentUser!.uid; // user pinning will always be current user
  console.log("userId:", userId, "listingId:", listing.id);
  const q = query(pinsRef, where(listings_field.userId, "==", userId), where(listings_field.id, "==", listing.id));

  try {
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) { // If a pin is found, unpin the listing
      const docRef = querySnapshot.docs[0].ref; // Get the first matching document
      await deleteDoc(docRef);
      console.log(`Unpinned listing: ${listing.id}`);
    } else { // If no pin is found, pin the listing
      
      await addDoc(pinsRef, {
        userId: userId,
        listingId: listing.id,
      });
      console.log(`Pinned listing: ${listing.id}`);
    }
  } catch (error) {
    console.error("Error toggling pin: ", error);
  }
}

// Function to check if a listing is pinned
export const isPinned = async (listingId: string): Promise<boolean> => {
  const pinsRef = collection(db, "pins");
  const userId = auth.currentUser?.uid; // Use optional chaining to handle cases where user may be null

  if (!userId) {
    console.log("No user is currently logged in.");
    return false;
  }

  // Query to find if the listing is pinned by the current user
  const q = query(pinsRef, where(listings_field.userId, "==", userId), where(listings_field.id, "==", listingId));

  try {
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Return true if any documents are found
  } catch (error) {
    console.error("Error checking pinned status: ", error);
    return false;
  }
};
