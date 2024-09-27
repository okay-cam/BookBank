import React, { ChangeEvent, useEffect, useState } from "react";
import { Listing, ProfileData } from "../backend/types";
import styles from "../styles/listing.module.css";
import BackButton from "../components/BackButton";
import { Navigate, useParams } from "react-router-dom";
import {
  getListingById,
  getListings,
  getProfileData,
} from "../backend/readData";

const Report: React.FC = () => {
  const { id, type } = useParams<{ id: string; type: string }>(); // Extract id and type from the route parameters.
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state
  const [isListingReport, setListingReport] = useState(true); // Returns true if it is a listing report, false if a user report
  //   const [errorMessage, setErrorMessage] = useState("");

  // Fetch profile data if type is "user"
  useEffect(() => {
    if (type === "user" && id) {
      // check if user and id exists
      const fetchAndSetProfileData = async () => {
        try {
          const data = await getProfileData(id);
          if (data) {
            setProfileData(data); // set profile data if it exists
            setListingReport(false);
          } else {
            setNotFound(true); // If no profile is found, set not found state
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          setNotFound(true);
        }
      };
      fetchAndSetProfileData();
    }
  }, [type, id]); // update if any url parameters change

  // Fetch listing data if type is "listing"
  useEffect(() => {
    if (type === "listing" && id) {
      const fetchListing = async () => {
        try {
          const listing = await getListingById(id);
          if (listing) {
            setListing(listing);
            const user = await getProfileData(listing.userID);
            setProfileData(user); // set user data based on the owner of the listing
            setListingReport(true);
          } else {
            setNotFound(true); // If no listing is found, set not found state
          }
        } catch (error) {
          console.error("Error fetching listing:", error);
          setNotFound(true);
        }
      };
      fetchListing();
    }
  }, [type, id]);

  // If type is invalid or data not found, navigate to 404
  if (!["user", "listing"].includes(type!) || notFound) {
    return <Navigate to="/404" />;
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <main className={styles.gridContainer}>
      {/* content on left panel */}
      <div className={styles.aside}>
        <BackButton />
        {isListingReport ? (
          <div>
            <h1>Listing information</h1>
            <p>Title: {listing?.title}</p>
          </div>
        ) : null}
        <h1>User information</h1>
        <p>Name: {profileData?.username}</p>
      </div>

      {/* content on right panel */}
      <div className={styles.content}>
        <h1>Reporting a {type}</h1>
        <form>
          <label htmlFor="issue">Describe the issue</label>
          <br />
          <textarea
            id="issue"
            name="issue"
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
          {/* <p className="error-msg">{errorMessage}</p> */}
        </form>
      </div>
    </main>
  );
};

export default Report;
