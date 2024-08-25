import { Listing } from "./types"; // Assuming Listing type is defined in types.ts
import image from "../assets/default-image-path.jpg"

const testListings: Listing[] = [
  {
    title: "Introduction to Quantum Physics",
    author: "Richard Feynman",
    courseCode: "PHY301",
    description: "An in-depth look into quantum mechanics and its applications.",
    donor: {
      name: "Alice Johnson",
      degree: "PhD in Physics",
      email: "idk@gmail.com"
      // Add other profile details as needed
    },
    image: image,
  },
  {
    title: "Advanced Calculus",
    author: "Michael Spivak",
    courseCode: "MATH401",
    description: "Comprehensive coverage of calculus concepts for advanced students.",
    donor: {
      name: "Bob Smith",
      degree: "MSc in Mathematics",
      email: "idk@gmail.com"

      // Add other profile details as needed
    },
    image: image,
  },
  {
    title: "Organic Chemistry: Structure and Function",
    author: "K. Peter C. Vollhardt",
    courseCode: "CHEM202",
    description: "Detailed exploration of organic chemistry and its molecular structure.",
    donor: {
      name: "Carol Lee",
      degree: "BSc in Chemistry",
      email: "idk@gmail.com"

      // Add other profile details as needed
    },
    image: image,
  },
  {
    title: "Modern World History",
    author: "Eric Hobsbawm",
    courseCode: "HIST150",
    description: "A comprehensive guide to the events that shaped the modern world.",
    donor: {
      name: "David Nguyen",
      degree: "BA in History",
      email: "idk@gmail.com"

      // Add other profile details as needed
    },
    image: image,
  },
];

export default testListings;
