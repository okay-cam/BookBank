import React from "react";
import styles from "../styles/profile.module.css";
import defaultImage from "../assets/default-image-path.jpg";
import { Profile as ProfileType } from "../backend/types";
import profile from "../backend/testProfile";

// interface ProfileDetails {
//   profile: ProfileType;
// }

const Profile = () => {
  return (
    <>
      <main className={styles.gridContainer}>
        <div className={styles.aside}>
          <img src={defaultImage} className={styles.profilePic} />
          <div>
            <h1>Profile Details</h1>
            <p>Name: {profile.name}</p>
            <p>Email: {profile.email}</p>
            <p>University: {profile.university}</p>
            <p>Degree: {profile.degree}</p>
            <p>Location: {profile.location}</p>
            <p>Join Date: {profile.joinDate.toDateString()}</p>
            <p>Last Logged In: {profile.lastLoggedIn.toDateString()}</p>
            <p>Total Donations: {profile.totalDonations}</p>
            <p>Number of Ratings: {profile.numRatings}</p>
            <p>Overall Rating: {profile.overallRating}</p>
          </div>
        </div>
        <div className={styles.content}>
          <h1>Profile</h1>
        </div>
      </main>
    </>
  );
};

export default Profile;
