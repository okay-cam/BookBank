import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
// import { useAuth } from "../contexts/auth_context";
import { ForcePages } from "./components/AccessPreventer"
import ScrollToTop from "./components/ScrollToTop";

const App = () => {

  // location logger used for debugging
  const LocationLogger = () => {

    const location = useLocation();

    React.useEffect(() => {
      console.log("Current page:", location.pathname);
    }, [location]);

    return null;

  }

  const [loading, setLoading] = useState<boolean>(true);

  // TODO: add code to redirect users to login page when signed out

  // TODO: add code to redirect users to home page when signed in & attempting to reach login/register page

  return (
    <>
      <AuthProvider>
      <BrowserRouter>
        <LocationLogger />
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
            <Route path="/home" element={<Home />} />
            <Route path="/listing/:id" element={<Listing />} />
            <Route path="/create" element={<CreateListing />} />
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
