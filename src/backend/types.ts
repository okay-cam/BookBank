// Structure of profile data (!! subject to change)
// auth data (UID, email, sign in & account creation dates) are stores in the auth, not the profile
export interface ProfileDetails {
  name: string;
  location: string;
  university: string;
  degree: string;
  rating: number;
  totalRatingsReceived: number;
  totalDonations: number;
}
  
export interface Listing {
    id: number;
    title: string;
    authors: string;
    courseCode: string;
    description: string;
    imageUrl: string;
    userID: string;
  }


