 

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
import { motion } from "framer-motion";
import QuizLoader from "./QuizLoader";

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

interface SelectedAnswer {
  questionId: number;
  selectedOptionId?: number;
  fillBlankAnswer?: string;
}

interface QuizSubmissionPayload {
  quizId: number;
  answers: SelectedAnswer[];
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
      ageGroup: "14+",
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

  // Start quiz
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

  const getSelectedAnswers = (): QuizSubmissionPayload => {
    const answers: SelectedAnswer[] = [];

    // Add MCQ/True-False answers
    Object.entries(selectedAnswers).forEach(
      ([questionId, selectedOptionId]) => {
        answers.push({
          questionId: Number(questionId),
          selectedOptionId: Number(selectedOptionId),
        });
      }
    );

    // Add Fill-in-the-Blank answers
    Object.entries(fillBlankAnswers).forEach(
      ([questionId, fillBlankAnswer]) => {
        answers.push({
          questionId: Number(questionId),
          fillBlankAnswer,
        });
      }
    );

    return {
      quizId: Number(quizId) || 0,
      answers,
    };
  };

  // Submit quiz
  const handleSubmitQuiz = () => {
    const answer = getSelectedAnswers();
    dispatch(submitQuiz(answer)).then((result) => {
      if (submitQuiz.fulfilled.match(result)) {
        setQuizCompleted(true);
        setShowResults(true);
        setIsSubmitDialogOpen(false);
      } else if (submitQuiz.rejected.match(result)) {
        console.error("Quiz submission failed:", result.error.message);
      }
    });
  };

