import React, { useEffect, useState } from "react";
import styles from "../styles/listing.module.css";
import { Navigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import { Listing as ListingType } from "../backend/types";
import defaultImagePath from "../assets/default-image-path.jpg";
import { getListings, getProfileData } from "../backend/readData";
import DonorInfo from "../components/DonorInfo";
import { checkListingOwner } from "../backend/readData";
import EnquiryPopup from "../components/EnquiryPopup";
import DeleteListingPopup from "../components/DeleteListingPopup";
import { togglePinListing, isPinned } from "../backend/pinning";
import { checkArray } from "../backend/readData";
import { auth } from "../config/firebase";
import WishlistButton from "../components/WishlistButton";
import ImageModal from "../components/ImageModal";
import { writeToFirestore } from "../backend/writeData";

import { fb_location, listings_field } from "../config/config"
import { toggleArray } from "../backend/writeData";

const Listing: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract id from the route parameters.
  const [listing, setListing] = useState<ListingType | null>(null); // State to hold the specific listing
  const [listerEmail, setListerEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [pinned, setPinned] = useState<boolean>(false);
  const [enquired, setEnquired] = useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  // instant update for when a user enquires a listing
  function setEnquiredVariables() {
    setEnquired(true); // disable the button so they can't enquire several times
    setPinned(true); // automatically pin the listing for quick reference
  }

  useEffect(() => {
    const fetchListing = async () => {
      const listings = await getListings(); // Fetch all listings
      const foundListing = listings.find((l) => l.id === id); // Find the listing by id

      setListing(foundListing || null); // Set the found listing or null if not found

      // Fetch email if listing is found
      try {
        if (foundListing) {
          const listerProfile = await getProfileData(foundListing.userID); // fetch profile data
          setListerEmail(listerProfile!.email || null);
          console.log("lister profile: ", listerProfile);
          console.log("lister profile email: ", listerProfile?.email);
        } else {
          console.log("listing not found");
        }
        console.log("lister email: ", listerEmail);
      } catch (error) {
        console.error("Unable to present donor information", error);
      }


      setLoading(false); // Set loading to false after fetching
    };

    fetchListing(); // Call the fetch function when the component mounts
  }, [id]);

  useEffect(() => {
    if (listerEmail) {
      console.log("Updated lister email: ", listerEmail);
    }
  }, [listerEmail]);

  // check if user has pinned or enquired
  useEffect(() => {
    const fetchPinnedStatus = async () => {
      if (listing?.id) {
        const status = await checkArray(fb_location.listings, listing.id, listings_field.pinned, auth.currentUser!.uid);
        console.log("status: ", status);
        setPinned(status);
      }
    };

    const fetchEnquiredStatus = async () => {
      if (listing?.id) {
        const status = await checkArray(
          fb_location.listings, // name of the collection
          listing.id, // listing id
          listings_field.enquired, // field
          auth.currentUser!.uid // id of the user that enquired
        );
        setEnquired(status);
      }
    };

    if (listing) {
      fetchPinnedStatus();
      fetchEnquiredStatus();
    }
  }, [listing]);

  if (!loading && !listing) {
    return <Navigate to="/404" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  // check if this is the current users listing
  const isListingOwner = listing ? checkListingOwner(listing) : false;
  const removeID = `${listing!.modalId}-remove`;
  const handlePinToggle = async () => {
    if (listing) {
      await toggleArray(fb_location.listings, listing.id, listings_field.pinned, auth.currentUser!.uid);
      const status = await checkArray(fb_location.listings, listing.id, listings_field.pinned, auth.currentUser!.uid);
      console.log("status: ", status);
      setPinned(status);
    }
  };

  const handleUpdateListing = async () => {
    if (listing) {
      try {
        // Can't get this function working
        await writeToFirestore(fb_location.listings, listing);
      } catch (error) {
        console.error("Unable to create listing");
      }
      setIsEditMode(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  return (
    <main className={styles.gridContainer}>
      {listing && listerEmail && (
        <EnquiryPopup
          listing={listing}
          email={listerEmail}
          setEnquiredVariables={setEnquiredVariables}
        />
      )}
      <DeleteListingPopup title={listing!.title} modalId={removeID} />
      {isImageModalOpen && (
        <ImageModal
          imageUrl={listing!.imageUrl || defaultImagePath}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}
      <div className={styles.aside}>
        <BackButton />
        <img
          src={listing!.imageUrl || defaultImagePath}
          alt="Listing image"
          style={{
            maxWidth: "100%",
            maxHeight: "300px",
            marginTop: "10px",
            cursor: 'pointer',
          }}
          onClick={handleImageClick}
        />
        <br />
        <br />
        {isListingOwner && (
          <div className={styles.editSection}>
            {!isEditMode && (
              <button type="button" onClick={() => setIsEditMode(!isEditMode)} className={styles.editButton}>
                Edit Listing
              </button>
            )}
            {isEditMode && (
              <>
                <button type="button" onClick={handleUpdateListing} className={styles.editButton}>
                  Save Changes
                </button>
                <button type="button" onClick={handleCancelEdit} className={styles.editButton}>
                  Cancel
                </button>
              </>
            )}
            <button
              type="button"
              className="danger"
              data-bs-toggle="modal"
              data-bs-target={`#${removeID}`}
              onClick={() => console.log("Delete listing popup ID: ", removeID)}
            >
              Remove listing
            </button>
          </div>
        )}
        {!isListingOwner && (
          <div>
            {enquired ? (
              <button type="button" className="call-to-action" disabled={true}>
                Already enquired
              </button>
            ) : (
              <button
                type="button"
                className="call-to-action"
                data-bs-toggle="modal"
                data-bs-target={`#${listing!.modalId}`}
              >
                Request/Enquire
              </button>
            )}
          </div>
        )}
      </div>
      <div className={styles.content}>
        <button type="button" className="corner-btn" onClick={handlePinToggle}>
          {pinned ? "Unpin this listing" : "Pin this listing"}
        </button>
        <br />
        {isEditMode ? (
          <>
            <label>Title:</label>
            <input
              type="text"
              value={listing!.title}
              onChange={(e) => setListing({ ...listing!, title: e.target.value })}
              placeholder="Title"
              className={styles.inputField}
              required
            />
            <label>Authors:</label>
            <input
              type="text"
              value={listing!.authors}
              onChange={(e) => setListing({ ...listing!, authors: e.target.value })}
              placeholder="Authors"
              className={styles.inputField}
              required
            />
            <label>Course Code:</label>
            <input
              type="text"
              value={listing!.courseCode}
              onChange={(e) => setListing({ ...listing!, courseCode: e.target.value })}
              placeholder="Course Code"
              className={styles.inputField}
              required
            />
            <label>Description:</label>
            <textarea
              value={listing!.description}
              onChange={(e) => setListing({ ...listing!, description: e.target.value })}
              placeholder="Description"
              className={`${styles.inputField} ${styles.textArea}`}
              required
            />
          </>
        ) : (
          <>
            <h1>{listing!.title}</h1>
            <label>{listing!.authors}</label>
            <h3>{listing!.courseCode}<WishlistButton className={styles.wishlistButton} courseCode={listing!.courseCode} /></h3>
            <p>{listing!.description}</p>
          </>
        )}
        <h1>Donor information</h1>
        <DonorInfo donorId={listing!.userID} />
      </div>
    </main >
  );
};

export default Listing;
