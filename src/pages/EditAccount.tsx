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
    const [profileData, setProfileData] = useState<ProfileType | null>(null);
    const [profilePhoto, setProfilePhoto] = useState<string>(defaultImage);

    const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);  // Manage file state
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);  // Manage uploaded file's image preview
  
    useEffect(() => {
        const fetchAndSetProfileData = async () => {
            if (auth.currentUser) {
                const data = await getProfileData(auth.currentUser.uid);
                setProfileData(data);
            }
        };

        fetchAndSetProfileData();
    }, []);
    
    const handleInputChange = (field: keyof ProfileType) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (profileData) {
            setProfileData({ ...profileData, [field]: event.target.value });
        }
    };

    const handleDrop = (file: File, preview: string) => {
        setProfilePhotoFile(file);
        setProfilePhotoPreview(preview);
        console.log(file)
      };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: !! handle submits
    }

    // TODO
    // handle resetting data to defaults by pulling the database data again?
    // but if submitting, then overwrite the database data?

    if (!profileData) {
        return <div className="spinner-border text-dark" role="status" />
    }

    return (
        <div className={styles.container}>
            <h1>Edit Account</h1>
            <form onSubmit={onSubmit}>
                <div className={styles.profilePhotoContainer}>
                    <img src={profilePhoto} className={styles.profilePic} alt="Profile" />
                    <input type="file" id="profilePhoto" />
                    <FileDropzone className="dropzone" onDrop={handleDrop} />
                </div>
                <div>
                    <div className={styles.field}>
                        <label>Display Name:</label>
                        <input type="text" id="name" value={profileData.name} onChange={handleInputChange('name')} />
                    </div>
                    <div className={styles.field}>
                        <label>Location:</label>
                        <input type="text" id="location" value={profileData.location} onChange={handleInputChange('location')} />
                    </div>
                    <div className={styles.field}>
                        <label>University:</label>
                        <select id="university" value={profileData.university} onChange={handleInputChange('university')}>
                            {universities.map((univ) => (
                                <option key={univ} value={univ}>{univ}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.field}>
                        <label>Degree:</label>
                        <select id="degree" value={profileData.degree} onChange={handleInputChange('degree')}>
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
