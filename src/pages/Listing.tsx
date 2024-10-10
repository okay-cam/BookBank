import React, { useEffect, useState } from "react";
import styles from "../styles/listing.module.css";
import { Link, Navigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import defaultImagePath from "../assets/default-image-path.jpg";
import {
  getListingById,
  getProfileData,
} from "../backend/readData";
import DonorInfo from "../components/DonorInfo";
import { checkListingOwner } from "../backend/readData";
import EnquiryPopup from "../components/EnquiryPopup";
import DeleteListingPopup from "../components/DeleteListingPopup";
import { checkArray } from "../backend/readData";
import { auth } from "../config/firebase";
import WishlistButton from "../components/WishlistButton";
import { showModal } from "../backend/modal";
import ImageModal from "../components/ImageModal";
import { listingData } from "../config/config";

import { fb_location, listings_field } from "../config/config";
import { toggleArray } from "../backend/writeData";

const Listing: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract id from the route parameters.
  const [listing, setListing] = useState<listingData | null>(null); // State to hold the specific listing
  const [listerEmail, setListerEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [pinned, setPinned] = useState<boolean>(false);
  const [enquired, setEnquired] = useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);

  // modal IDs
  const enquiryModalID = `${listing?.listingID}-enquiry-modal`;
  const removeModalID = `${listing?.listingID}-remove-modal`;

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
      const foundListing = await getListingById(id!);
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
      if (listing?.listingID) {
        const status = await checkArray(
          fb_location.listings,
          listing.listingID,
          listings_field.pinned,
          auth.currentUser!.uid
        );
        console.log("status: ", status);
        setPinned(status);
      }
    };

    const fetchEnquiredStatus = async () => {
      if (listing?.listingID) {
        const status = await checkArray(
          fb_location.listings, // name of the collection
          listing.listingID, // listing id
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
  const handlePinToggle = async () => {
    if (listing?.listingID) {
      await toggleArray(
        fb_location.listings,
        listing.listingID,
        listings_field.pinned,
        auth.currentUser!.uid
      );
      const status = await checkArray(
        fb_location.listings,
        listing.listingID,
        listings_field.pinned,
        auth.currentUser!.uid
      );
      console.log("status: ", status);
      setPinned(status);
    }
  };

  return (
    <main className={styles.gridContainer}>
      {listing && listerEmail && (
        <EnquiryPopup
          listing={listing}
          email={listerEmail}
          setEnquiredVariables={setEnquiredVariables}
          enquiryModalID={enquiryModalID}
        />
      )}
      <DeleteListingPopup title={listing!.title} modalId={removeModalID} />
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
            cursor: "pointer",
          }}
          onClick={handleImageClick}
        />
        <br />
        <br />
        {
          // check if user is the listing owner
          isListingOwner ? (
            <button
              type="button"
              className="danger"
              data-bs-toggle="modal"
              data-bs-target={`#${removeModalID}`}
              onClick={() =>
                console.log("Delete listing popup ID: ", removeModalID)
              }
            >
              Remove listing
            </button>
          ) : // check if user has enquired previously
          enquired ? (
            <button type="button" className="call-to-action" disabled={true}>
              Enquiry sent
            </button>
          ) : (
            <button
              type="button"
              className="call-to-action"
              onClick={() => showModal(enquiryModalID)}
            >
              Request/Enquire
            </button>
          )
        }
      </div>
      <div className={styles.content}>
        <button type="button" className="corner-btn" onClick={handlePinToggle}>
          {pinned ? "Unpin this listing" : "Pin this listing"}
        </button>
        <br />
        <h1>{listing!.title}</h1>
        <label>{listing!.authors}</label>
        <br />
        <h3>{listing!.courseCode}</h3>
        <WishlistButton
          className={styles.wishlistButton}
          courseCode={listing!.courseCode}
        />
        <p>{listing!.description}</p>
        <h1>Donor information</h1>
        <DonorInfo donorId={listing!.userID} />

        <br />

        {/* only report other people's listings */}
        {!isListingOwner && (
          <Link to={`/report/listing/${listing!.listingID}`} className="no-underline">
            <button>🚩 Report this listing</button>
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;
