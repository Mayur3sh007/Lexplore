import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { StickyWrapper } from "@/components/sticky-wrapper";

import { UserProgress } from "@/components/user-progress";
import { quests } from "@/constants"; // Assume quests is an array of quest objects
import Image from "next/image";
import { Progress } from "@/components/ui/progress"; // Ensure this import is correct

// Simulated data for user progress
const simulatedUserProgress = {
  activeCourse: { 
    title: "Spanish",  
    imageSrc: "/images/french.png" 
  },
  hearts: 3,
  points: 120,
};

// Simulated subscription data
const simulatedUserSubscription = {
  isActive: false,
};

export const metadata = {
  title: "Lingo | Quests",
  description: "Complete quests by earning points.",
};

const QuestsPage = () => {
  const userProgress = simulatedUserProgress; // Use simulated data directly
  const userSubscription = simulatedUserSubscription; // Use simulated data directly

  if (!userProgress || !userProgress.activeCourse) {
    console.warn("Redirecting to /courses due to missing user progress.");
    return null; // Prevent rendering
  }

  const isPro = !!userSubscription?.isActive;

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
          <p className="mb-6 text-center text-lg text-muted-foreground">Complete quests by earning points.</p>
          {quests.map((quest) => {
            const progress = quest.value > 0 ? (userProgress.points / quest.value) * 100 : 0; // Prevent division by zero
            return (
              <div key={quest.value} className="flex w-full items-center gap-x-4 border-t-2 p-4">
                <Image src="/points.svg" alt="point" height={60} width={60} />
                <div className="flex w-full flex-col gap-y-2">
                  <p className="text-xl font-bold text-neutral-700">{quest.title}</p>
                  <Progress value={progress} className="h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default QuestsPage;
