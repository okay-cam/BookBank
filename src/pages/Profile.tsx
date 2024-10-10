import React, { useState, useEffect } from "react";
import styles from "../styles/profile.module.css";
import defaultImage from "../assets/default-image-path.jpg";
import { listingData as ListingType, ProfileData as ProfileType, listings_field } from "../config/config";
import { getProfileData, getListings, checkProfileOwner } from "../backend/readData";
import PinsCardContainer from "../components/PinsCardContainer";
import { Link, useParams } from "react-router-dom";
import ImageModal from "../components/ImageModal";

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); // Extract id from the route parameters.
  const [profileData, setProfileData] = useState<ProfileType | null>(null);
  const [activeListings, setActiveListings] = useState<ListingType[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  useEffect(() => {
    const fetchAndSetProfileData = async () => {
      const data = await getProfileData(userId!);
      setProfileData(data);
    };

    fetchAndSetProfileData();
    // getPins();
  }, [userId]);

  useEffect(() => {
    const fetchAndSetActiveListings = async () => {
      const data = await getListings(listings_field.userID, userId);
      console.log("Fetched Listings:", data);
      console.log("User ID is ", userId);
      setActiveListings(data);
    };

    fetchAndSetActiveListings();
  }, [userId]);

  return (
    <main className={styles.gridContainer}>
      {isImageModalOpen && (
        <ImageModal
          imageUrl={profileData?.imageUrl || defaultImage}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}
      <div className={styles.aside}>
        <img
          src={profileData?.imageUrl || defaultImage}
          className={styles.profilePic}
          alt="Profile"
        />
        <br />
        {profileData ? (
          <div>
            <h1>
              <center>
                {profileData.username
                  ? profileData.username
                  : "Name Unavailable"}
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
                  ? new Date(profileData.joinDate).toDateString()
                  : "N/A"}
                <br />
                Last Logged In:{" "}
                {profileData.lastLoggedIn
                  ? new Date(profileData.lastLoggedIn).toDateString()
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
        {profileData && <h1>{profileData.username}'s Active Listings</h1>}
        <div className={styles.cardContainer}>
          {activeListings.length > 0 ? (
            <PinsCardContainer listings={activeListings} />
          ) : (
            <p>No active listings to show.</p>
          )}
        </div>
        <br />
        <h1>Reviews</h1>
        <p>No reviews yet.</p>

        <br />

        {/* only report other people's profiles */}
        { !checkProfileOwner(userId) && (
          <Link to={`/report/user/${userId}`} className="no-underline">
            <button>🚩 Report this user</button>
          </Link>
        )}
        

      </div>
    </main>
  );
};

export default Profile;
