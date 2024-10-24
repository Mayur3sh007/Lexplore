"use client";
import { useState, useEffect } from "react";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

// Simulated data for user progress
const simulatedUserProgress = {
  activeCourse: {
    title: "Spanish",
    imageSrc: "/images/french.png",
  },
  hearts: 3,
  points: 120,
};

// Simulated subscription data
const simulatedUserSubscription = {
  isActive: false,
};

// Updated quests with task descriptions and XP values
const updatedQuests = [
  { title: "Complete first lesson", value: 20 },
  { title: "Daily streak achieved", value: 50 },
  { title: "Complete 5 lessons", value: 100 },
  { title: "Practice vocabulary", value: 500 },
  { title: "Finish today's daily challenge", value: 1000 },
];

const QuestsPage = () => {
  const [userProgress, setUserProgress] = useState(simulatedUserProgress);
  const [completedQuests, setCompletedQuests] = useState<boolean[]>([]); // Track completed quests
  const userSubscription = simulatedUserSubscription;

  // Load completed quests from localStorage when the component mounts
  useEffect(() => {
    const savedCompletedQuests = localStorage.getItem("completedQuests");
    if (savedCompletedQuests) {
      setCompletedQuests(JSON.parse(savedCompletedQuests)); // Parse the saved state from localStorage
    } else {
      setCompletedQuests(Array(updatedQuests.length).fill(false)); // Initialize state if nothing is saved
    }
  }, []);

  // Save the completed quests to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("completedQuests", JSON.stringify(completedQuests));
  }, [completedQuests]);

  if (!userProgress || !userProgress.activeCourse) {
    console.warn("Redirecting to /courses due to missing user progress.");
    return null; // Prevent rendering
  }

  const isPro = !!userSubscription?.isActive;

  // Handler for checking a quest
  const handleQuestCompletion = (index: number, questValue: number) => {
    const newCompletedQuests = [...completedQuests];
    newCompletedQuests[index] = !newCompletedQuests[index]; // Toggle the quest completion status

    // Add or subtract points when quest is completed or uncompleted
    const pointsChange = newCompletedQuests[index] ? questValue : -questValue;

    setUserProgress((prev) => ({
      ...prev,
      points: prev.points + pointsChange,
    }));

    setCompletedQuests(newCompletedQuests); // Update the local state (and localStorage via useEffect)
  };

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
        {!isPro && <Promo />}
      </StickyWrapper>
      <FeedWrapper>
        <div className="flex w-full flex-col items-center">
          <Image src="/quests.svg" alt="quests" height={90} width={90} />
          <h1 className="my-6 text-center text-2xl font-bold text-neutral-800">Quests</h1>
          <p className="mb-6 text-center text-lg text-muted-foreground">
            Complete quests by earning points and checking them off.
          </p>
          {updatedQuests.map((quest, index) => {
            // Set progress to 0 when not completed, 100 when completed
            const progress = completedQuests[index] ? 100 : 0;

            return (
              <div key={quest.value} className="flex w-full flex-col gap-y-2 border-t-2 p-4">
                {/* Task row with description and points */}
                <div className="flex w-full justify-between items-center">
                  <div className="flex items-center gap-x-2">
                    {/* Disable the checkbox when the quest is completed (locked) */}
                    <input
                      type="checkbox"
                      checked={completedQuests[index]}
                      onChange={() => handleQuestCompletion(index, quest.value)}
                      disabled={completedQuests[index]} // Lock the checkbox when it's checked
                      className="h-5 w-5"
                    />
                    <p className={`text-xl font-bold ${completedQuests[index] ? "text-green-600" : "text-neutral-700"}`}>
                      {quest.title}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-orange-500">+{quest.value} XP</p> {/* Points Highlight */}
                </div>
                {/* Progress bar turns green when quest is completed */}
                <Progress
                  value={progress}
                  className={`h-3 ${completedQuests[index] ? "bg-green-600" : "bg-gray-300"}`}
                />
              </div>
            );
          })}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default QuestsPage;
