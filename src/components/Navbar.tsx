import "../styles/general.css";
import React from "react";
import styles from "../styles/navbar.module.css";
import { Link } from "react-router-dom";

// used for signing out - may be moved later
import { useNavigate } from 'react-router-dom'
import { doSignOut } from '../config/auth'
import { useAuth } from '../contexts/auth_context'

const Navbar = () => {
  const navigate = useNavigate()
  const { userLoggedIn } = useAuth();

  return (
    <div className={styles.navbar}>
      {userLoggedIn ? ( // If the user is logged in, we should show the full navbar
        <>
          <Link to="/home" className={styles.logo}>BookBank</Link>

          <div className={styles.searchContainer}>
            <input type="text" className={styles.searchInput} placeholder="Search for books"/>
          </div>

          <div className={styles.navLinks}>
            <Link to="/pins" className={styles.navButton}>Pins</Link>
            <Link to="/create" className={styles.navButton}>Create a listing</Link>
            <Link to="/signup" className={styles.navButton}>Profile</Link>
            <button className={styles.navButton} onClick={() => {
              doSignOut().then(() => { navigate('/') }) }}>Logout</button>
          </div>
        </>
      ) : ( // If the user isn't logged in, we only show the BookBank logo
            // (which doesn't link to anything)
        <div className={styles.logo}>BookBank</div>
      )}
    </div>
  )
};

export default Navbar;
