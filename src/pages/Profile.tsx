import React from "react";
import styles from "../styles/profile.module.css";

const Profile = () => {
  return (
    <>
      <main className={styles.gridContainer}>
        <div className={styles.aside}></div>
        <div className={styles.content}>
          <h1>Profile</h1>
        </div>
      </main>
    </>
  );
};

export default Profile;
