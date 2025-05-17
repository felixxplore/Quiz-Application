// src/components/QuizHistoryOverview.tsx
import { useEffect } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import SubmissionHistory from "./SubmissionHistory";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchUserSubmissions } from "@/store/quizSlice";

export const QuizHistoryOverview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { submissionsHistory, loading, error } = useSelector(
    (state: RootState) => state.quiz
  );

  useEffect(() => {
    dispatch(fetchUserSubmissions());
  }, [dispatch]);

  if (loading) return <div className="container py-8">Loading...</div>;
  if (error) return <div className="container py-8">Error: {error}</div>;
  if  (submissionsHistory.length === 0)
    return <div className="container py-8">No quiz history found.</div>;

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Your Quiz History
      </h1>
      <AnimatePresence>
        {submissionsHistory.map((submission, index) => (
          <motion.div
            key={submission.quizId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="mb-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                  <CardTitle className="text-xl text-gray-800">
                    {submission.quizTitle}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Submitted:{" "}
                      {new Date(submission.submittedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Score: {submission.score}/{submission.totalQuestions} (
                    {submission.percentage}%)
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant="outline"
                  className="group hover:bg-blue-50 transition-colors duration-200"
                >
                  <Link to={`/history/${submission.submissionId}`}>
                    View Details
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default QuizHistoryOverview;
