import React, { useEffect, useState } from "react";
import { Listing, ProfileData } from "../backend/types";
import styles from "../styles/listing.module.css";
import BackButton from "../components/BackButton";
import { useParams } from "react-router-dom";
import {
  getListingById,
  getListings,
  getProfileData,
} from "../backend/readData";

const Report: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract id from the route parameters.
  const { type } = useParams<{ type: string }>(); // type will be "user" or "listing"
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);

  if (type === "user") {
    useEffect(() => {
      const fetchAndSetProfileData = async () => {
        const data = await getProfileData(id!);
        setProfileData(data);
      };

      fetchAndSetProfileData();
    }, []);
  } else if (type === "listing") {
    useEffect(() => {
      const fetchListing = async () => {
        const listing = await getListingById(id!);
        setListing(listing || null); // Set the found listing or null if not found
      };

      fetchListing(); // Call the fetch function when the component mounts
    }, []);
  }

  return (
    <main className={styles.gridContainer}>
      {/* content on left panel */}
      <div className={styles.aside}>
        <BackButton />
      </div>

      {/* content on right panel */}
      <div className={styles.content}>
        <h1>Report</h1>
      </div>
      <div className={styles.main}>
        <label htmlFor="description">Description:</label>
        <br />
        <textarea
          id="description"
          name="description"
          value={listing!.description}
          rows={3}
          className="half-width"
          //   onChange={handleChange}
          required
        />
        <br />
        <br />

        {/* <input
          type="submit"
          value={isSubmitting ? "Submitting..." : "Submit"}
          className="button call-to-action"
          disabled={isSubmitting}
        />
        <p className="error-msg">{errorMessage}</p> */}
      </div>
    </main>
  );
};

export default Report;
