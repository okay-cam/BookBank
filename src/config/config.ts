
// variables used in multiple listings
const USER_ID = "userId";
const COURSE_CODE = "courseCode";

// Firestore Constants

// points to where collection is located on database
export class collection_name {
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
    static imageUrl = "imageUrl";
    static title = "title";
    static userId = USER_ID;
    static enquired = "enquired";
}

// field names for users documents
export class users_field {
    static degree = "degree";
    static email = "email";
    static joinDate = "joinDate";
    static lastLoggedIn = "lastLoggedIn";
    static location = "location";
    static name = "name";
    static overallRating = "overallRating";
    static profilePic = "profilePic";
    static totalDonations = "totalDonations";
    static totalRatingsRecieved = "totalRatingsRecieved";
    static university = "university";
    static userId = USER_ID;
}
