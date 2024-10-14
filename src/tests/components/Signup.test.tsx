import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import Signup from "../../pages/Signup";

describe("Navbar", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>
    );

    // Choose 3 minimum:
    // TODO: Test that the elements render correctly
    // TODO: Test that the fields update on user input
    // TODO: Test that an error message shows up when passwords don't match
  });
});
