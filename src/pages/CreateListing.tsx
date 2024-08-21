import React from "react";
import { useState } from "react";
import "../styles/general.css";
import styles from "../styles/listing.module.css";

interface ListingData {
  title: string;
  authors: string;
  courseCode: string;
  description: string;
}

const CreateListing: React.FC = () => {
  const [listingData, setListingData] = useState<ListingData>({
    title: "",
    authors: "",
    courseCode: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setListingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      listingData
    );
  };

  return (
    <>
      <main className={styles.gridContainer}>
        <div className={styles.aside}>
          <p>Image would be inserted here</p>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/png, image/jpg"
          />
        </div>
        <div className={styles.content}>
          <h1>Create listing</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Textbook title:</label>
            <br />
            <input
              type="text"
              id="title"
              name="title"
              value={listingData.title}
              onChange={handleChange}
            />
            <br />
            <br />

            <label htmlFor="authors">Author/s:</label>
            <br />
            <input
              type="text"
              id="authors"
              name="authors"
              value={listingData.authors}
              onChange={handleChange}
            />
            <br />
            <br />

            <label htmlFor="courseCode">Course code:</label>
            <br />
            <input
              type="text"
              id="courseCode"
              name="courseCode"
              value={listingData.courseCode}
              onChange={handleChange}
            />
            <br />
            <br />

            <label htmlFor="description">Description:</label>
            <br />
            <input
              type="text"
              id="description"
              name="description"
              value={listingData.description}
              onChange={handleChange}
            />
            <br />
            <br />

            <input type="submit" value="Submit" />
          </form>
        </div>
      </main>
    </>
  );
};

export default CreateListing;
