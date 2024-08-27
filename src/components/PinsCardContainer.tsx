import Card from "./Card";
import styles from "../styles/pins.module.css";
import { Listing } from "../backend/types";

interface ListingArray {
  listings: Listing[];
  className?: string;
}

const PinsCardContainer = ({ listings, className }: ListingArray) => {
  return (
    <div className={`${styles.scrollContainer} ${className}`}>
      {listings.map((card) => (
        <Card key={card.id} listing={card} />
      ))}
    </div>
  );
};

export default PinsCardContainer;
