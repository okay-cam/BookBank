import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import Navbar from "../../components/Navbar";

describe("Navbar", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    // Choose 3 minimum:
    // TODO: Test that the elements render correctly
    // TODO: Test that the dropdown pops up when the pfp is clicked
    // TODO: Test that the searchbar updates when typed in
    // TODO: Test that elements aren't visible when user isn't sign in

  });
});
