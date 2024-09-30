import React, { useState, useEffect } from 'react';
import styles from '../styles/account.module.css';
import defaultImage from '../assets/default-image-path.jpg';
import { ProfileData as ProfileType } from '../config/config';
import { getProfileData } from '../backend/readData';
import { doc, setDoc } from "firebase/firestore";
import { db, auth, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import FileDropzone from "../components/FileDropzone";

const universities = [
    'Auckland University of Technology (AUT)',
    'The University of Auckland (UoA)',
];

const degrees = [
    'Bachelor of Science',
    'Bachelor of Arts',
    'Bachelor of Etc'
];

const EditAccount = () => {
    // store old values so it can be reset back
    const [oldProfileData, setOldProfileData] = useState<ProfileType | null>(null);
    // store all data including new changes (except for pfp image changes)
    const [newProfileData, setNewProfileData] = useState<ProfileType | null>(null);


    const [profilePhotoSource, setProfilePhotoSource] = useState<string | null>(null); // Store photo source for the pfp image
    const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);  // Manage file state, uploaded to cloud
    // const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);  // Manage uploaded file's image preview

    useEffect(() => {
        const fetchAndSetProfileData = async () => {
            if (auth.currentUser) {
                const data = await getProfileData(auth.currentUser.uid);
                setOldProfileData(data);
                setNewProfileData(data);
                if (data) {
                    setProfilePhotoSource(data.imageUrl)
                }
            }
        };

        fetchAndSetProfileData();
    }, []);
    
    const handleInputChange = (field: keyof ProfileType) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (newProfileData) {
            setNewProfileData({ ...newProfileData, [field]: event.target.value });
        }
    };

    const handleDrop = (file: File, preview: string) => {
        setProfilePhotoFile(file);
        setProfilePhotoSource(preview);
        console.log(file)
      };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // TODO: !! handle submits

        let profilePicUrl = profilePhotoSource;

        // if a new profile picture file is uploaded, then upload it to Cloud Storage
        if (profilePhotoFile) {
            console.log("storing new profile picture")
            const imageRef = ref(storage, `profilePictures/${auth.currentUser?.uid}-${Date.now()}`);
            await uploadBytes(imageRef, profilePhotoFile);
            profilePicUrl = await getDownloadURL(imageRef); // Get the URL of the uploaded image
        }

        // this seems overkill but idk man im struggling -Cam
        const updatedProfileData: ProfileType = {
            ...newProfileData,
            imageUrl: profilePicUrl,  // Keep the updated profilePic
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
        
        console.log("submitting data:")
        console.log(updatedProfileData)
        // Update Firestore document with new profile data
        const userDocRef = doc(db, 'users', auth.currentUser?.uid as string);
        await setDoc(userDocRef, updatedProfileData, { merge: true });

        // Set the old profile data to the new one after successful submission
        setOldProfileData(updatedProfileData);

        alert('Profile updated successfully!');

    }

    // !! TODO
    // handle resetting data to defaults by pulling the database data again?

    if (!newProfileData) {
        return <div className="spinner-border text-dark" role="status" />
    }

    return (
        <div className={styles.container}>
            <h1>Edit Account</h1>
            <form onSubmit={onSubmit}>
                <div className={styles.profilePhotoContainer}>
                    {
                        profilePhotoSource ? (
                            <img src={profilePhotoSource} className={styles.profilePic} alt="Profile" />
                        ) : (
                            <img src={defaultImage} className={styles.profilePic} alt="Profile" />
                        )
                    }
                    {/* <input type="file" id="profilePhoto" /> */}
                    <FileDropzone className="dropzone" onDrop={handleDrop} />
                </div>
                <div>
                    <div className={styles.field}>
                        <label>Display Name:</label>
                        <input type="text" id="name" value={newProfileData.username} onChange={handleInputChange('username')} />
                    </div>
                    <div className={styles.field}>
                        <label>Location:</label>
                        <input type="text" id="location" value={newProfileData.location} onChange={handleInputChange('location')} />
                    </div>
                    <div className={styles.field}>
                        <label>University:</label>
                        <select id="university" value={newProfileData.university} onChange={handleInputChange('university')}>
                            {universities.map((univ) => (
                                <option key={univ} value={univ}>{univ}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.field}>
                        <label>Degree:</label>
                        <select id="degree" value={newProfileData.degree} onChange={handleInputChange('degree')}>
                            {degrees.map((deg) => (
                                <option key={deg} value={deg}>{deg}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button type="submit" className={styles.saveButton}>Save Changes</button>
            </form>
        </div>
    );
};

export default EditAccount;
