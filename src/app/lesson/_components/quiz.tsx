// In Quiz.tsx
"use client"; // Indicate that this is a client-side component
import { useRouter } from "next/navigation";
import { useState } from "react"; // Import useState for managing local state
import { Header } from "./header"; // Import Header component
import { QuestionBubble } from "./question-bubble"; // Import QuestionBubble component
import { Challenge } from "./challenge"; // Import Challenge component
import { Footer } from "./footer"; // Import Footer component
import Image from "next/image"; // Import Next.js Image component
import { ResultCard } from "./result-card"; // Import ResultCard component
import Confetti from "react-confetti"; // Import Confetti for celebratory effects

type UserSubscription = {
  isActive: boolean; // Subscription status
};

type Props = {
  
  initialLessonId: number; 
  initialPercentage: number; // Initial progress percentage
  initialHearts: number; // Initial hearts count
  initialLessonChallenges: {
    id: number;
    question: string;
    completed: boolean;
    type: "SELECT"|"ASSIST";
    challengeOptions: { id: number; text: string; correct: boolean }[]; // Example option structure
  }[];
  
  userSubscription: UserSubscription; // Initial challenges for the lesson
};

export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonChallenges,
  
}: Props) => {
  const router = useRouter();
  const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");
  const [hearts, setHearts] = useState(initialHearts); // Manage hearts count
  const [percentage, setPercentage] = useState(initialPercentage); // Manage progress percentage
  const [activeIndex, setActiveIndex] = useState(0); // Manage the active challenge index
  const [selectedOption, setSelectedOption] = useState<number>(); // Track selected option

  const challenges = initialLessonChallenges; // Local challenges data
  const challenge = challenges[activeIndex]; // Get the current challenge
  const options = challenge?.challengeOptions ?? []; // Get options for the current challenge

  // Handle option selection
  const onSelect = (id: number) => {
    if (status !== "none") return;
    setSelectedOption(id); // Set selected option
  };

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  // Handle continuing to the next challenge
  const onContinue = () => {
    if (!selectedOption) return; // If no option is selected, exit

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((option) => option.correct); // Find the correct option
    
    if (!correctOption) return;
    
    if (correctOption?.id === selectedOption) {
      setStatus("correct");
    } else {
        setHearts((prev) => prev - 1);
        setStatus("wrong");
    }
  };

  if (!challenge) {
    // If there are no more challenges left
    return (
      <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8">
        <Image src="/finish.svg" alt="finish" height={100} width={100} />
        <h1 className="text-xl font-bold text-neutral-700 lg:text-3xl">
          Great Job! You've completed the lesson.
        </h1>
        <div className="flex w-full items-center gap-x-4">
          <ResultCard variant="points" value={challenges.length * 10} />
          <ResultCard variant="hearts" value={hearts} />
        </div>
        <Footer status="completed" onCheck={() => router.push("/learn")} />
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      </div>
    );
  }

  if (hearts == 0) {
    // If there are no more challenges left
    return (
      <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8">
        <Image src="/finish.svg" alt="finish" height={100} width={100} />
        <h1 className="text-xl font-bold text-neutral-700 lg:text-3xl">
          Hearts Over 💔
        </h1>
        <Footer status="completed" onCheck={() => console.log("Check")} />
      </div>
    );
  }

  return (
    <>
      <Header hearts={hearts} percentage={percentage} hasActiveSubscription={false} />
      <div className="flex-1">
        <div className="flex h-full items-center justify-center">
          <div className="flex w-full flex-col gap-y-2 px-6 lg:min-h-[350px] lg:w-[600px] lg:px-0">
            <h1 className="text-center text-lg font-bold text-neutral-700 lg:text-start lg:text-3xl">
              {challenge.question}
            </h1>
            <div>
              {challenge.type === "ASSIST" && (
                <QuestionBubble question={challenge.question} />
              )}
              <Challenge
                options={options}
                onSelect={onSelect}
                status={status} // Set status to "none" as placeholder
                selectedOption={selectedOption}
                disabled={false} // No loading state here
                type={challenge.type} // Use the challenge type
              />
            </div>
          </div>
        </div>
      </div>
      <Footer disabled={!selectedOption} status={status} onCheck={onContinue} />
    </>
  );
};
