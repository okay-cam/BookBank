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
import WishlistButton from "../components/WishlistButton";

const Listing: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract id from the route parameters.
  const [listing, setListing] = useState<ListingType | null>(null); // State to hold the specific listing
  const [listerEmail, setListerEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [pinned, setPinned] = useState<boolean>(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listings = await getListings(); // Fetch all listings
      const foundListing = listings.find((l) => l.id === id); // Find the listing by id

      setListing(foundListing || null); // Set the found listing or null if not found

      // Fetch email if listing is found
      if (foundListing) {
        const listerProfile = await getProfileData(foundListing.userID); // fetch profile data
        setListerEmail(listerProfile!.email || null);
        console.log("lister profile: ", listerProfile);
        console.log("lister profile email: ", listerProfile?.email);
      }
      else {
        console.log("listing not found")
      }

      console.log("lister email: ", listerEmail);

      setLoading(false); // Set loading to false after fetching
    };

    fetchListing(); // Call the fetch function when the component mounts
    // }, [id, listing]);
  }, [id]);

  useEffect(() => {
    if (listerEmail) {
      console.log("Updated lister email: ", listerEmail);

    }
  }, [listerEmail]);

  useEffect(() => {
    const fetchPinnedStatus = async () => {
      if (listing?.id) {
        const status = await isPinned(listing.id);
        setPinned(status);
      }
    };

    if (listing) {
      fetchPinnedStatus();
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
      await togglePinListing(listing);
      const updatedStatus = await isPinned(listing.id);
      setPinned(updatedStatus);
    }
  };

  return (
    <main className={styles.gridContainer}>
      {listing && listerEmail && (
        <EnquiryPopup
          title={listing.title}
          modalId={listing.modalId}
          email={listerEmail}
        />
      )}
      <DeleteListingPopup title={listing!.title} modalId={removeID} />
      <div className={styles.aside}>
        <BackButton />
        <img
          src={listing!.imageUrl || defaultImagePath}
          alt="Listing image"
          style={{
            maxWidth: "100%",
            maxHeight: "300px",
            marginTop: "10px",
          }}
        />
        <br />
        <br />
        {isListingOwner ? (
          <button
            type="button"
            className="danger"
            data-bs-toggle="modal"
            data-bs-target={`#${removeID}`}
            onClick={() => console.log("Delete listing popup ID: ", removeID)}
          >
            Remove listing
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
      <div className={styles.content}>
        <button
          type="button"
          className="corner-btn"
          onClick={handlePinToggle}
        >
          {pinned ? "Unpin this listing" : "Pin this listing"}
        </button>
        <br />
        <h1>{listing!.title}</h1>
        <label>{listing!.authors}</label>
        <h3>{listing!.courseCode}<WishlistButton className={styles.wishlistButton} courseCode={listing!.courseCode} /></h3>
        <p>{listing!.description}</p>
        <h1>Donor information</h1>
        <DonorInfo donorId={listing!.userID} />
      </div>
    </main>
  );
};

export default Listing;