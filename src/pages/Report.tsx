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
  
  const [reportedProfileData, setReportedProfileData] = useState<ReportedProfileInfo>({
    userID: '',
    username: '',
    email: '',
    imageUrl: null,
  });

  const [submitterProfileData, setSubmitterProfileData] = useState<SubmitterInfo>({
    userID: '',
    username: '',
    email: '',
  });
  
  const [reportedListing, setReportedListing] = useState<ReportedListingInfo | null>(null);

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
  const [isListingReport, setIsListingReport] = useState(false); // Returns true if it is a listing report, false if a user report
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
    setReportedProfileData({
      userID,
      username,
      email,
      imageUrl
  })};

  const handleListingData = (data: Listing) => {
    const { title, authors, courseCode, imageUrl = '', description } = data;
    setReportedListing({
      title,
      authors,
      courseCode,
      imageUrl,
      description,
    });
  };

  const handleSubmitterData = (userID: string, data: ProfileData | null) => {
    if (!data) {
      return false;
    }

    const { username, email } = data;
    setSubmitterProfileData({
      userID,
      username,
      email
    });
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


  //   // Load reported listing
  //   if (type === 'listing') {
  //     setIsListingReport(true);
  //     const fetchListing = async () => {
  //       try {
  //         const listing = await getListingById(id);
  //         if (listing) {
  //           setListing(listing);
  //           console.log("user: ", user)
  //           setReportedProfileData(user); // set user data based on the owner of the listing
  //           setListingReport(true);
  //         } else {
  //           setNotFound(true); // If no listing is found, set not found state
  //         }
  //       } catch (error) {
  //         console.error("Error fetching listing:", error);
  //         setNotFound(true);
  //       } finally {
  //         setLoading(false);
  //         console.log("listing: ", listing)
  //       }
  //     };
  //     fetchListing();
  //   }
        



  // // For profiles, ONLY get reported profile data
  // useEffect(() => {
  //   if (type === "user" && id) {
  //     // check if user and id exists
  //     const fetchAndSetProfileData = async () => {
  //       try {
  //         const data = await getProfileData(id);
  //         if (data) {
  //           setReportedProfileData(data); // set profile data if it exists
  //           setListingReport(false);
  //         } else {
  //           setNotFound(true); // If no profile is found, set not found state
  //         }
  //       } catch (error) {
  //         console.error("Error fetching profile:", error);
  //         setNotFound(true);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     fetchAndSetProfileData();
  //   }
  // }, [type, id]); // update if any url parameters change

  // // For listings, get BOTH listing data and reported profile data
  // useEffect(() => {
  //   if (type === "listing" && id) {
  //     const fetchListing = async () => {
  //       try {
  //         const listing = await getListingById(id);
  //         if (listing) {
  //           setListing(listing);
  //           const user = await getProfileData(listing.userID);
  //           console.log("user: ", user)
  //           setReportedProfileData(user); // set user data based on the owner of the listing
  //           setListingReport(true);
  //         } else {
  //           setNotFound(true); // If no listing is found, set not found state
  //         }
  //       } catch (error) {
  //         console.error("Error fetching listing:", error);
  //         setNotFound(true);
  //       } finally {
  //         setLoading(false);
  //         console.log("listing: ", listing)
  //       }
  //     };
  //     fetchListing();
  //   }
  // }, [type, id]);



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

    // load data into report
    setReport((prevReport) => ({
      ...prevReport,
      reportedProfileInfo: reportedProfileData,
      reportedListingInfo: type === 'listing' ? reportedListing : null,
    }));
    

    console.log("report data:");
    console.log(report);
    console.log(reportedProfileData);
    console.log(reportedListing);
    console.log(submitterProfileData);
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
              <p>Title: {reportedListing?.title}</p>
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
