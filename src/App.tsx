import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// importing bootstrap must be done before importing CSS files
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/general.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import PasswordEmailSent from "./pages/PasswordEmailSent";
import Home from "./pages/Home";
import Layout from "./Layout";
import Listing from "./pages/Listing";
import Error404 from "./pages/Error404";
import CreateListing from "./pages/CreateListing";
import Pins from "./pages/Pins";
import Profile from "./pages/Profile";
import EditAccount from "./pages/EditAccount";
import Search from "./pages/Search";

import { AuthProvider } from "./contexts/auth_context";
import { ForcePages } from "./components/AccessPreventer"
import ScrollToTop from "./components/ScrollToTop";

const App = () => {

  // location logger used for debugging
  // (commented out)
  const LocationLogger = () => {

    const location = useLocation();

    React.useEffect(() => {
      console.log("Current page:", location.pathname);
    }, [location]);

    return null;

  }

  const [loading, setLoading] = useState<boolean>(true);


  return (
    <>
      <AuthProvider>
      <BrowserRouter>
        {/* <LocationLogger /> */}
        <ScrollToTop />
        <ForcePages setLoading={setLoading}/>
        {
          loading ? (
          <div className="spinner-border text-dark" role="status">
            <span className="sr-only"></span>
          </div>
          ) : (
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/password-email-sent" element={<PasswordEmailSent />} />
            <Route path="/home" element={<Home />} />
            <Route path="/listing/:id" element={<Listing />} />
            <Route path="/create" element={<CreateListing />} />
            <Route path="/pins" element={<Pins />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/edit-account" element={<EditAccount />}/>
            <Route path="/search" element={<Search />}/>
            <Route path="*" element={<Error404 />} />
          </Route>
        </Routes>
        )}
      </BrowserRouter>
      </AuthProvider>
    </>
  );
};

export default App;
