import Banner from "../components/Banner";
import styles from "../styles/home.module.css";
import CardContainer from "../components/CardContainer";
import testListings from "../backend/testListings";

const Home = () => {
  return (
    <>
      <main className={styles.gridContainer}>
        <div className={styles.bannerSection}>
          <Banner />
        </div>
        <div className={styles.listingsSection}>
          <h1>Current listings</h1>
          <br />
          <CardContainer listings={testListings} />
        </div>
      </main>
    </>
  );
};

export default Home;
