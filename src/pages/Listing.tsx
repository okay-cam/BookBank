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
import { togglePinListing } from "../backend/pinning";

const Listing: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract id from the route parameters.
  const [listing, setListing] = useState<ListingType | null>(null); // State to hold the specific listing
  const [listerEmail, setListerEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // State to manage loading status

  useEffect(() => {
    const fetchListing = async () => {
      const listings = await getListings(); // Fetch all listings
      const foundListing = listings.find((l) => l.id === id); // Find the listing by id

      setListing(foundListing || null); // Set the found listing or null if not found

      // Fetch email if listing is found
      if (foundListing) {
        const listerProfile = await getProfileData(foundListing.userID); // fetch profile data
        setListerEmail(listerProfile?.email || null);
      }

      setLoading(false); // Set loading to false after fetching
    };

    fetchListing(); // Call the fetch function when the component mounts
  // }, [id, listing]);
  }, [id]);

  // Redirect to 404 page if listing is not found
  if (!loading && !listing) {
    return <Navigate to="/404" />;
  }

  // Show a loading message while fetching the listing
  if (loading) {
    return <div>Loading...</div>;
  }

  // check if this is the current users listing
  const isListingOwner = checkListingOwner(listing!);

  return (
    <main className={styles.gridContainer}>
      <EnquiryPopup
        title={listing!.title}
        modalId={listing!.modalId}
        email={listerEmail!}
      />
      <DeleteListingPopup
        title={listing!.title}
        modalId={`${listing!.modalId}-remove`}
      />
      <div className={styles.aside}>
        <BackButton />
        <img
          src={listing?.imageUrl || defaultImagePath} // Use the imageUrl or fallback to defaultImagePath
          alt="Listing image"
          style={{
            maxWidth: "100%",
            maxHeight: "300px",
            marginTop: "10px",
          }}
        />
        <br />
        <br />
        {/* buttons and popups */}
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
        {/* pin button */}
        <button
          type="button"
          className="corner-btn"
          onClick={() => togglePinListing(listing!)}
        >
          Pin this listing
        </button>
        <br />
        <h1>{listing?.title}</h1>
        <label>{listing?.authors}</label>
        <h3>{listing?.courseCode}</h3>
        <p>{listing?.description}</p>
        <h1>Donor information</h1>
        <DonorInfo donorId={listing!.userID} />
      </div>
    </main>
  );
};

export default Listing;
