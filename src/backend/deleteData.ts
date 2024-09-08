import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";

// Function to delete a document by its ID
export const deleteListing = async (listingId: string) => {
    console.log("Document starting deletion", listingId);
    try {
      const docRef = doc(db, "listings", listingId);
  
      await deleteDoc(docRef);
  
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

