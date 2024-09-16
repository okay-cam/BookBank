import Banner from "../components/Banner";
import styles from "../styles/home.module.css";
import CardContainer from "../components/CardContainer";
import { useListings } from "../backend/readData";

const Home = () => {
  const { listings, loading, error } = useListings();

  return (
    <main className={styles.gridContainer}>
      <div className={styles.bannerSection}>
        <Banner />
      </div>
      <div className={styles.listingsSection}>
        <h1>Current listings</h1>
        <br />
        {
          loading ? (
              <div className="spinner-border text-dark" role="status">
                <span className="sr-only"></span>
              </div>
            ) : (
              // Pass the listings from state
              <CardContainer listings={listings} />
          )}
      </div>
    </main>
  );
};

export default Home;
