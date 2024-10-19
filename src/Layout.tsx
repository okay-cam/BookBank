import React, { createContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const NavbarContext = createContext();

// this layout class will allow the navbar to be rendered only once and seperately from other pages
const Layout = () => {
  // State to be shared between Navbar and other components
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Navbar />

      <main>
        {/* outlet displays pages while navbar stays untouched */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
