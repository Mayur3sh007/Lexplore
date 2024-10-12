

import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";

import Image from "next/image";

import React from "react";
import { Items } from "./items";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lingo | Shop",
  description: "Spend your points on cool stuff.",
};

// Simulated user progress data for demo purposes
const userProgress = {
  activeCourse: { 
    title: "Spanish",  // Change activeCourse to be an object
    imageSrc: "/path/to/spanish-image.svg" // Add the appropriate image source
  },
  hearts: 3,
  points: 150,
};

// Simulated user subscription data for demo purposes
const userSubscription = {
  isActive: false,
};

const ShopPage = () => {
  const isPro = !!userSubscription.isActive; // Check if user has an active subscription

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
        <div className="flex w-full flex-col items-center">
          <Image src="/shop.svg" alt="shop" height={90} width={90} />
          <h1 className="my-6 text-center text-2xl font-bold text-neutral-800">
            Shop
          </h1>
          <p className="mb-6 text-center text-lg text-muted-foreground">
            Spend your points on cool stuff.
          </p>
          <Items
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={isPro}
          />
        </div>
      </FeedWrapper>
    </div>
  );
};

export default ShopPage;
