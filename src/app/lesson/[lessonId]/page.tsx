// In LessonIdPage.tsx
import { Quiz } from "../_components/quiz"; // Import the Quiz component

// Define the Lesson type
type Lesson = {
  id: number; // Lesson ID
  challenges: {
    type: "ASSIST" | "SELECT";
    id: number; // Challenge ID
    question: string; // Challenge question
    completed: boolean; // Completion status
    challengeOptions: { id: number; text: string; correct: boolean }[]; // Challenge options
  }[]; // Array of challenges
};

// Define the UserProgress type
type UserProgress = {
  hearts: number; // Number of hearts
};

// Define the UserSubscription type
type UserSubscription = {
  isActive: boolean; // Subscription status
};

// Define the LessonIdPage component
const LessonIdPage = () => {
  // Example static lesson data
  const lesson: Lesson = {
    id: 1,
    challenges: [
      {
        type: "ASSIST",
        id: 1,
        question: "What is the capital of France?",
        completed: false,
        challengeOptions: [
          { id: 1, text: "Paris", correct: true },
          { id: 2, text: "London", correct: false },
          { id: 3, text: "Berlin", correct: false },
        ],
      },
      {
        type: "SELECT",
        id: 2,
        question: "What is 2 + 2?",
        completed: false,
        challengeOptions: [
          { id: 1, text: "3", correct: false },
          { id: 2, text: "4", correct: true },
          { id: 3, text: "5", correct: false },
        ],
      },
    ],
  };

  // Example static user progress data
  const userProgress: UserProgress = {
    hearts: 3, // User has 3 hearts
  };

  // Example static user subscription data
  const userSubscription: UserSubscription = {
    isActive: true, // User has an active subscription
  };

  // Calculate initial percentage based on completed challenges
  const initialPercentage =
    (lesson.challenges.filter((challenge) => challenge.completed).length /
      lesson.challenges.length) *
    100;

  // Return the Quiz component with the necessary props
  return (
    <Quiz
      initialLessonId={lesson.id} // Pass lesson ID
      initialLessonChallenges={lesson.challenges} // Pass challenges
      initialHearts={userProgress.hearts} // Pass hearts
      initialPercentage={initialPercentage} // Pass initial percentage
      userSubscription={userSubscription} // Pass user subscription
    />
  );
};

export default LessonIdPage;
