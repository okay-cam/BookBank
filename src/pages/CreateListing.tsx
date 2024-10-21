import React, { useState } from "react";
import styles from "../styles/listing.module.css";
import FileDropzone from "../components/FileDropzone";
import { auth } from "../config/firebase";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import { fb_location } from "../config/config";
import { uploadImage, writeToFirestore } from "../backend/writeData";
import { listingData } from "../config/config";
import { Timestamp } from "firebase/firestore";

const CreateListing: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state
  const [errorMessage, setErrorMessage] = useState("");
  const [charCount, setCharCount] = useState({
    title: 0,
    authors: 0,
    description: 0,
    courseCode: 0,
  });
  const navigate = useNavigate();

  const maxLengths = {
    title: 100,
    authors: 100,
    description: 400,
    courseCode: 30,
  };

  const [listingData, setListingData] = useState<listingData>({
    title: "",
    authors: "",
    courseCode: "",
    description: "",
    userID: auth.currentUser!.uid.toString(), // User can't be null when entering this page
    date: Timestamp.now(),
  });

  const [file, setFile] = useState<File | null>(null); // Manage file state
  const [preview, setPreview] = useState<string | null>(null); // Manage uploaded file's image preview

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setListingData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Update character count
    setCharCount((prev) => ({ ...prev, [name]: value.length }));

    if (value.length <= maxLengths[name as keyof typeof maxLengths]) {
      setListingData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setErrorMessage(
        `The ${name} exceeds the maximum character limit of ${
          maxLengths[name as keyof typeof maxLengths]
        }.`
      );
    }
  };

  const handleDrop = (file: File, preview: string) => {
    setFile(file);
    setPreview(preview);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prevent listings that don't have an image
    if (!file) {
      setErrorMessage("Please upload a photo of your textbook.");
      setIsSubmitting(false);
      return;
    }

    // Create document entry
    try {
      const listingID = await writeToFirestore(
        fb_location.listings,
        listingData
      );
      if (listingID) {
        await uploadImage(fb_location.listings, listingID, file);
        // Reset the loading state
        setIsSubmitting(false);
        navigate(`/listing/${listingID}`);
      } else {
        console.log("Unable to upload image, no listingID");
      }
    } catch (error) {
      console.error("Unable to create listing: ", error);
    }
  };

  return (
    <>
      <main className={styles.gridContainer}>
        {/* content on left panel */}
        <div className={styles.aside}>
          <BackButton />

          {/* the preview of the listing */}
          {file && preview && (
            <div>
              <img
                src={preview}
                alt="Uploaded image of your listing"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  marginTop: "10px",
                }}
              />
            </div>
          )}

          {/* the dropzone for uploading image */}
          <FileDropzone className="dropzone" onDrop={handleDrop} />
        </div>
        {/* content on right panel */}
        <div className={styles.content}>
          <h1>Create listing</h1>
          <br />
          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Textbook title:</label>
            <br />
            <input
              type="text"
              id="title"
              name="title"
              value={listingData.title}
              onChange={handleChange}
              maxLength={maxLengths.title}
              className="half-width"
              required
            />
            <small>
              {charCount.title}/{maxLengths.title}
            </small>
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
              maxLength={maxLengths.authors}
              required
            />
            <small>
              {charCount.authors}/{maxLengths.authors}
            </small>
            <br />
            <br />

            <label htmlFor="courseCode">Course code:</label>
            <br />
            <input
              type="text"
              id="courseCode"
              name="courseCode"
              value={listingData.courseCode}
              maxLength={maxLengths.courseCode}
              onChange={handleChange}
            />
            <small>
              {charCount.courseCode}/{maxLengths.courseCode}
            </small>
            <br />
            <br />

            <label htmlFor="description">Description:</label>
            <br />
            <textarea
              id="description"
              name="description"
              value={listingData.description}
              rows={3}
              className="w-100"
              onChange={handleChange}
              maxLength={maxLengths.description}
              required
            />
            <small>
              {charCount.description}/{maxLengths.description}
            </small>
            <br />
            <br />

            <input
              type="submit"
              value={isSubmitting ? "Submitting..." : "Submit"}
              className="button call-to-action"
              disabled={isSubmitting}
            />
            <p className="error-msg">{errorMessage}</p>
          </form>
        </div>
      </main>
    </>
  );
};

export default CreateListing;
