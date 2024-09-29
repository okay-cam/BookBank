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
export class listings_field {
    static id = "listingId";
    static authors = "authors";
    static courseCode = COURSE_CODE;
    static description = "description";
    static imageUrl = IMAGE_URL;
    static title = "title";
    static userID = USER_ID;
    static enquired = "enquired";
}
export type Listing = keyof typeof listings_field; // replaces type.ts

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
export type ProfileData = keyof typeof users_field; // replaces type.ts
