import styles from "../styles/pins.module.css";
import PinsCardContainer from "../components/PinsCardContainer";
import testListings from "../backend/testListings";

const Pins = () => {
  return (
    <>
      <div className={styles.listingsSection}>
        <h1 className={styles.pinsHeader}>Your current listings</h1>
        {testListings.length > 0 ? (
          <PinsCardContainer listings={testListings} />
        ) : (
          <p>You have no current listings</p>
        )}
      </div>

      <div className={styles.listingsSection}>
        <h1 className={styles.pinsHeader}>Your pinned listings</h1>
        {testListings.length > 0 ? (
          <PinsCardContainer listings={testListings} />
        ) : (
          <p>You have no pinned listings</p>
        )}
      </div>

      <div className={styles.listingsSection}>
        <h1 className={styles.pinsHeader}>Your watchlist</h1>
        {testListings.length > 0 ? (
          <PinsCardContainer listings={testListings} />
        ) : (
          <p>You have no watchlist items</p>
        )}
      </div>
    </>
  );
};

export default Pins;
