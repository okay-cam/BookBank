import React, { useState, useEffect } from 'react';
import styles from '../styles/account.module.css';
import defaultProfileImage from '../assets/default-profile-path.jpg';
import { fb_location, ProfileData as ProfileType } from '../config/config';
import { getProfileData, getImageUrl } from '../backend/readData';
import { doc, setDoc } from "firebase/firestore";
import { db, auth, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import FileDropzone from "../components/FileDropzone";
import { writeToFirestore, uploadImage } from "../backend/writeData";
import { deleteImage } from "../backend/deleteData";
import GeneralPopup from "../components/GeneralPopup";
import { showModal } from "../backend/modal";

const universities = [
  "Auckland University of Technology (AUT)",
  "The University of Auckland (UoA)",
];

const degrees = ["Bachelor of Science", "Bachelor of Arts", "Bachelor of Etc"];

const EditAccount = () => {
  // store old values so it can be reset back
  const [oldProfileData, setOldProfileData] = useState<ProfileType | null>(
    null
  );
  // store all data including new changes (except for pfp image changes)
  const [newProfileData, setNewProfileData] = useState<ProfileType | null>(
    null
  );
  const confirmModalID = "edit-acc-success";

  const [profilePhotoSource, setProfilePhotoSource] = useState<string | null>(
    null
  ); // Store photo source for the pfp image
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(); // Manage file state, uploaded to cloud
  // const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);  // Manage uploaded file's image preview
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchAndSetProfileData = async () => {
      if (auth.currentUser) {
        const data = await getProfileData(auth.currentUser.uid);
        setOldProfileData(data);
        console.log("Old profile data is " + oldProfileData);
        setNewProfileData(data);
        console.log("New profile data is " + newProfileData);

        if (data) {
          setProfilePhotoSource(data.imageUrl || defaultImage);
        }
      }
    };
    fetchAndSetProfileData();
  }, []);

  const handleInputChange =
    (field: keyof ProfileType) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (newProfileData) {
        setNewProfileData({ ...newProfileData, [field]: event.target.value });
      }
    };

  const handleDrop = (file: File, preview: string) => {
    setProfilePhotoFile(file);
    setProfilePhotoSource(preview);
    console.log(file);
  };

  const onSubmit = async (e: React.FormEvent) => {
    setIsSubmitting(true);
    e.preventDefault();

    // Retrieve the current image URL from Firestore, for deleting
    const oldImageUrl =
      (await getImageUrl(fb_location.users, auth.currentUser!.uid)) || null;
    console.log("Old image url: ", oldImageUrl);

    let profilePicUrl = oldImageUrl;

    // Replace profile photo, and delete old if new entered
    if (profilePhotoFile) {
      console.log("Storing new profile picture");

      try {
        // Upload the new image and get the URL
        profilePicUrl = await uploadImage(
          fb_location.users,
          auth.currentUser!.uid,
          profilePhotoFile
        );

        if (profilePicUrl) {
          await deleteImage(oldImageUrl as string);
        } else {
          throw new Error("No Image Url");
        }
      } catch (error) {
        console.error("Error while uploading image: ", error)
      }
    }
    
    const updatedProfileData: ProfileType = {
      ...newProfileData,
      // image url and filename is updated by the 'uploadImage' function
      // imageUrl: profilePicUrl || newProfileData?.imageUrl || null,  // Keep the updated profilePic
      // imageFilename: newProfileData?.imageFilename || null,  // Keep the updated profilePic
      username: newProfileData?.username || "",  // Ensure name is always a string
      email: newProfileData?.email || "",  // Ensure email is always a string
      university: newProfileData?.university || "",  // Default to empty string
      degree: newProfileData?.degree || "",  // Default to empty string
      location: newProfileData?.location || "",  // Default to empty string
      overallRating: newProfileData?.overallRating || 0,  // Default to 0
      joinDate: newProfileData?.joinDate || "",  // Default to empty string
      lastLoggedIn: newProfileData?.lastLoggedIn || "",  // Default to empty string
      totalDonations: newProfileData?.totalDonations || 0,  // Default to 0
      totalRatingsReceived: newProfileData?.totalRatingsReceived || 0,  // Default to 0
    };
      
    // let profilePicUrl = profilePhotoSource;

    console.log("submitting other data (not images):")
    // Update Firestore document with new profile data
    const userDocRef = doc(db, 'users', auth.currentUser?.uid as string);
    await setDoc(userDocRef, updatedProfileData, { merge: true });

    // if a new profile picture file is uploaded, then upload it to Cloud Storage
    if (profilePhotoFile) {
        console.log("storing new profile picture")
        // const imageRef = ref(storage, `profilePictures/${auth.currentUser?.uid}-${Date.now()}`);
        // await uploadBytes(imageRef, profilePhotoFile);
        // profilePicUrl = await getDownloadURL(imageRef); // Get the URL of the uploaded image
        await uploadImage(fb_location.users, auth.currentUser!.uid, profilePhotoFile);
    }

    // Set the old profile data to the new one after successful submission
    setOldProfileData(updatedProfileData);

    showModal(confirmModalID);
    // alert('Profile updated successfully!');

    // console.log("Submitting data: ", updatedProfileData);

    // // Update Firestore document with new profile data
    // await writeToFirestore(
    //   fb_location.users,
    //   updatedProfileData,
    //   auth.currentUser!.uid
    // );

    // Set the old profile data to the new one after successful submission
    setOldProfileData(updatedProfileData);
    setIsSubmitting(false);
    
  };

  // !! TODO
  // handle resetting data to defaults by pulling the database data again?

  if (!newProfileData) {
    return <div className="spinner-border text-dark" role="status" />;
  }

  return (
    <div className={styles.container}>
      <GeneralPopup
        modalId={confirmModalID}
        header="Changes saved!"
        message="Your profile changes have been saved."
      />
      <h1>Edit Account</h1>
      <form onSubmit={onSubmit}>
        <div className={styles.profilePhotoContainer}>
          {profilePhotoSource ? (
            <img
              src={profilePhotoSource}
              className={styles.profilePic}
              alt="Profile"
              draggable={false}
            />
          ) : (
            <img
              src={defaultProfileImage}
              className={styles.profilePic}
              alt="Profile"
              draggable={false}
            />
          )}
          {/* <input type="file" id="profilePhoto" /> */}
          <FileDropzone className="dropzone" onDrop={handleDrop} />
        </div>
        <div>
          <div className={styles.field}>
            <label>Display Name:</label>
            <input
              type="text"
              id="name"
              value={newProfileData.username}
              onChange={handleInputChange("username")}
            />
          </div>
          <div className={styles.field}>
            <label>Location:</label>
            <input
              type="text"
              id="location"
              value={newProfileData.location}
              onChange={handleInputChange("location")}
            />
          </div>
          <div className={styles.field}>
            <label>University:</label>
            <select
              id="university"
              value={newProfileData.university}
              onChange={handleInputChange("university")}
            >
              {universities.map((univ) => (
                <option key={univ} value={univ}>
                  {univ}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Degree:</label>
            <select
              id="degree"
              value={newProfileData.degree}
              onChange={handleInputChange("degree")}
            >
              {degrees.map((deg) => (
                <option key={deg} value={deg}>
                  {deg}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="call-to-action"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
};

export default EditAccount;
