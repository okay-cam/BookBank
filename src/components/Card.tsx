import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/listing.module.css";
import defaultImagePath from "../assets/default-image-path.jpg";
// import EnquiryPopup from "./EnquiryPopup";
// import DeleteListingPopup from "./DeleteListingPopup";
import { checkArray, checkListingOwner } from "../backend/readData";
import { togglePinListing, isPinned } from "../backend/pinning";
import { auth } from "../config/firebase";
import { fb_location, listings_field } from "../config/config";
import { listingData } from "../config/config";

interface CardData {
  listing: listingData;
}

// For displaying each listing as a 'Card'

const Card = ({ listing }: CardData) => {
  const isListingOwner = checkListingOwner(listing);
  const [pinned, setPinned] = useState<boolean>(false);
  const [enquired, setEnquired] = useState<boolean>(false);

  // check if user has pinned or enquired
  useEffect(() => {
    const fetchPinnedStatus = async () => {
      if (listing?.listingID) {
        const status = await isPinned(listing.listingID);
        setPinned(status);
      }
    };

    const fetchEnquiredStatus = async () => {
      if (listing?.listingID) {
        const status = await checkArray(
          fb_location.listings, // name of the collection
          listing.listingID, // listing id
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
      <Link
        to={`/listing/${listing.listingID}`}
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
