// stores donor and listing info
export interface Profile {
    name: string;
    degree: string;
    email: string
    // Add other profile details as needed
  }
  
  export interface Listing {
    title: string;
    author: string;
    courseCode: string;
    description: string;
    image: string;
    donor: Profile;
  }