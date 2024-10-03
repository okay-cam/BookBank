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
import { fb_location, reports_field } from "../config/config";
import { uploadImage, writeToFirestore } from "../backend/writeData";
import { sendEmail, EmailData } from "../backend/emailService";

// this is just used for copying the image. it could be moved to backend
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
const storage = getStorage();

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
    listingID: string
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

  const handleListingData = (listingID: string, data: Listing) => {
    const { title, authors, courseCode, imageUrl = '', description } = data;
    setReport((prevReport) => ({
      ...prevReport,
      reportedListingInfo: { listingID, title, authors, courseCode, imageUrl, description },
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
  console.log("env process.env.EMAIL_MAIN: ", import.meta.env.VITE_EMAIL_MAIN)
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
          handleListingData(id!, listing);
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

    // Function to copy image
    // This should run for the profile picture and for the listing image
    // !!
    // async function copyImage(oldPath: string, newPath: string) {
    //   try {
    //     // Step 1: Get the image URL from Firebase Storage (use the old path)
    //     const oldImageRef = ref(storage, oldPath);
    //     const oldImageUrl = await getDownloadURL(oldImageRef);

    //     // Step 2: Download the image data using fetch
    //     const response = await fetch(oldImageUrl);
    //     const blob = await response.blob();

    //     // Step 3: Upload the image blob to a new location (use the new path)
    //     const newImageRef = ref(storage, newPath);
    //     await uploadBytes(newImageRef, blob);

    //     console.log("Image copied successfully to:", newPath);
    //   } catch (error) {
    //     console.error("Error copying image:", error);
    //   }
    // }

    // copy profile picture

    // Example usage: copying image from 'old-folder/image.jpg' to 'new-folder/image-copy.jpg'
    // This won't work, since I have no idea how to retrieve the filename
    // copyImage(
    //   'profilePictures/image.jpg',
    //   'new-folder/image-copy.jpg'
    // );

    // copy listing picture

    // !! need to create image/s for the report

    let reportID : string | null = null;

    try {
      reportID = await writeToFirestore(reports_field, fb_location.reports, report);
      if (reportID) {
        // need to store the image as part of the report 
        // await uploadImage(fb_location.reports, reportID, file);
      } else {
        console.log("Unable to upload image, no listingID");
      } 
    } catch (error){
      console.error("Unable to create listing: ", error);
    }
    
    // !! if this returns null, then there was an error
    

    handleSendReportEmail(reportID);

    setIsSubmitting(false);
  }

  // const [report, setReport] = useState<GeneralReport>({
  //   issue: '',
  //   reportedProfileInfo: {
  //     userID: '',
  //     username: '',
  //     email: '',
  //     imageUrl: '',
  //   },
  //   submitterInfo: {
  //     userID: '',
  //     username: '',
  //     email: '',
  //   },
  // });

  interface ReportedListingInfo {
    title: string;
    authors: string;
    courseCode: string;
    imageUrl: string | undefined;
    description: string;
  }

  // Create a formatted HTML message for report
  //!! doesnt contain profile picture <img src="${report.reportedProfileInfo.imageUrl}" />
  //!! doesnt contain listing picture ... ${report.reportedListingInfo.imageUrl}
  const formattedEnquiryMessage = `
  <p><strong>Report Details</strong></p>
  
  <br />
  
  <p><strong>Issue:</strong>${auth.currentUser?.email}</p>
  
  <br />

  <p><strong>Report Submitter:</strong></p>
  <p>User ID: ${report.submitterInfo.userID}</p>
  <p>Username: ${report.submitterInfo.username}</p>
  <p>Email: ${report.submitterInfo.email}</p>

  <br />

  <strong>Reported Profile:</strong>
  <p>User ID: ${report.reportedProfileInfo.userID}</p>
  <p>Username: ${report.reportedProfileInfo.username}</p>
  <p>Email: ${report.reportedProfileInfo.email}</p>
  <p>Profile Picture: [insert later...] </p>

  <br />

  ${report.reportedListingInfo && `
    <p><strong>Reported Listing:</strong></p>
    <p>Listing ID: ${report.reportedListingInfo.listingID}</p>
    <p>Title: ${report.reportedListingInfo.title}</p>
    <p>Description: ${report.reportedListingInfo.description}</p>
    <p>Authors: ${report.reportedListingInfo.authors}</p>
    <p>Course Code: ${report.reportedListingInfo.courseCode}</p>
    <p>Listing image: [insert later...]</p>
  `}
`;

  // Send email to the textbook donor
  const handleSendReportEmail = async (reportID : string | null) => {
    const emailData: EmailData = {
      email: import.meta.env.VITE_EMAIL_MAIN, // send email to the bookbank gmail
      subject: `New Report Ticket: '${reportID}'`,
      message: formattedEnquiryMessage,
    };

    console.log("report email data: ", emailData);

    try {
      const response = await sendEmail(emailData);
      // setSuccessMessage(response); // Set success message
      // setMessage(""); // Clear the message field on success
      console.log("Report email: ", response);
      return true;
    } catch (error: any) {
      // setErrorMessage(error.message || "Failed to send email");
      console.log("Report email failed: ", error.message);
      return false;
    }
  };

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
