import React from "react";
import styles from "../styles/listing.module.css";
import EnquiryPopup from "./EnquiryPopup";
import Listing from "../pages/Listing";
import { Link } from "react-router-dom";

interface CardData {
  imageSrc: string;
  title: string;
  author: string;
  courseCode: string;
}

const Card = ({ imageSrc, title, author, courseCode }: CardData) => {
  return (
    <>
      <Link to="/listing">
      <div className={`card ${styles.card}`}>
        <img
          src={imageSrc}
          className={`card-img-top ${styles.cardImage}`}
          alt="Listing image"
        />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">By {author}</p>
          {/* Request button and popup */}
          <button
            type="button"
            className="call-to-action"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Request
          </button>
          <EnquiryPopup title={title} />
        </div>
      </div>
      </Link>
    </>
  );
};

export default Card;
