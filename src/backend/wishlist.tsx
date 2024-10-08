import { auth, db } from "../config/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { collection_name, listings_field, users_field } from "../config/config";
import { showModal } from "./modal";

export async function toggleWishlisting(code: string) {
  const wishlistRef = collection(db, collection_name.wishlist);
  const userId = auth.currentUser!.uid;

  const q = query(
    wishlistRef,
    where(users_field.userId, "==", userId),
    where(listings_field.courseCode, "==", code)
  );

  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(wishlistRef, {
        userId: userId,
        courseCode: code,
      });
      console.log(`Wishlisted course code ${code}`);
      showModal("wishlist-success");
    } else {
      const docRef = querySnapshot.docs[0].ref;
      await deleteDoc(docRef);
      console.log(`Unwishlisted course code ${code}`);
      showModal("unwishlist-success");
    }
  } catch (error) {
    console.error("Error wishlisting course code", error);
  }
}

export const isWishlisted = async (code: string): Promise<boolean> => {
  const wishlistRef = collection(db, collection_name.wishlist);
  const userId = auth.currentUser!.uid;

  const q = query(
    wishlistRef,
    where(users_field.userId, "==", userId),
    where(listings_field.courseCode, "==", code)
  );

  try {
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking wishlist status: ", error);
    return false;
  }
};
