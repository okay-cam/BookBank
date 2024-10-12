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

export async function togglePinListing(listingID: string) {
  await toggleArray(
    fb_location.listings,
    listingID || "",
    listings_field.pinned,
    auth.currentUser!.uid
  );
}

// Function to check if a listing is pinned
export const isPinned = async (listingID: string): Promise<boolean> => {
  return await checkArray(
    fb_location.listings,
    listingID || "",
    listings_field.pinned,
    auth.currentUser!.uid
  );
};

// Function to check if a listing has been enquired
export const hasEnquired = async (listingID: string): Promise<boolean> => {
  return await checkArray(
    fb_location.listings,
    listingID || "",
    listings_field.enquired,
    auth.currentUser!.uid
  );
};

// Set as enquired
export async function setEnquiredArray(listingID: string) {
  if (!hasEnquired(listingID)) {
    await toggleArray(
      fb_location.listings,
      listingID || "",
      listings_field.pinned,
      auth.currentUser!.uid
    );
  }
}
