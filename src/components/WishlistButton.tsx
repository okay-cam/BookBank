import { useEffect, useState } from "react";
import { toggleWishlisting, isWishlisted } from "../backend/wishlist";
import GeneralPopup from "./GeneralPopup";
import { auth } from "../config/firebase";
import { checkArray } from "../backend/readData";
import { toggleArray } from "../backend/writeData";
import { fb_location, users_field } from "../config/config";

interface WishlistButtonProps {
  courseCode: string;
  className?: string;
}

const WishlistButton = ({ courseCode, className }: WishlistButtonProps) => {
  const [isWishlistedState, setIsWishlistedState] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      const wishlisted = await checkArray(fb_location.users, auth.currentUser!.uid, users_field.wishlist, props.courseCode);
      setIsWishlistedState(wishlisted);
    };

    checkWishlistStatus();
  }, [courseCode]);

  const handleToggleWishlisting = async () => {
    await toggleArray(fb_location.users, auth.currentUser!.uid, users_field.wishlist, props.courseCode);
    setIsWishlistedState((prev) => !prev);
  };

  return (
    <>
      <GeneralPopup
        modalId="wishlist-success"
        header="Course wishlisted!"
        message={`You will now receive notifications for ${courseCode} textbooks.`}
      />
      <GeneralPopup
        modalId="unwishlist-success"
        header="Course unwishlisted"
        message={`You will no longer receive notifications for ${courseCode} textbooks.`}
      />
      <button
        className={`${className}`}
        onClick={() => handleToggleWishlisting()}
      >
        {isWishlistedState ? "Unwishlist" : "Wishlist"} this code
      </button>
    </>
  );
};

export default WishlistButton;