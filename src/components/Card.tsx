import React from "react";
import styles from "../styles/listing.module.css";

interface CardData {
  imageSrc: string;
  title: string;
  author: string;
  courseCode: string;
}

const Card = ({ imageSrc, title, author, courseCode }: CardData) => {
  return (
    <>
      <div className={`card ${styles.card}`}>
        <img
          src={imageSrc}
          className={`card-img-top ${styles.cardImage}`}
          alt="Listing image"
        />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">By {author}</p>
          <a className="btn btn-primary">Request</a>
        </div>
      </div>
    </>
  );
};

export default Card;
