import React, { useEffect, useState } from "react";
import styles from "../styles/listing.module.css";
import { Link, Navigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import { Listing as ListingType } from "../backend/types";
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
import { fb_location, listings_field } from "../config/config";
import ImageModal from "../components/ImageModal";
import { toggleArray, writeToFirestore } from "../backend/writeData";

const Listing: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract id from the route parameters.
  const [listing, setListing] = useState<ListingType | null>(null); // State to hold the specific listing
  const [listerEmail, setListerEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [pinned, setPinned] = useState<boolean>(false);
  const [enquired, setEnquired] = useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [originalListing, setOriginalListing] = useState<ListingType | null>(null);
  const [charCount, setCharCount] = useState({ title: 0, authors: 0, description: 0, courseCode: 0 });

  const maxLengths = {
    title: 100,
    authors: 100,
    description: 400,
    courseCode: 30
  };

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

          setCharCount({
            title: foundListing.title?.length || 0,
            authors: foundListing.authors?.length || 0,
            description: foundListing.description?.length || 0,
            courseCode: foundListing.courseCode?.length || 0
          });

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
  }, []);

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Update character count
    setCharCount((prev) => ({ ...prev, [name]: value.length }));

    if (value.length <= maxLengths[name as keyof typeof maxLengths]) {
      setListing((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      console.error(`The ${name} exceeds the maximum character limit of ${maxLengths[name as keyof typeof maxLengths]}.`);
    }
  };

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
        await writeToFirestore(fb_location.listings, listing, listing.id);
      } catch (error) {
        console.error("Unable to update listing: ", error);
      }
      setIsEditMode(false);
    }
  };

  const handleEditMode = () => {
    setOriginalListing(listing);
    setIsEditMode(true);
  }

  const handleCancelEdit = () => {
    setListing(originalListing);
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
        {
          // If user is listing owner, show edit and remove buttons
          isListingOwner ? (
            <div className={styles.editSection}>
              {!isEditMode && (
                <button type="button" onClick={handleEditMode} className={styles.editButton}>
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
          ) : // check if user has enquired previously
            enquired ? (
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
            )
        }
      </div>
      <div className={styles.content}>
        <button type="button" className="corner-btn" onClick={handlePinToggle}>
          {pinned ? "Unpin this listing" : "Pin this listing"}
        </button>
        <br />
        {isEditMode ? (
          <>
            <h1>Edit listing</h1>
            <br />

            <label>Title:</label>
            <br />

            <input
              type="text"
              name="title"
              value={listing!.title}
              onChange={handleEdit}
              maxLength={maxLengths.title}
              placeholder="Title"
              required
            />
            <small>{charCount.title}/{maxLengths.title}</small>
            <br />
            <br />
            
            <label>Authors:</label>
            <input
              type="text"
              name="authors"
              value={listing!.authors}
              onChange={handleEdit}
              maxLength={maxLengths.authors}
              placeholder="Authors"
              required
            />
            <small>{charCount.authors}/{maxLengths.authors}</small>
            <br />
            <br />

            <label>Course Code:</label>
            <input
              type="text"
              name="courseCode"
              value={listing!.courseCode}
              onChange={handleEdit}
              maxLength={maxLengths.courseCode}
              placeholder="Course Code"
              required
            />
            <small>{charCount.courseCode}/{maxLengths.courseCode}</small>
            <br />
            <br />

            <label>Description:</label>
            <textarea
              name="description"
              value={listing!.description}
              onChange={handleEdit}
              maxLength={maxLengths.description}
              placeholder="Description"
              className="w-100"
              rows={3}
              required
            />
            <small>{charCount.description}/{maxLengths.description}</small>
          </>
        ) : (
          <>
            <h1>{listing!.title}</h1>
            <label>{listing!.authors}</label>
            <h3>{listing!.courseCode}<WishlistButton className={styles.wishlistButton} courseCode={listing!.courseCode} /></h3>
            <p>{listing!.description}</p>

            <h1>Donor information</h1>
            <DonorInfo donorId={listing!.userID} />

            <br />

            {/* only report other people's listings */}
            {!isListingOwner && (
              <Link to={`/report/listing/${listing!.id}`} className="no-underline">
                <button>🚩 Report this listing</button>
              </Link>
            )}
          </>
        )}
        

      </div>
    </main>
  );
};

export default Listing;
