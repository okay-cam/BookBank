import React, { useState, useEffect } from "react";
import styles from "../styles/profile.module.css";
import defaultImage from "../assets/default-image-path.jpg";
import { ProfileData as ProfileType } from "../backend/types";
import { getProfileData } from "../backend/readData";
import { auth } from "../config/firebase";

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileType | null>(null);

  useEffect(() => {
    const fetchAndSetProfileData = async () => {
      if (auth.currentUser) {
        const data = await getProfileData(auth.currentUser.uid);
        setProfileData(data);
      }
    };

    fetchAndSetProfileData();
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
                  ? profileData.joinDate.toDateString()
                  : "N/A"}
                <br />
                Last Logged In:{" "}
                {profileData.lastLoggedIn
                  ? profileData.lastLoggedIn.toDateString()
                  : "N/A"}
                <br />
                Total Ratings Received: {profileData.numRatings}
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
        <br />
      </div>
    </main>
  );
};

export default Profile;
