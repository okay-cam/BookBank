import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

// this layout class will allow the navbar to be rendered only once and seperately from other pages
const Layout = () => {
  return (
    <>
      <Navbar />

      <main>
        {/* outlet displays pages while navbar stays untouched */}
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
