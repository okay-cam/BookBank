import "../styles/general.css";
import styles from "../styles/navbar.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// used to get profile picture
import { getProfileData } from "../backend/readData";
import { auth } from "../config/firebase";

import defaultProfilePicture from "../assets/default-profile-path.jpg";

// used for signing out - may be moved later
import { doSignOut } from "../config/auth";
import { useAuth } from "../contexts/auth_context";
import { onAuthStateChanged } from "firebase/auth";
let rerender = true;
console.log("rendered navbar");
export function reloadProfilePic() {
  rerender = !rerender;
}

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userLoggedIn } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profilePictureSource, setProfilePictureSource] = useState<
    string | null
  >(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set userId when a user is signed in
      } else {
        setUserId(null); // Clear userId when no user is signed in
      }
    });
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // only navigate if searchQuery is not empty
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const fetchAndSetProfileData = async () => {
      if (auth.currentUser) {
        const data = await getProfileData(auth.currentUser.uid);
        if (data) {
          setProfilePictureSource(data.imageUrl || defaultProfilePicture);
        }
      }
    };

    fetchAndSetProfileData();
  }, [auth.currentUser, rerender]);

  // Close the profile dropdown when the route changes
  useEffect(() => {
    setDropdownOpen(false); // Close the dropdown whenever the route changes
  }, [location]); // Triggered whenever the location (route) changes

  return (
    <div className={styles.navbar}>
      {userLoggedIn ? ( // If the user is logged in, we should show the full navbar
        <>
          <Link to="/home" className={styles.logo}>
            BookBank
          </Link>

          <form
            className={styles.searchContainer}
            onSubmit={handleSearchSubmit}
          >
            <input
              type="text"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for books"
            />
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className={styles.searchButton}
            >
              Search
            </button>
          </form>

          <div className={styles.navLinks}>
            <Link to="/home" className={styles.navButton}>
              🏠 Home
            </Link>
            <Link to="/saved" className={styles.navButton}>
              ⭐ Saved listings
            </Link>
            <Link to="/create" className={styles.navButton}>
              📙 Create a listing
            </Link>
            <div className={styles.profileDropdown}>
              <img
                src={profilePictureSource || defaultProfilePicture}
                alt="Profile"
                className={styles.profilePic}
                draggable={false}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              ></img>
            </div>
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link
                  to={`/profile/${userId}`}
                  className={styles.dropdownButton}
                >
                  Profile page
                </Link>
                <Link to="/edit-account" className={styles.dropdownButton}>
                  Edit account
                </Link>
                <hr />
                <button
                  className={styles.dropdownButton}
                  onClick={() => {
                    doSignOut().then(() => {
                      navigate("/");
                    });
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        // If the user isn't logged in, we only show the BookBank logo
        // (which doesn't link to anything)
        <div className={styles.logo}>BookBank</div>
      )}
    </div>
  );
};

export default Navbar;
