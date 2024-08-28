import React from "react";
import styles from "../styles/listing.module.css";
import { Navigate, useParams } from "react-router-dom";
import EnquiryPopup from "../components/EnquiryPopup";
import BackButton from "../components/BackButton";
import { Listing as ListingType } from "../backend/types";
import defaultImagePath from "../assets/default-image-path.jpg";
import testListings from "../backend/testListings";

const Listing: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extracts id from the route parameters.
  const listingId = parseInt(id || "0", 10); // Converts id to an integer, defaulting to 0 if id is not provided.
  const listing = testListings.find((l) => l.id === listingId); // Finds the listing object in testListings whose id matches the converted listingId.

  // Redirect to 404 page if listing is not found
  if (!listing) {
    return <Navigate to="/404" />;
  }

  return (
    <main className={styles.gridContainer}>
      <div className={styles.aside}>
        <BackButton />
        <img
          src={listing.imageUrl || defaultImagePath} // Use the imageSrc or fallback to defaultImagePath
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
        <EnquiryPopup title={listing.title} />
      </div>
      <div className={styles.content}>
        <h1>{listing.title}</h1>
        <label>{listing.authors}</label>
        <h3>{listing.courseCode}</h3>
        <p>{listing.description}</p>
      </div>
    </main>
  );
};

export default Listing;
