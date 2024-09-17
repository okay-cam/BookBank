import { auth, db } from "../config/firebase";
import { collection, addDoc, query, where, getDocs, deleteDoc } from "firebase/firestore";

export async function toggleWishlisting(code: string) {
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
