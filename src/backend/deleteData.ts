import { doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { fb_location } from "../config/config";
import { ref, deleteObject } from "firebase/storage";
import { getImageUrl } from "../backend/readData";

export const deleteImage = async (imageUrl: string) => {
  const imageRef = ref(storage, imageUrl);

  deleteObject(imageRef)
  .then(() => {
    console.log('Image deleted successfully');
  })
  .catch((error) => {
    console.error('Error deleting image:', error);
  });

};

// Function to delete a document by its ID
export const deleteListing = async (modalId: string) => {
  // CURRENT MODAL ID FORMAT: "modal-DOCUMENT_ID-remove"
  const separatedId = modalId.split("-"); // Split the string by hyphens
  const listingId = separatedId[1]; // Extract the second part (middle text)

  console.log("Document starting deletion", listingId);

  try {
    const docRef = doc(db, fb_location.listings, listingId);

    const imageUrl = await getImageUrl(fb_location.listings, listingId);
    if (imageUrl) {
      await deleteImage(imageUrl);
    }

      await deleteDoc(docRef);
      console.log("Document successfully deleted!");
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
};


