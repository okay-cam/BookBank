import React from "react";
import Card from "./Card";
import defaultImage from "../assets/default-image-path.jpg";
import styles from "../styles/listing.module.css";
import { listingData } from "../config/config";

interface ListingArray {
  listings: listingData[];
  collectionName: string; // differentiates each set of this component i.e. wishlists or pins. allows all cards to have a unique ID
}

const CardContainer = ({ listings, collectionName }: ListingArray) => {
  return (
    <div className={styles.cardContainer}>
      {listings.map((card) => (
        <Card key={`${collectionName}-${card.listingID}`} listing={card} />
      ))}
    </div>
  );
};

export default CardContainer;
