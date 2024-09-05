import React, { useEffect, useState } from "react";
import styles from "../styles/listing.module.css";
import { Navigate, useParams } from "react-router-dom";
import EnquiryPopup from "../components/EnquiryPopup";
import BackButton from "../components/BackButton";
import { Listing as ListingType } from "../backend/types";
import defaultImagePath from "../assets/default-image-path.jpg";
import { getListings } from "../backend/readData";
import DonorInfo from "../components/DonorInfo";

const Listing: React.FC = () => {
  // const { id } = useParams<{ id: string }>(); // Extract id from the route parameters.
  const { id } = useParams<{ id: string }>(); // Extract id from the route parameters.
  // const listingId = parseInt(id || "0", 10); // Convert id to an integer, defaulting to 0 if id is not provided.

  const [listing, setListing] = useState<ListingType | null>(null); // State to hold the specific listing
  const [loading, setLoading] = useState(true); // State to manage loading status

  useEffect(() => {
    const fetchListing = async () => {
      const listings = await getListings(); // Fetch all listings
      const foundListing = listings.find((l) => l.id === id); // Find the listing by id

      setListing(foundListing || null); // Set the found listing or null if not found
      setLoading(false); // Set loading to false after fetching
    };

    fetchListing(); // Call the fetch function when the component mounts
  }, [id]);

  // Redirect to 404 page if listing is not found
  if (!loading && !listing) {
    return <Navigate to="/404" />;
  }

  // Show a loading message while fetching the listing
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className={styles.gridContainer}>
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
        {/* Request button and popup */}
        <button
          type="button"
          className="call-to-action"
          data-bs-toggle="modal"
          data-bs-target={`#${listing!.modalId}`}
        >
          Request/Enquire
        </button>
        <EnquiryPopup title={listing?.title || ""} modalId={listing!.modalId} />
      </div>
      <div className={styles.content}>
        <h1>{listing?.title}</h1>
        <label>{listing?.authors}</label>
        <h3>{listing?.courseCode}</h3>
        <p>{listing?.description}</p>
        <h1>Donor information</h1>
        <DonorInfo donorId={listing?.userID}/>
      </div>
    </main>
  );
};

export default Listing;
