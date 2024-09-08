import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";

// Function to delete a document by its ID
export const deleteListing = async (modalId: string) => {
    // CURRENT MODAL ID FORMAT: "modal-DOCUMENT_ID-remove"
    const seperatedId = modalId.split('-'); // Split the string by hyphens
    const listingId = seperatedId[1]; // Extract the second part (middle text)

    console.log("Document starting deletion", listingId);
    try {
      const docRef = doc(db, "listings", listingId);
  
      await deleteDoc(docRef);
  
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

