import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// importing bootstrap must be done before importing CSS files
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/general.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Layout from "./Layout";
import Listing from "./pages/Listing";
import Error404 from "./pages/Error404";
import CreateListing from "./pages/CreateListing";
import { AuthProvider } from "./contexts/auth_context";

const App = () => {
  return (
    <>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Assigning routes to different pages, login is default */}
            <Route index element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/listing" element={<Listing />} />
            <Route path="*" element={<Error404 />} />
            <Route path="/create" element={<CreateListing />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </>
  );
};

export default App;
