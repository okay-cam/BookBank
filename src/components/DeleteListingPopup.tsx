import React, { useState } from "react";
import { deleteListing } from "../backend/deleteData";
import { useNavigate } from "react-router-dom";
import GeneralPopup from "./GeneralPopup";
import { showModal } from "../backend/modal";

interface ModalDetails {
  modalId: string;
  title: string;
}

const DeleteListingPopup: React.FC<ModalDetails> = ({ title, modalId }) => {
  // modalID should be id-remove-modal`;
  const navigate = useNavigate();
  const [isDeleting, setDeleting] = useState<boolean>(false);
  const confirmID = `${modalId}-confirm`; // id-remove-modal-confirm

  // Handle delete action
  async function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    try {
      e.preventDefault();
      setDeleting(true); // to make sure the delete button is disabled

      // Call your delete function from backend
      await deleteListing(modalId);
      setDeleting(false);
      navigate("/home"); // navigate back to home
      showModal(confirmID);
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  }

  return (
    <div
      className="modal fade"
      id={modalId} // Use the unique modal ID
      tabIndex={-1}
      aria-labelledby={`${modalId}Label`}
      aria-hidden="true"
    >
      <GeneralPopup
        modalId={confirmID}
        header="Listing deleted!"
        message={`Your listing for '${title}' has been successfully deleted.`}
      />
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Confirm listing deletion
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>
              Are you sure you want to delete your listing for:
              <br />"{title}"?
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="modal-button"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              className="danger"
              onClick={handleDelete}
              disabled={isDeleting}
              data-bs-dismiss="modal"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteListingPopup;
