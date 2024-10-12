"use client";


import { Button } from "@/components/ui/button";

import Image from "next/image";

export const Header = () => {
  // Simulated user authentication state
  const isSignedIn = false; // Change this to true to simulate a signed-in user

  return (
    <header className="h-20 w-full border-b-2 border-slate-200 px-4">
      <div
        className="lg:max-w-screen-lg mx-auto flex items-center
       justify-between h-full "
      >
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/mascot.svg" alt="Mascot" height={40} width={40} />
          <h1 className="text-2xl text-green-600 tracking-wide font-extrabold">
            DuoLingo
          </h1>
        </div>
        <div>
          {isSignedIn ? (
            <Button size="lg" variant="ghost" onClick={() => alert("Logged out")}>
              Logout
            </Button>
          ) : (
            <Button size="lg" variant="ghost" onClick={() => alert("Redirecting to login")}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
