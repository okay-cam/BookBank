import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import Signup from "../pages/Signup";

describe("Signup", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
  });

  it("should render the heading, input fields and submit button", () => {
    const heading = screen.getByRole("heading");
    const button = screen.getByRole("button", { name: /create/i });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/register/i);
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  // Choose 3 minimum:
  // TODO: Test that the elements render correctly
  // TODO: Test that the fields update on user input
  // TODO: Test that an error message shows up when passwords don't match
  // TODO: Test that the sign up button disables after clicked to prevent multiple function calls
});
