import React, { useState, useEffect } from "react";
import styles from "../styles/profile.module.css";
import defaultImage from "../assets/default-image-path.jpg";
import { ProfileData as ProfileType } from "../backend/types";
import { getProfileData } from "../backend/readData";
import { auth } from "../config/firebase";
import { getListings, getPins } from "../backend/readData";
import { Listing as ListingType } from "../backend/types";
import PinsCardContainer from "../components/PinsCardContainer";

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileType | null>(null);
  const [activeListings, setActiveListings] = useState<ListingType[]>([]);

  useEffect(() => {
    const fetchAndSetProfileData = async () => {
      if (auth.currentUser) {
        const data = await getProfileData(auth.currentUser.uid);
        setProfileData(data);
      }
    };

    fetchAndSetProfileData();
    // getPins();
  }, []);

  useEffect(() => {
    const fetchAndSetActiveListings = async () => {
      if (auth.currentUser) {
        const data = await getListings("userID", auth.currentUser.uid);
        console.log("Fetched Listings:", data);
        console.log("User ID is ", auth.currentUser.uid);
        setActiveListings(data);
      }
    };

    fetchAndSetActiveListings();
  }, []);

  return (
    <main className={styles.gridContainer}>
      <div className={styles.aside}>
        <img src={defaultImage} className={styles.profilePic} alt="Profile" />
        <br />
        {profileData ? (
          <div>
            <h1>
              <center>
                {profileData.name ? profileData.name : "Name Unavailable"}
              </center>
            </h1>
            <div className={styles.profileData}>
              <p>
                Location: {profileData.location || "N/A"}
                <br />
                University: {profileData.university || "N/A"}
                <br />
                Degree: {profileData.degree || "N/A"}
                <br />
                Join Date:{" "}
                {profileData.joinDate
                  // ? profileData.joinDate.toDateString()
                  ? profileData.joinDate
                  : "N/A"}
                <br />
                Last Logged In:{" "}
                {profileData.lastLoggedIn
                  // ? profileData.lastLoggedIn.toDateString()
                  ? profileData.lastLoggedIn
                  : "N/A"}
                <br />
                Total Ratings Received: {profileData.totalRatingsReceived}
                <br />
                Total Donations: {profileData.totalDonations}
              </p>
            </div>
            <div className={styles.ratingBox}>
              Overall rating:
              <br />
              {profileData.overallRating
                ? `${profileData.overallRating}%`
                : "N/A"}
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className={styles.content}>
        {profileData && <h1>{profileData.name}'s Active Listings</h1>}
        {activeListings.length > 0 ? (
          // Change to pin card container when display is fixed
          <PinsCardContainer listings={activeListings} />
        ) : (
          <p>No active listings to show.</p>
        )}
        <br />
        <h1>Reviews</h1>
      </div>
    </main>
  );
};

export default Profile;
