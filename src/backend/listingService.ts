import { Listing } from "./types";
import { getListings as fetchListings } from "./readData";

// Function to fetch and assign unique IDs to listings
export const getListings = async (): Promise<Listing[]> => {
  const data = await fetchListings();

  // Assign a unique id to each listing if not already present
  return data.map((listing, index) => ({
    ...listing,
    id: listing.id || index, // Assign an id based on index
    modalId: listing.modalId || `modal-${index}`
  }
));
};