import React from "react";
import { deleteListing } from "../backend/deleteData";

interface ModalDetails {
  modalId: string;
  title: string;
}

const DeleteListingPopup: React.FC<ModalDetails> = ({ title, modalId }) => {
  return (
    <div
      className="modal fade"
      id={modalId} // Use the unique modal ID
      tabIndex={-1}
      aria-labelledby={`${modalId}Label`}
      aria-hidden="true"
    >
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
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button type="button" className="danger" onClick={() => deleteListing(modalId)} >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteListingPopup;
