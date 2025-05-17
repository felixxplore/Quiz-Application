import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserSubmissions } from "@/store/quizSlice";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "@/store/store";
import SubmissionHistory from "./SubmissionHistory";

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

  console.log("Submission:", submissionsHistory );

  if (loading) return <div className="container py-8">Loading...</div>;
  if (error) return <div className="container py-8">Error: {error}</div>;
  if (!submission)
    return <div className="container py-8">Quiz history not found.</div>;

  return (
    <div className="container py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Button
          asChild
          variant="outline"
          className="hover:bg-blue-50 transition-colors duration-200"
        >
          <Link to="/history">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Link>
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">
              {submission.quizTitle}
            </CardTitle>
            <p className="text-sm text-gray-600">
              Submitted on: {new Date(submission.submittedAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              Score: {submission.score}/{submission.totalQuestions} (
              {submission.percentage}%)
            </p>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {submission.answers.map((answer, index) => (
                <motion.div
                  key={answer.questionId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border rounded-lg p-4 mb-4 bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    {answer.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        Question {index + 1}: {answer.questionText}
                      </p>
                      <div className="mt-3">
                        <p className="text-sm font-semibold text-gray-700">
                          Options:
                        </p>
                        <ul className="list-none space-y-2 mt-2">
                          {answer.options.map((option, optIndex) => (
                            <li
                              key={option.optionId}
                              className={`text-sm pl-2 rounded-md p-2 transition-colors duration-200 ${
                                option.optionId === answer.selectedOptionId
                                  ? option.isCorrect
                                    ? "bg-green-100 text-green-700 font-medium"
                                    : "bg-red-100 text-red-700 font-medium"
                                  : "text-gray-700 hover:bg-gray-200"
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
