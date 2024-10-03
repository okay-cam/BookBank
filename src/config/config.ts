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
    static pins = "pins";
    static users = "users";
    static wishlist = "wishlist";
    static reports = "reports";
}


// field names for listings documents
export class listings_field {
    static id = "listingId";
    static authors = "authors";
    static courseCode = COURSE_CODE;
    static description = "description";
    static imageUrl = IMAGE_URL;
    static imageFilename = IMAGE_FILENAME;
    static title = "title";
    static userID = USER_ID;
    static enquired = "enquired";
}
export type Listing = Omit<typeof listings_field, 'prototype'>; // replaces type.ts

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
    static imageFilename = IMAGE_FILENAME;
    static totalDonations = "totalDonations";
    static totalRatingsRecieved = "totalRatingsRecieved";
    static university = "university";
    static userID = USER_ID;
}
export type ProfileData = Omit<typeof users_field, 'prototype'>; // replaces type.ts

// field names for users documents
export class reports_field {
    static issue = "issue";
    static submitterInfo = "submitterInfo";
    static reportedProfileInfo = "reportedProfileInfo";
    static reportedListingInfo = "reportedListingInfo";
}
export type ReportsData = Omit<typeof reports_field, 'prototype'>; // replaces type.ts