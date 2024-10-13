import { List } from "./_components/list";
import { Metadata } from "next";

// Simulated data
const courses = [
  { id: 1, title: "Spanish", imageSrc: "/spain.png" },
  { id: 2, title: "French", imageSrc: "/france.png" },
  { id: 3, title: "Japanese", imageSrc: "/japan.png" },
  // Add more course objects as needed
];

const userProgress = {
  activeCourseId: 1, // Simulate an active course ID
};

export const metadata: Metadata = {
  title: "Lingo | Courses",
  description:
    "Learn a new language with Lingo. Choose from a variety of languages and start learning today.",
};

const CoursesPage = () => {
  return (
    <div className="mx-auto h-full max-w-[912px] px-3">
      <h1 className="text-2xl font-bold text-neutral-700">Language Courses</h1>
      <List courses={courses} activeCourseId={userProgress.activeCourseId} />
    </div>
  );
};

export default CoursesPage;

