import React, { useState } from "react";
import { sendEmail, EmailData } from '../backend/emailService';

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
  
  // Create a formatted HTML message for enquiry
  const formattedEnquiryMessage = `
  <p><strong>Enquiry Details</strong></p>
  <p><strong>Email:</strong> ${auth.currentUser?.email}</p>
  <p><strong>Enquiry:</strong> ${message}</p>
`;
  
  // Send email to the textbook donor
  const handleSendEnquiryEmail = async () => {
    const emailData : EmailData = {
      email: email, // use personal email for now, later switch to email variable
      subject: `New request for your textbook '${title}'`,
      message: formattedEnquiryMessage,
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
  
  // Create a formatted HTML message for receipts
  const formattedReceiptMessage = `
  <p><strong>Enquiry Receipt</strong></p>
  <p><strong>Your enquiry:</strong> ${message}</p>
`;

  // Send email to requester
  const handleSendReceiptEmail = async () => {

    const requesterEmail = auth.currentUser!.email
    if (!requesterEmail) {
      console.log("Problem with email. Can't send receipt.");
      return false;
    }

    const emailData : EmailData = {
      email: requesterEmail, // use personal email for now, later switch to email variable
      subject: `Your request receipt for the textbook '${title}'`,
      message: formattedReceiptMessage,
    };
    
    try {
      const response = await sendEmail(emailData);
      setSuccessMessage(response); // Set success message
      setMessage(""); // Clear the message field on success
      return true;
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to send email');
      return false;
    }
  };

  const handleSubmit = () => {
    if (message.trim() === "") {
      setErrorMessage("Message cannot be empty.");
      return;
    }

    setErrorMessage(""); // Clear any previous error
    setSuccessMessage(""); // Clear any previous success
    setIsSubmitting(true);
    
    handleSendEnquiryEmail(); // Send the email
    handleSendReceiptEmail(); // Send receipt if email goes through successfully

    console.log(message);
    // Perform additional actions here, such as closing the modal
    setIsSubmitting(false);
    
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
