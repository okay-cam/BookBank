import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import ResetPassword from "../pages/ResetPassword";
import userEvent from "@testing-library/user-event";

describe("ResetPassword", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
  });

  it("should render heading, input field and button", () => {
    const heading = screen.getByRole("heading");
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const button = screen.getByRole("button", { name: /send/i });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/reset/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveValue("");
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it("should update the email input field on user type", async () => {
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const user = userEvent.setup();

    await user.type(emailInput, "test@example.com");

    expect(emailInput).toHaveValue("test@example.com");
  });

  it("should disable the send email button when clicked once", async () => {
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const button = screen.getByRole("button", { name: /send/i });
    const user = userEvent.setup();

    await user.type(emailInput, "test@example.com");
    await user.click(button);

    expect(button).toBeDisabled();
  });

});
