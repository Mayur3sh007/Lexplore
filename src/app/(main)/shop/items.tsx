"use client";


import { Button } from "@/components/ui/button";


import Image from "next/image";


type Props = {

  hearts: number;
  
  hasActiveSubscription: boolean;
  points: number;
};


export const Items = ({ hearts, hasActiveSubscription, points }: Props) => {

  return (
    <ul className="w-full">
      <div className="flex w-full items-center gap-x-4 border-t-2 p-4">
        <Image src="/heart.svg" alt="heart" width={60} height={60} />
        <div className="flex-1">
          <p className="text-base font-bold text-neutral-700 lg:text-xl">
            Refill hearts
          </p>
        </div>
        <Button disabled={hearts === 5 || points < 10}>
          {hearts === 5 ? (
            "full"
          ) : (
            <div className="flex items-center">
              <Image src="/points.svg" alt="Points" height={20} width={20} />
              <p>10</p> {/* Assuming POINTS_TO_REFILL is 10 */}
            </div>
          )}
        </Button>
      </div>
      <div className="flex w-full items-center gap-x-4 border-t-2 p-4 pt-8">
        <Image src="/unlimited.svg" alt="unlimited" height={60} width={60} />
        <div className="flex-1">
          <p className="text-base font-bold text-neutral-700 lg:text-xl">
            Unlimited Hearts
          </p>
        </div>
        <Button disabled={false}>
          {hasActiveSubscription ? "settings" : "Upgrade"}
        </Button>
      </div>
    </ul>
  );
};
