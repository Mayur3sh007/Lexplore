"use client";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress"; // Assuming this is a UI component for showing progress
import { InfinityIcon, X } from "lucide-react"; // Icons from lucide-react
import Image from "next/image"; // Next.js Image component

type Props = {
  hearts: number; // Number of hearts the user has
  percentage: number; // Percentage for the progress bar
  hasActiveSubscription: boolean; // Indicates if the user has an active subscription
};

export const Header = ({
  hearts,
  percentage,
  hasActiveSubscription,
}: Props) => {
  const router = useRouter();
  const handleExitClick = () => {
    // Logic to open exit modal can be handled here, if necessary
    router.push("/learn"); // Placeholder for actual exit functionality
  };

  return (
    <header className="mx-auto flex w-full max-w-[1140px] items-center justify-between gap-x-7 px-10 pt-[20px] lg:pt-[50px]">
      {/* Exit button */}
      <X
        onClick={handleExitClick} // Handle click event for exiting
        className="cursor-pointer text-slate-500 transition hover:opacity-75"
      />
      {/* Progress bar */}
      <Progress value={percentage} />
      {/* Hearts display */}
      <div className="flex items-center font-bold text-rose-500">
        <Image
          src="/heart.svg" // Heart icon source
          alt="hearts"
          height={28}
          width={28}
          className="mr-2"
        />
        {hasActiveSubscription ? (
          <InfinityIcon className="h-6 w-6 shrink-0 stroke-[3]" />
        ) : (
          hearts // Display number of hearts if no active subscription
        )}
      </div>
    </header>
  );
};
