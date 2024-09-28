import React, { useState } from "react";
import styles from "../styles/listing.module.css";
import FileDropzone from "../components/FileDropzone";
import { auth } from "../config/firebase";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import { fb_location } from "../config/config";
import { uploadImage, writeListing } from "../backend/writeData";
import { Listing } from "../backend/types";


const CreateListing: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [listingData, setListingData] = useState<Listing>({
    title: "",
    authors: "",
    courseCode: "",
    description: "",
    userID: auth.currentUser!.uid.toString(), // User can't be null when entering this page
    enquired: [],
  });

  const [file, setFile] = useState<File | null>(null);  // Manage file state
  const [preview, setPreview] = useState<string | null>(null);  // Manage uploaded file's image preview

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setListingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDrop = (file: File, preview: string) => {
    setFile(file);
    setPreview(preview);
    console.log(file)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // TODO: input validation function
    e.preventDefault();

    // Prevent listings that don't have an image
    if (!file) {
      setErrorMessage("Please upload a photo of your textbook.");
      return;
    }

    setIsSubmitting(true);

    // Create document entry
    try{
      const listingID = await writeListing(listingData);
      if(listingID){
        await uploadImage(fb_location.listings, listingID, file);
      }else{
        console.log("Unable to upload image, no listingID");
      }
    } catch (error){
      console.error("Unable to create listing");
    }
    
    navigate("/home");
    // Reset the loading state
    setIsSubmitting(false);
  };

  return (
    <>
      <main className={styles.gridContainer}>
        {/* content on left panel */}
        <div className={styles.aside}>
          <BackButton />

          {/* the preview of the listing */}
          { file && preview && (
            <div>
              
              <img src={preview}
              alt="Uploaded image of your listing"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                marginTop: "10px",
              }}/>
            </div>
          )}

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
