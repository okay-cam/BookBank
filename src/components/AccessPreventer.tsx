import React, { useEffect } from "react";
import { useAuth } from "../contexts/auth_context";
import { useNavigate } from "react-router-dom";

// Go to login page when not signed in
const ForceLogin = () => {

	const { userLoggedIn } = useAuth();
	
	const navigate = useNavigate();

	useEffect(() => {
		if (userLoggedIn) {
			navigate("/home", { replace: true });
		}
	}, [userLoggedIn, navigate]);

}


export { ForceLogin }
