import React, { useState } from "react";
import { sendEmail, EmailData } from "../backend/emailService";
import { appendArray } from "../backend/writeData";
import { auth } from "../config/firebase";

interface ModalDetails {
  modalId: string;
  title: string;
  email: string;
}

const EnquiryPopup: React.FC<ModalDetails> = ({ title, modalId, email }) => {
  console.log("Email in enquiry popup is ", email);
  const [message, setMessage] = useState(
    "Hi, I am interested in this textbook. Is it still available?"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create a formatted HTML message for enquiry
  const formattedEnquiryMessage = `
  <p><strong>Enquiry Details</strong></p>
  <p><strong>From Email:</strong> ${auth.currentUser?.email}</p>
  <p><strong>Enquiry:</strong> ${message}</p>
`;

  // Send email to the textbook donor
  const handleSendEnquiryEmail = async () => {
    const emailData: EmailData = {
      email: email, // send email to the testbook owner's email !! this is going to the wrong email?
      subject: `New request for your textbook '${title}'`,
      message: formattedEnquiryMessage,
    };

    console.log("enquiry email data: ", emailData);

    try {
      const response = await sendEmail(emailData);
      setSuccessMessage(response); // Set success message
      setMessage(""); // Clear the message field on success
      console.log("Enquiry email sent!");
      return true;
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to send email");
      console.log("Enquiry email failed: ", error.message);
      return false;
    }
  };

  // Create a formatted HTML message for receipts
  const formattedReceiptMessage = `
  <p><strong>Enquiry Receipt</strong></p>
  <p><strong>Your enquiry:</strong> ${message}</p>
`;

  // Send email to requester
  const handleSendReceiptEmail = async () => {
    const requesterEmail = auth.currentUser!.email;
    if (!requesterEmail) {
      console.log("Problem with email. Can't send receipt.");
      return false;
    }

    console.log("REQUESTER EMAIL: ", requesterEmail);

    const emailData: EmailData = {
      email: requesterEmail, // use personal email for now, later switch to email variable
      subject: `Your request receipt for the textbook '${title}'`,
      message: formattedReceiptMessage,
    };

    try {
      const response = await sendEmail(emailData);
      setSuccessMessage(response); // Set success message
      setMessage(""); // Clear the message field on success
      console.log("Receipt email sent! Data: ", emailData);
      return true;
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to send email");
      console.log("Receipt email failed: ", error.message);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (message.trim() === "") {
      setErrorMessage("Message cannot be empty.");
      return;
    }

    setErrorMessage(""); // Clear any previous error
    setSuccessMessage(""); // Clear any previous success
    setIsSubmitting(true);

    await handleSendEnquiryEmail(); // Send the email
    await handleSendReceiptEmail(); // Send receipt if email goes through successfully

    appendArray(
      "listings",
      "19ZBcLxqOvaZcTVxZ3Vs",
      "enquired",
      auth.currentUser!.uid
    );
    // TODO: Update second parameter "19ZB" to instead use listingId

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
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              className="call-to-action"
              onClick={handleSubmit}
              data-bs-dismiss="modal"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryPopup;
