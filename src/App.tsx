import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Layout from "./Layout";
import Listing from "./pages/Listing";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            {/* Assigning routes to different pages, login is default */}
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/listing" element={<Listing />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
