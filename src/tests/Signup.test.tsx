import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import Signup from "../pages/Signup";
import userEvent from "@testing-library/user-event";

describe("Signup", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );
  });

  it("should render the account creation fields [email, username, password, confirm password, submit button and register label]", () => {
    const heading = screen.getByRole("heading", { name: /register/i});
    const username = screen.getByRole("textbox", { name: /name/i });
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Password");
    const confirmPassword = screen.getByLabelText("Confirm Password");

    const button = screen.getByRole("button", { name: /create/i });

    expect(heading).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(username).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(confirmPassword).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("should update fields on user input", async () => {
    const usernameInput = screen.getByRole("textbox", { name: /display name/i });
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");

    const user = userEvent.setup();

    await user.type(usernameInput, "TestUser");
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password");
    await user.type(confirmPasswordInput, "password");

    expect(usernameInput).toHaveValue("TestUser");
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password");
    expect(confirmPasswordInput).toHaveValue("password");

  });

  it("should show an error message when passwords don't match", async () => {
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const createAccountButton = screen.getByRole("button", { name: /create account/i });

    const user = userEvent.setup();

    await user.type(passwordInput, "password");
    await user.type(confirmPasswordInput, "notpassword");

    await user.click(createAccountButton);

    const errorMessage = await screen.findByText("Passwords do not match. Please retype your password.");
    expect(errorMessage).toBeInTheDocument();
  });


});
