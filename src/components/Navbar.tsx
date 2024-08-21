import React from "react";
import "../styles/general.css";
import styles from "../styles/navbar.module.css";

// used for signing out - may be moved later
import { useNavigate } from 'react-router-dom'
import { doSignOut } from '../config/auth'
import { useAuth } from '../contexts/auth_context'

const Navbar = () => {

  const navigate = useNavigate()
  const { userLoggedIn } = useAuth();

  return (
  <>
    <div className={styles.navbar}> Navbar
      {/* Added temp code for testing signout functionality -Cam */}
      <br></br>
      {
        userLoggedIn &&
        <>
          <button onClick={() => { doSignOut().then(() => { navigate('/') }) }}>Logout</button>
        </>
      }
    </div>
  </>
  ) 
};

export default Navbar;
