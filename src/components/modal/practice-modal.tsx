"use client"; // Ensure this component is a Client Component

import React, { useEffect, useState } from "react"; // Import React and useState
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Import Dialog components from your UI library
import Image from "next/image"; // Image component from Next.js
import { useRouter } from "next/navigation"; // For navigation between pages
import { Button } from "../ui/button"; // Button component from your UI library

export const PracticeModal = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // Local state to manage modal visibility
  const [isClient, setIsClient] = useState(false); // Local state to track client-side rendering

  useEffect(() => {
    setIsClient(true); // Set isClient to true after the component mounts
  }, []);

  // Function to open the modal
  const openModal = () => setIsOpen(true);

  // Function to close the modal
  const closeModal = () => setIsOpen(false);

  if (!isClient) {
    return null; // Prevent rendering on the server-side
  }

  return (
    <>
      <Button onClick={openModal} variant="primary" size="lg">
        Show Practice Modal
      </Button>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-5">
              <Image src="/heart.svg" alt="heart" height={100} width={100} />
            </div>
            <DialogTitle className="text-center text-2xl font-bold">
              Practice lesson
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Use practice lesson to regain hearts and points. You can&apos;t lose
              hearts or points in practice lesson.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex w-full flex-col gap-y-4">
              <Button
                variant="primary"
                className="w-full"
                size="lg"
                onClick={closeModal} // Handle button click to close the modal
              >
                I understand
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
