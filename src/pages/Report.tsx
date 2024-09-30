import React, { ChangeEvent, useEffect, useState } from "react";
import { Listing, ProfileData, ReportType } from "../backend/types";
import styles from "../styles/listing.module.css";
import BackButton from "../components/BackButton";
import { Navigate, useParams } from "react-router-dom";
import { auth } from "../config/firebase";
import {
  getListingById,
  getListings,
  getProfileData,
} from "../backend/readData";

// !! change code later so it uses config.ts constants

const Report: React.FC = () => {
  // Extract id and type from the route parameters.
  // id may refer to the profile id or the listing id
  // type may refer to 'user' or 'listing'
  const { id, type } = useParams<{ id: string; type: string }>(); 
  
  const [report, setReport] = useState<GeneralReport>({
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

  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submit loading state
  const [loading, setLoading] = useState(true); // Add page loading state
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
    reportedListingInfo?: ReportedListingInfo | null; // Optional or undefined
    submitterInfo: SubmitterInfo;
  }

  const handleReportedProfileData = (userID: string, data: ProfileData) => {
    const { username, email, imageUrl } = data;
    setReport((prevReport) => ({
      ...prevReport,
      reportedProfileInfo: { userID, username, email, imageUrl },
    }));
  };

  const handleListingData = (data: Listing) => {
    const { title, authors, courseCode, imageUrl = '', description } = data;
    setReport((prevReport) => ({
      ...prevReport,
      reportedListingInfo: { title, authors, courseCode, imageUrl, description },
    }));
  };

  const handleSubmitterData = (userID: string, data: ProfileData | null) => {
    if (!data) {
      return false;
    }

    const { username, email } = data;
    setReport((prevReport) => ({
      ...prevReport,
      submitterInfo: { userID, username, email },
    }));
  };


// Load all data on mount
useEffect(() => {
  console.log("report ID: ", id);
  console.log("report type: ", type);

  // Function to handle loading submitter data
  const loadSubmitterData = async () => {
    try {
      const submitterData = await getProfileData(auth.currentUser!.uid);
      handleSubmitterData(auth.currentUser!.uid, submitterData);
    } catch (error) {
      console.error("Error loading submitter data:", error);
    }
  };

  // Function to get reported profile ID
  const getReportedProfileID = async () => {
    if (type === 'user') {
      return id; // ID is a user id for profile reports
    } else if (type === 'listing') {
      const listing = await getListingById(id!);
      return listing?.userID;
    }
    return null;
  };

  // Function to load reported profile data
  const loadReportedProfileData = async () => {
    try {
      const reportedProfileID = await getReportedProfileID();
      if (!reportedProfileID) {
        console.error("ProfileID not found");
        setNotFound(true);
        return;
      }

      const data = await getProfileData(reportedProfileID);
      if (data) {
        handleReportedProfileData(reportedProfileID, data);
      } else {
        console.error("Reported Profile not found");
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setNotFound(true);
    }
  };

  // Function to fetch listing data
  const fetchListingData = async () => {
    if (type === 'listing') {
      try {
        const listing = await getListingById(id!);
        if (listing) {
          handleListingData(listing);
        } else {
          console.error("Listing not found");
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        setNotFound(true);
      }
    }
  };

  const loadAllData = async () => {
    setLoading(true);

    // Check if id is valid
    if (!id) {
      console.error("Id not found: ", id);
      setNotFound(true);
      setLoading(false);
      return;
    }

    try {
      // Execute all async tasks in parallel
      await Promise.all([
        loadSubmitterData(),
        loadReportedProfileData(),
        fetchListingData(),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      // After all tasks, set loading to false
      setLoading(false);
    }
  };

  loadAllData();

}, [id, type]);


  // If type is invalid or data not found, navigate to 404
  if (!["user", "listing"].includes(type!) || notFound) {
    console.log("report type doesnt exist: ", type)
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

    setIsSubmitting(true);
    console.log("report data:");
    console.log(report);
    setIsSubmitting(false);
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
          {(type === 'listing')  && (
            <div>
              <h1>Reported Listing Info</h1>
              <p>{report.reportedListingInfo?.title}</p>
              <img
                src={report.reportedListingInfo?.imageUrl}
                alt="Listing image"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  marginTop: "-10px",
                }}
              />
            </div>
          )}

          <br />
          <h1>Reported User Info</h1>
          <p>Name: {report.reportedProfileInfo?.username}</p>
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
