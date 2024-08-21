import React from "react";
import "../styles/general.css";
import styles from "../styles/listing.module.css";

interface ListingInformation {
  imagePath?: string;
  title?: string;
  authors?: string;
  desc?: string;
  courseCode?: string;
}

const Listing: React.FC<ListingInformation> = ({
  imagePath = "default-image-path.jpg",
  title = "Default Title",
  authors = "Unknown Author",
  desc = "No description available.",
  courseCode = "No course code",
}) => {
  return (
    <main className={styles.gridContainer}>
      <div className={styles.aside}>
        <p>Image would be inserted here</p>
        <button>Enquire/Request</button>
      </div>
      <div className={styles.content}>
        <h1>{title}</h1>
        <label>{authors}</label>
        <h3>{courseCode}</h3>
        <p>{desc}</p>
      </div>
    </main>
  );
};

export default Listing;
