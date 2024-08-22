import React, { useState } from "react";

interface Title {
  title: string;
}

const EnquiryPopup: React.FC<Title> = ({ title }) => {
  const [message, setMessage] = useState(
    "Hi, I am interested in this textbook. Is it still available?"
  );
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit() {
    if (message.trim() === "") {
      // If message is empty, set error message
      setErrorMessage("Message cannot be empty.");
      return;
    }

    setErrorMessage(""); // Clear any previous error message

    // Proceed with handling the message (e.g., send it to a server)
    console.log(message);
    // Perform additional actions here, such as closing the modal
  }

  return (
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
            <textarea
              className="form-control"
              id="exampleFormControlTextarea1"
              value={message} // Bind state value to textarea
              rows={3}
              onChange={(e) => setMessage(e.target.value)} // Update state on change
            ></textarea>
            {errorMessage && <p className="error-msg">{errorMessage}</p>}
          </div>
          <div className="modal-footer">
            <input
              type="button"
              className="button call-to-action"
              value="Send"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryPopup;
