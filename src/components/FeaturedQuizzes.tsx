 

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchQuizzes } from "@/store/quizSlice";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  Code,
  Database,
  Braces,
  Gem,
  CircuitBoard,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QuizLoader from "./QuizLoader";
import type { JSX } from "react";

interface Quiz {
  id: number;
  title: string;
  questionCount: number;
  difficultyLevel: string;
  timeLimit: number;
  topicName: string;
  subtopicName?: string;
  description: string;
  participants: number;
}

interface QuizConfig {
  icon: JSX.Element;
  color: string;
  iconColor: string;
  gradient: string;
}

const quizConfigs: Record<string, QuizConfig> = {
  Java: {
    icon: <Code className="h-6 w-6" />,
    color: "bg-blue-100",
    iconColor: "text-blue-600",
    gradient: "from-blue-50 to-blue-200",
  },
  Javascript: {
    icon: <Braces className="h-6 w-6" />,
    color: "bg-yellow-100",
    iconColor: "text-yellow-600",
    gradient: "from-yellow-50 to-yellow-200",
  },
  Python: {
    icon: <Code className="h-6 w-6" />,
    color: "bg-green-100",
    iconColor: "text-green-600",
    gradient: "from-green-50 to-green-200",
  },
  SQL: {
    icon: <Database className="h-6 w-6" />,
    color: "bg-purple-100",
    iconColor: "text-purple-600",
    gradient: "from-purple-50 to-purple-200",
  },
  Ruby: {
    icon: <Gem className="h-6 w-6" />,
    color: "bg-red-100",
    iconColor: "text-red-600",
    gradient: "from-red-50 to-red-200",
  },
  "C++": {
    icon: <CircuitBoard className="h-6 w-6" />,
    color: "bg-gray-100",
    iconColor: "text-gray-600",
    gradient: "from-gray-50 to-gray-200",
  },
};

export function FeaturedQuizzes() {
  const dispatch = useDispatch<AppDispatch>();
  const { quizzes, loading, error } = useSelector(
    (state: RootState) => state.quiz
  );
  const location = useLocation();
  const isQuizzesPage = location.pathname === "/quizzes";

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  if (loading) return <QuizLoader />;
  if (error)
    return <div className="container py-8 text-red-500">Error: {error}</div>;
  if (quizzes.length === 0)
    return <div className="container py-8">No quizzes found.</div>;

  const displayedQuizzes = isQuizzesPage ? quizzes : quizzes.slice(0, 6);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <AnimatePresence>
        {displayedQuizzes.map((quiz, index) => {
          const keyword = Object.keys(quizConfigs).find((key) =>
            quiz.title.toLowerCase().includes(key.toLowerCase())
          );
          const config = keyword
            ? quizConfigs[keyword]
            : {
                icon: <BookOpen className="h-6 w-6" />,
                color: "bg-gray-100",
                iconColor: "text-gray-600",
                gradient: "from-gray-50 to-gray-200",
              };

          return (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="max-w-sm w-full"
            >
              <Link to={`/quizzes/${quiz.id}`}>
                <Card
                  className={`h-full flex flex-col bg-gradient-to-br ${
                    config.gradient
                  } rounded-lg border border-gray-200 transition-all hover:scale-105 hover:shadow-lg hover:border-${
                    config.iconColor.split("-")[1]
                  }-300`}
                >
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <Badge
                        variant={
                          quiz.difficultyLevel === "HARD"
                            ? "default"
                            : "outline"
                        }
                        className={
                          quiz.difficultyLevel === "EASY"
                            ? "border-yellow-500 text-yellow-500 text-sm font-medium"
                            : quiz.difficultyLevel === "MEDIUM"
                            ? "border-orange-500 text-orange-500 text-sm font-medium"
                            : "bg-purple-500 text-white hover:bg-purple-600 text-sm font-medium"
                        }
                      >
                        {quiz.difficultyLevel}
                      </Badge>
                      <div className={`p-2 rounded-full ${config.color}`}>
                        <div className={config.iconColor}>{config.icon}</div>
                      </div>
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-800 text-left line-clamp-2">
                      {quiz.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm text-gray-700 flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className="border-blue-500 text-blue-500 text-sm font-medium"
                      >
                        {quiz.topicName}
                      </Badge>
                      {quiz.subtopicName && (
                        <Badge
                          variant="outline"
                          className="border-green-500 text-green-500 text-sm font-medium"
                        >
                          {quiz.subtopicName}
                        </Badge>
                      )}
                    </div>
                    <p className="line-clamp-3 font-medium">
                      {quiz.description}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between text-xs text-gray-600">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {quiz.timeLimit} Min
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      {quiz.participants}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
