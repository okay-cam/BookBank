import React, { useEffect } from "react";

interface ModalDetails {
  modalId: string;
  header: string;
  message: string;
}

/*
--------INSTRUCTIONS TO USE--------
CREATE BUTTON WITH THESE TWO ATTRIBUTES
data-bs-toggle="modal"
data-bs-target={"#modalID"}

IMPORT GENERAL POPUP
<GeneralPopup modalId="modalID" header="Insert header text" message="Insert message if needed" />

MAKE SURE MODALID IS UNIQUE
*/
const GeneralPopup: React.FC<ModalDetails> = ({ header, message, modalId }) => {
  useEffect(() => {
    // This will only run when the modal is initialised
    console.log("General popup initialized with id: " + modalId);
  }, [modalId]);

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
              {header}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <center>
              <p>{message}</p>
            </center>
          </div>
          <div className="modal-footer">
            <button type="button" className="" data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralPopup;
