import { auth, db } from "../config/firebase";
import { collection, addDoc, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { fb_location, listings_field, users_field } from "../config/config";
import { checkArray } from "./readData";
import { removeFromArray } from "./deleteData";
import { appendArray } from "./writeData";

export async function toggleWishlist(id: string, value: string){
  try {
    const exists = await checkArray(fb_location.users, id, users_field.wishlist, value);

    if (exists) {
      // If value exists in the array, remove it in both places
      console.log("Removing course code: ", value);

      // remove from users profile
      await removeFromArray(fb_location.users, id, users_field.wishlist, value)
      
      // remove from wishlist collection
      await removeFromArray(fb_location.wishlist, value, users_field.wishlist, id)

    } else {
      // If value does not exist, create it in both places
      console.log("Adding course code: ", value);
      // add to users profile with id as document and field in array
      await appendArray(fb_location.users, id, users_field.wishlist, value);

      // add to wishlist collection with value as document and id in array
      await appendArray(fb_location.wishlist, value, users_field.wishlist, id);
    }
  } catch (error) {
    console.error(`Error toggling array value: ${error}`);
  }
}

export async function isWishlisted(id: string, courseCode: string){
  
}