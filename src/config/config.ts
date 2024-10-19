import { Timestamp } from "firebase/firestore";

// variables used in multiple listings
const USER_ID = "userID";
const COURSE_CODE = "courseCode";
const IMAGE_URL = "imageUrl"
const IMAGE_FILENAME = "imageFilename"

// Firestore Constants
// Ensure that classes that store fields match 

// points to where collection is located on database
export class fb_location {
    static listings = "listings";
    static users = "users";
    static wishlist = "wishlist";
    static reports = "reports";
}


// field names for listings documents
// Variable objects must match INTERFACE, eg static authors = "authors" therefor authors: string
export class listings_field {
    static authors = "authors";
    static courseCode = COURSE_CODE;
    static description = "description";
    static title = "title";
    static userID = USER_ID;
    static date = "date";
    // optional
    static listingID = "listingID";
    static imageUrl = IMAGE_URL;
    static imageFilename = IMAGE_FILENAME;
    static enquired = "enquired";
    static pinned = "pinned";
}

export interface listingData{   
    authors: string; 
    courseCode: string; 
    description: string; 
    title: string; 
    userID: string; 
    date: Timestamp;
    // optional
    comments?: Map<string, string> | null;
    listingID?: string | null;
    imageUrl?: string | null ;
    imageFilename?: string | null; 
    enquired?: string[] | null; 
    pinned?: string[] | null;
}
// export type Listing = Omit<typeof ListingsField, 'prototype'>; // replaces type.ts, currently not in use as does not allow you to define variables as anything other than string

// field names for users documents
export class users_field {
    static email = "email";
    static joinDate = "joinDate";
    static lastLoggedIn = "lastLoggedIn";
    static username = "username";
    static overallRating = "overallRating";
    static totalDonations = "totalDonations";
    static totalRatingsReceived = "totalRatingsReceived";
    // optional
    static comments = "comments";
    static degree = "degree";
    static location = "location";
    static imageUrl = IMAGE_URL;
    static imageFilename = IMAGE_FILENAME;
    static university = "university";
    static userID = USER_ID;
    static wishlist = "wishlist";
}

export interface ProfileData{
    email: string;
    joinDate: string;
    lastLoggedIn: string;
    username: string;
    totalDonations: number;
    
    // optional 
    comments?: commentsData[];
    degree?: string;
    location?: string;
    imageUrl?: string | null; // allow null for easier handling
    imageFilename?: string | null; // allow null for easier handling
    university?: string;
    userID?: string;
    wishlist?: string[];
}
// export type ProfileData = Omit<typeof users_field, 'prototype'>; // replaces type.ts, currently not in use as does not allow you to define variables as anything other than string

// Likely merge artifact --- commented just in case
/* export class wishlists_field {
    static users = "users";
}

export interface wishlistData {
    users: string[];
} */

// field names for users documents
export class reports_field {
    static issue = "issue";
    static submitterInfo = "submitterInfo";
    static reportedProfileInfo = "reportedProfileInfo";
    static reportedListingInfo = "reportedListingInfo";
}

export type ReportsData = Omit<typeof reports_field, 'prototype'>; // replaces type.ts

// field names for comments
export class comments_fields{
    static senderUID = "senderUID";
    static senderName = "senderName";
    static profilePicUrl = "profilePicUrl";
    static message: "message";
    static date: "date";
}

export interface commentsData{
    senderUID: string;
    senderName: string;
    profilePicUrl: string;
    message: string;
    date: Timestamp;
}
