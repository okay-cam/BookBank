import { listings_field, users_field } from "../config/config";

export type profileData = keyof typeof users_field;
export type Listing = keyof typeof listings_field;

// stores donor and listing info
// export interface ProfileData {
//     userID: string
//     username: string;
//     email: string; // from auth, set on sign-in
//     imageUrl: string | null;
//     university: string | null;
//     degree: string | null;
//     location: string | null;
//     joinDate: string; // from auth, set on sign-in
//     lastLoggedIn: string; // from auth, updated on login
//     totalDonations: number;
//     totalRatingsReceived: number;
//     overallRating: number;
//     // Add other profile details as needed
//   }

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

// export interface Listing {
//     // Required:
//     title: string;
//     authors: string;
//     courseCode: string;
//     description: string;
//     userID: string; // stores the id of the user who created the listing
//     // Optional: 
//     id?: string;
//     imageUrl?: string;
//     modalId?: string; // to display the correct enquiry popup when request button is pressed
//     enquired?: string[] | null;
//   }

