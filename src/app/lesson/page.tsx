"use client";
import { useSearchParams } from "next/navigation";
import EnhancedQuiz from "@/components/Quiz"; // Ensure the correct import path

const LessonPage = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get("title"); // Extract the title from search parameters

  return (
    <div>
      <EnhancedQuiz TypeofQuestion={title} />
    </div>
  );
};

export default LessonPage;
