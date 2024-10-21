import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import CreateListing from "../pages/CreateListing";
import userEvent from "@testing-library/user-event";
import FileDropzone from "../components/FileDropzone";

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

  // test rendering
  it("should render the title, listing information fields [textbook title, authors, course code, description], submit button, and file dropzone", () => {
    const heading = screen.getByRole("heading", { name: /create listing/i }); // a regular expression, i means case insensitive
    const textbookTitle = screen.getByRole("textbox", { name: /title/i });
    const authors = screen.getByRole("textbox", { name: /author/i });
    const courseCode = screen.getByRole("textbox", { name: /course code/i });
    const description = screen.getByRole("textbox", { name: /description/i });
    const dropzoneButton = screen.getByRole("button", {
      name: /upload or drag image/i,
    });
    const submitButton = screen.getByRole("button", { name: /submit/i });

    expect(heading).toBeInTheDocument();
    expect(textbookTitle).toBeInTheDocument();
    expect(authors).toBeInTheDocument();
    expect(courseCode).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(dropzoneButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    screen.debug(); // render the HTML code in the testing interface
  });

  it("should update the input field values on change", async () => {
    // Fetch the input fields
    const textbookTitleInput = screen.getByRole("textbox", { name: /title/i });
    const authorsInput = screen.getByRole("textbox", { name: /author/i });
    const courseCodeInput = screen.getByRole("textbox", {
      name: /course code/i,
    });
    const descriptionInput = screen.getByRole("textbox", {
      name: /description/i,
    });
    const user = userEvent.setup();

    // Simulate a user typing into the input field
    await user.type(textbookTitleInput, "How to write testcases");
    await user.type(authorsInput, "Mr Example");
    await user.type(courseCodeInput, "TESTING101");
    await user.type(descriptionInput, "Book about test cases");

    // Assert that the input field's value has been updated
    expect(textbookTitleInput).toHaveValue("How to write testcases");
    expect(authorsInput).toHaveValue("Mr Example");
    expect(courseCodeInput).toHaveValue("TESTING101");
    expect(descriptionInput).toHaveValue("Book about test cases");
  });

  it("should ask for file upload on submit", async () => {
    // Get the input fields and the submit button
    const textbookTitleInput = screen.getByRole("textbox", { name: /title/i });
    const authorsInput = screen.getByRole("textbox", { name: /author/i });
    const courseCodeInput = screen.getByRole("textbox", {
      name: /course code/i,
    });
    const descriptionInput = screen.getByRole("textbox", {
      name: /description/i,
    });
    const submitButton = screen.getByRole("button", { name: /submit/i });

    // Simulate user typing into input fields and submitting
    const user = userEvent.setup();
    await user.type(textbookTitleInput, "How to Write Testcases");
    await user.type(authorsInput, "Mr. Example");
    await user.type(courseCodeInput, "TESTING101");
    await user.type(descriptionInput, "Book about test cases");
    await user.click(submitButton);

    // Check that it asks for a file upload
    await waitFor(() => {
      const errorMsg = screen.getByText(/upload a photo of your textbook/i);
      expect(errorMsg).toBeInTheDocument();
    });
  });
});

// Choose 3 minimum:
// TODO: Test that the elements render correctly
// TODO: Test that the character limit works
// TODO: Test that the submit button disables when clicked to prevent multiple clicks
// TODO: Test that an error message shows up when no image is provided