  const calculateScore = useMemo(() => {
    if (quizSubmission) {
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
      } else if (question.questionType === "FILL_BLANK") {
        const userAnswer = fillBlankAnswers[question.id]?.toLowerCase().trim();
        const correctAnswer = question.correctAnswer?.toLowerCase().trim();
        if (userAnswer && correctAnswer && userAnswer === correctAnswer) {
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
  }, [selectedAnswers, fillBlankAnswers, questions, quizSubmission]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  if (loading) {
    return <QuizLoader />
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-red-600 text-lg font-medium"
        >
          Error: {error}
        </motion.div>
      </div>
    );
  }

  if (!quizMeta.id || quizzes.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-gray-700 text-lg font-medium"
        >
          Quiz not found.
        </motion.div>
      </div>
    );
  }

  // Quiz start screen
  if (!quizStarted) {
    return (
      <div className="flex justify-center   min-h-full pt-12 bg-gray-50 px-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl"
        >
           
           <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <Button
                    asChild
                    variant="outline"
                    className="group bg-white border-blue-200 hover:bg-blue-100 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Link to="/quizzes">
                      <ArrowLeft className="mr-2 h-5 w-5   text-teal-600 hover:text-teal-700" />
                      <span className="   text-teal-600 hover:text-teal-700 font-medium">Back to Topics</span>
                    </Link>
                  </Button>
                </motion.div>
          <Card className="bg-white shadow-lg rounded-xl border border-gray-100">
            <CardHeader className="text-center">
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                <Badge className="bg-teal-100 text-teal-800 border-teal-300">
                  {quizMeta.topic}
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300">
                  {quizMeta.subtopic}
                </Badge>
                <Badge
                  variant={
                    quizMeta.difficulty === "Medium" ? "default" : "outline"
                  }
                  className={
                    quizMeta.difficulty === "Easy"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : quizMeta.difficulty === "Medium"
                      ? "bg-orange-100 text-orange-800 border-orange-300"
                      : "bg-purple-100 text-purple-800 border-purple-300"
                  }
                >
                  {quizMeta.difficulty}
                </Badge>
                <Badge className="bg-gray-100 text-gray-800 border-gray-300">
                  {quizMeta.ageGroup}
                </Badge>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                {quizMeta.title}
              </CardTitle>
              <CardDescription className="text-gray-600 text-base mt-2">
                {quizMeta.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-teal-600" />
                  <span className="text-sm font-medium">{quizMeta.timeLimit}</span>
                </div>
                <div className="flex justify-end gap-2">
                  <span className="text-sm font-medium">
                    {quizMeta.questions} Questions
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={startQuiz}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg py-3 text-lg font-semibold transition-transform hover:scale-105"
                disabled={questions.length === 0}
              >
                Start Quiz
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    return (
      <div className="flex justify-center items-center min-h-full pt-12 bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl"
        >
           <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <Button
                    asChild
                    variant="outline"
                    className="group bg-white border-blue-200 hover:bg-blue-100 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Link to="/quizzes">
                      <ArrowLeft className="mr-2 h-5 w-5   text-teal-600 hover:text-teal-700" />
                      <span className="   text-teal-600 hover:text-teal-700 font-medium">Back to Topics</span>
                    </Link>
                  </Button>
                </motion.div>
          <Card className="bg-white shadow-lg rounded-xl border border-gray-100">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Quiz Results
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                {quizMeta.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h2 className="text-5xl font-bold text-gray-900">
                  {calculateScore.score} / {calculateScore.total}
                </h2>
                <p className="text-gray-600 mt-2 text-lg">Your Score</p>
              </div>
              <Progress
                value={calculateScore.percentage}
                className="h-4 rounded-full bg-gray-200"
                indicatorClassName="bg-teal-600"
              />
              <p className="text-center text-base text-gray-600">
                You scored {calculateScore.percentage}% on this quiz
              </p>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold text-xl text-gray-900">
                  Quiz Review go to History 
                </h3>
                {questions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      {question.questionType === "MCQ" ||
                      question.questionType === "TRUE_FALSE" ? (
                        question.options.find((opt) => opt.isCorrect)?.id ===
                        Number(selectedAnswers[question.id]) ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
                        )
                      ) : (
                        (fillBlankAnswers[question.id]?.toLowerCase() ===
                          "oop" && (
                          <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5" />
                        )) || (
                          <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
                        )
                      )}
                      <div>
                        <p className="font-medium text-gray-900 text-lg">
                          Question {index + 1}: {question.questionText}
                        </p>
                        <div className="mt-2 text-base text-gray-700">
                          <p>
                            Your answer:{" "}
                            <span
                              className={
                                question.questionType === "MCQ" ||
                                question.questionType === "TRUE_FALSE"
                                  ? question.options.find(
                                      (opt) => opt.isCorrect
                                    )?.id ===
                                    Number(selectedAnswers[question.id])
                                    ? "text-green-600 font-semibold"
                                    : "text-red-600 font-semibold"
                                  : fillBlankAnswers[
                                      question.id
                                    ]?.toLowerCase() === "oop"
                                  ? "text-green-600 font-semibold"
                                  : "text-red-600 font-semibold"
                              }
                            >
                              {question.questionType === "MCQ" ||
                              question.questionType === "TRUE_FALSE"
                                ? question.options.find(
                                    (opt) =>
                                      opt.id ===
                                      Number(selectedAnswers[question.id])
                                  )?.optionText || "Not answered"
                                : fillBlankAnswers[question.id] ||
                                  "Not answered"}
                            </span>
                          </p>
                          <p className="mt-1">
                            Correct answer:{" "}
                            <span className="text-green-600 font-semibold">
                              {question.questionType === "MCQ" ||
                              question.questionType === "TRUE_FALSE"
                                ? question.options.find((opt) => opt.isCorrect)
                                    ?.optionText
                                : "Not provided"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                asChild
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg py-3 px-6 text-lg font-semibold transition-transform hover:scale-105"
              >
                <Link to="/history">History</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  // No questions available
  if (questions.length === 0 && quizStarted) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-gray-700 text-lg font-medium"
        >
          No questions available for this quiz.
        </motion.div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  // Question screen
  return (
    <div className="flex justify-center  min-h-full pt-12 bg-gray-50 px-4">
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: currentQuestion > 0 ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl"
      >
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSubmitDialogOpen(true)}
              className="border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition-transform hover:scale-105"
            >
              Exit Quiz
            </Button>
            <div className="text-sm font-semibold text-white bg-teal-600 px-4 py-2 rounded-lg">
              Time Left: {formatTime(timeLeft)}
            </div>
          </div>
          <div className="text-sm font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
        <Progress
          value={((currentQuestion + 1) / questions.length) * 100}
          className="h-4 rounded-full bg-gray-200 mb-6"
          indicatorClassName="bg-teal-600"
        />
        <Card className="bg-white shadow-lg rounded-xl border border-gray-100">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Question {currentQuestion + 1}:{" "}
              {currentQuestionData?.questionText || "No question"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentQuestionData?.questionType === "MCQ" ||
            currentQuestionData?.questionType === "TRUE_FALSE" ? (
              <RadioGroup
                value={
                  selectedAnswers[currentQuestionData.id]?.toString() || ""
                }
                onValueChange={(value) =>
                  handleAnswerSelect(currentQuestionData.id, Number(value))
                }
                className="space-y-3"
              >
                {currentQuestionData.options.map((option) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-center space-x-3 rounded-lg border p-4 transition-colors ${
                      selectedAnswers[currentQuestionData.id] === option.id
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <RadioGroupItem
                      value={option.id.toString()}
                      id={`option-${option.id}`}
                      className="text-teal-600"
                    />
                    <Label
                      htmlFor={`option-${option.id}`}
                      className="flex-1 cursor-pointer text-lg text-gray-900"
                    >
                      {option.optionText}
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            ) : currentQuestionData?.questionType === "FILL_BLANK" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  placeholder="Enter your answer"
                  value={fillBlankAnswers[currentQuestionData.id] || ""}
                  onChange={(e) =>
                    handleFillBlankChange(
                      currentQuestionData.id,
                      e.target.value
                    )
                  }
                  className="mt-4 border-teal-200 focus:border-teal-600 focus:ring-teal-600 rounded-lg text-lg"
                />
              </motion.div>
            ) : (
              <div className="text-gray-700 text-lg">Unknown question type</div>
            )}
          </CardContent>
          <CardFooter classNameulator: flex justify-between className="flex justify-between">  
            <Button
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={currentQuestion === 0}
              className="border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition-transform hover:scale-105"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={goToNextQuestion}
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-transform hover:scale-105"
            >
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
          <AlertDialogContent className="bg-white rounded-xl shadow-lg border border-gray-100">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-gray-900 text-2xl font-semibold">
                Submit Quiz?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600 text-base">
                Are you sure you want to submit your answers? You won’t be able
                to change them after submission.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSubmitQuiz}
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-transform hover:scale-105"
              >
                Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  );
};

export default QuizId;