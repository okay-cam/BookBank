import React, { useState } from "react";
import { sendEmail, EmailData } from '../backend/emailService';

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
  
  const handleSendEmail = async () => {
    const emailData : EmailData = {
      email: 'camoarrow4586@gmail.com',
      subject: 'test email from app!',
      message: 'This is a test message from our app!',
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

    console.log(message);
    // Perform additional actions here, such as closing the modal
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
