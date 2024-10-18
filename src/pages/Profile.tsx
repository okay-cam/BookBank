import React, { useState, useEffect } from "react";
import styles from "../styles/profile.module.css";
import defaultProfilePicture from "../assets/default-profile-path.jpg";
import { listingData as ListingType, ProfileData as ProfileType, listings_field, commentsData, fb_location, ProfileData } from "../config/config";
import { getProfileData, getListings, checkProfileOwner } from "../backend/readData"; 
import { appendMapToArray } from "../backend/writeData";
import PinsCardContainer from "../components/PinsCardContainer";
import { Link, useParams } from "react-router-dom";
import ImageModal from "../components/ImageModal";
import CommentCard from "../components/CommentCard";
import { Timestamp } from "firebase/firestore";
import { auth } from "../config/firebase";

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); // Extract id from the route parameters.
  
  const [profileData, setProfileData] = useState<ProfileType | null>(null);
  const [currentUserData, setCurrentUserData] = useState<ProfileData | null>(null); // State for current user data
  const [activeListings, setActiveListings] = useState<ListingType[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [comments, setComments] = useState<commentsData[]>([]); // Changed to an array of comments
  const [newComment, setNewComment] = useState<string>(""); // State to store the new comment input

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  // Function to handle comment submission
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      alert("Comment cannot be empty!"); // Basic validation
      return;
    }

    const comment: commentsData = {
      senderUID: auth.currentUser!.uid,
      senderName: currentUserData!.username,
      profilePicUrl: currentUserData!.imageUrl || null,
      message: newComment,
      date: Timestamp.fromMillis(Date.now()),
    };

    // Add the comment to the state
    setComments([comment, ...comments]);

    // Save the comment to Firestore (optional)
    await appendMapToArray(fb_location.users, comment, userId!);

    // Clear the input field
    setNewComment("");
  };

  // Fetch profile data for the displayed user
  useEffect(() => {

    // Reset comments state when visiting a new profile
    setComments([]);
    
    const fetchAndSetProfileData = async () => {
      const data = await getProfileData(userId!);
      setProfileData(data);

      if (data?.comments) {
        setComments(data.comments.reverse() as commentsData[]);
      }
      
    };

    
    fetchAndSetProfileData();
  }, [userId]);

  // Fetch current user data
  useEffect(() => {
    const fetchAndSetCurrentUserData = async () => {
      const currentUserData = await getProfileData(auth.currentUser!.uid);
      setCurrentUserData(currentUserData);
    };

    fetchAndSetCurrentUserData();
  }, []);

  // Fetch listings
  useEffect(() => {
    const fetchAndSetActiveListings = async () => {
      const data = await getListings(listings_field.userID, userId);
      setActiveListings(data);
    };

    fetchAndSetActiveListings();
  }, [userId]);

  return (
    <main className={styles.gridContainer}>
      {isImageModalOpen && (
        <ImageModal
          imageUrl={profileData?.imageUrl || defaultProfilePicture}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}
      <div className={styles.aside}>
        <img
          src={profileData?.imageUrl || defaultProfilePicture}
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
                Total Donations: {profileData.totalDonations}
                <br />
                <br />
                <br />
                <Link to={`/report/user/${userId}`} className="no-underline">
                  <button>🚩 Report this user</button>
                </Link>
              </p>
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
            <PinsCardContainer
              listings={activeListings}
              collectionName="active-listings"
            />
          ) : (
            <p>No active listings to show.</p>
          )}
        </div>
        <br />

        <h1>Comments</h1>

        {/* only write comments on other people's profiles */}
        {!checkProfileOwner(userId) && (
          <>
            <div className={styles.commentInputContainer}>
              <img src={currentUserData?.imageUrl || defaultProfilePicture} className={styles.avatar} alt="Avatar" />
              <textarea
                placeholder="Write a comment..."
                className={styles.commentInput}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)} // Update the comment input state
              />
              <button className={styles.submitButton} onClick={handleCommentSubmit}>
                Post Comment
              </button>
            </div>
          </>
        )}

        <div className={styles.commentSection}>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <CommentCard key={index} comment={comment} />
            ))
          ) : (
            <p>No comments to display for this user.</p>
          )}
        </div>

        <br />
      </div>
    </main>
  );
};

export default Profile;
