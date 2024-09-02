import React, { useState, useEffect } from "react";
import styles from "../styles/profile.module.css";

// backend imports for retrieving profile data & using ProfileData interface
import { getProfileData } from "../backend/readData";
import { ProfileData } from "../backend/types";

import { auth } from "../config/firebase";

const Profile = () => {

  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchAndSetProfileData = async () => {
      const data = await getProfileData(auth.currentUser!.uid); // Pass the user ID to the function
      setProfileData(data);
    };

    fetchAndSetProfileData();
  }, []); // Empty dependency array means this effect runs once on mount


  return (
    <>
      <main className={styles.gridContainer}>
        <div className={styles.aside}></div>
        <div className={styles.content}>
          <h1>Profile</h1>

          <br />

          {/* profile data is retrieved here. this can be moved later */}
          {profileData ? (
          <div>
            <p>Name: {profileData.name}</p>
            <p>Location: {profileData.location}</p>
            <p>University: {profileData.university}</p>
            <p>Degree: {profileData.degree}</p>
            <p>Rating: {profileData.rating}</p>
            <p>Total Ratings Received: {profileData.totalRatingsReceived}</p>
            <p>Total Donations: {profileData.totalDonations}</p>
          </div>
          ) : (
            <p>Loading...</p>
          )}

        </div>
      </main>
    </>
  );
};

export default Profile;
