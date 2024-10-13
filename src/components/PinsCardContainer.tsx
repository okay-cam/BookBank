import Card from "./Card";
import styles from "../styles/pins.module.css";
import { listingData } from "../config/config";

interface ListingArray {
  listings: listingData[];
  className?: string;
  collectionName: string; // differentiates each set of this component i.e. wishlists or pins. allows all cards to have a unique ID
}

const PinsCardContainer = ({
  listings,
  className,
  collectionName,
}: ListingArray) => {
  return (
    <div className={`${styles.scrollContainer} ${className}`}>
      {listings.map((card) => (
        <Card key={`${collectionName}-${card.listingID}`} listing={card} />
      ))}
    </div>
  );
};

export default PinsCardContainer;
