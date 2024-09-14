import { Listing } from "./types";
import { auth, db } from "../config/firebase";
import { collection, query, where, getDocs, deleteDoc, addDoc } from "firebase/firestore";

export async function togglePinListing(listing: Listing) {
  const pinsRef = collection(db, "pins");
  const userId = auth.currentUser!.uid; // user pinning will always be current user
  console.log("userId:", userId, "listingId:", listing.id);
  const q = query(pinsRef, where("userId", "==", userId), where("listingId", "==", listing.id));

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