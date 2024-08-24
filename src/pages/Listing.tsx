import React from "react";
import styles from "../styles/listing.module.css";
import EnquiryPopup from "../components/EnquiryPopup";
import BackButton from "../components/BackButton";
import defaultImagePath from "../assets/default-image-path.jpg"

interface ListingInformation {
  imagePath?: string;
  title?: string;
  authors?: string;
  desc?: string;
  courseCode?: string;
}

const Listing: React.FC<ListingInformation> = ({
  imagePath = defaultImagePath,
  title = "Default Title",
  authors = "Unknown Author",
  desc = "No description available.",
  courseCode = "No course code",
}) => {
  return (
    <main className={styles.gridContainer}>
      <div className={styles.aside}>
        <BackButton />
        <img
              src={imagePath}
              alt="Listing image"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                marginTop: "10px",
              }}
            />
        <br /><br />
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
        <label>{authors}</label>
        <h3>{courseCode}</h3>
        <p>{desc}</p>
      </div>
    </main>
  );
};

export default Listing;
