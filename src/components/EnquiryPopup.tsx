import React, { useState } from "react";
import { sendEmail, EmailData } from '../backend/emailService';
import { appendArray } from '../backend/writeData';
import { auth } from "../config/firebase";

interface ModalDetails {
  modalId: string;
  title: string;
  email: string;
}

const EnquiryPopup: React.FC<ModalDetails> = ({ title, modalId, email }) => {
  const [message, setMessage] = useState(
    "Hi, I am interested in this textbook. Is it still available?"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Create a formatted HTML message
  const formattedMessage = `
  <p><strong>Enquiry Details</strong></p>
  <p><strong>Email:</strong> ${auth.currentUser?.email}</p>
  <p><strong>Enquiry:</strong> ${message}</p>
`;

  const handleSendEmail = async () => {
    const emailData : EmailData = {
      email: 'camoarrow4586@gmail.com', // use personal email for now, later switch to email variable
      subject: `New request for your textbook '${title}'`,
      message: formattedMessage,
    };
  
    try {
      const response = await sendEmail(emailData);
      setSuccessMessage(response); // Set success message
      setMessage(""); // Clear the message field on success
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to send email');
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };
  
  const handleSubmit = () => {
    if (message.trim() === "") {
      setErrorMessage("Message cannot be empty.");
      return;
    }

    setErrorMessage(""); // Clear any previous error
    setSuccessMessage(""); // Clear any previous success


    handleSendEmail(); // Send the email

    // TODO: Update second parameter "19ZB" to instead use listingId
    appendArray("listings", "19ZBcLxqOvaZcTVxZ3Vs", "enquired", auth.currentUser!.uid)

    console.log(message);
    // Perform additional actions here, such as closing the modal
    // !! Close the modal
  };

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
            <p>Enquiring for '{title}'</p>
            <label>Message:</label>
            <br />
            <textarea
              className="form-control"
              id="message"
              value={message} // Bind state value to textarea
              rows={3}
              onChange={(e) => setMessage(e.target.value)} // Update state on change
            />
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
