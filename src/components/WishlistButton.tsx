import styles from "../styles/home.module.css";
import { toggleWishlisting } from "../backend/wishlist";

interface WishlistButtonProps {
  courseCode: string;
}

const WishlistButton = (props: WishlistButtonProps) => {
  return (
    <>
      <p>Do you want to wishlist textbooks with the course code "{props.courseCode}"?
        <button className={styles.wishlistButton} onClick={() => toggleWishlisting(props.courseCode!)}>Wishlist</button>
      </p>
    </>
  );
};

export default WishlistButton;
