import { doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore"; 
import { db, storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

export async function uploadImage(collection: string, id: string, image: File) {
  // collection is used for storage path and firestore collection
  // id represents id of the owner of the image listingID or userID
  // image is passed from filedropdown
  console.log("Storing new image and updating Firestore document");

  try {
    // Upload image to Firebase Storage
    const imageRef = ref(storage, `${collection}/${id}-${Date.now()}`); // Use storageFolder for more clarity
    await uploadBytes(imageRef, image);

    // Get the download URL of the uploaded image
    const imageUrl = await getDownloadURL(imageRef);
    console.log("Image URL: ", imageUrl);

    // Ensure the imageUrl is defined before updating Firestore
    if (!imageUrl) {
      throw new Error("Failed to retrieve image URL");
    }

    // Update or create a Firestore document with the imageUrl
    const docRef = doc(db, collection, id); // Reference to the Firestore document
    await setDoc(docRef, { imageUrl }, { merge: true }); // Merge the imageUrl field

    return imageUrl; // Optionally return the imageUrl for further use

  } catch (error) {
    console.error("Error uploading image or updating document: ", error);
    return null; // Return null if there's an error
  }
}