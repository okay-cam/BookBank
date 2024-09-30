import Card from "./Card";
import styles from "../styles/pins.module.css";
import { listingData } from "../config/config";

interface ListingArray {
  listings: listingData[];
  className?: string;
}

const PinsCardContainer = ({ listings, className }: ListingArray) => {
  return (
    <div className={`${styles.scrollContainer} ${className}`}>
      {listings.map((card) => (
        <Card key={card.listingID} listing={card} />
      ))}
    </div>
  );
};

export default PinsCardContainer;
