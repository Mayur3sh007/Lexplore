"use client";
import { useState } from "react"; // Import useState
import { useRouter } from "next/navigation"; // Import useRouter
import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Header } from "@/app/(main)/learn/_components/header";
import { UserProgress } from "@/components/user-progress";
import { Unit } from "./_components/units"; // Ensure this path is correct
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";

// Simulated Data
const userProgress = {
  activeCourse: {
    title: "French",  // Course title
    imageSrc: "/france.png" // Replace with the actual image path
  },
  hearts: 3,
  points: 150,
};

const courseProgress = {
  activeLesson: 2,
};

// Adjust lessonPercentage to match the expected structure
const lessonPercentage: Record<number, number> = {
  1: 100,
  2: 99,
  3: 93,
};

// Updated units with all lessons marked as completed
const units = [
  {
    id: 1,
    order: 1,
    description: "Learn the basics of Grammar.",
    title: "Grammar",
    lessons: [
      { id: 1, title: "Lesson 1", description: "Introduction to Grammar", completed: true, percentage: 100 },
      { id: 2, title: "Lesson 2", description: "Basic Sentence Structure", completed: true, percentage: 100 },
      { id: 3, title: "Lesson 3", description: "Punctuation", completed: true, percentage: 100 },
    ],
  },
  {
    id: 2,
    order: 2,
    description: "Expand your Vocabulary.",
    title: "Vocabulary",
    lessons: [
      { id: 7, title: "Lesson 1", description: "Basic Vocabulary", completed: true, percentage: 100 },
      { id: 8, title: "Lesson 2", description: "Themed Vocabulary", completed: true, percentage: 100 },
      { id: 9, title: "Lesson 3", description: "Advanced Vocabulary", completed: true, percentage: 100 },
    ],
  },
  {
    id: 3,
    order: 3,
    description: "Explore common Expressions.",
    title: "Expressions",
    lessons: [
      { id: 4, title: "Lesson 1", description: "Everyday Expressions", completed: true, percentage: 100 },
      { id: 5, title: "Lesson 2", description: "Formal Expressions", completed: true, percentage: 100 },
      { id: 6, title: "Lesson 3", description: "Idiomatic Expressions", completed: true, percentage: 100 },
    ],
  },
  {
    id: 4,
    order: 4,
    description: "Learn common Greetings.",
    title: "Greetings",
    lessons: [
      { id: 10, title: "Lesson 1", description: "Basic Greetings", completed: true, percentage: 100 },
      { id: 11, title: "Lesson 2", description: "Polite Greetings", completed: true, percentage: 100 },
      { id: 12, title: "Lesson 3", description: "Cultural Greetings", completed: true, percentage: 100 },
    ],
  },
  {
    id: 5,
    order: 5,
    description: "Engage in various Activities.",
    title: "Activities",
    lessons: [
      { id: 13, title: "Lesson 1", description: "Fun Activities", completed: true, percentage: 100 },
      { id: 14, title: "Lesson 2", description: "Group Activities", completed: true, percentage: 100 },
      { id: 15, title: "Lesson 3", description: "Solo Activities", completed: true, percentage: 100 },
    ],
  },
];

const userSubscription = {
  isActive: true,
};

const LearnPage = () => {
  const router = useRouter(); // Use the router for navigation
  // State to manage the selected unit
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  // Check if the user has an active course
  if (!userProgress || !userProgress.activeCourse || !courseProgress) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;
  const activeLessonId = courseProgress.activeLesson; // Changed to activeLessonId

  // Function to handle unit selection and redirect
  const handleUnitClick = (title: string) => {
    // Redirect to the lesson page with the unit title
    router.push(`/lesson?title=${encodeURIComponent(title)}`);
  };

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse} // Pass the complete object
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
        {!isPro && <Promo />}
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {units.map((unit) => (
          <div key={unit.id} className="mb-10">
            <Unit
              id={unit.id}
              order={unit.order}
              description={unit.description}
              title={unit.title}
              lessons={unit.lessons} // Ensure lessons include completed property
              activeLessonId={activeLessonId} // Use activeLessonId instead of activeLesson
              activeLessonPercentage={lessonPercentage[activeLessonId]} // This should now work without errors
              onClick={() => handleUnitClick(unit.title)} // Handle unit click
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;
