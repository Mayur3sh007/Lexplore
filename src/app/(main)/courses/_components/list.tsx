"use client";

import { Card } from "./card";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

type Props = {
  courses: { id: number; imageSrc: string; title: string }[]; // Updated to use a simpler type definition
  activeCourseId?: number; // Adjusted type to match a simpler structure
};

export const List = ({ courses, activeCourseId }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = (id: number) => {
    if (pending) return;

    if (id === activeCourseId) {
      return router.push("/learn");
    }

    // Here we can simply handle the click and provide feedback
    startTransition(() => {
      // Simulate a successful action (since backend logic is removed)
      toast.success("Course selected!"); // Feedback for course selection
      router.push("/learn"); // Redirect to the learn page
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4 pt-6 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          imageSrc={course.imageSrc}
          onClick={onClick}
          title={course.title}
          disabled={pending}
          active={course.id === activeCourseId}
        />
      ))}
    </div>
  );
};
