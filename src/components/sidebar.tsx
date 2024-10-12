
import Image from "next/image"; // Next.js Image component for optimized images
import Link from "next/link"; // Next.js Link component for navigation
import React from "react"; // React library
import { SideBarItem } from "./sidebar-item"; // Importing a sidebar item component
import { cn } from "@/lib/utils";


type Props = {
  className?: string; // Optional className prop for custom styles
};

// Sidebar navigation data
const SideBarData = [
  { label: "Learn", href: "/learn", iconSrc: "/learn.svg" },
  { label: "Leaderboard", href: "/leaderboard", iconSrc: "/leaderboard.svg" },
  { label: "Quests", href: "/quests", iconSrc: "/quests.svg" },
  { label: "Shop", href: "/shop", iconSrc: "/shop.svg" },
];

export const SideBar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        `left-0 top-0 flex h-full flex-col border-r-2 px-4 lg:fixed lg:w-[256px]`,
        className,
      )}
    >
      <Link href="/learn">
        <div className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
          <Image src="/mascot.svg" alt="Mascot" height={40} width={40} />
          <h1 className="text-2xl font-extrabold tracking-wide text-green-600">
            DuoLingo
          </h1>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-y-2">
        {SideBarData.map((item) => (
          <SideBarItem
            key={item.href}
            label={item.label}
            href={item.href}
            iconSrc={item.iconSrc}
          />
        ))}
      </div>
    </div>
  );
};
