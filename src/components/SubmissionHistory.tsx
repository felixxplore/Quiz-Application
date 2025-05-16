"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { fetchUserSubmissions } from "@/store/quizSlice";

// Define the TypeScript interface for submission history
interface Submission {
  quizId: number;
  quizTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  submittedAt: string;
}

// Sample data (replace with API fetch or Redux state in a real app)
// const submissionHistory: Submission[] = [
//   {
//     quizId: 2,
//     quizTitle: "java Oops",
//     totalQuestions: 2,
//     correctAnswers: 2,
//     score: 2,
//     percentage: 100.0,
//     submittedAt: "2025-05-05T16:47:44.807739",
//   },
//   {
//     quizId: 2,
//     quizTitle: "java Oops",
//     totalQuestions: 2,
//     correctAnswers: 2,
//     score: 2,
//     percentage: 100.0,
//     submittedAt: "2025-05-15T16:10:57.035397",
//   },
//   {
//     quizId: 2,
//     quizTitle: "java Oops",
//     totalQuestions: 2,
//     correctAnswers: 2,
//     score: 2,
//     percentage: 100.0,
//     submittedAt: "2025-05-15T16:18:08.449138",
//   },
//   {
//     quizId: 2,
//     quizTitle: "java Oops",
//     totalQuestions: 2,
//     correctAnswers: 0,
//     score: 0,
//     percentage: 0.0,
//     submittedAt: "2025-05-15T16:19:08.392168",
//   },
//   {
//     quizId: 2,
//     quizTitle: "java Oops",
//     totalQuestions: 2,
//     correctAnswers: 0,
//     score: 0,
//     percentage: 0.0,
//     submittedAt: "2025-05-15T16:30:39.366743",
//   },
//   {
//     quizId: 2,
//     quizTitle: "java Oops",
//     totalQuestions: 2,
//     correctAnswers: 0,
//     score: 0,
//     percentage: 0.0,
//     submittedAt: "2025-05-15T16:40:34.773867",
//   },
//   {
//     quizId: 2,
//     quizTitle: "java Oops",
//     totalQuestions: 2,
//     correctAnswers: 2,
//     score: 2,
//     percentage: 100.0,
//     submittedAt: "2025-05-15T17:00:25.567046",
//   },
//   {
//     quizId: 2,
//     quizTitle: "java Oops",
//     totalQuestions: 2,
//     correctAnswers: 2,
//     score: 2,
//     percentage: 100.0,
//     submittedAt: "2025-05-15T17:03:29.701004",
//   },
//   {
//     quizId: 2,
//     quizTitle: "java Oops",
//     totalQuestions: 2,
//     correctAnswers: 2,
//     score: 2,
//     percentage: 100.0,
//     submittedAt: "2025-05-16T01:12:25.615295",
//   },
// ];

// Utility function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const SubmissionHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { submissionsHistory, loading, error } = useSelector(
    (state: RootState) => state.quiz
  );

  useEffect(() => {
    dispatch(fetchUserSubmissions());
  }, [dispatch]);

  return (
    <div className="container py-8">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to="/quizzes"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Quizzes
        </Link>
      </div>

      {/* Submission History Card */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Submission History</CardTitle>
        </CardHeader>
        <CardContent>
          {submissionsHistory.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No submissions found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quiz Title</TableHead>
                    <TableHead>Total Questions</TableHead>
                    <TableHead>Correct Answers</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Submitted At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissionsHistory.map((submission, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {submission.quizTitle}
                      </TableCell>
                      <TableCell>{submission.totalQuestions}</TableCell>
                      <TableCell>{submission.correctAnswers}</TableCell>
                      <TableCell>{submission.score}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            submission.percentage === 100
                              ? "bg-green-500 text-white"
                              : submission.percentage > 50
                              ? "bg-yellow-500 text-white"
                              : "bg-red-500 text-white"
                          }
                        >
                          {submission.percentage.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(submission.submittedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionHistory;
