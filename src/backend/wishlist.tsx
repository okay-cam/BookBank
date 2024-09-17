import { auth, db } from "../config/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export async function addWishlist(code: string) {
  const wishlistRef = collection(db, "wishlist");
  const userId = auth.currentUser!.uid;

  const q = query(wishlistRef, where("userId", "==", userId), where("courseCode", "==", code));

  try {
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(wishlistRef, {
        userId: userId,
        courseCode: code,
      });
      console.log("Wishlisted course code");
    } else {
      console.log("User already wishlisting this code");
    }
  } catch (error) {
    console.error("Error wishlisting course code", error);
  }
}
