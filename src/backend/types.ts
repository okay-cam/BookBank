// stores donor and listing info
export interface Profile {
    name: string;
    email: string;
    profilePic: string;
    university: string;
    degree: string;
    location: string;
    joinDate: Date;
    lastLoggedIn: Date;
    totalDonations: number;
    numRatings: number;
    overallRating: number;
    // Add other profile details as needed
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