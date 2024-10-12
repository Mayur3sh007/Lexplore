import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserProgress } from "@/components/user-progress";
import { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

// Simulated data
const userProgress = {
  activeCourse: {
    title: "Spanish", // Course title
    imageSrc: "/path/to/spanish-image.svg" // Replace with the actual image path
  },
  hearts: 3,
  points: 150,
};

const userSubscription = {
  isActive: false,
};

const leaderboard = [
  { userId: 1, userName: "Alice", userImageSrc: "/images/alice.jpg", points: 300 },
  { userId: 2, userName: "Bob", userImageSrc: "/images/bob.jpg", points: 250 },
  { userId: 3, userName: "Charlie", userImageSrc: "/images/charlie.jpg", points: 200 },
  { userId: 4, userName: "David", userImageSrc: "/images/david.jpg", points: 150 },
  // Add more users as needed
];

export const metadata: Metadata = {
  title: "Lingo | Leaderboard",
  description: "See where you stand among other learners in the community.",
};

const LeaderBoardPage = () => {
  // Check if the user has an active course
  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse} // Pass the object
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
        {!isPro && <Promo />}
        <Quests points={userProgress.points} />
      </StickyWrapper>
      <FeedWrapper>
        <div className="flex w-full flex-col items-center">
          <Image
            src="/leaderboard.svg"
            alt="leaderboard"
            height={90}
            width={90}
          />
          <h1 className="my-6 text-center text-2xl font-bold text-neutral-800">
            Leaderboard
          </h1>
          <p className="mb-6 text-center text-lg text-muted-foreground">
            See where you stand among other learners in the community.
          </p>
          <Separator className="mb-4 h-0.5 rounded-full" />
          {leaderboard.map((userProgress, index) => (
            <div
              className="flex w-full items-center rounded-xl p-2 px-4 hover:bg-gray-200/50"
              key={userProgress.userId}
            >
              <p className="mr-4 font-bold text-lime-700">{index + 1}</p>
              <Avatar className="ml-3 mr-6 h-12 w-12 border bg-green-500">
                <AvatarImage src={userProgress.userImageSrc} />
              </Avatar>
              <p className="flex-1 font-bold text-neutral-800">
                {userProgress.userName}
              </p>
              <p className="text-muted-foreground">{userProgress.points} XP</p>
            </div>
          ))}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default LeaderBoardPage;
