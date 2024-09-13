import React, { useState, useEffect } from 'react';
import styles from '../styles/account.module.css';
import defaultImage from '../assets/default-image-path.jpg';
import { ProfileData as ProfileType } from '../backend/types';
import { getProfileData } from '../backend/readData';
import { auth } from '../config/firebase';

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
                    setProfilePhotoSource(data.profilePic)
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


        // Upload image to Cloud Storage if file exists
        // !! it should only do this if a new profile picture has been uploaded
        // if (file) {
        //     const imageRef = ref(storage, `listings/${Date.now()}-${file.name}`);
        //     await uploadBytes(imageRef, file);
        //     const imageUrl = await getDownloadURL(imageRef);
    
        //     // Create Firestore document with imageUrl
        //     await setDoc(docRef, {
        //     ...listingData,
        //     imageUrl,
        //     }, { merge: true });
        // } else {
        //     // Create Firestore document without image
        //     await setDoc(docRef, listingData, { merge: true });
        // }
        // };

    }

    // TODO
    // handle resetting data to defaults by pulling the database data again?
    // but if submitting, then overwrite the database data?

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
                        <input type="text" id="name" value={newProfileData.name} onChange={handleInputChange('name')} />
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
