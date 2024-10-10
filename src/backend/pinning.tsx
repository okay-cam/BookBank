import { auth, db } from "../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { fb_location, listings_field, listingData } from "../config/config";
import { toggleArray } from "./writeData";
import { checkArray } from "./readData";

export async function togglePinListing(listing: listingData) {
  await toggleArray(
    fb_location.listings,
    listing.listingID || "",
    listings_field.pinned,
    auth.currentUser!.uid
  );
}

// Function to check if a listing is pinned
export const isPinned = async (listingId: string): Promise<boolean> => {
  return await checkArray(
    fb_location.listings,
    listingId || "",
    listings_field.pinned,
    auth.currentUser!.uid
  );
};
