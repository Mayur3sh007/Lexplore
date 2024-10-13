// In challenge.tsx
"use client";

import { Card } from "./card"; // Import the Card component

type ChallengeProps = {
  options: { id: number; text: string; correct: boolean }[]; // Challenge options
  onSelect: (id: number) => void; // Function to handle selection
  status?: "correct" | "wrong" | "none"; // Status for selected option
  selectedOption?: number; // Currently selected option
  disabled?: boolean; // Disable selection
  type: "ASSIST" | "SELECT"; // Type of challenge
};

export const Challenge = ({
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
  type,
}: ChallengeProps) => {
  return (
    <div className="flex flex-col gap-y-2">
      {options.map((option, i) => (
        <Card
          key={option.id}
          id={option.id}
          imageSrc={null} // Example, replace with actual image source if needed
          audioSrc={null} // Example, replace with actual audio source if needed
          text={option.text}
          shortcut={`${i+1}`} // Example shortcut
          onClick={() => onSelect(option.id)}
          selected={selectedOption === option.id}
          disabled={disabled}
          status={status} // Set status based on selection
          type={type}
        />
      ))}
    </div>
  );
};
