import React, { useEffect } from "react";
import { useAuth } from "../contexts/auth_context";
import { useNavigate, useLocation } from "react-router-dom";

// Define the props interface
interface ForcePagesProps {
	setLoading: (loading: boolean) => void;
}

// Force pages depending on login state and current page
const ForcePages: React.FC<ForcePagesProps> = ({ setLoading }) => {

	const { userLoggedIn } = useAuth();
	
	const navigate = useNavigate();
	const location = useLocation();
	
	const authPages = ["/", "/signup", "/resetpassword"];

	useEffect(() => {
		// go to login page when attempting to reach a non-auth page while signed out
		if ( !userLoggedIn && !authPages.includes(location.pathname) ) {
			navigate("/", { replace: true });
			return;
		}
		if ( userLoggedIn && authPages.includes(location.pathname) ) {
			navigate("/home", { replace: true });
			return;
		}
		setLoading(false);
	}, [userLoggedIn, navigate, location.pathname, setLoading]);
	
	return null;
}


export { ForcePages }
