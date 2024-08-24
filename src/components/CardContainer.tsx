import React from "react";
import Card from "./Card";
import defaultImage from "../assets/default-image-path.jpg";
import styles from "../styles/listing.module.css";

const CardContainer = () => {
  const cardData = [
    {
      imageSrc: defaultImage,
      title: "Accounting Essentials",
      author: "Michael Jackson",
      courseCode: "ABC123"
    },
    {
      imageSrc: defaultImage,
      title: "Ethics of AI",
      author: "Benedict Cumberbatch",
      courseCode: "ABC123"
    },
    {
      imageSrc: defaultImage,
      title: "Developmental Biology",
      author: "Taylor Swift",
      courseCode: "ABC123"
    },
    {
      imageSrc: defaultImage,
      title: "Conservation and the Genomics of Populations",
      author: "Nelson Mandela",
      courseCode: "ABC123"
    }
  ];

  return (
    <div className={styles.cardContainer}>
      {cardData.map((card, index) => (
        <Card
          key={index} // Using the index as a key for simplicity; consider using a more unique key in production.
          imageSrc={card.imageSrc}
          title={card.title}
          author={card.author}
          courseCode={card.courseCode}
        />
      ))}
    </div>
  );
};

export default CardContainer;
