
import { Listing, ProfileData } from "../backend/types";
import { auth } from "../config/firebase";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";


export async function getListings(field?: string, value?: string): Promise<Listing[]>{ // field? allows for the values to be empty
  
  const listingsRef = collection(db, "listings");
  
  let q;
  if (field && value) {
    q = query(listingsRef, where(field, "==", value)); // Return all listings that match parameters
  } else {
    q = query(listingsRef); // Return all listings if no parameters are provided
  }

  const querySnapshot = await getDocs(q);
  const listings: Listing[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data() as Listing;
    const listing: Listing = {
        id: doc.id,
        title: data.title,
        authors: data.authors,
        courseCode: data.courseCode,
        description: data.description,
        imageUrl: data.imageUrl,
        userID: data.userID,
        modalId: "modal-"+doc.id
      };
      listings.push(listing);
    });
  console.log(listings);
  return listings;
}




// Function to fetch profile data
export async function getProfileData(userID: string): Promise<ProfileData | null> {
  try {
    const docRef = doc(db, "users", userID);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      console.log("UID: ", userID);
      const data = docSnapshot.data();
      
      // Assign values based on ProfileData interface and convert necessary types
      const profileData: ProfileData = {
        name: data.name,
        email: data.email,
        profilePic: data.profilePic,
        university: data.university,
        degree: data.degree,
        location: data.location,
        // joinDate: , 
        // lastLoggedIn: ,
        totalDonations: data.totalDonations,
        numRatings: data.numRatings,
        overallRating: data.overallRating,
        // Add other fields as needed
      };

      return profileData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching profile data: ", error);
    return null;
  }
}

export function checkListingOwner(listing: Listing): boolean {
  // Ensure auth.currentUser and the listing's userID exist
  if (auth.currentUser && listing.userID) {
    return auth.currentUser.uid === listing.userID;
  }
  return false;
}