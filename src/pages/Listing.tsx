import React from "react";
import styles from "../styles/listing.module.css";
import EnquiryPopup from "../components/EnquiryPopup";
import BackButton from "../components/BackButton";
import { Listing as ListingType } from "../backend/types";
import defaultImagePath from "../assets/default-image-path.jpg";

interface ListingInformation {
  listing: ListingType; // Correctly define the prop type as `ListingType`
}

const Listing: React.FC<ListingInformation> = ({ listing }) => {
  const { title, author, courseCode, description, imageSrc } = listing; // Destructure the properties

  return (
    <main className={styles.gridContainer}>
      <div className={styles.aside}>
        <BackButton />
        <img
          src={imageSrc || defaultImagePath} // Use the imageSrc or fallback to defaultImagePath
          alt="Listing image"
          style={{
            maxWidth: "100%",
            maxHeight: "300px",
            marginTop: "10px",
          }}
        />
        <br />
        <br />
        {/* Request button and popup */}
        <button
          type="button"
          className="call-to-action"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Request/Enquire
        </button>
        <EnquiryPopup title={title} />
      </div>
      <div className={styles.content}>
        <h1>{title}</h1>
        <label>{author}</label>
        <h3>{courseCode}</h3>
        <p>{description}</p>
      </div>
    </main>
  );
};

export default Listing;
