// variables used in multiple listings
const USER_ID = "userID";
const COURSE_CODE = "courseCode";
const IMAGE_URL = "imageUrl"

// Firestore Constants
// Ensure that classes that store fields match 

// points to where collection is located on database
export class fb_location {
    static listings = "listings";
    static pins = "pins";
    static users = "users";
    static wishlist = "wishlist";
}


// field names for listings documents
// Variable objects must match INTERFACE, eg static authors = "authors" therefor authors: string
export class listings_field {
    static authors = "authors";
    static courseCode = COURSE_CODE;
    static description = "description";
    static title = "title";
    static userID = USER_ID;
    // optional
    static listingID = "listingID";
    static imageUrl = IMAGE_URL;
    static enquired = "enquired";
    static pinned = "pinned";
}

export interface listingData{
   
  authors: string; 
  courseCode: string; 
  description: string; 
  title: string; 
  userID: string; 
  // optional
  listingID?: string | null;
  imageUrl?: string | null ; 
  enquired?: string[] | null; 
  pinned?: string[] | null;
}
// export type Listing = Omit<typeof ListingsField, 'prototype'>; // replaces type.ts

// field names for users documents
export class users_field {
    static degree = "degree";
    static email = "email";
    static joinDate = "joinDate";
    static lastLoggedIn = "lastLoggedIn";
    
    static username = "username";
    static overallRating = "overallRating";
    
    static totalDonations = "totalDonations";
    static totalRatingsReceived = "totalRatingsReceived";
    static university = "university";
    static userID = USER_ID;
    // optional
    static location = "location";
    static imageUrl = IMAGE_URL;
    static wishlist = "wishlist";
}

export interface ProfileData{
    email: string;
    joinDate: string;
    lastLoggedIn: string;
    username: string;
    overallRating: number;
    totalDonations: number;
    totalRatingsReceived: number;
    userID: string;
    // optional 
    degree?: string;
    location?: string;
    imageUrl?: string;
    university?: string;
    wishlist?: string[]
}
// export type ProfileData = Omit<typeof users_field, 'prototype'>; // replaces type.ts, currently not in use as does not allow you to define variables as anything other than string
