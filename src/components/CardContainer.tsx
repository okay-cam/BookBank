import React from "react";
import Card from "./Card";
import defaultImage from "../assets/default-image-path.jpg";
import styles from "../styles/listing.module.css";
import { Listing } from "../backend/types";

interface ListingArray {
  listings: Listing[];
}

const CardContainer = ({ listings }: ListingArray) => {
  return (
    <div className={styles.cardContainer}>
      {listings.map((card, index) => (
        <Card
          key={card.id} // Using the id as a key
          listing={card}
        />
      ))}
    </div>
  );
};

export default CardContainer;
