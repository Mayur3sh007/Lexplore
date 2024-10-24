"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Book, Award } from "lucide-react"
import * as RadioGroup from '@radix-ui/react-radio-group'
import ReactConfetti  from 'react-confetti'

export default function EnhancedFrenchQuiz( { TypeofQuestion }: { TypeofQuestion: string }) {
  const [showUseCases, setShowUseCases] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const [showAnswerReview, setShowAnswerReview] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [question, setQuestion] = useState<string | null>(null)
  const [options, setOptions] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState<string | null>(null)
  const [timeLimit, setTimeLimit] = useState<number>(0)
  const [useCases, setUseCases] = useState<{
    title: string;
    usecases: Array<{ example: string; answer: string; explanation: string }>;
  } | null>(null)
  const [quizAction, setQuizAction] = useState('start')
  const [category, setCategory] = useState(TypeofQuestion)
  const [result, setResult] = useState<{ result: string; message: string; timeTaken: number } | null>(null)
  const [performanceSummary, setPerformanceSummary] = useState<{
    difficulties: Record<string, any>;
    total_correct: number;
    total_incorrect: number;
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const [currTime, setCurrTime] = useState<any>(0)
  const [quizState, setQuizState] = useState<any>([])
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [scores, setScores] = useState({
    correct: 0,
    incorrect: 0
  })
  const [progress, setProgress] = useState(1)

  const startQuiz = async (Category: string) => {
    setLoading(true)
    setQuestionCount(0)
    try {
      const response = await fetch('http://127.0.0.1:5000/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', category: Category }),
      })
      const data = await response.json()

      setQuizAction("answering")
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
    if (questionCount >= 3) {
      endQuiz(currentState)
      return
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
      setQuizAction("answering")
      setQuestionCount(prevCount => prevCount + 1)
      setQuizState(data.quiz_state)
      setCorrectAnswer(data.quiz_state.correct_answer || '')

      console.log("GOT NEW DATA")
      console.log("DATA: ", data)

    } catch (error) {
      console.error('Error getting question:', error)
    }
    setLoading(false)
  }

  const handleSubmitAnswer = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:5000/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_answer',
          start_time: currTime,
          question: question,
          options: options,
          timelimit: timeLimit,
          answer: selectedAnswer,
          quiz_state: quizState,
          difficulty: difficulty
        }),
      })

      const data = await response.json()
      setResult({
        result: data.result,
        message: data.message,
        timeTaken: data.time_taken
      })

      setScores(prevScores => ({
        correct: prevScores.correct + (data.result === true ? 1 : 0),
        incorrect: prevScores.incorrect + (data.result === false ? 1 : 0)
      }))

      setCorrectAnswer(data.quiz_state.correct_answer || '')
      setQuizAction(data.quiz_state)
      setShowQuestion(false)
      setShowAnswerReview(true)

      setQuizState(data.quiz_state)

      // Animate progress bar
      setProgress((prevProgress) => Math.min(prevProgress + 33.33, 100))

      // Trigger confetti for correct answers
      if (data.result === true) {
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={200}
        />
      }

    } catch (error) {
      console.error('Error submitting answer:', error)
    }
    setLoading(false)
  }

  const endQuiz = async (currentState: any) => {
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:5000/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'end_quiz',
          quiz_state: currentState,
          scores: {
            total_correct: scores.correct,
            total_incorrect: scores.incorrect
          }
        }),
      })
      const data = await response.json()

      setPerformanceSummary({
        difficulties: data.performance_summary?.difficulties || {},
        total_correct: scores.correct,
        total_incorrect: scores.incorrect
      })

      setQuizAction(data.quiz_state)
      setShowAnswerReview(false)
      setShowQuestion(false)
      setShowUseCases(false)

    } catch (error) {
      console.error('Error ending quiz:', error)
    }
    setLoading(false)
  }

  const startLesson = () => {
    setScores({ correct: 0, incorrect: 0 })
    startQuiz(category)
    setShowUseCases(true)
    setQuestionCount(0)
  }

  const proceedToQuestion = () => {
    const now = new Date()
    const formattedTime = now.toISOString()
    setCurrTime(formattedTime)
    setShowUseCases(false)
    setShowQuestion(true)
    setShowAnswerReview(false)
  }

  const proceedToNext = () => {
    if (questionCount >= 3) {
      endQuiz(quizState)
    } else {
      setShowAnswerReview(false)
      setShowUseCases(true)
      setSelectedAnswer('')
      getQuestion(quizState)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      {/* Lesson Progress Bar */}
      <div className="w-full bg-blue-200 rounded-full h-2.5 mb-4">
        <motion.div 
          className="bg-blue-600 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <Card className="bg-white shadow-lg border-blue-200">
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">French Learning Adventure</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {!showUseCases && !showQuestion && !showAnswerReview && !performanceSummary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-4"
            >
              <Book className="w-16 h-16 mx-auto text-blue-600" />
              <h2 className="text-2xl font-bold text-blue-800">Welcome to Your French Lesson</h2>
              <p className="text-blue-600">Embark on a journey to master the French language!</p>
              <Button
                onClick={startLesson}
                className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                Start Your Adventure
              </Button>
            </motion.div>
          )}

          {showUseCases && useCases && !showAnswerReview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-blue-800">{useCases.title}</h3>
              {useCases.usecases.map((useCase, index) => (
                <Card key={index} className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h4 className="font-semibold text-blue-700">Example:</h4>
                      <p className="text-blue-600">{useCase.example}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-700">Answer:</h4>
                      <p className="text-blue-600">{useCase.answer}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-700">Explanation:</h4>
                      <p className="text-blue-600">{useCase.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="text-center mt-6">
                <Button
                  onClick={proceedToQuestion}
                  className="bg-green-600 hover:bg-green-700 transition-colors duration-200"
                >
                  Test Your Knowledge
                </Button>
              </div>
            </motion.div>
          )}

          {showQuestion && question && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-blue-800">Practice Question</h3>
              <p className="text-blue-600">Difficulty: {difficulty} | Time Limit: {timeLimit} seconds</p>
              <div className="text-lg font-medium text-blue-900">{question}</div>
              <RadioGroup.Root
                value={selectedAnswer}
                onValueChange={setSelectedAnswer}
                className="space-y-4"
              >
                {options.map((option, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-2 p-3 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RadioGroup.Item
                      value={option}
                      id={`option-${index}`}
                      className="w-4 h-4 rounded-full border-2 border-blue-400 text-blue-600 focus:ring-blue-400"
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-blue-600" />
                    </RadioGroup.Item>
                    <Label htmlFor={`option-${index}`} className="text-blue-800 cursor-pointer flex-grow">
                      {option}
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup.Root>
              <div className="text-center mt-6">
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  Submit Answer
                </Button>
              </div>
            </motion.div>
          )}

          {showAnswerReview && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold text-blue-800">Question Review</h3>
              <div className="space-y-4">
                <div className="text-lg font-medium text-blue-900">{question}</div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-blue-700">Your answer:</span>
                    <span className={result.result === true ? 'text-green-600' : 'text-red-600'}>
                      {selectedAnswer}
                      <AnimatePresence>
                        {result.result === true ? (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <CheckCircle className="inline ml-2 h-5 w-5"   />
                          </motion.span>
                        ) : (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <XCircle className="inline ml-2 h-5 w-5" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </div>
                  {result.result !== 'correct' && (
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-blue-700">Correct answer:</span>
                      <span className="text-green-600">{correctAnswer}</span>
                    </div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200"
                  >
                    <p className="font-medium text-blue-800">{result.message}</p>
                    <p className="text-sm text-blue-600">Time taken: {result.timeTaken} seconds</p>
                  </motion.div>
                </div>
                <div className="text-center mt-6">
                  <Button
                    onClick={proceedToNext}
                    className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                  >
                    {questionCount >= 3 ? 'See Final Results' : 'Next Question'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {performanceSummary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="text-center">
                <Award className="w-16 h-16 mx-auto text-blue-600" />
                <h2 className="text-2xl font-bold text-blue-800 mt-4">Lesson Complete!</h2>
                <p className="text-blue-600">Here's how you performed:</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-100 rounded-lg text-center">
                  <h3 className="font-semibold text-green-800">Correct Answers</h3>
                  <p className="text-3xl font-bold text-green-600">{scores.correct}</p>
                </div>
                <div className="p-4 bg-red-100 rounded-lg text-center">
                  <h3 className="font-semibold text-red-800">Incorrect Answers</h3>
                  <p className="text-3xl font-bold text-red-600">{scores.incorrect}</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="font-medium text-blue-800">Total Questions: {scores.correct + scores.incorrect}</p>
                <p className="font-medium text-blue-800">Success Rate: {
                  Math.round((scores.correct / (scores.correct + scores.incorrect)) * 100)
                }%</p>
              </div>
              <div className="text-center mt-6">
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  Start New Lesson
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"
          />
        </div>
      )}
    </div>
  )
}