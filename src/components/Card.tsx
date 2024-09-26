import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/listing.module.css";
import { Listing } from "../backend/types";
import defaultImagePath from "../assets/default-image-path.jpg";
// import EnquiryPopup from "./EnquiryPopup";
// import DeleteListingPopup from "./DeleteListingPopup";
import { checkArray, checkListingOwner } from "../backend/readData";
import { togglePinListing, isPinned } from "../backend/pinning";
import { auth } from "../config/firebase";
import { collection_name, listings_field } from "../config/config";

interface CardData {
  listing: Listing;
}

// For displaying each listing as a 'Card'

const Card = ({ listing }: CardData) => {
  const isListingOwner = checkListingOwner(listing);
  const removeID = `${listing.modalId}-remove`;
  const [pinned, setPinned] = useState<boolean>(false);
  const [enquired, setEnquired] = useState<boolean>(false);

  // check if user has pinned or enquired
  useEffect(() => {
    const fetchPinnedStatus = async () => {
      if (listing?.id) {
        const status = await isPinned(listing.id);
        setPinned(status);
      }
    };

    const fetchEnquiredStatus = async () => {
      if (listing?.id) {
        const status = await checkArray(
          collection_name.listings, // name of the collection
          listings_field.id, // listing id
          listings_field.enquired, // field
          auth.currentUser!.uid // id of the user that enquired
        );
        setEnquired(status);
      }
    };

    if (listing) {
      fetchPinnedStatus();
      fetchEnquiredStatus();
    }
  }, [listing]);

  return (
    <>
      {/* <EnquiryPopup title={listing.title} modalId={listing.modalId} />
      <DeleteListingPopup
        title={listing.title}
        modalId={removeID}
      /> */}
      <Link
        to={`/listing/${listing.id}`}
        className={`card no-underline ${styles.card}`}
      >
        <div className={styles.imageContainer}>
          <img
            src={listing.imageUrl || defaultImagePath} // Use the image or fallback to defaultImagePath
            className={`card-img-top ${styles.cardImage}`}
            alt="Listing image"
          />
          <button
            type="button"
            className={`${styles.pinButton} ${pinned ? styles.pinActive : ""}`}
            title="Pin this listing"
            onClick={() => togglePinListing(listing)}
          >
            📌
          </button>
        </div>
        <div className="card-body">
          <h5 className="card-title">{listing.title}</h5>
          <p className="card-text">By {listing.authors}</p>
          {/* BUTTON */}
          {/* Popup functionality is disabled and currently the buttons will simply navigate to the card */}
          {isListingOwner ? (
            <button
              type="button"
              className="danger"
              // data-bs-toggle="modal"
              // data-bs-target={`#${removeID}`}
              // onClick={() =>   console.log("Delete listing popup ID: ", removeID)}
            >
              Remove
            </button>
          ) : enquired ? (
            <button type="button" className="call-to-action" disabled={true}>
              Enquired
            </button>
          ) : (
            <button
              type="button"
              className="call-to-action"
              data-bs-toggle="modal"
              data-bs-target={`#${listing!.modalId}`}
            >
              Request
            </button>
          )}
        </div>
      </Link>
    </>
  );
};

export default Card;
