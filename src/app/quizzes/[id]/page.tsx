"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Users,
  Award,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";

// Mock quiz data
const quizData = {
  id: 1,
  title: "Math Basics: Addition & Subtraction",
  topic: "Mathematics",
  subtopic: "Arithmetic",
  description:
    "Test your basic math skills with this quiz on addition and subtraction. Perfect for elementary school students and anyone looking to refresh their math fundamentals.",
  difficulty: "Easy",
  questions: 5, // Reduced for demo
  timeLimit: "15 min",
  participants: 1245,
  ageGroup: "7-12",
  image: "/placeholder.svg?height=400&width=800",
  questionsData: [
    {
      id: 1,
      text: "What is 5 + 3?",
      options: [
        { id: "a", text: "7" },
        { id: "b", text: "8" },
        { id: "c", text: "9" },
        { id: "d", text: "10" },
      ],
      correctAnswer: "b",
      explanation: "5 + 3 = 8",
    },
    {
      id: 2,
      text: "What is 10 - 4?",
      options: [
        { id: "a", text: "4" },
        { id: "b", text: "5" },
        { id: "c", text: "6" },
        { id: "d", text: "7" },
      ],
      correctAnswer: "c",
      explanation: "10 - 4 = 6",
    },
    {
      id: 3,
      text: "What is 7 + 8?",
      options: [
        { id: "a", text: "13" },
        { id: "b", text: "14" },
        { id: "c", text: "15" },
        { id: "d", text: "16" },
      ],
      correctAnswer: "c",
      explanation: "7 + 8 = 15",
    },
    {
      id: 4,
      text: "What is 12 - 5?",
      options: [
        { id: "a", text: "5" },
        { id: "b", text: "6" },
        { id: "c", text: "7" },
        { id: "d", text: "8" },
      ],
      correctAnswer: "c",
      explanation: "12 - 5 = 7",
    },
    {
      id: 5,
      text: "What is 9 + 6?",
      options: [
        { id: "a", text: "13" },
        { id: "b", text: "14" },
        { id: "c", text: "15" },
        { id: "d", text: "16" },
      ],
      correctAnswer: "c",
      explanation: "9 + 6 = 15",
    },
  ],
};

