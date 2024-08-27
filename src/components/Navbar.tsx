import "../styles/general.css";
import styles from "../styles/navbar.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";

// used for signing out - may be moved later
import { useNavigate } from 'react-router-dom'
import { doSignOut } from '../config/auth'
import { useAuth } from '../contexts/auth_context'
import defaultImage from "../assets/default-image-path.jpg";

const Navbar = () => {
  const navigate = useNavigate()
  const { userLoggedIn } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className={styles.navbar}>
      {userLoggedIn ? ( // If the user is logged in, we should show the full navbar
        <>
          <Link to="/home" className={styles.logo}>BookBank</Link>

          <div className={styles.searchContainer}>
            <input type="text" className={styles.searchInput} placeholder="Search for books" />
          </div>

          <div className={styles.navLinks}>
            <Link to="/pins" className={styles.navButton}>Pins</Link>
            <Link to="/create" className={styles.navButton}>Create a listing</Link>
            <div className={styles.profileDropdown}>
              <img src={defaultImage} alt="Profile" className={styles.profilePic} onClick={() => setDropdownOpen(!dropdownOpen)}></img>
            </div>
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link to="/profile" className={styles.dropdownButton}>Profile page</Link>
                <Link to="/edit-account" className={styles.dropdownButton}>Edit account</Link>
                <hr />
                <button className={styles.dropdownButton} onClick={() => {
                  doSignOut().then(() => { navigate('/') })
                }}>Logout</button>
              </div>
            )}
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
