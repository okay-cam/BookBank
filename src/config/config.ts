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
    static id = "listingId";
    static authors = "authors";
    static courseCode = COURSE_CODE;
    static description = "description";
    static imageUrl = IMAGE_URL;
    static title = "title";
    static userID = USER_ID;
    // optional
    static enquired = "enquired";
    static pinned = "pinned";
}

export interface Listing{
  listingId: string; 
  authors: string; 
  courseCode: string; 
  description: string; 
  imageUrl: string; 
  title: string; 
  userID: string; 
  // optional
  enquired?: string[]; 
  pinned?: string[];
}
// export type Listing = Omit<typeof ListingsField, 'prototype'>; // replaces type.ts

// field names for users documents
export class users_field {
    static degree = "degree";
    static email = "email";
    static joinDate = "joinDate";
    static lastLoggedIn = "lastLoggedIn";
    static location = "location";
    static username = "username";
    static overallRating = "overallRating";
    static imageUrl = IMAGE_URL;
    static totalDonations = "totalDonations";
    static totalRatingsRecieved = "totalRatingsRecieved";
    static university = "university";
    static userID = USER_ID;
}

export interface ProfileData{
    degree: string;
    email: string;
    joinDate: string;
    lastLoggedIn: string;
    location: string;
    username: string;
    overallRating: number;
    iamgeUrl?: string;
    totalDonations: number;
    totalRatingsRecieved: number;
    university: string;
    userID: string;
    wishlist?: string[]
}
// export type ProfileData = Omit<typeof users_field, 'prototype'>; // replaces type.ts, currently not in use as does not allow you to define variables as anything other than string
