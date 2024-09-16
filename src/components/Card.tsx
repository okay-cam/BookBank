import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/listing.module.css";
import EnquiryPopup from "./EnquiryPopup";
import { Listing } from "../backend/types";
import defaultImagePath from "../assets/default-image-path.jpg";
import DeleteListingPopup from "./DeleteListingPopup";
import { checkListingOwner } from "../backend/readData";
import { togglePinListing, isPinned } from "../backend/pinning";

interface CardData {
  listing: Listing;
}

// For displaying each listing as a 'Card'

const Card = ({ listing }: CardData) => {
  const isListingOwner = checkListingOwner(listing);
  const [pinned, setPinned] = useState<boolean>(false);

  useEffect(() => {
    const fetchPinnedStatus = async () => {
      if (listing?.id) {
        const status = await isPinned(listing.id);
        setPinned(status);
      }
    };

    if (listing) {
      fetchPinnedStatus();
    }
  }, [listing]);

  return (
    <>
      <EnquiryPopup title={listing.title} modalId={listing.modalId} />
      <DeleteListingPopup
        title={listing.title}
        modalId={`${listing.modalId}-remove`}
      />
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
            className={`${styles.pinButton} ${pinned ? styles.pinActive : ''}`}
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
          {isListingOwner ? (
            <button
              type="button"
              className="danger"
              data-bs-toggle="modal"
              data-bs-target={`#${listing.modalId}-remove`}
            >
              Remove
            </button>
          ) : (
            <button
              type="button"
              className="call-to-action"
              data-bs-toggle="modal"
              data-bs-target={`#${listing.modalId}`}
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
