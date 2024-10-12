"use client";


import { UnitBanner } from "./unit-banner";
import { LessonButton } from "./lesson-button";

type Lesson = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  percentage?: number; // Optional percentage for each lesson, if needed
};

type Props = {
  id: number;
  order: number;
  title: string;
  description: string;
  lessons: Lesson[];
  activeLessonId?: number; // Changed from activeLesson to activeLessonId
  activeLessonPercentage: number; // Represents percentage for the active lesson
};

export const Unit = ({
  id,
  order,
  title,
  description,
  lessons,
  activeLessonId, // Use activeLessonId here
  activeLessonPercentage,
}: Props) => {
  return (
    <>
      <UnitBanner title={title} description={description} />
      <div className="relative flex flex-col items-center">
        {lessons.map((lesson, index) => {
          const isCurrent = lesson.id === activeLessonId; // Use activeLessonId
          const isLocked = !lesson.completed && !isCurrent;

          const percentage = isCurrent ? activeLessonPercentage : lesson.percentage || 0; // Default to 0 if no percentage

          return (
            <LessonButton
              key={lesson.id}
              id={lesson.id}
              index={index}
              totalCount={lessons.length - 1}
              current={isCurrent}
              locked={isLocked}
              percentage={percentage} // Pass the corresponding percentage
            />
          );
        })}
      </div>
    </>
  );
};
