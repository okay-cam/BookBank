import { doc, updateDoc, arrayUnion, setDoc, addDoc, collection } from "firebase/firestore"; 
import { db, storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Listing } from "../backend/types";
import { fb_location, listings_field } from "../config/config";

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

export async function writeListing(listingData: Listing, id?: string) {
  // using an id will cause this function to update instead of write
  try {
    let docRef; // Declare docRef outside the if-else block

    if (id) {
      // If an id is provided, update the existing document
      docRef = doc(db, fb_location.listings, id);
    } else {
      // If no id is provided, create a new document and get the reference
      docRef = await addDoc(collection(db, fb_location.listings), {});
    }

    // Update or create the Firestore document using the fields from listings_field
    await setDoc(docRef, {
      [listings_field.authors]: listingData.authors,
      [listings_field.courseCode]: listingData.courseCode,
      [listings_field.description]: listingData.description,
      [listings_field.title]: listingData.title,
      [listings_field.userID]: listingData.userID,
    }, { merge: true }); // Merge the updates with existing data

    console.log("Listing updated successfully!");
    return docRef.id;
    

  } catch (error) {
    console.error("Error updating/creating listing: ", error);
    return null;
  }
  
}