
"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CheckCircleIcon, XCircleIcon } from "lucide-react"

export default function Quizs() {

  type UseCase = {
    answer: string;
    example: string;
    explanation: string;
  };

  type UseCasesData = {
    title: string;
    conclusion: string;
    usecases: UseCase[];
  };

  type ResultType = {
    result: string;
    message: string;
    timeTaken: number;
  };

  type PerformanceType = {
    difficulties: Record<string, any>;
    total_correct: number;
    total_incorrect: number;
  };

  const [question, setQuestion] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [timeLimit, setTimeLimit] = useState<number>(0);
  const [useCases, setUseCases] = useState<UseCasesData | null>(null);
  const [quizState, setQuizState] = useState('start')
  const [category, setCategory] = useState('Greetings')
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [result, setResult] = useState<ResultType | null>(null);
  const [performanceSummary, setPerformanceSummary] = useState<PerformanceType | null>(null);
  const [loading, setLoading] = useState(false)
  const [questionCount, setQuestionCount] = useState(0);  // Question counter

  useEffect(() => {
    // Remove the automatic call to startQuiz here
  }, [category])
  
  const startQuiz = async (Category: string) => {
    setLoading(true)
    setQuestionCount(0)  // Reset question count at the start
    try {
      const response = await fetch('http://127.0.0.1:5000/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', category: Category }),
      })
      const data = await response.json()
  
      setQuizState(data.quiz_state) // Save the initial quiz state from server
      console.log("Started Quiz")
      console.log("Quiz State: ", data.quiz_state)
      if (data.next_action === 'get_question') {
        getQuestion(data.quiz_state)
      }
  
    } catch (error) {
      console.error('Error starting quiz:', error)
    }
    setLoading(false)
  }
  
  const getQuestion = async (currentState: any) => {
    if (questionCount >= 10) {
      endQuiz(currentState);  // End quiz after 10 questions
      return;
    }

    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:5000/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_question', quiz_state: currentState }),
      })

      const data = await response.json()
  
      setQuestion(data.question)
      setOptions(data.options)
      setDifficulty(data.difficulty)
      setTimeLimit(data.time_limit)
      setUseCases(data.use_cases)
      setQuizState(data.quiz_state)  // Update state with new data
      setQuestionCount(prevCount => prevCount + 1);  // Increment the question count
      
      console.log("GOT NEW DATA")
      console.log("DATA: ", data)
  
    } catch (error) {
      console.error('Error getting question:', error)
    }
    setLoading(false)
  }
  
  const renderUseCases = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Use Cases:</CardTitle>
      </CardHeader>
      <CardContent>
        {useCases && useCases.usecases.map((useCase, index) => (
          <div key={index} className="mb-4">
            <p className="font-semibold">Example: {useCase.example}</p>
            <p>Answer: {useCase.answer}</p>
            <p>Explanation: {useCase.explanation}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )

  const renderQuestion = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{question}</CardTitle>
        <CardDescription>
          Difficulty: {difficulty} | Time Limit: {timeLimit} seconds
        </CardDescription>
      </CardHeader>
      <CardContent>
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="radio"
              value={option}
              id={`option-${index}`}
              name="quiz-options"
              className="mr-2"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedAnswer(e.target.value)}
            />
            <Label htmlFor={`option-${index}`}>{option}</Label>
          </div>
        ))}
        <Button className="mt-4" onClick={submitAnswer} disabled={!selectedAnswer}>
          Submit Answer
        </Button>
      </CardContent>
    </Card>
  );

  const renderResult = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          {result && result.result ? (
            <CheckCircleIcon className="inline-block mr-2 text-green-500" />
          ) : (
            <XCircleIcon className="inline-block mr-2 text-red-500" />
          )}
          {result && result.result ? 'Correct!' : 'Incorrect'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{result?.message || 'No message available.'}</p>
        <p className="text-sm text-gray-500">
          Time taken: {result?.timeTaken ? result.timeTaken.toFixed(2) : 'N/A'} seconds
        </p>
      </CardContent>
    </Card>
  );

  const submitAnswer = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit_answer', answer: selectedAnswer, quiz_state: quizState }),
      });
  
      const data = await response.json();
      setResult({ result: data.result, message: data.message, timeTaken: data.time_taken });
      setQuizState(data.quiz_state);  // Update state with new data
  
      if (data.next_action === 'get_question' && questionCount < 10) {
        getQuestion(data.quiz_state);
      } else if (data.next_action === 'end_quiz' || questionCount >= 10) {
        endQuiz(data.quiz_state);
      }
  
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
    setLoading(false);
  };
  
  const endQuiz = async (currentState: any) => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'end_quiz', quiz_state: currentState }),
      });
      const data = await response.json();
      setPerformanceSummary(data.performance_summary);
      setQuizState(data.quiz_state);  // Update state with end data
  
    } catch (error) {
      console.error('Error ending quiz:', error);
    }
    setLoading(false);
  };

  const renderPerformanceSummary = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Quiz Complete!</CardTitle>
      </CardHeader>
      <CardContent>
        {
          performanceSummary !== null ? (
            <>
              <p>Total Correct: {performanceSummary && performanceSummary.total_correct}</p>
              <p>Total Incorrect: {performanceSummary && performanceSummary.total_incorrect}</p>

              {Object.entries(performanceSummary.difficulties).map(([difficulty, stats]: [string, any]) => (
                <div key={difficulty} className="mt-4">
                  <h4 className="font-semibold">{difficulty}:</h4>
                  <p>Accuracy: {stats.accuracy}</p>
                  <p>Correct: {stats.correct}</p>
                  <p>Total: {stats.total}</p>
                  <Progress value={(stats.correct / stats.total) * 100} className="mt-2" />
                </div>
              ))}
              <Button className="mt-6" onClick={() => setQuizState('start')}>
                Start New Quiz
              </Button>
            </>
          ) : (
            <p>No performance summary available</p>
          )
        }
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">French Learning Quiz</h1>
      {loading && <Progress className="mb-4" />}
      {quizState === 'start' && (
        <Button onClick={() => startQuiz('Greetings')}>
          Start Quiz
        </Button>
      )}
      {quizState === 'answering' && (
        <div dangerouslySetInnerHTML={{ __html: renderQuestion() }} />
      )}
      {quizState === 'result' && renderResult()}
      {quizState === 'end' && renderPerformanceSummary()}
    </div>
  );
  
}
