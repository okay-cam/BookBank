import React, { useEffect, useState } from "react";
import { sendEmail, EmailData } from "../backend/emailService";
import { appendArray } from "../backend/writeData";
import { auth } from "../config/firebase";
import { fb_location, listings_field, listingData } from "../config/config";
import { hideModal } from "../backend/modal";

interface ModalDetails {
  listing: listingData;
  email: string;
  setEnquiredVariables: Function; // function in listing.tsx to update enquired and pinned states to true
  enquiryModalID: string;
}

const EnquiryPopup: React.FC<ModalDetails> = ({
  listing,
  email,
  setEnquiredVariables,
  enquiryModalID,
}) => {
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
      email: email, // send email to the testbook owner's email
      subject: `New request for your textbook '${listing.title}'`,
      message: formattedEnquiryMessage,
    };

    console.log("enquiry email data: ", emailData);

    try {
      const response = await sendEmail(emailData);
      setSuccessMessage(response); // Set success message
      setMessage(""); // Clear the message field on success
      console.log("Enquiry email: ", response);
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
      console.error("Problem with email. Can't send receipt since requester email doesn't exist.");
      return false;
    }

    console.log("REQUESTER EMAIL: ", requesterEmail);

    const emailData: EmailData = {
      email: requesterEmail, // use personal email for now, later switch to email variable
      subject: `Your request receipt for the textbook '${listing.title}'`,
      message: formattedReceiptMessage,
    };

    try {
      const response = await sendEmail(emailData);
      setSuccessMessage(response); // Set success message
      setMessage(""); // Clear the message field on success
      console.log("Receipt email: ", response);
      console.log("Receipt Data: ", emailData);
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

    if (await handleSendEnquiryEmail()) {
      // Send the email
      await handleSendReceiptEmail(); // Send receipt if email goes through successfully
    }

    // add user id to the enquired field
    await appendArray(
      fb_location.listings, // name of the collection
      listing.listingID || "", // listing id
      listings_field.enquired, // field
      auth.currentUser!.uid // id of the user that enquired
    );
    setEnquiredVariables(); // set listing as enquired and pinned
  };

  // code to toggle static effect on modal but doesnt work
  // useEffect(() => {
  //   const modalElement = document.getElementById(enquiryModalID);
  //   const bootstrapModal = new window.bootstrap.Modal(modalElement);

  //   if (isSubmitting) {
  //     bootstrapModal._config.backdrop = "static"; // Make backdrop static during submission
  //     bootstrapModal._config.keyboard = false; // Disable keyboard dismiss
  //   } else {
  //     bootstrapModal._config.backdrop = true; // Restore default backdrop
  //     bootstrapModal._config.keyboard = true; // Restore keyboard dismiss
  //   }
  // }, [isSubmitting, enquiryModalID]);

  return (
    <div
      className="modal fade"
      id={enquiryModalID} // Use the unique modal ID
      tabIndex={-1}
      aria-labelledby={`${enquiryModalID}Label`}
      aria-hidden="true"
      {...(isSubmitting && { "data-bs-backdrop": "static" })} // prevent clicking outside when submitting
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
              // data-bs-dismiss="modal"
              {...(!isSubmitting && { "data-bs-dismiss": "modal" })} // disable dismiss when submitting
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>Enquiring for '{listing.title}'</p>
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
              className="modal-button"
              {...(!isSubmitting && { "data-bs-dismiss": "modal" })}
            >
              Cancel
            </button>
            <button
              type="button"
              className="call-to-action"
              onClick={handleSubmit}
              disabled={isSubmitting || message.trim() === ""}
              {...(!isSubmitting && { "data-bs-dismiss": "modal" })} // disable dismiss when submitting
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
