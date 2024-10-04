import { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { checkArray } from "../backend/readData";
import { toggleArray } from "../backend/writeData";
import { fb_location, users_field } from "../config/config";

interface WishlistButtonProps {
  courseCode: string;
  className?: string;
}

const WishlistButton = (props: WishlistButtonProps) => {
  const [isWishlistedState, setIsWishlistedState] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      const wishlisted = await checkArray(fb_location.users, auth.currentUser!.uid, users_field.wishlist, props.courseCode);
      setIsWishlistedState(wishlisted);
    };

    checkWishlistStatus();
  }, [props.courseCode]);

  const handleToggleWishlisting = async () => {
    await toggleArray(fb_location.users, auth.currentUser!.uid, users_field.wishlist, props.courseCode);
    setIsWishlistedState((prev) => !prev);
  };

  return (
    <>
      <button className={`${props.className}`} onClick={() => handleToggleWishlisting()}>{isWishlistedState ? "Unwishlist" : "Wishlist"} this code</button>
    </>
  );
};

export default WishlistButton;
