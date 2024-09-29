import React, { ChangeEvent, useEffect, useState } from "react";
import { Listing, ProfileData, ReportType } from "../backend/types";
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
  
  const [reportedProfileData, setReportedProfileData] = useState<GeneralReport>({
    issue: '',
    reportedProfileInfo: {
      userID: '',
      username: '',
      email: '',
      imageUrl: '',
    },
    submitterInfo: {
      userID: '',
      username: '',
      email: '',
    },
  });
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [report, setReport] = useState<GeneralReport|null>(null);

  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submit loading state
  const [loading, setLoading] = useState(true); // Add page loading state
  const [isListingReport, setListingReport] = useState(true); // Returns true if it is a listing report, false if a user report
  //   const [errorMessage, setErrorMessage] = useState("");


  interface ReportedProfileInfo {
    userID: string;
    username: string;
    email: string;
    imageUrl: string | null;
  }
  
  interface ReportedListingInfo {
    title: string;
    authors: string;
    courseCode: string;
    imageUrl: string | undefined;
    description: string;
  }
  
  interface SubmitterInfo {
    userID: string;
    username: string;
    email: string;
  }
  
  // Define separate interfaces for different report types
  interface GeneralReport {
    issue: string;
    reportedProfileInfo: ReportedProfileInfo;
    reportedListingInfo?: ReportedListingInfo; // Optional or undefined
    submitterInfo: SubmitterInfo;
  }

  const handleReportedProfileData = (data: ProfileData) => {
    const { userID, username, email, imageUrl } = data;
    setReportedProfileData(prevData => ({
      ...prevData,
      reportedProfileInfo: {
        userID,
        username,
        email,
        imageUrl,
      },
    }));
  };

  const handleListingData = (data: Listing) => {
    const { title, authors, courseCode, imageUrl, description } = data;
    setReportedProfileData(prevData => ({
      ...prevData,
      reportedListingInfo: {
        title,
        authors,
        courseCode,
        imageUrl,
        description,
      },
    }));
  };

  const handleSubmitterData = (data: ProfileData) => {
    const { userID, username, email } = data;
    setReportedProfileData(prevData => ({
      ...prevData,
      submitterInfo: {
        userID,
        username,
        email,
      },
    }));
  };

  useEffect(() => {
    handleSubmitterData()
  }, [type, id]);

  // For profiles, ONLY get reported profile data
  useEffect(() => {
    if (type === "user" && id) {
      // check if user and id exists
      const fetchAndSetProfileData = async () => {
        try {
          const data = await getProfileData(id);
          if (data) {
            setReportedProfileData(data); // set profile data if it exists
            setListingReport(false);
          } else {
            setNotFound(true); // If no profile is found, set not found state
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          setNotFound(true);
        } finally {
          setLoading(false);
        }
      };
      fetchAndSetProfileData();
    }
  }, [type, id]); // update if any url parameters change

  // For listings, get BOTH listing data and reported profile data
  useEffect(() => {
    if (type === "listing" && id) {
      const fetchListing = async () => {
        try {
          const listing = await getListingById(id);
          if (listing) {
            setListing(listing);
            const user = await getProfileData(listing.userID);
            console.log("user: ", user)
            setReportedProfileData(user); // set user data based on the owner of the listing
            setListingReport(true);
          } else {
            setNotFound(true); // If no listing is found, set not found state
          }
        } catch (error) {
          console.error("Error fetching listing:", error);
          setNotFound(true);
        } finally {
          setLoading(false);
          console.log("listing: ", listing)
        }
      };
      fetchListing();
    }
  }, [type, id]);

  // If type is invalid or data not found, navigate to 404
  if (!["user", "listing"].includes(type!) || notFound) {
    return <Navigate to="/404" />;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReport((prevReport) => ({
      ...prevReport,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    

  }

  return (
    <main className={styles.gridContainer}>
      {/* content on left panel */}
      <div className={styles.aside}>
        <BackButton />

        { loading ? (
          <p>Loading...</p>
        ) : (
          <>
          {isListingReport && (
            <div>
              <h1>Listing Information</h1>
              <p>Title: {listing?.title}</p>
            </div>
          )}

          <h1>Reported User Information</h1>
          <p>Name: {reportedProfileData?.username}</p>
          </>
        )}
        
      </div>

      {/* content on right panel */}
      <div className={styles.content}>
        <h1>Reporting a {type}</h1>
        <form onSubmit={onSubmit}>
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
