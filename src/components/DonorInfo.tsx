import React, { useEffect, useState } from "react";
import styles from "../styles/listing.module.css";
import { getProfileData } from "../backend/readData";
import defaultImage from "../assets/default-image-path.jpg";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { ProfileData } from "../config/config";

interface DonorIDProps {
  donorId: string;
}

const DonorInfo = ({ donorId }: DonorIDProps) => {
  // need to get profile data by using getProfileData(donorId)
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true); // State to manage loading status

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getProfileData(donorId); // Fetch all listings
      // const foundProfile = listings.find((l) => l.id === id); // Find the listing by id

      setProfile(profile || null); // Set the found listing or null if not found
      setLoading(false); // Set loading to false after fetching
    };

    fetchProfile(); // Call the fetch function when the component mounts
  }, [donorId]);

  // Show a loading message while fetching the listing
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    // return <Navigate to="/404" />;
    return <div>No donor information available.</div>;
  }

  return (
    <Link to={`/profile/${donorId}`} className="no-underline">
      <div className={styles.donorInfo}>
        <img
          src={profile.imageUrl || defaultImage}
          className={styles.profilePic}
        />
        <div className={styles.donorContent}>
          <h1>{profile.username}</h1>
          {profile.location ? <p>Located in {profile.location}</p> : ""}
          {profile.degree && profile.university ? (
            <p>
              {profile.degree} at {profile.university}
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
    </Link>
  );
};

export default DonorInfo;
