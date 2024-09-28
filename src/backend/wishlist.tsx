import { auth, db } from "../config/firebase";
import { collection, addDoc, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { fb_location, listings_field, users_field } from "../config/config";

export async function toggleWishlisting(code: string) {
  const wishlistRef = collection(db, fb_location.wishlist);
  const userId = auth.currentUser!.uid;

  const q = query(wishlistRef, where(users_field.userId, "==", userId), where(listings_field.courseCode, "==", code));

  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(wishlistRef, {
        userId: userId,
        courseCode: code,
      });
      console.log(`Wishlisted course code ${code}`);
      alert('Course code wishlisted successfully!');
    } else {
      const docRef = querySnapshot.docs[0].ref;
      await deleteDoc(docRef);
      console.log(`Unwishlisted course code ${code}`);
      alert("Course code unwishlisted successfully");
    }
  } catch (error) {
    console.error("Error wishlisting course code", error);
  }
}

export const isWishlisted = async (code: string): Promise<boolean> => {
  const wishlistRef = collection(db, fb_location.wishlist);
  const userId = auth.currentUser!.uid;

  const q = query(wishlistRef, where(users_field.userId, "==", userId), where(listings_field.courseCode, "==", code));

  try {
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking wishlist status: ", error);
    return false;
  }
};
