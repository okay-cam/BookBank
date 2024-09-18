import { doc, updateDoc, arrayUnion } from "firebase/firestore"; 
import { db } from "../config/firebase";


// Creates/Appends to a string[] of a document, current use is to represent a state that users have the listing. i.e if pinned[] contains userId then that user has the listing pinned
export async function appendArray(
  collection: string, 
  docId: string, 
  fieldName: string, 
  value: string
): Promise<void> {
  const docRef = doc(db, collection, docId);
  
  try {
    await updateDoc(docRef, {
      [fieldName]: arrayUnion(value)
    });
    console.log(`Successfully appended value to ${fieldName}`);
  } catch (error) {
    console.error("Error appending to field: ", error);
  }
}