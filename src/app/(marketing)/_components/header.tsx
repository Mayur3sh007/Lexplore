"use client";


import { Button } from "@/components/ui/button";
import { auth, db, googleAuthProvider } from "@/config/firebase";
import { signInWithPopup, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

import Image from "next/image";

export const Header = () => {
  // Simulated user authentication state
  const isSignedIn = false; // Change this to true to simulate a signed-in user
  const router = useRouter();

  // async function addUsertoDB(user : User, avatarURL: string | null, username: string, email: string) {
  //   try {
  //     const userRef = doc(db, "Users", user.uid);
  //     const userDoc = await getDoc(userRef);

  //     if (!userDoc.exists()) {
  //       await setDoc(userRef, {
  //         username: username,
  //         email: email,
  //         avatarURL: avatarURL,
  //       });
  //     }
  //   } catch (error: any) {
      
  //   }
  // };

  // const signInWithGoogle = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, googleAuthProvider);
  //     const user = result.user;

  //     if (user) {
  //       const username = user.displayName || "";
  //       const email = user.email || "";
  //       const avatarURL = user.photoURL || null;

  //       console.log(username);
  //       console.log(email);
  //       console.log(avatarURL);
        
  //       await addUsertoDB(user, avatarURL, username, email);
  //       console.log("User added to DB");
        
        
  //       router.push("/learn");
  //     }
  //   } catch (error: any) {
  //     console.error("Google Sign-in Error:", error.message);
      
  //   }
  // };

  return (
    <header className="h-20 w-full border-b-2 border-slate-200 px-4">
      <div
        className="lg:max-w-screen-lg mx-auto flex items-center
       justify-between h-full "
      >
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/lex_logo.png" alt="Mascot" height={40} width={40} />
          <h1 className="text-2xl text-blue-600 tracking-wide font-extrabold">
            Lexplore
          </h1>
        </div>
        <div>
          {isSignedIn ? (
            <Button size="lg" variant="ghost" onClick={() => alert("Logged out")}>
              Logout
            </Button>
          ) : (
            <Button size="lg" variant="ghost" >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