export default function QuizPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const { toast } = useToast();

  const startQuiz = () => {
    setQuizStarted(true);
    // In a real app, you would start a timer here
  };

  const handleAnswerSelect = (questionId: number, answerId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId,
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestion < quizData.questionsData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsSubmitDialogOpen(true);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = () => {
    setQuizCompleted(true);
    setShowResults(true);
    setIsSubmitDialogOpen(false);

    toast({
      title: "Quiz submitted!",
      description: "Your answers have been recorded.",
    });
  };

  const calculateScore = () => {
    let correctCount = 0;
    quizData.questionsData.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    return {
      score: correctCount,
      total: quizData.questionsData.length,
      percentage: Math.round(
        (correctCount / quizData.questionsData.length) * 100
      ),
    };
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const score = calculateScore();

  if (!quizStarted) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Link
            to="/quizzes"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Quizzes
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={quizData.image || "/placeholder.svg"}
                  alt={quizData.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline">{quizData.topic}</Badge>
                  <Badge variant="outline">{quizData.subtopic}</Badge>
                  <Badge
                    variant={
                      quizData.difficulty === "Easy"
                        ? "outline"
                        : quizData.difficulty === "Medium"
                        ? "default"
                        : "secondary"
                    }
                    className={
                      quizData.difficulty === "Easy"
                        ? "border-yellow-DEFAULT text-yellow-DEFAULT"
                        : quizData.difficulty === "Medium"
                        ? "bg-orange-DEFAULT hover:bg-orange-DEFAULT/90"
                        : "bg-purple-DEFAULT hover:bg-purple-DEFAULT/90"
                    }
                  >
                    {quizData.difficulty}
                  </Badge>
                  <Badge variant="outline">{quizData.ageGroup}</Badge>
                </div>
                <CardTitle className="text-2xl">{quizData.title}</CardTitle>
                <CardDescription>{quizData.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{quizData.timeLimit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {quizData.questions} Questions
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {quizData.participants.toLocaleString()} Participants
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={startQuiz} className="w-full">
                  Start Quiz
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quiz Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Instructions</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Read each question carefully before answering</li>
                    <li>
                      • You can navigate between questions using the previous
                      and next buttons
                    </li>
                    <li>
                      • You can review your answers before final submission
                    </li>
                    <li>• Once submitted, you cannot change your answers</li>
                    <li>
                      • Your score will be displayed immediately after
                      submission
                    </li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium mb-1">Scoring</h3>
                  <p className="text-sm text-muted-foreground">
                    Each correct answer is worth 1 point. No points are deducted
                    for incorrect answers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Link
            to="/quizzes"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Quizzes
          </Link>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Quiz Results</CardTitle>
            <CardDescription>{quizData.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-6 mb-4">
                <Award className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">
                {score.score} / {score.total}
              </h2>
              <p className="text-muted-foreground">Your Score</p>
            </div>

            <Progress value={score.percentage} className="h-3" />
            <p className="text-center text-sm text-muted-foreground">
              You scored {score.percentage}% on this quiz
            </p>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Question Review</h3>
              {quizData.questionsData.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    {selectedAnswers[question.id] === question.correctAnswer ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">
                        Question {index + 1}: {question.text}
                      </p>
                      <div className="mt-2 text-sm">
                        <p>
                          Your answer:{" "}
                          <span
                            className={
                              selectedAnswers[question.id] ===
                              question.correctAnswer
                                ? "text-green-500 font-medium"
                                : "text-red-500 font-medium"
                            }
                          >
                            {question.options.find(
                              (opt) => opt.id === selectedAnswers[question.id]
                            )?.text || "Not answered"}
                          </span>
                        </p>
                        <p className="mt-1">
                          Correct answer:{" "}
                          <span className="text-green-500 font-medium">
                            {
                              question.options.find(
                                (opt) => opt.id === question.correctAnswer
                              )?.text
                            }
                          </span>
                        </p>
                        <p className="mt-2 text-muted-foreground">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link to="/quizzes">Browse More Quizzes</Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link to="/profile">View Your Progress</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestionData = quizData.questionsData[currentQuestion];

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSubmitDialogOpen(true)}
            >
              Exit Quiz
            </Button>
            <div className="text-sm font-medium">
              Time Left: {formatTime(timeLeft)}
            </div>
          </div>
          <div className="text-sm font-medium">
            Question {currentQuestion + 1} of {quizData.questionsData.length}
          </div>
        </div>

        <Progress
          value={((currentQuestion + 1) / quizData.questionsData.length) * 100}
          className="h-2 mb-6 bg-muted [&>div]:bg-magenta-DEFAULT"
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Question {currentQuestion + 1}: {currentQuestionData.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswers[currentQuestionData.id] || ""}
              onValueChange={(value) =>
                handleAnswerSelect(currentQuestionData.id, value)
              }
              className="space-y-3"
            >
              {currentQuestionData.options.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center space-x-2 rounded-md border p-4 transition-colors ${
                    selectedAnswers[currentQuestionData.id] === option.id
                      ? "border-magenta-DEFAULT bg-magenta-DEFAULT/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={`option-${option.id}`}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={`option-${option.id}`}
                    className="flex-1 cursor-pointer text-base"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button onClick={goToNextQuestion}>
              {currentQuestion === quizData.questionsData.length - 1
                ? "Finish"
                : "Next"}
              {currentQuestion === quizData.questionsData.length - 1 ? null : (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <AlertDialog
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              {currentQuestion === quizData.questionsData.length - 1
                ? "Are you sure you want to submit your answers? You won't be able to change them after submission."
                : "You haven't completed all questions yet. Are you sure you want to exit?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={submitQuiz}>
              {currentQuestion === quizData.questionsData.length - 1
                ? "Submit"
                : "Exit & Submit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
