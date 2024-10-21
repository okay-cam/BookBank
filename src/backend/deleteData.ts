import { doc, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { fb_location } from "../config/config";
import { ref, deleteObject } from "firebase/storage";
import { getImageUrl, emailPinnedUsers } from "../backend/readData";

export const deleteImage = async (imageUrl: string) => {
  const imageRef = ref(storage, imageUrl);

  await deleteObject(imageRef)
  .then(() => {
    console.log('Image deleted successfully');
  })
  .catch((error) => {
    throw Error(`Error deleting image: ${error}`);
  });

};

// Function to delete a document by its ID
export const deleteListing = async (modalId: string) => {

  console.log("modal id in deleteListing: ", modalId)

  // CURRENT MODAL ID FORMAT: "id-remove-modal"
  const separatedId = modalId.split("-"); // Split the string by hyphens
  const listingId = separatedId[0]; // Extract the first part

  console.log("Document starting deletion", listingId);

  // email pinned users FUNCTION NEEDS TO BE UPDATED
  await emailPinnedUsers(listingId);

  try {
    const docRef = doc(db, fb_location.listings, listingId);

    const imageUrl = await getImageUrl(fb_location.listings, listingId);
    console.log("Deleting image url: ", imageUrl);
    if (imageUrl) {
      await deleteImage(imageUrl);
    }

    await deleteDoc(docRef);
    console.log("Document successfully deleted!");
  } catch (error) {
    throw Error(`Error deleting document: ${error}`);
  }

  
  
};

export async function removeFromArray(
  collection: string, 
  docId: string, 
  fieldName: string, 
  value: string
): Promise<void> {
  const docRef = doc(db, collection, docId);
  
  try {
    await updateDoc(docRef, {
      [fieldName]: arrayRemove(value)
    });
    console.log(`Successfully removed value from ${fieldName}`);
  } catch (error) {
    console.error(`Error removing value from field: ${fieldName}`, error);
  }
}

