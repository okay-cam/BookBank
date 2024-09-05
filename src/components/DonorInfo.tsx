import React from "react";
import styles from "../styles/listing.module.css";
import { ProfileData } from "../backend/types";
import { getProfileData } from "../backend/readData";
import defaultImage from "../assets/default-image-path.jpg";
import { Link } from "react-router-dom";

interface DonorIDProps {
  donorId: string;
}

const DonorInfo = ({ donorId }: DonorIDProps) => {
  // need to get profile data by using getProfileData(donorId)

  return (
    <Link to="/profile" className="no-underline">
      <div className={styles.donorInfo}>
        <img src={defaultImage} className={styles.profilePic} />
        <div className={styles.donorContent}>
          <h1>Donor name</h1>
          <p>Studying degree at university</p>
        </div>
      </div>
    </Link>
  );
};

export default DonorInfo;
