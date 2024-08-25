import React from "react";
import styles from "../styles/listing.module.css";
import EnquiryPopup from "./EnquiryPopup";
import ListingPage from "../pages/Listing";
import { Link } from "react-router-dom";
import { Listing } from "../backend/types";

interface CardData {
  listing: Listing;
}

const Card = ({ listing }: CardData) => {
  return (
    <>
      {/* <Link to="/listing"> */}
      <div className={`card ${styles.card}`}>
        <img
          src={listing.image}
          className={`card-img-top ${styles.cardImage}`}
          alt="Listing image"
        />
        <div className="card-body">
          <h5 className="card-title">{listing.title}</h5>
          <p className="card-text">By {listing.author}</p>
          {/* Request button and popup */}
          <button
            type="button"
            className="call-to-action"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Request
          </button>
          <EnquiryPopup title={listing.title} />
        </div>
      </div>
      {/* </Link> */}
    </>
  );
};

export default Card;
