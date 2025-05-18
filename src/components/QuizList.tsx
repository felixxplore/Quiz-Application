import { useEffect, useState, type JSX } from "react";
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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Users,
  Code,
  Database,
  Braces,
  Gem,
  CircuitBoard,
  BookOpen,
  Search,
  Filter,
  X,
  Play,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QuizLoader from "./QuizLoader";

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

const QuizList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { quizzes, loading, error } = useSelector(
    (state: RootState) => state.quiz
  );
  const location = useLocation();
  const isQuizzesPage = location.pathname === "/quizzes";

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(
    []
  );
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  // Unique filter options
  const difficulties = ["EASY", "MEDIUM", "HARD"];
  const topics = Array.from(new Set(quizzes.map((quiz) => quiz.topicName)));
  const subtopics = Array.from(
    new Set(
      quizzes
        .map((quiz) => quiz.subtopicName)
        .filter((subtopic): subtopic is string => !!subtopic)
    )
  );

  // Filter quizzes
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      selectedDifficulties.length === 0 ||
      selectedDifficulties.includes(quiz.difficultyLevel);
    const matchesTopic =
      selectedTopics.length === 0 || selectedTopics.includes(quiz.topicName);
    const matchesSubtopic =
      selectedSubtopics.length === 0 ||
      (!quiz.subtopicName && selectedSubtopics.includes("None")) ||
      (quiz.subtopicName && selectedSubtopics.includes(quiz.subtopicName));
    return (
      matchesSearch && matchesDifficulty && matchesTopic && matchesSubtopic
    );
  });

  // Display logic: 6 on home page (unless filtered), all on quizzes page
  const displayedQuizzes =
    isQuizzesPage ||
    searchQuery ||
    selectedDifficulties.length > 0 ||
    selectedTopics.length > 0 ||
    selectedSubtopics.length > 0
      ? filteredQuizzes
      : filteredQuizzes.slice(0, 6);

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDifficulties([]);
    setSelectedTopics([]);
    setSelectedSubtopics([]);
  };

  if (loading) return <QuizLoader />;
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container py-8 max-w-md mx-auto flex justify-center"
      >
        <Card className="bg-white rounded-lg border border-gray-200 shadow-sm w-full">
          <CardContent className="p-6 flex items-center gap-4">
            <BookOpen className="h-8 w-8 text-red-500" />
            <p className="text-lg font-medium text-gray-600">Error: {error}</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  if (quizzes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container py-8 max-w-md mx-auto flex justify-center"
      >
        <Card className="bg-white rounded-lg border border-gray-200 shadow-sm w-full">
          <CardContent className="p-6 flex items-center gap-4">
            <BookOpen className="h-8 w-8 text-gray-500" />
            <p className="text-lg font-medium text-gray-600">
              No quizzes found.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 flex flex-col sm:flex-row gap-4 items-center"
      >
        {/* Search Bar */}
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
          <Input
            type="text"
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-white border-blue-200 hover:bg-blue-100"
              >
                <Filter className="mr-2 h-4 w-4 text-blue-500" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-white border-gray-200">
              {/* Difficulty Filter */}
              <DropdownMenuLabel>Difficulty</DropdownMenuLabel>
              {difficulties.map((difficulty) => (
                <DropdownMenuCheckboxItem
                  key={difficulty}
                  checked={selectedDifficulties.includes(difficulty)}
                  onCheckedChange={(checked) => {
                    setSelectedDifficulties(
                      checked
                        ? [...selectedDifficulties, difficulty]
                        : selectedDifficulties.filter((d) => d !== difficulty)
                    );
                  }}
                >
                  {difficulty}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />

              {/* Topic Filter */}
              <DropdownMenuLabel>Topic</DropdownMenuLabel>
              {topics.map((topic) => (
                <DropdownMenuCheckboxItem
                  key={topic}
                  checked={selectedTopics.includes(topic)}
                  onCheckedChange={(checked) => {
                    setSelectedTopics(
                      checked
                        ? [...selectedTopics, topic]
                        : selectedTopics.filter((t) => t !== topic)
                    );
                  }}
                >
                  {topic}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />

              {/* Subtopic Filter */}
              <DropdownMenuLabel>Subtopic</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                key="None"
                checked={selectedSubtopics.includes("None")}
                onCheckedChange={(checked) => {
                  setSelectedSubtopics(
                    checked
                      ? [...selectedSubtopics, "None"]
                      : selectedSubtopics.filter((s) => s !== "None")
                  );
                }}
              >
                None
              </DropdownMenuCheckboxItem>
              {subtopics.map((subtopic) => (
                <DropdownMenuCheckboxItem
                  key={subtopic}
                  checked={selectedSubtopics.includes(subtopic)}
                  onCheckedChange={(checked) => {
                    setSelectedSubtopics(
                      checked
                        ? [...selectedSubtopics, subtopic]
                        : selectedSubtopics.filter((s) => s !== subtopic)
                    );
                  }}
                >
                  {subtopic}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters Button */}
          {(selectedDifficulties.length > 0 ||
            selectedTopics.length > 0 ||
            selectedSubtopics.length > 0) && (
            <Button
              variant="outline"
              className="bg-white border-blue-200 hover:bg-blue-100"
              onClick={clearFilters}
            >
              <X className="mr-2 h-4 w-4 text-blue-500" />
              Clear Filters
            </Button>
          )}
        </div>
      </motion.div>

      {/* Quiz Grid */}
      {displayedQuizzes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-md mx-auto flex justify-center"
        >
          <Card className="bg-white rounded-lg border border-gray-200 shadow-sm w-full">
            <CardContent className="p-6 flex items-center gap-4">
              <BookOpen className="h-8 w-8 text-gray-500" />
              <p className="text-lg font-medium text-gray-600">
                No quizzes match your search or filters.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            <div className={config.iconColor}>
                              {config.icon}
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-lg font-bold text-gray-800 text-left line-clamp-2">
                          {quiz.title}
                        </CardTitle>
                        <p className="text-sm text-left text-gray-600 mt-1 line-clamp-3">
                          {quiz.description}
                        </p>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 text-sm text-gray-700">
                        <div className="flex flex-wrap gap-2">
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
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                        <div className="flex justify-between text-xs text-gray-600 w-full">
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4" />
                            {quiz.timeLimit} Min
                          </div>
                          <div className="flex items-center">
                            <Users className="mr-1 h-4 w-4" />
                            {quiz.participants}
                          </div>
                        </div>
                        <Button
                          asChild
                          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-transform hover:scale-105"
                        >
                          <Link to={`/quizzes/${quiz.id}`}>
                            <Play className="mr-2 h-4 w-4" />
                            Start
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default QuizList;
