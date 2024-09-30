import { ProfileData } from "./types"; // Assuming Profile type is defined in types.ts
import image from "../assets/default-image-path.jpg";

const testProfile: ProfileData = {
  username: "Chelsea Smith",
  email: "chelsmith1999@gmail.com",
  imageUrl: image,
  university: "University of Auckland",
  degree: "Bachelor of Arts",
  location: "Ponsonby",
  // joinDate: new Date("2019-11-21"), // Date object for joinDate
  // lastLoggedIn: new Date("2022-03-03"), // Date object for lastLoggedIn
  // Use string object instead, as firebase stores the dates as a string
  joinDate: "2019-11-21", 
  lastLoggedIn: "2022-03-03", // Date object for lastLoggedIn
  totalDonations: 2,
  totalRatingsReceived: 2,
  overallRating: 100
};

export default testProfile;
