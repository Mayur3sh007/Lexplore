// Import necessary components
import { redirect } from "next/navigation";
import { Quiz } from "./_components/quiz";

// Define the types for the challenge
type ChallengeOption = {
  id: number;
  text: string;
  correct: boolean;
};

type Challenge = {
  id: number;
  question: string;
  completed: boolean;
  type: "SELECT" | "ASSIST"; // Explicitly define the type
  challengeOptions: ChallengeOption[];
};

// Mock data for demonstration purposes
const mockLesson = {
  id: 1, // Lesson ID
  challenges: [
    {
      id: 1,
      question: "What is the capital of France?", // Added question property
      completed: true,
      type: "SELECT", // This is explicitly set to "SELECT"
      challengeOptions: [ // Added challengeOptions property
        { id: 1, text: "Paris", correct: true },
        { id: 2, text: "London", correct: false },
        { id: 3, text: "Berlin", correct: false },
      ] as ChallengeOption[], // Ensure this is typed as ChallengeOption[]
    },
    {
      id: 2,
      question: "What is 2 + 2?", // Added question property
      completed: false,
      type: "ASSIST", // This is explicitly set to "ASSIST"
      challengeOptions: [ // Added challengeOptions property
        { id: 1, text: "3", correct: false },
        { id: 2, text: "4", correct: true },
        { id: 3, text: "5", correct: false },
      ] as ChallengeOption[], // Ensure this is typed as ChallengeOption[]
    },
    // Add more challenges as needed
  ] as Challenge[], // Ensure this is typed as Challenge[]
};

const mockUserProgress = {
  hearts: 3,
  // Add other user progress properties if needed
};

const mockUserSubscription = {
  isActive: false,
  // Add other subscription properties if needed
};

const LessonPage = async () => {
  // Simulating data fetching
  const lesson = mockLesson; // Replace with real data fetching later
  const userProgress = mockUserProgress; // Replace with real data fetching later
  const userSubscription = mockUserSubscription; // Replace with real data fetching later

  // Check if lesson and user progress exist, redirect if not
  if (!lesson || !userProgress) {
    redirect("/learn");
  }

  // Calculate the initial percentage based on completed challenges
  const initialPercentage =
    (lesson.challenges.filter((challenge) => challenge.completed).length /
      lesson.challenges.length) *
    100;

  // Render the Quiz component with the lesson and user data
  return (
    <Quiz
      initialLessonId={lesson.id} // This is now a number
      initialLessonChallenges={lesson.challenges} // This matches the expected structure
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={userSubscription}
    />
  );
};

export default LessonPage;
