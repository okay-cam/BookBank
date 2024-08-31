// stores donor and listing info
export interface Profile {
    name: string;
    degree: string;
    email: string
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