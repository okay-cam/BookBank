import React from "react";
import { Modal } from "bootstrap";

export const showModal = (modalID: string) => {
  const modalElement = document.getElementById(modalID); // Find the modal by ID
  if (modalElement) {
    const modal = new Modal(modalElement); // Initialize the modal
    modal.show(); // Show the modal
    console.log("Programatically showed modal with ID: " + modalID);
  }
};

export const hideModal = (modalID: string) => {
  const modalElement = document.getElementById(modalID); // Find the modal by ID
  if (modalElement) {
    const modal = new Modal(modalElement); // Initialize the modal
    modal.hide(); // Hide the modal
    console.log("Programatically hid modal with ID: " + modalID);
  }
};
