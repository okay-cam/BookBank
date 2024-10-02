import { useEffect, useState } from "react";
import { toggleWishlist } from "../backend/wishlist";

interface WishlistButtonProps {
  courseCode: string;
  className?: string;
}

const WishlistButton = (props: WishlistButtonProps) => {
  const [isWishlistedState, setIsWishlistedState] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      const wishlisted = await isWishlisted(props.courseCode);
      setIsWishlistedState(wishlisted);
    };

    checkWishlistStatus();
  }, [props.courseCode]);

  const handleToggleWishlisting = async () => {
    await toggleWishlisting(props.courseCode!);
    setIsWishlistedState((prev) => !prev);
  };

  return (
    <>
      <button className={`${props.className}`} onClick={() => handleToggleWishlisting()}>{isWishlistedState ? "Unwishlist" : "Wishlist"} this code</button>
    </>
  );
};

export default WishlistButton;
