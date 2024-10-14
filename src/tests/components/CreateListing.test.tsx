import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import CreateListing from "../../pages/CreateListing";

describe("Navbar", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <CreateListing />
      </BrowserRouter>
    );

    // Choose 3 minimum:
    // TODO: Test that the elements render correctly
    // TODO: Test that the character limit works
    // TODO: Test that the create button is disabled when clicked
    // TODO: Test that an error message shows up when no image is provided
  });
});
