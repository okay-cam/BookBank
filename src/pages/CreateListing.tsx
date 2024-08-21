import React from "react";
import "../styles/general.css";
import styles from "../styles/listing.module.css";

const CreateListing = () => {
  return (
    <>
      <main className={styles.gridContainer}>
        <div className={styles.aside}>
          <p>Image would be inserted here</p>
          <button>Upload image</button>
        </div>
        <div className={styles.content}>
          <h1>Create listing</h1>
        </div>
      </main>
    </>
  );
};

export default CreateListing;
