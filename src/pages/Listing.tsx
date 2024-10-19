import React, { useEffect, useState } from "react";
import styles from "../styles/listing.module.css";
import { Link, Navigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import defaultImagePath from "../assets/default-image-path.jpg";
import { getListingById, getProfileData } from "../backend/readData";
import DonorInfo from "../components/DonorInfo";
import { checkListingOwner } from "../backend/readData";
import EnquiryPopup from "../components/EnquiryPopup";
import DeleteListingPopup from "../components/DeleteListingPopup";
import { checkArray } from "../backend/readData";
import { auth } from "../config/firebase";
import WishlistButton from "../components/WishlistButton";
import { fb_location, listings_field } from "../config/config";
import { showModal } from "../backend/modal";
import ImageModal from "../components/ImageModal";
import { listingData } from "../config/config";
import GeneralPopup from "../components/GeneralPopup";
import {
  hasEnquired,
  isPinned,
  setEnquiredArray,
  togglePinListing,
} from "../backend/readableFunctions";
import { toggleArray, writeToFirestore } from "../backend/writeData";

const Listing: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract id from the route parameters.
  const [listing, setListing] = useState<listingData | null>(null); // State to hold the specific listing
  const [listerEmail, setListerEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [pinned, setPinned] = useState<boolean>(false);
  const [enquired, setEnquired] = useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [originalListing, setOriginalListing] = useState<listingData | null>(
    null
  );
  const [charCount, setCharCount] = useState({
    title: 0,
    authors: 0,
    description: 0,
    courseCode: 0,
  });

  const [hasEmptyEditField, setHasEmptyEditField] = useState(false);

  const maxLengths = {
    title: 100,
    authors: 100,
    description: 400,
    courseCode: 30,
  };

  // modal IDs
  const enquiryModalID = `${listing?.listingID}-enquiry-modal`;
  const removeModalID = `${listing?.listingID}-remove-modal`;

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  // update pinned and enquired to true for when a user enquires a listing
  async function setEnquiredVariables() {
    const listingID = listing!.listingID!;
    const pinnedStatus = await isPinned(listingID);
    if (!pinnedStatus) {
      togglePinListing(listingID);
    }
    setEnquiredArray(listingID);

    // set local useStates
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
            courseCode: foundListing.courseCode?.length || 0,
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
      if (listing?.listingID) {
        const status = await isPinned(listing.listingID);
        console.log("pinned status is: ", status);
        setPinned(status);
      }
    };

    const fetchEnquiredStatus = async () => {
      if (listing?.listingID) {
        const status = await hasEnquired(listing.listingID);
        console.log("enquired status is: " + status);
        setEnquired(status);
      }
    };
    if (listing) {
      fetchPinnedStatus();
      fetchEnquiredStatus();
    }
  }, [listing]);

  const handleEdit = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Update character count
    setCharCount((prev) => ({ ...prev, [name]: value.length }));

    if (value.length <= maxLengths[name as keyof typeof maxLengths]) {
      setListing((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      console.error(
        `The ${name} exceeds the maximum character limit of ${
          maxLengths[name as keyof typeof maxLengths]
        }.`
      );
    }

    // set if there are empty fields (any char count that equals 0)
    setHasEmptyEditField(
      Object.values(charCount).some(value => value === 0)
    );

  };

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
      await togglePinListing(listing.listingID);
      const status = await isPinned(listing.listingID);
      console.log("status: ", status);
      setPinned(status);
    }
  };

  const handleUpdateListing = async () => {
    if (listing) {
      try {
        await writeToFirestore(
          fb_location.listings,
          listing,
          listing.listingID || ""
        );
      } catch (error) {
        console.error("Unable to update listing: ", error);
      }
      setIsEditMode(false);
    }
  };

  const handleEditMode = () => {
    setOriginalListing(listing);
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setListing(originalListing);
    setIsEditMode(false);
  };

  const hasEmptyFields = Object.values(charCount).some(count => count === 0);

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
      <GeneralPopup
        modalId="pin-success"
        header="Listing pinned!"
        message={`You can now view this listing for "${
          listing!.title
        }" in your saved listings page.`}
      />
      <GeneralPopup
        modalId="unpin-success"
        header="Listing unpinned"
        message={`This listing for "${
          listing!.title
        }" has been removed from your saved listings page.`}
      />
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
          // If user is listing owner, show edit and remove buttons
          isListingOwner ? (
            <div className={styles.editSection}>
              {!isEditMode && (
                <button
                  type="button"
                  onClick={handleEditMode}
                  className={styles.editButton}
                >
                  Edit Listing
                </button>
              )}
              {isEditMode && (
                <>
                  <button
                    type="button"
                    onClick={handleUpdateListing}
                    className={styles.editButton}
                    disabled={hasEmptyFields}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className={styles.editButton}
                  >
                    Cancel
                  </button>
                </>
              )}
              <button
                type="button"
                className="danger w-50"
                data-bs-toggle="modal"
                data-bs-target={`#${removeModalID}`}
                onClick={() =>
                  console.log("Delete listing popup ID: ", removeModalID)
                }
              >
                Remove listing
              </button>
            </div>
          ) : // check if user has enquired previously
          enquired ? (
            <button type="button" className="call-to-action w-50" disabled={true}>
              Enquiry sent
            </button>
          ) : (
            <button
              type="button"
              className="call-to-action w-50"
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
            <small>
              {charCount.title}/{maxLengths.title}
            </small>
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
            <small>
              {charCount.authors}/{maxLengths.authors}
            </small>
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
            <small>
              {charCount.courseCode}/{maxLengths.courseCode}
            </small>
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
            <small>
              {charCount.description}/{maxLengths.description}
            </small>
            
            <br />
            <br />
            {hasEmptyFields && <p className="error-msg">All fields must be filled in.</p>}

          </>
        ) : (
          <>
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
              <Link
                to={`/report/listing/${listing!.listingID}`}
                className="no-underline"
              >
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
