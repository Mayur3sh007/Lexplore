import { redirect } from "next/navigation";

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Header } from "@/app/(main)/learn/_components/header";
import { UserProgress } from "@/components/user-progress";
import { Unit } from "./_components/units"; // Ensure this path is correct
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { Metadata } from "next";

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
  1: 75,
  2: 50,
  3: 30,
};

// Updated units with completed property for lessons
const units = [
  {
    id: 1,
    order: 1,
    description: "Introduction to Spanish",
    title: "Unit 1",
    lessons: [
      { id: 1, title: "Lesson 1", description: "Basics", completed: true, percentage: 100 },
      { id: 2, title: "Lesson 2", description: "Greetings", completed: false, percentage: 50 },
    ],
  },
  {
    id: 2,
    order: 2,
    description: "Advanced Topics in Spanish",
    title: "Unit 2",
    lessons: [
      { id: 3, title: "Lesson 1", description: "Verbs", completed: false, percentage: 0 },
      { id: 4, title: "Lesson 2", description: "Vocabulary", completed: false, percentage: 0 },
    ],
  },
  // Add more units as necessary
];

const userSubscription = {
  isActive: false,
};

export const metadata: Metadata = {
  title: "Lingo | Learn",
  description:
    "Learn a new language with Lingo. Choose from a variety of languages and start learning today.",
};

const LearnPage = () => {
  // Check if the user has an active course
  if (!userProgress || !userProgress.activeCourse || !courseProgress) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;
  const activeLessonId = courseProgress.activeLesson; // Changed to activeLessonId

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
              lessons={unit.lessons} // Make sure lessons include completed property
              activeLessonId={activeLessonId} // Use activeLessonId instead of activeLesson
              activeLessonPercentage={lessonPercentage[activeLessonId]} // This should now work without errors
            />
          </div>
        ))}
      </FeedWrapper>
    </div>
  );
};

export default LearnPage;