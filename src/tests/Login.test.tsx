import { render, screen } from "@testing-library/react";
import Login from "../pages/Login";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import userEvent from "@testing-library/user-event";

describe("Login", () => {
  // this code runs before each test
  beforeEach(() => {
    render(
      // Browser router is needed to render login uses react-router-dom elements such as Link, useNavigate
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  });

  // test rendering
  it("should render the title, text fields and login button", () => {
    const heading = screen.getByRole("heading", { name: /bookbank/i }); // a regular expression, i means case insensitive
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const button = screen.getByRole("button", { name: /sign in/i });

    expect(heading).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
    screen.debug(); // render the HTML code in the testing interface
  });

  it("should update the input field values on change", async () => {
    // Fetch the input fields
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i); // passwords cant be fetched by role
    const user = userEvent.setup();

    // Simulate a user typing into the input field
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password");

    // Assert that the input field's value has been updated
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password");
  });

  it("should disable the sign in button after form submission", async () => {
    // Get the input fields and the submit button
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole("button", { name: /sign in/i });

    // Simulate user typing into input fields
    const user = userEvent.setup();
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password");

    // Submit the form by clicking the sign-in button
    await user.click(signInButton);

    // Assert that the button is disabled after submission
    expect(signInButton).toBeDisabled();
  });

  // it("should show an error message when incorrect login details are entered", async () => {
  //   // Get the input fields and the submit button
  //   const emailInput = screen.getByRole("textbox", { name: /email/i });
  //   const passwordInput = screen.getByLabelText(/password/i); // You could also use the label for this
  //   const signInButton = screen.getByRole("button", { name: /sign in/i });

  //   // Simulate user typing into input fields
  //   const user = userEvent.setup();
  //   await user.type(emailInput, "test@example.com");
  //   await user.type(passwordInput, "password");

  //   // Submit the form by clicking the sign-in button
  //   await user.click(signInButton);
  //   const errorMsg = screen.getByRole("p", { name: /invalid/i });

  //   // Assert that the button is disabled after submission
  //   expect(signInButton).toBeDisabled();
  //   expect(errorMsg).toBeInTheDocument();
  // });
});
