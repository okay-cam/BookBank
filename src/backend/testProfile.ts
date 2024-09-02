import { Profile } from "./types"; // Assuming Profile type is defined in types.ts
import image from "../assets/default-image-path.jpg";

const testProfile: Profile = {
  name: "Chelsea Smith",
  email: "chelsmith1999@gmail.com",
  profilePic: image,
  university: "University of Auckland",
  degree: "Bachelor of Arts",
  location: "Ponsonby",
  joinDate: new Date("2019-11-21"), // Date object for joinDate
  lastLoggedIn: new Date("2022-03-03"), // Date object for lastLoggedIn
  totalDonations: 2,
  numRatings: 2,
  overallRating: 100
};

export default testProfile;
