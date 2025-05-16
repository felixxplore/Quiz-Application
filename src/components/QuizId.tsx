"use client";

import { useEffect, useState, useMemo } from "react";
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
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
  fetchQuestionsByQuizId,
  fetchQuizzes,
  submitQuiz,
} from "@/store/quizSlice";
// import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// TypeScript interfaces
interface Option {
  id: number;
  optionText: string;
  isCorrect: boolean;
  optionIndex: number;
  questionId: number;
}

interface Question {
  id: number;
  questionText: string;
  questionType: "MCQ" | "TRUE_FALSE" | "FILL_BLANK";
  quizId: number;
  options: Option[];
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  difficultyLevel: string;
  timeLimit: number;
  topicName: string;
  subtopicName: string;
}

interface DisplayQuiz {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  timeLimit: string;
  topic: string;
  subtopic: string;
  questions: number;
  ageGroup: string;
}

interface SelectedAnswers {
  quizId: number;
  answers: Array<{ questionId: number; selectedOptionId: number }>;
}

const QuizId: React.FC = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [fillBlankAnswers, setFillBlankAnswers] = useState<
    Record<number, string>
  >({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  const { quizId } = useParams<{ quizId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { quizzes, questions, loading, error, quizSubmission } = useSelector(
    (state: RootState) => state.quiz
  );

  // Map quiz info from Redux to DisplayQuiz interface
  const quizMeta = useMemo((): DisplayQuiz => {
    const quiz = quizzes.find((q: Quiz) => q.id === Number(quizId));
    if (!quiz) {
      return {
        id: Number(quizId) || 0,
        title: "Unknown Quiz",
        description: "No description available",
        difficulty: "Medium",
        timeLimit: "30 min",
        topic: "Unknown",
        subtopic: "Unknown",
        questions: questions.length,
        ageGroup: "14+",
      };
    }
    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      difficulty:
        quiz.difficultyLevel.charAt(0).toUpperCase() +
        quiz.difficultyLevel.slice(1).toLowerCase(),
      timeLimit: `${quiz.timeLimit} min`,
      topic: quiz.topicName,
      subtopic: quiz.subtopicName,
      questions: questions.length,
      ageGroup: "14+", // Placeholder
    };
  }, [quizzes, quizId, questions.length]);

  // Set timeLeft based on quizMeta.timeLimit
  const [timeLeft, setTimeLeft] = useState(() => {
    const timeLimitMinutes = parseInt(quizMeta.timeLimit) || 30;
    return timeLimitMinutes * 60; // Convert to seconds
  });

  useEffect(() => {
    dispatch(fetchQuizzes());
    if (quizId) {
      dispatch(fetchQuestionsByQuizId(Number(quizId)));
    }
  }, [dispatch, quizId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, quizCompleted]);

  // start quiz
  const startQuiz = () => {
    if (questions.length === 0) return;
    setQuizStarted(true);
  };

  const handleAnswerSelect = (questionId: number, selectedOptionId: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOptionId,
    }));
  };

  const handleFillBlankChange = (questionId: number, value: string) => {
    setFillBlankAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
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
  const getSelectedAnswers = () => {
    const answers = Object.entries(selectedAnswers).map(
      ([questionId, selectedOptionId]) => ({
        questionId: Number(questionId),
        selectedOptionId: Number(selectedOptionId),
      })
    );
    return {
      quizId: Number(quizId) || 0,
      answers,
    };
  };

  // submit quiz :
  const handleSubmitQuiz = () => {
    console.log("selected answer", getSelectedAnswers());
    const answer = getSelectedAnswers();
    dispatch(submitQuiz(answer)).then((result) => {
      if (submitQuiz.fulfilled.match(result)) {
        setQuizCompleted(true);
        setShowResults(true);
        setIsSubmitDialogOpen(false);
      } else if (submitQuiz.rejected.match(result)) {
        console.error("Quiz submission failed:", result.error.message);
        // Optionally show an error message to the user
      }
    });
  };

  const calculateScore = useMemo(() => {
    if (quizSubmission) {
      // Use API response if available
      return {
        score: quizSubmission.score || 0,
        total: quizSubmission.totalQuestions,
        percentage: quizSubmission.percentage || 0,
      };
    }
    let correctCount = 0;
    questions.forEach((question) => {
      if (
        question.questionType === "MCQ" ||
        question.questionType === "TRUE_FALSE"
      ) {
        const correctOption = question.options.find((opt) => opt.isCorrect);
        if (
          correctOption &&
          selectedAnswers[question.id] === correctOption.id
        ) {
          correctCount++;
        }
      }
    });
    return {
      score: correctCount,
      total: questions.length,
      percentage:
        questions.length > 0
          ? Math.round((correctCount / questions.length) * 100)
          : 0,
    };
  }, [selectedAnswers, fillBlankAnswers, questions]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  if (loading) {
    return <div className="container py-8">Loading...</div>;
  }

  if (error) {
    return <div className="container py-8">Error: {error}</div>;
  }

  if (!quizMeta.id || quizzes.length === 0) {
    return <div className="container py-8">Quiz not found.</div>;
  }

  //* agar quiz start nahi hua hai to ye dikhega
  if (!quizStarted) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Link
            to="/quizzes"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Quizzes
          </Link>
        </div>
        <Card>
          <CardHeader>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge>{quizMeta.topic}</Badge>
              <Badge>{quizMeta.subtopic}</Badge>
              <Badge
                variant={
                  quizMeta.difficulty === "Medium" ? "default" : "outline"
                }
                className={
                  quizMeta.difficulty === "Medium" ? "bg-orange-500" : ""
                }
              >
                {quizMeta.difficulty}
              </Badge>
              <Badge>{quizMeta.ageGroup}</Badge>
            </div>
            <CardTitle className="text-2xl">{quizMeta.title}</CardTitle>
            <CardDescription>{quizMeta.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{quizMeta.timeLimit}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{quizMeta.questions} Questions</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={startQuiz}
              className="w-full"
              disabled={questions.length === 0}
            >
              Start Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // agar result found hua hai to ye dikhega
  if (showResults) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Link
            to="/quizzes"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Quizzes
          </Link>
        </div>
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Quiz Results</CardTitle>
            <CardDescription>{quizMeta.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold">
                {calculateScore.score} / {calculateScore.total}
              </h2>
              <p className="text-muted-foreground">Your Score</p>
            </div>
            <Progress value={calculateScore.percentage} className="h-3" />
            <p className="text-center text-sm text-muted-foreground">
              You scored {calculateScore.percentage}% on this quiz
            </p>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Question Review</h3>
              {questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    {question.questionType === "MCQ" ||
                    question.questionType === "TRUE_FALSE" ? (
                      question.options.find((opt) => opt.isCorrect)?.id ===
                      Number(selectedAnswers[question.id]) ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )
                    ) : (
                      (fillBlankAnswers[question.id]?.toLowerCase() ===
                        "oop" && (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      )) || <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">
                        Question {index + 1}: {question.questionText}
                      </p>
                      <div className="mt-2 text-sm">
                        <p>
                          Your answer:{" "}
                          <span
                            className={
                              question.questionType === "MCQ" ||
                              question.questionType === "TRUE_FALSE"
                                ? question.options.find((opt) => opt.isCorrect)
                                    ?.id ===
                                  Number(selectedAnswers[question.id])
                                  ? "text-green-500 font-medium"
                                  : "text-red-500 font-medium"
                                : fillBlankAnswers[
                                    question.id
                                  ]?.toLowerCase() === "oop"
                                ? "text-green-500 font-medium"
                                : "text-red-500 font-medium"
                            }
                          >
                            {question.questionType === "MCQ" ||
                            question.questionType === "TRUE_FALSE"
                              ? question.options.find(
                                  (opt) =>
                                    opt.id ===
                                    Number(selectedAnswers[question.id])
                                )?.optionText || "Not answered"
                              : fillBlankAnswers[question.id] || "Not answered"}
                          </span>
                        </p>
                        <p className="mt-1">
                          Correct answer:{" "}
                          <span className="text-green-500 font-medium">
                            {question.questionType === "MCQ" ||
                            question.questionType === "TRUE_FALSE"
                              ? question.options.find((opt) => opt.isCorrect)
                                  ?.optionText
                              : "Not provide answer!"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/quizzes">Browse More Quizzes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  if (questions.length === 0 && quizStarted) {
    return (
      <div className="container py-8">
        No questions available for this quiz.
      </div>
    );
  }
  const currentQuestionData = questions[currentQuestion];

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
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
        <Progress
          value={((currentQuestion + 1) / questions.length) * 100}
          className="h-2 mb-6"
        />
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Question {currentQuestion + 1}:{" "}
              {currentQuestionData?.questionText || "No question"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {currentQuestionData?.questionType === "MCQ" ||
            currentQuestionData?.questionType === "TRUE_FALSE" ? (
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
                    className={`flex items-center space-x-2 rounded-md border p-4 ${
                      selectedAnswers[currentQuestionData.id] ===
                      String(option.id)
                        ? "border-blue-500 bg-blue-500/10"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem
                      value={String(option.id)}
                      id={`option-${option.id}`}
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`option-${option.id}`}
                      className="flex-1 cursor-pointer text-base"
                    >
                      {option.optionText}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : currentQuestionData?.questionType === "FILL_BLANK" ? (
              <Input
                placeholder="Enter your answer"
                value={fillBlankAnswers[currentQuestionData.id] || ""}
                onChange={(e) =>
                  handleFillBlankChange(currentQuestionData.id, e.target.value)
                }
                className="mt-4"
              />
            ) : (
              <div>Unknown question type</div>
            )}
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
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
              {currentQuestion === questions.length - 1 ? null : (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </CardFooter>
        </Card>
        <AlertDialog
          open={isSubmitDialogOpen}
          onOpenChange={setIsSubmitDialogOpen}
         
        >
          <AlertDialogContent  className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to submit your answers? You won’t be able
                to change them after submission.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmitQuiz}>
                Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default QuizId;
