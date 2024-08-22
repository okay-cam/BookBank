import React from "react";
import { useState } from "react";
import "../styles/general.css";
import styles from "../styles/listing.module.css";
import FileDropzone from "../components/FileDropzone";
import { collection, addDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

interface ListingData {
  title: string;
  authors: string;
  courseCode: string;
  description: string;
  // TODO backend: need to add image here
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

  const handleSubmit = async (e: React.FormEvent) => {
    // TODO: input validation function
    e.preventDefault();
    // Create document entry
    const docRef = await addDoc(collection(db, "listings"), {
      title: listingData.title,
      authors: listingData.authors,
      courseCode: listingData.courseCode,
      description: listingData.description,
    });
    // Upload document entry 
    await setDoc(docRef, listingData); 
    // console.log("Document written with ID: ", docRef.id); 
  };

  return (
    <>
      <main className={styles.gridContainer}>
        {/* content on left panel */}
        <div className={styles.aside}>
          {/* the dropzone for uploading image */}
          <FileDropzone className="dropzone" />
        </div>
        {/* content on right panel */}
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
            <p>Insert error message - no input validation yet</p>
          </form>
        </div>
      </main>
    </>
  );
};

export default CreateListing;
