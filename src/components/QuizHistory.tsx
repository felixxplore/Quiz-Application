// src/components/QuizHistory.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserSubmissions } from "@/store/quizSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowLeft, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "@/store/store";
import QuizLoader from "./QuizLoader";

const QuizHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { submissionsHistory, loading, error } = useSelector(
    (state: RootState) => state.quiz
  );
  const { submissionId } = useParams<{ submissionId: string }>();

  useEffect(() => {
    dispatch(fetchUserSubmissions());
  }, [dispatch]);

  const submission = submissionsHistory.find(
    (sub) => sub.submissionId === Number(submissionId)
  );

  if (loading) return <QuizLoader />;
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container py-8 max-w-4xl mx-auto flex justify-center"
      >
        <Card className="bg-white rounded-lg border border-gray-200 shadow-sm w-full max-w-md">
          <CardContent className="p-6 flex items-center gap-4">
            <BookOpen className="h-8 w-8 text-red-500" />
            <p className="text-lg font-medium text-gray-600">Error: {error}</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  if (!submission) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container py-8 max-w-4xl mx-auto flex justify-center"
      >
        <Card className="bg-white rounded-lg border border-gray-200 shadow-sm w-full max-w-md">
          <CardContent className="p-6 flex items-center gap-4">
            <BookOpen className="h-8 w-8 text-gray-500" />
            <p className="text-lg font-medium text-gray-600">
              Quiz history not found.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 w-full flex justify-start"
      >
        <Button
          asChild
          variant="outline"
          className="group bg-white border-blue-200 hover:bg-blue-100 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Link to="/history">
            <ArrowLeft className="mr-2 h-4 w-4 text-blue-500 group-hover:text-blue-600 group-hover:-translate-x-1 transition-all duration-200" />
            Back to History
          </Link>
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        {/* Score Summary Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-gray-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {submission.quizTitle}
            </CardTitle>
            <p className="text-sm text-gray-600">
              Submitted on:{" "}
              {new Date(submission.submittedAt).toLocaleString("en-US", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative">
                <svg className="w-16 h-16">
                  <circle
                    className="text-gray-200"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="30"
                    cx="32"
                    cy="32"
                  />
                  <circle
                    className="text-blue-500"
                    strokeWidth="4"
                    strokeDasharray={30 * 2 * Math.PI}
                    strokeDashoffset={
                      30 * 2 * Math.PI * (1 - submission.percentage / 100)
                    }
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="30"
                    cx="32"
                    cy="32"
                  />
                </svg>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-gray-800">
                  {submission.percentage}%
                </span>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  Score: {submission.score}/{submission.totalQuestions}
                </p>
                <p className="text-sm text-gray-600">
                  {submission.score} correct answer
                  {submission.score !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Questions List */}
        <Card className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <AnimatePresence>
              {submission.answers.map((answer, index) => (
                <motion.div
                  key={answer.questionId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`border rounded-lg p-4 mb-4 ${
                    answer.isCorrect
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {answer.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-left">
                        Question {index + 1}: {answer.questionText}
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-semibold text-gray-700 text-left">
                          Options:
                        </p>
                        <ul className="list-none space-y-2 mt-2 text-left">
                          {answer.options.map((option, optIndex) => (
                            <li
                              key={option.optionId}
                              className={`text-sm p-2 rounded-md transition-colors duration-200 ${
                                option.optionId === answer.selectedOptionId
                                  ? option.isCorrect
                                    ? "bg-green-100 text-green-700 font-medium"
                                    : "bg-red-100 text-red-700 font-medium"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {String.fromCharCode(97 + optIndex)}.{" "}
                              {option.optionText}
                              {option.isCorrect && (
                                <span className="ml-2 text-green-600 font-medium">
                                  (Correct)
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default QuizHistory;
