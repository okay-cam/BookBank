import React, { useEffect, useState } from "react";
import styles from "../styles/listing.module.css";
import { Navigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import { Listing as ListingType } from "../backend/types";
import defaultImagePath from "../assets/default-image-path.jpg";
import { getListings } from "../backend/readData";
import DonorInfo from "../components/DonorInfo";
import { checkListingOwner } from "../backend/readData";
import EnquiryPopup from "../components/EnquiryPopup";
import DeleteListingPopup from "../components/DeleteListingPopup";
import { togglePinListing, isPinned } from "../backend/pinning";

const Listing: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [listing, setListing] = useState<ListingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [pinned, setPinned] = useState<boolean>(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listings = await getListings();
      const foundListing = listings.find((l) => l.id === id);
      setListing(foundListing || null);
      setLoading(false);
    };

    fetchListing();
  }, [id]);

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

  const isListingOwner = listing ? checkListingOwner(listing) : false;

  const handlePinToggle = async () => {
    if (listing) {
      await togglePinListing(listing);
      const updatedStatus = await isPinned(listing.id);
      setPinned(updatedStatus);
    }
  };

  return (
    <main className={styles.gridContainer}>
      <EnquiryPopup title={listing!.title} modalId={listing!.modalId} />
      <DeleteListingPopup
        title={listing!.title}
        modalId={`${listing!.modalId}-remove`}
      />
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
            data-bs-target={`#${listing!.modalId}-remove`}
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
        <h3>{listing!.courseCode}</h3>
        <p>{listing!.description}</p>
        <h1>Donor information</h1>
        <DonorInfo donorId={listing!.userID} />
      </div>
    </main>
  );
};

export default Listing;