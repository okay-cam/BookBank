import { doc, updateDoc, arrayUnion, setDoc, addDoc, collection, getDoc } from "firebase/firestore"; 
import { db, storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { checkArray } from "./readData";
import { removeFromArray } from "./deleteData";
import { fb_location, users_field } from "../config/config";
import { showModal } from "./modal";

// Creates/Appends to a string[] of a document, current use is to represent a state that users have the listing. i.e if pinned[] contains userId then that user has the listing pinned
export async function appendArray(
  collection: string, 
  docId: string, 
  fieldName: string, 
  value: string
): Promise<void> {
  const docRef = doc(db, collection, docId);
  console.log("Adding "+value+" to "+fieldName+" in "+collection+" for id "+docId);

  try {
    await updateDoc(docRef, {
      [fieldName]: arrayUnion(value)
    });
    console.log("Successfully appended value to ", fieldName);
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

    if (!imageUrl) {
      throw new Error("Failed to retrieve image URL");
    }

    // Update or create a Firestore document with the imageUrl
    const docRef = doc(db, collection, id); // Reference to the Firestore document
    await setDoc(docRef, { imageUrl }, { merge: true }); // Merge the imageUrl field

    return imageUrl; // Return imageUrl in case needed

  } catch (error) {
    console.error("Error uploading image or updating document: ", error);
    return null; 
  }
}

export async function writeToFirestore<T extends Record<string, any>>(
  collectionName: string, // Firestore collection name
  data: Partial<Record<keyof T, any>>, // Data to write, keyed by the class field names
  id?: string // Optional id for updating a document
): Promise<string | null> {
  try {
    let docRef;

    // If an id is provided, update the existing document
    if (id) {
      docRef = doc(db, collectionName, id);
    } else {
      // If no id is provided, create a new document and get the reference
      docRef = await addDoc(collection(db, collectionName), {});
    }

    // Write the document data to Firestore with merge option
    await setDoc(docRef, data, { merge: true });

    console.log(`Document successfully written/updated in collection ${collectionName}!`);
    return docRef.id; // Return the document ID

  } catch (error) {
    console.error(`Error writing/updating document in collection ${collectionName}:`, error);
    return null;
  }
}

// The Avatar of functions. Combining the effects of Read / Write / Delete, it will bring balance to the database
export async function toggleArray(
  collection: string, 
  docId: string, 
  fieldName: string, 
  value: string
): Promise<void> {
  try {
    const exists = await checkArray(collection, docId, fieldName, value);

    if (exists) {
      // If value exists in the array, remove it
      console.log(`Value exists in ${fieldName}, removing...`);
      await removeFromArray(collection, docId, fieldName, value);
      if (fieldName == fb_location.wishlist) {
        showModal("unwishlist-success");
      }
    } else {
      // If value does not exist, append it
      console.log(`Value does not exist in ${fieldName}, appending...`);
      await appendArray(collection, docId, fieldName, value);
      if (fieldName == fb_location.wishlist) {
        showModal("wishlist-success");
      }
    }
    
  } catch (error) {
    console.error(`Error toggling array value: ${error}`);
  }
}

export async function writeToWishlist(id: string, value: string){
  // add to users profile with id as document and field in array
  await appendArray(fb_location.users, id, users_field.wishlist, value);

  // add to wishlist collection with value as document and id in array
  await appendArray(fb_location.wishlist, value, users_field.wishlist, id);
}