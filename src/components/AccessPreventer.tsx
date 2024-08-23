import React, { useEffect } from "react";
import { useAuth } from "../contexts/auth_context";
import { useNavigate, useLocation } from "react-router-dom";

// Force pages depending on login state and current page
const ForcePages = () => {

	
}

// Go to login page when not signed in
const ForceLoginWhenSignedOut = () => {

	const { userLoggedIn } = useAuth();
	
	const navigate = useNavigate();
	const location = useLocation();
  
	useEffect(() => {
		// go to login page when attempting to reach a non-auth page while signed out
		if ( !userLoggedIn && location.pathname !== "/" && location.pathname !== "/signup" ) {
			navigate("/", { replace: true });
		}
	}, [userLoggedIn, navigate, location.pathname]);

	return null;
}


// Go to home page when signed in (from login/register page to )
const ForceHomeWhenSignedIn = () => {

	const { userLoggedIn } = useAuth();
	
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		// go to home after logging in or registering
		if ( userLoggedIn && (location.pathname === "/" || location.pathname === "/signup") ) {
			navigate("/home", { replace: true });
		}
	}, [userLoggedIn, navigate, location.pathname]);

	return null;
}


export { ForceLoginWhenSignedOut, ForceHomeWhenSignedIn }
