import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import CreateListing from "../pages/CreateListing";

describe("CreateListing", () => {
  // Mocks the auth import with a placeholder user ID
  vi.mock("../config/firebase", () => {
    return {
      auth: {
        currentUser: {
          uid: "mockedUserId123", // Mocked arbitrary user ID
        },
      },
    };
  });

  beforeEach(() => {
    render(
      <BrowserRouter>
        <CreateListing />
      </BrowserRouter>
    );
  });

  it("should render the heading, input fields and submit button", () => {
    const heading = screen.getByRole("heading", { name: /create/i });
    const button = screen.getByRole("button", { name: /submit/i });
    
    expect(heading).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });
});

// Choose 3 minimum:
// TODO: Test that the elements render correctly
// TODO: Test that the character limit works
// TODO: Test that the submit button disables when clicked to prevent multiple clicks
// TODO: Test that an error message shows up when no image is provided
