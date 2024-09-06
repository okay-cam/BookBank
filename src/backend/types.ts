// stores donor and listing info
export interface ProfileData {
    name: string;
    // from auth, set on sign-in
    email: string;
    profilePic: string;
    university: string;
    degree: string;
    location: string;
    // from auth, set on sign-in
    joinDate: Date;
    // from auth, updated on login
    lastLoggedIn: Date;
    totalDonations: number;
    totalRatingsReceived: number;
    overallRating: number;
    // Add other profile details as needed
  }

// // Structure of profile data (!! subject to change)
// // auth data (UID, email, sign in & account creation dates) are stores in the auth, not the profile
// export interface ProfileDetails {
//   name: string;
//   location: string;
//   university: string;
//   degree: string;
//   rating: number;
//   totalRatingsReceived: number;
//   totalDonations: number;
// }
  
export interface Listing {
    id: string;
    title: string;
    authors: string;
    courseCode: string;
    description: string;
    imageUrl: string;
    userID: string;
    modalId: string; // to display the correct enquiry popup when request button is pressed
  }


