import { Listing } from "./types"; // Assuming Listing type is defined in types.ts
import image from "../assets/default-image-path.jpg"

const testListings: Listing[] = [
  {
    id: 1,
    title: "Introduction to Quantum Physics",
    author: "Richard Feynman",
    courseCode: "PHY301",
    description: "An in-depth look into quantum mechanics and its applications.",
    donor: {
      name: "Alice Johnson",
      degree: "PhD in Physics",
      email: "idk@gmail.com"
    },
    image: image,
  },
  {
    id: 2,
    title: "Advanced Calculus",
    author: "Michael Spivak",
    courseCode: "MATH401",
    description: "Comprehensive coverage of calculus concepts for advanced students.",
    donor: {
      name: "Bob Smith",
      degree: "MSc in Mathematics",
      email: "idk@gmail.com"
    },
    image: image,
  },
  {
    id: 3,
    title: "Organic Chemistry: Structure and Function",
    author: "K. Peter C. Vollhardt",
    courseCode: "CHEM202",
    description: "Detailed exploration of organic chemistry and its molecular structure.",
    donor: {
      name: "Carol Lee",
      degree: "BSc in Chemistry",
      email: "idk@gmail.com"
    },
    image: image,
  },
  {
    id: 4,
    title: "Modern World History",
    author: "Eric Hobsbawm",
    courseCode: "HIST150",
    description: "A comprehensive guide to the events that shaped the modern world.",
    donor: {
      name: "David Nguyen",
      degree: "BA in History",
      email: "idk@gmail.com"
    },
    image: image,
  },
  {
    id: 5,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    courseCode: "CS200",
    description: "A fundamental textbook for learning algorithms and data structures.",
    donor: {
      name: "Eve Larson",
      degree: "MSc in Computer Science",
      email: "idk@gmail.com"
    },
    image: image,
  },
  {
    id: 6,
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    courseCode: "ECON101",
    description: "An introductory text on micro and macroeconomics.",
    donor: {
      name: "Frank Thompson",
      degree: "MBA in Finance",
      email: "idk@gmail.com"
    },
    image: image,
  },
  {
    id: 7,
    title: "Introduction to Philosophy",
    author: "John Perry",
    courseCode: "PHIL101",
    description: "An overview of key philosophical ideas and thinkers.",
    donor: {
      name: "Grace Kim",
      degree: "BA in Philosophy",
      email: "idk@gmail.com"
    },
    image: image,
  },
  {
    id: 8,
    title: "test",
    author: "test",
    courseCode: "test",
    description: "test",
    donor: {
      name: "test",
      degree: "test",
      email: "test"
    },
    image: image,
  },
  {
    id: 9,
    title: "test",
    author: "test",
    courseCode: "test",
    description: "test",
    donor: {
      name: "test",
      degree: "test",
      email: "test"
    },
    image: image,
  },
  {
    id: 10,
    title: "test",
    author: "test",
    courseCode: "test",
    description: "test",
    donor: {
      name: "test",
      degree: "test",
      email: "test"
    },
    image: image,
  },
  {
    id: 11,
    title: "test",
    author: "test",
    courseCode: "test",
    description: "test",
    donor: {
      name: "test",
      degree: "test",
      email: "test"
    },
    image: image,
  },
  {
    id: 12,
    title: "test",
    author: "test",
    courseCode: "test",
    description: "test",
    donor: {
      name: "test",
      degree: "test",
      email: "test"
    },
    image: image,
  }
];

export default testListings;
