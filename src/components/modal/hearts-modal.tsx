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
import { useRouter } from "next/navigation"; // For navigation between pages
import Image from "next/image"; // Image component from Next.js
import { Button } from "../ui/button"; // Button component from your UI library

export const HeartsModal = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // Local state to manage modal visibility
  const [isClient, setIsClient] = useState(false); // Local state to track client-side rendering

  useEffect(() => {
    setIsClient(true); // Set isClient to true after the component mounts
  }, []);

  // Function to handle the "Get unlimited hearts" button click
  const onClick = () => {
    setIsOpen(false); // Close the modal
    router.push("/store"); // Navigate to the store page
  };

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
        Show Hearts Modal
      </Button>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-5">
              <Image src="/mascot_bad.svg" alt="Mascot" height={80} width={80} />
            </div>
            <DialogTitle className="text-center text-2xl font-bold">
              You ran out of hearts!
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Get Pro for unlimited hearts, or purchase them in the store
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex w-full flex-col gap-y-4">
              <Button
                variant="primary"
                className="w-full"
                size="lg"
                onClick={onClick} // Handle button click
              >
                Get unlimited hearts
              </Button>
              <Button
                variant="primaryOutline"
                className="w-full"
                size="lg"
                onClick={closeModal} // Close modal when clicked
              >
                No thanks
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
