import React, { useState } from "react";
import styles from "../styles/listing.module.css";
import FileDropzone from "../components/FileDropzone";
import { collection, addDoc, setDoc } from "firebase/firestore";
import { db, auth, storage } from "../config/firebase";
import BackButton from "../components/BackButton";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface ListingData {
  title: string;
  authors: string;
  courseCode: string;
  description: string;
  userID: string;
}

const CreateListing: React.FC = () => {
  const [listingData, setListingData] = useState<ListingData>({
    title: "",
    authors: "",
    courseCode: "",
    description: "",
    userID: auth.currentUser.uid.toString() // IGNORE ERROR
  });

  const [file, setFile] = useState<File | null>(null); // Manage file state

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setListingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDrop = (file: File) => {
    setFile(file);
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
      userID: listingData.userID,
    });

    // Upload image to Cloud Storage if file exists
    if (file) {
      const imageRef = ref(storage, `listings/${Date.now()}-${file.name}`);
      await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(imageRef);

      // Create Firestore document with imageUrl
      await setDoc(docRef, {
        ...listingData,
        imageUrl,
      }, { merge: true });
    } else {
      // Create Firestore document without image
      await setDoc(docRef, listingData, { merge: true });
    }
  };

  return (
    <>
      <main className={styles.gridContainer}>
        {/* content on left panel */}
        <div className={styles.aside}>
          <BackButton />
          {/* the dropzone for uploading image */}
          <FileDropzone className="dropzone" onDrop={handleDrop} />
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
              className="half-width"
              required
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
              required
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
            <textarea
              id="description"
              name="description"
              value={listingData.description}
              rows={3}
              className="half-width"
              onChange={handleChange}
              required
            />
            <br />
            <br />

            <input
              type="submit"
              value="Submit"
              className="button call-to-action"
            />
            <p className="error-msg">
              Insert error message - no input validation yet
            </p>
          </form>
        </div>
      </main>
    </>
  );
};

export default CreateListing;
