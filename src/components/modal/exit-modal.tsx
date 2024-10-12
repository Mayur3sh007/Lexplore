"use client"; // Ensure this component is a Client Component

import React, { useState } from "react"; // Import React and useState for state management
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Import Dialog components from your UI library
import { useRouter } from "next/navigation"; // For navigation between pages
import Image from "next/image"; // Image component from Next.js
import { Button } from "../ui/button"; // Button component from your UI library

export const ExitModal = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // Local state to manage modal visibility

  // Function to open the modal
  const openModal = () => setIsOpen(true);

  // Function to close the modal
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <Button onClick={openModal} variant="primary" size="lg">
        Show Exit Modal
      </Button>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-5">
              <Image src="/mascot_sad.svg" alt="Mascot" height={80} width={80} />
            </div>
            <DialogTitle className="text-center text-2xl font-bold">
              Wait, don&apos;t go!
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              You&apos;re about to leave the lesson. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex w-full flex-col gap-y-4">
              <Button
                variant="primary"
                className="w-full"
                size="lg"
                onClick={closeModal} // Close modal to keep learning
              >
                Keep Learning
              </Button>
              <Button
                variant="dangerOutline"
                className="w-full"
                size="lg"
                onClick={() => {
                  closeModal(); // Close modal
                  router.push("/learn"); // Navigate to /learn
                }}
              >
                End Session
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
