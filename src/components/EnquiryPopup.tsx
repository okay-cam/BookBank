import React from "react";

interface Title {
  title: string;
}

const EnquiryPopup: React.FC<Title> = ({ title }) => {
  const defaultMessage =
    "Hi, I am interested in this textbook. Is it still available?";

  return (
    <>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Enquire/Request a textbook
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Enquiring for: {title}</p>

              <label>Message:</label>
              <br />
              {/* <input
                type="text"
                value="Hi, is this textbook still available?"
                width="100"
              /> */}
              <textarea
                className="form-control"
                id="exampleFormControlTextarea1"
                value={defaultMessage}
                rows={3}
              ></textarea>
            </div>
            <div className="modal-footer">
              {/* <button type="button" data-bs-dismiss="modal">
                Close
              </button> */}
              <button type="button" className="call-to-action">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnquiryPopup;
