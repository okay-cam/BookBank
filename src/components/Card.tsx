import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/listing.module.css";
import EnquiryPopup from "./EnquiryPopup";
import { Listing } from "../backend/types";
import defaultImagePath from "../assets/default-image-path.jpg";

interface CardData {
  listing: Listing;
}

const Card = ({ listing }: CardData) => {
  return (
    <>
      <EnquiryPopup title={listing.title} />
      <Link to={`/listing/${listing.id}`} className={`card ${styles.card}`}>
        <img
          src={listing.imageUrl || defaultImagePath} // Use the image or fallback to defaultImagePath
          className={`card-img-top ${styles.cardImage}`}
          alt="Listing image"
        />
        <div className="card-body">
          <h5 className="card-title">{listing.title}</h5>
          <p className="card-text">By {listing.authors}</p>
          {/* REQUEST BUTTON */}
          {/* Commented out because it is not currently working (passes the wrong title to the popup) */}
          {/* <button
            type="button"
            className="call-to-action"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Request
          </button> */}
        </div>
      </Link>
    </>
  );
};

export default Card;
